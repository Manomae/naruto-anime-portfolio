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

// --- COMPONENTE: RASTREAMENTO E TREINAMENTO VISUAL IA (CAMERA HUD) ---
function MotionTracker({ onFrameCapture }) {
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setActive(true);
        setStatus("Treinando Visão IA...");
      } catch (err) {
        alert("Erro ao acessar a câmera para treinamento visual: " + err.message);
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

// --- COMPONENTE: GERENCIADOR DE PERIFÉRICOS BLUETOOTH / GEAR ---
function RobotocGear({ onConnectGear }) {
  const [gears, setGears] = useState({
    headset: false,
    mouse: false,
    keyboard: true
  });

  const toggleGear = (type) => {
    const nextState = !gears[type];
    setGears(prev => ({ ...prev, [type]: nextState }));
    if (onConnectGear) onConnectGear(type, nextState);
  };

  return (
    <div style={{ background: 'rgba(2, 6, 23, 0.9)', border: '1px solid #a855f7', borderRadius: '12px', padding: '10px', color: '#fff' }}>
      <span style={{ fontSize: '10px', color: '#c084fc', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>⚙️ PERIFÉRICOS NEURAIS ROBOTOC GEAR</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <button onClick={() => toggleGear('headset')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.headset ? 'rgba(168,85,247,0.3)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>
          🎧 Headset
        </button>
        <button onClick={() => toggleGear('mouse')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.mouse ? 'rgba(168,85,247,0.3)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>
          🖱️ Mouse 3D
        </button>
        <button onClick={() => toggleGear('keyboard')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #a855f7', background: gears.keyboard ? 'rgba(168,85,247,0.3)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer' }}>
          ⌨️ Glass Key
        </button>
      </div>
    </div>
  );
}

// --- COMPONENTE: TECLADO HOLOGRÁFICO GLASS 3D ---
function GlassKeyboard3D({ onKeyPress }) {
  const keys = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','Backspace'],
    ['Space', 'Enter']
  ];

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '8px', color: '#fff' }}>
      <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {keys.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
            {row.map((k) => (
              <button
                key={k}
                onClick={() => onKeyPress && onKeyPress(k)}
                style={{
                  flex: k === 'Space' ? 3 : k === 'Enter' || k === 'Backspace' ? 1.5 : 1,
                  padding: '5px 2px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '4px',
                  color: '#00f0ff',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 0 5px rgba(0,240,255,0.2)'
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

// Dicionário Ninja local para fallback
const dicionarioNinjaLocal = [
  { termo: "chakra", categoria: "Energia Neural", significado: "Massa de energia biológica e espiritual combinada para execução de técnicas e comandos neurais." },
  { termo: "sharingan", categoria: "Linhagem Sanguínea", significado: "Dōjutsu do Clã Uchiha capaz de perceber, copiar e prever fluxos de informação e movimento." },
  { termo: "emanuel", categoria: "Mestre Criador", significado: "Desenvolvedor Chefe e Arquiteto Supremo do Emanuel.OS v5.1 e Matriz G-AGI." }
];

// --- PAINEL ANDROID HUD LATERAL (GAVETA EXPANSÍVEL) ---
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: open ? 0 : '-320px', width: '310px', height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.95)', borderLeft: '2px solid #00f0ff',
      backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '16px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <strong style={{ fontSize: '12px', color: '#00f0ff' }}>ANDROID HUD SYSTEM</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>➔</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  );
}

// --- CREATOR STUDIO IA ---
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1240, audiosGerações: 380, fotosRenders: 890,
    videosRenderizados: 215, memesGifsEngajados: 560, audienciaAtiva: 'Alta (89% retenção)', resolucaoProblemasIA: '94,2% Autônomos'
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(2, 6, 23, 0.88)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.96)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#fff', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#00f0ff', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        <h2 style={{ color: '#00f0ff', fontSize: '18px', margin: '0 0 10px 0' }}>📊 EM CREATOR STUDIO IA <span style={{ fontSize: '10px', color: '#ff007f', border: '1px solid #ff007f', padding: '2px 8px', borderRadius: '10px' }}>AGI Core v5.1</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>💬</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#00f0ff' }}>{metricas.textosConversas}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Textos / Chat</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎙️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#a855f7' }}>{metricas.audiosGerações}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Áudios / Voz</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DEV SPLIT SCREEN ---
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(`// Emanuel.OS Dev Studio\nfunction inicializarModuloEmanuel() {\n  const status = "ONLINE";\n  console.log(\`Sincronizando componentes neurais... [\${status}]\`);\n  return true;\n}`);

  const exportarCodigoPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(0, 240, 255);
    doc.setFontSize(16);
    doc.text("EMANUEL.OS - DEV WORKSTATION REPORT", 15, 18);
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(codigoFonte, 180);
    doc.text(linhas, 15, 40);
    doc.save(`DevStudio_Codigo_${linguagem}.pdf`);
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.96)', borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px', color: '#fff', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#00f0ff' }}>👨‍💻 Dev Workstation | Split Screen</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold' }}>✕ Fechar Split</button>
      </div>
      <textarea
        value={codigoFonte}
        onChange={(e) => setCodigoFonte(e.target.value)}
        style={{ width: '100%', flexGrow: 1, backgroundColor: '#010409', border: '1px solid #334155', borderRadius: '8px', color: '#38bdf8', padding: '12px', fontSize: '11px', outline: 'none', resize: 'none' }}
      />
      <GlassKeyboard3D onKeyPress={(tecla) => {
        if (tecla === 'Backspace') setCodigoFonte(prev => prev.slice(0, -1));
        else if (tecla === 'Space') setCodigoFonte(prev => prev + ' ');
        else if (tecla === 'Enter') setCodigoFonte(prev => prev + '\n');
        else if (tecla.length === 1) setCodigoFonte(prev => prev + tecla);
      }} />
      <div style={{ display: 'flex', gap: '6px' }}>
        <button onClick={() => navigator.clipboard.writeText(codigoFonte)} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>📋 Copiar</button>
        <button onClick={exportarCodigoPDF} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>📄 Exportar PDF</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🌟 --- COMPONENTE PRINCIPAL (INDEX) --- 🌟
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas');

  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);

  const [cmdLogs, setCmdLogs] = useState(["[ROBOTOC: LOG] System operational.", "[ROBOTOC: AGI] Conectado ao Gemini OS Core v5.1."]);
  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([{ autor: 'ROBOTOC (IA HUMANOIDE)', texto: 'Emanuel.OS Core v5.1 pronto.', tipo: 'sys' }]);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const avatarGroupRef = useRef(null);

  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Validando servidores...");

    setTimeout(() => {
      setValidandoServidores(false);
      if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
        setBloqueado(false);
      } else {
        setStatusAcessoTriplo("❌ Chave Incorreta!");
      }
    }, 1200);
  };

  // --- CENA THREE.JS (NOVO ROBOTOC 3D REFORMULADO) ---
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-5, 8, 5);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 5, 25);
    cyanLight.position.set(-3, 3, 3);
    scene.add(cyanLight);

    // --- MONTAGEM DO NOVO ROBÔ ROBOTOC 3D ---
    const robotGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8 });

    // Cabeça Futuro-HUD
    const headGeo = new THREE.BoxGeometry(0.8, 0.6, 0.6);
    const head = new THREE.Mesh(headGeo, metalMat);
    head.position.y = 1.8;
    robotGroup.add(head);

    // Visor Holográfico
    const visorGeo = new THREE.PlaneGeometry(0.7, 0.25);
    const visor = new THREE.Mesh(visorGeo, glowMat);
    visor.position.set(0, 1.8, 0.31);
    robotGroup.add(visor);

    // Torso Quântico
    const torsoGeo = new THREE.CylinderGeometry(0.5, 0.3, 1.2, 16);
    const torso = new THREE.Mesh(torsoGeo, metalMat);
    torso.position.y = 0.8;
    robotGroup.add(torso);

    // Núcleo de Energia (Core)
    const coreGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const core = new THREE.Mesh(coreGeo, glowMat);
    core.position.set(0, 0.9, 0.25);
    robotGroup.add(core);

    scene.add(robotGroup);
    avatarGroupRef.current = robotGroup;

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.1;
        avatarGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado]);

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <form onSubmit={processarAutenticacao3Camadas} style={{ backgroundColor: '#080f1e', border: '2px solid #00f0ff', borderRadius: '20px', padding: '30px', textAlign: 'center', width: '320px' }}>
          <h2 style={{ color: '#00f0ff', fontSize: '18px', margin: '0 0 10px 0' }}>🤖 EMANUEL.OS v5.1</h2>
          <p style={{ fontSize: '10px', color: '#94a3b8' }}>{statusAcessoTriplo}</p>
          <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Senha Mestre..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#000', color: '#fff', textAlign: 'center', margin: '15px 0', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Acessar Núcleo ➔</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden', display: 'flex' }}>
      <Head><title>Emanuel.OS Core v5.1 | Gemini & ROBOTOC HUD</title></Head>

      <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

        {/* BOTOES DE CONTROLE TOPO */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px' }}>
          <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ padding: '8px 12px', backgroundColor: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            🖥️ {modoDevSplit ? 'Fechar Split' : 'Dev Split'}
          </button>
          <button onClick={() => setAndroidHudOpen(true)} style={{ padding: '8px 12px', backgroundColor: 'rgba(0,240,255,0.2)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            ◀ Android HUD
          </button>
        </div>

        {/* CHAT / INTERAÇÃO IA */}
        <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '600px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(10px)', border: '1px solid #00f0ff', borderRadius: '20px', padding: '6px 12px', display: 'flex', gap: '6px' }}>
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com a IA e acione o ROBOTOC..." style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', flexGrow: 1, outline: 'none' }} />
            <button style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', padding: '6px 12px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
          </div>
        </div>
      </div>

      {/* PAINEL DEV SPLIT SCREEN */}
      {modoDevSplit && (
        <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
          <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
        </div>
      )}

      {/* GAVETA ANDROID HUD LATERAL */}
      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear />
        <button onClick={() => setModalCreatorStudioAberto(true)} style={{ padding: '10px', backgroundColor: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
          📊 Creator Studio IA
        </button>
      </AndroidHUDPanel>

      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
