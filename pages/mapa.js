import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

export default function MapaSpatialChakraEmanuel() {
  const mountRef = useRef(null);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [alertaAbalroamento, setAlertaAbalroamento] = useState(false);
  const [modoEmergencia, setModoEmergencia] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(null);

  // 🌟 SEUS LINKS E DADOS REAIS CENTRALIZADOS
  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Central Emanuel.OS)",
    whatsapp: "5588981493989",
    whatsappFormatado: "(88) 98149-3989",
    facebook: "https://www.facebook.com/leeheroi.heroi",
    github: "https://github.com/Manomae",
    email: "leeheroi123@gmail.com",
    instagram: "https://www.instagram.com/emanuelsilva432",
    threads: "https://www.threads.net/@emanuelsilva432",
    youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
  };

  // 🌤️ DADOS CLIMÁTICOS FICTÍCIOS DE DEFESA CIVIL E PREVENÇÃO
  const dadosClima = {
    temperatura: "29°C",
    condicao: "⛈️ Tempestade Isolada Preditiva",
    umidade: "84%",
    vento: "32 km/h NE",
    alertaDeslizamento: "⚠️ ALERTA AMARELO: Risco de Deslizamento em Áreas de Encosta/Risco nas próximas 4h"
  };

  // 🌍 CONSTRUÇÕES E INFRAESTRUTURA DA CIDADE
  const estabelecimentos = [
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor de Dados & Nuvem AGI', cor: 0x00f0ff, posicao: { x: -6, y: 3, z: -4 }, ipCriptografado: 'AES256-88F9-90A1-EMA', tipo: 'tech' },
    { id: 2, nome: 'Arena Futebol Clube & Parque Neon', categoria: '⚽ Estádio & Lazer Comunitário', cor: 0x00ff66, posicao: { x: 6, y: 1.5, z: 4 }, ipCriptografado: 'AES256-11B4-33C8-ARENA', tipo: 'lazer' },
    { id: 3, nome: 'Hospital Geral & Clínica Vet 24h', categoria: '🏥 Saúde Humana, Animal & Emergência', cor: 0xff0055, posicao: { x: -5, y: 2.2, z: 5 }, ipCriptografado: 'AES256-55H2-88X9-HOSP', tipo: 'emergencia' },
    { id: 4, nome: 'Usina Solar & Matriz Energética 3D', categoria: '⚡ Energia Limpa & Renovável', cor: 0xffaa00, posicao: { x: 7, y: 2, z: -6 }, ipCriptografado: 'AES256-99A1-11Z2-SOLAR', tipo: 'energia' },
    { id: 5, nome: 'Fazenda Tech & Agronegócio Inteligente', categoria: '🌾 Agricultura Digital & Drones', cor: 0x88ff00, posicao: { x: -8, y: 1.2, z: -8 }, ipCriptografado: 'AES256-33D4-77E8-AGRO', tipo: 'agro' },
    { id: 6, nome: 'Catedral & Templo de Luz', categoria: 'Igreja & Apoio Espiritual', cor: 0xaa00ff, posicao: { x: 0, y: 4, z: -7 }, ipCriptografado: 'AES256-77F8-44K1-TEMPLO', tipo: 'social' },
    { id: 7, nome: 'Praça Central & Quiosque Digital', categoria: '🌳 Convivência & Wi-Fi Livre', cor: 0x00aaff, posicao: { x: 0, y: 0.8, z: 2 }, ipCriptografado: 'AES256-22M9-11L3-PRACA', tipo: 'social' },
    { id: 8, nome: 'Centro Comercial & Shopping Cyber', categoria: '🛍️ Lojas & Mercado Digital', cor: 0xff00aa, posicao: { x: 4, y: 2.8, z: -1 }, ipCriptografado: 'AES256-44J3-99P8-LOJAS', tipo: 'comercio' },
    { id: 9, nome: 'Batalhão de Polícia Central & Perícia', categoria: '👮 Segurança Pública & Proteção Cidadã', cor: 0x0066ff, posicao: { x: -3, y: 2.5, z: -7 }, ipCriptografado: 'AES256-99POL-190-SEC', tipo: 'emergencia' }
  ];

  // ⏰ ATUALIZADOR DO RELÓGIO (EVITA O ERRO DE HYDRATION)
  useEffect(() => {
    setTempoAtual(new Date());
    const timer = setInterval(() => setTempoAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. CENA, CÂMERA E RENDERIZADOR
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 18, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // 2. ILUMINAÇÃO
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00f0ff, 3, 100);
    mainLight.position.set(0, 25, 0);
    scene.add(mainLight);

    const gridHelper = new THREE.GridHelper(40, 40, 0x1f2937, 0x0b0f19);
    scene.add(gridHelper);

    // 🏎️ 3. PISTA CYBERPUNK NEON TECNOLÓGICA (ESTILO FILME / TRON)
    const pistaGeo = new THREE.RingGeometry(8.6, 9.4, 64);
    const pistaMat = new THREE.MeshStandardMaterial({ 
      color: 0x00f0ff, 
      emissive: 0x00f0ff, 
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide
    });
    const pistaMesh = new THREE.Mesh(pistaGeo, pistaMat);
    pistaMesh.rotation.x = Math.PI / 2;
    pistaMesh.position.y = 0.02;
    scene.add(pistaMesh);

    // Pista interna de contraste
    const pistaGeo2 = new THREE.RingGeometry(8.8, 9.2, 64);
    const pistaMat2 = new THREE.MeshBasicMaterial({ color: 0xff0055, side: THREE.DoubleSide });
    const pistaMesh2 = new THREE.Mesh(pistaGeo2, pistaMat2);
    pistaMesh2.rotation.x = Math.PI / 2;
    pistaMesh2.position.y = 0.03;
    scene.add(pistaMesh2);

    // 🟢 4. NÚCLEO CENTRAL DO SISTEMA EMANUEL.OS
    const centroGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const centroMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, roughness: 0.1 });
    const centroMesh = new THREE.Mesh(centroGeo, centroMat);
    centroMesh.position.set(0, 6, 0);
    scene.add(centroMesh);

    const objetosInterativos = [];
    const dadosFluxoParticulas = [];

    // 5. MAPPING DE PRÉDIOS, LINHAS DE CHAKRA E NUVENS DE IA
    estabelecimentos.forEach((est) => {
      const geometry = new THREE.BoxGeometry(2, est.posicao.y * 2, 2);
      const material = new THREE.MeshStandardMaterial({ color: est.cor, roughness: 0.1, metalness: 0.8 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(est.posicao.x, est.posicao.y, est.posicao.z);
      mesh.userData = est;
      scene.add(mesh);
      objetosInterativos.push(mesh);

      // Linhas de Chakra estilo Kankuro
      const materialLinha = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 });
      const pontos = [
        new THREE.Vector3(est.posicao.x, est.posicao.y * 2, est.posicao.z),
        new THREE.Vector3(0, 6, 0)
      ];
      const geometriaLinha = new THREE.BufferGeometry().setFromPoints(pontos);
      const linhaChakra = new THREE.Line(geometriaLinha, materialLinha);
      scene.add(linhaChakra);

      // Nuvens de IA na base
      const nuvemGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const nuvemMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.15, wireframe: true });
      const nuvemMesh = new THREE.Mesh(nuvemGeo, nuvemMat);
      nuvemMesh.position.set(est.posicao.x, 0.1, est.posicao.z);
      scene.add(nuvemMesh);

      // Partículas trafegando
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

    // 🚘 6. VEÍCULOS AUTÔNOMOS RODANDO NA PISTA TECNOLÓGICA
    const carGeo = new THREE.BoxGeometry(0.8, 0.4, 1.2);
    const carMat1 = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 0.5 });
    const carMat2 = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.5 });

    const veiculo1 = new THREE.Mesh(carGeo, carMat1);
    const veiculo2 = new THREE.Mesh(carGeo, carMat2);
    veiculo1.position.set(0, 0.3, 9);
    veiculo2.position.set(0, 0.3, -9);
    scene.add(veiculo1);
    scene.add(veiculo2);

    let anguloV1 = 0;
    let anguloV2 = Math.PI;

    // 7. RAYCASTER PARA CLIQUE INTERATIVO
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objetosInterativos);

      if (intersects.length > 0) {
        setLocalSelecionado(intersects[0].object.userData);
      }
    };

    window.addEventListener('click', handleMouseClick);

    // 8. LOOP DE ANIMAÇÃO DA CIDADE
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      scene.rotation.y += 0.001;

      // Movimentação do Fluxo de Dados
      dadosFluxoParticulas.forEach((p) => {
        p.progresso += 0.007;
        if (p.progresso > 1) p.progresso = 0;
        p.mesh.position.lerpVectors(p.inicio, p.fim, p.progresso);
      });

      // Movimento na Pista Neon Futurista
      anguloV1 += 0.015;
      anguloV2 += 0.012;

      const raio = 9;

      veiculo1.position.x = Math.cos(anguloV1) * raio;
      veiculo1.position.z = Math.sin(anguloV1) * raio;
      veiculo1.rotation.y = -anguloV1;

      veiculo2.position.x = Math.cos(anguloV2) * raio;
      veiculo2.position.z = Math.sin(anguloV2) * raio;
      veiculo2.rotation.y = -anguloV2;

      // Detector Anti-Abalroamento
      const distancia = veiculo1.position.distanceTo(veiculo2.position);
      if (distancia < 4.0) {
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
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', overflow: 'hidden', position: 'relative', fontFamily: '"Segoe UI", sans-serif' }}>
      <Head>
        <title>Emanuel.OS - Tráfego Autônomo, Clima & Defesa Civil 3D</title>
      </Head>

      {/* CABEÇALHO PRINCIPAL */}
      <header style={{ position: 'absolute', top: '25px', left: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '22px', margin: 0, color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>
          🕸️ REDE DE CHAKRA <span style={{ color: '#00f0ff' }}>3D, CLIMA & IoT</span>
        </h1>
        <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 'bold' }}>
          Mapeamento Urbano, Pista Neon Autônoma e Previsão Metereológica de Risco
        </span>
      </header>

      {/* ⏰ PAINEL DE RELÓGIO E CLIMA EM TEMPO REAL */}
      <div style={{
        position: 'absolute', top: '90px', left: '30px', zIndex: 15,
        backgroundColor: 'rgba(7, 12, 28, 0.85)', border: '1px solid rgba(0, 240, 255, 0.4)',
        borderRadius: '16px', padding: '14px', backdropFilter: 'blur(15px)', width: '320px',
        color: '#fff', boxShadow: '0 0 20px rgba(0,240,255,0.15)'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#00f0ff', marginBottom: '4px' }}>
          📅 {tempoAtual ? tempoAtual.toLocaleDateString('pt-BR') : 'Carregando...'} - 🕒 {tempoAtual ? tempoAtual.toLocaleTimeString('pt-BR') : '--:--:--'}
        </div>
        <div style={{ fontSize: '11px', color: '#e4e4e7', marginBottom: '6px' }}>
          {dadosClima.condicao} | 🌡️ {dadosClima.temperatura} | 💨 {dadosClima.vento}
        </div>
        <div style={{ fontSize: '10px', color: '#ffaa00', backgroundColor: 'rgba(255,170,0,0.1)', padding: '6px', borderRadius: '6px', border: '1px solid rgba(255,170,0,0.3)', fontWeight: 'bold' }}>
          {dadosClima.alertaDeslizamento}
        </div>
      </div>

      {/* BOTÃO MODO SEGURANÇA */}
      <button 
        onClick={() => setModoEmergencia(!modoEmergencia)}
        style={{
          position: 'absolute', top: '210px', left: '30px', zIndex: 15,
          padding: '10px 18px', backgroundColor: modoEmergencia ? '#ff0055' : 'rgba(255,0,85,0.2)',
          color: '#fff', border: '2px solid #ff0055', borderRadius: '12px',
          fontWeight: 'bold', fontSize: '11px', cursor: 'pointer',
          boxShadow: modoEmergencia ? '0 0 25px #ff0055' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {modoEmergencia ? '🚨 MODO EMERGÊNCIA ATIVO' : '🛡️ ATIVAR MODO SEGURANÇA'}
      </button>

      {/* ALERTA PREVENÇÃO ABALROAMENTO */}
      {alertaAbalroamento && (
        <div style={{
          position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 85, 0.25)', border: '2px solid #ff0055',
          borderRadius: '30px', padding: '10px 25px', backdropFilter: 'blur(10px)',
          boxShadow: '0 0 30px #ff0055', zIndex: 30
        }}>
          <span style={{ fontSize: '13px', color: '#ff0055', fontWeight: 'bold' }}>
            ⚠️ IA ANTI-ABALROAMENTO: COLISÃO DETECTADA E PREVENIDA NA PISTA NEON!
          </span>
        </div>
      )}

      {/* BOTÃO VOLTAR */}
      <a href="/" style={{ position: 'absolute', top: '25px', right: '30px', zIndex: 10, padding: '12px 24px', backgroundColor: 'rgba(0,240,255,0.1)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
        ← Voltar ao Core Emanuel.OS
      </a>

      {/* CONTAINER THREE.JS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* CARD LATERAL COM TODOS OS SEUS LINKS REAIS (INCLUINDO YOUTUBE) */}
      {localSelecionado && (
        <aside style={{ position: 'absolute', right: '30px', bottom: '30px', width: '380px', backgroundColor: 'rgba(7, 12, 28, 0.95)', border: localSelecionado.tipo === 'emergencia' ? '2px solid #ff0055' : '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '20px', padding: '22px', backdropFilter: 'blur(25px)', boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)', zIndex: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: localSelecionado.tipo === 'emergencia' ? '#ff0055' : '#00f0ff', fontWeight: '900' }}>{localSelecionado.nome}</h3>
            <button onClick={() => setLocalSelecionado(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>✕</button>
          </div>
          <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '12px' }}>{localSelecionado.categoria}</span>

          {localSelecionado.tipo === 'emergencia' ? (
            <div style={{ backgroundColor: 'rgba(255, 0, 85, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid #ff0055', marginBottom: '15px' }}>
              <span style={{ fontSize: '11px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🚨 CANAL DIRETO DE RESPOSTA RÁPIDA</span>
              <a href="tel:190" style={{ display: 'block', padding: '10px', backgroundColor: '#ff0055', color: '#fff', textAlign: 'center', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>
                📞 Ligar para Emergência / Polícia (190)
              </a>
            </div>
          ) : (
            <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>🔒 DADOS IoT & CRIPTOGRAFIA DE PONTA A PONTA</span>
              <span style={{ fontSize: '10px', color: '#71717a', fontFamily: 'monospace' }}>SECURE NODE: {localSelecionado.ipCriptografado}</span>
            </div>
          )}

          <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>🔗 CENTRAL DE CONTATO EMANUEL:</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            
            {/* YOUTUBE OFICIAL */}
            <a href={meusDadosReais.youtube} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #ff0000', color: '#ff4d4d', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
              ▶️ Canal YouTube Oficial
            </a>

            <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>💬 WhatsApp: {meusDadosReais.whatsappFormatado}</a>
            <a href={meusDadosReais.threads} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>🧵 Threads Oficial</a>
            <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>🐙 GitHub Principal</a>
            <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>📸 Instagram</a>
            <a href={meusDadosReais.facebook} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(0, 102, 255, 0.1)', border: '1px solid #0066ff', color: '#0066ff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>🌐 Facebook</a>
            <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '10px', backgroundColor: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffc800', color: '#ffc800', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>✉️ E-mail Direto ({meusDadosReais.email})</a>
          </div>
        </aside>
      )}
    </div>
  );
}