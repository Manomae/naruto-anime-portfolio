import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
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

export default function NarutoUltimateDev() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, fonteAnime: false });
  const [ninjas, setNinjas] = useState([]);
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [abaSeta, setAbaSeta] = useState(false);
  const [zoom, setZoom] = useState(null);

  const mediaRecorder = useRef(null);
  const scrollRef = useRef(null);
  const fileInput = useRef(null);
  const camInput = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (s.exists()) setUserData(s.data());
        else await setDoc(ref, { nome: curr.displayName, foto: curr.photoURL, chakra: 50, fonteAnime: false });
      }
    });
    return onSnapshot(collection(db, "ninjas"), (s) => setNinjas(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  useEffect(() => {
    if (!chatAtivo) return;
    const q = query(collection(db, "chats", chatAtivo.id, "msgs"), orderBy("criadoEm", "desc"), limit(30));
    return onSnapshot(q, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
  }, [chatAtivo]);

  const enviarMsg = async (img = null, aud = null) => {
    if (!user || (!novaMsg && !img && !aud)) return;
    await addDoc(collection(db, "chats", chatAtivo.id, "msgs"), {
      texto: novaMsg, imagem: img, audio: aud,
      uid: user.uid, nome: user.displayName, foto: user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        r.onload = (ev) => enviarMsg(null, ev.target.result);
        r.readAsDataURL(blob);
      };
      mediaRecorder.current.start();
      setGravando(true);
      const timer = setInterval(() => setSegundos(s => s + 1), 1000);
      mediaRecorder.current.onstart = () => {}; 
    } else {
      mediaRecorder.current.stop();
      setGravando(false);
      setSegundos(0);
    }
  };

  const corP = '#ff9800';

  return (
    <div style={{ display: 'flex', height: '100dvh', backgroundColor: '#000', color: '#fff', fontFamily: userData.fonteAnime ? 'serif' : 'sans-serif' }}>
      
      {zoom && (
        <div onClick={() => setZoom(null)} style={zoomOverlay}>
          <img src={zoom} style={{maxWidth:'90%', borderRadius:'10px', border:'2px solid orange'}} />
          <button style={{marginTop:'10px', padding:'10px', background:'orange', border:'none', borderRadius:'5px'}}>FECHAR</button>
        </div>
      )}

      {/* BARRA LATERAL */}
      <aside style={{ width: '70px', background: '#111', borderRight: '1px solid orange', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' }}>
        <div style={{fontSize:'30px', marginBottom:'20px'}}>🍥</div>
        <div style={{flex:1, overflowY:'auto'}}>
          {ninjas.map(n => (
            <img key={n.id} src={n.foto} onClick={() => setChatAtivo(n)} style={{width:'45px', borderRadius:'50%', border: chatAtivo?.id === n.id ? '2px solid orange' : '1px solid #444', marginBottom:'15px', cursor:'pointer'}} />
          ))}
        </div>
        <button onClick={() => signOut(auth)} style={{background:'none', border:'none', fontSize:'25px'}}>🚪</button>
      </aside>

      {/* CHAT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {chatAtivo ? (
          <>
            <header style={{ padding: '15px', background: '#050505', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <img src={chatAtivo.foto} style={{width:'35px', borderRadius:'50%'}} />
                <span style={{fontWeight:'bold'}}>{chatAtivo.nome}</span>
              </div>
              <div style={{display:'flex', gap:'15px', fontSize:'20px'}}>
                <span onClick={() => alert("Iniciando Chamada de Áudio...")} style={{cursor:'pointer'}}>📞</span>
                <span onClick={() => alert("Iniciando Chamada de Vídeo...")} style={{cursor:'pointer'}}>📹</span>
                <span onClick={() => setAbaSeta(!abaSeta)} style={{cursor:'pointer', color:'orange'}}>{abaSeta ? '▲' : '▼'}</span>
              </div>
            </header>

            {abaSeta && (
              <div style={{ height: '80px', background: '#111', borderBottom: '1px solid orange', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                 <button onClick={() => alert("Criar Grupo Limitado a 3 Ninjas")} style={btnMini}>+ GRUPO</button>
                 <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { fonteAnime: !userData.fonteAnime })} style={btnMini}>FONTE ANIME</button>
                 <div style={{fontSize:'20px'}}>{['🦊','🔥','🌀'].map(e => <span key={e} onClick={() => setNovaMsg(p => p + e)}>{e}</span>)}</div>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mensagens.map(m => (
                <div key={m.id} onDoubleClick={() => m.uid === user.uid && deleteDoc(doc(db, "chats", chatAtivo.id, "msgs", m.id))} style={{ alignSelf: m.uid === user.uid ? 'flex-end' : 'flex-start', background: m.uid === user.uid ? 'orange' : '#222', color: m.uid === user.uid ? '#000' : '#fff', padding: '10px', borderRadius: '10px', maxWidth: '80%' }}>
                  {m.audio ? <audio src={m.audio} controls style={{width:'180px'}} /> : m.imagem ? <img src={m.imagem} onClick={() => setZoom(m.imagem)} style={{width:'150px', borderRadius:'5px'}} /> : m.texto}
                  <div style={{fontSize:'8px', opacity:0.5, marginTop:'5px'}}>{m.uid === user.uid ? 'Dois cliques para apagar' : ''}</div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer style={{ padding: '10px', background: '#050505', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{display:'flex', gap:'5px'}}>
                <button onClick={() => camInput.current.click()} style={btnRound}>📷</button>
                <button onClick={() => fileInput.current.click()} style={btnRound}>📎</button>
              </div>
              <input type="file" ref={camInput} hidden capture="environment" onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMsg(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
              <input type="file" ref={fileInput} hidden onChange={(e) => { const r = new FileReader(); r.onload=(ev)=>enviarMsg(ev.target.result); r.readAsDataURL(e.target.files[0]) }} />
              
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mensagem..." style={{flex:1, padding:'10px', borderRadius:'20px', border:'1px solid #333', background:'#000', color:'#fff'}} />
              
              <div onClick={handleAudio} style={{ width:'45px', height:'45px', borderRadius:'50%', background: gravando ? 'red' : 'orange', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer' }}>
                {gravando ? segundos + 's' : '🦊'}
              </div>
              
              <button onClick={() => enviarMsg()} style={{background:'none', border:'none', color:'orange', fontSize:'25px'}}>⚡</button>
            </footer>
          </>
        ) : <div style={{flex:1, display:'flex', justifyContent:'center', alignItems:'center'}}>Escolha um ninja na barra lateral 🍥</div>}
      </main>
    </div>
  );
}

const zoomOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const btnRound = { background: '#222', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' };
const btnMini = { background: 'none', border: '1px solid orange', color: 'orange', padding: '5px', borderRadius: '5px', fontSize: '10px' };
