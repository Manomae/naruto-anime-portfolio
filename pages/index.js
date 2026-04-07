import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "firebase/firestore";

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

export default function NarutoUltimateMessenger() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, fonteAnime: false });
  const [contatos, setContatos] = useState([]);
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [abaSeta, setAbaSeta] = useState(false);
  const [criandoGrupo, setCriandoGrupo] = useState(false);
  const [selecionados, setSelecionados] = useState([]);

  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (!s.exists()) await setDoc(ref, { nome: curr.displayName, foto: curr.photoURL, chakra: 50, fonteAnime: false });
        else setUserData(s.data());
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

  const enviarMensagem = async (img = null, aud = null, textoIA = null) => {
    if (!user || !chatAtivo) return;
    await addDoc(collection(db, "chats", chatAtivo.id, "msgs"), {
      texto: textoIA || novaMsg, imagem: img, audio: aud,
      uid: user.uid, nome: user.displayName, criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const iniciarGrupo = async () => {
    if (selecionados.length === 0) return alert("Selecione alguém!");
    const idGrupo = `grupo_${Date.now()}`;
    const nomeGrupo = "Time " + user.displayName.split(' ')[0];
    const refGrupo = doc(db, "ninjas", idGrupo);
    await setDoc(refGrupo, { id: idGrupo, nome: nomeGrupo, foto: "https://api.dicebear.com/7.x/bottts/svg?seed=group", isGroup: true });
    
    setChatAtivo({ id: idGrupo, nome: nomeGrupo });
    setCriandoGrupo(false);
    
    // IA Gerando Boas vindas
    setTimeout(() => {
      enviarMensagem(null, null, `🔥 Um novo time foi formado! Preparem seu chakra, ninjas! 🍥🦊`);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', height: '100dvh', backgroundColor: '#000', color: '#fff', fontFamily: userData.fonteAnime ? "'Bangers', cursive" : 'sans-serif', overflow: 'hidden' }}>
      <aside style={sidebarStyle}>
        <div style={{fontSize:'25px', marginBottom:'20px'}}>🍥</div>
        <div style={{flex:1, overflowY:'auto', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:'15px'}}>
          {contatos.map(c => (
            <img key={c.id} src={c.foto} onClick={() => setChatAtivo(c)} style={{width:'45px', height:'45px', borderRadius:'50%', border: chatAtivo?.id === c.id ? '2px solid orange' : '1px solid #333', cursor:'pointer'}} />
          ))}
        </div>
        <button onClick={() => signOut(auth)} style={{background:'none', border:'none', fontSize:'22px', cursor:'pointer'}}>🚪</button>
      </aside>

      <main style={{flex:1, display:'flex', flexDirection:'column'}}>
        {chatAtivo ? (
          <>
            <header style={headerStyle}>
              <span>{chatAtivo.nome}</span>
              <button onClick={() => setAbaSeta(!abaSeta)} style={setaBtn}>{abaSeta ? '🔼' : '🔽'}</button>
            </header>

            {abaSeta && (
              <div style={abaConteudo}>
                <button onClick={() => setCriandoGrupo(true)} style={btnPlus}>+ Criar Grupo</button>
                <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { fonteAnime: !userData.fonteAnime }).then(() => window.location.reload())} style={btnPlus}>Letra Anime: {userData.fonteAnime ? "ON" : "OFF"}</button>
              </div>
            )}

            <div style={chatArea}>
              {mensagens.map(m => (
                <div key={m.id} style={m.uid === user.uid ? msgMe : msgThem}>{m.audio ? <audio src={m.audio} controls style={{width:'180px'}} /> : m.imagem ? <img src={m.imagem} style={{width:'180px', borderRadius:'10px'}} /> : m.texto}</div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer style={footerStyle}>
              <div style={{display:'flex', gap:'8px'}}>
                <input type="file" id="cam" hidden capture="environment" onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
                <button onClick={() => document.getElementById('cam').click()} style={iconBtn}>📷</button>
                <input type="file" id="file" hidden onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
                <button onClick={() => document.getElementById('file').click()} style={iconBtn}>📎</button>
              </div>
              <input value={novaMsg} onChange={e=>setNovaMsg(e.target.value)} placeholder="Mensagem..." style={inputStyle} />
              <div onClick={handleAudio} style={micStyle(gravando)}>
                {gravando ? <span style={{fontSize:'12px'}}>{segundos}s</span> : '🦊'}
              </div>
              <button onClick={() => enviarMensagem()} style={sendBtn}>⚡</button>
            </footer>
          </>
        ) : <div style={{flex:1, display:'flex', justifyContent:'center', alignItems:'center'}}>Selecione um Ninja 🍥</div>}
      </main>

      {/* MODAL CRIAR GRUPO */}
      {criandoGrupo && (
        <div style={modalStyle}>
          <div style={modalContent}>
            <h3>Formar Time (Máx 3)</h3>
            <div style={{maxHeight:'200px', overflowY:'auto'}}>
              {contatos.filter(c => c.id !== user.uid).map(c => (
                <div key={c.id} onClick={() => {
                  if (selecionados.includes(c.id)) setSelecionados(selecionados.filter(s => s !== c.id));
                  else if (selecionados.length < 3) setSelecionados([...selecionados, c.id]);
                }} style={{padding:'10px', background: selecionados.includes(c.id) ? 'orange' : '#333', marginBottom:'5px', borderRadius:'5px', cursor:'pointer'}}>
                  {c.nome}
                </div>
              ))}
            </div>
            <button onClick={iniciarGrupo} style={btnFinish}>CRIAR GRUPO 🔥</button>
            <button onClick={() => setCriandoGrupo(false)} style={{background:'none', color:'#fff', border:'none', marginTop:'10px'}}>Cancelar</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chakraRec { 0% { box-shadow: 0 0 5px #00ccff; transform: scale(1); } 50% { box-shadow: 0 0 25px #00ccff; transform: scale(1.1); } 100% { box-shadow: 0 0 5px #00ccff; transform: scale(1); } }
        @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
      `}</style>
    </div>
  );
}

const sidebarStyle = { width: '70px', backgroundColor: '#0a0a0a', borderRight: '1px solid orange', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' };
const headerStyle = { padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', background: '#050505' };
const chatArea = { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const footerStyle = { padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: '#050505' };
const inputStyle = { flex: 1, padding: '12px', borderRadius: '25px', background: '#000', border: '1px solid #333', color: '#fff' };
const micStyle = (g) => ({ width: '45px', height: '45px', borderRadius: '50%', background: g ? '#00ccff' : 'orange', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer', animation: g ? 'chakraRec 1.5s infinite' : 'none' });
const setaBtn = { background: 'none', border: 'none', color: 'orange', fontSize: '20px', cursor: 'pointer' };
const abaConteudo = { height: '100px', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', borderBottom: '1px solid orange' };
const btnPlus = { background: 'none', border: '1px solid orange', color: 'orange', padding: '5px 15px', borderRadius: '15px', fontSize: '12px', cursor: 'pointer' };
const modalStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContent = { background: '#111', padding: '20px', borderRadius: '15px', width: '280px', textAlign: 'center' };
const btnFinish = { width: '100%', padding: '10px', background: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '15px' };
const msgMe = { alignSelf: 'flex-end', background: 'orange', color: '#000', padding: '10px', borderRadius: '15px 15px 0 15px', maxWidth: '80%' };
const msgThem = { alignSelf: 'flex-start', background: '#222', color: '#fff', padding: '10px', borderRadius: '15px 15px 15px 0', maxWidth: '80%' };
const iconBtn = { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' };
const sendBtn = { background: 'none', border: 'none', fontSize: '24px', color: 'orange' };
