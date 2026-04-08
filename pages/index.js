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

export default function NarutoMessengerUltimate() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, fonteAnime: false, emojisAtivos: true });
  const [contatos, setContatos] = useState([]);
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [abaSeta, setAbaSeta] = useState(false);
  const [mostraConfig, setMostraConfig] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (s.exists()) setUserData(s.data());
        else await setDoc(ref, { nome: curr.displayName, foto: curr.photoURL, chakra: 50, fonteAnime: false, emojisAtivos: true });
      }
    });
    return onSnapshot(collection(db, "ninjas"), (s) => setContatos(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  useEffect(() => {
    if (!chatAtivo || !user) return;
    const q = query(collection(db, "chats", chatAtivo.id, "msgs"), orderBy("criadoEm", "desc"), limit(40));
    return onSnapshot(q, (s) => {
      setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse());
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
  }, [chatAtivo, user]);

  const handleSair = () => {
    setSaindo(true);
    setTimeout(() => {
      signOut(auth).then(() => window.location.reload());
    }, 2000);
  };

  const enviarMensagem = async (img = null, aud = null, video = null) => {
    if (!user || !chatAtivo) return;
    let textoFinal = novaMsg;
    let videoUrl = video;

    // Gerador de Vídeo/GIF por IA (Se começar com /video ou /gif)
    if (novaMsg.startsWith('/video') || novaMsg.startsWith('/gif')) {
        videoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(novaMsg + " naruto style anime movement")}?nologo=true&seed=${Math.random()}`;
        textoFinal = "🎬 Vídeo Ninja Gerado!";
    }

    await addDoc(collection(db, "chats", chatAtivo.id, "msgs"), {
      texto: textoFinal, imagem: img, audio: aud, video: videoUrl,
      uid: user.uid, nome: user.displayName, criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const deletarDados = async () => {
    if(confirm("Deseja apagar todas as mensagens e resetar chakra?")) {
        await updateDoc(doc(db, "ninjas", user.uid), { chakra: 50 });
        alert("Dados limpos!");
    }
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

  return (
    <div style={{ display: 'flex', height: '100dvh', backgroundColor: '#000', color: '#fff', fontFamily: userData.fonteAnime ? "'Bangers', cursive" : 'sans-serif', overflow: 'hidden' }}>
      
      {/* ANIMAÇÃO DE SAÍDA */}
      {saindo && (
        <div style={saidaOverlay}>
          <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJmZzR6NHR3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Do5GRTYdQ3kmQ/giphy.gif" style={{width:'200px'}} />
          <h2>Saindo da Vila...</h2>
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div onClick={() => setMostraConfig(true)} style={{cursor:'pointer', fontSize:'22px'}}>⚙️</div>
        <div style={{flex:1, overflowY:'auto', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'15px', marginTop:'20px'}}>
          {contatos.map(c => (
            <img key={c.id} src={c.foto} onClick={() => {setChatAtivo(c); setMostraConfig(false)}} style={{width:'45px', height:'45px', borderRadius:'50%', border: chatAtivo?.id === c.id ? '2px solid orange' : '1px solid #333', cursor:'pointer'}} />
          ))}
        </div>
        <button onClick={handleSair} style={{background:'none', border:'none', fontSize:'28px', cursor:'pointer'}}>🚪</button>
      </aside>

      {/* CHAT OU CONFIGURAÇÕES */}
      <main style={{flex:1, display:'flex', flexDirection:'column', position:'relative'}}>
        {mostraConfig ? (
            <div style={configArea}>
                <h2 style={{color:'orange'}}>Configurações Shinobi</h2>
                <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { fonteAnime: !userData.fonteAnime })} style={btnConfig}>Letra Anime: {userData.fonteAnime ? "ON" : "OFF"}</button>
                <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { emojisAtivos: !userData.emojisAtivos })} style={btnConfig}>Emojis Especiais: {userData.emojisAtivos ? "ON" : "OFF"}</button>
                <button onClick={deletarDados} style={btnConfig}>Limpar Dados da Conta</button>
                <button onClick={() => { localStorage.clear(); alert("Cache Limpo!"); }} style={btnConfig}>Limpar Cache do Sistema</button>
                <button onClick={() => { if(confirm("APAGAR CONTA DEFINITIVAMENTE?")) deleteUser(user); }} style={{...btnConfig, color:'red', borderColor:'red'}}>EXCLUIR CONTA</button>
                <button onClick={() => setMostraConfig(false)} style={{marginTop:'20px', background:'orange', border:'none', padding:'10px 20px', borderRadius:'10px', fontWeight:'bold'}}>VOLTAR AO CHAT</button>
            </div>
        ) : chatAtivo ? (
          <>
            <header style={headerStyle}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                 <img src={chatAtivo.foto} style={{width:'35px', borderRadius:'50%'}} />
                 <span>{chatAtivo.nome}</span>
              </div>
              <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <span style={{cursor:'pointer'}}>📞</span>
                <span style={{cursor:'pointer'}}>📹</span>
                <button onClick={() => setAbaSeta(!abaSeta)} style={setaBtn}>{abaSeta ? '🔼' : '🔽'}</button>
              </div>
            </header>

            {abaSeta && (
              <div style={abaConteudo}>
                <div style={{display:'flex', gap:'10px'}}>
                  <button onClick={() => alert("Criar Grupo...")} style={btnAction}>+ Criar Grupo</button>
                  {chatAtivo.isGroup && <button onClick={() => deleteDoc(doc(db, "ninjas", chatAtivo.id))} style={{...btnAction, color:'red'}}>Excluir Grupo</button>}
                </div>
                {userData.emojisAtivos && (
                    <div style={{display:'flex', gap:'15px', fontSize:'20px'}}>
                        {['🍥','🦊','⚡','🔥','🐸'].map(e => <span key={e} onClick={()=>setNovaMsg(p=>p+e)} style={{cursor:'pointer'}}>{e}</span>)}
                    </div>
                )}
              </div>
            )}

            <div style={chatArea}>
              {mensagens.map(m => (
                <div key={m.id} style={m.uid === user.uid ? msgMe : msgThem}>
                  {m.video ? <img src={m.video} style={{width:'200px', borderRadius:'10px'}} /> : 
                   m.audio ? <audio src={m.audio} controls style={{width:'180px'}} /> : 
                   m.imagem ? <img src={m.imagem} style={{width:'180px', borderRadius:'10px'}} /> : m.texto}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer style={footerStyle}>
              <button onClick={() => alert("Câmera Aberta")} style={iconBtn}>📷</button>
              <input value={novaMsg} onChange={e=>setNovaMsg(e.target.value)} placeholder="Digite ou /video..." style={inputStyle} />
              <div onClick={handleAudio} style={micStyle(gravando)}>
                {gravando ? <span style={{fontSize:'12px'}}>{segundos}s</span> : '🦊'}
              </div>
              <button onClick={() => enviarMensagem()} style={sendBtn}>⚡</button>
            </footer>
          </>
        ) : <div style={center}>Selecione um Ninja 🍥</div>}
      </main>

      <style>{`
        @keyframes chakraPulse { 0% { box-shadow: 0 0 5px #00ccff; } 50% { box-shadow: 0 0 25px #00ccff; transform: scale(1.05); } 100% { box-shadow: 0 0 5px #00ccff; } }
        @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
      `}</style>
    </div>
  );
}

// ESTILOS
const sidebarStyle = { width: '70px', backgroundColor: '#0a0a0a', borderRight: '1px solid orange', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' };
const headerStyle = { padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', background: '#050505', alignItems:'center' };
const chatArea = { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background:'url("https://www.transparenttextures.com/patterns/black-paper.png")' };
const footerStyle = { padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: '#050505' };
const inputStyle = { flex: 1, padding: '12px', borderRadius: '25px', background: '#000', border: '1px solid #333', color: '#fff' };
const micStyle = (g) => ({ width: '45px', height: '45px', borderRadius: '50%', background: g ? '#00ccff' : 'orange', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer', animation: g ? 'chakraPulse 1.5s infinite' : 'none' });
const saidaOverlay = { position:'fixed', inset:0, background:'#000', zIndex:1000, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' };
const configArea = { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'15px', background:'#050505' };
const btnConfig = { width:'250px', padding:'12px', background:'none', border:'1px solid #333', color:'#fff', borderRadius:'10px', cursor:'pointer' };
const setaBtn = { background: 'none', border: 'none', color: 'orange', fontSize: '20px', cursor: 'pointer' };
const abaConteudo = { height: '110px', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', borderBottom: '1px solid orange' };
const btnAction = { background: 'none', border: '1px solid orange', color: 'orange', padding: '5px 15px', borderRadius: '15px', fontSize: '11px', cursor: 'pointer' };
const msgMe = { alignSelf: 'flex-end', background: 'orange', color: '#000', padding: '10px', borderRadius: '15px 15px 0 15px', maxWidth: '80%', fontWeight:'bold' };
const msgThem = { alignSelf: 'flex-start', background: '#222', color: '#fff', padding: '10px', borderRadius: '15px 15px 15px 0', maxWidth: '80%' };
const center = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#444' };
const iconBtn = { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' };
const sendBtn = { background: 'none', border: 'none', fontSize: '24px', color: 'orange' };
