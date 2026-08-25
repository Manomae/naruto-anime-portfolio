import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

// Importação do Gerenciador de Janelas Futuristas (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaEspacialEmanuelOS() {
  const mountRef = useRef(null);
  const [missaoSelecionada, setMissaoSelecionada] = useState(null);
  const [fogueteLancado, setFogueteLancado] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(null);

  // 🌟 CONTROLE DA BARRA FLUIDA SUPERIOR RETRÁTIL
  const [isBarraFluidaOpen, setIsBarraFluidaOpen] = useState(false);

  // 🤖 ESTADOS ROBOTOC ESPACIAL HUD & ARQUITETURA DATA CENTER 3D
  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);
  const [nuvemSelecionada, setNuvemSelecionada] = useState('google');

  const [abaAtiva, setAbaAtiva] = useState(null);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([
    { id: 1, texto: 'Mapear minerais e água em exoplanetas', horario: '09:00', status: 'Ativo' },
    { id: 2, texto: 'Recrutamento de astronautas para centro médico espacial', horario: '15:00', status: 'Pendente' }
  ]);
  const [linkGerado, setLinkGerado] = useState('');

  const [termoBusca, setTermoBusca] = useState('');
  const [sugestoesBusca, setSugestoesBusca] = useState([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('minerais');

  // References Three.js para interatividade em cena
  const robotocGroupRef = useRef(null);
  const robotocArmRef = useRef(null);
  const esferasLinks3DRef = useRef([]);

  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Aeroespacial Emanuel.OS)",
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

  const missoesEspaciais = [
    { id: 1, nome: 'Satélite AGI-Net 01', categoria: '🛰️ Satélite de Internet & IA Global', destino: 'Órbita Terrestre Baixa (LEO)', status: 'Operacional' },
    { id: 2, nome: 'Sonda Interplanetária Ares-X', categoria: '🪐 Exploração de Marte & Minerais', destino: 'Planeta Marte', status: 'Em Trânsito' },
    { id: 3, nome: 'Telescópio Orbital Deep-Vision', categoria: '🔭 Atmosfera & Espécies Desconhecidas', destino: 'Ponto Lagrange L1', status: 'Ativo' },
    { id: 4, nome: 'Foguete Propulsor Titan-V', categoria: '🚀 Veículo de Lançamento & Mísseis', destino: 'Base de Lançamento', status: 'Pronto para Propulsão' }
  ];

  // Links 3D Orbitais
  const [links3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube Emanuel', url: meusDadosReais.youtube, nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok Emanuel', url: meusDadosReais.tiktok, nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram Oficial', url: meusDadosReais.instagram, nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'Repositório GitHub', url: meusDadosReais.github, nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'WhatsApp Direct', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, nuvem: 'google' },
    { id: 6, tipo: 'threads', titulo: 'Threads Oficial', url: meusDadosReais.threads, nuvem: 'apple' }
  ]);

  const abrirLinkExterno = (url) => {
    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    setTempoAtual(new Date());
    const timer = setInterval(() => setTempoAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        console.error("Erro na busca espacial:", error);
      } finally {
        setCarregandoBusca(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000003);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Luzes Espaciais & Data Center
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(20, 20, 20);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x333355, 0.7);
    scene.add(ambientLight);

    const cyanSpot = new THREE.PointLight(0x00f0ff, 3, 50);
    cyanSpot.position.set(-10, 5, 10);
    scene.add(cyanSpot);

    // PLANETA TERRA 3D
    const terraGeo = new THREE.SphereGeometry(6, 64, 64);
    const terraMat = new THREE.MeshStandardMaterial({
      color: 0x114488,
      roughness: 0.8,
      metalness: 0.2,
      emissive: 0x002244,
      emissiveIntensity: 0.2
    });
    const terraMesh = new THREE.Mesh(terraGeo, terraMat);
    scene.add(terraMesh);

    // ATMOSFERA HOLOGRÁFICA
    const atmoGeo = new THREE.SphereGeometry(6.3, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosferaMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosferaMesh);

    // CAMPO DE ESTRELAS
    const estrelasGeo = new THREE.BufferGeometry();
    const posicoesEstrelas = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000 * 3; i++) {
      posicoesEstrelas[i] = (Math.random() - 0.5) * 300;
    }
    estrelasGeo.setAttribute('position', new THREE.BufferAttribute(posicoesEstrelas, 3));
    const estrelasMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 });
    const campoEstrelas = new THREE.Points(estrelasGeo, estrelasMat);
    scene.add(campoEstrelas);

    // SATÉLITE
    const sateliteGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sateliteMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.8 });
    const sateliteMesh = new THREE.Mesh(sateliteGeo, sateliteMat);
    scene.add(sateliteMesh);

    // FOGUETE
    const fogueteGeo = new THREE.ConeGeometry(0.4, 2, 16);
    const fogueteMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.5 });
    const fogueteMesh = new THREE.Mesh(fogueteGeo, fogueteMat);
    fogueteMesh.position.set(0, 6.5, 0);
    scene.add(fogueteMesh);

    // 🤖 AVATAR ROBOTOC ESPACIAL 3D (AJUDANTE DE COMANDO AEROESPACIAL)
    const robotocGroup = new THREE.Group();
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.1, emissive: 0x00f0ff, emissiveIntensity: 0.3 });
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 1.0 });

    // Cabeça ROBOTOC
    const headGeo = new THREE.SphereGeometry(0.5, 32, 32);
    headGeo.scale(1, 1.2, 1);
    const headMesh = new THREE.Mesh(headGeo, armorMat);
    headMesh.position.set(0, 2.5, 0);
    robotocGroup.add(headMesh);

    // Olhos HUD
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.18, 2.55, 0.45);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.18, 2.55, 0.45);
    robotocGroup.add(leftEye);
    robotocGroup.add(rightEye);

    // Tronco
    const chestGeo = new THREE.BoxGeometry(1.0, 1.0, 0.6);
    const chestMesh = new THREE.Mesh(chestGeo, suitMat);
    chestMesh.position.set(0, 1.4, 0);
    robotocGroup.add(chestMesh);

    // Placa peitoral
    const plateGeo = new THREE.BoxGeometry(0.8, 0.6, 0.15);
    const plateMesh = new THREE.Mesh(plateGeo, armorMat);
    plateMesh.position.set(0, 1.45, 0.3);
    robotocGroup.add(plateMesh);

    // Braço com Scanner Orbital
    const robotocArmGroup = new THREE.Group();
    robotocArmGroup.position.set(0.65, 1.6, 0);

    const shoulderGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, armorMat);
    robotocArmGroup.add(shoulderMesh);

    const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 16);
    const armMesh = new THREE.Mesh(armGeo, suitMat);
    armMesh.position.set(0.15, -0.4, 0.2);
    armMesh.rotation.x = -Math.PI / 4;
    robotocArmGroup.add(armMesh);

    // Ferramenta Scanner Laser Espacial
    const scannerGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.5, 16);
    const scannerMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.9 });
    const scannerMesh = new THREE.Mesh(scannerGeo, scannerMat);
    scannerMesh.position.set(0.2, -0.7, 0.5);
    scannerMesh.rotation.x = Math.PI / 2;
    robotocArmGroup.add(scannerMesh);

    // Cone do Feixe Laser
    const beamGeo = new THREE.ConeGeometry(0.35, 1.8, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35, wireframe: true });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0.2, -0.7, 1.5);
    beamMesh.rotation.x = -Math.PI / 2;
    robotocArmGroup.add(beamMesh);

    robotocGroup.add(robotocArmGroup);
    robotocArmRef.current = robotocArmGroup;

    robotocGroup.position.set(-8, -1, 4);
    scene.add(robotocGroup);
    robotocGroupRef.current = robotocGroup;

    // ESFERAS DE LINKS 3D ORBITANDO ROBOTOC
    const esferasGroup = new THREE.Group();
    esferasLinks3DRef.current = [];

    links3D.forEach((l) => {
      const orbGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const colorHex = l.nuvem === 'google' ? 0x4285f4 : l.nuvem === 'apple' ? 0xffffff : l.nuvem === 'microsoft' ? 0x00a4ef : 0xff007f;
      const orbMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.8 });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.userData = { url: l.url, titulo: l.titulo };
      esferasGroup.add(orbMesh);
      esferasLinks3DRef.current.push(orbMesh);
    });
    scene.add(esferasGroup);

    // INTERAÇÃO CLICK NA CENA
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e) => {
      if (!currentMount) return;
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersectsOrbs = raycaster.intersectObjects(esferasLinks3DRef.current);
      const intersectsRobotoc = robotocGroupRef.current ? raycaster.intersectObjects(robotocGroupRef.current.children, true) : [];

      if (intersectsOrbs.length > 0) {
        const hit = intersectsOrbs[0].object;
        if (hit.userData && hit.userData.url) {
          abrirLinkExterno(hit.userData.url);
        }
      } else if (intersectsRobotoc.length > 0) {
        setArquiteturaAberta(true);
      }
    };

    currentMount.addEventListener('click', handleClick);

    let anguloOrbita = 0;
    let posYFoguete = 6.5;
    let lancando = false;
    let clock = new THREE.Clock();

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      terraMesh.rotation.y += 0.001;
      atmosferaMesh.rotation.y += 0.0012;
      campoEstrelas.rotation.y += 0.0002;

      // Órbita Satélite
      anguloOrbita += 0.01;
      const raioOrbita = 9;
      sateliteMesh.position.x = Math.cos(anguloOrbita) * raioOrbita;
      sateliteMesh.position.z = Math.sin(anguloOrbita) * raioOrbita;
      sateliteMesh.position.y = Math.sin(anguloOrbita * 2) * 2;

      // Animação ROBOTOC
      if (robotocGroupRef.current) {
        robotocGroupRef.current.position.y = -1 + Math.sin(elapsedTime * 2) * 0.15;
        robotocGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.8) * 0.2;
      }
      if (robotocArmRef.current) {
        robotocArmRef.current.rotation.z = Math.sin(elapsedTime * 2.5) * 0.15;
      }

      // Animação das Esferas de Links 3D
      esferasLinks3DRef.current.forEach((orb, idx) => {
        const angle = elapsedTime * 0.8 + (idx * (Math.PI * 2 / esferasLinks3DRef.current.length));
        orb.position.x = -8 + Math.cos(angle) * 2.2;
        orb.position.z = 4 + Math.sin(angle) * 2.2;
        orb.position.y = -1 + Math.sin(elapsedTime * 2 + idx) * 0.4;
      });

      // Lançamento Foguete
      if (fogueteLancado || lancando) {
        lancando = true;
        posYFoguete += 0.12;
        fogueteMesh.position.y = posYFoguete;
        if (posYFoguete > 25) {
          posYFoguete = 6.5;
          setFogueteLancado(false);
          lancando = false;
        }
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
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('click', handleClick);
        if (renderer.domElement) currentMount.removeChild(renderer.domElement);
      }
    };
  }, [fogueteLancado, links3D]);

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
    setMissaoSelecionada({
      nome: item.display_name.split(',')[0],
      categoria: `🚀 Análise Planetária (${filtroCategoria.toUpperCase()})`,
      destino: `LAT: ${parseFloat(item.lat).toFixed(4)} | LON: ${parseFloat(item.lon).toFixed(4)}`,
      status: 'Análise Concluída'
    });
    setTermoBusca('');
    setSugestoesBusca([]);
    setIsBarraFluidaOpen(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000003', overflow: 'hidden', position: 'relative', fontFamily: '"Segoe UI", sans-serif' }}>
      <Head>
        <title>Emanuel.OS - Central Aeroespacial 3D</title>
      </Head>

      {/* CABEÇALHO */}
      <header style={{ position: 'absolute', top: '15px', left: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '18px', margin: 0, color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>
          🚀 EMANUEL.OS <span style={{ color: '#00f0ff' }}>CENTRAL AEROESPACIAL</span>
        </h1>
        <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold' }}>
          Pesquisa de Minerais, Espécies Desconhecidas, Tecnologias & Centro Médico Espacial
        </span>
      </header>

      {/* NAVEGAÇÃO COMPLETA DE IDA E VOLTA + ROBOTOC HUD & ARQUITETURA DATA CENTER */}
      <div style={{ position: 'absolute', top: '15px', right: '30px', zIndex: 30, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <a href="/" style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '15px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🏠 Core Login
        </a>
        <a href="/mapa-ia" style={{ padding: '8px 14px', backgroundColor: 'rgba(234, 88, 12, 0.2)', color: '#fb923c', border: '1px solid #ea580c', borderRadius: '15px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
          ⚡ Mapa IA & Redes Sociais
        </a>
        <button onClick={() => setMostrarOverlayRobotoc(!mostrarOverlayRobotoc)} style={{ padding: '8px 14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 10px rgba(0,240,255,0.5)' }}>
          🤖 ROBOTOC HUD
        </button>
        <button onClick={() => setArquiteturaAberta(!arquiteturaAberta)} style={{ padding: '8px 14px', backgroundColor: '#10b981', color: '#000', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
          🏛️ ARQUITETURA DATA CENTER 3D
        </button>
      </div>

      {/* 🌟 BARRA FLUIDA SUPERIOR RETRÁTIL */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '90%', maxWidth: '520px' }}>
        
        {/* Puxador da Barra Fluida */}
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
          <span>{isBarraFluidaOpen ? '▲ Recolher Painel Aeroespacial' : '▼ Puxe para Baixo (Pesquisa Espacial & Filtros)'}</span>
        </div>

        {/* Conteúdo Oculto da Barra Fluida */}
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
                placeholder="🔍 Pesquise pedras, minerais, exoplanetas ou astronautas..."
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

            <div style={{ display: 'flex', gap: '5px', marginTop: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setFiltroCategoria('minerais')} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00f0ff', background: filtroCategoria === 'minerais' ? '#00f0ff' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'minerais' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🪨 Pedras & Minerais</button>
              <button onClick={() => setFiltroCategoria('especies')} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00ff66', background: filtroCategoria === 'especies' ? '#00ff66' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'especies' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🧬 Espécies Desconhecidas</button>
              <button onClick={() => setFiltroCategoria('planetas')} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #ffaa00', background: filtroCategoria === 'planetas' ? '#ffaa00' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'planetas' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🪐 Aprendizado Planetas</button>
              <button onClick={() => setFiltroCategoria('astronautas')} style={{ padding: '5px 10px', fontSize: '9px', borderRadius: '10px', border: '1px solid #ff00aa', background: filtroCategoria === 'astronautas' ? '#ff00aa' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'astronautas' ? '#fff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>👨‍🚀 Centro Médico Espacial</button>
            </div>

            {sugestoesBusca.length > 0 && (
              <ul style={{
                listStyle: 'none',
                margin: '10px 0 0 0',
                padding: '8px',
                backgroundColor: '#09090b',
                border: '1px solid rgba(0, 240, 255, 0.5)',
                borderRadius: '12px',
                maxHeight: '180px',
                overflowY: 'auto'
              }}>
                {sugestoesBusca.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => selecionarLocalPesquisado(item)}
                    style={{
                      padding: '8px',
                      fontSize: '11px',
                      color: '#e4e4e7',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer'
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

      {/* PROPULSÃO & CLOUD */}
      <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 25, display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setFogueteLancado(true)}
          style={{ padding: '8px 16px', background: 'rgba(255,0,85,0.2)', border: '1px solid #ff0055', color: '#fff', borderRadius: '20px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 15px rgba(255,0,85,0.4)' }}
        >
          🚀 Iniciar Propulsão de Foguete
        </button>
        <button onClick={() => setAbaAtiva('agenda')} style={{ padding: '8px 14px', background: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '12px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          📅 Agenda IA
        </button>
        <button onClick={() => setAbaAtiva('link')} style={{ padding: '8px 14px', background: 'rgba(255,0,170,0.15)', border: '1px solid #ff00aa', color: '#ff00aa', borderRadius: '12px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          🔗 Link Cloud
        </button>
      </div>

      {/* RELÓGIO & STATUS */}
      <div style={{ position: 'absolute', top: '80px', left: '30px', zIndex: 15, backgroundColor: 'rgba(7, 12, 28, 0.85)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(15px)', width: '280px', color: '#fff' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00f0ff', marginBottom: '4px' }}>
          📅 {tempoAtual ? tempoAtual.toLocaleDateString('pt-BR') : 'Carregando...'} - 🕒 {tempoAtual ? tempoAtual.toLocaleTimeString('pt-BR') : '--:--:--'}
        </div>
        <div style={{ fontSize: '10px', color: '#e4e4e7', marginBottom: '4px' }}>
          🌌 Atmosfera 3D: Estável | Órbita LEO Ativa
        </div>
        <div style={{ fontSize: '9px', color: '#00ff66', backgroundColor: 'rgba(0,255,102,0.1)', padding: '5px', borderRadius: '6px', border: '1px solid rgba(0,255,102,0.3)', fontWeight: 'bold' }}>
          🛰️ Satélites AGI Transmitindo Sinal Global
        </div>
      </div>

      {/* CANVAS THREE.JS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* MODAL AGENDA/LINK */}
      {abaAtiva && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', backgroundColor: 'rgba(7, 12, 28, 0.98)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '22px', zIndex: 40, backdropFilter: 'blur(30px)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#00f0ff', fontSize: '16px', fontWeight: '900' }}>
              {abaAtiva === 'agenda' && '📅 Agendador de Tarefas IA'}
              {abaAtiva === 'link' && '🔗 Publicador de Links Online'}
            </h3>
            <button onClick={() => setAbaAtiva(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
          </div>

          {abaAtiva === 'agenda' && (
            <div>
              <form onSubmit={adicionarTarefa} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Nova tarefa espacial..." 
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
                Publique relatórios de dados e arquivos do Google Drive instantaneamente na nuvem do Emanuel.OS.
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

      {/* PAINEL LATERAL DE CONTATOS DO EMANUEL & MISSÕES */}
      <aside style={{ position: 'absolute', right: '30px', bottom: '30px', width: '360px', backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '20px', padding: '20px', backdropFilter: 'blur(25px)', zIndex: 20, color: '#fff' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#00f0ff', fontWeight: '900' }}>🪐 MISSÕES DO SISTEMA SOLAR</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
          {missoesEspaciais.map((m) => (
            <div key={m.id} onClick={() => setMissaoSelecionada(m)} style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{m.nome}</div>
              <div style={{ fontSize: '10px', color: '#a1a1aa' }}>{m.categoria}</div>
              <div style={{ fontSize: '9px', color: '#00f0ff', marginTop: '2px' }}>📍 Destino: {m.destino}</div>
            </div>
          ))}
        </div>

        <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🔗 CENTRAL DE CONTATOS DO EMANUEL:</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
          <a href={meusDadosReais.youtube} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #ff0000', color: '#ff4d4d', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>▶️ Canal YouTube Oficial</a>
          <a href={meusDadosReais.tiktok} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🎵 TikTok Oficial</a>
          <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>📸 Instagram Oficial</a>
          <a href={meusDadosReais.threads} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🧵 Threads Oficial</a>
          <a href={meusDadosReais.facebook} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(24, 119, 242, 0.15)', border: '1px solid #1877f2', color: '#1877f2', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>📘 Facebook Oficial</a>
          <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '8px', backgroundColor: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffc800', color: '#ffc800', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>✉️ E-mail Direto ({meusDadosReais.email})</a>
          <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>💬 WhatsApp: {meusDadosReais.whatsappFormatado}</a>
          <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '8px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>🐙 GitHub Principal</a>
        </div>
      </aside>

      {/* 🤖 OVERLAY ROBOTOC ESPACIAL HUD & MULTICLOUD */}
      {mostrarOverlayRobotoc && (
        <div style={{ position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(8,15,30,0.96)', border: '2px solid #00f0ff', borderRadius: '16px', padding: '18px', zIndex: 1000, width: '380px', color: '#fff', boxShadow: '0 0 30px rgba(0,240,255,0.4)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #00f0ff', paddingBottom: '8px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '13px', color: '#00f0ff', fontWeight: 'bold' }}>🤖 ROBOTOC ESPACIAL & NUVEM AGI</h3>
            <button onClick={() => setMostrarOverlayRobotoc(false)} style={{ background: 'none', border: 'none', color: '#ff007f', fontSize: '16px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <button onClick={() => setNuvemSelecionada('google')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: nuvemSelecionada === 'google' ? '#4285f4' : '#1e293b', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Google Drive</button>
            <button onClick={() => setNuvemSelecionada('apple')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: nuvemSelecionada === 'apple' ? '#fff' : '#1e293b', color: nuvemSelecionada === 'apple' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>iCloud</button>
            <button onClick={() => setNuvemSelecionada('microsoft')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: nuvemSelecionada === 'microsoft' ? '#00a4ef' : '#1e293b', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>OneDrive</button>
          </div>
          <p style={{ fontSize: '10px', color: '#cbd5e1' }}>Sincronização de dados orbitais, relatórios de minerais e telemetria aeroespacial com a nuvem de Emanuel da Silva.</p>
        </div>
      )}

      {/* 🏛️ ARQUITETURA DATA CENTER 3D FIXA (MODELO EXATO DA FOTO ENVIADA) */}
      {arquiteturaAberta && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'rgba(7, 12, 28, 0.96)', border: '2px solid #00f0ff', borderRadius: '16px', padding: '16px', zIndex: 1000, width: '360px', color: '#fff', boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '13px', color: '#00f0ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏛️ ARQUITETURA DATA CENTER 3D
            </h3>
            <button onClick={() => setArquiteturaAberta(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>

          <p style={{ fontSize: '9px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.3' }}>
            Sincronização Estrutural de Nós Orbitais no Mapa Terrestre. Dados operando via Gemini AGI.
          </p>

          {/* NÓS ORBITAIS DE ARMAZENAMENTO ATIVOS */}
          <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              🌐 NÓS ORBITAIS DE ARMAZENAMENTO ATIVOS
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', padding: '6px 8px', borderRadius: '6px', border: '1px solid #4285f4' }}>
                <span style={{ fontSize: '10px', color: '#4285f4', fontWeight: 'bold' }}>☁️ Google Drive & Gmail</span>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>15 GB / 2 TB (Stable)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>🍋 Apple iCloud</span>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Nó Orbital / Backups</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', padding: '6px 8px', borderRadius: '6px', border: '1px solid #00a4ef' }}>
                <span style={{ fontSize: '10px', color: '#00a4ef', fontWeight: 'bold' }}>💻 Microsoft OneDrive</span>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Vault Empresarial</span>
              </div>
            </div>
          </div>

          {/* LINKS MESTRES & REDES SOCIAIS EMANUEL DA SILVA */}
          <span style={{ fontSize: '9px', color: '#ff007f', fontWeight: 'bold', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
            🔗 LINKS MESTRES & REDES SOCIAIS (EMANUEL):
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
            <a href={meusDadosReais.youtube} target="_blank" rel="noreferrer" style={{ padding: '7px 10px', backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #ff0000', color: '#ff4d4d', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>▶️ Canal YouTube Oficial</a>
            <a href={meusDadosReais.tiktok} target="_blank" rel="noreferrer" style={{ padding: '7px 10px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>🎵 TikTok Oficial</a>
            <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '7px 10px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>📸 Instagram Oficial</a>
            <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '7px 10px', backgroundColor: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308', color: '#fde047', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>✉️ E-mail Direto ({meusDadosReais.email})</a>
            <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '7px 10px', backgroundColor: 'rgba(0, 255, 102, 0.15)', border: '1px solid #00ff66', color: '#4ade80', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>💬 WhatsApp: {meusDadosReais.whatsappFormatado}</a>
            <a href={meusDadosReais.threads} target="_blank" rel="noreferrer" style={{ padding: '7px 10px', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>🧵 Threads Oficial</a>
            <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '7px 10px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>🐙 GitHub Principal</a>
          </div>
        </div>
      )}

      {/* PAINEL DE JANELAS FUTURISTAS INTEGRADO (WIN11 CMD, NOTEPAD & ANDROID HUD) */}
      <FuturisticWindowManager />
    </div>
  );
}