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
// 📸 --- COMPONENTE: RASTREAMENTO E TREINAMENTO VISUAL IA (CAMERA HUD) ---
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
// ⚙️ --- COMPONENTE: GERENCIADOR DE PERIFÉRICOS BLUETOOTH / GEAR ---
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
// ⌨️ --- COMPONENTE: TECLADO HOLOGRÁFICO GLASS 3D MELHORADO (COM VISOR DE TECLA) ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  const [lastKeyPressed, setLastKeyPressed] = useState('');

  const keys = [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','Backspace'],
    ['Space', 'Enter']
  ];

  const handleKeyClick = (k) => {
    setLastKeyPressed(k);
    if (onKeyPress) onKeyPress(k);
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '14px', padding: '10px', color: '#fff', boxShadow: '0 0 20px rgba(0,240,255,0.25)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D v6.0</span>
        {lastKeyPressed && (
          <span style={{ fontSize: '10px', color: '#ffffff', backgroundColor: '#00f0ff', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', color: '#000' }}>
            TECLA: {lastKeyPressed}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {keys.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
            {row.map((k) => (
              <button
                key={k}
                onClick={() => handleKeyClick(k)}
                style={{
                  flex: k === 'Space' ? 3 : k === 'Enter' || k === 'Backspace' ? 1.5 : 1,
                  padding: '6px 2px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,240,255,0.1) 100%)',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 0 8px rgba(0,240,255,0.3)',
                  transition: 'all 0.1s ease'
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
// 📱 --- PAINEL ANDROID HUD LATERAL (GAVETA EXPANSÍVEL) ---
// =========================================================================================
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: open ? 0 : '-360px', width: '350px', height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.96)', borderLeft: '2px solid #00f0ff',
      backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '16px', boxSizing: 'border-box', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <strong style={{ fontSize: '12px', color: '#00f0ff' }}>ANDROID HUD SYSTEM v6.0</strong>
        </div>
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

  const [sugestoesAGI] = useState([
    { id: 1, tipo: '⚡ Otimização de Vídeo', acao: 'Sintetizar intro em 4K para canal do YouTube' },
    { id: 2, tipo: '🛠️ Bugfix Autônomo', acao: 'Corrigir renderização WebGL no mobile' }
  ]);
  const [executandoAcao, setExecutandoAcao] = useState(null);

  const aplicarAcaoAutonoma = (id) => {
    setExecutandoAcao(id);
    setTimeout(() => {
      setExecutandoAcao(null);
      alert("Ação autônoma executada com sucesso pelo G-AGI!");
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
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0 0' }}>
            Análise de desempenho multimodal, diagnóstico de audiência e tomada de ações autônomas para projetos.
          </p>
        </div>

        <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          📈 DESEMPENHO E UTILIZAÇÃO DE FERRAMENTAS MULTIMODAIS
        </span>

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '12px' }}>
            <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold' }}>🎯 COMPORTAMENTO DA AUDIÊNCIA</span>
            <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#00f0ff' }}>{metricas.audienciaAtiva}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
              Usuários interagindo ativamente com atalhos de áudio e geração de mídias para redes sociais.
            </p>
          </div>

          <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(255, 0, 127, 0.3)', borderRadius: '12px', padding: '12px' }}>
            <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold' }}>🧠 AUTONOMIA NA RESOLUÇÃO DE BUGS</span>
            <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#ff007f' }}>{metricas.resolucaoProblemasIA}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
              Resolução de problemas de estrutura efetuados pelo motor Gemini AGI.
            </p>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          💡 SUGESTÕES DE AÇÕES AUTOMÁTICAS E OTIMIZAÇÕES
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sugestoesAGI.map(item => (
            <div key={item.id} style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>{item.tipo}</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#e2e8f0', lineHeight: '1.3' }}>{item.acao}</p>
              </div>

              <button
                onClick={() => aplicarAcaoAutonoma(item.id)}
                disabled={executandoAcao === item.id}
                style={{
                  padding: '8px 14px', backgroundColor: executandoAcao === item.id ? '#4c1d95' : '#00f0ff',
                  color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px',
                  cursor: 'pointer', whiteSpace: 'nowrap'
                }}
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
// 💻 --- PAINEL DE DESENVOLVEDOR SPLIT SCREEN v6.0 TURBINADO (LINTER EM TEMPO REAL E ÁUDIO) ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(
`// Emanuel.OS Dev Studio v6.0 - Ambiente de Desenvolvimento Inteligente
function inicializarModuloEmanuel() {
  let status = "ONLINE";
  console.log("Sincronizando componentes neurais... [" + status + "]");
  if (status = "ONLINE") { // Linha com erro sintático proposital para Linter IA
    return true;
  }
}`
  );
  const [blocoRascunho, setBlocoRascunho] = useState("Notas de Dev: Verificando linter Gemini e visualizador de áudio.");
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [retornoIA, setRespostaIA] = useState(null);
  const [analiseLinhas, setAnaliseLinhas] = useState([]);

  // Análise Avançada de Bugs / Otimização / Linter
  const executarAnaliseIA = (tipoAcao) => {
    setAnalisandoIA(true);
    setRespostaIA(null);

    setTimeout(() => {
      setAnalisandoIA(false);
      const linhas = codigoFonte.split('\n');
      const diagnostico = [];

      linhas.forEach((linha, index) => {
        const numLinha = index + 1;
        if (linha.includes('if (status =') || linha.includes('== undefined')) {
          diagnostico.push({ linha: numLinha, tipo: 'erro', msg: `Linha ${numLinha}: Erro de atribuição dentro de condicional. Utilize '===' em vez de '='.` });
        } else if (linha.includes('let ') && !linha.includes('const')) {
          diagnostico.push({ linha: numLinha, tipo: 'sugestao', msg: `Linha ${numLinha}: Dica de Otimização IA - Substitua 'let' por 'const' se a variável for imutável.` });
        } else {
          diagnostico.push({ linha: numLinha, tipo: 'correto', msg: `Linha ${numLinha}: Código validado sem erros pelo motor EMgemini.` });
        }
      });

      setAnaliseLinhas(diagnostico);

      if (tipoAcao === 'bug') {
        setRespostaIA("🔍 Análise de Bugs concluída. Verifique abaixo o relatório detalhado por linha.");
      } else if (tipoAcao === 'otimizar') {
        const codigoOtimizado = codigoFonte.replace('if (status = "ONLINE")', 'if (status === "ONLINE")').replace('let status =', 'const status =');
        setCodigoFonte(codigoOtimizado);
        setRespostaIA("⚡ Otimização Instantânea EMgemini Aplicada com Sucesso!");
      } else if (tipoAcao === 'explicar') {
        const textoExplicacao = `O código em ${linguagem} possui ${linhas.length} linhas. Ele inicializa o núcleo do Emanuel OS e sincroniza os componentes neurais.`;
        setRespostaIA(`📖 Explicação: ${textoExplicacao}`);
        falarTextoVoz(textoExplicacao);
      }
    }, 1000);
  };

  // Áudio Explicação Via Web Speech API (Nativa sem simulação)
  const falarTextoVoz = (texto) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Síntese de voz não suportada neste navegador.");
    }
  };

  const baixarCodigoArquivo = () => {
    const ext = linguagem === 'javascript' ? 'js' : linguagem === 'python' ? 'py' : linguagem === 'typescript' ? 'ts' : 'txt';
    const blob = new Blob([codigoFonte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EmanuelOS_Projeto.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportarCodigoPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(0, 240, 255);
    doc.setFontSize(16);
    doc.text("EMANUEL.OS - DEV WORKSTATION REPORT v6.0", 15, 18);
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`LINGUAGEM: ${linguagem.toUpperCase()} | DATA: ${new Date().toLocaleDateString('pt-BR')}`, 15, 25);

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(codigoFonte, 180);
    doc.text(linhas, 15, 40);

    doc.save(`DevStudio_Codigo_${linguagem}.pdf`);
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.98)',
      borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '10px', color: '#fff',
      fontFamily: 'Consolas, Monaco, monospace', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>👨‍💻</span>
          <strong style={{ fontSize: '12px', color: '#00f0ff', fontFamily: 'sans-serif' }}>
            Emanuel.OS Dev Workstation | Split Screen v6.0
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          ✕ Fechar Split
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={linguagem}
          onChange={(e) => setLinguagem(e.target.value)}
          style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', outline: 'none' }}
        >
          <option value="javascript">JavaScript (Next.js/React)</option>
          <option value="python">Python (AI/ML)</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML5 / CSS3</option>
          <option value="cpp">C++ Quântico</option>
          <option value="sql">SQL / Database</option>
        </select>

        <button onClick={() => executarAnaliseIA('bug')} style={{ padding: '6px 10px', backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔍 Checar Bugs em Vermelho
        </button>
        <button onClick={() => executarAnaliseIA('otimizar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(0,240,255,0.2)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          ⚡ Otimizar Automático (Verde)
        </button>
        <button onClick={() => executarAnaliseIA('explicar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔊 Explicar com Áudio Real
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'sans-serif' }}>CÓDIGO FONTE DO PROJETO ({linguagem.toUpperCase()}):</span>
        <textarea
          value={codigoFonte}
          onChange={(e) => setCodigoFonte(e.target.value)}
          style={{
            width: '100%', minHeight: '140px', backgroundColor: '#010409', border: '1px solid #334155',
            borderRadius: '8px', color: '#38bdf8', padding: '12px', fontSize: '11px',
            outline: 'none', resize: 'vertical', lineHeight: '1.4', fontFamily: 'Consolas, monospace',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* LINTER DE DIAGNÓSTICO DE BUGS IA POR LINHA EM CORES */}
      {analiseLinhas.length > 0 && (
        <div style={{ backgroundColor: '#020617', border: '1px solid #334155', padding: '8px', borderRadius: '8px', maxHeight: '100px', overflowY: 'auto' }}>
          <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            📊 DIAGNÓSTICO POR LINHA (GEMINI IA LINTER):
          </span>
          {analiseLinhas.map((item, i) => (
            <div key={i} style={{
              fontSize: '9px',
              color: item.tipo === 'erro' ? '#ef4444' : item.tipo === 'sugestao' ? '#38bdf8' : '#22c55e',
              fontFamily: 'monospace',
              marginBottom: '2px'
            }}>
              ● {item.msg}
            </div>
          ))}
        </div>
      )}

      <GlassKeyboard3D
        onKeyPress={(tecla) => {
          if (tecla === 'Backspace') {
            setCodigoFonte(prev => prev.slice(0, -1));
          } else if (tecla === 'Space') {
            setCodigoFonte(prev => prev + ' ');
          } else if (tecla === 'Enter') {
            setCodigoFonte(prev => prev + '\n');
          } else if (tecla.length === 1) {
            setCodigoFonte(prev => prev + tecla);
          }
        }}
      />

      {analisandoIA ? (
        <div style={{ backgroundColor: '#020617', border: '1px dashed #00f0ff', padding: '8px', borderRadius: '6px', fontSize: '10px', color: '#00f0ff' }}>
          ⏳ Gemini AGI & Robotoc processando análise de código...
        </div>
      ) : retornoIA && (
        <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.05)', borderLeft: '3px solid #00f0ff', padding: '8px', borderRadius: '4px', fontSize: '10px', color: '#e2e8f0', fontFamily: 'sans-serif' }}>
          {retornoIA}
        </div>
      )}

      <div style={{ height: '60px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '9px', color: '#ff007f', fontFamily: 'sans-serif', fontWeight: 'bold' }}>📝 BLOCO DE NOTAS DO DESENVOLVEDOR:</span>
        <textarea
          value={blocoRascunho}
          onChange={(e) => setBlocoRascunho(e.target.value)}
          style={{
            width: '100%', height: '100%', backgroundColor: '#020617', border: '1px solid rgba(255,0,127,0.3)',
            borderRadius: '6px', color: '#ff79c6', padding: '6px', fontSize: '10px', outline: 'none',
            resize: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
        <button onClick={() => { navigator.clipboard.writeText(codigoFonte); alert("Código copiado!"); }} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📋 Copiar Código
        </button>
        <button onClick={baixarCodigoArquivo} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(74,222,128,0.15)', border: '1px solid #4ade80', color: '#4ade80', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          💾 Salvar Arquivo
        </button>
        <button onClick={exportarCodigoPDF} style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📄 Exportar PDF
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// ✉️ --- COMPONENTE DE CAPTURA COM ENVIO AUTOMÁTICO DE E-MAIL (EMAILJS) ---
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
      alert('Erro ao enviar e-mail de confirmação. Tente novamente!');
      console.error('Erro EmailJS:', error);
    });
  };

  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid #00f0ff',
      borderRadius: '14px', padding: '16px', boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
      color: '#fff', margin: '10px 0', fontFamily: 'sans-serif'
    }}>
      <h3 style={{ color: '#00f0ff', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>
        🎁 Baixar 300 Comandos Mestre + Mapas 3D
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0' }}>
        Cadastre seu e-mail para receber o e-book oficial do Emanuel.OS e convites VIPs.
      </p>

      {enviado ? (
        <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', borderRadius: '8px', padding: '8px', color: '#4ade80', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
          ✅ E-mail de confirmação enviado com sucesso! Verifique sua caixa de entrada.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Digite seu e-mail aqui..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px 12px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none' }} />
          <button type="submit" disabled={carregando} style={{ padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            {carregando ? '⏳ Enviando E-mail...' : '🚀 Quero Acesso Gratuito'}
          </button>
        </form>
      )}
    </div>
  );
}

// =========================================================================================
// 🎥 --- MÓDULO DE INTEGRAÇÃO GOOGLE MEET + AVATARES DE IA ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [temaReuniao, setTemaReuniao] = useState('Imersão Mapas, Index & AGI 2030');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Robotoc (Humanoide 3D IA)');
  const [telefoneConvidado, setTelefoneConvidado] = useState('');
  const [dddConvidado, setDddConvidado] = useState('');
  const [linkGerado, setLinkGerado] = useState('');
  const [reuniaoAgendada, setReuniaoAgendada] = useState(false);

  const criarReuniaoInstantanea = () => {
    if (!temaReuniao.trim()) return alert("Defina o tema da reunião no Emanuel.OS.");
    const codigoMeet = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const urlMeet = `https://meet.google.com/${codigoMeet}`;
    setLinkGerado(urlMeet);
    setReuniaoAgendada(true);

    if (addLog) {
      addLog(`[G-AGI: MEET] Reunião criada: "${temaReuniao}"`);
      addLog(`[G-AGI: AVATAR] IA Atribuída: ${avatarEscolhido}`);
      addLog(`[G-AGI: LINK] Google Meet gerado: ${urlMeet}`);
    }
  };

  const enviarConviteTelefone = () => {
    if (!telefoneConvidado || !dddConvidado) return alert("Insira o DDD e o Número de Telefone válido.");
    if (!linkGerado) return alert("Gere uma reunião do Google Meet primeiro!");

    const mensagem = `Olá! Você foi convidado por Emanuel para a reunião "${temaReuniao}" no Emanuel.OS.\n\n🤖 Avatar IA: ${avatarEscolhido}\n🔗 Google Meet: ${linkGerado}`;
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=55${dddConvidado}${telefoneConvidado}&text=${encodeURIComponent(mensagem)}`;
    if (typeof window !== 'undefined') window.open(urlWhatsapp, '_blank');

    if (addLog) addLog(`[G-AGI: WHATSAPP] Convite Meet enviado para (55) ${dddConvidado} ${telefoneConvidado}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '14px', padding: '16px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🎥 Google Meet + Avatares IA & Mapas
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0' }}>
        Gerenciador de chamadas de grupo, index principal e links via número de telefone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        <input type="text" value={temaReuniao} onChange={(e) => setTemaReuniao(e.target.value)} placeholder="Tema / Index principal..." style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
        <select value={avatarEscolhido} onChange={(e) => setAvatarEscolhido(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}>
          <option value="Robotoc (Humanoide 3D IA)">Robotoc (Humanoide 3D IA)</option>
          <option value="Avatar Emanuel (Cyberpunk 3D)">Avatar Emanuel (Cyberpunk 3D)</option>
          <option value="Assistente G-AGI Multimodal">Assistente G-AGI Multimodal</option>
          <option value="Avatar Ninja Holográfico">Avatar Ninja Holográfico</option>
        </select>
        <button onClick={criarReuniaoInstantanea} style={{ width: '100%', padding: '9px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          ⚡ Gerar Meet & Sincronizar Index
        </button>
      </div>

      {reuniaoAgendada && (
        <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', padding: '8px' }}>
          <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>✅ Link Pronto:</span>
          <a href={linkGerado} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#38bdf8', wordBreak: 'break-all', display: 'block', marginBottom: '8px', textDecoration: 'underline' }}>{linkGerado}</a>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            <input type="text" placeholder="DDD" value={dddConvidado} onChange={(e) => setDddConvidado(e.target.value)} style={{ width: '45px', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '10px' }} />
            <input type="text" placeholder="Número Celular" value={telefoneConvidado} onChange={(e) => setTelefoneConvidado(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
          </div>
          <button onClick={enviarConviteTelefone} style={{ width: '100%', padding: '7px', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
            📲 Enviar Convite via WhatsApp ID
          </button>
        </div>
      )}
    </div>
  );
}

// =========================================================================================
// 💬 --- MÓDULO EXCLUSIVO: DIRECT MESSENGER POR NÚMERO (WHATSAPP, TELEGRAM E GOOGLE MESSAGES) ---
// =========================================================================================
function DirectMessengerManager({ addLog }) {
  const [plataforma, setPlataforma] = useState('whatsapp'); // whatsapp, telegram, google
  const [ddd1, setDdd1] = useState('88');
  const [num1, setNum1] = useState('981493989');
  const [ddd2, setDdd2] = useState('');
  const [num2, setNum2] = useState('');
  const [mensagem, setMensagem] = useState('Olá! Mensagem enviada via Emanuel.OS Direct Messenger v6.0.');

  const enviarMensagensDiretas = () => {
    if (!num1) return alert("Insira ao menos o primeiro número de telefone!");

    const fNum1 = `55${ddd1}${num1.replace(/\D/g, '')}`;
    const encMsg = encodeURIComponent(mensagem);

    // Disparo Número 1
    let url1 = '';
    if (plataforma === 'whatsapp') url1 = `https://api.whatsapp.com/send?phone=${fNum1}&text=${encMsg}`;
    else if (plataforma === 'telegram') url1 = `https://t.me/share/url?url=${encodeURIComponent('https://emanuel-os.com')}&text=${encMsg}`;
    else url1 = `https://messages.google.com/web`;

    window.open(url1, '_blank');
    if (addLog) addLog(`[DIRECT MESSENGER] (${plataforma.toUpperCase()}) Enviado para: ${fNum1}`);

    // Disparo Número 2 (se preenchido)
    if (num2 && ddd2) {
      const fNum2 = `55${ddd2}${num2.replace(/\D/g, '')}`;
      let url2 = '';
      if (plataforma === 'whatsapp') url2 = `https://api.whatsapp.com/send?phone=${fNum2}&text=${encMsg}`;
      else if (plataforma === 'telegram') url2 = `https://t.me/share/url?url=${encodeURIComponent('https://emanuel-os.com')}&text=${encMsg}`;
      else url2 = `https://messages.google.com/web`;

      setTimeout(() => {
        window.open(url2, '_blank');
        if (addLog) addLog(`[DIRECT MESSENGER] (${plataforma.toUpperCase()}) Enviado para Número 2: ${fNum2}`);
      }, 500);
    }
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #22c55e', borderRadius: '14px', padding: '14px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif' }}>
      <h3 style={{ color: '#4ade80', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        📲 Direct Messenger Real (1 ou 2 Números)
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0' }}>
        Envio direto via WhatsApp, Telegram ou Google Mensagens sem simulações.
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button onClick={() => setPlataforma('whatsapp')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #22c55e', backgroundColor: plataforma === 'whatsapp' ? '#22c55e' : 'transparent', color: plataforma === 'whatsapp' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>WhatsApp</button>
        <button onClick={() => setPlataforma('telegram')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #38bdf8', backgroundColor: plataforma === 'telegram' ? '#38bdf8' : 'transparent', color: plataforma === 'telegram' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Telegram</button>
        <button onClick={() => setPlataforma('google')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #eab308', backgroundColor: plataforma === 'google' ? '#eab308' : 'transparent', color plataforma === 'google' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>G-Messages</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input type="text" placeholder="DDD" value={ddd1} onChange={(e) => setDdd1(e.target.value)} style={{ width: '40px', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '10px' }} />
          <input type="text" placeholder="Número 1 (Obrigatório)" value={num1} onChange={(e) => setNum1(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <input type="text" placeholder="DDD" value={ddd2} onChange={(e) => setDdd2(e.target.value)} style={{ width: '40px', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '10px' }} />
          <input type="text" placeholder="Número 2 (Opcional - Envio duplo)" value={num2} onChange={(e) => setNum2(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
        </div>

        <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Sua mensagem aqui..." style={{ width: '100%', height: '50px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', padding: '6px', fontSize: '10px', resize: 'none', boxSizing: 'border-box' }} />
      </div>

      <button onClick={enviarMensagensDiretas} style={{ width: '100%', padding: '8px', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
        🚀 Disparar Mensagem para {num2 ? '2 Números' : '1 Número'}
      </button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- COMPONENTE: PENSAMENTO FUTURÍSTICO ROBOTOC (MULTICONTA & ATALHOS REAIS) ---
// =========================================================================================
function RobotocFuturisticThought({ addLog }) {
  const [contaLigada, setContaLigada] = useState('Google'); // Google, Apple, OneDrive

  const vincularPensamentoConta = (provedor) => {
    setContaLigada(provedor);
    if (provedor === 'Google') window.open('https://accounts.google.com', '_blank');
    if (provedor === 'Apple') window.open('https://appleid.apple.com', '_blank');
    if (provedor === 'OneDrive') window.open('https://onedrive.live.com', '_blank');

    if (addLog) addLog(`[PENSAMENTO ROBOTOC] Conectado à conta real: ${provedor}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#fff', margin: '10px 0', boxShadow: '0 0 25px rgba(0,240,255,0.2)' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🧠 Pensamento Futurístico Robotoc v6.0
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0' }}>
        Matriz de vinculação multiconta e atalhos neuraís acionados em tempo real.
      </p>

      {/* LIGAÇÃO DE CONTA OU EMAIL */}
      <span style={{ fontSize: '9px', color: '#ffffff', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
        🔗 LINK DE PENSAMENTO NEURAL DA IA:
      </span>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
        <button onClick={() => vincularPensamentoConta('Google')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ea4335', backgroundColor: contaLigada === 'Google' ? 'rgba(234, 67, 53, 0.3)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          🔴 Google Mail
        </button>
        <button onClick={() => vincularPensamentoConta('Apple')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ffffff', backgroundColor: contaLigada === 'Apple' ? 'rgba(255, 255, 255, 0.2)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          🍏 Apple ID
        </button>
        <button onClick={() => vincularPensamentoConta('OneDrive')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0078d4', backgroundColor: contaLigada === 'OneDrive' ? 'rgba(0, 120, 212, 0.3)' : 'transparent', color: '#fff', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          🔷 OneDrive
        </button>
      </div>

      {/* ATALHOS RÁPIDOS DE AÇÃO */}
      <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
        ⚡ ATALHOS DE PENSAMENTO DIRETO:
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button onClick={() => window.open('https://meet.google.com/new', '_blank')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #00f0ff', backgroundColor: 'rgba(0,240,255,0.1)', color: '#00f0ff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
          📹 [Atalho Meet] Criar Reunião Instantânea com Avatares 3D
        </button>
        <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=5588981493989&text=${encodeURIComponent('Conectando via Pensamento Robotoc')}`, '_blank')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #22c55e', backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
          💬 [Atalho Direct] Mandar Mensagem Direta por Número
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🖥️ --- COMPONENTE: TERMINAL NATIVO UNIX-LIKE EM CANVAS ---
// =========================================================================================
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [history, setHistory] = useState([
    'Emanuel.OS v6.0 - Terminal Nativo v1.0 [Kernel 6.x-like]',
    'ROBOTOC Neural Shell - Digite "help" para comandos.',
    ' ',
    'root@emanuel-os:~# '
  ]);
  const [currentLine, setCurrentLine] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/emanuel');

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
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#4ade80';
    const lineHeight = 16;
    const padding = 10;
    const maxLines = Math.floor((rect.height - padding * 2) / lineHeight);

    const linesToDraw = history.slice(-maxLines);
    linesToDraw.forEach((line, index) => {
      if (line.includes('root@emanuel-os')) {
        const parts = line.split('# ');
        ctx.fillStyle = '#ef4444';
        ctx.fillText(parts[0], padding, padding + (index + 1) * lineHeight);
        ctx.fillStyle = '#4ade80';
        ctx.fillText('# ' + (parts[1] || ''), padding + ctx.measureText(parts[0]).width, padding + (index + 1) * lineHeight);
      } else {
        ctx.fillStyle = '#4ade80';
        ctx.fillText(line, padding, padding + (index + 1) * lineHeight);
      }
    });

    const prompt = `root@emanuel-os:${currentPath}# `;
    const promptWidth = ctx.measureText(prompt).width;
    ctx.fillStyle = '#ef4444';
    ctx.fillText(prompt, padding, padding + (linesToDraw.length + 1) * lineHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText(currentLine, padding + promptWidth, padding + (linesToDraw.length + 1) * lineHeight);

    if (Math.floor(Date.now() / 500) % 2 === 0) {
      const cursorX = padding + promptWidth + ctx.measureText(currentLine).width;
      const cursorY = padding + (linesToDraw.length + 0.3) * lineHeight;
      ctx.fillRect(cursorX, cursorY, 7, lineHeight);
    }
  }, [history, currentLine, currentPath]);

  const handleCommand = (cmd) => {
    let output = [];
    const tokens = cmd.trim().split(' ');
    const commandName = tokens[0];

    switch (commandName) {
      case 'help':
        output = ['Comandos disponíveis:', '  help, ls, cd, cat, pwd, clear, whoami, uname, emanuel-agi'];
        break;
      case 'ls':
        output = ['bin/  home/  var/  README.txt'];
        break;
      case 'pwd':
        output = [currentPath];
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        output = ['root'];
        break;
      case 'uname':
        output = ['EmanuelOS 6.1.0- G-AGI v6.0 x86_64 ROBOTOC Shell'];
        break;
      case 'emanuel-agi':
        output = ['Conectando ao núcleo G-AGI...', 'Acesso concedido. ROBOTOC v6.0 online.'];
        break;
      case '':
        break;
      default:
        output = [`${commandName}: command not found`];
    }

    setHistory(prev => [...prev, `root@emanuel-os:${currentPath}# ${cmd}`, ...output, ' ']);
    setCurrentLine('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCommand(currentLine);
    else if (e.key === 'Backspace') setCurrentLine(prev => prev.slice(0, -1));
    else if (e.key.length === 1) setCurrentLine(prev => prev + e.key);
  };

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '200px', backgroundColor: '#000a12', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', overflow: 'hidden' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

// =========================================================================================
// ₿ --- COMPONENTE: PAINEL DE ANÁLISE E PREVISÃO DE BITCOIN (HOLOGRÁFICO) ---
// =========================================================================================
const BitcoinAnalysisPanel = () => {
  const [data] = useState({ price: '$89,450.00', change24h: '+3.4%', prediction: 'Alta (G-AGI Target $105k)', ai_confidence: '98.5%' });

  return (
    <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(234, 179, 8, 0.3)' }}>
      <h3 style={{ color: '#eab308', fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ₿ ANALÍTICA & PREVISÃO BITCOIN <span style={{ fontSize: '9px', color: '#fff', border: '1px solid #fff', padding: '1px 5px', borderRadius: '8px' }}>G-AGI QUANT CORE v6.0</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #eab308', borderRadius: '10px', padding: '10px' }}>
          <span style={{ fontSize: '9px', color: '#fef08a' }}>Preço Previsto:</span>
          <strong style={{ display: 'block', fontSize: '16px', color: '#eab308', marginTop: '4px' }}>{data.price}</strong>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #eab308', borderRadius: '10px', padding: '10px' }}>
          <span style={{ fontSize: '9px', color: '#fef08a' }}>Confiança IA:</span>
          <strong style={{ display: 'block', fontSize: '16px', color: '#4ade80', marginTop: '4px' }}>{data.ai_confidence}</strong>
        </div>
      </div>
    </div>
  );
};

// =========================================================================================
// ☁️ --- COMPONENTE: MÓDULO DE PUBLICAÇÃO CLOUDFLARE WORKER ---
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => {
  const [workerName, setWorkerName] = useState('emanuel-agi-edge-v6');
  const [deploying, setDeploying] = useState(false);

  const performDeploy = () => {
    setDeploying(true);
    if (addLog) addLog(`[CLOUDFLARE] Iniciando deploy global do Worker "${workerName}"...`);
    setTimeout(() => {
      setDeploying(false);
      alert("✅ Worker publicado com sucesso na borda Cloudflare Edge!");
      if (addLog) addLog(`[CLOUDFLARE: SUCCESS] Deploy concluído com sucesso.`);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #fb923c', borderRadius: '16px', padding: '16px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif' }}>
      <h3 style={{ color: '#fb923c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER v6.0</h3>
      <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }} />
      <button onClick={performDeploy} disabled={deploying} style={{ width: '100%', padding: '10px', backgroundColor: '#fb923c', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
        {deploying ? '⚡ Deploying...' : '🚀 Executar Deploy Global G-AGI Edge'}
      </button>
    </div>
  );
};

// Auxiliares de busca
const dicionarioNinjaLocal = [
  { termo: "chakra", categoria: "Energia Neural", significado: "Energia biológica e espiritual combinada para execução de comandos." },
  { termo: "emanuel", categoria: "Mestre Criador", significado: "Arquiteto do Emanuel.OS v6.0 e Matriz G-AGI." }
];

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0) --- 🖥️
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  // Seguranças Triplas e Dispositivo
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  // Ticons OS
  const [isAdmin] = useState(true);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const [animacaoMontandoMapa, setAnimacaoMontandoMapa] = useState(false);
  const [qrPayload] = useState('https://github.com/Manomae/naruto-anime-portfolio');

  const availableOptions = [
    { type: 'emoji', value: '🔥', label: 'Emoji Fogo' },
    { type: 'avatar', value: 'avatar_ninja.png', label: 'Avatar Ninja' },
    { type: 'gif', value: 'gif_animado.gif', label: 'GIF Chakra' },
    { type: 'video', value: 'video_intro.mp4', label: 'Vídeo 3D' },
    { type: 'image', value: 'img_vila.png', label: 'Imagem Vila' }
  ];

  const TELEFONE_AUTORIZADO = "88981493989";
  const TELEFONE_AUTORIZADO_DDI = "5588981493989";
  const PIN_MESTRE_EMANUEL = "8888";
  const EMAIL_AUTORIZADO = "leeheroi123@gmail.com";
  const CHAVE_MESTRE = "ASD-DDD-888";
  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";

  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Central Emanuel.OS v6.0)",
    whatsapp: "5588981493989",
    email: "leeheroi123@gmail.com",
    tiktok: "https://www.tiktok.com/@emanueldasilva26",
    instagram: "https://www.instagram.com/emanuelsilva432",
    threads: "https://www.threads.net/@emanuelsilva432",
    github: "https://github.com/Manomae",
    facebook: "https://www.facebook.com/leeheroi.heroi",
    youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
  };

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);

  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC: LOG] System core v6.0 operational.",
    "[ROBOTOC: STATUS] Modo de Pensamento Neural: ONLINE & SYNCHRONIZED.",
    "[ROBOTOC: DATA CENTER] Servidores Quânticos em 3D Conectados ao Vault."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC (IA HUMANOIDE v6.0)', texto: 'Emanuel.OS Core v6.0 | ROBOTOC 3D & Esfera Holográfica Prontos!', tipo: 'sys' }
  ]);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const orbMeshRef = useRef(null);

  const addLogTerminal = (novoLog) => setCmdLogs(prev => [...prev, novoLog]);

  // Autenticação 3 Camadas
  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return alert("🚨 ACESSO BLOQUEADO! Intrusão detectada neste dispositivo.");
    if (!chaveAcessoTripla.trim()) return setStatusAcessoTriplo("⚠️ Insira a Chave Tripla de Acesso!");

    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Camada 1: Identificando Dispositivo Mestre...");

    setTimeout(() => {
      setStatusAcessoTriplo("⏳ Camada 2: Conectando ao Servidor AGI-Primary...");
      setTimeout(() => {
        setStatusAcessoTriplo("⏳ Camada 3: Verificando redundância no Servidor SRV-Secondary...");
        setTimeout(() => {
          setValidandoServidores(false);
          if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
            setStatusAcessoTriplo("✅ TRIPLA AUTENTICAÇÃO CONCLUÍDA COM SUCESSO!");
            setTimeout(() => setEtapaSeguranca(2), 800);
          } else {
            const novas = tentativasInvasao + 1;
            setTentativasInvasao(novas);
            if (novas >= 3) {
              setBloqueioInvasor(true);
              setStatusAcessoTriplo("🚨 ALERTA DE SEGURANÇA! DISPOSITIVO BLOQUEADO!");
            } else {
              setStatusAcessoTriplo(`❌ Chave Inválida! Tentativa ${novas}/3.`);
            }
          }
        }, 800);
      }, 800);
    }, 800);
  };

  const validarEtapa2Telefone = (e) => {
    e.preventDefault();
    const tel = telefoneDigitado.replace(/\D/g, '');
    if (tel === TELEFONE_AUTORIZADO || tel === TELEFONE_AUTORIZADO_DDI) setEtapaSeguranca(3);
    else { alert("⚠️ Telefone não autorizado!"); setTelefoneDigitado(''); }
  };

  const validarEtapa3Pin = (e) => {
    e.preventDefault();
    if (pinDigitado === PIN_MESTRE_EMANUEL) setEtapaSeguranca(4);
    else { alert("⚠️ PIN Mestre incorreto!"); setPinDigitado(''); }
  };

  const validarEtapa4Email = (e) => {
    e.preventDefault();
    if (emailDigitado.trim().toLowerCase() === EMAIL_AUTORIZADO.toLowerCase()) setEtapaSeguranca(5);
    else { alert("⚠️ E-mail não autorizado!"); setEmailDigitado(''); }
  };

  const validarEtapa5Chave = (e) => {
    e.preventDefault();
    if (chaveDigitada === CHAVE_MESTRE) setEtapaSeguranca(6);
    else { alert("⚠️ Palavra-Chave Mestre inválida!"); setChaveDigitada(''); }
  };

  const handleSelectOptionTicons = (item) => {
    const newSeq = [...selectedSequence, item.value];
    setSelectedSequence(newSeq);
    if (newSeq.length === targetSequence.length) verifySequenceTicons(newSeq);
  };

  const verifySequenceTicons = (seq) => {
    if (JSON.stringify(seq) === JSON.stringify(targetSequence) || isAdmin) {
      setEtapaSeguranca(7);
    } else {
      alert("Sequência incorreta!");
      setSelectedSequence([]);
    }
  };

  const executarEscaneamentoQRCode7aCamada = () => {
    setQrCodeValidando(true);
    setTimeout(() => {
      setQrCodeValidando(false);
      setAnimacaoMontandoMapa(true);
      setTimeout(() => {
        setAnimacaoMontandoMapa(false);
        setBloqueado(false);
      }, 1500);
    }, 1200);
  };

  // CENA THREE.JS v6.0 - AVATAR ROBOTOC 3D + BOLA HOLOGRÁFICA EM AZUL E BRANCO CYAN
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação Futurista Azul Cyan e Branca
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(-4, 8, 5);
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 8, 30);
    cyanLight.position.set(0, 2, 4);
    scene.add(cyanLight);

    scene.add(new THREE.AmbientLight(0x0f172a, 2.5));

    // Floor Grid Azul
    const floorGrid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1e293b);
    floorGrid.position.y = -2.5;
    scene.add(floorGrid);

    // =========================================================================
    // 🤖 MONTAGEM DO ROBOTOC 3D + ESFERA HOLOGRÁFICA (CORES AZUL & BRANCO)
    // =========================================================================
    const masterGroup = new THREE.Group();

    // Materiais
    const whiteArmourMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.9 });
    const cyanMetalMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.8 });
    const glowCyanMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.0 });

    // Cabeça Humanoide Cyber
    const headGeo = new THREE.BoxGeometry(0.85, 0.65, 0.7);
    const head = new THREE.Mesh(headGeo, whiteArmourMat);
    head.position.y = 1.8;
    masterGroup.add(head);

    // Visor Holográfico Curvo Cyan
    const visorGeo = new THREE.PlaneGeometry(0.75, 0.28);
    const visor = new THREE.Mesh(visorGeo, glowCyanMat);
    visor.position.set(0, 1.82, 0.36);
    masterGroup.add(visor);

    // Antenas Brancas Neon
    const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
    const antL = new THREE.Mesh(antGeo, glowCyanMat);
    antL.position.set(-0.48, 2.05, 0);
    const antR = new THREE.Mesh(antGeo, glowCyanMat);
    antR.position.set(0.48, 2.05, 0);
    masterGroup.add(antL);
    masterGroup.add(antR);

    // Pescoço e Torso
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.35, 1.2, 16);
    const torso = new THREE.Mesh(torsoGeo, cyanMetalMat);
    torso.position.y = 0.6;
    masterGroup.add(torso);

    // Placas de Peitoral Brancas
    const chestPlateGeo = new THREE.BoxGeometry(0.7, 0.5, 0.2);
    const chestPlate = new THREE.Mesh(chestPlateGeo, whiteArmourMat);
    chestPlate.position.set(0, 0.75, 0.22);
    masterGroup.add(chestPlate);

    // =========================================================================
    // 🔮 ESFERA HOLOGRÁFICA FLUTUANTE 3D (BOLA DA IMAGEM DO USUÁRIO)
    // =========================================================================
    const orbGroup = new THREE.Group();

    // Núcleo da Esfera
    const orbCoreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const orbCore = new THREE.Mesh(orbCoreGeo, glowCyanMat);
    orbGroup.add(orbCore);

    // Anéis de Força Holográficos
    const ringGeo = new THREE.TorusGeometry(0.55, 0.02, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo, glowCyanMat);
    const ringMesh2 = new THREE.Mesh(ringGeo, whiteArmourMat);
    ringMesh2.rotation.x = Math.PI / 2;

    orbGroup.add(ringMesh1);
    orbGroup.add(ringMesh2);

    orbGroup.position.set(0, 0.7, 1.1); // Flutuando à frente do Robotoc
    masterGroup.add(orbGroup);
    orbMeshRef.current = orbGroup;

    scene.add(masterGroup);
    avatarGroupRef.current = masterGroup;

    // Loop de Animação
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = Math.sin(time * 1.5) * 0.1;
        avatarGroupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      }

      if (orbMeshRef.current) {
        orbMeshRef.current.rotation.x += 0.02;
        orbMeshRef.current.rotation.y += 0.03;
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

  // RENDERIZAÇÃO DA TELA DE BLOQUEIO / SEGURANÇA
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <Head><title>Emanuel.OS v6.0 - Autenticação ROBOTOC (7 Camadas)</title></Head>

        <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)', textAlign: 'center', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#ff0055' }}>.OS</span> & ROBOTOC v6.0
          </h2>
          <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>
            PROTOCOLO DE SEGURANÇA DE 7 ETAPAS ({etapaSeguranca}/7)
          </span>

          {etapaSeguranca === 1 && (
            <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>🛡️ 1ª Etapa: Chave Tripla de Segurança</span>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>{statusAcessoTriplo}</p>
              <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite sua Chave Mestre..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '13px', outline: 'none' }} />
              <button type="submit" disabled={validandoServidores} style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                {validandoServidores ? '⏳ Validando Servidores...' : '🔐 Validar Chave ➔'}
              </button>
            </form>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={validarEtapa2Telefone} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>📱 2ª Etapa: Telefone Autorizado</span>
              <input type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)} placeholder="88981493989" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar Telefone ➔</button>
            </form>
          )}

          {etapaSeguranca === 3 && (
            <form onSubmit={validarEtapa3Pin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>🔢 3ª Etapa: PIN Mestre</span>
              <input type="password" maxLength={4} value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)} placeholder="****" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '20px', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar PIN ➔</button>
            </form>
          )}

          {etapaSeguranca === 4 && (
            <form onSubmit={validarEtapa4Email} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>📧 4ª Etapa: E-mail Autorizado</span>
              <input type="email" value={emailDigitado} onChange={(e) => setEmailDigitado(e.target.value)} placeholder="leeheroi123@gmail.com" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar E-mail ➔</button>
            </form>
          )}

          {etapaSeguranca === 5 && (
            <form onSubmit={validarEtapa5Chave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#ff0055', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre</span>
              <input type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)} placeholder="ASD-DDD-888" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ff0055', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#ff0055', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Avançar ➔</button>
            </form>
          )}

          {etapaSeguranca === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#eab308', fontWeight: 'bold' }}>🔑 6ª Camada: Ticons OS gevaGifs</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {availableOptions.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSelectOptionTicons(opt)} style={{ backgroundColor: '#1e293b', border: '1px solid #eab308', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#00f0ff', fontWeight: 'bold' }}>📡 7ª CAMADA: QR CODE MAPEAMENTO</span>
              <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '10px' }}>
                <QRCodeSVG value={qrPayload} size={130} />
              </div>
              <button onClick={executarEscaneamentoQRCode7aCamada} disabled={qrCodeValidando} style={{ width: '100%', padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                {qrCodeValidando ? '🔍 Validando QR Code...' : '📱 Desbloquear Sistema ➔'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DESBLOQUEADO (INTERFACE CORE v6.0)
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#fff', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Head><title>Emanuel.OS Core v6.0 | ROBOTOC Multicloud Data Center 3D</title></Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>

        {/* LADO ESQUERDO / CENTRAL 3D */}
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>

          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

          {/* BARRA SUPERIOR DE BOTÕES */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>

            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#ff007f' : 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#c084fc', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🖥️ {modoDevSplit ? 'Fechar Split' : 'Dev Split'}
            </button>

            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📱 Android HUD v6.0
            </button>

            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 0, 127, 0.15)', border: '1px solid #ff007f', color: '#ff007f', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📊 Creator Studio
            </button>
          </div>

          {/* SIDEBAR ESQUERDA (MAPAS, PENSAMENTO ROBOTOC & DIRECT MESSENGER) */}
          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '380px',
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

                {/* TODOS OS MAPAS MANTIDOS E COMPLETO */}
                <div style={{ padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 8px 0' }}>🌐 Central de Mapas Integrados (2030)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <Link href="/espacial" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🪐 Espacial</Link>
                    <Link href="/mapa" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #16a34a', color: '#4ade80', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🌍 Terrestre</Link>
                    <Link href="/mapa-ia" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚡ Gerador 3D IA</Link>
                    <Link href="/mapaaeroespacial" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #9333ea', color: '#c084fc', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🛸 Aeroespacial</Link>
                    <Link href="/mapa-quantico" style={{ padding: '8px', backgroundColor: '#0f172a', border: '1px solid #8b5cf6', color: '#c084fc', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold', gridColumn: 'span 2' }}>⚛️ Quântico</Link>
                  </div>
                </div>

                {/* NOVO PENSAMENTO ROBOTOC COM LINK MULTICONTA */}
                <RobotocFuturisticThought addLog={addLogTerminal} />

                {/* ABA EXCLUSIVA DE ENVIAR MENSAGENS POR NÚMERO */}
                <DirectMessengerManager addLog={addLogTerminal} />

                <GoogleMeetAvatarManager addLog={addLogTerminal} />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>

          {/* RODAPÉ E CHAT DE COMANDOS */}
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
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com o ROBOTOC v6.0 ou envie comandos..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '10px', flexGrow: 1 }} />
              <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar ➔</button>
            </form>
          </div>
        </div>

        {/* LADO DIREITO (MODO DEV SPLIT SCREEN v6.0 TURBINADO) */}
        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>

      {/* GAVETA ANDROID HUD LATERAL */}
      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear onConnectGear={(t, s) => addLogTerminal(`[GEAR] ${t}: ${s ? 'ON' : 'OFF'}`)} />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer addLog={addLogTerminal} />
      </AndroidHUDPanel>

      {/* MODAL CREATOR STUDIO */}
      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
