import React, { useState, useEffect, useRef } from 'react';

// Contatos selecionados na sua agenda
const NINJA_CONTACTS = [
  { id: '1', name: "Mãe", status: "online", phone: "+55...", photo: "https://via.placeholder.com/150/FF9100/000000?text=Mae" },
  { id: '2', name: "Lorena Calderón", status: "online", photo: "https://via.placeholder.com/150/FF9100/000000?text=Lorena" },
  { id: '3', name: "Gabriel", status: "online", photo: "https://via.placeholder.com/150/FF9100/000000?text=Gabriel" }
];

export default function ShinobiOS() {
  const [activeContact, setActiveContact] = useState(NINJA_CONTACTS[0]);
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, ringing, active
  const [messages, setMessages] = useState([]);
  const ringtoneRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // --- MÁGICA 1: Registro do Service Worker via Código (Tudo em um) ---
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const swCode = `
        self.addEventListener('push', (e) => {
          const data = e.data.json();
          self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            vibrate: [200, 100, 200],
            tag: 'shinobi-call',
            actions: [{action: 'accept', title: 'Atender 📞'}]
          });
        });
      `;
      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);
      navigator.serviceWorker.register(swUrl);
    }
  }, []);

  // --- MÁGICA 2: Iniciar Chamada com Música e Notificação ---
  const startCall = async (type) => {
    setCallStatus('calling');
    
    // Inicia a música de chamada (Toque de saída)
    ringtoneRef.current = new Audio('https://www.soundjay.com/phone/phone-calling-1.mp3'); 
    ringtoneRef.current.loop = true;
    ringtoneRef.current.play();

    // Simula o envio do sinal para o Google/Firebase (Celular dela acorda aqui)
    console.log(`Enviando sinal de ${type} para o dispositivo da ${activeContact.name}...`);
    
    // Simulação: Ela "vê" seu rosto e atende após 5 segundos
    setTimeout(() => {
      acceptCall();
    }, 5000);
  };

  const acceptCall = async () => {
    if (ringtoneRef.current) ringtoneRef.current.pause();
    setCallStatus('active');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      // Em um app real, aqui o WebRTC conectaria o vídeo dela ao remoteVideoRef
    } catch (err) {
      alert("Erro ao acessar mídia: " + err);
    }
  };

  const hangUp = () => {
    if (ringtoneRef.current) ringtoneRef.current.pause();
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setCallStatus('idle');
  };

  return (
    <div className="system-main">
      {/* HUD DE CHAMADA (O que aparece quando você liga) */}
      {callStatus !== 'idle' && (
        <div className="call-screen">
          <div className="caller-profile">
            <div className="pulse-ring"></div>
            <img src={activeContact.photo} alt="Rosto" className="avatar-img" />
            <h1>{activeContact.name}</h1>
            <p>{callStatus === 'calling' ? 'Chamando...' : 'Conexão Segura'}</p>
          </div>

          {callStatus === 'active' && (
            <div className="video-streams">
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" poster="/placeholder-ninja.jpg" />
              <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
            </div>
          )}

          <div className="call-controls">
            <button className="btn-hangup" onClick={hangUp}>✕</button>
          </div>
        </div>
      )}

      {/* INTERFACE DE NAVEGAÇÃO */}
      <aside className="sidebar">
        {NINJA_CONTACTS.map(c => (
          <div key={c.id} className={`nav-item ${activeContact.id === c.id ? 'active' : ''}`} onClick={() => setActiveContact(c)}>
            {c.name[0]}
          </div>
        ))}
      </aside>

      <main className="chat-window">
        <header className="chat-header">
          <div className="header-info">
            <h2>{activeContact.name}</h2>
            <span>Online | Contato Google</span>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={() => startCall('audio')}>📞</button>
            <button className="action-btn neon" onClick={() => startCall('video')}>📹</button>
          </div>
        </header>

        <div className="chat-content">
          <div className="msg-sys">Seu rosto e voz serão transmitidos via criptografia Shinobi.</div>
        </div>
      </main>

      <style jsx>{`
        .system-main { height: 100vh; display: flex; background: #000; color: white; font-family: 'Inter', sans-serif; }
        
        /* Chamada em Tela Cheia */
        .call-screen { position: fixed; inset: 0; background: #050505; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: space-around; }
        .caller-profile { text-align: center; position: relative; }
        .avatar-img { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #ff9100; position: relative; z-index: 2; }
        
        .pulse-ring { 
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 140px; height: 140px; border: 2px solid #ff9100; border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse { 0% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; } }

        .video-streams { position: absolute; inset: 0; background: #000; }
        .remote-video { width: 100%; height: 100%; object-fit: cover; }
        .local-video { position: absolute; top: 20px; right: 20px; width: 100px; height: 150px; border-radius: 12px; border: 2px solid #ff9100; object-fit: cover; }

        .btn-hangup { width: 70px; height: 70px; background: #ff3b30; border: none; border-radius: 50%; color: white; font-size: 30px; cursor: pointer; box-shadow: 0 0 20px rgba(255,59,48,0.4); }

        /* Estilo Base */
        .sidebar { width: 70px; background: #0a0a0a; border-right: 1px solid #1a1a1a; display: flex; flex-direction: column; align-items: center; padding-top: 20px; gap: 15px; }
        .nav-item { width: 45px; height: 45px; background: #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; }
        .active { background: #ff9100; color: black; }

        .chat-window { flex: 1; display: flex; flex-direction: column; }
        .chat-header { padding: 20px; border-bottom: 1px solid #111; display: flex; justify-content: space-between; align-items: center; }
        .action-btn { background: #1a1a1a; border: 1px solid #333; color: #ff9100; width: 45px; height: 45px; border-radius: 50%; margin-left: 10px; cursor: pointer; font-size: 18px; }
        .neon { border-color: #ff9100; box-shadow: 0 0 10px rgba(255, 145, 0, 0.2); }
        .msg-sys { text-align: center; color: #444; font-size: 12px; margin-top: 50px; }
      `}</style>
    </div>
  );
}
