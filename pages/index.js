import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, deleteDoc } from "firebase/firestore";

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

export default function NarutoSuperApp() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, tema: 'folha', lang: 'pt', fSize: '14px' });
  const [ninjas, setNinjas] = useState([]);
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [aba, setAba] = useState('chat');
  const [zoom, setZoom] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);

  const scrollRef = useRef(null);
  const mediaRecorder = useRef(null);

  // 1. Conexão e Dados do Usuário
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (s.exists()) setUserData(s.data());
        else {
          const d = { nome: curr.displayName, foto: curr.photoURL, chakra: 50, tema: 'folha', lang: 'pt', fSize: '14px' };
          await setDoc(ref, d);
          setUserData(d);
        }
      }
    });
    onSnapshot(collection(db, "ninjas"), (s) => setNinjas(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  // 2. Chat em Tempo Real
  useEffect(() => {
    if (!chatAtivo) return;
    const q = query(collection(db, "chats", chatAtivo.id, "msgs"), orderBy("criadoEm", "desc"), limit(40));
    return onSnapshot(q, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
  }, [chatAtivo]);

  // 3. Funções de IA (Vídeo/GIF)
  const enviarMensagem = async (file = null, aud = null) => {
    if (!user || (!novaMsg && !file && !aud)) return;
    let finalMsg = novaMsg;
    let iaMidia = file;

    if (novaMsg.startsWith('/gif') || novaMsg.startsWith('/video')) {
      iaMidia = `https://image.pollinations.ai/prompt/${encodeURIComponent(novaMsg + " high quality anime style")}?seed=${Math.random()}&nologo=true`;
      finalMsg = "✨ Jutsu de Invocação IA!";
    }

    await addDoc(collection(db, "chats", chatAtivo.id, "msgs"), {
      texto: finalMsg, midia: iaMidia, audio: aud,
      uid: user.uid, nome: user.displayName, foto: user.photoURL, criadoEm: serverTimestamp()
    });
    setNovaMsg('');
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 4. Voz e Tradução Interna
  const falarTexto = (t) => {
    const v = new SpeechSynthesisUtterance(t);
    v.lang = userData.lang === 'pt' ? 'pt-BR' : 'en-US';
    window.speechSynthesis.speak(v);
  };

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
      };
      mediaRecorder.current.start();
      setGravando(true);
      const t = setInterval(() => setSegundos(s => s + 1), 1000);
      mediaRecorder.current.timer = t;
    } else {
      mediaRecorder.current.stop();
      clearInterval(mediaRecorder.current.timer);
      setGravando(false);
      setSegundos(0);
    }
  };

  const corP = userData.tema === 'akatsuki' ? '#ff0000' : '#ff9800';

  return (
    <div style={{ display: 'flex', height: '100dvh', backgroundColor: '#000', color: '#fff', fontSize: userData.fSize }}>
      
      {/* ZOOM HD UNIVERSAL */}
      {zoom && (
        <div style={zoomStyle} onClick={() => setZoom(null)}>
          <img src={zoom} style={{ maxWidth: '95%', border: `3px solid ${corP}`, borderRadius: '15px' }} />
          <button style={btnAction(corP)}>VOLTAR 🔙</button>
        </div>
      )}

      {/* BARRA LATERAL */}
      <aside style={{ width: '80px', background: '#111', borderRight: `2px solid ${corP}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🍥</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ninjas.map(n => (
            <div key={n.id} style={{ position: 'relative' }}>
              <img src={n.foto} onClick={() => setChatAtivo(n)} style={avatarStyle(chatAtivo?.id === n.id, corP)} />
              <div style={dotOnline}></div>
            </div>
          ))}
        </div>
        <button onClick={() => setAba('config')} style={btnIcon}>⚙️</button>
        <button onClick={() => signOut(auth).then(() => window.location.reload())} style={btnIcon}>🚪</button>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {aba === 'config' ? (
          <div style={cardConfig}>
            <h2>Configurações Shinobi</h2>
            <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { tema: userData.tema === 'folha' ? 'akatsuki' : 'folha' })} style={btnRow}>Trocar Tema</button>
            <button onClick={() => falarTexto("Bem vindo a Vila da Folha Emanuel")} style={btnRow}>Leitura por Voz 🔊</button>
            <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { lang: userData.lang === 'pt' ? 'en' : 'pt' })} style={btnRow}>Tradução: {userData.lang.toUpperCase()}</button>
            <button onClick={() => { if(confirm("Apagar conta?")) deleteUser(user); }} style={{ ...btnRow, color: 'red' }}>Excluir Conta</button>
            <button onClick={() => setAba('chat')} style={btnAction(corP)}>Voltar ao Chat</button>
          </div>
        ) : chatAtivo ? (
          <>
            <header style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={chatAtivo.foto} onClick={() => setZoom(chatAtivo.foto)} style={{ width: '40px', borderRadius: '50%', cursor: 'pointer' }} />
                <span>{chatAtivo.nome}</span>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <span onClick={() => alert("Chamando áudio...")} style={{ cursor: 'pointer' }}>📞</span>
                <span onClick={() => alert("Chamando vídeo...")} style={{ cursor: 'pointer' }}>📹</span>
              </div>
            </header>

            <div style={msgBox}>
              {mensagens.map(m => (
                <div key={m.id} style={{ alignSelf: m.uid === user.uid ? 'flex-end' : 'flex-start', background: m.uid === user.uid ? corP : '#222', color: m.uid === user.uid ? '#000' : '#fff', padding: '10px', borderRadius: '12px', maxWidth: '80%', marginBottom: '10px' }}>
                  {m.midia ? <img src={m.midia} onClick={() => setZoom(m.midia)} style={imgChat} /> : 
                   m.audio ? <audio src={m.audio} controls style={{ width: '200px' }} /> : 
                   <span>{m.texto}</span>}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer style={footerStyle}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => document.getElementById('cam').click()} style={btnRound}>📷</button>
                <input type="file" id="cam" hidden capture="environment" onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
                <button onClick={() => document.getElementById('file').click()} style={btnRound}>📎</button>
                <input type="file" id="file" hidden onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
              </div>
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mandar pergaminho ou /gif..." style={inputStyle} />
              <div onClick={handleAudio} style={micStyle(gravando)}>
                {gravando ? segundos + 's' : '🦊'}
              </div>
              <button onClick={() => enviarMensagem()} style={{ background: 'none', border: 'none', color: corP, fontSize: '24px' }}>⚡</button>
            </footer>
          </>
        ) : (
          <div style={center}>Selecione um Ninja para começar 🍥</div>
        )}
      </main>
    </div>
  );
}

// ESTILOS
const zoomStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const headerStyle = { padding: '15px', background: '#111', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const avatarStyle = (act, cor) => ({ width: '50px', height: '50px', borderRadius: '50%', border: act ? `3px solid ${cor}` : '1px solid #444', marginBottom: '15px', cursor: 'pointer', objectFit: 'cover' });
const dotOnline = { position: 'absolute', bottom: 15, right: 15, width: '12px', height: '12px', background: '#00ff00', borderRadius: '50%', border: '2px solid #111' };
const msgBox = { flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column' };
const footerStyle = { padding: '10px', background: '#111', display: 'flex', alignItems: 'center', gap: '10px' };
const inputStyle = { flex: 1, background: '#000', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '25px' };
const micStyle = (g) => ({ width: '45px', height: '45px', borderRadius: '50%', background: g ? 'red' : 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' });
const cardConfig = { flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', justifyContent: 'center' };
const btnRow = { width: '100%', maxWidth: '300px', padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '10px' };
const imgChat = { width: '100%', maxWidth: '250px', borderRadius: '10px', border: '1px solid #444', objectFit: 'cover' };
const btnRound = { background: '#333', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' };
const btnIcon = { background: 'none', border: 'none', color: '#fff', fontSize: '20px', marginBottom: '15px', cursor: 'pointer' };
const btnAction = (c) => ({ background: c, border: 'none', color: '#000', padding: '10px 30px', borderRadius: '10px', fontWeight: 'bold', marginTop: '20px' });
const center = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#444' };
