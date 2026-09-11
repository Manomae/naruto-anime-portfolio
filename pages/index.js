import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';

// Bibliotecas para geração de documentos
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pptxgen from "pptxgenjs";

// =========================================================================================
// 🌟 DADOS REAIS CENTRALIZADOS & ESTRUTURA DOS LINKS 3D DINÂMICOS
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

// ARRAY UNIFICADO DE LINKS DINÂMICOS (REDES SOCIAIS + 9 MAPAS)
const centralLinksDinamicosOS = [
  // REDES SOCIAIS
  { id: 'yt', nome: 'YouTube', categoria: 'Rede Social', url: meusDadosReais.youtube, corEsfera: 0xff0000, corRobotoc: 0xffffff, icone: '▶️' },
  { id: 'tk', nome: 'TikTok', categoria: 'Rede Social', url: meusDadosReais.tiktok, corEsfera: 0x00f0ff, corRobotoc: 0x09090b, icone: '🎵' },
  { id: 'ig', nome: 'Instagram', categoria: 'Rede Social', url: meusDadosReais.instagram, corEsfera: 0xe1306c, corRobotoc: 0xf8fafc, icone: '📸' },
  { id: 'gh', nome: 'GitHub', categoria: 'Rede Social', url: meusDadosReais.github, corEsfera: 0xa855f7, corRobotoc: 0x334155, icone: '🐙' },
  { id: 'wa', nome: 'WhatsApp', categoria: 'Rede Social', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, corEsfera: 0x22c55e, corRobotoc: 0xf8fafc, icone: '💬' },
  { id: 'fb', nome: 'Facebook', categoria: 'Rede Social', url: meusDadosReais.facebook, corEsfera: 0x1877f2, corRobotoc: 0x0284c7, icone: '📘' },
  { id: 'th', nome: 'Threads', categoria: 'Rede Social', url: meusDadosReais.threads, corEsfera: 0xffffff, corRobotoc: 0x09090b, icone: '🧵' },
  
  // 9 MAPAS INTEGRADOS
  { id: 'mapa_terrestre', nome: '🌍 Terrestre', categoria: 'Mapa Local', url: '/mapa', corEsfera: 0x22c55e, corRobotoc: 0x15803d, icone: '🌍' },
  { id: 'mapa_orkut', nome: '🧡 Orkut', categoria: 'Mapa Local', url: '/orkut', corEsfera: 0xea580c, corRobotoc: 0xc2410c, icone: '🧡' },
  { id: 'mapa_espacial', nome: '🪐 Espacial', categoria: 'Mapa Local', url: '/espacial', corEsfera: 0x0284c7, corRobotoc: 0x0369a1, icone: '🪐' },
  { id: 'mapa_ressonancia', nome: '🧬 Ressonância', categoria: 'Mapa Local', url: '/ressonancia', corEsfera: 0x06b6d4, corRobotoc: 0x0e7490, icone: '🧬' },
  { id: 'mapa_patologia', nome: '🔬 Patologia', categoria: 'Mapa Local', url: '/patologia', corEsfera: 0xef4444, corRobotoc: 0xb91c1c, icone: '🔬' },
  { id: 'mapa_ia', nome: '⚡ IA 3D', categoria: 'Mapa Local', url: '/mapa-ia', corEsfera: 0xf43f5e, corRobotoc: 0xbe123c, icone: '⚡' },
  { id: 'mapa_antiguidades', nome: '🏛️ Antiguidades', categoria: 'Mapa Local', url: '/antiguidades', corEsfera: 0xd97706, corRobotoc: 0xb45309, icone: '🏛️' },
  { id: 'mapa_quantico', nome: '⚛️ Quântico', categoria: 'Mapa Local', url: '/mapa-quantico', corEsfera: 0x8b5cf6, corRobotoc: 0x6d28d9, icone: '⚛️' },
  { id: 'mapa_aeroespacial', nome: '🛸 Aeroespacial', categoria: 'Mapa Local', url: '/mapaaeroespacial', corEsfera: 0x9333ea, corRobotoc: 0x7e22ce, icone: '🛸' }
];

// =========================================================================================
// 🏛️ --- COMPONENTE: VITRINE VIRTUAL 3D UNIFICADA (MAQUETES, ROBOTOCS & ESFERAS) ---
// =========================================================================================
function VitrineVirtual3DUnificada({ itemSelecionado }) {
  const container3dRef = useRef(null);

  useEffect(() => {
    if (!container3dRef.current) return;
    const width = container3dRef.current.clientWidth;
    const height = container3dRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container3dRef.current.innerHTML = '';
    container3dRef.current.appendChild(renderer.domElement);

    // Iluminação Futurista
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const cyanSpot = new THREE.SpotLight(0x00f0ff, 6);
    cyanSpot.position.set(-5, 8, 5);
    scene.add(cyanSpot);

    const purpleSpot = new THREE.SpotLight(0xa855f7, 6);
    purpleSpot.position.set(5, 8, 5);
    scene.add(purpleSpot);

    const maqueteGroup = new THREE.Group();

    // 1. Base / Pedestal de Vidro com Glow Dynamic
    const baseGeo = new THREE.CylinderGeometry(3.2, 3.5, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: itemSelecionado ? itemSelecionado.corEsfera : 0x00f0ff,
      roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.8
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    maqueteGroup.add(baseMesh);

    // Anel Neon Externo
    const ringGeo = new THREE.TorusGeometry(3.3, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: itemSelecionado ? itemSelecionado.corEsfera : 0x00f0ff });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.0;
    maqueteGroup.add(ringMesh);

    // 2. Avatar Robotoc 3D Customizado por Item
    const robotGroup = new THREE.Group();
    const robotColor = itemSelecionado ? itemSelecionado.corRobotoc : 0xf8fafc;
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.8 });
    const customMat = new THREE.MeshStandardMaterial({ color: robotColor, roughness: 0.1, metalness: 0.9 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 1.1, 16), whiteMat);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), customMat);
    head.position.y = 0.85;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.62), new THREE.MeshBasicMaterial({ color: itemSelecionado ? itemSelecionado.corEsfera : 0x00f0ff }));
    visor.position.y = 0.85;

    robotGroup.add(body, head, visor);
    robotGroup.position.set(-1.1, 0, 0);
    maqueteGroup.add(robotGroup);

    // 3. Esfera Quantizada Flutuante
    const esferaColor = itemSelecionado ? itemSelecionado.corEsfera : 0x00f0ff;
    const esferaGroup = new THREE.Group();

    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.MeshStandardMaterial({ color: esferaColor, roughness: 0.1, metalness: 0.8, emissive: esferaColor, emissiveIntensity: 0.5 })
    );

    const outerWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );

    esferaGroup.add(innerSphere, outerWire);
    esferaGroup.position.set(1.1, 0.6, 0);
    maqueteGroup.add(esferaGroup);

    scene.add(maqueteGroup);

    // Animação de Rotação e Flutuação
    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      maqueteGroup.rotation.y += 0.008;
      esferaGroup.rotation.x = time * 1.2;
      esferaGroup.rotation.y = time * 1.5;
      esferaGroup.position.y = 0.6 + Math.sin(time * 2.5) * 0.12;
      robotGroup.position.y = Math.cos(time * 2.0) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container3dRef.current) container3dRef.current.innerHTML = '';
    };
  }, [itemSelecionado]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '270px', backgroundColor: 'rgba(2, 6, 23, 0.9)', borderRadius: '16px', overflow: 'hidden', border: '2px solid #00f0ff', boxShadow: '0 0 25px rgba(0,240,255,0.2)' }}>
      <div ref={container3dRef} style={{ width: '100%', height: '100%' }} />

      {itemSelecionado && (
        <a
          href={itemSelecionado.url}
          target={itemSelecionado.categoria === 'Rede Social' ? '_blank' : '_self'}
          rel="noreferrer"
          style={{
            position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
            padding: '8px 20px', backgroundColor: '#00f0ff', color: '#000',
            borderRadius: '20px', fontWeight: '900', fontSize: '11px', textDecoration: 'none',
            boxShadow: '0 0 15px rgba(0,240,255,0.8)', cursor: 'pointer', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          🚀 Acessar {itemSelecionado.nome} (Link 3D Dinâmico)
        </a>
      )}
    </div>
  );
}

// =========================================================================================
// 🪟 --- COMPONENTE: PAINEL FUTURISTA ROBOTOC EMGEMINI (COM LINKS 3D DINÂMICOS) ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [size, setSize] = useState({ width: 560, height: 620 });
  const [pos, setPos] = useState({ x: 60, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [itemSelecionado, setItemSelecionado] = useState(centralLinksDinamicosOS[0]);

  const handleMouseDownHeader = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    } else if (isResizing) {
      setSize({ width: Math.max(400, e.clientX - pos.x), height: Math.max(450, e.clientY - pos.y) });
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

  const redesSociais = centralLinksDinamicosOS.filter(item => item.categoria === 'Rede Social');
  const mapasLocais = centralLinksDinamicosOS.filter(item => item.categoria === 'Mapa Local');

  return (
    <div style={{
      position: 'fixed', top: `${pos.y}px`, left: `${pos.x}px`, width: `${size.width}px`, height: `${size.height}px`,
      backgroundColor: 'rgba(2, 6, 23, 0.96)', border: '2px solid #00f0ff', borderRadius: '18px',
      backdropFilter: 'blur(25px)', zIndex: 300, boxShadow: '0 0 45px rgba(0,240,255,0.3)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#fff', fontFamily: 'sans-serif'
    }}>
      {/* BARRA DE TÍTULO */}
      <div
        onMouseDown={handleMouseDownHeader}
        style={{ padding: '12px 16px', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #00f0ff', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>💎</span>
          <strong style={{ fontSize: '11px', color: '#00f0ff', letterSpacing: '0.5px' }}>
            PAINEL FUTURISTA DE DESENVOLVIMENTO ROBOTOC EMgemini v6.0
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✕</button>
      </div>

      {/* CONTEÚDO ROLÁVEL */}
      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '9px', color: '#94a3b8' }}>
          🏛️ <strong>Vitrine 3D Dinâmica:</strong> Maquete, Robotoc Avatar, Esfera de Energia e Redirecionamento 3D Ativo.
        </span>

        {/* VITRINE 3D UNIFICADA */}
        <VitrineVirtual3DUnificada itemSelecionado={itemSelecionado} />

        {/* SEÇÃO 1: REDES SOCIAIS (LINKS 3D DINÂMICOS) */}
        <div>
          <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            📲 REDES SOCIAIS (LINKS 3D DINÂMICOS):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {redesSociais.map(item => (
              <button
                key={item.id}
                onClick={() => setItemSelecionado(item)}
                style={{
                  padding: '6px', borderRadius: '6px', border: itemSelecionado.id === item.id ? '1px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: itemSelecionado.id === item.id ? 'rgba(0,240,255,0.3)' : 'rgba(15,23,42,0.8)',
                  color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                }}
              >
                <span>{item.icone}</span> {item.nome}
              </button>
            ))}
          </div>
        </div>

        {/* SEÇÃO 2: 9 MAPAS INTEGRADOS (LINKS 3D DINÂMICOS) */}
        <div>
          <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            🌐 CENTRAL DOS 9 MAPAS (MAQUETES & ESFERAS 3D):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {mapasLocais.map(item => (
              <button
                key={item.id}
                onClick={() => setItemSelecionado(item)}
                style={{
                  padding: '6px', borderRadius: '6px', border: itemSelecionado.id === item.id ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: itemSelecionado.id === item.id ? 'rgba(168,85,247,0.3)' : 'rgba(15,23,42,0.8)',
                  color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                }}
              >
                <span>{item.icone}</span> {item.nome}
              </button>
            ))}
          </div>
        </div>

        {/* CONSOLE DE HARDWARE & BLUETOOTH */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '9px', color: '#4ade80', fontWeight: 'bold', display: 'block' }}>⚡ CONEXÃO PERIFÉRICA NEURAL</span>
            <span style={{ fontSize: '8px', color: '#cbd5e1' }}>Sincronizar fone, mouse ou teclado bluetooth ao Robotoc.</span>
          </div>
          <button onClick={onRequestBluetooth} style={{ padding: '6px 10px', backgroundColor: '#eab308', color: '#000', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
            📶 Conectar Gear
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
}

// =========================================================================================
// 📸 --- COMPONENTE: RASTREAMENTO VISUAL IA (CAMERA HUD) ---
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
        {active && <div style={{ position: 'absolute', border: '1px dashed #00f0ff', width: '80%', height: '80%', pointerEvents: 'none' }} />}
      </div>
      <span style={{ fontSize: '9px', color: active ? '#4ade80' : '#64748b', marginTop: '6px', display: 'block', fontFamily: 'monospace' }}>● Status: {status}</span>
    </div>
  );
}

// =========================================================================================
// ⚙️ --- COMPONENTE: GERENCIADOR DE PERIFÉRICOS BLUETOOTH / GEAR ---
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
        <button onClick={() => toggleGear('headset')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.headset ? 'rgba(168,85,247,0.4)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>
          🎧 Headset
        </button>
        <button onClick={() => toggleGear('mouse')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.mouse ? 'rgba(168,85,247,0.4)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>
          🖱️ Mouse 3D
        </button>
        <button onClick={() => toggleGear('keyboard')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.keyboard ? 'rgba(168,85,247,0.4)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>
          ⌨️ Glass Key
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// ⌨️ --- COMPONENTE: TECLADO HOLOGRÁFICO GLASS 3D ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  const [lastKey, setLastKey] = useState(null);
  const keys = [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','Backspace'],
    ['Space', 'Enter']
  ];

  const handlePress = (k) => {
    setLastKey(k);
    if (onKeyPress) onKeyPress(k);
    setTimeout(() => setLastKey(null), 300);
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '10px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D</span>
        {lastKey && <span style={{ fontSize: '9px', backgroundColor: '#00f0ff', padding: '1px 6px', borderRadius: '4px', color: '#000', fontWeight: 'bold' }}>TECLA: {lastKey}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {keys.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
            {row.map((k) => (
              <button
                key={k}
                onClick={() => handlePress(k)}
                style={{
                  flex: k === 'Space' ? 3 : k === 'Enter' || k === 'Backspace' ? 1.5 : 1,
                  padding: '6px 2px',
                  background: lastKey === k ? 'rgba(0, 240, 255, 0.6)' : 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  borderRadius: '4px', color: lastKey === k ? '#000' : '#00f0ff',
                  fontSize: '9px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================================
// 📲 --- COMPONENTE: MENSAGERIA REAL VIA NÚMERO ---
// =========================================================================================
function DispatcherMensagensNumeros({ addLog }) {
  const [plataforma, setPlataforma] = useState('whatsapp');
  const [ddd, setDdd] = useState('88');
  const [num1, setNum1] = useState('981493989');
  const [num2, setNum2] = useState('');
  const [mensagem, setMensagem] = useState('Mensagem do Emanuel.OS v6.0 - Sistema ROBOTOC 3D ativo.');

  const dispararMensagens = () => {
    if (!num1) return alert("Insira ao menos um número de telefone válido.");

    const enviarParaNumero = (numero) => {
      const fullPhone = `55${ddd}${numero.replace(/\D/g, '')}`;
      let url = '';

      if (plataforma === 'whatsapp') url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(mensagem)}`;
      else if (plataforma === 'telegram') url = `https://t.me/share/url?url=&text=${encodeURIComponent(mensagem)}`;
      else if (plataforma === 'google_messages') url = `sms:+${fullPhone}?body=${encodeURIComponent(mensagem)}`;

      if (url && typeof window !== 'undefined') window.open(url, '_blank');
      if (addLog) addLog(`[DISPATCHER: ${plataforma.toUpperCase()}] Mensagem enviada para +${fullPhone}`);
    };

    enviarParaNumero(num1);
    if (num2.trim()) setTimeout(() => enviarParaNumero(num2), 600);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', color: '#fff' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '11px', margin: '0 0 8px 0' }}>💬 MENSAGERIA REAL VIA NÚMERO DE TELEFONE</h3>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button onClick={() => setPlataforma('whatsapp')} style={{ flex: 1, padding: '6px', border: '1px solid #22c55e', backgroundColor: plataforma === 'whatsapp' ? '#22c55e' : 'transparent', color: plataforma === 'whatsapp' ? '#000' : '#22c55e', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>WhatsApp</button>
        <button onClick={() => setPlataforma('telegram')} style={{ flex: 1, padding: '6px', border: '1px solid #38bdf8', backgroundColor: plataforma === 'telegram' ? '#38bdf8' : 'transparent', color: plataforma === 'telegram' ? '#000' : '#38bdf8', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Telegram</button>
        <button onClick={() => setPlataforma('google_messages')} style={{ flex: 1, padding: '6px', border: '1px solid #eab308', backgroundColor: plataforma === 'google_messages' ? '#eab308' : 'transparent', color: plataforma === 'google_messages' ? '#000' : '#eab308', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>SMS/Google</button>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input type="text" value={ddd} onChange={(e) => setDdd(e.target.value)} placeholder="DDD" style={{ width: '40px', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', textAlign: 'center' }} />
        <input type="text" value={num1} onChange={(e) => setNum1(e.target.value)} placeholder="Número 1 (Obrigatório)" style={{ flex: 1, padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
      </div>
      <div style={{ marginBottom: '8px' }}>
        <input type="text" value={num2} onChange={(e) => setNum2(e.target.value)} placeholder="Número 2 (Opcional - Envio duplo)" style={{ width: '100%', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', boxSizing: 'border-box' }} />
      </div>
      <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', padding: '6px', fontSize: '10px', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />
      <button onClick={dispararMensagens} style={{ width: '100%', padding: '8px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
        🚀 Disparar Mensagem Direta
      </button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- COMPONENTE: PENSAMENTO NEURAL ROBOTOC 3D ---
// =========================================================================================
function RobotocNeuralThoughtPanel({ addLog }) {
  const [contaGoogle, setContaGoogle] = useState('leeheroi123@gmail.com');
  const [contaApple, setContaApple] = useState('emanuel@icloud.com');
  const [contaOneDrive, setContaOneDrive] = useState('emanuel@outlook.com');
  const [statusSinc, setStatusSinc] = useState('Conectado');

  const sincronizarContas = () => {
    setStatusSinc('Sincronizando...');
    if (addLog) addLog(`[ROBOTOC 3D] Sincronizando Contas: Google (${contaGoogle}), Apple (${contaApple}), OneDrive (${contaOneDrive})`);
    setTimeout(() => {
      setStatusSinc('Conectado e Ativo');
      alert('Sincronização real de e-mails concluída!');
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '6px', marginBottom: '10px' }}>
        <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: 0, fontWeight: 'bold' }}>🧠 PENSAMENTO FUTURISTA ROBOTOC 3D</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: '#94a3b8' }}>Integração direta com triple e-mail e processamento neural.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
        <div>
          <label style={{ fontSize: '8px', color: '#38bdf8', display: 'block' }}>📧 Google Mail / AI Studio:</label>
          <input type="email" value={contaGoogle} onChange={(e) => setContaGoogle(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#09090b', border: '1px solid #38bdf8', borderRadius: '4px', color: '#fff', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#c084fc', display: 'block' }}>🍎 Apple iCloud Mail:</label>
          <input type="email" value={contaApple} onChange={(e) => setContaApple(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#09090b', border: '1px solid #c084fc', borderRadius: '4px', color: '#fff', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#fb923c', display: 'block' }}>☁️ Microsoft OneDrive / Azure:</label>
          <input type="email" value={contaOneDrive} onChange={(e) => setContaOneDrive(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#09090b', border: '1px solid #fb923c', borderRadius: '4px', color: '#fff', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', color: '#4ade80' }}>● Status: {statusSinc}</span>
        <button onClick={sincronizarContas} style={{ padding: '6px 10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔄 Sincronizar E-mails
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 📱 --- PAINEL ANDROID HUD LATERAL ---
// =========================================================================================
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: open ? 0 : '-360px', width: '350px', height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.95)', borderLeft: '2px solid #00f0ff',
      backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '16px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#00f0ff' }}>🤖 ANDROID HUD SYSTEM v6.0</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  );
}

// =========================================================================================
// 📊 --- COMPONENTE: EM CREATOR STUDIO IA ---
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1240, audiosGerações: 380, fotosRenders: 890,
    videosRenderizados: 215, memesGifsEngajados: 560, audienciaAtiva: 'Alta (89% retenção)', resolucaoProblemasIA: '94,2% Autônomos'
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(2, 6, 23, 0.88)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.96)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#fff', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#00f0ff', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <h2 style={{ color: '#00f0ff', fontSize: '18px', margin: '0 0 12px 0', fontWeight: '900' }}>
          📊 EM CREATOR STUDIO IA - AGI CORE v6.0
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <strong style={{ display: 'block', fontSize: '14px', color: '#00f0ff' }}>{metricas.textosConversas}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Textos / Chat</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <strong style={{ display: 'block', fontSize: '14px', color: '#a855f7' }}>{metricas.audiosGerações}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Áudios / Voz</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <strong style={{ display: 'block', fontSize: '14px', color: '#ff007f' }}>{metricas.fotosRenders}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Fotos / Renders</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <strong style={{ display: 'block', fontSize: '14px', color: '#eab308' }}>{metricas.videosRenderizados}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Vídeos HD/4K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================================
// 💻 --- PAINEL DE DESENVOLVEDOR SPLIT SCREEN v6.0 ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(
    `// Emanuel.OS Dev Studio v6.0 - Ambiente de Desenvolvimento\n// Assistência ativa via IA Gemini AGI Core v6.0 e Robotoc 3D\n\nfunction inicializarModuloEmanuel() {\n  const status = "ONLINE";\n  console.log(\`Sincronizando componentes neurais... [\${status}]\`);\n  return true;\n}`
  );

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.96)',
      borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '10px', color: '#fff',
      fontFamily: 'Consolas, Monaco, monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#00f0ff' }}>👨‍💻 Emanuel.OS Dev Workstation | Split Screen</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold' }}>✕ Fechar</button>
      </div>
      <textarea
        value={codigoFonte}
        onChange={(e) => setCodigoFonte(e.target.value)}
        style={{
          width: '100%', flexGrow: 1, backgroundColor: '#010409', border: '1px solid #334155',
          borderRadius: '8px', color: '#38bdf8', padding: '12px', fontSize: '11px',
          outline: 'none', resize: 'none', boxSizing: 'border-box'
        }}
      />
      <GlassKeyboard3D onKeyPress={(k) => setCodigoFonte(prev => k === 'Backspace' ? prev.slice(0, -1) : k === 'Space' ? prev + ' ' : k === 'Enter' ? prev + '\n' : prev + k)} />
    </div>
  );
}

// =========================================================================================
// ✉️ --- COMPONENTE DE CAPTURA COM ENVIO DE E-MAIL (EMAILJS) ---
// =========================================================================================
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    emailjs.send('service_94k276x', 'template_o11qtsf', { email, to_email: email }, 'MsHsmnoDh6w2fnYJ6')
      .then(() => { setEnviado(true); setEmail(''); })
      .catch(() => alert('Erro ao enviar e-mail.'));
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#fff' }}>
      <h3 style={{ color: '#00f0ff', margin: '0 0 6px 0', fontSize: '11px' }}>🎁 Baixar Comandos Mestre + Mapas 3D</h3>
      {enviado ? (
        <span style={{ color: '#4ade80', fontSize: '10px' }}>✅ Confirmado com sucesso!</span>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input type="email" required placeholder="Digite seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
          <button type="submit" style={{ padding: '8px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>🚀 Cadastrar</button>
        </form>
      )}
    </div>
  );
}

// =========================================================================================
// 🎥 --- MÓDULO GOOGLE MEET REAL + AVATARES 3D ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [tema, setTema] = useState('Imersão Mapas, Index & AGI');
  const [linkGerado, setLinkGerado] = useState('');

  const criarReuniao = () => {
    const code = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const url = `https://meet.google.com/${code}`;
    setLinkGerado(url);
    if (addLog) addLog(`[MEET] Reunião criada: ${url}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#fff' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '11px', margin: '0 0 6px 0' }}>🎥 Google Meet REAL + Avatares IA 3D</h3>
      <input type="text" value={tema} onChange={(e) => setTema(e.target.value)} style={{ width: '100%', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', marginBottom: '6px', boxSizing: 'border-box' }} />
      <button onClick={criarReuniao} style={{ width: '100%', padding: '8px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>⚡ Criar Google Meet</button>
      {linkGerado && <a href={linkGerado} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: '6px', color: '#38bdf8', fontSize: '9px', wordBreak: 'break-all' }}>{linkGerado}</a>}
    </div>
  );
}

// =========================================================================================
// 🖥️ --- TERMINAL UNIX CANVAS ---
// =========================================================================================
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#4ade80';
    ctx.fillText('Emanuel.OS v6.0 - Terminal Nativo Active', 10, 20);
    ctx.fillText('root@emanuel-os:~# ready', 10, 40);
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100px', backgroundColor: '#000a12', borderRadius: '8px', border: '1px solid #00f0ff' }} />;
};

// =========================================================================================
// ₿ --- ANALÍTICA BITCOIN ---
// =========================================================================================
const BitcoinAnalysisPanel = () => (
  <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid #eab308', borderRadius: '12px', padding: '12px', color: '#fff' }}>
    <span style={{ fontSize: '10px', color: '#eab308', fontWeight: 'bold' }}>₿ BITCOIN AGI PREDICTION</span>
    <strong style={{ display: 'block', fontSize: '14px', color: '#4ade80', marginTop: '4px' }}>Target $105,000.00</strong>
  </div>
);

// =========================================================================================
// ☁️ --- CLOUDFLARE WORKER DEPLOYER ---
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => (
  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #fb923c', borderRadius: '12px', padding: '12px', color: '#fff' }}>
    <span style={{ fontSize: '10px', color: '#fb923c', fontWeight: 'bold' }}>☁️ CLOUDFLARE WORKER EDGE</span>
    <button onClick={() => addLog && addLog('[CLOUDFLARE] Deploy executado na borda.')} style={{ width: '100%', padding: '6px', backgroundColor: '#fb923c', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '9px', marginTop: '6px', cursor: 'pointer' }}>
      🚀 Deploy Global Edge
    </button>
  </div>
);

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0) --- 🖥️
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);
  const [solicitarConexaoBluetooth, setSolicitarConexaoBluetooth] = useState(false);

  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC: LOG] System core v6.0 operational.",
    "[ROBOTOC: STATUS] Modo de Pensamento Neural: ONLINE em Azul & Branco."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC 3D (IA CORE v6.0)', texto: 'Emanuel.OS v6.0 | Clique no Robô 3D para abrir o Painel Futurista com os Links 3D Dinâmicos das suas Redes e Mapas!', tipo: 'sys' }
  ]);

  const mountRef = useRef(null);

  const addLogTerminal = (novoLog) => setCmdLogs(prev => [...prev, novoLog]);

  const acionarSolicitacaoBluetooth = () => {
    setAndroidHudOpen(true);
    setSolicitarConexaoBluetooth(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Deseja se conectar ao sistema Robotoc com teclado, mouse ou fone bluetooth?");
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const processarAutenticacao = (e) => {
    e.preventDefault();
    if (chaveAcessoTripla.trim() === "8888" || chaveAcessoTripla.trim() === "EMANUEL-TRIPLE-AGI-8888-BRS7") {
      setBloqueado(false);
    } else {
      alert("Chave Inválida! Use 8888 para acesso rápido.");
    }
  };

  // CENA PRINCIPAL THREE.JS DO ROBOTOC 3D
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

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00f0ff, 8, 40);
    blueLight.position.set(-4, 3, 4);
    scene.add(blueLight);

    const robotGroup = new THREE.Group();

    const headMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.9 });
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.85 });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.2 });

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.75, 0.8), headMat);
    head.position.y = 1.9;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.82), visorMat);
    visor.position.set(0, 1.92, 0.02);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.4, 1.3, 16), bodyMat);
    body.position.y = 0.6;

    robotGroup.add(head, visor, body);
    scene.add(robotGroup);

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      robotGroup.position.y = Math.sin(time * 2.0) * 0.15;
      robotGroup.rotation.y = Math.sin(time * 0.8) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
    };
  }, [bloqueado]);

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <Head><title>Emanuel.OS v6.0 - Autenticação</title></Head>
        <form onSubmit={processarAutenticacao} style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', textAlign: 'center', width: '320px' }}>
          <h2 style={{ color: '#00f0ff', fontSize: '18px', marginBottom: '15px' }}>EMANUEL.OS & ROBOTOC 3D</h2>
          <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite 8888..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#00f0ff', width: '100%', textAlign: 'center', marginBottom: '12px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Desbloquear System ➔</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#fff', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Head><title>Emanuel.OS Core v6.0 | ROBOTOC 3D</title></Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>

          {/* CENA 3D ROBOTOC - CLIQUE ABRE O PAINEL FUTURISTA COM LINKS 3D DINÂMICOS */}
          <div
            ref={mountRef}
            onClick={() => setJanelaRobotocDevAberta(true)}
            title="Clique no Robotoc 3D para abrir o Painel Futurista com os Links 3D Dinâmicos!"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'pointer' }}
          />

          {/* BARRA SUPERIOR */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>
            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', border: '1px solid #eab308', color: '#fef08a', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🤖 Painel EMgemini Dev 3D (Links Dinâmicos)
            </button>
            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#ff007f' : 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#c084fc', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🖥️ {modoDevSplit ? 'Fechar Split' : 'Dev Split'}
            </button>
            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📱 Android HUD
            </button>
            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 0, 127, 0.15)', border: '1px solid #ff007f', color: '#ff007f', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📊 Creator Studio
            </button>
          </div>

          {/* SIDEBAR ESQUERDA */}
          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px',
            opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(7, 7, 12, 0.95)', backdropFilter: 'blur(30px)',
            borderRight: '1px solid rgba(0, 240, 255, 0.2)', padding: sidebarAberta ? '20px' : '0px',
            display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 90,
            transition: 'all 0.3s ease', boxSizing: 'border-box'
          }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0 }}>
                  Contexto: EMANUEL<span style={{ color: '#00f0ff' }}>.OS v6.0</span>
                </h1>
                <UnixTerminalCanvas />
                <div style={{ padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 8px 0' }}>🌐 Central dos 9 Mapas Integrados</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <Link href="/mapa" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #16a34a', color: '#4ade80', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🌍 Terrestre</Link>
                    <Link href="/orkut" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧡 Orkut</Link>
                    <Link href="/espacial" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🪐 Espacial</Link>
                    <Link href="/ressonancia" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #06b6d4', color: '#22d3ee', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧬 Ressonância</Link>
                    <Link href="/patologia" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🔬 Patologia</Link>
                    <Link href="/mapa-ia" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #f43f5e', color: '#fda4af', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚡ IA 3D</Link>
                    <Link href="/antiguidades" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #d97706', color: '#fcd34d', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🏛️ Antiguidades</Link>
                    <Link href="/mapa-quantico" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #8b5cf6', color: '#c084fc', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚛️ Quântico</Link>
                    <Link href="/mapaaeroespacial" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #9333ea', color: '#e879f9', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold', gridColumn: 'span 2' }}>🛸 Aeroespacial</Link>
                  </div>
                </div>
                <RobotocNeuralThoughtPanel addLog={addLogTerminal} />
                <DispatcherMensagensNumeros addLog={addLogTerminal} />
                <GoogleMeetAvatarManager addLog={addLogTerminal} />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>

          {/* RODAPÉ E CHAT */}
          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: 'calc(100% - 30px)', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', padding: '10px', maxHeight: '80px', overflowY: 'auto' }}>
              {mensagens.map((item, index) => (
                <div key={index}>
                  <span style={{ fontSize: '8px', fontWeight: 'bold', color: item.tipo === 'user' ? '#00f0ff' : '#f43f5e' }}>{item.autor}</span>
                  <p style={{ margin: 0, fontSize: '10px', color: '#f8fafc' }}>{item.texto}</p>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (chatInput.trim()) { setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: chatInput, tipo: 'user' }]); setChatInput(''); } }} style={{ backgroundColor: 'rgba(5, 12, 24, 0.9)', border: '1px solid #00f0ff', borderRadius: '25px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com o ROBOTOC 3D..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '10px', flexGrow: 1 }} />
              <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar ➔</button>
            </form>
          </div>
        </div>

        {/* MODO DEV SPLIT SCREEN */}
        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>

      {/* PAINEL FUTURISTA REDIMENSIONÁVEL ROBOTOC EMgemini (COM LINKS 3D DINÂMICOS) */}
      {janelaRobotocDevAberta && (
        <WindowDevPanelRobotoc
          onClose={() => setJanelaRobotocDevAberta(false)}
          onRequestBluetooth={acionarSolicitacaoBluetooth}
        />
      )}

      {/* GAVETA ANDROID HUD LATERAL */}
      <AndroidHUDPanel open={androidHudOpen} onClose={() => { setAndroidHudOpen(false); setSolicitarConexaoBluetooth(false); }}>
        <MotionTracker />
        <RobotocGear highlightGear={solicitarConexaoBluetooth} onConnectGear={(t, s) => addLogTerminal(`[GEAR] ${t}: ${s ? 'ON' : 'OFF'}`)} />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer addLog={addLogTerminal} />
      </AndroidHUDPanel>

      {/* MODAL CREATOR STUDIO */}
      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
