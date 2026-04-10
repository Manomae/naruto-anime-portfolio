"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ShinobiWorld() {
  const mountRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Shinobi");
  const [msg, setMsg] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Menu de Contatos Cadastrados (Integrando ao seu projeto Emanuel)
  const [contatos] = useState([
    { id: 1, nome: "Sasuke_Uchiha", status: "online", bio: "Buscando vingança... e código limpo." },
    { id: 2, nome: "Sakura_Haruno", status: "online", bio: "Shannaro! Especialista em Cura e CSS." },
    { id: 3, nome: "Kakashi_Sensei", status: "offline", bio: "Lendo... ops, programando." }
  ]);

  const rasenganCanvasRef = useRef(null);

  useEffect(() => {
    // --- MUNDO 3D (Otimizado para seu notebook) ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xff9800, 1);
    light.position.set(5, 5, 5);
    scene.add(new THREE.AmbientLight(0x404040), light);

    const player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0xff9800}));
    player.position.y = 0.5;
    scene.add(player);
    camera.position.set(0, 3, 7);

    const animate = () => {
      requestAnimationFrame(animate);
      player.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => mountRef.current?.removeChild(renderer.domElement);
  }, []);

  // --- JUTSU DO AVATAR ---
  const openAvatarCreator = () => {
    const frame = document.createElement('iframe');
    frame.src = `https://models.readyplayer.me/avatar?frameApi`;
    frame.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; border:none;";
    document.body.appendChild(frame);

    window.addEventListener('message', (event) => {
      const json = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (json?.eventName === 'v1.avatar.exported') {
        setAvatarUrl(`${json.data.url}.png`);
        frame.remove();
      }
    });
  };

  // --- O LENDÁRIO RASENGAN (Mantido e Reforçado) ---
  const sendWithRasengan = () => {
    if (!msg) return;
    rasenganCanvasRef.current.style.display = 'flex';
    console.log("Rasengan Message Sent:", msg);
    
    setTimeout(() => {
      rasenganCanvasRef.current.style.display = 'none';
      setMsg("");
    }, 1200);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* INTERFACE DE USUÁRIO */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex' }}>
        
        {/* LADO ESQUERDO: MENU DE CONTATOS */}
        <div style={{ width: '300px', pointerEvents: 'auto', background: 'rgba(20, 20, 20, 0.9)', borderRight: '2px solid #ff9800', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src={avatarUrl} style={styles.profileImg} onClick={openAvatarCreator} />
            <h3 style={{ color: '#ff9800', margin: '10px 0 0 0' }}>MEU SHINOBI</h3>
          </div>

          <h4 style={{ color: '#aaa', fontSize: '12px', letterSpacing: '2px' }}>CONTATOS CADASTRADOS</h4>
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contatos.map(c => (
              <div key={c.id} onClick={() => setSelectedContact(c)} style={{ ...styles.contactCard, borderColor: selectedContact?.id === c.id ? '#ff9800' : '#333' }}>
                <span style={{ color: c.status === 'online' ? '#00ff00' : '#555' }}>●</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{c.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTRO/DIREITA: ÁREA DE CONVERSA */}
        <div style={{ flex: 1, position: 'relative' }}>
          {selectedContact ? (
            <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '80%', pointerEvents: 'auto' }}>
              
              {/* Cabeçalho da Conversa com Botões de Chamada */}
              <div style={styles.chatHeader}>
                <span style={{ color: '#fff' }}>Conversando com <b>{selectedContact.nome}</b></span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={styles.callBtn} title="Chamada de Áudio">📞</button>
                  <button style={{ ...styles.callBtn, background: '#4caf50' }} title="Chamada de Vídeo">📹</button>
                </div>
              </div>

              {/* Input de Chat com Rasengan */}
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '30px', border: '1px solid #ff9800' }}>
                <input 
                  value={msg} 
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder={`Enviar mensagem para ${selectedContact.nome}...`} 
                  style={styles.chatInput} 
                />
                <div style={{ position: 'relative' }}>
                  <div ref={rasenganCanvasRef} style={styles.rasenganContainer}>
                    <div className="rasengan-core">🌀</div>
                  </div>
                  <button onClick={sendWithRasengan} style={styles.rasenganBtn}>⚡</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#555' }}>
              <h2>SELECIONE UM NINJA PARA COMEÇAR</h2>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1.5); } }
        .rasengan-core { font-size: 60px; animation: rotate 0.2s linear infinite; filter: drop-shadow(0 0 15px #2196f3); }
      `}</style>
    </div>
  );
}

const styles = {
  profileImg: { width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #ff9800', cursor: 'pointer', background: '#222' },
  contactCard: { padding: '12px', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid', display: 'flex', gap: '10px', cursor: 'pointer', transition: '0.3s' },
  chatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,152,0,0.2)', padding: '10px 20px', borderRadius: '15px 15px 0 0', border: '1px solid #ff9800', borderBottom: 'none' },
  callBtn: { background: '#2196f3', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '18px' },
  chatInput: { flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '10px', outline: 'none' },
  rasenganBtn: { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(45deg, #2196f3, #fff)', border: 'none', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' },
  rasenganContainer: { position: 'absolute', top: '-80px', left: '-5px', display: 'none', justifyContent: 'center', alignItems: 'center' }
};
