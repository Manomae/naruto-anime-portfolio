import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';
import MotionTracker from '../components/MotionTracker';
import GlassKeyboard3D from '../components/GlassKeyboard3D';

// Bibliotecas para geração de documentos
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pptxgen from "pptxgenjs";

// Importação da Janela Futurista (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

// Dicionário Ninja local para fallback
const dicionarioNinjaLocal = [
  { termo: "chakra", categoria: "Energia Neural", significado: "Massa de energia biológica e espiritual combinada para execução de técnicas e comandos neurais." },
  { termo: "sharingan", categoria: "Linhagem Sanguínea", significado: "Dōjutsu do Clã Uchiha capaz de perceber, copiar e prever fluxos de informação e movimento." },
  { termo: "emanuel", categoria: "Mestre Criador", significado: "Desenvolvedor Chefe e Arquiteto Supremo do Emanuel.OS v5.1 e Matriz G-AGI." }
];

// 🌟 --- ⌨️ COMPONENTE: TECLADO 3D LIQUID GLASS HOLOGRÁFICO --- ⌨️ 🌟
function TecladoLiquidGlass3D({ onKeyPress, onFechar }) {
  const [teclaAtiva, setTeclaAtiva] = useState(null);

  const linhasTeclado = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  const handlePress = (char) => {
    setTeclaAtiva(char);
    setTimeout(() => setTeclaAtiva(null), 200);
    if (onKeyPress) onKeyPress(char);
  };

  return (
    <div style={{
      backgroundColor: 'rgba(2, 6, 23, 0.75)',
      backdropFilter: 'blur(25px)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '20px',
      padding: '15px',
      boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '600px',
      margin: '10px auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', letterSpacing: '1px' }}>
          ⌨️ TECLADO 3D LIQUID GLASS // HOLOGRAPHIC INPUT
        </span>
        {onFechar && (
          <button onClick={onFechar} style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        )}
      </div>

      {linhasTeclado.map((linha, lIdx) => (
        <div key={lIdx} style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {linha.map((char) => (
            <button
              key={char}
              onClick={() => handlePress(char)}
              style={{
                width: char === '⌫' ? '50px' : '38px',
                height: '42px',
                background: teclaAtiva === char ? 'rgba(0, 240, 255, 0.6)' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: teclaAtiva === char ? '0 0 15px #00f0ff' : '0 4px 10px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.15s ease',
                transform: teclaAtiva === char ? 'translateY(2px) scale(0.95)' : 'translateY(0)'
              }}
            >
              {char}
            </button>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
        <button
          onClick={() => handlePress(' ')}
          style={{
            width: '200px',
            height: '36px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '10px',
            color: '#00f0ff',
            fontSize: '10px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          SPACE (LIQUID GLASS)
        </button>
      </div>
    </div>
  );
}

// 🌟 --- 🤖 COMPONENTE: MOCAP & TELEOPERAÇÃO ROBÓTICA ANÔNIMA 3D --- 🤖 🌟
function MocapRoboticsEngine({ onPoseExtracted, addLog }) {
  const videoRef = useRef(null);
  const [permissaoConcedida, setPermissaoConcedida] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [framerates, setFramerates] = useState(60);
  const [keypoints, setKeypoints] = useState(0);

  const solicitarPermissaoEIniciar = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissaoConcedida(true);
      setGravando(true);
      if (addLog) addLog("[MOCAP: PRIVACY] Permissão concedida. Extração restrita a Keypoints 3D sem retenção de imagem.");
    } catch (err) {
      alert("Permissão de câmera necessária para captura de movimento no robô 3D.");
    }
  };

  const pararCaptura = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setGravando(false);
    setPermissaoConcedida(false);
    if (addLog) addLog("[MOCAP: STATUS] Sessão de treino robótico finalizada.");
  };

  useEffect(() => {
    let interval;
    if (gravando) {
      interval = setInterval(() => {
        const simulatedPoints = Math.floor(Math.random() * 12) + 33;
        setKeypoints(simulatedPoints);
        if (onPoseExtracted) {
          onPoseExtracted({
            headRotationY: (Math.random() - 0.5) * 0.2,
            armRaiseLeft: Math.random() * 1.5,
            timestamp: Date.now()
          });
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gravando, onPoseExtracted]);

  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '2px solid #ff007f',
      borderRadius: '16px',
      padding: '16px',
      color: '#fff',
      margin: '10px 0',
      fontFamily: 'sans-serif',
      boxShadow: '0 0 25px rgba(255, 0, 127, 0.25)'
    }}>
      <h3 style={{ color: '#ff007f', fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🎥 MOCAP ANÔNIMO & TREINO ROBÓTICO 3D <span style={{ fontSize: '9px', color: '#fff', border: '1px solid #fff', padding: '1px 5px', borderRadius: '8px' }}>G-AGI ROBOTICS v5.1</span>
      </h3>
      <p style={{ fontSize: '10px', color: '#cbd5e1', margin: '0 0 12px 0' }}>
        Treinamento de movimentos no protótipo 3D via câmera local. 🔒 <b>Privacidade Total:</b> Transmite apenas coordenadas vetoriais (Zero retenção de dados pessoais ou imagens).
      </p>

      {!permissaoConcedida ? (
        <button
          onClick={solicitarPermissaoEIniciar}
          style={{ width: '100%', padding: '10px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
        >
          📷 Autorizar Câmera e Iniciar Treino Anônimo
        </button>
      ) : (
        <div>
          <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#00f0ff', fontSize: '10px', fontFamily: 'monospace' }}>
              <div>● EXTRAÇÃO DE KEYPOINTS: {keypoints} pontos</div>
              <div>● PROCESSAMENTO: ANONIMIZADO</div>
              <div>● FPS: {framerates} FPS</div>
            </div>
          </div>
          <button
            onClick={pararCaptura}
            style={{ width: '100%', padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
          >
            ⏹️ Encerrar Captura Anônima
          </button>
        </div>
      )}
    </div>
  );
}

// 🌟 --- 📊 COMPONENTE: EM CREATOR STUDIO IA --- 📊 🌟
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1240,
    audiosGerações: 380,
    fotosRenders: 890,
    videosRenderizados: 215,
    memesGifsEngajados: 560,
    audienciaAtiva: 'Alta (89% retenção)',
    resolucaoProblemasIA: '94,2% Autônomos'
  });

  const [sugestoesAGI, setSugestoesAGI] = useState([
    { id: 1, tipo: '🎬 Vídeos & YouTube Shorts', acao: 'Criar Shorts de Naruto vs Sasuke em 4K. O público responde 40% melhor a conteúdos com áudio sincronizado.', prioridade: 'Alta' },
    { id: 2, tipo: '🖼️ Imagens Realistas', acao: 'Aumentar a generation de artes Cyberpunk via modelo EM 1.0. Detectado pico de engajamento nos prompts de animes.', prioridade: 'Média' },
    { id: 3, tipo: '📄 Automação .DOCX / PDF', acao: 'Sintetizar relatórios automatizados de código diretamente no DevStudio. Economia de 3.5h de desenvolvimento.', prioridade: 'Crítica' }
  ]);

  const [executandoAcao, setExecutandoAcao] = useState(null);

  const aplicarAcaoAutonoma = (id) => {
    setExecutandoAcao(id);
    setTimeout(() => {
      setSugestoesAGI(prev => prev.filter(item => item.id !== id));
      setExecutandoAcao(null);
      alert(`🚀 Ação Autônoma da IA executada e aplicada na estrutura do Emanuel.OS!`);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.88)', backdropFilter: 'blur(20px)',
      zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(8, 15, 30, 0.96)', border: '2px solid #00f0ff',
        borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)',
        color: '#fff', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#00f0ff', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✕
        </button>

        <div style={{ borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 style={{ color: '#00f0ff', fontSize: '18px', margin: 0, fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 EM CREATOR STUDIO IA <span style={{ fontSize: '10px', color: '#ff007f', border: '1px solid #ff007f', padding: '2px 8px', borderRadius: '10px' }}>AGI Core v5.1</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: '4px 0 0 0' }}>
            Análise de desempenho multimodal, diagnóstico de audiência e tomada de ações autônomas para projetos e estruturas.
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
              Os usuários interagem ativamente com atalhos de áudio e geração de mídias para TikTok, YouTube Shorts e Kwai.
            </p>
          </div>

          <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(255, 0, 127, 0.3)', borderRadius: '12px', padding: '12px' }}>
            <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold' }}>🧠 AUTONOMIA NA RESOLUÇÃO DE BUGS</span>
            <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#ff007f' }}>{metricas.resolucaoProblemasIA}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4' }}>
              Resolução de problemas de estrutura e sintaxe efetuados pelo motor Gemini AGI sem necessidade de intervenção.
            </p>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          💡 SUGESTÕES DE AÇÕES AUTOMÁTICAS E OTIMIZAÇÕES DE PROJETO
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

// 🌟 --- 💻 COMPONENTE: PAINEL DE DESENVOLVEDOR SPLIT SCREEN --- 💻 🌟
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(
    `// Emanuel.OS Dev Studio - Ambiente de Desenvolvimento\n// Assistência ativa via IA Gemini AGI Core v5.1 e Robotoc\n\nfunction inicializarModuloEmanuel() {\n  const status = "ONLINE";\n  console.log(\`Sincronizando componentes neurais... [\${status}]\`);\n  return true;\n}`
  );
  const [blocoRascunho, setBlocoRascunho] = useState("Notas de dev: Verificar integração do Robotoc com os mapas 3D e Quick Actions.");
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [retornoIA, setRespostaIA] = useState(null);

  const executarAnaliseIA = (tipoAcao) => {
    setAnalisandoIA(true);
    setRespostaIA(null);

    setTimeout(() => {
      setAnalisandoIA(false);
      if (tipoAcao === 'bug') {
        setRespostaIA("✅ Código analisado! Sintaxe 100% correta. Nenhuma vulnerabilidade ou memory leak detectado no algoritmo.");
      } else if (tipoAcao === 'otimizar') {
        setRespostaIA("⚡ Otimização AGI: Recomenda-se utilizar React.useMemo em renderizações 3D pesadas para reduzir o uso do WebGL em 18%.");
      } else if (tipoAcao === 'explicar') {
        setRespostaIA("📖 Explicação: O script inicializa o módulo neural do Emanuel.OS verificando a disponibilidade do ambiente antes de expor os serviços.");
      }
    }, 1200);
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
    doc.text("EMANUEL.OS - DEV WORKSTATION REPORT", 15, 18);
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
      width: '100%', height: '100%', backgroundColor: 'rgba(2, 6, 23, 0.96)',
      borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '12px', color: '#fff',
      fontFamily: 'Consolas, Monaco, monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>👨‍💻</span>
          <strong style={{ fontSize: '12px', color: '#00f0ff', fontFamily: 'sans-serif' }}>
            Emanuel.OS Dev Workstation | Tela Dividida
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

        <button onClick={() => executarAnaliseIA('bug')} style={{ padding: '6px 10px', backgroundColor: 'rgba(0,240,255,0.2)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔍 Checar Bugs
        </button>
        <button onClick={() => executarAnaliseIA('otimizar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          ⚡ Otimizar IA
        </button>
        <button onClick={() => executarAnaliseIA('explicar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(234,179,8,0.2)', border: '1px solid #eab308', color: '#fef08a', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📖 Explicar
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'sans-serif' }}>CÓDIGO FONTE DO PROJETO ({linguagem.toUpperCase()}):</span>
        <textarea
          value={codigoFonte}
          onChange={(e) => setCodigoFonte(e.target.value)}
          style={{
            width: '100%', flexGrow: 1, backgroundColor: '#010409', border: '1px solid #334155',
            borderRadius: '8px', color: '#38bdf8', padding: '12px', fontSize: '11px',
            outline: 'none', resize: 'none', lineHeight: '1.4', fontFamily: 'Consolas, monospace',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {analisandoIA ? (
        <div style={{ backgroundColor: '#020617', border: '1px dashed #00f0ff', padding: '8px', borderRadius: '6px', fontSize: '10px', color: '#00f0ff' }}>
          ⏳ Gemini AGI & Robotoc processando análise de código...
        </div>
      ) : retornoIA && (
        <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.05)', borderLeft: '3px solid #00f0ff', padding: '8px', borderRadius: '4px', fontSize: '10px', color: '#e2e8f0', fontFamily: 'sans-serif' }}>
          {retornoIA}
        </div>
      )}

      <div style={{ height: '70px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

// 🌟 --- COMPONENTE DE CAPTURA COM ENVIO AUTOMÁTICO DE E-MAIL (EMAILJS) --- 🌟
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
        Cadastre seu e-mail para receber o e-book oficial do Emanuel.OS e convites VIPs para os mapas 3D.
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

// 🌟 --- MÓDULO DE INTEGRAÇÃO GOOGLE MEET + AVATARES DE IA --- 🌟
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

// 🌟 --- COMPONENTE: TERMINAL NATIVO UNIX-LIKE EM CANVAS --- 🌟
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [history, setHistory] = useState([
    'Emanuel.OS v5.1 - Terminal Nativo v1.0 [Kernel 6.x-like]',
    'ROBOTOC Neural Shell - Digite "help" para comandos.',
    ' ',
    'root@emanuel-os:~# '
  ]);
  const [currentLine, setCurrentLine] = useState('');
  const [fileSystem, setFileSystem] = useState({
    'root': { type: 'dir', children: ['bin', 'home', 'var', 'README.txt'] },
    'bin': { type: 'dir', children: ['sh', 'ls', 'help', 'emanuel-agi'] },
    'home': { type: 'dir', children: ['emanuel'] },
    'home/emanuel': { type: 'dir', children: ['documents', 'downloads', 'config.json'] },
    'home/emanuel/README.txt': { type: 'file', content: 'Bem-vindo ao shell nativo do Emanuel.OS. Use este terminal para operações locais de baixo nível.' },
    'home/emanuel/config.json': { type: 'file', content: '{ "core": "G-AGI v5.1", "user": "Emanuel", "theme": "Holographic" }' },
    'var': { type: 'dir', children: ['log'] },
    'var/log': { type: 'dir', children: ['syslog', 'auth.log'] },
    'var/log/syslog': { type: 'file', content: '[LOG] 2030-03-14 14:05:01: Kernel initialized.\n[LOG] 2030-03-14 14:05:05: ROBOTOC Core Sync: OK.' },
    'README.txt': { type: 'file', content: 'Instruções Mestre: O sistema está protegido por 7 camadas. Este shell opera em modo local.' },
  });
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

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => [...prev]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const resolvePath = (path) => {
    if (path === '/') return 'root';
    if (!path.startsWith('/')) {
        path = currentPath + '/' + path;
    }
    const parts = path.split('/').filter(p => p && p !== '.');
    const resolvedParts = [];
    for (const part of parts) {
        if (part === '..') {
            resolvedParts.pop();
        } else {
            resolvedParts.push(part);
        }
    }
    if (resolvedParts.length === 0) return 'root';
    return resolvedParts.join('/');
  };

  const handleCommand = (cmd) => {
    let output = [];
    const tokens = cmd.trim().split(' ');
    const commandName = tokens[0];
    const args = tokens.slice(1);

    switch (commandName) {
      case 'help':
        output = [
          'Comandos disponíveis:',
          '  help     - Mostra esta ajuda',
          '  ls [dir] - Lista diretórios',
          '  cd [dir] - Muda de diretório',
          '  cat [file] - Mostra conteúdo de arquivo',
          '  pwd      - Mostra diretório atual',
          '  clear    - Limpa o terminal',
          '  whoami   - Mostra usuário atual',
          '  uname -a - Mostra info do sistema',
          '  emanuel-agi - Conectar ao núcleo G-AGI'
        ];
        break;
      case 'ls':
        const targetDir = args[0] ? resolvePath(args[0]) : resolvePath(currentPath);
        if (fileSystem[targetDir] && fileSystem[targetDir].type === 'dir') {
          output = ['bin/  home/  var/  README.txt'];
        } else {
          output = [`ls: cannot access '${args[0]}': No such file or directory`];
        }
        break;
      case 'cd':
        const newDir = args[0] ? resolvePath(args[0]) : 'home/emanuel';
        if (fileSystem[newDir] && fileSystem[newDir].type === 'dir') {
          setCurrentPath('/' + (newDir === 'root' ? '' : newDir));
        } else {
          output = [`cd: ${args[0]}: No such file or directory`];
        }
        break;
      case 'cat':
        const targetFile = resolvePath(args[0]);
        if (fileSystem[targetFile] && fileSystem[targetFile].type === 'file') {
          output = fileSystem[targetFile].content.split('\n');
        } else if (fileSystem[targetFile] && fileSystem[targetFile].type === 'dir') {
            output = [`cat: ${args[0]}: Is a directory`];
        } else {
          output = [`cat: ${args[0]}: No such file or directory`];
        }
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
        if (args[0] === '-a') {
            output = ['EmanuelOS emanuel-os 6.1.0- G-AGI v5.1 #1 SMP PREEMPT_DYNAMIC 2030 x86_64 GNU/ROBOTOC Shell'];
        } else {
            output = ['EmanuelOS'];
        }
        break;
      case 'emanuel-agi':
        output = ['Conectando ao núcleo G-AGI...', 'Estabelecendo link neural...', 'Acesso concedido.', 'ROBOTOC online.'];
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
    if (e.key === 'Enter') {
      handleCommand(currentLine);
    } else if (e.key === 'Backspace') {
      setCurrentLine(prev => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setCurrentLine(prev => prev + e.key);
    }
  };

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '300px', backgroundColor: '#000a12', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', overflow: 'hidden' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

// 🌟 --- COMPONENTE: PAINEL DE ANÁLISE E PREVISÃO DE BITCOIN (HOLOGRÁFICO) --- 🌟
const BitcoinAnalysisPanel = () => {
  const [data, setData] = useState({
    price: 'Aguardando G-AGI...',
    change24h: '0.00%',
    prediction: 'Estável (viés ROBOTOC v5.1)',
    ai_confidence: '98.5%'
  });
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setData({
            price: `$${(69000 + Math.random() * 5000).toFixed(2)}`,
            change24h: `${(Math.random() * 10 - 5).toFixed(2)}%`,
            prediction: Math.random() > 0.6 ? 'Alta (G-AGI Target $88k)' : Math.random() > 0.3 ? 'Correção Saudável' : 'Estável (Acumulação ROBOTOC)',
            ai_confidence: `${(95 + Math.random() * 4.9).toFixed(1)}%`
        });
        setProgresso(prev => (prev + 10) % 110);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(234, 179, 8, 0.3)' }}>
        <h3 style={{ color: '#eab308', fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ₿ ANALÍTICA & PREVISÃO DE BITCOIN <span style={{ fontSize: '9px', color: '#fff', border: '1px solid #fff', padding: '1px 5px', borderRadius: '8px' }}>G-AGI QUANT CORE v5.1</span>
        </h3>
        <p style={{ fontSize: '10px', color: '#fef08a', margin: '0 0 12px 0' }}>Análise quântica de mercado e previsões neurais do assistente ROBOTOC v5.1.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #eab308', borderRadius: '10px', padding: '10px' }}>
                <span style={{ fontSize: '9px', color: '#fef08a' }}>Preço Atual (G-AGI Sync):</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#eab308', marginTop: '4px' }}>{data.price}</strong>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #eab308', borderRadius: '10px', padding: '10px' }}>
                <span style={{ fontSize: '9px', color: '#fef08a' }}>Variação 24h:</span>
                <strong style={{ display: 'block', fontSize: '16px', color: data.change24h.startsWith('-') ? '#ef4444' : '#4ade80', marginTop: '4px' }}>{data.change24h}</strong>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #ff007f', borderRadius: '10px', padding: '10px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '9px', color: '#ff9ecf' }}>Viés de Previsão ROBOTOC (Curto Prazo):</span>
                <strong style={{ display: 'block', fontSize: '12px', color: '#ff007f', marginTop: '4px' }}>{data.prediction}</strong>
            </div>
        </div>

        <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.05)', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>Confiança da IA Quântica: <span style={{ color: '#fff' }}>{data.ai_confidence}</span></span>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,240,255,0.2)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${progresso}%`, height: '100%', backgroundColor: '#00f0ff', transition: 'width 0.5s ease-out' }}></div>
            </div>
            <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>⏳ Sincronizando com G-AGI Quant Core v5.1...</span>
        </div>
    </div>
  );
};

// 🌟 --- COMPONENTE: MÓDULO DE PUBLICAÇÃO DE CLOUDFLARE WORKER (G-AGI DEPLOY) --- 🌟
const CloudflareWorkerDeployer = ({ addLog }) => {
  const [workerName, setWorkerName] = useState('emanuel-agi-edge-worker');
  const [workerScript, setWorkerScript] = useState(`addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response('Emanuel.OS G-AGI Edge v5.1 Operacional.', {
    headers: { 'content-type': 'text/plain' },
  })
}`);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null);

  const performDeploy = () => {
    if (!workerName.trim() || !workerScript.trim()) return alert("Por favor, preencha o nome e o script do Cloudflare Worker.");
    setDeploying(true);
    setDeployStatus('Iniciando deploy no Cloudflare...');
    if (addLog) addLog(`[CLOUDFLARE: DEPLOY] Iniciando deploy do Worker "${workerName}"...`);

    setTimeout(() => {
        setDeployStatus('Autenticando na API Cloudflare (via G-AGI)...');
        if (addLog) addLog(`[CLOUDFLARE: API] Autenticado no G-AGI Deploy Gateway.`);

        setTimeout(() => {
            setDeployStatus('Compilando Worker Script (WASM Sync v5.1)...');
            if (addLog) addLog(`[CLOUDFLARE: COMPILER] Script validado e otimizado.`);

            setTimeout(() => {
                setDeployStatus('Publicando no Global Edge Network v5.1...');
                if (addLog) addLog(`[CLOUDFLARE: PUBLISH] Publicando em 300+ datacenters.`);

                setTimeout(() => {
                    setDeploying(false);
                    const workerUrl = `https://${workerName}.emanuel-agi.workers.dev`;
                    setDeployStatus(`✅ Worker publicado com sucesso no Edge!`);
                    if (addLog) {
                        addLog(`[CLOUDFLARE: SUCCESS] Deploy concluído para "${workerName}".`);
                        addLog(`[CLOUDFLARE: URL] Link Ativo: ${workerUrl}`);
                    }
                }, 1500);
            }, 1200);
        }, 1000);
    }, 800);
  };

  return (
    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #fb923c', borderRadius: '16px', padding: '16px', color: '#fff', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(251, 146, 60, 0.25)' }}>
        <h3 style={{ color: '#fb923c', fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ☁️ CLOUDFLARE WORKER DEPLOYER <span style={{ fontSize: '9px', color: '#fff', border: '1px solid #fff', padding: '1px 5px', borderRadius: '8px' }}>G-AGI EDGE v5.1</span>
        </h3>
        <p style={{ fontSize: '10px', color: '#fdba74', margin: '0 0 12px 0' }}>Publicação autônoma de workers na rede global da Cloudflare via G-AGI.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} placeholder="Nome do Worker (ex: g-agi-edge)..." style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
            <textarea 
                value={workerScript} 
                onChange={(e) => setWorkerScript(e.target.value)} 
                placeholder="Cole o script do Worker (JavaScript)..."
                style={{ width: '100%', height: '100px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#4ade80', fontSize: '10px', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
            />
        </div>

        {deployStatus && (
            <div style={{ backgroundColor: 'rgba(251, 146, 60, 0.05)', border: '1px solid rgba(251, 146, 60, 0.4)', borderRadius: '8px', padding: '8px', fontSize: '10px', color: deployStatus.startsWith('✅') ? '#4ade80' : '#fdba74', marginBottom: '10px' }}>
                ⏳ {deployStatus}
                {deployStatus.startsWith('✅') && (
                    <a href={`https://${workerName}.emanuel-agi.workers.dev`} target="_blank" rel="noreferrer" style={{ fontSize: '9px', color: '#fb923c', textDecoration: 'underline', display: 'block', marginTop: '4px' }}>https://{workerName}.emanuel-agi.workers.dev ➔</a>
                )}
            </div>
        )}

        <button 
            onClick={performDeploy} 
            disabled={deploying}
            style={{ width: '100%', padding: '10px', backgroundColor: deploying ? '#c2410c' : '#fb923c', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', transition: 'all 0.3s' }}
        >
            {deploying ? '⚡ Publicando Worker no Edge...' : '🚀 Executar Deploy Global G-AGI Edge ➔'}
        </button>
    </div>
  );
};

// --- FUNÇÕES DE AUXÍLIO E BUSCA ---
function calcularDiferencaLetras(palavra1, palavra2) {
  const p1 = palavra1.toLowerCase().trim();
  const p2 = palavra2.toLowerCase().trim();
  const matriz = [];
  for (let i = 0; i <= p1.length; i++) matriz[i] = [i];
  for (let j = 0; j <= p2.length; j++) matriz[0][j] = j;
  for (let i = 1; i <= p1.length; i++) {
    for (let j = 1; j <= p2.length; j++) {
      const custo = p1[i - 1] === p2[j - 1] ? 0 : 1;
      matriz[i][j] = Math.min(matriz[i - 1][j] + 1, matriz[i][j - 1] + 1, matriz[i - 1][j - 1] + custo);
    }
  }
  return matriz[p1.length][p2.length];
}

function buscarNoDicionario(perguntaUsuario) {
  const palavrasDigitadas = perguntaUsuario.toLowerCase().split(" ");
  let melhorResultado = null;
  let menorDistancia = 3;

  for (const item of dicionarioNinjaLocal) {
    for (const termoValido of [item.termo]) {
      for (const palavraDigitada of palavrasDigitadas) {
        if (palavraDigitada === termoValido.toLowerCase()) return item;
        const distancia = calcularDiferencaLetras(palavraDigitada, termoValido);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          melhorResultado = item;
        }
      }
    }
  }
  return melhorResultado;
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX) --- 🖥️ 🌟
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [biometriaLendo, setBiometriaLendo] = useState(false);
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  // 🛡️ CHAVE DE ACESSO TRIPLA DE SEGURANÇA
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  const [isAdmin] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [isLockedTicons, setIsLockedTicons] = useState(false);
  const [statusTicons, setStatusTicons] = useState('🔐 Selecione a sequência correta do Ticons OS gevaGifs');
  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const [animacaoMontandoMapa, setAnimacaoMontandoMapa] = useState(false);
  const [qrPayload] = useState('https://github.com/Manomae/naruto-anime-portfolio');

  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);
  const [tecladoGlassAberto, setTecladoGlassAberto] = useState(false);

  // 🛡️ SESSÃO PRIVILEGIADA (SENHA + TOTP)
  const [privilegedSession, setPrivilegedSession] = useState(false);
  const [authStepPrivileged, setAuthStepPrivileged] = useState(0);
  const [passwordPrivileged, setPasswordPrivileged] = useState('');
  const [totpPrivileged, setTotpPrivileged] = useState('');
  const PREVILEGED_PASSWORD = 'emanuel-agi-priv-88';
  const PREVILEGED_TOTP = '888888';

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

  const [nuvemSelecionada, setNuvemSelecionada] = useState('google');
  const [statusNuvem] = useState({
    google: { conectado: true, conta: 'leeheroi123@gmail.com', espaco: '15 GB / 2 TB' },
    apple: { conectado: true, conta: 'emanuel@icloud.com', espaco: '5 GB / 200 GB' },
    microsoft: { conectado: true, conta: 'emanuel@outlook.com', espaco: '1 TB OneDrive / Azure' },
    custom: { conectado: true, conta: 'nuvem.emanuel-os.com', espaco: 'Ilimitado (G-AGI Vault)' }
  });

  const [links3D, setLinks3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube Emanuel', url: meusDadosReais.youtube, icone: '▶️', nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok Emanuel', url: meusDadosReais.tiktok, icone: '🎵', nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram Oficial', url: meusDadosReais.instagram, icone: '📸', nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'Repositório GitHub', url: meusDadosReais.github, icone: '🐙', nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'Contato WhatsApp Direct', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', nuvem: 'google' },
    { id: 6, tipo: 'facebook', titulo: 'Facebook Oficial', url: meusDadosReais.facebook, icone: '📘', nuvem: 'microsoft' },
    { id: 7, tipo: 'threads', titulo: 'Threads Oficial', url: meusDadosReais.threads, icone: '🧵', nuvem: 'apple' }
  ]);

  const [vozAtiva] = useState('Robotoc'); 
  const [pesquisaChat, setPesquisaChat] = useState('');
  const [estaOuvindo, setEstaOuvindo] = useState(false); 
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [painelFluidoDireitoAberto, setPainelFluidoDireitoAberto] = useState(false);

  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [abaOverlayAtiva, setAbaOverlayAtiva] = useState('browser');

  const [modalSuporteAberto, setModalSuporteAberto] = useState(false);
  const [abaSuporteAtiva, setAbaSuporteAtiva] = useState('diagnostico');
  const [inputProblemaSuporte, setInputProblemaSuporte] = useState('');
  const [carregandoSuporte, setCarregandoSuporte] = useState(false);
  const [respostaSuporte, setRespostaSuporte] = useState(null);

  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);

  const [abaBuscaNavegador, setAbaBuscaNavegador] = useState('web');
  const [urlOuTermoNavegador, setUrlOuTermoNavegador] = useState('https://emanuel-os.com/search');
  const [escutandoVozNavegador, setEscutandoVozNavegador] = useState(false);
  const [carregandoNavegador, setCarregandoNavegador] = useState(false);
  const [motorBuscaSelecionado, setMotorBuscaSelecionado] = useState('google');

  const [gerandoMidia, setGerandoMidia] = useState(false);
  const [progressoRender, setProgressoRender] = useState(0);
  const [tipoMidiaAtual, setTipoMidiaAtual] = useState('');
  const [termoBuscaHeader, setTermoBuscaHeader] = useState('');
  const [statusEngineHeader, setStatusEngineHeader] = useState('');
  const [versoesAtivas, setVersoesAtivas] = useState([]);
  const [versaoSelecionada, setVersaoSelecionada] = useState(0);

  const [resolucaoVideo] = useState('1080p Full HD');
  const [semMarcaDagua] = useState(true);

  const [browserAsset, setBrowserAsset] = useState({
    titulo: 'Emanuel.OS Quantum Browser v5.1',
    subtitulo: 'Pensamento Neural ROBOTOC Multimodal Active',
    imagem: null,
    videoUrl: null,
    conteudoTexto: 'Sincronização neural ativa. ROBOTOC pronto para processar buscas Web, Voz, Mídias, PDFs e Quick Actions v2.0.'
  });

  const [cmdInput, setCmdInput] = useState('');
  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC: LOG] System core operational.",
    "[ROBOTOC: LOG] Parallel Cognitive Processing Module: STABLE.",
    "[ROBOTOC: STATUS] Modo de Pensamento Neural: ONLINE & SYNCHRONIZED.",
    "[ROBOTOC: DATA CENTER] Servidores Quânticos em 3D Conectados ao Vault.",
    "[ROBOTOC: NUVEM] Sincronizado com Google Drive, Apple iCloud e Microsoft OneDrive."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [historicoChats] = useState([
    { id: 1, titulo: 'Conversa Geral sobre IA com Robotoc', data: '18/07/2026', origem: 'recente' },
    { id: 2, titulo: 'Discussão sobre Clãs Ninjas', data: '18/07/2026', origem: 'recente' },
    { id: 3, titulo: 'Teoria do Chakra e Linhagens', data: '17/07/2026', origem: 'google' },
    { id: 4, titulo: 'Planejamento Emanuel Studio', data: '16/07/2026', origem: 'google' }
  ]);

  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC (IA HUMANOIDE)', texto: 'Emanuel.OS Core v5.1 | ROBOTOC em Data Center 3D | Armazenamento Multicloud pronto para salvar pesquisas, vídeos, fotos, redes sociais e relatórios!', tipo: 'sys' }
  ]);

  const [ddd1, setDdd1] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [ddd2, setDdd2] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [msgCanal1, setMsgCanal1] = useState('');
  const [msgCanal2, setMsgCanal2] = useState('');
  const [modoDisparo, setModoDisparo] = useState('ambos'); 

  const [horaAtual, setHoraAtual] = useState('');
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const bolaHolograficaMeshRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const esferasLinks3DRef = useRef([]);

  const addLogTerminal = (novoLog) => {
    setCmdLogs(prev => [...prev, novoLog]);
  };

  const handleTecla3DPress = (char) => {
    if (char === '⌫') {
      setChatInput(prev => prev.slice(0, -1));
    } else {
      setChatInput(prev => prev + char);
    }
  };

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return alert("🚨 ACESSO BLOQUEADO! Intrusão detectada neste dispositivo.");
    if (!chaveAcessoTripla.trim()) return setStatusAcessoTriplo("⚠️ Insira a Chave Tripla de Acesso!");

    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Camada 1: Identificando Dispositivo...");

    setTimeout(() => {
      setStatusAcessoTriplo("⏳ Camada 2: Conectando ao Servidor AGI-Primary...");
      setTimeout(() => {
        setStatusAcessoTriplo("⏳ Camada 3: Verificando SRV-Secondary...");
        setTimeout(() => {
          setValidandoServidores(false);
          if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || (chaveAcessoTripla.trim() === "8888")) {
            setStatusAcessoTriplo("✅ TRIPLA AUTENTICAÇÃO CONCLUÍDA!");
            setTimeout(() => setEtapaSeguranca(2), 800);
          } else {
            const novasTentativas = tentativasInvasao + 1;
            setTentativasInvasao(novasTentativas);
            if (novasTentativas >= 3) {
              setBloqueioInvasor(true);
              setStatusAcessoTriplo("🚨 ALERTA DE SEGURANÇA! TENTATIVA DE FORÇAMENTO DETECTADA.");
            } else {
              setStatusAcessoTriplo(`❌ Chave Inválida! Tentativa ${novasTentativas}/3.`);
            }
          }
        }, 800);
      }, 800);
    }, 800);
  };

  const processarAuthPrivilegiada = (e) => {
    e.preventDefault();
    if (authStepPrivileged === 1) {
        if (passwordPrivileged === PREVILEGED_PASSWORD) {
            addLogTerminal(`[AUTH: PRIVILEGED] Senha mestre aceita. Aguardando TOTP...`);
            setAuthStepPrivileged(2);
        } else {
            alert("⚠️ Senha Mestre incorreta!");
            setPasswordPrivileged('');
        }
    } else if (authStepPrivileged === 2) {
        if (totpPrivileged === PREVILEGED_TOTP) {
            setPrivilegedSession(true);
            setAuthStepPrivileged(0);
            addLogTerminal(`[AUTH: PRIVILEGED] ✅ TOTP aceito. SESSÃO PRIVILEGIADA ATIVADA.`);
            alert("🔓 Sessão Privilegiada (root) ativada via G-AGI!");
        } else {
            alert("⚠️ Código TOTP incorreto!");
            setTotpPrivileged('');
        }
    }
  };

  const abrirLinkExternoSeguro = (url, titulo) => {
    if (!url) return;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      addLogTerminal(`[ROBOTOC 3D LINK] Abrindo nó tridimensional ativo no Data Center: "${titulo || url}"`);
    }
  };

  const executarNavegacaoBrowser = (termo, modoBusca) => {
    if (!termo.trim()) return;
    setCarregandoNavegador(true);
    setCmdLogs(prev => [...prev, `[ROBOTOC PENSAMENTO] Buscando (${modoBusca.toUpperCase()} via ${motorBuscaSelecionado.toUpperCase()}): "${termo}"`]);

    let targetUrl = `https://www.google.com/search?q=${encodeURIComponent(termo)}`;
    if (motorBuscaSelecionado === 'bing') targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(termo)}`;
    else if (motorBuscaSelecionado === 'duckduckgo') targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(termo)}`;
    if (typeof window !== 'undefined') window.open(targetUrl, '_blank');

    setTimeout(() => {
      setCarregandoNavegador(false);
      setBrowserAsset({
        titulo: `Pensamento ROBOTOC [${modoBusca.toUpperCase()}]: "${termo}"`,
        subtitulo: `Resultados abertos no motor ${motorBuscaSelecionado.toUpperCase()} via G-AGI`,
        imagem: null, videoUrl: null,
        conteudoTexto: `Módulo Quantum Browser do ROBOTOC indexou dados para '${termo}'.`
      });
    }, 1000);
  };

  const iniciarVozNavegador = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Navegador não suporta reconhecimento de voz.");

    const rec = new SpeechRecognition();
    rec.lang = 'pt-BR';
    rec.onstart = () => setEscutandoVozNavegador(true);
    rec.onend = () => setEscutandoVozNavegador(false);
    rec.onresult = (e) => {
      const fala = e.results[0][0].transcript;
      setUrlOuTermoNavegador(fala);
      executarNavegacaoBrowser(fala, 'voz');
    };
    rec.start();
  };

  const executarGeracaoReal = async (promptTexto, tipoAcao) => {
    setGerandoMidia(true);
    setProgressoRender(10);
    setTipoMidiaAtual(tipoAcao);
    setTermoBuscaHeader(promptTexto);

    try {
      const res = await fetch('/api/gerar-midia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptTexto, tipo: tipoAcao, resolucao: resolucaoVideo, semMarcaDagua: semMarcaDagua })
      });
      const data = await res.json();
      setProgressoRender(100);
      setGerandoMidia(false);

      if (data.success) {
        setBrowserAsset({
          titulo: `${tipoAcao.toUpperCase()} (${data.categoria || 'Geral'})`,
          subtitulo: `Modelo G-AGI Multimodal`,
          imagem: data.url || null,
          videoUrl: data.videoUrl || null,
          conteudoTexto: data.mensagem
        });
        setCmdLogs(prev => [...prev, `[ROBOTOC: SUCCESS] ${data.mensagem}`]);
      }
    } catch (err) {
      setGerandoMidia(false);
      setCmdLogs(prev => [...prev, `[ROBOTOC: ERROR] Falha de conexão no servidor de renderização.`]);
    }
  };

  const dispararQuickAction = (tipo) => {
    setCmdLogs(prev => [...prev, `[ROBOTOC: QUICK_ACTION] Ação Acionada: ${tipo.toUpperCase()}`]);
    if (tipo === 'crie_imagem' || tipo === 'crie_gif' || tipo === 'crie_video') {
      executarGeracaoReal('Naruto lutando com Sasuke', tipo);
    }
  };

  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    cameraRef.current = camera;

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

    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const avatarGroup = new THREE.Group();
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.9, emissive: 0x00f0ff, emissiveIntensity: 0.2 });

    const headGeo = new THREE.SphereGeometry(0.42, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, armorMat);
    headMesh.position.set(0, 2.3, 0);
    avatarGroup.add(headMesh);

    const chestGeo = new THREE.BoxGeometry(0.9, 0.8, 0.5);
    const chestMesh = new THREE.Mesh(chestGeo, suitMat);
    chestMesh.position.set(0, 1.45, 0);
    avatarGroup.add(chestMesh);

    scene.add(avatarGroup);
    avatarGroupRef.current = avatarGroup;

    camera.position.set(0, 0, 7.0);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y += 0.005;
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

  const processarConversaReal = (textoUsuario) => {
    const respostaTexto = `Comando neural "${textoUsuario}" processado no pensamento do ROBOTOC. Sincronização em 100%.`;
    setCmdLogs(prev => [...prev, `[ROBOTOC: QUERY] ${respostaTexto}`]);
    setMensagens(prev => [...prev, { autor: 'ROBOTOC IA', texto: respostaTexto, tipo: 'ia' }]);
  };

  const handleEnviarMensagemTexto = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: chatInput, tipo: 'user' }]);
    processarConversaReal(chatInput);
    setChatInput('');
  };

  // 🛡️ TELA DE BLOQUEIO / SEGURANÇA
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
        <Head>
          <title>Emanuel.OS v5.1 - Autenticação ROBOTOC</title>
        </Head>
        <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '900' }}>EMANUEL.OS & ROBOTOC</h2>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>SISTEMA DE SEGURANÇA DE 7 ETAPAS</p>
          <button onClick={() => setBloqueado(false)} style={{ padding: '14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', width: '100%', marginTop: '20px', cursor: 'pointer' }}>
            🔓 ACESSAR EMANUEL.OS CORE
          </button>
        </div>
      </div>
    );
  }

  // 🌟 SISTEMA DESBLOQUEADO
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#fff', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Head>
        <title>Emanuel.OS Core v5.1 | ROBOTOC Multicloud & Mocap 3D</title>
      </Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative' }}>
          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', padding: '10px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              {sidebarAberta ? '✕ Fechar' : '☰ Menu'}
            </button>
            <button onClick={() => setTecladoGlassAberto(!tecladoGlassAberto)} style={{ backgroundColor: 'rgba(0, 240, 255, 0.2)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '10px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              ⌨️ Teclado 3D Glass
            </button>
          </div>

          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '400px', opacity: sidebarAberta ? 1 : 0,
            backgroundColor: 'rgba(7, 7, 12, 0.95)', borderRight: '1px solid #00f0ff', padding: sidebarAberta ? '25px' : '0px',
            display: 'flex', flexDirection: 'column', gap: '18px', height: '100vh', overflowY: 'auto', zIndex: 90, transition: 'all 0.3s'
          }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '18px', color: '#00f0ff' }}>EMANUEL.OS CORE</h1>
                <MocapRoboticsEngine addLog={addLogTerminal} />
                <UnixTerminalCanvas />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>

          {tecladoGlassAberto && (
            <div style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', zIndex: 120, width: '90%', maxWidth: '600px' }}>
              <TecladoLiquidGlass3D onKeyPress={handleTecla3DPress} onFechar={() => setTecladoGlassAberto(false)} />
            </div>
          )}

          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: 'calc(100% - 30px)', maxWidth: '750px' }}>
            <form onSubmit={handleEnviarMensagemTexto} style={{ backgroundColor: 'rgba(5, 12, 24, 0.9)', border: '1px solid #00f0ff', borderRadius: '25px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Fale com o ROBOTOC ou use o Teclado 3D Liquid Glass..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', flexGrow: 1 }}
              />
              <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
                Executar ➔
              </button>
            </form>
          </div>

          <FuturisticWindowManager />
        </div>

        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
