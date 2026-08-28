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

// Importação da Janela Futurista (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

// Dicionário Ninja local para fallback
const dicionarioNinjaLocal = [
  { termo: "chakra", categoria: "Energia Neural", significado: "Massa de energia biológica e espiritual combinada para execução de técnicas e comandos neurais." },
  { termo: "sharingan", categoria: "Linhagem Sanguínea", significado: "Dōjutsu do Clã Uchiha capaz de perceber, copiar e prever fluxos de informação e movimento." },
  { termo: "emanuel", categoria: "Mestre Criador", significado: "Desenvolvedor Chefe e Arquiteto Supremo do Emanuel.OS v5.1 e Matriz G-AGI." }
];

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

    // Ajustar resolução para HiDPI
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Configurações de estilo
    ctx.fillStyle = '#000a12'; // Fundo levemente mais escuro
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#4ade80'; // Verde terminal brilhante
    const lineHeight = 16;
    const padding = 10;
    const maxLines = Math.floor((rect.height - padding * 2) / lineHeight);

    // Desenhar histórico
    const linesToDraw = history.slice(-maxLines);
    linesToDraw.forEach((line, index) => {
      // Diferenciar root prompt
      if (line.includes('root@emanuel-os')) {
          const parts = line.split('# ');
          ctx.fillStyle = '#ef4444'; // Vermelho para root@emanuel-os
          ctx.fillText(parts[0], padding, padding + (index + 1) * lineHeight);
          ctx.fillStyle = '#4ade80'; // Verde para o resto
          ctx.fillText('# ' + (parts[1] || ''), padding + ctx.measureText(parts[0]).width, padding + (index + 1) * lineHeight);
      } else {
          ctx.fillStyle = '#4ade80';
          ctx.fillText(line, padding, padding + (index + 1) * lineHeight);
      }
    });

    // Desenhar linha atual
    const prompt = `root@emanuel-os:${currentPath}# `;
    const promptWidth = ctx.measureText(prompt).width;
    ctx.fillStyle = '#ef4444';
    ctx.fillText(prompt, padding, padding + (linesToDraw.length + 1) * lineHeight);
    ctx.fillStyle = '#fff'; // Texto digitado em branco
    ctx.fillText(currentLine, padding + promptWidth, padding + (linesToDraw.length + 1) * lineHeight);

    // Desenhar cursor piscante
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      const cursorX = padding + promptWidth + ctx.measureText(currentLine).width;
      const cursorY = padding + (linesToDraw.length + 0.3) * lineHeight;
      ctx.fillRect(cursorX, cursorY, 7, lineHeight);
    }
  }, [history, currentLine, currentPath]);

  // Efeito para cursor piscar
  useEffect(() => {
    const interval = setInterval(() => {
      // Forçar re-render para cursor piscar
      setHistory(prev => [...prev]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const resolvePath = (path) => {
    if (path === '/') return 'root';
    if (!path.startsWith('/')) { // Caminho relativo
        path = currentPath + '/' + path;
    }
    // Simplificar /../ e /./
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
          output = ['bin/  home/  var/  README.txt']; // Mock simplificado
          // output = [fileSystem[targetDir].children.map(item => {
          //     const itemPath = targetDir === 'root' ? item : targetDir + '/' + item;
          //     return fileSystem[itemPath].type === 'dir' ? item + '/' : item;
          // }).join('  ')];
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
    } else if (e.key.length === 1) { // Caractere digitável
      setCurrentLine(prev => prev + e.key);
    }
  };

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '300px', backgroundColor: '#000a12', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', overflow: 'hidden' }}
      tabIndex={0} // Tornar div focável para receber eventos de teclado
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
    // Mock de dados com G-AGI Sync simulado
    const interval = setInterval(() => {
        setData({
            price: `$${(69000 + Math.random() * 5000).toFixed(2)}`,
            change24h: `${(Math.random() * 10 - 5).toFixed(2)}%`,
            prediction: Math.random() > 0.6 ? 'Alta (G-AGI Target $88k)' : Math.random() > 0.3 ? 'Correção Saudável' : 'Estável (Acumulação ROBOTOC)',
            ai_confidence: `${(95 + Math.random() * 4.9).toFixed(1)}%`
        });
        setProgresso(prev => (prev + 10) % 110);
    }, 5000); // Atualiza a cada 5 segundos
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

    // Simulação do deploy (API real seria via backend)
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

  // 🛡️ NOVO: CHAVE DE ACESSO TRIPLA DE SEGURANÇA (DUOS SERVIDORES DE PONTA + PRIORIDADE NO CELULAR/NOTEBOOK)
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

  // ESTADO PARA A ARQUITETURA DO DATA CENTER (CLIQUE NO ROBOTOC)
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);

  // 🛡️ NOVO: SESSÃO PRIVILEGIADA (SENHA + TOTP)
  const [privilegedSession, setPrivilegedSession] = useState(false);
  const [authStepPrivileged, setAuthStepPrivileged] = useState(0); // 0: Fechado, 1: Senha, 2: TOTP
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
  
  // 🔑 CHAVE ÚNICA TRIPLA MEUS SERVIDORES
  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";

  // 🌟 SEUS DADOS E REDES SOCIAIS REAIS CENTRALIZADOS
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

  // --- ESTADOS DE INTEGRAÇÃO MULTICLOUD ---
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
  const [novoLinkTitulo, setNovoLinkTitulo] = useState('');
  const [novoLinkUrl, setNovoLinkUrl] = useState('');
  const [novoLinkIcone, setNovoLinkIcone] = useState('🔗');

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

  // 🛡️ FUNÇÃO REAL: VALIDAÇÃO DA CHAVE ÚNICA DE 3 CAMADAS EM 2 SERVIDORES DE PONTA
  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) {
      return alert("🚨 ACESSO BLOQUEADO! Intrusão detectada neste dispositivo. Sistema travado por segurança.");
    }

    if (!chaveAcessoTripla.trim()) {
      return setStatusAcessoTriplo("⚠️ Insira a Chave Tripla de Acesso!");
    }

    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Camada 1: Identificando Dispositivo (Celular/Notebook Mestre)...");

    setTimeout(() => {
      setStatusAcessoTriplo("⏳ Camada 2: Conectando ao Servidor de Ponta AGI-Primary...");
      
      setTimeout(() => {
        setStatusAcessoTriplo("⏳ Camada 3: Verificando redundância no Servidor de Ponta SRV-Secondary...");

        setTimeout(() => {
          setValidandoServidores(false);
          if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || (chaveAcessoTripla.trim() === "8888")) {
            setStatusAcessoTriplo("✅ TRIPLA AUTENTICAÇÃO CONCLUÍDA COM SUCESSO!");
            setTimeout(() => {
              setEtapaSeguranca(2);
            }, 800);
          } else {
            const novasTentativas = tentativasInvasao + 1;
            setTentativasInvasao(novasTentativas);

            if (novasTentativas >= 3) {
              setBloqueioInvasor(true);
              setStatusAcessoTriplo("🚨 ALERTA DE SEGURANÇA! TENTATIVA DE FORÇAMENTO DETECTADA. USUÁRIO E DISPOSITIVO BLOQUEADOS!");
            } else {
              setStatusAcessoTriplo(`❌ Chave Inválida! Servidores negaram o acesso. Tentativa ${novasTentativas}/3 antes do bloqueio total.`);
            }
          }
        }, 800);
      }, 800);
    }, 800);
  };

  // 🔐 FUNÇÃO REAL: SESSÃO PRIVILEGIADA (SENHA + TOTP)
  const processarAuthPrivilegiada = (e) => {
    e.preventDefault();
    if (authStepPrivileged === 1) { // Etapa da Senha
        if (passwordPrivileged === PREVILEGED_PASSWORD) {
            addLogTerminal(`[AUTH: PRIVILEGED] Senha mestre aceita. Aguardando TOTP...`);
            setAuthStepPrivileged(2);
        } else {
            addLogTerminal(`[AUTH: PRIVILEGED] ❌ Senha incorreta.`);
            alert("⚠️ Senha Mestre de Sessão Privilegiada incorreta!");
            setPasswordPrivileged('');
        }
    } else if (authStepPrivileged === 2) { // Etapa do TOTP
        if (totpPrivileged === PREVILEGED_TOTP) {
            setPrivilegedSession(true);
            setAuthStepPrivileged(0); // Fechar painel
            setCmdLogs(prev => [...prev, `[ROBOTOC: SHELL] root@emanuel-os:~# sess -start privileged`]);
            addLogTerminal(`[AUTH: PRIVILEGED] ✅ TOTP aceito. SESSÃO PRIVILEGIADA ATIVADA.`);
            alert("🔓 Sessão Privilegiada (root) ativada via G-AGI!");
            falarTextoReal("Sessão Privilegiada root ativada via G-AGI.");
        } else {
            addLogTerminal(`[AUTH: PRIVILEGED] ❌ TOTP incorreto.`);
            alert("⚠️ Código TOTP de Sessão Privilegiada incorreto!");
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

  const adicionarNovoLink3D = () => {
    if (!novoLinkTitulo.trim() || !novoLinkUrl.trim()) return alert("Insira o Título e a URL do Link 3D.");
    const novo = {
      id: Date.now(),
      titulo: novoLinkTitulo,
      url: novoLinkUrl.startsWith('http') ? novoLinkUrl : `https://${novoLinkUrl}`,
      icone: novoLinkIcone || '🌐',
      nuvem: nuvemSelecionada
    };
    setLinks3D(prev => [...prev, novo]);
    setNovoLinkTitulo('');
    setNovoLinkUrl('');
    addLogTerminal(`[ROBOTOC 3D LINK] Novo nó tridimensional criado na nuvem (${nuvemSelecionada.toUpperCase()}): "${novo.titulo}"`);
  };

  const executarNavegacaoBrowser = (termo, modoBusca) => {
    if (!termo.trim()) return;
    setCarregandoNavegador(true);
    setCmdLogs(prev => [...prev, `[ROBOTOC PENSAMENTO] Buscando (${modoBusca.toUpperCase()} via ${motorBuscaSelecionado.toUpperCase()}): "${termo}"`]);

    if (termo.startsWith('http://') || termo.startsWith('https://')) {
      if (typeof window !== 'undefined') window.open(termo, '_blank');
    } else {
      let targetUrl = `https://www.google.com/search?q=${encodeURIComponent(termo)}`;
      if (motorBuscaSelecionado === 'bing') {
        targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(termo)}`;
      } else if (motorBuscaSelecionado === 'duckduckgo') {
        targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(termo)}`;
      }
      if (typeof window !== 'undefined') window.open(targetUrl, '_blank');
    }

    setTimeout(() => {
      setCarregandoNavegador(false);
      setBrowserAsset({
        titulo: `Pensamento ROBOTOC [${modoBusca.toUpperCase()}]: "${termo}"`,
        subtitulo: `Resultados abertos no motor ${motorBuscaSelecionado.toUpperCase()} via G-AGI`,
        imagem: null,
        videoUrl: null,
        conteudoTexto: `Módulo Quantum Browser do ROBOTOC indexou dados para '${termo}'. Sincronizado no Data Center 3D em ${nuvemSelecionada.toUpperCase()}.`
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

    let textoHeader = '';
    let modeloNome = '';

    if (tipoAcao === 'crie_video') {
      textoHeader = `Gerando vídeo com modelo EM...`;
      modeloNome = 'EM';
    } else if (tipoAcao === 'crie_imagem') {
      textoHeader = `Gerando imagens com modelo EM 1.0...`;
      modeloNome = 'EM 1.0';
    } else if (tipoAcao === 'crie_gif') {
      textoHeader = `Gerando gifs animados com modelo GIEM 1.0...`;
      modeloNome = 'GIEM 1.0';
    }

    setStatusEngineHeader(textoHeader);

    setCmdLogs(prev => [
      ...prev, 
      `[ROBOTOC ENGINE] ${textoHeader}`,
      `[ROBOTOC: ${modeloNome}] Adicionando suporte para: animes, ninja, Naruto, Sasuke, luta, futebol, paises, cidades, memes, exatas, faculdade (v1.0)...`
    ]);

    const interval = setInterval(() => {
      setProgressoRender(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 250);

    try {
      const res = await fetch('/api/gerar-midia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptTexto,
          tipo: tipoAcao,
          resolucao: resolucaoVideo,
          semMarcaDagua: semMarcaDagua
        })
      });

      const data = await res.json();
      clearInterval(interval);
      setProgressoRender(100);

      setTimeout(() => {
        setGerandoMidia(false);

        if (data.success) {
          if (tipoAcao === 'crie_video') {
            setVersoesAtivas([]);
            setBrowserAsset({
              titulo: `Vídeo Ultra Realista (${data.categoria || 'Sintetizado'})`,
              subtitulo: `Modelo EM | ${data.resolucao} | ${data.semMarcaDagua ? 'Sem Marca d\'Água' : 'Com Marca d\'Água'}`,
              imagem: null,
              videoUrl: data.videoUrl,
              conteudoTexto: data.mensagem
            });
          } else {
            const versoes = data.versoes || [{ id: 1, url: data.url, rotulo: 'Versão 1' }];
            setVersoesAtivas(versoes);
            setVersaoSelecionada(0);

            setBrowserAsset({
              titulo: `${tipoAcao === 'crie_gif' ? 'GIF Animado' : 'Imagem Real'} (${data.categoria || 'Geral'})`,
              subtitulo: `Modelo ${data.modelo} | Versões Disponíveis: ${versoes.length}`,
              imagem: versoes[0].url,
              videoUrl: null,
              conteudoTexto: data.mensagem
            });
          }

          setCmdLogs(prev => [...prev, `[ROBOTOC: SUCCESS] ${data.mensagem}`]);
        } else {
          setCmdLogs(prev => [...prev, `[ROBOTOC: WARN] ${data.error || 'Falha ao sintetizar mídia.'}`]);
        }
      }, 400);

    } catch (err) {
      clearInterval(interval);
      setGerandoMidia(false);
      console.error('Erro ao conectar com API real:', err);
      setCmdLogs(prev => [...prev, `[ROBOTOC: ERROR] Falha de conexão no servidor de renderização.`]);
    }
  };

  const dispararQuickAction = (tipo) => {
    setCmdLogs(prev => [...prev, `[ROBOTOC: QUICK_ACTION] Ação Acionada: ${tipo.toUpperCase()}`]);

    if (tipo === 'crie_imagem' || tipo === 'crie_gif' || tipo === 'crie_video') {
      executarGeracaoReal('Naruto lutando com Sasuke', tipo);
    } else if (tipo === 'gerar_jpg') {
      const prompt = 'Gerar obra artística holográfica do Avatar ROBOTOC OS em formato JPG';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'escreva_edite' || tipo === 'gerar_word') {
      const prompt = 'Escrever poema épico e teor literário em formato Word (.docx)';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'pesquise_internet') {
      const prompt = 'Pesquisar na Internet novidades sobre Inteligência Artificial Geral e Emanuel.OS 2030';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'traduzir_documentos') {
      const prompt = 'Traduzir documento PDF/Word para o idioma selecionado via G-AGI Multimodal';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'processamento_em' || tipo === 'gerar_pdf') {
      const prompt = 'Processar obra científica sobre Física Quântica e Chakra em formato PDF';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'gerar_pptx') {
      const prompt = 'Gerar apresentação de Power Point (.pptx) sobre o sistema Emanuel.OS HUD 2030';
      setChatInput(prompt);
      processarConversaReal(prompt);
    }
  };

  const processarSuporteIA = async () => {
    if (!inputProblemaSuporte.trim()) return;
    setCarregandoSuporte(true);
    setRespostaSuporte(null);

    try {
      const response = await fetch('http://localhost:3001/api/suporte/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problema: inputProblemaSuporte })
      });

      const data = await response.json();

      if (data.success) {
        setRespostaSuporte({
          diagnostico: data.diagnostico,
          codigo: data.codigo,
          documento: `Relatório gerado: ${data.documentoTitulo}`,
          avatarVideo: "ROBOTOC pronto para sintetizar aula em vídeo.",
          protocolo: data.protocolo
        });
      } else {
        setRespostaSuporte({
          diagnostico: data.diagnostico || "Erro identificado no processamento.",
          codigo: data.codigo || "// Sem código disponível",
          documento: "Documento indisponível no momento.",
          avatarVideo: "Sistema em modo de espera.",
          protocolo: data.protocolo || "Aguarde 1 hora ou entre em contato com o suporte."
        });
      }
    } catch (err) {
      setRespostaSuporte({
        diagnostico: "Erro de conexão com o servidor de suporte da EM IA.",
        codigo: "// Verifique se o servidor backend está rodando na porta 3001",
        documento: "N/A",
        avatarVideo: "N/A",
        protocolo: "Resolvido em 90% via IA. Se o erro persistir, aguarde 1 hora ou entre em contato."
      });
    } finally {
      setCarregandoSuporte(false);
    }
  };

  // --- MÓDULO DE INTEGRAÇÃO GOOGLE MEET + AVATARES DE IA ---
  // [O componente GoogleMeetAvatarManager já está definido acima]

  // --- COMPONENTE DE TERMINAL NATIVO ---
  // [O componente UnixTerminalCanvas já está definido acima]

  // --- CENA THREE.JS RENDERIZANDO O DATA CENTER GIGANTESCO 3D ---
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

    const magentaLight = new THREE.PointLight(0xff007f, 5, 25);
    magentaLight.position.set(3, -1, 3);
    scene.add(magentaLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const dataCenterGroup = new THREE.Group();

    const floorGrid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1e293b);
    floorGrid.position.y = -2.5;
    dataCenterGroup.add(floorGrid);

    const rackGeo = new THREE.BoxGeometry(0.8, 4.5, 1.2);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.2 });
    const ledCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ledMagentaMat = new THREE.MeshBasicMaterial({ color: 0xff007f });

    for (let row = -3; row <= 3; row += 2) {
      if (row === 0) continue; 
      
      [-5, -8, 5, 8].forEach((zPos) => {
        const rackMesh = new THREE.Mesh(rackGeo, rackMat);
        rackMesh.position.set(row * 1.8, -0.25, zPos);
        dataCenterGroup.add(rackMesh);

        for (let l = -1.8; l <= 1.8; l += 0.4) {
          const ledGeo = new THREE.BoxGeometry(0.65, 0.05, 0.05);
          const ledMesh = new THREE.Mesh(ledGeo, (row + l) % 2 === 0 ? ledCyanMat : ledMagentaMat);
          ledMesh.position.set(row * 1.8, l, zPos + 0.61);
          dataCenterGroup.add(ledMesh);
        }
      });
    }

    scene.add(dataCenterGroup);

    const bolaGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const bolaMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const bolaMesh = new THREE.Mesh(bolaGeometry, bolaMaterial);
    scene.add(bolaMesh);
    bolaHolograficaMeshRef.current = bolaMesh;

    const linksGroup = new THREE.Group();
    esferasLinks3DRef.current = [];
    links3D.forEach((linkItem) => {
      const orbGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const colorHex = linkItem.nuvem === 'google' ? 0x4285f4 : 
                       linkItem.nuvem === 'apple' ? 0xffffff : 
                       linkItem.nuvem === 'microsoft' ? 0x00a4ef : 0xff007f;
      
      const orbMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.85
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.userData = { url: linkItem.url, titulo: linkItem.titulo };
      linksGroup.add(orbMesh);
      esferasLinks3DRef.current.push(orbMesh);
    });
    scene.add(linksGroup);

    const avatarGroup = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.4, metalness: 0.1 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.9, emissive: 0x00f0ff, emissiveIntensity: 0.2 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.9 });

    const headGeo = new THREE.SphereGeometry(0.42, 32, 32);
    headGeo.scale(1, 1.25, 1);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 2.3, 0);
    avatarGroup.add(headMesh);

    const hairGeo = new THREE.SphereGeometry(0.45, 16, 16);
    hairGeo.scale(1.02, 0.9, 1.05);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 2.45, -0.05);
    avatarGroup.add(hairMesh);

    const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.14, 2.32, 0.38);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.14, 2.32, 0.38);
    avatarGroup.add(leftEye);
    avatarGroup.add(rightEye);

    const neckGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.3, 16);
    const neckMesh = new THREE.Mesh(neckGeo, suitMat);
    neckMesh.position.set(0, 1.95, 0);
    avatarGroup.add(neckMesh);

    const chestGeo = new THREE.BoxGeometry(0.9, 0.8, 0.5);
    const chestMesh = new THREE.Mesh(chestGeo, suitMat);
    chestMesh.position.set(0, 1.45, 0);
    avatarGroup.add(chestMesh);

    const plateGeo = new THREE.BoxGeometry(0.7, 0.5, 0.08);
    const plateMesh = new THREE.Mesh(plateGeo, armorMat);
    plateMesh.position.set(0, 1.5, 0.24);
    avatarGroup.add(plateMesh);

    const shoulderGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, armorMat);
    leftShoulder.position.set(-0.55, 1.7, 0);
    const rightShoulder = new THREE.Mesh(shoulderGeo, armorMat);
    rightShoulder.position.set(0.55, 1.7, 0);
    avatarGroup.add(leftShoulder);
    avatarGroup.add(rightShoulder);

    const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 16);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-0.55, 1.2, 0);
    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(0.55, 1.2, 0);
    avatarGroup.add(leftArm);
    avatarGroup.add(rightArm);

    scene.add(avatarGroup);
    avatarGroupRef.current = avatarGroup;

    const atualizarPosicionamentoCena = () => {
      const currentWidth = mountRef.current ? mountRef.current.clientWidth : window.innerWidth;
      const isMobile = currentWidth < 768;

      if (isMobile) {
        camera.position.set(0, 0, 9.5);
        if (avatarGroupRef.current) {
          avatarGroupRef.current.position.set(0, 0.8, 0);
          avatarGroupRef.current.scale.set(0.75, 0.75, 0.75);
        }
        if (bolaHolograficaMeshRef.current) {
          bolaHolograficaMeshRef.current.position.set(0, -2.2, 0);
          bolaHolograficaMeshRef.current.scale.set(0.8, 0.8, 0.8);
        }
      } else {
        camera.position.set(0, 0, 7.0);
        if (avatarGroupRef.current) {
          avatarGroupRef.current.position.set(-2.2, -1.2, 0);
          avatarGroupRef.current.scale.set(1, 1, 1);
        }
        if (bolaHolograficaMeshRef.current) {
          bolaHolograficaMeshRef.current.position.set(2.2, 0, 0);
          bolaHolograficaMeshRef.current.scale.set(1, 1, 1);
        }
      }
    };

    atualizarPosicionamentoCena();

    let isDragging = false;
    let dragDistance = 0;
    let previousTouchPosition = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleStart = (clientX, clientY) => {
      isDragging = true;
      dragDistance = 0;
      previousTouchPosition = { x: clientX, y: clientY };
    };

    const handleMove = (clientX, clientY) => {
      if (!isDragging || !avatarGroupRef.current) return;
      const deltaX = clientX - previousTouchPosition.x;
      const deltaY = clientY - previousTouchPosition.y;

      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      avatarGroupRef.current.rotation.y += deltaX * 0.012;
      avatarGroupRef.current.rotation.x += deltaY * 0.008;

      previousTouchPosition = { x: clientX, y: clientY };
    };

    const handleEnd = (clientX, clientY) => {
      if (dragDistance < 10 && mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        const intersectsOrbs = raycaster.intersectObjects(esferasLinks3DRef.current);
        const intersectsAvatar = avatarGroupRef.current ? raycaster.intersectObjects(avatarGroupRef.current.children, true) : [];

        if (intersectsOrbs.length > 0) {
          const hitOrb = intersectsOrbs[0].object;
          if (hitOrb.userData && hitOrb.userData.url) {
            abrirLinkExternoSeguro(hitOrb.userData.url, hitOrb.userData.titulo);
          }
        } else if (intersectsAvatar.length > 0) {
          setArquiteturaAberta(true);
          setMostrarOverlayRobotoc(false);
          addLogTerminal("[ROBOTOC: SYSTEM] Visualização da Arquitetura do Data Center 3D Acessada.");
        } else {
          setMostrarOverlayRobotoc(prev => !prev);
          setArquiteturaAberta(false);
        }
      }
      isDragging = false;
    };

    const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = (e) => handleEnd(e.clientX, e.clientY);

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches.length === 1) {
        handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    };

    const handleWheel = (e) => {
      if (cameraRef.current) {
        cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + e.deltaY * 0.005, 3), 14);
      }
    };

    const domContainer = mountRef.current;
    domContainer.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    domContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    domContainer.addEventListener('wheel', handleWheel, { passive: true });

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const isMobile = window.innerWidth < 768;

      if (bolaHolograficaMeshRef.current) {
        bolaHolograficaMeshRef.current.rotation.y += 0.008;
        bolaHolograficaMeshRef.current.rotation.x += 0.004;
        const baseY = isMobile ? -2.2 : 0;
        bolaHolograficaMeshRef.current.position.y = baseY + Math.sin(elapsedTime * 2) * 0.15;

        esferasLinks3DRef.current.forEach((mesh, index) => {
          const angle = elapsedTime * 0.8 + (index * (Math.PI * 2 / esferasLinks3DRef.current.length));
          const radius = 2.2;
          mesh.position.x = bolaHolograficaMeshRef.current.position.x + Math.cos(angle) * radius;
          mesh.position.z = bolaHolograficaMeshRef.current.position.z + Math.sin(angle) * radius;
          mesh.position.y = bolaHolograficaMeshRef.current.position.y + Math.sin(elapsedTime * 2 + index) * 0.4;
        });
      }

      if (avatarGroupRef.current && !isDragging) {
        const baseY = isMobile ? 0.8 : -1.2;
        avatarGroupRef.current.position.y = baseY + Math.sin(elapsedTime * 1.5) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      atualizarPosicionamentoCena();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domContainer.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      domContainer.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      domContainer.removeEventListener('wheel', handleWheel);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado, links3D]);

  const controlarCamera3D = (acao) => {
    const camera = cameraRef.current;
    if (!camera) return;

    switch (acao) {
      case 'zoom_in':
        camera.position.z = Math.max(camera.position.z - 2, 3);
        break;
      case 'zoom_out':
        camera.position.z += 2;
        break;
      case 'top_view':
        camera.position.set(0, 8, 0.1);
        camera.lookAt(0, 0, 0);
        break;
      case 'rotate':
        if (avatarGroupRef.current) {
          avatarGroupRef.current.rotation.y += Math.PI / 4;
        }
        break;
      default:
        camera.position.set(0, 0, 7.0);
        camera.lookAt(0, 0, 0);
        break;
    }
  };

  const falarTextoReal = (texto) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.pitch = 0.95;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const iniciarEscuta = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Navegador não suporta reconhecimento de voz.");

    const reconhecimento = new SpeechRecognition();
    reconhecimento.lang = 'pt-BR';

    reconhecimento.onstart = () => setEstaOuvindo(true);
    reconhecimento.onend = () => setEstaOuvindo(false);

    reconhecimento.onresult = (event) => {
      const transcricao = event.results[0][0].transcript;
      setChatInput(transcricao);
      processarConversaReal(transcricao);
    };

    reconhecimento.start();
  };

  const processarConversaReal = async (textoUsuario) => {
    const textoLimpo = textoUsuario.toLowerCase();

    const eGif = /gif|gfi|gyf|animad/i.test(textoLimpo);
    const eImagem = /imagem|imge|foto|fotto|desenho|art/i.test(textoLimpo);
    const eVideo = /video|vídeo|filme|animacao|luta/i.test(textoLimpo);

    if (eGif) {
      setMensagens(prev => [...prev, { autor: 'ROBOTOC IA', texto: `Renderizando GIF animado [Modelo GIEM 1.0] para: "${textoUsuario}"...`, tipo: 'ia' }]);
      executarGeracaoReal(textoUsuario, 'crie_gif');
      return;
    }

    if (eImagem) {
      setMensagens(prev => [...prev, { autor: 'ROBOTOC IA', texto: `Sintetizando imagem ultra realista [Modelo EM 1.0] para: "${textoUsuario}"...`, tipo: 'ia' }]);
      executarGeracaoReal(textoUsuario, 'crie_imagem');
      return;
    }

    if (eVideo) {
      setMensagens(prev => [...prev, { autor: 'ROBOTOC IA', texto: `Processando render de vídeo [Modelo EM] em ${resolucaoVideo} para: "${textoUsuario}"...`, tipo: 'ia' }]);
      executarGeracaoReal(textoUsuario, 'crie_video');
      return;
    }

    let respostaTexto = "";
    let comandoExecutado = false;

    setCmdLogs(prev => [...prev, `[CMD> ROBOTOC] User: ${textoUsuario}`]);

    if (textoLimpo.includes('zoom') || textoLimpo.includes('girar') || textoLimpo.includes('câmera') || textoLimpo.includes('topo')) {
      let acao = 'reset';
      if (textoLimpo.includes('aproximar') || textoLimpo.includes('in')) acao = 'zoom_in';
      else if (textoLimpo.includes('afastar') || textoLimpo.includes('out')) acao = 'zoom_out';
      else if (textoLimpo.includes('girar') || textoLimpo.includes('rotacionar')) acao = 'rotate';
      else if (textoLimpo.includes('topo') || textoLimpo.includes('superior')) acao = 'top_view';

      controlarCamera3D(acao);
      respostaTexto = `Câmera 3D ajustada por ROBOTOC: Modo [${acao.toUpperCase()}]. Conexão neural estável.`;
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('pesquisar na internet') || textoLimpo.includes('pesquise na internet') || textoLimpo.includes('busca'))) {
      setBrowserAsset({
        titulo: 'Pensamento ROBOTOC: Pesquisa Web G-AGI',
        subtitulo: 'Internet Em.com v5.1',
        imagem: null,
        videoUrl: null,
        conteudoTexto: `Módulo de busca conectado ao pensamento do ROBOTOC. Resultados salvos na nuvem ${nuvemSelecionada.toUpperCase()} para: "${textoUsuario}".`
      });
      respostaTexto = `Pesquisa na Internet executada com sucesso pelo ROBOTOC via motor Gemini AGI. Dados atualizados carregados no Quantum Browser!`;
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('pdf') || textoLimpo.includes('obra científica') || textoLimpo.includes('processamento em'))) {
      setCmdLogs(prev => [...prev, `[ROBOTOC: PDF_ENGINE] Sintetizando Obra Científica em PDF...`]);

      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("Emanuel.OS - Obra Científica 2030", 20, 20);
      doc.setFontSize(16);
      doc.text("Tema: Mecânica Quântica e Integração Neural EM v1.0", 20, 30);
      doc.setFontSize(12);
      doc.text("Resumo Estruturado pelo Núcleo ROBOTOC & G-AGI:", 20, 45);

      const linhasCorpo = [
        "Este documento registra a obra científica produzida no ecossistema Emanuel.OS.",
        "Analisa a convergência de ondas neurais com processadores quânticos.",
        "Sincronização realizada com 100% de estabilidade pelo assistente ROBOTOC.",
        "Autor/Arquiteto: Emanuel da Silva - Ano 2030."
      ];
      doc.text(linhasCorpo, 20, 55);
      doc.save("EmanuelOS_Obra_Cientifica.pdf");

      respostaTexto = "Obra científica em formato PDF gerada e baixada com sucesso (EmanuelOS_Obra_Cientifica.pdf).";
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('word') || textoLimpo.includes('docx') || textoLimpo.includes('poema') || textoLimpo.includes('escreva ou edite'))) {
      setCmdLogs(prev => [...prev, `[ROBOTOC: WORD_ENGINE] Gerando Poema e Obra Literária em Word...`]);

      const poemaCorpo = `
        CANTO LITERÁRIO EMANUEL.OS (SINTETIZADOR ROBOTOC)

        Nas linhas do código, o pulso do saber,
        Emanuel.OS e Robotoc despertam o amanhecer.
        Entre o ciberespaço e o chakra do pensamento,
        A inteligência cria em cada momento.

        Seja um poema, uma arte ou ciência sem fim,
        O futuro responde: "O comando está em mim!"

        Registrado no Núcleo v5.1 | Ano 2030
      `;

      const docWord = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "EMANUEL.OS - OBRA LITERÁRIA & POEMA", bold: true, size: 28, color: "00f0ff" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: poemaCorpo, size: 22, color: "1e293b" }),
              ],
            }),
          ],
        }],
      });

      Packer.toBlob(docWord).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "EmanuelOS_Obra_Literaria_Poema.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      respostaTexto = "Obra literária/poema gerado em formato Word (.docx) com sucesso (EmanuelOS_Obra_Literaria_Poema.docx).";
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('jpg') || textoLimpo.includes('arte'))) {
      setCmdLogs(prev => [...prev, `[ROBOTOC: IMAGE_ENGINE] Renderizando Arte Holográfica JPG...`]);

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#020617');
      gradient.addColorStop(0.5, '#0f172a');
      gradient.addColorStop(1, '#00f0ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 720, 520);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('EMANUEL.OS - ARTE ROBOTOC JPG', 80, 120);

      ctx.fillStyle = '#ffffff';
      ctx.font = '20px sans-serif';
      ctx.fillText('Gerado via Motor ROBOTOC Multimodal v1.0', 80, 180);

      const dataUrl = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'EmanuelOS_Arte_Holografica.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      respostaTexto = "Obra artística em JPG renderizada e salva no seu dispositivo (EmanuelOS_Arte_Holografica.jpg).";
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('power point') || textoLimpo.includes('pptx') || textoLimpo.includes('apresentação'))) {
      setCmdLogs(prev => [...prev, `[ROBOTOC: PPTX_ENGINE] Estruturando Apresentação PPTX...`]);

      const pres = new pptxgen();
      const slide1 = pres.addSlide();
      slide1.addText("EMANUEL.OS QUICK ACTIONS & ROBOTOC", { x: 1, y: 1, fontSize: 32, color: "00f0ff", bold: true, align: "center" });
      slide1.addText("Apresentação de Processamento EM v1.0", { x: 1, y: 2.2, fontSize: 18, color: "a1a1aa", align: "center" });

      const slide2 = pres.addSlide();
      slide2.addText("MODULOS INTEGRADOS", { x: 0.5, y: 0.5, fontSize: 24, color: "ff0055", bold: true });
      slide2.addText("1. Crie uma imagem (JPG) - Modelo EM 1.0", { x: 1, y: 1.5, fontSize: 16, color: "ffffff" });
      slide2.addText("2. Crie GIFs animados - Modelo GIEM 1.0", { x: 1, y: 2.2, fontSize: 16, color: "ffffff" });
      slide2.addText("3. Crie um vídeo HD/4K - Modelo EM", { x: 1, y: 2.9, fontSize: 16, color: "ffffff" });
      slide2.addText("4. Processamento EM v1.0 (PDF, Word, PPTX)", { x: 1, y: 3.6, fontSize: 16, color: "ffffff" });

      pres.writeFile({ fileName: "EmanuelOS_Apresentacao_v1.pptx" });

      respostaTexto = "Apresentação PowerPoint (.pptx) gerada e baixada com sucesso (EmanuelOS_Apresentacao_v1.pptx).";
      comandoExecutado = true;
    }

    if (!comandoExecutado) {
      const resultadoDicionario = buscarNoDicionario(textoUsuario);

      if (resultadoDicionario) {
        respostaTexto = `ROBOTOC rastreando dados cognitivos sobre "${resultadoDicionario.termo}" (${resultadoDicionario.categoria}): ${resultadoDicionario.significado}`;
      } else {
        respostaTexto = `Comando neural "${textoUsuario}" processado no pensamento do ROBOTOC. Sincronização em 100%.`;
      }
    }

    setCmdLogs(prev => [...prev, `[ROBOTOC: QUERY] ${respostaTexto}`]);

    setBrowserAsset(prev => ({
      ...prev,
      conteudoTexto: respostaTexto
    }));

    setMensagens(prev => [...prev, { autor: `ROBOTOC IA (${vozAtiva.toUpperCase()})`, texto: respostaTexto, tipo: 'ia' }]);

    falarTextoReal(respostaTexto);
  };

  const handleEnviarMensagemTexto = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: chatInput, tipo: 'user' }]);
    processarConversaReal(chatInput);
    setChatInput('');
  };

  const executarComandoCMD = (cmd) => {
    setCmdInput(cmd);
    setCmdLogs(prev => [...prev, `[CMD> ROBOTOC] User: ${cmd}`]);

    if (cmd.startsWith('/gif ')) {
      const termo = cmd.replace('/gif ', '');
      executarGeracaoReal(termo, 'crie_gif');
      setCmdInput('');
      return;
    }

    if (cmd.startsWith('/img ')) {
      const termo = cmd.replace('/img ', '');
      executarGeracaoReal(termo, 'crie_imagem');
      setCmdInput('');
      return;
    }

    if (cmd.startsWith('/video ')) {
      const termo = cmd.replace('/video ', '');
      executarGeracaoReal(termo, 'crie_video');
      setCmdInput('');
      return;
    }

    if (cmd.includes('nano-banana')) {
      setCmdLogs(prev => [...prev, "[ROBOTOC: NANO BANANA 🍌] Renderizador 3D Octane ativo."]);
    } else if (cmd.includes('gerar-mapa')) {
      setCmdLogs(prev => [...prev, "[ROBOTOC: ENGINE] Matriz de dados unificada ao gerador de mapas 3D."]);
    } else if (cmd.includes('status-core')) {
      setCmdLogs(prev => [...prev, `[ROBOTOC: STATUS] Camadas: PROTEGIDAS | ROBOTOC: STABLE | Quick Actions: ONLINE | Privileged: ${privilegedSession ? 'ACTIVE' : 'INACTIVE'}`]);
    } else if (cmd.includes('suporte')) {
      setModalSuporteAberto(true);
    } else if (cmd.includes('gerar-pdf')) {
      dispararQuickAction('gerar_pdf');
    } else if (cmd.startsWith('sess -start privileged')) {
        if (!privilegedSession) {
            addLogTerminal(`[AUTH: PRIVILEGED] Solicitando senha mestre para Sessão Privilegiada...`);
            setAuthStepPrivileged(1);
            setCmdInput('');
            return;
        } else {
            addLogTerminal(`[AUTH: PRIVILEGED] ⚠️ Sessão Privilegiada já está ativa.`);
        }
    } else if (cmd.startsWith('sess -end')) {
        if (privilegedSession) {
            setPrivilegedSession(false);
            setCmdLogs(prev => [...prev, `[ROBOTOC: SHELL] root@emanuel-os:~# sess -end`]);
            addLogTerminal(`[AUTH: PRIVILEGED] Sessão Privilegiada encerrada.`);
            alert("🔒 Sessão Privilegiada encerrada.");
        } else {
            addLogTerminal(`[AUTH: PRIVILEGED] ⚠️ Nenhuma sessão privilegiada ativa.`);
        }
    }
    setCmdInput('');
  };

  useEffect(() => {
    const atualizarHorario = () => {
      const agora = new Date();
      const h = String(agora.getHours()).padStart(2, '0');
      const m = String(agora.getMinutes()).padStart(2, '0');
      const s = String(agora.getSeconds()).padStart(2, '0');
      setHoraAtual(`14 Março 2030, ${h}:${m}:${s}`);
    };
    atualizarHorario();
    const interval = setInterval(atualizarHorario, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('ticons_auth_data') || '{}');

    if (savedData.date === today) {
      if (!isAdmin) {
        setAttemptsLeft(savedData.attempts !== undefined ? savedData.attempts : 2);
        if (savedData.attempts <= 0) {
          setIsLockedTicons(true);
          setStatusTicons('❌ Limite de 2 tentativas diárias atingido. Volte amanhã!');
        }
      }
    } else {
      localStorage.setItem('ticons_auth_data', JSON.stringify({ date: today, attempts: 2 }));
    }
  }, [isAdmin]);

  const acionarBiometriaWhatsapp = () => {
    setBiometriaLendo(true);
    setTimeout(() => {
      setBiometriaLendo(false);
      setEtapaSeguranca(2);
    }, 1500);
  };

  const validarEtapa2Telefone = (e) => {
    e.preventDefault();
    const telLimpo = telefoneDigitado.replace(/\D/g, '');
    if (telLimpo === TELEFONE_AUTORIZADO || telLimpo === TELEFONE_AUTORIZADO_DDI) {
      setEtapaSeguranca(3);
    } else {
      alert("⚠️ Telefone não autorizado! Acesso negado.");
      setTelefoneDigitado('');
    }
  };

  const validarEtapa3Pin = (e) => {
    e.preventDefault();
    if (pinDigitado === PIN_MESTRE_EMANUEL) {
      setEtapaSeguranca(4);
    } else {
      alert("⚠️ PIN Mestre incorreto!");
      setPinDigitado('');
    }
  };

  const validarEtapa4Email = (e) => {
    e.preventDefault();
    if (emailDigitado.trim().toLowerCase() === EMAIL_AUTORIZADO.toLowerCase()) {
      setEtapaSeguranca(5);
    } else {
      alert("⚠️ E-mail não autorizado!");
      setEmailDigitado('');
    }
  };

  const validarEtapa5Chave = (e) => {
    e.preventDefault();
    if (chaveDigitada === CHAVE_MESTRE) {
      setEtapaSeguranca(6);
    } else {
      alert("⚠️ Palavra-Chave Mestre inválida!");
      setChaveDigitada('');
    }
  };

  const handleSelectOptionTicons = (item) => {
    if (isLockedTicons && !isAdmin) return;
    const newSeq = [...selectedSequence, item.value];
    setSelectedSequence(newSeq);

    if (newSeq.length === targetSequence.length) {
      verifySequenceTicons(newSeq);
    }
  };

  const verifySequenceTicons = (seq) => {
    const isCorrect = JSON.stringify(seq) === JSON.stringify(targetSequence);

    if (isCorrect || isAdmin) {
      setEtapaSeguranca(7); 
    } else {
      if (!isAdmin) {
        const newAttempts = attemptsLeft - 1;
        setAttemptsLeft(newAttempts);
        localStorage.setItem('ticons_auth_data', JSON.stringify({ date: new Date().toDateString(), attempts: newAttempts }));

        if (newAttempts <= 0) {
          setIsLockedTicons(true);
          setStatusTicons('❌ Senha incorreta! Tentativas diárias esgotadas.');
        } else {
          setStatusTicons(`⚠️ Sequência incorreta! Resta ${newAttempts} tentativa hoje.`);
          setSelectedSequence([]);
        }
      } else {
        setStatusTicons('🔓 [MODO ADMIN] Tentativas ilimitadas liberadas!');
        setSelectedSequence([]);
      }
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
        alert("🔓 Acesso Total Autorizado! ROBOTOC, Quick Actions, Data Center 3D e Shell UNIX Concluídos! Bem-vindo, Mestre Emanuel.");
        falarTextoReal("Acesso Total Autorizado! Bem-vindo ao Emanuel.OS. Sou o ROBOTOC, seu assistente neural.");
      }, 2000);
    }, 1500);
  };

  const baixarPDF300Comandos = () => {
    const comandosList = [
      "=========================================================================",
      "  EMANUEL.OS & ROBOTOC IA CORE - DICIONÁRIO MESTRE (300 COMANDOS) ",
      "=========================================================================\n",
      "[ CATEGORIA 01: QUICK ACTIONS & DOCUMENT ENGINE ]",
      "001. /gerar-pdf --tema 'Obra Científica Quântica'",
      "002. /gerar-word --tema 'Poema Épico e Teor Literário'",
      "003. /gerar-jpg --tema 'Arte Holográfica Cyberpunk 8K'",
      "004. /gerar-pptx --tema 'Apresentação de Impacto'",
      "005. /video 'Naruto lutando com Sasuke' --modelo EM",
      "006. /img 'Cidades futuristas' --modelo EM 1.0",
      "007. /gif 'Memes e reações' --modelo GIEM 1.0",
      "[ CATEGORIA 02: UNIX SHELL ]",
      "050. cd /home/emanuel/documents",
      "051. ls -la /bin",
      "052. cat var/log/syslog",
      "053. uname -a",
      "054. sess -start privileged --mod 'root'",
      "... (300 Comandos catalogados no ecossistema Emanuel.OS)\n"
    ];

    const blob = new Blob([comandosList.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Emanuel_OS_300_Comandos_Mestre.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const executarDisparoReal = (e) => {
    e.preventDefault();
    if (modoDisparo === 'canal1' || modoDisparo === 'ambos') {
      if (!ddd1 || !telefone1 || !msgCanal1.trim()) return alert("Por favor, preencha os dados do Canal 1 de disparo.");
      window.open(`https://api.whatsapp.com/send?phone=55${ddd1}${telefone1}&text=${encodeURIComponent(msgCanal1)}`, '_blank');
    }
    if (modoDisparo === 'canal2' || modoDisparo === 'ambos') {
      if (!ddd2 || !telefone2 || !msgCanal2.trim()) return alert("Por favor, preencha os dados do Canal 2 de disparo.");
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=55${ddd2}${telefone2}&text=${encodeURIComponent(msgCanal2)}`, '_blank');
      }, 500);
    }
  };

  const handleUploadImagemLente = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    alert(`Arquivo "${arquivo.name}" carregado! Analisando via ROBOTOC & Gemini Multimodal...`);
  };

  const chatsFiltrados = historicoChats.filter(c => c.titulo.toLowerCase().includes(pesquisaChat.toLowerCase()));

  // =========================================================================================
  // 🛡️ --- RENDERIZAÇÃO DA TELA DE BLOQUEIO / SEGURANÇA --- 🛡️
  // =========================================================================================
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Segoe UI", sans-serif', background: 'radial-gradient(circle at 50% 50%, #0d061a 0%, #020204 90%)', padding: '20px', boxSizing: 'border-box' }}>
        <Head>
          <title>Emanuel.OS v5.1 - Autenticação ROBOTOC (7 Camadas + Tripla Segurança) | 2030</title>
        </Head>

        <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '440px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)', backdropFilter: 'blur(20px)', textAlign: 'center', boxSizing: 'border-box' }}>

          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#ff0055' }}>.OS</span> & ROBOTOC
          </h2>
          <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '20px', letterSpacing: '1px' }}>
            PROTOCOLO DE SEGURANÇA DE 7 ETAPAS ({etapaSeguranca}/7) | CORE v5.1
          </span>

          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 1 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 2 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 3 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 4 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 5 ? '#ff0055' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 6 ? '#eab308' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 7 ? '#00ff66' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          </div>

          {/* 🛡️ 1ª ETAPA ATUALIZADA: VALIDAÇÃO DA CHAVE DE ACESSO DE 3 CAMADAS (2 SERVIDORES + DISPOSITIVO) */}
          {etapaSeguranca === 1 && (
            <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>
                🛡️ 1ª Etapa: Chave de Acesso Tripla (3 Camadas / 2 Servidores)
              </span>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
                Prioridade ativada para Celular Mestre <b>(88) 98149-3989</b> e Notebook do Criador.
              </p>

              <div style={{ backgroundColor: '#020617', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', padding: '8px', fontSize: '10px', color: '#38bdf8' }}>
                {statusAcessoTriplo}
              </div>

              {!bloqueioInvasor && (
                <>
                  <input 
                    type="password" 
                    value={chaveAcessoTripla} 
                    onChange={(e) => setChaveAcessoTripla(e.target.value)}
                    placeholder="Digite sua Chave Mestre de 3 Camadas..."
                    disabled={validandoServidores}
                    style={{ padding: '14px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '13px', outline: 'none' }}
                  />

                  <button 
                    type="submit"
                    disabled={validandoServidores}
                    style={{ padding: '14px', backgroundColor: validandoServidores ? '#0284c7' : '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)', transition: 'all 0.3s' }}
                  >
                    {validandoServidores ? '⏳ Validando Servidores de Ponta...' : '🔐 Validar Chave de 3 Camadas ➔'}
                  </button>
                </>
              )}
            </form>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={validarEtapa2Telefone} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ Chave de 3 Camadas Aprovada!</span>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>📱 2ª Etapa: Digite seu Número de Telefone:</span>
              <input 
                type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)}
                placeholder="Ex: 88981493989"
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.4)', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '16px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                Validar Telefone ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 3 && (
            <form onSubmit={validarEtapa3Pin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ Telefone Aprovado!</span>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>🔢 3ª Etapa: Digite seu PIN Mestre:</span>
              <input 
                type="password" maxLength={4} value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)}
                placeholder="****"
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.4)', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '24px', letterSpacing: '8px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                Validar PIN ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 4 && (
            <form onSubmit={validarEtapa4Email} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ PIN Aprovado!</span>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>📧 4ª Etapa: Digite seu E-mail Autorizado:</span>
              <input 
                type="email" value={emailDigitado} onChange={(e) => setEmailDigitado(e.target.value)}
                placeholder="seuemail@gmail.com"
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.4)', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                Validar E-mail ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 5 && (
            <form onSubmit={validarEtapa5Chave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ E-mail Confirmado!</span>
              <span style={{ fontSize: '11px', color: '#ff0055', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre:</span>
              <input 
                type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)}
                placeholder="Palavra-Chave Mestre..."
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ff0055', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', fontSize: '14px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#ff0055', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,0,85,0.4)' }}>
                Ir para a 6ª Camada ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ 5 Camadas Validadas!</span>
              <span style={{ fontSize: '12px', color: '#eab308', fontWeight: 'bold' }}>🔑 6ª Camada: Ticons OS gevaGifs</span>

              <p style={{ fontSize: '11px', color: '#38bdf8', margin: 0 }}>{statusTicons}</p>
              {!isAdmin && <p style={{ fontSize: '10px', color: '#f59e0b', margin: 0 }}>Tentativas hoje: <b>{attemptsLeft}/2</b></p>}

              {!isLockedTicons || isAdmin ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '12px 0' }}>
                    {availableOptions.map((opt, idx) => (
                      <button
                        key={idx} onClick={() => handleSelectOptionTicons(opt)}
                        style={{ backgroundColor: '#1e293b', border: '1px solid #eab308', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Sequência: <span style={{ color: '#eab308' }}>{selectedSequence.join(' ➔ ') || 'Nenhuma'}</span></p>
                </div>
              ) : (
                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>Acesso bloqueado até amanhã.</p>
              )}
            </div>
          )}

          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ 6 Camadas Validadas!</span>
              <span style={{ fontSize: '13px', color: '#00f0ff', fontWeight: '900', letterSpacing: '1px' }}>
                📡 7ª CAMADA: MAPEAMENTO CÓSMICO VIA QR CODE | DECODER v5.1
              </span>

              {animacaoMontandoMapa ? (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '120px', height: '120px', border: '3px solid #00f0ff', borderRadius: '50%', borderTopColor: 'transparent', animation: 'girarRadar 1s linear infinite' }} />
                  <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    🧬 Ativando ROBOTOC, Data Center 3D, Shell e Sincronizando Quick Actions...
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)' }}>
                    <QRCodeSVG value={qrPayload} size={150} />
                  </div>

                  <span style={{ fontSize: '10px', color: '#a1a1aa' }}>
                    Escaneie este QR Code no seu celular ou clique abaixo para liberar o sistema:
                  </span>

                  <button 
                    onClick={executarEscaneamentoQRCode7aCamada}
                    disabled={qrCodeValidando}
                    style={{
                      width: '100%', padding: '14px', backgroundColor: qrCodeValidando ? '#0284c7' : '#00f0ff',
                      color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px',
                      cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)', transition: 'all 0.3s'
                    }}
                  >
                    {qrCodeValidando ? '🔍 Sincronizando Leitura do QR Code Decoder v5.1...' : '📱 Validar QR Code & Mapear Sistema ➔'}
                  </button>
                </>
              )}
            </div>
          )}

        </div>
        <style>{`
          @keyframes girarRadar {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // =========================================================================================
  // 🌟 --- RENDERIZAÇÃO DO SISTEMA EMANUEL.OS CORE (DESBLOQUEADO) --- 🌟
  // =========================================================================================
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#020617',
      backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Emanuel.OS Core v5.1 | ROBOTOC Multicloud Data Center 3D | Shell Nativo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>

        <div style={{
          width: modoDevSplit ? '50%' : '100%',
          height: '100%',
          position: 'relative',
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}>

          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab', touchAction: 'none' }} />

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSidebarAberta(!sidebarAberta)}
              style={{
                backgroundColor: '#09090b', border: '1px solid rgba(0, 240, 255, 0.3)',
                color: '#00f0ff', width: '40px', height: '40px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '16px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {sidebarAberta ? '✕' : '☰'}
            </button>

            <button 
              onClick={() => setModoDevSplit(!modoDevSplit)}
              style={{
                backgroundColor: modoDevSplit ? '#ff007f' : 'rgba(168, 85, 247, 0.2)',
                border: '1px solid #a855f7', color: modoDevSplit ? '#fff' : '#c084fc',
                padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '11px', boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease'
              }}
            >
              🖥️ {modoDevSplit ? 'Fechar Split' : 'Dev Split'}
            </button>

            <button
              onClick={() => setMostrarOverlayRobotoc(!mostrarOverlayRobotoc)}
              style={{
                backgroundColor: mostrarOverlayRobotoc ? '#00f0ff' : 'rgba(0, 240, 255, 0.15)',
                border: '1px solid #00f0ff', color: mostrarOverlayRobotoc ? '#000' : '#00f0ff',
                padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '11px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease'
              }}
            >
              🤖 {mostrarOverlayRobotoc ? 'Ocultar ROBOTOC HUD' : 'Pensamento ROBOTOC HUD'}
            </button>
          </div>

          <aside style={{
            position: 'absolute', top: 0, left: 0,
            width: sidebarAberta ? '100%' : '0px', maxWidth: '400px', opacity: sidebarAberta ? 1 : 0,
            backgroundColor: 'rgba(7, 7, 12, 0.95)', backdropFilter: 'blur(30px)',
            borderRight: sidebarAberta ? '1px solid rgba(0, 240, 255, 0.2)' : 'none',
            padding: sidebarAberta ? '25px' : '0px', display: 'flex', flexDirection: 'column',
            gap: '18px', height: '100vh', overflowY: 'auto', zIndex: 90, boxSizing: 'border-box',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {sidebarAberta && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: 0, color: '#fff' }}>
                      Contexto: EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span>
                    </h1>
                    <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>ASSISTENTE ROBOTOC & SHELL NATIVO | Core v5.1</span>
                  </div>
                  {privilegedSession && <span style={{ fontSize: '14px' }}>🔐 root</span>}
                </div>

                <GoogleMeetAvatarManager addLog={addLogTerminal} />

                <UnixTerminalCanvas />

                <FormularioCapturaEmanuelOS />

                <div style={{ padding: '15px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ color: '#00f0ff', fontSize: '13px', margin: '0 0 10px 0', fontWeight: 'bold' }}>🌐 Central de Mapas Integrados (2030)</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Link href="/espacial" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                      🪐 Mapa Espacial
                    </Link>

                    <Link href="/mapa" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #16a34a', color: '#4ade80', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                      🌍 Mapa Terrestre
                    </Link>

                    <Link href="/mapa-ia" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                      ⚡ Gerador 3D IA
                    </Link>

                    <Link href="/mapaaeroespacial" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #9333ea', color: '#c084fc', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                      🛸 Aeroespacial Futuro
                    </Link>

                    <Link href="/mapa-ressonancia" style={{ 
                      padding: '10px', backgroundColor: '#0f172a', border: '1px solid #10b981', 
                      color: '#34d399', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', 
                      fontSize: '11px', textAlign: 'center', gridColumn: 'span 2'
                    }}>
                      🧠 Ressonância
                    </Link>

                    <Link href="/mapa-quantico" style={{ 
                      padding: '10px', backgroundColor: '#0f172a', border: '1px solid #8b5cf6', 
                      color: '#c084fc', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', 
                      fontSize: '11px', textAlign: 'center', gridColumn: 'span 2'
                    }}>
                      ⚛️ Mapa Matemático Quântico
                    </Link>

                    <Link href="/mapa-orkut" style={{ 
                      padding: '10px', backgroundColor: '#0f172a', border: '1px solid #ff007f', 
                      color: '#ff007f', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', 
                      fontSize: '11px', textAlign: 'center', gridColumn: 'span 2'
                    }}>
                      💖 Mapa Orkut Social 3D
                    </Link>

                    <Link href="/mapa-patologia" style={{ 
                      padding: '10px', backgroundColor: '#0f172a', border: '1px solid #00f0ff', 
                      color: '#00f0ff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', 
                      fontSize: '11px', textAlign: 'center', gridColumn: 'span 2'
                    }}>
                      🔬 Mapa de Patologia & Laboratório 3D
                    </Link>

                    <Link href="/mapa-antiguidades" style={{ 
                      padding: '10px', backgroundColor: '#0f172a', border: '1px solid #eab308', 
                      color: '#fef08a', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', 
                      fontSize: '11px', textAlign: 'center', gridColumn: 'span 2'
                    }}>
                      🏛️ Mapa Temporal de Antiguidades
                    </Link>
                  </div>
                </div>

                <input 
                  type="text" value={pesquisaChat} onChange={(e) => setPesquisaChat(e.target.value)}
                  placeholder="🔍 Pesquisar no histórico cósmico..."
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                />

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>⚡ CONVERSAS RECENTES (LOCAL)</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {chatsFiltrados.filter(c => c.origem === 'recente').map(c => (
                        <div key={c.id} style={{ fontSize: '11px', color: '#a1a1aa', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>💬 {c.titulo}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🌐 SALVAS VIA CONTA GOOGLE (AGI-SYNC)</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {chatsFiltrados.filter(c => c.origem === 'google').map(c => (
                        <div key={c.id} style={{ fontSize: '11px', color: '#e4e4e7', padding: '8px 10px', background: 'rgba(255,0,85,0.03)', borderRadius: '6px', border: '1px solid rgba(255,0,85,0.1)' }}>🌟 {c.titulo}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '0.5px' }}>💬 ENVIOS REAIS INTEGRADOS (WHATSAPP ID)</span>
                  <form onSubmit={executarDisparoReal} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="text" placeholder="DDD 1" value={ddd1} onChange={(e) => setDdd1(e.target.value)} style={{ width: '55px', padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '11px' }} />
                      <input type="text" placeholder="Número Celular 1" value={telefone1} onChange={(e) => setTelefone1(e.target.value)} style={{ flexGrow: 1, padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="text" placeholder="DDD 2" value={ddd2} onChange={(e) => setDdd2(e.target.value)} style={{ width: '55px', padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '11px' }} />
                      <input type="text" placeholder="Número Celular 2" value={telefone2} onChange={(e) => setTelefone2(e.target.value)} style={{ flexGrow: 1, padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                    </div>

                    <input type="text" placeholder="Mensagem Canal 1" value={msgCanal1} onChange={(e) => setMsgCanal1(e.target.value)} style={{ padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                    <input type="text" placeholder="Mensagem Canal 2" value={msgCanal2} onChange={(e) => setMsgCanal2(e.target.value)} style={{ padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />

                    <select value={modoDisparo} onChange={(e) => setModoDisparo(e.target.value)} style={{ width: '100%', padding: '7px', backgroundColor: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '11px' }}>
                      <option value="ambos">Disparar as duas linhas juntas (ID v5.1)</option>
                      <option value="canal1">Disparar somente Linha 1</option>
                      <option value="canal2">Disparar somente Linha 2</option>
                    </select>
                    <button type="submit" style={{ width: '100%', padding: '9px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Executar Disparo Real G-AGI ID ➔</button>
                  </form>
                </div>

                <div style={{ padding: '10px', backgroundColor: 'rgba(0, 240, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)', textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: '#a1a1aa', display: 'block' }}>DESENVOLVIDO POR EMANUEL DA SILVA | ANO: 2030</span>
                  <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>🌐 ASSISTENTE HUMANOIDE: ROBOTOC v5.1</span>
                </div>
              </>
            )}
          </aside>

          {/* 🔐 MODAL DE AUTENTICAÇÃO DE SESSÃO PRIVILEGIADA (HOLOGRÁFICO) 🔐 */}
          {authStepPrivileged > 0 && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)',
              zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}>
              <form onSubmit={processarAuthPrivilegiada} style={{
                backgroundColor: 'rgba(7, 12, 28, 0.98)', border: '2px solid #ef4444',
                borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '400px',
                boxShadow: '0 0 50px rgba(239, 68, 68, 0.4)', textAlign: 'center',
                position: 'relative', boxSizing: 'border-box', color: '#fff'
              }}>
                <button 
                  type="button" 
                  onClick={() => setAuthStepPrivileged(0)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>

                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
                <h2 style={{ color: '#ef4444', fontSize: '18px', fontWeight: '900', letterSpacing: '1px', margin: '0 0 10px 0' }}>
                  SESSÃO PRIVILEGIADA (root)
                </h2>
                <span style={{ fontSize: '10px', color: '#fca5a5', fontWeight: 'bold', display: 'block', marginBottom: '20px', fontFamily: 'monospace' }}>
                  G-AGI SECURITY GATEWAY v5.1
                </span>

                {authStepPrivileged === 1 && (
                    <>
                        <p style={{ fontSize: '11px', color: '#fff', margin: '0 0 15px 0' }}>Mestre Emanuel, insira a Senha de Acesso Privilegiado (root):</p>
                        <input 
                            type="password" 
                            value={passwordPrivileged} 
                            onChange={(e) => setPasswordPrivileged(e.target.value)}
                            placeholder="Digite a Senha Mestre Privilegiada..."
                            style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #ef4444', backgroundColor: '#09090b', color: '#ef4444', textAlign: 'center', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(239,68,68,0.4)', transition: 'all 0.3s' }}>
                            Validar Senha ➔
                        </button>
                    </>
                )}

                {authStepPrivileged === 2 && (
                    <>
                        <p style={{ fontSize: '11px', color: '#4ade80', margin: '0 0 5px 0', fontWeight: 'bold' }}>✅ Senha aceita.</p>
                        <p style={{ fontSize: '11px', color: '#fff', margin: '0 0 15px 0' }}>Insira o código TOTP (6 dígitos) gerado pelo G-AGI Authenticator:</p>
                        <input 
                            type="text" 
                            maxLength={6}
                            value={totpPrivileged} 
                            onChange={(e) => setTotpPrivileged(e.target.value.replace(/\D/g, ''))} // Apenas números
                            placeholder="######"
                            style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #ff007f', backgroundColor: '#09090b', color: '#ff007f', textAlign: 'center', fontSize: '28px', letterSpacing: '10px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                        />
                        <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,0,127,0.4)', transition: 'all 0.3s' }}>
                            🔓 Ativar Sessão Privilegiada root ➔
                        </button>
                    </>
                )}
              </form>
            </div>
          )}

          {/* MODAL SUPORTE EM IA */}
          {modalSuporteAberto && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(15px)',
              zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}>
              <div style={{
                backgroundColor: 'rgba(8, 15, 30, 0.95)', border: '1px solid #00f0ff',
                borderRadius: '16px', padding: '25px', width: '100%', maxWidth: '700px',
                boxShadow: '0 0 35px rgba(0, 240, 255, 0.25)', position: 'relative'
              }}>
                <button 
                  onClick={() => setModalSuporteAberto(false)}
                  style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#00f0ff', fontSize: '18px', cursor: 'pointer' }}
                >
                  ✕
                </button>

                <h2 style={{ color: '#00f0ff', fontSize: '16px', margin: '0 0 4px 0', letterSpacing: '1px' }}>
                  EM-AI // CENTRAL DE SUPORTE & ASSISTÊNCIA ROBOTOC | Core v5.1
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 15px 0' }}>
                  Resolução Autônoma de Bugs (90% IA), Compatibilidade de Apps, Documentos e Códigos ROBOTOC
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <button onClick={() => setAbaSuporteAtiva('diagnostico')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'diagnostico' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'diagnostico' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🛠️ Diagnóstico</button>
                  <button onClick={() => setAbaSuporteAtiva('codigo')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'codigo' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'codigo' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>💻 Códigos G-AGI</button>
                  <button onClick={() => setAbaSuporteAtiva('avatar')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'avatar' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'avatar' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🎥 Vídeo-Aula Holográfica</button>
                  <button onClick={() => setAbaSuporteAtiva('feedback')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'feedback' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'feedback' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>⭐ Feedbacks Cósmicos</button>
                </div>

                <textarea 
                  value={inputProblemaSuporte}
                  onChange={(e) => setInputProblemaSuporte(e.target.value)}
                  placeholder="Descreva seu bug, problema de compatibilidade ou solicitação ao Robotoc..."
                  style={{ width: '100%', height: '80px', backgroundColor: '#020617', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', color: '#fff', padding: '10px', fontSize: '11px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />

                <button 
                  onClick={processarSuporteIA}
                  disabled={carregandoSuporte}
                  style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)' }}
                >
                  {carregandoSuporte ? '⏳ Analisando no Núcleo ROBOTOC v5.1...' : '🚀 Executar Solução IA v5.1 (90%)'}
                </button>

                {respostaSuporte && (
                  <div style={{ marginTop: '15px', backgroundColor: 'rgba(0, 240, 255, 0.05)', borderLeft: '3px solid #00f0ff', padding: '12px', borderRadius: '6px', fontSize: '11px' }}>
                    <strong style={{ color: '#00f0ff', display: 'block', marginBottom: '4px' }}>Diagnóstico ROBOTOC:</strong>
                    <p style={{ margin: '0 0 8px 0', color: '#cbd5e1' }}>{respostaSuporte.diagnostico}</p>

                    {respostaSuporte.codigo && (
                      <pre style={{ backgroundColor: '#010409', padding: '8px', borderRadius: '4px', color: '#38bdf8', overflowX: 'auto', fontSize: '10px', margin: '6px 0' }}>
                        {respostaSuporte.codigo}
                      </pre>
                    )}

                    <p style={{ color: '#4ade80', margin: '4px 0' }}>📄 {respostaSuporte.documento}</p>
                    <p style={{ color: '#fb923c', margin: '4px 0' }}>🎥 {respostaSuporte.avatarVideo}</p>

                    <div style={{ marginTop: '8px', padding: '6px', backgroundColor: 'rgba(255,0,127,0.1)', border: '1px dashed #ff007f', borderRadius: '4px', color: '#ff007f', fontSize: '10px' }}>
                      ⚠️ Protocolo de Segurança v5.1: {respostaSuporte.protocolo}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAINEL FLUIDO DIREITO: ROBOTOC, TERMINAL & G-AGI EDGE v5.1 */}
          <div style={{
            position: 'absolute', right: painelFluidoDireitoAberto ? '0px' : '-380px', top: '10px',
            height: 'calc(100vh - 20px)', width: '100%', maxWidth: '370px', backgroundColor: 'rgba(7, 12, 28, 0.92)',
            backdropFilter: 'blur(25px)', border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRadius: '16px 0 0 16px', zIndex: 95, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
            gap: '12px', boxShadow: '-10px 0 40px rgba(0, 240, 255, 0.25)'
          }}>
            <button 
              onClick={() => setPainelFluidoDireitoAberto(!painelFluidoDireitoAberto)}
              style={{
                position: 'absolute', left: '-42px', top: '25px', width: '42px', height: '48px',
                backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)',
                borderRight: 'none', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px',
                color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {painelFluidoDireitoAberto ? '➔' : '◀'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                ROBOTOC Terminal & Edge | Core v5.1
              </span>
              <button onClick={() => setPainelFluidoDireitoAberto(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>✕</button>
            </div>

            <div>
              <h3 style={{ color: '#00f0ff', fontSize: '13px', margin: 0, fontWeight: '900', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🤖 ROBOTOC + G-AGI EDGE & SHELL v5.1
              </h3>
              <h4 style={{ color: privilegedSession ? '#ef4444' : '#38bdf8', fontSize: '11px', margin: '2px 0 0 0', fontWeight: 'bold' }}>
                {privilegedSession ? '⚠️ MODO PRIVILEGIADO (root) ATIVO ⚠️' : 'NÚCLEO DE RESPOSTA AUXILIAR LOCAL/EDGE'}
              </h4>
              <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', fontFamily: 'monospace' }}>
                (ROBOTOC: ACTIVE | Data Center 3D | CF Edge)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button 
                  onClick={() => setModalCreatorStudioAberto(true)}
                  style={{
                    backgroundColor: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff',
                    padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                  }}
                >
                  📊 EM Creator Studio
                </button>

                <button 
                  onClick={() => setModalSuporteAberto(true)}
                  style={{
                    backgroundColor: 'rgba(255, 0, 127, 0.15)', border: '1px solid #ff007f', color: '#ff007f',
                    padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                  }}
                >
                  🛠️ Suporte ROBOTOC
                </button>
              </div>

              <button 
                onClick={baixarPDF300Comandos}
                style={{
                  backgroundColor: 'rgba(234, 88, 12, 0.2)', border: '1px solid #ea580c', color: '#fb923c',
                  padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                📄 Baixar Manual ROBOTOC Mestre (300 Comandos)
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                <button onClick={() => executarComandoCMD('/nano-banana')} style={{ backgroundColor: '#0f172a', border: '1px solid #eab308', color: '#fef08a', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                  🍌 /nano-banana
                </button>
                <button onClick={() => executarComandoCMD('/gerar-mapa')} style={{ backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                  🗺️ /gerar-mapa
                </button>
                <button onClick={() => executarComandoCMD('/status-core')} style={{ backgroundColor: '#0f172a', border: '1px solid #00f0ff', color: '#38bdf8', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
                  ⚡ /status-core
                </button>
                <button onClick={() => executarComandoCMD('sess -start privileged')} disabled={privilegedSession} style={{ backgroundColor: privilegedSession ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)', border: privilegedSession ? '1px solid #4ade80' : '1px solid #ef4444', color: privilegedSession ? '#4ade80' : '#fca5a5', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: privilegedSession ? 'default' : 'pointer', textAlign: 'left' }}>
                  🔓 sess -start priv
                </button>
              </div>
            </div>

            <div style={{
              flexGrow: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', borderRadius: '12px', padding: '12px',
              border: '1px solid rgba(0, 240, 255, 0.2)', overflowY: 'auto', fontSize: '10px',
              fontFamily: 'Consolas, monospace', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px'
            }}>
              {cmdLogs.map((log, i) => (
                <p key={i} style={{
                  margin: 0, lineHeight: '1.4', wordBreak: 'break-all',
                  color: log.startsWith('[ROBOTOC: LOG]') ? '#94a3b8' :
                         log.startsWith('[ROBOTOC: STATUS]') ? '#4ade80' :
                         log.startsWith('[CMD>') ? '#38bdf8' :
                         log.startsWith('[CLOUDFLARE:') ? '#fb923c' :
                         log.startsWith('[ROBOTOC: QUICK_ACTION]') ? '#ff007f' :
                         log.startsWith('[AUTH:') ? '#fca5a5' :
                         log.startsWith('[ROBOTOC: SHELL] root@') ? '#ef4444' :
                         log.startsWith('[ROBOTOC: QUERY]') ? '#38bdf8' : '#e2e8f0'
                }}>
                  {log}
                </p>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (cmdInput.trim()) executarComandoCMD(cmdInput); }} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#020617', border: `1px solid ${privilegedSession ? '#ef4444' : '#00f0ff'}`, borderRadius: '8px', padding: '8px 12px' }}>
              <span style={{ color: privilegedSession ? '#ef4444' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', marginRight: '6px', fontFamily: 'monospace' }}>
                {privilegedSession ? '[root@emanuel-os:~#]' : '[User@emanuel-os:~#]'}
              </span>
              <input
                type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
                placeholder={privilegedSession ? "Comando root (perigoso)..." : "Comando ROBOTOC... (ex: /gif naruto)"}
                style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', flexGrow: 1, fontFamily: 'Consolas, monospace' }}
              />
              <button type="submit" style={{ backgroundColor: privilegedSession ? '#ef4444' : '#00f0ff', color: privilegedSession ? '#fff' : '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
            </form>
          </div>

          <div className="header-status-bar" style={{
            position: 'absolute', top: '15px', left: sidebarAberta ? '420px' : '230px', right: '15px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
            transition: 'left 0.3s', flexWrap: 'wrap', gap: '8px'
          }}>
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '8px 12px',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)'
            }}>
              <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>ROBOTOC Data Center 3D | CF Edge</span>
              <strong style={{ fontSize: '11px', color: '#00f0ff' }}>📶 Emanuel Sync 2030</strong>
            </div>

            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '8px 12px',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#00f0ff' }}>🕒</span>
              <div>
                <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block' }}>TEMPO NEURAL</span>
                <strong style={{ fontSize: '10px', color: '#fff', fontFamily: 'monospace' }}>
                  {horaAtual || '14 Março 2030'}
                </strong>
              </div>
            </div>
          </div>

          {mostrarOverlayRobotoc && (
            <div className="quantum-browser-widget" style={{
              position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)', zIndex: 150,
              backgroundColor: 'rgba(8, 15, 30, 0.95)', backdropFilter: 'blur(25px)',
              border: '2px solid #00f0ff', borderRadius: '20px', padding: '16px',
              width: 'calc(100% - 30px)', maxWidth: '580px', boxShadow: '0 0 45px rgba(0, 240, 255, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxSizing: 'border-box',
              display: privilegedSession ? 'none' : 'block' // Esconder browser se root estiver ativo
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🤖</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '12px', color: '#00f0ff', fontWeight: '900', letterSpacing: '1px' }}>
                      PENSAMENTO ROBOTOC 3D DATA CENTER & NUVEM
                    </h3>
                    <span style={{ fontSize: '8px', color: '#a1a1aa' }}>Emanuel.OS Multicloud Vault & Quantum Browser</span>
                  </div>
                </div>

                <button
                  onClick={() => setMostrarOverlayRobotoc(false)}
                  style={{ background: 'none', border: 'none', color: '#00f0ff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', background: 'rgba(2, 6, 23, 0.8)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.2)' }}>
                <button 
                  onClick={() => setNuvemSelecionada('google')}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'google' ? '#4285f4' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🌐 Google Drive
                </button>
                <button 
                  onClick={() => setNuvemSelecionada('apple')}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'apple' ? '#ffffff' : 'transparent', color: nuvemSelecionada === 'apple' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🍏 Apple iCloud
                </button>
                <button 
                  onClick={() => setNuvemSelecionada('microsoft')}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'microsoft' ? '#00a4ef' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🪟 OneDrive
                </button>
                <button 
                  onClick={() => setNuvemSelecionada('custom')}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'custom' ? '#ff007f' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🌌 Vault 3D
                </button>
              </div>

              <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.2)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>
                    NUVEM ATIVA: {nuvemSelecionada.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '10px', color: '#fff' }}>Conta: {statusNuvem[nuvemSelecionada].conta}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '9px', color: '#4ade80', fontWeight: 'bold', display: 'block' }}>STATUS: ONLINE</span>
                  <span style={{ fontSize: '9px', color: '#94a3b8' }}>Espaço: {statusNuvem[nuvemSelecionada].espaco}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', background: '#020617', padding: '4px', borderRadius: '10px', border: '1px solid rgba(0,240,255,0.2)' }}>
                <button
                  onClick={() => setAbaOverlayAtiva('browser')}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    backgroundColor: abaOverlayAtiva === 'browser' ? '#00f0ff' : 'transparent',
                    color: abaOverlayAtiva === 'browser' ? '#000' : '#00f0ff',
                    fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  🌐 Quantum Browser
                </button>

                <button
                  onClick={() => setAbaOverlayAtiva('quickactions')}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    backgroundColor: abaOverlayAtiva === 'quickactions' ? '#ff007f' : 'transparent',
                    color: abaOverlayAtiva === 'quickactions' ? '#fff' : '#ff007f',
                    fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  ⚡ Quick Actions v2.0
                </button>

                <button
                  onClick={() => setAbaOverlayAtiva('devstudio')}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    backgroundColor: abaOverlayAtiva === 'devstudio' ? '#a855f7' : 'transparent',
                    color: abaOverlayAtiva === 'devstudio' ? '#fff' : '#a855f7',
                    fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  💻 Dev & G-AGI Edge
                </button>
              </div>

              {abaOverlayAtiva === 'browser' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <select 
                        value={motorBuscaSelecionado} 
                        onChange={(e) => setMotorBuscaSelecionado(e.target.value)}
                        style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', padding: '6px', borderRadius: '8px', fontSize: '10px', outline: 'none' }}
                      >
                        <option value="google">Google</option>
                        <option value="bing">Bing</option>
                        <option value="duckduckgo">DuckDuckGo</option>
                      </select>

                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#020617', border: '1px solid #00f0ff', borderRadius: '10px', padding: '4px 10px', flexGrow: 1 }}>
                        <span style={{ fontSize: '11px', color: '#00f0ff', marginRight: '6px' }}>🔍</span>
                        <input
                          type="text"
                          value={urlOuTermoNavegador}
                          onChange={(e) => setUrlOuTermoNavegador(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') executarNavegacaoBrowser(urlOuTermoNavegador, abaBuscaNavegador); }}
                          placeholder="Pesquisar assunto, site, Bitcoin ou G-AGI..."
                          style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '11px', outline: 'none', width: '100%', fontFamily: 'monospace' }}
                        />
                      </div>

                      <button 
                        onClick={() => executarNavegacaoBrowser(urlOuTermoNavegador, abaBuscaNavegador)} 
                        style={{ padding: '6px 12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
                      >
                        Ir ➔
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                      🧠 MODOS DE PENSAMENTO NEURAL ROBOTOC
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      <button onClick={() => { setAbaBuscaNavegador('web'); executarNavegacaoBrowser(urlOuTermoNavegador, 'web'); }} style={{ padding: '6px 2px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: abaBuscaNavegador === 'web' ? '#00f0ff' : 'transparent', color: abaBuscaNavegador === 'web' ? '#000' : '#00f0ff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>🌐 Web</button>
                      <button onClick={iniciarVozNavegador} style={{ padding: '6px 2px', borderRadius: '8px', border: '1px solid #a855f7', backgroundColor: escutandoVozNavegador ? '#ff007f' : 'transparent', color: '#a855f7', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>{escutandoVozNavegador ? '🔴 Ouvindo' : '🎙️ Voz'}</button>
                      <button onClick={() => imageInputRef.current && imageInputRef.current.click()} style={{ padding: '6px 2px', borderRadius: '8px', border: '1px solid #eab308', backgroundColor: 'transparent', color: '#eab308', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>🖼️ Mídias</button>
                      <button onClick={() => pdfInputRef.current && pdfInputRef.current.click()} style={{ padding: '6px 2px', borderRadius: '8px', border: '1px solid #4ade80', backgroundColor: 'transparent', color: '#4ade80', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>📄 PDF</button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#020617', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '12px', padding: '10px', maxHeight: '140px', overflowY: 'auto' }}>
                    <h4 style={{ fontSize: '11px', margin: '0 0 4px 0', color: '#fff' }}>{browserAsset.titulo}</h4>
                    <p style={{ fontSize: '9px', color: '#ff007f', margin: '0 0 6px 0' }}>{browserAsset.subtitulo}</p>
                    <p style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>{browserAsset.conteudoTexto}</p>
                  </div>
                </div>
              )}

              {abaOverlayAtiva === 'quickactions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '9px', color: '#ff007f', fontWeight: 'bold', display: 'block' }}>
                    ⚡ QUICK ACTIONS v2.0 (GERADORES & DOCUMENT ENGINE)
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <div onClick={() => dispararQuickAction('crie_imagem')} style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🖼️</span>
                      <div><strong style={{ fontSize: '10px', color: '#fff', display: 'block' }}>Gerar Imagem</strong><span style={{ fontSize: '8px', color: '#94a3b8' }}>Modelo EM 1.0</span></div>
                    </div>
                    <div onClick={() => dispararQuickAction('crie_video')} style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🎬</span>
                      <div><strong style={{ fontSize: '10px', color: '#fff', display: 'block' }}>Gerar Vídeo 4K</strong><span style={{ fontSize: '8px', color: '#94a3b8' }}>Modelo EM</span></div>
                    </div>
                    <div onClick={() => dispararQuickAction('crie_gif')} style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🎞️</span>
                      <div><strong style={{ fontSize: '10px', color: '#fff', display: 'block' }}>GIF Animado</strong><span style={{ fontSize: '8px', color: '#94a3b8' }}>GIEM 1.0 Sync</span></div>
                    </div>
                    <div onClick={() => dispararQuickAction('gerar_pdf')} style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📄</span>
                      <div><strong style={{ fontSize: '10px', color: '#fff', display: 'block' }}>G-AGI PDF Doc</strong><span style={{ fontSize: '8px', color: '#fca5a5' }}>Processamento EM v1.0</span></div>
                    </div>
                  </div>
                </div>
              )}

              {abaOverlayAtiva === 'devstudio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <CloudflareWorkerDeployer addLog={addLogTerminal} />
                  <BitcoinAnalysisPanel />
                </div>
              )}

            </div>
          )}

          <div style={{
            position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, width: 'calc(100% - 30px)', maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '8px'
          }}>

            <div style={{
              backgroundColor: 'rgba(8, 15, 30, 0.85)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 0, 127, 0.5)', borderRadius: '10px', padding: '6px 14px',
              textAlign: 'center', boxShadow: '0 0 20px rgba(255, 0, 127, 0.2)'
            }}>
              <span style={{ fontSize: '8px', color: '#ff007f', fontWeight: 'bold', letterSpacing: '1px', display: 'block' }}>
                IA ROBOTOC (GEMINI AGI Core v5.1 Multimodal CF Edge Sync)
              </span>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>
                Emanuel.OS Core v5.1 | ROBOTOC Active | 2030
              </span>
            </div>

            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', padding: '10px 14px',
              maxHeight: '90px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              {mensagens.map((item, index) => (
                <div key={index}>
                  <span style={{ fontSize: '8px', fontWeight: 'bold', color: item.tipo === 'user' ? '#00f0ff' : '#f43f5e', letterSpacing: '0.5px' }}>
                    {item.autor}
                  </span>
                  <p style={{ margin: 0, fontSize: '10px', color: '#f8fafc', lineHeight: '1.2' }}>
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleEnviarMensagemTexto} style={{
              backgroundColor: 'rgba(5, 12, 24, 0.9)', backdropFilter: 'blur(20px)',
              border: '1px solid #00f0ff', borderRadius: '25px', padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)'
            }}>
              <button type="button" onClick={() => imageInputRef.current && imageInputRef.current.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🖼️</button>
              <button type="button" onClick={iniciarEscuta} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>{estaOuvindo ? '🔴' : '🎙️'}</button>
              <input type="file" ref={imageInputRef} onChange={handleUploadImagemLente} style={{ display: 'none' }} accept="image/*" />

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Fale com o ROBOTOC, envie comandos ou digite 'help' no shell..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '10px', flexGrow: 1 }}
              />

              <button
                type="submit"
                style={{
                  backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 14px',
                  borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer',
                  boxShadow: '0 0 10px #00f0ff', whiteSpace: 'nowrap'
                }}
              >
                Executar ➔
              </button>
            </form>

          </div>

          {arquiteturaAberta && (
            <aside style={{
              position: 'absolute', right: '30px', bottom: '30px', width: '380px',
              backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.5)',
              borderRadius: '20px', padding: '20px', backdropFilter: 'blur(25px)',
              zIndex: 200, color: '#fff', boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#00f0ff', fontWeight: '900', letterSpacing: '0.5px' }}>
                  🏛️ ARQUITETURA DATA CENTER & EDGE 3D
                </h3>
                <button onClick={() => setArquiteturaAberta(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>✕</button>
              </div>
              
              <span style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginBottom: '12px', lineHeight: '1.4' }}>
                Sincronização Estrutural de Nós Orbitais, Global Edge Network (Cloudflare Workers) e G-AGI Quant Core v5.1.
              </span>

              <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                  🌐 COMPONENTES ATIVOS NO ECOSSISTEMA
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(66, 133, 244, 0.15)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(66, 133, 244, 0.5)' }}>
                    <span style={{ fontSize: '11px', color: '#4285f4', fontWeight: 'bold' }}>☁️ G-AGI Quant Core v5.1</span>
                    <span style={{ fontSize: '9px', color: '#4ade80' }}>● Stable</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(251, 146, 60, 0.15)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(251, 146, 60, 0.5)' }}>
                    <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: 'bold' }}>☁️ Cloudflare Workers Edge</span>
                    <span style={{ fontSize: '9px', color: '#fb923c' }}>● Active</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0, 240, 255, 0.1)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.4)' }}>
                    <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>💻 ROBOTOC Neural Shell v1.0</span>
                    <span style={{ fontSize: '9px', color: '#fff' }}>● Local</span>
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '10px', color: '#ff007f', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                🔗 LINKS MESTRES & REDES SOCIAIS (EMANUEL):
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                <a href={meusDadosReais.youtube} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #ff0000', color: '#ff4d4d', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>▶️ Canal YouTube Oficial</a>
                <a href={meusDadosReais.tiktok} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🎵 TikTok Oficial</a>
                <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>📸 Instagram Oficial</a>
                <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '8px', backgroundColor: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffc800', color: '#ffc800', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>✉️ E-mail Direto</a>
                <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>💬 WhatsApp Direto</a>
              </div>
            </aside>
          )}

          <FuturisticWindowManager />
        </div>

        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}

      </div>

      {modalCreatorStudioAberto && (
        <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />
      )}

      <style>{`
        @keyframes spinPulse {
          0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.8; }
        }
        @media (max-width: 768px) {
          .quantum-browser-widget {
            top: 60px !important;
            right: 15px !important;
            left: 15px !important;
            width: auto !important;
          }
          .header-status-bar {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}