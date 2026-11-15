import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as THREE from 'three';

// =========================================================================================
// 🤖 --- HELPER DE MODELAGEM 3D DO ROBOTOC (MESMA IDENTIDADE VISUAL DO INDEX.JS) ---
// =========================================================================================
function criarModeloRobotocNav3D() {
  const robotGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const chromeSilverMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.2,
    metalness: 0.92
  });

  const metallicBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.25,
    metalness: 0.75
  });

  const darkScreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x020617,
    roughness: 0.08,
    metalness: 0.3,
    clearcoat: 1.0
  });

  const cyanLedMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 3.2,
    roughness: 0.1
  });

  // 1. CABEÇA
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.52, 36, 36), whiteArmorMat);
  headBase.scale.set(1.12, 0.94, 0.98);
  headGroup.add(headBase);

  const helmetBand = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.28, 32), chromeSilverMat);
  helmetBand.rotation.z = Math.PI / 2;
  helmetBand.scale.set(0.95, 1.08, 0.95);
  headGroup.add(helmetBand);

  const crestBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.26), whiteArmorMat);
  crestBase.position.set(0, 0.50, 0.02);
  const crestLed = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.06), cyanLedMat);
  crestLed.position.set(0, 0.51, 0.14);
  headGroup.add(crestBase, crestLed);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.36, 0.18), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.43);
  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.30, 0.19), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.435);
  headGroup.add(visorFrame, visorScreen);

  const eyeGeo = new THREE.SphereGeometry(0.085, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.15, 0.95, 0.35);
  eyeL.position.set(-0.17, -0.02, 0.52);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.15, 0.95, 0.35);
  eyeR.position.set(0.17, -0.02, 0.52);
  headGroup.add(eyeL, eyeR);

  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    const earOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.10, 24), chromeSilverMat);
    earOuter.rotation.z = Math.PI / 2;
    const earRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 16, 32), metallicBlueMat);
    earRing.rotation.y = Math.PI / 2;
    earRing.position.x = side * 0.03;
    earGroup.add(earOuter, earRing);
    earGroup.position.set(side * 0.57, -0.02, 0);
    headGroup.add(earGroup);
  });

  robotGroup.add(headGroup);

  // PESCOÇO E TRONCO
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  const neckCollar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 16, 32), metallicBlueMat);
  neckCollar.rotation.x = Math.PI / 2;
  neckCollar.position.set(0, 0.46, 0);
  robotGroup.add(neck, neckCollar);

  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.55, 32), whiteArmorMat);
  chestArmor.scale.set(1.15, 1, 0.85);
  chestArmor.position.set(0, 0.18, 0);
  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 0.34), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.26, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.20, 0.26);
  torsoGroup.add(chestArmor, chestBlueTrim, chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.25 - i * 0.015, 0.24 - i * 0.015, 0.08, 24), chromeSilverMat);
    abSeg.scale.set(1.1, 1, 0.85);
    abSeg.position.set(0, -0.14 - i * 0.10, 0);
    torsoGroup.add(abSeg);
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.20, 0.22, 24), whiteArmorMat);
  pelvis.scale.set(1.15, 1, 0.88);
  pelvis.position.set(0, -0.45, 0);
  torsoGroup.add(pelvis);
  robotGroup.add(torsoGroup);

  // BRAÇOS
  const criarBraco = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.46, 0.34, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), chromeSilverMat);
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.28, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.18, 0);
    upperArm.rotation.z = lado * 0.15;
    armPivot.add(shoulder, upperArm);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.07, -0.34, 0);
    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), metallicBlueMat);
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.125, 0.32, 24), chromeSilverMat);
    forearm.position.set(0, -0.18, 0);
    elbowGroup.add(elbowJoint, forearm);
    armPivot.add(elbowGroup);

    return { armPivot, elbowGroup };
  };

  const rightArm = criarBraco(-1);
  rightArm.armPivot.rotation.z = -0.18;
  robotGroup.add(rightArm.armPivot);

  const leftArm = criarBraco(1);
  leftArm.armPivot.rotation.z = 0.65;
  leftArm.elbowGroup.rotation.z = 1.65;
  robotGroup.add(leftArm.armPivot);

  // PERNAS
  [-1, 1].forEach((side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.17, -0.52, 0);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.26, 20), chromeSilverMat);
    thigh.position.set(0, -0.15, 0);
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.135, 0.30, 24), chromeSilverMat);
    shin.position.set(0, -0.46, 0);
    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.34), whiteArmorMat);
    footBase.position.set(0, -0.66, 0.05);
    legGroup.add(thigh, shin, footBase);
    robotGroup.add(legGroup);
  });

  return {
    robotGroup,
    headGroup,
    leftElbowGroup: leftArm.elbowGroup,
    eyeL,
    eyeR
  };
}

// =========================================================================================
// 🌐 --- BASE DE CONHECIMENTO INTERLIGADA AO MAPA TERRA 3D DO INDEX.JS + IMAGENS ---
// =========================================================================================
const BASE_DADOS_ROBOTOC_NAV = [
  {
    id: 1,
    nome: 'Emanuel.OS Core Data Center 01',
    categoria: '🖥️ Servidor de Dados & Nuvem Gemini AGI',
    cor: 0x00f0ff,
    lat: -3.7172,
    lng: -38.5437,
    ipCriptografado: 'AES256-88F9-EMA',
    trabalho: 'Engenharia de Software & AGI Node',
    resumo: 'Núcleo central de processamento quântico e sincronização neural localizado em Fortaleza/CE. Opera os 12 mapas interativos e a infraestrutura G-AGI.',
    imagem: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437'
  },
  {
    id: 2,
    nome: 'Estação Oceanográfica & Biologia Marinha',
    categoria: '🌊 Pesquisa de Espécies & Biofarmacêutica',
    cor: 0x00aaff,
    lat: -12.9714,
    lng: -38.5014,
    ipCriptografado: 'AES256-OCEAN-BIO',
    trabalho: 'Análise de Mapeamento Fluvial',
    resumo: 'Base costeira avançada dedicada ao monitoramento de ecossistemas marinhos, correntes oceânicas e descoberta de compostos biofarmacêuticos.',
    imagem: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-12.9714,-38.5014'
  },
  {
    id: 3,
    nome: 'Usina Nuclear Central & Reator Limpo',
    categoria: '⚛️ Geração Nuclear, Fusão & Energia Limpa',
    cor: 0x00ffcc,
    lat: -23.0062,
    lng: -44.3182,
    ipCriptografado: 'AES256-NUK-POWER',
    trabalho: 'Monitoramento de Matriz Energética',
    resumo: 'Complexo energético de alta capacidade com telemetria monitorada pelo Robotoc 3D para estabilidade da rede elétrica limpa.',
    imagem: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-23.0062,-44.3182'
  },
  {
    id: 4,
    nome: 'Usina Solar Neon & Painéis Fotovoltaicos',
    categoria: '☀️ Painéis Solares Neon & Sustentabilidade',
    cor: 0xffaa00,
    lat: -9.3833,
    lng: -40.5000,
    ipCriptografado: 'AES256-SOLAR-PWR',
    trabalho: 'Gestão de Energia Fotovoltaica',
    resumo: 'Parque solar inteligente no semiárido nordestino com rastreamento orbital de radiação e armazenamento em baterias de estado sólido.',
    imagem: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-9.3833,-40.5000'
  },
  {
    id: 5,
    nome: 'Torre 5G/6G & Parque Eólico Futurista',
    categoria: '📡 Antenas 5G/6G & Turbinas Eólicas',
    cor: 0xaa00ff,
    lat: -5.0892,
    lng: -42.8019,
    ipCriptografado: 'AES256-5G-EOLICA',
    trabalho: 'Sincronização de Banda Ultralarga',
    resumo: 'Hub híbrido de geração eólica e transmissão de dados 6G de latência zero para comunicação direta com os periféricos Robotoc Gear.',
    imagem: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-5.0892,-42.8019'
  },
  {
    id: 6,
    nome: 'Usina Hidrelétrica & Barragem 3D',
    categoria: '💧 Geração Fluvial, Hidrelétrica & Barragem',
    cor: 0x0066ff,
    lat: -25.4284,
    lng: -54.5868,
    ipCriptografado: 'AES256-HIDRO-POWER',
    trabalho: 'Controle de Escoamento de Água',
    resumo: 'Monitoramento hidrodinâmico de turbinas e comportas integradas ao modelo físico do Globo Terrestre 3D.',
    imagem: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-25.4284,-54.5868'
  },
  {
    id: 7,
    nome: 'Centro de Pesquisa Universitário & Vagas',
    categoria: '🎓 Parcerias Acadêmicas & Formação',
    cor: 0x88ff00,
    lat: -23.5505,
    lng: -46.6333,
    ipCriptografado: 'AES256-UNIV-RECRUIT',
    trabalho: 'Desenvolvimento Acadêmico & IA',
    resumo: 'Polo de pesquisa em Inteligência Artificial, computação quântica e formação de novos desenvolvedores para o ecossistema Emanuel.OS.',
    imagem: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-23.5505,-46.6333'
  },
  {
    id: 8,
    nome: 'Centro Comercial Cyber & Laboratório',
    categoria: '💊 Farmacêutica Natural & Tecnologia',
    cor: 0xff00aa,
    lat: -22.9068,
    lng: -43.1729,
    ipCriptografado: 'AES256-LAB-FARMA',
    trabalho: 'Pesquisa Farmacêutica & Biotec',
    resumo: 'Laboratório de biotecnologia e síntese molecular com simulações assistidas por IA em tempo real.',
    imagem: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-22.9068,-43.1729'
  },
  {
    id: 9,
    nome: 'Batalhão Marítimo & Guarda Costeira',
    categoria: '👮 Proteção de Rios, Mares e Fauna',
    cor: 0x0066ff,
    lat: -23.9608,
    lng: -46.3339,
    ipCriptografado: 'AES256-COAST-GUARD',
    trabalho: 'Patrulha e Segurança Costeira',
    resumo: 'Operação de vigilância ambiental, proteção da fauna marinha e rastreamento por satélite da zona costeira.',
    imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-23.9608,-46.3339'
  },
  {
    id: 10,
    nome: 'Cataratas do Iguaçu Realistas 3D',
    categoria: '🌊 Módulo Ecológico & Reserva Fluvial 3D',
    cor: 0x00e5ff,
    lat: -25.6953,
    lng: -54.4367,
    ipCriptografado: 'AES256-CATARATAS-3D',
    trabalho: 'Preservação de Reservas Naturais',
    resumo: 'Santuário ecológico mapeado em alta definição 3D com sensores climáticos e monitoramento de biodiversidade.',
    imagem: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-25.6953,-54.4367'
  },
  {
    id: 11,
    nome: 'Ponto de Kitesurf & Avatar Feminino 3D',
    categoria: '🏄 Praia Neon & Esportes Aquáticos',
    cor: 0xff007f,
    lat: -2.8856,
    lng: -40.5050,
    ipCriptografado: 'AES256-KITESURF-NEON',
    trabalho: 'Treinamento de Atletas & Hidrodinâmica',
    resumo: 'Litoral cearense com ventos perfeitos para kitesurf, telemetria de ventos e simulação hidrodinâmica 3D.',
    imagem: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-2.8856,-40.5050'
  },
  {
    id: 12,
    nome: 'Hospital Central & Pronto Socorro 3D',
    categoria: '🏥 Atendimento Médico & UTIs Futuristas',
    cor: 0xff3366,
    lat: -15.7801,
    lng: -47.9292,
    ipCriptografado: 'AES256-HOSPITAL-CORE',
    trabalho: 'Recepção de Pacientes e UTIs Avançadas',
    resumo: 'Unidade hospitalar de alta tecnologia integrada a diagnósticos rápidos, triagem inteligente e telemedicina.',
    imagem: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-15.7801,-47.9292'
  },
  {
    id: 13,
    nome: 'Ponto de Ônibus Central & Marquise Neon',
    categoria: '🚌 Parada Urbana & Embarque de Passageiros',
    cor: 0xffaa00,
    lat: -19.9167,
    lng: -43.9345,
    ipCriptografado: 'AES256-BUS-STOP-01',
    trabalho: 'Estação de Integração de Linhas Urbanas',
    resumo: 'Terminal inteligente de mobilidade urbana com painéis holográficos de horários e integração multimodal.',
    imagem: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-19.9167,-43.9345'
  },
  {
    id: 14,
    nome: 'Central AiFod & Moto Ubers Direct',
    categoria: '🛵 Hub de Entregas Rápida & Moto Taxis',
    cor: 0xff0055,
    lat: -8.0476,
    lng: -34.8770,
    ipCriptografado: 'AES256-AIFOD-HUB',
    trabalho: 'Despacho de Pedidos e Corridas Moto Uber',
    resumo: 'Central logística de entregas expressas e transporte urbano conectada por rotas dinâmicas em tempo real.',
    imagem: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    urlExterna: 'https://maps.google.com/?q=-8.0476,-34.8770'
  }
];

export default function RobotocNAV() {
  const router = useRouter();
  const mount3DRef = useRef(null);
  const globeGroupRef = useRef(null);
  const robotGroupRef = useRef(null);

  const [queryPesquisa, setQueryPesquisa] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS');
  const [resultados, setResultados] = useState(BASE_DADOS_ROBOTOC_NAV);
  const [itemSelecionado, setItemSelecionado] = useState(BASE_DADOS_ROBOTOC_NAV[0]);
  const [statusRobotocNav, setStatusRobotocNav] = useState('Navegador Quântico robotocNAV sincronizado com o Globo Terra 3D.');

  // =========================================================================================
  // 🌍🤖 CENA 3D DO ROBOTOCNAV (NOVO MAPA TERRA 3D + ROBOTOC 3D NO DESIGN DO NAVEGADOR)
  // =========================================================================================
  useEffect(() => {
    if (!mount3DRef.current) return;

    const width = mount3DRef.current.clientWidth;
    const height = mount3DRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 8.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount3DRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    dirLight.position.set(5, 6, 6);
    scene.add(dirLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 2.2);
    frontLight.position.set(-4, 3, 5);
    scene.add(frontLight);

    // NOVO MAPA TERRA 3D FUTURISTA DO ROBOTOCNAV
    const globeGroup = new THREE.Group();
    globeGroup.position.set(-2.1, -0.2, 0);
    globeGroupRef.current = globeGroup;

    const radius = 2.05;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.35
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
      (tex) => {
        earthMat.map = tex;
        earthMat.color.setHex(0xffffff);
        earthMat.needsUpdate = true;
      }
    );

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Malha Holográfica Ciano ao redor da Terra
    const holoGrid = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius * 1.07, 3),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.18 })
    );
    globeGroup.add(holoGrid);

    // Anel Orbital de Navegação
    const navOrbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 1.28, 0.025, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 })
    );
    navOrbitRing.rotation.x = Math.PI / 2.6;
    globeGroup.add(navOrbitRing);

    // Marcadores 3D dos locais na Terra
    BASE_DADOS_ROBOTOC_NAV.forEach((loc) => {
      const phi = (90 - loc.lat) * (Math.PI / 180);
      const theta = (loc.lng + 180) * (Math.PI / 180);
      const r = radius * 1.02;

      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshBasicMaterial({ color: loc.cor })
      );
      pin.position.set(x, y, z);
      globeGroup.add(pin);
    });

    scene.add(globeGroup);

    // ROBOTOC 3D INTEGRADO AO DESIGN DO NAVEGADOR
    const robotParts = criarModeloRobotocNav3D();
    const robot = robotParts.robotGroup;
    robot.position.set(2.9, -0.1, 0.8);
    robot.scale.set(1.15, 1.15, 1.15);
    robot.rotation.y = -0.35;
    scene.add(robot);
    robotGroupRef.current = robot;

    const handleResize = () => {
      if (!mount3DRef.current) return;
      const w = mount3DRef.current.clientWidth;
      const h = mount3DRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.002;
      }
      holoGrid.rotation.y = -t * 0.06;
      navOrbitRing.rotation.z = t * 0.25;

      if (robotGroupRef.current) {
        robotGroupRef.current.position.y = -0.1 + Math.sin(t * 2.2) * 0.1;
        robotParts.headGroup.rotation.y = Math.sin(t * 1.4) * 0.15;
        robotParts.leftElbowGroup.rotation.z = 1.65 + Math.sin(t * 3.0) * 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mount3DRef.current && renderer.domElement) {
        mount3DRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 🔍 FILTRAGEM INTELIGENTE EM TEMPO REAL
  useEffect(() => {
    const q = queryPesquisa.trim().toLowerCase();
    const filtrados = BASE_DADOS_ROBOTOC_NAV.filter((item) => {
      const bateTexto =
        !q ||
        item.nome.toLowerCase().includes(q) ||
        item.categoria.toLowerCase().includes(q) ||
        item.trabalho.toLowerCase().includes(q) ||
        item.resumo.toLowerCase().includes(q);

      const bateCategoria =
        filtroCategoria === 'TODOS' ||
        (filtroCategoria === 'ENERGIA' && (item.categoria.includes('Nuclear') || item.categoria.includes('Solar') || item.categoria.includes('Hidrelétrica') || item.categoria.includes('Eólico'))) ||
        (filtroCategoria === 'CIENCIA' && (item.categoria.includes('Servidor') || item.categoria.includes('Oceanográfica') || item.categoria.includes('Universitário') || item.categoria.includes('Laboratório'))) ||
        (filtroCategoria === 'URBANO' && (item.categoria.includes('Hospital') || item.categoria.includes('Ônibus') || item.categoria.includes('AiFod') || item.categoria.includes('Kitesurf')));

      return bateTexto && bateCategoria;
    });

    setResultados(filtrados);
    if (filtrados.length > 0 && !filtrados.some((f) => f.id === itemSelecionado?.id)) {
      focarNoMapaLocalNav(filtrados[0], false);
    }
  }, [queryPesquisa, filtroCategoria]);

  // 🎯 GIRA O GLOBO TERRA 3D DO ROBOTOCNAV ATÉ O PONTO PESQUISADO
  const focarNoMapaLocalNav = (local, anunciar = true) => {
    setItemSelecionado(local);
    if (globeGroupRef.current) {
      const phi = (90 - local.lat) * (Math.PI / 180);
      const theta = (local.lng + 180) * (Math.PI / 180);
      globeGroupRef.current.rotation.y = -theta + Math.PI / 2;
      globeGroupRef.current.rotation.x = phi - Math.PI / 2;
    }
    if (anunciar) {
      setStatusRobotocNav(`📍 Localizado: ${local.nome} (${local.lat.toFixed(2)}, ${local.lng.toFixed(2)})`);
    }
  };

  // 🔗 ENVIA O FILTRO DE PESQUISA DIRETO PARA O MAPA TERRA 3D DO INDEX.JS
  const sincronizarComIndexMapaTerra3D = (local) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('robotocNAV_filtro_ativo', JSON.stringify(local));
    }
    router.push(`/?navLocalId=${local.id}&navBusca=${encodeURIComponent(local.nome)}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Head>
        <title>robotocNAV | Navegador Futurista 3D Interligado ao Emanuel.OS</title>
      </Head>

      {/* 🌌 FUNDO 3D INTERATIVO: NOVO MAPA TERRA 3D + ROBOTOC 3D */}
      <div ref={mount3DRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* 🧭 BARRA SUPERIOR DO NAVEGADOR FUTURISTA robotocNAV */}
      <header style={{
        position: 'relative', zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 24px', backgroundColor: 'rgba(2, 6, 23, 0.78)', borderBottom: '1.5px solid #00f0ff',
        backdropFilter: 'blur(18px)', boxShadow: '0 4px 30px rgba(0, 240, 255, 0.2)', flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🌐</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '1px', color: '#ffffff' }}>
              robotoc<span style={{ color: '#00f0ff' }}>NAV</span>
            </h1>
            <span style={{ fontSize: '10px', color: '#38bdf8', fontFamily: 'monospace' }}>
              MOTOR DE PESQUISA VISUAL & TELEMETRIA TERRA 3D
            </span>
          </div>
        </div>

        {/* BARRA DE PESQUISA ESTILO NAVEGADOR */}
        <div style={{
          flex: 1, maxWidth: '580px', display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '2px solid #00f0ff',
          borderRadius: '30px', padding: '8px 18px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.25)'
        }}>
          <span style={{ color: '#00f0ff', fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            value={queryPesquisa}
            onChange={(e) => setQueryPesquisa(e.target.value)}
            placeholder="Pesquise no robotocNAV (ex: Usina, Hospital, Kitesurf, Data Center, Solar)..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#ffffff', fontSize: '13px', fontWeight: '600'
            }}
          />
          {queryPesquisa && (
            <button
              onClick={() => setQueryPesquisa('')}
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* LINK DE RETORNO DIRETO PARA O INDEX.JS */}
        <Link
          href="/"
          style={{
            padding: '10px 18px', backgroundColor: '#0284c7', color: '#ffffff',
            border: '1px solid #00f0ff', borderRadius: '22px', textDecoration: 'none',
            fontSize: '12px', fontWeight: 'bold', boxShadow: '0 0 18px rgba(0, 240, 255, 0.35)'
          }}
        >
          🌍 Voltar ao Emanuel.OS (index.js)
        </Link>
      </header>

      {/* 🎛️ FILTROS RÁPIDOS DO NAVEGADOR */}
      <div style={{
        position: 'relative', zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 24px', backgroundColor: 'rgba(15, 23, 42, 0.65)', borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
        backdropFilter: 'blur(12px)', flexWrap: 'wrap', gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'TODOS', label: '🌐 Todos os Nódulos (14)' },
            { id: 'ENERGIA', label: '⚡ Energia & Infraestrutura' },
            { id: 'CIENCIA', label: '🧬 Ciência, IA & Dados' },
            { id: 'URBANO', label: '🏙️ Saúde, Mobilidade & Lazer' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltroCategoria(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: '1px solid #00f0ff',
                backgroundColor: filtroCategoria === cat.id ? '#00f0ff' : 'rgba(2, 6, 23, 0.75)',
                color: filtroCategoria === cat.id ? '#020617' : '#e0f2fe',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '11px', color: '#00f0ff', fontFamily: 'monospace' }}>
          🤖 {statusRobotocNav}
        </span>
      </div>

      {/* 📊 ÁREA PRINCIPAL DIVIDIDA: RESULTADOS COM IMAGENS (ESQUERDA) + DETALHE SINCRONIZADO (DIREITA) */}
      <main style={{
        position: 'relative', zIndex: 15, display: 'grid',
        gridTemplateColumns: 'minmax(320px, 460px) 1fr',
        height: 'calc(100vh - 125px)', padding: '18px 24px', gap: '20px', boxSizing: 'border-box'
      }}>
        {/* COLUNA ESQUERDA: LISTA DE RESULTADOS DA PESQUISA COM MINIATURAS DE IMAGEM */}
        <section style={{
          backgroundColor: 'rgba(2, 6, 23, 0.78)', border: '1.5px solid rgba(0, 240, 255, 0.5)',
          borderRadius: '18px', padding: '14px', overflowY: 'auto', backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.25)', paddingBottom: '8px' }}>
            <strong style={{ fontSize: '12px', color: '#00f0ff' }}>
              📡 RESULTADOS ENCONTRADOS ({resultados.length})
            </strong>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Clique para inspecionar</span>
          </div>

          {resultados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '12px' }}>
              Nenhum nódulo encontrado para "{queryPesquisa}". Tente outro termo!
            </div>
          ) : (
            resultados.map((item) => {
              const ativo = itemSelecionado?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => focarNoMapaLocalNav(item)}
                  style={{
                    display: 'flex', gap: '12px', padding: '10px', borderRadius: '14px', cursor: 'pointer',
                    backgroundColor: ativo ? 'rgba(2, 132, 199, 0.35)' : 'rgba(15, 23, 42, 0.75)',
                    border: ativo ? '1.5px solid #00f0ff' : '1px solid rgba(148, 163, 184, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    style={{
                      width: '86px', height: '74px', objectFit: 'cover', borderRadius: '10px',
                      border: '1px solid #00f0ff', flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '12.5px', color: '#ffffff', marginBottom: '3px' }}>
                      {item.nome}
                    </strong>
                    <span style={{ display: 'block', fontSize: '10px', color: '#38bdf8', marginBottom: '4px' }}>
                      {item.categoria}
                    </span>
                    <p style={{ margin: 0, fontSize: '10.5px', color: '#cbd5e1', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.resumo}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* COLUNA DIREITA: CARD HOLOGRÁFICO DO RESULTADO SELECIONADO + BOTÃO DE INTEGRAÇÃO COM INDEX.JS */}
        <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', pointerEvents: 'none' }}>
          {itemSelecionado && (
            <div style={{
              pointerEvents: 'auto', width: '100%', maxWidth: '430px',
              backgroundColor: 'rgba(2, 6, 23, 0.86)', border: '2px solid #00f0ff',
              borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)'
            }}>
              <div style={{ position: 'relative', height: '175px', width: '100%' }}>
                <img
                  src={itemSelecionado.imagem}
                  alt={itemSelecionado.nome}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute', top: '10px', left: '10px',
                  backgroundColor: 'rgba(2, 6, 23, 0.85)', border: '1px solid #00f0ff',
                  color: '#00f0ff', padding: '4px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold'
                }}>
                  {itemSelecionado.categoria}
                </span>
              </div>

              <div style={{ padding: '16px' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#ffffff' }}>
                  {itemSelecionado.nome}
                </h2>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.45' }}>
                  {itemSelecionado.resumo}
                </p>

                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '10px', padding: '8px 12px', marginBottom: '12px', fontSize: '10.5px', fontFamily: 'monospace'
                }}>
                  <div style={{ color: '#38bdf8' }}>📍 Coordenadas: {itemSelecionado.lat}, {itemSelecionado.lng}</div>
                  <div style={{ color: '#94a3b8' }}>🔐 Hash Quântico: {itemSelecionado.ipCriptografado}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => sincronizarComIndexMapaTerra3D(itemSelecionado)}
                    style={{
                      flex: 1, padding: '11px 14px', backgroundColor: '#00f0ff', color: '#020617',
                      border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '11.5px',
                      cursor: 'pointer', boxShadow: '0 0 20px rgba(0, 240, 255, 0.45)'
                    }}
                  >
                    🌍 Abrir e Focar no Mapa Terra 3D (index.js) ➔
                  </button>

                  <a
                    href={itemSelecionado.urlExterna}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '11px 14px', backgroundColor: 'rgba(2, 132, 199, 0.3)',
                      border: '1px solid #00f0ff', color: '#ffffff', borderRadius: '12px',
                      textDecoration: 'none', fontSize: '11px', fontWeight: 'bold'
                    }}
                  >
                    🛰️ Satélite
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}