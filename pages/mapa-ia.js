import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { QRCodeSVG } from 'qrcode.react';

// 🚀 IMPORTAÇÃO DA BASE DE DADOS POKÉMON E YU-GI-OH!
import { pokedexData, yugiohWorldData } from '../datapokedex-yugioh';

// Importação do Gerenciador de Janelas Futuristas (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaIA() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const esferasLinks3DRef = useRef([]);

  // States de Modais / Painéis Superiores e Flutuantes
  const [isBarraFluidaOpen, setIsBarraFluidaOpen] = useState(false);
  const [painelAvatarSelectionAberto, setPainelAvatarSelectionAberto] = useState(false);
  const [painelModuloAvatarAberto, setPainelModuloAvatarAberto] = useState(false);

  const [abaAvatarSelection, setAbaAvatarSelection] = useState('personagem'); 
  const [abaModuloAvatar, setAbaModuloAvatar] = useState('personagem'); 

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
  const [browserAsset] = useState({
    titulo: 'Emanuel.OS Quantum Browser v5.1',
    subtitulo: 'Pensamento Neural ROBOTOC Multimodal Active',
    conteudoTexto: 'Sincronização neural ativa no Mapa IA. ROBOTOC pronto para processar buscas, cards e mídias.'
  });

  // Search e Seleções Pokédex & Yu-Gi-Oh!
  const [buscaPersonagem, setBuscaPersonagem] = useState('');
  const [personagemSelecionado, setPersonagemSelecionado] = useState(yugiohWorldData?.personagens?.[0]?.id || 'yugi'); 
  const [mundoSelecionado, setMundoSelecionado] = useState(yugiohWorldData?.mundos?.[0]?.id || 'neo-domino'); 
  const [pokemonSelecionado] = useState(pokedexData?.[0] || { nome: 'Pikachu', avatar: '' }); 

  // Terminal Logs G-AGI
  const [cmdLogs] = useState([
    "[S-AGI: LOG] Nano Banana 3D asset generation completed.",
    "[G-AGI: STATUS] ROBOTOC Data Center & Cloud Nodes online.",
    "[S-AGI: STATUS] Avatar 'Emanuel' synced with 3D IA World.",
    "[G-AGI: QUERY] Optimize 3D Pokémon & Yu-Gi-Oh! rendering?"
  ]);

  // States Oficiais do Mapa
  const [prompt, setPrompt] = useState('Vila ninja de naruto com personagens, transito, carros, predios, mar e piscina');
  const [status, setStatus] = useState('Clique em qualquer lugar para ativar o som do Telão 🔊 ou clique nos prédios!');
  const [mapInfo, setMapInfo] = useState({
    id: Date.now(),
    title: 'Vila Ninja & Metrópole 3D',
    description: 'Vila com trânsito ativo, oceano, piscina e núcleo de redes sociais via fios de chakra.',
    googleLink: 'https://maps.google.com',
    youtubeLink: meusDadosReais.youtube,
    instagramLink: meusDadosReais.instagram,
    kwaiLink: 'https://k.kwai.com/u/@ewnop969ok',
    facebookLink: meusDadosReais.facebook,
    tiktokLink: meusDadosReais.tiktok,
    threadsLink: meusDadosReais.threads,
    tags: ['#naruto', '#vilaninja', '#chakranode', '#kwai', '#transito', '#mar', '#yugioh2030']
  });

  // Modal e Scanner de QR Code para Injeção no Mapa
  const [modalQrCodeAberto, setModalQrCodeAberto] = useState(false);
  const [qrInputLink, setQrInputLink] = useState('');

  const [savedMaps, setSavedMaps] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('matrix');
  const [selectedBuildingInfo, setSelectedBuildingInfo] = useState(null);

  // States de Câmera Virtual, Mini-Player e Áudio
  const [walkMode, setWalkMode] = useState(false);
  const [minimizedPlayer, setMinimizedPlayer] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('/naruto.mp4');
  const [audioEnabled, setAudioEnabled] = useState(false);

  // References do Three.js
  const cityGroupRef = useRef(null);
  const trafficVehiclesRef = useRef([]);
  const waterMeshRef = useRef(null);
  const canvasTextureRef = useRef(null);
  const videoCtxRef = useRef(null);
  const videoElementRef = useRef(null);
  const chakraLinesGroupRef = useRef(null);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // AÇÕES AUXILIARES ROBOTOC & LINKS
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

  // 🚀 INJETAR ELEMENTO 3D NO CENÁRIO
  const handleInjetarObjeto3D = (tipo, dados) => {
    if (!cityGroupRef.current) return;
    const x = (Math.random() - 0.5) * 25;
    const z = (Math.random() - 0.5) * 25;

    if (tipo === 'pokemon') {
      const pGroup = new THREE.Group();
      const bodyGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const bodyMat = new THREE.MeshStandardMaterial({ color: dados.cor || 0xef4444, roughness: 0.3, metalness: 0.4 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.5;
      pGroup.add(body);

      const auraGeo = new THREE.SphereGeometry(2.2, 16, 16);
      const auraMat = new THREE.MeshBasicMaterial({ color: dados.cor || 0xef4444, wireframe: true, transparent: true, opacity: 0.3 });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.position.y = 1.5;
      pGroup.add(aura);

      pGroup.position.set(x, 0, z);
      pGroup.userData = { isBuilding: true, name: `Pokémon 3D: ${dados.nome}` };
      cityGroupRef.current.add(pGroup);

      setStatus(`✨ Pokémon 3D ${dados.nome} gerado com sucesso no mapa!`);
    } else if (tipo === 'yugioh_carta') {
      const cardGroup = new THREE.Group();
      const cardGeo = new THREE.BoxGeometry(3, 4.5, 0.1);
      const cardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.1, metalness: 0.8 });
      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.y = 4;
      cardGroup.add(card);

      const holoGeo = new THREE.PlaneGeometry(3.2, 4.7);
      const holoMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.5 });
      const holo = new THREE.Mesh(holoGeo, holoMat);
      holo.position.set(0, 4, 0.06);
      cardGroup.add(holo);

      cardGroup.position.set(x, 0, z);
      cardGroup.userData = { isBuilding: true, name: `Carta 3D Yu-Gi-Oh!: ${dados.nome}` };
      cityGroupRef.current.add(cardGroup);

      setStatus(`🃏 Carta Holográfica 3D "${dados.nome}" injetada no mapa!`);
    }
  };

  // Injetar Link Lido do QR Code na Matriz 3D
  const handleInjetarLinkQrCode = (e) => {
    e.preventDefault();
    if (!qrInputLink.trim()) return;

    setMapInfo(prev => ({
      ...prev,
      kwaiLink: qrInputLink.includes('kwai') ? qrInputLink : prev.kwaiLink,
      youtubeLink: qrInputLink.includes('youtube') ? qrInputLink : prev.youtubeLink,
      instagramLink: qrInputLink.includes('instagram') ? qrInputLink : prev.instagramLink,
      googleLink: !qrInputLink.includes('kwai') && !qrInputLink.includes('youtube') && !qrInputLink.includes('instagram') ? qrInputLink : prev.googleLink
    }));

    if (cityGroupRef.current) {
      const height = Math.random() * 10 + 8;
      const geo = new THREE.BoxGeometry(4, height, 4);
      const mat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.8 });
      const building = new THREE.Mesh(geo, mat);
      building.position.set((Math.random() - 0.5) * 30, height / 2, (Math.random() - 0.5) * 30);
      building.userData = { isBuilding: true, name: `Estrutura Injetada via QR Code (${qrInputLink.substring(0, 15)}...)` };
      cityGroupRef.current.add(building);
    }

    setStatus(`📲 Link de QR Code injetado com sucesso no cenário 3D!`);
    setModalQrCodeAberto(false);
    setQrInputLink('');
  };

  // Carregar mapas salvos do localStorage
  useEffect(() => {
    const loaded = localStorage.getItem('naruto_ai_saved_maps');
    if (loaded) {
      try { setSavedMaps(JSON.parse(loaded)); } catch (e) {}
    }
  }, []);

  // Inicialização da Cena 3D Three.js
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.012);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(35, 25, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.01;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00ffff, 1.5);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00e5ff, 3, 80);
    pointLight.position.set(0, 25, 0);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(80, 40, 0x00ffff, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    const cityGroup = new THREE.Group();
    cityGroupRef.current = cityGroup;
    scene.add(cityGroup);

    // 🤖 AVATAR ROBOTOC HUMANOIDE 3D INTEGRADO
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

    avatarGroup.position.set(-12, 2, 5);
    avatarGroup.scale.set(1.5, 1.5, 1.5);
    scene.add(avatarGroup);
    avatarGroupRef.current = avatarGroup;

    // ESFERAS DE LINKS 3D ÓRBITA DO NÚCLEO ROBOTOC
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

    // Canvas & Vídeo do Telão
    const vCanvas = document.createElement('canvas');
    vCanvas.width = 512;
    vCanvas.height = 256;
    const vCtx = vCanvas.getContext('2d');
    videoCtxRef.current = vCtx;

    const cTexture = new THREE.CanvasTexture(vCanvas);
    canvasTextureRef.current = cTexture;

    const video = document.createElement('video');
    video.src = customVideoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    videoElementRef.current = video;

    video.play().catch((err) => console.log('Aguardando interação:', err));

    const videoTexture = new THREE.VideoTexture(video);
    const screenGeo = new THREE.PlaneGeometry(18, 10);
    const screenMat = new THREE.MeshBasicMaterial({ map: videoTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 22, -12);
    scene.add(screenMesh);

    generateMapFromPrompt(prompt, cityGroup, scene);

    const handleUserInteraction = () => {
      if (videoElementRef.current) {
        videoElementRef.current.muted = false;
        setAudioEnabled(true);
        setStatus('🔊 Som do Telão Ativado em HD!');
      }
    };
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    // Raycaster para cliques no Mapa
    const handleCanvasClick = (event) => {
      if (!currentMount || !cityGroupRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      // Colisão com os links orbitais
      const intersectsOrbs = raycasterRef.current.intersectObjects(esferasLinks3DRef.current);
      // Colisão com o ROBOTOC Avatar
      const intersectsAvatar = avatarGroupRef.current ? raycasterRef.current.intersectObjects(avatarGroupRef.current.children, true) : [];
      // Colisão com objetos da cidade
      const intersectsCity = raycasterRef.current.intersectObjects(cityGroupRef.current.children, true);

      if (intersectsOrbs.length > 0) {
        const hitOrb = intersectsOrbs[0].object;
        if (hitOrb.userData && hitOrb.userData.url) {
          abrirLinkExternoSeguro(hitOrb.userData.url);
        }
      } else if (intersectsAvatar.length > 0) {
        setArquiteturaAberta(true);
        setMostrarOverlayRobotoc(false);
      } else if (intersectsCity.length > 0) {
        let clickedObj = intersectsCity[0].object;
        while (clickedObj.parent && clickedObj.parent !== cityGroupRef.current) {
          clickedObj = clickedObj.parent;
        }
        if (clickedObj.userData && clickedObj.userData.isBuilding) {
          setSelectedBuildingInfo({
            name: clickedObj.userData.name || 'Prédio da Rede Social',
            id: clickedObj.id
          });
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    const handleKeyDown = (e) => {
      if (!cameraRef.current) return;
      const key = e.key.toLowerCase();
      const speed = 1.5;

      if (key === 'w' || key === 'arrowup') cameraRef.current.translateZ(-speed);
      else if (key === 's' || key === 'arrowdown') cameraRef.current.translateZ(speed);
      else if (key === 'a' || key === 'arrowleft') cameraRef.current.translateX(-speed);
      else if (key === 'd' || key === 'arrowright') cameraRef.current.translateX(speed);
    };
    window.addEventListener('keydown', handleKeyDown);

    let animationFrameId;
    let time = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.03;
      const elapsedTime = clock.getElapsedTime();

      // Animação das Esferas de Links Orbitais
      esferasLinks3DRef.current.forEach((mesh, index) => {
        const angle = elapsedTime * 0.8 + (index * (Math.PI * 2 / esferasLinks3DRef.current.length));
        const radius = 3.5;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.position.y = 24 + Math.sin(elapsedTime * 2 + index) * 0.5;
      });

      // Animação Flutuante do ROBOTOC
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.2;
      }

      trafficVehiclesRef.current.forEach((car) => {
        car.position.z += car.userData.speed;
        if (car.position.z > 35) car.position.z = -35;
      });

      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = -0.2 + Math.sin(time) * 0.15;
      }

      if (chakraLinesGroupRef.current) {
        chakraLinesGroupRef.current.rotation.y += 0.005;
      }

      controls.update();
      updateVideoCanvas();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [customVideoUrl, links3D]);

  const toggleWalkMode = () => {
    if (!cameraRef.current || !controlsRef.current) return;

    if (!walkMode) {
      cameraRef.current.position.set(0, 2.2, 20);
      controlsRef.current.target.set(0, 2.2, 0);
      setStatus('🎥 Câmera Virtual de Passeio Ativada!');
    } else {
      cameraRef.current.position.set(35, 25, 45);
      controlsRef.current.target.set(0, 0, 0);
      setStatus('🌐 Visão Panorâmica Reativada.');
    }
    setWalkMode(!walkMode);
  };

  const toggleAudio = () => {
    if (!videoElementRef.current) return;
    const nextState = !videoElementRef.current.muted;
    videoElementRef.current.muted = nextState;
    setAudioEnabled(!nextState);
    setStatus(nextState ? '🔇 Telão no modo mudo.' : '🔊 Som do Telão Ligado!');
  };

  const handleZoom = (delta) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(5, Math.min(100, cameraRef.current.position.z + delta));
  };

  const moveCamera = (direction) => {
    if (!cameraRef.current) return;
    const dist = 3;
    if (direction === 'forward') cameraRef.current.translateZ(-dist);
    if (direction === 'backward') cameraRef.current.translateZ(dist);
    if (direction === 'left') cameraRef.current.translateX(-dist);
    if (direction === 'right') cameraRef.current.translateX(dist);
  };

  const updateVideoCanvas = () => {
    const ctx = videoCtxRef.current;
    if (!ctx) return;
    const now = Date.now() * 0.003;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    if (selectedVideo === 'matrix') {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('NARUTO AI // REDE SOCIAL LIVE', 20, 50);
      ctx.fillText(`TRANSMISSÃO: ${mapInfo.title.substring(0, 20)}`, 20, 90);
      ctx.fillStyle = '#059669';
      ctx.fillRect(20, 115, (Math.sin(now) + 1) * 220, 12);
      ctx.fillStyle = '#ff007f';
      ctx.font = '13px sans-serif';
      ctx.fillText(`Kwai: ${mapInfo.kwaiLink}`, 20, 160);
      ctx.fillStyle = '#34d399';
      ctx.fillText(`Google: ${mapInfo.googleLink}`, 20, 190);
    } else if (selectedVideo === 'anime') {
      const grad = ctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#ef4444');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('🍃 VILA NINJA FEED MULTI-REDES', 20, 60);
      ctx.font = '15px sans-serif';
      ctx.fillText(`YT: ${mapInfo.youtubeLink}`, 20, 105);
      ctx.fillText(`IG: ${mapInfo.instagramLink}`, 20, 145);
      ctx.fillText(`KWAI: ${mapInfo.kwaiLink}`, 20, 185);
    } else {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('NÚCLEO CENTRAL DE CHAKRA', 20, 70);
      ctx.font = '15px sans-serif';
      ctx.fillText(`Kwai Oficial: ${mapInfo.kwaiLink}`, 20, 130);
      ctx.fillText(`Google: ${mapInfo.googleLink}`, 20, 170);
    }

    if (canvasTextureRef.current) {
      canvasTextureRef.current.needsUpdate = true;
    }
  };

  const generateMapFromPrompt = (userPrompt, groupParam, sceneParam) => {
    const group = groupParam || cityGroupRef.current;
    const scene = sceneParam || sceneRef.current;
    if (!group || !scene) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }
    trafficVehiclesRef.current = [];

    const lower = userPrompt.toLowerCase();
    const hasNinja = lower.includes('ninja') || lower.includes('naruto') || lower.includes('vila');
    const hasSea = lower.includes('mar') || lower.includes('oceano') || lower.includes('agua') || lower.includes('água');
    const hasPool = lower.includes('piscina');
    const hasTraffic = lower.includes('transito') || lower.includes('trânsito') || lower.includes('carros') || lower.includes('carro');

    if (hasSea) {
      const seaGeo = new THREE.PlaneGeometry(90, 30);
      const seaMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85
      });
      const sea = new THREE.Mesh(seaGeo, seaMat);
      sea.rotation.x = -Math.PI / 2;
      sea.position.set(0, -0.1, -30);
      group.add(sea);
      waterMeshRef.current = sea;
    }

    if (hasPool) {
      for (let p = 0; p < 2; p++) {
        const poolBorderGeo = new THREE.BoxGeometry(10, 0.4, 6);
        const poolBorderMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
        const poolBorder = new THREE.Mesh(poolBorderGeo, poolBorderMat);
        poolBorder.position.set(-15 + p * 30, 0.1, 15);
        group.add(poolBorder);

        const poolWaterGeo = new THREE.PlaneGeometry(9.2, 5.2);
        const poolWaterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const poolWater = new THREE.Mesh(poolWaterGeo, poolWaterMat);
        poolWater.rotation.x = -Math.PI / 2;
        poolWater.position.set(-15 + p * 30, 0.3, 15);
        group.add(poolWater);
      }
    }

    if (hasTraffic) {
      const roadGeo = new THREE.PlaneGeometry(8, 70);
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0.05, 0);
      group.add(road);

      const carColors = [0xef4444, 0x3b82f6, 0xeab308, 0x10b981];
      for (let c = 0; c < 6; c++) {
        const carGeo = new THREE.BoxGeometry(1.8, 1.2, 3.2);
        const carMat = new THREE.MeshStandardMaterial({ color: carColors[c % carColors.length] });
        const car = new THREE.Mesh(carGeo, carMat);

        const lane = c % 2 === 0 ? -2 : 2;
        car.position.set(lane, 0.7, -30 + c * 11);
        car.userData = { speed: 0.2 + Math.random() * 0.15 };

        group.add(car);
        trafficVehiclesRef.current.push(car);
      }
    }

    const buildingColors = hasNinja
      ? [0xc2410c, 0xb91c1c, 0x78350f, 0xf97316]
      : [0x1e293b, 0x0f172a, 0x312e81, 0x1e1b4b];

    const numBuildings = 16;
    const buildingPositions = [];

    for (let i = 0; i < numBuildings; i++) {
      const height = Math.random() * 12 + 5;
      const width = Math.random() * 4 + 3;
      const depth = Math.random() * 4 + 3;

      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
        roughness: 0.3,
        metalness: 0.5
      });
      const building = new THREE.Mesh(geometry, material);

      let x = (Math.random() - 0.5) * 50;
      if (Math.abs(x) < 6) x = x < 0 ? -10 : 10;
      const z = (Math.random() - 0.5) * 50;

      building.position.set(x, height / 2, z);
      building.userData = { isBuilding: true, name: `Estrutura Social #${i + 1}` };
      group.add(building);
      buildingPositions.push(new THREE.Vector3(x, height, z));

      if (hasNinja && i % 2 === 0) {
        const roofGeo = new THREE.ConeGeometry(width * 0.8, 3, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(x, height + 1.5, z);
        roof.rotation.y = Math.PI / 4;
        group.add(roof);
      }
    }

    const nucleusGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(2.8, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    const nucleusPos = new THREE.Vector3(0, 24, 0);
    nucleusGroup.position.copy(nucleusPos);
    nucleusGroup.add(coreMesh);
    group.add(nucleusGroup);

    const chakraLinesGroup = new THREE.Group();
    chakraLinesGroupRef.current = chakraLinesGroup;

    buildingPositions.slice(0, 10).forEach((bPos) => {
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
      const points = [nucleusPos, bPos];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      chakraLinesGroup.add(line);
    });

    group.add(chakraLinesGroup);

    if (hasNinja) {
      for (let n = 0; n < 8; n++) {
        const ninjaGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 8);
        const ninjaMat = new THREE.MeshStandardMaterial({ color: n % 2 === 0 ? 0xeab308 : 0x0284c7 });
        const ninja = new THREE.Mesh(ninjaGeo, ninjaMat);

        const nx = (Math.random() - 0.5) * 40;
        const nz = (Math.random() - 0.5) * 40;
        ninja.position.set(nx, 0.9, nz);
        group.add(ninja);
      }
    }

    const words = userPrompt.split(' ').filter((w) => w.length > 3);
    const generatedTags = words.map((w) => `#${w.toLowerCase().replace(/[^a-z0-9]/g, '')}`);

    setMapInfo((prev) => ({
      ...prev,
      tags: Array.from(new Set([...generatedTags, '#chakra', '#kwai', '#3dmap', '#narutoai', '#yugioh2030']))
    }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt) return;
    setStatus('⚡ Gerando mapa e interligando vias de chakra...');
    generateMapFromPrompt(prompt);
    setTimeout(() => {
      setStatus('✨ Mapa e fios de chakra atualizados!');
    }, 800);
  };

  const handleSaveMap = () => {
    const newSaved = [
      {
        ...mapInfo,
        id: Date.now(),
        prompt,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...savedMaps
    ];
    setSavedMaps(newSaved);
    localStorage.setItem('naruto_ai_saved_maps', JSON.stringify(newSaved));
    setStatus('💾 Mapa salvo com sucesso!');
  };

  const handleDeleteMap = (id) => {
    const filtered = savedMaps.filter((m) => m.id !== id);
    setSavedMaps(filtered);
    localStorage.setItem('naruto_ai_saved_maps', JSON.stringify(filtered));
    setStatus('🗑️ Mapa excluído.');
  };

  const handleLoadMap = (saved) => {
    setPrompt(saved.prompt || 'Vila Ninja com prédio e telão');
    setMapInfo(saved);
    generateMapFromPrompt(saved.prompt || 'Vila Ninja');
    setStatus(`📂 Mapa "${saved.title}" carregado!`);
  };

  const duelistasFiltrados = (yugiohWorldData?.personagens || []).filter(p => 
    p.nome.toLowerCase().includes(buscaPersonagem.toLowerCase())
  );

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#020617', color: '#f1f5f9', fontFamily: 'sans-serif', position: 'relative' }}>
      <Head>
        <title>Emanuel.OS - Gerador 3D de Mapas IA & Data Center ROBOTOC</title>
      </Head>

      {/* 🟢 HEADER PRINCIPAL COM BOTÕES CYBERPUNK & ROBOTOC HUD */}
      <header style={{ zIndex: 20, position: 'relative', backgroundColor: 'rgba(7, 12, 28, 0.95)', borderBottom: '1px solid #00f0ff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href="/" style={{ backgroundColor: '#1e293b', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #334155' }}>🏠 Core Login</a>
          <a href="/espacial" style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #0284c7' }}>🚀 Mapa Espacial</a>
          <div>
            <h1 style={{ fontSize: '15px', margin: 0, fontWeight: 'bold', color: '#fb923c' }}>Gerador 3D de Mapas IA</h1>
            <p style={{ fontSize: '9px', color: '#94a3b8', margin: 0 }}>ROBOTOC Data Center, Vila Ninja, Fios de Chakra & Multicloud</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMostrarOverlayRobotoc(!mostrarOverlayRobotoc)}
            style={{ padding: '6px 12px', backgroundColor: mostrarOverlayRobotoc ? '#00f0ff' : 'rgba(0,240,255,0.2)', color: mostrarOverlayRobotoc ? '#000' : '#00f0ff', border: '1px solid #00f0ff', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
          >
            🤖 {mostrarOverlayRobotoc ? 'Ocultar ROBOTOC HUD' : 'ROBOTOC HUD'}
          </button>

          <button onClick={() => setModalQrCodeAberto(true)} style={{ backgroundColor: 'rgba(0,240,255,0.2)', color: '#00f0ff', fontSize: '10px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #00f0ff', fontWeight: 'bold', cursor: 'pointer' }}>📱 Injetar via QR Code</button>
          <button onClick={toggleAudio} style={{ backgroundColor: audioEnabled ? '#10b981' : '#f59e0b', color: '#000', fontSize: '10px', padding: '6px 10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{audioEnabled ? '🔊 Som Ligado' : '🔇 Ligar Áudio'}</button>
          <button onClick={toggleWalkMode} style={{ backgroundColor: walkMode ? '#ef4444' : '#00ffff', color: '#000', fontSize: '10px', padding: '6px 10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{walkMode ? '🚪 Sair do Passeio' : '📷 Câmera Virtual 3D'}</button>
          <button onClick={() => setIsEditing(!isEditing)} style={{ backgroundColor: '#4f46e5', color: '#fff', fontSize: '10px', padding: '6px 10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{isEditing ? 'Fechar Edição' : '✏️ Editar Info'}</button>
          <button onClick={() => setPainelAvatarSelectionAberto(!painelAvatarSelectionAberto)} style={{ backgroundColor: '#6366f1', color: '#fff', fontSize: '10px', padding: '6px 10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>👑 CARTA 3D / DUELISTA</button>
          <button onClick={() => setPainelModuloAvatarAberto(!painelModuloAvatarAberto)} style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '10px', padding: '6px 10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🎭 AVATAR EDITOR</button>
          <button onClick={handleSaveMap} style={{ backgroundColor: '#059669', color: '#fff', fontSize: '10px', padding: '6px 10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>💾 Salvar Mapa</button>
        </div>
      </header>

      {/* 🌌 VIEWPORT THREE.JS */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 55px)' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

        {/* 🌟 BARRA FLUIDA SUPERIOR RETRÁTIL */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '80%', maxWidth: '600px' }}>
          <div 
            onClick={() => setIsBarraFluidaOpen(!isBarraFluidaOpen)}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', border: '1px solid #00f0ff', borderTop: 'none', padding: '6px 16px', textAlign: 'center', cursor: 'pointer', color: '#00f0ff', fontSize: '11px', fontWeight: 'bold' }}
          >
            <span>{isBarraFluidaOpen ? '▲ Recolher Painel Fluido' : '▼ Puxe para Baixo (Barra de Pesquisa & Tags IA)'}</span>
          </div>

          {isBarraFluidaOpen && (
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(249, 115, 22, 0.5)', marginTop: '6px' }}>
              <form onSubmit={handleGenerate} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#fb923c', fontSize: '18px' }}>✨</span>
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ex: vila ninja de naruto com carros, transito..." style={{ backgroundColor: '#020617', border: '1px solid #334155', outline: 'none', fontSize: '12px', color: '#fff', width: '100%', padding: '10px', borderRadius: '10px' }} />
                <button type="submit" style={{ background: 'linear-gradient(to right, #ea580c, #d97706)', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Gerar Mapa</button>
              </form>

              <div>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Palavras-Chave Detectadas:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {mapInfo.tags.map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '10px', backgroundColor: 'rgba(67, 20, 7, 0.8)', color: '#fdba74', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(154, 52, 18, 0.5)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 👈 PAINEL ESQUERDO DA MÍDIA E MAPAS SALVOS */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, width: '260px', backgroundColor: 'rgba(7, 12, 28, 0.9)', backdropFilter: 'blur(16px)', borderRadius: '12px', padding: '14px', border: '1px solid #1e293b' }}>
          <h4 style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Mídia do Telão no Prédio</h4>
          <select value={selectedVideo} onChange={(e) => setSelectedVideo(e.target.value)} style={{ width: '100%', backgroundColor: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '6px', fontSize: '10px' }}>
            <option value="matrix">Clip 1: Neo-Domino Duel Arena 2030</option>
            <option value="anime">Clip 2: Vila Ninja Feed & Kwai</option>
          </select>

          <h4 style={{ fontSize: '10px', color: '#94a3b8', margin: '12px 0 6px 0', textTransform: 'uppercase' }}>Meus Mapas Salvos ({savedMaps.length})</h4>
          {savedMaps.length === 0 ? (
            <p style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>Nenhum mapa salvo ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {savedMaps.map((map) => (
                <div key={map.id} style={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '6px', borderRadius: '6px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span onClick={() => handleLoadMap(map)} style={{ fontSize: '10px', color: '#fff', cursor: 'pointer' }}>{map.title}</span>
                  <button onClick={() => handleDeleteMap(map.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- OVERLAY DE INTERAÇÃO DO ROBOTOC (MULTICLOUD + LINKS 3D + QUANTUM BROWSER) --- */}
        {mostrarOverlayRobotoc && (
          <div className="quantum-browser-widget" style={{
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 150,
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
                    PENSAMENTO ROBOTOC MAPA IA & NUVEM
                  </h3>
                  <span style={{ fontSize: '8px', color: '#a1a1aa' }}>Emanuel.OS Multicloud Vault & Quantum Browser</span>
                </div>
              </div>

              <button onClick={() => setMostrarOverlayRobotoc(false)} style={{ background: 'none', border: 'none', color: '#00f0ff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>

            {/* BARRA DE SELEÇÃO DE NUVENS */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', background: 'rgba(2, 6, 23, 0.8)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.2)' }}>
              <button onClick={() => setNuvemSelecionada('google')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'google' ? '#4285f4' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌐 Google Drive</button>
              <button onClick={() => setNuvemSelecionada('apple')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'apple' ? '#ffffff' : 'transparent', color: nuvemSelecionada === 'apple' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🍏 Apple iCloud</button>
              <button onClick={() => setNuvemSelecionada('microsoft')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'microsoft' ? '#00a4ef' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🪟 OneDrive</button>
              <button onClick={() => setNuvemSelecionada('custom')} style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', backgroundColor: nuvemSelecionada === 'custom' ? '#ff007f' : 'transparent', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌌 Vault 3D</button>
            </div>

            {/* PAINEL DE STATUS DA NUVEM SELECIONADA */}
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

            {/* ABAS DO OVERLAY */}
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
                    placeholder="Pesquisar qualquer assunto no Mapa IA..."
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
                    <div key={item.id} onClick={() => abrirLinkExternoSeguro(item.url)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1e293b', cursor: 'pointer' }}>
                      <span style={{ fontSize: '10px', color: '#fff' }}>{item.icone} <b>{item.titulo}</b> <span style={{ fontSize: '8px', color: '#94a3b8' }}>({item.nuvem.toUpperCase()})</span></span>
                      <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold' }}>Abrir ➔</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🎯 PAINEL CENTRAL FLUTUANTE: AVATAR SELECTION */}
        {painelAvatarSelectionAberto && (
          <div style={{
            position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-40%)', zIndex: 30,
            width: '320px', backgroundColor: 'rgba(7, 12, 28, 0.95)', backdropFilter: 'blur(20px)',
            border: '1px solid #00f0ff', borderRadius: '12px', padding: '14px', boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', textTransform: 'uppercase' }}>AVATAR SELECTION</span>
              <button onClick={() => setPainelAvatarSelectionAberto(false)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              <button onClick={() => setAbaAvatarSelection('personagem')} style={{ flex: 1, padding: '5px', backgroundColor: abaAvatarSelection === 'personagem' ? '#0f766e' : '#1e293b', border: 'none', color: '#fff', fontSize: '9px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>PERSONAGEM</button>
              <button onClick={() => setAbaAvatarSelection('carta')} style={{ flex: 1, padding: '5px', backgroundColor: abaAvatarSelection === 'carta' ? '#0f766e' : '#1e293b', border: 'none', color: '#fff', fontSize: '9px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>CARTA 3D</button>
            </div>

            <input 
              type="text" 
              placeholder="Search..."
              value={buscaPersonagem}
              onChange={(e) => setBuscaPersonagem(e.target.value)}
              style={{ width: '100%', padding: '6px 8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }}
            />

            {/* Lista de Duelistas com Avatares */}
            <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
              {duelistasFiltrados.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setPersonagemSelecionado(p.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px',
                    backgroundColor: personagemSelecionado === p.id ? 'rgba(0,240,255,0.2)' : '#0f172a',
                    border: '1px solid ' + (personagemSelecionado === p.id ? '#00f0ff' : '#1e293b'),
                    borderRadius: '6px', cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{p.nome}</span>
                  {p.avatar && <img src={p.avatar} alt={p.nome} style={{ width: '20px', height: '26px', objectFit: 'cover', borderRadius: '3px' }} />}
                </div>
              ))}
            </div>

            <label style={{ fontSize: '9px', color: '#eab308', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>MUNDO SELECIONADO:</label>
            <select 
              value={mundoSelecionado}
              onChange={(e) => setMundoSelecionado(e.target.value)}
              style={{ width: '100%', padding: '6px', backgroundColor: '#020617', color: '#fff', border: '1px solid #eab308', borderRadius: '6px', fontSize: '9px', outline: 'none' }}
            >
              {(yugiohWorldData?.mundos || []).map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          </div>
        )}

        {/* 👉 PAINEL DIREITO: MÓDULO DE AVATAR INTEGRADO & POKÉDEX 3D */}
        {painelModuloAvatarAberto && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px', zIndex: 30,
            width: '280px', backgroundColor: 'rgba(7, 12, 28, 0.95)', backdropFilter: 'blur(20px)',
            border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', textTransform: 'uppercase' }}>MÓDULO DE AVATAR INTEGRADO</span>
              <button onClick={() => setPainelModuloAvatarAberto(false)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              <button onClick={() => setAbaModuloAvatar('personagem')} style={{ flex: 1, padding: '4px', backgroundColor: abaModuloAvatar === 'personagem' ? '#1d4ed8' : '#1e293b', border: 'none', color: '#fff', fontSize: '8px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>PERSONAGEM</button>
              <button onClick={() => setAbaModuloAvatar('carta')} style={{ flex: 1, padding: '4px', backgroundColor: abaModuloAvatar === 'carta' ? '#1d4ed8' : '#1e293b', border: 'none', color: '#fff', fontSize: '8px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>CARTA 3D</button>
              <button onClick={() => setAbaModuloAvatar('pokemon')} style={{ flex: 1, padding: '4px', backgroundColor: abaModuloAvatar === 'pokemon' ? '#ef4444' : '#1e293b', border: 'none', color: '#fff', fontSize: '8px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>POKÉMON 3D</button>
            </div>

            {/* ABA PERSONAGEM / CARTA 3D YU-GI-OH! */}
            {(abaModuloAvatar === 'personagem' || abaModuloAvatar === 'carta') && (
              <div style={{ textAlign: 'center', backgroundColor: '#020617', padding: '8px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '8px' }}>
                <img src="https://images.ygoprodeck.com/images/cards/36996508.jpg" alt="Carta Holográfica" style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #00f0ff', filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
                <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>Alea Dragen, Chrono-Phoenix</span>
                <span style={{ fontSize: '8px', color: '#eab308', display: 'block' }}>PROJETADO POR NANO BANANA & GEMINI</span>
                <button 
                  onClick={() => handleInjetarObjeto3D('yugioh_carta', { nome: 'Chrono-Phoenix' })}
                  style={{ marginTop: '6px', width: '100%', padding: '5px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🚀 Injetar Carta 3D Holográfica
                </button>
              </div>
            )}

            {/* ABA POKÉDEX 3D */}
            {abaModuloAvatar === 'pokemon' && (
              <div style={{ backgroundColor: '#020617', padding: '8px', borderRadius: '8px', border: '1px solid #ef4444', textAlign: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>POKÉDEX 3D (2030)</span>
                {pokemonSelecionado?.avatar && <img src={pokemonSelecionado.avatar} alt={pokemonSelecionado.nome} style={{ width: '70px', height: '70px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px #ef4444)' }} />}
                <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', display: 'block' }}>Aether {pokemonSelecionado?.nome}</span>
                <button 
                  onClick={() => handleInjetarObjeto3D('pokemon', pokemonSelecionado)}
                  style={{ marginTop: '6px', width: '100%', padding: '5px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🔴 Criar Pokémon 3D no Mapa
                </button>
              </div>
            )}

            {/* LOGS G-AGI TERMINAL */}
            <div style={{ backgroundColor: '#020617', borderRadius: '6px', padding: '6px', fontSize: '8px', fontFamily: 'monospace', color: '#38bdf8', maxHeight: '70px', overflowY: 'auto' }}>
              {cmdLogs.map((log, i) => <p key={i} style={{ margin: 0, lineHeight: '1.3' }}>{log}</p>)}
            </div>
          </div>
        )}

        {/* Modal de Injeção via QR Code */}
        {modalQrCodeAberto && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 110, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '340px', boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', color: '#00f0ff', fontWeight: 'bold' }}>📱 Injetor de Links via QR Code</h3>
              <button onClick={() => setModalQrCodeAberto(false)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '12px', display: 'inline-block', marginBottom: '12px' }}>
              <QRCodeSVG value={qrInputLink || 'https://emanuel-os.vercel.app/mapa-ia'} size={130} />
            </div>

            <form onSubmit={handleInjetarLinkQrCode} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                value={qrInputLink}
                onChange={(e) => setQrInputLink(e.target.value)}
                placeholder="Cole a URL para gerar o QR Code..."
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '11px', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }}>
                ⚡ Injetar Dados no Mapa 3D
              </button>
            </form>
          </div>
        )}

        {/* Controles da Câmera Virtual */}
        {walkMode && (
          <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 15, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: '20px', border: '1px solid #00ffff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#00ffff', fontWeight: 'bold' }}>🎮 Controles da Câmera Virtual</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => moveCamera('forward')} style={{ padding: '8px 12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>⬆️ Avançar</button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => moveCamera('left')} style={{ padding: '8px 12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>⬅️ Esquerda</button>
              <button onClick={() => moveCamera('backward')} style={{ padding: '8px 12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>⬇️ Recuar</button>
              <button onClick={() => moveCamera('right')} style={{ padding: '8px 12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>➡️ Direita</button>
            </div>
          </div>
        )}

        {/* Modal Futurista ao Clicar nos Prédios 3D */}
        {selectedBuildingInfo && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 30, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', border: '2px solid #00ffff', borderRadius: '20px', padding: '24px', width: '320px', boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#00ffff', fontWeight: 'bold' }}>📡 {selectedBuildingInfo.name}</h3>
              <button onClick={() => setSelectedBuildingInfo(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>✖</button>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: 0 }}>Conectado via Fios de Chakra ao Núcleo IA. Acesse as redes oficiais do Emanuel:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href={mapInfo.kwaiLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: 'linear-gradient(45deg, #ff5500, #ff007f)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>🔥 Acessar Kwai Oficial</a>
              <a href={mapInfo.youtubeLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: '#ef4444', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>📺 Canal no YouTube</a>
              <a href={mapInfo.instagramLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>📸 Perfil do Instagram</a>
              <a href={mapInfo.tiktokLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: '#000', color: '#00f0ff', border: '1px solid #00f0ff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>🎵 TikTok Oficial</a>
              <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: '#10b981', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>💬 WhatsApp Direct</a>
            </div>
          </div>
        )}

        {/* Modal de Edição de Links */}
        {isEditing && (
          <div style={{ position: 'absolute', top: '80px', right: '16px', zIndex: 20, width: '310px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#a5b4fc', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginTop: 0 }}>
              ✏️ Editar Informações & Redes
            </h3>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Título do Mapa</label>
              <input type="text" value={mapInfo.title} onChange={(e) => setMapInfo({ ...mapInfo, title: e.target.value })} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#ff007f', display: 'block', marginBottom: '4px' }}>🔥 Kwai Link Oficial</label>
              <input type="text" value={mapInfo.kwaiLink} onChange={(e) => setMapInfo({ ...mapInfo, kwaiLink: e.target.value })} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #ff007f', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>YouTube Link</label>
              <input type="text" value={mapInfo.youtubeLink} onChange={(e) => setMapInfo({ ...mapInfo, youtubeLink: e.target.value })} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Instagram Link</label>
              <input type="text" value={mapInfo.instagramLink} onChange={(e) => setMapInfo({ ...mapInfo, instagramLink: e.target.value })} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>

            <button onClick={() => setIsEditing(false)} style={{ width: '100%', backgroundColor: '#4f46e5', color: '#fff', fontSize: '12px', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Concluir Alterações
            </button>
          </div>
        )}

        {/* Mini-Player Flutuante */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 15, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #00ffff', borderRadius: '16px', padding: minimizedPlayer ? '8px 12px' : '16px', width: minimizedPlayer ? 'auto' : '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00ffff' }}>📺 Mini-Player Telão 4K</span>
            <button onClick={() => setMinimizedPlayer(!minimizedPlayer)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              {minimizedPlayer ? '▲ Expandir' : '▼ Minimizar'}
            </button>
          </div>

          {!minimizedPlayer && (
            <div style={{ marginTop: '12px' }}>
              <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Caminho do Vídeo:</label>
              <input
                type="text"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="/naruto.mp4"
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '11px', padding: '6px', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: '9px', color: '#38bdf8', marginTop: '6px', margin: 0 }}>
                ● Conectado ao Núcleo de Chakra
              </p>
            </div>
          )}
        </div>

        {/* Rodapé com Botões de Zoom */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 10, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '12px', fontSize: '11px', color: '#94a3b8', border: '1px solid #1e293b', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span>🔍 Zoom:</span>
          <button onClick={() => handleZoom(-5)} style={{ padding: '2px 8px', background: '#1e293b', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
          <button onClick={() => handleZoom(5)} style={{ padding: '2px 8px', background: '#1e293b', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
        </div>

      </div>

      {/* 🌟 MODAL DE ARQUITETURA DO DATA CENTER (CLIQUE NO ROBOTOC 3D) 🌟 */}
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
            Sincronização Estrutural de Nós Orbitais no Mapa IA. Dados operando via Gemini AGI.
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

      {/* PAINEL DE JANELAS FUTURISTAS INTEGRADO (WIN11 CMD, NOTEPAD & ANDROID HUD) */}
      <FuturisticWindowManager />

    </div>
  );
}