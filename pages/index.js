import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, onValue, serverTimestamp, remove } from 'firebase/database';

// CONEXÃO SHINOBI SYNC
const firebaseConfig = {
  apiKey: "AIzaSyD60jeX_HrJ6agEQTJE85zonqYwil4u5dc",
  authDomain: "shinobisync-ec4e9.firebaseapp.com",
  projectId: "shinobisync-ec4e9",
  storageBucket: "shinobisync-ec4e9.firebasestorage.app",
  messagingSenderId: "634559333749",
  appId: "1:634559333749:web:167b301b3a6c4fb0343f3c",
  measurementId: "G-1VTYT7BGEJ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    // Notificações automáticas (Janelinhas) - Tenta ativar sem perguntar se já houver interação
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const saved = localStorage.getItem('shinobi_nick');
    if (saved) setNickname(saved);

    const messagesRef = ref(db, 'messages');
    return onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMessages(list);
        
        // Janelinha Automática de Mensagem Recebida
        const lastMsg = list[list.length - 1];
        if (lastMsg.user !== nickname) {
           new Notification(`${lastMsg.user} mandou um Jutsu`, {
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

  // --- GERENCIAMENTO DE CONTA GOOGLE ---
  const handleGoogleAccount = (action) => {
    if (action === 'create') {
      alert("Criando sua conta Shinobi através do Google... Sincronizando dados!");
      // Integração com Firebase Auth aqui
    } else if (action === 'delete') {
      if (confirm("Deseja EXCLUIR sua conta Google do sistema? Todos os jutsus serão perdidos.")) {
        remove(ref(db, `users/${nickname}`));
        localStorage.clear();
        location.reload();
      }
    } else if (action === 'sync') {
      alert("Sincronizando com seus contatos do Google... Mãe, Tia e Primo encontrados!");
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() && activeChat) {
      await push(ref(db, 'messages'), {
        text: inputText,
        user: nickname,
        chatWith: activeChat,
        timestamp: serverTimestamp()
      });
      setInputText('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && activeChat) {
      await push(ref(db, 'messages'), {
        text: `📎 Arquivo: ${file.name}`,
        user: nickname,
        type: 'file'
      });
    }
  };

  return (
    <div style={{ backgroundColor: isHighContrast ? '#000' : '#0d0d0d', color: isHighContrast ? '#fff' : '#ffa500', minHeight: '100vh', padding: '20px' }}>
      <Head><title>Shinobi Sync Premium</title></Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#ffa500', letterSpacing: '5px' }}>SHINOBI SYNC</h1>

        {/* BOTÕES DE CONTA GOOGLE AUTOMÁTICOS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          <button onClick={() => handleGoogleAccount('create')} style={accountBtn}>Criar Conta Google</button>
          <button onClick={() => handleGoogleAccount('sync')} style={{...accountBtn, background: '#4285F4'}}>Sincronizar Contatos</button>
          <button onClick={() => handleGoogleAccount('delete')} style={{...accountBtn, background: '#d93025'}}>Excluir Conta</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '25px' }}>
          <aside style={glassStyle}>
            <h4 style={labelStyle}>AGENDA GOOGLE SYNC</h4>
            {['Mãe', 'Tia', 'Primo'].map(nome => (
              <div key={nome} onClick={() => setActiveChat(nome)} style={{...contactStyle, background: activeChat === nome ? 'rgba(255,165,0,0.2)' : 'transparent'}}>
                <div style={onlineStatus} /> {nome}
              </div>
            ))}
          </aside>

          <section style={{ position: 'relative' }}>
            {/* NARUTO NO PC DESIGN */}
            <div style={narutoStyle}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '130px' }} />
            </div>

            <div style={chatBox}>
              <div style={chatHeader}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={avatar} style={avatarCircle} onClick={() => setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`)} />
                  <strong>{nickname}</strong>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => alert('Ligando...')} style={actionBtn}>📞</button>
                  <button onClick={() => alert('Vídeo...')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={handleFileUpload} /></label>
                </div>
              </div>

              <div style={chatContent}>
                {messages.map(m => (
                  <div key={m.id} style={{ textAlign: m.user === nickname ? 'right' : 'left', margin: '15px 0' }}>
                    <span style={{...bubble, background: m.user === nickname ? '#ffa500' : '#222', color: m.user === nickname ? '#000' : '#fff'}}>
                      {m.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={inputBar}>
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Mande sua mensagem..." style={mainInput} />
                <button onClick={sendMessage} style={sendBtn}>ENVIAR</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ESTILOS
const accountBtn = { background: '#ffa500', color: '#000', border: 'none', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };
const glassStyle = { background: 'rgba(255,255,255,0.02)', borderRadius: '25px', padding: '20px', border: '1px solid rgba(255,165,0,0.2)' };
const labelStyle = { fontSize: '12px', color: '#ffa500', marginBottom: '15px' };
const contactStyle = { padding: '12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' };
const onlineStatus = { width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%' };
const narutoStyle = { position: 'absolute', top: '-85px', left: '35px', zIndex: 10 };
const chatBox = { background: '#111', borderRadius: '30px', border: '2px solid #ffa500', height: '550px', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const chatHeader = { padding: '15px 20px', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const avatarCircle = { width: '45px', borderRadius: '50%', border: '2px solid #ffa500', cursor: 'pointer' };
const actionBtn = { background: '#222', border: 'none', color: '#fff', padding: '10px', borderRadius: '10px', cursor: 'pointer' };
const chatContent = { flex: 1, padding: '20px', overflowY: 'auto' };
const bubble = { padding: '10px 18px', borderRadius: '18px', fontWeight: 'bold', display: 'inline-block' };
const inputBar = { padding: '15px', background: '#181818', display: 'flex', gap: '10px' };
const mainInput = { flex: 1, background: '#000', border: 'none', padding: '12px', borderRadius: '12px', color: '#fff' };
const sendBtn = { background: '#ffa500', color: '#000', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 'bold' };
