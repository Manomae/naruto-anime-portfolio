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

export default function EmanuelNarutoMassivo() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null, tema: 'folha', fontSize: '14px' });
  const [abaAtiva, setAbaAtiva] = useState('chat');
  const [segundosOnline, setSegundosOnline] = useState(0);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [fotoZoom, setFotoZoom] = useState(null);
  const [msgEditando, setMsgEditando] = useState(null);
  const [carregandoImg, setCarregandoImg] = useState(false);
  const fileInputRef = useRef(null);

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
          const init = { chakra: 50, avatarIA: null, tema: 'folha', fontSize: '14px', nome: currentUser.displayName };
          await setDoc(userRef, init);
          setUserData(init);
        }
      } else { setUser(null); clearInterval(timer); }
    });
    const qChat = query(collection(db, "chat"), orderBy("criadoEm", "desc"), limit(30));
    const unsubChat = onSnapshot(qChat, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
    return () => { unsub(); unsubChat(); clearInterval(timer); };
  }, []);

  const enviarMsg = async (urlImagem = null) => {
    if (!user || (!novaMsg && !urlImagem)) return;
    if (msgEditando) {
      await updateDoc(doc(db, "chat", msgEditando.id), { texto: novaMsg, editada: true });
      setMsgEditando(null);
    } else {
      await addDoc(collection(db, "chat"), {
        texto: urlImagem ? "" : novaMsg,
        imagem: urlImagem || null,
        user: user.displayName,
        uid: user.uid,
        foto: userData.avatarIA || user.photoURL,
        criadoEm: serverTimestamp()
      });
    }
    setNovaMsg('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.target.files[0];
    if (!file) return;
    setCarregandoImg(true);
    // Simulação de Upload (Para upload real usaria Firebase Storage, aqui usamos FileReader para exibir localmente no chat)
    const reader = new FileReader();
    reader.onload = (event) => {
      enviarMsg(event.target.result);
      setCarregandoImg(false);
    };
    reader.readAsDataURL(file);
  };

  const excluirMsg = async (id) => {
    if (window.confirm("Deseja apagar este pergaminho?")) {
      await deleteDoc(doc(db, "chat", id));
    }
  };

  const corP = userData.tema === 'akatsuki' ? '#ff0000' : '#ff9800';

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontSize: userData.fontSize }}>
      
      {/* ZOOM DA FOTO (MODAL) */}
      {fotoZoom && (
        <div onClick={() => setFotoZoom(null)} style={modalEstilo}>
          <img src={fotoZoom} style={imgGrandeEstilo} />
          <p style={{marginTop:'10px', fontWeight:'bold'}}>CLIQUE PARA FECHAR</p>
        </div>
      )}

      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: `3px solid ${corP}`, background: '#111' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <img 
            src={userData.avatarIA || user?.photoURL} 
            onClick={() => setFotoZoom(userData.avatarIA || user?.photoURL)}
            style={{ width: '50px', height: '50px', borderRadius: '50%', border: `2px solid ${corP}`, cursor:'pointer' }} 
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{user ? user.displayName : 'OFFLINE'}</div>
            <div style={{ fontSize: '10px', color: '#00ff00' }}>ON: {Math.floor(segundosOnline/60)}m {segundosOnline%60}s</div>
          </div>
        </div>
        <div style={{color: corP, fontWeight:'bold'}}>🌀 {userData.chakra}C</div>
      </header>

      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '15px' }}>
        
        {abaAtiva === 'chat' && (
          <div style={cardChat}>
            <div style={chatScroll}>
              {mensagens.map(m => (
                <div key={m.id} onContextMenu={(e) => { e.preventDefault(); if(m.uid === user.uid) setMsgEditando(m); }} style={msgContainer(m.uid === user?.uid)}>
                  <img src={m.foto} onClick={() => setFotoZoom(m.foto)} style={miniAvatarChat} />
                  <div style={bolhaMsg(m.uid === user?.uid, corP)}>
                    <small style={{fontSize:'9px', opacity:0.7}}>{m.user}</small>
                    {m.imagem ? <img src={m.imagem} style={{width:'100%', borderRadius:'5px'}} /> : <div>{m.texto}</div>}
                    {m.editada && <small style={{fontSize:'8px'}}> (editada)</small>}
                    
                    {/* MENU DE AÇÕES RÁPIDAS (EXCLUIR/EDITAR) */}
                    {m.uid === user?.uid && (
                      <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                        <button onClick={() => {setNovaMsg(m.texto); setMsgEditando(m);}} style={btnAcao}>📝</button>
                        <button onClick={() => excluirMsg(m.id)} style={btnAcao}>🗑️</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {carregandoImg && <p>Enviando arquivo...</p>}
            </div>

            <div style={{ display: 'flex', gap: '5px', padding: '10px' }}>
              <button onClick={() => fileInputRef.current.click()} style={btnExtra}>📎</button>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
              <input 
                value={novaMsg} 
                onChange={e => setNovaMsg(e.target.value)} 
                placeholder={msgEditando ? "Editando..." : "Mensagem..."} 
                style={inputEstilo(corP)} 
              />
              <button onClick={() => enviarMsg()} style={btnEnviar(corP)}>{msgEditando ? "OK" : "SEND"}</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// ESTILOS MASSIVOS
const modalEstilo = { position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.9)', zIndex:1000, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' };
const imgGrandeEstilo = { width:'300px', height:'300px', objectFit:'cover', borderRadius:'20px', border:'4px solid orange' };
const cardChat = { backgroundColor: '#111', borderRadius: '20px', overflow: 'hidden', border: '1px solid #222' };
const chatScroll = { height: '400px', overflowY: 'scroll', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' };
const msgContainer = (isMe) => ({ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' });
const bolhaMsg = (isMe, cor) => ({ background: isMe ? cor : '#222', color: isMe ? '#000' : '#fff', padding: '10px', borderRadius: '15px', maxWidth: '70%', fontWeight: isMe ? 'bold' : 'normal' });
const miniAvatarChat = { width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', border: '1px solid #444' };
const inputEstilo = (c) => ({ flex: 1, padding: '12px', background: '#000', border: `1px solid ${c}`, color: '#fff', borderRadius: '10px' });
const btnEnviar = (c) => ({ padding: '10px 20px', backgroundColor: c, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' });
const btnExtra = { background: '#222', border: 'none', color: '#fff', padding: '10px', borderRadius: '10px', cursor: 'pointer' };
const btnAcao = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' };
