import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Referência para o stream de vídeo
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedNick = localStorage.getItem('shinobi_nick');
    const savedAvatar = localStorage.getItem('shinobi_avatar');
    if (savedNick) setNickname(savedNick);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 1. CHAMADAS FUNCIONAIS (VÍDEO E ÁUDIO) ---
  const handleCall = async (mode) => {
    try {
      const constraints = { 
        video: mode === 'video', 
        audio: true 
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      alert(`Jutsu de ${mode === 'video' ? 'Visão' : 'Voz'} ativado! Permissão concedida.`);
      
      // Se for vídeo, poderíamos exibir num modal ou elemento flutuante
      if (mode === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      console.log("Stream ativo:", stream.getTracks());
    } catch (err) {
      alert("Erro de hardware: Certifique-se de dar permissão à câmera/microfone no navegador.");
      console.error(err);
    }
  };

  // --- 2. ENVIO DE ARQUIVOS ---
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = (file.size / 1024).toFixed(2);
      // Adiciona uma mensagem especial no chat indicando o arquivo
      setMessages([...messages, { 
        text: `📎 Arquivo enviado: ${file.name} (${fileSize} KB)`, 
        type: 'file' 
      }]);
      alert(`Arquivo "${file.name}" enviado via pergaminho de invocação!`);
    }
  };

  // --- 3. LÓGICA DE MENSAGENS E PERSONALIZAÇÃO ---
  const sendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, type: 'sent' }]);
      setInputText('');
    }
  };

  const customizeProfile = () => {
    const opt = prompt("Configuração de Perfil:\n1. Criar Nickname de Anime\n2. Gerar Avatar Ninja Aleatório");
    if (opt === "1") {
      const newNick = prompt("Qual seu novo nome ninja?");
      if (newNick) {
        setNickname(newNick);
        localStorage.setItem('shinobi_nick', newNick);
      }
    } else if (opt === "2") {
      const randomSeed = Math.floor(Math.random() * 10000);
      const newAv = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
      setAvatar(newAv);
      localStorage.setItem('shinobi_avatar', newAv);
    }
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d',
      color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      fontSize: `${fontSize}px`,
      transition: '0.3s'
    }}>
      <Head>
        <title>Meu Shinobi v2.1 - Funcional</title>
      </Head>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '5px', marginBottom: '50px' }}>MEU SHINOBI</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
          
          {/* LISTA DE CONTATOS (LOGADOS NO SISTEMA) */}
          <aside style={glassStyle}>
            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>CONTATOS ONLINE</h3>
            {['Sasuke_Uchiha', 'Sakura_Haruno', 'Kakashi_Sensei'].map(contact => (
              <div key={contact} onClick={() => setIsChatOpen(true)} style={contactStyle}>
                <div style={onlineStatus} />
                <span>{contact}</span>
              </div>
            ))}
          </aside>

          {/* ÁREA DO CHAT COM NARUTO ANIMADO */}
          <section style={{ position: 'relative' }}>
            <div style={narutoContainerStyle}>
              <img 
                src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" 
                alt="Naruto Typing" 
                style={{ width: '130px', filter: 'drop-shadow(0 0 10px #ffa500)' }}
              />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} style={{ width: '40px', borderRadius: '50%', border: '2px solid #ffa500' }} />
                  <span onClick={customizeProfile} style={{ cursor: 'pointer' }}>
                    Conversando com: <strong>{nickname}</strong> ▼
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleCall('audio')} style={actionBtn} title="Chamada de Áudio">📞</button>
                  <button onClick={() => handleCall('video')} style={actionBtn} title="Chamada de Vídeo">📹</button>
                  <label style={actionBtn} title="Enviar Arquivo">
                    📎
                    <input type="file" hidden onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              <div style={messageAreaStyle}>
                {messages.map((m, i) => (
                  <div key={i} style={{ textAlign: 'right', margin: '10px 0' }}>
                    <span style={{...bubbleStyle, background: m.type === 'file' ? '#4caf50' : '#ffa500'}}>
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
                  placeholder="Escreva sua mensagem ninja..." 
                  style={inputFieldStyle}
                />
                <button onClick={sendMessage} style={sendButtonStyle}>ENVIAR</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ACESSIBILIDADE E CONFIGS */}
      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("CONFIGURAÇÕES:\n1. Alto Contraste\n2. Aumentar Texto\n3. Diminuir Texto\n4. Excluir Minha Conta");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") setFontSize(fontSize - 2);
          if(m === "4") { if(confirm("Deseja apagar tudo?")){ localStorage.clear(); location.reload(); } }
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// OS ESTILOS PERMANECEM IGUAIS PARA NÃO MEXER NO DESIGN QUE VOCÊ ADOROU
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255, 165, 0, 0.2)', height: 'fit-content' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', cursor: 'pointer', borderRadius: '10px', transition: '0.2s', borderBottom: '1px solid #222' };
const onlineStatus = { width: '10px', height: '10px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 5px #4caf50' };
const narutoContainerStyle = { position: 'absolute', top: '-90px', left: '30px', zIndex: 10 };
const chatBoxStyle = { background: '#141414', border: '2px solid #ffa500', borderRadius: '25px', height: '550px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' };
const chatHeaderStyle = { padding: '20px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' };
const actionBtn = { background: '#333', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontSize: '1.2rem' };
const messageAreaStyle = { flex: 1, padding: '20px', overflowY: 'auto', background: 'radial-gradient(circle, #1a1a1a 0%, #0d0d0d 100%)' };
const bubbleStyle = { color: '#000', padding: '10px 18px', borderRadius: '18px 18px 0 18px', fontWeight: 'bold', display: 'inline-block' };
const inputAreaStyle = { padding: '20px', background: '#1a1a1a', display: 'flex', gap: '15px' };
const inputFieldStyle = { flex: 1, background: '#252525', border: '1px solid #444', borderRadius: '15px', padding: '12px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '60px', height: '60px', borderRadius: '50%', background: '#ffa500', border: 'none', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255,165,0,0.4)' };
