import React, { useState, useEffect, useRef } from 'react';
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
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function EmanuelNarutoFinal() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null, tema: 'folha', fonteSize: '14px' });
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [segundosOnline, setSegundosOnline] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const fileInputRef = useRef(null);

  // 1. Contador Online e Monitoramento de Usuário
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
          const init = { chakra: 50, avatarIA: null, tema: 'folha', fonteSize: '14px', nome: currentUser.displayName };
          await setDoc(userRef, init);
          setUserData(init);
        }
      } else {
        setUser(null);
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

  const handleAuth = () => user ? signOut(auth).then(() => window.location.reload()) : signInWithPopup(auth, provider);

  const formatarTempo = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${d}d ${h}h ${m}m ${seg}s`;
  };

  const gerarAvatar = async () => {
    if (userData.chakra < 5) return alert("Chakra insuficiente! (Mínimo 5C)");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 100000);
    const url = `https://image.pollinations.ai/prompt/portrait%20of%20a%20naruto%20ninja%20anime%20style%20detailed%20face%20profile?seed=${seed}&width=512&height=512&nologo=true`;
    setResultado(url);
    setCarregando(false);
  };

  const definirComoPerfil = async () => {
    const userRef = doc(db, "ninjas", user.uid);
    await updateDoc(userRef, { avatarIA: resultado, chakra: increment(-5) });
    setUserData(p => ({ ...p, avatarIA: resultado, chakra: p.chakra - 5 }));
    alert("🔥 Jutsu de Transformação concluído! Perfil atualizado.");
  };

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

  const mudarTema = async (t) => {
    setUserData(p => ({ ...p, tema: t }));
    if (user) await updateDoc(doc(db, "ninjas", user.uid), { tema: t });
  };

  const coresTema = {
    folha: 'orange',
    akatsuki: 'red',
    areia: '#c2b280',
    raio: '#00ccff'
  };

  const corPrincipal = coresTema[userData.tema] || 'orange';

  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: '#fff', 
      minHeight: '100vh', 
      fontFamily: userData.tema === 'akatsuki' ? 'serif' : 'sans-serif',
      fontSize: userData.fonteSize 
    }}>
      
      <header style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${corPrincipal}`, backgroundColor: '#111' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${corPrincipal}`, position: 'relative', overflow: 'hidden' }}>
            <img src={userData.avatarIA || user?.photoURL || ""} style={{ width: '100%' }} />
            {user && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', backgroundColor: '#00ff00', borderRadius: '50%', border: '1px solid #000' }} />}
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{user ? user.displayName : 'CONVIDADO'}</div>
            {user && <div style={{ fontSize: '9px', color: '#00ff00' }}>ON: {formatarTempo(segundosOnline)}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ color: corPrincipal, fontWeight: 'bold' }}>🌀 {userData.chakra}C</div>
          <button onClick={handleAuth} style={{ padding: '5px 10px', borderRadius: '5px', border: `1px solid ${corPrincipal}`, background: 'none', color: '#fff', cursor: 'pointer' }}>
            {user ? 'SAIR' : 'LOGAR'}
          </button>
        </div>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '10px' }}>
        {['ia', 'chat', 'perfil'].map(tab => (
          <button key={tab} onClick={() => setAbaAtiva(tab)} style={{ background: 'none', border: 'none', color: abaAtiva === tab ? corPrincipal : '#555', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {tab}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        
        {abaAtiva === 'ia' && (
          <div style={cardEstilo}>
            <h3>Invocar Novo Avatar</h3>
            <button onClick={gerarAvatar} style={btnGrande(corPrincipal)} disabled={carregando}>
              {carregando ? 'CONCENTRANDO CHAKRA...' : 'GERAR AVATAR NINJA (5C)'}
            </button>
            {resultado && (
              <div style={{ marginTop: '20px' }}>
                <img src={resultado} style={{ width: '100%', borderRadius: '15px', border: `2px solid ${corPrincipal}` }} />
                <button onClick={definirComoPerfil} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                  DEFINIR COMO FOTO DE PERFIL
                </button>
                <a href={resultado} download="meu_ninja.png" style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: corPrincipal }}>DOWNLOAD ARQUIVO</a>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={cardEstilo}>
            <div style={{ height: '300px', overflowY: 'scroll', backgroundColor: '#000', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
              {mensagens.map(m => (
                <div key={m.id} style={{ marginBottom: '10px' }}>
                  <b style={{ color: corPrincipal }}>{m.user}: </b> {m.texto}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => fileInputRef.current.click()} style={{ background: '#333', border: 'none', padding: '10px', borderRadius: '5px' }}>📎</button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={() => alert("Pergaminho enviado!")} />
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} style={inputEstilo(corPrincipal)} placeholder="Mensagem..." />
              <button onClick={() => enviarMsg()} style={{ backgroundColor: corPrincipal, border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>ENVIAR</button>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {['🍥', '🦊', '🔥', '⚡', '👁️'].map(e => <button key={e} onClick={() => enviarMsg(e)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>{e}</button>)}
            </div>
          </div>
        )}

        {abaAtiva === 'perfil' && (
          <div style={cardEstilo}>
            <h3>Customização Ninja</h3>
            <p>Escolha seu Tema:</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              <button onClick={() => mudarTema('folha')} style={{ padding: '10px', backgroundColor: 'orange', borderRadius: '5px', border: 'none' }}>Folha</button>
              <button onClick={() => mudarTema('akatsuki')} style={{ padding: '10px', backgroundColor: 'red', borderRadius: '5px', border: 'none', color: '#fff' }}>Akatsuki</button>
              <button onClick={() => mudarTema('raio')} style={{ padding: '10px', backgroundColor: '#00ccff', borderRadius: '5px', border: 'none' }}>Raio</button>
            </div>
            <p>Tamanho da Letra:</p>
            <input type="range" min="12" max="24" onChange={(e) => setUserData(p => ({ ...p, fonteSize: e.target.value + 'px' }))} style={{ width: '100%' }} />
          </div>
        )}

      </main>
    </div>
  );
}

const cardEstilo = { backgroundColor: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222' };
const inputEstilo = (c) => ({ flex: 1, padding: '10px', borderRadius: '5px', border: `1px solid ${c}`, backgroundColor: '#222', color: '#fff' });
const btnGrande = (c) => ({ width: '100%', padding: '15px', backgroundColor: c, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' });
