import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';

// --- BANCO DE DADOS: COLEÇÃO TEMPORAL DE MOEDAS, MEDALHAS E ARTEFATOS MUNDIAIS ---
const ACERVO_ANTIGUIDADES = [
  {
    id: 'tetradracma-atenas',
    nome: 'Tetradracma Ateniense',
    pais: 'Grécia Clássica',
    ano: '450 a.C.',
    era: 'Antiguidade Clássica',
    metal: 'Prata Maciça',
    corMetal: 0xd1d5db,
    corEmissive: 0x38bdf8,
    anverso: {
      titulo: 'Anverso (Frente Principal)',
      descricao: 'Busto da Deusa Atena com elmo ático decorado com folhas de oliveira, simbolizando a sabedoria e vitória moral da polis.',
      icone: '🏛️'
    },
    reverso: {
      titulo: 'Reverso (Verso Simbólico)',
      descricao: 'A icônica Coruja da Sabedoria (Glaux) accompanied por ramo de oliveira, crescente lunar e a inscrição "AΘE" (Atenas).',
      icone: '🦉'
    },
    curiosidade: 'Foi a moeda de referência do comércio marítimo do Mediterrâneo durante a Era de Ouro de Péricles.'
  },
  {
    id: 'ban-liang-qin',
    nome: 'Moeda Ban Liang',
    pais: 'China Imperial',
    ano: '221 a.C.',
    era: 'Império Qin',
    metal: 'Bronze Antigo',
    corMetal: 0xca8a04,
    corEmissive: 0xeab308,
    anverso: {
      titulo: 'Anverso (Frente Principal)',
      descricao: 'Dois ideogramas chineses em caligrafia Selo "半兩" (Ban Liang - Meia Onça), atestando o peso padrão unificado pelo Imperador Qin Shi Huang.',
      icone: '🐉'
    },
    reverso: {
      titulo: 'Reverso (Verso Simbólico)',
      descricao: 'Superfície funcional lisa com o furo quadrado central, representando a Terra segundo a cosmologia "Céu Redondo, Terra Quadrada".',
      icone: '🔲'
    },
    curiosidade: 'Primeira moeda padronizada a circular em todo o território chinês unificado.'
  },
  {
    id: 'denario-julio-cesar',
    nome: 'Denário de Júlio César',
    pais: 'Império Romano',
    ano: '44 a.C.',
    era: 'Roma Antiga',
    metal: 'Prata Imperial',
    corMetal: 0x9ca3af,
    corEmissive: 0x00f0ff,
    anverso: {
      titulo: 'Anverso (Frente Principal)',
      descricao: 'Retrato do próprio Júlio César coroado de lauréis com o título "DICT PERPETVO" (Ditador Perpétuo). Quebrou o tabu de retratar vivos em moedas romanas.',
      icone: '👑'
    },
    reverso: {
      titulo: 'Reverso (Verso Simbólico)',
      descricao: 'Deusa Vênus Victrix segurando a efígie da vitória e um cetro real, reafirmando a mítica ascendência da família Júlia.',
      icone: '🛡️'
    },
    curiosidade: 'Cunhada poucas semanas antes dos Idos de Março, tornando-se uma das peças mais cobiçadas da história.'
  },
  {
    id: 'medalha-pisanello',
    nome: 'Medalha Cecília Gonzaga',
    pais: 'Itália Renascentista',
    ano: '1445 d.C.',
    era: 'Renascimento',
    metal: 'Bronze Dourado',
    corMetal: 0x582f0e,
    corEmissive: 0xff007f,
    anverso: {
      titulo: 'Anverso (Frente Principal)',
      descricao: 'Perfil sereno e elegante de Cecília Gonzaga esculpido pelo mestre Pisanello, marco inicial da medalhística moderna.',
      icone: '🎨'
    },
    reverso: {
      titulo: 'Reverso (Verso Simbólico)',
      descricao: 'Alegoria poética mostrando a figura feminina dominando um Unicórnio sob a luz do luar, símbolo da castidade e sabedoria.',
      icone: '🦄'
    },
    curiosidade: 'Pisanello fundiu esta medalha para celebrar a decisão da nobre de se dedicar aos estudos humanistas e à vida monástica.'
  },
  {
    id: 'peca-coroacao-pedro1',
    nome: 'Peça da Coroação de D. Pedro I',
    pais: 'Brasil Imperial',
    ano: '1822 d.C.',
    era: 'Brasil Império',
    metal: 'Ouro 22 Quilates',
    corMetal: 0xfacc15,
    corEmissive: 0xfacc15,
    anverso: {
      titulo: 'Anverso (Frente Principal)',
      descricao: 'Busto do jovem Imperador D. Pedro I fardado com dragonas e coroado com louros de herói nacional.',
      icone: '🇧🇷'
    },
    reverso: {
      titulo: 'Reverso (Verso Simbólico)',
      descricao: 'Escudo Imperial do Brasil recém-criado, ladeado por ramos florescentes de café e tabaco.',
      icone: '🦅'
    },
    curiosidade: 'Foram cunhadas apenas 64 peças devido ao descontentamento de D. Pedro I com o traje da gravura. É a moeda mais rara da numismática brasileira.'
  },
  {
    id: 'solido-bizantino',
    nome: 'Sólido de Ouro Bizantino',
    pais: 'Império Bizantino',
    ano: '697 d.C.',
    era: 'Idade Média',
    metal: 'Ouro Solidus',
    corMetal: 0xeab308,
    corEmissive: 0xa855f7,
    anverso: {
      titulo: 'Anverso (Frente Principal)',
      descricao: 'Imperador segurando a Cruz Globígera (Globo Crucígero), afirmando o domínio cristão sobre a terra.',
      icone: '✝️'
    },
    reverso: {
      titulo: 'Reverso (Verso Simbólico)',
      descricao: 'Cruz latina erguida sobre quatro degraus com as inscrições sacras do Império Romano do Oriente.',
      icone: '⚔️'
    },
    curiosidade: 'Manteve seu peso e pureza de ouro inalterados por mais de 700 anos, sendo apelidado de "Dólar da Idade Média".'
  }
];

export default function MapaAntiguidadesTemporal() {
  const [itemSelecionado, setItemSelecionado] = useState(ACERVO_ANTIGUIDADES[0]);
  const [faceAtiva, setFaceAtiva] = useState('anverso'); // 'anverso' ou 'reverso'
  const [filtroEra, setFiltroEra] = useState('Todas');
  const [narrandoAudio, setNarrandoAudio] = useState(false);

  const mount3DRef = useRef(null);
  const sceneRef = useRef(null);
  const coinMeshRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  // --- CRIAÇÃO DAS TEXTURAS 2D EM CANVAS PARA FRENTE E VERSO DA MOEDA ---
  const criarTexturaFaceCoin = (tipoFace, item) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fundo metálico circular com brilho
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
    if (item.metal.includes('Ouro')) {
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#eab308');
      grad.addColorStop(1, '#854d0e');
    } else if (item.metal.includes('Prata')) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#9ca3af');
      grad.addColorStop(1, '#374151');
    } else {
      grad.addColorStop(0, '#fde047');
      grad.addColorStop(0.5, '#ca8a04');
      grad.addColorStop(1, '#451a03');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fill();

    // Borda trabalhada
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Ícone do Relevo
    const faceObj = tipoFace === 'anverso' ? item.anverso : item.reverso;
    ctx.font = '110px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(faceObj.icone, 256, 200);

    // Texto de Borda (Inscrição Numismática)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px "Cinzel", serif';
    ctx.fillText(tipoFace.toUpperCase(), 256, 320);

    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(item.pais.toUpperCase(), 256, 360);
    ctx.fillText(item.ano, 256, 395);

    return new THREE.CanvasTexture(canvas);
  };

  // --- CENA THREE.JS PARA A MOEDA / MEDALHA 3D ---
  useEffect(() => {
    if (!mount3DRef.current) return;

    const width = mount3DRef.current.clientWidth;
    const height = mount3DRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isMobile = width < 768;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 8.5 : 6.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount3DRef.current.innerHTML = '';
    mount3DRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luzes de Estúdio de Museu
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainLight.position.set(5, 5, 8);
    scene.add(mainLight);

    const goldLight = new THREE.PointLight(0xe0b969, 3, 15);
    goldLight.position.set(-4, -2, 4);
    scene.add(goldLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2, 15);
    cyanLight.position.set(4, 3, -2);
    scene.add(cyanLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    // MÁSCARA 3D DA MOEDA (Cilindro com materiais independentes)
    const texAnverso = criarTexturaFaceCoin('anverso', itemSelecionado);
    const texReverso = criarTexturaFaceCoin('reverso', itemSelecionado);

    const matEdge = new THREE.MeshStandardMaterial({
      color: itemSelecionado.corMetal,
      metalness: 0.9,
      roughness: 0.25
    });

    const matAnverso = new THREE.MeshStandardMaterial({
      map: texAnverso,
      metalness: 0.8,
      roughness: 0.3
    });

    const matReverso = new THREE.MeshStandardMaterial({
      map: texReverso,
      metalness: 0.8,
      roughness: 0.3
    });

    // Cilindro (Lado, Topo/Anverso, Fundo/Reverso)
    const geometry = new THREE.CylinderGeometry(2, 2, 0.22, 64);
    const materials = [matEdge, matAnverso, matReverso];

    const coinMesh = new THREE.Mesh(geometry, materials);
    coinMesh.rotation.x = Math.PI / 12; // Leve inclinação elegante
    scene.add(coinMesh);
    coinMeshRef.current = coinMesh;

    // CONTROLE DE INTERAÇÃO (ARRASTAR COM O MOUSE / TOUCH NO ANDROID)
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };

    const handleStart = (cx, cy) => {
      isDragging = true;
      prevPos = { x: cx, y: cy };
    };

    const handleMove = (cx, cy) => {
      if (!isDragging || !coinMeshRef.current) return;
      const dx = cx - prevPos.x;
      const dy = cy - prevPos.y;

      coinMeshRef.current.rotation.y += dx * 0.012;
      coinMeshRef.current.rotation.x += dy * 0.008;

      prevPos = { x: cx, y: cy };
    };

    const handleEnd = () => { isDragging = false; };

    const dom = mount3DRef.current;
    const onMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    const onTouchStart = (e) => { if (e.touches.length === 1) handleStart(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchMove = (e) => { if (e.touches.length === 1) handleMove(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchEnd = () => handleEnd();

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // LOOP DE ANIMAÇÃO 3D
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (coinMeshRef.current && !isDragging) {
        // Rotação sutil automática quando o usuário não estiver arrastando
        coinMeshRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount3DRef.current) return;
      const w = mount3DRef.current.clientWidth;
      const h = mount3DRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (dom && renderer.domElement) dom.removeChild(renderer.domElement);
    };
  }, [itemSelecionado]);

  // --- ATUALIZAR FACE ATIVA E GIRAR A MOEDA 180° ---
  const alternarFace3D = (face) => {
    setFaceAtiva(face);
    if (!coinMeshRef.current) return;

    const targetY = face === 'anverso' ? 0 : Math.PI;
    
    // Animação suave de rotação
    let startTime = null;
    const startY = coinMeshRef.current.rotation.y;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 600, 1);
      
      coinMeshRef.current.rotation.y = startY + (targetY - startY) * progress;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // --- NARRAÇÃO POR VOZ SINTETIZADA ---
  const narrarArtefatoPorVoz = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (narrandoAudio) {
      window.speechSynthesis.cancel();
      setNarrandoAudio(false);
      return;
    }

    const texto = `${itemSelecionado.nome}, da civilização ${itemSelecionado.pais}, ano ${itemSelecionado.ano}. 
    Mapeamento numismático da face ${faceAtiva}. 
    ${faceAtiva === 'anverso' ? itemSelecionado.anverso.descricao : itemSelecionado.reverso.descricao}. 
    Curiosidade: ${itemSelecionado.curiosidade}`;

    const utt = new SpeechSynthesisUtterance(texto);
    utt.lang = 'pt-BR';
    utt.rate = 1.0;

    utt.onend = () => setNarrandoAudio(false);
    utt.onerror = () => setNarrandoAudio(false);

    setNarrandoAudio(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };

  const erasDisponiveis = ['Todas', ...new Set(ACERVO_ANTIGUIDADES.map(a => a.era))];
  const itensFiltrados = filtroEra === 'Todas' 
    ? ACERVO_ANTIGUIDADES 
    : ACERVO_ANTIGUIDADES.filter(a => a.era === filtroEra);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#050608',
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(224, 185, 105, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(0, 240, 255, 0.05) 0%, transparent 45%)
      `,
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <Head>
        <title>Emanuel.OS | Mapa Temporal 3D de Antiguidades & Numismática</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* HEADER PRINCIPAL */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(224, 185, 105, 0.25)',
        backgroundColor: 'rgba(11, 13, 20, 0.9)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{
            backgroundColor: 'rgba(224, 185, 105, 0.15)',
            border: '1px solid #e0b969',
            color: '#fdf0cd',
            padding: '8px 14px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ◀ Voltar ao Emanuel.OS
          </Link>

          <div>
            <h1 style={{ margin: 0, fontSize: '18px', color: '#e0b969', letterSpacing: '1px', fontWeight: '900' }}>
              🏛️ MUSEU VIRTUAL TEMPORAL DE MOEDAS & MEDALHAS 3D
            </h1>
            <span style={{ fontSize: '10px', color: '#00f0ff', fontFamily: 'monospace' }}>
              ESTUDO ANATÔMICO: ANVERSO (FRENTE) VS. REVERSO (VERSO) | CORE v5.1
            </span>
          </div>
        </div>

        <button 
          onClick={narrarArtefatoPorVoz}
          style={{
            backgroundColor: narrandoAudio ? '#ff007f' : 'rgba(0, 240, 255, 0.15)',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            padding: '10px 18px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '11px',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
          }}
        >
          {narrandoAudio ? '🔴 Parar Narração G-AGI' : '🎙️ Ouvir Detalhes Numismáticos'}
        </button>
      </header>

      {/* ÁREA DE FILTROS DE ÉPOCAS / LINHA DO TEMPO */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: '#0b0d14',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        <span style={{ fontSize: '11px', color: '#e0b969', fontWeight: 'bold', alignSelf: 'center', marginRight: '8px' }}>
          ⏳ FILTRAR ÉPOCA HISTÓRICA:
        </span>
        {erasDisponiveis.map(era => (
          <button
            key={era}
            onClick={() => setFiltroEra(era)}
            style={{
              padding: '6px 14px',
              backgroundColor: filtroEra === era ? '#e0b969' : 'rgba(255, 255, 255, 0.03)',
              color: filtroEra === era ? '#000' : '#d1d5db',
              border: `1px solid ${filtroEra === era ? '#e0b969' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '16px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {era}
          </button>
        ))}
      </div>

      {/* CONTEÚDO PRINCIPAL DIVIDIDO EM DUAS COLUNAS */}
      <div style={{
        flexGrow: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {/* LADO ESQUERDO: CANVAS 3D DA MOEDA E CONTROLES DE FACE */}
        <div style={{
          backgroundColor: '#0b0d14',
          border: '1px solid rgba(224, 185, 105, 0.3)',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          position: 'relative'
        }}>
          
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '20px',
            backgroundColor: 'rgba(224, 185, 105, 0.15)',
            border: '1px solid #e0b969',
            color: '#fdf0cd',
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '4px 10px',
            borderRadius: '12px'
          }}>
            🪙 MODELO 3D REALISTA (GIRO TOUCH)
          </div>

          <div 
            ref={mount3DRef} 
            style={{
              width: '100%',
              height: '380px',
              cursor: 'grab',
              touchAction: 'none'
            }} 
          />

          {/* BOTÕES DE SELEÇÃO: ANVERSO VS REVERSO */}
          <div style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            maxWidth: '400px',
            marginTop: '10px'
          }}>
            <button
              onClick={() => alternarFace3D('anverso')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: faceAtiva === 'anverso' ? '#e0b969' : 'rgba(255, 255, 255, 0.05)',
                color: faceAtiva === 'anverso' ? '#000' : '#e0b969',
                border: '1px solid #e0b969',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              👑 ANVERSO (FRENTE 180°)
            </button>

            <button
              onClick={() => alternarFace3D('reverso')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: faceAtiva === 'reverso' ? '#00f0ff' : 'rgba(255, 255, 255, 0.05)',
                color: faceAtiva === 'reverso' ? '#000' : '#00f0ff',
                border: '1px solid #00f0ff',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🔄 REVERSO (VERSO 180°)
            </button>
          </div>

          <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '12px', textAlign: 'center' }}>
            💡 Arraste com o dedo no celular ou mouse para girar o artefato em 360 graus.
          </p>
        </div>

        {/* LADO DIREITO: CATÁLOGO E DETALHES NUMISMÁTICOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* PAINEL DE DETALHES DO ARTEFATO SELECIONADO */}
          <div style={{
            backgroundColor: '#0b0d14',
            border: '1px solid rgba(224, 185, 105, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{
                  color: '#e0b969',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  display: 'block'
                }}>
                  {itemSelecionado.pais.toUpperCase()} • {itemSelecionado.era.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '26px', color: '#fdf0cd', margin: '4px 0 0 0', fontWeight: 'bold' }}>
                  {itemSelecionado.nome}
                </h2>
              </div>

              <span style={{
                backgroundColor: 'rgba(224, 185, 105, 0.1)',
                border: '1px solid #e0b969',
                color: '#e0b969',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {itemSelecionado.ano}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '16px 0' }}>
              <div style={{ backgroundColor: '#121520', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>COMPOSIÇÃO METÁLICA</span>
                <strong style={{ fontSize: '11px', color: '#38bdf8' }}>{itemSelecionado.metal}</strong>
              </div>
              <div style={{ backgroundColor: '#121520', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>FACE EM EXIBIÇÃO 3D</span>
                <strong style={{ fontSize: '11px', color: faceAtiva === 'anverso' ? '#e0b969' : '#00f0ff' }}>
                  {faceAtiva === 'anverso' ? 'Anverso (Frente)' : 'Reverso (Verso)'}
                </strong>
              </div>
            </div>

            {/* DESCRIÇÃO DA FACE ATIVA */}
            <div style={{
              backgroundColor: '#121520',
              borderLeft: `4px solid ${faceAtiva === 'anverso' ? '#e0b969' : '#00f0ff'}`,
              padding: '14px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '13px', color: faceAtiva === 'anverso' ? '#e0b969' : '#00f0ff' }}>
                {faceAtiva === 'anverso' ? itemSelecionado.anverso.titulo : itemSelecionado.reverso.titulo}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#d1d5db', lineHeight: '1.5' }}>
                {faceAtiva === 'anverso' ? itemSelecionado.anverso.descricao : itemSelecionado.reverso.descricao}
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(224, 185, 105, 0.05)', border: '1px dashed rgba(224, 185, 105, 0.3)', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#e0b969', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                📜 REGISTRO HISTÓRICO:
              </span>
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', lineHeight: '1.4' }}>
                {itemSelecionado.curiosidade}
              </p>
            </div>
          </div>

          {/* LISTA / SELEÇÃO DE ARTEFATOS DO MUNDO */}
          <div style={{
            backgroundColor: '#0b0d14',
            border: '1px solid rgba(224, 185, 105, 0.3)',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '13px', color: '#e0b969', margin: '0 0 12px 0', fontWeight: 'bold' }}>
              🌐 ACERVO NUMISMÁTICO MUNDIAL SELECIONÁVEL ({itensFiltrados.length})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {itensFiltrados.map(item => (
                <div
                  key={item.id}
                  onClick={() => setItemSelecionado(item)}
                  style={{
                    backgroundColor: itemSelecionado.id === item.id ? 'rgba(224, 185, 105, 0.2)' : '#121520',
                    border: `1px solid ${itemSelecionado.id === item.id ? '#e0b969' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                    {item.anverso.icone}
                  </div>
                  <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>
                    {item.nome}
                  </strong>
                  <span style={{ fontSize: '9px', color: '#9ca3af' }}>
                    {item.pais} ({item.ano})
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER DO SISTEMA EMANUEL.OS */}
      <footer style={{
        padding: '16px',
        textAlign: 'center',
        borderTop: '1px solid rgba(224, 185, 105, 0.2)',
        backgroundColor: '#0b0d14',
        fontSize: '10px',
        color: '#9ca3af'
      }}>
        MUSEU VIRTUAL TEMPORAL EMANUEL.OS v5.1 | DESENVOLVIDO POR EMANUEL DA SILVA | ANO: 2030
      </footer>
    </div>
  );
}