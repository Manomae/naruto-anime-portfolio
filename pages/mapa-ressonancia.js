import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { jsPDF } from "jspdf";

// Importação do Gerenciador de Janelas Futuristas (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaRessonancia3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const bolaHolograficaMeshRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const esferasLinks3DRef = useRef([]);

  // --- DADOS REAIS & REDES SOCIAIS EMANUEL DA SILVA ---
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

  // Redes Oficiais para o Cabeçalho
  const redesOficiais = [
    { nome: 'YouTube', url: meusDadosReais.youtube, icone: '▶️' },
    { nome: 'TikTok', url: meusDadosReais.tiktok, icone: '🎵' },
    { nome: 'Instagram', url: meusDadosReais.instagram, icone: '📸' },
    { nome: 'Threads', url: meusDadosReais.threads, icone: '🧵' },
    { nome: 'GitHub', url: meusDadosReais.github, icone: '🐙' }
  ];

  // Estados de Configuração Técnica da Ressonância
  const [respiracaoLivre, setRespiracaoLivre] = useState(true);
  const [filtroMovimento, setFiltroMovimento] = useState(true);
  const [intensidadeTesla, setIntensidadeTesla] = useState(3.0);
  const [frequenciaRadioMHz, setFrequenciaRadioMHz] = useState(128);
  const [realceInflamatorio, setRealceInflamatorio] = useState(false);
  const [statusExame, setStatusExame] = useState('🟢 Aquisição Volumétrica em Tempo Real Estável (RM 3D)');

  // Estados ROBOTOC DATA CENTER & ARQUITETURA 3D (IGUAL AO INDEX)
  const [mostrarOverlayRobotoc, setMostrarOverlayRobotoc] = useState(false);
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);
  const [nuvemSelecionada, setNuvemSelecionada] = useState('google');
  const [abaOverlayAtiva, setAbaOverlayAtiva] = useState('browser');

  // CONTROLE DE PAINÉIS
  const [painelPacienteAberto, setPainelPacienteAberto] = useState(true);
  const [painelRmExpandido, setPainelRmExpandido] = useState(true);

  // BARRA FLUIDA SUPERIOR RETRÁTIL
  const [isBarraFluidaOpen, setIsBarraFluidaOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('tudo');

  // Base de Dados de Pacientes
  const [listaPacientes] = useState([
    { id: 'P01', nome: 'Emanuel da Silva', idade: 28, historico: 'Dores crônicas na região lombar e cervical com episódios de parestesia nos membros inferiores.', patologia: 'Hérnia de Disco L4-L5 com Compressão Radicular', segmento: 'Coluna Lombar e Sacra' },
    { id: 'P02', nome: 'Ana Clara Souza', idade: 42, historico: 'Rigidez matinal e dormência no pescoço com irradiação para o ombro esquerdo.', patologia: 'Doença Degenerativa Discal Cervical (C5-C6)', segmento: 'Coluna Cervical' },
    { id: 'P03', nome: 'Carlos Eduardo Lima', idade: 55, historico: 'Claudicação neurogênica e dor intensa ao caminhar.', patologia: 'Estenose de Canal Vertebral e Osteófitos Marginais', segmento: 'Coluna Torácica e Lombar' },
    { id: 'P04', nome: 'Mariana Duarte', idade: 34, historico: 'Investigação de lesão expansiva intradural identificada em tomografia prévia.', patologia: 'Suspeita de Meningioma / Tumor Benigno de Medula', segmento: 'Medula Espinhal Torácica' }
  ]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(listaPacientes[0]);

  // Base Métrica Expandida: Médicos, Funcionários e Hospitais
  const baseEquipeHospitalar = [
    { id: 1, tipo: 'medico', hospital: 'Hospital Neuro-Spine Central', cidade: 'São Paulo', pais: 'Brasil', nome: 'Dr. Roberto Alencar', especialidade: 'Neurocirurgião Espinhal', status: '🔴 Em Cirurgia Grave (Laminectomia Lombar)', horario: '14:00 - 18:00', sala: 'Centro Cirúrgico Bloco A' },
    { id: 2, tipo: 'medico', hospital: 'Centro Médico de Coluna & RM', cidade: 'Fortaleza', pais: 'Brasil', nome: 'Dra. Camila Vasconcelos', especialidade: 'Ortopedista de Coluna', status: '🟢 Em Atendimento Clínico', horario: '08:00 - 16:00', sala: 'Consultório 302' },
    { id: 3, tipo: 'medico', hospital: 'Quantum Medical Institute', cidade: 'Tóquio', pais: 'Japão', nome: 'Dr. Kenji Sato', especialidade: 'Especialista em Medula Espinhal', status: '🟡 Em Cirurgia Leve (Artrodese)', horario: '10:00 - 15:00', sala: 'Centro Cirúrgico Bloco B' },
    { id: 4, tipo: 'medico', hospital: 'Cyber-Health Spine Center', cidade: 'Nova York', pais: 'EUA', nome: 'Dra. Sarah Jenkins', especialidade: 'Radiologista Intervencionista', status: '🟢 Disponível para Laudos 3D', horario: '09:00 - 17:00', sala: 'Setor de RM Sala 01' },
    { id: 5, tipo: 'funcionario', hospital: 'Hospital Neuro-Spine Central', cidade: 'São Paulo', pais: 'Brasil', nome: 'Lucas Mendes', especialidade: 'Técnico em Ressonância Magnética', status: '🟢 Operando Scanner RM 3.0T', horario: '07:00 - 19:00', sala: 'Comando Técnico RM' },
    { id: 6, tipo: 'funcionario', hospital: 'Centro Médico de Coluna & RM', cidade: 'Fortaleza', pais: 'Brasil', nome: 'Juliana Paes', especialidade: 'Enfermeira Especialista em RM e Anestesia', status: '🟢 Acompanhamento de Paciente', horario: '08:00 - 17:00', sala: 'Preparação Anestésica' }
  ];

  const palavrasChaveClinicas = [
    "#colunavertebral", "#herniadedisco", "#compressaodenervos", "#medulaespinhal",
    "#campomagnetico", "#ondasderadio", "#tumorescoluna", "#doencasdegenerativas",
    "#dorlombar", "#pescoço", "#alteraçõesneurologicas", "#infecçoes"
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

  // --- CENA THREE.JS COMPLETA: CÓDIGO DA RM 3D UNIFICADO COM O DATA CENTER E ROBOTOC ---
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 0, 7.0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ILUMINAÇÃO DATA CENTER + MEDICA
    const greenLight = new THREE.PointLight(0x10b981, 4, 100);
    greenLight.position.set(-3, 3, 3);
    scene.add(greenLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4, 100);
    cyanLight.position.set(3, -3, 3);
    scene.add(cyanLight);

    const redAlertLight = new THREE.PointLight(0xff0055, realceInflamatorio ? 6 : 1, 100);
    redAlertLight.position.set(0, 0, 2);
    scene.add(redAlertLight);

    scene.add(new THREE.AmbientLight(0x0f172a, 2.0));

    // 🏬 ESTRUTURA 3D DO DATA CENTER GIGANTESCO DE DADOS
    const dataCenterGroup = new THREE.Group();

    // PISO TÁTIL COM GRID HOLOGRÁFICO
    const floorGrid = new THREE.GridHelper(30, 30, 0x10b981, 0x1e293b);
    floorGrid.position.y = -2.5;
    dataCenterGroup.add(floorGrid);

    // TORRES DE SERVIDORES (RACKS 3D DE DATA CENTER)
    const rackGeo = new THREE.BoxGeometry(0.8, 4.5, 1.2);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.2 });
    const ledCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    for (let row = -3; row <= 3; row += 2) {
      if (row === 0) continue;
      [-5, -8, 5, 8].forEach((zPos) => {
        const rackMesh = new THREE.Mesh(rackGeo, rackMat);
        rackMesh.position.set(row * 1.8, -0.25, zPos);
        dataCenterGroup.add(rackMesh);

        for (let l = -1.8; l <= 1.8; l += 0.4) {
          const ledGeo = new THREE.BoxGeometry(0.65, 0.05, 0.05);
          const ledMesh = new THREE.Mesh(ledGeo, (row + l) % 2 === 0 ? ledCyanMat : ledGreenMat);
          ledMesh.position.set(row * 1.8, l, zPos + 0.61);
          dataCenterGroup.add(ledMesh);
        }
      });
    }

    scene.add(dataCenterGroup);

    // 🧠 MESH DA RESSONÂNCIA MAGNÉTICA 3D (TORUS KNOT CENTRAL)
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
    const material = new THREE.MeshStandardMaterial({
      color: realceInflamatorio ? 0xff0055 : 0x10b981,
      wireframe: true,
      emissive: realceInflamatorio ? 0x990033 : 0x059669,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    meshRef.current = mesh;
    scene.add(mesh);

    // BOLA HOLOGRÁFICA PRINCIPAL
    const bolaGeometry = new THREE.IcosahedronGeometry(0.8, 3);
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

    // ESFERAS DE LINKS 3D / REDES SOCIAIS ÓRBITA DO DATA CENTER
    const linksGroup = new THREE.Group();
    esferasLinks3DRef.current = [];
    links3D.forEach((linkItem) => {
      const orbGeo = new THREE.SphereGeometry(0.2, 16, 16);
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

    // 🤖 AVATAR ROBOTOC HUMANOIDE 3D
    const avatarGroup = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.4, metalness: 0.1 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.1, metalness: 0.9, emissive: 0x10b981, emissiveIntensity: 0.2 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.9 });

    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    headGeo.scale(1, 1.25, 1);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 2.3, 0);
    avatarGroup.add(headMesh);

    const hairGeo = new THREE.SphereGeometry(0.38, 16, 16);
    hairGeo.scale(1.02, 0.9, 1.05);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 2.45, -0.05);
    avatarGroup.add(hairMesh);

    const eyeGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 2.32, 0.32);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.12, 2.32, 0.32);
    avatarGroup.add(leftEye);
    avatarGroup.add(rightEye);

    const chestGeo = new THREE.BoxGeometry(0.8, 0.7, 0.4);
    const chestMesh = new THREE.Mesh(chestGeo, suitMat);
    chestMesh.position.set(0, 1.45, 0);
    avatarGroup.add(chestMesh);

    const plateGeo = new THREE.BoxGeometry(0.6, 0.4, 0.08);
    const plateMesh = new THREE.Mesh(plateGeo, armorMat);
    plateMesh.position.set(0, 1.5, 0.21);
    avatarGroup.add(plateMesh);

    avatarGroup.position.set(-2.2, -1.2, 0);
    scene.add(avatarGroup);
    avatarGroupRef.current = avatarGroup;

    // CLIQUE INTERATIVO NO AVATAR ROBOTOC E ESFERAS
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
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotação do modelo central de RM 3D
      mesh.rotation.y = elapsedTime * (0.3 + intensidadeTesla * 0.05);
      mesh.rotation.x = elapsedTime * 0.15;

      if (respiracaoLivre) {
        mesh.scale.setScalar(1 + Math.sin(elapsedTime * 1.5) * 0.04);
      }

      // Animação da Bola Holográfica e esferas de links
      if (bolaHolograficaMeshRef.current) {
        bolaHolograficaMeshRef.current.rotation.y += 0.008;
        bolaHolograficaMeshRef.current.position.y = Math.sin(elapsedTime * 2) * 0.15;

        esferasLinks3DRef.current.forEach((m, idx) => {
          const angle = elapsedTime * 0.8 + (idx * (Math.PI * 2 / esferasLinks3DRef.current.length));
          m.position.x = bolaHolograficaMeshRef.current.position.x + Math.cos(angle) * 1.8;
          m.position.z = bolaHolograficaMeshRef.current.position.z + Math.sin(angle) * 1.8;
          m.position.y = bolaHolograficaMeshRef.current.position.y + Math.sin(elapsedTime * 2 + idx) * 0.3;
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
  }, [respiracaoLivre, realceInflamatorio, intensidadeTesla, links3D]);

  const gerarLaudoMedicoPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(0, 240, 255);
    doc.setFontSize(15);
    doc.text("EMANUEL.OS - LAUDO DE RESSONÂNCIA MAGNÉTICA 3D", 14, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("SISTEMA DE DIAGNÓSTICO POR IMAGEM E INTELIGÊNCIA ARTIFICIAL G-AGI v5.1", 14, 26);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`PACIENTE: ${pacienteSelecionado.nome.toUpperCase()}`, 14, 42);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`ID: ${pacienteSelecionado.id} | Idade: ${pacienteSelecionado.idade} anos | Segmento: ${pacienteSelecionado.segmento}`, 14, 48);
    doc.text(`Data da Aquisição: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 54);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text("1. HISTÓRICO CLÍNICO E INDICAÇÃO DO EXAME", 14, 66);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(51, 65, 85);
    const historicoTexto = `Exame indicado para investigar dores nas costas, no pescoço ou na região lombar, além de alterações neurológicas, hérnias de disco, compressão de nervos, lesões da medula espinhal, tumores, infecções e doenças degenerativas da coluna vertebral.\n\nHistórico do Paciente: ${pacienteSelecionado.historico}`;
    const historicoLinhas = doc.splitTextToSize(historicoTexto, 182);
    doc.text(historicoLinhas, 14, 73);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text("2. PARÂMETROS FÍSICOS E TÉCNICA DE AQUISIÇÃO", 14, 105);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(51, 65, 85);
    const tecnicaTexto = `Aquisição tridimensional volumétrica utilizando campo magnético de ${intensidadeTesla.toFixed(1)} Tesla e pulsos de ondas de rádio em ${frequenciaRadioMHz} MHz para produzir imagens detalhadas das estruturas da coluna vertebral. Modulação de movimento: ${filtroMovimento ? 'Filtro G-AGI Ativo' : 'Desativado'}. Respiração Livre: ${respiracaoLivre ? 'Ativa' : 'Inativa'}.`;
    const tecnicaLinhas = doc.splitTextToSize(tecnicaTexto, 182);
    doc.text(tecnicaLinhas, 14, 112);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text("3. ACHADOS POR IMAGEM E IMPRESSÃO DIAGNÓSTICA", 14, 145);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`* Corpos Vertebrais: Alinhamento preservado com contornos ósseos definidos.`, 14, 153);
    doc.text(`* Discos Intervertebrais: Sinais de desidratação focal identificados no segmento estudado.`, 14, 160);
    doc.text(`* Medula Espinhal e Nervos: ${pacienteSelecionado.patologia}`, 14, 167);
    doc.text(`* Tecidos Perivertebrais: Sem evidência de coleções fluidas organizadas ou massas expansivas agudas.`, 14, 174);

    doc.setDrawColor(203, 213, 225);
    doc.line(14, 260, 196, 260);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Laudo Médico e de Imagem emitido eletronicamente via Emanuel.OS Core v5.1 Medical Engine", 14, 268);
    doc.text("Médico Radiologista / Responsável: Dr. Emanuel da Silva - CRM/AGI 2030", 14, 274);

    doc.save(`Laudo_RM_3D_${pacienteSelecionado.nome.replace(/\s+/g, '_')}.pdf`);
    setStatusExame(`📄 Laudo em PDF gerado para ${pacienteSelecionado.nome}!`);
  };

  const equipeFiltrada = baseEquipeHospitalar.filter(item => {
    const termo = termoBusca.toLowerCase();
    const combinaFiltro = filtroCategoria === 'tudo' || item.tipo === filtroCategoria;
    const combinaTermo = termo === '' ||
      item.hospital.toLowerCase().includes(termo) ||
      item.nome.toLowerCase().includes(termo) ||
      item.especialidade.toLowerCase().includes(termo) ||
      item.cidade.toLowerCase().includes(termo) ||
      item.pais.toLowerCase().includes(termo);
    return combinaFiltro && combinaTermo;
  });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#020617',
      backgroundImage: 'radial-gradient(circle at center, #064e3b 0%, #020617 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Mapa Ressonância 3D (IA) | Emanuel.OS & ROBOTOC DATA CENTER</title>
      </Head>

      {/* HEADER SUPERIOR COM ROBOTOC & REDES */}
      <header style={{ position: 'absolute', top: '15px', left: '20px', right: '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" style={{
            padding: '8px 14px', backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid #10b981', color: '#34d399', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
          }}>
            ⬅ Voltar ao Core
          </Link>

          <button onClick={() => setMostrarOverlayRobotoc(!mostrarOverlayRobotoc)} style={{ padding: '8px 14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            🤖 ROBOTOC HUD
          </button>

          <button onClick={() => setArquiteturaAberta(!arquiteturaAberta)} style={{ padding: '8px 14px', backgroundColor: '#10b981', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            🏛️ ARQUITETURA DATA CENTER 3D
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

      {/* 🔬 BOTÃO DE CONEXÃO AO MAPA DE PATOLOGIA */}
      <div style={{ position: 'absolute', top: '75px', left: '20px', zIndex: 90 }}>
        <Link href="/mapa-patologia" style={{
          padding: '9px 16px', backgroundColor: 'rgba(8, 15, 30, 0.90)',
          border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '12px',
          textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px',
          backdropFilter: 'blur(15px)'
        }}>
          🔬 Conectar ao Mapa de Patologia e Laboratório 3D ➔
        </Link>
      </div>

      {/* 🌟 BARRA FLUIDA SUPERIOR RETRÁTIL */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 110, width: '90%', maxWidth: '680px' }}>
        <div 
          onClick={() => setIsBarraFluidaOpen(!isBarraFluidaOpen)}
          style={{
            backgroundColor: 'rgba(8, 15, 30, 0.95)',
            backdropFilter: 'blur(15px)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            border: '1px solid #10b981',
            borderTop: 'none',
            padding: '8px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            color: '#34d399',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>{isBarraFluidaOpen ? '▲ Recolher Painel Médico' : '▼ Puxe para Baixo (Pesquisa de Hospitais, Médicos, Funcionários & Patologias)'}</span>
        </div>

        {isBarraFluidaOpen && (
          <div style={{
            backgroundColor: 'rgba(7, 12, 28, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '16px',
            borderRadius: '18px',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            marginTop: '6px'
          }}>
            <input
              type="text"
              placeholder="🔍 Pesquise dores nas costas, hérnia de disco, lesões de medula, neurocirurgiões, técnicos, cidades..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px',
                backgroundColor: '#09090b',
                border: '1px solid #10b981',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button onClick={() => setFiltroCategoria('tudo')} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #10b981', backgroundColor: filtroCategoria === 'tudo' ? '#10b981' : 'transparent', color: filtroCategoria === 'tudo' ? '#000' : '#34d399', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Todos</button>
              <button onClick={() => setFiltroCategoria('medico')} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #00f0ff', backgroundColor: filtroCategoria === 'medico' ? '#00f0ff' : 'transparent', color: filtroCategoria === 'medico' ? '#000' : '#00f0ff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Médicos / Especialistas</button>
              <button onClick={() => setFiltroCategoria('funcionario')} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #eab308', backgroundColor: filtroCategoria === 'funcionario' ? '#eab308' : 'transparent', color: filtroCategoria === 'funcionario' ? '#000' : '#eab308', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Funcionários / Técnicos</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
              {palavrasChaveClinicas.map((tag, idx) => (
                <span 
                  key={idx} 
                  onClick={() => setTermoBusca(tag.replace('#', ''))}
                  style={{ fontSize: '9px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '12px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {equipeFiltrada.length === 0 ? (
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Nenhum médico, funcionário ou hospital localizado para a busca.</span>
              ) : (
                equipeFiltrada.map((item) => (
                  <div key={item.id} style={{ padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }}>
                    <div style={{ color: '#00f0ff', fontWeight: 'bold' }}>🏥 {item.hospital} - {item.cidade}, {item.pais}</div>
                    <div style={{ color: '#34d399', marginTop: '2px' }}>👤 {item.nome} ({item.especialidade})</div>
                    <div style={{ color: '#eab308', marginTop: '2px' }}>⏰ Horários: {item.horario} | Sala: {item.sala}</div>
                    <div style={{ color: '#fb923c', marginTop: '2px' }}><b>Status Operacional: {item.status}</b></div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* 👤 PAINEL LATERAL ESQUERDO DO PACIENTE */}
      <div style={{
        position: 'absolute', top: '130px', left: painelPacienteAberto ? '20px' : '-310px', width: '310px',
        backgroundColor: 'rgba(8, 15, 30, 0.92)', backdropFilter: 'blur(25px)',
        border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '16px',
        padding: '16px', zIndex: 95, boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button
          onClick={() => setPainelPacienteAberto(!painelPacienteAberto)}
          style={{
            position: 'absolute', right: '-38px', top: '15px', width: '38px', height: '44px',
            backgroundColor: 'rgba(8, 15, 30, 0.95)', border: '1px solid rgba(16, 185, 129, 0.5)',
            borderLeft: 'none', borderTopRightRadius: '10px', borderBottomRightRadius: '10px',
            color: '#34d399', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '5px 0 15px rgba(0,0,0,0.5)'
          }}
          title={painelPacienteAberto ? "Recolher Painel Paciente" : "Expandir Painel Paciente"}
        >
          {painelPacienteAberto ? '◀' : '➔'}
        </button>

        <h3 style={{ color: '#34d399', fontSize: '13px', margin: '0 0 10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          👤 Paciente Selecionado (RM 3D)
        </h3>

        <select 
          value={pacienteSelecionado.id}
          onChange={(e) => {
            const p = listaPacientes.find(item => item.id === e.target.value);
            if (p) setPacienteSelecionado(p);
          }}
          style={{ width: '100%', padding: '8px', backgroundColor: '#020617', color: '#fff', border: '1px solid #10b981', borderRadius: '8px', fontSize: '10px', outline: 'none', marginBottom: '10px' }}
        >
          {listaPacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nome} ({p.segmento})</option>
          ))}
        </select>

        <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div><span style={{ color: '#94a3b8' }}>Nome:</span> <b>{pacienteSelecionado.nome}</b></div>
          <div><span style={{ color: '#94a3b8' }}>Idade:</span> <b>{pacienteSelecionado.idade} anos</b></div>
          <div><span style={{ color: '#94a3b8' }}>Histórico:</span> <span style={{ color: '#cbd5e1' }}>{pacienteSelecionado.historico}</span></div>
          <div><span style={{ color: '#94a3b8' }}>Achado Esperado:</span> <span style={{ color: '#fb923c' }}>{pacienteSelecionado.patologia}</span></div>
        </div>
      </div>

      {/* PAINEL INFERIOR RETRÁTIL DO MÓDULO FÍSICO DE RM 3D */}
      <div style={{
        position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, width: '90%', maxWidth: '680px', backgroundColor: 'rgba(8, 15, 30, 0.92)',
        border: '1px solid #10b981', borderRadius: '16px', padding: '18px',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)', backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: painelRmExpandido ? '10px' : '0' }}>
          <h2 style={{ color: '#34d399', fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧠 Módulo Físico de RM 3D: Campo Magnético & Ondas de Rádio
          </h2>
          
          <button
            onClick={() => setPainelRmExpandido(!painelRmExpandido)}
            style={{
              background: 'none', border: 'none', color: '#34d399', fontSize: '12px',
              cursor: 'pointer', fontWeight: 'bold', lineHeight: 1
            }}
            title={painelRmExpandido ? "Recolher Módulo RM" : "Expandir Módulo RM"}
          >
            {painelRmExpandido ? '▲' : '▼'}
          </button>
        </div>

        {painelRmExpandido && (
          <div>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.4' }}>
              Ajuste de campo magnético (Tesla) e ondas de rádio (MHz) para gerar imagens detalhadas das vértebras, discos intervertebrais, medula espinhal e tecidos moles.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  🧲 Campo Magnético: {intensidadeTesla.toFixed(1)} Tesla
                </label>
                <input 
                  type="range" min="1.5" max="7.0" step="0.5" value={intensidadeTesla}
                  onChange={(e) => setIntensidadeTesla(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#00f0ff', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  📡 Frequência de Rádio: {frequenciaRadioMHz} MHz
                </label>
                <input 
                  type="range" min="64" max="300" step="8" value={frequenciaRadioMHz}
                  onChange={(e) => setFrequenciaRadioMHz(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <button 
                onClick={() => setRespiracaoLivre(!respiracaoLivre)}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #10b981', backgroundColor: respiracaoLivre ? 'rgba(16, 185, 129, 0.2)' : 'transparent', color: '#34d399', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {respiracaoLivre ? '✅ Respiração Livre' : '❌ Respiração Inativa'}
              </button>

              <button 
                onClick={() => setFiltroMovimento(!filtroMovimento)}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #00f0ff', backgroundColor: filtroMovimento ? 'rgba(0, 240, 255, 0.2)' : 'transparent', color: '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {filtroMovimento ? '⚡ Filtro Movimento (G-AGI)' : '⚠️ Filtro Desativado'}
              </button>

              <button 
                onClick={() => setRealceInflamatorio(!realceInflamatorio)}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ff0055', backgroundColor: realceInflamatorio ? 'rgba(255, 0, 85, 0.2)' : 'transparent', color: '#ff0055', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {realceInflamatorio ? '🔴 Destacar Hérnias/Lesões' : '⚪ Visão Padrão T1/T2'}
              </button>
            </div>

            <button 
              onClick={gerarLaudoMedicoPDF}
              style={{
                width: '100%', padding: '10px', backgroundColor: '#10b981', color: '#000',
                border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px',
                cursor: 'pointer', marginBottom: '8px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
              }}
            >
              📑 Gerar Laudo Médico & de Imagem Completo (.PDF)
            </button>

            <div style={{ backgroundColor: '#020617', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '10px', color: '#cbd5e1' }}>
              <strong>Status:</strong> {statusExame}
            </div>
          </div>
        )}
      </div>

      {/* 🤖 OVERLAY ROBOTOC HUD & MULTICLOUD (IGUAL AO INDEX) */}
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
          <p style={{ fontSize: '10px', color: '#cbd5e1' }}>Sincronização volumétrica de exames RM 3D com armazenamento em nuvem segura de Emanuel da Silva.</p>
        </div>
      )}

      {/* 🏛️ ARQUITETURA DATA CENTER 3D & REDES SOCIAIS (ESTILO INDEX.JS) */}
      {arquiteturaAberta && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'rgba(7,12,28,0.96)', border: '2px solid #10b981', borderRadius: '16px', padding: '16px', zIndex: 1000, width: '340px', color: '#fff', boxShadow: '0 0 25px rgba(16,185,129,0.4)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>🏛️ ARQUITETURA DATA CENTER 3D</h3>
            <button onClick={() => setArquiteturaAberta(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div style={{ fontSize: '10px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <div>• <b>Nó Ressonância 3D:</b> Ativo (Scanner 3.0T / 7.0T)</div>
            <div>• <b>Nó Patologia & Lab:</b> Conectado (Histopatologia)</div>
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

      {/* JANELAS FUTURISTAS INTEGRADAS */}
      <FuturisticWindowManager />
    </div>
  );
}