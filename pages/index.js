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
  const [userData, setUserData] = useState({ chakra: 50 });
  const [contatos, setContatos] = useState([]);
  const [chatAtivo, setChatAtivo] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [abaSeta, setAbaSeta] = useState(false);
  const [zoom, setZoom] = useState(null);

  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);
  const fileInput = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (!s.exists()) {
          await setDoc(ref, { nome: curr.displayName, foto: curr.photoURL, chakra: 50, online: true });
        } else { setUserData(s.data()); }
      }
    });
    return onSnapshot(collection(db, "ninjas"), (s) => 
      setContatos(s.docs.map(d => ({ id: d.id, ...d.data() })).filter(c => c.id !== auth.currentUser?.uid))
    );
  }, []);

  useEffect(() => {
    if (!chatAtivo || !user) return;
    const chatId = user.uid < chatAtivo.id ? `${user.uid}_${chatAtivo.id}` : `${chatAtivo.id}_${user.uid}`;
    const q = query(collection(db, "chats", chatId, "msgs"), orderBy("criadoEm", "desc"), limit(50));
    return onSnapshot(q, (s) => {
      setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse());
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
  }, [chatAtivo, user]);

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
      } catch (err) { alert("Permita o uso do microfone!"); }
    } else {
      mediaRecorder.current.stop();
      setGravando(false);
      clearInterval(timerRef.current);
    }
  };

  const enviarMensagem = async (img = null, aud = null) => {
    if (!user || !chatAtivo) return;
    const chatId = user.uid < chatAtivo.id ? `${user.uid}_${chatAtivo.id}` : `${chatAtivo.id}_${user.uid}`;
    await addDoc(collection(db, "chats", chatId, "msgs"), {
      texto: novaMsg, imagem: img, audio: aud,
      uid: user.uid, criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  return (
    <div style={containerStyle}>
      {/* ZOOM HD */}
      {zoom && (
        <div style={zoomOverlay} onClick={() => setZoom(null)}>
          <img src={zoom} style={zoomImg} />
          <button style={btnBack}>VOLTAR 🔙</button>
        </div>
      )}

      {/* BARRA LATERAL (BATE-PAPO NARUTO) */}
      <aside style={sidebarStyle}>
        <div style={logoStyle}>🍥</div>
        <div style={contatosLista}>
          {contatos.map(c => (
            <div key={c.id} onClick={() => setChatAtivo(c)} style={cStyle(chatAtivo?.id === c.id)}>
              <img src={c.foto} style={avatarStyle(chatAtivo?.id === c.id)} />
              <span style={nomeStyle}>{c.nome.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <button onClick={() => signOut(auth).then(()=>window.location.reload())} style={logoutBtn}>🚪</button>
      </aside>

      {/* ÁREA DO CHAT */}
      <main style={chatMain}>
        {!user ? (
          <div style={center}>
            <button onClick={() => signInWithPopup(auth, provider)} style={loginBtn}>CONECTAR GOOGLE SHINOBI</button>
          </div>
        ) : chatAtivo ? (
          <>
            <header style={chatHeader}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <img src={chatAtivo.foto} style={{width:'35px', borderRadius:'50%'}} />
                <span style={{fontWeight:'bold'}}>{chatAtivo.nome}</span>
              </div>
              <button onClick={() => setAbaSeta(!abaSeta)} style={setaBtn}>{abaSeta ? '🔼' : '🔽'}</button>
            </header>

            <div style={setaContent(abaSeta)}>
               <button style={groupBtn}>➕ Criar Grupo (Até 50)</button>
               <div style={{display:'flex', gap:'15px', fontSize:'22px'}}>
                 {['🍥','🦊','⚡','🔥','🏮'].map(e => <span key={e} onClick={()=>setNovaMsg(p=>p+e)} style={{cursor:'pointer'}}>{e}</span>)}
               </div>
            </div>

            <div style={msgArea}>
              {mensagens.map(m => (
                <div key={m.id} style={m.uid === user.uid ? msgMe : msgThem}>
                  {m.audio ? <audio src={m.audio} controls style={audioStyle} /> : 
                   m.imagem ? <img src={m.imagem} onClick={()=>setZoom(m.imagem)} style={imgMsg} /> : 
                   <div style={{padding:'8px 12px'}}>{m.texto}</div>}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer style={chatFooter}>
              <button onClick={() => fileInput.current.click()} style={iconBtn}>📷</button>
              <input type="file" ref={fileInput} hidden accept="image/*" capture="environment" onChange={(e) => {
                const r = new FileReader(); r.onload = (ev) => enviarMensagem(ev.target.result); r.readAsDataURL(e.target.files[0]);
              }} />
              <input value={novaMsg} onChange={e=>setNovaMsg(e.target.value)} placeholder="Mandar pergaminho..." style={inputStyle} onKeyPress={e => e.key === 'Enter' && enviarMensagem()} />
              
              <div onClick={handleAudio} style={micStyle(gravando)}>
                {gravando ? <span style={{fontSize:'12px'}}>{segundos}s</span> : '🦊'}
              </div>
              
              <button onClick={() => enviarMensagem()} style={sendBtn}>⚡</button>
            </footer>
          </>
        ) : (
          <div style={center}>Selecione um Ninja para conversar 🍥</div>
        )}
      </main>

      <style>{`
        @keyframes chakra { 0% { box-shadow: 0 0 5px orange; } 50% { box-shadow: 0 0 20px orange; } 100% { box-shadow: 0 0 5px orange; } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #333; borderRadius: 10px; }
      `}</style>
    </div>
  );
}

// ESTILOS DE DESIGN NARUTO
const containerStyle = { display: 'flex', height: '100dvh', backgroundColor: '#000', color: '#fff', overflow: 'hidden' };
const sidebarStyle = { width: '75px', backgroundColor: '#0a0a0a', borderRight: '1px solid #ff9800', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' };
const logoStyle = { fontSize: '28px', marginBottom: '25px', filter: 'drop-shadow(0 0 5px orange)' };
const contatosLista = { flex: 1, overflowY: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' };
const avatarStyle = (act) => ({ width: '45px', height: '45px', borderRadius: '50%', border: act ? '2px solid #ff9800' : '1px solid #333', transition: '0.3s' });
const cStyle = (act) => ({ cursor: 'pointer', textAlign: 'center', opacity: act ? 1 : 0.6 });
const nomeStyle = { fontSize: '10px', display: 'block', marginTop: '4px', color: '#888' };
const logoutBtn = { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', marginTop: '10px' };

const chatMain = { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' };
const chatHeader = { padding: '15px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050505' };
const setaBtn = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'orange' };
const setaContent = (open) => ({ height: open ? '90px' : '0', overflow: 'hidden', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', borderBottom: open ? '1px solid orange' : 'none' });

const msgArea = { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'radial-gradient(circle, #0a0a0a 0%, #000 100%)' };
const msgMe = { alignSelf: 'flex-end', backgroundColor: '#ff9800', color: '#000', borderRadius: '15px 15px 0 15px', maxWidth: '80%', fontWeight: '500', boxShadow: '0 2px 10px rgba(255,152,0,0.2)' };
const msgThem = { alignSelf: 'flex-start', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '15px 15px 15px 0', maxWidth: '80%', border: '1px solid #333' };

const chatFooter = { padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#050505', borderTop: '1px solid #1a1a1a' };
const inputStyle = { flex: 1, padding: '12px 18px', borderRadius: '25px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', outline: 'none' };
const micStyle = (grav) => ({ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: grav ? '#ff4444' : '#ff9800', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '22px', animation: grav ? 'chakra 1.5s infinite' : 'none', border: 'none' });
const sendBtn = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'orange' };
const iconBtn = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' };

const zoomOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const zoomImg = { maxWidth: '100%', maxHeight: '80%', borderRadius: '10px', border: '2px solid orange', boxShadow: '0 0 30px rgba(255,152,0,0.5)' };
const btnBack = { marginTop: '20px', padding: '10px 30px', background: 'orange', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const center = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' };
const loginBtn = { padding: '15px 25px', background: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const groupBtn = { background: 'none', color: 'orange', border: '1px solid orange', borderRadius: '20px', padding: '4px 15px', fontSize: '12px', marginTop: '10px', cursor: 'pointer' };
const audioStyle = { width: '200px', height: '40px' };
const imgMsg = { width: '200px', borderRadius: '10px', cursor: 'pointer' };
