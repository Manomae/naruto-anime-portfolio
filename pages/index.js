import React, { useState, useEffect, useRef } from 'react';

export default function ShinobiOS() {
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, active
  const [activeContact, setActiveContact] = useState({ name: "Mãe" });
  
  // Referências para Áudio e Vídeo
  const ringtoneRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // 1. Iniciar a Chamada (Dispara no celular dela e toca aqui)
  const startCall = async (type) => {
    setCallStatus('calling');
    
    // Tocar a "musiquinha" de chamada
    ringtoneRef.current = new Audio('/sounds/shinobi-ringtone.mp3'); 
    ringtoneRef.current.loop = true;
    ringtoneRef.current.play();

    // MÁGICA: Envia um sinal Push para o celular dela via Firebase/Socket
    // No celular dela, isso vai disparar a tela de "Recebendo chamada..."
    console.log(`Enviando sinal de ${type} para o dispositivo da ${activeContact.name}`);

    // Simulação: Ela atende após 4 segundos
    setTimeout(() => {
      handlePickUp();
    }, 4000);
  };

  // 2. Quando ela atende
  const handlePickUp = async () => {
    if (ringtoneRef.current) ringtoneRef.current.pause();
    setCallStatus('active');

    // Ativa sua câmera para enviar o vídeo pra ela
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    
    // Aqui a lógica de WebRTC conectaria o vídeo dela no remoteVideoRef
    console.log("Conexão estabelecida! Vídeo chegando no dispositivo dela 🫡");
  };

  const endCall = () => {
    if (ringtoneRef.current) ringtoneRef.current.pause();
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setCallStatus('idle');
  };

  return (
    <div className="system-container">
      {/* --- UI DE CHAMADA ATIVA --- */}
      {callStatus !== 'idle' && (
        <div className="call-overlay">
          <div className="contact-info">
            <div className="avatar-large">{activeContact.name[0]}</div>
            <h2>{activeContact.name}</h2>
            <p>{callStatus === 'calling' ? 'Chamando...' : 'Conexão Estável'}</p>
          </div>

          {callStatus === 'active' && (
            <div className="video-grid">
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-view" />
              <video ref={localVideoRef} autoPlay playsInline muted className="local-view" />
            </div>
          )}

          <div className="call-actions">
            <button className="hangup" onClick={endCall}>✕</button>
          </div>
        </div>
      )}

      {/* --- INTERFACE DO SISTEMA --- */}
      <main className="chat-interface">
        <header>
          <h1>{activeContact.name}</h1>
          <div className="btns">
            <button onClick={() => startCall('audio')}>📞</button>
            <button onClick={() => startCall('video')}>📹</button>
          </div>
        </header>
        <div className="chat-placeholder">
          Clique no ícone acima para iniciar a transmissão real.
        </div>
      </main>

      <style jsx>{`
        .system-container { height: 100vh; background: #000; color: white; font-family: sans-serif; }
        
        .call-overlay { 
          position: fixed; inset: 0; background: rgba(0,0,0,0.95); 
          z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: space-around;
        }

        .avatar-large { 
          width: 100px; height: 100px; background: #ff9100; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: bold;
          box-shadow: 0 0 30px rgba(255, 145, 0, 0.4); margin-bottom: 20px;
        }

        .video-grid { position: absolute; inset: 0; z-index: -1; }
        .remote-view { width: 100%; height: 100%; object-fit: cover; }
        .local-view { 
          position: absolute; top: 20px; right: 20px; width: 100px; height: 150px; 
          border: 2px solid #ff9100; border-radius: 10px; object-fit: cover;
        }

        .hangup { 
          width: 70px; height: 70px; background: #ff3b30; border: none; 
          border-radius: 50%; color: white; font-size: 30px; cursor: pointer;
        }

        header { padding: 20px; display: flex; justify-content: space-between; border-bottom: 1px solid #222; }
        .btns button { background: #222; border: none; color: #ff9100; padding: 10px 15px; margin-left: 10px; border-radius: 8px; font-size: 20px; }
      `}</style>
    </div>
  );
}
