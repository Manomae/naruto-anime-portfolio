import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

export default function MapaEspacialEmanuelOS() {
  const mountRef = useRef(null);
  const [missaoSelecionada, setMissaoSelecionada] = useState(null);
  const [fogueteLancado, setFogueteLancado] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(null);

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
    camera.position.set(0, 10, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(20, 20, 20);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x333355, 0.5);
    scene.add(ambientLight);

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

    const atmoGeo = new THREE.SphereGeometry(6.3, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosferaMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosferaMesh);

    const estrelasGeo = new THREE.BufferGeometry();
    const posicoesEstrelas = new Float32Array(800 * 3);
    for (let i = 0; i < 800 * 3; i++) {
      posicoesEstrelas[i] = (Math.random() - 0.5) * 300;
    }
    estrelasGeo.setAttribute('position', new THREE.BufferAttribute(posicoesEstrelas, 3));
    const estrelasMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 });
    const campoEstrelas = new THREE.Points(estrelasGeo, estrelasMat);
    scene.add(campoEstrelas);

    const sateliteGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sateliteMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.8 });
    const sateliteMesh = new THREE.Mesh(sateliteGeo, sateliteMat);
    scene.add(sateliteMesh);

    const fogueteGeo = new THREE.ConeGeometry(0.4, 2, 16);
    const fogueteMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.5 });
    const fogueteMesh = new THREE.Mesh(fogueteGeo, fogueteMat);
    fogueteMesh.position.set(0, 6.5, 0);
    scene.add(fogueteMesh);

    let anguloOrbita = 0;
    let posYFoguete = 6.5;
    let lancando = false;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      terraMesh.rotation.y += 0.001;
      atmosferaMesh.rotation.y += 0.0012;
      campoEstrelas.rotation.y += 0.0002;

      anguloOrbita += 0.01;
      const raioOrbita = 9;
      sateliteMesh.position.x = Math.cos(anguloOrbita) * raioOrbita;
      sateliteMesh.position.z = Math.sin(anguloOrbita) * raioOrbita;
      sateliteMesh.position.y = Math.sin(anguloOrbita * 2) * 2;

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
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [fogueteLancado]);

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

      {/* NAVEGAÇÃO COMPLETA DE IDA E VOLTA (CORE / MAPA IA) */}
      <div style={{ position: 'absolute', top: '15px', right: '30px', zIndex: 30, display: 'flex', gap: '8px' }}>
        <a href="/" style={{ padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '15px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🏠 Core Login
        </a>
        <a href="/mapa-ia" style={{ padding: '8px 14px', backgroundColor: 'rgba(234, 88, 12, 0.2)', color: '#fb923c', border: '1px solid #ea580c', borderRadius: '15px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
          ⚡ Mapa IA & Redes Sociais
        </a>
      </div>

      {/* BARRA DE PESQUISA & FILTROS */}
      <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 35, width: '440px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Pesquise pedras, minerais, exoplanetas ou astronautas..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px',
              backgroundColor: 'rgba(7, 12, 28, 0.95)',
              border: '1px solid #00f0ff',
              borderRadius: '25px',
              color: '#fff',
              fontSize: '11px',
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

        <div style={{ display: 'flex', gap: '5px', marginTop: '6px', justifyContent: 'center' }}>
          <button onClick={() => setFiltroCategoria('minerais')} style={{ padding: '4px 8px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00f0ff', background: filtroCategoria === 'minerais' ? '#00f0ff' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'minerais' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🪨 Pedras & Minerais</button>
          <button onClick={() => setFiltroCategoria('especies')} style={{ padding: '4px 8px', fontSize: '9px', borderRadius: '10px', border: '1px solid #00ff66', background: filtroCategoria === 'especies' ? '#00ff66' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'especies' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🧬 Espécies Desconhecidas</button>
          <button onClick={() => setFiltroCategoria('planetas')} style={{ padding: '4px 8px', fontSize: '9px', borderRadius: '10px', border: '1px solid #ffaa00', background: filtroCategoria === 'planetas' ? '#ffaa00' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'planetas' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🪐 Aprendizado Planetas</button>
          <button onClick={() => setFiltroCategoria('astronautas')} style={{ padding: '4px 8px', fontSize: '9px', borderRadius: '10px', border: '1px solid #ff00aa', background: filtroCategoria === 'astronautas' ? '#ff00aa' : 'rgba(0,0,0,0.5)', color: filtroCategoria === 'astronautas' ? '#fff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>👨‍🚀 Centro Médico Espacial</button>
        </div>

        {sugestoesBusca.length > 0 && (
          <ul style={{
            listStyle: 'none',
            margin: '8px 0 0 0',
            padding: '8px',
            backgroundColor: 'rgba(7, 12, 28, 0.95)',
            border: '1px solid rgba(0, 240, 255, 0.5)',
            borderRadius: '15px',
            backdropFilter: 'blur(20px)',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {sugestoesBusca.map((item, index) => (
              <li
                key={index}
                onClick={() => selecionarLocalPesquisado(item)}
                style={{
                  padding: '8px 10px',
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
    </div>
  );
}