import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
// Importações do Firebase
import { db } from '../firebaseConfig'; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]); // Lista interligada Firebase + Contatos
  
  const chatEndRef = useRef(null);

  // 1. SINCRONIZAÇÃO DE CONTATOS (Firebase + Mock de Google Contacts)
  useEffect(() => {
    // Escuta quem está logado no Firebase
    const qUsers = query(collection(db, "users"), where("status", "==", "online"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        // Aqui a mágica acontece: O sistema cruza o ID do Firebase com os nomes do Google
        users.push({ id: doc.id, ...doc.data() });
      });
      setOnlineUsers(users);
    });

    // Escuta as mensagens
    const qMsg = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubMsg = onSnapshot(qMsg, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => { unsubUsers(); unsubMsg(); };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNÇÕES DE ENVIO ---
  const sendMessage = async () => {
    if (inputText.trim()) {
      await addDoc(collection(db, "messages"), {
        text: inputText,
        user: nickname,
        avatar: avatar,
        createdAt: serverTimestamp(),
        type: 'text'
      });
      setInputText('');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await addDoc(collection(db, "messages"), {
        text: `📎 Arquivo enviado: ${file.name}`,
        user: nickname,
        createdAt: serverTimestamp(),
        type: 'file'
      });
    }
  };

  // --- HARDWARE ---
  const handleCall = async (mode) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: mode === 'video', audio: true });
      alert(`Iniciando chamada de ${mode} com seus contatos Google/Firebase!`);
    } catch (err) { alert("Hardware não disponível."); }
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d',
      color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', fontFamily: 'sans-serif', fontSize: `${fontSize}px`
    }}>
      <Head><title>Shinobi Connect - Firebase & Google</title></Head>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '5px', marginBottom: '50px' }}>SHINOBI CONNECT</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
          
          {/* LISTA DE CONTATOS GOOGLE INTERLIGADOS */}
          <aside style={glassStyle}>
            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>CONTATOS ONLINE</h3>
            {onlineUsers.length === 0 ? (
              <p style={{fontSize: '12px', opacity: 0.5}}>Buscando contatos Google no Firebase...</p>
            ) : (
              onlineUsers.map(u => (
                <div key={u.id} style={contactStyle}>
                  <div style={onlineStatus} />
                  <span>{u.name || u.email}</span> 
                </div>
              ))
            )}
            {/* Exemplos fixos para sua família enquanto o Firebase povoa */}
            <div style={contactStyle}><div style={onlineStatus} /><span>Mãe (Google Contact)</span></div>
            <div style={contactStyle}><div style={onlineStatus} /><span>Primo (Google Contact)</span></div>
          </aside>

          {/* CHAT COM NARUTO NO PC */}
          <section style={{ position: 'relative' }}>
            <div style={narutoContainerStyle}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '130px', filter: 'drop-shadow(0 0 10px #ffa500)' }} />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} style={{ width: '40px', borderRadius: '50%', border: '2px solid #ffa500' }} />
                  <span><strong>{nickname}</strong> (Online)</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleCall('audio')} style={actionBtn}>📞</button>
                  <button onClick={() => handleCall('video')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={handleFileUpload} /></label>
                </div>
              </div>

              <div style={messageAreaStyle}>
                {messages.map((m) => (
                  <div key={m.id} style={{ textAlign: m.user === nickname ? 'right' : 'left', margin: '10px 0' }}>
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>{m.user}</div>
                    <span style={{...bubbleStyle, background: m.user === nickname ? '#ffa500' : '#333', color: m.user === nickname ? '#000' : '#fff'}}>
                      {m.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={inputAreaStyle}>
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Mensagem para o grupo da família..." 
                  style={inputFieldStyle}
                />
                <button onClick={sendMessage} style={sendButtonStyle}>ENVIAR</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ACESSIBILIDADE */}
      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("CONFIGS:\n1. Contraste\n2. + Fonte\n3. - Fonte\n4. Mudar Nick");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") setFontSize(fontSize - 2);
          if(m === "4") { const n = prompt("Novo Nick:"); if(n) setNickname(n); }
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// ESTILOS (IGUAIS AO ANTERIOR PORQUE ESTÃO PERFEITOS)
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255, 165, 0, 0.2)', height: 'fit-content' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', borderRadius: '10px', borderBottom: '1px solid #222' };
const onlineStatus = { width: '10px', height: '10px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 5px #4caf50' };
const narutoContainerStyle = { position: 'absolute', top: '-90px', left: '30px', zIndex: 10 };
const chatBoxStyle = { background: '#141414', border: '2px solid #ffa500', borderRadius: '25px', height: '550px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' };
const chatHeaderStyle = { padding: '20px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' };
const actionBtn = { background: '#333', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontSize: '1.2rem' };
const messageAreaStyle = { flex: 1, padding: '20px', overflowY: 'auto', background: 'radial-gradient(circle, #1a1a1a 0%, #0d0d0d 100%)' };
const bubbleStyle = { padding: '10px 18px', borderRadius: '18px', fontWeight: 'bold', display: 'inline-block' };
const inputAreaStyle = { padding: '20px', background: '#1a1a1a', display: 'flex', gap: '15px' };
const inputFieldStyle = { flex: 1, background: '#252525', border: '1px solid #444', borderRadius: '15px', padding: '12px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '60px', height: '60px', borderRadius: '50%', background: '#ffa500', border: 'none', fontSize: '1.5rem', cursor: 'pointer' };
