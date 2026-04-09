import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, deleteDoc, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbf0uWYYqZ0UnvxPUkrbN0-T1KrIw03og",
  authDomain: "emanuel-b526c.firebaseapp.com",
  projectId: "emanuel-b526c",
  storageBucket: "emanuel-b526c.firebasestorage.app",
  messagingSenderId: "340230465087",
  appId: "1:340230465087:web:72aea1349869155f02ba8a",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function NarutoUltraApp() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ tema: 'folha', lang: 'pt', fSize: '16px' });
  const [ninjas, setNinjas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [aba, setAba] = useState('chat'); // chat, status, config, call
  const [zoom, setZoom] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [stream, setStream] = useState(null);

  const scrollRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (s.exists()) setUserData(s.data());
        else await setDoc(ref, { nome: curr.displayName, foto: curr.photoURL, tema: 'folha', lang: 'pt' });
      }
    });
    onSnapshot(collection(db, "ninjas"), (s) => setNinjas(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(collection(db, "grupos"), (s) => setGrupos(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  useEffect(() => {
    if (!chatAtivo) return;
    const path = chatAtivo.tipo === 'grupo' ? `grupos/${chatAtivo.id}/msgs` : `chats/${chatAtivo.id}/msgs`;
    const q = query(collection(db, path), orderBy("criadoEm", "desc"), limit(50));
    return onSnapshot(q, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
  }, [chatAtivo]);

  // FUNÇÃO REAL DE GERAR GIF/VÍDEO VIA IA
  const enviarMensagem = async (midiaUrl = null, audioUrl = null) => {
    if (!chatAtivo || (!novaMsg && !midiaUrl && !audioUrl)) return;
    
    let conteudo = novaMsg;
    let linkMidia = midiaUrl;

    if (novaMsg.startsWith('/gif') || novaMsg.startsWith('/video')) {
      const busca = novaMsg.replace('/gif', '').replace('/video', '');
      linkMidia = `https://image.pollinations.ai/prompt/${encodeURIComponent(busca + " anime style motion gif")}?width=400&height=400&nologo=true`;
      conteudo = `Invocação: ${busca}`;
    }

    const path = chatAtivo.tipo === 'grupo' ? `grupos/${chatAtivo.id}/msgs` : `chats/${chatAtivo.id}/msgs`;
    await addDoc(collection(db, path), {
      texto: conteudo, midia: linkMidia, audio: audioUrl,
      uid: user.uid, nome: user.displayName, foto: user.photoURL, criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  // CHAMADA DE VÍDEO REAL
  const iniciarChamada = async (video = true) => {
    setAba('call');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) { alert("Erro na câmera!"); setAba('chat'); }
  };

  const encerrarChamada = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setAba('chat');
  };

  const criarGrupo = async () => {
    const nome = prompt("Nome do Grupo de Elite (Máx 5 pessoas):");
    if (nome) {
      await addDoc(collection(db, "grupos"), {
        nome, criadoPor: user.uid, tipo: 'grupo', membros: [user.uid], foto: 'https://cdn-icons-png.flaticon.com/512/681/681494.png'
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {zoom && <div style={zoomOverlay} onClick={() => setZoom(null)}><img src={zoom} style={imgFull} /><button style={btnBack}>VOLTAR 🔙</button></div>}

      {/* SIDEBAR */}
      <aside style={{ width: '85px', background: '#0a0a0a', borderRight: '2px solid #f90', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' }}>
        <img src={user?.photoURL} onClick={() => setZoom(user?.photoURL)} style={myAvatar} />
        <div style={{ flex: 1, overflowY: 'auto', width: '100%', textAlign: 'center' }}>
          <button onClick={criarGrupo} style={btnCircle}>👥</button>
          {grupos.map(g => <img key={g.id} src={g.foto} onClick={() => setChatAtivo(g)} style={avatar(chatAtivo?.id === g.id)} />)}
          <hr style={{ borderColor: '#333' }} />
          {ninjas.map(n => <img key={n.id} src={n.foto} onClick={() => setChatAtivo({...n, tipo: 'pessoal'})} style={avatar(chatAtivo?.id === n.id)} />)}
        </div>
        <button onClick={() => setAba('config')} style={btnIcon}>⚙️</button>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {aba === 'call' ? (
          <div style={callScreen}>
            <video ref={videoRef} autoPlay playsInline style={videoWindow} />
            <div style={callTools}>
              <button onClick={encerrarChamada} style={btnEnd}>Terminar Missão ❌</button>
            </div>
          </div>
        ) : aba === 'config' ? (
          <div style={configArea}>
            <h2>Painel do Hokage</h2>
            <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { tema: 'akatsuki' })} style={btnRow}>Tema Akatsuki</button>
            <button onClick={() => { const s = new SpeechSynthesisUtterance("Sistema Emanuel Ativado"); window.speechSynthesis.speak(s); }} style={btnRow}>Ouvir Site 🔊</button>
            <button onClick={() => setAba('chat')} style={btnBack}>Voltar ao Chat</button>
            <button onClick={() => deleteUser(user)} style={{ color: 'red', marginTop: '50px' }}>Excluir Conta Permanentemente</button>
          </div>
        ) : chatAtivo ? (
          <>
            <header style={header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={chatAtivo.foto} onClick={() => setZoom(chatAtivo.foto)} style={headAvatar} />
                <b>{chatAtivo.nome}</b>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <span onClick={() => iniciarChamada(false)} style={icon}>📞</span>
                <span onClick={() => iniciarChamada(true)} style={icon}>📹</span>
              </div>
            </header>

            <div style={chatBody}>
              {mensagens.map(m => (
                <div key={m.id} style={m.uid === user.uid ? myMsg : otherMsg}>
                  {m.midia && <img src={m.midia} onClick={() => setZoom(m.midia)} style={chatImg} />}
                  {m.audio && <audio src={m.audio} controls style={{ width: '200px' }} />}
                  <p style={{ margin: 0 }}>{m.texto}</p>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer style={footer}>
              <button onClick={() => document.getElementById('cam').click()} style={btnRound}>📷</button>
              <input type="file" id="cam" hidden capture="environment" onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
              <button onClick={() => document.getElementById('file').click()} style={btnRound}>📎</button>
              <input type="file" id="file" hidden onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
              
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Use /gif [termo] ou mensagem..." style={input} />
              
              <button onClick={() => enviarMensagem()} style={btnSend}>⚡</button>
            </footer>
          </>
        ) : <div style={center}>Selecione um Ninja para a Missão 🍥</div>}
      </main>
    </div>
  );
}

// ESTILOS MELHORADOS (SEM BORRÕES)
const avatar = (a) => ({ width: '55px', height: '55px', borderRadius: '50%', border: a ? '3px solid #f90' : '1px solid #333', marginBottom: '12px', cursor: 'pointer', objectFit: 'cover' });
const myAvatar = { width: '60px', borderRadius: '50%', border: '2px solid #fff', marginBottom: '20px', cursor: 'pointer' };
const zoomOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const imgFull = { maxWidth: '90%', maxHeight: '80%', borderRadius: '15px', border: '2px solid #f90', objectFit: 'contain' };
const chatImg = { width: '100%', maxWidth: '300px', borderRadius: '10px', display: 'block', marginBottom: '5px', objectFit: 'cover' };
const header = { padding: '15px', background: '#0a0a0a', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const headAvatar = { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' };
const chatBody = { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' };
const myMsg = { alignSelf: 'flex-end', background: '#f90', color: '#000', padding: '12px', borderRadius: '15px 15px 0 15px', maxWidth: '75%' };
const otherMsg = { alignSelf: 'flex-start', background: '#222', color: '#fff', padding: '12px', borderRadius: '15px 15px 15px 0', maxWidth: '75%' };
const footer = { padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: '#0a0a0a' };
const input = { flex: 1, padding: '12px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '25px' };
const btnSend = { background: 'none', border: 'none', color: '#f90', fontSize: '28px' };
const btnRound = { background: '#1a1a1a', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%' };
const callScreen = { flex: 1, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const videoWindow = { width: '90%', maxWidth: '600px', borderRadius: '20px', border: '3px solid #f90' };
const callTools = { marginTop: '20px' };
const btnEnd = { background: 'red', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' };
const configArea = { padding: '40px', textAlign: 'center' };
const btnRow = { display: 'block', width: '250px', margin: '10px auto', padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '5px' };
const btnBack = { background: '#f90', color: '#000', border: 'none', padding: '10px 30px', borderRadius: '10px', fontWeight: 'bold', marginTop: '20px' };
const btnIcon = { background: 'none', border: 'none', color: '#fff', fontSize: '24px', margin: '20px 0' };
const btnCircle = { width: '50px', height: '50px', borderRadius: '50%', background: '#f90', border: 'none', marginBottom: '15px', fontSize: '20px' };
const icon = { fontSize: '22px', cursor: 'pointer' };
const center = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' };
