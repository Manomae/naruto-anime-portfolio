import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function MapaIA() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  // States Oficiais
  const [prompt, setPrompt] = useState('Vila ninja de naruto com personagens, transito, carros, predios, mar e piscina');
  const [status, setStatus] = useState('Clique em qualquer lugar para ativar o som do Telão 🔊 ou clique nos prédios!');
  const [mapInfo, setMapInfo] = useState({
    id: Date.now(),
    title: 'Vila Ninja & Metrópole 3D',
    description: 'Vila com trânsito ativo, oceano, piscina e núcleo de redes sociais via fios de chakra.',
    googleLink: 'https://maps.google.com',
    youtubeLink: 'https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg',
    instagramLink: 'https://www.instagram.com/emanuelsilva432',
    kwaiLink: 'https://k.kwai.com/u/@ewnop969ok',
    facebookLink: 'https://facebook.com',
    tiktokLink: 'https://tiktok.com',
    threadsLink: 'https://threads.net',
    tags: ['#naruto', '#vilaninja', '#chakranode', '#kwai', '#transito', '#mar']
  });

  const [savedMaps, setSavedMaps] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('matrix');
  const [selectedBuildingInfo, setSelectedBuildingInfo] = useState(null);

  // States de Câmera Virtual, Mini-Player e Áudio
  const [walkMode, setWalkMode] = useState(false);
  const [minimizedPlayer, setMinimizedPlayer] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('/naruto.mp4');
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Three.js References
  const cityGroupRef = useRef(null);
  const trafficVehiclesRef = useRef([]);
  const waterMeshRef = useRef(null);
  const canvasTextureRef = useRef(null);
  const videoCtxRef = useRef(null);
  const videoElementRef = useRef(null);
  const chakraLinesGroupRef = useRef(null);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Carregar mapas salvos do localStorage
  useEffect(() => {
    const loaded = localStorage.getItem('naruto_ai_saved_maps');
    if (loaded) {
      try {
        setSavedMaps(JSON.parse(loaded));
      } catch (e) {
        console.error('Erro ao carregar mapas salvos:', e);
      }
    }
  }, []);

  // Inicialização da Cena 3D, Câmera, Telão e Fios de Chakra
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Cena e Câmera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(35, 25, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.01;
    controlsRef.current = controls;

    // 4. Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00ffff, 1.5);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00e5ff, 3, 80);
    pointLight.position.set(0, 25, 0);
    scene.add(pointLight);

    // 5. Chão em Grid
    const gridHelper = new THREE.GridHelper(80, 40, 0x00ffff, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Grupo Principal da Cidade
    const cityGroup = new THREE.Group();
    cityGroupRef.current = cityGroup;
    scene.add(cityGroup);

    // Canvas dinâmico secundário
    const vCanvas = document.createElement('canvas');
    vCanvas.width = 512;
    vCanvas.height = 256;
    const vCtx = vCanvas.getContext('2d');
    videoCtxRef.current = vCtx;

    const cTexture = new THREE.CanvasTexture(vCanvas);
    canvasTextureRef.current = cTexture;

    // 🎥 6. Telão de Vídeo 3D Elevado com Áudio
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

    // Gerar mapa inicial
    generateMapFromPrompt(prompt, cityGroup, scene);

    // 🔊 Ativar áudio no primeiro clique
    const handleUserInteraction = () => {
      if (videoElementRef.current) {
        videoElementRef.current.muted = false;
        setAudioEnabled(true);
        setStatus('🔊 Som do Telão Ativado em HD!');
      }
    };
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    // 🖱️ Evento de Clique nos Prédios 3D
    const handleCanvasClick = (event) => {
      if (!currentMount || !cityGroupRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(cityGroupRef.current.children, true);

      if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        if (clickedObj.userData && clickedObj.userData.isBuilding) {
          setSelectedBuildingInfo({
            name: clickedObj.userData.name || 'Prédio da Rede Social',
            id: clickedObj.id
          });
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Teclado para passear na Câmera Virtual
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

    // Loop de Animação
    let animationFrameId;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.03;

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
  }, [customVideoUrl]);

  // Alternar Modo de Câmera Virtual
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

  // Alternar Áudio
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

  // Desenhar canvas do Telão secundário
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

  // Gerador de elementos 3D + Fios de Chakra do Kankuro
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

    // 🌟 NÚCLEO CENTRAL DE CHAKRA FLUTUANTE
    const nucleusGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(2.8, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    const nucleusPos = new THREE.Vector3(0, 24, 0);
    nucleusGroup.position.copy(nucleusPos);
    nucleusGroup.add(coreMesh);
    group.add(nucleusGroup);

    // ⚡ FIOS DE CHAKRA DO KANKURO INTERLIGANDO O NÚCLEO ÀS ESTRUTURAS
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
      tags: Array.from(new Set([...generatedTags, '#chakra', '#kwai', '#3dmap', '#narutoai']))
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

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#090d16', color: '#f1f5f9', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      
      {/* Header Bar */}
      <header style={{ zIndex: 20, position: 'relative', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="/"
            title="Voltar ao Sistema Principal de Login"
            style={{ backgroundColor: '#1e293b', color: '#e2e8f0', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            🏠 <span>Core Login</span>
          </a>

          <a
            href="/espacial"
            style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #0284c7' }}
          >
            🚀 Mapa Espacial
          </a>

          <div>
            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold', background: 'linear-gradient(to right, #fb923c, #fef08a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Gerador 3D de Mapas IA
            </h1>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Vila Ninja, Fios de Chakra, Kwai & Redes Sociais</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleAudio}
            style={{ backgroundColor: audioEnabled ? '#10b981' : '#f59e0b', color: '#000', fontSize: '12px', padding: '8px 14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {audioEnabled ? '🔊 Som Ligado' : '🔇 Ligar Áudio'}
          </button>

          <button
            onClick={toggleWalkMode}
            style={{ backgroundColor: walkMode ? '#ef4444' : '#00ffff', color: '#000', fontSize: '12px', padding: '8px 14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px rgba(0,255,255,0.4)' }}
          >
            {walkMode ? '🚪 Sair do Passeio' : '📷 Câmera Virtual 3D'}
          </button>

          <a
            href="/mapaaeroespacial"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)', color: '#c084fc', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #9333ea' }}
          >
            🛰️ Central Aeroespacial
          </a>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{ backgroundColor: '#4f46e5', color: '#fff', fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isEditing ? 'Fechar Edição' : '✏️ Editar Info'}
          </button>
          
          <button
            onClick={handleSaveMap}
            style={{ backgroundColor: '#059669', color: '#fff', fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            💾 Salvar Mapa
          </button>
        </div>
      </header>

      {/* 3D Viewport Container */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 60px)' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

        {/* Floating Prompt Bar */}
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '90%', maxWidth: '650px' }}>
          <form
            onSubmit={handleGenerate}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', padding: '8px 12px', borderRadius: '16px', border: '1px solid rgba(249, 115, 22, 0.4)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ color: '#fb923c', fontSize: '18px', paddingLeft: '8px' }}>✨</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: vila ninja de naruto com carros, transito, mar e piscina..."
              style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: '#fff', width: '100%', padding: '4px' }}
            />
            <button
              type="submit"
              style={{ background: 'linear-gradient(to right, #ea580c, #d97706)', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Gerar Mapa
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#fdba74', marginTop: '6px', fontFamily: 'monospace' }}>{status}</p>
        </div>

        {/* Controles de Câmera de Passeio */}
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

        {/* Painel Lateral Esquerdo de Controles (Sempre Presente) */}
        <div style={{ position: 'absolute', top: '80px', left: '16px', zIndex: 10, width: '300px', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '16px', padding: '16px', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Mídia do Telão no Prédio
            </h3>
            <select
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#e2e8f0', borderRadius: '8px', padding: '8px', outline: 'none' }}
            >
              <option value="matrix">Vídeo 1: Cyberpunk / Redes Sociais</option>
              <option value="anime">Vídeo 2: Vila Ninja Feed & Kwai</option>
              <option value="stream">Vídeo 3: Transmissão ao Vivo Google</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Palavras-Chave Detectadas</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {mapInfo.tags.map((tag, idx) => (
                <span key={idx} style={{ fontSize: '10px', backgroundColor: 'rgba(67, 20, 7, 0.8)', color: '#fdba74', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(154, 52, 18, 0.5)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Meus Mapas Salvos ({savedMaps.length})
            </h3>

            {savedMaps.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>Nenhum mapa salvo ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedMaps.map((map) => (
                  <div
                    key={map.id}
                    style={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '10px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                  >
                    <div
                      onClick={() => handleLoadMap(map)}
                      style={{ cursor: 'pointer', flexGrow: 1, overflow: 'hidden' }}
                    >
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{map.title}</p>
                      <p style={{ fontSize: '10px', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{map.prompt}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMap(map.id)}
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '12px' }}
                      title="Excluir Mapa"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🌐 Modal Futurista ao Clicar nos Prédios 3D */}
        {selectedBuildingInfo && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 30, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', border: '2px solid #00ffff', borderRadius: '20px', padding: '24px', width: '320px', boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#00ffff', fontWeight: 'bold' }}>📡 {selectedBuildingInfo.name}</h3>
              <button onClick={() => setSelectedBuildingInfo(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>✖</button>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: 0 }}>Conectado via Fios de Chakra ao Núcleo IA. Acesse as redes oficiais:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href={mapInfo.kwaiLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: 'linear-gradient(45deg, #ff5500, #ff007f)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>🔥 Acessar Kwai Oficial</a>
              <a href={mapInfo.youtubeLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: '#ef4444', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>📺 Canal no YouTube</a>
              <a href={mapInfo.instagramLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>📸 Perfil do Instagram</a>
              <a href={mapInfo.googleLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: '#3b82f6', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>🌐 Conexão Google</a>
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

        {/* Mini-Player Flutuante & Minimizável do Telão */}
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
    </div>
  );
}