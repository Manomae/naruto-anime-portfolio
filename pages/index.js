import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
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

export default function EmanuelNarutoFinalBoss() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null, tema: 'folha' });
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [segundosOnline, setSegundosOnline] = useState(0);
  const [resultadoIA, setResultadoIA] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [msgEditando, setMsgEditando] = useState(null);
  const [fotoZoom, setFotoZoom] = useState(null);
  const [ninjasVila, setNinjasVila] = useState([]);
  const fileInputRef = useRef(null);

  // 1. Sistema de Usuário e Tempo
  useEffect(() => {
    let timer;
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        timer = setInterval(() => setSegundosOnline(s => s + 1), 1000);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) setUserData(snap.data());
        else {
          const init = { chakra: 50, avatarIA: null, tema: 'folha', nome: currentUser.displayName, online: true };
          await setDoc(userRef, init);
          setUserData(init);
        }
      } else { setUser(null); clearInterval(timer); }
    });

    const qChat = query(collection(db, "chat"), orderBy("criadoEm", "desc"), limit(25));
    const unsubChat = onSnapshot(qChat, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
    
    const qVila = query(collection(db, "ninjas"), limit(10));
    const unsubVila = onSnapshot(qVila, (s) => setNinjasVila(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsub(); unsubChat(); unsubVila(); clearInterval(timer); };
  }, []);

  // 2. Funções de IA
  const gerarIA = async (tipo, custo) => {
    if (!user) return alert("Logue para invocar!");
    if (userData.chakra < custo) return alert("Chakra insuficiente!");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 999999);
    const promptFinal = tipo === 'video' ? `animation of ${novaMsg || 'naruto'} anime style` : `${novaMsg || 'naruto'} high quality anime`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptFinal)}?seed=${seed}&nologo=true&width=1024&height=1024`;
    
    const img = new Image();
    img.src = url;
    img.onload = async () => {
      await updateDoc(doc(db, "ninjas", user.uid), { chakra: increment(-custo) });
      setUserData(p => ({ ...p, chakra: p.chakra - custo }));
      setResultadoIA(url);
      setCarregando(false);
    };
  };

  // 3. Funções de Chat
  const enviarMensagem = async (fileUrl = null) => {
    if (!user) return;
    if (msgEditando) {
      await updateDoc(doc(db, "chat", msgEditando.id), { texto: novaMsg });
      setMsgEditando(null);
    } else {
      await addDoc(collection(db, "chat"), {
        texto: fileUrl ? "" : novaMsg,
        imagem: fileUrl || null,
        uid: user.uid,
        user: user.displayName.split(' ')[0],
        foto: userData.avatarIA || user.photoURL,
        criadoEm: serverTimestamp()
      });
    }
    setNovaMsg('');
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => enviarMensagem(ev.target.result);
    reader.readAsDataURL(file);
  };

  const corP = userData.tema === 'akatsuki' ? '#ff0000' : 'orange';

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* ZOOM DAS IMAGENS */}
      {fotoZoom && (
        <div onClick={() => setFotoZoom(null)} style={modalStyle}>
          <img src={fotoZoom} style={{ maxWidth: '90%', maxHeight: '80%', borderRadius: '15px', border: `4px solid ${corP}` }} />
          <p style={{ color: corP, fontWeight: 'bold', marginTop: '15px' }}>CLIQUE PARA VOLTAR 🔙</p>
        </div>
      )}

      {/* HEADER STATUS */}
      <header style={{ padding: '10px 15px', borderBottom: `2px solid ${corP}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={userData.avatarIA || user?.photoURL} onClick={() => setFotoZoom(userData.avatarIA || user?.photoURL)} style={avatarStyle(corP)} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{user ? user.displayName : 'DESCONECTADO'}</div>
            {user && <div style={{ fontSize: '9px', color: '#00ff00' }}>ONLINE: {Math.floor(segundosOnline/60)}m {segundosOnline%60}s</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: corP, fontWeight: 'bold' }}>🌀 {userData.chakra}C</div>
          <button onClick={() => user ? signOut(auth) : signInWithPopup(auth, provider)} style={btnAuth(corP)}>
            {user ? 'SAIR' : 'CONECTAR'}
          </button>
        </div>
      </header>

      {/* MENU DE ABAS */}
      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '15px', background: '#0a0a0a' }}>
        {['ia', 'chat', 'vila'].map(t => (
          <button key={t} onClick={() => setAbaAtiva(t)} style={{ background: 'none', border: 'none', color: abaAtiva === t ? corP : '#555', fontWeight: 'bold', textTransform: 'uppercase' }}>{t}</button>
        ))}
      </nav>

      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '15px' }}>
        
        {/* ABA IA */}
        {abaAtiva === 'ia' && (
          <div style={cardStyle}>
            <h3 style={{ color: corP }}>Laboratório de Invocação</h3>
            <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="O que deseja criar?" style={inputStyle(corP)} />
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <button onClick={() => gerarIA('image', 1)} style={btnG}>FOTO (1C)</button>
              <button onClick={() => gerarIA('video', 5)} style={btnG}>VÍDEO (5C)</button>
            </div>
            {resultadoIA && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <img src={resultadoIA} onClick={() => setFotoZoom(resultadoIA)} style={{ width: '100%', borderRadius: '10px', border: `2px solid ${corP}` }} />
                <button onClick={async () => {
                   await updateDoc(doc(db, "ninjas", user.uid), { avatarIA: resultadoIA });
                   setUserData(p => ({ ...p, avatarIA: resultadoIA }));
                   alert("Perfil Atualizado! 🔥");
                }} style={btnSucesso}>DEFINIR COMO PERFIL</button>
                <a href={resultadoIA} download style={{ color: corP, display: 'block', marginTop: '10px' }}>⬇️ DOWNLOAD</a>
              </div>
            )}
            <button onClick={() => updateDoc(doc(db, "ninjas", user.uid), { chakra: increment(10) }).then(() => setUserData(p => ({ ...p, chakra: p.chakra + 10 })))} style={btnAnuncio}>📺 ASSISTIR ANÚNCIO (+10C)</button>
          </div>
        )}

        {/* ABA CHAT */}
        {abaAtiva === 'chat' && (
          <div style={cardStyle}>
            <div style={chatBox}>
              {mensagens.map(m => (
                <div key={m.id} style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexDirection: m.uid === user?.uid ? 'row-reverse' : 'row' }}>
                  <img src={m.foto} onClick={() => setFotoZoom(m.foto)} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  <div style={{ background: m.uid === user?.uid ? corP : '#222', color: m.uid === user?.uid ? '#000' : '#fff', padding: '10px', borderRadius: '10px', position: 'relative' }}>
                    <small style={{ fontSize: '8px', display: 'block' }}>{m.user}</small>
                    {m.imagem ? <img src={m.imagem} onClick={() => setFotoZoom(m.imagem)} style={{ width: '100px', borderRadius: '5px' }} /> : m.texto}
                    {m.uid === user?.uid && (
                      <div style={{ marginTop: '5px' }}>
                        <button onClick={() => { setNovaMsg(m.texto); setMsgEditando(m); }} style={btnMini}>📝</button>
                        <button onClick={() => deleteDoc(doc(db, "chat", m.id))} style={btnMini}>🗑️</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => fileInputRef.current.click()} style={btnG}>📎</button>
              <input type="file" ref={fileInputRef} hidden onChange={handleFile} />
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Fala ninja..." style={inputStyle(corP)} />
              <button onClick={() => enviarMensagem()} style={btnG}>ENVIAR</button>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {['🍥', '🦊', '⚡', '🔥'].map(e => <button key={e} onClick={() => enviarMensagem(e)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>{e}</button>)}
            </div>
          </div>
        )}

        {/* ABA VILA */}
        {abaAtiva === 'vila' && (
          <div style={cardStyle}>
            <h3 style={{ color: corP }}>Ninjas na Vila</h3>
            {ninjasVila.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #222' }}>
                <img src={n.avatarIA || "https://via.placeholder.com/30"} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                <span style={{ flex: 1 }}>{n.nome}</span>
                <button onClick={() => { setAbaAtiva('chat'); setNovaMsg(`@${n.nome.split(' ')[0]} `); }} style={btnAuth(corP)}>Conversar</button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

// ESTILOS
const modalStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const avatarStyle = (c) => ({ width: '45px', height: '45px', borderRadius: '50%', border: `2px solid ${c}`, cursor: 'pointer', objectFit: 'cover' });
const btnAuth = (c) => ({ background: 'none', border: `1px solid ${c}`, color: '#fff', padding: '4px 10px', borderRadius: '5px', fontSize: '10px', cursor: 'pointer' });
const cardStyle = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' };
const inputStyle = (c) => ({ flex: 1, padding: '10px', backgroundColor: '#222', border: `1px solid ${c}`, color: '#fff', borderRadius: '5px' });
const btnG = { background: '#333', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' };
const chatBox = { height: '300px', overflowY: 'scroll', backgroundColor: '#000', padding: '15px', borderRadius: '10px', marginBottom: '10px' };
const btnMini = { background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer' };
const btnSucesso = { width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const btnAnuncio = { width: '100%', padding: '10px', marginTop: '15px', backgroundColor: '#ffd700', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
