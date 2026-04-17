import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Estados para permissões e sistema
  const [isLive, setIsLive] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('shinobi_nick');
    if (saved) setNickname(saved);
    
    // Auto-ativar escuta do servidor
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // SIMULAÇÃO DE ESCUTA EM TEMPO REAL (FIREBASE LISTENERS)
  useEffect(() => {
    if (activeChat) {
      console.log(`Conectado ao canal live de: ${activeChat}`);
      setIsLive(true);
    }
  }, [activeChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- NOTIFICAÇÃO VIVA (PUSH NOTIFICATION) ---
  const triggerLiveNotification = (sender, content) => {
    if (Notification.permission === "granted") {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
      audio.play(); // Som de notificação ninja
      new Notification(`NOVA MENSAGEM: ${sender}`, {
        body: content,
        icon: 'https://cdn-icons-png.flaticon.com/512/1152/1152912.png',
        vibrate: [200, 100, 200]
      });
    }
  };

  // --- ENVIO DE ARQUIVOS/IMAGENS/ÁUDIO ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      const msg = {
        id: Date.now(),
        text: `Enviou um ${fileType}: ${file.name}`,
        user: nickname,
        type: 'sent',
        isMedia: true
      };
      setMessages(prev => [...prev, msg]);
      // Sincroniza com o servidor da mãe/outros
      alert(`Arquivo ${file.name} enviado para o servidor da ${activeChat}!`);
    }
  };

  // --- ENVIO DE MENSAGEM DE TEXTO ---
  const sendMessage = () => {
    if (inputText.trim() && activeChat) {
      const newMsg = { id: Date.now(), text: inputText, user: nickname, type: 'sent' };
      setMessages([...messages, newMsg]);
      
      // LÓGICA DE SINCRONIZAÇÃO: Envia para o Firebase
      // firebase.db.ref('chats/' + activeChat).push(newMsg);
      
      setInputText('');

      // Simula a volta do servidor (Resposta da Mãe)
      setTimeout(() => {
        const reply = "Recebi sua mensagem e o arquivo aqui no meu servidor!";
        setMessages(prev => [...prev, { id: Date.now()+1, text: reply, user: activeChat, type: 'received' }]);
        triggerLiveNotification(activeChat, reply);
      }, 3000);
    }
  };

  // --- CHAMADAS DE VÍDEO/ÁUDIO ---
  const startCall = (type) => {
    if (!activeChat) return alert("Selecione um contato primeiro!");
    const mode = type === 'video' ? 'Câmera e Microfone' : 'Microfone';
    alert(`Iniciando conexão P2P... Ativando ${mode} para falar com ${activeChat}`);
    // Integração futura: Jitsi Meet ou WebRTC
  };

  return (
    <div style={containerStyle}>
      <Head><title>Shinobi Connect LIVE</title></Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#ffa500', letterSpacing: '5px' }}>SHINOBI SYNC v4.0</h1>
          <span style={{ color: isLive ? '#4caf50' : '#ff4444', fontSize: '12px' }}>
            ● SERVIDOR: {isLive ? 'ONLINE (LIVE)' : 'CONECTANDO...'}
          </span>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '25px' }}>
          
          {/* LISTA DE CONTATOS GOOGLE / SERVIDOR */}
          <aside style={glassStyle}>
            <h4 style={labelStyle}>Sincronizados (Google/Firebase)</h4>
            {['Minha Mãe', 'Irmão', 'Equipe Ninja'].map(contato => (
              <div key={contato} onClick={() => setActiveChat(contato)} style={{
                ...contactItem, 
                backgroundColor: activeChat === contato ? 'rgba(255,165,0,0.15)' : 'transparent',
                borderColor: activeChat === contato ? '#ffa500' : 'transparent'
              }}>
                <div style={statusDot} /> {contato}
              </div>
            ))}
            <button onClick={() => alert('Sincronizando com Google Contacts...')} style={syncBtn}>🔄 Sincronizar Novos</button>
          </aside>

          {/* ÁREA DE INTERAÇÃO */}
          <main style={{ position: 'relative' }}>
            <div style={narutoFloating}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '130px' }} />
            </div>

            <div style={chatWindow}>
              <div style={chatHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={avatar} style={avatarStyle} onClick={() => setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`)} />
                  <strong>{activeChat || 'Selecione alguém'}</strong>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => startCall('audio')} style={iconBtn}>📞</button>
                  <button onClick={() => startCall('video')} style={iconBtn}>📹</button>
                </div>
              </div>

              <div style={chatBody}>
                {messages.map(m => (
                  <div key={m.id} style={{ textAlign: m.type === 'sent' ? 'right' : 'left', margin: '15px 0' }}>
                    <div style={{
                      ...bubble, 
                      backgroundColor: m.type === 'sent' ? '#ffa500' : '#333',
                      color: m.type === 'sent' ? '#000' : '#fff',
                      borderBottomRightRadius: m.type === 'sent' ? '0' : '20px',
                      borderBottomLeftRadius: m.type === 'received' ? '0' : '20px',
                    }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={inputBar}>
                <label style={iconBtn}>
                  📎 <input type="file" hidden onChange={handleFileUpload} />
                </label>
                <input 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Envie texto, imagem ou áudio..." 
                  style={mainInput} 
                />
                <button onClick={sendMessage} style={sendBtn}>ENVIAR</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ESTILIZAÇÃO MANTENDO O TEMA NARUTO/PREMIUM
const containerStyle = { backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '10px' };
const glassStyle = { background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '20px', border: '1px solid rgba(255,165,0,0.2)' };
const labelStyle = { color: '#ffa500', fontSize: '12px', marginBottom: '20px', textTransform: 'uppercase' };
const contactItem = { padding: '15px', borderRadius: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', border: '1px solid transparent', transition: '0.3s' };
const statusDot = { width: '10px', height: '10px', background: '#4caf50', borderRadius: '50%', boxShadow: '0 0 10px #4caf50' };
const syncBtn = { width: '100%', background: 'transparent', color: '#ffa500', border: '1px dashed #ffa500', padding: '10px', borderRadius: '10px', cursor: 'pointer', marginTop: '10px' };
const narutoFloating = { position: 'absolute', top: '-90px', left: '40px', zIndex: 5 };
const chatWindow = { background: '#111', borderRadius: '35px', border: '2px solid #ffa500', height: '550px', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const chatHeader = { padding: '15px 25px', background: '#181818', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222' };
const avatarStyle = { width: '45px', borderRadius: '50%', border: '2px solid #ffa500', cursor: 'pointer' };
const iconBtn = { background: '#222', border: 'none', color: '#fff', padding: '12px', borderRadius: '15px', cursor: 'pointer', fontSize: '18px' };
const chatBody = { flex: 1, padding: '25px', overflowY: 'auto' };
const bubble = { padding: '12px 20px', borderRadius: '20px', display: 'inline-block', maxWidth: '80%', fontWeight: '500' };
const inputBar = { padding: '20px', background: '#181818', display: 'flex', gap: '10px', alignItems: 'center' };
const mainInput = { flex: 1, background: '#000', border: '1px solid #333', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' };
const sendBtn = { background: '#ffa500', color: '#000', border: 'none', padding: '15px 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
