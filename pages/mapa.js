import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

export default function MapaSpatialChakraEmanuel() {
  const mountRef = useRef(null);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [alertaAbalroamento, setAlertaAbalroamento] = useState(false);
  const [modoEmergencia, setModoEmergencia] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(null);
  
  // ESTADOS DE PRODUTIVIDADE E FERRAMENTAS CLOUD (PIX REMOVIDO)
  const [abaAtiva, setAbaAtiva] = useState(null);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([
    { id: 1, texto: 'Sincronizar dados da Nuvem AGI', horario: '14:00', status: 'Pendente' },
    { id: 2, texto: 'Monitoramento de tráfego autônomo e regras de trânsito', horario: '15:30', status: 'Ativo' }
  ]);
  const [linkGerado, setLinkGerado] = useState('');

  // 🔍 ESTADOS DA BARRA DE PESQUISA COM API NOMINATIM
  const [termoBusca, setTermoBusca] = useState('');
  const [sugestoesBusca, setSugestoesBusca] = useState([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);

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

  const dadosClima = {
    temperatura: "29°C",
    condicao: "⛈️ Tempestade Isolada Preditiva",
    alertaDeslizamento: "⚠️ ALERTA AMARELO: Risco de Deslizamento em Áreas de Encosta"
  };

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

  // RELÓGIO
  useEffect(() => {
    setTempoAtual(new Date());
    const timer = setInterval(() => setTempoAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // API NOMINATIM (AUTOCOMPLETAR)
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
        console.error("Erro na API de busca:", error);
      } finally {
        setCarregandoBusca(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [termoBusca]);

  // CENA 3D (THREE.JS)
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 18, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00f0ff, 3, 100);
    mainLight.position.set(0, 25, 0);
    scene.add(mainLight);

    const gridHelper = new THREE.GridHelper(40, 40, 0x1f2937, 0x0b0f19);
    scene.add(gridHelper);

    // 🏎️ PISTA NEON TRON
    const pistaGeo = new THREE.RingGeometry(8.6, 9.4, 64);
    const pistaMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6, side: THREE.DoubleSide });
    const pistaMesh = new THREE.Mesh(pistaGeo, pistaMat);
    pistaMesh.rotation.x = Math.PI / 2;
    pistaMesh.position.y = 0.02;
    scene.add(pistaMesh);

    // 🚸 LOMBADAS 3D (QUEBRA-MOLAS) NA PISTA
    const lombadaGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16, 1, false, 0, Math.PI);
    const lombadaMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.4 });
    
    const lombada1 = new THREE.Mesh(lombadaGeo, lombadaMat);
    lombada1.position.set(0, 0.1, 9);
    lombada1.rotation.z = Math.PI / 2;
    scene.add(lombada1);

    const lombada2 = new THREE.Mesh(lombadaGeo, lombadaMat);
    lombada2.position.set(0, 0.1, -9);
    lombada2.rotation.z = Math.PI / 2;
    scene.add(lombada2);

    // 🛑 PLACAS DE SINALIZAÇÃO DE TRÂNSITO EM 3D (REGRAS DE VELOCIDADE E PARE)
    const hasteGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
    const hasteMat = new THREE.MeshBasicMaterial({ color: 0x888888 });

    const placaPareGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 8);
    const placaPareMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // Placa 1
    const haste1 = new THREE.Mesh(hasteGeo, hasteMat);
    haste1.position.set(2, 1.25, 9.5);
    const placa1 = new THREE.Mesh(placaPareGeo, placaPareMat);
    placa1.position.set(2, 2.3, 9.5);
    placa1.rotation.x = Math.PI / 2;
    scene.add(haste1);
    scene.add(placa1);

    // 🟢 NÚCLEO CENTRAL
    const centroGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const centroMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, roughness: 0.1 });
    const centroMesh = new THREE.Mesh(centroGeo, centroMat);
    centroMesh.position.set(0, 6, 0);
    scene.add(centroMesh);

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

    // 🚘 VEÍCULOS AUTÔNOMOS
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

    // 🔄 LOOP DE ANIMAÇÃO E SENSOR ANTI-ABALROAMENTO
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      scene.rotation.y += 0.001;

      dadosFluxoParticulas.forEach((p) => {
        p.progresso += 0.007;
        if (p.progresso > 1) p.progresso = 0;
        p.mesh.position.lerpVectors(p.inicio, p.fim, p.progresso);
      });

      anguloV1 += 0.015;
      anguloV2 += 0.012;
      const raio = 9;

      veiculo1.position.x = Math.cos(anguloV1) * raio;
      veiculo1.position.z = Math.sin(anguloV1) * raio;
      veiculo1.rotation.y = -anguloV1;

      veiculo2.position.x = Math.cos(anguloV2) * raio;
      veiculo2.position.z = Math.sin(anguloV2) * raio;
      veiculo2.rotation.y = -anguloV2;

      // 🚨 SENSOR IA DE PREVENÇÃO DE BATIDAS / ABALROAMENTO
      const distanciaEntreCarros = veiculo1.position.distanceTo(veiculo2.position);
      if (distanciaEntreCarros < 4.5) {
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
      categoria: `📍 Local Global (${item.type || 'Região'})`,
      ipCriptografado: `LAT: ${parseFloat(item.lat).toFixed(4)} | LON: ${parseFloat(item.lon).toFixed(4)}`,
      tipo: 'global'
    });
    setTermoBusca('');
    setSugestoesBusca([]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', overflow: 'hidden', position: 'relative', fontFamily: '"Segoe UI", sans-serif' }}>
      <Head>
        <title>Emanuel.OS - Tráfego Autônomo, Regras & Mapeamento 3D</title>
      </Head>

      {/* CABEÇALHO */}
      <header style={{ position: 'absolute', top: '20px', left: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '18px', margin: 0, color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>
          ✨ EMANUEL.OS <span style={{ color: '#00f0ff' }}>SISTEMA DE TRÁFEGO & REGRAS</span>
        </h1>
        <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold' }}>
          Automação com Preferência de Pedestres (Crianças/Idosos/PCDs) e Sinalização
        </span>
      </header>

      {/* 🚨 ALERTA EM TEMPO REAL DA IA ANTI-ABALROAMENTO / BATIDAS */}
      {alertaAbalroamento && (
        <div style={{
          position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 85, 0.25)', border: '2px solid #ff0055',
          borderRadius: '30px', padding: '10px 25px', backdropFilter: 'blur(10px)',
          boxShadow: '0 0 30px #ff0055', zIndex: 30
        }}>
          <span style={{ fontSize: '12px', color: '#ff0055', fontWeight: 'bold' }}>
            ⚠️ IA ANTI-ABALROAMENTO: RISCO DE COLISÃO DETECTADO E FREIO AUTÔNOMO ATIVADO!
          </span>
        </div>
      )}

      {/* 🔍 BARRA DE PESQUISA GLOBAL (NOMINATIM API) */}
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 35, width: '360px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Pesquisar cidade, país, rua ou bairro..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px',
              backgroundColor: 'rgba(7, 12, 28, 0.9)',
              border: '1px solid #00f0ff',
              borderRadius: '25px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
              boxSizing: 'border-box'
            }}
          />
          {carregandoBusca && (
            <span style={{ position: 'absolute', right: '15px', top: '12px', fontSize: '10px', color: '#00f0ff' }}>⚡</span>
          )}
        </div>

        {/* LISTA SUSPENSA DE SUGESTÕES */}
        {sugestoesBusca.length > 0 && (
          <ul style={{
            listStyle: 'none',
            margin: '8px 0 0 0',
            padding: '8px',
            backgroundColor: 'rgba(7, 12, 28, 0.95)',
            border: '1px solid rgba(0, 240, 255, 0.5)',
            borderRadius: '15px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            {sugestoesBusca.map((item, index) => (
              <li
                key={index}
                onClick={() => selecionarLocalPesquisado(item)}
                style={{
                  padding: '10px',
                  fontSize: '11px',
                  color: '#e4e4e7',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.4'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.15)'; e.currentTarget.style.color = '#00f0ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#e4e4e7'; }}
              >
                📍 <b>{item.display_name}</b>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FERRAMENTAS CLOUD (AGENDA E LINKS) */}
      <div style={{ position: 'absolute', top: '20px', right: '150px', zIndex: 25, display: 'flex', gap: '8px' }}>
        <button onClick={() => setAbaAtiva('agenda')} style={{ padding: '8px 14px', background: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '12px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          📅 Agenda
        </button>
        <button onClick={() => setAbaAtiva('link')} style={{ padding: '8px 14px', background: 'rgba(255,0,170,0.15)', border: '1px solid #ff00aa', color: '#ff00aa', borderRadius: '12px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          🔗 Link Cloud
        </button>
      </div>

      {/* RELÓGIO, CLIMA & REGRAS DE PREFERÊNCIA */}
      <div style={{ position: 'absolute', top: '80px', left: '30px', zIndex: 15, backgroundColor: 'rgba(7, 12, 28, 0.85)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(15px)', width: '280px', color: '#fff' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00f0ff', marginBottom: '4px' }}>
          📅 {tempoAtual ? tempoAtual.toLocaleDateString('pt-BR') : 'Carregando...'} - 🕒 {tempoAtual ? tempoAtual.toLocaleTimeString('pt-BR') : '--:--:--'}
        </div>
        <div style={{ fontSize: '10px', color: '#e4e4e7', marginBottom: '6px' }}>
          {dadosClima.condicao} | 🌡️ {dadosClima.temperatura}
        </div>
        <div style={{ fontSize: '9px', color: '#00ff66', backgroundColor: 'rgba(0,255,102,0.1)', padding: '6px', borderRadius: '6px', border: '1px solid rgba(0,255,102,0.3)', fontWeight: 'bold' }}>
          🚸 PRIORIDADE MÁXIMA DE TRAVESSIA: Idosos, Crianças e PCDs
        </div>
      </div>

      {/* BOTÃO VOLTAR */}
      <a href="/" style={{ position: 'absolute', top: '20px', right: '30px', zIndex: 10, padding: '8px 18px', backgroundColor: 'rgba(0,240,255,0.1)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '20px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
        ← Core
      </a>

      {/* CONTAINER 3D */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* MODAL AGENDA E LINK */}
      {abaAtiva && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', backgroundColor: 'rgba(7, 12, 28, 0.98)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '22px', zIndex: 40, backdropFilter: 'blur(30px)', boxShadow: '0 0 60px rgba(0,240,255,0.4)', color: '#fff' }}>
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
                  placeholder="Nova tarefa inteligente..." 
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
                Publique seus relatórios e arquivos do Google Drive instantaneamente na nuvem do Emanuel.OS.
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
            <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>🔒 COORDENADAS / NODE CRIPTOGRAFADO</span>
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
    </div>
  );
}