import React, { useState, useEffect, useRef } from 'react';

// Contatos filtrados da sua agenda Google (vistos no seu vídeo)
const CONTACTS = [
  { id: '1', name: "Mãe", status: "online", initial: "M" },
  { id: '2', name: "Lorena Calderón", status: "online", initial: "L" },
  { id: '3', name: "Gabriel", status: "online", initial: "G" },
  { id: '4', name: "Jeferson", status: "away", initial: "J" },
  { id: '5', name: "Juliana Luz 🙏🙏", status: "online", initial: "J" },
  { id: '6', name: "Roney de Oliveira Lima", status: "online", initial: "R" }
];

export default function ShinobiSystem() {
  const [activeChat, setActiveChat] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showNotify, setShowNotify] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const videoRef = useRef(null);

  // --- Lógica de Mensagem ---
  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { text: input, sender: 'me', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages([...messages, newMsg]);
    setInput('');

    // Simulação: Resposta natural da "Mãe" após 2 segundos
    setTimeout(() => {
      setShowNotify(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Vibração real no celular
    }, 2000);
  };

  // --- Lógica de Chamada Real (WebRTC) ---
  const startVideoCall = async () => {
    setIsCalling(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Erro na câmera:", err);
      setIsCalling(false);
    }
  };

  const endCall = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCalling(false);
  };

  return (
    <div className="os-container">
      {/* NOTIFICAÇÃO PUSH (NATURAL) */}
      <div className={`notification ${showNotify ? 'show' : ''}`} onClick={() => setShowNotify(false)}>
        <div className="notify-icon">💬</div>
        <div className="notify-text">
          <strong>{activeChat.name}</strong>
          <p>Recebi! O sistema está ficando incrível. 🍜</p>
        </div>
      </div>

      {/* TELA DE CHAMADA FULLSCREEN */}
      {isCalling && (
        <div className="call-overlay">
          <video ref={videoRef} autoPlay playsInline />
          <div className="call-info">
            <h2>{activeChat.name}</h2>
            <p>CONEXÃO NINJA ATIVA...</p>
          </div>
          <button className="hangup-btn" onClick={endCall}>✕</button>
        </div>
      )}

      {/* SIDEBAR DE CONTATOS */}
      <aside className="sidebar">
        {CONTACTS.map(contact => (
          <div 
            key={contact.id} 
            className={`contact-circle ${activeChat.id === contact.id ? 'active' : ''}`}
            onClick={() => {setActiveChat(contact); setMessages([]);}}
          >
            {contact.initial}
            <span className={`status-dot ${contact.status}`}></span>
          </div>
        ))}
      </aside>

      {/* CHAT PRINCIPAL */}
      <main className="chat-area">
        <header className="chat-header">
          <div className="user-info">
            <h2>{activeChat.name}</h2>
            <span>{activeChat.status === 'online' ? '● Online' : '● Ocupado'}</span>
          </div>
          <div className="actions">
            <button onClick={startVideoCall}>📹</button>
            <button>📞</button>
          </div>
        </header>

        <div className="message-history">
          {messages.map((m, i) => (
            <div key={i} className={`msg-bubble ${m.sender}`}>
              {m.text}
              <span className="msg-time">{m.time}</span>
            </div>
          ))}
        </div>

        <footer className="input-bar">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mande uma mensagem..."
          />
          <button onClick={handleSend}>➔</button>
        </footer>
      </main>

      <style jsx>{`
        .os-container { display: flex; height: 100vh; background: #050505; color: white; overflow: hidden; }
        
        /* Notificação */
        .notification { position: fixed; top: -100px; left: 5%; width: 90%; background: #1a1a1a; padding: 15px; border-radius: 20px; display: flex; gap: 15px; transition: 0.5s; z-index: 1000; border: 1px solid #ff9100; }
        .notification.show { top: 20px; }
        
        /* Chamada */
        .call-overlay { position: fixed; inset: 0; background: black; z-index: 2000; display: flex; flex-direction: column; align-items: center; }
        video { width: 100%; height: 100%; object-fit: cover; }
        .call-info { position: absolute; top: 10%; text-align: center; width: 100%; }
        .hangup-btn { position: absolute; bottom: 50px; background: #ff3b30; width: 70px; height: 70px; border-radius: 50%; border: none; color: white; font-size: 30px; }

        /* Sidebar */
        .sidebar { width: 80px; background: #0a0a0a; display: flex; flex-direction: column; align-items: center; padding-top: 20px; gap: 15px; border-right: 1px solid #111; }
        .contact-circle { width: 50px; height: 50px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
        .active { border: 2px solid #ff9100; box-shadow: 0 0 10px #ff9100; }
        .status-dot { position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #0a0a0a; }
        .online { background: #00ff88; }
        .away { background: #ffcc00; }

        /* Chat */
        .chat-area { flex: 1; display: flex; flex-direction: column; background: radial-gradient(circle at center, #111 0%, #050505 100%); }
        .chat-header { padding: 20px; border-bottom: 1px solid #111; display: flex; justify-content: space-between; }
        .actions button { background: none; border: none; color: white; font-size: 20px; margin-left: 15px; cursor: pointer; }
        
        .message-history { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
        .msg-bubble { max-width: 75%; padding: 12px; border-radius: 15px; font-size: 15px; position: relative; }
        .me { align-self: flex-end; background: #ff9100; color: black; font-weight: bold; }
        .received { align-self: flex-start; background: #222; }
        .msg-time { font-size: 10px; opacity: 0.6; display: block; margin-top: 5px; }

        .input-bar { padding: 20px; display: flex; gap: 10px; }
        input { flex: 1; background: #1a1a1a; border: none; padding: 15px; border-radius: 10px; color: white; outline: none; }
        footer button { background: #ff9100; border: none; padding: 0 20px; border-radius: 10px; font-weight: bold; }
      `}</style>
    </div>
  );
}
