import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbf0uWYYqZ0UnvxPUkrbN0-T1KrIw03og",
  authDomain: "emanuel-b526c.firebaseapp.com",
  projectId: "emanuel-b526c",
  storageBucket: "emanuel-b526c.firebasestorage.app",
  messagingSenderId: "340230465087",
  appId: "1:340230465087:web:72aea1349869155f02ba8a",
  measurementId: "G-QCEPQ0F5ME"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function EmanuelNarutoAIPro() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 5, avatarIA: null });
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const [segundosOnline, setSegundosOnline] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // 1. Cronômetro de Sessão
  useEffect(() => {
    let intervalo;
    if (user) {
      intervalo = setInterval(() => setSegundosOnline(prev => prev + 1), 1000);
    }
    return () => clearInterval(intervalo);
  }, [user]);

  const formatarTempo = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${d}d ${h}h ${m}m ${seg}s`;
  };

  // 2. Sincronização com Banco de Dados (Usuários e Chakra)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        const dadosIniciais = userSnap.exists() ? userSnap.data() : {
          chakra: 10, avatarIA: null, nome: currentUser.displayName, online: true
        };
        
        await setDoc(userRef, { ...dadosIniciais, online: true, ultimoAcesso: serverTimestamp() }, { merge: true });
        setUserData(dadosIniciais);
      }
    });

    // Lista de Ninjas na Vila
    const q = query(collection(db, "ninjas"), orderBy("nome", "asc"));
    const unsubUsers = onSnapshot(q, (snap) => {
      setUsuariosOnline(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubAuth(); unsubUsers(); };
  }, []);

  const handleAuth = () => user ? signOut(auth) : signInWithPopup(auth, provider);

  const gerarAvatar = async () => {
    if (userData.chakra < 1) return alert("Sem Chakra!");
    setCarregando(true);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent("portrait of naruto anime character centered face detailed")}?seed=${Math.random()}`;
    const img = new Image();
    img.src = url;
    img.onload = () => { setResultado(url); setCarregando(false); };
  };

  const definirAvatar = async () => {
    const userRef = doc(db, "ninjas", user.uid);
    await updateDoc(userRef, { avatarIA: resultado, chakra: increment(-2) });
    setUserData(prev => ({ ...prev, avatarIA: resultado, chakra: prev.chakra - 2 }));
    setResultado(null);
    alert("Perfil Atualizado! 🔥");
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER DINÂMICO */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={avatarContainer}>
            <img src={userData.avatarIA || user?.photoURL || "https://via.placeholder.com/40"} style={imgAvatar} />
            {user && <div style={dotOnline}></div>}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '12px', color: 'orange' }}>{user ? user.displayName.split(' ')[0] : 'OFFLINE'}</h4>
            {user && <span style={{ fontSize: '9px', color: '#00ff00' }}>{formatarTempo(segundosOnline)}</span>}
          </div>
        </div>
        <button onClick={handleAuth} style={btnAuth}>{user ? 'SAIR' : 'LOGAR'}</button>
      </header>

      <nav style={navStyle}>
        <button onClick={() => setAbaAtiva('ia')} style={abaStyle(abaAtiva === 'ia')}>LAB IA</button>
        <button onClick={() => setAbaAtiva('vila')} style={abaStyle(abaAtiva === 'vila')}>VILA (NINJAS)</button>
        <div style={{ color: 'orange', fontWeight: 'bold' }}>🌀 {userData.chakra}</div>
      </nav>

      <main style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        
        {abaAtiva === 'ia' && (
          <div style={card}>
            <h3 style={{ color: 'orange' }}>Invocação de Avatar</h3>
            <button onClick={gerarAvatar} disabled={carregando} style={btnG}>GERAR NOVO ROSTO (1C)</button>
            {resultado && (
              <div style={{ marginTop: '20px' }}>
                <img src={resultado} style={{ width: '100%', borderRadius: '15px', border: '2px solid orange' }} />
                <button onClick={definirAvatar} style={btnP}>DEFINIR COMO FOTO DE PERFIL (2C)</button>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'vila' && (
          <div style={card}>
            <h3 style={{ color: 'orange' }}>Ninjas na Vila</h3>
            {usuariosOnline.map(u => (
              <div key={u.id} style={userItem}>
                <img src={u.avatarIA || "https://via.placeholder.com/30"} style={miniAvatar} />
                <span style={{ flex: 1, textAlign: 'left', fontSize: '14px' }}>{u.nome}</span>
                <div style={{ width: '8px', height: '8px', backgroundColor: u.online ? '#00ff00' : '#444', borderRadius: '50%' }}></div>
                <button style={btnChat} onClick={() => alert("Jutsu de Mensagem Privada em breve!")}>💬</button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

// ESTILOS
const headerStyle = { padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', borderBottom: '2px solid orange' };
const avatarContainer = { position: 'relative', width: '40px', height: '40px' };
const imgAvatar = { width: '100%', height: '100%', borderRadius: '50%', border: '2px solid orange', objectFit: 'cover' };
const dotOnline = { position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', backgroundColor: '#00ff00', borderRadius: '50%', border: '2px solid #111' };
const btnAuth = { background: '#222', color: '#fff', border: '1px solid orange', padding: '5px 10px', borderRadius: '5px', fontSize: '10px' };
const navStyle = { display: 'flex', justifyContent: 'center', gap: '20px', padding: '15px', borderBottom: '1px solid #222' };
const abaStyle = (a) => ({ background: 'none', border: 'none', color: a ? 'orange' : '#666', borderBottom: a ? '2px solid orange' : 'none', fontWeight: 'bold', cursor: 'pointer' });
const card = { backgroundColor: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #333' };
const btnG = { width: '100%', padding: '12px', backgroundColor: 'orange', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const btnP = { width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold' };
const userItem = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #222' };
const miniAvatar = { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid orange' };
const btnChat = { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' };
