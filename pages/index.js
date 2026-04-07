import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbf0uWYYqZ0UnvxPUkrbN0-T1KrIw03og",
  authDomain: "emanuel-b526c.firebaseapp.com",
  projectId: "emanuel-b526c",
  storageBucket: "emanuel-b526c.firebasestorage.app",
  messagingSenderId: "340230465087",
  appId: "1:340230465087:web:72aea1349869155f02ba8a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function NarutoMessengerPro() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, tema: 'folha' });
  const [contatos, setContatos] = useState([]);
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [abaSetasAtiva, setAbaSetasAtiva] = useState(false);
  const [zoom, setZoom] = useState(null);

  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);
  const fileInput = useRef(null);

  // Monitorar Usuário e Contatos
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (s.exists()) setUserData(s.data());
        else {
          const d = { chakra: 50, nome: curr.displayName, foto: curr.photoURL, online: true };
          await setDoc(ref, d);
          setUserData(d);
        }
      }
    });
    onSnapshot(collection(db, "ninjas"), (s) => setContatos(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  // Monitorar Chat Selecionado
  useEffect(() => {
    if (!chatAtivo) return;
    const q = query(collection(db, "mensagens", chatAtivo.id, "chat"), orderBy("criadoEm", "desc"), limit(50));
    return onSnapshot(q, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
  }, [chatAtivo]);

  // Gravação de Áudio
  const handleAudio = async () => {
    if (!gravando) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const r = new FileReader();
        r.onload = (ev) => enviarMensagem(null, ev.target.result);
        r.readAsDataURL(blob);
        setSegundos(0);
      };
      mediaRecorder.current.start();
      setGravando(true);
      timerRef.current = setInterval(() => setSegundos(p => p + 1), 1000);
    } else {
      mediaRecorder.current.stop();
      setGravando(false);
      clearInterval(timerRef.current);
    }
  };

  const enviarMensagem = async (img = null, aud = null) => {
    if (!user || !chatAtivo) return;
    await addDoc(collection(db, "mensagens", chatAtivo.id, "chat"), {
      texto: novaMsg, imagem: img, audio: aud,
      uid: user.uid, nome: user.displayName, foto: user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  return (
    <div style={containerStyle}>
      {/* ZOOM MODAL */}
      {zoom && (
        <div style={modalStyle} onClick={() => setZoom(null)}>
          <img src={zoom} style={zoomImg} />
          <button style={btnSeta}>⬇️ VOLTAR</button>
        </div>
      )}

      {/* ABA VERTICAL: BATE-PAPO NARUTO */}
      <aside style={sidebarStyle}>
        <div style={logoNaruto}>🍥</div>
        <div style={listaContatos}>
          {contatos.map(c => (
            <div key={c.id} onClick={() => setChatAtivo(c)} style={cardContato(chatAtivo?.id === c.id)}>
              <img src={c.avatarIA || c.foto} style={miniAvatar} />
              <span style={nomeLink}>{c.nome.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <button onClick={() => signOut(auth)} style={btnSair}>🚪</button>
      </aside>

      {/* ÁREA DE CONVERSA */}
      <main style={mainChat}>
        {chatAtivo ? (
          <>
            <header style={headerChat}>
              <span style={{fontWeight:'bold'}}>Com: {chatAtivo.nome}</span>
              <button onClick={() => setAbaSetasAtiva(!abaSetasAtiva)} style={btnSeta}>
                {abaSetasAtiva ? '🔼' : '🔽'}
              </button>
            </header>

            {/* ABA DE SETA (OPÇÕES DE GRUPO/EMOJI) */}
            <div style={abaSetaStyle(abaSetasAtiva)}>
                <button style={btnGroup}>➕ Criar Grupo Ninja</button>
                <div style={emojisArea}>
                  {['🍥','🦊','⚡','🔥','🐸'].map(e => <span key={e} onClick={() => setNovaMsg(p => p + e)} style={{cursor:'pointer'}}>{e}</span>)}
                </div>
            </div>

            <div style={mensagensArea}>
              {mensagens.map(m => (
                <div key={m.id} style={m.uid === user.uid ? msgMe : msgThem}>
                  {m.audio ? <audio src={m.audio} controls style={{width:'180px'}} /> : m.imagem ? <img src={m.imagem} onClick={() => setZoom(m.imagem)} style={imgChat} /> : m.texto}
                </div>
              ))}
            </div>

            <footer style={footerChat}>
              <button onClick={() => fileInput.current.click()} style={btnIcon}>📷</button>
              <input type="file" ref={fileInput} hidden accept="image/*" onChange={(e) => {
                 const r = new FileReader(); r.onload = (ev) => enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]);
              }} />
              
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mandar pergaminho..." style={inputMsg} />
              
              {/* BOTÃO NARUTO MICROFONE */}
              <div onClick={handleAudio} style={btnNarutoMic(gravando)}>
                {gravando ? <span style={tempoRec}>{segundos}s</span> : '🦊'}
              </div>
              <button onClick={() => enviarMensagem()} style={btnSend}>⚡</button>
            </footer>
          </>
        ) : (
          <div style={centerMsg}>Selecione um Ninja para conversar 🍥</div>
        )}
      </main>
    </div>
  );
}

// ESTILOS
const containerStyle = { display: 'flex', height: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' };
const sidebarStyle = { width: '80px', backgroundColor: '#111', borderRight: '2px solid #ff9800', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' };
const logoNaruto = { fontSize: '30px', marginBottom: '20px', color: '#ff9800' };
const listaContatos = { flex: 1, overflowY: 'auto', width: '100%' };
const miniAvatar = { width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #ff9800', objectFit: 'cover' };
const cardContato = (active) => ({ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', backgroundColor: active ? '#222' : 'transparent', marginBottom: '5px' });
const nomeLink = { fontSize: '10px', marginTop: '5px', textAlign: 'center' };
const btnSair = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' };

const mainChat = { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#050505' };
const headerChat = { padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const btnSeta = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', transition: '0.3s' };
const abaSetaStyle = (open) => ({ height: open ? '100px' : '0', overflow: 'hidden', transition: '0.5s ease', backgroundColor: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: open ? '1px solid #ff9800' : 'none' });

const mensagensArea = { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const msgMe = { alignSelf: 'flex-end', backgroundColor: '#ff9800', color: '#000', padding: '10px', borderRadius: '15px 15px 0 15px', maxWidth: '70%', fontWeight: 'bold' };
const msgThem = { alignSelf: 'flex-start', backgroundColor: '#222', color: '#fff', padding: '10px', borderRadius: '15px 15px 15px 0', maxWidth: '70%' };
const imgChat = { width: '150px', borderRadius: '10px', cursor: 'pointer' };

const footerChat = { padding: '15px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#111' };
const inputMsg = { flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #ff9800', backgroundColor: '#000', color: '#fff', outline: 'none' };
const btnIcon = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' };
const btnSend = { background: '#ff9800', border: 'none', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' };

const btnNarutoMic = (gravando) => ({
  width: '50px', height: '50px', borderRadius: '50%', backgroundColor: gravando ? 'red' : '#ffc107',
  display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '25px',
  border: '3px solid #fff', boxShadow: gravando ? '0 0 15px red' : 'none'
});
const tempoRec = { fontSize: '12px', color: '#fff', fontWeight: 'bold' };

const modalStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const zoomImg = { maxWidth: '90%', maxHeight: '80%', borderRadius: '15px', border: '2px solid #ff9800' };
const centerMsg = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#444' };
const btnGroup = { marginTop: '10px', padding: '5px 15px', borderRadius: '15px', border: '1px solid #ff9800', backgroundColor: '#000', color: '#ff9800', cursor: 'pointer', fontWeight: 'bold' };
const emojisArea = { marginTop: '10px', fontSize: '20px', display: 'flex', gap: '15px' };
