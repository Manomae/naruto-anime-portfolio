import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { jsPDF } from "jspdf";

// Importação do Gerenciador de Janelas Futuristas
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaOrkutSocial3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const bolaHolograficaMeshRef = useRef(null);
  const robotocCard3DGroupRef = useRef(null);
  const miniRobotocGroupRef = useRef(null);
  const esferasLinks3DRef = useRef([]);

  // Estados de expansão/recolhimento dos blocos centrais com as setinhas
  const [blocoPerfilExpandido, setBlocoPerfilExpandido] = useState(true);
  const [blocoMuralExpandido, setBlocoMuralExpandido] = useState(true);

  // Estados do ROBOTOC DATA CENTER & ARQUITETURA 3D
  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);
  const [nuvemSelecionada, setNuvemSelecionada] = useState('google');

  // Chat Futurista 3D do Mini-ROBOTOC
  const [chatMiniRobotocAberto, setChatMiniRobotocAberto] = useState(false);
  const [mensagensChat, setMensagensChat] = useState([
    { id: 1, autor: 'Mini-ROBOTOC', texto: 'Olá! Sou o Mini-ROBOTOC do Orkut Social 3D. Como posso te auxiliar no mapa, nas funções ou sobre o Emanuel.OS?' }
  ]);
  const [inputChat, setInputChat] = useState('');

  // Links Futurísticos Em Social 3D
  const [modalLinksFuturisticosAberta, setModalLinksFuturisticosAberta] = useState(false);
  const [linksFuturisticosImportantes, setLinksFuturisticosImportantes] = useState([
    { id: 1, titulo: 'Portfólio & Projetos GitHub', url: 'https://github.com/Manomae', categoria: 'Profissional', icone: '💻' },
    { id: 2, titulo: 'Canal Oficial Emanuel ART', url: 'https://youtube.com/@emanuelsilva2987', categoria: 'Trabalho / Mídia', icone: '🎬' },
    { id: 3, titulo: 'Google Workspace & Drive', url: 'https://drive.google.com', categoria: 'Uso Pessoal / Nuvem', icone: '☁️' }
  ]);
  const [novoLinkFutTitulo, setNovoLinkFutTitulo] = useState('');
  const [novoLinkFutUrl, setNovoLinkFutUrl] = useState('');
  const [novoLinkFutCategoria, setNovoLinkFutCategoria] = useState('Profissional');
  const [novoLinkFutIcone, setNovoLinkFutIcone] = useState('🚀');

  // Estados de navegação e abas (incluindo a NOVA ABA 'mascotes')
  const [abaMuralAtiva, setAbaMuralAtiva] = useState('scraps'); // 'scraps', 'depoimentos', 'mascotes', 'gerenciar'

  // Perfil Oficial Emanuel da Silva / Emanuel ART
  const [perfilUsuario] = useState({
    nome: "Emanuel da Silva (Emanuel ART)",
    statusBio: "Arquiteto do Emanuel.OS v5.1 | Hub Integrado de Redes Sociais & ROBOTOC Data Center 3D 🚀",
    relacionamento: "Solteiro",
    aniversario: "24 de Janeiro",
    localizacao: "Aracati, Ceará, Brasil",
    profissao: "Desenvolvedor & Artista Digital 3D",
    quemSouEu: "Construindo a nova geração das redes sociais unificadas. Conecte-se comigo pelo Orkut 3D ou pelas minhas redes oficiais!",
    confiavel: 100,
    legal: 100,
    sexy: 98
  });

  // Lista de Mascotes ROBOTOC (Nova Funcionalidade)
  const [mascotes, setMascotes] = useState([
    { id: 1, nome: 'Mini-ROBOTOC Placa Neon', tipo: 'Assistente Core 3D', nivel: 'Nível Mestre', icone: '🤖', ativo: true },
    { id: 2, nome: 'Cyber Bot Pink', tipo: 'Guardião de Recados', nivel: 'Nível 2', icone: '👾', ativo: false },
    { id: 3, nome: 'Aero Sphere AI', tipo: 'Monitor de Links', nivel: 'Nível 1', icone: '🛸', ativo: false }
  ]);
  const [novoMascoteNome, setNovoMascoteNome] = useState('');
  const [novoMascoteTipo, setNovoMascoteTipo] = useState('Assistente');

  // Redes Sociais Conectadas com links reais de Emanuel
  const [links3D, setLinks3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube Emanuel', url: 'https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg', icone: '▶️', nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok Emanuel', url: 'https://www.tiktok.com/@emanueldasilva26', icone: '🎵', nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram Oficial', url: 'https://www.instagram.com/emanuelsilva432', icone: '📸', nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'Repositório GitHub', url: 'https://github.com/Manomae', icone: '🐙', nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'Contato WhatsApp Direct', url: 'https://api.whatsapp.com/send?phone=5588981493989', icone: '💬', nuvem: 'google' },
    { id: 6, tipo: 'facebook', titulo: 'Facebook Oficial', url: 'https://www.facebook.com/leeheroi.heroi', icone: '📘', nuvem: 'microsoft' },
    { id: 7, tipo: 'threads', titulo: 'Threads Oficial', url: 'https://www.threads.net/@emanuelsilva432', icone: '🧵', nuvem: 'apple' },
    { id: 8, tipo: 'kwai', titulo: 'Kwai Oficial', url: 'https://k.kwai.com/u/@ewnop969ok', icone: '🟠', nuvem: 'custom' }
  ]);

  const [novoLinkTitulo, setNovoLinkTitulo] = useState('');
  const [novoLinkUrl, setNovoLinkUrl] = useState('');
  const [novoLinkIcone, setNovoLinkIcone] = useState('🔗');

  // Listas Dinâmicas
  const [amigos, setAmigos] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);

  // Form de Marcações
  const [novoAmigoInput, setNovoAmigoInput] = useState('');
  const [novoAmigoTipoAcao, setNovoAmigoTipoAcao] = useState('link');
  const [novoAmigoRede, setNovoAmigoRede] = useState('Instagram');

  const [buscaGrupoInput, setBuscaGrupoInput] = useState('');
  const [novaComunidadeRede, setNovaComunidadeRede] = useState('Instagram');
  const [novaComunidadeTipo, setNovaComunidadeTipo] = useState('Geral');

  const [novoScrapInput, setNovoScrapInput] = useState('');
  const [marcacaoScrapTipo, setMarcacaoScrapTipo] = useState('Amigo(a)');
  const [marcacaoScrapAlvo, setMarcacaoScrapAlvo] = useState('');

  const [novoDepoimentoInput, setNovoDepoimentoInput] = useState('');
  const [marcacaoDepoimentoTipo, setMarcacaoDepoimentoTipo] = useState('Amigo(a)');
  const [marcacaoDepoimentoAlvo, setMarcacaoDepoimentoAlvo] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const amigosSalvos = JSON.parse(localStorage.getItem('orkut_amigos_reais')) || [
      { id: 1, nome: '@cyber_ninja', rede: 'Instagram', icone: '📸', tipo: 'Link @' },
      { id: 2, nome: 'Canal Oficial 3D', rede: 'YouTube', icone: '▶️', tipo: 'Solicitação' },
      { id: 3, nome: '@harley_queen', rede: 'TikTok', icone: '🎵', tipo: 'Link @' }
    ];

    const comunidadesSalvas = JSON.parse(localStorage.getItem('orkut_comunidades_reais')) || [
      { id: 1, nome: 'Eu odeio acordar cedo', tipo: 'Comunidade Clássica', rede: 'Orkut', icone: '⏰' },
      { id: 2, nome: '@EmanuelOS_Oficial', tipo: 'Grupo Tech', rede: 'Threads', icone: '🧵' },
      { id: 3, nome: 'Grupo Ninjas & Anime 2026', tipo: 'Comunidade', rede: 'YouTube', icone: '▶️' }
    ];

    const scrapsSalvos = JSON.parse(localStorage.getItem('orkut_scraps_reais')) || [
      { id: 1, autor: 'ROBOTOC Data Center', marcadoPara: 'Amigo(a): @cyber_ninja', texto: 'Nó Orkut Social 3D e ROBOTOC unificados no Emanuel.OS com sucesso!', horario: 'Hoje' }
    ];

    const depoimentosSalvos = JSON.parse(localStorage.getItem('orkut_depoimentos_reais')) || [
      { id: 1, autor: 'Comunidade Dev', marcadoPara: 'Comunidade: @EmanuelOS_Oficial', texto: 'O ecossistema mais poderoso e inteligente de 2026!', data: '2026', status: 'Aprovado' }
    ];

    const linksFutSalvos = JSON.parse(localStorage.getItem('orkut_links_futuristicos_3d')) || linksFuturisticosImportantes;

    setAmigos(amigosSalvos);
    setComunidades(comunidadesSalvas);
    setScraps(scrapsSalvos);
    setDepoimentos(depoimentosSalvos);
    setLinksFuturisticosImportantes(linksFutSalvos);
  }, []);

  const abrirLinkExternoSeguro = (url) => {
    if (!url) return;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const adicionarNovoLink3D = () => {
    if (!novoLinkTitulo.trim() || !novoLinkUrl.trim()) return alert("Insira o Título e a URL do Link 3D.");
    const novo = {
      id: Date.now(),
      titulo: novoLinkTitulo,
      url: novoLinkUrl.startsWith('http') ? novoLinkUrl : `https://${novoLinkUrl}`,
      icone: novoLinkIcone || '🔗',
      nuvem: nuvemSelecionada
    };
    setLinks3D(prev => [...prev, novo]);
    setNovoLinkTitulo('');
    setNovoLinkUrl('');
  };

  const adicionarLinkFuturistico = (e) => {
    e.preventDefault();
    if (!novoLinkFutTitulo.trim() || !novoLinkFutUrl.trim()) return alert("Preencha o Título e a URL do Link Futurístico.");
    const novo = {
      id: Date.now(),
      titulo: novoLinkFutTitulo,
      url: novoLinkFutUrl.startsWith('http') ? novoLinkFutUrl : `https://${novoLinkFutUrl}`,
      categoria: novoLinkFutCategoria,
      icone: novoLinkFutIcone || '🌐'
    };
    const listaAtualizada = [novo, ...linksFuturisticosImportantes];
    setLinksFuturisticosImportantes(listaAtualizada);
    localStorage.setItem('orkut_links_futuristicos_3d', JSON.stringify(listaAtualizada));
    setNovoLinkFutTitulo('');
    setNovoLinkFutUrl('');
    alert("⚡ Link Futurístico salvo com sucesso!");
  };

  const adicionarMascote = (e) => {
    e.preventDefault();
    if (!novoMascoteNome.trim()) return;
    const novo = {
      id: Date.now(),
      nome: novoMascoteNome,
      tipo: novoMascoteTipo,
      nivel: 'Nível 1 (Recém Criado)',
      icone: '🤖',
      ativo: false
    };
    setMascotes([novo, ...mascotes]);
    setNovoMascoteNome('');
    alert(`🤖 Mascote "${novo.nome}" adicionado com sucesso!`);
  };

  const enviarPerguntaMiniRobotoc = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const textoUsuario = inputChat;
    const userMsg = { id: Date.now(), autor: 'Você', texto: textoUsuario };
    setMensagensChat(prev => [...prev, userMsg]);
    setInputChat('');

    setTimeout(() => {
      let respostaRobotoc = "Entendido! Estou processando suas diretrizes no nó central do Orkut Social 3D.";
      const query = textoUsuario.toLowerCase();

      if (query.includes('quem') || query.includes('emanuel') || query.includes('criador')) {
        respostaRobotoc = "Emanuel da Silva (Emanuel ART) é o Arquiteto & Desenvolvedor do Emanuel.OS v5.1 e deste ecossistema Orkut Social 3D!";
      } else if (query.includes('ajuda') || query.includes('função') || query.includes('como usar') || query.includes('auxilio')) {
        respostaRobotoc = "Posso te auxiliar! Você pode: 1. Personalizar seus Mascotes 3D; 2. Baixar o perfil em PDF; 3. Interagir com o Data Center 3D; 4. Usar Links Futurísticos!";
      } else if (query.includes('mascote') || query.includes('bot')) {
        respostaRobotoc = "A nova aba 'Mascotes' permite gerenciar e criar companheiros inteligentes ROBOTOC para o seu perfil!";
      }

      setMensagensChat(prev => [...prev, { id: Date.now() + 1, autor: 'Mini-ROBOTOC', texto: respostaRobotoc }]);
    }, 600);
  };

  // --- THREE.JS: RENDERIZAÇÃO REALISTA DO MINI-ROBOTOC COM A PLAQUINHA NEON 3D ---
  useEffect(() => {
    if (!mountRef.current) return;

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

    // ILUMINAÇÃO CYBERPUNK REALISTA
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-5, 8, 5);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 6, 25);
    cyanLight.position.set(-3, 3, 3);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff007f, 6, 25);
    magentaLight.position.set(3, -1, 3);
    scene.add(magentaLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.2);
    scene.add(ambientLight);

    // DATA CENTER GRID
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

    // BOLA HOLOGRÁFICA CENTRAL
    const bolaGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const bolaMaterial = new THREE.MeshStandardMaterial({
      color: 0xed2580,
      wireframe: true,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const bolaMesh = new THREE.Mesh(bolaGeometry, bolaMaterial);
    bolaMesh.position.set(0, 0.2, 0);
    scene.add(bolaMesh);
    bolaHolograficaMeshRef.current = bolaMesh;

    // ÓRBITAS DOS LINKS 3D
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

    // 🤖 MODELAGEM REALISTA 3D DO MINI-ROBOTOC SEGURANDO A PLAQUINHA NEON "ORKUT EM SOCIAL 3D"
    const robotocCardGroup = new THREE.Group();

    // Materiais Realistas
    const whiteRobotMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.2, roughness: 0.1 });
    const blueRobotMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.4, roughness: 0.2, emissive: 0x0284c7, emissiveIntensity: 0.2 });
    const cyanLedMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      clearcoat: 1.0
    });

    // Cabeça do Robô (Estilo Capacetinho arredondado)
    const headGeo = new THREE.SphereGeometry(0.48, 32, 32);
    headGeo.scale(1.2, 1.0, 0.95);
    const headMesh = new THREE.Mesh(headGeo, whiteRobotMat);
    headMesh.position.set(-0.8, 1.5, 0);
    robotocCardGroup.add(headMesh);

    // Visor do Capacete (Azul)
    const visorGeo = new THREE.SphereGeometry(0.42, 32, 32);
    visorGeo.scale(1.1, 0.85, 0.8);
    const visorMesh = new THREE.Mesh(visorGeo, blueRobotMat);
    visorMesh.position.set(-0.8, 1.5, 0.12);
    robotocCardGroup.add(visorMesh);

    // Olhos HUD em LED Cyan (Pontilhado/Grid)
    const eyeLGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const eyeL = new THREE.Mesh(eyeLGeo, cyanLedMat);
    eyeL.position.set(-0.95, 1.52, 0.48);
    const eyeR = new THREE.Mesh(eyeLGeo, cyanLedMat);
    eyeR.position.set(-0.65, 1.52, 0.48);
    robotocCardGroup.add(eyeL);
    robotocCardGroup.add(eyeR);

    // Antenas laterais
    const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25);
    const antL = new THREE.Mesh(antGeo, blueRobotMat);
    antL.position.set(-1.25, 1.75, 0);
    antL.rotation.z = Math.PI / 4;
    const antR = new THREE.Mesh(antGeo, blueRobotMat);
    antR.position.set(-0.35, 1.75, 0);
    antR.rotation.z = -Math.PI / 4;
    robotocCardGroup.add(antL);
    robotocCardGroup.add(antR);

    // Tronco e braços segurando a placa neon
    const bodyGeo = new THREE.SphereGeometry(0.38, 24, 24);
    bodyGeo.scale(0.9, 1.1, 0.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, whiteRobotMat);
    bodyMesh.position.set(-0.8, 0.85, 0);
    robotocCardGroup.add(bodyMesh);

    const chestLedGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const chestLed = new THREE.Mesh(chestLedGeo, cyanLedMat);
    chestLed.position.set(-0.8, 0.9, 0.32);
    robotocCardGroup.add(chestLed);

    // Braço Esquerdo apoiando na placa
    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45);
    const armL = new THREE.Mesh(armGeo, whiteRobotMat);
    armL.position.set(-0.35, 0.95, 0.25);
    armL.rotation.z = -Math.PI / 3;
    armL.rotation.x = -Math.PI / 6;
    robotocCardGroup.add(armL);

    // 🖼️ CANVAS PARA A PLAQUINHA NEON IDÊNTICA À SUA IMAGEM
    const plateCanvas = document.createElement('canvas');
    plateCanvas.width = 600;
    plateCanvas.height = 360;
    const ctxP = plateCanvas.getContext('2d');

    // Fundo Vidro Cyan/Magenta
    const grad = ctxP.createLinearGradient(0, 0, 600, 360);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    grad.addColorStop(1, 'rgba(30, 10, 60, 0.95)');
    ctxP.fillStyle = grad;
    ctxP.fillRect(0, 0, 600, 360);

    // Borda Neon Dupla
    ctxP.strokeStyle = '#00f0ff';
    ctxP.lineWidth = 12;
    ctxP.strokeRect(10, 10, 580, 340);

    ctxP.strokeStyle = '#ff007f';
    ctxP.lineWidth = 6;
    ctxP.strokeRect(20, 20, 560, 320);

    // Selos de Avaliação (Confiável 100%, Legal 100%, Sexy 98%) na esquerda da placa
    ctxP.fillStyle = '#ffffff';
    ctxP.font = 'bold 18px Arial';
    ctxP.fillText('🙂 CONFIÁVEL: 100%', 35, 80);
    ctxP.fillText('😎 LEGAL: 100%', 35, 170);
    ctxP.fillText('🔥 SEXY: 98%', 35, 260);

    // Título Central "ORKUT EM SOCIAL 3D"
    ctxP.textAlign = 'center';
    ctxP.fillStyle = '#ffffff';
    ctxP.font = 'bold 32px Arial';
    ctxP.fillText('ORKUT', 380, 75);

    // Grande Letreiro "EM" Azul 3D
    ctxP.fillStyle = '#3b82f6';
    ctxP.font = '900 110px Arial';
    ctxP.shadowColor = '#00f0ff';
    ctxP.shadowBlur = 20;
    ctxP.fillText('EM', 380, 200);
    ctxP.shadowBlur = 0;

    ctxP.fillStyle = '#00f0ff';
    ctxP.font = 'bold 30px Arial';
    ctxP.fillText('SOCIAL 3D', 380, 280);

    const plateTexture = new THREE.CanvasTexture(plateCanvas);
    const plateGeo = new THREE.BoxGeometry(2.3, 1.35, 0.06);
    const plateMat = new THREE.MeshStandardMaterial({
      map: plateTexture,
      transparent: true,
      opacity: 0.95,
      roughness: 0.1,
      metalness: 0.3,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.25
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.set(0.4, 1.0, 0.2); // Posicionada exatamente segurada pelo Mini-ROBOTOC
    robotocCardGroup.add(plateMesh);

    scene.add(robotocCardGroup);
    robotocCard3DGroupRef.current = robotocCardGroup;
    robotocCardGroup.position.set(-2.6, -1.2, 0);

    // MINI-ROBOTOC ADICIONAL CANTO DIREITO
    const miniRobotocGroup = new THREE.Group();
    const miniMetalMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.8, roughness: 0.2, emissive: 0x00f0ff, emissiveIntensity: 0.3 });
    const miniBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });

    const miniHeadGeo = new THREE.SphereGeometry(0.25, 24, 24);
    const miniHeadMesh = new THREE.Mesh(miniHeadGeo, miniMetalMat);
    miniHeadMesh.position.set(0, 0.7, 0);
    miniRobotocGroup.add(miniHeadMesh);

    const miniChestGeo = new THREE.BoxGeometry(0.4, 0.45, 0.3);
    const miniChestMesh = new THREE.Mesh(miniChestGeo, miniBodyMat);
    miniChestMesh.position.set(0, 0.3, 0);
    miniRobotocGroup.add(miniChestMesh);

    miniRobotocGroup.position.set(2.8, -1.0, 0);
    scene.add(miniRobotocGroup);
    miniRobotocGroupRef.current = miniRobotocGroup;

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
      if (!isDragging || !robotocCard3DGroupRef.current) return;
      const deltaX = clientX - previousTouchPosition.x;
      const deltaY = clientY - previousTouchPosition.y;

      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      robotocCard3DGroupRef.current.rotation.y += deltaX * 0.012;
      robotocCard3DGroupRef.current.rotation.x += deltaY * 0.008;

      previousTouchPosition = { x: clientX, y: clientY };
    };

    const handleEnd = (clientX, clientY) => {
      if (dragDistance < 10 && mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        const intersectsOrbs = raycaster.intersectObjects(esferasLinks3DRef.current);
        const intersectsRobotocCard = robotocCard3DGroupRef.current ? raycaster.intersectObjects(robotocCard3DGroupRef.current.children, true) : [];

        if (intersectsOrbs.length > 0) {
          const hitOrb = intersectsOrbs[0].object;
          if (hitOrb.userData && hitOrb.userData.url) {
            abrirLinkExternoSeguro(hitOrb.userData.url);
          }
        } else if (intersectsRobotocCard.length > 0) {
          setChatMiniRobotocAberto(true);
        } else {
          setMostrarOverlayRobotoc(prev => !prev);
        }
      }
      isDragging = false;
    };

    const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = (e) => handleEnd(e.clientX, e.clientY);

    const domContainer = mountRef.current;
    domContainer.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (bolaHolograficaMeshRef.current) {
        bolaHolograficaMeshRef.current.rotation.y += 0.008;
        bolaHolograficaMeshRef.current.rotation.x += 0.004;
        bolaHolograficaMeshRef.current.position.y = 0.2 + Math.sin(elapsedTime * 2) * 0.15;

        esferasLinks3DRef.current.forEach((mesh, index) => {
          const angle = elapsedTime * 0.8 + (index * (Math.PI * 2 / esferasLinks3DRef.current.length));
          const radius = 2.5;
          mesh.position.x = bolaHolograficaMeshRef.current.position.x + Math.cos(angle) * radius;
          mesh.position.z = bolaHolograficaMeshRef.current.position.z + Math.sin(angle) * radius;
          mesh.position.y = bolaHolograficaMeshRef.current.position.y + Math.sin(elapsedTime * 2 + index) * 0.4;
        });
      }

      if (robotocCard3DGroupRef.current && !isDragging) {
        robotocCard3DGroupRef.current.position.y = -1.2 + Math.sin(elapsedTime * 1.8) * 0.06;
      }

      if (miniRobotocGroupRef.current) {
        miniRobotocGroupRef.current.position.y = -1.0 + Math.sin(elapsedTime * 2.2) * 0.08;
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
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domContainer.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [links3D]);

  const adicionarAmigo = (e) => {
    e.preventDefault();
    if (!novoAmigoInput.trim()) return;

    const novo = {
      id: Date.now(),
      nome: novoAmigoInput.startsWith('@') || novoAmigoInput.startsWith('http') ? novoAmigoInput : `@${novoAmigoInput}`,
      rede: novoAmigoRede,
      tipo: novoAmigoTipoAcao === 'solicitacao' ? 'Solicitação Enviada ✉️' : 'Link @ Conectado 🔗',
      icone: novoAmigoRede === 'YouTube' ? '▶️' : novoAmigoRede === 'TikTok' ? '🎵' : novoAmigoRede === 'Instagram' ? '📸' : '🌐'
    };

    const atualizados = [novo, ...amigos];
    setAmigos(atualizados);
    localStorage.setItem('orkut_amigos_reais', JSON.stringify(atualizados));
    alert(`${novo.tipo} para ${novo.nome} na rede ${novoAmigoRede}!`);
    setNovoAmigoInput('');
  };

  const conectarGrupoOuComunidade = (e) => {
    e.preventDefault();
    if (!buscaGrupoInput.trim()) return;

    const nova = {
      id: Date.now(),
      nome: buscaGrupoInput.startsWith('@') || buscaGrupoInput.startsWith('http') ? buscaGrupoInput : `@${buscaGrupoInput}`,
      tipo: novaComunidadeTipo,
      rede: novaComunidadeRede,
      icone: '🌐'
    };

    const atualizadas = [nova, ...comunidades];
    setComunidades(atualizadas);
    localStorage.setItem('orkut_comunidades_reais', JSON.stringify(atualizadas));
    alert(`Grupo/Comunidade "${nova.nome}" conectado via ${novaComunidadeRede}!`);
    setBuscaGrupoInput('');
  };

  const enviarScrap = (e) => {
    e.preventDefault();
    if (!novoScrapInput.trim()) return;

    const alvoTexto = marcacaoScrapAlvo.trim() ? `${marcacaoScrapTipo}: ${marcacaoScrapAlvo}` : `Público (${marcacaoScrapTipo})`;

    const novo = {
      id: Date.now(),
      autor: "Você",
      marcadoPara: alvoTexto,
      texto: novoScrapInput,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const atualizados = [novo, ...scraps];
    setScraps(atualizados);
    localStorage.setItem('orkut_scraps_reais', JSON.stringify(atualizados));
    setNovoScrapInput('');
    setMarcacaoScrapAlvo('');
  };

  const enviarDepoimento = (e) => {
    e.preventDefault();
    if (!novoDepoimentoInput.trim()) return;

    const alvoTexto = marcacaoDepoimentoAlvo.trim() ? `${marcacaoDepoimentoTipo}: ${marcacaoDepoimentoAlvo}` : `Destaque (${marcacaoDepoimentoTipo})`;

    const novo = {
      id: Date.now(),
      autor: "Você (Depoimento VIP)",
      marcadoPara: alvoTexto,
      texto: novoDepoimentoInput,
      data: new Date().toLocaleDateString('pt-BR'),
      status: "Aprovado"
    };

    const atualizados = [novo, ...depoimentos];
    setDepoimentos(atualizados);
    localStorage.setItem('orkut_depoimentos_reais', JSON.stringify(atualizados));
    setNovoDepoimentoInput('');
    setMarcacaoDepoimentoAlvo('');
    alert("💖 Depoimento com marcação enviado de coração!");
  };

  const exportarPerfilOrkutPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(237, 37, 128);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("ORKUT 2026 - PERFIL OFICIAL EMANUEL DA SILVA", 14, 18);
    doc.setFontSize(9);
    doc.text("HUB DE REDES SOCIAIS & ROBOTOC DATA CENTER 3D | EMANUEL.OS", 14, 25);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(`Nome: ${perfilUsuario.nome}`, 14, 40);
    doc.text(`Bio: ${perfilUsuario.statusBio}`, 14, 46);
    doc.text(`Amigos Conectados: ${amigos.length} | Comunidades Ativas: ${comunidades.length}`, 14, 52);

    doc.save("Perfil_Orkut_Emanuel_da_Silva.pdf");
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#020617',
      backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      color: '#fff',
      fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>orkut - Emanuel da Silva | ROBOTOC Data Center 3D & Redes Sociais</title>
      </Head>

      {/* CENA THREE.JS DATA CENTER 3D + MINI-ROBOTOC COM PLAQUINHA 3D */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, cursor: 'grab' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* HEADER ORKUT */}
        <header style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(15px)',
          padding: '10px 20px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #00f0ff',
          boxShadow: '0 0 20px rgba(0,240,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#ed2580', letterSpacing: '-1px' }}>orkut</span>
            <span style={{ fontSize: '10px', color: '#00f0ff', backgroundColor: 'rgba(0,240,255,0.1)', padding: '3px 8px', borderRadius: '12px', border: '1px solid #00f0ff' }}>
              🤖 ROBOTOC Data Center Active
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setChatMiniRobotocAberto(!chatMiniRobotocAberto)} style={{ padding: '6px 12px', backgroundColor: '#ed2580', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px #ed2580' }}>
              💬 CHAT MINI-ROBOTOC 3D
            </button>
            <button onClick={() => setMostrarOverlayRobotoc(!mostrarOverlayRobotoc)} style={{ padding: '6px 12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px #00f0ff' }}>
              🤖 ROBOTOC HUD
            </button>
            <button onClick={() => setArquiteturaAberta(!arquiteturaAberta)} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px #10b981' }}>
              🏛️ DATA CENTER 3D
            </button>
            <nav style={{ display: 'flex', gap: '12px', fontSize: '11px', alignItems: 'center', marginLeft: '10px' }}>
              <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>início</Link>
              <span style={{ color: '#00f0ff' }}>|</span>
              <span style={{ color: '#fff', cursor: 'pointer' }} onClick={() => setAbaMuralAtiva('scraps')}>recados</span>
              <span style={{ color: '#00f0ff' }}>|</span>
              <Link href="/" style={{ color: '#00f0ff', textDecoration: 'none', fontWeight: 'bold' }}>Emanuel.OS ➔</Link>
            </nav>
          </div>
        </header>

        {/* HUB DE REDES SOCIAIS */}
        <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,240,255,0.2)', padding: '8px 20px', display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#00f0ff', whiteSpace: 'nowrap' }}>Canais Integrados (Emanuel da Silva):</span>
          {links3D.map(rede => (
            <a
              key={rede.id}
              href={rede.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '10px', textDecoration: 'none', color: '#fff', backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid #00f0ff', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                fontWeight: 'bold', whiteSpace: 'nowrap'
              }}
            >
              <span>{rede.icone}</span> {rede.titulo}
            </a>
          ))}
        </div>

        {/* CORPO DO PERFIL */}
        <main style={{
          maxWidth: '1100px',
          width: '95%',
          margin: '15px auto 40px auto',
          display: 'grid',
          gridTemplateColumns: '270px 1fr 300px',
          gap: '15px',
          boxSizing: 'border-box'
        }}>

          {/* COLUNA ESQUERDA: PERFIL E MENU */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.9)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', textAlign: 'center', boxShadow: '0 0 20px rgba(0,240,255,0.15)' }}>
              {/* RENDERIZADOR VISUAL DO CARD / MODELO 3D REALISTA DO MINI-ROBOTOC */}
              <div style={{ border: '2px solid #00f0ff', padding: '4px', borderRadius: '10px', backgroundColor: '#020617', marginBottom: '8px', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/logo-orkut.png"
                  alt="Mini-ROBOTOC Orkut EM Social 3D"
                  style={{ width: '100%', height: 'auto', maxHeight: '220px', objectFit: 'contain', borderRadius: '6px', display: 'block' }}
                />
                <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', marginTop: '4px' }}>🤖 Modelo 3D Interativo Ativo</span>
              </div>

              <h2 style={{ fontSize: '15px', color: '#00f0ff', margin: '4px 0 2px 0', fontWeight: 'bold' }}>{perfilUsuario.nome}</h2>
              <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>{perfilUsuario.relacionamento}, {perfilUsuario.localizacao}</span>
              <span style={{ fontSize: '9px', color: '#ed2580', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>🔥 Arquiteto & Criador do Emanuel.OS</span>
            </div>

            <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '10px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f0ff', cursor: 'pointer', padding: '3px 0' }}>
                <span>👤</span> <b>perfil oficial</b>
              </div>
              <div onClick={() => setAbaMuralAtiva('scraps')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', cursor: 'pointer', padding: '3px 0' }}>
                <span>📝</span> <b>recados ({scraps.length})</b>
              </div>
              <div onClick={() => setAbaMuralAtiva('depoimentos')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ed2580', cursor: 'pointer', padding: '3px 0' }}>
                <span>💬</span> <b>depoimentos ({depoimentos.length})</b>
              </div>
              <div onClick={() => setAbaMuralAtiva('mascotes')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', cursor: 'pointer', padding: '3px 0' }}>
                <span>🤖</span> <b>mascotes ROBOTOC ({mascotes.length})</b>
              </div>
              <div onClick={() => setAbaMuralAtiva('gerenciar')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', cursor: 'pointer', padding: '3px 0' }}>
                <span>⚙️</span> <b>conectar @ links & grupos</b>
              </div>
            </div>

            <button
              onClick={exportarPerfilOrkutPDF}
              style={{
                padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none',
                borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px #00f0ff'
              }}
            >
              📄 Baixar Perfil Orkut (.PDF)
            </button>
          </section>

          {/* COLUNA CENTRAL */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* QUADRADINHO PERFIL, BIO, SELOS */}
            <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.9)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '14px', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: blocoPerfilExpandido ? '8px' : '0' }}>
                <h1 style={{ fontSize: '18px', color: '#00f0ff', margin: 0, fontWeight: 'bold' }}>{perfilUsuario.nome}</h1>
                <button
                  onClick={() => setBlocoPerfilExpandido(!blocoPerfilExpandido)}
                  style={{ background: 'none', border: 'none', color: '#00f0ff', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', padding: '2px 6px' }}
                >
                  {blocoPerfilExpandido ? '▲' : '▼'}
                </button>
              </div>

              {blocoPerfilExpandido && (
                <div>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '0 0 12px 0', fontStyle: 'italic' }}>"{perfilUsuario.statusBio}"</p>

                  <div style={{ display: 'flex', gap: '18px', padding: '8px 12px', backgroundColor: '#020617', borderRadius: '8px', border: '1px solid rgba(0,240,255,0.2)', fontSize: '11px' }}>
                    <div><span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>confiável:</span><span style={{ color: '#22c55e' }}>😊😊😊</span> <b>{perfilUsuario.confiavel}%</b></div>
                    <div><span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>legal:</span><span style={{ color: '#38bdf8' }}>🧊🧊🧊</span> <b>{perfilUsuario.legal}%</b></div>
                    <div><span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>sexy:</span><span style={{ color: '#ef4444' }}>🔥🔥🔥</span> <b>{perfilUsuario.sexy}%</b></div>
                  </div>

                  <div style={{ marginTop: '14px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#e2e8f0' }}>
                    <div><b style={{ color: '#00f0ff' }}>aniversário:</b> {perfilUsuario.aniversario}</div>
                    <div><b style={{ color: '#00f0ff' }}>profissão:</b> {perfilUsuario.profissao}</div>
                    <div><b style={{ color: '#00f0ff' }}>quem sou eu:</b> {perfilUsuario.quemSouEu}</div>
                  </div>

                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed rgba(0, 240, 255, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ed2580', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🌐 LINK FUTURÍSTICO EM SOCIAL 3D
                      </span>
                      <button
                        onClick={() => setModalLinksFuturisticosAberta(true)}
                        style={{ padding: '3px 8px', backgroundColor: '#ed2580', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        + Gerenciar / Adicionar
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {linksFuturisticosImportantes.slice(0, 3).map((linkFut) => (
                        <div
                          key={linkFut.id}
                          onClick={() => abrirLinkExternoSeguro(linkFut.url)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            backgroundColor: '#020617', border: '1px solid rgba(237, 37, 128, 0.4)',
                            padding: '6px 10px', borderRadius: '8px', cursor: 'pointer'
                          }}
                        >
                          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{linkFut.icone}</span> {linkFut.titulo}
                          </span>
                          <span style={{ fontSize: '8px', color: '#00f0ff', backgroundColor: 'rgba(0,240,255,0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                            {linkFut.categoria}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* QUADRADINHO MURAL & ABAS (INCLUINDO A NOVA ABA DE MASCOTES) */}
            <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.9)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '14px', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: blocoMuralExpandido ? '1px solid rgba(0,240,255,0.2)' : 'none', paddingBottom: blocoMuralExpandido ? '8px' : '0', marginBottom: blocoMuralExpandido ? '10px' : '0' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button onClick={() => setAbaMuralAtiva('scraps')} style={{ padding: '6px 10px', border: 'none', borderRadius: '6px', backgroundColor: abaMuralAtiva === 'scraps' ? '#00f0ff' : '#020617', color: abaMuralAtiva === 'scraps' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📝 Scraps ({scraps.length})
                  </button>
                  <button onClick={() => setAbaMuralAtiva('depoimentos')} style={{ padding: '6px 10px', border: 'none', borderRadius: '6px', backgroundColor: abaMuralAtiva === 'depoimentos' ? '#ed2580' : '#020617', color: abaMuralAtiva === 'depoimentos' ? '#fff' : '#ed2580', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    💖 Depoimentos ({depoimentos.length})
                  </button>
                  {/* NOVA ABA MASCOTES */}
                  <button onClick={() => setAbaMuralAtiva('mascotes')} style={{ padding: '6px 10px', border: 'none', borderRadius: '6px', backgroundColor: abaMuralAtiva === 'mascotes' ? '#a855f7' : '#020617', color: abaMuralAtiva === 'mascotes' ? '#fff' : '#c084fc', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    🤖 Mascotes ({mascotes.length})
                  </button>
                  <button onClick={() => setAbaMuralAtiva('gerenciar')} style={{ padding: '6px 10px', border: 'none', borderRadius: '6px', backgroundColor: abaMuralAtiva === 'gerenciar' ? '#10b981' : '#020617', color: abaMuralAtiva === 'gerenciar' ? '#fff' : '#34d399', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ⚙️ Conectar Links
                  </button>
                </div>

                <button
                  onClick={() => setBlocoMuralExpandido(!blocoMuralExpandido)}
                  style={{ background: 'none', border: 'none', color: '#00f0ff', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', padding: '2px 6px' }}
                >
                  {blocoMuralExpandido ? '▲' : '▼'}
                </button>
              </div>

              {blocoMuralExpandido && (
                <div>
                  {/* ABA SCRAPS */}
                  {abaMuralAtiva === 'scraps' && (
                    <div>
                      <form onSubmit={enviarScrap} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select 
                            value={marcacaoScrapTipo} 
                            onChange={(e) => setMarcacaoScrapTipo(e.target.value)} 
                            style={{ padding: '6px', fontSize: '10px', border: '1px solid #00f0ff', borderRadius: '6px', backgroundColor: '#020617', fontWeight: 'bold', color: '#00f0ff' }}
                          >
                            <option value="Amigo(a)">👤 Marcar Amigo / Amiga</option>
                            <option value="Namorado(a)">❤️ Marcar Namorado / Namorada</option>
                            <option value="Grupo / Comunidade">🌐 Jogar no Grupo / Comunidade</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Nome, @usuario ou nome do grupo..." 
                            value={marcacaoScrapAlvo} 
                            onChange={(e) => setMarcacaoScrapAlvo(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px 8px', fontSize: '10px', border: '1px solid #334155', borderRadius: '6px', backgroundColor: '#020617', color: '#fff', outline: 'none' }} 
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            required
                            placeholder="Escreva o Scrap (Recado)..." 
                            value={novoScrapInput} 
                            onChange={(e) => setNovoScrapInput(e.target.value)} 
                            style={{ flexGrow: 1, padding: '7px 10px', fontSize: '11px', border: '1px solid #334155', borderRadius: '6px', backgroundColor: '#020617', color: '#fff', outline: 'none' }} 
                          />
                          <button type="submit" style={{ padding: '7px 14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Postar Scrap
                          </button>
                        </div>
                      </form>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {scraps.map(s => (
                          <div key={s.id} style={{ backgroundColor: '#020617', border: '1px solid rgba(0,240,255,0.2)', padding: '8px 10px', borderRadius: '6px', fontSize: '11px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00f0ff', fontWeight: 'bold' }}>
                              <span>{s.autor} <span style={{ color: '#ed2580', fontSize: '9px' }}>({s.marcadoPara})</span></span>
                              <span style={{ fontSize: '9px', color: '#94a3b8' }}>{s.horario}</span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', color: '#e2e8f0' }}>{s.texto}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABA DEPOIMENTOS */}
                  {abaMuralAtiva === 'depoimentos' && (
                    <div>
                      <form onSubmit={enviarDepoimento} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select 
                            value={marcacaoDepoimentoTipo} 
                            onChange={(e) => setMarcacaoDepoimentoTipo(e.target.value)} 
                            style={{ padding: '6px', fontSize: '10px', border: '1px solid #ed2580', borderRadius: '6px', backgroundColor: '#020617', fontWeight: 'bold', color: '#ed2580' }}
                          >
                            <option value="Amigo(a)">👤 Depoimento para Amigo(a)</option>
                            <option value="Namorado(a)">❤️ Declaração para Namorado(a)</option>
                            <option value="Grupo / Comunidade">🌐 Jogar no Grupo / Comunidade</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Nome, @usuario ou comunidade..." 
                            value={marcacaoDepoimentoAlvo} 
                            onChange={(e) => setMarcacaoDepoimentoAlvo(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px 8px', fontSize: '10px', border: '1px solid #ed2580', borderRadius: '6px', backgroundColor: '#020617', color: '#fff', outline: 'none' }} 
                          />
                        </div>

                        <textarea 
                          required
                          placeholder="Escreva um depoimento especial de coração..." 
                          value={novoDepoimentoInput} 
                          onChange={(e) => setNovoDepoimentoInput(e.target.value)} 
                          style={{ width: '100%', height: '50px', padding: '6px 10px', fontSize: '11px', border: '1px solid #ed2580', borderRadius: '6px', backgroundColor: '#020617', color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box' }} 
                        />
                        <button type="submit" style={{ padding: '6px', backgroundColor: '#ed2580', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                          💖 Enviar Depoimento com Marcação
                        </button>
                      </form>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {depoimentos.map(d => (
                          <div key={d.id} style={{ backgroundColor: '#020617', border: '1px solid rgba(237,37,128,0.3)', padding: '8px 10px', borderRadius: '6px', fontSize: '11px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ed2580', fontWeight: 'bold' }}>
                              <span>{d.autor} <span style={{ color: '#00f0ff', fontSize: '9px' }}>({d.marcadoPara})</span></span>
                              <span style={{ fontSize: '9px', color: '#94a3b8' }}>{d.data}</span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', color: '#e2e8f0', fontStyle: 'italic' }}>"{d.texto}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NOVA ABA: MASCOTES ROBOTOC 3D */}
                  {abaMuralAtiva === 'mascotes' && (
                    <div>
                      <form onSubmit={adicionarMascote} style={{ backgroundColor: '#020617', border: '1px solid #a855f7', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
                        <strong style={{ fontSize: '11px', color: '#c084fc', display: 'block', marginBottom: '6px' }}>
                          ➕ Criar / Personalizar Novo Mascote ROBOTOC
                        </strong>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input 
                            type="text" 
                            required 
                            placeholder="Nome do seu Mascote..." 
                            value={novoMascoteNome} 
                            onChange={(e) => setNovoMascoteNome(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px', fontSize: '10px', border: '1px solid #a855f7', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }} 
                          />
                          <select value={novoMascoteTipo} onChange={(e) => setNovoMascoteTipo(e.target.value)} style={{ padding: '6px', fontSize: '10px', border: '1px solid #a855f7', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }}>
                            <option value="Assistente">Assistente Core</option>
                            <option value="Guardião">Guardião de Redes</option>
                            <option value="Pixel Art">Pixel Cyber Bot</option>
                          </select>
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '6px', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                          ⚡ Ativar Novo Mascote no Perfil
                        </button>
                      </form>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {mascotes.map(m => (
                          <div key={m.id} style={{ backgroundColor: '#020617', border: '1px solid rgba(168,85,247,0.4)', padding: '8px', borderRadius: '8px', fontSize: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '24px' }}>{m.icone}</span>
                            <div>
                              <strong style={{ color: '#fff', display: 'block' }}>{m.nome}</strong>
                              <span style={{ color: '#c084fc', fontSize: '8px', display: 'block' }}>{m.tipo} - {m.nivel}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABA GERENCIAR CONEXÕES */}
                  {abaMuralAtiva === 'gerenciar' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <form onSubmit={adicionarAmigo} style={{ backgroundColor: '#020617', border: '1px solid #10b981', padding: '10px', borderRadius: '8px' }}>
                        <strong style={{ fontSize: '11px', color: '#34d399', display: 'block', marginBottom: '6px' }}>
                          ➕ Conectar Novo Amigo das Redes (Link @ ou Solicitação)
                        </strong>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                          <select value={novoAmigoRede} onChange={(e) => setNovoAmigoRede(e.target.value)} style={{ padding: '6px', fontSize: '10px', border: '1px solid #059669', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }}>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Kwai">Kwai</option>
                          </select>

                          <select value={novoAmigoTipoAcao} onChange={(e) => setNovoAmigoTipoAcao(e.target.value)} style={{ padding: '6px', fontSize: '10px', border: '1px solid #059669', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }}>
                            <option value="link">Vincular por Link / @</option>
                            <option value="solicitacao">Enviar Solicitação Direta</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            required 
                            placeholder="Digite o @usuario ou link..." 
                            value={novoAmigoInput} 
                            onChange={(e) => setNovoAmigoInput(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px', fontSize: '10px', border: '1px solid #059669', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }} 
                          />
                          <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#10b981', color: '#000', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Conectar
                          </button>
                        </div>
                      </form>

                      <form onSubmit={conectarGrupoOuComunidade} style={{ backgroundColor: '#020617', border: '1px solid #3b82f6', padding: '10px', borderRadius: '8px' }}>
                        <strong style={{ fontSize: '11px', color: '#60a5fa', display: 'block', marginBottom: '6px' }}>
                          🔍 Buscar / Conectar Grupo ou Comunidade
                        </strong>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                          <select value={novaComunidadeRede} onChange={(e) => setNovaComunidadeRede(e.target.value)} style={{ padding: '6px', fontSize: '10px', border: '1px solid #2563eb', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }}>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Threads">Threads</option>
                          </select>

                          <input 
                            type="text" 
                            placeholder="Categoria..." 
                            value={novaComunidadeTipo} 
                            onChange={(e) => setNovaComunidadeTipo(e.target.value)} 
                            style={{ padding: '6px', fontSize: '10px', border: '1px solid #2563eb', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }} 
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            required 
                            placeholder="Nome do grupo..." 
                            value={buscaGrupoInput} 
                            onChange={(e) => setBuscaGrupoInput(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px', fontSize: '10px', border: '1px solid #2563eb', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff' }} 
                          />
                          <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Conectar Grupo
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* COLUNA DIREITA */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.9)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '6px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12px', color: '#00f0ff', margin: 0, fontWeight: 'bold' }}>meus amigos ({amigos.length})</h3>
                <span onClick={() => { setBlocoMuralExpandido(true); setAbaMuralAtiva('gerenciar'); }} style={{ fontSize: '10px', color: '#38bdf8', cursor: 'pointer' }}>+ adicionar</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                {amigos.slice(0, 9).map(a => (
                  <div key={a.id} style={{ fontSize: '9px' }}>
                    <div style={{ width: '42px', height: '42px', backgroundColor: '#020617', border: '1px solid #00f0ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', margin: '0 auto 2px auto' }}>
                      {a.icone || '👤'}
                    </div>
                    <span style={{ color: '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.nome}</span>
                    <span style={{ color: '#94a3b8', fontSize: '8px' }}>{a.rede}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(8, 15, 30, 0.9)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '6px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12px', color: '#00f0ff', margin: 0, fontWeight: 'bold' }}>comunidades & grupos ({comunidades.length})</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {comunidades.slice(0, 5).map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', padding: '4px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '16px' }}>{c.icone || '🌐'}</span>
                    <div>
                      <strong style={{ color: '#fff', display: 'block' }}>{c.nome}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '8px' }}>{c.tipo} ({c.rede})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>

        {/* JANELA CHAT MINI-ROBOTOC */}
        {chatMiniRobotocAberto && (
          <div style={{
            position: 'fixed', bottom: '30px', left: '30px', width: '380px', height: '420px',
            backgroundColor: 'rgba(8, 15, 30, 0.96)', border: '2px solid #ed2580', borderRadius: '16px',
            boxShadow: '0 0 35px rgba(237, 37, 128, 0.4)', zIndex: 1100, backdropFilter: 'blur(15px)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{ padding: '12px', backgroundColor: '#020617', borderBottom: '1px solid #ed2580', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🤖</span>
                <span style={{ fontSize: '12px', color: '#ed2580', fontWeight: 'bold' }}>Orkut Social em Chat Futurista 3D</span>
              </div>
              <button onClick={() => setChatMiniRobotocAberto(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ flexGrow: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(2, 6, 23, 0.6)' }}>
              {mensagensChat.map((m) => (
                <div key={m.id} style={{
                  alignSelf: m.autor === 'Você' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.autor === 'Você' ? '#00f0ff' : '#1e293b',
                  color: m.autor === 'Você' ? '#000' : '#fff',
                  padding: '8px 12px', borderRadius: '10px', fontSize: '10px', maxWidth: '80%'
                }}>
                  <b style={{ display: 'block', fontSize: '9px', marginBottom: '2px', color: m.autor === 'Você' ? '#000' : '#ed2580' }}>{m.autor}:</b>
                  {m.texto}
                </div>
              ))}
            </div>

            <form onSubmit={enviarPerguntaMiniRobotoc} style={{ padding: '8px', backgroundColor: '#020617', borderTop: '1px solid rgba(237,37,128,0.3)', display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Pergunte ao Mini-ROBOTOC sobre o Orkut 3D..."
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                style={{ flexGrow: 1, padding: '6px 10px', fontSize: '10px', border: '1px solid #ed2580', borderRadius: '6px', backgroundColor: '#09090b', color: '#fff', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#ed2580', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                Enviar
              </button>
            </form>
          </div>
        )}

        {/* MODAL LINKS FUTURÍSTICOS */}
        {modalLinksFuturisticosAberta && (
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '420px', backgroundColor: 'rgba(8, 15, 30, 0.98)', border: '2px solid #ed2580',
            borderRadius: '16px', padding: '16px', zIndex: 1200, color: '#fff', boxShadow: '0 0 40px rgba(237, 37, 128, 0.4)',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ed2580', paddingBottom: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', color: '#ed2580', fontWeight: 'bold' }}>🌐 LINKS FUTURÍSTICOS EM SOCIAL 3D</h3>
              <button onClick={() => setModalLinksFuturisticosAberta(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <form onSubmit={adicionarLinkFuturistico} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" placeholder="Ícone" value={novoLinkFutIcone} onChange={(e) => setNovoLinkFutIcone(e.target.value)} style={{ width: '45px', padding: '6px', fontSize: '10px', backgroundColor: '#020617', border: '1px solid #ed2580', borderRadius: '6px', color: '#fff', textAlign: 'center' }} />
                <input type="text" required placeholder="Título do Site / Ferramenta" value={novoLinkFutTitulo} onChange={(e) => setNovoLinkFutTitulo(e.target.value)} style={{ flexGrow: 1, padding: '6px', fontSize: '10px', backgroundColor: '#020617', border: '1px solid #ed2580', borderRadius: '6px', color: '#fff' }} />
              </div>

              <input type="text" required placeholder="URL Externa (https://...)" value={novoLinkFutUrl} onChange={(e) => setNovoLinkFutUrl(e.target.value)} style={{ padding: '6px', fontSize: '10px', backgroundColor: '#020617', border: '1px solid #ed2580', borderRadius: '6px', color: '#fff' }} />

              <select value={novoLinkFutCategoria} onChange={(e) => setNovoLinkFutCategoria(e.target.value)} style={{ padding: '6px', fontSize: '10px', backgroundColor: '#020617', border: '1px solid #ed2580', borderRadius: '6px', color: '#fff' }}>
                <option value="Profissional">Profissional</option>
                <option value="Trabalho / Mídia">Trabalho / Mídia</option>
                <option value="Uso Pessoal / Nuvem">Uso Pessoal / Nuvem</option>
              </select>

              <button type="submit" style={{ padding: '8px', backgroundColor: '#ed2580', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
                ⚡ Adicionar Link Futurístico
              </button>
            </form>

            <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Links Salvos ({linksFuturisticosImportantes.length}):</span>
            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {linksFuturisticosImportantes.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(0,240,255,0.3)', fontSize: '10px' }}>
                  <span>{l.icone} {l.titulo}</span>
                  <button onClick={() => abrirLinkExternoSeguro(l.url)} style={{ padding: '2px 6px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Abrir ➔</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OVERLAY ROBOTOC DATA CENTER */}
        {mostrarOverlayRobotoc && (
          <div style={{ position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(8,15,30,0.96)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '20px', zIndex: 1000, width: '420px', color: '#fff', boxShadow: '0 0 40px rgba(0,240,255,0.4)', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #00f0ff', paddingBottom: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', color: '#00f0ff', fontWeight: 'bold' }}>🤖 ROBOTOC DATA CENTER & NUVEM</h3>
              <button onClick={() => setMostrarOverlayRobotoc(false)} style={{ background: 'none', border: 'none', color: '#ff007f', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <button onClick={() => setNuvemSelecionada('google')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'google' ? '#4285f4' : '#1e293b', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Google Drive</button>
              <button onClick={() => setNuvemSelecionada('apple')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'apple' ? '#fff' : '#1e293b', color: nuvemSelecionada === 'apple' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Apple iCloud</button>
              <button onClick={() => setNuvemSelecionada('microsoft')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'microsoft' ? '#00a4ef' : '#1e293b', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>OneDrive</button>
            </div>

            <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '10px', border: '1px solid rgba(0,240,255,0.2)', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>ESTADO DO NÓ ORBITAL: ONLINE</span>
              <span style={{ fontSize: '10px', color: '#e2e8f0' }}>Nuvem em uso: <b>{nuvemSelecionada.toUpperCase()}</b></span>
            </div>

            <span style={{ fontSize: '10px', color: '#ed2580', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>➕ Adicionar Nó 3D de Link:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" placeholder="Ícone" value={novoLinkIcone} onChange={(e) => setNovoLinkIcone(e.target.value)} style={{ width: '50px', padding: '6px', backgroundColor: '#09090b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', textAlign: 'center' }} />
                <input type="text" placeholder="Título do Link" value={novoLinkTitulo} onChange={(e) => setNovoLinkTitulo(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#09090b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
              </div>
              <input type="text" placeholder="URL do Link / Rede Social..." value={novoLinkUrl} onChange={(e) => setNovoLinkUrl(e.target.value)} style={{ padding: '6px', backgroundColor: '#09090b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
              <button onClick={adicionarNovoLink3D} style={{ padding: '8px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
                🚀 Adicionar Nó de Link 3D
              </button>
            </div>
          </div>
        )}

        {/* ARQUITETURA DATA CENTER */}
        {arquiteturaAberta && (
          <div style={{
            position: 'fixed', bottom: '20px', right: '20px',
            backgroundColor: 'rgba(7, 12, 28, 0.96)', border: '2px solid #00f0ff', borderRadius: '16px',
            padding: '16px', zIndex: 1000, width: '360px', color: '#fff', boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', color: '#00f0ff', fontWeight: 'bold' }}>🏛️ ARQUITETURA DATA CENTER 3D</h3>
              <button onClick={() => setArquiteturaAberta(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <p style={{ fontSize: '9px', color: '#94a3b8', margin: '0 0 10px 0' }}>
              Sincronização Estrutural de Nós Orbitais. Dados operando via Gemini AGI.
            </p>

            <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>NÓS ORBITAIS ATIVOS</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', padding: '6px 8px', borderRadius: '6px', border: '1px solid #4285f4' }}>
                  <span style={{ fontSize: '10px', color: '#4285f4', fontWeight: 'bold' }}>☁️ Google Drive & Gmail</span>
                  <span style={{ fontSize: '9px', color: '#94a3b8' }}>Stable</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <FuturisticWindowManager />
    </div>
  );
}
