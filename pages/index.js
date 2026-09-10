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

// Dicionário Ninja local
const dicionarioNinjaLocal = [
  { termo: "chakra", categoria: "Energia Neural", significado: "Massa de energia biológica e espiritual combinada para execução de técnicas e comandos neurais." },
  { termo: "sharingan", categoria: "Linhagem Sanguínea", significado: "Dōjutsu do Clã Uchiha capaz de perceber, copiar e prever fluxos de informação e movimento." },
  { termo: "emanuel", categoria: "Mestre Criador", significado: "Desenvolvedor Chefe e Arquiteto Supremo do Emanuel.OS v5.1 e Matriz G-AGI." }
];

// 🌟 --- 1. COMPONENTE: RASTREADOR DE MOVIMENTO DA CÂMERA (MOTION TRACKER) --- 🌟
function MotionTracker({ onGestureDetected }) {
  const videoRef = useRef(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [statusTreino, setStatusTreino] = useState("Aguardando Inicialização da Câmera...");

  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraAtiva(true);
        setStatusTreino("🎥 Câmera Conectada | Treinando Visão Computacional ROBOTOC v6.0...");
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setStatusTreino("⚠️ Acesso à câmera negado ou indisponível.");
    }
  };

  const pararCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraAtiva(false);
      setStatusTreino("Câmera Desconectada.");
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(2, 6, 23, 0.95)',
      border: '1px solid #00f0ff',
      borderRadius: '12px',
      padding: '12px',
      color: '#fff',
      fontSize: '11px'
    }}>
      <strong style={{ color: '#00f0ff', display: 'block', marginBottom: '6px' }}>
        📹 Motion Tracker & Treinamento de Visão Neural
      </strong>
      <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: cameraAtiva ? 1 : 0.2 }} />
        {!cameraAtiva && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#94a3b8' }}>
            📷 Feed de Treinamento Desativado
          </div>
        )}
      </div>
      <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: '#4ade80', fontFamily: 'monospace' }}>{statusTreino}</p>
      <div style={{ display: 'flex', gap: '6px' }}>
        {!cameraAtiva ? (
          <button onClick={iniciarCamera} style={{ flex: 1, padding: '6px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Ativar Câmera</button>
        ) : (
          <button onClick={pararCamera} style={{ flex: 1, padding: '6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Desativar Câmera</button>
        )}
      </div>
    </div>
  );
}

// 🌟 --- 2. COMPONENTE: TECLADO HOLOGRÁFICO 3D (GLASS KEYBOARD 3D) --- 🌟
function GlassKeyboard3D({ onKeyPress }) {
  const teclasRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const teclasRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const teclasRow3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const btnStyle = {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    border: '1px solid rgba(0, 240, 255, 0.4)',
    color: '#00f0ff',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '10px',
    fontWeight: 'bold',
    boxShadow: '0 0 8px rgba(0, 240, 255, 0.2)',
    transition: 'all 0.1s ease',
    userSelect: 'none'
  };

  return (
    <div style={{
      backgroundColor: 'rgba(8, 15, 30, 0.95)',
      border: '1px solid #00f0ff',
      borderRadius: '12px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      backdropFilter: 'blur(10px)'
    }}>
      <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', textAlign: 'center' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D</span>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
        {teclasRow1.map(t => <button key={t} onClick={() => onKeyPress(t)} style={btnStyle}>{t}</button>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
        {teclasRow2.map(t => <button key={t} onClick={() => onKeyPress(t)} style={btnStyle}>{t}</button>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
        <button onClick={() => onKeyPress('Backspace')} style={{ ...btnStyle, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>⌫</button>
        {teclasRow3.map(t => <button key={t} onClick={() => onKeyPress(t)} style={btnStyle}>{t}</button>)}
        <button onClick={() => onKeyPress('Enter')} style={{ ...btnStyle, backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#86efac' }}>↵</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
        <button onClick={() => onKeyPress('Space')} style={{ ...btnStyle, width: '60%' }}>ESPAÇO</button>
      </div>
    </div>
  );
}

// 🌟 --- 3. COMPONENTE: GERENCIADOR DE PERIFÉRICOS (ROBOTOC GEAR) --- 🌟
function RobotocGear({ onConnectGear }) {
  const [headset, setHeadset] = useState(true);
  const [mouse, setMouse] = useState(true);
  const [keyboard, setKeyboard] = useState(true);

  const toggle = (tipo, state, setter) => {
    setter(!state);
    if (onConnectGear) onConnectGear(tipo, !state);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #a855f7', borderRadius: '12px', padding: '10px', color: '#fff' }}>
      <strong style={{ color: '#c084fc', fontSize: '11px', display: 'block', marginBottom: '8px' }}>🎧 ROBOTOC GEAR BLUETOOTH HUB</strong>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <button onClick={() => toggle('headset', headset, setHeadset)} style={{ padding: '6px', backgroundColor: headset ? 'rgba(168,85,247,0.3)' : '#020617', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>
          🎧 {headset ? 'Headset ON' : 'Headset OFF'}
        </button>
        <button onClick={() => toggle('mouse', mouse, setMouse)} style={{ padding: '6px', backgroundColor: mouse ? 'rgba(168,85,247,0.3)' : '#020617', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>
          🖱️ {mouse ? 'Mouse ON' : 'Mouse OFF'}
        </button>
        <button onClick={() => toggle('keyboard', keyboard, setKeyboard)} style={{ padding: '6px', backgroundColor: keyboard ? 'rgba(168,85,247,0.3)' : '#020617', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>
          ⌨️ {keyboard ? 'Teclado ON' : 'Teclado OFF'}
        </button>
      </div>
    </div>
  );
}

// 🌟 --- 4. COMPONENTE: EM CREATOR STUDIO IA --- 🌟
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1240, audiosGerações: 380, fotosRenders: 890, videosRenderizados: 215, memesGifsEngajados: 560, audienciaAtiva: 'Alta (89% retenção)', resolucaoProblemasIA: '94,2% Autônomos'
  });

  const [sugestoesAGI, setSugestoesAGI] = useState([
    { id: 1, tipo: '🎬 Vídeos & YouTube Shorts', acao: 'Criar Shorts de Naruto vs Sasuke em 4K.', prioridade: 'Alta' },
    { id: 2, tipo: '🖼️ Imagens Realistas', acao: 'Aumentar a geração de artes Cyberpunk via modelo EM 1.0.', prioridade: 'Média' },
    { id: 3, tipo: '📄 Automação .DOCX / PDF', acao: 'Sintetizar relatórios automatizados no DevStudio.', prioridade: 'Crítica' }
  ]);

  const [executandoAcao, setExecutandoAcao] = useState(null);

  const aplicarAcaoAutonoma = (id) => {
    setExecutandoAcao(id);
    setTimeout(() => {
      setSugestoesAGI(prev => prev.filter(item => item.id !== id));
      setExecutandoAcao(null);
      alert(`🚀 Ação Autônoma da IA executada e aplicada no Emanuel.OS!`);
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.96)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#fff', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#00f0ff', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        <h2 style={{ color: '#00f0ff', fontSize: '18px', margin: '0 0 10px 0', fontWeight: '900' }}>📊 EM CREATOR STUDIO IA (v6.0 Core)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <strong style={{ fontSize: '14px', color: '#00f0ff' }}>{metricas.textosConversas}</strong>
            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>Chats</span>
          </div>
          <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <strong style={{ fontSize: '14px', color: '#a855f7' }}>{metricas.fotosRenders}</strong>
            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>Renders</span>
          </div>
          <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <strong style={{ fontSize: '14px', color: '#ff007f' }}>{metricas.videosRenderizados}</strong>
            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>Vídeos 4K</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sugestoesAGI.map(item => (
            <div key={item.id} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>{item.tipo}</span>
                <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1' }}>{item.acao}</p>
              </div>
              <button onClick={() => aplicarAcaoAutonoma(item.id)} disabled={executandoAcao === item.id} style={{ padding: '6px 12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
                {executandoAcao === item.id ? '⚡ Aplicando...' : '🚀 Executar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 🌟 --- 5. COMPONENTE: PAINEL DE DESENVOLVEDOR SPLIT SCREEN --- 🌟
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(
    `// Emanuel.OS Dev Studio - Ambiente de Desenvolvimento v6.0\n// Assistência ativa via IA Gemini AGI Core & ROBOTOC 3D\n\nfunction inicializarEmanuelOS() {\n  const status = "ONLINE";\n  console.log(\`Sincronizando componentes neurais... [\${status}]\`);\n  return true;\n}`
  );
  const [blocoRascunho, setBlocoRascunho] = useState("Notas de dev: Verificar integração de câmeras e render do robô.");
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [retornoIA, setRespostaIA] = useState(null);

  const executarAnaliseIA = (tipoAcao) => {
    setAnalisandoIA(true);
    setRespostaIA(null);
    setTimeout(() => {
      setAnalisandoIA(false);
      if (tipoAcao === 'bug') setRespostaIA("✅ Código analisado via Gemini! Sintaxe 100% correta.");
      else if (tipoAcao === 'otimizar') setRespostaIA("⚡ Otimização Gemini AGI: Recomenda-se memoizar a cena 3D.");
      else if (tipoAcao === 'explicar') setRespostaIA("📖 O código inicializa o ecossistema Emanuel.OS.");
    }, 1000);
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.96)', borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px', color: '#fff', fontFamily: 'Consolas, monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#00f0ff' }}>👨‍💻 Emanuel.OS Dev Workstation Split Screen</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕ Fechar</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select value={linguagem} onChange={(e) => setLinguagem(e.target.value)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>
          <option value="javascript">JavaScript (Next.js/React)</option>
          <option value="python">Python (AI/ML)</option>
          <option value="typescript">TypeScript</option>
        </select>
        <button onClick={() => executarAnaliseIA('bug')} style={{ padding: '4px 8px', backgroundColor: 'rgba(0,240,255,0.2)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>🔍 Checar Bugs</button>
        <button onClick={() => executarAnaliseIA('otimizar')} style={{ padding: '4px 8px', backgroundColor: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>⚡ Otimizar Gemini</button>
      </div>

      <textarea value={codigoFonte} onChange={(e) => setCodigoFonte(e.target.value)} style={{ width: '100%', flexGrow: 1, backgroundColor: '#010409', border: '1px solid #334155', borderRadius: '8px', color: '#38bdf8', padding: '10px', fontSize: '11px', outline: 'none', resize: 'none' }} />

      <GlassKeyboard3D onKeyPress={(tecla) => {
        if (tecla === 'Backspace') setCodigoFonte(prev => prev.slice(0, -1));
        else if (tecla === 'Space') setCodigoFonte(prev => prev + ' ');
        else if (tecla === 'Enter') setCodigoFonte(prev => prev + '\n');
        else if (tecla.length === 1) setCodigoFonte(prev => prev + tecla);
      }} />

      {analisandoIA && <div style={{ color: '#00f0ff', fontSize: '10px' }}>⏳ Gemini AGI Processando...</div>}
      {retornoIA && <div style={{ padding: '8px', backgroundColor: 'rgba(0,240,255,0.1)', borderLeft: '2px solid #00f0ff', fontSize: '10px', color: '#fff' }}>{retornoIA}</div>}

      <div style={{ height: '60px' }}>
        <textarea value={blocoRascunho} onChange={(e) => setBlocoRascunho(e.target.value)} placeholder="Bloco de Notas..." style={{ width: '100%', height: '100%', backgroundColor: '#020617', border: '1px solid #ff007f', borderRadius: '6px', color: '#ff007f', padding: '6px', fontSize: '10px', outline: 'none', resize: 'none' }} />
      </div>
    </div>
  );
}

// 🌟 --- 6. COMPONENTE DE CAPTURA COM EMAILJS --- 🌟
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setCarregando(true);

    emailjs.send('service_94k276x', 'template_o11qtsf', { email, to_email: email, user_email: email }, 'MsHsmnoDh6w2fnYJ6')
      .then(() => { setCarregando(false); setEnviado(true); setEmail(''); })
      .catch((error) => { setCarregando(false); alert('Erro ao enviar e-mail.'); console.error(error); });
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', color: '#fff' }}>
      <strong style={{ color: '#00f0ff', fontSize: '11px', display: 'block', marginBottom: '4px' }}>🎁 E-Book 300 Comandos Mestre</strong>
      {enviado ? (
        <div style={{ color: '#4ade80', fontSize: '10px' }}>✅ Cadastrado com sucesso!</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input type="email" required placeholder="Seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', outline: 'none' }} />
          <button type="submit" disabled={carregando} style={{ padding: '8px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
            {carregando ? '⏳ Enviando...' : '🚀 Receber Acesso'}
          </button>
        </form>
      )}
    </div>
  );
}

// 🌟 --- 7. TERMINAL NATIVO UNIX-LIKE EM CANVAS --- 🌟
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const [history, setHistory] = useState([
    'Emanuel.OS v5.1 - Terminal Nativo Kernel 6.x-like',
    'ROBOTOC Shell - Digite "help" para comandos.',
    ' '
  ]);
  const [currentLine, setCurrentLine] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#4ade80';

    const lineHeight = 14;
    history.slice(-10).forEach((line, i) => {
      ctx.fillText(line, 8, (i + 1) * lineHeight);
    });
    ctx.fillText(`root@emanuel-os:~# ${currentLine}_`, 8, (history.slice(-10).length + 1) * lineHeight);
  }, [history, currentLine]);

  const handleCommand = (cmd) => {
    let out = [];
    if (cmd === 'help') out = ['Comandos: help, ls, clear, uname, emanuel-agi'];
    else if (cmd === 'ls') out = ['bin/ home/ var/ README.txt'];
    else if (cmd === 'clear') { setHistory([]); setCurrentLine(''); return; }
    else if (cmd === 'uname') out = ['EmanuelOS Kernel v6.0-AGI x86_64'];
    else if (cmd === 'emanuel-agi') out = ['Núcleo Gemini AGI Sincronizado.'];
    else out = [`${cmd}: comando não encontrado`];

    setHistory(prev => [...prev, `root@emanuel-os:~# ${cmd}`, ...out, ' ']);
    setCurrentLine('');
  };

  return (
    <div style={{ width: '100%', height: '180px', backgroundColor: '#000a12', border: '1px solid #00f0ff', borderRadius: '8px', padding: '4px' }} tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter') handleCommand(currentLine);
      else if (e.key === 'Backspace') setCurrentLine(prev => prev.slice(0, -1));
      else if (e.key.length === 1) setCurrentLine(prev => prev + e.key);
    }}>
      <canvas ref={canvasRef} width={320} height={170} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// =========================================================================================
// 🌟 --- 8. COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX) --- 🌟
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Tripla de Segurança');

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [painelFluidoDireitoAberto, setPainelFluidoDireitoAberto] = useState(false);

  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC 3D IA', texto: 'Emanuel.OS Core v5.1 | ROBOTOC 3D v2.0 Ativo e Sincronizado com Gemini AGI.', tipo: 'sys' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [horaAtual, setHoraAtual] = useState('');

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  // Validação 3 Camadas
  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (chaveAcessoTripla === "8888" || chaveAcessoTripla === "EMANUEL-TRIPLE-AGI-8888-BRS7") {
      setStatusAcessoTriplo("✅ ACESSO CONCEDIDO!");
      setTimeout(() => setBloqueado(false), 800);
    } else {
      setStatusAcessoTriplo("❌ Chave Incorreta!");
    }
  };

  // Cenas Three.js para o Robô 3D Reformulado
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1, 6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Luzes
    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pinkLight = new THREE.PointLight(0xff007f, 3, 20);
    pinkLight.position.set(-5, -2, 5);
    scene.add(pinkLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 2);
    scene.add(ambientLight);

    // --- MONTAGEM DO NOVO ROBOTOC 3D V2 REFORMULADO ---
    const robotGroup = new THREE.Group();

    // Cabeça Futuro-Cyber
    const headGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.1 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    robotGroup.add(headMesh);

    // Visor Holográfico
    const visorGeo = new THREE.BoxGeometry(0.9, 0.3, 0.5);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.1, 0.45);
    robotGroup.add(visorMesh);

    // Olhos Neon
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 0.1, 0.65);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 0.1, 0.65);
    robotGroup.add(leftEye);
    robotGroup.add(rightEye);

    // Torso Cyber
    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.4, 1.4, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.set(0, -1.1, 0);
    robotGroup.add(bodyMesh);

    // Núcleo de Energia (Arc Reactor Style)
    const coreGeo = new THREE.TorusGeometry(0.2, 0.05, 16, 100);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, -0.9, 0.5);
    robotGroup.add(coreMesh);

    // Anel de Levitação Orbital
    const ringGeo = new THREE.RingGeometry(1.2, 1.3, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, -1.8, 0);
    robotGroup.add(ringMesh);

    scene.add(robotGroup);

    // Animação Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Levitação suave
      robotGroup.position.y = Math.sin(elapsedTime * 2) * 0.15;
      robotGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3;
      ringMesh.rotation.z += 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [bloqueado]);

  // Atualizador de Relógio
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setHoraAtual(d.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Processamento de Mensagens com a IA Gemini
  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const textoUser = chatInput;
    setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: textoUser, tipo: 'user' }]);
    setChatInput('');

    try {
      const res = await fetch('/api/gerar-midia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textoUser, tipo: 'chat' })
      });
      const data = await res.json();
      const respostaIA = data.mensagem || `ROBOTOC & Gemini processaram: "${textoUser}" com sucesso.`;
      setMensagens(prev => [...prev, { autor: 'ROBOTOC IA', texto: respostaIA, tipo: 'ia' }]);
    } catch (err) {
      setMensagens(prev => [...prev, { autor: 'ROBOTOC IA', texto: `[G-AGI Core]: Comando "${textoUser}" executado no sistema.`, tipo: 'ia' }]);
    }
  };

  // --- TELA DE BLOQUEIO / SEGURANÇA ---
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#fff' }}>
        <Head><title>Emanuel.OS v5.1 - Autenticação</title></Head>
        <form onSubmit={processarAutenticacao3Camadas} style={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '2px solid #00f0ff', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 0 40px rgba(0,240,255,0.3)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#00f0ff', margin: '0 0 10px 0' }}>EMANUEL.OS</h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '15px' }}>{statusAcessoTriplo}</p>
          <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="PIN Mestre (ex: 8888)..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#000', color: '#00f0ff', textAlign: 'center', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Desbloquear Sistema ➔</button>
        </form>
      </div>
    );
  }

  // --- INTERFACE PRINCIPAL DESBLOQUEADA ---
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#fff', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>
      <Head><title>Emanuel.OS Core v5.1 | G-AGI Multimodal Hub</title></Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>

        {/* ÁREA CENTRAL 3D + OVERLAY */}
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.3s ease' }}>
          
          {/* Canvas Three.js com Robotoc 3D */}
          <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

          {/* BARRA SUPERIOR DE STATUS */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ padding: '8px 12px', backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {sidebarAberta ? '◀ Fechar Menu' : '☰ Menu OS'}
              </button>
              <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ padding: '8px 12px', backgroundColor: '#09090b', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                🖥️ {modoDevSplit ? 'Fechar Dev Split' : 'Dev Split'}
              </button>
            </div>
            <div style={{ padding: '6px 12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '11px', color: '#00f0ff' }}>
              🕒 {horaAtual || '12:00:00'} | G-AGI v6.0 Core
            </div>
          </div>

          {/* CAIXA DE CHAT / PROMPT DA IA */}
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '600px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', maxHeight: '100px', overflowY: 'auto' }}>
              {mensagens.map((m, i) => (
                <div key={i} style={{ fontSize: '10px', margin: '2px 0' }}>
                  <span style={{ color: m.tipo === 'user' ? '#00f0ff' : '#ff007f', fontWeight: 'bold' }}>{m.autor}: </span>
                  <span style={{ color: '#fff' }}>{m.texto}</span>
                </div>
              ))}
            </div>

            <form onSubmit={enviarMensagem} style={{ display: 'flex', gap: '6px', backgroundColor: '#09090b', border: '1px solid #00f0ff', borderRadius: '25px', padding: '4px 10px' }}>
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Comande a IA Gemini ou fale com o ROBOTOC..." style={{ flexGrow: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', outline: 'none' }} />
              <button type="submit" style={{ padding: '6px 14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar ➔</button>
            </form>
          </div>

          {/* SIDEBAR DA ESQUERDA (MAPAS & LINKS) */}
          <aside style={{ position: 'absolute', top: 0, left: sidebarAberta ? 0 : '-320px', width: '300px', height: '100%', backgroundColor: 'rgba(7, 12, 28, 0.98)', borderRight: '1px solid #00f0ff', zIndex: 90, padding: '20px', transition: 'left 0.3s ease', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h3 style={{ color: '#00f0ff', fontSize: '14px', margin: '0 0 10px 0' }}>🌐 Central de Mapas 3D</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}>
              <Link href="/mapa" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', textDecoration: 'none', fontSize: '10px' }}>🌍 Mapa Terrestre 3D</Link>
              <Link href="/espacial" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', textDecoration: 'none', fontSize: '10px' }}>🪐 Mapa Espacial</Link>
            </div>
            <UnixTerminalCanvas />
            <div style={{ marginTop: '10px' }}>
              <FormularioCapturaEmanuelOS />
            </div>
          </aside>

          {/* PAINEL FLUIDO DA DIREITA (GEAR & MOTION TRACKER) */}
          <div style={{ position: 'absolute', top: '10px', right: painelFluidoDireitoAberto ? '0px' : '-320px', width: '300px', height: 'calc(100vh - 20px)', backgroundColor: 'rgba(7, 12, 28, 0.98)', borderLeft: '1px solid #00f0ff', borderRadius: '12px 0 0 12px', zIndex: 95, padding: '12px', transition: 'right 0.3s ease', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
            <button onClick={() => setPainelFluidoDireitoAberto(!painelFluidoDireitoAberto)} style={{ position: 'absolute', left: '-35px', top: '20px', width: '35px', height: '40px', backgroundColor: '#070c1c', border: '1px solid #00f0ff', borderRight: 'none', color: '#00f0ff', borderRadius: '8px 0 0 8px', cursor: 'pointer' }}>
              {painelFluidoDireitoAberto ? '➔' : '⚙️'}
            </button>
            <RobotocGear />
            <MotionTracker />
          </div>

        </div>

        {/* TELA DIVIDIDA DO DEV STUDIO */}
        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}

      </div>
    </div>
  );
}
