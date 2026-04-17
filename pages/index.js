import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [nickname, setNickname] = useState('Novo Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=Naruto');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const savedNick = localStorage.getItem('shinobi_nick');
    const savedAvatar = localStorage.getItem('shinobi_avatar');
    if (savedNick) setNickname(savedNick);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  // --- FUNÇÕES DE PERSONALIZAÇÃO ---
  const handleProfile = () => {
    const action = prompt("Escolha uma opção:\n1. Criar Nickname de Anime\n2. Gerar Foto de Anime Aleatória");
    if (action === "1") {
      const n = prompt("Qual será seu nome ninja?");
      if (n) {
        setNickname(n);
        localStorage.setItem('shinobi_nick', n);
      }
    } else if (action === "2") {
      const newAv = `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`;
      setAvatar(newAv);
      localStorage.setItem('shinobi_avatar', newAv);
    }
  };

  // --- CHAMADAS E ARQUIVOS ---
  const startMedia = async (type) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
      alert(`Jutsu de ${type === 'video' ? 'Visão' : 'Voz'} ativado com sucesso!`);
    } catch (err) {
      alert("Erro ao acessar hardware: " + err.message);
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'me' }]);
      setInputValue('');
    }
  };

  return (
    <div style={{ 
      backgroundColor: highContrast ? '#000' : '#0f0f0f', 
      color: highContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', padding: '20px', 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: `${fontSize}px`
    }}>
      <Head>
        <title>Meu Shinobi - Interface Moderna</title>
      </Head>

      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', textShadow: '2px 2px 10px rgba(255, 165, 0, 0.5)' }}>MEU SHINOBI</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          
          {/* COLUNA ESQUERDA: CONTATOS */}
          <div style={cardStyle}>
            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>CONTATOS</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Sasuke_Uchiha', 'Sakura_Haruno', 'Kakashi_Sensei'].map(user => (
                <li key={user} onClick={handleProfile} style={contactItemStyle}>
                  <span style={{ color: '#4caf50' }}>●</span> {user}
                </li>
              ))}
            </ul>
          </div>

          {/* COLUNA DIREITA: CHAT COM NARUTO ANIMADO */}
          <div style={{ position: 'relative' }}>
            
            {/* NARUTO EM CIMA DO QUADRADO */}
            <div style={{ position: 'absolute', top: '-75px', left: '20px', zIndex: 2 }}>
              <img 
                src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" 
                alt="Naruto Digitando" 
                style={{ width: '120px', filter: 'drop-shadow(0 0 10px #ffa500)' }} 
              />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div>
                  <img src={avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                  <span>Conversando com: <strong>{nickname}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => startMedia('audio')} style={iconBtnStyle}>📞</button>
                  <button onClick={() => startMedia('video')} style={iconBtnStyle}>📹</button>
                  <label style={iconBtnStyle}>
                    📎
                    <input type="file" hidden onChange={(e) => alert('Arquivo: ' + e.target.files[0].name)} />
                  </label>
                </div>
              </div>

              <div style={messagesAreaStyle}>
                {messages.map((m, i) => (
                  <div key={i} style={{ textAlign: 'right', margin: '10px 0' }}>
                    <span style={messageBubbleStyle}>{m.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', padding: '15px' }}>
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escreva sua mensagem ninja..." 
                  style={inputStyle} 
                />
                <button onClick={handleSend} style={sendBtnStyle}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MENU DE CONFIGURAÇÕES E ACESSIBILIDADE */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={() => {
            const opt = prompt("CONFIGURAÇÕES:\n1. Alto Contraste (Visão)\n2. Aumentar Texto\n3. Diminuir Texto\n4. Personalizar Conta\n5. Excluir Conta");
            if(opt === "1") setHighContrast(!highContrast);
            if(opt === "2") setFontSize(fontSize + 2);
            if(opt === "3") setFontSize(fontSize - 2);
            if(opt === "4") handleProfile();
            if(opt === "5") { if(confirm("Deseja apagar tudo?")){ localStorage.clear(); location.reload(); } }
          }}
          style={settingsBtnStyle}
        >
          ⚙️ CONFIGS
        </button>
      </div>
    </div>
  );
}

// --- ESTILOS MODERNOS (CSS-in-JS) ---
const cardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  padding: '20px',
  height: 'fit-content'
};

const contactItemStyle = {
  padding: '12px',
  cursor: 'pointer',
  borderBottom: '1px solid #333',
  transition: '0.3s',
  borderRadius: '8px',
  marginBottom: '5px'
};

const chatBoxStyle = {
  background: '#1e1e1e',
  borderRadius: '25px',
  border: '2px solid #ffa500',
  boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
  display: 'flex',
  flexDirection: 'column',
  height: '500px',
  overflow: 'hidden'
};

const chatHeaderStyle = {
  background: '#252525',
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #333'
};

const messagesAreaStyle = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
  background: 'linear-gradient(180deg,
