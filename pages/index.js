import React, { useState } from 'react';

export default function ChatSystem() {
  const [activeChat, setActiveChat] = useState('Geral');

  return (
    <div className="chat-container">
      {/* Sidebar - Lista de Conversas / Clãs */}
      <aside className="sidebar">
        <div className="profile-area">
          <div className="avatar"></div>
          <span>Meu Perfil</span>
        </div>
        <nav className="channels">
          <p className="section-title">CANAIS DE MISSÃO</p>
          <div className={`channel ${activeChat === 'Geral' ? 'active' : ''}`} onClick={() => setActiveChat('Geral')}>
            # chat-geral
          </div>
          <div className={`channel ${activeChat === 'Equipe 7' ? 'active' : ''}`} onClick={() => setActiveChat('Equipe 7')}>
            # equipe-7
          </div>
          <div className={`channel ${activeChat === 'Recrutamento' ? 'active' : ''}`} onClick={() => setActiveChat('Recrutamento')}>
            # recrutamento
          </div>
        </nav>
      </aside>

      {/* Área Principal do Bate-Papo */}
      <main className="chat-main">
        <header className="chat-header">
          <h2>{activeChat}</h2>
          <div className="status">● 14 Ninjas Online</div>
        </header>

        <div className="messages-area">
          <div className="msg-bubble system">
            <p>Bem-vindo ao sistema de comunicação da Aldeia. Mantenha o sigilo das informações.</p>
          </div>
          {/* Exemplo de Mensagem Recebida */}
          <div className="msg-group">
            <div className="mini-avatar"></div>
            <div className="msg-content">
              <span className="sender">Sasuke_Uchiha</span>
              <p className="text">Alguém para missão de Rank S hoje? 🐍</p>
            </div>
          </div>
        </div>

        {/* Input de Mensagem Melhorado */}
        <footer className="input-area">
          <button className="attach-btn">+</button>
          <input type="text" placeholder={`Enviar mensagem em #${activeChat}...`} />
          <button className="send-btn">➔</button>
        </footer>
      </main>

      <style jsx>{`
        .chat-container {
          display: flex;
          height: 100vh;
          background: #0f0f12;
          color: #e0e0e0;
          font-family: 'Inter', sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: rgba(20, 20, 25, 0.8);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
        }

        .profile-area {
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px; height: 40px;
          background: linear-gradient(45deg, #ff9100, #ff4500);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 145, 0, 0.4);
        }

        .channels { padding: 20px 10px; }
        .section-title { font-size: 0.7rem; color: #666; margin-bottom: 10px; padding-left: 10px; }
        
        .channel {
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 5px;
          cursor: pointer;
          transition: 0.2s;
        }

        .channel:hover, .active {
          background: rgba(255, 145, 0, 0.1);
          color: #ff9100;
        }

        /* Área de Chat */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 15px 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .messages-area {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .msg-group { display: flex; gap: 15px; }
        .mini-avatar { width: 35px; height: 35px; background: #333; border-radius: 8px; }
        .sender { font-size: 0.85rem; color: #ff9100; font-weight: bold; margin-bottom: 4px; display: block; }
        .text { background: rgba(255,255,255,0.03); padding: 10px; border-radius: 0 12px 12px 12px; }

        /* Input */
        .input-area {
          padding: 20px;
          display: flex;
          gap: 10px;
          background: rgba(0,0,0,0.2);
        }

        input {
          flex: 1;
          background: #1a1a20;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 12px;
          color: white;
          outline: none;
        }

        .send-btn, .attach-btn {
          background: #ff9100;
          border: none;
          width: 45px;
          border-radius: 10px;
          color: black;
          font-weight: bold;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .sidebar { display: none; } /* Esconde sidebar no mobile por padrão */
        }
      `}</style>
    </div>
  );
}
