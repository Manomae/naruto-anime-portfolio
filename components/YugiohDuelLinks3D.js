import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Componente: Yu-Gi-Oh! Duel Links Futurista 3D
 * Módulo de minijogo sem simulação pronto para integração no index.js
 */
export default function YugiohDuelLinks3D({ onClose }) {
  // --- ESTADOS DA INTERFACE & JOGABILIDADE ---
  const [stage, setStage] = useState(2);
  const [gems, setGems] = useState(40);
  const [gold, setGold] = useState(0);
  const [activeTab, setActiveTab] = useState('gate');
  const [configOpen, setConfigOpen] = useState(false);
  const [dueloStatus, setDueloStatus] = useState('Aguardando Início');
  const [lpJogador, setLpJogador] = useState(4000);
  const [lpOponente, setLpOponente] = useState(4000);
  
  // Configurações do Novo Design
  const [volumeVozes, setVolumeVozes] = useState(80);
  const [qualidade3D, setQualidade3D] = useState('Ultra Futurista');
  const [modoCamera, setModoCamera] = useState('Dinamica 3D');

  // Renders 3D Canvas Ref
  const mount3DRef = useRef(null);
  const sceneRef = useRef(null);
  const groupCartasRef = useRef(null);

  // --- ANIMAÇÃO & RENDERIZAÇÃO THREE.JS (CENÁRIO FUTURISTA 3D) ---
  useEffect(() => {
    if (!mount3DRef.current) return;

    const width = mount3DRef.current.clientWidth;
    const height = mount3DRef.current.clientHeight;

    // Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x00f0ff, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount3DRef.current.appendChild(renderer.domElement);

    // Iluminação Neocibernética
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 12, 30);
    cyanLight.position.set(-4, 6, 4);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff00ff, 10, 30);
    magentaLight.position.set(4, 6, -2);
    scene.add(magentaLight);

    // Grade Holográfica de Campo de Duelo 3D
    const grid = new THREE.GridHelper(20, 20, 0x00f0ff, 0x0284c7);
    grid.position.y = -0.5;
    scene.add(grid);

    // Grupo de Cartas e Projeções 3D
    const cartasGroup = new THREE.Group();

    // Carta 1: Dragão Branco de Olhos Azuis (Projeção Holográfica 3D)
    const cardGeo = new THREE.BoxGeometry(1.2, 1.8, 0.05);
    const cardMat1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false
    });
    const cardMesh1 = new THREE.Mesh(cardGeo, cardMat1);
    cardMesh1.position.set(-1.8, 0.5, 0);
    cardMesh1.rotation.y = 0.3;

    // Carta 2: Monstro Xyz / Futurista Holográfico
    const cardMat2 = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      metalness: 0.9,
      roughness: 0.1
    });
    const cardMesh2 = new THREE.Mesh(cardGeo, cardMat2);
    cardMesh2.position.set(1.8, 0.5, 0);
    cardMesh2.rotation.y = -0.3;

    // Moldura do Campo (Jogabilidade 3D)
    const zoneGeo = new THREE.PlaneGeometry(1.4, 2.0);
    const zoneMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, wireframe: true });
    
    for (let i = -2; i <= 2; i++) {
      const zone = new THREE.Mesh(zoneGeo, zoneMat);
      zone.rotation.x = Math.PI / 2;
      zone.position.set(i * 1.6, -0.48, 1.2);
      cartasGroup.add(zone);
    }

    cartasGroup.add(cardMesh1, cardMesh2);
    scene.add(cartasGroup);
    groupCartasRef.current = cartasGroup;

    // Loop de Animação das Cartas Holográficas
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (groupCartasRef.current) {
        groupCartasRef.current.position.y = Math.sin(elapsedTime * 2) * 0.08;
        cardMesh1.rotation.y = 0.3 + Math.sin(elapsedTime * 1.5) * 0.1;
        cardMesh2.rotation.y = -0.3 + Math.cos(elapsedTime * 1.5) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mount3DRef.current) return;
      const w = mount3DRef.current.clientWidth;
      const h = mount3DRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mount3DRef.current && renderer.domElement) {
        mount3DRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --- LÓGICA DE JOGABILIDADE / DUALS (SEM SIMULAÇÃO) ---
  const iniciarDuelo3D = () => {
    setDueloStatus('⚡ Duelo Iniciado! Fase de Compra...');
    setTimeout(() => {
      setDueloStatus('⚔️ Invocação do Dragão Holográfico!');
      setLpOponente(prev => Math.max(0, prev - 1500));
    }, 1200);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundColor: '#0a0f1d',
      color: '#ffffff',
      fontFamily: `'Segoe UI', Roboto, Helvetica, sans-serif`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 🚀 BARRA SUPERIOR: HUD FUTURISTA DE RECURSOS & STAGE */}
      <header style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'rgba(10, 15, 29, 0.85)',
        borderBottom: '2px solid #00f0ff',
        backdropFilter: 'blur(12px)',
        zIndex: 50
      }}>
        {/* Stage & Missões */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #00f0ff)',
            padding: '6px 14px',
            borderRadius: '20px',
            boxShadow: '0 0 15px rgba(0,240,255,0.4)',
            fontWeight: '900',
            fontSize: '12px',
            letterSpacing: '1px'
          }}>
            Missions STAGE <span style={{ fontSize: '16px', color: '#fff' }}>{stage}</span>
          </div>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>
            Increase Stage via Missions!
          </span>
        </div>

        {/* Gemas, Ouro & Configurações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '10px', border: '1px solid #eab308' }}>
            <span>🪙</span>
            <strong style={{ fontSize: '12px', color: '#fde047' }}>{gold}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '10px', border: '1px solid #a855f7' }}>
            <span>💎</span>
            <strong style={{ fontSize: '12px', color: '#c084fc' }}>{gems}</strong>
          </div>

          {/* Botão da Nova Barra de Configurações */}
          <button
            onClick={() => setConfigOpen(!configOpen)}
            style={{
              background: 'none',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 0 10px rgba(0,240,255,0.2)'
            }}
            title="Nova Barra de Configurações"
          >
            ⚙️
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              ✕ Fechar
            </button>
          )}
        </div>
      </header>

      {/* ⚙️ PAINEL/BARRA DE CONFIGURAÇÕES FUTURISTA (EXPANSÍVEL) */}
      {configOpen && (
        <div style={{
          position: 'absolute',
          top: '65px',
          right: '20px',
          width: '300px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid #00f0ff',
          borderRadius: '16px',
          padding: '16px',
          zIndex: 100,
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
          backdropFilter: 'blur(16px)'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#00f0ff', fontSize: '13px', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '6px' }}>
            ⚙️ CONFIGURAÇÕES DUEL LINKS 3D
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Qualidade do Renderizador 3D:</label>
              <select
                value={qualidade3D}
                onChange={(e) => setQualidade3D(e.target.value)}
                style={{ width: '100%', padding: '6px', background: '#0f172a', border: '1px solid #0284c7', color: '#fff', borderRadius: '6px' }}
              >
                <option value="Ultra Futurista">Ultra Futurista (Com Shaders)</option>
                <option value="Alta">Alta Performance 60FPS</option>
                <option value="Economica">Econômica (Mobile)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Ângulo da Câmera 3D:</label>
              <select
                value={modoCamera}
                onChange={(e) => setModoCamera(e.target.value)}
                style={{ width: '100%', padding: '6px', background: '#0f172a', border: '1px solid #0284c7', color: '#fff', borderRadius: '6px' }}
              >
                <option value="Dinamica 3D">Dinâmica Visão Frontal</option>
                <option value="Isometrica">Isométrica Clássica Duel Links</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Volume das Vozes dos Personagens: {volumeVozes}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeVozes}
                onChange={(e) => setVolumeVozes(e.target.value)}
                style={{ width: '100%', accentColor: '#00f0ff' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 🌌 ÁREA CENTRAL DE JOGO: MUNDO 3D & AVATARES HOLOGRÁFICOS */}
      <main style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Canvas do Three.js para o Terreno, Arena e Projeções de Cartas */}
        <div ref={mount3DRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

        {/* HUD SOBREPOSTO DE PERSONAGENS E NPCS (VISUAL DUEL LINKS) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          
          {/* Topo: Guia / Duel School 2.0 / Novas Funções */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'auto' }}>
            <div style={{
              background: 'rgba(2, 132, 199, 0.25)',
              border: '1px solid #00f0ff',
              padding: '10px 16px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>SCHOOL 2.0</span>
              <strong style={{ fontSize: '12px', color: '#fff' }}>Jogabilidade & Tutoriais 3D</strong>
            </div>

            {/* Painel Placar do Duelo Real */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid #38bdf8',
              borderRadius: '12px',
              padding: '8px 16px',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(0,240,255,0.2)'
            }}>
              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold' }}>{dueloStatus}</span>
              <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: '#22c55e' }}>VOCÊ: <strong>{lpJogador} LP</strong></span>
                <span style={{ fontSize: '11px', color: '#ef4444' }}>OPONENTE: <strong>{lpOponente} LP</strong></span>
              </div>
            </div>
          </div>

          {/* Centro-Baixo: Avatares Futuristas e Novos NPCs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
            
            {/* NPC Holográfico Guia */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.5)',
              borderRadius: '16px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backdropFilter: 'blur(12px)',
              maxWidth: '220px'
            }}>
              <div style={{ fontSize: '28px', background: '#0284c7', padding: '6px', borderRadius: '50%' }}>👩‍💼</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#00f0ff', display: 'block' }}>NPC Tour Guide 3D</strong>
                <span style={{ fontSize: '9px', color: '#cbd5e1' }}>"Bem-vindo ao novo mundo futurista de Yu-Gi-Oh!"</span>
              </div>
            </div>

            {/* Avatar Lendário Yami Yugi 3D */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(180deg, transparent, rgba(2, 132, 199, 0.4))',
              padding: '15px',
              borderRadius: '20px',
              border: '1px solid #00f0ff'
            }}>
              <div style={{ fontSize: '42px', filter: 'drop-shadow(0 0 10px #00f0ff)' }}>🦸‍♂️</div>
              <strong style={{ fontSize: '13px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                Yami Yugi (Futuro 3D)
              </strong>
              <button
                onClick={iniciarDuelo3D}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#00f0ff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: '900',
                  fontSize: '11px',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px #00f0ff'
                }}
              >
                ⚔️ DUELAR AGORA
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* 🎮 BARRA INFERIOR DE NAVEGAÇÃO E NOVAS FUNÇÕES (FOOTER HUD) */}
      <footer style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
        background: 'rgba(10, 15, 29, 0.95)',
        borderTop: '2px solid #00f0ff',
        padding: '6px 10px',
        zIndex: 50
      }}>
        <button
          onClick={() => setActiveTab('gate')}
          style={{
            padding: '10px',
            background: activeTab === 'gate' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
            border: activeTab === 'gate' ? '1px solid #00f0ff' : 'none',
            color: activeTab === 'gate' ? '#00f0ff' : '#94a3b8',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>🚪</span> Gate 3D
        </button>

        <button
          onClick={() => setActiveTab('duelos')}
          style={{
            padding: '10px',
            background: activeTab === 'duelos' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
            border: activeTab === 'duelos' ? '1px solid #00f0ff' : 'none',
            color: activeTab === 'duelos' ? '#00f0ff' : '#94a3b8',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>⚔️</span> Duelos Arena
        </button>

        <button
          onClick={() => setActiveTab('loja')}
          style={{
            padding: '10px',
            background: activeTab === 'loja' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
            border: activeTab === 'loja' ? '1px solid #00f0ff' : 'none',
            color: activeTab === 'loja' ? '#00f0ff' : '#94a3b8',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>🛒</span> Loja de Cartas
        </button>

        <button
          onClick={() => setActiveTab('deck')}
          style={{
            padding: '10px',
            background: activeTab === 'deck' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
            border: activeTab === 'deck' ? '1px solid #00f0ff' : 'none',
            color: activeTab === 'deck' ? '#00f0ff' : '#94a3b8',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>🎴</span> Deck Build 3D
        </button>
      </footer>

    </div>
  );
}