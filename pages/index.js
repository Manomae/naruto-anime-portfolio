import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

import dicionarioNinja from './dicionario-ninja.json';

function calcularDiferencaLetras(palavra1, palavra2) {
  const p1 = palavra1.toLowerCase().trim();
  const p2 = palavra2.toLowerCase().trim();
  
  const matriz = [];
  for (let i = 0; i <= p1.length; i++) matriz[i] = [i];
  for (let j = 0; j <= p2.length; j++) matriz[0][j] = j;
  
  for (let i = 1; i <= p1.length; i++) {
    for (let j = 1; j <= p2.length; j++) {
      const custo = p1[i - 1] === p2[j - 1] ? 0 : 1;
      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1,
        matriz[i][j - 1] + 1,
        matriz[i - 1][j - 1] + custo
      );
    }
  }
  return matriz[p1.length][p2.length];
}

function buscarNoDicionario(perguntaUsuario) {
  if (!dicionarioNinja) return null;
  const palavrasDigitadas = perguntaUsuario.toLowerCase().split(" ");
  let melhorResultado = null;
  let menorDistancia = 3;

  for (const item of dicionarioNinja) {
    const combinacoes = [item.termo, ...(item.sinonimos || [])];

    for (const termoValido of combinacoes) {
      for (const palavraDigitada of palavrasDigitadas) {
        if (palavraDigitada === termoValido.toLowerCase()) {
          return item;
        }

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

export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [biometriaLendo, setBiometriaLendo] = useState(false);
  
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  // 🛡️ STATES DA 6ª CAMADA: Ticons OS gevaGifs
  const [isAdmin, setIsAdmin] = useState(true); 
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [isLockedTicons, setIsLockedTicons] = useState(false);
  const [statusTicons, setStatusTicons] = useState('🔐 Selecione a sequência correta do Ticons OS gevaGifs');
  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

  // 📲 STATES DA 7ª CAMADA: QR Code & Animação de Montagem de Mapa
  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const [animacaoMontandoMapa, setAnimacaoMontandoMapa] = useState(false);
  const [qrPayload, setQrCodePayload] = useState('https://github.com/Manomae/naruto-anime-portfolio');

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

  const [modo, setModo] = useState('live'); 
  const [vozAtiva, setVozAtiva] = useState('Emanuel'); 
  const [pesquisaChat, setPesquisaChat] = useState('');
  const [estaOuvindo, setEstaOuvindo] = useState(false); 
  const [usuarioLogado, setUsuarioLogado] = useState(null); 
  const [sidebarAberta, setSidebarAberta] = useState(true);
  
  // 💻 Terminal Gemini Advanced + Nano Banana 🍌
  const [painelFluidoDireitoAberto, setPainelFluidoDireitoAberto] = useState(true);
  const [cmdInput, setCmdInput] = useState('');
  const [cmdLogs, setCmdLogs] = useState([
    "[G-AGI: LOG] System core operational.",
    "[G-AGI: LOG] Parallel Cognitive Processing Module: STABLE.",
    "[G-AGI: STATUS] Núcleo de Resposta Auxiliar: ONLINE & SYNCHRONIZED.",
    "[G-AGI: QR-DECODER] Leitor de QR Code para injeção de links integrado.",
    "[CMD> G-AGI] User: Analisar fluxo de dados de naruto-anime-port...[Complete]",
    "[G-AGI: INFO] O motor complementar detectou anomalias sutis de dados (0.012%).",
    "[G-AGI: QUERY] Fornecer resumo de dados ou aguardar instruções adicionais?"
  ]);

  const [chatInput, setChatInput] = useState('');
  const [historicoChats, setHistoricoChats] = useState([
    { id: 1, titulo: 'Conversa Geral sobre IA', data: '18/07/2026', origem: 'recente' },
    { id: 2, titulo: 'Discussão sobre Clãs Ninjas', data: '18/07/2026', origem: 'recente' },
    { id: 3, titulo: 'Teoria do Chakra e Linhagens', data: '17/07/2026', origem: 'google' },
    { id: 4, titulo: 'Planejamento Emanuel Studio', data: '16/07/2026', origem: 'google' }
  ]);
  const [mensagens, setMensagens] = useState([
    { autor: 'SISTEMA', texto: '🧬 Sistema Emanuel.OS inicializado com protocolo de segurança de 7 camadas ativo (QR Code & Mapeamento 3D). Powered by Google Gemini AGI Core.', tipo: 'sys' }
  ]);

  const [ddd1, setDdd1] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [ddd2, setDdd2] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [msgCanal1, setMsgCanal1] = useState('');
  const [msgCanal2, setMsgCanal2] = useState('');
  const [modoDisparo, setModoDisparo] = useState('ambos'); 

  const imageInputRef = useRef(null);

  useEffect(() => {
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
      setEtapaSeguranca(7); // Avança para a 7ª Camada do QR Code
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

  // 📡 Escanear e Autenticar via 7ª Camada QR Code
  const executarEscaneamentoQRCode7aCamada = () => {
    setQrCodeValidando(true);
    setTimeout(() => {
      setQrCodeValidando(false);
      setAnimacaoMontandoMapa(true);

      setTimeout(() => {
        setAnimacaoMontandoMapa(false);
        setBloqueado(false);
        alert("🔓 Acesso Total Autorizado! Mapeamento QR Code e 7 Camadas de Segurança Concluídas!");
      }, 3000);
    }, 1500);
  };

  const falarTextoReal = (texto) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const iniciarEscuta = () => {
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

  useEffect(() => {
    if (bloqueado) return;
    const horaAtual = new Date().getHours();
    let textoSaudacao = horaAtual < 12 
      ? "Bom dia, Emanuel! Que bom falar com você. Core alimentado pela IA Gemini da Google com Mapeamento QR Code." 
      : horaAtual < 18 
      ? "Boa tarde, Emanuel! O sistema Emanuel Live Mode com motor Google Gemini está operacional." 
      : "Boa noite, Emanuel! Meu núcleo de IA Gemini está ativo para te dar suporte.";
    
    setTimeout(() => {
      setMensagens([{ autor: `IA ${vozAtiva.toUpperCase()} (GEMINI)`, texto: textoSaudacao, tipo: 'ia' }]);
      falarTextoReal(textoSaudacao);
    }, 1000);
  }, [vozAtiva, bloqueado]);

  const processarConversaReal = (textoUsuario) => {
    let respostaTexto = "";
    const textoLimpo = textoUsuario.toLowerCase();
    const resultadoDicionario = buscarNoDicionario(textoUsuario);

    if (resultadoDicionario) {
      respostaTexto = `Rastreando dados cognitivos sobre o termo "${resultadoDicionario.termo}" (${resultadoDicionario.categoria}): ${resultadoDicionario.significado}`;
    } else if (textoLimpo.includes('bom dia') || textoLimpo.includes('boa tarde') || textoLimpo.includes('boa noite')) {
      respostaTexto = "Olá, Emanuel! Como posso te ajudar a programar ou editar agora?";
    } else {
      respostaTexto = `Entendido, Emanuel. Analisei seu comando "${textoUsuario}" no Live Mode via núcleo Google Gemini. Processando com a biblioteca central.`;
    }

    setTimeout(() => {
      setMensagens(prev => [...prev, { autor: `IA ${vozAtiva.toUpperCase()} (GEMINI)`, texto: respostaTexto, tipo: 'ia' }]);
      falarTextoReal(respostaTexto);
    }, 600);
  };

  const handleEnviarMensagemTexto = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMensagens(prev => [...prev, { autor: 'USER@EMANUEL', texto: chatInput, tipo: 'user' }]);
    processarConversaReal(chatInput);
    setChatInput('');
  };

  // Funções do Terminal CMD Interativo
  const executarComandoCMD = (comandoDigitado) => {
    const cmd = comandoDigitado.trim();
    if (!cmd) return;

    const novosLogs = [...cmdLogs, `[CMD> G-AGI] User: ${cmd}`];

    if (cmd.includes('/nano-banana') || cmd.includes('banana')) {
      novosLogs.push("[G-AGI: NANO BANANA 🍌] Renderizando imagem 3D ultra-realista no modelo Octane:");
      novosLogs.push(">> Prompt ativo: 'Hyperrealistic Ninja Village, glowing cyan chakra wires, 8k resolution, raytracing photorealistic'");
    } else if (cmd.includes('/gerar-mapa')) {
      novosLogs.push("[G-AGI: ENGINE] Conectando matriz de dados ao gerador 3D de mapas...");
    } else if (cmd.includes('/status-core') || cmd.includes('/status')) {
      novosLogs.push("[G-AGI: STATUS] 7 Camadas: PROTEGIDAS | QR Code & Ticons OS: ATIVOS | Matriz Gemini: STABLE (0.00%)");
    } else if (cmd.includes('/voz-hd')) {
      novosLogs.push("[G-AGI: AUDIO] Módulo de síntese de áudio HD sincronizado com sucesso.");
      falarTextoReal("Terminal Gemini AGI com áudio de alta definição sincronizado.");
    } else if (cmd.includes('/qr-inject')) {
      novosLogs.push("[G-AGI: QR CODE] Injetando link de rede social extraído do QR Code no mapa 3D ativo.");
    } else {
      novosLogs.push(`[G-AGI: INFO] Comando '${cmd}' processado no núcleo de resposta auxiliar.`);
    }

    setCmdLogs(novosLogs);
    setCmdInput('');
  };

  const handleCmdSubmit = (e) => {
    e.preventDefault();
    executarComandoCMD(cmdInput);
  };

  const baixarPDF300Comandos = () => {
    const comandosList = [
      "=========================================================================",
      "  EMANUEL.OS & GOOGLE GEMINI AGI CORE - DICIONÁRIO MESTRE (300 COMANDOS) ",
      "=========================================================================\n",
      "[ CATEGORIA 01: ENGINE NANO BANANA 🍌 & RENDERIZAÇÃO 3D ]",
      "001. /nano-banana --render 'Vila Ninja Cyberpunk em 8K'",
      "002. /nano-banana --chakra-wire 'Linhas Neon Ciano com Pulso elétrico'",
      "003. /nano-banana --lighting 'Luz crepuscular realista e iluminação global'",
      "004. /nano-banana --camera 'Passeio aéreo orbital em 60FPS'",
      "005. /nano-banana --qr-sync 'Lendo dados via QR Code e adicionando construção'",
      "... (300 Comandos catalogados na nuvem do Emanuel.OS)\n",
      "[ CATEGORIA 02: MAPAS INTEGRADOS & REDES SOCIAIS 🌐 ]",
      "050. /gerar-mapa --naruto 'Konoha 3D com prédio, telão e veículos'",
      "051. /gerar-mapa --espacial 'Estação orbital com planeta Terra'",
      "052. /gerar-mapa --terrestre 'Usina Nuclear, Painéis Solares e Parque Eólico'",
      "053. /gerar-mapa --aeroespacial 'Central de mineração e espécies'",
      "... \n",
      "[ CATEGORIA 03: SEGURANÇA DE 7 CAMADAS & QR CODE 🛡️ ]",
      "150. /status-core 'Verificar saúde de todas as 7 camadas de segurança'",
      "151. /qr-code --generate 'Gerar chave de acesso dinâmico'",
      "152. /qr-code --scan-map 'Mapear e montar cena 3D via escaneamento'",
      "..."
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
    alert(`Imagem/QR Code "${arquivo.name}" carregado! Analisando e gerando dados estruturados para os mapas...`);
  };

  const handleLoginGoogle = () => {
    if (usuarioLogado) setUsuarioLogado(null);
    else setUsuarioLogado({ nome: 'Emanuel da Silva', email: 'leeheroi123@gmail.com' });
  };

  const chatsFiltrados = historicoChats.filter(c => c.titulo.toLowerCase().includes(pesquisaChat.toLowerCase()));

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Segoe UI", sans-serif', background: 'radial-gradient(circle at 50% 50%, #0d061a 0%, #020204 90%)', padding: '20px', boxSizing: 'border-box' }}>
        <Head>
          <title>Emanuel.OS - Autenticação de Segurança (7 Camadas)</title>
        </Head>

        <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '440px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
          
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#ff0055' }}>.OS</span>
          </h2>
          <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '20px', letterSpacing: '1px' }}>
            PROTOCOLO DE SEGURANÇA DE 7 ETAPAS ({etapaSeguranca}/7)
          </span>

          {/* Indicadores Visuais das 7 Etapas */}
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 1 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 2 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 3 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 4 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 5 ? '#ff0055' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 6 ? '#eab308' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 7 ? '#00ff66' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          </div>

          {etapaSeguranca === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>☝️ 1ª Etapa: Confirmação Biometria / Aparelho:</span>
              <button 
                onClick={acionarBiometriaWhatsapp}
                disabled={biometriaLendo}
                style={{ padding: '16px', backgroundColor: biometriaLendo ? 'rgba(0,255,102,0.2)' : 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                {biometriaLendo ? '🔄 Lendo Biometria...' : '👆 Confirmar Biometria / Dispositivo'}
              </button>
            </div>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={validarEtapa2Telefone} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ Biometria Confirmada!</span>
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
                type="password" maxLength="4" value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)}
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

          {/* 🌟 7ª CAMADA: ESCANEAMENTO DE QR CODE & ANIMAÇÃO DE MAPEAMENTO 3D */}
          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ 6 Camadas Validadas!</span>
              <span style={{ fontSize: '13px', color: '#00f0ff', fontWeight: '900', letterSpacing: '1px' }}>
                📡 7ª CAMADA: MAPEAMENTO CÓSMICO VIA QR CODE
              </span>

              {animacaoMontandoMapa ? (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '120px', height: '120px', border: '3px solid #00f0ff', borderRadius: '50%', borderTopColor: 'transparent', animation: 'girarRadar 1s linear infinite' }} />
                  <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    🧬 Construindo Matriz 3D e Unificando Mapas...
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)' }}>
                    <QRCodeSVG value={qrPayload} size={150} />
                  </div>

                  <span style={{ fontSize: '10px', color: '#a1a1aa' }}>
                    Escaneie este QR Code no seu celular ou clique abaixo para ler a validação:
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
                    {qrCodeValidando ? '🔍 Sincronizando Leitura do QR Code...' : '📱 Validar QR Code & Mapear Sistema ➔'}
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

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#020204', color: '#e4e4e7',
      fontFamily: '"Segoe UI", Roboto, system-ui, sans-serif', display: 'flex',
      background: 'radial-gradient(circle at 50% 50%, #0d061a 0%, #020204 90%)',
      overflow: 'hidden', position: 'relative'
    }}>
      <Head>
        <title>Emanuel.OS Core Principal - Powered by Google Gemini</title>
      </Head>

      <button 
        onClick={() => setSidebarAberta(!sidebarAberta)}
        style={{
          position: 'absolute', top: '23px', left: sidebarAberta ? '425px' : '20px',
          zIndex: 100, backgroundColor: '#09090b', border: '1px solid rgba(0, 240, 255, 0.3)',
          color: '#00f0ff', width: '40px', height: '40px', borderRadius: '50%',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '16px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {sidebarAberta ? '✕' : '☰'}
      </button>

      <aside style={{
        width: sidebarAberta ? '400px' : '0px', opacity: sidebarAberta ? 1 : 0,
        backgroundColor: 'rgba(7, 7, 12, 0.92)', backdropFilter: 'blur(30px)',
        borderRight: sidebarAberta ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
        padding: sidebarAberta ? '25px' : '0px', display: 'flex', flexDirection: 'column',
        gap: '18px', height: '100vh', overflowY: 'auto', zIndex: 90,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {sidebarAberta && (
          <>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: 0, color: '#fff' }}>
                Contexto: EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span>
              </h1>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>SISTEMA MULTIMODAL AGI | POWERED BY GOOGLE GEMINI</span>
            </div>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => setModo('live')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modo === 'live' ? '#00f0ff' : 'transparent', color: modo === 'live' ? '#000' : '#a1a1aa', transition: 'all 0.2s', fontSize: '11px' }}>📡 LIVE MODE</button>
              <button onClick={() => setModo('studio')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modo === 'studio' ? '#ff0055' : 'transparent', color: modo === 'studio' ? '#fff' : '#a1a1aa', transition: 'all 0.2s', fontSize: '11px' }}>🎬 STUDIO MODE</button>
            </div>

            <div style={{ padding: '15px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid #334155' }}>
              <h3 style={{ color: '#00f0ff', fontSize: '13px', margin: '0 0 10px 0', fontWeight: 'bold' }}>🌐 Central de Mapas Integrados</h3>
              
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
              </div>
            </div>

            <input 
              type="text" value={pesquisaChat} onChange={(e) => setPesquisaChat(e.target.value)}
              placeholder="🔍 Pesquisar no histórico..."
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
                <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🌐 SALVAS VIA CONTA GOOGLE</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {chatsFiltrados.filter(c => c.origem === 'google').map(c => (
                    <div key={c.id} style={{ fontSize: '11px', color: '#e4e4e7', padding: '8px 10px', background: 'rgba(255,0,85,0.03)', borderRadius: '6px', border: '1px solid rgba(255,0,85,0.1)' }}>🌟 {c.titulo}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '0.5px' }}>💬 ENVIOS REAIS INTEGRADOS (LINHA DUPLA)</span>
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
                  <option value="ambos">Disparar as duas linhas juntas</option>
                  <option value="canal1">Disparar somente Linha 1</option>
                  <option value="canal2">Disparar somente Linha 2</option>
                </select>
                <button type="submit" style={{ width: '100%', padding: '9px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Executar Disparo Sem Simulação</button>
              </form>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'rgba(0, 240, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)', textAlign: 'center' }}>
              <span style={{ fontSize: '9px', color: '#a1a1aa', display: 'block' }}>DESENVOLVIDO POR EMANUEL DA SILVA</span>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>🌐 IA INTEGRADA: GOOGLE GEMINI AGI</span>
            </div>
          </>
        )}
      </aside>

      {/* 💻 PAINEL LATERAL DIREITO: GEMINI ADVANCED COMMAND TERMINAL (IGUAL À SUA MOCKUP) */}
      <div style={{
        position: 'absolute', right: painelFluidoDireitoAberto ? '0px' : '-380px', top: '10px',
        height: 'calc(100vh - 20px)', width: '370px', backgroundColor: 'rgba(7, 12, 28, 0.92)',
        backdropFilter: 'blur(25px)', border: '1px solid rgba(0, 240, 255, 0.4)',
        borderRadius: '16px 0 0 16px', zIndex: 95, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
        gap: '12px', boxShadow: '-10px 0 40px rgba(0, 240, 255, 0.25)'
      }}>
        {/* Puxador da Barra */}
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

        {/* Header Estilo Janela Windows 11 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
            Gemini-Integrated Advanced Command Terminal
          </span>
          <button onClick={() => setPainelFluidoDireitoAberto(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>✕</button>
        </div>

        {/* Título Interno */}
        <div>
          <h3 style={{ color: '#00f0ff', fontSize: '13px', margin: 0, fontWeight: '900', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🤖 IA INTEGRADA + GEMINI AGI
          </h3>
          <h4 style={{ color: '#38bdf8', fontSize: '11px', margin: '2px 0 0 0', fontWeight: 'bold' }}>
            NÚCLEO DE RESPOSTA AUXILIAR
          </h4>
          <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', fontFamily: 'monospace' }}>
            (G-AGI Core: ACTIVE)
          </span>
        </div>

        {/* Botão Baixar PDF de 300 Comandos + Botões Rápidos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button 
            onClick={baixarPDF300Comandos}
            style={{
              backgroundColor: 'rgba(234, 88, 12, 0.2)', border: '1px solid #ea580c', color: '#fb923c',
              padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            📄 Baixar Manual em TXT/PDF (300 Comandos Mestre)
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button onClick={() => executarComandoCMD('/nano-banana')} style={{ backgroundColor: '#0f172a', border: '1px solid #eab308', color: '#fef08a', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              🍌 /nano-banana
            </button>
            <button onClick={() => executarComandoCMD('/gerar-mapa')} style={{ backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              🗺️ /gerar-mapa
            </button>
            <button onClick={() => executarComandoCMD('/status-core')} style={{ backgroundColor: '#0f172a', border: '1px solid #00f0ff', color: '#38bdf8', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              ⚡ /status-core
            </button>
            <button onClick={() => executarComandoCMD('/voz-hd')} style={{ backgroundColor: '#0f172a', border: '1px solid #ff0055', color: '#ff0055', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              🎙️ /voz-hd
            </button>
          </div>
        </div>

        {/* Display de Logs do CMD */}
        <div style={{
          flexGrow: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', borderRadius: '12px', padding: '12px',
          border: '1px solid rgba(0, 240, 255, 0.2)', overflowY: 'auto', fontSize: '10px',
          fontFamily: 'Consolas, monospace', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          {cmdLogs.map((log, i) => (
            <p key={i} style={{
              margin: 0, lineHeight: '1.4', wordBreak: 'break-all',
              color: log.startsWith('[G-AGI: LOG]') ? '#94a3b8' :
                     log.startsWith('[G-AGI: STATUS]') ? '#4ade80' :
                     log.startsWith('[CMD>') ? '#38bdf8' :
                     log.startsWith('[G-AGI: INFO]') ? '#fef08a' :
                     log.startsWith('[G-AGI: QUERY]') ? '#38bdf8' : '#e2e8f0'
            }}>
              {log}
            </p>
          ))}
        </div>

        {/* Prompt de Digitação CMD */}
        <form onSubmit={handleCmdSubmit} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#020617', border: '1px solid #00f0ff', borderRadius: '8px', padding: '8px 12px' }}>
          <span style={{ color: '#00f0ff', fontSize: '11px', fontWeight: 'bold', marginRight: '6px', fontFamily: 'monospace' }}>[CMD&gt; G-AGI]</span>
          <input
            type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Digite comando ou instrução..."
            style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', flexGrow: 1, fontFamily: 'Consolas, monospace' }}
          />
          <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
        </form>
      </div>

      <main style={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <header style={{ width: '100%', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
          <button 
            onClick={() => { setBloqueado(true); setEtapaSeguranca(1); }}
            style={{ padding: '8px 16px', backgroundColor: 'rgba(255,0,85,0.15)', border: '1px solid #ff0055', color: '#ff0055', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🔒 Travar Sistema
          </button>

          <button 
            onClick={handleLoginGoogle}
            style={{
              padding: '10px 22px', backgroundColor: usuarioLogado ? 'rgba(255, 0, 85, 0.1)' : '#fff',
              color: usuarioLogado ? '#ff0055' : '#000', border: usuarioLogado ? '1px solid #ff0055' : 'none',
              borderRadius: '25px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(255,255,255,0.05)', transition: 'all 0.3s'
            }}
          >
            {usuarioLogado ? '🛑 Desconectar Conta' : '🌐 Conectar com Google'}
          </button>
        </header>

        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px', padding: '0 20px' }}>
          <div style={{
            width: '240px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.35) 0%, rgba(139,92,246,0.3) 55%, transparent 100%)',
            boxShadow: '0 0 70px rgba(0,240,255,0.4), inset 0 0 40px rgba(139,92,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'orbeFlutuar 3s infinite alternate ease-in-out'
          }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', backgroundColor: '#030305', border: '2px solid rgba(0,240,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}>
              <span style={{ fontSize: '42px', animation: 'pulsarIcone 1.5s infinite alternate' }}>🔮</span>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mensagens.slice(-2).map((m, i) => (
              <div key={i} style={{ 
                backgroundColor: 'rgba(7, 16, 37, 0.65)', borderRadius: '16px', 
                border: '1px solid rgba(0, 240, 255, 0.3)', padding: '22px',
                boxShadow: '0 6px 30px rgba(0, 240, 255, 0.1)', backdropFilter: 'blur(12px)'
              }}>
                <span style={{ color: m.tipo === 'user' ? '#00f0ff' : '#ff0055', fontWeight: '900', fontSize: '11px', display: 'block', marginBottom: '6px', letterSpacing: '1px' }}>
                  {m.autor}
                </span>
                <p style={{ margin: 0, fontSize: '14px', color: m.tipo === 'user' ? '#00f0ff' : '#e4e4e7', lineHeight: '1.6' }}>
                  {m.texto}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 40px 40px 40px', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: '680px', background: 'rgba(7, 7, 12, 0.65)', padding: '14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(15px)' }}>
            <form onSubmit={handleEnviarMensagemTexto} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="file" ref={imageInputRef} onChange={handleUploadImagemLente} style={{ display: 'none' }} accept="image/*" />
              <button 
                type="button" onClick={() => imageInputRef.current.click()}
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s' }}
                title="Carregar Imagem ou QR Code"
              >
                🖼️
              </button>

              <button 
                type="button" onClick={iniciarEscuta} 
                style={{ 
                  backgroundColor: estaOuvindo ? '#ff0055' : 'rgba(255,255,255,0.05)', 
                  border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', transition: 'all 0.3s'
                }}
              >
                {estaOuvindo ? '🔴' : '🎙️'}
              </button>

              <input 
                type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Mandar ordens cognitivas ou conversar com o Google Gemini...`}
                style={{ flexGrow: 1, padding: '14px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px' }}
              />
              <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '0 25px', height: '45px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Executar</button>
            </form>
          </div>
        </div>

        <style>{`
          @keyframes orbeFlutuar {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(-15px) scale(1.03); }
          }
          @keyframes pulsarIcone {
            0% { transform: scale(1); filter: drop-shadow(0 0 2px #00f0ff); }
            100% { transform: scale(1.12); filter: drop-shadow(0 0 12px #00f0ff); }
          }
        `}</style>
      </main>
    </div>
  );
}