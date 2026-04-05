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
  const [tipoMidia, setTipoMidia] = useState(''); 
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

  // FUNÇÃO DE INVOCACÃO ESTABILIZADA
  const gerarMidia = async (tipo, custo) => {
    if (!user) return alert("Ninja, conecte-se com o Google primeiro!");
    
    // Se for GIF ou Vídeo, informa que está em manutenção para não gastar chakra
    if (tipo === 'gif' || tipo === 'video') {
      return alert(`Jutsu de ${tipo.toUpperCase()} em manutenção! 🔧\nEstamos configurando o motor de vídeo gratuito. Tente Imagem ou Avatar!`);
    }

    if (userData.chakra < custo) return alert("Seu Chakra esgotou! Assista a um anúncio para recuperar.");
    if (!prompt && tipo !== 'avatar') return alert("Escreva seu comando, Emanuel!");

    setCarregando(true);
    setResultado(null);
    setTipoMidia(tipo);

    const seed = Math.floor(Math.random() * 999999);
    let url = "";

    // Motores estáveis de Imagem e Avatar
    if (tipo === 'image' || tipo === 'avatar') {
      const p = tipo === 'avatar' ? `portrait of naruto character, face close-up, anime style, centered, detailed` : `${prompt} naruto anime style, high resolution`;
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?seed=${seed}&nologo=true&width=1024&height=1024`;
    }

    const img = new Image();
    img.crossOrigin = "anonymous"; // Importante para o download automático
    img.src = url;
    img.onload = async () => {
      const userRef = doc(db, "ninjas", user.uid);
      await updateDoc(userRef, { chakra: increment(-custo) });
      setUserData(prev => ({ ...prev, chakra: prev.chakra - custo }));
      setResultado(url);
      setCarregando(false);
    };
    img.onerror = () => {
      alert("Erro na invocação! Chakra concentrado incorretamente. Tente de novo.");
      setCarregando(false);
    };
  };

  const definirAvatar = async () => {
    if (!user || !resultado) return;
    try {
      const userRef = doc(db, "ninjas", user.uid);
      await updateDoc(userRef, { avatarIA: resultado });
      setUserData(prev => ({ ...prev, avatarIA: resultado }));
      alert("🔥 Novo Avatar Ninja definido com sucesso! Olhe no topo.");
      setResultado(null);
    } catch (e) { alert("Erro ao salvar avatar: " + e.message); }
  };

  // SISTEMA DE MONETIZAÇÃO REAL (ASSISTIR ANÚNCIO)
  const ganharChakraPorAnuncio = async () => {
    if (!user) return alert("Logue para acumular Chakra!");
    alert("🎥 Carregando anúncio... (No futuro, AdSense abrirá aqui)");
    setTimeout(async () => {
      const userRef = doc(db, "ninjas", user.uid);
      await updateDoc(userRef, { chakra: increment(5) }); // Ganha 5 reais no banco
      setUserData(prev => ({ ...prev, chakra: prev.chakra + 5 }));
      alert("✅ +5 de Chakra adicionados à sua conta!");
    }, 2000);
  };

  const enviarMsg = async (e) => {
    if (!user || (!novaMsg.trim() && !e)) return;
    try {
      await addDoc(collection(db, "chat"), {
        texto: e || novaMsg,
        user: user.displayName.split(' ')[0],
        foto: userData.avatarIA || user.photoURL,
        criadoEm: serverTimestamp()
      });
      setNovaMsg('');
    } catch (error) { alert("Erro no chat: " + error.message); }
  };

  const baixarImagem = async () => {
    if (!resultado) return;
    try {
      const resposta = await fetch(resultado);
      const blob = await resposta.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `EmanuelNarutoAI_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (e) { window.open(resultado, '_blank'); }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <header style={headerEstilo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={miniAvatar}><img src={userData.avatarIA || user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=ninja"} style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
          <span style={{fontSize:'11px', color:'orange', fontWeight:'bold'}}>{user ? user.displayName.split(' ')[0] : 'EMANUEL AI'}</span>
        </div>
        <div style={badgeChakra}>Chakra: {userData.chakra}</div>
      </header>

      <nav style={navEstilo}>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>Jutsu IA</button>
        <button onClick={() => setAbaAtiva('chat')} style={abaEstilo(abaAtiva === 'chat')}>Chat Vila</button>
        {!user && <button onClick={() => signInWithPopup(auth, provider)} style={btnLog}>Login</button>}
      </nav>

      
