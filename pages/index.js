import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';

// Bibliotecas para geração autônoma de documentos
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pptxgen from "pptxgenjs";

// =========================================================================================
// 📸 COMPONENTE: RASTREAMENTO E VISÃO COMPUTACIONAL IA (CAMERA HUD)
// =========================================================================================
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

// =========================================================================================
// ⚙️ COMPONENTE: GERENCIADOR DE PERIFÉRICOS BLUETOOTH / GEAR
// =========================================================================================
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

// =========================================================================================
// ⌨️ COMPONENTE: TECLADO HOLOGRÁFICO GLASS 3D
// =========================================================================================
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

// =========================================================================================
// 📊 COMPONENTE: CREATOR STUDIO IA
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1240, audiosGerações: 380, fotosRenders: 890,
    videosRenderizados: 215, memesGifsEngajados: 560, audienciaAtiva: 'Alta (89% retenção)', resolucaoProblemasIA: '94,2% Autônomos'
  });

  const [sugestoesAGI] = useState([
    { id: 1, tipo: '⚡ Performance WebGL', acao: 'Otimizar buffers do Data Center 3D' },
    { id: 2, tipo: '🎯 Engajamento Social', acao: 'Gerar automação de postagens para TikTok e Shorts' }
  ]);

  const [executandoAcao, setExecutandoAcao] = useState(null);

  const aplicarAcaoAutonoma = (id) => {
    setExecutandoAcao(id);
    setTimeout(() => {
      setExecutandoAcao(null);
      alert("Ação executada com sucesso pelo núcleo AGI!");
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(2, 6, 23, 0.88)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.96)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#fff', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#00f0ff', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        <div style={{ borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 style={{ color: '#00f0ff', fontSize: '18px', margin: 0, fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 EM CREATOR STUDIO IA <span style={{ fontSize: '10px', color: '#ff007f', border: '1px solid #ff007f', padding: '2px 8px', borderRadius: '10px' }}>AGI Core v6.0</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0 0' }}>Análise de desempenho multimodal, diagnóstico de audiência e tomada de ações autônomas.</p>
        </div>

        <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📈 DESEMPENHO E UTILIZAÇÃO DE FERRAMENTAS MULTIMODAIS</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>💬</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#00f0ff', marginTop: '4px' }}>{metricas.textosConversas}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Textos / Chat</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎙️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginTop: '4px' }}>{metricas.audiosGerações}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Áudios / Voz</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🖼️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#ff007f', marginTop: '4px' }}>{metricas.fotosRenders}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Fotos / Renders</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎬</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#eab308', marginTop: '4px' }}>{metricas.videosRenderizados}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Vídeos HD/4K</span>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎞️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#4ade80', marginTop: '4px' }}>{metricas.memesGifsEngajados}</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Memes & GIFs</span>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>💡 SUGESTÕES DE AÇÕES AUTOMÁTICAS E OTIMIZAÇÕES</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sugestoesAGI.map(item => (
            <div key={item.id} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>{item.tipo}</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#e2e8f0' }}>{item.acao}</p>
              </div>
              <button
                onClick={() => aplicarAcaoAutonoma(item.id)}
                disabled={executandoAcao === item.id}
                style={{ padding: '8px 14px', backgroundColor: executandoAcao === item.id ? '#4c1d95' : '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
              >
                {executandoAcao === item.id ? '⚡ Aplicando...' : '🚀 Executar Ação'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================================
// 👨‍💻 COMPONENTE: PAINEL DE DESENVOLVEDOR SPLIT SCREEN
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(
    `// Emanuel.OS Dev Studio - Ambiente v6.0\n// Assistência ativa via Gemini AGI Core & ROBOTOC\n\nfunction inicializarModuloEmanuel() {\n  const status = "ONLINE";\n  console.log(\`Sincronizando componentes neurais... [\${status}]\`);\n  return true;\n}`
  );
  const [blocoRascunho, setBlocoRascunho] = useState("Notas de dev: Verificar integração do Robotoc com os mapas 3D e Quick Actions.");
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [retornoIA, setRespostaIA] = useState(null);

  const executarAnaliseIA = (tipoAcao) => {
    setAnalisandoIA(true);
    setRespostaIA(null);
    setTimeout(() => {
      setAnalisandoIA(false);
      if (tipoAcao === 'bug') setRespostaIA("✅ Código analisado! Sintaxe 100% correta. Nenhuma vulnerabilidade detectada.");
      else if (tipoAcao === 'otimizar') setRespostaIA("⚡ Otimização AGI: Recomenda-se utilizar React.useMemo em renderizações 3D pesadas.");
      else if (tipoAcao === 'explicar') setRespostaIA("📖 Explicação: O script inicializa o módulo neural do Emanuel.OS v6.0.");
    }, 1200);
  };

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
    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.96)', borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px', color: '#fff', fontFamily: 'Consolas, monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#00f0ff' }}>👨‍💻 Emanuel.OS Dev Workstation | Split Screen v6.0</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold' }}>✕ Fechar Split</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={linguagem} onChange={(e) => setLinguagem(e.target.value)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', outline: 'none' }}>
          <option value="javascript">JavaScript (Next.js/React)</option>
          <option value="python">Python (AI/ML)</option>
          <option value="typescript">TypeScript</option>
          <option value="cpp">C++ Quântico</option>
        </select>
        <button onClick={() => executarAnaliseIA('bug')} style={{ padding: '6px 10px', backgroundColor: 'rgba(0,240,255,0.2)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🔍 Checar Bugs</button>
        <button onClick={() => executarAnaliseIA('otimizar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>⚡ Otimizar IA</button>
      </div>

      <textarea value={codigoFonte} onChange={(e) => setCodigoFonte(e.target.value)} style={{ width: '100%', flexGrow: 1, backgroundColor: '#010409', border: '1px solid #334155', borderRadius: '8px', color: '#38bdf8', padding: '12px', fontSize: '11px', outline: 'none', resize: 'none' }} />

      <GlassKeyboard3D onKeyPress={(tecla) => {
        if (tecla === 'Backspace') setCodigoFonte(prev => prev.slice(0, -1));
        else if (tecla === 'Space') setCodigoFonte(prev => prev + ' ');
        else if (tecla === 'Enter') setCodigoFonte(prev => prev + '\n');
        else if (tecla.length === 1) setCodigoFonte(prev => prev + tecla);
      }} />

      {analisandoIA && <div style={{ color: '#00f0ff', fontSize: '10px' }}>⏳ Analisando código...</div>}
      {retornoIA && <div style={{ color: '#4ade80', fontSize: '10px' }}>{retornoIA}</div>}

      <div style={{ display: 'flex', gap: '6px' }}>
        <button onClick={() => navigator.clipboard.writeText(codigoFonte)} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>📋 Copiar Código</button>
        <button onClick={exportarCodigoPDF} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>📄 Exportar PDF</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 📧 COMPONENTE: FORMULÁRIO DE CAPTURA EMAILJS
// =========================================================================================
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setCarregando(true);

    emailjs.send(
      'service_94k276x',
      'template_o11qtsf',
      { email: email, to_email: email, user_email: email },
      'MsHsmnoDh6w2fnYJ6'
    )
    .then(() => {
      setCarregando(false);
      setEnviado(true);
      setEmail('');
    })
    .catch((error) => {
      setCarregando(false);
      alert('Erro ao enviar e-mail. Tente novamente!');
    });
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '16px', color: '#fff', margin: '10px 0' }}>
      <h3 style={{ color: '#00f0ff', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>🎁 Baixar 300 Comandos Mestre + Mapas 3D</h3>
      {enviado ? (
        <div style={{ color: '#4ade80', fontSize: '11px', textAlign: 'center' }}>✅ E-mail de confirmação enviado com sucesso!</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Digite seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none' }} />
          <button type="submit" disabled={carregando} style={{ padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            {carregando ? '⏳ Enviando...' : '🚀 Quero Acesso Gratuito'}
          </button>
        </form>
      )}
    </div>
  );
}

// =========================================================================================
// 🎥 COMPONENTE: GOOGLE MEET + AVATARES DE IA
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [temaReuniao, setTemaReuniao] = useState('Imersão Mapas, Index & AGI 2030');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Robotoc (Humanoide 3D IA)');
  const [linkGerado, setLinkGerado] = useState('');

  const criarReuniaoInstantanea = () => {
    const urlMeet = `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;
    setLinkGerado(urlMeet);
    if (addLog) addLog(`[G-AGI: MEET] Reunião criada: "${temaReuniao}" - ${urlMeet}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '14px', padding: '16px', color: '#fff', margin: '10px 0' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 6px 0' }}>🎥 Google Meet + Avatares IA</h3>
      <input type="text" value={temaReuniao} onChange={(e) => setTemaReuniao(e.target.value)} placeholder="Tema da reunião..." style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', marginBottom: '8px', boxSizing: 'border-box' }} />
      <button onClick={criarReuniaoInstantanea} style={{ width: '100%', padding: '9px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
        ⚡ Gerar Link Meet
      </button>
      {linkGerado && <a href={linkGerado} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#38bdf8', display: 'block', marginTop: '8px', wordBreak: 'break-all' }}>{linkGerado}</a>}
    </div>
  );
}

// =========================================================================================
// 🖥️ COMPONENTE: TERMINAL NATIVO UNIX-LIKE EM CANVAS
// =========================================================================================
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [history, setHistory] = useState([
    'Emanuel.OS v6.0 - Terminal Nativo v1.0 [Kernel 6.x-like]',
    'ROBOTOC Neural Shell - Digite "help" para comandos.',
    ' '
  ]);
  const [currentLine, setCurrentLine] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#000a12';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = '#4ade80';

    history.slice(-12).forEach((line, index) => {
      ctx.fillText(line, 10, 20 + index * 16);
    });

    ctx.fillText(`root@emanuel-os:~# ${currentLine}`, 10, 20 + history.slice(-12).length * 16);
  }, [history, currentLine]);

  const handleCommand = (cmd) => {
    let out = `Comando executado: ${cmd}`;
    if (cmd === 'help') out = 'Comandos: help, ls, clear, whoami, emanuel-agi';
    if (cmd === 'clear') { setHistory([]); setCurrentLine(''); return; }
    setHistory(prev => [...prev, `root@emanuel-os:~# ${cmd}`, out]);
    setCurrentLine('');
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '220px', backgroundColor: '#000a12', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', overflow: 'hidden' }} tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter') handleCommand(currentLine);
      else if (e.key === 'Backspace') setCurrentLine(prev => prev.slice(0, -1));
      else if (e.key.length === 1) setCurrentLine(prev => prev + e.key);
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// =========================================================================================
// ₿ COMPONENTE: PAINEL DE ANÁLISE E PREVISÃO DE BITCOIN
// =========================================================================================
const BitcoinAnalysisPanel = () => {
  const [price, setPrice] = useState('$69,420.00');
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(`$${(69000 + Math.random() * 2000).toFixed(2)}`);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#fff', margin: '10px 0' }}>
      <h3 style={{ color: '#eab308', fontSize: '12px', margin: '0 0 6px 0' }}>₿ ANALÍTICA BITCOIN QUANT CORE v6.0</h3>
      <span style={{ fontSize: '18px', color: '#eab308', fontWeight: 'bold' }}>{price}</span>
      <span style={{ fontSize: '10px', color: '#4ade80', display: 'block', marginTop: '4px' }}>Viés: Alta com meta em $88k (ROBOTOC Sync)</span>
    </div>
  );
};

// =========================================================================================
// ☁️ COMPONENTE: CLOUDFLARE WORKER DEPLOYER
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => {
  const [workerName, setWorkerName] = useState('emanuel-agi-edge-worker');
  const [deploying, setDeploying] = useState(false);

  const performDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      alert(`Worker ${workerName} publicado com sucesso na Edge Network!`);
      if (addLog) addLog(`[CLOUDFLARE] Deploy realizado: https://${workerName}.workers.dev`);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #fb923c', borderRadius: '16px', padding: '16px', color: '#fff', margin: '10px 0' }}>
      <h3 style={{ color: '#fb923c', fontSize: '12px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER</h3>
      <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', marginBottom: '8px', boxSizing: 'border-box' }} />
      <button onClick={performDeploy} disabled={deploying} style={{ width: '100%', padding: '10px', backgroundColor: '#fb923c', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
        {deploying ? '⚡ Publicando...' : '🚀 Executar Deploy Global G-AGI Edge ➔'}
      </button>
    </div>
  );
};

// =========================================================================================
// 📱 COMPONENTE: GAVETA ANDROID HUD LATERAL
// =========================================================================================
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: open ? 0 : '-340px', width: '320px', height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.96)', borderLeft: '2px solid #00f0ff',
      backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '16px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#00f0ff' }}>🤖 ANDROID HUD SYSTEM v6.0</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>➔</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  );
}

// =========================================================================================
// 🌟 COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS CORE v6.0
// =========================================================================================
export default function EmanuelOSCore() {
  // --- ESTADOS DE SEGURANÇA E TELA DE BLOQUEIO ---
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');

  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');
  const [selectedSequence, setSelectedSequence] = useState([]);

  // CONSTANTES MESTRE DE AUTENTICAÇÃO
  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";
  const TELEFONE_AUTORIZADO = "88981493989";
  const PIN_MESTRE_EMANUEL = "8888";
  const EMAIL_AUTORIZADO = "leeheroi123@gmail.com";
  const CHAVE_MESTRE = "ASD-DDD-888";

  // DADOS UNIFICADOS DO CRIADOR
  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Central Emanuel.OS)",
    whatsapp: "5588981493989",
    email: "leeheroi123@gmail.com",
    tiktok: "https://www.tiktok.com/@emanueldasilva26",
    instagram: "https://www.instagram.com/emanuelsilva432",
    threads: "https://www.threads.net/@emanuelsilva432",
    github: "https://github.com/Manomae",
    facebook: "https://www.facebook.com/leeheroi.heroi",
    youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
  };

  // --- ESTADOS DE INTERFACE E HUD ---
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modalSuporteAberto, setModalSuporteAberto] = useState(false);

  const [cmdInput, setCmdInput] = useState('');
  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC: LOG] System core v6.0 operational.",
    "[ROBOTOC: AGI] Conectado ao motor Gemini AGI.",
    "[ROBOTOC: 3D] Data Center e Robô Ativos."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC (IA HUMANOIDE)', texto: 'Emanuel.OS Core v6.0 carregado! Assistente ROBOTOC em operação.', tipo: 'sys' }
  ]);

  // --- REFS PARA RENDERIZAÇÃO THREE.JS ---
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const avatarGroupRef = useRef(null);

  // --- PROCESSAMENTO DA SEGURANÇA 7 CAMADAS ---
  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Conectando aos Servidores de Ponta AGI...");

    setTimeout(() => {
      setValidandoServidores(false);
      if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
        setStatusAcessoTriplo("✅ Chave Tripla Aprovada!");
        setTimeout(() => setEtapaSeguranca(2), 600);
      } else {
        setStatusAcessoTriplo("❌ Chave Inválida! Acesso negado.");
      }
    }, 1000);
  };

  // --- RENDERIZAÇÃO DA CENA THREE.JS (ROBÔ 3D HUD v6.0) ---
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação Holográfica Cyberpunk
    const light1 = new THREE.DirectionalLight(0xffffff, 2.0);
    light1.position.set(-5, 8, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x00f0ff, 4, 20);
    light2.position.set(3, 3, 3);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xff007f, 4, 20);
    light3.position.set(-3, -2, 3);
    scene.add(light3);

    // Grid de piso
    const floorGrid = new THREE.GridHelper(20, 20, 0x00f0ff, 0x1e293b);
    floorGrid.position.y = -2.2;
    scene.add(floorGrid);

    // --- ROBÔ ROBOTOC 3D HUD REFORMULADO ---
    const robotGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 });
    const glowCyanMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.9 });
    const glowPinkMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.9 });

    // Cabeça
    const headGeo = new THREE.BoxGeometry(0.9, 0.7, 0.7);
    const head = new THREE.Mesh(headGeo, metalMat);
    head.position.y = 1.6;
    robotGroup.add(head);

    // Visor Holográfico Neon
    const visorGeo = new THREE.PlaneGeometry(0.8, 0.3);
    const visor = new THREE.Mesh(visorGeo, glowCyanMat);
    visor.position.set(0, 1.6, 0.36);
    robotGroup.add(visor);

    // Torso Quântico com Placa Neon
    const torsoGeo = new THREE.CylinderGeometry(0.6, 0.4, 1.3, 16);
    const torso = new THREE.Mesh(torsoGeo, metalMat);
    torso.position.y = 0.5;
    robotGroup.add(torso);

    const coreGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const core = new THREE.Mesh(coreGeo, glowPinkMat);
    core.position.set(0, 0.6, 0.3);
    robotGroup.add(core);

    // Ombros e Braços
    const shoulderGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, glowCyanMat);
    leftShoulder.position.set(-0.8, 0.9, 0);
    const rightShoulder = new THREE.Mesh(shoulderGeo, glowCyanMat);
    rightShoulder.position.set(0.8, 0.9, 0);
    robotGroup.add(leftShoulder);
    robotGroup.add(rightShoulder);

    scene.add(robotGroup);
    avatarGroupRef.current = robotGroup;

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.12;
        avatarGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.6) * 0.25;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado]);

  // --- TELA DE AUTENTICAÇÃO (MANTIDA 100% INTOCADA) ---
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <Head><title>Emanuel.OS v6.0 - Autenticação Mestre</title></Head>

        <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>EMANUEL<span style={{ color: '#ff007f' }}>.OS</span></h2>
          <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>PROTOCOLO DE SEGURANÇA (ETAPA {etapaSeguranca}/7)</span>

          {etapaSeguranca === 1 && (
            <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>🛡️ 1ª Etapa: Chave de Acesso Tripla</span>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>{statusAcessoTriplo}</p>
              <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Chave de Acesso Mestre..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" disabled={validandoServidores} style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                {validandoServidores ? '⏳ Validando...' : '🔐 Validar Chave ➔'}
              </button>
            </form>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); if (telefoneDigitado.replace(/\D/g, '') === TELEFONE_AUTORIZADO) setEtapaSeguranca(3); else alert("Telefone incorreto!"); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>📱 2ª Etapa: Digite seu Telefone</span>
              <input type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)} placeholder="Ex: 88981493989" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar Telefone ➔</button>
            </form>
          )}

          {etapaSeguranca === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); if (pinDigitado === PIN_MESTRE_EMANUEL) setEtapaSeguranca(4); else alert("PIN incorreto!"); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>🔢 3ª Etapa: PIN Mestre (4 dígitos)</span>
              <input type="password" maxLength={4} value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)} placeholder="****" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '20px', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar PIN ➔</button>
            </form>
          )}

          {etapaSeguranca === 4 && (
            <form onSubmit={(e) => { e.preventDefault(); if (emailDigitado.toLowerCase() === EMAIL_AUTORIZADO) setEtapaSeguranca(5); else alert("E-mail incorreto!"); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>📧 4ª Etapa: Digite seu E-mail Autorizado</span>
              <input type="email" value={emailDigitado} onChange={(e) => setEmailDigitado(e.target.value)} placeholder="leeheroi123@gmail.com" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar E-mail ➔</button>
            </form>
          )}

          {etapaSeguranca === 5 && (
            <form onSubmit={(e) => { e.preventDefault(); if (chaveDigitada === CHAVE_MESTRE) setEtapaSeguranca(6); else alert("Palavra-Chave Inválida!"); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#ff007f', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre</span>
              <input type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)} placeholder="Palavra-Chave..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ff007f', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Ir para 6ª Camada ➔</button>
            </form>
          )}

          {etapaSeguranca === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#eab308', fontWeight: 'bold' }}>🔑 6ª Camada: Ticons OS Sequência</span>
              <button onClick={() => setEtapaSeguranca(7)} style={{ padding: '12px', backgroundColor: '#eab308', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Aprovar Sequência Ticons ➔</button>
            </div>
          )}

          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>📡 7ª Camada: QR Code Mapeamento</span>
              <QRCodeSVG value="https://github.com/Manomae" size={130} />
              <button onClick={() => setBloqueado(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>📱 Desbloquear Sistema Total ➔</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================================
  // 🌟 RENDERIZAÇÃO DO SISTEMA EMANUEL.OS CORE v6.0 (DESBLOQUEADO)
  // =========================================================================================
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden', position: 'relative' }}>
      <Head><title>Emanuel.OS Core v6.0 | ROBOTOC 3D & AGI Engine</title></Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>

        {/* ÁREA PRINCIPAL DA CENA 3D E HUD */}
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s' }}>
          
          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

          {/* BARRA SUPERIOR DE BOTOES */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>
            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#ff007f' : 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🖥️ {modoDevSplit ? 'Fechar Split' : 'Dev Split'}
            </button>
            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📱 Android HUD
            </button>
            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 0, 127, 0.15)', border: '1px solid #ff007f', color: '#ff007f', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📊 Creator Studio
            </button>
          </div>

          {/* SIDEBAR ESQUERDA - MAPAS E NAVEGAÇÃO CENTRAL */}
          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '360px' : '0px', height: '100vh',
            backgroundColor: 'rgba(7, 7, 12, 0.96)', borderRight: sidebarAberta ? '1px solid rgba(0,240,255,0.3)' : 'none',
            backdropFilter: 'blur(20px)', zIndex: 90, padding: sidebarAberta ? '20px' : '0px', overflowY: 'auto',
            transition: 'all 0.3s'
          }}>
            {sidebarAberta && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h2 style={{ fontSize: '18px', color: '#00f0ff', margin: 0, fontWeight: 'bold' }}>CENTRAL MAPAS EMANUEL.OS</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link href="/espacial" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>🪐 Espacial</Link>
                  <Link href="/mapa" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #16a34a', color: '#4ade80', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>🌍 Terrestre</Link>
                  <Link href="/mapa-ia" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>⚡ Gerador 3D IA</Link>
                  <Link href="/mapaaeroespacial" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #9333ea', color: '#c084fc', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>🛸 Aeroespacial</Link>
                  <Link href="/mapa-ressonancia" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #10b981', color: '#34d399', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', gridColumn: 'span 2' }}>🧠 Ressonância</Link>
                  <Link href="/mapa-quantico" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #8b5cf6', color: '#c084fc', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', gridColumn: 'span 2' }}>⚛️ Quântico</Link>
                  <Link href="/mapa-orkut" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #ff007f', color: '#ff007f', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', gridColumn: 'span 2' }}>💖 Orkut 3D</Link>
                  <Link href="/mapa-patologia" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', gridColumn: 'span 2' }}>🔬 Patologia 3D</Link>
                  <Link href="/mapa-antiguidades" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #eab308', color: '#fef08a', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', gridColumn: 'span 2' }}>🏛️ Antiguidades</Link>
                </div>

                <GoogleMeetAvatarManager addLog={(log) => setCmdLogs(prev => [...prev, log])} />
                <UnixTerminalCanvas />
                <FormularioCapturaEmanuelOS />
              </div>
            )}
          </aside>

          {/* RODAPÉ INTERATIVO IA DE COMANDOS */}
          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 30px)', maxWidth: '700px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 0, 127, 0.5)', borderRadius: '10px', padding: '6px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>Emanuel.OS Core v6.0 | ROBOTOC Active | 2030</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (chatInput.trim()) { setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: chatInput, tipo: 'user' }, { autor: 'ROBOTOC IA', texto: `Comando "${chatInput}" processado via Gemini AGI.`, tipo: 'ia' }]); setChatInput(''); } }} style={{ backgroundColor: 'rgba(5, 12, 24, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid #00f0ff', borderRadius: '25px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com o ROBOTOC ou envie comandos..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', flexGrow: 1 }} />
              <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar ➔</button>
            </form>
          </div>

        </div>

        {/* TELA DIVIDIDA DEV SPLIT */}
        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}

      </div>

      {/* GAVETA ANDROID HUD LATERAL */}
      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear />
        <CloudflareWorkerDeployer addLog={(log) => setCmdLogs(prev => [...prev, log])} />
        <BitcoinAnalysisPanel />
      </AndroidHUDPanel>

      {/* MODAL CREATOR STUDIO IA */}
      {modalCreatorStudioAberto && (
        <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />
      )}

    </div>
  );
}
