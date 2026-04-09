"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ShinobiWorld() {
  const mountRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Shinobi");
  const [msg, setMsg] = useState("");
  
  // Lista de contatos (Aqui você conectará com seu Firebase/Cloud do projeto Emanuel)
  const [contatos] = useState([
    { id: 1, nome: "Sasuke_Uchiha", status: "online" },
    { id: 2, nome: "Sakura_Haruno", status: "online" },
    { id: 3, nome: "Kakashi_Sensei", status: "offline" }
  ]);

  const rasenganCanvasRef = useRef(null);
  const rasenganBallRef = useRef(null);

  useEffect(() => {
    // --- CENA PRINCIPAL DO JOGO (Three.js) ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Representação do Player no Mundo
    const player = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0xff9800}));
    player.add(body);
    player.position.y = 0.5;
    scene.add(player);

    camera.position.set(0, 5, 10);

    const animate = () => {
      requestAnimationFrame(animate);
      camera.lookAt(player.position);
      renderer.render(scene, camera);
    };
    animate();

    return () => mountRef.current?.removeChild(renderer.domElement);
  }, []);

  // --- FUNÇÃO DO AVATAR 3D ---
  const openAvatarCreator = () => {
    const frame = document.createElement('iframe');
    frame.src = `https://models.readyplayer.me/avatar?frameApi`;
    frame.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; border:none; background:#1a1a1a;";
    document.body.appendChild(frame);

    const handleMessage = (event) => {
      const json = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (json?.source === 'readyplayerme' && json?.eventName === 'v1.avatar.exported') {
        setAvatarUrl(`${json.data.url}.png`);
        frame.remove();
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);
  };

  // --- FUNÇÃO DO RASENGAN ---
  const sendWithRasengan = () => {
    if (!msg) return;
    rasenganCanvasRef.current.style.display = 'block';
    
    // Aqui entra a lógica de envio para o manomae.github.io / Firebase
    console.log("Jutsu de Mensagem:", msg);
    
    setTimeout(() => {
      rasenganCanvasRef.current.style.display = 'none';
      setMsg("");
    }, 1500);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* CAMADA DE INTERFACE (UI) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        
        {/* Perfil e Editar Shinobi */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', pointerEvents: 'auto', textAlign: 'center' }}>
          <img src={avatarUrl} style={styles.avatar} onClick={openAvatarCreator} alt="Perfil" />
          <p style={{ color: '#ff9800', fontSize: '14px', fontWeight: 'bold', margin: '5px 0' }}>EDITAR SHINOBI</p>
        </div>

        {/* Lista de Contatos Conectados */}
        <div style={{ position: 'absolute', top: '150px', left: '20px', pointerEvents: 'auto', background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '10px', border: '1px solid #ff9800' }}>
          <h4 style={{ color: '#ff9800', margin: '0 0 10px 0', fontSize: '14px' }}>NINJAS ONLINE</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {contatos.map(c => (
              <div key={c.id} style={{ color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: c.status === 'online' ? '#4caf50' : '#f44336' }}>●</span>
                {c.nome}
              </div>
            ))}
          </div>
        </div>

        {/* Chat e Rasengan */}
        <div style={{ position: 'absolute', bottom: '30px', right: '20px', pointerEvents: 'auto', display: 'flex', alignItems: 'center' }}>
          <input 
            value={msg} 
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Escreva seu Jutsu..." 
            style={styles.input} 
          />
          <div style={{ position: 'relative' }}>
             <div ref={rasenganCanvasRef} style={styles.rasenganVisual}>🌀</div>
             <button onClick={sendWithRasengan} style={styles.btnSend}>⚡</button>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  avatar: { width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #ff9800', cursor: 'pointer', objectFit: 'cover', background: '#222' },
  input: { padding: '15px', borderRadius: '25px', border: '2px solid #ff9800', background: 'rgba(0,0,0,0.8)', color: '#fff', width: '200px', outline: 'none' },
  btnSend: { width: '55px', height: '55px', borderRadius: '50%', background: 'radial-gradient(circle, #fff, #2196f3)', border: '2px solid #000', cursor: 'pointer', fontSize: '20px', boxShadow: '0 0 15px #2196f3' },
  rasenganVisual: { position: 'absolute', top: '-60px', left: '-5px', fontSize: '50px', display: 'none', animation: 'spin 0.3s linear infinite', filter: 'drop-shadow(0 0 10px #2196f3)' }
};
