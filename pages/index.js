"use client"; // Necessário no Next.js 13+ para usar Three.js e Hooks

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ShinobiWorld() {
  const mountRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Shinobi");
  const [showCall, setShowCall] = useState(false);
  const [msg, setMsg] = useState("");

  // Refs para o Rasengan
  const rasenganRef = useRef(null);
  const rasenganCanvasRef = useRef(null);

  useEffect(() => {
    // --- Configuração da Cena Principal do Jogo ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const player = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0xff9800}));
    player.add(body);
    player.position.y = 0.5;
    scene.add(player);

    camera.position.z = 10;
    camera.position.y = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      camera.lookAt(player.position);
      renderer.render(scene, camera);
    };
    animate();

    return () => mountRef.current?.removeChild(renderer.domElement);
  }, []);

  // --- Função Rasengan ---
  const triggerRasengan = () => {
    if (!msg) return;
    rasenganCanvasRef.current.style.display = 'block';
    console.log("Enviando com Rasengan:", msg);
    setMsg("");

    setTimeout(() => {
      rasenganCanvasRef.current.style.display = 'none';
    }, 1500);
  };

  // --- Ready Player Me (Avatar 3D) ---
  const openAvatarCreator = () => {
    const subdomain = 'demo'; 
    const iFrame = document.createElement('iframe');
    iFrame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;
    iFrame.style.cssText = "position:fixed; top:5%; left:5%; width:90%; height:90%; z-index:1000; border-radius:20px;";
    document.body.appendChild(iFrame);

    window.addEventListener('message', (event) => {
      if (event.data?.source === 'readyplayerme') {
         // Lógica simplificada para pegar a foto
         setAvatarUrl(`${event.data.data?.url}.png`);
         iFrame.remove();
      }
    });
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* UI LAYER */}
      <div style={{ position: 'absolute', top: 0, width: '100%', pointerEvents: 'none' }}>
        
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px', pointerEvents: 'auto' }}>
          <button style={styles.btn} onClick={() => setShowCall(true)}>📞 ÁUDIO</button>
          <button style={styles.btn} onClick={() => setShowCall(true)}>📷 VÍDEO</button>
        </div>

        {/* Avatar Area */}
        <div style={{ position: 'absolute', top: '80px', left: '20px', pointerEvents: 'auto', textAlign: 'center' }}>
          <img src={avatarUrl} style={styles.avatar} onClick={openAvatarCreator} alt="Profile" />
          <p style={{ color: 'white', fontSize: '12px' }}>Editar Shinobi</p>
        </div>

        {/* Chat / Rasengan */}
        <div style={{ position: 'absolute', bottom: '50px', right: '20px', pointerEvents: 'auto', display: 'flex', alignItems: 'center' }}>
          <input 
            value={msg} 
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Mensagem..." 
            style={styles.input} 
          />
          <div style={{ position: 'relative' }}>
             <div ref={rasenganCanvasRef} style={styles.rasenganFX}>🌀</div>
             <button onClick={triggerRasengan} style={styles.btnSend}>⚡</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  btn: { background: '#ff9800', border: '2px solid #000', padding: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #ff9800', background: '#333', cursor: 'pointer' },
  input: { padding: '12px', borderRadius: '20px', border: '2px solid #ff9800', background: '#000', color: '#fff', marginRight: '10px' },
  btnSend: { width: '50px', height: '50px', borderRadius: '50%', background: '#2196f3', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' },
  rasenganFX: { position: 'absolute', top: '-40px', left: '0', fontSize: '40px', display: 'none', animation: 'spin 0.5s linear infinite' }
};
