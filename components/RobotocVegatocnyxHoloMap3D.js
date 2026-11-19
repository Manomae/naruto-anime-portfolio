import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// =========================================================================================
// 🌐 MÓDULO INDEPENDENTE: ROBOTOC & VEGATOCNYX HOLO-MAP 3D + GPS NEON HUD + GOOGLE MAPS
// =========================================================================================
export default function RobotocVegatocnyxHoloMap3D({ onClose }) {
  const mountRef = useRef(null);

  // Estado da Barra de Pesquisa Inteligente ROBOTOC & VEGATOCNYX
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [destinoAtivo, setDestinoAtivo] = useState(null);

  // Estado do HUD estilo vídeo (Banner "Vire à esquerda" + distância)
  const [instrucaoNav, setInstrucaoNav] = useState({
    texto: 'Vire à esquerda',
    distancia: '7 m',
    direcao: 'left'
  });

  // Modo de câmera: 'hud' (estilo minimapa do vídeo expandido) ou '3d' (visão aérea holográfica)
  const [modoVisao, setModoVisao] = useState('3d');
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [novoHub, setNovoHub] = useState({
    usuario: '',
    rede: 'Instagram',
    url: '',
    cor: '#00f0ff'
  });

  // Dados iniciais: Suas Redes Sociais Reais + Pontos Google Maps como Prédios Holográficos 3D
  const [hubsHolograficos, setHubsHolograficos] = useState([
    {
      id: 1,
      nome: 'Torre YouTube Emanuel ART',
      proprietario: 'Emanuel da Silva',
      rede: 'YouTube',
      icone: '▶️',
      url: 'https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg',
      lat: -3.7172,
      lng: -38.5437,
      pos: { x: -12, z: -12 },
      cor: 0xff0055,
      corHex: '#ff0055',
      altura: 6.5
    },
    {
      id: 2,
      nome: 'Arena TikTok @emanueldasilva26',
      proprietario: 'Emanuel da Silva',
      rede: 'TikTok',
      icone: '🎵',
      url: 'https://www.tiktok.com/@emanueldasilva26',
      lat: -4.4589,
      lng: -37.7961,
      pos: { x: 12, z: -12 },
      cor: 0x00f0ff,
      corHex: '#00f0ff',
      altura: 5.8
    },
    {
      id: 3,
      nome: 'Domo Instagram @emanuelsilva432',
      proprietario: 'Emanuel da Silva',
      rede: 'Instagram',
      icone: '📸',
      url: 'https://www.instagram.com/emanuelsilva432',
      lat: -3.7319,
      lng: -38.5267,
      pos: { x: -12, z: 12 },
      cor: 0xec4899,
      corHex: '#ec4899',
      altura: 5.2
    },
    {
      id: 4,
      nome: 'Núcleo GitHub Manomae (Emanuel.OS)',
      proprietario: 'Emanuel da Silva',
      rede: 'GitHub',
      icone: '🐙',
      url: 'https://github.com/Manomae',
      lat: -23.5505,
      lng: -46.6333,
      pos: { x: 12, z: 12 },
      cor: 0x38bdf8,
      corHex: '#38bdf8',
      altura: 7.0
    },
    {
      id: 5,
      nome: 'Central WhatsApp Direct',
      proprietario: 'Emanuel da Silva',
      rede: 'WhatsApp',
      icone: '💬',
      url: 'https://api.whatsapp.com/send?phone=5588981493989',
      lat: -4.4522,
      lng: -37.7950,
      pos: { x: 0, z: -16 },
      cor: 0x22c55e,
      corHex: '#22c55e',
      altura: 4.8
    },
    {
      id: 6,
      nome: 'Portal Facebook & Threads',
      proprietario: 'Emanuel da Silva',
      rede: 'Facebook / Threads',
      icone: '🧵',
      url: 'https://www.threads.net/@emanuelsilva432',
      lat: -22.9068,
      lng: -43.1729,
      pos: { x: 16, z: 0 },
      cor: 0xa855f7,
      corHex: '#a855f7',
      altura: 5.0
    }
  ]);

  // Refs do Three.js para atualização dinâmica sem recriar a cena
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const playerCarRef = useRef(null);
  const routeLineRef = useRef(null);
  const northAngleRef = useRef(0);
  const waypointPosRef = useRef({ x: 50, y: 0 });
  const [northHudPos, setNorthHudPos] = useState({ left: '48%', top: '-10px' });
  const [pinkDotHudPos, setPinkDotHudPos] = useState({ left: '78%', top: '-8px' });

  // Cadastrar futuro usuário no mapa holográfico
  const adicionarHubUsuario = (e) => {
    e.preventDefault();
    if (!novoHub.usuario.trim() || !novoHub.url.trim()) return;

    const angulo = Math.random() * Math.PI * 2;
    const raio = 10 + Math.random() * 8;
    const novoItem = {
      id: Date.now(),
      nome: `Holo-Hub ${novoHub.rede} (${novoHub.usuario})`,
      proprietario: novoHub.usuario,
      rede: novoHub.rede,
      icone: '🌐',
      url: novoHub.url.startsWith('http') ? novoHub.url : `https://${novoHub.url}`,
      lat: -3.7172 + (Math.random() - 0.5) * 0.05,
      lng: -38.5437 + (Math.random() - 0.5) * 0.05,
      pos: { x: Math.round(Math.cos(angulo) * raio), z: Math.round(Math.sin(angulo) * raio) },
      cor: parseInt(novoHub.cor.replace('#', '0x'), 16),
      corHex: novoHub.cor,
      altura: 4.5 + Math.random() * 2.5
    };

    setHubsHolograficos((prev) => [...prev, novoItem]);
    setDestinoAtivo(novoItem);
    setModalNovoUsuario(false);
    setNovoHub({ usuario: '', rede: 'Instagram', url: '', cor: '#00f0ff' });
  };

  // Filtro da Barra de Pesquisa Inteligente
  const handlePesquisa = (valor) => {
    setTermoBusca(valor);
    if (!valor.trim()) {
      setResultadosBusca([]);
      return;
    }
    const filtrados = hubsHolograficos.filter(
      (h) =>
        h.nome.toLowerCase().includes(valor.toLowerCase()) ||
        h.rede.toLowerCase().includes(valor.toLowerCase()) ||
        h.proprietario.toLowerCase().includes(valor.toLowerCase())
    );
    setResultadosBusca(filtrados);
  };

  // Selecionar destino e recalcular a listra rosa do carro no mapa
  const selecionarDestino = (hub) => {
    setDestinoAtivo(hub);
    setTermoBusca(hub.nome);
    setResultadosBusca([]);
    setInstrucaoNav({
      texto: hub.pos.x < 0 ? 'Vire à esquerda' : 'Siga em frente / Vire à direita',
      distancia: `${Math.round(Math.hypot(hub.pos.x, hub.pos.z) * 12)} m`,
      direcao: hub.pos.x < 0 ? 'left' : 'right'
    });
  };

  // Abrir rota real no Google Maps
  const abrirNoGoogleMaps = (hub) => {
    const query = encodeURIComponent(`${hub.lat},${hub.lng}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // =======================================================================================
  // 🎬 RENDERIZAÇÃO 3D (ESTRADAS, LISTRA ROSA DO CARRO, PRÉDIOS HOLOGRAMA, CARROS E PESSOAS)
  // =======================================================================================
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Tom azul-ciano claro futurista inspirado no minimapa do vídeo
    scene.background = new THREE.Color(0x0b192c);
    scene.fog = new THREE.FogExp2(0x0b192c, 0.018);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 500);
    camera.position.set(0, 22, 24);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação Holográfica Ciano & Rosa
    const ambient = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x67e8f9, 2.2);
    dirLight.position.set(15, 30, 15);
    scene.add(dirLight);

    const pinkLight = new THREE.PointLight(0xff007f, 6, 60);
    pinkLight.position.set(0, 10, 0);
    scene.add(pinkLight);

    // 1. BASE DO MAPA (Estilo Cyan-Teal do vídeo com grade urbana)
    const groundGeo = new THREE.PlaneGeometry(70, 70);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x164e63,
      roughness: 0.4,
      metalness: 0.3
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(70, 35, 0x22d3ee, 0x0e7490);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 2. ESTRADAS & CRUZAMENTOS (Avenidas principais em X e Z + anel viário)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.25, metalness: 0.1 });
    const laneLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const criarEstrada = (w, d, x, z, horizontal = false) => {
      const road = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), roadMat);
      road.position.set(x, 0.03, z);
      scene.add(road);

      // Faixa central tracejada
      const numTracos = Math.floor((horizontal ? w : d) / 2.2);
      for (let i = -numTracos / 2; i < numTracos / 2; i++) {
        const dash = new THREE.Mesh(
          new THREE.BoxGeometry(horizontal ? 1.0 : 0.12, 0.07, horizontal ? 0.12 : 1.0),
          laneLineMat
        );
        dash.position.set(horizontal ? x + i * 2.2 : x, 0.04, horizontal ? z : z + i * 2.2);
        scene.add(dash);
      }
    };

    // Ruas principais e secundárias
    criarEstrada(3.4, 60, 0, 0, false);
    criarEstrada(60, 3.4, 0, 0, true);
    criarEstrada(2.6, 50, -12, 0, false);
    criarEstrada(2.6, 50, 12, 0, false);
    criarEstrada(50, 2.6, 0, -12, true);
    criarEstrada(50, 2.6, 0, 12, true);

    // 3. PRÉDIOS E INFRAESTRUTURAS 3D HOLOGRÁFICAS (Links das Redes Sociais)
    const holoRings = [];
    hubsHolograficos.forEach((hub) => {
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(hub.pos.x, 0, hub.pos.z);

      // Corpo translúcido holográfico do prédio
      const bGeo = new THREE.BoxGeometry(2.6, hub.altura, 2.6);
      const bMat = new THREE.MeshPhysicalMaterial({
        color: hub.cor,
        emissive: hub.cor,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.32,
        roughness: 0.1,
        metalness: 0.8,
        side: THREE.DoubleSide
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.y = hub.altura / 2;
      buildingGroup.add(bMesh);

      // Estrutura Wireframe Holográfica externa
      const wireGeo = new THREE.EdgesGeometry(bGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: hub.cor });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      wireframe.position.y = hub.altura / 2;
      buildingGroup.add(wireframe);

      // Anel holográfico giratório no topo do prédio
      const ringGeo = new THREE.TorusGeometry(1.6, 0.06, 12, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = hub.altura + 0.5;
      buildingGroup.add(ring);
      holoRings.push(ring);

      // Placa Holográfica Flutuante com Nome da Rede Social
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.fillRect(0, 0, 512, 128);
      ctx.strokeStyle = hub.corHex;
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, 504, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${hub.icone} ${hub.rede.toUpperCase()}`, 256, 46);
      ctx.fillStyle = hub.corHex;
      ctx.font = '20px monospace';
      ctx.fillText(hub.proprietario, 256, 88);

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      labelSprite.position.set(0, hub.altura + 1.6, 0);
      labelSprite.scale.set(4.5, 1.15, 1);
      buildingGroup.add(labelSprite);

      scene.add(buildingGroup);
    });

    // 4. CARRO PRINCIPAL DO JOGADOR (Com Cursor Seta Estilo Vídeo + Listra Rosa de Rota)
    const playerCarGroup = new THREE.Group();
    const carBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.35, 1.7),
      new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9, roughness: 0.1 })
    );
    carBody.position.y = 0.25;
    playerCarGroup.add(carBody);

    // Anel/Cursor estilo GPS do vídeo em cima do carro
    const cursorRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.72, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    cursorRing.rotation.x = -Math.PI / 2;
    cursorRing.position.y = 0.65;
    playerCarGroup.add(cursorRing);

    const arrowShape = new THREE.ConeGeometry(0.35, 0.7, 3);
    const arrowMesh = new THREE.Mesh(arrowShape, new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    arrowMesh.rotation.x = -Math.PI / 2;
    arrowMesh.position.y = 0.68;
    playerCarGroup.add(arrowMesh);

    playerCarGroup.position.set(0, 0, 8);
    scene.add(playerCarGroup);
    playerCarRef.current = playerCarGroup;

    // 5. LISTRA ROSA DO CARRO (Trajeto GPS Luminoso Magenta #ff007f igual ao vídeo)
    const alvo = destinoAtivo || hubsHolograficos[0];
    const pontosRota = [
      new THREE.Vector3(0, 0.14, 8),
      new THREE.Vector3(0, 0.14, 0),
      new THREE.Vector3(alvo.pos.x, 0.14, 0),
      new THREE.Vector3(alvo.pos.x, 0.14, alvo.pos.z)
    ];
    const curveRota = new THREE.CatmullRomCurve3(pontosRota, false, 'catmullrom', 0.15);
    const tubeRotaGeo = new THREE.TubeGeometry(curveRota, 64, 0.24, 8, false);
    const tubeRotaMat = new THREE.MeshBasicMaterial({ color: 0xff3399 });
    const routeMesh = new THREE.Mesh(tubeRotaGeo, tubeRotaMat);
    scene.add(routeMesh);
    routeLineRef.current = routeMesh;

    // 6. CARROS AUTÔNOMOS NAS RUAS
    const carrosTrafego = [];
    const coresCarros = [0x00f0ff, 0xec4899, 0xfacc15, 0xffffff];
    for (let c = 0; c < 6; c++) {
      const cMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.32, 1.5),
        new THREE.MeshStandardMaterial({ color: coresCarros[c % coresCarros.length], metalness: 0.7, roughness: 0.2 })
      );
      const eixoX = c % 2 === 0;
      cMesh.position.set(eixoX ? -20 + c * 6 : (c === 1 ? -12 : 12), 0.22, eixoX ? (c === 0 ? -12 : 12) : -20 + c * 6);
      if (eixoX) cMesh.rotation.y = Math.PI / 2;
      scene.add(cMesh);
      carrosTrafego.push({ mesh: cMesh, eixoX, vel: 0.08 + (c % 3) * 0.03 });
    }

    // 7. PESSOAS 3D (PEDESTRES HOLOGRÁFICOS NAS CALÇADAS)
    const pessoas3D = [];
    for (let p = 0; p < 14; p++) {
      const pGroup = new THREE.Group();
      const corpo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.55, 12),
        new THREE.MeshStandardMaterial({ color: p % 2 === 0 ? 0x00f0ff : 0xf472b6, emissive: 0x0284c7, emissiveIntensity: 0.4 })
      );
      corpo.position.y = 0.35;
      const cabeca = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      cabeca.position.y = 0.72;
      pGroup.add(corpo, cabeca);

      const lado = p % 2 === 0 ? 2.2 : -2.2;
      pGroup.position.set(lado, 0, -18 + p * 2.8);
      scene.add(pGroup);
      pessoas3D.push({ group: pGroup, dir: p % 2 === 0 ? 1 : -1, speed: 0.025 + (p % 4) * 0.008 });
    }

    // Controles simples de arraste da câmera
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let camAngle = 0;

    const onDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      camAngle -= dx * 0.006;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      isDragging = false;
    };

    const domEl = mountRef.current;
    domEl.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotação dos anéis holográficos dos prédios
      holoRings.forEach((r, idx) => {
        r.rotation.z = t * 1.2 + idx;
        r.scale.setScalar(1 + Math.sin(t * 3 + idx) * 0.06);
      });

      // Movimento suave do carro principal ao longo da listra rosa
      if (playerCarRef.current) {
        const progress = (t * 0.12) % 1;
        const pt = curveRota.getPointAt(progress);
        const tangent = curveRota.getTangentAt(progress);
        playerCarRef.current.position.set(pt.x, 0, pt.z);
        playerCarRef.current.lookAt(pt.x + tangent.x, 0, pt.z + tangent.z);

        // Atualiza distância dinâmica no banner superior
        const distRestante = Math.max(0, Math.round((1 - progress) * 45));
        if (distRestante < 12) {
          setInstrucaoNav((prev) => ({ ...prev, distancia: `${distRestante} m` }));
        }
      }

      // Movimento dos carros nas vias
      carrosTrafego.forEach((c) => {
        if (c.eixoX) {
          c.mesh.position.x += c.vel;
          if (c.mesh.position.x > 26) c.mesh.position.x = -26;
        } else {
          c.mesh.position.z += c.vel;
          if (c.mesh.position.z > 26) c.mesh.position.z = -26;
        }
      });

      // Caminhada das pessoas nas calçadas
      pessoas3D.forEach((p, i) => {
        p.group.position.z += p.dir * p.speed;
        p.group.position.y = Math.abs(Math.sin(t * 8 + i)) * 0.05;
        if (p.group.position.z > 22) p.dir = -1;
        if (p.group.position.z < -22) p.dir = 1;
      });

      // Câmera orbital ou estilo minimapa do vídeo
      if (modoVisao === 'hud' && playerCarRef.current) {
        camera.position.set(playerCarRef.current.position.x, 14, playerCarRef.current.position.z + 9);
        camera.lookAt(playerCarRef.current.position.x, 0, playerCarRef.current.position.z - 2);
      } else {
        camera.position.x = Math.sin(camAngle) * 26;
        camera.position.z = Math.cos(camAngle) * 26;
        camera.position.y = 20;
        camera.lookAt(0, 2, 0);
      }

      // Atualiza posição do marcador "N" (Norte) na borda superior do HUD
      const nPercent = 50 + Math.sin(camAngle) * 38;
      setNorthHudPos({ left: `${nPercent}%`, top: '-10px' });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (domEl) {
        domEl.removeEventListener('mousedown', onDown);
        if (renderer.domElement) domEl.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [hubsHolograficos, destinoAtivo, modoVisao]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#030712',
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif',
      color: '#f8fafc',
      overflow: 'hidden'
    }}>
      {/* =================================================================================
          🔍 BARRA DE PESQUISA INTELIGENTE ROBOTOC & VEGATOCNYX + GOOGLE MAPS
         ================================================================================= */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 520,
        width: '92%',
        maxWidth: '640px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          border: '2px solid #00f0ff',
          borderRadius: '28px',
          padding: '8px 16px',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.35), inset 0 0 10px rgba(236, 72, 153, 0.2)',
          backdropFilter: 'blur(16px)'
        }}>
          <span style={{
            background: 'linear-gradient(90deg, #00f0ff, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '900',
            fontSize: '11px',
            whiteSpace: 'nowrap'
          }}>
            🤖 ROBOTOC & VEGATOCNYX
          </span>

          <input
            type="text"
            value={termoBusca}
            onChange={(e) => handlePesquisa(e.target.value)}
            placeholder="Pesquisar prédio holográfico, rede social ou rota Google Maps..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />

          <button
            onClick={() => setModalNovoUsuario(true)}
            title="Cadastrar Novo Usuário no Mapa"
            style={{
              backgroundColor: '#ec4899',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              padding: '5px 10px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            + Novo Hub
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Lista suspensa da Busca Inteligente */}
        {resultadosBusca.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid #00f0ff',
            borderRadius: '16px',
            padding: '8px',
            maxHeight: '220px',
            overflowY: 'auto',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
          }}>
            {resultadosBusca.map((hub) => (
              <div
                key={hub.id}
                onClick={() => selecionarDestino(hub)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div>
                  <strong style={{ color: hub.corHex, fontSize: '12px', display: 'block' }}>
                    {hub.icone} {hub.nome}
                  </strong>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                    Proprietário: {hub.proprietario} • Traçar listra rosa GPS
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a
                    href={hub.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Rede ➔
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirNoGoogleMaps(hub);
                    }}
                    style={{
                      backgroundColor: '#16a34a',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Maps 📍
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =================================================================================
          🧭 HUD DE NAVEGAÇÃO IDÊNTICO AO VÍDEO (BANNER "VIRE À ESQUERDA" + CAIXA ROSA)
         ================================================================================= */}
      <div style={{
        position: 'absolute',
        bottom: '22px',
        left: '22px',
        zIndex: 515,
        width: '290px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Banner Superior Azul Escuro + Quadrado Rosa com Seta */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '2px solid #020617',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.65)'
        }}>
          <div style={{
            flex: 1,
            background: 'linear-gradient(90deg, #1e1b4b, #312e81)',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
              {instrucaoNav.texto}
            </span>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#e0f2fe' }}>
              {instrucaoNav.distancia}
            </span>
          </div>

          <div style={{
            width: '58px',
            backgroundColor: '#f472b6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            fontWeight: '900',
            color: '#020617'
          }}>
            {instrucaoNav.direcao === 'left' ? '↰' : '↱'}
          </div>
        </div>

        {/* Barra de Controles de Câmera + Marcador Norte (N) */}
        <div style={{
          position: 'relative',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          border: '2px solid #020617',
          borderRadius: '14px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Bolinha Preta com "N" (Norte) igual ao vídeo */}
          <div style={{
            position: 'absolute',
            left: northHudPos.left,
            top: northHudPos.top,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#020617',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #ffffff',
            transition: 'left 0.1s linear'
          }}>
            N
          </div>

          {/* Bolinha Rosa de Waypoint igual ao vídeo */}
          <div style={{
            position: 'absolute',
            left: pinkDotHudPos.left,
            top: pinkDotHudPos.top,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#f472b6',
            boxShadow: '0 0 10px #ff007f'
          }} />

          <button
            onClick={() => setModoVisao(modoVisao === '3d' ? 'hud' : '3d')}
            style={{
              backgroundColor: '#00f0ff',
              color: '#020617',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '10px',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            {modoVisao === '3d' ? '🚘 Câmera Perseguição' : '🏙️ Visão Holograma 3D'}
          </button>

          {destinoAtivo && (
            <button
              onClick={() => abrirNoGoogleMaps(destinoAtivo)}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🗺️ Abrir Google Maps
            </button>
          )}
        </div>
      </div>

      {/* =================================================================================
          🏙️ PAINEL LATERAL: HUBS HOLOGRÁFICOS DAS REDES SOCIAIS & LINKS FUTURÍSTICOS
         ================================================================================= */}
      <div style={{
        position: 'absolute',
        right: '18px',
        top: '85px',
        bottom: '22px',
        width: '260px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(0, 240, 255, 0.45)',
        borderRadius: '18px',
        padding: '14px',
        zIndex: 510,
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflowY: 'auto'
      }}>
        <div style={{ borderBottom: '1px solid rgba(0,240,255,0.25)', paddingBottom: '6px' }}>
          <strong style={{ fontSize: '11px', color: '#00f0ff', display: 'block' }}>
            🏛️ PRÉDIOS HOLOGRÁFICOS 3D
          </strong>
          <span style={{ fontSize: '9px', color: '#94a3b8' }}>
            Clique para traçar a listra rosa no mapa ou abrir o link
          </span>
        </div>

        {hubsHolograficos.map((hub) => (
          <div
            key={hub.id}
            onClick={() => selecionarDestino(hub)}
            style={{
              backgroundColor: destinoAtivo?.id === hub.id ? 'rgba(0, 240, 255, 0.16)' : 'rgba(2, 6, 23, 0.75)',
              border: `1px solid ${destinoAtivo?.id === hub.id ? '#ff007f' : hub.corHex}`,
              borderRadius: '12px',
              padding: '9px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '11px', color: '#ffffff' }}>
                {hub.icone} {hub.rede}
              </strong>
              <span style={{ fontSize: '8px', color: hub.corHex, fontWeight: 'bold' }}>
                HOLO-3D
              </span>
            </div>
            <p style={{ margin: '3px 0 6px 0', fontSize: '9.5px', color: '#cbd5e1' }}>
              {hub.nome}
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <a
                href={hub.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  backgroundColor: hub.corHex,
                  color: '#020617',
                  fontWeight: '900',
                  fontSize: '9px',
                  padding: '4px',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                Acessar Link ➔
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  abrirNoGoogleMaps(hub);
                }}
                style={{
                  backgroundColor: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid #38bdf8',
                  fontSize: '9px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Maps
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =================================================================================
          ➕ MODAL PARA FUTUROS USUÁRIOS CADASTRAREM SEUS PRÉDIOS HOLOGRÁFICOS
         ================================================================================= */}
      {modalNovoUsuario && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          zIndex: 550,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={adicionarHubUsuario}
            style={{
              backgroundColor: '#0f172a',
              border: '2px solid #00f0ff',
              borderRadius: '18px',
              padding: '20px',
              width: '100%',
              maxWidth: '380px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 0 35px rgba(0, 240, 255, 0.35)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '14px', color: '#00f0ff' }}>
              🌐 Criar Prédio Holográfico de Usuário
            </h3>
            <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>
              Adicione seu perfil social como uma infraestrutura 3D conectada ao mapa Emanuel.OS.
            </p>

            <input
              type="text"
              required
              placeholder="Nome do Usuário ou Marca..."
              value={novoHub.usuario}
              onChange={(e) => setNovoHub({ ...novoHub, usuario: e.target.value })}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', fontSize: '11px' }}
            />

            <select
              value={novoHub.rede}
              onChange={(e) => setNovoHub({ ...novoHub, rede: e.target.value })}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', fontSize: '11px' }}
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="GitHub">GitHub</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Portfólio Web">Portfólio Web</option>
            </select>

            <input
              type="text"
              required
              placeholder="URL da Rede Social (ex: https://instagram.com/...)"
              value={novoHub.url}
              onChange={(e) => setNovoHub({ ...novoHub, url: e.target.value })}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', fontSize: '11px' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: '#cbd5e1' }}>Cor do Holograma:</span>
              <input
                type="color"
                value={novoHub.cor}
                onChange={(e) => setNovoHub({ ...novoHub, cor: e.target.value })}
                style={{ width: '40px', height: '26px', border: 'none', background: 'none', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setModalNovoUsuario(false)}
                style={{ flex: 1, padding: '8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ flex: 1, padding: '8px', backgroundColor: '#00f0ff', color: '#020617', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}
              >
                Construir Holograma 3D
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Canvas 3D Principal */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
    </div>
  );
}