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
    
    // Solicita permissão de notificação logo ao abrir, se ainda não tiver
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 1. FUNÇÃO DE JANELINHAS (NOTIFICAÇÕES ESTILO WHATSAPP) ---
  const enableNotifications = () => {
    if (!("Notification" in window)) {
      alert("Este navegador não suporta janelinhas de notificação.");
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        // Envia uma notificação de teste imediata
        new Notification("Sistema Shinobi", {
          body: "Janelinhas ativadas com sucesso! Você receberá jutsus de mensagem aqui.",
          icon: avatar
        });
      } else {
        alert("Você precisa permitir as notificações nas configurações do navegador.");
      }
    });
  };

  const sendPopUp = (user, text) => {
    if (Notification.permission === "granted") {
      new Notification(`Mensagem de ${user}`, {
        body: text,
        icon: 'https://cdn-icons-png.flaticon.com/512/1152/1152912.png' // Ícone de alerta ninja
      });
    }
  };

  // --- 2. CRIAR / SINCRONIZAR CONTATO GOOGLE ---
  const createGoogleContact = () => {
    // Simulação de integração com Google People API / Firebase Auth
    const email = prompt("Digite o e-mail Google do contato que deseja adicionar:");
    if (email && email.includes("@")) {
      const nome = prompt("Como deseja salvar esse contato na sua agenda Shinobi?");
      alert(`Sucesso! ${nome} (${email}) foi interligado ao seu Firebase e aparecerá na lista quando estiver online.`);
      // Aqui você dispararia a função para salvar no Firestore: 
      // db.collection('contatos').add({ email, nome, dono: meuEmail })
    } else if (email) {
      alert("Por favor, digite um e-mail válido.");
    }
  };

  // --- 3. LÓGICA DE MENSAGENS E AVATAR ---
  const changeAvatar = () => {
    const opt = prompt("PERFIL:\n1. Mudar Nome\n2. Gerar Foto Anime");
    if (opt === "1") {
      const n = prompt("Novo Nome:");
      if (n) { setNickname(n); localStorage.setItem('shinobi_nick', n); }
    } else if (opt === "2") {
      setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() && activeChat) {
      setMessages([...messages, { id: Date.now(), text: inputText, user: nickname, type: 'sent' }]);
      setInputText('');
      // Simula a janelinha do WhatsApp chegando depois de 2 segundos
      setTimeout(() => sendPopUp(activeChat, "Recebi seu pergaminho!"), 2000);
    } else if (!activeChat) {
      alert("Escolha alguém na lista de Contatos Google primeiro!");
    }
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d', color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', fontFamily: 'sans-serif', fontSize: `${fontSize}px`, transition: '0.3s'
    }}>
      <Head><title>Meu Shinobi - Funcional</title></Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '4px', color: '#ffa500', marginBottom: '10px' }}>SHINOBI SYNC</h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}>
           <button onClick={enableNotifications} style={topBtnStyle}>🔔 Ativar Janelinhas</button>
           <button onClick={createGoogleContact} style={{...topBtnStyle, background: '#4285F4'}}>➕ Criar Contato Google</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '20px' }}>
          
          <aside style={glassStyle}>
            <h4 style={sectionTitleStyle}>📇 CONTATOS GOOGLE / FIREBASE</h4>
            {['Mãe', 'Tia', 'Primo'].map(nome => (
              <div key={nome} onClick={() => setActiveChat(nome)} 
                style={{...contactStyle, border: activeChat === nome ? '1px solid #ffa500' : '1px solid transparent', background: activeChat === nome ? 'rgba(255,165,0,0.1)' : 'rgba(255,255,255,0.02)'}}>
                <div style={onlineStatus} /> {nome}
              </div>
            ))}
          </aside>

          <section style={{ position: 'relative' }}>
            {/* O NARUTO NO PC QUE VOCÊ ADOROU */}
            <div style={narutoContainerStyle}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '125px', filter: 'drop-shadow(0 0 10px #ffa500)' }} />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} onClick={changeAvatar} style={{ width: '45px', borderRadius: '50%', border: '2px solid #ffa500', cursor: 'pointer' }} />
                  <div>
                    <strong>{nickname}</strong>
                    <div style={{fontSize: '11px', color: '#4caf50'}}>{activeChat ? `Falando com ${activeChat}` : 'Aguardando seleção...'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => alert('Ligando...')} style={actionBtn}>📞</button>
                  <button onClick={() => alert('Abrindo Vídeo...')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={(e) => alert('Arquivo: ' + e.target.files[0].name)} /></label>
                </div>
              </div>

              <div style={messageAreaStyle}>
                {messages.length === 0 && <center style={{opacity: 0.3, marginTop: '100px'}}>Nenhuma mensagem ainda.</center>}
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
                  placeholder="Mensagem..." style={inputFieldStyle} />
                <button onClick={sendMessage} style={sendButtonStyle}>➤</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("AJUSTES:\n1. Contraste\n2. + Fonte\n3. - Fonte");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") setFontSize(fontSize - 2);
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// ESTILOS
const topBtnStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '25px', padding: '25px', border: '1px solid rgba(255, 165, 0, 0.15)' };
const sectionTitleStyle = { color: '#ffa500', fontSize: '11px', letterSpacing: '2px', marginBottom: '15px', textTransform: 'uppercase' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer', transition: '0.2s' };
const onlineStatus = { width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 8px #4caf50' };
const narutoContainerStyle = { position: 'absolute', top: '-85px', left: '35px', zIndex: 10 };
const chatBoxStyle = { background: '#121212', border: '2px solid #ffa500', borderRadius: '30px', height: '520px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' };
const chatHeaderStyle = { padding: '15px 20px', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' };
const actionBtn = { background: '#252525', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const messageAreaStyle = { flex: 1, padding: '25px', overflowY: 'auto' };
const bubbleStyle = { padding: '12px 20px', borderRadius: '20px', fontWeight: '600', display: 'inline-block', maxWidth: '85%' };
const inputAreaStyle = { padding: '20px', background: '#181818', display: 'flex', gap: '12px' };
const inputFieldStyle = { flex: 1, background: '#222', border: '1px solid #333', borderRadius: '15px', padding: '12px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 20px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '20px' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '60px', height: '60px', borderRadius: '50%', background: '#ffa500', border: 'none', cursor: 'pointer', fontSize: '1.5rem' };
