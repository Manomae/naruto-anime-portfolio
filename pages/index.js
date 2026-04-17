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

// Inicialização segura para Mobile/Next.js
let db;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getDatabase(app);
} catch (e) {
  console.error("Erro ao conectar no servidor ninja:", e);
}

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [activeChat, setActiveChat] = useState('Família');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // 1. SISTEMA DE JANELINHAS AUTOMÁTICO
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
    
    const saved = localStorage.getItem('shinobi_nick');
    if (saved) setNickname(saved);

    if (db) {
      const messagesRef = ref(db, 'messages');
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setMessages(list);
          
          // Dispara janelinha se a aba não estiver focada ou se for msg nova de outro
          const lastMsg = list[list.length - 1];
          if (lastMsg.user !== nickname && document.visibilityState !== 'visible') {
            new Notification(`Mensagem de ${lastMsg.user}`, {
              body: lastMsg.text,
              icon: 'https://cdn-icons-png.flaticon.com/512/1152/1152912.png'
            });
          }
        }
      });
    }
  }, [nickname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNÇÕES DA CONTA GOOGLE ---
  const manageAccount = (type) => {
    if (type === 'create') {
      const n = prompt("Escolha seu Nickname para vincular à conta Google:");
      if (n) { setNickname(n); localStorage.setItem('shinobi_nick', n); alert("Conta Criada e Sincronizada!"); }
    } else if (type === 'sync') {
      alert("Sincronizando... Mãe, Tia e Primo agora estão na sua lista de jutsus!");
    } else if (type === 'delete') {
      if (confirm("Deseja EXCLUIR sua conta Google do sistema?")) {
        localStorage.clear();
        location.reload();
      }
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() && db) {
      await push(ref(db, 'messages'), {
        text: inputText,
        user: nickname,
        timestamp: serverTimestamp()
      });
      setInputText('');
    }
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#ffa500', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif' }}>
      <Head><title>Meu Shinobi LIVE</title></Head>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '4px' }}>SHINOBI SYNC</h1>

        {/* BOTÕES DE GERENCIAMENTO DE CONTA */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button onClick={() => manageAccount('create')} style={accBtn}>Criar Conta</button>
          <button onClick={() => manageAccount('sync')} style={{...accBtn, background: '#4285F4'}}>Sincronizar</button>
          <button onClick={() => manageAccount('delete')} style={{...accBtn, background: '#d93025'}}>Excluir</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* LISTA DE CONTATOS */}
          <aside style={glassStyle}>
            <h4 style={{fontSize: '12px', opacity: 0.7}}>AGENDA GOOGLE SYNC</h4>
            {['Mãe', 'Tia', 'Primo'].map(n => (
              <div key={n} onClick={() => setActiveChat(n)} style={{...contactRow, background: activeChat === n ? 'rgba(255,165,0,0.2)' : 'transparent'}}>
                <div style={dot} /> {n}
              </div>
            ))}
          </aside>

          {/* CHAT PREMIUM COM NARUTO */}
          <section style={{ position: 'relative', marginTop: '40px' }}>
            <div style={narutoContainer}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '120px' }} />
            </div>

            <div style={chatBox}>
              <div style={chatHeader}>
                <img src={avatar} style={avatarImg} onClick={() => setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`)} />
                <strong>{nickname} (Online)</strong>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                  <button onClick={() => alert('Ligando...')} style={iconBtn}>📞</button>
                  <label style={iconBtn}>📎<input type="file" hidden onChange={(e) => alert('Arquivo: ' + e.target.files[0].name)} /></label>
                </div>
              </div>

              <div style={chatMessages}>
                {messages.map(m => (
                  <div key={m.id} style={{ textAlign: m.user === nickname ? 'right' : 'left', margin: '10px 0' }}>
                    <span style={{...bubble, background: m.user === nickname ? '#ffa500' : '#222', color: m.user === nickname ? '#000' : '#fff'}}>
                      {m.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={inputArea}>
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Mande um jutsu..." style={inputField} />
                <button onClick={sendMessage} style={sendBtn}>➤</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ESTILOS
const accBtn = { background: '#ffa500', color: '#000', border: 'none', padding: '10px 15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const glassStyle = { background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '15px', border: '1px solid rgba(255,165,0,0.1)' };
const contactRow = { padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', cursor: 'pointer' };
const dot = { width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%', boxShadow: '0 0 5px #4caf50' };
const narutoContainer = { position: 'absolute', top: '-85px', left: '30px', zIndex: 5 };
const chatBox = { background: '#111', borderRadius: '30px', border: '2px solid #ffa500', height: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const chatHeader = { padding: '15px', background: '#181818', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #222' };
const avatarImg = { width: '40px', borderRadius: '50%', border: '2px solid #ffa500', cursor: 'pointer' };
const iconBtn = { background: '#222', border: 'none', color: '#fff', padding: '8px', borderRadius: '10px', cursor: 'pointer' };
const chatMessages = { flex: 1, padding: '20px', overflowY: 'auto' };
const bubble = { padding: '10px 15px', borderRadius: '15px', fontWeight: 'bold', display: 'inline-block', maxWidth: '80%' };
const inputArea = { padding: '15px', background: '#181818', display: 'flex', gap: '10px' };
const inputField = { flex: 1, background: '#000', border: 'none', padding: '12px', borderRadius: '12px', color: '#fff' };
const sendBtn = { background: '#ffa500', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
