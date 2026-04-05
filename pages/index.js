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

export default function EmanuelNarutoSocialAI() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null, tema: 'folha', fontSize: '14px' });
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [segundosOnline, setSegundosOnline] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [usuariosVila, setUsuariosVila] = useState([]);
  const fileInputRef = useRef(null);

  // 1. Monitoramento de Usuário, Chakra e Tempo Online
  useEffect(() => {
    let timer;
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        timer = setInterval(() => setSegundosOnline(s => s + 1), 1000);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const dados = snap.data();
          // Garante que o Chakra não seja nulo e respeite os 50 iniciais
          setUserData({ ...dados, chakra: dados.chakra || 50 });
        } else {
          const init = { chakra: 50, avatarIA: null, tema: 'folha', fontSize: '14px', nome: currentUser.displayName, online: true };
          await setDoc(userRef, init);
          setUserData(init);
        }
      } else {
        setUser(null);
        clearInterval(timer);
      }
    });

    // 2. Lista de Ninjas Online no Banco
    const qUsers = query(collection(db, "ninjas"), limit(10));
    const unsubUsers = onSnapshot(qUsers, (s) => setUsuariosVila(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    // 3. Chat em tempo real
    const qChat = query(collection(db, "chat"), orderBy("criadoEm", "desc"), limit(25));
    const unsubChat = onSnapshot(qChat, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));

    return () => { unsub(); unsubUsers(); unsubChat(); clearInterval(timer); };
  }, []);

  const formatarTempo = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    return `${d}d ${h}h ${m}m ${seg}s`;
  };

  const gerarAvatar = async () => {
    if (userData.chakra < 5) return alert("Chakra insuficiente! Assista um anúncio.");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/face-portrait-of-a-ninja-from-naruto-anime-style-clean-background-high-quality?seed=${seed}&width=512&height=512&nologo=true`;
    setResultado(url);
    setCarregando(false);
  };

  const definirAvatar = async () => {
    const userRef = doc(db, "ninjas", user.uid);
    await updateDoc(userRef, { avatarIA: resultado, chakra: increment(-5) });
    setUserData(p => ({ ...p, avatarIA: resultado, chakra: p.chakra - 5 }));
    alert("🔥 Jutsu de Perfil! Foto atualizada.");
  };

  const enviarMsg = async (textoEspecial = null) => {
    if (!user || (!novaMsg && !textoEspecial)) return;
    await addDoc(collection(db, "chat"), {
      texto: textoEspecial || novaMsg,
      user: user.displayName,
      foto: userData.avatarIA || user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const monetizacaoAnuncio = async () => {
    alert("🎥 Assistindo Anúncio Ninja...");
    setTimeout(async () => {
      const userRef = doc(db, "ninjas", user.uid);
      await updateDoc(userRef, { chakra: increment(10) });
      setUserData(p => ({ ...p, chakra: p.chakra + 10 }));
      alert("✅ +10 de Chakra recebidos!");
    }, 3000);
  };

  const corPrincipal = userData.tema === 'akatsuki' ? '#ff0000' : userData.tema === 'areia' ? '#c2b280' : '#ff9800';

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui', fontSize: userData.fontSize }}>
      
      {/* HEADER DINÂMICO */}
      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: `3px solid ${corPrincipal}`, background: '#111', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: `2px solid ${corPrincipal}`, position: 'relative', overflow: 'hidden' }}>
            <img src={userData.avatarIA || user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=naruto"} style={{ width: '100%' }} />
            {user && <div style={{ position: 'absolute', bottom: 2, right: 2, width: '12px', height: '12px', backgroundColor: '#00ff00', borderRadius: '50%', border: '2px solid #000' }} />}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{user ? user.displayName : 'NINJA VISITANTE'}</div>
            {user && <div style={{ fontSize: '10px', color: '#00ff00' }}>ONLINE: {formatarTempo(segundosOnline)}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: corPrincipal, fontWeight: 'bold' }}>🌀 {userData.chakra}C</div>
          <button onClick={() => user ? signOut(auth).then(() => window.location.reload()) : signInWithPopup(auth, provider)} style={{ background: corPrincipal, color: '#000', border: 'none', padding: '4px 10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
            {user ? 'SAIR' : 'CONECTAR'}
          </button>
        </div>
      </header>

      {/* NAVEGAÇÃO */}
      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '15px', background: '#0a0a0a' }}>
        {['ia', 'chat', 'vila', 'perfil'].map(t => (
          <button key={t} onClick={() => setAbaAtiva(t)} style={{ background: 'none', border: 'none', color: abaAtiva === t ? corPrincipal : '#555', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>{t}</button>
        ))}
      </nav>

      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '15px' }}>
        
        {/* ABA IA: AVATAR E ANIMAÇÃO */}
        {abaAtiva === 'ia' && (
          <div style={cardStyle}>
            <h2 style={{ color: corPrincipal }}>Laboratório de Invocação</h2>
            <button onClick={gerarAvatar} style={btnPrincipal(corPrincipal)} disabled={carregando}>
              {carregando ? 'CONCENTRANDO CHAKRA...' : 'GERAR AVATAR NINJA (5C)'}
            </button>
            <button onClick={() => alert("Redirecionando para Jutsu de Animação...")} style={{ ...btnPrincipal('#333'), marginTop: '10px' }}>🎥 CRIAR ANIMAÇÃO AGORA</button>
            
            {resultado && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <img src={resultado} style={{ width: '100%', borderRadius: '15px', border: `3px solid ${corPrincipal}` }} />
                <button onClick={definirAvatar} style={btnSucesso}>DEFINIR COMO FOTO DE PERFIL</button>
                <a href={resultado} download="meu_avatar_ninja.png" style={btnDownload}>DOWNLOAD DA IMAGEM</a>
              </div>
            )}
            <button onClick={monetizacaoAnuncio} style={btnAnuncio}>📺 GANHAR +10 CHAKRA (ANÚNCIO)</button>
          </div>
        )}

        {/* ABA CHAT: CONVERSA E SUGESTÕES */}
        {abaAtiva === 'chat' && (
          <div style={cardStyle}>
            <button onClick={() => enviarMsg("Vamos falar sobre Naruto! Quem é o mais forte?")} style={btnSugestao}>Começar um bate-papo agora! 💬</button>
            <div style={chatBox}>
              {mensagens.map(m => (
                <div key={m.id} style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                  <img src={m.foto} style={{ width: '25px', height: '25px', borderRadius: '50%' }} />
                  <div>
                    <b style={{ color: corPrincipal, fontSize: '11px' }}>{m.user}:</b>
                    <div style={{ background: '#222', padding: '8px', borderRadius: '8px', marginTop: '3px' }}>{m.texto}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => fileInputRef.current.click()} style={btnAcao}>📎</button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Sua mensagem..." style={inputChat(corPrincipal)} />
              <button onClick={() => enviarMsg()} style={btnIcon(corPrincipal)}>⚡</button>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {['🍥', '🦊', '⚡', '👁️', '🔥'].map(e => <button key={e} onClick={() => enviarMsg(e)} style={btnEmoji}>{e}</button>)}
            </div>
          </div>
        )}

        {/* ABA VILA: QUEM ESTÁ ONLINE */}
        {abaAtiva === 'vila' && (
          <div style={cardStyle}>
            <h3 style={{ color: corPrincipal }}>Ninjas na Vila</h3>
            {usuariosVila.map(u => (
              <div key={u.id} style={userItem}>
                <img src={u.avatarIA || u.fotoGoogle || "https://api.dicebear.com/7.x/avataaars/svg?seed=ninja"} style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid orange' }} />
                <span style={{ flex: 1 }}>{u.nome}</span>
                <button onClick={() => { setAbaAtiva('chat'); setNovaMsg(`@${u.nome.split(' ')[0]} `); }} style={btnAcao}>Conversar</button>
              </div>
            ))}
            <button onClick={() => setAbaAtiva('ia')} style={btnSugestao}>Vamos criar uma animação agora? 🎬</button>
          </div>
        )}

        {/* ABA PERFIL: PERSONALIZAÇÃO */}
        {abaAtiva === 'perfil' && (
          <div style={cardStyle}>
            <h3 style={{ color: corPrincipal }}>Configurações do Ninja</h3>
            <p>Tema da Vila:</p>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
              {['folha', 'akatsuki', 'areia'].map(t => (
                <button key={t} onClick={() => updateDoc(doc(db, "ninjas", user.uid), { tema: t })} style={btnTema(t)}>{t}</button>
              ))}
            </div>
            <p>Tamanho da Letra:</p>
            <input type="range" min="12" max="22" value={parseInt(userData.fontSize)} onChange={(e) => {
              const val = e.target.value + 'px';
              setUserData(p => ({ ...p, fontSize: val }));
              updateDoc(doc(db, "ninjas", user.uid), { fontSize: val });
            }} style={{ width: '100%' }} />
          </div>
        )}

      </main>
    </div>
  );
}

// ESTILOS NINJA
const cardStyle = { backgroundColor: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222', marginBottom: '20px' };
const btnPrincipal = (c) => ({ width: '100%', padding: '15px', backgroundColor: c, border: 'none', borderRadius: '10px', fontWeight: 'bold', color: '#000', cursor: 'pointer' });
const btnSucesso = { width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '10px', fontWeight: 'bold' };
const btnDownload = { display: 'block', textAlign: 'center', marginTop: '10px', color: '#aaa', textDecoration: 'none', fontSize: '12px' };
const btnAnuncio = { width: '100%', padding: '10px', marginTop: '20px', backgroundColor: '#ffd700', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold' };
const chatBox = { height: '300px', overflowY: 'scroll', backgroundColor: '#000', padding: '10px', borderRadius: '10px', marginBottom: '10px' };
const inputChat = (c) => ({ flex: 1, padding: '12px', background: '#222', border: `1px solid ${c}`, color: '#fff', borderRadius: '8px' });
const btnSugestao = { width: '100%', padding: '10px', backgroundColor: '#ff9800', border: 'none', borderRadius: '8px', marginBottom: '10px', fontWeight: 'bold', cursor: 'pointer' };
const btnAcao = { background: '#333', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '11px' };
const userItem = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #222' };
const btnEmoji = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' };
const btnIcon = (c) => ({ backgroundColor: c, border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' });
const btnTema = (t) => ({ flex: 1, padding: '10px', border: 'none', borderRadius: '5px', fontWeight: 'bold', backgroundColor: t === 'folha' ? 'orange' : t === 'akatsuki' ? 'red' : '#c2b280' });
