import React, { useState } from 'react';

// 1. MÁGICA: Integração dos contatos selecionados no seu vídeo
const NINJA_CONTACTS = [
  { id: '1', name: "Mãe", status: "online", bio: "Ocupada na missão" },
  { id: '2', name: "Lorena Calderón", status: "offline", bio: "Treinando..." },
  { id: '3', name: "Gabriel", status: "online", bio: "Disponível para chat" },
  { id: '4', name: "Jeferson", status: "away", bio: "Em patrulha" },
  { id: '5', name: "Juliana Luz 🙏🙏", status: "online", bio: "Ninja Médica" },
  { id: '6', name: "Roney de Oliveira Lima", status: "online", bio: "Estrategista" },
  { id: '7', name: "Tia Lidia", status: "offline", bio: "Em repouso" }
];

export default function ShinobiSystem() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { text: inputValue, sender: 'me', time: new Date().toLocaleTimeString() }]);
    setInputValue('');
  };

  return (
    <div className="system-os">
      {/* SIDEBAR DE CONEXÕES */}
      <aside className="sidebar">
        <header className="sidebar-header">
          <h3>CONTATOS GOOGLE</h3>
          <span className="badge">{NINJA_CONTACTS.length} Conexões</span>
        </header>
        
        <div className="contact-list">
          {NINJA_CONTACTS.map(ninja => (
            <div 
              key={ninja.id} 
              className={`contact-item ${selectedContact?.id === ninja.id ? 'active' : ''}`}
              onClick={() => setSelectedContact(ninja)}
            >
              <div className={`status-dot ${ninja.status}`}></div>
              <div className="info">
                <p className="name">{ninja.name}</p>
                <p className="bio">{ninja.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ÁREA DE BATE-PAPO */}
      <main className="chat-window">
        {selectedContact ? (
          <>
            <header className="chat-header">
              <h2>Conexão Ativa: {selectedContact.name}</h2>
              <button className="call-btn">Chamada de Voz</button>
            </header>
            
            <div className="messages">
              {messages.length === 0 ? (
                <div className="empty">Inicie uma conversa segura com {selectedContact.name}</div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`msg-bubble ${m.sender}`}>
                    {m.text} <span className="time">{m.time}</span>
                  </div>
                ))
              )}
            </div>

            <footer className="chat-input">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem ninja..." 
              />
              <button onClick={handleSendMessage}>ENVIAR</button>
            </footer>
          </>
        ) : (
          <div className="welcome-screen">
            <h1>SISTEMA SHINOBI v2.0</h1>
            <p>Selecione um contato na lateral para iniciar a conexão.</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .system-os { display: flex; height: 100vh; background: #050505; color: #fff; font-family: sans-serif; }
        .sidebar { width: 300px; background: #111; border-right: 1px solid #222; }
        .sidebar-header { padding: 20px; border-bottom: 1px solid #222; }
        .contact-item { display: flex; align-items: center; padding: 15px; cursor: pointer; transition: 0.3s; }
        .contact-item:hover, .active { background: #1a1a1a; border-left: 4px solid #ff9100; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 15px; }
        .online { background: #00ff88; }
        .offline { background: #555; }
        .away { background: #ffcc00; }
        .name { font-weight: bold; margin: 0; }
        .bio { font-size: 12px; color: #888; margin: 0; }
        
        .chat-window { flex: 1; display: flex; flex-direction: column; position: relative; }
        .chat-header { padding: 20px; background: #0a0a0a; display: flex; justify-content: space-between; align-items: center; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        .msg-bubble { max-width: 70%; padding: 12px; border-radius: 15px; background: #222; align-self: flex-start; }
        .me { align-self: flex-end; background: #ff9100; color: #000; font-weight: bold; }
        .time { font-size: 10px; opacity: 0.7; margin-left: 8px; }
        .chat-input { padding: 20px; display: flex; gap: 10px; background: #0a0a0a; }
        input { flex: 1; background: #1a1a1a; border: none; padding: 15px; border-radius: 8px; color: white; }
        button { background: #ff9100; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .welcome-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; }
      `}</style>
    </div>
  );
}
