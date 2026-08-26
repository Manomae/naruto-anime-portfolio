import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

// Importação do Gerenciador de Janelas Futuristas (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaTerrestreEmanuel() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const oculosGroupRef = useRef(null);
  const esferasLinks3DRef = useRef([]);

  // 🎯 REFERÊNCIAS PARA ALVOS DE ZOOM DA CÂMERA E ÓCULOS 3D
  const cameraTargetPosRef = useRef(new THREE.Vector3(0, 22, 30));
  const cameraLookAtPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentCameraLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const oculosTargetPosRef = useRef(new THREE.Vector3(0, 8.5, 0));

  // 🚨 ESTADO DE EMERGÊNCIA
  const [modoEmergencia, setModoEmergencia] = useState(false);
  const [detalhesOcorrencia, setDetalhesOcorrencia] = useState(null);

  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [alertaAbalroamento, setAlertaAbalroamento] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(null);
  
  // 🌟 CONTROLE DA BARRA FLUIDA SUPERIOR RETRÁTIL E MENU UTILITÁRIOS
  const [isBarraFluidaOpen, setIsBarraFluidaOpen] = useState(false);
  const [menuUtilitariosAberto, setMenuUtilitariosAberto] = useState(false);
  const [menuZoomAberto, setMenuZoomAberto] = useState(false);

  // ESTADOS DE PRODUTIVIDADE E CLOUD
  const [abaAtiva, setAbaAtiva] = useState(null);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([
    { id: 1, texto: 'Sincronizar dados das Torres 5G/6G com Gemini AGI', horario: '10:00', status: 'Ativo' },
    { id: 2, texto: 'Monitorar reator nuclear e matriz fotovoltaica', horario: '14:30', status: 'Pendente' }
  ]);
  const [linkGerado, setLinkGerado] = useState('');

  // 🔍 BUSCA GEMINI AI & FILTROS MULTIMODAIS INTEGRADOS
  const [termoBusca, setTermoBusca] = useState('');
  const [sugestoesBusca, setSugestoesBusca] = useState([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('oceano');

  // --- ESTADOS DE INTEGRAÇÃO MULTICLOUD & ROBOTOC HUD ---
  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);
  const [abaOverlayAtiva, setAbaOverlayAtiva] = useState('browser');
  const [nuvemSelecionada, setNuvemSelecionada] = useState('google');
  const [statusNuvem] = useState({
    google: { conectado: true, conta: 'leeheroi123@gmail.com', espaco: '15 GB / 2 TB' },
    apple: { conectado: true, conta: 'emanuel@icloud.com', espaco: '5 GB / 200 GB' },
    microsoft: { conectado: true, conta: 'emanuel@outlook.com', espaco: '1 TB OneDrive / Azure' },
    custom: { conectado: true, conta: 'nuvem.emanuel-os.com', espaco: 'Ilimitado (G-AGI Vault)' }
  });

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

  // ESTADO DE LINKS 3D DINÂMICOS
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

  const [urlOuTermoNavegador, setUrlOuTermoNavegador] = useState('https://emanuel-os.com/search');
  const [motorBuscaSelecionado, setMotorBuscaSelecionado] = useState('google');
  const [browserAsset, setBrowserAsset] = useState({
    titulo: 'Emanuel.OS Quantum Browser v5.1',
    subtitulo: 'Pensamento Neural ROBOTOC Multimodal Active',
    imagem: null,
    videoUrl: null,
    conteudoTexto: 'Sincronização neural ativa no Mapa Terrestre. ROBOTOC pronto para processar buscas e mídias.'
  });

  const dadosClima = {
    temperatura: "28°C",
    condicao: "🌊 Maré Estável | Reator Nuclear & 5G 100%",
    alertaPreservacao: "⚡ MATRIZ GEMINI AI: Eólica, Solar, Nuclear, Hidrelétrica e 5G"
  };

  const estabelecimentos = [
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor de Dados & Nuvem Gemini AGI', cor: 0x00f0ff, posicao: { x: -6, y: 3, z: -4 }, ipCriptografado: 'AES256-88F9-EMA', tipo: 'tech' },
    { id: 2, nome: 'Estação Oceanográfica & Biologia Marinha', categoria: '🌊 Pesquisa de Espécies & Biofarmacêutica', cor: 0x00aaff, posicao: { x: 7, y: 2, z: 6 }, ipCriptografado: 'AES256-OCEAN-BIO', tipo: 'oceano' },
    { id: 3, nome: 'Usina Nuclear Central & Reator Limpo', categoria: '⚛️ Geração Nuclear, Fusão & Energia Limpa', cor: 0x00ffcc, posicao: { x: -5, y: 3.2, z: 5 }, ipCriptografado: 'AES256-NUK-POWER', tipo: 'energia' },
    { id: 4, nome: 'Usina Solar Neon & Painéis Fotovoltaicos', categoria: '☀️ Painéis Solares Neon & Sustentabilidade', cor: 0xffaa00, posicao: { x: 7, y: 2, z: -6 }, ipCriptografado: 'AES256-SOLAR-PWR', tipo: 'energia' },
    { id: 5, nome: 'Torre 5G/6G & Parque Eólico Futurista', categoria: '📡 Antenas 5G/6G & Turbinas Eólicas', cor: 0xaa00ff, posicao: { x: -8, y: 3.8, z: -8 }, ipCriptografado: 'AES256-5G-EOLICA', tipo: 'telecom' },
    { id: 6, nome: 'Usina Hidrelétrica & Barragem 3D', categoria: '💧 Geração Fluvial, Hidrelétrica & Barragem', cor: 0x0066ff, posicao: { x: 8, y: 2.5, z: 1 }, ipCriptografado: 'AES256-HIDRO-POWER', tipo: 'energia' },
    { id: 7, nome: 'Centro de Pesquisa Universitário & Vagas', categoria: '🎓 Parcerias Acadêmicas & Formação', cor: 0x88ff00, posicao: { x: 0, y: 1.5, z: 2 }, ipCriptografado: 'AES256-UNIV-RECRUIT', tipo: 'estudo' },
    { id: 8, nome: 'Centro Comercial Cyber & Laboratório', categoria: '💊 Farmacêutica Natural & Tecnologia', cor: 0xff00aa, posicao: { x: 4, y: 2.8, z: -1 }, ipCriptografado: 'AES256-LAB-FARMA', tipo: 'comercio' },
    { id: 9, nome: 'Batalhão Marítimo & Guarda Costeira', categoria: '👮 Proteção de Rios, Mares e Fauna', cor: 0x0066ff, posicao: { x: -3, y: 2.5, z: -7 }, ipCriptografado: 'AES256-COAST-GUARD', tipo: 'emergencia' },
    { id: 10, nome: 'Cataratas do Iguaçu Realistas 3D', categoria: '🌊 Módulo Ecológico & Reserva Fluvial 3D', cor: 0x00e5ff, posicao: { x: 10, y: 3, z: -10 }, ipCriptografado: 'AES256-CATARATAS-3D', tipo: 'oceano' },
    { id: 11, nome: 'Ponto de Kitesurf & Avatar Feminino 3D', categoria: '🏄 Praia Neon & Esportes Aquáticos', cor: 0xff007f, posicao: { x: -12, y: 2, z: 8 }, ipCriptografado: 'AES256-KITESURF-NEON', tipo: 'oceano' }
  ];

  // RELÓGIO
  useEffect(() => {
    setTempoAtual(new Date());
    const timer = setInterval(() => setTempoAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // API NOMINATIM COM INTELIGÊNCIA GEMINI
  useEffect(() => {
    if (termoBusca.trim().length < 3) {
      setSugestoesBusca([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setCarregandoBusca(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(termoBusca)}&limit=5`
        );
        const data = await response.json();
        setSugestoesBusca(data || []);
      } catch (error) {
        console.error("Erro na busca Gemini AI:", error);
      } finally {
        setCarregandoBusca(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

  // AÇÕES AUXILIARES ROBOTOC & LINKS
  const abrirLinkExternoSeguro = (url, titulo) => {
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
      icone: novoLinkIcone || '🌐',
      nuvem: nuvemSelecionada
    };
    setLinks3D(prev => [...prev, novo]);
    setNovoLinkTitulo('');
    setNovoLinkUrl('');
  };

  const executarNavegacaoBrowser = (termo) => {
    if (!termo.trim()) return;
    if (termo.startsWith('http://') || termo.startsWith('https://')) {
      if (typeof window !== 'undefined') window.open(termo, '_blank');
    } else {
      let targetUrl = `https://www.google.com/search?q=${encodeURIComponent(termo)}`;
      if (motorBuscaSelecionado === 'bing') targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(termo)}`;
      else if (motorBuscaSelecionado === 'duckduckgo') targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(termo)}`;
      if (typeof window !== 'undefined') window.open(targetUrl, '_blank');
    }
  };

  // 🚨 FUNÇÃO PARA ATIVAR/DESATIVAR MODO DE EMERGÊNCIA
  const alternarModoEmergencia = () => {
    if (!modoEmergencia) {
      setModoEmergencia(true);
      setDetalhesOcorrencia({
        protocolo: `EMG-${Math.floor(100000 + Math.random() * 900000)}`,
        tipo: '🚨 OCORRÊNCIA DE PERIGO / SITUAÇÃO CRÍTICA',
        descricao: 'Incidente imprevisto detectado no setor urbano. Ambulância 3D e Robotoc acionados via Sirene AGI.',
        horario: new Date().toLocaleTimeString('pt-BR')
      });
    } else {
      setModoEmergencia(false);
      setDetalhesOcorrencia(null);
    }
  };

  // 🥽 FUNÇÃO DE ZOOM DA CÂMERA ULTRA MODERNA + SINCRO DO ÓCULOS 3D
  const aplicarZoomCamera = (alvo) => {
    setMenuZoomAberto(false);
    switch (alvo) {
      case 'robotoc':
        cameraTargetPosRef.current.set(-10, 4, 6);
        cameraLookAtPosRef.current.set(-10, 2, 0);
        oculosTargetPosRef.current.set(-10, 4.2, 0);
        break;
      case 'ambulancia':
        cameraTargetPosRef.current.set(0, 3, 16);
        cameraLookAtPosRef.current.set(0, 0.3, 11.5);
        oculosTargetPosRef.current.set(0, 2.2, 11.5);
        break;
      case 'veiculos':
        cameraTargetPosRef.current.set(0, 8, 18);
        cameraLookAtPosRef.current.set(0, 0, 11);
        oculosTargetPosRef.current.set(0, 3.5, 11);
        break;
      case '5g':
        cameraTargetPosRef.current.set(-8, 7, -1);
        cameraLookAtPosRef.current.set(-8, 4, -5);
        oculosTargetPosRef.current.set(-8, 6.2, -5);
        break;
      case 'eolica':
        cameraTargetPosRef.current.set(-8, 8, -3);
        cameraLookAtPosRef.current.set(-8, 3, -8);
        oculosTargetPosRef.current.set(-8, 6.5, -8);
        break;
      case 'solar':
        cameraTargetPosRef.current.set(7, 5, -2);
        cameraLookAtPosRef.current.set(7, 2, -6);
        oculosTargetPosRef.current.set(7, 4.0, -6);
        break;
      case 'nuclear':
        cameraTargetPosRef.current.set(-5, 6, 10);
        cameraLookAtPosRef.current.set(-5, 3.2, 5);
        oculosTargetPosRef.current.set(-5, 5.2, 5);
        break;
      case 'hidro':
        cameraTargetPosRef.current.set(8, 6, 6);
        cameraLookAtPosRef.current.set(8, 2.5, 1);
        oculosTargetPosRef.current.set(8, 4.5, 1);
        break;
      case 'oceano':
        cameraTargetPosRef.current.set(0, 12, 20);
        cameraLookAtPosRef.current.set(0, -0.5, 0);
        oculosTargetPosRef.current.set(0, 5.0, 0);
        break;
      case 'cataratas':
        cameraTargetPosRef.current.set(11, 8, -3);
        cameraLookAtPosRef.current.set(10, 2, -7);
        oculosTargetPosRef.current.set(10, 5.5, -7);
        break;
      case 'kitesurf':
        cameraTargetPosRef.current.set(-12, 5, 14);
        cameraLookAtPosRef.current.set(-12, 1.8, 8);
        oculosTargetPosRef.current.set(-12, 3.5, 8);
        break;
      case 'geral':
      default:
        cameraTargetPosRef.current.set(0, 22, 30);
        cameraLookAtPosRef.current.set(0, 0, 0);
        oculosTargetPosRef.current.set(0, 8.5, 0);
        break;
    }
  };

  // CENA 3D (THREE.JS) + CATARATAS REALISTAS + KITESURF FEMININO + ÓCULOS ALINHADO
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020208);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 22, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00f0ff, 3, 100);
    mainLight.position.set(0, 25, 0);
    scene.add(mainLight);

    // 🚨 SIRENE DE LUZ PARA EMERGÊNCIA
    const luzEmergencia = new THREE.PointLight(0xff0000, 0, 100);
    luzEmergencia.position.set(0, 15, 0);
    scene.add(luzEmergencia);

    // PLANO DO OCEANO / RIO 3D
    const oceanoGeo = new THREE.PlaneGeometry(100, 100);
    const oceanoMat = new THREE.MeshStandardMaterial({
      color: 0x002244,
      emissive: 0x001122,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const oceanoMesh = new THREE.Mesh(oceanoGeo, oceanoMat);
    oceanoMesh.rotation.x = -Math.PI / 2;
    oceanoMesh.position.y = -0.5;
    scene.add(oceanoMesh);

    const gridHelper = new THREE.GridHelper(50, 50, 0x00f0ff, 0x0b0f19);
    gridHelper.position.y = -0.49;
    scene.add(gridHelper);

    // 🥽 MODELAGEM 3D DO ÓCULOS FUTURISTA (CÂMERA ULTRA MODERNA QUE ACOMPANHA SELEÇÕES)
    const oculosGroup = new THREE.Group();
    const armacaoGeo = new THREE.TorusGeometry(0.5, 0.08, 16, 32);
    const armacaoMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.9, roughness: 0.1 });
    
    const lenteEsqGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.05, 32);
    const lenteMatEsq = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
    const lenteMatDireita = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.75 });

    const olhoEsq = new THREE.Mesh(armacaoGeo, armacaoMat);
    olhoEsq.position.x = -0.6;
    const lenteEsq = new THREE.Mesh(lenteEsqGeo, lenteMatEsq);
    lenteEsq.rotation.x = Math.PI / 2;
    lenteEsq.position.x = -0.6;

    const olhoDir = new THREE.Mesh(armacaoGeo, armacaoMat);
    olhoDir.position.x = 0.6;
    const lenteDir = new THREE.Mesh(lenteEsqGeo, lenteMatDireita);
    lenteDir.rotation.x = Math.PI / 2;
    lenteDir.position.x = 0.6;

    const ponteOculosGeo = new THREE.BoxGeometry(0.4, 0.08, 0.08);
    const ponteOculosMesh = new THREE.Mesh(ponteOculosGeo, armacaoMat);

    oculosGroup.add(olhoEsq, lenteEsq, olhoDir, lenteDir, ponteOculosMesh);
    oculosGroup.position.set(0, 8.5, 0);
    oculosGroup.scale.set(1.4, 1.4, 1.4);
    scene.add(oculosGroup);
    oculosGroupRef.current = oculosGroup;

    // 🏔️🌊 CATARATAS DO IGUAÇU ULTRARREALISTAS 3D (RELEVO DE TERRA, PARQUE FLORESTAL E CACHOEIRA FLUIDA SOB A PISTA)
    const cataratasGroup = new THREE.Group();

    // 1. Montanhas 3D com Relevo em Ondulação Natural (Sobe e Desce)
    const montanhaGeo = new THREE.PlaneGeometry(12, 10, 24, 24);
    montanhaGeo.rotateX(-Math.PI / 2);
    const posAttr = montanhaGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Criação de altos e baixos para simular as montanhas reais
      const eleva = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 1.8 + Math.cos(x * 0.8) * 1.2;
      posAttr.setY(i, Math.max(0, eleva));
    }
    montanhaGeo.computeVertexNormals();

    const terraMat = new THREE.MeshStandardMaterial({
      color: 0x4a3525,
      roughness: 0.95,
      metalness: 0.1
    });
    const montanhaMesh = new THREE.Mesh(montanhaGeo, terraMat);
    montanhaMesh.position.set(10, 2.0, -10);
    cataratasGroup.add(montanhaMesh);

    // Paredão de Rocha da Encosta da Cachoeira
    const paredaoRochaGeo = new THREE.BoxGeometry(10, 4.5, 3);
    const rochaMat = new THREE.MeshStandardMaterial({ color: 0x222a35, roughness: 0.9, metalness: 0.2 });
    const paredaoRochaMesh = new THREE.Mesh(paredaoRochaGeo, rochaMat);
    paredaoRochaMesh.position.set(10, 2.25, -7.5);
    cataratasGroup.add(paredaoRochaMesh);

    // 2. Parque Florestal do Lado das Cataratas (Mata Nativa Densas Árvores 3D)
    const parqueGroup = new THREE.Group();
    const folhaMat = new THREE.MeshStandardMaterial({ color: 0x00cc44, roughness: 0.6, emissive: 0x003311, emissiveIntensity: 0.2 });
    const troncoMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });

    for (let i = 0; i < 28; i++) {
      const arvore = new THREE.Group();
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.8), troncoMat);
      tronco.position.y = 0.4;
      const copa = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 8), folhaMat);
      copa.position.y = 1.1;
      arvore.add(tronco, copa);

      const rx = (Math.random() - 0.5) * 8 + 10;
      const rz = (Math.random() - 0.5) * 6 - 11;
      arvore.position.set(rx, 3.2, rz);
      parqueGroup.add(arvore);
    }
    cataratasGroup.add(parqueGroup);

    // 3. Queda d'Água Fluida 3D em Camadas Translúcidas
    const cascataGeo = new THREE.PlaneGeometry(5, 5.2, 16, 16);
    const cascataMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const cascataMesh = new THREE.Mesh(cascataGeo, cascataMat);
    cascataMesh.position.set(10, 2.4, -6.0);
    cataratasGroup.add(cascataMesh);

    // 4. Canal Orgânico de Água Organizada Transcorrendo sob a Pista Neon
    const canalAguaGeo = new THREE.PlaneGeometry(4, 12, 16, 16);
    canalAguaGeo.rotateX(-Math.PI / 2);
    const canalAguaMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85
    });
    const canalAguaMesh = new THREE.Mesh(canalAguaGeo, canalAguaMat);
    canalAguaMesh.position.set(10, 0.02, -1);
    cataratasGroup.add(canalAguaMesh);

    // 5. Névoa e Espuma Bio-Luminescente na Base da Queda d'Água
    const espumaGroup = new THREE.Group();
    const espumaMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
    for (let e = 0; e < 6; e++) {
      const pEspuma = new THREE.Mesh(new THREE.SphereGeometry(0.8 + Math.random() * 0.4, 12, 12), espumaMat);
      pEspuma.position.set(8.5 + e * 0.6, 0.2, -5.8 + (e % 2) * 0.3);
      espumaGroup.add(pEspuma);
    }
    cataratasGroup.add(espumaGroup);

    scene.add(cataratasGroup);

    // 🏄‍♀️ KITESURF 3D REALISTA COM AVATAR FEMININO (MELHOR VISUALIZAÇÃO E POSIÇÃO DESTACADA)
    const kitesurfGroup = new THREE.Group();

    // Prancha Hidrodinâmica
    const pranchaGeo = new THREE.BoxGeometry(0.8, 0.1, 2.0);
    const pranchaMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.5, roughness: 0.2 });
    const pranchaMesh = new THREE.Mesh(pranchaGeo, pranchaMat);
    pranchaMesh.position.set(-12, 0.1, 8);
    pranchaMesh.rotation.x = -0.12; // Leve elevação nas ondas
    kitesurfGroup.add(pranchaMesh);

    // Avatar Feminino Modelado
    const corpoFemMat = new THREE.MeshStandardMaterial({ color: 0xff007f, roughness: 0.3, metalness: 0.3 });
    const peleFemMat = new THREE.MeshStandardMaterial({ color: 0xf5d0c5, roughness: 0.5 });
    const cabeloFemMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });

    // Tronco
    const corpoFemGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.9, 16);
    const corpoFemMesh = new THREE.Mesh(corpoFemGeo, corpoFemMat);
    corpoFemMesh.position.set(-12, 0.65, 8);
    kitesurfGroup.add(corpoFemMesh);

    // Cabeça & Cabelo
    const cabecaFemGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const cabecaFemMesh = new THREE.Mesh(cabecaFemGeo, peleFemMat);
    cabecaFemMesh.position.set(-12, 1.2, 8);
    kitesurfGroup.add(cabecaFemMesh);

    const cabeloFemGeo = new THREE.SphereGeometry(0.23, 12, 12);
    cabeloFemGeo.scale(1, 1, 1.3);
    const cabeloFemMesh = new THREE.Mesh(cabeloFemGeo, cabeloFemMat);
    cabeloFemMesh.position.set(-12, 1.23, 7.9);
    kitesurfGroup.add(cabeloFemMesh);

    // Pipa Acrobática de Kitesurf em Arco Animado
    const pipaGeo = new THREE.TorusGeometry(1.8, 0.2, 8, 24, Math.PI);
    const pipaMat = new THREE.MeshBasicMaterial({ color: 0xff007f, side: THREE.DoubleSide });
    const pipaMesh = new THREE.Mesh(pipaGeo, pipaMat);
    pipaMesh.position.set(-12, 5.2, 6.5);
    pipaMesh.rotation.x = Math.PI / 3;
    kitesurfGroup.add(pipaMesh);

    // Cabo de Tração
    const linhaMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    const linhaEsqGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-12, 0.8, 8),
      new THREE.Vector3(-13.5, 5.2, 6.5)
    ]);
    const linhaDirGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-12, 0.8, 8),
      new THREE.Vector3(-10.5, 5.2, 6.5)
    ]);
    kitesurfGroup.add(new THREE.Line(linhaEsqGeo, linhaMat));
    kitesurfGroup.add(new THREE.Line(linhaDirGeo, linhaMat));

    // Luz de Destaque no Avatar do Kitesurf
    const kiteSpotLight = new THREE.PointLight(0xff007f, 2, 15);
    kiteSpotLight.position.set(-12, 4, 9);
    kitesurfGroup.add(kiteSpotLight);

    scene.add(kitesurfGroup);

    // 💨 PARQUE EÓLICO FUTURISTA
    const heliceMeshes = [];
    for (let i = -10; i <= -6; i += 4) {
      const torreGeo = new THREE.CylinderGeometry(0.1, 0.25, 6);
      const torreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
      const torreMesh = new THREE.Mesh(torreGeo, torreMat);
      torreMesh.position.set(i, 3, -8);
      scene.add(torreMesh);

      const heliceGeo = new THREE.BoxGeometry(2.5, 0.15, 0.05);
      const heliceMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.5 });
      const heliceMesh = new THREE.Mesh(heliceGeo, heliceMat);
      heliceMesh.position.set(i, 6, -8);
      scene.add(heliceMesh);
      heliceMeshes.push(heliceMesh);
    }

    // 📡 TORRES E ANTENAS 5G/6G NEON
    const torre5GGeo = new THREE.CylinderGeometry(0.1, 0.3, 8);
    const torre5GMat = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 0.7 });
    const torre5GMesh = new THREE.Mesh(torre5GGeo, torre5GMat);
    torre5GMesh.position.set(-8, 4, -5);
    scene.add(torre5GMesh);

    // 🌳 ÁRVORES FUTURISTAS NEON
    for (let x = -4; x <= 4; x += 2) {
      const troncoGeo = new THREE.CylinderGeometry(0.1, 0.15, 1);
      const troncoMat = new THREE.MeshStandardMaterial({ color: 0x553311 });
      const troncoMesh = new THREE.Mesh(troncoGeo, troncoMat);
      troncoMesh.position.set(x, 0.5, 2.5);
      scene.add(troncoMesh);

      const copaGeo = new THREE.ConeGeometry(0.6, 1.2, 8);
      const copaMat = new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 0.4 });
      const copaMesh = new THREE.Mesh(copaGeo, copaMat);
      copaMesh.position.set(x, 1.4, 2.5);
      scene.add(copaMesh);
    }

    // PONTE FUTURISTA (PISTA ELEVADA SOBRE O CANAL DAS CATARATAS)
    const ponteBaseGeo = new THREE.BoxGeometry(32, 0.4, 4);
    const ponteBaseMat = new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.8 });
    const ponteMesh = new THREE.Mesh(ponteBaseGeo, ponteBaseMat);
    ponteMesh.position.set(0, 0.2, 0);
    scene.add(ponteMesh);

    for (let i = -12; i <= 12; i += 6) {
      const arcoGeo = new THREE.TorusGeometry(2, 0.1, 16, 32, Math.PI);
      const arcoMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8 });
      const arcoMesh = new THREE.Mesh(arcoGeo, arcoMat);
      arcoMesh.position.set(i, 0.2, 0);
      arcoMesh.rotation.y = Math.PI / 2;
      scene.add(arcoMesh);
    }

    // PISTA NEON TRON
    const pistaGeo = new THREE.RingGeometry(11, 12, 64);
    const pistaMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6, side: THREE.DoubleSide });
    const pistaMesh = new THREE.Mesh(pistaGeo, pistaMat);
    pistaMesh.rotation.x = Math.PI / 2;
    pistaMesh.position.y = 0.05;
    scene.add(pistaMesh);

    // NÚCLEO CENTRAL
    const centroGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const centroMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, roughness: 0.1 });
    const centroMesh = new THREE.Mesh(centroGeo, centroMat);
    centroMesh.position.set(0, 6, 0);
    scene.add(centroMesh);

    // 🤖 AVATAR ROBOTOC HUMANOIDE 3D INTEGRADO NO MAPA
    const avatarGroup = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.4, metalness: 0.1 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.9, emissive: 0x00f0ff, emissiveIntensity: 0.2 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.9 });

    const headGeo = new THREE.SphereGeometry(0.42, 32, 32); headGeo.scale(1, 1.25, 1);
    const headMesh = new THREE.Mesh(headGeo, skinMat); headMesh.position.set(0, 2.3, 0); avatarGroup.add(headMesh);
    const hairGeo = new THREE.SphereGeometry(0.45, 16, 16); hairGeo.scale(1.02, 0.9, 1.05);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat); hairMesh.position.set(0, 2.45, -0.05); avatarGroup.add(hairMesh);
    const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat); leftEye.position.set(-0.14, 2.32, 0.38); avatarGroup.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat); rightEye.position.set(0.14, 2.32, 0.38); avatarGroup.add(rightEye);
    const neckGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.3, 16);
    const neckMesh = new THREE.Mesh(neckGeo, suitMat); neckMesh.position.set(0, 1.95, 0); avatarGroup.add(neckMesh);
    const chestGeo = new THREE.BoxGeometry(0.9, 0.8, 0.5);
    const chestMesh = new THREE.Mesh(chestGeo, suitMat); chestMesh.position.set(0, 1.45, 0); avatarGroup.add(chestMesh);
    const plateGeo = new THREE.BoxGeometry(0.7, 0.5, 0.08);
    const plateMesh = new THREE.Mesh(plateGeo, armorMat); plateMesh.position.set(0, 1.5, 0.24); avatarGroup.add(plateMesh);

    // 🚨 GIROFLEX / SIRENE DE CABEÇA PARA ROBOTOC MODO EMERGÊNCIA
    const giroflesGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    const giroflesMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const giroflesMesh = new THREE.Mesh(giroflesGeo, giroflesMat);
    giroflesMesh.position.set(0, 2.85, 0);
    avatarGroup.add(giroflesMesh);

    avatarGroup.position.set(-10, 2, 0);
    avatarGroup.scale.set(1.5, 1.5, 1.5);
    scene.add(avatarGroup);
    avatarGroupRef.current = avatarGroup;

    // 🚑 AMBULÂNCIA 3D FUTURISTA DE EMERGÊNCIA
    const ambulanciaGroup = new THREE.Group();
    const ambChassiGeo = new THREE.BoxGeometry(1.2, 0.8, 2.2);
    const ambChassiMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.5 });
    const ambChassiMesh = new THREE.Mesh(ambChassiGeo, ambChassiMat);
    ambChassiMesh.position.y = 0.5;
    ambulanciaGroup.add(ambChassiMesh);

    const faixaGeo = new THREE.BoxGeometry(1.22, 0.2, 2.22);
    const faixaMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const faixaMesh = new THREE.Mesh(faixaGeo, faixaMat);
    faixaMesh.position.y = 0.5;
    ambulanciaGroup.add(faixaMesh);

    const ambGiroGeo = new THREE.BoxGeometry(0.4, 0.15, 0.2);
    const ambGiroMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ambGiroMesh = new THREE.Mesh(ambGiroGeo, ambGiroMat);
    ambGiroMesh.position.set(0, 1.0, 0);
    ambulanciaGroup.add(ambGiroMesh);

    ambulanciaGroup.position.set(0, 0.3, 11.5);
    scene.add(ambulanciaGroup);

    // ESFERAS DE LINKS 3D ÓRBITA DO NÚCLEO
    const linksGroup = new THREE.Group();
    esferasLinks3DRef.current = [];
    links3D.forEach((linkItem) => {
      const orbGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const colorHex = linkItem.nuvem === 'google' ? 0x4285f4 : linkItem.nuvem === 'apple' ? 0xffffff : linkItem.nuvem === 'microsoft' ? 0x00a4ef : 0xff007f;
      const orbMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.85 });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.userData = { url: linkItem.url, titulo: linkItem.titulo };
      linksGroup.add(orbMesh);
      esferasLinks3DRef.current.push(orbMesh);
    });
    scene.add(linksGroup);

    const objetosInterativos = [];
    const dadosFluxoParticulas = [];

    estabelecimentos.forEach((est) => {
      const geometry = new THREE.BoxGeometry(2, est.posicao.y * 2, 2);
      const material = new THREE.MeshStandardMaterial({ color: est.cor, roughness: 0.1, metalness: 0.8 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(est.posicao.x, est.posicao.y, est.posicao.z);
      mesh.userData = est;
      scene.add(mesh);
      objetosInterativos.push(mesh);

      const materialLinha = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 });
      const pontos = [new THREE.Vector3(est.posicao.x, est.posicao.y * 2, est.posicao.z), new THREE.Vector3(0, 6, 0)];
      const geometriaLinha = new THREE.BufferGeometry().setFromPoints(pontos);
      const linhaChakra = new THREE.Line(geometriaLinha, materialLinha);
      scene.add(linhaChakra);

      const partGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const partMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const particula = new THREE.Mesh(partGeo, partMat);
      scene.add(particula);

      dadosFluxoParticulas.push({
        mesh: particula,
        inicio: new THREE.Vector3(est.posicao.x, est.posicao.y * 2, est.posicao.z),
        fim: new THREE.Vector3(0, 6, 0),
        progresso: Math.random()
      });
    });

    // VEÍCULOS AUTÔNOMOS
    const carGeo = new THREE.BoxGeometry(0.8, 0.4, 1.2);
    const carMat1 = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.5 });
    const carMat2 = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.5 });
    const veiculo1 = new THREE.Mesh(carGeo, carMat1);
    const veiculo2 = new THREE.Mesh(carGeo, carMat2);
    veiculo1.position.set(0, 0.3, 11.5);
    veiculo2.position.set(0, 0.3, -11.5);
    scene.add(veiculo1);
    scene.add(veiculo2);

    let anguloV1 = 0;
    let anguloV2 = Math.PI;
    let anguloAmb = Math.PI / 2;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersectsOrbs = raycaster.intersectObjects(esferasLinks3DRef.current);
      const intersectsAvatar = avatarGroupRef.current ? raycaster.intersectObjects(avatarGroupRef.current.children, true) : [];
      const intersectsPredios = raycaster.intersectObjects(objetosInterativos);

      if (intersectsOrbs.length > 0) {
        const hitOrb = intersectsOrbs[0].object;
        if (hitOrb.userData && hitOrb.userData.url) {
          abrirLinkExternoSeguro(hitOrb.userData.url, hitOrb.userData.titulo);
        }
      } else if (intersectsAvatar.length > 0) {
        setArquiteturaAberta(true);
        setMostrarOverlayRobotoc(false);
      } else if (intersectsPredios.length > 0) {
        const local = intersectsPredios[0].object.userData;
        setLocalSelecionado(local);

        // Zoom automático e Alinhamento Preciso do Óculos 3D no Local Selecionado
        cameraTargetPosRef.current.set(local.posicao.x + 3, local.posicao.y + 4, local.posicao.z + 6);
        cameraLookAtPosRef.current.set(local.posicao.x, local.posicao.y, local.posicao.z);
        oculosTargetPosRef.current.set(local.posicao.x, local.posicao.y + 2.5, local.posicao.z);
      }
    };

    window.addEventListener('click', handleMouseClick);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      scene.rotation.y += 0.0008;

      // Movimentação fluida da Câmera & Óculos 3D perfeitamente centralizados
      camera.position.lerp(cameraTargetPosRef.current, 0.04);
      currentCameraLookAtRef.current.lerp(cameraLookAtPosRef.current, 0.04);
      camera.lookAt(currentCameraLookAtRef.current);

      if (oculosGroupRef.current) {
        oculosGroupRef.current.position.lerp(oculosTargetPosRef.current, 0.05);
        oculosGroupRef.current.position.y += Math.sin(elapsedTime * 2) * 0.02;
        oculosGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.8) * 0.2;
      }

      // Animação das Cataratas e do Fluxo do Canal
      cascataMesh.position.y = 2.4 + Math.sin(elapsedTime * 4) * 0.05;
      canalAguaMesh.position.z = -1 + Math.sin(elapsedTime * 2) * 0.1;
      espumaGroup.children.forEach((esp, idx) => {
        esp.scale.setScalar(1 + Math.sin(elapsedTime * 3 + idx) * 0.15);
      });

      // Animação do Kitesurf Feminino
      kitesurfGroup.position.y = Math.sin(elapsedTime * 2.5) * 0.12;
      pipaMesh.rotation.z = Math.sin(elapsedTime * 1.8) * 0.15;

      heliceMeshes.forEach(h => {
        h.rotation.z += 0.05;
      });

      esferasLinks3DRef.current.forEach((mesh, index) => {
        const angle = elapsedTime * 0.8 + (index * (Math.PI * 2 / esferasLinks3DRef.current.length));
        const radius = 3.5;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.position.y = 6 + Math.sin(elapsedTime * 2 + index) * 0.5;
      });

      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.2;

        if (modoEmergencia) {
          giroflesMat.color.setHex((Math.floor(elapsedTime * 8) % 2 === 0) ? 0xff0000 : 0x0000ff);
          luzEmergencia.intensity = (Math.floor(elapsedTime * 8) % 2 === 0) ? 8 : 0;
          armorMat.emissive.setHex(0xff0000);
          armorMat.color.setHex(0xff0000);
          eyeMat.emissive.setHex(0xff0000);
        } else {
          giroflesMat.color.setHex(0x00f0ff);
          luzEmergencia.intensity = 0;
          armorMat.emissive.setHex(0x00f0ff);
          armorMat.color.setHex(0x00f0ff);
          eyeMat.emissive.setHex(0x00f0ff);
        }
      }

      const velocidadeAmb = modoEmergencia ? 0.04 : 0.015;
      anguloAmb += velocidadeAmb;
      const raioAmb = 11.5;
      ambulanciaGroup.position.x = Math.cos(anguloAmb) * raioAmb;
      ambulanciaGroup.position.z = Math.sin(anguloAmb) * raioAmb;
      ambulanciaGroup.rotation.y = -anguloAmb;
      ambGiroMat.color.setHex((Math.floor(elapsedTime * 10) % 2 === 0) ? 0xff0000 : 0x00f0ff);

      dadosFluxoParticulas.forEach((p) => {
        p.progresso += 0.007;
        if (p.progresso > 1) p.progresso = 0;
        p.mesh.position.lerpVectors(p.inicio, p.fim, p.progresso);
      });

      anguloV1 += 0.015;
      anguloV2 += 0.012;
      const raio = 11.5;

      veiculo1.position.x = Math.cos(anguloV1) * raio;
      veiculo1.position.z = Math.sin(anguloV1) * raio;
      veiculo1.rotation.y = -anguloV1;

      veiculo2.position.x = Math.cos(anguloV2) * raio;
      veiculo2.position.z = Math.sin(anguloV2) * raio;
      veiculo2.rotation.y = -anguloV2;

      if (veiculo1.position.distanceTo(veiculo2.position) < 4.5) {
        setAlertaAbalroamento(true);
      } else {
        setAlertaAbalroamento(false);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [links3D, modoEmergencia]);

  const adicionarTarefa = (e) => {
    e.preventDefault();
    if (!novaTarefa) return;
    setListaTarefas([...listaTarefas, { id: Date.now(), texto: novaTarefa, horario: 'Agora', status: 'Agendado' }]);
    setNovaTarefa('');
  };

  const gerarLinkOnline = () => {
    const idUnico = Math.random().toString(36).substring(2, 8);
    setLinkGerado(`https://emanuel-os-cloud.vercel.app/share/${idUnico}`);
  };

  const selecionarLocalPesquisado = (item) => {
    setLocalSelecionado({
      nome: item.display_name.split(',')[0],
      categoria: `🌐 Módulo Pesquisa Gemini AI (${filtroCategoria.toUpperCase()})`,
      ipCriptografado: `LAT: ${parseFloat(item.lat).toFixed(4)} | LON: ${parseFloat(item.lon).toFixed(4)}`,
      tipo: 'oceano'
    });
    setTermoBusca('');
    setSugestoesBusca([]);
    setIsBarraFluidaOpen(false);

    // Zoom e Óculos alinhados no local pesquisado
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    cameraTargetPosRef.current.set((lon % 10), 6, (lat % 10) + 5);
    cameraLookAtPosRef.current.set(lon % 10, 0, lat % 10);
    oculosTargetPosRef.current.set(lon % 10, 3.5, lat % 10);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', overflow: 'hidden', position: 'relative', fontFamily: '"Segoe UI", sans-serif' }}>
      <Head>
        <title>Emanuel.OS - Pesquisa Gemini AI, ROBOTOC Data Center & Conectividade 3D</title>
      </Head>

      {/* CABEÇALHO */}
      <header style={{ position: 'absolute', top: '15px', left: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '18px', margin: 0, color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>
          ✨ EMANUEL.OS <span style={{ color: '#00f0ff' }}>MAPA TERRESTRE & ECO-CIDADE</span>
        </h1>
        <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold' }}>
          ROBOTOC Data Center 3D, Oceanos, Universidade, Nuclear, 5G/6G, Hidrelétrica, Eólica, Painéis Solares, Cataratas Realistas & Kitesurf Feminino
        </span>
      </header>

      {/* 🧭 BARRA DE AÇÕES SUPERIOR (ORGANIZADA & ESTILO COPILOT COM CÂMERA ZOOM) */}
      <div style={{ position: 'absolute', top: '15px', right: '30px', zIndex: 30, display: 'flex', gap: '8px', alignItems: 'center' }}>
        
        {/* 🥽 BOTÃO ÓCULOS CAMERA ZOOM 3D */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuZoomAberto(!menuZoomAberto)}
            style={{
              padding: '8px 14px',
              backgroundColor: 'rgba(0, 240, 255, 0.2)',
              color: '#00f0ff',
              border: '1px solid #00f0ff',
              borderRadius: '15px',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 15px rgba(0,240,255,0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            🥽 Câmera Zoom 3D {menuZoomAberto ? '▲' : '▼'}
          </button>

          {/* MENU DE PONTOS DE ZOOM */}
          {menuZoomAberto && (
            <div style={{
              position: 'absolute', top: '40px', right: 0,
              backgroundColor: 'rgba(7, 12, 28, 0.98)', border: '1px solid #00f0ff',
              borderRadius: '16px', padding: '10px', width: '220px',
              display: 'flex', flexDirection: 'column', gap: '5px',
              boxShadow: '0 10px 30px rgba(0, 240, 255, 0.4)', backdropFilter: 'blur(20px)',
              zIndex: 100, maxHeight: '300px', overflowY: 'auto'
            }}>
              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', padding: '0 4px' }}>
                LOCALIZADORES DE ZOOM 3D
              </span>
              <button onClick={() => aplicarZoomCamera('geral')} style={{ padding: '6px 8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>🌐 Visão Geral do Mapa</button>
              <button onClick={() => aplicarZoomCamera('robotoc')} style={{ padding: '6px 8px', backgroundColor: 'rgba(0,240,255,0.1)', color: '#00f0ff', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>🤖 ROBOTOC Avatar 3D</button>
              <button onClick={() => aplicarZoomCamera('ambulancia')} style={{ padding: '6px 8px', backgroundColor: 'rgba(255,0,0,0.15)', color: '#ff4d4d', border: '1px solid #ff0000', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>🚑 Ambulância 3D</button>
              <button onClick={() => aplicarZoomCamera('veiculos')} style={{ padding: '6px 8px', backgroundColor: 'rgba(255,0,170,0.1)', color: '#ff00aa', border: '1px solid #ff00aa', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>🏎️ Pista & Veículos Autônomos</button>
              <button onClick={() => aplicarZoomCamera('nuclear')} style={{ padding: '6px 8px', backgroundColor: 'rgba(0,255,204,0.1)', color: '#00ffcc', border: '1px solid #00ffcc', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>⚛️ Usina Nuclear</button>
              <button onClick={() => aplicarZoomCamera('5g')} style={{ padding: '6px 8px', backgroundColor: 'rgba(170,0,255,0.1)', color: '#aa00ff', border: '1px solid #aa00ff', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>📡 Torres 5G / 6G</button>
              <button onClick={() => aplicarZoomCamera('eolica')} style={{ padding: '6px 8px', backgroundColor: 'rgba(0,240,255,0.1)', color: '#00f0ff', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>💨 Parque Eólico</button>
              <button onClick={() => aplicarZoomCamera('solar')} style={{ padding: '6px 8px', backgroundColor: 'rgba(255,170,0,0.1)', color: '#ffaa00', border: '1px solid #ffaa00', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>☀️ Painéis Solares</button>
              <button onClick={() => aplicarZoomCamera('hidro')} style={{ padding: '6px 8px', backgroundColor: 'rgba(0,102,255,0.1)', color: '#0066ff', border: '1px solid #0066ff', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>💧 Usina Hidrelétrica</button>
              <button onClick={() => aplicarZoomCamera('cataratas')} style={{ padding: '6px 8px', backgroundColor: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid #00e5ff', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>🌊 Cataratas Iguaçu Realistas 3D</button>
              <button onClick={() => aplicarZoomCamera('kitesurf')} style={{ padding: '6px 8px', backgroundColor: 'rgba(255,0,127,0.1)', color: '#ff007f', border: '1px solid #ff007f', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>🏄‍♀️ Kitesurf Avatar Feminino</button>
              <button onClick={() => aplicarZoomCamera('oceano')} style={{ padding: '6px 8px', backgroundColor: 'rgba(0,170,255,0.1)', color: '#00aaff', border: '1px solid #00aaff', borderRadius: '8px', fontSize: '10px', textAlign: 'left', cursor: 'pointer' }}>🌊 Plano Fluvial & Oceanos</button>
            </div>
          )}
        </div>

        {/* BOTÃO DE EMERGÊNCIA MANIPULÁVEL */}
        <button
          onClick={alternarModoEmergencia}
          style={{
            padding: '8px 14px',
            backgroundColor: modoEmergencia ? '#ff0000' : 'rgba(255, 0, 0, 0.25)',
            color: '#fff',
            border: '2px solid #ff0000',
            borderRadius: '15px',
            fontWeight: 'bold',
            fontSize: '11px',
            cursor: 'pointer',
            boxShadow: modoEmergencia ? '0 0 25px #ff0000' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          🚨 {modoEmergencia ? 'DESATIVAR EMERGÊNCIA' : 'ACIONAR EMERGÊNCIA'}
        </button>

        {/* 🛠️ BOTÃO DE UTILITÁRIOS (MENU ESTILO COPILOT FLYOUT) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuUtilitariosAberto(!menuUtilitariosAberto)}
            style={{
              padding: '8px 16px',
              backgroundColor: menuUtilitariosAberto ? '#00f0ff' : 'rgba(0, 240, 255, 0.15)',
              color: menuUtilitariosAberto ? '#000' : '#00f0ff',
              border: '1px solid #00f0ff',
              borderRadius: '15px',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            ⚡ Utilitários {menuUtilitariosAberto ? '▲' : '▼'}
          </button>

          {/* PAINEL SUSPENSO ESTILO COPILOT */}
          {menuUtilitariosAberto && (
            <div style={{
              position: 'absolute', top: '40px', right: 0,
              backgroundColor: 'rgba(7, 12, 28, 0.98)', border: '1px solid #00f0ff',
              borderRadius: '16px', padding: '10px', width: '210px',
              display: 'flex', flexDirection: 'column', gap: '6px',
              boxShadow: '0 10px 30px rgba(0, 240, 255, 0.3)', backdropFilter: 'blur(20px)',
              zIndex: 100
            }}>
              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', padding: '0 6px', letterSpacing: '0.5px' }}>
                FERRAMENTAS AGI
              </span>

              <button
                onClick={() => { setMostrarOverlayRobotoc(!mostrarOverlayRobotoc); setMenuUtilitariosAberto(false); }}
                style={{ padding: '8px 10px', backgroundColor: 'rgba(0, 240, 255, 0.1)', color: '#fff', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}
              >
                🤖 ROBOTOC HUD
              </button>

              <button
                onClick={() => { setAbaAtiva('agenda'); setMenuUtilitariosAberto(false); }}
                style={{ padding: '8px 10px', backgroundColor: 'rgba(0, 240, 255, 0.1)', color: '#fff', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}
              >
                📅 Agenda IA
              </button>

              <button
                onClick={() => { setAbaAtiva('link'); setMenuUtilitariosAberto(false); }}
                style={{ padding: '8px 10px', backgroundColor: 'rgba(255, 0, 170, 0.1)', color: '#fff', border: '1px solid rgba(255, 0, 170, 0.3)', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}
              >
                🔗 Link Cloud
              </button>

              <a
                href="/espacial"
                style={{ padding: '8px 10px', backgroundColor: 'rgba(255, 0, 85, 0.15)', color: '#ff0055', border: '1px solid rgba(255, 0, 85, 0.4)', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', display: 'block' }}
              >
                🚀 Mapa Espacial
              </a>
            </div>
          )}
        </div>

        {/* BOTÃO HOME CORE */}
        <a href="/" style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '15px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
          🏠 Core
        </a>
      </div>

      {/* 🚨 BANNER DE OCORRÊNCIA DE EMERGÊNCIA DA CIDADE 🚨 */}
      {modoEmergencia && detalhesOcorrencia && (
        <div style={{
          position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.9)', border: '2px solid #ffffff',
          borderRadius: '20px', padding: '10px 25px', color: '#fff', zIndex: 200,
          boxShadow: '0 0 40px #ff0000', textAlign: 'center', backdropFilter: 'blur(15px)'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '900', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {detalhesOcorrencia.tipo} (PROTOCOLO: {detalhesOcorrencia.protocolo})
          </span>
          <span style={{ fontSize: '10px', display: 'block', marginTop: '2px' }}>
            {detalhesOcorrencia.descricao} — Horário: {detalhesOcorrencia.horario}
          </span>
        </div>
      )}

      {/* 🚨 ALERTA IA ANTI-ABALROAMENTO */}
      {alertaAbalroamento && (
        <div style={{
          position: 'absolute', top: '135px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 85, 0.25)', border: '2px solid #ff0055',
          borderRadius: '30px', padding: '8px 20px', backdropFilter: 'blur(10px)',
          boxShadow: '0 0 30px #ff0055', zIndex: 30
        }}>
          <span style={{ fontSize: '11px', color: '#ff0055', fontWeight: 'bold' }}>
            ⚠️ IA ANTI-ABALROAMENTO: COLISÃO DETECTADA E PREVENIDA NA PONTE!
          </span>
        </div>
      )}

      {/* 🌟 BARRA FLUIDA SUPERIOR RETRÁTIL */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '90%', maxWidth: '620px' }}>
        
        {/* Puxador Visível */}
        <div 
          onClick={() => setIsBarraFluidaOpen(!isBarraFluidaOpen)}
          style={{
            backgroundColor: 'rgba(7, 12, 28, 0.95)',
            backdropFilter: 'blur(15px)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            border: '1px solid #00f0ff',
            borderTop: 'none',
            padding: '8px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            color: '#00f0ff',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(0,240,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>{isBarraFluidaOpen ? '▲ Recolher Painel de Pesquisa Terrestre' : '▼ Puxe para Baixo (Pesquisa Gemini AI & Filtros)'}</span>
        </div>

        {/* Conteúdo Oculto do Painel */}
        {isBarraFluidaOpen && (
          <div style={{
            backgroundColor: 'rgba(7, 12, 28, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '16px',
            borderRadius: '18px',
            border: '1px solid rgba(0, 240, 255, 0.5)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            marginTop: '6px'
          }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="🔍 Pesquisa Gemini AI (Mares, 5G, Nuclear, Cataratas, Kitesurf, Eólica, Solar)..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  backgroundColor: '#09090b',
                  border: '1px solid #00f0ff',
                  borderRadius: '20px',
                  color: '#fff',
                  fontSize: '11px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {carregandoBusca && (
                <span style={{ position: 'absolute', right: '15px', top: '12px', fontSize: '10px', color: '#00f0ff' }}>⚡</span>
              )}
            </div>

            {/* BOTOES DE FILTROS RÁPIDOS */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setFiltroCategoria('oceano'); aplicarZoomCamera('oceano'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00f0ff', background: filtroCategoria === 'oceano' ? '#00f0ff' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'oceano' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🌊 Oceanos/Rios</button>
              <button onClick={() => { setFiltroCategoria('cataratas'); aplicarZoomCamera('cataratas'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00e5ff', background: filtroCategoria === 'cataratas' ? '#00e5ff' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'cataratas' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🌊 Cataratas Iguaçu</button>
              <button onClick={() => { setFiltroCategoria('kitesurf'); aplicarZoomCamera('kitesurf'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #ff007f', background: filtroCategoria === 'kitesurf' ? '#ff007f' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'kitesurf' ? '#fff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🏄‍♀️ Kitesurf Feminino</button>
              <button onClick={() => { setFiltroCategoria('especies'); aplicarZoomCamera('geral'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00ff66', background: filtroCategoria === 'especies' ? '#00ff66' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'especies' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🐠 Espécies & Remédios</button>
              <button onClick={() => { setFiltroCategoria('nuclear'); aplicarZoomCamera('nuclear'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00ffcc', background: filtroCategoria === 'nuclear' ? '#00ffcc' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'nuclear' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>⚛️ Energia Nuclear</button>
              <button onClick={() => { setFiltroCategoria('5g'); aplicarZoomCamera('5g'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #aa00ff', background: filtroCategoria === '5g' ? '#aa00ff' : 'rgba(0,0,0,0.5)', color: filtroCategoria === '5g' ? '#fff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>📡 Torres 5G/6G</button>
              <button onClick={() => { setFiltroCategoria('hidro'); aplicarZoomCamera('hidro'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #0066ff', background: filtroCategoria === 'hidro' ? '#0066ff' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'hidro' ? '#fff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>💧 Hidrelétrica</button>
              <button onClick={() => { setFiltroCategoria('eolica'); aplicarZoomCamera('eolica'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00f0ff', background: filtroCategoria === 'eolica' ? '#00f0ff' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'eolica' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>💨 Parque Eólico</button>
              <button onClick={() => { setFiltroCategoria('solar'); aplicarZoomCamera('solar'); }} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #ffaa00', background: filtroCategoria === 'solar' ? '#ffaa00' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'solar' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>☀️ Painéis Solares</button>
            </div>

            {/* SUGESTÕES DE BUSCA */}
            {sugestoesBusca.length > 0 && (
              <ul style={{
                listStyle: 'none', margin: '10px 0 0 0', padding: '8px',
                backgroundColor: '#09090b', border: '1px solid rgba(0, 240, 255, 0.5)',
                borderRadius: '12px', maxHeight: '180px', overflowY: 'auto'
              }}>
                {sugestoesBusca.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => selecionarLocalPesquisado(item)}
                    style={{
                      padding: '8px', fontSize: '11px', color: '#e4e4e7',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer'
                    }}
                  >
                    📍 <b>{item.display_name}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* RELÓGIO & STATUS */}
      <div style={{ position: 'absolute', top: '80px', left: '30px', zIndex: 15, backgroundColor: 'rgba(7, 12, 28, 0.85)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(15px)', width: '280px', color: '#fff' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00f0ff', marginBottom: '4px' }}>
          📅 {tempoAtual ? tempoAtual.toLocaleDateString('pt-BR') : 'Carregando...'} - 🕒 {tempoAtual ? tempoAtual.toLocaleTimeString('pt-BR') : '--:--:--'}
        </div>
        <div style={{ fontSize: '10px', color: '#e4e4e7', marginBottom: '6px' }}>
          {dadosClima.condicao} | 🌡️ {dadosClima.temperatura}
        </div>
        <div style={{ fontSize: '9px', color: '#00ff66', backgroundColor: 'rgba(0,255,102,0.1)', padding: '6px', borderRadius: '6px', border: '1px solid rgba(0,255,102,0.3)', fontWeight: 'bold' }}>
          {dadosClima.alertaPreservacao}
        </div>
      </div>

      {/* OVERLAY DE INTERAÇÃO DO ROBOTOC TERRESTRE */}
      {mostrarOverlayRobotoc && (
        <div className="quantum-browser-widget" style={{
          position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)', zIndex: 150,
          backgroundColor: 'rgba(8, 15, 30, 0.95)', backdropFilter: 'blur(25px)',
          border: '2px solid #00f0ff', borderRadius: '20px', padding: '16px',
          width: 'calc(100% - 30px)', maxWidth: '580px', boxShadow: '0 0 45px rgba(0, 240, 255, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxSizing: 'border-box', color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '12px', color: '#00f0ff', fontWeight: '900', letterSpacing: '1px' }}>
                  PENSAMENTO ROBOTOC MAPA TERRESTRE & NUVEM
                </h3>
                <span style={{ fontSize: '8px', color: '#a1a1aa' }}>Emanuel.OS Multicloud Vault & Quantum Browser</span>
              </div>
            </div>

            <button onClick={() => setMostrarOverlayRobotoc(false)} style={{ background: 'none', border: 'none', color: '#00f0ff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', background: 'rgba(2, 6, 23, 0.8)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.2)' }}>
            <button onClick={() => setNuvemSelecionada('google')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'google' ? '#4285f4' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌐 Google Drive</button>
            <button onClick={() => setNuvemSelecionada('apple')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'apple' ? '#ffffff' : 'transparent', color: nuvemSelecionada === 'apple' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🍏 Apple iCloud</button>
            <button onClick={() => setNuvemSelecionada('microsoft')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'microsoft' ? '#00a4ef' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🪟 OneDrive</button>
            <button onClick={() => setNuvemSelecionada('custom')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'custom' ? '#ff007f' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌌 Vault 3D</button>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.2)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>NUVEM ATIVA: {nuvemSelecionada.toUpperCase()}</span>
              <span style={{ fontSize: '10px', color: '#fff' }}>Conta: {statusNuvem[nuvemSelecionada].conta}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '9px', color: '#4ade80', fontWeight: 'bold', display: 'block' }}>STATUS: ONLINE</span>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>Espaço: {statusNuvem[nuvemSelecionada].espaco}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', background: '#020617', padding: '4px', borderRadius: '10px', border: '1px solid rgba(0,240,255,0.2)' }}>
            <button onClick={() => setAbaOverlayAtiva('browser')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: abaOverlayAtiva === 'browser' ? '#00f0ff' : 'transparent', color: abaOverlayAtiva === 'browser' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🌐 Quantum Browser</button>
            <button onClick={() => setAbaOverlayAtiva('nuvem')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: abaOverlayAtiva === 'nuvem' ? '#a855f7' : 'transparent', color: abaOverlayAtiva === 'nuvem' ? '#fff' : '#a855f7', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🔗 Links 3D & Mídias</button>
          </div>

          {abaOverlayAtiva === 'browser' && (
            <div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '10px' }}>
                <select value={motorBuscaSelecionado} onChange={(e) => setMotorBuscaSelecionado(e.target.value)} style={{ backgroundColor: '#09090b', border: '1px solid #00f0ff', color: '#00f0ff', padding: '6px', borderRadius: '8px', fontSize: '10px', outline: 'none' }}>
                  <option value="google">Google</option>
                  <option value="bing">Bing</option>
                  <option value="duckduckgo">DuckDuckGo</option>
                </select>

                <input
                  type="text"
                  value={urlOuTermoNavegador}
                  onChange={(e) => setUrlOuTermoNavegador(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') executarNavegacaoBrowser(urlOuTermoNavegador); }}
                  placeholder="Pesquisar qualquer assunto no Mapa Terrestre..."
                  style={{ backgroundColor: '#020617', border: '1px solid #00f0ff', borderRadius: '10px', padding: '6px 10px', color: '#00f0ff', fontSize: '11px', outline: 'none', flexGrow: 1, fontFamily: 'monospace' }}
                />

                <button onClick={() => executarNavegacaoBrowser(urlOuTermoNavegador)} style={{ padding: '6px 12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Ir ➔</button>
              </div>

              <div style={{ backgroundColor: '#020617', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '12px', padding: '10px', maxHeight: '120px', overflowY: 'auto' }}>
                <h4 style={{ fontSize: '11px', margin: '0 0 4px 0', color: '#fff' }}>{browserAsset.titulo}</h4>
                <p style={{ fontSize: '9px', color: '#ff007f', margin: '0 0 6px 0' }}>{browserAsset.subtitulo}</p>
                <p style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>{browserAsset.conteudoTexto}</p>
              </div>
            </div>
          )}

          {abaOverlayAtiva === 'nuvem' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '9px', color: '#a855f7', fontWeight: 'bold', display: 'block' }}>🌐 ADICIONAR NOVO LINK 3D NA NUVEM ({nuvemSelecionada.toUpperCase()})</span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="Ícone (ex: 🎬)" value={novoLinkIcone} onChange={(e) => setNovoLinkIcone(e.target.value)} style={{ width: '60px', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', textAlign: 'center' }} />
                  <input type="text" placeholder="Título do Link (ex: Meu Projeto)" value={novoLinkTitulo} onChange={(e) => setNovoLinkTitulo(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
                </div>
                <input type="text" placeholder="URL ou Caminho da Nuvem..." value={novoLinkUrl} onChange={(e) => setNovoLinkUrl(e.target.value)} style={{ padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
                <button onClick={adicionarNovoLink3D} style={{ padding: '8px', backgroundColor: '#a855f7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>🚀 Adicionar Nó de Link 3D</button>
              </div>

              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>🔗 LINKS 3D ATIVOS / REDES SOCIAIS:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
                {links3D.map(item => (
                  <div key={item.id} onClick={() => abrirLinkExternoSeguro(item.url, item.titulo)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1e293b', cursor: 'pointer' }}>
                    <span style={{ fontSize: '10px', color: '#fff' }}>{item.icone} <b>{item.titulo}</b> <span style={{ fontSize: '8px', color: '#94a3b8' }}>({item.nuvem.toUpperCase()})</span></span>
                    <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold' }}>Abrir ➔</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTAINER THREE.JS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* MODAL AGENDA E LINK */}
      {abaAtiva && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', backgroundColor: 'rgba(7, 12, 28, 0.98)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '22px', zIndex: 40, backdropFilter: 'blur(30px)', boxShadow: '0 0 60px rgba(0,240,255,0.4)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#00f0ff', fontSize: '16px', fontWeight: '900' }}>
              {abaAtiva === 'agenda' && '📅 Agendador de Tarefas Gemini IA'}
              {abaAtiva === 'link' && '🔗 Publicador de Links Online'}
            </h3>
            <button onClick={() => setAbaAtiva(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
          </div>

          {abaAtiva === 'agenda' && (
            <div>
              <form onSubmit={adicionarTarefa} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Nova tarefa ou projeto..." 
                  value={novaTarefa} 
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Adicionar</button>
              </form>
              <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {listaTarefas.map((t) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: '#fff' }}>{t.texto}</span>
                    <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>{t.horario}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {abaAtiva === 'link' && (
            <div>
              <p style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '12px' }}>
                Publique relatórios da pesquisa e arquivos do Google Drive instantaneamente na nuvem do Emanuel.OS.
              </p>
              <button onClick={gerarLinkOnline} style={{ width: '100%', padding: '10px', backgroundColor: '#ff00aa', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', marginBottom: '12px' }}>
                🌐 Gerar Link Online Público
              </button>
              {linkGerado && (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '8px', border: '1px solid #ff00aa', wordBreak: 'break-all' }}>
                  <span style={{ fontSize: '9px', color: '#ff00aa', display: 'block', fontWeight: 'bold' }}>LINK PÚBLICO ATIVO:</span>
                  <a href="#" style={{ fontSize: '10px', color: '#00f0ff' }}>{linkGerado}</a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CARD LATERAL DOS LOCAIS / CONTATOS */}
      {localSelecionado && (
        <aside style={{ position: 'absolute', right: '30px', bottom: '30px', width: '360px', backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '20px', padding: '20px', backdropFilter: 'blur(25px)', zIndex: 20, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#00f0ff', fontWeight: '900' }}>{localSelecionado.nome}</h3>
            <button onClick={() => setLocalSelecionado(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>✕</button>
          </div>
          <span style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginBottom: '10px' }}>{localSelecionado.categoria}</span>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
            <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>🔒 NODE / COORDENADAS REGIONAIS</span>
            <span style={{ fontSize: '10px', color: '#71717a', fontFamily: 'monospace' }}>{localSelecionado.ipCriptografado}</span>
          </div>

          <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🔗 CENTRAL DE CONTATOS DO EMANUEL:</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
            <a href={meusDadosReais.youtube} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #ff0000', color: '#ff4d4d', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>▶️ Canal YouTube Oficial</a>
            <a href={meusDadosReais.tiktok} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🎵 TikTok Oficial</a>
            <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>📸 Instagram Oficial</a>
            <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '8px', backgroundColor: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffc800', color: '#ffc800', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>✉️ E-mail Direto ({meusDadosReais.email})</a>
            <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>💬 WhatsApp: {meusDadosReais.whatsappFormatado}</a>
            <a href={meusDadosReais.threads} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🧵 Threads Oficial</a>
            <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🐙 GitHub Principal</a>
          </div>
        </aside>
      )}

      {/* MODAL DE ARQUITETURA DO DATA CENTER */}
      {arquiteturaAberta && (
        <aside style={{
          position: 'absolute', right: '30px', bottom: '30px', width: '380px',
          backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.5)',
          borderRadius: '20px', padding: '20px', backdropFilter: 'blur(25px)',
          zIndex: 200, color: '#fff', boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#00f0ff', fontWeight: '900', letterSpacing: '0.5px' }}>
              🏛️ ARQUITETURA DATA CENTER 3D
            </h3>
            <button onClick={() => setArquiteturaAberta(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>✕</button>
          </div>
          
          <span style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginBottom: '12px', lineHeight: '1.4' }}>
            Sincronização Estrutural de Nós Orbitais no Mapa Terrestre. Dados operando via Gemini AGI.
          </span>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
            <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              🌐 NÓS ORBITAIS DE ARMAZENAMENTO ATIVOS
            </span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(66, 133, 244, 0.15)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(66, 133, 244, 0.5)' }}>
                <span style={{ fontSize: '11px', color: '#4285f4', fontWeight: 'bold' }}>☁️ Google Drive & Gmail</span>
                <span style={{ fontSize: '9px', color: '#a1a1aa' }}>15 GB / 2 TB (Stable)</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                <span style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>🍏 Apple iCloud</span>
                <span style={{ fontSize: '9px', color: '#a1a1aa' }}>Nó Orbital / Backups</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0, 164, 239, 0.15)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(0, 164, 239, 0.5)' }}>
                <span style={{ fontSize: '11px', color: '#00a4ef', fontWeight: 'bold' }}>🪟 Microsoft OneDrive</span>
                <span style={{ fontSize: '9px', color: '#a1a1aa' }}>Vault Empresarial</span>
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
            <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '8px', backgroundColor: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffc800', color: '#ffc800', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>✉️ E-mail Direto ({meusDadosReais.email})</a>
            <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>💬 WhatsApp: {meusDadosReais.whatsappFormatado}</a>
            <a href={meusDadosReais.threads} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🧵 Threads Oficial</a>
            <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🐙 GitHub Principal</a>
          </div>
        </aside>
      )}

      {/* PAINEL DE JANELAS FUTURISTAS INTEGRADO */}
      <FuturisticWindowManager />
    </div>
  );
}