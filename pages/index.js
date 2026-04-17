import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  // Estados do Sistema
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const chatEndRef = useRef(null);

  // Sincronização Inicial
  useEffect(() => {
    const savedNick = localStorage.getItem('shinobi_nick');
    if (savedNick) setNickname(savedNick);
    
    // Simulação de mensagens iniciais da família
    setMessages([
      { id: 1, user: 'Mãe', text: 'Oi filho! Já entrou no sistema?', type: 'received' },
      { id: 2, user: 'Primo', text: 'E aí, vamos testar as chamadas?', type: 'received' }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNÇÕES DE COMUNICAÇÃO ---
  const sendMessage = () => {
    if (inputText.trim()) {
      const newMsg = {
        id: Date.now(),
        text: inputText,
        user: nickname,
        type: 'sent'
      };
      setMessages([...messages, newMsg]);
      setInputText('');
      
      // Aqui você conectaria com db.collection('messages').add(...) do seu Firebase
    }
  };

  const handleCall = async (mode) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: mode === 'video', audio: true });
      alert(`Jutsu de ${mode} ativado! Conectando com seus contatos...`);
    } catch (err) {
      alert("Hardware não encontrado ou permissão negada.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages([...messages, { id: Date.now(), user: nickname, text: `📎 Arquivo: ${file.name}`, type: 'sent' }]);
    }
  };

  const customizeProfile = () => {
    const n = prompt("Seu nome de Ninja:");
    if (n) {
      setNickname(n);
      localStorage.setItem('shinobi_nick', n);
    }
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d',
      color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', fontFamily: 'sans-serif', fontSize: `${fontSize}px`, transition: '0.3s'
    }}>
      <Head>
        <title>Shinobi Sync - Google & Firebase</title>
      </Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 15px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '4px', marginBottom: '40px', color: '#ffa500' }}>SHINOBI SYNC</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 320px) 1fr', gap: '25px' }}>
          
          {/* BARRA LATERAL: INTERLIGAÇÃO GOOGLE + FIREBASE */}
          <aside style={glassStyle}>
            <section style={{ marginBottom: '25px' }}>
              <h4 style={sectionTitleStyle}>📇 CONTATOS GOOGLE (FIREBASE)</h4>
              <div style={contactStyle}><div style={onlineStatus} />Mãe (Kushina)</div>
              <div style={contactStyle}><div style={onlineStatus} />Primo (Konohamaru)</div>
              <div style={contactStyle}><div style={onlineStatus} />Tia</div>
            </section>

            <section>
              <h4 style={sectionTitleStyle}>🟢 OUTROS ONLINE</h4>
              <div style={contactStyle}><div style={onlineStatus} />Sasuke_Uchiha</div>
              <div style={contactStyle}><div style={onlineStatus} />Sakura_Haruno</div>
            </section>
          </aside>

          {/* CHAT COM NARUTO NO COMPUTADOR */}
          <section style={{ position: 'relative' }}>
            <div style={narutoContainerStyle}>
              <img 
                src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" 
                style={{ width: '130px', filter: 'drop-shadow(0 0 10px #ffa500)' }} 
                alt="Naruto" 
              />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} style={{ width: '40px', borderRadius: '50%', border: '2px solid #ffa500' }} onClick={customizeProfile} />
                  <span><strong>{nickname}</strong> (Conectado)</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleCall('audio')} style={actionBtn}>📞</button>
                  <button onClick={() => handleCall('video')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={handleFileUpload} /></label>
                </div>
              </div>

              <div style={messageAreaStyle}>
                {messages.map((m) => (
                  <div key={m.id} style={{ textAlign: m.type === 'sent' ? 'right' : 'left', margin: '15px 0' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>{m.user}</div>
                    <span style={{
                      ...bubbleStyle, 
                      background: m.type === 'sent' ? '#ffa500' : '#2a2a2a', 
                      color: m.type === 'sent' ? '#000' : '#fff',
                      borderRadius: m.type === 'sent' ? '20px 20px 0 20px' : '20px 20px 20px 0'
                    }}>
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
                  placeholder="Mandar mensagem para a família..." 
                  style={inputFieldStyle}
                />
                <button onClick={sendMessage} style={sendButtonStyle}>ENVIAR</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* BOTÃO DE ACESSIBILIDADE */}
      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("MENU NINJA:\n1. Alto Contraste\n2. Aumentar Texto\n3. Diminuir Texto\n4. Mudar Nome");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") setFontSize(fontSize - 2);
          if(m === "4") customizeProfile();
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// --- ESTILOS (CSS-IN-JS) ---
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '25px', padding: '25px', border: '1px solid rgba(255, 165, 0, 0.15)' };
const sectionTitleStyle = { color: '#ffa500', fontSize: '11px', letterSpacing: '2px', marginBottom: '15px', textTransform: 'uppercase' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', fontSize: '14px' };
const onlineStatus = { width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 8px #4caf50' };
const narutoContainerStyle = { position: 'absolute', top: '-95px', left: '35px', zIndex: 10 };
const chatBoxStyle = { background: '#121212', border: '2px solid #ffa500', borderRadius: '30px', height: '580px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' };
const chatHeaderStyle = { padding: '15px 20px', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' };
const actionBtn = { background: '#252525', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontSize: '16px' };
const messageAreaStyle = { flex: 1, padding: '25px', overflowY: 'auto', background: 'linear-gradient(to bottom, #121212, #080808)' };
const bubbleStyle = { padding: '12px 20px', fontWeight: '600', display: 'inline-block', maxWidth: '85%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' };
const inputAreaStyle = { padding: '20px', background: '#181818', display: 'flex', gap: '12px' };
const inputFieldStyle = { flex: 1, background: '#222', border: '1px solid #333', borderRadius: '15px', padding: '12px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '60px', height: '60px', borderRadius: '50%', background: '#ffa500', border: 'none', cursor: 'pointer', fontSize: '1.5rem', boxShadow: '0 0 20px rgba(255,165,0,0.3)' };
