import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('shinobi_nick');
    if (saved) setNickname(saved);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNÇÃO PARA ATIVAR NOTIFICAÇÕES (ESTILO WHATSAPP) ---
  const enableNotifications = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") alert("Janelinhas de notificação ativadas!");
      });
    }
  };

  const showPopUp = (user, text) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Mensagem de ${user}`, { body: text, icon: avatar });
    }
  };

  // --- PERSONALIZAR AVATAR DE ANIME ---
  const changeAvatar = () => {
    const opt = prompt("1. Novo Nickname\n2. Gerar Foto de Anime Aleatória");
    if (opt === "1") {
      const n = prompt("Seu nome ninja:");
      if (n) { setNickname(n); localStorage.setItem('shinobi_nick', n); }
    } else if (opt === "2") {
      const newSeed = Math.floor(Math.random() * 1000);
      setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${newSeed}`);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() && activeChat) {
      setMessages([...messages, { id: Date.now(), text: inputText, user: nickname, type: 'sent' }]);
      setInputText('');
      // Simula uma resposta com notificação
      setTimeout(() => showPopUp(activeChat, "Recebi sua mensagem!"), 1500);
    } else if (!activeChat) {
      alert("Clique em um contato Google primeiro!");
    }
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d', color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', fontFamily: 'sans-serif', fontSize: `${fontSize}px`, transition: '0.3s'
    }}>
      <Head><title>Shinobi Sync v3.0</title></Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '4px', color: '#ffa500' }}>SHINOBI SYNC</h1>
        
        <center>
           <button onClick={enableNotifications} style={{background: '#4caf50', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '20px', marginBottom: '20px', cursor: 'pointer'}}>
             🔔 Ativar Janelinhas (Notificações)
           </button>
        </center>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 320px) 1fr', gap: '20px' }}>
          
          {/* BARRA LATERAL */}
          <aside style={glassStyle}>
            <h4 style={sectionTitleStyle}>📇 CONTATOS GOOGLE</h4>
            {['Mãe', 'Tia', 'Primo'].map(nome => (
              <div key={nome} onClick={() => setActiveChat(nome)} 
                style={{...contactStyle, border: activeChat === nome ? '1px solid #ffa500' : '1px solid transparent', background: activeChat === nome ? 'rgba(255,165,0,0.1)' : 'rgba(255,255,255,0.02)'}}>
                <div style={onlineStatus} /> {nome}
              </div>
            ))}
          </aside>

          {/* CHAT COM NARUTO */}
          <section style={{ position: 'relative' }}>
            <div style={narutoContainerStyle}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '120px', filter: 'drop-shadow(0 0 10px #ffa500)' }} />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} onClick={changeAvatar} style={{ width: '45px', borderRadius: '50%', border: '2px solid #ffa500', cursor: 'pointer' }} title="Mudar Avatar de Anime" />
                  <div>
                    <strong>{nickname}</strong>
                    <div style={{fontSize: '11px', color: '#4caf50'}}>{activeChat ? `Falando com ${activeChat}` : 'Selecione um contato'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => alert('Iniciando áudio...')} style={actionBtn}>📞</button>
                  <button onClick={() => alert('Iniciando vídeo...')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={() => alert('Arquivo pronto!')} /></label>
                </div>
              </div>

              <div style={messageAreaStyle}>
                {messages.map((m) => (
                  <div key={m.id} style={{ textAlign: m.type === 'sent' ? 'right' : 'left', margin: '15px 0' }}>
                    <span style={{...bubbleStyle, background: m.type === 'sent' ? '#ffa500' : '#2a2a2a', color: m.type === 'sent' ? '#000' : '#fff'}}>
                      {m.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={inputAreaStyle}>
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Mandar mensagem..." style={inputFieldStyle} />
                <button onClick={sendMessage} style={sendButtonStyle}>ENVIAR</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CONFIGS */}
      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("MENU:\n1. Contraste\n2. + Fonte\n3. - Fonte");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") setFontSize(fontSize - 2);
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// ESTILOS ORIGINAIS PRESERVADOS
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '25px', padding: '25px', border: '1px solid rgba(255, 165, 0, 0.15)' };
const sectionTitleStyle = { color: '#ffa500', fontSize: '11px', letterSpacing: '2px', marginBottom: '15px' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer' };
const onlineStatus = { width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 8px #4caf50' };
const narutoContainerStyle = { position: 'absolute', top: '-85px', left: '35px', zIndex: 10 };
const chatBoxStyle = { background: '#121212', border: '2px solid #ffa500', borderRadius: '30px', height: '550px', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const chatHeaderStyle = { padding: '15px 20px', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const actionBtn = { background: '#252525', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const messageAreaStyle = { flex: 1, padding: '25px', overflowY: 'auto', background: '#0d0d0d' };
const bubbleStyle = { padding: '12px 20px', borderRadius: '20px', fontWeight: '600', display: 'inline-block', maxWidth: '85%' };
const inputAreaStyle = { padding: '20px', background: '#181818', display: 'flex', gap: '12px' };
const inputFieldStyle = { flex: 1, background: '#222', border: '1px solid #333', borderRadius: '15px', padding: '12px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '60px', height: '60px', borderRadius: '50%', background: '#ffa500', border: 'none', cursor: 'pointer', fontSize: '1.5rem' };
