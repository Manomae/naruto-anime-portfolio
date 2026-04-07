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
  const [segundosRec, setSegundosRec] = useState(0);
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

  const toggleAudio = async () => {
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
        setSegundosRec(0);
      };
      mediaRecorder.current.start();
      setGravando(true);
      timerRef.current = setInterval(() => setSegundosRec(p => p + 1), 1000);
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

  const invocarIA = async () => {
    if (userData.chakra < 5) return alert("Sem Chakra!");
    setCarregando(true);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(novaMsg + " naruto ultra realistic 8k cinema style")}?seed=${Math.random()}&nologo=true&width=1024&height=1024`;
    setResultadoIA(url);
    setCarregando(false);
    await updateDoc(doc(db, "ninjas", user.uid), { chakra: increment(-5) });
    setUserData(p => ({ ...p, chakra: p.chakra - 5 }));
  };

  const cores = { folha: '#ff9800', akatsuki: '#ff0000', areia: '#c2b280', nevoeiro: '#00ccff' };
  const corP = cores[userData.tema] || '#ff9800';

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: userData.fonte, fontSize: userData.fontSize }}>
      
      {zoom && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <img src={zoom} style={{ maxWidth: '100%', maxHeight: '80%', borderRadius: '15px', border: `4px solid ${corP}`, boxShadow: `0 0 30px ${corP}`, filter: 'contrast(1.1) brightness(1.1)' }} />
          <button onClick={() => setZoom(null)} style={{ marginTop: '20px', padding: '12px 50px', background: corP, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>VOLTAR 🔙</button>
        </div>
      )}

      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', borderBottom: `2px solid ${corP}` }}>
        <img src={userData.avatarIA || user?.photoURL} onClick={() => setZoom(userData.avatarIA || user?.photoURL)} style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${corP}`, cursor: 'pointer', objectFit: 'cover' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: corP, fontWeight: 'bold', fontSize: '16px' }}>🌀 {userData.chakra}C</div>
          <div style={{ fontSize: '10px', color: '#00ff00' }}>VILA DA FOLHA ONLINE</div>
        </div>
        <button onClick={() => user ? signOut(auth) : signInWithPopup(auth, provider)} style={{ background: 'none', border: `1px solid ${corP}`, color: '#fff', padding: '5px 12px', borderRadius: '5px', fontWeight: 'bold' }}>{user ? 'SAIR' : 'LOGAR'}</button>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '15px', background: '#0a0a0a' }}>
        {['ia', 'chat', 'vila', 'perfil'].map(t => <button key={t} onClick={() => setAba(t)} style={{ background: 'none', border: 'none', color: aba === t ? corP : '#555', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>{t}</button>)}
      </nav>

      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '15px' }}>
        {aba === 'ia' && (
          <div style={cardStyle}>
            <h3 style={{ color: corP }}>Laboratório de Invocação 8K</h3>
            <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Ex: Madara vs Aliança Shinobi..." style={inputStyle(corP)} />
            <button onClick={invocarIA} style={btnStyle(corP)}>{carregando ? 'CONCENTRANDO...' : 'INVOCAR IA REALISTA (5C)'}</button>
            {resultadoIA && (
              <div style={{ marginTop: '20px' }}>
                <img src={resultadoIA} onClick={() => setZoom(resultadoIA)} style={{ width: '100%', borderRadius: '15px', border: `2px solid ${corP}` }} />
                <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { avatarIA: resultadoIA })} style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '10px', fontWeight: 'bold' }}>USAR NO PERFIL</button>
                <a href={resultadoIA} download
