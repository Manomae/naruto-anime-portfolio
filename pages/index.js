import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
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
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');

  // 1. Monitorar Usuário e Chakra
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          const inicial = { chakra: 5, avatarIA: null, nome: currentUser.displayName };
          await setDoc(userRef, inicial);
          setUserData(inicial);
        }
      }
    });

    // 2. Monitorar Chat em Tempo Real
    const q = query(collection(db, "chat"), orderBy("criadoEm", "desc"), limit(20));
    const unsubChat = onSnapshot(q, (snapshot) => {
      setMensagens(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse());
    });

    return () => { unsubAuth(); unsubChat(); };
  }, []);

  const enviarMensagem = async (emoji = "") => {
    if (!user) return alert("Logue para falar!");
    const textoFinal = emoji ? emoji : novaMsg;
    if (!textoFinal.trim()) return;

    await addDoc(collection(db, "chat"), {
      texto: textoFinal,
      user: user.displayName.split(' ')[0],
      foto: userData.avatarIA || user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const ganharChakra = async () => {
    if (!user) return;
    const userRef = doc(db, "ninjas", user.uid);
    await updateDoc(userRef, { chakra: increment(5) });
    setUserData(prev => ({ ...prev, chakra: prev.chakra + 5 }));
    alert("✅ +5 Chakra!");
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <header style={headerEstilo}>
        <h4 style={{ color: 'orange', margin: 0, fontSize: '12px' }}>EMANUEL NARUTO AI</h4>
        <div style={badgeChakra}>Chakra: {userData.chakra}</div>
      </header>

      <nav style={navEstilo}>
        <button onClick={() => setAbaAtiva('perfil')} style={abaEstilo(abaAtiva === 'perfil')}>Perfil</button>
        <button onClick={() => setAbaAtiva('chat')} style={abaEstilo(abaAtiva === 'chat')}>Vila (Chat)</button>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>IA</button>
      </nav>

      <main style={{ padding: '15px', maxWidth: '450px', margin: '0 auto' }}>
        
        {abaAtiva === 'perfil' && (
          <div style={card}>
            <div style={molduraAvatar}>
              <img src={userData.avatarIA || user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=1"} style={imgStyle} />
            </div>
            <h3 style={{ color: 'orange' }}>{user?.displayName || "Desconectado"}</h3>
            {!user && <button onClick={() => signInWithPopup(auth, provider)} style={btnGoogle}>Logar com Google</button>}
            <button onClick={ganharChakra} style={btnAnuncio}>📺 ASSISTIR ANÚNCIO (+5C)</button>
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={card}>
            <div style={chatBox}>
              {mensagens.map(m => (
                <div key={m.id} style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'orange', fontSize: '11px', fontWeight: 'bold' }}>{m.user}: </span>
                  <span style={{ fontSize: '14px' }}>{m.texto}</span>
                </div>
              ))}
            </div>
            {/* SELETOR DE EMOJIS NINJA */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', justifyContent: 'center' }}>
              {['🍥', '🦊', '⚡', '🗡️', '🔥'].map(e => (
                <button key={e} onClick={() => enviarMensagem(e)} style={btnEmoji}>{e}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Fala ae, Ninja..." style={inputChat} />
              <button onClick={() => enviarMensagem()} style={btnSend}>Enviar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS
const headerEstilo = { padding: '10px 15px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111' };
const badgeChakra = { color: 'orange', fontWeight: 'bold', fontSize: '12px', border: '1px solid orange', padding: '4px 10px', borderRadius: '15px' };
const navEstilo = { display: 'flex', justifyContent: 'center', gap: '15px', padding: '10px' };
const abaEstilo = (a) => ({ background: 'none', border: 'none', color: a ? 'orange' : '#666', borderBottom: a ? '2px solid orange' : 'none', fontWeight: 'bold', cursor: 'pointer' });
const card = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' };
const chatBox = { height: '250px', backgroundColor: '#000', borderRadius: '10px', padding: '10px', overflowY: 'scroll', textAlign: 'left', marginBottom: '10px', border: '1px solid #222' };
const inputChat = { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid orange', backgroundColor: '#222', color: '#fff' };
const btnSend = { backgroundColor: 'orange', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' };
const btnEmoji = { background: '#222', border: '1px solid #444', borderRadius: '5px', padding: '5px', fontSize: '18px', cursor: 'pointer' };
const molduraAvatar = { width: '100px', height: '100px', borderRadius: '50%', border: '3px solid orange', margin: '0 auto 15px', overflow: 'hidden' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const btnGoogle = { backgroundColor: '#4285F4', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', marginBottom: '10px', fontWeight: 'bold' };
const btnAnuncio = { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', width: '100%', fontWeight: 'bold' };
