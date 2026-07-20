import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

export default function MapaSpatial3DEmanuel() {
  const mountRef = useRef(null);
  const [localSelecionado, setLocalSelecionado] = useState(null);

  // 🌟 SEUS LINKS E DADOS REAIS CENTRALIZADOS
  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Central Emanuel.OS)",
    whatsapp: "5588981493989",
    whatsappFormatado: "(88) 98149-3989",
    facebook: "https://www.facebook.com/leeheroi.heroi",
    github: "https://github.com/Manomae",
    email: "leeheroi123@gmail.com",
    instagram: "https://www.instagram.com/emanuelsilva432"
  };

  // 🌍 CIDADE 3D: DADOS FICTÍCIOS CRIPTOGRAFADOS CONECTADOS AO SEU SERVIDOR
  const estabelecimentosCultura = [
    {
      id: 1,
      nome: 'Emanuel.OS Core Data Center 01',
      categoria: '🖥️ Servidor de Dados & Nuvem AGI',
      cor: 0x00f0ff,
      posicao: { x: -6, y: 3, z: -4 },
      ipCriptografado: 'AES256-88F9-90A1-EMA',
      linksFicticios: {
        threads: 'https://threads.net/@datacenter_core_fake',
        doc: 'DOC-SECURE-ENCRYPTED-001.PDF'
      }
    },
    {
      id: 2,
      nome: 'Arena Futebol Clube & Parque Neon',
      categoria: '⚽ Estádio & Lazer Comunitário',
      cor: 0x00ff66,
      posicao: { x: 6, y: 1.5, z: 4 },
      ipCriptografado: 'AES256-11B4-33C8-ARENA',
      linksFicticios: {
        threads: 'https://threads.net/@arena_neon_stadium',
        doc: 'ALVARA-RESERVA-E-INGRESSOS.PDF'
      }
    },
    {
      id: 3,
      nome: 'Hospital Geral & Clínica Vet 24h',
      categoria: '🏥 Saúde Humana & Animal',
      cor: 0xff0055,
      posicao: { x: -5, y: 2.2, z: 5 },
      ipCriptografado: 'AES256-55H2-88X9-HOSP',
      linksFicticios: {
        threads: 'https://threads.net/@hospital_vet_central',
        doc: 'PRONTUARIOS-PROTEGIDOS.PDF'
      }
    },
    {
      id: 4,
      nome: 'Usina Solar & Matriz Energética 3D',
      categoria: '⚡ Energia Limpa & Renovável',
      cor: 0xffaa00,
      posicao: { x: 7, y: 2, z: -6 },
      ipCriptografado: 'AES256-99A1-11Z2-SOLAR',
      linksFicticios: {
        threads: 'https://threads.net/@usina_solar_tech',
        doc: 'BALANCO-ENERGETICO-ANUAL.PDF'
      }
    },
    {
      id: 5,
      nome: 'Fazenda Tech & Agronegócio Inteligente',
      categoria: '🌾 Agricultura Digital & Drones',
      cor: 0x88ff00,
      posicao: { x: -8, y: 1.2, z: -8 },
      ipCriptografado: 'AES256-33D4-77E8-AGRO',
      linksFicticios: {
        threads: 'https://threads.net/@fazenda_inteligente',
        doc: 'MAPA-GEO-PLANTIO-SOLO.PDF'
      }
    },
    {
      id: 6,
      nome: 'Catedral & Templo de Luz',
      categoria: 'Igreja & Apoio Espiritual',
      cor: 0xaa00ff,
      posicao: { x: 0, y: 4, z: -7 },
      ipCriptografado: 'AES256-77F8-44K1-TEMPLO',
      linksFicticios: {
        threads: 'https://threads.net/@catedral_luz_3d',
        doc: 'AGENDA-ORACAO-E-EVENTOS.PDF'
      }
    },
    {
      id: 7,
      nome: 'Praça Central & Quiosque Digital',
      categoria: '🌳 Convivência & Wi-Fi Livre',
      cor: 0x00aaff,
      posicao: { x: 0, y: 0.8, z: 2 },
      ipCriptografado: 'AES256-22M9-11L3-PRACA',
      linksFicticios: {
        threads: 'https://threads.net/@praca_central_wifi',
        doc: 'MAPA-EVENTOS-CULTURAIS.PDF'
      }
    },
    {
      id: 8,
      nome: 'Centro Comercial & Shopping Cyber',
      categoria: '🛍️ Lojas & Mercado Digital',
      cor: 0xff00aa,
      posicao: { x: 4, y: 2.8, z: -1 },
      ipCriptografado: 'AES256-44J3-99P8-LOJAS',
      linksFicticios: {
        threads: 'https://threads.net/@shopping_cyber_online',
        doc: 'CATALOGO-E-OFERTAS.PDF'
      }
    }
  ];

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. CENA, CÂMERA E RENDERIZADOR 3D
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);

    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 16, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // 2. ILUMINAÇÃO CYBERPUNK
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00f0ff, 3, 100);
    mainLight.position.set(0, 20, 0);
    scene.add(mainLight);

    // 3. GRADE E PISTA 3D DA CIDADE
    const gridHelper = new THREE.GridHelper(40, 40, 0x00f0ff, 0x121220);
    scene.add(gridHelper);

    // 4. CONSTRUÇÃO DOS EDIFÍCIOS DA CIDADE VIRTUAL
    const objetosInterativos = [];

    estabelecimentosCultura.forEach((est) => {
      const geometry = new THREE.BoxGeometry(2.2, est.posicao.y * 2, 2.2);
      const material = new THREE.MeshStandardMaterial({
        color: est.cor,
        roughness: 0.1,
        metalness: 0.9
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(est.posicao.x, est.posicao.y, est.posicao.z);
      mesh.userData = est;
      scene.add(mesh);
      objetosInterativos.push(mesh);

      // Anel Holográfico Iluminado
      const ringGeo = new THREE.RingGeometry(0.4, 0.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: est.cor, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(est.posicao.x, est.posicao.y * 2 + 0.3, est.posicao.z);
      scene.add(ring);
    });

    // 5. CLIQUE RAYCASTER
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

    // 6. ANIMAÇÃO DE ROTAÇÃO SUAVE
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      scene.rotation.y += 0.0015;
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
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', overflow: 'hidden', position: 'relative', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      <Head>
        <title>Emanuel.OS - Cidade 3D & Mapeamento Conectado</title>
      </Head>

      {/* CABEÇALHO */}
      <header style={{ position: 'absolute', top: '25px', left: '30px', zIndex: 10 }}>
        <h1 style={{ fontSize: '22px', margin: 0, color: '#fff', fontWeight: '900', letterSpacing: '1px' }}>
          📍 GEOMAPEMENTO 3D <span style={{ color: '#00f0ff' }}>ROXEDA</span>
        </h1>
        <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 'bold' }}>
          Cidades, Praças, Usinas e Servidores Conectados ao Sistema de Emanuel da Silva
        </span>
      </header>

      {/* BOTÃO VOLTAR */}
      <a 
        href="/" 
        style={{
          position: 'absolute', top: '25px', right: '30px', zIndex: 10,
          padding: '12px 24px', backgroundColor: 'rgba(0,240,255,0.1)',
          color: '#00f0ff', border: '1px solid rgba(0,240,255,0.4)',
          borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold',
          boxShadow: '0 0 20px rgba(0,240,255,0.2)'
        }}
      >
        ← Voltar ao Core Emanuel.OS
      </a>

      {/* RENDERIZADOR THREE.JS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* 🌟 CARD HOLOGRÁFICO LATERAL (A MÁGICA CONECTADA COM SEUS LINKS REAIS) */}
      {localSelecionado && (
        <aside style={{
          position: 'absolute', right: '30px', bottom: '30px', width: '380px',
          backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.5)',
          borderRadius: '20px', padding: '22px', backdropFilter: 'blur(25px)',
          boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)', zIndex: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#00f0ff', fontWeight: '900' }}>{localSelecionado.nome}</h3>
            <button onClick={() => setLocalSelecionado(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>✕</button>
          </div>
          
          <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>
            {localSelecionado.categoria}
          </span>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
            <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block' }}>🔒 CRIPTOGRAFIA DE PONTA A PONTA (END-TO-END)</span>
            <span style={{ fontSize: '10px', color: '#71717a', fontFamily: 'monospace' }}>IP / NODE: {localSelecionado.ipCriptografado}</span>
          </div>

          <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
            🔗 CONEXÃO CENTRAL COM EMANUEL DA SILVA:
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
            
            {/* WHATSAPP REAL */}
            <a href={`https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}&text=Ola%20Emanuel,%20estou%20conectado%20pelo%20Mapa%203D!`} target="_blank" rel="noreferrer" style={{ padding: '10px 14px', backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00ff66', color: '#00ff66', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💬 WhatsApp Oficial: {meusDadosReais.whatsappFormatado}
            </a>

            {/* GITHUB REAL */}
            <a href={meusDadosReais.github} target="_blank" rel="noreferrer" style={{ padding: '10px 14px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🐙 Repositório GitHub Oficial
            </a>

            {/* INSTAGRAM REAL */}
            <a href={meusDadosReais.instagram} target="_blank" rel="noreferrer" style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 0, 150, 0.1)', border: '1px solid #ff0099', color: '#ff0099', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📸 Instagram Oficial
            </a>

            {/* FACEBOOK REAL */}
            <a href={meusDadosReais.facebook} target="_blank" rel="noreferrer" style={{ padding: '10px 14px', backgroundColor: 'rgba(0, 102, 255, 0.1)', border: '1px solid #0066ff', color: '#0066ff', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌐 Facebook Oficial
            </a>

            {/* EMAIL REAL */}
            <a href={`mailto:${meusDadosReais.email}`} style={{ padding: '10px 14px', backgroundColor: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffc800', color: '#ffc800', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✉️ E-mail Direto ({meusDadosReais.email})
            </a>

            {/* THREADS FICTÍCIO & DOCUMENTAÇÃO DE TESTE */}
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '10px', color: '#71717a', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>📄 DADOS FICTÍCIOS DE TESTE DO ESTABELECIMENTO:</span>
              <a href={localSelecionado.linksFicticios.threads} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                🧵 Threads do Local (Simulação)
              </a>
              <span style={{ fontSize: '11px', color: '#00f0ff' }}>
                🔐 {localSelecionado.linksFicticios.doc} (Protegido)
              </span>
            </div>

          </div>
        </aside>
      )}
    </div>
  );
}