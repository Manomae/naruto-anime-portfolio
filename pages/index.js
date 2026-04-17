import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
// Importações do Firebase (Certifique-se de configurar o arquivo firebaseConfig.js)
import { db } from '../firebaseConfig'; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';

export default function Home() {
  const [nickname, setNickname] = useState('Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=Naruto');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Listas separadas para sua ideia de interligação
  const [firebaseOnline, setFirebaseOnline] = useState([]);
  const [googleContacts, setGoogleContacts] = useState([]); // Contatos vindos do Google/Firebase
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedNick = localStorage.getItem('shinobi_nick');
    const savedAvatar = localStorage.getItem('shinobi_avatar');
    if (savedNick) setNickname(savedNick);
    if (savedAvatar) setAvatar(savedAvatar);

    // 1. ESCUTAR USUÁRIOS ONLINE NO FIREBASE
    const qUsers = query(collection(db, "users"), where("status", "==", "online"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const online = [];
      const gContacts = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Lógica de interligação: se tem conta Google vinculada, vai para a lista Google
        if (data.isGoogleContact) {
          gContacts.push({ id: doc.id, ...data });
        } else {
          online.push({ id: doc.id, ...data });
        }
      });
      setFirebaseOnline(online);
      setGoogleContacts(gContacts);
    });

    // 2. ESCUTAR MENSAGENS EM TEMPO REAL
    const qMsg = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubMsg = onSnapshot(qMsg, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => { unsubUsers(); unsubMsg(); };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNÇÕES DE COMUNICAÇÃO ---
  const sendMessage = async () => {
    if (inputText.trim()) {
      await addDoc(collection(db, "messages"), {
        text: inputText,
        user: nickname,
        avatar: avatar,
        createdAt: serverTimestamp(),
        type: 'text'
      });
      setInputText('');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await addDoc(collection(db, "messages"), {
        text: `📎 Arquivo: ${file.name}`,
        user: nickname,
        createdAt: serverTimestamp(),
        type: 'file'
      });
      alert("Enviado com sucesso!");
    }
  };

  const handleCall = async (mode) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: mode === 'video', audio: true });
      alert(`Jutsu de ${mode} ativado! Conectando com sua família...`);
    } catch (err) { alert("Hardware não encontrado."); }
  };

  return (
    <div style={{
      backgroundColor: isHighContrast ? '#000' : '#0d0d0d',
      color: isHighContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', fontFamily: 'sans-serif', fontSize: `${fontSize}px`, transition: '0.3s'
    }}>
      <Head><title>Shinobi Sync - Google & Firebase</title></Head>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 15px' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '4px', marginBottom: '40px' }}>SHINOBI SYNC</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px' }}>
          
          {/* BARRA LATERAL COM AS DUAS LISTAS INTERLIGADAS */}
          <aside style={glassStyle}>
            <section style={{ marginBottom: '25px' }}>
              <h4 style={sectionTitleStyle}>📇 CONTATOS GOOGLE</h4>
              {googleContacts.length === 0 ? (
                <div style={emptyStyle}>Sincronizando com sua agenda...</div>
              ) : (
                googleContacts.map(c => (
                  <div key={c.id} style={contactStyle}><div style={onlineStatus} />{c.name}</div>
                ))
              )}
              {/* Exemplo fixo da sua ideia */}
              <div style={contactStyle}><div style={onlineStatus} />Mãe (Google)</div>
              <div style={contactStyle}><div style={onlineStatus} />Primo (Google)</div>
            </section>

            <section>
              <h4 style={sectionTitleStyle}>🟢 ONLINE NO FIREBASE</h4>
              {firebaseOnline.map(u => (
                <div key={u.id} style={contactStyle}><div style={onlineStatus} />{u.name || 'Ninja Anônimo'}</div>
              ))}
            </section>
          </aside>

          {/* CHAT COM NARUTO NO PC */}
          <section style={{ position: 'relative' }}>
            <div style={narutoContainerStyle}>
              <img src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" style={{ width: '130px', filter: 'drop-shadow(0 0 10px #ffa500)' }} alt="Naruto" />
            </div>

            <div style={chatBoxStyle}>
              <div style={chatHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={avatar} style={{ width: '40px', borderRadius: '50%', border: '2px solid #ffa500' }} />
                  <span><strong>{nickname}</strong> (Logado)</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleCall('audio')} style={actionBtn}>📞</button>
                  <button onClick={() => handleCall('video')} style={actionBtn}>📹</button>
                  <label style={actionBtn}>📎<input type="file" hidden onChange={handleFileUpload} /></label>
                </div>
              </div>

              <div style={messageAreaStyle}>
                {messages.map((m) => (
                  <div key={m.id} style={{ textAlign: m.user === nickname ? 'right' : 'left', margin: '12px 0' }}>
                    <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '3px' }}>{m.user}</div>
                    <span style={{...bubbleStyle, background: m.user === nickname ? '#ffa500' : '#2a2a2a', color: m.user === nickname ? '#000' : '#fff'}}>
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
                  placeholder="Falar com a família..." 
                  style={inputFieldStyle}
                />
                <button onClick={sendMessage} style={sendButtonStyle}>ENVIAR</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div style={settingsPanelStyle}>
        <button onClick={() => {
          const m = prompt("MENU:\n1. Contraste\n2. + Texto\n3. - Texto\n4. Mudar Nick");
          if(m === "1") setIsHighContrast(!isHighContrast);
          if(m === "2") setFontSize(fontSize + 2);
          if(m === "3") setFontSize(fontSize - 2);
          if(m === "4") { const n = prompt("Novo Nick:"); if(n) setNickname(n); }
        }} style={settingsCircle}>⚙️</button>
      </div>
    </div>
  );
}

// ESTILOS PRESERVADOS E MELHORADOS
const glassStyle = { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '25px', padding: '25px', border: '1px solid rgba(255, 165, 0, 0.15)', height: 'fit-content' };
const sectionTitleStyle = { color: '#ffa500', fontSize: '12px', letterSpacing: '2px', marginBottom: '15px', opacity: 0.8 };
const contactStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' };
const onlineStatus = { width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', boxShadow: '0 0 8px #4caf50' };
const emptyStyle = { fontSize: '11px', opacity: 0.4, fontStyle: 'italic', padding: '10px' };
const narutoContainerStyle = { position: 'absolute', top: '-95px', left: '35px', zIndex: 10 };
const chatBoxStyle = { background: '#121212', border: '2px solid #ffa500', borderRadius: '30px', height: '580px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' };
const chatHeaderStyle = { padding: '20px', background: '#181818', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222' };
const actionBtn = { background: '#252525', border: 'none', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const messageAreaStyle = { flex: 1, padding: '25px', overflowY: 'auto', background: 'linear-gradient(to bottom, #121212, #080808)' };
const bubbleStyle = { padding: '12px 20px', borderRadius: '20px', fontWeight: '600', display: 'inline-block', maxWidth: '80%' };
const inputAreaStyle = { padding: '20px', background: '#181818', display: 'flex', gap: '15px' };
const inputFieldStyle = { flex: 1, background: '#222', border: '1px solid #333', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' };
const sendButtonStyle = { background: '#ffa500', color: '#000', border: 'none', padding: '0 30px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const settingsPanelStyle = { position: 'fixed', bottom: '30px', right: '30px' };
const settingsCircle = { width: '65px', height: '65px', borderRadius: '50%', background: '#ffa500', border: 'none', cursor: 'pointer', fontSize: '1.6rem' };
