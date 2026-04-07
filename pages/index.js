import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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

export default function EmanuelNarutoSupreme() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ chakra: 50, avatarIA: null, grupos: [] });
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [mensagens, setMensagens] = useState([]);
  const [novaMsg, setNovaMsg] = useState('');
  const [resultadoIA, setResultadoIA] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [fotoZoom, setFotoZoom] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [usuariosVila, setUsuariosVila] = useState([]);
  const [gruposDisponiveis, setGruposDisponiveis] = useState([]);
  const [chatAtivo, setChatAtivo] = useState('geral'); // 'geral', 'id_do_grupo', ou 'uid_do_usuario'

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "ninjas", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) setUserData(snap.data());
        else {
          const init = { chakra: 50, avatarIA: null, nome: currentUser.displayName, grupos: [], criadoEm: new Date() };
          await setDoc(userRef, init);
          setUserData(init);
        }
      }
    });

    // Monitorar Mensagens conforme o chat ativo
    const qChat = query(collection(db, "chats", chatAtivo, "mensagens"), orderBy("criadoEm", "desc"), limit(40));
    const unsubChat = onSnapshot(qChat, (s) => setMensagens(s.docs.map(d => ({ id: d.id, ...d.data() })).reverse()));
    
    // Monitorar Ninjas
    onSnapshot(collection(db, "ninjas"), (s) => setUsuariosVila(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    // Monitorar Grupos
    onSnapshot(collection(db, "grupos"), (s) => setGruposDisponiveis(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsub(); unsubChat(); };
  }, [chatAtivo]);

  // --- SISTEMA DE ÁUDIO MELHORADO ---
  const gerenciarGravacao = async () => {
    if (!gravando) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (ev) => enviarMensagem(null, ev.target.result);
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorder.current.start();
      setGravando(true);
    } else {
      mediaRecorder.current.stop();
      setGravando(false);
    }
  };

  // --- IA REALISTA 8K ---
  const gerarVideoRealista = async () => {
    if (userData.chakra < 10) return alert("Chakra insuficiente!");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 999999);
    const prompt = `Hyper-realistic 8k cinematic video of ${novaMsg}, unreal engine 5 render, highly detailed anime skin, professional lighting, naruto universe`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=1024&height=1024&nologo=true`;
    setResultadoIA(url);
    await updateDoc(doc(db, "ninjas", user.uid), { chakra: increment(-10) });
    setUserData(p => ({ ...p, chakra: p.chakra - 10 }));
    setCarregando(false);
  };

  // --- FUNÇÕES DE GRUPO ---
  const criarGrupo = async () => {
    const nomeG = prompt("Nome do Grupo de Elite (Máx 50 pessoas):");
    if (!nomeG) return;
    const novoG = await addDoc(collection(db, "grupos"), {
      nome: nomeG,
      criador: user.uid,
      membros: [user.uid],
      exclusivo: true
    });
    alert("Grupo criado com sucesso!");
  };

  const gerenciarEntradaSaida = async (grupoId, jaMembro) => {
    const gRef = doc(db, "grupos", grupoId);
    const uRef = doc(db, "ninjas", user.uid);
    if (jaMembro) {
      await updateDoc(gRef, { membros: arrayRemove(user.uid) });
      await updateDoc(uRef, { grupos: arrayRemove(grupoId) });
    } else {
      const snap = await getDoc(gRef);
      if (snap.data().membros.length >= 50) return alert("Grupo cheio!");
      await updateDoc(gRef, { membros: arrayUnion(user.uid) });
      await updateDoc(uRef, { grupos: arrayUnion(grupoId) });
    }
  };

  const enviarMensagem = async (img = null, aud = null) => {
    if (!user) return;
    await addDoc(collection(db, "chats", chatAtivo, "mensagens"), {
      texto: novaMsg,
      imagem: img,
      audio: aud,
      user: user.displayName,
      uid: user.uid,
      foto: userData.avatarIA || user.photoURL,
      criadoEm: serverTimestamp()
    });
    setNovaMsg('');
  };

  const deletarConta = async () => {
    if (confirm("Deseja mesmo apagar seu registro ninja?")) {
      await deleteDoc(doc(db, "ninjas", user.uid));
      deleteUser(auth.currentUser).then(() => window.location.reload());
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'Arial' }}>
      
      {/* AMPLIFICADOR HD COM FILTRO */}
      {fotoZoom && (
        <div onClick={() => setFotoZoom(null)} style={zoomOverlay}>
          <img src={fotoZoom} style={zoomImg} />
          <div style={{color:'orange', marginTop:'15px', fontWeight:'bold', textShadow:'0 0 10px #000'}}>MODO HD ATIVADO ⚡</div>
        </div>
      )}

      <header style={header}>
        <img src={userData.avatarIA || user?.photoURL} style={avatar(userData.chakra > 20 ? 'orange' : 'gray')} />
        <div style={{fontWeight:'bold'}}>🌀 {userData.chakra}C</div>
        <button onClick={() => setAbaAtiva('perfil')} style={btnTransp}>CONFIG</button>
      </header>

      <nav style={nav}>
        <button onClick={() => setAbaAtiva('ia')} style={aba(abaAtiva === 'ia')}>IA REAL</button>
        <button onClick={() => setAbaAtiva('chat')} style={aba(abaAtiva === 'chat')}>CHAT</button>
        <button onClick={() => setAbaAtiva('vila')} style={aba(abaAtiva === 'vila')}>VILA</button>
      </nav>

      <main style={{maxWidth:'500px', margin:'0 auto', padding:'15px'}}>
        
        {abaAtiva === 'ia' && (
          <div style={card}>
            <h2 style={{color:'orange'}}>Criação Realista 8K</h2>
            <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Ex: Itachi Uchiha no mundo real..." style={input} />
            <button onClick={gerarVideoRealista} style={btnLaranja}>GERAR VÍDEO CINEMATOGRÁFICO (10C)</button>
            {carregando && <p>Invocando Jutsu... Aguarde.</p>}
            {resultadoIA && <img src={resultadoIA} onClick={() => setFotoZoom(resultadoIA)} style={imgResultado} />}
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={card}>
            <div style={{display:'flex', gap:'10px', marginBottom:'10px', overflowX:'auto'}}>
              <button onClick={() => setChatAtivo('geral')} style={aba(chatAtivo === 'geral')}>GERAL</button>
              {gruposDisponiveis.filter(g => g.membros.includes(user?.uid)).map(g => (
                <button key={g.id} onClick={() => setChatAtivo(g.id)} style={aba(chatAtivo === g.id)}>{g.nome}</button>
              ))}
            </div>

            <div style={chatContainer}>
              {mensagens.map(m => (
                <div key={m.id} style={{textAlign: m.uid === user?.uid ? 'right' : 'left', marginBottom:'10px'}}>
                   <div style={m.uid === user?.uid ? bolhaMe : bolhaOther}>
                      <small style={{fontSize:'10px', display:'block'}}>{m.user}</small>
                      {m.texto && <div>{m.texto}</div>}
                      {m.audio && <audio src={m.audio} controls style={{width:'200px'}} />}
                      {m.imagem && <img src={m.imagem} onClick={() => setFotoZoom(m.imagem)} style={{width:'100%', borderRadius:'5px'}} />}
                   </div>
                </div>
              ))}
            </div>

            <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
              <button onClick={gerenciarGravacao} style={gravando ? btnRec : btnG}>
                {gravando ? '🛑' : '🎙️'}
              </button>
              <input value={novaMsg} onChange={e => setNovaMsg(e.target.value)} placeholder="Mensagem..." style={input} />
              <button onClick={() => enviarMensagem()} style={btnLaranja}>ENVIAR</button>
            </div>
            {/* Emojis Exclusivos de Grupo */}
            {chatAtivo !== 'geral' && (
              <div style={{marginTop:'10px', fontSize:'20px'}}>
                 {['🍥','🦊','⚡','🔥','👁️','👹'].map(emoji => (
                   <span key={emoji} onClick={() => setNovaMsg(prev => prev + emoji)} style={{cursor:'pointer', marginRight:'10px'}}>{emoji}</span>
                 ))}
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'vila' && (
          <div style={card}>
            <button onClick={criarGrupo} style={btnLaranja}>+ CRIAR NOVO GRUPO</button>
            <h4 style={{color:'orange', marginTop:'20px'}}>Grupos de Elite:</h4>
            {gruposDisponiveis.map(g => (
              <div key={g.id} style={itemVila}>
                <span>{g.nome} ({g.membros.length}/50)</span>
                <button onClick={() => gerenciarEntradaSaida(g.id, g.membros.includes(user.uid))} style={btnMini}>
                  {g.membros.includes(user.uid) ? 'SAIR' : 'ENTRAR'}
                </button>
              </div>
            ))}
            <h4 style={{color:'orange', marginTop:'20px'}}>Ninjas Online:</h4>
            {usuariosVila.map(u => (
              <div key={u.id} onClick={() => {setChatAtivo(u.id < user.uid ? u.id+user.uid : user.uid+u.id); setAbaAtiva('chat');}} style={itemVila}>
                 <img src={u.avatarIA || u.foto} style={{width:'30px', borderRadius:'50%'}} />
                 <span>{u.nome}</span>
                 <small style={{color:'green'}}>Online</small>
              </div>
            ))}
          </div>
        )}

        {abaAtiva === 'perfil' && (
          <div style={card}>
            <h3>Sua Conta Ninja</h3>
            <button onClick={() => signOut(auth)} style={btnG}>DESCONECTAR</button>
            <button onClick={deletarConta} style={{...btnG, color:'red', marginTop:'20px'}}>EXCLUIR CONTA (PERIGO)</button>
          </div>
        )}

      </main>
    </div>
  );
}

// ESTILOS MASSIVOS
const zoomOverlay = { position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.95)', zIndex:2000, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' };
const zoomImg = { maxWidth:'95%', maxHeight:'80%', borderRadius:'10px', border:'2px solid orange', filter: 'contrast(1.1) saturate(1.1) brightness(1.05)' };
const header = { padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', borderBottom: '1px solid orange' };
const avatar = (c) => ({ width: '45px', height: '45px', borderRadius: '50%', border: `2px solid ${c}` });
const nav = { display: 'flex', justifyContent: 'space-around', padding: '10px' };
const aba = (a) => ({ background: 'none', border: 'none', color: a ? 'orange' : '#666', fontWeight: 'bold', borderBottom: a ? '2px solid orange' : 'none', paddingBottom: '5px' });
const card = { backgroundColor: '#111', padding: '15px', borderRadius: '15px', border: '1px solid #222' };
const input = { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid orange', backgroundColor: '#000', color: '#fff' };
const btnLaranja = { backgroundColor: 'orange', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', marginTop: '10px' };
const chatContainer = { height: '350px', overflowY: 'scroll', backgroundColor: '#050505', padding: '10px', borderRadius: '10px' };
const bolhaMe = { background: 'orange', color: '#000', padding: '10px', borderRadius: '12px 12px 0 12px', display: 'inline-block' };
const bolhaOther = { background: '#222', color: '#fff', padding: '10px', borderRadius: '12px 12px 12px 0', display: 'inline-block' };
const btnG = { background: '#333', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px' };
const btnRec = { background: 'red', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', animation: 'pulse 1s infinite' };
const imgResultado = { width: '100%', marginTop: '15px', borderRadius: '10px', border: '1px solid orange' };
const itemVila = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #222', cursor: 'pointer' };
const btnMini = { background: 'orange', color: '#000', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' };
const btnTransp = { background: 'none', border: '1px solid #444', color: '#fff', padding: '5px', borderRadius: '5px', fontSize: '10px' };
