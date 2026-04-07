import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "firebase/firestore";

// CONFIGURAÇÃO DO SEU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCbf0uWYYqZ0UnvxPUkrbN0-T1KrIw03og",
  authDomain: "emanuel-b526c.firebaseapp.com",
  projectId: "emanuel-b526c",
  storageBucket: "emanuel-b526c.firebasestorage.app",
  messagingSenderId: "340230465087",
  appId: "1:340230465087:web:72aea1349869155f02ba8a",
};

// Inicialização segura para evitar o erro do print
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function NarutoMessengerPro() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50 });
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (s.exists()) {
            setUserData(s.data());
        } else {
          const d = { chakra: 50, nome: curr.displayName, foto: curr.photoURL, online: true };
          await setDoc(ref, d);
          setUserData(d);
        }
      }
    });
    const unsubUsers = onSnapshot(collection(db, "ninjas"), (s) => setContatos(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsub(); unsubUsers(); };
  }, []);

  useEffect(() => {
    if (!chatAtivo) return;
    const q = query(collection(db, "chats", chatAtivo.id, "msgs"), orderBy("criadoEm", "desc"), limit(30));
    const unsubChat = onSnapshot(q, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
    return () => unsubChat();
  }, [chatAtivo]);

  const handleAudio = async () => {
    if (!gravando) {
      try {
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
      } catch (err) { alert("Ative o microfone!"); }
    } else {
      mediaRecorder.current.stop();
      setGravando(false);
      clearInterval(timerRef.current);
    }
  };

  const enviarMensagem = async (img = null, aud = null) => {
    if (!user || !chatAtivo) return;
    await addDoc(collection(db, "chats", chatAtivo.id, "msgs"), {
      texto: novaMsg, imagem: img, audio: aud,
      uid: user.uid, nome: user.displayName, foto: user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const logout = () => signOut(auth).then(() => window.location.reload());

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {zoom && (
        <div style={modalStyle} onClick={() => setZoom(null)}>
          <img src={zoom} style={{ maxWidth: '90%', maxHeight: '80%', borderRadius: '15px', border: '2px solid orange' }} />
          <p style={{marginTop:'10px'}}>CLIQUE PARA VOLTAR</p>
        </div>
      )}

      {/* BARRA LATERAL */}
      <aside style={{ width: '70px', backgroundColor: '#111', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' }}>
        <div style={{ fontSize: '25px', marginBottom: '20px' }}>🍥</div>
        <div style={{ flex: 1, overflowY: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {contatos.map(c => (
            <img key={c.id} src={c.avatarIA || c.foto} onClick={() => setChatAtivo(c)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: chatAtivo?.id === c.id ? '2px solid orange' : '1px solid #444', cursor: 'pointer' }} />
          ))}
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🚪</button>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!user ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => signInWithPopup(auth, provider)} style={{ padding: '15px 30px', background: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>CONECTAR GOOGLE</button>
          </div>
        ) : chatAtivo ? (
          <>
            <header style={{ padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><b>Chat:</b> {chatAtivo.nome}</span>
              <button onClick={() => setAbaSetasAtiva(!abaSetasAtiva)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>{abaSetasAtiva ? '🔼' : '🔽'}</button>
            </header>

            <div style={{ height: abaSetasAtiva ? '60px' : '0', overflow: 'hidden', transition: '0.3s', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => alert("Criando Grupo...")} style={{ background: 'none', color: 'orange', border: '1px solid orange', borderRadius: '5px', padding: '2px 10px', fontSize: '12px' }}>+ Criar Grupo</button>
                {['🍥', '🦊', '⚡'].map(e => <span key={e} onClick={() => setNovaMsg(p => p + e)} style={{ cursor: 'pointer', fontSize: '20px' }}>{e}</span>)}
            </div>

            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mensagens.map(m => (
                <div key={m.id} style={{ alignSelf: m.uid === user.uid ? 'flex-end' : 'flex-start', backgroundColor: m.uid === user.uid ? 'orange' : '#222', color: m.uid === user.uid ? '#000' : '#fff', padding: '10px', borderRadius: '10px', maxWidth: '75%' }}>
                   {m.audio ? <audio src={m.audio} controls style={{ width: '180px' }} /> : m.imagem ? <img src={m.imagem} onClick={() => setZoom(m.imagem)} style={{ width: '150px', borderRadius: '10px' }} /> : m.texto}
                </div>
              ))}
            </div>

            <footer style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#111' }}>
              <button onClick={() => fileInput.current.click()} style={{ background: 'none', border: 'none', fontSize: '20px' }}>📷</button>
              <input type="file" ref={fileInput} hidden onChange={(e) => {
                 const r = new FileReader(); r.onload = (ev) => enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]);
              }} />
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mensagem..." style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid orange', backgroundColor: '#000', color: '#fff' }} />
              <div onClick={handleAudio} style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: gravando ? 'red' : 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '20px' }}>
                {gravando ? <span style={{fontSize:'12px'}}>{segundos}s</span> : '🦊'}
              </div>
              <button onClick={() => enviarMensagem()} style={{ background: 'orange', border: 'none', width: '45px', height: '45px', borderRadius: '50%', fontWeight: 'bold' }}>⚡</button>
            </footer>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#444' }}>Selecione um Ninja na barra lateral 🍥</div>
        )}
      </main>
    </div>
  );
}

const modalStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
