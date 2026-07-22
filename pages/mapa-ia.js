import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function MapaIA() {
  const mountRef = useRef(null);
  
  // States
  const [prompt, setPrompt] = useState('Vila ninja de naruto com personagens, transito, carros, predios, mar e piscina');
  const [status, setStatus] = useState('Pronto para gerar seu mapa!');
  const [mapInfo, setMapInfo] = useState({
    id: Date.now(),
    title: 'Vila Ninja & Metrópole 3D',
    description: 'Vila com trânsito ativo, oceano, piscina e telão de redes sociais.',
    googleLink: 'https://maps.google.com',
    youtubeLink: 'https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg',
    instagramLink: 'https://www.instagram.com/emanuelsilva432',
    tags: ['#naruto', '#vilaninja', '#transito', '#mar', '#piscina']
  });

  const [savedMaps, setSavedMaps] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('matrix');

  // Three.js References
  const sceneRef = useRef(null);
  const cityGroupRef = useRef(null);
  const trafficVehiclesRef = useRef([]);
  const waterMeshRef = useRef(null);
  const canvasTextureRef = useRef(null);
  const videoCtxRef = useRef(null);

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

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(35, 25, 45);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 2, 60);
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    // 5. Ground Grid
    const gridHelper = new THREE.GridHelper(80, 40, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Main City Group Container
    const cityGroup = new THREE.Group();
    cityGroupRef.current = cityGroup;
    scene.add(cityGroup);

    const vCanvas = document.createElement('canvas');
    vCanvas.width = 512;
    vCanvas.height = 256;
    const vCtx = vCanvas.getContext('2d');
    videoCtxRef.current = vCtx;

    const cTexture = new THREE.CanvasTexture(vCanvas);
    canvasTextureRef.current = cTexture;

    // Initial Map Generation
    generateMapFromPrompt(prompt, cityGroup, scene);

    // Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cityGroup.rotation.y += deltaX * 0.005;
      camera.position.y = Math.max(5, Math.min(80, camera.position.y - deltaY * 0.1));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      camera.position.z = Math.max(10, Math.min(100, camera.position.z + e.deltaY * 0.03));
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    currentMount.addEventListener('wheel', onWheel);

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
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      currentMount.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const updateVideoCanvas = () => {
    const ctx = videoCtxRef.current;
    if (!ctx) return;
    const now = Date.now() * 0.003;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    if (selectedVideo === 'matrix') {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('NARUTO AI // REDE SOCIAL LIVE', 20, 60);
      ctx.fillText(`TRANSMISSÃO: ${mapInfo.title.substring(0, 20)}`, 20, 110);
      ctx.fillStyle = '#059669';
      ctx.fillRect(20, 140, (Math.sin(now) + 1) * 220, 15);
      ctx.fillStyle = '#34d399';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Google: ${mapInfo.googleLink}`, 20, 190);
    } else if (selectedVideo === 'anime') {
      const grad = ctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#ef4444');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('🍃 VILA NINJA FEED', 30, 80);
      ctx.font = '18px sans-serif';
      ctx.fillText(`YT: ${mapInfo.youtubeLink}`, 30, 130);
      ctx.fillText(`IG: ${mapInfo.instagramLink}`, 30, 170);
    } else {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('STREAMING REDES SOCIAIS', 20, 90);
      ctx.font = '16px sans-serif';
      ctx.fillText(`Link Principal: ${mapInfo.googleLink}`, 20, 150);
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
      group.add(building);

      if (hasNinja && i % 2 === 0) {
        const roofGeo = new THREE.ConeGeometry(width * 0.8, 3, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(x, height + 1.5, z);
        roof.rotation.y = Math.PI / 4;
        group.add(roof);
      }

      if (i === 0) {
        building.scale.set(1.4, 1.8, 1.4);
        const screenGeo = new THREE.PlaneGeometry(12, 6);
        const screenMat = new THREE.MeshBasicMaterial({ map: canvasTextureRef.current });
        const screenMesh = new THREE.Mesh(screenGeo, screenMat);
        screenMesh.position.set(x, height * 1.3, z + depth * 0.7);
        group.add(screenMesh);
      }
    }

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
      tags: Array.from(new Set([...generatedTags, '#3dmap', '#narutoai']))
    }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt) return;
    setStatus('⚡ Processando IA e gerando elementos no mapa...');
    generateMapFromPrompt(prompt);
    setTimeout(() => {
      setStatus('✨ Mapa atualizado com sucesso!');
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
      
      {/* Header Bar com Navegação Integrada Corrigida */}
      <header style={{ zIndex: 20, position: 'relative', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Botão Core Login */}
          <a
            href="/"
            title="Voltar ao Sistema Principal de Login"
            style={{ backgroundColor: '#1e293b', color: '#e2e8f0', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            🏠 <span>Core Login</span>
          </a>

          {/* Link para o Mapa Espacial Real */}
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
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Vila Ninja, Trânsito, Mar, Piscinas & Telões 3D</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Link para o Mapa Aeroespacial Internacional (O Futuro) no lado direito */}
          <a
            href="/mapaaeroespacial"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)', color: '#c084fc', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #9333ea' }}
          >
            🛰️ Central Aeroespacial Internacional <span style={{ fontSize: '9px', opacity: 0.8 }}>(Em Desenv.)</span>
          </a>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{ backgroundColor: '#4f46e5', color: '#fff', fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isEditing ? 'Fechar Edição' : '✏️ Editar Informações'}
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

        {/* Top Floating Prompt Bar */}
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

        {/* Left Side Control Box */}
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
              <option value="anime">Vídeo 2: Vila Ninja Feed</option>
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

        {/* Right Side Editing Modal */}
        {isEditing && (
          <div style={{ position: 'absolute', top: '80px', right: '16px', zIndex: 20, width: '300px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#a5b4fc', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginTop: 0 }}>
              ✏️ Editar Informações do Mapa
            </h3>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Título do Mapa</label>
              <input
                type="text"
                value={mapInfo.title}
                onChange={(e) => setMapInfo({ ...mapInfo, title: e.target.value })}
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Descrição</label>
              <textarea
                value={mapInfo.description}
                onChange={(e) => setMapInfo({ ...mapInfo, description: e.target.value })}
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', height: '60px', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Link Google / Maps</label>
              <input
                type="text"
                value={mapInfo.googleLink}
                onChange={(e) => setMapInfo({ ...mapInfo, googleLink: e.target.value })}
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>YouTube Link</label>
              <input
                type="text"
                value={mapInfo.youtubeLink}
                onChange={(e) => setMapInfo({ ...mapInfo, youtubeLink: e.target.value })}
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Instagram Link</label>
              <input
                type="text"
                value={mapInfo.instagramLink}
                onChange={(e) => setMapInfo({ ...mapInfo, instagramLink: e.target.value })}
                style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px', color: '#fff', padding: '8px', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={() => setIsEditing(false)}
              style={{ width: '100%', backgroundColor: '#4f46e5', color: '#fff', fontSize: '12px', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Concluir Alterações
            </button>
          </div>
        )}

        {/* Viewport Hint Label */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 10, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '12px', fontSize: '11px', color: '#94a3b8', border: '1px solid #1e293b', display: 'flex', gap: '16px' }}>
          <span>🖱️ Arraste para Girar</span>
          <span>📜 Scroll para Zoom</span>
        </div>
      </div>
    </div>
  );
}