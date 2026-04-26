import React, { useState, useEffect, useRef } from 'react';

// Seus contatos selecionados
const CONTACTS = [
  { id: '1', name: "Mãe", status: "online" },
  { id: '2', name: "Lorena Calderón", status: "online" },
  { id: '3', name: "Gabriel", status: "online" }
];

export default function ShinobiOS() {
  const [activeChat, setActiveChat] = useState(CONTACTS[0]);
  const [isCalling, setIsCalling] = useState(false);
  
  // Referências para os vídeos
  const localVideoRef = useRef(null);   // Seu vídeo
  const remoteVideoRef = useRef(null);  // Vídeo do contato (Mãe, etc)
  const peerConnection = useRef(null);

  // Configuração dos servidores do Google para atravessar redes (STUN)
  const iceServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const startGlobalCall = async () => {
    setIsCalling(true);
    
    // 1. Pega sua câmera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    // 2. Cria a conexão para enviar para o outro dispositivo
    peerConnection.current = new RTCPeerConnection(iceServers);
    
    // Adiciona seu vídeo no "tubo" de envio
    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    // 3. Quando o vídeo do OUTRO chegar, ele joga no remoteVideoRef
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // MÁGICA: Aqui você dispararia o sinal via seu banco de dados (Firebase/Socket)
    console.log("Sinal de chamada enviado para " + activeChat.name);
  };

  const endCall = () => {
    if (peerConnection.current) peerConnection.current.close();
    setIsCalling(false);
  };

  return (
    <div className="system">
      {/* TELA DE CHAMADA REALISTA */}
      {isCalling && (
        <div className="call-screen">
          {/* Vídeo de quem você está chamando (TELA CHEIA) */}
          <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
          
          {/* Seu vídeo (MINIATURA NO CANTO) */}
          <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />

          <div className="ui-overlay">
            <h2>Chamada com {activeChat.name}</h2>
            <button className="end-btn" onClick={endCall}>DESCONECTAR</button>
          </div>
        </div>
      )}

      {/* INTERFACE DE BATE-PAPO */}
      <div className="chat-interface">
        <header>
          <h1>{activeChat.name}</h1>
          <button className="call-trigger" onClick={startGlobalCall}>📹 INICIAR VÍDEO</button>
        </header>
        <div className="chat-history">
          <p className="system-msg">A conexão com os contatos Google está pronta para transmissão.</p>
        </div>
      </div>

      <style jsx>{`
        .system { height: 100vh; background: #000; color: #fff; }
        .call-screen { position: fixed; inset: 0; z-index: 999; background: #000; }
        
        /* O vídeo dela ocupa tudo */
        .remote-video { width: 100%; height: 100%; object-fit: cover; }
        
        /* O seu vídeo fica pequeno no canto, igual WhatsApp */
        .local-video { 
          position: absolute; top: 20px; right: 20px; 
          width: 120px; height: 180px; 
          border-radius: 12px; border: 2px solid #ff9100;
          object-fit: cover; z-index: 1000;
        }

        .ui-overlay { position: absolute; bottom: 50px; width: 100%; text-align: center; }
        .end-btn { background: #ff3b30; border: none; padding: 15px 40px; border-radius: 50px; color: #fff; font-weight: bold; cursor: pointer; }
        
        .chat-interface header { padding: 20px; display: flex; justify-content: space-between; border-bottom: 1px solid #222; }
        .call-trigger { background: #ff9100; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; }
      `}</style>
    </div>
  );
}
