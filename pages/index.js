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

export default function EmanuelNarutoMegaUpdate() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null });
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [resultadoIA, setResultadoIA] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [fotoZoom, setFotoZoom] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [usuariosVila, setUsuariosVila] = useState([]);
  const mediaRecorder = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) setUserData(snap.data());
        else {
          const init = { chakra: 50, avatarIA: null, nome: currentUser.displayName, online: true };
          await setDoc(userRef, init);
          setUserData(init);
        }
      } else setUser(null);
    });

    const qChat = query(collection(db, "chat"), orderBy("criadoEm", "desc"), limit(30));
    const unsubChat = onSnapshot(qChat, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
    
    const qVila = query(collection(db, "ninjas"), limit(20));
    const unsubVila = onSnapshot(qVila, (s) => setUsuariosVila(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsub(); unsubChat(); unsubVila(); };
  }, []);

  // --- FUNÇÕES DE ÁUDIO ---
  const iniciarGravacao = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();
    setGravando(true);
  };

  const pararGravacao = () => {
    mediaRecorder.current.stop();
    setGravando(false);
    mediaRecorder.current.ondataavailable = (e) => {
      const audioUrl = URL.createObjectURL(e.data);
      enviarMensagem(null, audioUrl);
    };
  };

  // --- FUNÇÕES DE IA ---
  const gerarIARealista = async (tipo) => {
    if (userData.chakra < 10) return alert("Chakra insuficiente para IA Realista!");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 999999);
    const promptMaster = tipo === 'video' 
      ? `cinematic 4k video of ${novaMsg}, unreal engine 5, naruto realistic style, 60fps`
      : `${novaMsg}, realistic naruto anime character, masterpiece, high details, 8k`;
    
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptMaster)}?seed=${seed}&width=1024&height=1024&nologo=true`;
    setResultadoIA(url);
    await updateDoc(doc(db, "ninjas", user.uid), { chakra: increment(-10) });
    setUserData(p => ({ ...p, chakra: p.chakra - 10 }));
    setCarregando(false);
  };

  // --- FUNÇÕES DE CONTA ---
  const deletarConta = async () => {
    if (window.confirm("Isso apagará seu registro de ninja para sempre. Tem certeza?")) {
      await deleteDoc(doc(db, "ninjas", user.uid));
      deleteUser(auth.currentUser).then(() => window.location.reload());
    }
  };

  const enviarMensagem = async (fileUrl = null, audioUrl = null) => {
    if (!user) return;
    await addDoc(collection(db, "chat"), {
      texto: novaMsg,
      imagem: fileUrl,
      audio: audioUrl,
      user: user.displayName.split(' ')[0],
      uid: user.uid,
      foto: userData.avatarIA || user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const corP = 'orange';

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* AMPLIFICADOR HD */}
      {fotoZoom && (
        <div onClick={() => setFotoZoom(null)} style={modalStyle}>
          <img src={fotoZoom} style={{ maxWidth: '95%', maxHeight: '85%', borderRadius: '10px', border: `3px solid orange`, boxShadow: '0 0 30px orange', filter: 'contrast(1.1) brightness(1.1)' }} />
          <p style={{ color: 'orange', fontWeight: 'bold', marginTop: '10px' }}>MODO AMPLIFICADO HD ⚡</p>
        </div>
      )}

      <header style={headerStyle}>
        <img src={userData.avatarIA || user?.photoURL} onClick={() => setFotoZoom(userData.avatarIA || user?.photoURL)} style={avatarStyle} />
        <div style={{ fontWeight: 'bold', color: 'orange' }}>🌀 {userData.chakra}C</div>
        <button onClick={() => user ? signOut(auth) : signInWithPopup(auth, provider)} style={btnMini}>{user ? 'SAIR' : 'LOGAR'}</button>
      </header>

      <nav style={navStyle}>
        <button onClick={() => setAbaAtiva('ia')} style={abaStyle(abaAtiva === 'ia')}>JUTSU IA</button>
        <button onClick={() => setAbaAtiva('chat')} style={abaStyle(abaAtiva === 'chat')}>VILA (CHAT)</button>
        <button onClick={() => setAbaAtiva('perfil')} style={abaStyle(abaAtiva === 'perfil')}>PERFIL</button>
      </nav>

      <main style={{ padding: '15px', maxWidth: '480px', margin: '0 auto' }}>
        
        {abaAtiva === 'ia' && (
          <div style={card}>
            <h3>Gerador Ninja Realista</h3>
            <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Descreva o personagem ou cena..." style={input} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => gerarIARealista('foto')} style={btnG}>FOTO 8K (10C)</button>
              <button onClick={() => gerarIARealista('video')} style={btnG}>VÍDEO REAL (10C)</button>
            </div>
            {resultadoIA && (
              <div style={{ marginTop: '20px' }}>
                <img src={resultadoIA} onClick={() => setFotoZoom(resultadoIA)} style={{ width: '100%', borderRadius: '10px', border: '1px solid orange' }} />
                <a href={resultadoIA} download style={btnLink}>BAIXAR ARQUIVO</a>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={card}>
            <div style={chatBox}>
              {mensagens.map(m => (
                <div key={m.id} style={{ marginBottom: '15px', textAlign: m.uid === user?.uid ? 'right' : 'left' }}>
                  <small style={{ color: 'orange' }}>{m.user}</small>
                  <div style={{ background: m.uid === user?.uid ? 'orange' : '#222', color: m.uid === user?.uid ? '#000' : '#fff', padding: '10px', borderRadius: '10px', display: 'inline-block', maxWidth: '80%' }}>
                    {m.texto && <div>{m.texto}</div>}
                    {m.imagem && <img src={m.imagem} onClick={() => setFotoZoom(m.imagem)} style={{ width: '100%', borderRadius: '5px' }} />}
                    {m.audio && <audio src={m.audio} controls style={{ width: '180px' }} />}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onMouseDown={iniciarGravacao} onMouseUp={pararGravacao} style={{ background: gravando ? 'red' : '#333', border: 'none', padding: '10px', borderRadius: '5px' }}>🎙️</button>
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mensagem..." style={input} />
              <button onClick={() => enviarMensagem()} style={btnG}>ENVIAR</button>
            </div>
          </div>
        )}

        {abaAtiva === 'perfil' && (
          <div style={card}>
             <h3>Configurações de Conta</h3>
             <button onClick={deletarConta} style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', width: '100%', fontWeight: 'bold' }}>EXCLUIR MINHA CONTA (ABANDONAR A VILA)</button>
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS
const modalStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const headerStyle = { padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid orange', backgroundColor: '#111' };
const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid orange', cursor: 'pointer' };
const btnMini = { background: 'none', border: '1px solid orange', color: '#fff', padding: '5px', borderRadius: '5px', fontSize: '10px' };
const navStyle = { display: 'flex', justifyContent: 'space-around', padding: '15px' };
const abaStyle = (a) => ({ background: 'none', border: 'none', color: a ? 'orange' : '#555', fontWeight: 'bold', borderBottom: a ? '2px solid orange' : 'none' });
const card = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const input = { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid orange', backgroundColor: '#222', color: '#fff' };
const btnG = { backgroundColor: 'orange', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' };
const chatBox = { height: '350px', overflowY: 'scroll', padding: '10px', backgroundColor: '#000', borderRadius: '10px', marginBottom: '10px' };
const btnLink = { display: 'block', marginTop: '10px', color: 'orange', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' };
