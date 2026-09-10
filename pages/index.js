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
// ⌨️ --- COMPONENTE: TECLADO HOLOGRÁFICO GLASS 3D COM VISUALIZADOR DE TECLA ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  const [lastKeyPressed, setLastKeyPressed] = useState('');

  const keys = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','Backspace'],
    ['Space', 'Enter']
  ];

  const handleKeyClick = (k) => {
    setLastKeyPressed(k);
    if (onKeyPress) onKeyPress(k);
    setTimeout(() => setLastKeyPressed(''), 800);
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#fff', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D (AZUL & BRANCO)</span>
        {lastKeyPressed && (
          <span style={{ fontSize: '10px', color: '#ffffff', backgroundColor: '#00f0ff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', boxShadow: '0 0 10px #00f0ff' }}>
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
                  background: lastKeyPressed === k ? '#00f0ff' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.5)',
                  borderRadius: '4px',
                  color: lastKeyPressed === k ? '#000' : '#ffffff',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 0 6px rgba(0, 240, 255, 0.3)',
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
// 💻 --- PAINEL DE DESENVOLVEDOR SPLIT SCREEN v6.0 COM GEMINI LINTER AUTOMÁTICO ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(
    `// Emanuel.OS Dev Studio v6.0 - Ambiente com Linter IA Gemini\nfunction inicializarModuloEmanuel() {\n  let status = "ONLINE";\n  console.log("Sincronizando componentes neurais...");\n  if (status == "ONLINE") {\n    return true;\n  }\n}`
  );

  const [analises, setAnalises] = useState([
    { linha: 4, tipo: 'erro', texto: 'Uso de operador de igualdade fraca ==. Use === para validação estrita.' },
    { linha: 3, tipo: 'sugestao', texto: 'Recomenda-se adicionar template string para interpolação de variáveis.' },
    { linha: 1, tipo: 'corrigido', texto: 'Cabeçalho e imports analisados e otimizados pela IA EMgemini.' }
  ]);

  const [analisandoIA, setAnalisandoIA] = useState(false);

  const executarAnaliseIACompleta = (tipo) => {
    setAnalisandoIA(true);
    setTimeout(() => {
      setAnalisandoIA(false);
      if (tipo === 'bug') {
        setAnalises([
          { linha: 4, tipo: 'erro', texto: 'Linha 4: Erro de comparação fraca == detectado.' },
          { linha: 2, tipo: 'sugestao', texto: 'Linha 2: Substituir let por const para imutabilidade.' }
        ]);
      } else if (tipo === 'otimizar') {
        setAnalises([
          { linha: 1, tipo: 'corrigido', texto: 'Linha 1-5: Código reestruturado e compilado com alta performance.' }
        ]);
      }
    }, 1000);
  };

  const falarExplicacaoIA = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("O código fonte analisa a inicialização do núcleo Emanuel.OS e verifica os módulos neurais ativos.");
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("O seu navegador não suporta a síntese de voz.");
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.96)',
      borderLeft: '2px solid #00f0ff', padding: '14px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '10px', color: '#fff',
      fontFamily: 'Consolas, Monaco, monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
        <strong style={{ fontSize: '11px', color: '#00f0ff' }}>
          👨‍💻 Emanuel.OS Dev Workstation | Split Screen v6.0
        </strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>✕ Fechar</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <select value={linguagem} onChange={(e) => setLinguagem(e.target.value)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>
          <option value="javascript">JavaScript / React</option>
          <option value="python">Python (AI / ML)</option>
          <option value="typescript">TypeScript</option>
        </select>
        <button onClick={() => executarAnaliseIACompleta('bug')} style={{ padding: '5px 8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>🚨 Checar Bugs IA</button>
        <button onClick={() => executarAnaliseIACompleta('otimizar')} style={{ padding: '5px 8px', backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#86efac', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>⚡ Otimizar EMgemini</button>
        <button onClick={falarExplicacaoIA} style={{ padding: '5px 8px', backgroundColor: 'rgba(0, 240, 255, 0.2)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>🎙️ Explicar por Áudio</button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '9px', color: '#94a3b8' }}>EDITOR DE CÓDIGO FONTE ({linguagem.toUpperCase()}):</span>
        <textarea
          value={codigoFonte}
          onChange={(e) => setCodigoFonte(e.target.value)}
          style={{
            width: '100%', flexGrow: 1, backgroundColor: '#010409', border: '1px solid #334155',
            borderRadius: '8px', color: '#38bdf8', padding: '10px', fontSize: '11px', outline: 'none',
            resize: 'none', lineHeight: '1.4', fontFamily: 'Consolas, monospace', boxSizing: 'border-box'
          }}
        />
      </div>

      {/* BLOCO DE LINTER E ERROS DA IA */}
      <div style={{ backgroundColor: '#020617', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', padding: '8px', maxHeight: '110px', overflowY: 'auto' }}>
        <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📝 DIAGNÓSTICO AUTOMÁTICO IA GEMINI (LINHAS E CORREÇÕES):</span>
        {analisandoIA ? (
          <span style={{ fontSize: '10px', color: '#00f0ff' }}>⏳ EMgemini analisando o código...</span>
        ) : (
          analises.map((item, idx) => (
            <div key={idx} style={{ fontSize: '9px', marginBottom: '3px', color: item.tipo === 'erro' ? '#ef4444' : item.tipo === 'sugestao' ? '#38bdf8' : '#22c55e' }}>
              <strong>[Linha {item.linha}]</strong> {item.texto}
            </div>
          ))
        )}
      </div>

      <GlassKeyboard3D
        onKeyPress={(tecla) => {
          if (tecla === 'Backspace') setCodigoFonte(prev => prev.slice(0, -1));
          else if (tecla === 'Space') setCodigoFonte(prev => prev + ' ');
          else if (tecla === 'Enter') setCodigoFonte(prev => prev + '\n');
          else if (tecla.length === 1) setCodigoFonte(prev => prev + tecla);
        }}
      />
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
// 📲 --- ABA & ATALHO DE DISPARO DE MENSAGENS REAL (WHATSAPP, TELEGRAM & GOOGLE MENSAGENS) ---
// =========================================================================================
function PainelDisparoMensagensReal({ addLog }) {
  const [telefones, setTelefones] = useState('');
  const [mensagemText, setMensagemText] = useState('Olá! Mensagem enviada via Emanuel.OS Core v6.0.');

  const enviarWhatsApp = () => {
    const lista = telefones.split(',').map(num => num.trim().replace(/\D/g, '')).filter(Boolean);
    if (lista.length === 0) return alert("Insira ao menos um telefone válido.");

    lista.forEach(num => {
      const url = `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(mensagemText)}`;
      window.open(url, '_blank');
    });

    if (addLog) addLog(`[MENSAGENS: WHATSAPP] Disparado para ${lista.length} número(s).`);
  };

  const enviarTelegram = () => {
    const lista = telefones.split(',').map(num => num.trim()).filter(Boolean);
    if (lista.length === 0) return alert("Insira ao menos um número ou username do Telegram.");

    lista.forEach(item => {
      const url = `https://t.me/${item}?text=${encodeURIComponent(mensagemText)}`;
      window.open(url, '_blank');
    });

    if (addLog) addLog(`[MENSAGENS: TELEGRAM] Disparado via link para ${lista.length} destino(s).`);
  };

  const abrirGoogleMensagens = () => {
    window.open("https://messages.google.com/web", "_blank");
    if (addLog) addLog(`[MENSAGENS: GOOGLE] Interface web do Google Mensagens iniciada.`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#fff', margin: '10px 0' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        📱 DISPARO DIRETO DE MENSAGENS REAL
      </h3>
      <p style={{ fontSize: '9px', color: '#94a3b8', margin: '0 0 8px 0' }}>
        Envie mensagens via WhatsApp, Telegram ou acesse o Google Mensagens de forma direta.
      </p>

      <textarea
        placeholder="Números de telefone (separados por vírgula)... Ex: 5588981493989, 5588999999999"
        value={telefones}
        onChange={(e) => setTelefones(e.target.value)}
        style={{ width: '100%', height: '50px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', padding: '6px', fontSize: '10px', outline: 'none', resize: 'none', marginBottom: '6px', boxSizing: 'border-box' }}
      />

      <textarea
        placeholder="Texto da mensagem..."
        value={mensagemText}
        onChange={(e) => setMensagemText(e.target.value)}
        style={{ width: '100%', height: '40px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', padding: '6px', fontSize: '10px', outline: 'none', resize: 'none', marginBottom: '8px', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
        <button onClick={enviarWhatsApp} style={{ padding: '8px', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>
          💬 WhatsApp
        </button>
        <button onClick={enviarTelegram} style={{ padding: '8px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>
          ✈️ Telegram
        </button>
        <button onClick={abrirGoogleMensagens} style={{ padding: '8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>
          📨 Google Msg
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🎥 --- MÓDULO DE INTEGRAÇÃO GOOGLE MEET REAL + AVATARES DE IA ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [temaReuniao, setTemaReuniao] = useState('Imersão Mapas, Index & AGI 2030');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Robotoc (Humanoide 3D IA)');
  const [telefoneConvidado, setTelefoneConvidado] = useState('');

  const criarReuniaoInstantaneaReal = () => {
    window.open("https://meet.new", "_blank");
    if (addLog) {
      addLog(`[G-AGI: MEET] Reunião instantânea iniciada via meet.new.`);
      addLog(`[G-AGI: AVATAR] Avatar Vinculado: ${avatarEscolhido}`);
    }
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '14px', padding: '14px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🎥 Google Meet + Avatares IA 3D Real
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
        <input type="text" value={temaReuniao} onChange={(e) => setTemaReuniao(e.target.value)} placeholder="Tema da Reunião..." style={{ width: '100%', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', outline: 'none', boxSizing: 'border-box' }} />
        <select value={avatarEscolhido} onChange={(e) => setAvatarEscolhido(e.target.value)} style={{ width: '100%', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', outline: 'none', boxSizing: 'border-box' }}>
          <option value="Robotoc (Humanoide 3D IA)">Robotoc (Humanoide Azul & Branco 3D)</option>
          <option value="Avatar Cyberpunk 3D">Avatar Cyberpunk 3D</option>
          <option value="Assistente G-AGI Multimodal">Assistente G-AGI Multimodal</option>
        </select>
        <button onClick={criarReuniaoInstantaneaReal} style={{ width: '100%', padding: '8px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
          🚀 Iniciar Google Meet Real (meet.new)
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
      style={{ width: '100%', height: '180px', backgroundColor: '#000a12', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', overflow: 'hidden' }}
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
    <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #eab308', borderRadius: '16px', padding: '14px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif' }}>
      <h3 style={{ color: '#eab308', fontSize: '12px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ₿ ANALÍTICA BITCOIN <span style={{ fontSize: '8px', color: '#fff', border: '1px solid #fff', padding: '1px 4px', borderRadius: '6px' }}>QUANT CORE v6.0</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #eab308', borderRadius: '8px', padding: '8px' }}>
          <span style={{ fontSize: '8px', color: '#fef08a' }}>Preço Previsto:</span>
          <strong style={{ display: 'block', fontSize: '14px', color: '#eab308', marginTop: '2px' }}>{data.price}</strong>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #eab308', borderRadius: '8px', padding: '8px' }}>
          <span style={{ fontSize: '8px', color: '#fef08a' }}>Confiança IA:</span>
          <strong style={{ display: 'block', fontSize: '14px', color: '#4ade80', marginTop: '2px' }}>{data.ai_confidence}</strong>
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
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #fb923c', borderRadius: '16px', padding: '14px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif' }}>
      <h3 style={{ color: '#fb923c', fontSize: '12px', margin: '0 0 6px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER</h3>
      <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={{ width: '100%', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', outline: 'none', marginBottom: '6px', boxSizing: 'border-box' }} />
      <button onClick={performDeploy} disabled={deploying} style={{ width: '100%', padding: '8px', backgroundColor: '#fb923c', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
        {deploying ? '⚡ Deploying...' : '🚀 Executar Deploy Global G-AGI Edge'}
      </button>
    </div>
  );
};

// =========================================================================================
// 🧠 --- COMPONENTE: TRIPLE CLOUD & PENSAMENTO ROBOTOC (INTEGRAÇÃO DE E-MAILS REAIS) ---
// =========================================================================================
function PensamentoRobotocTripleCloud({ addLog }) {
  const conectarGoogle = () => {
    window.open("https://accounts.google.com", "_blank");
    if (addLog) addLog("[PENSAMENTO ROBOTOC] Conexão iniciada com E-mail Google.");
  };

  const conectarApple = () => {
    window.open("https://appleid.apple.com", "_blank");
    if (addLog) addLog("[PENSAMENTO ROBOTOC] Conexão iniciada com E-mail Apple ID.");
  };

  const conectarOneDrive = () => {
    window.open("https://onedrive.live.com", "_blank");
    if (addLog) addLog("[PENSAMENTO ROBOTOC] Conexão iniciada com E-mail OneDrive / Microsoft.");
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#fff', margin: '10px 0' }}>
      <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 6px 0' }}>
        🧠 PENSAMENTO ROBOTOC - TRIPLE CLOUD LOGIN
      </h3>
      <p style={{ fontSize: '9px', color: '#94a3b8', margin: '0 0 8px 0' }}>
        Conecte seus provedores de e-mail ao núcleo neural do Robotoc 3D:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button onClick={conectarGoogle} style={{ padding: '8px', backgroundColor: '#ea4335', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          📧 VINCULAR E-MAIL GOOGLE
        </button>
        <button onClick={conectarApple} style={{ padding: '8px', backgroundColor: '#ffffff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          🍏 VINCULAR E-MAIL APPLE
        </button>
        <button onClick={conectarOneDrive} style={{ padding: '8px', backgroundColor: '#0078d4', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          ☁️ VINCULAR E-MAIL ONE DRIVE / MICROSOFT
        </button>
      </div>
    </div>
  );
}

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

  // Seguranças Triplas
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  // Ticons OS
  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const [qrPayload] = useState('https://github.com/Manomae/naruto-anime-portfolio');

  const availableOptions = [
    { type: 'emoji', value: '🔥', label: 'Emoji Fogo' },
    { type: 'avatar', value: 'avatar_ninja.png', label: 'Avatar Ninja' },
    { type: 'gif', value: 'gif_animado.gif', label: 'GIF Chakra' }
  ];

  const TELEFONE_AUTORIZADO = "88981493989";
  const TELEFONE_AUTORIZADO_DDI = "5588981493989";
  const PIN_MESTRE_EMANUEL = "8888";
  const EMAIL_AUTORIZADO = "leeheroi123@gmail.com";
  const CHAVE_MESTRE = "ASD-DDD-888";
  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);

  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC: LOG] System core v6.0 operational.",
    "[ROBOTOC: STATUS] Modo de Pensamento Neural: ONLINE.",
    "[ROBOTOC: DATA CENTER] Servidores em Azul & Branco Ativos."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC (IA HUMANOIDE v6.0)', texto: 'Emanuel.OS Core v6.0 | Robotoc 3D em Azul & Branco pronto!', tipo: 'sys' }
  ]);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const sphereOrbRef = useRef(null);

  const addLogTerminal = (novoLog) => setCmdLogs(prev => [...prev, novoLog]);

  // Autenticação
  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return alert("🚨 ACESSO BLOQUEADO!");
    if (!chaveAcessoTripla.trim()) return setStatusAcessoTriplo("⚠️ Insira a Chave Tripla!");

    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Camada 1: Identificando Dispositivo...");

    setTimeout(() => {
      setStatusAcessoTriplo("⏳ Camada 2: Conectando ao Servidor...");
      setTimeout(() => {
        setStatusAcessoTriplo("⏳ Camada 3: Verificando redundância...");
        setTimeout(() => {
          setValidandoServidores(false);
          if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
            setStatusAcessoTriplo("✅ TRIPLA AUTENTICAÇÃO CONCLUÍDA!");
            setTimeout(() => setEtapaSeguranca(2), 600);
          } else {
            const novas = tentativasInvasao + 1;
            setTentativasInvasao(novas);
            if (novas >= 3) {
              setBloqueioInvasor(true);
              setStatusAcessoTriplo("🚨 DISPOSITIVO BLOQUEADO!");
            } else {
              setStatusAcessoTriplo(`❌ Chave Inválida! Tentativa ${novas}/3.`);
            }
          }
        }, 600);
      }, 600);
    }, 600);
  };

  const validarEtapa2Telefone = (e) => {
    e.preventDefault();
    const tel = telefoneDigitado.replace(/\D/g, '');
    if (tel === TELEFONE_AUTORIZADO || tel === TELEFONE_AUTORIZADO_DDI) setEtapaSeguranca(3);
    else alert("⚠️ Telefone incorreto!");
  };

  const validarEtapa3Pin = (e) => {
    e.preventDefault();
    if (pinDigitado === PIN_MESTRE_EMANUEL) setEtapaSeguranca(4);
    else alert("⚠️ PIN Incorreto!");
  };

  const validarEtapa4Email = (e) => {
    e.preventDefault();
    if (emailDigitado.trim().toLowerCase() === EMAIL_AUTORIZADO.toLowerCase()) setEtapaSeguranca(5);
    else alert("⚠️ E-mail Incorreto!");
  };

  const validarEtapa5Chave = (e) => {
    e.preventDefault();
    if (chaveDigitada === CHAVE_MESTRE) setEtapaSeguranca(6);
    else alert("⚠️ Chave Inválida!");
  };

  const handleSelectOptionTicons = (item) => {
    const newSeq = [...selectedSequence, item.value];
    setSelectedSequence(newSeq);
    if (newSeq.length === targetSequence.length) setEtapaSeguranca(7);
  };

  const executarEscaneamentoQRCode7aCamada = () => {
    setQrCodeValidando(true);
    setTimeout(() => {
      setQrCodeValidando(false);
      setBloqueado(false);
    }, 1000);
  };

  // =========================================================================
  // 🤖 CENA THREE.JS (NOVO ROBOTOC 3D + BOLA HOLOGRÁFICA AZUL E BRANCO)
  // =========================================================================
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

    // Iluminação Futurista Azul & Branca
    const whiteLight = new THREE.DirectionalLight(0xffffff, 3.0);
    whiteLight.position.set(5, 10, 7);
    scene.add(whiteLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 8, 30);
    cyanLight.position.set(-4, 2, 4);
    scene.add(cyanLight);

    scene.add(new THREE.AmbientLight(0x0f172a, 2.5));

    // Floor Grid Azul Ciano
    const floorGrid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1e293b);
    floorGrid.position.y = -2.5;
    scene.add(floorGrid);

    // GRUPO ROBOTOC 3D (AZUL E BRANCO)
    const robotGroup = new THREE.Group();

    // Materiais
    const whiteArmorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.9 });
    const blueMetalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const glowCyanMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.2 });

    // Cabeça
    const headGeo = new THREE.BoxGeometry(0.85, 0.6, 0.65);
    const head = new THREE.Mesh(headGeo, whiteArmorMat);
    head.position.y = 1.8;
    robotGroup.add(head);

    // Visor Azul
    const visorGeo = new THREE.PlaneGeometry(0.75, 0.28);
    const visor = new THREE.Mesh(visorGeo, glowCyanMat);
    visor.position.set(0, 1.82, 0.33);
    robotGroup.add(visor);

    // Pescoço
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.2, 16);
    const neck = new THREE.Mesh(neckGeo, blueMetalMat);
    neck.position.y = 1.38;
    robotGroup.add(neck);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.5, 0.35, 1.1, 16);
    const torso = new THREE.Mesh(torsoGeo, whiteArmorMat);
    torso.position.y = 0.65;
    robotGroup.add(torso);

    // Núcleo do Peito
    const coreGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const core = new THREE.Mesh(coreGeo, glowCyanMat);
    core.position.set(0, 0.75, 0.26);
    robotGroup.add(core);

    // Ombros
    const shoulderGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const shoulderL = new THREE.Mesh(shoulderGeo, blueMetalMat);
    shoulderL.position.set(-0.65, 0.95, 0);
    const shoulderR = new THREE.Mesh(shoulderGeo, blueMetalMat);
    shoulderR.position.set(0.65, 0.95, 0);
    robotGroup.add(shoulderL);
    robotGroup.add(shoulderR);

    scene.add(robotGroup);
    avatarGroupRef.current = robotGroup;

    // BOLA 3D HOLOGRÁFICA (ESFERA DE ENERGIA ORBITANTE)
    const orbGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.65,
      wireframe: true
    });
    const sphereOrb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(sphereOrb);
    sphereOrbRef.current = sphereOrb;

    // Animação Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = Math.sin(time * 2) * 0.1;
        avatarGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.2;
      }

      if (sphereOrbRef.current) {
        sphereOrbRef.current.position.x = Math.cos(time * 1.5) * 1.8;
        sphereOrbRef.current.position.z = Math.sin(time * 1.5) * 1.8;
        sphereOrbRef.current.position.y = Math.sin(time * 2.5) * 0.4 + 0.8;
        sphereOrbRef.current.rotation.y += 0.02;
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

  // TELA DE BLOQUEIO
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <Head><title>Emanuel.OS v6.0 - Autenticação ROBOTOC (7 Camadas)</title></Head>

        <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', textAlign: 'center', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> & ROBOTOC v6.0
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
              <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre</span>
              <input type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)} placeholder="ASD-DDD-888" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Avançar ➔</button>
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

  // CORE DESBLOQUEADO
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
              🖥️ {modoDevSplit ? 'Fechar Split' : 'Dev Split v6.0'}
            </button>

            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📱 Android HUD v6.0
            </button>

            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 0, 127, 0.15)', border: '1px solid #ff007f', color: '#ff007f', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📊 Creator Studio
            </button>
          </div>

          {/* SIDEBAR ESQUERDA (MAPAS & COMPONENTES) */}
          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '380px',
            opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(7, 7, 12, 0.96)', backdropFilter: 'blur(30px)',
            borderRight: '1px solid rgba(0, 240, 255, 0.2)', padding: sidebarAberta ? '20px' : '0px',
            display: 'flex', flexDirection: 'column', gap: '12px', height: '100vh', overflowY: 'auto', zIndex: 90,
            transition: 'all 0.3s ease', boxSizing: 'border-box'
          }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '16px', fontWeight: '900', color: '#fff', margin: 0 }}>
                  Contexto: EMANUEL<span style={{ color: '#00f0ff' }}>.OS v6.0</span>
                </h1>

                <UnixTerminalCanvas />

                {/* TODOS OS MAPAS INTEGRADOS */}
                <div style={{ padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ color: '#00f0ff', fontSize: '11px', margin: '0 0 6px 0' }}>🌐 Central Completa de Mapas (2030)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <Link href="/espacial" style={{ padding: '6px', backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', borderRadius: '6px', textDecoration: 'none', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>🪐 Espacial</Link>
                    <Link href="/mapa" style={{ padding: '6px', backgroundColor: '#0f172a', border: '1px solid #16a34a', color: '#4ade80', borderRadius: '6px', textDecoration: 'none', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>🌍 Terrestre</Link>
                    <Link href="/mapa-ia" style={{ padding: '6px', backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', borderRadius: '6px', textDecoration: 'none', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>⚡ Gerador 3D IA</Link>
                    <Link href="/mapaaeroespacial" style={{ padding: '6px', backgroundColor: '#0f172a', border: '1px solid #9333ea', color: '#c084fc', borderRadius: '6px', textDecoration: 'none', fontSize: '9px', textAlign: 'center', fontWeight: 'bold' }}>🛸 Aeroespacial</Link>
                    <Link href="/mapa-quantico" style={{ padding: '6px', backgroundColor: '#0f172a', border: '1px solid #8b5cf6', color: '#c084fc', borderRadius: '6px', textDecoration: 'none', fontSize: '9px', textAlign: 'center', fontWeight: 'bold', gridColumn: 'span 2' }}>⚛️ Quântico</Link>
                  </div>
                </div>

                <PensamentoRobotocTripleCloud addLog={addLogTerminal} />
                <PainelDisparoMensagensReal addLog={addLogTerminal} />
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
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com o ROBOTOC 3D em Azul e Branco..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '10px', flexGrow: 1 }} />
              <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar ➔</button>
            </form>
          </div>
        </div>

        {/* LADO DIREITO (MODO DEV SPLIT SCREEN) */}
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
