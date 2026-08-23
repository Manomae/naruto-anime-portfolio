import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { jsPDF } from "jspdf";

// Importação do Gerenciador de Janelas Futuristas
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaPatologiaLaboratorio3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const bolaHolograficaMeshRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const esferasLinks3DRef = useRef([]);

  // Estados de Interface e Diagnóstico
  const [filtroSistema, setFiltroSistema] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [sistemaSelecionado, setSistemaSelecionado] = useState(null);

  // Estados ROBOTOC DATA CENTER & ARQUITETURA 3D (ESTILO INDEX.JS)
  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);
  const [nuvemSelecionada, setNuvemSelecionada] = useState('google');

  // DADOS REAIS & REDES SOCIAIS EMANUEL DA SILVA
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

  // Redes Sociais Integradas Emanuel da Silva
  const redesOficiais = [
    { nome: 'YouTube', url: meusDadosReais.youtube, icone: '▶️' },
    { nome: 'TikTok', url: meusDadosReais.tiktok, icone: '🎵' },
    { nome: 'Instagram', url: meusDadosReais.instagram, icone: '📸' },
    { nome: 'Threads', url: meusDadosReais.threads, icone: '🧵' },
    { nome: 'GitHub', url: meusDadosReais.github, icone: '🐙' }
  ];

  // Base de Dados de Patologia e Análise Celular Educativa
  const catalogoBiologico = [
    {
      id: 'celular',
      nome: 'Núcleo Celular & Mitocôndrias',
      sistema: 'Celular',
      status: 'Homeostase Estável (99.4%)',
      biomarcadores: 'ATP Ótimo, Integridade de Membrana Preservada',
      detalhes: 'Monitoramento da respiração celular, síntese proteica e resposta a estresse oxidativo.',
      icone: '🧬',
      corHex: 0x00f0ff
    },
    {
      id: 'imune',
      nome: 'Sistema Imunológico & Leucócitos',
      sistema: 'Imunológico',
      status: 'Resposta Ativa Vigilante',
      biomarcadores: 'Linfócitos T & B Balanceados, Citocinas Regulares',
      detalhes: 'Vigilância imunológica de tecidos epiteliais e neutralização de agentes estranhos.',
      icone: '🛡️',
      corHex: 0x22c55e
    },
    {
      id: 'neural',
      nome: 'Sinapses & Rede Neuronal',
      sistema: 'Neural',
      status: 'Condução Sináptica 100%',
      biomarcadores: 'Neurotransmissores Dopamina/GABA Estáveis',
      detalhes: 'Mapeamento elétrico dos axônios e barreira hematoencefálica.',
      icone: '🧠',
      corHex: 0xa855f7
    },
    {
      id: 'cardio',
      nome: 'Microcirculação & Tecido Vascular',
      sistema: 'Cardiovascular',
      status: 'Perfusão Adequada (80 bpm)',
      biomarcadores: 'Hemoglobina Otimizada, Pressão Microvascular Normal',
      detalhes: 'Trocas gasosas e transporte de nutrientes nos leitos capilares.',
      icone: '🫀',
      corHex: 0xff007f
    }
  ];

  // ESTADO DE LINKS 3D ÓRBITA
  const [links3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube Emanuel', url: meusDadosReais.youtube, icone: '▶️', nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok Emanuel', url: meusDadosReais.tiktok, icone: '🎵', nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram Oficial', url: meusDadosReais.instagram, icone: '📸', nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'Repositório GitHub', url: meusDadosReais.github, icone: '🐙', nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'Contato WhatsApp Direct', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', nuvem: 'google' },
    { id: 6, tipo: 'facebook', titulo: 'Facebook Oficial', url: meusDadosReais.facebook, icone: '📘', nuvem: 'microsoft' },
    { id: 7, tipo: 'threads', titulo: 'Threads Oficial', url: meusDadosReais.threads, icone: '🧵', nuvem: 'apple' }
  ]);

  const abrirLinkExternoSeguro = (url) => {
    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Configuração e Renderização 3D Three.js com Estilo Completo do Index.js
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação Holográfica e Data Center Cyberpunk
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-5, 8, 5);
    scene.add(keyLight);

    const pointCyan = new THREE.PointLight(0x00f0ff, 4, 50);
    pointCyan.position.set(-8, 8, 8);
    scene.add(pointCyan);

    const pointMagenta = new THREE.PointLight(0xff007f, 4, 50);
    pointMagenta.position.set(8, -6, 6);
    scene.add(pointMagenta);

    // 🏬 ESTRUTURA 3D DO DATA CENTER GIGANTESCO DE DADOS (IGUAL AO INDEX.JS)
    const dataCenterGroup = new THREE.Group();

    // Piso Tátil com Grid Holográfico
    const floorGrid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1e293b);
    floorGrid.position.y = -2.5;
    dataCenterGroup.add(floorGrid);

    // Torres de Servidores (Racks 3D de Data Center)
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

    // 🧬 BOLA HOLOGRÁFICA PRINCIPAL DO CORE HISTOPATOLÓGICO
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
    bolaMesh.position.set(2.2, 0, 0);
    scene.add(bolaMesh);
    bolaHolograficaMeshRef.current = bolaMesh;

    // Anéis de Escaneamento Microscópico
    const ringGeo = new THREE.TorusGeometry(1.8, 0.03, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xff007f, transparent: true, opacity: 0.5 }));
    ringMesh1.position.set(2.2, 0, 0);
    ringMesh1.rotation.x = Math.PI / 2.5;
    scene.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.4 }));
    ringMesh2.position.set(2.2, 0, 0);
    ringMesh2.rotation.y = Math.PI / 3;
    scene.add(ringMesh2);

    // Esferas de Links 3D / Redes Sociais Órbita
    const linksGroup = new THREE.Group();
    esferasLinks3DRef.current = [];
    links3D.forEach((linkItem) => {
      const orbGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const colorHex = linkItem.nuvem === 'google' ? 0x4285f4 : 
                       linkItem.nuvem === 'apple' ? 0xffffff : 
                       linkItem.nuvem === 'microsoft' ? 0x00a4ef : 0xff007f;
      
      const orbMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.85 });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.userData = { url: linkItem.url, titulo: linkItem.titulo };
      linksGroup.add(orbMesh);
      esferasLinks3DRef.current.push(orbMesh);
    });
    scene.add(linksGroup);

    // 🤖 AVATAR ROBOTOC HUMANOIDE 3D (COMPLETO DO INDEX.JS)
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

    avatarGroup.position.set(-2.2, -1.2, 0);
    scene.add(avatarGroup);
    avatarGroupRef.current = avatarGroup;

    // Clique e Interação nos Elementos 3D
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersectsOrbs = raycaster.intersectObjects(esferasLinks3DRef.current);
      const intersectsAvatar = avatarGroupRef.current ? raycaster.intersectObjects(avatarGroupRef.current.children, true) : [];

      if (intersectsOrbs.length > 0) {
        const hitOrb = intersectsOrbs[0].object;
        if (hitOrb.userData && hitOrb.userData.url) {
          abrirLinkExternoSeguro(hitOrb.userData.url);
        }
      } else if (intersectsAvatar.length > 0) {
        setArquiteturaAberta(true);
        setMostrarOverlayRobotoc(false);
      }
    };

    const domContainer = mountRef.current;
    domContainer.addEventListener('click', handleClick);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (bolaHolograficaMeshRef.current) {
        bolaHolograficaMeshRef.current.rotation.y += 0.008;
        bolaHolograficaMeshRef.current.rotation.x += 0.004;
        bolaHolograficaMeshRef.current.position.y = Math.sin(elapsedTime * 2) * 0.15;

        ringMesh1.position.y = bolaHolograficaMeshRef.current.position.y;
        ringMesh2.position.y = bolaHolograficaMeshRef.current.position.y;
        ringMesh1.rotation.z = elapsedTime * 0.2;
        ringMesh2.rotation.x = elapsedTime * 0.25;

        esferasLinks3DRef.current.forEach((m, idx) => {
          const angle = elapsedTime * 0.8 + (idx * (Math.PI * 2 / esferasLinks3DRef.current.length));
          m.position.x = bolaHolograficaMeshRef.current.position.x + Math.cos(angle) * 2.2;
          m.position.z = bolaHolograficaMeshRef.current.position.z + Math.sin(angle) * 2.2;
          m.position.y = bolaHolograficaMeshRef.current.position.y + Math.sin(elapsedTime * 2 + idx) * 0.4;
        });
      }

      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.y = -1.2 + Math.sin(elapsedTime * 1.5) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domContainer.removeEventListener('click', handleClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [links3D]);

  // Exportar Laudo Laboratorial em PDF
  const exportarLaudoPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(8, 15, 30);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(0, 240, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("LABORATÓRIO DIGITAL & MAPA DE PATOLOGIA 3D", 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("SISTEMA DE ANÁLISE INTEGRADO AO MAPA DE RESSONÂNCIA | EMANUEL.OS", 14, 26);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text("DIAGNÓSTICO E MONITORAMENTO DE SISTEMAS BIOLÓGICOS", 14, 44);

    let yPos = 54;
    catalogoBiologico.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${index + 1}. ${item.nome} (${item.sistema})`, 14, yPos);

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Status: ${item.status}`, 14, yPos + 6);
      doc.text(`Biomarcadores: ${item.biomarcadores}`, 14, yPos + 12);
      const detalhesLinhas = doc.splitTextToSize(`Observações: ${item.detalhes}`, 180);
      doc.text(detalhesLinhas, 14, yPos + 18);

      yPos += 28 + (detalhesLinhas.length * 4);
    });

    doc.save("EmanuelOS_Laudo_Patologia_Laboratorio.pdf");
  };

  const itensFiltrados = catalogoBiologico.filter(item => {
    const correspondeFiltro = filtroSistema === 'todos' || item.sistema.toLowerCase() === filtroSistema.toLowerCase();
    const correspondeBusca = item.nome.toLowerCase().includes(termoBusca.toLowerCase()) || item.biomarcadores.toLowerCase().includes(termoBusca.toLowerCase());
    return correspondeFiltro && correspondeBusca;
  });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#030712',
      backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #030712 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Mapa de Patologia & Laboratório 3D | Emanuel.OS & ROBOTOC DATA CENTER</title>
      </Head>

      {/* HEADER PRINCIPAL COM NAVEGAÇÃO, ROBOTOC E REDES */}
      <header style={{ position: 'absolute', top: '15px', left: '20px', right: '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" style={{
            padding: '8px 14px', backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)'
          }}>
            ⬅ Voltar ao Core
          </Link>

          <Link href="/mapa-ressonancia" style={{
            padding: '8px 14px', backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981', color: '#34d399', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
          }}>
            🧠 Conectar à RM 3D
          </Link>

          <button onClick={() => setMostrarOverlayRobotoc(!mostrarOverlayRobotoc)} style={{ padding: '8px 14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            🤖 ROBOTOC HUD
          </button>

          <button onClick={() => setArquiteturaAberta(!arquiteturaAberta)} style={{ padding: '8px 14px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            🏛️ DATA CENTER 3D
          </button>
        </div>

        {/* REDES SOCIAIS INTEGRADAS EMANUEL DA SILVA */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {redesOficiais.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ padding: '6px 10px', backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{r.icone}</span> {r.nome}
            </a>
          ))}
        </div>
      </header>

      {/* THREE.JS CANVAS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* PAINEL ESQUERDO: FILTROS E PESQUISA DE BIOMARCADORES */}
      <div style={{
        position: 'absolute', top: '75px', left: '20px', width: '320px',
        backgroundColor: 'rgba(8, 15, 30, 0.90)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '16px', padding: '16px',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)', zIndex: 10
      }}>
        <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          🔍 PESQUISA & FILTRO DE SISTEMAS
        </span>

        <input
          type="text"
          placeholder="Pesquisar tecido, célula, biomarcador..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px', backgroundColor: '#020617',
            border: '1px solid #334155', borderRadius: '8px', color: '#fff',
            fontSize: '11px', outline: 'none', marginBottom: '10px', boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
          {['todos', 'celular', 'imunológico', 'neural', 'cardiovascular'].map(filtro => (
            <button
              key={filtro}
              onClick={() => setFiltroSistema(filtro)}
              style={{
                padding: '6px', borderRadius: '6px', border: '1px solid #00f0ff',
                backgroundColor: filtroSistema === filtro ? '#00f0ff' : 'transparent',
                color: filtroSistema === filtro ? '#000' : '#00f0ff',
                fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {filtro}
            </button>
          ))}
        </div>

        <button
          onClick={exportarLaudoPDF}
          style={{
            width: '100%', padding: '10px', backgroundColor: '#ff007f', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px',
            cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)'
          }}
        >
          📄 Exportar Laudo de Laboratório (.PDF)
        </button>
      </div>

      {/* PAINEL DIREITO: MONITORAMENTO DE TECIDOS E PATOLOGIA */}
      <div style={{
        position: 'absolute', top: '75px', right: '20px', width: '360px',
        maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
        backgroundColor: 'rgba(8, 15, 30, 0.90)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 0, 127, 0.4)', borderRadius: '16px', padding: '16px',
        boxShadow: '0 0 30px rgba(255, 0, 127, 0.2)', zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#ff007f', fontWeight: 'bold' }}>
            📊 MONITORAMENTO HISTOPATOLÓGICO
          </h3>
          <span style={{ fontSize: '9px', color: '#22c55e', fontFamily: 'monospace' }}>ONLINE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {itensFiltrados.map((item) => (
            <div
              key={item.id}
              onClick={() => setSistemaSelecionado(item)}
              style={{
                backgroundColor: '#020617', border: '1px solid #1e293b',
                borderRadius: '10px', padding: '12px', cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '11px', color: '#fff' }}>{item.icone} {item.nome}</strong>
                <span style={{ fontSize: '9px', color: '#38bdf8' }}>{item.sistema}</span>
              </div>
              <span style={{ fontSize: '9px', color: '#22c55e', display: 'block', marginBottom: '4px' }}>
                ● {item.status}
              </span>
              <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', lineHeight: '1.3' }}>
                {item.detalhes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🤖 OVERLAY ROBOTOC DATA CENTER (IGUAL AO INDEX.JS) */}
      {mostrarOverlayRobotoc && (
        <div style={{ position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(8,15,30,0.96)', border: '2px solid #00f0ff', borderRadius: '16px', padding: '18px', zIndex: 1000, width: '380px', color: '#fff', boxShadow: '0 0 30px rgba(0,240,255,0.4)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #00f0ff', paddingBottom: '8px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '13px', color: '#00f0ff', fontWeight: 'bold' }}>🤖 ROBOTOC DATA CENTER & NUVEM</h3>
            <button onClick={() => setMostrarOverlayRobotoc(false)} style={{ background: 'none', border: 'none', color: '#ff007f', fontSize: '16px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <button onClick={() => setNuvemSelecionada('google')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: nuvemSelecionada === 'google' ? '#4285f4' : '#1e293b', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Google Drive</button>
            <button onClick={() => setNuvemSelecionada('apple')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: nuvemSelecionada === 'apple' ? '#fff' : '#1e293b', color: nuvemSelecionada === 'apple' ? '#000' : '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>iCloud</button>
            <button onClick={() => setNuvemSelecionada('microsoft')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: nuvemSelecionada === 'microsoft' ? '#00a4ef' : '#1e293b', color: '#fff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>OneDrive</button>
          </div>
          <p style={{ fontSize: '10px', color: '#cbd5e1' }}>Sincronização histopatológica e biomarcadores integrados aos servidores de Emanuel da Silva.</p>
        </div>
      )}

      {/* 🏛️ ARQUITETURA DATA CENTER 3D & REDES SOCIAIS (IGUAL AO INDEX.JS) */}
      {arquiteturaAberta && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'rgba(7,12,28,0.96)', border: '2px solid #ff007f', borderRadius: '16px', padding: '16px', zIndex: 1000, width: '340px', color: '#fff', boxShadow: '0 0 25px rgba(255,0,127,0.4)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '12px', color: '#ff007f', fontWeight: 'bold' }}>🏛️ ARQUITETURA DATA CENTER 3D</h3>
            <button onClick={() => setArquiteturaAberta(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ fontSize: '10px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <div>• <b>Nó Patologia & Lab:</b> Ativo (Histopatologia)</div>
            <div>• <b>Nó Ressonância 3D:</b> Conectado (3.0 Tesla)</div>
            <div>• <b>Nó Orkut Social 3D:</b> Conectado (Rede Unificada)</div>
          </div>

          <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            🔗 REDES SOCIAIS MESTRES (EMANUEL DA SILVA):
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
            <a href={meusDadosReais.youtube} target="_blank" rel="noreferrer" style={{ padding: '6px 8px', backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #ff0000', color: '#ff4d4d', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>▶️ Canal YouTube Oficial</a>
            <a href={meusDadosReais.tiktok} target="_blank" rel="noreferrer" style={{ padding: '6px 8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>🎵 TikTok Oficial</a>
            <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '6px 8px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>📸 Instagram Oficial</a>
            <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '6px 8px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>💬 WhatsApp Direct</a>
            <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '6px 8px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold' }}>🐙 GitHub Principal</a>
          </div>
        </div>
      )}

      <FuturisticWindowManager />
    </div>
  );
}