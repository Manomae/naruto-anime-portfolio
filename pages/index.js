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
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [tipoMidia, setTipoMidia] = useState(''); // image, gif, video
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
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
      }
    });

    const q = query(collection(db, "chat"), orderBy("criadoEm", "desc"), limit(15));
    const unsubChat = onSnapshot(q, (snapshot) => {
      setMensagens(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse());
    });

    return () => { unsubAuth(); unsubChat(); };
  }, []);

  const gerarMidia = async (tipo, custo) => {
    if (!user) return alert("Conecte-se com o Google!");
    if (userData.chakra < custo) return alert("Chakra insuficiente!");
    if (!prompt && tipo !== 'avatar') return alert("Digite o que deseja invocar!");

    setCarregando(true);
    setResultado(null);
    setTipoMidia(tipo);

    const seed = Math.floor(Math.random() * 999999);
    let url = "";

    if (tipo === 'image' || tipo === 'avatar') {
      const p = tipo === 'avatar' ? `portrait of naruto character, centered face, anime style` : `${prompt} naruto anime style`;
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?seed=${seed}&nologo=true`;
    } else if (tipo === 'gif') {
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " naruto anime moving gif")}?seed=${seed}&model=video`;
    } else if (tipo === 'video') {
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " cinematic naruto anime 10s video")}?seed=${seed}&model=video`;
    }

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

  const definirAvatar = async () => {
    const userRef = doc(db, "ninjas", user.uid);
    await updateDoc(userRef, { avatarIA: resultado });
    setUserData(prev => ({ ...prev, avatarIA: resultado }));
    alert("🔥 Avatar atualizado!");
    setResultado(null);
  };

  const enviarMsg = async (e) => {
    if (!user) return;
    await addDoc(collection(db, "chat"), {
      texto: e || novaMsg,
      user: user.displayName.split(' ')[0],
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={headerEstilo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={miniAvatar}><img src={userData.avatarIA || user?.photoURL || ""} style={{width:'100%'}} /></div>
          <span style={{fontSize:'10px', color:'orange'}}>{user ? user.displayName.split(' ')[0] : 'EMANUEL AI'}</span>
        </div>
        <div style={badgeChakra}>Chakra: {userData.chakra}</div>
      </header>

      <nav style={navEstilo}>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>Invocações</button>
        <button onClick={() => setAbaAtiva('chat')} style={abaEstilo(abaAtiva === 'chat')}>Chat</button>
        {!user && <button onClick={() => signInWithPopup(auth, provider)} style={btnLog}>Login</button>}
      </nav>

      <main style={{ padding: '15px', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
        {abaAtiva === 'ia' && (
          <div style={card}>
            <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Ex: Itachi usando Amaterasu..." style={input} />
            <div style={gridBotoes}>
              <button onClick={() => gerarMidia('image', 1)} style={btnG}>Foto (1C)</button>
              <button onClick={() => gerarMidia('gif', 2)} style={btnG}>GIF (2C)</button>
              <button onClick={() => gerarMidia('video', 5)} style={btnG}>Vídeo 10s (5C)</button>
              <button onClick={() => gerarMidia('avatar', 1)} style={btnG}>Avatar (1C)</button>
            </div>
            
            {carregando && <p style={{color:'orange'}}>🌀 Concentrando Chakra...</p>}
            {resultado && (
              <div style={resCont}>
                <img src={resultado} style={{width:'100%', borderRadius:'10px'}} />
                {tipoMidia === 'avatar' && <button onClick={definirAvatar} style={btnAvatar}>USAR COMO PERFIL</button>}
                <a href={resultado} download style={btnD}>Download</a>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={card}>
             <div style={chatBox}>{mensagens.map(m => <p key={m.id}><b>{m.user}:</b> {m.texto}</p>)}</div>
             <div style={{display:'flex', gap:'5px'}}><input value={novaMsg} onChange={e=>setNovaMsg(e.target.value)} style={input} /><button onClick={()=>enviarMsg()} style={btnG}>Senden</button></div>
             <div style={{marginTop:'10px'}}>{['🍥','🦊','🔥'].map(e => <button key={e} onClick={()=>enviarMsg(e)} style={btnEmoji}>{e}</button>)}</div>
          </div>
        )}
      </main>
    </div>
  );
}

const headerEstilo = { padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', borderBottom: '2px solid orange' };
const badgeChakra = { color: 'orange', fontWeight: 'bold', border: '1px solid orange', padding: '3px 10px', borderRadius: '15px', fontSize: '12px' };
const navEstilo = { display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px' };
const abaEstilo = (a) => ({ background: 'none', border: 'none', color: a ? 'orange' : '#666', borderBottom: a ? '2px solid orange' : 'none', fontWeight: 'bold' });
const card = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' };
const input = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid orange', backgroundColor: '#222', color: '#fff' };
const gridBotoes = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' };
const btnG = { padding: '10px', backgroundColor: 'orange', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
const btnLog = { backgroundColor: '#4285F4', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' };
const resCont = { marginTop: '15px', border: '1px solid orange', padding: '10px', borderRadius: '10px' };
const btnAvatar = { width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const btnD = { display: 'block', marginTop: '10px', color: 'orange', textDecoration: 'none', fontSize: '12px' };
const chatBox = { height: '200px', overflowY: 'scroll', textAlign: 'left', backgroundColor: '#000', padding: '10px', borderRadius: '5px', marginBottom: '10px' };
const miniAvatar = { width: '25px', height: '25px', borderRadius: '50%', overflow: 'hidden', border: '1px solid orange', backgroundColor: '#333' };
const btnEmoji = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' };
