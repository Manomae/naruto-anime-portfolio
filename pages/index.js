import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';

// Bibliotecas para geração de documentos
import { jsPDF } from "jspdf";

// =========================================================================================
// 🌟 ESTRUTURA CENTRALIZADA DE DADOS & LINKs 3D DINÂMICOS (REDES SOCIAIS & MAPAS)
// =========================================================================================
const meusDadosReais = {
  nome: "Emanuel da Silva (Comando Central Emanuel.OS)",
  whatsapp: "5588981493989",
  whatsappFormatado: "(88) 98149-3989",
  email: "leeheroi123@gmail.com",
  tiktok: "https://www.tiktok.com/@emanueldasilva26",
  instagram: "https://www.instagram.com/emanuelsilva432",
  threads: "https://www.threads.net/@emanuelsilva432",
  github: "https://github.com/Manomae",
  facebook: "https://www.facebook.com/leeheroi.heroi",
  youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
};

// 1. LINKs 3D DINÂMICOS DE REDES SOCIAIS
const redesSociais3D = [
  { id: 'youtube', titulo: 'Canal YouTube Emanuel', url: meusDadosReais.youtube, icone: '▶️', corEsfera: 0xff0000, nuvem: 'google' },
  { id: 'tiktok', titulo: 'TikTok Emanuel', url: meusDadosReais.tiktok, icone: '🎵', corEsfera: 0x00f2fe, nuvem: 'custom' },
  { id: 'instagram', titulo: 'Instagram Oficial', url: meusDadosReais.instagram, icone: '📸', corEsfera: 0xe1306c, nuvem: 'apple' },
  { id: 'github', titulo: 'Repositório GitHub', url: meusDadosReais.github, icone: '🐙', corEsfera: 0x6e5494, nuvem: 'microsoft' },
  { id: 'whatsapp', titulo: 'WhatsApp Direct', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', corEsfera: 0x25d366, nuvem: 'google' },
  { id: 'facebook', titulo: 'Facebook Oficial', url: meusDadosReais.facebook, icone: '📘', corEsfera: 0x1877f2, nuvem: 'microsoft' },
  { id: 'threads', titulo: 'Threads Oficial', url: meusDadosReais.threads, icone: '🧵', corEsfera: 0xffffff, nuvem: 'apple' }
];

// 2. LINKs 3D DINÂMICOS DE MAPAS EXISTENTES (COM ESFERAS E AVATARES 3D ROBÓTICOS)
const mapasExistentes3D = [
  { id: 'mapa_terrestre', nome: '🌍 Terrestre', rota: '/mapa', corEsfera: 0x22c55e, icone: '🌐', avatarTipo: 'geo_bot' },
  { id: 'mapa_orkut', nome: '🧡 Orkut Nostalgia', rota: '/orkut', corEsfera: 0xea580c, icone: '💬', avatarTipo: 'retro_bot' },
  { id: 'mapa_espacial', nome: '🪐 Espacial Cosmos', rota: '/espacial', corEsfera: 0x38bdf8, icone: '🚀', avatarTipo: 'astro_bot' },
  { id: 'mapa_ressonancia', nome: '🧬 Ressonância Genética', rota: '/ressonancia', corEsfera: 0x06b6d4, icone: '🧬', avatarTipo: 'bio_bot' },
  { id: 'mapa_patologia', nome: '🔬 Patologia Médica', rota: '/patologia', corEsfera: 0xef4444, icone: '🔬', avatarTipo: 'nano_bot' },
  { id: 'mapa_ia', nome: '⚡ Inteligência Artificial 3D', rota: '/mapa-ia', corEsfera: 0xf43f5e, icone: '🤖', avatarTipo: 'agi_bot' },
  { id: 'mapa_antiguidades', nome: '🏛️ Antiguidades Históricas', rota: '/antiguidades', corEsfera: 0xd97706, icone: '🏛️', avatarTipo: 'relic_bot' },
  { id: 'mapa_quantico', nome: '⚛️ Núcleo Quântico', rota: '/mapa-quantico', corEsfera: 0xc084fc, icone: '⚛️', avatarTipo: 'quantum_bot' },
  { id: 'mapa_aeroespacial', nome: '🛸 Aeroespacial & Aviação', rota: '/mapaaeroespacial', corEsfera: 0x8b5cf6, icone: '🛸', avatarTipo: 'jet_bot' }
];

// =========================================================================================
// 📸 COMPONENTE: RASTREAMENTO E TREINAMENTO VISUAL IA (CAMERA HUD)
// =========================================================================================
function MotionTracker() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("Desconectado");

  const toggleCamera = async () => {
    if (active) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setActive(false);
      setStatus("Desconectado");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setActive(true);
        setStatus("Treinando Visão IA...");
      } catch (err) {
        alert("Erro ao acessar a câmera: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(2, 6, 23, 0.9)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>📸 ROBOTOC VISION TRACKER</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#00f0ff', color: active ? '#fff' : '#000', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          {active ? 'Desligar Câmera' : 'Ativar Câmera IA'}
        </button>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '120px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: active ? 0.8 : 0.2 }} />
        {!active && <span style={{ position: 'absolute', fontSize: '10px', color: '#64748b' }}>Câmera Inativa</span>}
        {active && <div style={{ position: 'absolute', border: '1px dashed #00f0ff', width: '80%', height: '80%', pointerEvents: 'none', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.5)' }} />}
      </div>
      <span style={{ fontSize: '9px', color: active ? '#4ade80' : '#64748b', marginTop: '6px', display: 'block', fontFamily: 'monospace' }}>● Status: {status}</span>
    </div>
  );
}

// =========================================================================================
// ⚙️ COMPONENTE: GERENCIADOR DE PERIFÉRICOS BLUETOOTH / GEAR
// =========================================================================================
function RobotocGear({ onConnectGear, highlightGear }) {
  const [gears, setGears] = useState({ headset: false, mouse: false, keyboard: true });

  const toggleGear = (type) => {
    const nextState = !gears[type];
    setGears(prev => ({ ...prev, [type]: nextState }));
    if (onConnectGear) onConnectGear(type, nextState);
  };

  return (
    <div style={{ background: 'rgba(2, 6, 23, 0.9)', border: highlightGear ? '2px solid #eab308' : '1px solid #a855f7', borderRadius: '12px', padding: '10px', color: '#fff', boxShadow: highlightGear ? '0 0 15px rgba(234,179,8,0.4)' : 'none' }}>
      <span style={{ fontSize: '10px', color: highlightGear ? '#fef08a' : '#c084fc', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
        ⚙️ PERIFÉRICOS NEURAIS ROBOTOC GEAR {highlightGear && '(CONEXÃO SOLICITADA)'}
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <button onClick={() => toggleGear('headset')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.headset ? 'rgba(168,85,247,0.4)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>🎧 Headset</button>
        <button onClick={() => toggleGear('mouse')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.mouse ? 'rgba(168,85,247,0.4)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>🖱️ Mouse 3D</button>
        <button onClick={() => toggleGear('keyboard')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.keyboard ? 'rgba(168,85,247,0.4)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>⌨️ Glass Key</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🏛️ VITRINE VIRTUAL 3D COM AVATARES ROBÓTICOS, ESFERAS & LINKs DINÂMICOS
// =========================================================================================
function VitrineVirtual3D({ itemSelecionado, tipoCategoria, onRequestBluetoothConnection }) {
  const container3dRef = useRef(null);
  const sceneRef = useRef(null);
  const groupVitrineRef = useRef(null);

  useEffect(() => {
    if (!container3dRef.current) return;
    const width = container3dRef.current.clientWidth;
    const height = container3dRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container3dRef.current.appendChild(renderer.domElement);

    // Iluminação Futurista
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const spotCyan = new THREE.SpotLight(0x00f0ff, 5);
    spotCyan.position.set(-5, 8, 5);
    scene.add(spotCyan);

    const spotPurple = new THREE.SpotLight(0xa855f7, 5);
    spotPurple.position.set(5, 8, 5);
    scene.add(spotPurple);

    // BASE DA VITRINE DE VIDRO
    const vitrineGroup = new THREE.Group();

    // Pedestal de Vidro
    const baseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 })
    );
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    // Anel Neon de Borda
    const ringMat = new THREE.MeshBasicMaterial({ color: itemSelecionado ? itemSelecionado.corEsfera : 0x00f0ff });
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.05, 16, 100), ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.0;
    vitrineGroup.add(ringMesh);

    // Cúpula / Cilindro de Vidro Holográfico
    const glassMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 4.5, 32, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.05, side: THREE.DoubleSide })
    );
    glassMesh.position.y = 1.0;
    vitrineGroup.add(glassMesh);

    // CONTEÚDO 3D DA MAQUETE: ESFERA ENERGETICA + AVATAR ROBOTOC FUTURISTA
    const contentGroup = new THREE.Group();

    // 1. Esfera Dinâmica 3D do Elemento Selecionado
    const corTarget = itemSelecionado ? itemSelecionado.corEsfera : 0x00f0ff;
    const esferaGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const esferaMat = new THREE.MeshStandardMaterial({ color: corTarget, wireframe: true, emissive: corTarget, emissiveIntensity: 0.5 });
    const esferaMesh = new THREE.Mesh(esferaGeo, esferaMat);
    esferaMesh.position.set(0, 1.2, 0);
    contentGroup.add(esferaMesh);

    // 2. Avatar 3D Robotoc Futurista da Maquete
    const robot = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.2, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2 }));
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), new THREE.MeshStandardMaterial({ color: corTarget }));
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.52), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    head.position.y = 0.7;
    visor.position.y = 0.7;
    robot.add(body, head, visor);
    robot.position.set(0, -0.4, 0);
    contentGroup.add(robot);

    vitrineGroup.add(contentGroup);
    scene.add(vitrineGroup);
    groupVitrineRef.current = vitrineGroup;

    // Interatividade com Mouse / Touchpad
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !groupVitrineRef.current) return;
      const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
      groupVitrineRef.current.rotation.y += deltaMove.x * 0.01;
      groupVitrineRef.current.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging = false; };

    const domEl = container3dRef.current;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Loop de Animação
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (groupVitrineRef.current && !isDragging) {
        groupVitrineRef.current.rotation.y += 0.008;
        esferaMesh.rotation.x += 0.01;
        esferaMesh.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (domEl) {
        domEl.removeEventListener('mousedown', handleMouseDown);
        domEl.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [itemSelecionado, tipoCategoria]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: 'rgba(2, 6, 23, 0.8)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,240,255,0.3)' }}>
      <div ref={container3dRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '6px' }}>
        <button onClick={onRequestBluetoothConnection} style={{ padding: '4px 8px', backgroundColor: '#eab308', color: '#000', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📶 Módulo Bluetooth 3D
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🪟 PAINEL FUTURISTA DE DESENVOLVIMENTO ROBOTOC EMgemini
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [size, setSize] = useState({ width: 560, height: 620 });
  const [pos, setPos] = useState({ x: 60, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [categoriaAtiva, setCategoriaAtiva] = useState('mapas'); // 'mapas' ou 'redes'
  const [itemSelecionado, setItemSelecionado] = useState(mapasExistentes3D[0]);

  const handleMouseDownHeader = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    } else if (isResizing) {
      setSize({ width: Math.max(420, e.clientX - pos.x), height: Math.max(450, e.clientY - pos.y) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const executarRedirecionamentoDinâmico = () => {
    if (!itemSelecionado) return;
    if (categoriaAtiva === 'redes') {
      window.open(itemSelecionado.url, '_blank');
    } else {
      window.location.href = itemSelecionado.rota;
    }
  };

  return (
    <div style={{
      position: 'fixed', top: `${pos.y}px`, left: `${pos.x}px`, width: `${size.width}px`, height: `${size.height}px`,
      backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '2px solid #00f0ff', borderRadius: '18px',
      backdropFilter: 'blur(25px)', zIndex: 300, boxShadow: '0 0 40px rgba(0,240,255,0.3)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#fff', fontFamily: 'sans-serif'
    }}>
      {/* BARRA DE TÍTULO */}
      <div 
        onMouseDown={handleMouseDownHeader}
        style={{ padding: '12px 16px', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid #00f0ff', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>💎</span>
          <strong style={{ fontSize: '11px', color: '#00f0ff', letterSpacing: '0.5px' }}>
            PAINEL FUTURISTA DE DESENVOLVIMENTO ROBOTOC EMgemini
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✕</button>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* ABAS DE CATEGORIA */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => { setCategoriaAtiva('mapas'); setItemSelecionado(mapasExistentes3D[0]); }}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: categoriaAtiva === 'mapas' ? '#00f0ff' : 'transparent', color: categoriaAtiva === 'mapas' ? '#000' : '#00f0ff', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
          >
            🗺️ 9 Mapas Existentes
          </button>
          <button 
            onClick={() => { setCategoriaAtiva('redes'); setItemSelecionado(redesSociais3D[0]); }}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ff007f', backgroundColor: categoriaAtiva === 'redes' ? '#ff007f' : 'transparent', color: categoriaAtiva === 'redes' ? '#fff' : '#ff007f', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
          >
            📱 Redes Sociais Reais
          </button>
        </div>

        {/* MAQUETE VITRINE VIRTUAL 3D */}
        <VitrineVirtual3D 
          itemSelecionado={itemSelecionado} 
          tipoCategoria={categoriaAtiva} 
          onRequestBluetoothConnection={onRequestBluetooth} 
        />

        {/* SELETOR DINÂMICO DOS ELEMENTOS */}
        <div>
          <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            SELEÇÃO DE MAQUETE & ESFERA 3D:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {(categoriaAtiva === 'mapas' ? mapasExistentes3D : redesSociais3D).map((item) => (
              <button
                key={item.id}
                onClick={() => setItemSelecionado(item)}
                style={{
                  padding: '6px', borderRadius: '6px', border: `1px solid ${itemSelecionado?.id === item.id ? '#00f0ff' : '#334155'}`,
                  backgroundColor: itemSelecionado?.id === item.id ? 'rgba(0,240,255,0.25)' : 'rgba(15,23,42,0.8)',
                  color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                <span>{item.icone}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome || item.titulo}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BOTÃO DE LINK 3D DINÂMICO CONECTADO AO REDIRECIONAMENTO */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '12px', border: '1px solid #00f0ff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold' }}>
              🔗 LINK 3D DINÂMICO CONECTADO:
            </span>
            <span style={{ fontSize: '9px', color: '#94a3b8' }}>
              Status: ON-AIR
            </span>
          </div>

          <button
            onClick={executarEscaneamentoLink3DDinâmico}
            style={{
              padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none',
              borderRadius: '8px', fontWeight: '900', fontSize: '11px', cursor: 'pointer',
              boxShadow: '0 0 15px rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            🚀 Redirecionar para {itemSelecionado?.nome || itemSelecionado?.titulo} ➔
          </button>
        </div>

      </div>

      {/* ÍCONE DE REDIMENSIONAMENTO */}
      <div 
        onMouseDown={() => setIsResizing(true)}
        style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', cursor: 'nwse-resize', background: 'linear-gradient(135deg, transparent 50%, #00f0ff 50%)' }}
      />
    </div>
  );

  function executarEscaneamentoLink3DDinâmico() {
    executarRedirecionamentoDinâmico();
  }
}

// =========================================================================================
// 🌟 COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0)
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(true);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [solicitarConexaoBluetooth, setSolicitarConexaoBluetooth] = useState(false);

  const mountRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const orbMeshRef = useRef(null);

  const acionarSolicitacaoBluetooth = () => {
    setAndroidHudOpen(true);
    setSolicitarConexaoBluetooth(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Deseja se conectar ao sistema Robotoc com teclado, mouse ou fone bluetooth?");
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // CENA THREE.JS: ROBOTOC 3D PRINCIPAL
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Luzes
    scene.add(new THREE.DirectionalLight(0xffffff, 3.0));
    scene.add(new THREE.AmbientLight(0x0f172a, 1.8));

    // Grade holográfica de fundo
    const grid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1e293b);
    grid.position.y = -2.6;
    scene.add(grid);

    // ROBOTOC 3D
    const robotGroup = new THREE.Group();
    const whiteArmorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.85 });
    const cyanGlowMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.2 });

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.75, 0.8), whiteArmorMat);
    head.position.y = 1.9;
    robotGroup.add(head);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.82), cyanGlowMat);
    visor.position.set(0, 1.92, 0.02);
    robotGroup.add(visor);

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.4, 1.3, 16), whiteArmorMat);
    chest.position.y = 0.6;
    robotGroup.add(chest);

    scene.add(robotGroup);
    avatarGroupRef.current = robotGroup;

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = Math.sin(time * 2.0) * 0.15;
        avatarGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.2;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#fff', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Head><title>Emanuel.OS Core v6.0 | Painel EMgemini Dev 3D</title></Head>

      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div 
          ref={mountRef} 
          onClick={() => setJanelaRobotocDevAberta(true)}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'pointer' }} 
        />

        {/* CONTROLES DA INTERFACE */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px' }}>
          <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: 'rgba(0, 240, 255, 0.2)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
            🤖 Painel EMgemini Dev 3D
          </button>
        </div>
      </div>

      {/* PAINEL FUTURISTA REDIMENSIONÁVEL COM OS MAPAS E REDES SOCIAIS */}
      {janelaRobotocDevAberta && (
        <WindowDevPanelRobotoc 
          onClose={() => setJanelaRobotocDevAberta(false)} 
          onRequestBluetooth={acionarSolicitacaoBluetooth}
        />
      )}
    </div>
  );
}
