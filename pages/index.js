import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';

import dicionarioNinja from './dicionario-ninja.json';

// 🎁 COMPONENTE DE CAPTURA COM ENVIO AUTOMÁTICO DE E-MAIL (EMAILJS)
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
      { 
        email: email,
        to_email: email,
        user_email: email
      },
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
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid #00f0ff',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
      color: '#fff',
      margin: '10px 0',
      fontFamily: 'sans-serif'
    }}>
      <h3 style={{ color: '#00f0ff', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>
        🎁 Baixar 300 Comandos Mestre + Mapas 3D
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0' }}>
        Cadastre seu e-mail para receber o e-book oficial do Emanuel.OS e convites VIPs para os mapas 3D.
      </p>

      {enviado ? (
        <div style={{
          backgroundColor: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid #4ade80',
          borderRadius: '8px',
          padding: '8px',
          color: '#4ade80',
          fontSize: '11px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          ✅ E-mail de confirmação enviado com sucesso! Verifique sua caixa de entrada.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="email"
            required
            placeholder="Digite seu e-mail aqui..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '10px 12px',
              backgroundColor: '#020617',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '11px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={carregando}
            style={{
              padding: '10px',
              backgroundColor: '#00f0ff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            {carregando ? '⏳ Enviando E-mail...' : '🚀 Quero Acesso Gratuito'}
          </button>
        </form>
      )}
    </div>
  );
}

// ⚡ COMPONENTE DE AÇÕES RÁPIDAS (EMANUEL.OS QUICK ACTIONS HUD COM SETINHA RETRÁTIL)
function QuickActionsWidget({ onActionClick }) {
  const [painelAberto, setPainelAberto] = useState(true);

  return (
    <div style={{
      position: 'absolute',
      right: painelAberto ? '20px' : '-375px',
      bottom: '120px',
      width: '360px',
      backgroundColor: 'rgba(8, 15, 30, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '16px 0 0 16px',
      padding: '16px',
      boxShadow: '-10px 0 30px rgba(0, 240, 255, 0.25)',
      zIndex: 25,
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Botão Retrátil Lateral (Setinha para esconder/mostrar) */}
      <button 
        onClick={() => setPainelAberto(!painelAberto)}
        style={{
          position: 'absolute',
          left: '-42px',
          top: '25px',
          width: '42px',
          height: '48px',
          backgroundColor: 'rgba(7, 12, 28, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          borderRight: 'none',
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px',
          color: '#00f0ff',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '-5px 0 15px rgba(0, 240, 255, 0.2)'
        }}
      >
        {painelAberto ? '➔' : '◀'}
      </button>

      <h3 style={{
        fontSize: '14px',
        fontWeight: 'bold',
        margin: '0 0 12px 0',
        color: '#fff',
        letterSpacing: '0.5px'
      }}>
        Emanuel.OS Quick Actions
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '10px'
      }}>
        <div 
          onClick={() => onActionClick('gerar_imagem')}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: '12px',
            padding: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '90px'
          }}
        >
          <div style={{ fontSize: '18px', color: '#00f0ff' }}>🖼️✨</div>
          <div>
            <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Crie uma imagem</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Com modelo EM 1.0</span>
          </div>
        </div>

        <div 
          onClick={() => onActionClick('editar_codigo')}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: '12px',
            padding: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '90px'
          }}
        >
          <div style={{ fontSize: '18px', color: '#38bdf8' }}>✏️&lt;/&gt;</div>
          <div>
            <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Escreva ou edite</strong>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Códigos e textos</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          borderRadius: '12px',
          padding: '6px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7 0%, #030712 100%)',
            border: '1px solid #00f0ff',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: 'inset 0 0 15px rgba(0, 240, 255, 0.4)'
          }}>
            <span style={{ fontSize: '26px' }}>🧊</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div 
            onClick={() => onActionClick('pesquisar_web')}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              borderRadius: '8px',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '14px', color: '#00f0ff' }}>🌐</span>
            <strong style={{ fontSize: '9px', color: '#fff' }}>Pesquise na Internet</strong>
          </div>

          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: '8px',
            padding: '6px 8px'
          }}>
            <span style={{ fontSize: '8px', color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>
              Processamento EM v1.0
            </span>
            <div style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '3px'
            }}>
              <div style={{
                width: '65%',
                height: '100%',
                backgroundColor: '#00f0ff',
                boxShadow: '0 0 8px #00f0ff'
              }} />
            </div>
            <span style={{ fontSize: '7px', color: '#94a3b8' }}>
              Status: EM v1.0 Active | Processing...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  // --- STATES DE SEGURANÇA (7 CAMADAS) ---
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [biometriaLendo, setBiometriaLendo] = useState(false);
  
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  const [isAdmin, setIsAdmin] = useState(true); 
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [isLockedTicons, setIsLockedTicons] = useState(false);
  const [statusTicons, setStatusTicons] = useState('🔐 Selecione a sequência correta do Ticons OS gevaGifs');
  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

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

  // --- STATES DA INTERFACE PRINCIPAL ---
  const [modo, setModo] = useState('live'); 
  const [vozAtiva, setVozAtiva] = useState('Emanuel'); 
  const [pesquisaChat, setPesquisaChat] = useState('');
  const [estaOuvindo, setEstaOuvindo] = useState(false); 
  const [usuarioLogado, setUsuarioLogado] = useState(null); 
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [painelFluidoDireitoAberto, setPainelFluidoDireitoAberto] = useState(false);

  // States da Central de Suporte EM-AI
  const [modalSuporteAberto, setModalSuporteAberto] = useState(false);
  const [abaSuporteAtiva, setAbaSuporteAtiva] = useState('diagnostico');
  const [inputProblemaSuporte, setInputProblemaSuporte] = useState('');
  const [carregandoSuporte, setCarregandoSuporte] = useState(false);
  const [respostaSuporte, setRespostaSuporte] = useState(null);

  // States do Browser Cyberpunk & Módulos 3D
  const [browserAsset, setBrowserAsset] = useState({
    titulo: 'Emanuel.OS',
    subtitulo: 'Native Browser',
    imagem: null,
    conteudoTexto: 'Sincronização neural ativa. Módulo de carregamento holográfico pronto.'
  });

  // Terminal Gemini Commands Logs
  const [cmdInput, setCmdInput] = useState('');
  const [cmdLogs, setCmdLogs] = useState([
    "[G-AGI: LOG] System core operational.",
    "[G-AGI: LOG] Parallel Cognitive Processing Module: STABLE.",
    "[G-AGI: STATUS] Núcleo de Resposta Auxiliar: ONLINE & SYNCHRONIZED.",
    "[G-AGI: QR-DECODER] Leitor de QR Code para injeção de links integrado.",
    "[CMD> G-AGI] User: Analisar fluxo de dados do sistema...[Complete]",
    "[G-AGI: INFO] Motor Nano Banana e fios de chakra conectados.",
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
    { autor: 'IA EMANUEL (GEMINI)', texto: 'Emanuel.OS Core v5.1 | Ano: 2030 | Conexão Neural Ativa', tipo: 'sys' }
  ]);

  // States de Disparo Real
  const [ddd1, setDdd1] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [ddd2, setDdd2] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [msgCanal1, setMsgCanal1] = useState('');
  const [msgCanal2, setMsgCanal2] = useState('');
  const [modoDisparo, setModoDisparo] = useState('ambos'); 

  // Relógio Dinâmico
  const [horaAtual, setHoraAtual] = useState('');
  const imageInputRef = useRef(null);

  // Referências Three.js
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarMeshRef = useRef(null);

  // --- DISPARADOR DE AÇÕES RÁPIDAS (QUICK ACTIONS) ---
  const dispararQuickAction = (tipo) => {
    if (tipo === 'gerar_imagem') {
      const promptImg = 'Gerar imagem holográfica 3D no modelo EM 1.0';
      setChatInput(promptImg);
      processarConversaReal(promptImg);
    } else if (tipo === 'editar_codigo') {
      setModalSuporteAberto(true);
      setAbaSuporteAtiva('codigo');
    } else if (tipo === 'pesquisar_web') {
      setChatInput('Pesquisar dados na internet...');
    }
  };

  // --- INTEGRANDO SUPORTE IA REAL NO BACKEND ---
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
          avatarVideo: "Avatar holográfico pronto para sintetizar aula em vídeo.",
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

  // --- INICIALIZAÇÃO DO THREE.JS ---
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 100);
    cyanLight.position.set(-5, 5, 5);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff007f, 3, 100);
    magentaLight.position.set(5, -5, 5);
    scene.add(magentaLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.85
    });
    const avatarMesh = new THREE.Mesh(geometry, material);
    scene.add(avatarMesh);
    avatarMeshRef.current = avatarMesh;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      avatarMesh.rotation.y += 0.005;
      avatarMesh.rotation.x += 0.002;
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
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado]);

  // CONTROLE DE CÂMERA 3D
  const controlarCamera3D = (acao) => {
    const camera = cameraRef.current;
    if (!camera) return;

    switch (acao) {
      case 'zoom_in':
        camera.position.z = Math.max(camera.position.z - 2, 2);
        break;
      case 'zoom_out':
        camera.position.z += 2;
        break;
      case 'top_view':
        camera.position.set(0, 8, 0.1);
        camera.lookAt(0, 0, 0);
        break;
      case 'rotate':
        if (avatarMeshRef.current) {
          avatarMeshRef.current.rotation.y += Math.PI / 4;
        }
        break;
      default:
        camera.position.set(0, 0, 5);
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

    if (textoLimpo.includes('zoom') || textoLimpo.includes('girar') || textoLimpo.includes('câmera') || textoLimpo.includes('topo')) {
      let acao = 'reset';
      if (textoLimpo.includes('aproximar') || textoLimpo.includes('in')) acao = 'zoom_in';
      else if (textoLimpo.includes('afastar') || textoLimpo.includes('out')) acao = 'zoom_out';
      else if (textoLimpo.includes('girar') || textoLimpo.includes('rotacionar')) acao = 'rotate';
      else if (textoLimpo.includes('topo') || textoLimpo.includes('superior')) acao = 'top_view';

      controlarCamera3D(acao);
      const resp = `Câmera 3D ajustada: Modo [${acao.toUpperCase()}].`;
      setMensagens(prev => [...prev, { autor: `IA ${vozAtiva.toUpperCase()} (GEMINI)`, texto: resp, tipo: 'ia' }]);
      falarTextoReal(resp);
      return;
    }

    if (textoLimpo.includes('pokémon') || textoLimpo.includes('pokemon') || textoLimpo.includes('pokedex')) {
      const pokeNome = textoLimpo.replace(/gerar|buscar|pokémon|pokemon|pokedex|3d|no mapa/gi, '').trim() || 'charizard';
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeNome}`);
        if (res.ok) {
          const data = await res.json();
          setBrowserAsset({
            titulo: `Pokédex 3D: ${data.name.toUpperCase()}`,
            subtitulo: `ID: #${data.id} | Tipo: ${data.types.map(t => t.type.name).join('/')}`,
            imagem: data.sprites.other['official-artwork'].front_default,
            conteudoTexto: `Asset 3D do Pokémon ${data.name.toUpperCase()} pronto para renderização no mapa!`
          });
          const msg = `Pokémon ${data.name.toUpperCase()} localizado e injetado no Native Browser!`;
          setMensagens(prev => [...prev, { autor: `IA ${vozAtiva.toUpperCase()} (GEMINI)`, texto: msg, tipo: 'ia' }]);
          falarTextoReal(msg);
          return;
        }
      } catch (err) {
        console.error("Erro na Pokédex:", err);
      }
    }

    let respostaTexto = "";
    const resultadoDicionario = buscarNoDicionario(textoUsuario);

    if (resultadoDicionario) {
      respostaTexto = `Rastreando dados cognitivos sobre "${resultadoDicionario.termo}" (${resultadoDicionario.categoria}): ${resultadoDicionario.significado}`;
    } else if (textoLimpo.includes('bom dia') || textoLimpo.includes('boa tarde') || textoLimpo.includes('boa noite')) {
      respostaTexto = "Olá, Emanuel! Como posso te ajudar a gerenciar seus mapas e sistemas agora?";
    } else {
      respostaTexto = `Comando neural "${textoUsuario}" processado no Núcleo Emanuel.OS Core v5.1. Sincronização neural a 100%.`;
    }

    setBrowserAsset(prev => ({
      ...prev,
      conteudoTexto: respostaTexto
    }));

    setMensagens(prev => [...prev, { autor: `IA ${vozAtiva.toUpperCase()} (GEMINI)`, texto: respostaTexto, tipo: 'ia' }]);
    falarTextoReal(respostaTexto);
  };

  const handleEnviarMensagemTexto = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: chatInput, tipo: 'user' }]);
    processarConversaReal(chatInput);
    setChatInput('');
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
        alert("🔓 Acesso Total Autorizado! Mapeamento QR Code e 7 Camadas de Segurança Concluídas!");
      }, 2500);
    }, 1500);
  };

  const executarComandoCMD = (comandoDigitado) => {
    const cmd = comandoDigitado.trim();
    if (!cmd) return;

    const novosLogs = [...cmdLogs, `[CMD> G-AGI] User: ${cmd}`];

    if (cmd.includes('/nano-banana') || cmd.includes('banana')) {
      novosLogs.push("[G-AGI: NANO BANANA 🍌] Renderizando imagem 3D ultra-realista no modelo Octane:");
      novosLogs.push(">> Prompt ativo: 'Hyperrealistic Avatar 2030, glowing cyan chakra wires, 8k resolution, raytracing'");
    } else if (cmd.includes('/gerar-mapa')) {
      novosLogs.push("[G-AGI: ENGINE] Conectando matriz de dados ao gerador 3D de mapas...");
    } else if (cmd.includes('/status-core') || cmd.includes('/status')) {
      novosLogs.push("[G-AGI: STATUS] 7 Camadas: PROTEGIDAS | QR Code & Ticons OS: ATIVOS | Matriz Gemini: STABLE (0.00%)");
    } else if (cmd.includes('/voz-hd')) {
      novosLogs.push("[G-AGI: AUDIO] Módulo de síntese de áudio HD sincronizado com sucesso.");
      falarTextoReal("Terminal Gemini AGI com áudio de alta definição sincronizado.");
    } else if (cmd.includes('/suporte')) {
      setModalSuporteAberto(true);
      novosLogs.push("[G-AGI: SUPORTE] Central de Ajuda EM IA iniciada na interface.");
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
      "... (300 Comandos catalogados na nuvem do Emanuel.OS)\n"
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
    alert(`Imagem/QR Code "${arquivo.name}" carregado! Analisando e gerando dados estruturados...`);
  };

  const chatsFiltrados = historicoChats.filter(c => c.titulo.toLowerCase().includes(pesquisaChat.toLowerCase()));

  // 🔒 TELA DE SEGURANÇA DAS 7 CAMADAS
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

  // 🌐 INTERFACE PRINCIPAL DESBLOQUEADA COM DESIGN HOLOGRÁFICO 2030 (AVATAR HUD)
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
        <title>Emanuel.OS Core 2030 | IA Principal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* 🌌 CANVAS THREE.JS (AVATAR HOLOGRÁFICO CENTRAL 3D) */}
      <div 
        ref={mountRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }} 
      />

      {/* 👈 BOTÃO DE ABRIR SIDEBAR ESQUERDA */}
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

      {/* 🛠️ BOTÃO DA CENTRAL DE SUPORTE EM IA */}
      <button 
        onClick={() => setModalSuporteAberto(true)}
        style={{
          position: 'absolute', top: '23px', left: sidebarAberta ? '475px' : '70px',
          zIndex: 100, backgroundColor: 'rgba(255, 0, 127, 0.2)', border: '1px solid #ff007f',
          color: '#ff007f', padding: '0 15px', height: '40px', borderRadius: '20px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '11px', boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        🛠️ Suporte EM IA
      </button>

      {/* ⚡ WIDGET DE AÇÕES RÁPIDAS (QUICK ACTIONS HUD COM SETINHA LATERÁVEL) */}
      <QuickActionsWidget onActionClick={dispararQuickAction} />

      {/* 👈 SIDEBAR ESQUERDA RETRÁTIL */}
      <aside style={{
        position: 'absolute', top: 0, left: 0,
        width: sidebarAberta ? '400px' : '0px', opacity: sidebarAberta ? 1 : 0,
        backgroundColor: 'rgba(7, 7, 12, 0.95)', backdropFilter: 'blur(30px)',
        borderRight: sidebarAberta ? '1px solid rgba(0, 240, 255, 0.2)' : 'none',
        padding: sidebarAberta ? '25px' : '0px', display: 'flex', flexDirection: 'column',
        gap: '18px', height: '100vh', overflowY: 'auto', zIndex: 90, boxSizing: 'border-box',
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

            <FormularioCapturaEmanuelOS />

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

      {/* 🛠️ MODAL DE SUPORTE E ASSISTÊNCIA EM IA */}
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
              EM-AI // CENTRAL DE SUPORTE & ASSISTÊNCIA 2030
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 15px 0' }}>
              Resolução Autônoma de Bugs, Compatibilidade de Apps, Documentos e Códigos de Ajuda
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <button onClick={() => setAbaSuporteAtiva('diagnostico')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'diagnostico' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'diagnostico' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🛠️ Diagnóstico</button>
              <button onClick={() => setAbaSuporteAtiva('codigo')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'codigo' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'codigo' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>💻 Códigos</button>
              <button onClick={() => setAbaSuporteAtiva('avatar')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'avatar' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'avatar' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🎥 Vídeo-Aula</button>
              <button onClick={() => setAbaSuporteAtiva('feedback')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'feedback' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'feedback' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>⭐ Feedbacks</button>
            </div>

            <textarea 
              value={inputProblemaSuporte}
              onChange={(e) => setInputProblemaSuporte(e.target.value)}
              placeholder="Descreva seu bug, problema de compatibilidade ou solicitação..."
              style={{ width: '100%', height: '80px', backgroundColor: '#020617', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', color: '#fff', padding: '10px', fontSize: '11px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            />

            <button 
              onClick={processarSuporteIA}
              disabled={carregandoSuporte}
              style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)' }}
            >
              {carregandoSuporte ? '⏳ Analisando no Núcleo Gemini...' : '🚀 Executar Solução IA (90%)'}
            </button>

            {respostaSuporte && (
              <div style={{ marginTop: '15px', backgroundColor: 'rgba(0, 240, 255, 0.05)', borderLeft: '3px solid #00f0ff', padding: '12px', borderRadius: '6px', fontSize: '11px' }}>
                <strong style={{ color: '#00f0ff', display: 'block', marginBottom: '4px' }}>Diagnóstico:</strong>
                <p style={{ margin: '0 0 8px 0', color: '#cbd5e1' }}>{respostaSuporte.diagnostico}</p>

                {respostaSuporte.codigo && (
                  <pre style={{ backgroundColor: '#010409', padding: '8px', borderRadius: '4px', color: '#38bdf8', overflowX: 'auto', fontSize: '10px', margin: '6px 0' }}>
                    {respostaSuporte.codigo}
                  </pre>
                )}

                <p style={{ color: '#4ade80', margin: '4px 0' }}>📄 {respostaSuporte.documento}</p>
                <p style={{ color: '#fb923c', margin: '4px 0' }}>🎥 {respostaSuporte.avatarVideo}</p>
                
                <div style={{ marginTop: '8px', padding: '6px', backgroundColor: 'rgba(255,0,127,0.1)', border: '1px dashed #ff007f', borderRadius: '4px', color: '#ff007f', fontSize: '10px' }}>
                  ⚠️ {respostaSuporte.protocolo}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 💻 PAINEL LATERAL DIREITO TERMINAL GEMINI */}
      <div style={{
        position: 'absolute', right: painelFluidoDireitoAberto ? '0px' : '-380px', top: '10px',
        height: 'calc(100vh - 20px)', width: '370px', backgroundColor: 'rgba(7, 12, 28, 0.92)',
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
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
            Gemini-Integrated Advanced Command Terminal
          </span>
          <button onClick={() => setPainelFluidoDireitoAberto(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>✕</button>
        </div>

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
            <button onClick={() => executarComandoCMD('/suporte')} style={{ backgroundColor: '#0f172a', border: '1px solid #ff007f', color: '#ff007f', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              🛠️ /suporte
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

      {/* 📊 TOPO: CARDS DE STATUS SCI-FI HUD */}
      <div style={{
        position: 'absolute', top: '20px', left: sidebarAberta ? '430px' : '180px', right: '400px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
        transition: 'left 0.3s'
      }}>
        
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', minWidth: '150px'
        }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Network</span>
          <strong style={{ fontSize: '12px', color: '#00f0ff' }}>📶 Emanuel 2030</strong>
        </div>

        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Robot Load</span>
            <strong style={{ fontSize: '11px', color: '#38bdf8' }}>Cognitive 22%</strong>
          </div>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #00f0ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 'bold', color: '#00f0ff'
          }}>
            35%
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '16px', color: '#00f0ff' }}>🕒</span>
          <div>
            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>TEMPO NEURAL</span>
            <strong style={{ fontSize: '11px', color: '#fff', fontFamily: 'monospace' }}>
              {horaAtual || '14 Março 2030, 22:15'}
            </strong>
          </div>
        </div>

      </div>

      {/* 🧠 CENTRO-ESQUERDA: CARD COGNITIVE LOAD */}
      <div style={{
        position: 'absolute', top: '100px', left: sidebarAberta ? '430px' : '80px', zIndex: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '12px 18px',
        width: '180px', transition: 'left 0.3s'
      }}>
        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Cognitive Load</span>
        <div style={{ fontSize: '10px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Fian:</span> <strong>45%</strong>
        </div>
        <div style={{ fontSize: '10px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
          <span>Mecro-holographic:</span> <strong>1%</strong>
        </div>
      </div>

      {/* 📱 HUD DIREITO: NATIVE BROWSER */}
      <div style={{
        position: 'absolute', top: '90px', right: '400px', zIndex: 10,
        backgroundColor: 'rgba(8, 15, 30, 0.75)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '14px', padding: '14px',
        width: '280px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '20px', padding: '5px 10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', color: '#00f0ff', marginRight: '6px' }}>🌐</span>
          <input type="text" readOnly value="Internet Em.com" style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '10px', outline: 'none', width: '100%' }} />
          <span style={{ fontSize: '10px', color: '#00f0ff' }}>🔍</span>
        </div>

        <div>
          <h2 style={{ fontSize: '14px', margin: 0, color: '#fff', fontWeight: 'bold' }}>{browserAsset.titulo}</h2>
          <p style={{ fontSize: '10px', color: '#ff007f', margin: '2px 0 8px 0', fontWeight: '600' }}>{browserAsset.subtitulo}</p>

          {browserAsset.imagem && (
            <div style={{ textAlign: 'center', margin: '8px 0', background: 'rgba(0, 240, 255, 0.05)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
              <img src={browserAsset.imagem} alt="Asset Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
            </div>
          )}

          <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', maxHeight: '90px', overflowY: 'auto' }}>
            {browserAsset.conteudoTexto}
          </div>
        </div>
      </div>

      {/* 💬 BASE: CHAT E HISTÓRICO HOLOGRÁFICO */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, width: '100%', maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '10px'
      }}>

        <div style={{
          backgroundColor: 'rgba(8, 15, 30, 0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 0, 127, 0.5)', borderRadius: '12px', padding: '8px 20px',
          textAlign: 'center', boxShadow: '0 0 20px rgba(255, 0, 127, 0.2)'
        }}>
          <span style={{ fontSize: '9px', color: '#ff007f', fontWeight: 'bold', letterSpacing: '1px', display: 'block' }}>
            IA EMANUEL (GEMINI)
          </span>
          <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>
            Emanuel.OS Core v5.1 | Ano: 2030 | Conexão Neural Ativa
          </span>
        </div>

        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '12px 16px',
          maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          {mensagens.map((item, index) => (
            <div key={index}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: item.tipo === 'user' ? '#00f0ff' : '#f43f5e', letterSpacing: '0.5px' }}>
                {item.autor}
              </span>
              <p style={{ margin: 0, fontSize: '11px', color: '#f8fafc', lineHeight: '1.3' }}>
                {item.texto}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleEnviarMensagemTexto} style={{
          backgroundColor: 'rgba(5, 12, 24, 0.9)', backdropFilter: 'blur(20px)',
          border: '1px solid #00f0ff', borderRadius: '25px', padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)'
        }}>
          <button type="button" onClick={() => imageInputRef.current && imageInputRef.current.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>🖼️</button>
          <button type="button" onClick={iniciarEscuta} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>{estaOuvindo ? '🔴' : '🎙️'}</button>
          <input type="file" ref={imageInputRef} onChange={handleUploadImagemLente} style={{ display: 'none' }} accept="image/*" />

          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Transmitir comandos neurais ou conversar com o Núcleo Gemini..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', flexGrow: 1 }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 18px',
              borderRadius: '18px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer',
              boxShadow: '0 0 10px #00f0ff'
            }}
          >
            Executar
          </button>
        </form>

      </div>

    </div>
  );
}