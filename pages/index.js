import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function EmanuelNarutoSupreme() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null, tema: 'folha', fonte: 'sans-serif', fontSize: '14px' });
  const [aba, setAba] = useState('ia');
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [resultadoIA, setResultadoIA] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const [ninjas, setNinjas] = useState([]);
  const [chatAtivo, setChatAtivo] = useState('geral');
  
  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) {
        setUser(curr);
        const ref = doc(db, "ninjas", curr.uid);
        const s = await getDoc(ref);
        if (s.exists()) setUserData(s.data());
        else {
          const d = { chakra: 50, avatarIA: null, nome: curr.displayName, tema: 'folha', fontSize: '14px', online: true };
          await setDoc(ref, d);
          setUserData(d);
        }
      }
    });
    onSnapshot(collection(db, "ninjas"), (s) => setNinjas(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, "chats", chatAtivo, "msgs"), orderBy("criadoEm", "desc"), limit(30));
    return onSnapshot(q, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
  }, [chatAtivo]);

  // --- ÁUDIO COM CRONÔMETRO ---
  const toggleGravacao = async () => {
    if (!gravando) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (ev) => enviarMsg(null, ev.target.result);
        reader.readAsDataURL(blob);
        setTempoGravacao(0);
      };
      mediaRecorder.current.start();
      setGravando(true);
      timerRef.current = setInterval(() => setTempoGravacao(p => p + 1), 1000);
    } else {
      mediaRecorder.current.stop();
      setGravando(false);
      clearInterval(timerRef.current);
    }
  };

  const enviarMsg = async (img = null, aud = null) => {
    if (!user) return;
    await addDoc(collection(db, "chats", chatAtivo, "msgs"), {
      texto: novaMsg, imagem: img, audio: aud,
      user: user.displayName, uid: user.uid, foto: userData.avatarIA || user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const gerarIA = async (tipo) => {
    if (userData.chakra < 5) return alert("Sem Chakra!");
    setCarregando(true);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(novaMsg + " naruto realistic anime 8k")}?seed=${Math.random()}&nologo=true`;
    setResultadoIA(url);
    setCarregando(false);
    await updateDoc(doc(db, "ninjas", user.uid), { chakra: increment(-5) });
    setUserData(p => ({ ...p, chakra: p.chakra - 5 }));
  };

  const corP = { folha: '#ff9800', akatsuki: '#ff0000', areia: '#c2b280', nevoeiro: '#00ccff' }[userData.tema];

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: userData.fonte, fontSize: userData.fontSize }}>
      
      {/* AMPLIFICADOR UNIVERSAL */}
      {zoom && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 5000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src={zoom} style={{ maxWidth: '90%', maxHeight: '70%', borderRadius: '15px', border: `4px solid ${corP}`, boxShadow: `0 0 20px ${corP}` }} />
          <button onClick={() => setZoom(null)} style={{ marginTop: '20px', padding: '10px 30px', background: corP, border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>VOLTAR 🔙</button>
        </div>
      )}

      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', borderBottom: `2px solid ${corP}` }}>
        <img src={userData.avatarIA || user?.photoURL} onClick={() => setZoom(userData.avatarIA || user?.photoURL)} style={{ width: '45px', height: '45px', borderRadius: '50%', border: `2px solid ${corP}`, cursor: 'pointer' }} />
        <div style={{ color: corP, fontWeight: 'bold' }}>🌀 {userData.chakra}C</div>
        <button onClick={() => user ? signOut(auth) : signInWithPopup(auth, provider)} style={{ background: 'none', border: `1px solid ${corP}`, color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>{user ? 'SAIR' : 'LOGAR'}</button>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '15px', background: '#0a0a0a' }}>
        {['ia', 'chat', 'vila', 'perfil'].map(t => <button key={t} onClick={() => setAba(t)} style={{ background: 'none', border: 'none', color: aba === t ? corP : '#555', fontWeight: 'bold', textTransform: 'uppercase' }}>{t}</button>)}
      </nav>

      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '15px' }}>
        {aba === 'ia' && (
          <div style={{ background: '#111', padding: '20px', borderRadius: '15px' }}>
            <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Descreva seu Ninja..." style={{ width: '100%', padding: '10px', background: '#222', color: '#fff', border: `1px solid ${corP}`, borderRadius: '5px' }} />
            <button onClick={gerarIA} style={{ width: '100%', padding: '12px', background: corP, border: 'none', borderRadius: '8px', marginTop: '10px', fontWeight: 'bold' }}>GERAR IA REALISTA (5C)</button>
            {resultadoIA && (
              <div style={{ marginTop: '20px' }}>
                <img src={resultadoIA} onClick={() => setZoom(resultadoIA)} style={{ width: '100%', borderRadius: '10px' }} />
                <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { avatarIA: resultadoIA })} style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '10px' }}>USAR NO PERFIL</button>
                <a href={resultadoIA} download style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: corP }}>BAIXAR FOTO</a>
              </div>
            )}
          </div>
        )}

        {aba === 'chat' && (
          <div style={{ background: '#111', padding: '15px', borderRadius: '15px' }}>
            <div style={{ height: '350px', overflowY: 'scroll', background: '#000', padding: '10px', borderRadius: '10px' }}>
              {mensagens.map(m => (
                <div key={m.id} style={{ marginBottom: '10px', textAlign: m.uid === user?.uid ? 'right' : 'left' }}>
                  <div style={{ background: m.uid === user?.uid ? corP : '#222', color: m.uid === user?.uid ? '#000' : '#fff', padding: '8px', borderRadius: '10px', display: 'inline-block' }}>
                    <small onClick={() => setZoom(m.foto)} style={{ cursor: 'pointer', display: 'block', fontSize: '9px' }}>{m.user}</small>
                    {m.audio ? <audio src={m.audio} controls style={{ width: '150px' }} /> : m.imagem ? <img src={m.imagem} onClick={() => setZoom(m.imagem)} style={{ width: '100px' }} /> : m.texto}
                    {m.uid === user?.uid && <button onClick={() => deleteDoc(doc(db, "chats", chatAtivo, "msgs", m.id))} style={{ background: 'none', border: 'none', fontSize: '10px' }}>🗑️</button>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              <button onClick={toggleGravacao} style={{ background: gravando ? 'red' : '#333', border: 'none', padding: '10px', borderRadius: '5px' }}>{gravando ? tempoGravacao + 's' : '🎙️'}</button>
              <button onClick={() => fileInput.current.click()} style={{ background: '#333', border: 'none', padding: '10px', borderRadius: '5px' }}>📎</button>
              <input type="file" ref={fileInput} hidden onChange={(e) => {
                const r = new FileReader(); r.onload = (ev) => enviarMsg(ev.target.result); r.readAsDataURL(e.target.files[0]);
              }} />
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mensagem..." style={{ flex: 1, background: '#222', border: `1px solid ${corP}`, color: '#fff', padding: '10px', borderRadius: '5px' }} />
              <button onClick={() => enviarMsg()} style={{ background: corP, border: 'none', padding: '10px', borderRadius: '5px' }}>⚡</button>
            </div>
          </div>
        )}

        {aba === 'perfil' && (
          <div style={{ background: '#111', padding: '20px', borderRadius: '15px' }}>
            <h3>Configurações Ninja</h3>
            <p>Tema da Vila:</p>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {['folha', 'akatsuki', 'areia', 'nevoeiro'].map(t => <button key={t} onClick={() => updateDoc(doc(db, "ninjas", user.uid), { tema: t })} style={{ padding: '8px', background: t === 'akatsuki' ? 'red' : '#333', border: 'none', borderRadius: '5px' }}>{t}</button>)}
            </div>
            <button onClick={() => { if(confirm("Apagar conta?")) deleteUser(auth.currentUser); }} style={{ marginTop: '30px', width: '100%', padding: '10px', background: 'none', border: '1px solid #444', color: '#888' }}>Remover Registro Ninja</button>
          </div>
        )}
      </main>
    </div>
  );
}
