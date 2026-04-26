import React, { useState, useEffect } from 'react';

const NINJA_CONTACTS = [
  { id: '1', name: "Mãe", status: "online", bio: "Ocupada na missão" },
  { id: '2', name: "Lorena Calderón", status: "online", bio: "Disponível" },
  { id: '3', name: "Gabriel", status: "online", bio: "Disponível para chat" },
  { id: '5', name: "Juliana Luz 🙏🙏", status: "online", bio: "Ninja Médica" }
];

export default function ShinobiOS() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [incomingMsg, setIncomingMsg] = useState(null);

  // SIMULAÇÃO: Uma notificação chega 2 segundos após abrir o sistema
  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingMsg({
        contact: NINJA_CONTACTS[0], // "Mãe" manda mensagem
        text: "Filho, já terminou o sistema? Me avisa aqui! 🍜"
      });
      setShowNotification(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // FUNÇÃO: Abrir sistema direto pela notificação
  const handleOpenFromNotify = () => {
    setSelectedContact(incomingMsg.contact);
    setShowNotification(false);
  };

  return (
    <div className="os-container">
      
      {/* NOTIFICAÇÃO REALISTA (HUD) */}
      {showNotification && (
        <div className="notification-toast" onClick={handleOpenFromNotify}>
          <div className="notify-icon"></div>
          <div className="notify-content">
            <strong>{incomingMsg.contact.name}</strong>
            <p>{incomingMsg.text}</p>
          </div>
          <span className="notify-time">agora</span>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-header">SHINOBI CHAT</div>
        <div className="contact-list">
          {NINJA_CONTACTS.map(c => (
            <div 
              key={c.id} 
              className={`contact-item ${selectedContact?.id === c.id ? 'active' : ''}`}
              onClick={() => setSelectedContact(c)}
            >
              <div className="dot"></div>
              {c.name}
            </div>
          ))}
        </div>
      </aside>

      <main className="main-chat">
        {selectedContact ? (
          <div className="chat-active">
            <header><h2>{selectedContact.name}</h2></header>
            <div className="messages-box">
              <div className="msg-received">Conexão segura estabelecida com {selectedContact.name}...</div>
              {selectedContact.id === '1' && (
                <div className="msg-incoming">{incomingMsg?.text}</div>
              )}
            </div>
            <footer className="input-area">
              <input placeholder="Responder..." />
              <button>Enviar</button>
            </footer>
          </div>
        ) : (
          <div className="idle-screen">Aguardando novas transmissões...</div>
        )}
      </main>

      <style jsx>{`
        .os-container { display: flex; height: 100vh; background: #000; color: white; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
        
        /* ANIMAÇÃO DA NOTIFICAÇÃO */
        .notification-toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 400px;
          background: rgba(25, 25, 25, 0.95);
          backdrop-filter: blur(10px);
          padding: 15px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 9999;
          cursor: pointer;
          animation: slideDown 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        @keyframes slideDown {
          from { top: -100px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }

        .notify-icon { width: 40px; height: 40px; background: #ff9100; border-radius: 12px; }
        .notify-content { flex: 1; }
        .notify-content p { font-size: 14px; margin: 2px 0 0; color: #bbb; }
        .notify-time { font-size: 10px; color: #666; }

        /* LAYOUT BASE */
        .sidebar { width: 260px; background: #0a0a0a; border-right: 1px solid #111; }
        .sidebar-header { padding: 30px 20px; font-weight: 900; letter-spacing: 2px; color: #ff9100; }
        .contact-item { padding: 15px 20px; display: flex; align-items: center; gap: 10px; cursor: pointer; color: #888; }
        .active { background: #111; color: #ff9100; border-right: 3px solid #ff9100; }
        .dot { width: 8px; height: 8px; background: #00ff88; border-radius: 50%; }

        .main-chat { flex: 1; background: radial-gradient(circle at center, #111 0%, #000 100%); display: flex; align-items: center; justify-content: center; }
        .chat-active { width: 100%; height: 100%; display: flex; flex-direction: column; }
        .chat-active header { padding: 20px; border-bottom: 1px solid #111; }
        .messages-box { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        .msg-incoming { background: #222; padding: 12px; border-radius: 0 15px 15px 15px; align-self: flex-start; max-width: 80%; }
        .msg-received { color: #555; font-size: 12px; text-align: center; width: 100%; }
        
        .input-area { padding: 20px; display: flex; gap: 10px; }
        input { flex: 1; background: #111; border: 1px solid #222; padding: 15px; border-radius: 10px; color: white; outline: none; }
        button { background: #ff9100; border: none; padding: 0 20px; border-radius: 10px; font-weight: bold; cursor: pointer; }
        
        .idle-screen { color: #333; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; }
      `}</style>
    </div>
  );
}
