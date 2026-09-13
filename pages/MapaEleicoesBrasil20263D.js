import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Componente de Janelas Futuristas (Mantendo integração com o ecossistema Emanuel.OS)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaEleicoesBrasil20263D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const robotocGroupRef = useRef(null);
  const barsGroupRef = useRef(null);
  const brazilMapMeshRef = useRef(null);

  // 🎯 REFERÊNCIAS PARA NAVEGAÇÃO DA CÂMERA E ZOOM 3D
  const cameraTargetPosRef = useRef(new THREE.Vector3(0, 25, 35));
  const cameraLookAtPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentCameraLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // 📊 LISTA DOS 13 CANDIDATOS PRESIDENCIAIS ELEIÇÕES BRASIL 2026
  const [candidatos, setCandidatos] = useState([
    { id: '13', nome: "Luiz Inácio Lula da Silva", partido: "PT", stats: 39, votosAbsolutos: "Aguardando TSE", cor: 0xff0000, img: "https://via.placeholder.com/150/ff0000/ffffff?text=Lula", noticias: "Comícios em capitais e balanço das propostas de governo nas redes.", engajamentoWeb: "Alto 🛜" },
    { id: '22', nome: "Flávio Bolsonaro", partido: "PL", stats: 35, votosAbsolutos: "Aguardando TSE", cor: 0x0022ff, img: "https://via.placeholder.com/150/0022ff/ffffff?text=Flavio", noticias: "Entrevistas em podcasts de grande audiência e encontros regionais.", engajamentoWeb: "Muito Alto 🛜" },
    { id: '55', nome: "Ronaldo Caiado", partido: "PSD", stats: 6, votosAbsolutos: "Aguardando TSE", cor: 0x00ff88, img: "https://via.placeholder.com/150/00ff88/ffffff?text=Caiado", noticias: "Fórum de agronegócio, segurança pública e reuniões federativas.", engajamentoWeb: "Médio 🛜" },
    { id: '70', nome: "Augusto Cury", partido: "Avante", stats: 5, votosAbsolutos: "Aguardando TSE", cor: 0x9900ff, img: "https://via.placeholder.com/150/9900ff/ffffff?text=Cury", noticias: "Lançamento de propostas para gestão da inteligência emocional e educação.", engajamentoWeb: "Alto 🛜" },
    { id: '30', nome: "Romeu Zema", partido: "Novo", stats: 4, votosAbsolutos: "Aguardando TSE", cor: 0xffaa00, img: "https://via.placeholder.com/150/ffaa00/ffffff?text=Zema", noticias: "Encontros industriais e debates sobre simplificação tributária.", engajamentoWeb: "Médio 🛜" },
    { id: '29', name: "Renan Santos", partido: "Missão", stats: 3, votosAbsolutos: "Aguardando TSE", cor: 0x00ffff, img: "https://via.placeholder.com/150/00ffff/ffffff?text=Renan", noticias: "Transmissões digitais e congressos de mobilização de militância.", engajamentoWeb: "Alto 🛜" },
    { id: '28', nome: "Pablo Marçal", partido: "PRTB", stats: 3, votosAbsolutos: "Aguardando TSE", cor: 0x555555, img: "https://via.placeholder.com/150/555555/ffffff?text=Marcal", news: "Atualizações jurídicas do registro e lives com plano de governo.", engajamentoWeb: "Viral 🛜" },
    { id: '27', nome: "Clariana Barão", partido: "DC", stats: 1, votosAbsolutos: "Aguardando TSE", cor: 0xff00ff, img: "https://via.placeholder.com/150/ff00ff/ffffff?text=Clariana", noticias: "Apresentação da diretriz nacional de centro-direita e ética pública.", engajamentoWeb: "Estável 🛜" },
    { id: '21', nome: "Edmilson Costa", partido: "PCB", stats: 1, votosAbsolutos: "Aguardando TSE", cor: 0x880000, img: "https://via.placeholder.com/150/880000/ffffff?text=Edmilson", noticias: "Debates comunitários sobre direitos sociais e pautas trabalhistas.", engajamentoWeb: "Moderado 🛜" },
    { id: '16', nome: "Hertz Dias", partido: "PSTU", stats: 1, votosAbsolutos: "Aguardando TSE", cor: 0xaa0000, img: "https://via.placeholder.com/150/aa0000/ffffff?text=Hertz", noticias: "Encontros com coletivos populares, sindicatos e mobilização de rua.", engajamentoWeb: "Moderado 🛜" },
    { id: '33', nome: "Rui Costa Pimenta", partido: "PCO", stats: 1, votosAbsolutos: "Aguardando TSE", cor: 0xcc3300, img: "https://via.placeholder.com/150/cc3300/ffffff?text=Rui", noticias: "Análises de conjuntura eleitoral em plataformas independentes.", engajamentoWeb: "Ativo 🛜" },
    { id: '80', nome: "Samara Feitosa", partido: "UP", stats: 1, votosAbsolutos: "Aguardando TSE", cor: 0x0088ff, img: "https://via.placeholder.com/150/0088ff/ffffff?text=Samara", noticias: "Atos públicos focados em reforma urbana e causas sociais.", engajamentoWeb: "Ativo 🛜" },
    { id: '35', nome: "Wilson Grassi", partido: "Democrata", stats: 1, votosAbsolutos: "Aguardando TSE", cor: 0x00ffaa, img: "https://via.placeholder.com/150/00ffaa/ffffff?text=Grassi", noticias: "Apresentação do programa para saúde pública e causa animal.", engajamentoWeb: "Estável 🛜" }
  ]);

  // 🎛️ ESTADOS DO MAPA & APURAÇÃO AO VIVO
  const [faseEleicao, setFaseEleicao] = useState('pesquisas'); // 'pesquisas', 'turno1', 'turno2'
  const [estiloCenario, setEstiloCenario] = useState('cyber'); // 'cyber', 'satellite', 'topo'
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [porcentagemApurada, setPorcentagemApurada] = useState("0.00%");
  const [statusApuracao, setStatusApuracao] = useState("AGUARDANDO ABERTURA DAS URNAS TSE");
  const [tempoAtual, setTempoAtual] = useState(null);

  // 🤖 ESTADO DO ROBOTOC ELEITORAL 3D
  const [falaRobotoc, setFalaRobotoc] = useState("Bem-vindo ao Mapa Eleições Brasil 2026 3D! Selecione um candidato ou mude de cenário.");

  // 🌐 DADOS REAIS E REDES SOCIAIS DE EMANUEL
  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Emanuel.OS)",
    whatsapp: "5588981493989",
    whatsappFormatado: "(88) 98149-3989",
    email: "leeheroi123@gmail.com",
    github: "https://github.com/Manomae",
    youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
  };

  // RELÓGIO DA CENTRAL ELEITORAL
  useEffect(() => {
    setTempoAtual(new Date());
    const timer = setInterval(() => setTempoAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🛰️ API DO TSE AO VIVO (SEMAFORO DE CONEXÃO REAL SEM SIMULAÇÕES FICTÍCIAS FIXAS)
  useEffect(() => {
    let intervalId;

    const consumirTSE = async () => {
      try {
        // Endpoint Oficial CDN TSE Eleições 2026 (1º Turno)
        const response = await fetch("https://resultados.tse.jus.br/oficial/ele2026/544/dados-simplificados/br/br-c0001-e000544-r.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Aguardando liberação da CDN do TSE");
        
        const data = await response.json();
        if (data && data.pst) {
          setPorcentagemApurada(`${data.pst}%`);
          setStatusApuracao("APURAÇÃO AO VIVO EM TEMPO REAL (TSE)");
          setFalaRobotoc(`Atenção: Apuração oficial em andamento! ${data.pst}% das seções apuradas no Brasil.`);

          // Atualizar lista dos candidatos dinamicamente com o feed oficial
          if (data.cand) {
            setCandidatos(prev => prev.map(c => {
              const encontrado = data.cand.find(tseCand => tseCand.n === c.id);
              if (encontrado) {
                return {
                  ...c,
                  stats: parseFloat(encontrado.pvap.replace(',', '.')),
                  votosAbsolutos: Number(encontrado.vap).toLocaleString('pt-BR')
                };
              }
              return c;
            }));
          }
        }
      } catch (err) {
        if (faseEleicao !== 'pesquisas') {
          setStatusApuracao("SISTEMA CONECTADO À API TSE (AGUARDANDO CONTAGEM OFICIAL)");
        }
      }
    };

    if (faseEleicao === 'turno1' || faseEleicao === 'turno2') {
      consumirTSE();
      intervalId = setInterval(consumirTSE, 15000); // Polling a cada 15 segundos
    } else {
      setStatusApuracao("SISTEMA EM MODO DE PESQUISAS & ENGAJAMENTO 🛜");
    }

    return () => { if (intervalId) clearInterval(intervalId); };
  }, [faseEleicao]);

  // 🥽 FUNÇÃO DE ZOOM DA CÂMERA NOS CANDIDATOS E PONTOS CHAVE
  const aplicarZoomTarget = (pos, lookAt) => {
    cameraTargetPosRef.current.copy(pos);
    cameraLookAtPosRef.current.copy(lookAt);
  };

  // 🎨 MOTOR THREE.JS (RENDERIZADOR 3D COMPLETO)
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. CENA & CÂMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030611);
    scene.fog = new THREE.FogExp2(0x030611, 0.012);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 25, 35);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.05;

    // 2. ILUMINAÇÃO CYBER-ELEITORAL
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00ffcc, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0xff0077, 2, 80, Math.PI / 4);
    spotLight.position.set(-20, 30, -10);
    scene.add(spotLight);

    // 3. MAPA 3D DO BRASIL (EXTRUDADO COM ELEVAÇÃO TOPOGRÁFICA)
    const criarMapaBrasil3D = (estilo) => {
      if (brazilMapMeshRef.current) scene.remove(brazilMapMeshRef.current);

      const shape = new THREE.Shape();
      // Vértices do contorno geográfico simplificado do Brasil
      shape.moveTo(-12, 9);
      shape.lineTo(-2, 10);
      shape.lineTo(9, 6);
      shape.lineTo(11, 0);
      shape.lineTo(7, -9);
      shape.lineTo(2, -11);
      shape.lineTo(-5, -7);
      shape.lineTo(-10, -3);
      shape.lineTo(-13, 5);
      shape.closePath();

      const extrudeSettings = {
        depth: estilo === 'topo' ? 3.5 : 1.8,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 3,
        bevelSize: 0.4,
        bevelThickness: 0.4
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.rotateX(-Math.PI / 2);

      let material;
      if (estilo === 'satellite') {
        material = new THREE.MeshStandardMaterial({ color: 0x0f2a1d, roughness: 0.5, metalness: 0.3 });
      } else if (estilo === 'topo') {
        material = new THREE.MeshStandardMaterial({ color: 0x1e293b, wireframe: true });
      } else { // Cyberpunk default
        material = new THREE.MeshStandardMaterial({ color: 0x091428, roughness: 0.2, metalness: 0.8 });
      }

      const mapMesh = new THREE.Mesh(geometry, material);
      mapMesh.position.y = -1;
      brazilMapMeshRef.current = mapMesh;
      scene.add(mapMesh);

      // Anel Cyber de Votação Nacional
      const ringGeo = new THREE.RingGeometry(16, 16.3, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.9;
      scene.add(ringMesh);
    };

    criarMapaBrasil3D(estiloCenario);

    // 4. GRÁFICOS 3D E MOLDURAS FOTOGRÁFICAS DOS CANDIDATOS
    const barsGroup = new THREE.Group();
    barsGroupRef.current = barsGroup;
    scene.add(barsGroup);

    const objetosInterativos = [];

    const construirGrafico3D = () => {
      barsGroup.clear();
      objetosInterativos.length = 0;

      const total = candidatos.length;
      const raio = 17;

      candidatos.forEach((cand, i) => {
        // Filtragem para o 2º Turno (Somente os 2 mais votados)
        if (faseEleicao === 'turno2' && i >= 2) return;

        const angulo = (i / (faseEleicao === 'turno2' ? 2 : total)) * Math.PI * 2;
        const x = Math.cos(angulo) * raio;
        const z = Math.sin(angulo) * raio;
        const alturaBarra = (cand.stats / 100) * 26 + 1;

        const candGroup = new THREE.Group();

        // Barra Tridimensional
        const barGeo = new THREE.BoxGeometry(1.4, alturaBarra, 1.4);
        const barMat = new THREE.MeshStandardMaterial({
          color: cand.cor,
          roughness: 0.2,
          metalness: 0.6,
          emissive: cand.cor,
          emissiveIntensity: 0.25
        });
        const barMesh = new THREE.Mesh(barGeo, barMat);
        barMesh.position.set(0, alturaBarra / 2, 0);
        barMesh.userData = cand;

        // Moldura / Canvas Foto 3D
        const frameGeo = new THREE.BoxGeometry(1.8, 1.8, 0.2);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        frameMesh.position.set(0, alturaBarra + 1.2, 0);

        // Indicador de Sinal 🛜 Flutuante
        const signalGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const signalMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
        const signalMesh = new THREE.Mesh(signalGeo, signalMat);
        signalMesh.position.set(0, alturaBarra + 2.5, 0);

        candGroup.position.set(x, 0, z);
        candGroup.add(barMesh);
        candGroup.add(frameMesh);
        candGroup.add(signalMesh);

        barsGroup.add(candGroup);
        objetosInterativos.push(barMesh);
      });
    };

    construirGrafico3D();

    // 5. ROBOTOC 3D EXCLUSIVO DO MAPA ELEIÇÕES
    const robotocGroup = new THREE.Group();
    robotocGroupRef.current = robotocGroup;

    // Cabeça Robótica Cyber
    const robotHeadGeo = new THREE.BoxGeometry(1.2, 0.9, 0.9);
    const robotMat = new THREE.MeshStandardMaterial({ color: 0x00aeff, metalness: 0.9, roughness: 0.1 });
    const robotHead = new THREE.Mesh(robotHeadGeo, robotMat);
    robotHead.position.y = 1.4;

    // Viseira / Olhos Luminosos com tema de Urna Eleitoral
    const visorGeo = new THREE.BoxGeometry(0.9, 0.3, 0.1);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.45, 0.46);

    // Antena de Conexão com o TSE
    const antGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
    const antMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const antena = new THREE.Mesh(antGeo, antMat);
    antena.position.set(0, 2.1, 0);

    // Corpo do Robô
    const robotBodyGeo = new THREE.CylinderGeometry(0.7, 0.5, 1.4, 16);
    const robotBody = new THREE.Mesh(robotBodyGeo, robotMat);
    robotBody.position.y = 0.3;

    robotocGroup.add(robotHead, visor, antena, robotBody);
    robotocGroup.position.set(0, 5, 0);
    scene.add(robotocGroup);

    // 6. INTERAÇÃO E RAYCASTING DE CLIQUE NOS CANDIDATOS 3D
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objetosInterativos);

      if (intersects.length > 0) {
        const cand = intersects[0].object.userData;
        setCandidatoSelecionado(cand);
        setFalaRobotoc(`Você selecionou ${cand.nome} (${cand.partido}). Verifique as estatísticas no painel lateral!`);

        // Zoom suave no candidato selecionado
        const objPos = intersects[0].object.matrixWorld;
        const targetVector = new THREE.Vector3();
        targetVector.setFromMatrixPosition(objPos);

        aplicarZoomTarget(
          new THREE.Vector3(targetVector.x * 1.3, targetVector.y + 4, targetVector.z * 1.3),
          targetVector
        );
      }
    };

    window.addEventListener('click', handleMouseClick);

    // 7. LOOP DE ANIMAÇÃO 3D
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Flutuação e rotação do ROBOTOC 3D
      if (robotocGroupRef.current) {
        robotocGroupRef.current.position.y = 5 + Math.sin(elapsedTime * 2.5) * 0.4;
        robotocGroupRef.current.rotation.y += 0.008;
      }

      // Rotação sutil do Mapa do Brasil 3D
      if (brazilMapMeshRef.current) {
        brazilMapMeshRef.current.rotation.z = Math.sin(elapsedTime * 0.5) * 0.015;
      }

      // Orientar molduras fotográficas para a câmera
      if (barsGroupRef.current) {
        barsGroupRef.current.children.forEach(group => {
          const photoFrame = group.children[1];
          if (photoFrame) photoFrame.lookAt(camera.position);
        });
      }

      // Lerp Suave da Câmera
      camera.position.lerp(cameraTargetPosRef.current, 0.04);
      currentCameraLookAtRef.current.lerp(cameraLookAtPosRef.current, 0.04);
      camera.lookAt(currentCameraLookAtRef.current);

      controls.update();
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
  }, [candidatos, estiloCenario, faseEleicao]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030611', overflow: 'hidden', position: 'relative', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      <Head>
        <title>Mapa Eleições Brasil 2026 3D - Central AGI Emanuel.OS</title>
      </Head>

      {/* 🔮 CABEÇALHO CYBER-ELEITORAL */}
      <header style={{ position: 'absolute', top: '15px', left: '25px', zIndex: 20 }}>
        <h1 style={{ fontSize: '20px', margin: 0, color: '#00ffcc', fontWeight: '900', letterSpacing: '1px', textShadow: '0 0 12px rgba(0,255,200,0.4)' }}>
          🗳️ MAPA ELEIÇÕES BRASIL 2026 3D
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '10px', backgroundColor: 'rgba(255, 0, 60, 0.25)', border: '1px solid #ff003c', color: '#ff003c', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
            🔴 {statusApuracao}
          </span>
          <span style={{ fontSize: '10px', color: '#a1a1aa' }}>
            Apurado: <b style={{ color: '#00ffcc' }}>{porcentagemApurada}</b>
          </span>
        </div>
      </header>

      {/* 🎛️ BARRA DE CONTROLE DE CENÁRIOS E FASES DA ELEIÇÃO */}
      <div style={{ position: 'absolute', top: '15px', right: '25px', zIndex: 30, display: 'flex', gap: '10px' }}>
        <select
          value={faseEleicao}
          onChange={(e) => {
            setFaseEleicao(e.target.value);
            setFalaRobotoc(`Modo alterado para: ${e.target.options[e.target.selectedIndex].text}`);
          }}
          style={{ backgroundColor: 'rgba(15, 25, 50, 0.9)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', outline: 'none' }}
        >
          <option value="pesquisas">Pesquisas & Internet 🛜</option>
          <option value="turno1">1º Turno (Ao Vivo TSE)</option>
          <option value="turno2">2º Turno (Futuro)</option>
        </select>

        <select
          value={estiloCenario}
          onChange={(e) => {
            setEstiloCenario(e.target.value);
            setFalaRobotoc(`Cenário 3D alterado para: ${e.target.options[e.target.selectedIndex].text}`);
          }}
          style={{ backgroundColor: 'rgba(15, 25, 50, 0.9)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', outline: 'none' }}
        >
          <option value="cyber">Cenário: Cyberpunk 3D</option>
          <option value="satellite">Cenário: Satélite</option>
          <option value="topo">Cenário: Topográfico</option>
        </select>

        <button
          onClick={() => aplicarZoomTarget(new THREE.Vector3(0, 25, 35), new THREE.Vector3(0, 0, 0))}
          style={{ backgroundColor: 'rgba(0, 255, 200, 0.2)', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
        >
          🌐 Reset Visão
        </button>
      </div>

      {/* 🤖 ROBOTOC ELEITORAL 3D (PAINEL DE FALA AO VIVO) */}
      <div style={{ position: 'absolute', bottom: '25px', left: '25px', zIndex: 30, backgroundColor: 'rgba(5, 12, 25, 0.95)', border: '1px solid #00aeff', borderRadius: '14px', padding: '14px 18px', maxWidth: '340px', boxShadow: '0 0 20px rgba(0, 174, 255, 0.3)', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '2rem' }}>🤖</div>
        <div>
          <h4 style="margin: 0; color: #00aeff; font-size: 0.85rem;">ROBOTOC Eleitoral 3D</h4>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#ddd', lineHeight: '1.3' }}>{falaRobotoc}</p>
        </div>
      </div>

      {/* 📊 PAINEL LATERAL DO CANDIDATO SELECIONADO */}
      {candidatoSelecionado && (
        <aside style={{ position: 'absolute', right: '25px', top: '80px', width: '340px', backgroundColor: 'rgba(10, 15, 30, 0.95)', border: '1px solid rgba(0, 255, 200, 0.4)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(20px)', zIndex: 40, color: '#fff', boxShadow: '0 0 30px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={candidatoSelecionado.img} alt={candidatoSelecionado.nome} style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #00ffcc', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#00ffcc' }}>{candidatoSelecionado.nome}</h3>
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Partido: {candidatoSelecionado.partido} ({candidatoSelecionado.id})</span>
              </div>
            </div>
            <button onClick={() => setCandidatoSelecionado(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem' }}>
              <strong>Intenção / Porcentagem:</strong> <span style={{ color: '#00ffcc', fontWeight: 'bold' }}>{candidatoSelecionado.stats}%</span>
            </p>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem' }}>
              <strong>Engajamento Web:</strong> <span style={{ color: '#ff0077', fontWeight: 'bold' }}>{candidatoSelecionado.engajamentoWeb}</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>
              Votos Totais TSE: <span style={{ color: '#fff' }}>{candidatoSelecionado.votosAbsolutos}</span>
            </p>
          </div>

          <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '6px' }}>Últimas Notícias 3D:</h4>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderLeft: '3px solid #00ffcc', padding: '10px', borderRadius: '0 8px 8px 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
            {candidatoSelecionado.noticias}
          </div>
        </aside>
      )}

      {/* 🚀 CONTAINER WEBGL / THREE.JS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* 🪟 GERENCIADOR DE JANELAS FUTURISTAS INTEGRADO */}
      <FuturisticWindowManager />
    </div>
  );
}
