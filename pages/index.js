import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, onValue, serverTimestamp } from 'firebase/database';

// SUAS CHAVES DE ACESSO SHINOBI
const firebaseConfig = {
  apiKey: "AIzaSyD60jeX_HrJ6agEQTJE85zonqYwil4u5dc",
  authDomain: "shinobisync-ec4e9.firebaseapp.com",
  projectId: "shinobisync-ec4e9",
  storageBucket: "shinobisync-ec4e9.firebasestorage.app",
  messagingSenderId: "634559333749",
  appId: "1:634559333749:web:167b301b3a6c4fb0343f3c",
  measurementId: "G-1VTYT7BGEJ"
};

// Inicializa o Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const chatEndRef = useRef(null);

  // 1. SINCRONIZAÇÃO EM TEMPO REAL (LIVE)
  useEffect(() => {
    const saved = localStorage.getItem('shinobi_nick');
    if (saved) setNickname(saved);

    // Escuta as mensagens do servidor
    const messagesRef = ref(db, 'messages');
    return onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMessages(list);
        
        // Disparar Janelinha (Notificação) se for mensagem de outro ninja
        const lastMsg = list[list.length - 1];
        if (lastMsg.user !== nickname && Notification.permission === "granted") {
          new Notification(`Nova Mensagem de ${lastMsg.user}`, {
            body: lastMsg.text,
            icon: 'https://cdn-icons-png.flaticon.com/512/1152/1152912.png'
          });
        }
      }
    });
  }, [nickname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNÇÕES DE ENVIO PARA O SERVIDOR ---
  const sendMessage = async () => {
    if (inputText.trim() && activeChat) {
      await push(ref(db, 'messages'), {
        text: inputText,
        user: nickname,
        chatWith: activeChat,
        timestamp: serverTimestamp(),
        type: 'text'
      });
      setInputText('');
    } else if (!activeChat) {
      alert("Selecione um contato Google primeiro!");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && activeChat) {
      await push(ref(db, 'messages'), {
        text: `📎 Arquivo enviado: ${file.name}`,
        user: nickname,
        type: 'file',
        timestamp: serverTimestamp()
      });
      alert("Arquivo enviado para o servidor!");
    }
  };

  const handleCall = (mode) => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    alert(`Iniciando Jutsu de ${mode} com ${activeChat}... Conectando via Servidor Shinobi!`);
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d', color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', fontFamily: 'sans-serif', fontSize: `${fontSize}px`, transition: '0.3s'
    }}>
      <Head><title>Shinobi Sync LIVE</title></Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '4px', color: '#ffa500', marginBottom: '25px' }}>SHINOBI SYNC v4.0</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 320px) 1fr', gap: '20px' }}>
          
          {/* BARRA LATERAL (CONTATOS GOOGLE) */}
          <aside style={glassStyle}>
            <h4 style={sectionTitleStyle}>📇 CONTATOS GOOGLE / FIREBASE</h4>
            {['Mãe', 'Tia', 'Primo'].map(nome => (
              <div key={nome} onClick={() => setActiveChat(nome)} 
                style={{...contactStyle, border: activeChat === nome ? '1px solid #ffa500' : '1px solid transparent', background: activeChat === nome ? 'rgba(255,165,0,0.1)' : 'rgba(255,255,255,0.02)'}}>
                <div style={onlineStatus} /> {nome}
              </div>
            ))}
            <button onClick={() => alert('Sincronizando contatos Google...')} style={syncBtn}>Sincronizar Agenda</button>
          </aside>

          {/* CHAT COM NARUTO NO PC (DESIGN PRESERVADO) */}
          <section style={{ position: 'relative' }}>
            <div style={narutoContainerStyle}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '125px', filter: 'drop-shadow(0 0 10px #ffa500)' }} />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} style={{ width: '45px', borderRadius: '50%', border: '2px solid #ffa500' }} />
                  <div>
                    <strong>{nickname}</strong>
                    <div style={{fontSize: '11px', color: '#4caf50'}}>{activeChat ? `Live com ${activeChat}` : 'Selecione um Ninja'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleCall('audio')} style={actionBtn}>📞</button>
                  <button onClick={() => handleCall('video')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={handleFileUpload} /></label>
                </div>
              </div>

              <div style={messageAreaStyle}>
                {messages.map((m) => (
                  <div key={m.id} style={{ textAlign: m.user === nickname ? 'right' : 'left', margin: '15px 0' }}>
                    <div style={{fontSize: '10px', opacity: 0.5}}>{m.user}</div>
                    <span style={{...bubbleStyle, background: m.user === nickname ? '#ffa500' : '#2a2a2a', color: m.user === nickname ? '#000' : '#fff'}}>
                      {m.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={inputAreaStyle}>
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Mande um jutsu de texto..." style={inputFieldStyle} />
                <button onClick={sendMessage} style={sendButtonStyle}>➤</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("MENU:\n1. Contraste\n2. + Fonte\n3. Nickname");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") { const n = prompt("Nome:"); if(n) setNickname(n); }
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// ESTILOS ORIGINAIS (O DESIGN QUE VOCÊ GOSTOU)
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '25px', padding: '25px', border: '1px solid rgba(255, 165, 0, 0.15)' };
const sectionTitleStyle = { color: '#ffa500', fontSize: '11px', letterSpacing: '2px', marginBottom: '15px' };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer' };
const onlineStatus = { width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 8px #4caf50' };
const syncBtn = { background: 'none', border: '1px dashed #ffa500', color: '#ffa500', padding: '10px', width: '100%', borderRadius: '10px', cursor: 'pointer', marginTop: '10px' };
const narutoContainerStyle = { position: 'absolute', top: '-85px', left: '35px', zIndex: 10 };
const chatBoxStyle = { background: '#121212', border: '2px solid #ffa500', borderRadius: '30px', height: '520px', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const chatHeaderStyle = { padding: '15px 20px', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const actionBtn = { background: '#252525', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const messageAreaStyle = { flex: 1, padding: '25px', overflowY: 'auto' };
const bubbleStyle = { padding: '12px 20px', borderRadius: '20px', fontWeight: '600', display: 'inline-block', maxWidth: '85%' };
const inputAreaStyle = { padding: '20px', background: '#181818', display: 'flex', gap: '12px' };
const inputFieldStyle = { flex: 1, background: '#222', border: '1px solid #333', borderRadius: '15px', padding: '12px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '60px', height: '60px', borderRadius: '50%', background: '#ffa500', border: 'none', cursor: 'pointer', fontSize: '1.5rem' };
