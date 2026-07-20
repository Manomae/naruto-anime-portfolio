import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

export default function MapaSpatialChakraEmanuel() {
  const mountRef = useRef(null);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [alertaAbalroamento, setAlertaAbalroamento] = useState(false);
  const [modoEmergencia, setModoEmergencia] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(null);
  
  const [abaAtiva, setAbaAtiva] = useState(null);
  const [copiadoPix, setCopiadoPix] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([
    { id: 1, texto: 'Sincronizar dados da Nuvem AGI', horario: '14:00', status: 'Pendente' },
    { id: 2, texto: 'Monitoramento de tráfego autônomo', horario: '15:30', status: 'Ativo' }
  ]);
  const [linkGerado, setLinkGerado] = useState('');

  // 🌟 SEUS DADOS E REDES SOCIAIS REAIS CENTRALIZADOS
  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Central Emanuel.OS)",
    whatsapp: "5588981493989",
    whatsappFormatado: "(88) 98149-3989",
    email: "leeheroi123@gmail.com",
    chavePix: "leeheroi123@gmail.com",
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

  useEffect(() => {
    setTempoAtual(new Date());
    const timer = setInterval(() => setTempoAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

    const pistaGeo = new THREE.RingGeometry(8.6, 9.4, 64);
    const pistaMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6, side: THREE.DoubleSide });
    const pistaMesh = new THREE.Mesh(pistaGeo, pistaMat);
    pistaMesh.rotation.x = Math.PI / 2;
    pistaMesh.position.y = 0.02;
    scene.add(pistaMesh);

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

      if (veiculo1.position.distanceTo(veiculo2.position) < 4.0) {
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

  const copiarPix = () => {
    navigator.clipboard.writeText(meusDadosReais.chavePix);
    setCopiadoPix(true);
    setTimeout(() => setCopiadoPix(false), 3000);
  };

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

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', overflow: 'hidden', position: 'relative', fontFamily: '"Segoe UI", sans-serif' }}>
      <Head>
        <title>Emanuel.OS - Central Donário, Pix & Cloud 3D</title>
      </Head>

      <header style={{ position: 'absolute', top: '25px', left: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '20px', margin: 0, color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>
          ✨ EMANUEL.OS <span style={{ color: '#00f0ff' }}>CENTRAL DONÁRIO & CLOUD</span>
        </h1>
        <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 'bold' }}>
          Integração com Google Drive, Pix, Agendador de Tarefas e Links Publicados
        </span>
      </header>

      <div style={{ position: 'absolute', top: '25px', right: '180px', zIndex: 25, display: 'flex', gap: '10px' }}>
        <button onClick={() => setAbaAtiva('pix')} style={{ padding: '10px 16px', background: 'rgba(0,255,102,0.15)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '12px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          💸 Doar (Pix Donário)
        </button>
        <button onClick={() => setAbaAtiva('agenda')} style={{ padding: '10px 16px', background: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '12px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          📅 Agendar Tarefas
        </button>
        <button onClick={() => setAbaAtiva('link')} style={{ padding: '10px 16px', background: 'rgba(255,0,170,0.15)', border: '1px solid #ff00aa', color: '#ff00aa', borderRadius: '12px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          🔗 Criar Link Cloud
        </button>
      </div>

      <div style={{ position: 'absolute', top: '90px', left: '30px', zIndex: 15, backgroundColor: 'rgba(7, 12, 28, 0.85)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '16px', padding: '14px', backdropFilter: 'blur(15px)', width: '300px', color: '#fff' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#00f0ff', marginBottom: '4px' }}>
          📅 {tempoAtual ? tempoAtual.toLocaleDateString('pt-BR') : 'Carregando...'} - 🕒 {tempoAtual ? tempoAtual.toLocaleTimeString('pt-BR') : '--:--:--'}
        </div>
        <div style={{ fontSize: '11px', color: '#e4e4e7', marginBottom: '6px' }}>
          {dadosClima.condicao} | 🌡️ {dadosClima.temperatura}
        </div>
        <div style={{ fontSize: '10px', color: '#ffaa00', backgroundColor: 'rgba(255,170,0,0.1)', padding: '5px', borderRadius: '6px', border: '1px solid rgba(255,170,0,0.3)', fontWeight: 'bold' }}>
          {dadosClima.alertaDeslizamento}
        </div>
      </div>

      <a href="/" style={{ position: 'absolute', top: '25px', right: '30px', zIndex: 10, padding: '10px 20px', backgroundColor: 'rgba(0,240,255,0.1)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '20px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
        ← Core
      </a>

      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {abaAtiva && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '420px', backgroundColor: 'rgba(7, 12, 28, 0.98)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', zIndex: 40, backdropFilter: 'blur(30px)', boxShadow: '0 0 60px rgba(0,240,255,0.4)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#00f0ff', fontSize: '18px', fontWeight: '900' }}>
              {abaAtiva === 'pix' && '💸 Contribuição Donário (Pix)'}
              {abaAtiva === 'agenda' && '📅 Agendador de Tarefas IA'}
              {abaAtiva === 'link' && '🔗 Publicador de Links Online'}
            </h3>
            <button onClick={() => setAbaAtiva(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>✕</button>
          </div>

          {abaAtiva === 'pix' && (
            <div>
              <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.5' }}>
                Apoie o desenvolvimento contínuo do <b>Emanuel.OS</b> e ajude a expandir essa tecnologia de código aberto!
              </p>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,255,102,0.3)', marginBottom: '15px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: '#00ff66', display: 'block', fontWeight: 'bold' }}>CHAVE PIX (E-MAIL OFICIAL):</span>
                <span style={{ fontSize: '13px', color: '#fff', fontFamily: 'monospace' }}>{meusDadosReais.chavePix}</span>
              </div>
              <button onClick={copiarPix} style={{ width: '100%', padding: '12px', backgroundColor: '#00ff66', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                {copiadoPix ? '✅ Chave Pix Copiada com Sucesso!' : '📋 Copiar Chave Pix para Doação'}
              </button>
            </div>
          )}

          {abaAtiva === 'agenda' && (
            <div>
              <form onSubmit={adicionarTarefa} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Nova tarefa ou rotina inteligente..." 
                  value={novaTarefa} 
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  style={{ flex: 1, padding: '10px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Adicionar</button>
              </form>
              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {listaTarefas.map((t) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '12px', color: '#fff' }}>{t.texto}</span>
                    <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>{t.horario}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {abaAtiva === 'link' && (
            <div>
              <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '15px' }}>
                Publique seus relatórios e arquivos do Google Drive instantaneamente na nuvem do Emanuel.OS.
              </p>
              <button onClick={gerarLinkOnline} style={{ width: '100%', padding: '12px', backgroundColor: '#ff00aa', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginBottom: '15px' }}>
                🌐 Gerar Link Online Público
              </button>
              {linkGerado && (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '10px', borderRadius: '8px', border: '1px solid #ff00aa', wordBreak: 'break-all' }}>
                  <span style={{ fontSize: '10px', color: '#ff00aa', display: 'block', fontWeight: 'bold' }}>LINK PÚBLICO ATIVO:</span>
                  <a href="#" style={{ fontSize: '11px', color: '#00f0ff' }}>{linkGerado}</a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CARD LATERAL COM TODAS AS SUAS REDES SOCIAIS E CONTATOS */}
      {localSelecionado && (
        <aside style={{ position: 'absolute', right: '30px', bottom: '30px', width: '380px', backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '20px', padding: '22px', backdropFilter: 'blur(25px)', zIndex: 20, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#00f0ff', fontWeight: '900' }}>{localSelecionado.nome}</h3>
            <button onClick={() => setLocalSelecionado(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>✕</button>
          </div>
          <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '12px' }}>{localSelecionado.categoria}</span>

          <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>🔗 CENTRAL DE CONTATOS DO EMANUEL:</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            <a href={meusDadosReais.youtube} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #ff0000', color: '#ff4d4d', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>▶️ Canal YouTube Oficial</a>
            <a href={meusDadosReais.tiktok} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>🎵 TikTok Oficial</a>
            <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>📸 Instagram Oficial</a>
            <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '10px', backgroundColor: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffc800', color: '#ffc800', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>✉️ E-mail Direto ({meusDadosReais.email})</a>
            <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>💬 WhatsApp: {meusDadosReais.whatsappFormatado}</a>
            <a href={meusDadosReais.threads} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>🧵 Threads Oficial</a>
            <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '10px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>🐙 GitHub Principal</a>
          </div>
        </aside>
      )}
    </div>
  );
}