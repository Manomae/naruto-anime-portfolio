import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    // Pedir permissão para as janelinhas de notificação (estilo WhatsApp)
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const savedNick = localStorage.getItem('shinobi_nick');
    const savedAvatar = localStorage.getItem('shinobi_avatar');
    if (savedNick) setNickname(savedNick);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNÇÃO DE NOTIFICAÇÃO (JANELINHA) ---
  const showNotification = (sender, text) => {
    if (Notification.permission === "granted") {
      new Notification(`Mensagem de ${sender}`, {
        body: text,
        icon: avatar
      });
    }
  };

  // --- MENSAGEM COM NOTIFICAÇÃO ---
  const sendMessage = () => {
    if (inputText.trim() && activeChat) {
      const newMsg = { id: Date.now(), text: inputText, user: nickname, type: 'sent' };
      setMessages([...messages, newMsg]);
      
      // Simulação: se fosse sua mãe respondendo, a janelinha apareceria
      setTimeout(() => {
        showNotification(activeChat, "Recebi seu jutsu de mensagem!");
      }, 1000);

      setInputText('');
    }
  };

  // --- AVATAR E NICKNAME ---
  const handleAvatarClick = () => {
    const opt = prompt("PERFIL NINJA:\n1. Criar Nickname de Anime\n2. Gerar Foto de Anime Aleatória");
    if (opt === "1") {
      const n = prompt("Seu novo Nickname:");
      if (n) { setNickname(n); localStorage.setItem('shinobi_nick', n); }
    } else if (opt === "2") {
      const newAv = `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`;
      setAvatar(newAv); localStorage.setItem('shinobi_avatar', newAv);
    }
  };

  const handleCall = async (mode) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: mode === 'video', audio: true });
      showNotification("Chamada em curso", `Você iniciou um ${mode} com ${activeChat}`);
      alert(`${mode} ativado!`);
    } catch (err) { alert("Erro no hardware."); }
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d',
      color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', fontFamily: 'sans-serif', fontSize: `${fontSize}px`, transition: '0.3s'
    }}>
      <Head><title>Shinobi Sync - Notificações Reais</title></Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 15px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '4px', marginBottom: '40px', color: '#ffa500' }}>SHINOBI SYNC</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px' }}>
          
          <aside style={glassStyle}>
            <h4 style={sectionTitleStyle}>📇 CONTATOS GOOGLE (FAMÍLIA)</h4>
            {['Mãe', 'Tia', 'Primo'].map(nome => (
              <div key={nome} onClick={() => setActiveChat(nome)} 
                style={{...contactStyle, border: activeChat === nome ? '1px solid #ffa500' : '1px solid transparent', background: activeChat === nome ? 'rgba(255,165,0,0.1)' : 'rgba(255,255,255,0.02)'}}>
                <div style={onlineStatus} /> {nome} (Google Sync)
              </div>
            ))}
          </aside>

          <section style={{ position: 'relative' }}>
            {/* O NARUTO QUE VOCÊ ADOROU */}
            <div style={narutoContainerStyle}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '130px', filter: 'drop-shadow(0 0 10px #ffa500)' }} />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} onClick={handleAvatarClick} style={{ width: '45px', borderRadius: '50%', border: '2px solid #ffa500', cursor: 'pointer' }} />
                  <div>
                    <strong>{nickname}</strong>
                    <div style={{fontSize: '11px', color: '#4caf50'}}>{activeChat ? `Chat com ${activeChat}` : 'Aguardando contato...'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleCall('audio')} style={actionBtn}>📞</button>
                  <button onClick={() => handleCall('video')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={(e) => alert('Arquivo pronto!')} /></label>
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
                  placeholder={activeChat ? `Mensagem para ${activeChat}...` : "Escolha um contato Google"} style={inputFieldStyle} />
                <button onClick={sendMessage} style={sendButtonStyle}>ENVIAR</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("MENU:\n1. Contraste\n2. + Texto\n3. - Texto\n4. Configurar Conta Google");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") setFontSize(fontSize - 2);
          if(m === "4") alert("Sincronizando contatos com Firebase Auth...");
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// ESTILOS ORIGINAIS (MANTENDO SEU DESIGN)
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '25px', padding: '25px', border: '1px solid rgba(255, 165, 0, 0.15)' };
const sectionTitleStyle = { color: '#ffa500', fontSize: '11px', letterSpacing: '2px', marginBottom: '15px' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer' };
const onlineStatus = { width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 8px #4caf50' };
const narutoContainerStyle = { position: 'absolute', top: '-95px', left: '35px', zIndex: 10 };
const chatBoxStyle = { background: '#121212', border: '2px solid #ffa500', borderRadius: '30px', height: '580px', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const chatHeaderStyle = { padding: '15px 20px', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' };
const actionBtn = { background: '#252525', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const messageAreaStyle = { flex: 1, padding: '25px', overflowY: 'auto', background: 'linear-gradient(to bottom, #121212, #080808)' };
const bubbleStyle = { padding: '12px 20px', borderRadius: '20px', fontWeight: '600', display: 'inline-block', maxWidth: '85%' };
const inputAreaStyle = { padding: '20px', background: '#181818', display: 'flex', gap: '12px' };
const inputFieldStyle = { flex: 1, background: '#222', border: '1px solid #333', borderRadius: '15px', padding: '12px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '60px', height: '60px', borderRadius: '50%', background: '#ffa500', border: 'none', cursor: 'pointer', fontSize: '1.5rem' };
