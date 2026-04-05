import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "firebase/firestore";

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
  const [segundosOnline, setSegundosOnline] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([]);

  // 1. Contador de Tempo Online
  useEffect(() => {
    let intervalo;
    if (user) {
      intervalo = setInterval(() => {
        setSegundosOnline(prev => prev + 1);
      }, 1000);
    } else {
      setSegundosOnline(0);
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [user]);

  // Formata o tempo (Dias, Horas, Minutos, Segundos)
  const formatarTempo = (totalSegundos) => {
    const dias = Math.floor(totalSegundos / (3600 * 24));
    const horas = Math.floor((totalSegundos % (3600 * 24)) / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };

  // 2. Monitor de Autenticação
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUserData(userSnap.data());
        else {
          const inicial = { chakra: 5, avatarIA: null, nome: currentUser.displayName };
          await setDoc(userRef, inicial);
          setUserData(inicial);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const handleAuth = async () => {
    if (user) await signOut(auth);
    else await signInWithPopup(auth, provider);
  };

  const gerarMidia = async (custo) => {
    if (!user) return alert("Conecte-se para usar o Jutsu!");
    if (userData.chakra < custo) return alert("Chakra insuficiente!");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " naruto anime style")}?seed=${seed}&nologo=true`;
    
    const img = new Image();
    img.src = url;
    img.onload = async () => {
      const userRef = doc(db, "ninjas", user.uid);
      await updateDoc(userRef, { chakra: increment(-custo) });
      setUserData(prev => ({ ...prev, chakra: prev.chakra - custo }));
      setResultado(url);
      setCarregando(false);
    };
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER COM STATUS ONLINE */}
      <header style={headerEstilo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={miniAvatar}>
            <img src={userData.avatarIA || user?.photoURL || ""} style={{width:'100%', height:'100%', objectFit:'cover'}} />
            {user && <div style={pontoOnline}></div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{fontSize:'10px', color:'orange', fontWeight:'bold'}}>
              {user ? user.displayName.split(' ')[0] : 'VISITANTE'}
            </span>
            {user && <span style={{fontSize:'8px', color:'#00ff00'}}>ONLINE: {formatarTempo(segundosOnline)}</span>}
          </div>
        </div>
        <button onClick={handleAuth} style={btnAuth}>
          {user ? 'SAIR' : 'CONECTAR'}
        </button>
      </header>

      <nav style={navEstilo}>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>JUTSU IA</button>
        <button onClick={() => setAbaAtiva('status')} style={abaEstilo(abaAtiva === 'status')}>SESSÃO</button>
        <div style={badgeChakra}>🌀 {userData.chakra} C</div>
      </nav>

      <main style={{ padding: '15px', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
        
        {abaAtiva === 'ia' && (
          <div style={card}>
            <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Invoque sua arte..." style={input} />
            <button onClick={() => gerarMidia(1)} disabled={carregando} style={btnG}>GERAR ARTE (1C)</button>
            {resultado && (
              <div style={resCont}>
                <img src={resultado} style={{width:'100%', borderRadius:'10px'}} />
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'status' && (
          <div style={card}>
            <h3 style={{color:'orange'}}>Registro de Atividade</h3>
            <div style={boxTempo}>
              <p style={{fontSize:'14px'}}>Tempo de Treinamento nesta sessão:</p>
              <h2 style={{color:'#00ff00', margin:'10px 0'}}>{formatarTempo(segundosOnline)}</h2>
              <p style={{fontSize:'12px', color:'#888'}}>Mantenha o portal aberto para acumular tempo online!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS
const headerEstilo = { padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', borderBottom: '2px solid orange' };
const miniAvatar = { width: '35px', height: '35px', borderRadius: '50%', border: '2px solid orange', position: 'relative', overflow: 'visible', backgroundColor:'#333' };
const pontoOnline = { width: '10px', height: '10px', backgroundColor: '#00ff00', borderRadius: '50%', position: 'absolute', bottom: '0', right: '0', border: '2px solid #111', animation: 'pulse 1.5s infinite' };
const btnAuth = { backgroundColor: '#333', color: '#fff', border: '1px solid orange', padding: '5px 12px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' };
const badgeChakra = { color: 'orange', fontWeight: 'bold', fontSize: '12px', padding: '5px' };
const navEstilo = { display: 'flex', justifyContent: 'center', alignItems:'center', gap: '20px', padding: '10px' };
const abaEstilo = (a) => ({ background: 'none', border: 'none', color: a ? 'orange' : '#666', borderBottom: a ? '2px solid orange' : 'none', fontWeight: 'bold', fontSize:'12px' });
const card = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' };
const input = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid orange', backgroundColor: '#222', color: '#fff' };
const btnG = { width: '100%', padding: '10px', backgroundColor: 'orange', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const resCont = { marginTop: '15px', border: '1px solid orange', padding: '10px', borderRadius: '10px' };
const boxTempo = { padding: '20px', border: '1px dashed #444', borderRadius: '10px', marginTop: '10px' };

// Adicione este CSS no seu arquivo global ou dentro de um <style> para a animação da bolinha
// @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
