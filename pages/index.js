import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "firebase/firestore";

// CONFIGURAÇÃO DO SEU FIREBASE
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

export default function EmanuelNarutoFinal() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null, tema: 'folha', fontSize: '14px' });
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [segundosOnline, setSegundosOnline] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const fileInputRef = useRef(null);

  // 1. Monitor de Usuário e Tempo Online
  useEffect(() => {
    let timer;
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        timer = setInterval(() => setSegundosOnline(s => s + 1), 1000);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          const init = { chakra: 50, avatarIA: null, tema: 'folha', fontSize: '14px', nome: currentUser.displayName };
          await setDoc(userRef, init);
          setUserData(init);
        }
      } else {
        setUser(null);
        setSegundosOnline(0);
        clearInterval(timer);
      }
    });
    return () => { unsub(); clearInterval(timer); };
  }, []);

  // 2. Chat em tempo real
  useEffect(() => {
    const q = query(collection(db, "chat"), orderBy("criadoEm", "desc"), limit(20));
    return onSnapshot(q, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
  }, []);

  const formatarTempo = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${d}d ${h}h ${m}m ${seg}s`;
  };

  // 3. Funções de IA e Perfil
  const gerarAvatar = async () => {
    if (userData.chakra < 5) return alert("Chakra insuficiente!");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 100000);
    // Link direto de imagem para garantir funcionamento
    const url = `https://image.pollinations.ai/prompt/portrait-of-naruto-anime-ninja-detailed-face?seed=${seed}&nologo=true`;
    setResultado(url);
    setCarregando(false);
  };

  const definirComoPerfil = async () => {
    const userRef = doc(db, "ninjas", user.uid);
    await updateDoc(userRef, { avatarIA: resultado, chakra: increment(-5) });
    setUserData(p => ({ ...p, avatarIA: resultado, chakra: p.chakra - 5 }));
    alert("🔥 Jutsu de Transformação! Perfil atualizado.");
    setResultado(null);
  };

  // 4. Chat e Emojis
  const enviarMsg = async (emoji = null) => {
    if (!user || (!novaMsg && !emoji)) return;
    await addDoc(collection(db, "chat"), {
      texto: emoji || novaMsg,
      user: user.displayName.split(' ')[0],
      foto: userData.avatarIA || user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const corPrincipal = userData.tema === 'akatsuki' ? '#ff0000' : 'orange';

  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', 
      fontFamily: userData.tema === 'akatsuki' ? 'serif' : 'sans-serif',
      fontSize: userData.fontSize 
    }}>
      
      {/* HEADER STATUS */}
      <header style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${corPrincipal}`, backgroundColor: '#111' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: `2px solid ${corPrincipal}`, position: 'relative', overflow: 'hidden', backgroundColor: '#222' }}>
            <img src={userData.avatarIA || user?.photoURL || ""} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {user && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', backgroundColor: '#00ff00', borderRadius: '50%', border: '1px solid #000' }} />}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: corPrincipal }}>{user ? user.displayName : 'VISITANTE'}</div>
            {user && <div style={{ fontSize: '9px', color: '#00ff00' }}>TEMPO: {formatarTempo(segundosOnline)}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ color: corPrincipal, fontWeight: 'bold', fontSize: '14px' }}>🌀 {userData.chakra}C</div>
           <button onClick={() => user ? signOut(auth) : signInWithPopup(auth, provider)} style={{ background: 'none', border: `1px solid ${corPrincipal}`, color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>
             {user ? 'SAIR' : 'LOGAR'}
           </button>
        </div>
      </header>

      {/* MENU ABAS */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '15px' }}>
        {['ia', 'chat', 'perfil'].map(t => (
          <button key={t} onClick={() => setAbaAtiva(t)} style={{ background: 'none', border: 'none', color: abaAtiva === t ? corPrincipal : '#666', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>{t}</button>
        ))}
      </nav>

      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '15px' }}>
        
        {abaAtiva === 'ia' && (
          <div style={cardStyle}>
            <h3 style={{color: corPrincipal}}>Invocação Ninja</h3>
            <button onClick={gerarAvatar} style={btnStyle(corPrincipal)} disabled={carregando}>
              {carregando ? 'CONCENTRANDO...' : 'GERAR AVATAR (5C)'}
            </button>
            {resultado && (
              <div style={{ marginTop: '20px', border: `2px solid ${corPrincipal}`, padding: '10px', borderRadius: '15px' }}>
                <img src={resultado} style={{ width: '100%', borderRadius: '10px' }} />
                <button onClick={definirComoPerfil} style={{ width: '100%', padding: '12px', marginTop: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>USAR NO PERFIL</button>
                <a href={resultado} download style={{ display: 'block', marginTop: '10px', color: corPrincipal, textDecoration: 'none', fontWeight: 'bold' }}>⬇️ DOWNLOAD</a>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={cardStyle}>
            <div style={{ height: '300px', overflowY: 'scroll', backgroundColor: '#000', padding: '10px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #333' }}>
              {mensagens.map(m => (
                <div key={m.id} style={{ marginBottom: '8px', fontSize: '13px' }}>
                  <b style={{ color: corPrincipal }}>{m.user}: </b> {m.texto}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => fileInputRef.current.click()} style={{ background: '#222', border: 'none', padding: '10px', borderRadius: '5px' }}>📎</button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={() => alert("Arquivo Ninja selecionado!")} />
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mensagem..." style={{ flex: 1, padding: '10px', backgroundColor: '#222', color: '#fff', border: `1px solid ${corPrincipal}`, borderRadius: '5px' }} />
              <button onClick={() => enviarMsg()} style={{ backgroundColor: corPrincipal, border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>ENVIAR</button>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
              {['🍥', '🦊', '🔥', '⚡'].map(e => <button key={e} onClick={() => enviarMsg(e)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>{e}</button>)}
            </div>
          </div>
        )}

        {abaAtiva === 'perfil' && (
          <div style={cardStyle}>
            <h3 style={{color: corPrincipal}}>Configurações</h3>
            <p>Tema da Vila:</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
              <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { tema: 'folha' })} style={{ padding: '8px', backgroundColor: 'orange', borderRadius: '5px', border: 'none', fontWeight: 'bold' }}>Folha</button>
              <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { tema: 'akatsuki' })} style={{ padding: '8px', backgroundColor: 'red', borderRadius: '5px', border: 'none', color: '#fff', fontWeight: 'bold' }}>Akatsuki</button>
            </div>
            <p>Tamanho da Letra: {userData.fontSize}</p>
            <input type="range" min="12" max="22" value={parseInt(userData.fontSize)} onChange={async (e) => {
              const val = e.target.value + 'px';
              setUserData(p => ({ ...p, fontSize: val }));
              if (user) await updateDoc(doc(db, "ninjas", user.uid), { fontSize: val });
            }} style={{ width: '100%' }} />
          </div>
        )}
      </main>
    </div>
  );
}

const cardStyle = { backgroundColor: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' };
const btnStyle = (c) => ({ width: '100%', padding: '15px', backgroundColor: c, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' });
