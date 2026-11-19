import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Componente: Yu-Gi-Oh! Duel Links Futurista 3D — Emanuel ART Edition
 * Avatares 3D vivos (Emanuel ART, Robotoc 3D, Vegatocnyx 3D, Yami Yugi 3D, Seto Kaiba 3D),
 * Cartas 3D com partículas, invocação, efeitos, movimento e verso "Emanuel ART".
 */

const PERSONAGENS = {
  emanuel: {
    id: 'emanuel',
    nome: 'Emanuel ART',
    titulo: 'Criador & Duelista Core',
    corPrincipal: 0x00f0ff,
    corSecundaria: 0xe2e8f0,
    corDetalhe: 0x0284c7,
    falaEntrada: 'Emanuel ART na arena! O sistema Emanuel.OS está pronto para o duelo!',
    falaInvocar: 'Invocação holográfica Emanuel ART! Mostre sua força na arena 3D!',
    falaAtaque: 'Ataque direto com poder digital Emanuel ART! Vai lá!',
    falaVitoria: 'Vitória de Emanuel ART! Precisão máxima na arena 3D!'
  },
  robotoc: {
    id: 'robotoc',
    nome: 'Robotoc 3D',
    titulo: 'Unidade Tática Níquel & Azul',
    corPrincipal: 0x0284c7,
    corSecundaria: 0xf8fafc,
    corDetalhe: 0x00f0ff,
    falaEntrada: 'Unidade Robotoc 3D online. Calculando probabilidades de vitória em 99,9%.',
    falaInvocar: 'Unidade de ataque 3D mobilizada no campo.',
    falaAtaque: 'Disparo holográfico ativado! Impacto confirmado no campo adversário.',
    falaVitoria: 'Objetivo concluído. Oponente neutralizado com eficiência Robotoc.'
  },
  vegatocnyx: {
    id: 'vegatocnyx',
    nome: 'Vegatocnyx 3D',
    titulo: 'Valkyrie Cyber-Neon',
    corPrincipal: 0xec4899,
    corSecundaria: 0xf8fafc,
    corDetalhe: 0x00f0ff,
    falaEntrada: 'Vegatocnyx 3D em campo! Vamos brilhar com energia cyber-neon!',
    falaInvocar: 'Entrando em cena com brilho estelar Vegatocnyx 3D!',
    falaAtaque: 'Golpe estelar Vegatocnyx! Nada vai deter essa combinação!',
    falaVitoria: 'Que show de duelo! Vegatocnyx 3D dominou a arena!'
  },
  yugi: {
    id: 'yugi',
    nome: 'Yami Yugi 3D',
    titulo: 'Rei dos Jogos do Milênio',
    corPrincipal: 0x7e22ce,
    corSecundaria: 0xfacc15,
    corDetalhe: 0x00f0ff,
    falaEntrada: 'É hora do duelo! Acredite no coração das cartas e no poder do milênio!',
    falaInvocar: 'Eu invoco meu monstro em modo de ataque! Mostre seu poder!',
    falaAtaque: 'Avante, meu monstro! Destrua os pontos de vida do oponente!',
    falaVitoria: 'O coração das cartas nos guiou até a vitória!'
  },
  kaiba: {
    id: 'kaiba',
    nome: 'Seto Kaiba 3D',
    titulo: 'Presidente da KaibaCorp',
    corPrincipal: 0xf8fafc,
    corSecundaria: 0x38bdf8,
    corDetalhe: 0x1d4ed8,
    falaEntrada: 'Patético! A tecnologia da KaibaCorp esmagará qualquer estratégia!',
    falaInvocar: 'Surgindo no campo com a potência máxima da KaibaCorp!',
    falaAtaque: 'Esmague-os sem piedade! Mostre o poder absoluto do Dragão Branco!',
    falaVitoria: 'Hmph. Como esperado da superioridade da KaibaCorp.'
  }
};

const MUNDOS = {
  dm: {
    id: 'dm',
    nome: 'Duel Monsters (DM)',
    corFundo: 0x090d1e,
    corGrade1: 0xfacc15,
    corGrade2: 0x1e3a8a,
    corLuz: 0x38bdf8,
    cartaA: { nome: 'Dragão Branco 3D', atk: 3000, cor: '#38bdf8', aura: '#e0f2fe' },
    cartaB: { nome: 'Mago Negro Cyber', atk: 2500, cor: '#a855f7', aura: '#f3e8ff' }
  },
  gx: {
    id: 'gx',
    nome: 'GX Academy',
    corFundo: 0x071a14,
    corGrade1: 0xef4444,
    corGrade2: 0x10b981,
    corLuz: 0x4ade80,
    cartaA: { nome: 'Neos Elementar 3D', atk: 2500, cor: '#f8fafc', aura: '#ef4444' },
    cartaB: { nome: 'Flame Wingman Neon', atk: 2100, cor: '#f97316', aura: '#fde047' }
  },
  vrains: {
    id: 'vrains',
    nome: 'VRAINS Link',
    corFundo: 0x050b18,
    corGrade1: 0x00f0ff,
    corGrade2: 0xec4899,
    corLuz: 0x00f0ff,
    cartaA: { nome: 'Decode Talker 3D', atk: 2300, cor: '#00f0ff', aura: '#0284c7' },
    cartaB: { nome: 'Firewall Cyber Dragão', atk: 2500, cor: '#22d3ee', aura: '#a855f7' }
  },
  sevens: {
    id: 'sevens',
    nome: 'SEVENS Rush',
    corFundo: 0x140924,
    corGrade1: 0xf43f5e,
    corGrade2: 0x38bdf8,
    corLuz: 0xf43f5e,
    cartaA: { nome: 'Sevens Road Magician', atk: 2100, cor: '#c084fc', aura: '#f43f5e' },
    cartaB: { nome: 'Dragão Rush 7', atk: 2400, cor: '#fbbf24', aura: '#38bdf8' }
  },
  gorush: {
    id: 'gorush',
    nome: 'GO RUSH!! Galáxia',
    corFundo: 0x061021,
    corGrade1: 0x2dd4bf,
    corGrade2: 0x818cf8,
    corLuz: 0x2dd4bf,
    cartaA: { nome: 'Aldebaran Estelar 3D', atk: 2500, cor: '#2dd4bf', aura: '#818cf8' },
    cartaB: { nome: 'Transamu Orbital', atk: 2600, cor: '#f472b6', aura: '#38bdf8' }
  }
};

function criarTexturaFrenteCarta(titulo, atk, corBorda, corAura) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 256, 384);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e293b');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 384);

  ctx.strokeStyle = corBorda;
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, 240, 368);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(titulo, 128, 36);

  const artGrad = ctx.createRadialGradient(128, 175, 10, 128, 175, 95);
  artGrad.addColorStop(0, corAura);
  artGrad.addColorStop(0.5, corBorda);
  artGrad.addColorStop(1, '#090d1e');
  ctx.fillStyle = artGrad;
  ctx.fillRect(26, 56, 204, 225);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 56, 204, 225);

  ctx.beginPath();
  ctx.moveTo(128, 105);
  ctx.lineTo(175, 168);
  ctx.lineTo(128, 232);
  ctx.lineTo(81, 168);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.fillRect(26, 296, 204, 58);
  ctx.strokeStyle = corBorda;
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 296, 204, 58);

  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(`ATK / ${atk}`, 128, 332);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function criarTexturaVersoEmanuelART() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 256, 384);
  bgGrad.addColorStop(0, '#041226');
  bgGrad.addColorStop(0.5, '#092447');
  bgGrad.addColorStop(1, '#020817');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 256, 384);

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 236, 364);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 216, 344);

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
  ctx.lineWidth = 1.5;
  for (let i = 1; i <= 4; i++) {
    const r = i * 24;
    ctx.beginPath();
    ctx.moveTo(128, 192 - r);
    ctx.lineTo(128 + r * 0.75, 192);
    ctx.lineTo(128, 192 + r);
    ctx.lineTo(128 - r * 0.75, 192);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(128, 192, 68, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.45)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#00f0ff';
  ctx.stroke();

  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 16;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EMANUEL', 128, 180);

  ctx.fillStyle = '#00f0ff';
  ctx.font = '900 22px Arial, sans-serif';
  ctx.fillText('ART', 128, 208);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('DUEL LINKS 3D EDITION', 128, 346);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function criarAvatar3DPersonagem(personagemId, escala = 1) {
  const p = PERSONAGENS[personagemId] || PERSONAGENS.emanuel;
  const group = new THREE.Group();
  group.scale.setScalar(escala);

  const matCorpo = new THREE.MeshStandardMaterial({
    color: p.corPrincipal,
    metalness: 0.55,
    roughness: 0.25
  });
  const matArmadura = new THREE.MeshStandardMaterial({
    color: p.corSecundaria,
    metalness: 0.7,
    roughness: 0.2
  });
  const matNeon = new THREE.MeshStandardMaterial({
    color: p.corDetalhe,
    emissive: p.corDetalhe,
    emissiveIntensity: 2.3
  });

  // Base holográfica sob os pés para dar presença viva na arena
  const baseRing = new THREE.Mesh(
    new THREE.RingGeometry(0.45, 0.62, 28),
    new THREE.MeshBasicMaterial({ color: p.corDetalhe, side: THREE.DoubleSide })
  );
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = -0.35;
  group.add(baseRing);

  // Corpo / Torso
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.85, 20), matCorpo);
  torso.position.y = 0.2;
  group.add(torso);

  // Peitoral / Núcleo
  const chestCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), matNeon);
  chestCore.position.set(0, 0.35, 0.32);
  group.add(chestCore);

  // Cabeça
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.92;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), matArmadura);
  headGroup.add(head);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.13, 0.14), matNeon);
  visor.position.set(0, 0.02, 0.28);
  headGroup.add(visor);

  if (personagemId === 'yugi') {
    const spike1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    spike1.position.set(-0.23, 0.44, 0);
    spike1.rotation.z = 0.38;
    const spike2 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.68, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    spike2.position.set(0, 0.52, 0);
    const spike3 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    spike3.position.set(0.23, 0.44, 0);
    spike3.rotation.z = -0.38;
    const puzzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.18, 4),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.15 })
    );
    puzzle.rotation.x = Math.PI;
    puzzle.position.set(0, -0.78, 0.34);
    headGroup.add(spike1, spike2, spike3, puzzle);
  } else if (personagemId === 'kaiba') {
    const hairL = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.48, 8), new THREE.MeshStandardMaterial({ color: 0x5c3a21 }));
    hairL.position.set(-0.27, 0.34, 0);
    hairL.rotation.z = 0.52;
    const hairR = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.48, 8), new THREE.MeshStandardMaterial({ color: 0x5c3a21 }));
    hairR.position.set(0.27, 0.34, 0);
    hairR.rotation.z = -0.52;
    const coat = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.72, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
    );
    coat.position.set(0, -0.68, -0.22);
    coat.rotation.x = 0.25;
    headGroup.add(hairL, hairR, coat);
  } else if (personagemId === 'vegatocnyx') {
    const ponytail = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.72, 12), matNeon);
    ponytail.position.set(0, 0.28, -0.46);
    ponytail.rotation.x = -0.9;
    headGroup.add(ponytail);
  } else {
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.4, 12), matNeon);
    antenna.position.set(0, 0.5, 0);
    headGroup.add(antenna);
  }

  group.add(headGroup);

  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.65, 12), matArmadura);
  armL.position.set(-0.48, 0.22, 0.1);
  armL.rotation.z = 0.25;

  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.65, 12), matArmadura);
  armR.position.set(0.48, 0.22, 0.1);
  armR.rotation.z = -0.25;

  group.add(armL, armR);

  return { group, headGroup, armL, armR, chestCore };
}

export default function YugiohDuelLinks3D({ onClose }) {
  const [stage, setStage] = useState(2);
  const [gems, setGems] = useState(40);
  const [gold, setGold] = useState(150);
  const [activeTab, setActiveTab] = useState('gate');
  const [configOpen, setConfigOpen] = useState(false);

  const [personagemP1, setPersonagemP1] = useState('yugi');
  const [personagemP2, setPersonagemP2] = useState('kaiba');
  const [mundoAtual, setMundoAtual] = useState('dm');

  const [modoJogo, setModoJogo] = useState('auto_ia');
  const [turnoAtual, setTurnoAtual] = useState('P1');
  const [lpJogador, setLpJogador] = useState(4000);
  const [lpOponente, setLpOponente] = useState(4000);
  const [dueloStatus, setDueloStatus] = useState('Aguardando Início');
  const [falaAtual, setFalaAtual] = useState(PERSONAGENS.yugi.falaEntrada);
  const [efeitoCartaAtivo, setEfeitoCartaAtivo] = useState('Aura Holográfica & Partículas Ativas');

  const [missoes, setMissoes] = useState([
    { id: 1, titulo: 'Realize 2 ataques na Arena 3D', progresso: 0, meta: 2, recompensaGems: 50, recompensaGold: 200, concluida: false, resgatada: false },
    { id: 2, titulo: 'Alterne entre 2 Mundos de Yu-Gi-Oh!', progresso: 0, meta: 2, recompensaGems: 75, recompensaGold: 300, concluida: false, resgatada: false },
    { id: 3, titulo: 'Vença um duelo na Arena', progresso: 0, meta: 1, recompensaGems: 120, recompensaGold: 500, concluida: false, resgatada: false }
  ]);
  const mundosVisitadosRef = useRef(new Set(['dm']));

  const [volumeVozes, setVolumeVozes] = useState(80);
  const [qualidade3D, setQualidade3D] = useState('Ultra Futurista');
  const [modoCamera, setModoCamera] = useState('Dinamica 3D');

  const mount3DRef = useRef(null);
  const avatarP1Ref = useRef(null);
  const avatarP2Ref = useRef(null);
  const yugiCameoRef = useRef(null);
  const kaibaCameoRef = useRef(null);
  const attackAnimRef = useRef(0);
  const flipAnimRef = useRef(0);
  const summonAnimRef = useRef(0);

  const falarEmPortugues = (texto, personagemKey = personagemP1) => {
    const p = PERSONAGENS[personagemKey] || PERSONAGENS.emanuel;
    setFalaAtual(`${p.nome}: "${texto}"`);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && volumeVozes > 0) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.volume = Math.min(1, Math.max(0, volumeVozes / 100));
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const incrementarMissao = (idMissao, qtd = 1) => {
    setMissoes(prev =>
      prev.map(m => {
        if (m.id !== idMissao || m.resgatada) return m;
        const novoProg = Math.min(m.meta, m.progresso + qtd);
        return { ...m, progresso: novoProg, concluida: novoProg >= m.meta };
      })
    );
  };

  const resgatarRecompensaMissao = (idMissao) => {
    setMissoes(prev =>
      prev.map(m => {
        if (m.id === idMissao && m.concluida && !m.resgatada) {
          setGems(g => g + m.recompensaGems);
          setGold(gd => gd + m.recompensaGold);
          setStage(s => s + 1);
          falarEmPortugues(`Recompensa resgatada! Ganhei ${m.recompensaGems} Gemas e ${m.recompensaGold} de Ouro!`, personagemP1);
          return { ...m, resgatada: true };
        }
        return m;
      })
    );
  };

  const selecionarMundo = (novoMundo) => {
    setMundoAtual(novoMundo);
    mundosVisitadosRef.current.add(novoMundo);
    if (mundosVisitadosRef.current.size >= 2) {
      incrementarMissao(2, 1);
    }
    const infoMundo = MUNDOS[novoMundo];
    setDueloStatus(`🌌 Mundo Ativo: ${infoMundo.nome}`);
    falarEmPortugues(`Entrando no cenário de ${infoMundo.nome}!`, personagemP1);
  };

  useEffect(() => {
    if (!mount3DRef.current) return;

    const width = mount3DRef.current.clientWidth;
    const height = mount3DRef.current.clientHeight;
    const mundo = MUNDOS[mundoAtual] || MUNDOS.dm;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(mundo.corFundo);
    scene.fog = new THREE.FogExp2(mundo.corFundo, 0.018);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    if (modoCamera === 'Isometrica') {
      camera.position.set(6.2, 6.2, 8.2);
    } else {
      camera.position.set(0, 4.1, 8.5);
    }
    camera.lookAt(0, 0.45, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: qualidade3D !== 'Economica'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      qualidade3D === 'Ultra Futurista' ? Math.min(window.devicePixelRatio, 2) : 1
    );
    mount3DRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(mundo.corLuz, 15, 36);
    mainLight.position.set(0, 6, 4);
    scene.add(mainLight);

    const sideLight = new THREE.PointLight(0xff00ff, 10, 32);
    sideLight.position.set(4, 5, -3);
    scene.add(sideLight);

    const grid = new THREE.GridHelper(22, 22, mundo.corGrade1, mundo.corGrade2);
    grid.position.y = -0.6;
    scene.add(grid);

    // Avatares principais P1 e P2
    const p1Obj = criarAvatar3DPersonagem(personagemP1, 1.05);
    p1Obj.group.position.set(-3.5, 0.25, 1.4);
    p1Obj.group.rotation.y = 0.65;
    scene.add(p1Obj.group);
    avatarP1Ref.current = p1Obj;

    const p2Obj = criarAvatar3DPersonagem(personagemP2, 1.05);
    p2Obj.group.position.set(3.5, 0.25, -1.2);
    p2Obj.group.rotation.y = -2.35;
    scene.add(p2Obj.group);
    avatarP2Ref.current = p2Obj;

    // Presença garantida de Yugi 3D e Kaiba 3D na arena quando não forem os selecionados principais
    let yugiExtra = null;
    if (personagemP1 !== 'yugi' && personagemP2 !== 'yugi') {
      yugiExtra = criarAvatar3DPersonagem('yugi', 0.85);
      yugiExtra.group.position.set(-5.2, 0.1, -1.6);
      yugiExtra.group.rotation.y = 0.85;
      scene.add(yugiExtra.group);
    }
    yugiCameoRef.current = yugiExtra;

    let kaibaExtra = null;
    if (personagemP1 !== 'kaiba' && personagemP2 !== 'kaiba') {
      kaibaExtra = criarAvatar3DPersonagem('kaiba', 0.85);
      kaibaExtra.group.position.set(5.2, 0.1, 1.2);
      kaibaExtra.group.rotation.y = -2.1;
      scene.add(kaibaExtra.group);
    }
    kaibaCameoRef.current = kaibaExtra;

    // Cartas 3D com Verso Emanuel ART
    const cartasGroup = new THREE.Group();
    const cardGeo = new THREE.BoxGeometry(1.38, 2.04, 0.06);
    const versoTex = criarTexturaVersoEmanuelART();
    const versoMat = new THREE.MeshStandardMaterial({
      map: versoTex,
      metalness: 0.65,
      roughness: 0.25,
      emissive: 0x0284c7,
      emissiveIntensity: 0.28
    });

    const frenteTex1 = criarTexturaFrenteCarta(
      mundo.cartaA.nome,
      mundo.cartaA.atk,
      mundo.cartaA.cor,
      mundo.cartaA.aura
    );
    const frenteMat1 = new THREE.MeshStandardMaterial({
      map: frenteTex1,
      metalness: 0.6,
      roughness: 0.2
    });
    const cardMesh1 = new THREE.Mesh(cardGeo, [
      versoMat,
      versoMat,
      versoMat,
      versoMat,
      frenteMat1,
      versoMat
    ]);
    cardMesh1.position.set(-1.35, 0.9, 0.5);
    cardMesh1.rotation.y = 0.25;

    const frenteTex2 = criarTexturaFrenteCarta(
      mundo.cartaB.nome,
      mundo.cartaB.atk,
      mundo.cartaB.cor,
      mundo.cartaB.aura
    );
    const frenteMat2 = new THREE.MeshStandardMaterial({
      map: frenteTex2,
      metalness: 0.6,
      roughness: 0.2
    });
    const cardMesh2 = new THREE.Mesh(cardGeo, [
      versoMat,
      versoMat,
      versoMat,
      versoMat,
      frenteMat2,
      versoMat
    ]);
    cardMesh2.position.set(1.35, 0.9, -0.5);
    cardMesh2.rotation.y = -0.25;

    // Anéis e partículas orbitais nas cartas 3D
    const auraGeo = new THREE.TorusGeometry(1.02, 0.025, 12, 48);
    const auraMat = new THREE.MeshBasicMaterial({ color: mundo.corLuz });
    const aura1 = new THREE.Mesh(auraGeo, auraMat);
    aura1.rotation.x = Math.PI / 2.6;

    const aura2 = new THREE.Mesh(auraGeo, auraMat);
    aura2.rotation.x = Math.PI / 2.6;

    const particleCount = 48;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const ang = (i / particleCount) * Math.PI * 2;
      const rad = 1.6 + (i % 4) * 0.45;
      positions[i * 3] = Math.cos(ang) * rad;
      positions[i * 3 + 1] = 0.4 + (i % 6) * 0.35;
      positions[i * 3 + 2] = Math.sin(ang) * rad;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: mundo.corLuz,
      size: 0.11,
      transparent: true,
      opacity: 0.85
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    cartasGroup.add(particles);

    // Zonas de campo 3D
    const zoneGeo = new THREE.PlaneGeometry(1.45, 2.05);
    const zoneMat = new THREE.MeshBasicMaterial({
      color: mundo.corGrade1,
      side: THREE.DoubleSide,
      wireframe: true
    });
    for (let i = -2; i <= 2; i++) {
      const zone = new THREE.Mesh(zoneGeo, zoneMat);
      zone.rotation.x = Math.PI / 2;
      zone.position.set(i * 1.65, -0.57, 1.3);
      cartasGroup.add(zone);
    }

    cartasGroup.add(cardMesh1, cardMesh2, aura1, aura2);
    scene.add(cartasGroup);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (attackAnimRef.current > 0) {
        attackAnimRef.current = Math.max(0, attackAnimRef.current - 0.025);
      }
      if (flipAnimRef.current > 0) {
        flipAnimRef.current = Math.max(0, flipAnimRef.current - 0.02);
      }
      if (summonAnimRef.current > 0) {
        summonAnimRef.current = Math.max(0, summonAnimRef.current - 0.02);
      }

      const atkPulse = Math.sin(attackAnimRef.current * Math.PI);
      const summonLift = Math.sin(summonAnimRef.current * Math.PI) * 0.85;
      const giroExtra = flipAnimRef.current * Math.PI * 2;

      // Movimento vivo das cartas 3D
      cardMesh1.position.y = 0.9 + Math.sin(t * 2.5) * 0.14 + atkPulse * 0.5 + summonLift;
      cardMesh1.position.z = 0.5 + atkPulse * 1.35;
      cardMesh1.rotation.y = 0.25 + Math.sin(t * 1.6) * 0.22 + giroExtra;
      cardMesh1.rotation.z = Math.cos(t * 1.8) * 0.06;

      cardMesh2.position.y = 0.9 + Math.cos(t * 2.5) * 0.14 + summonLift * 0.6;
      cardMesh2.rotation.y = -0.25 + Math.cos(t * 1.6) * 0.22 - giroExtra * 0.5;
      cardMesh2.rotation.z = Math.sin(t * 1.8) * 0.06;

      aura1.position.copy(cardMesh1.position);
      aura1.rotation.z = t * 1.8;
      aura2.position.copy(cardMesh2.position);
      aura2.rotation.z = -t * 1.8;

      particles.rotation.y = t * 0.45;
      particles.position.y = Math.sin(t * 2) * 0.12;

      // Movimento vivo dos avatares 3D
      if (avatarP1Ref.current) {
        avatarP1Ref.current.group.position.y = 0.25 + Math.abs(Math.sin(t * 3.2)) * 0.12;
        avatarP1Ref.current.group.position.x = -3.5 + Math.sin(t * 1.1) * 0.25 + atkPulse * 0.6;
        avatarP1Ref.current.headGroup.rotation.y = Math.sin(t * 2) * 0.25;
        avatarP1Ref.current.armR.rotation.x = -0.45 - atkPulse * 1.3 - summonLift * 0.5;
      }

      if (avatarP2Ref.current) {
        avatarP2Ref.current.group.position.y = 0.25 + Math.abs(Math.cos(t * 3.2)) * 0.12;
        avatarP2Ref.current.group.position.x = 3.5 + Math.cos(t * 1.1) * 0.25;
        avatarP2Ref.current.headGroup.rotation.y = Math.cos(t * 2) * 0.25;
      }

      if (yugiExtra) {
        yugiExtra.group.position.y = 0.1 + Math.sin(t * 2.4) * 0.1;
        yugiExtra.headGroup.rotation.y = Math.sin(t * 1.5) * 0.3;
      }

      if (kaibaExtra) {
        kaibaExtra.group.position.y = 0.1 + Math.cos(t * 2.4) * 0.1;
        kaibaExtra.headGroup.rotation.y = Math.cos(t * 1.5) * 0.3;
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mount3DRef.current && renderer.domElement) {
        mount3DRef.current.removeChild(renderer.domElement);
      }
    };
  }, [personagemP1, personagemP2, mundoAtual, modoCamera, qualidade3D]);

  const invocarCarta3D = () => {
    summonAnimRef.current = 1.0;
    flipAnimRef.current = 0.7;
    const mundo = MUNDOS[mundoAtual] || MUNDOS.dm;
    setEfeitoCartaAtivo(`🌟 ${mundo.cartaA.nome} (ATK ${mundo.cartaA.atk}) invocado com aura 3D!`);
    setDueloStatus(`✨ Invocação 3D de ${PERSONAGENS[personagemP1].nome}!`);
    falarEmPortugues(PERSONAGENS[personagemP1].falaInvocar, personagemP1);
  };

  const executarAtaque = (atacante = 'P1') => {
    attackAnimRef.current = 1.0;
    flipAnimRef.current = 1.0;
    setEfeitoCartaAtivo(
      atacante === 'P1'
        ? `⚡ Golpe Holográfico de ${PERSONAGENS[personagemP1].nome}!`
        : `🔥 Contra-ataque de ${PERSONAGENS[personagemP2].nome}!`
    );

    if (atacante === 'P1') {
      const dano = 1200;
      setLpOponente(prev => {
        const novoLp = Math.max(0, prev - dano);
        if (novoLp === 0) {
          incrementarMissao(3, 1);
          setDueloStatus(`🏆 Vitória de ${PERSONAGENS[personagemP1].nome}!`);
          falarEmPortugues(PERSONAGENS[personagemP1].falaVitoria, personagemP1);
        } else {
          setDueloStatus(`⚔️ ${PERSONAGENS[personagemP1].nome} causou ${dano} de dano!`);
          falarEmPortugues(PERSONAGENS[personagemP1].falaAtaque, personagemP1);
        }
        return novoLp;
      });
      incrementarMissao(1, 1);

      if (modoJogo === 'auto_ia') {
        setTimeout(() => {
          setTurnoAtual('P2');
          setDueloStatus(`🤖 Máquina (${PERSONAGENS[personagemP2].nome}) executando turno...`);
          attackAnimRef.current = 0.85;
          setLpJogador(prev => Math.max(0, prev - 900));
          falarEmPortugues(PERSONAGENS[personagemP2].falaAtaque, personagemP2);
          setTimeout(() => {
            setTurnoAtual('P1');
            setDueloStatus('⚡ Seu turno! Escolha sua ação na Arena 3D.');
          }, 1100);
        }, 1200);
      } else {
        setTurnoAtual('P2');
      }
    } else {
      const dano = 1000;
      setLpJogador(prev => {
        const novoLp = Math.max(0, prev - dano);
        if (novoLp === 0) {
          setDueloStatus(`🏆 Vitória de ${PERSONAGENS[personagemP2].nome}!`);
          falarEmPortugues(PERSONAGENS[personagemP2].falaVitoria, personagemP2);
        } else {
          setDueloStatus(`⚔️ ${PERSONAGENS[personagemP2].nome} causou ${dano} de dano!`);
          falarEmPortugues(PERSONAGENS[personagemP2].falaAtaque, personagemP2);
        }
        return novoLp;
      });
      setTurnoAtual('P1');
    }
  };

  const iniciarDuelo3D = () => {
    setLpJogador(4000);
    setLpOponente(4000);
    setTurnoAtual('P1');
    flipAnimRef.current = 1.0;
    summonAnimRef.current = 1.0;
    setDueloStatus(
      modoJogo === 'auto_ia'
        ? `🤖 Duelo Automático vs Máquina (${PERSONAGENS[personagemP2].nome}) iniciado!`
        : `⚔️ Duelo 1 contra 1: ${PERSONAGENS[personagemP1].nome} VS ${PERSONAGENS[personagemP2].nome}!`
    );
    falarEmPortugues(PERSONAGENS[personagemP1].falaEntrada, personagemP1);
  };

  const girarCartasVersoEmanuelART = () => {
    flipAnimRef.current = 1.0;
    setEfeitoCartaAtivo('✨ Girando cartas 3D — Verso oficial Emanuel ART em destaque!');
    falarEmPortugues('Confira o verso exclusivo Emanuel ART nas cartas 3D!', personagemP1);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#0a0f1d',
        color: '#ffffff',
        fontFamily: `'Segoe UI', Roboto, Helvetica, sans-serif`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 🚀 BARRA SUPERIOR */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '10px 18px',
          background: 'rgba(10, 15, 29, 0.88)',
          borderBottom: '2px solid #00f0ff',
          backdropFilter: 'blur(12px)',
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7, #00f0ff)',
              padding: '5px 12px',
              borderRadius: '20px',
              boxShadow: '0 0 15px rgba(0,240,255,0.4)',
              fontWeight: '900',
              fontSize: '11px'
            }}
          >
            STAGE <span style={{ fontSize: '15px', color: '#fff' }}>{stage}</span>
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(2, 6, 23, 0.8)', padding: '3px', borderRadius: '10px', border: '1px solid #0284c7' }}>
            <button
              onClick={() => setModoJogo('auto_ia')}
              style={{
                padding: '4px 8px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 'bold',
                background: modoJogo === 'auto_ia' ? '#00f0ff' : 'transparent',
                color: modoJogo === 'auto_ia' ? '#020617' : '#94a3b8'
              }}
            >
              🤖 Máquina Auto
            </button>
            <button
              onClick={() => setModoJogo('vs_1v1')}
              style={{
                padding: '4px 8px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 'bold',
                background: modoJogo === 'vs_1v1' ? '#ec4899' : 'transparent',
                color: modoJogo === 'vs_1v1' ? '#fff' : '#94a3b8'
              }}
            >
              ⚔️ VS 1x1
            </button>
            <button
              onClick={() => {
                setModoJogo('missoes');
                setActiveTab('missoes');
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: 'bold',
                background: modoJogo === 'missoes' ? '#eab308' : 'transparent',
                color: modoJogo === 'missoes' ? '#020617' : '#94a3b8'
              }}
            >
              🏆 Missões
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.45)', padding: '4px 10px', borderRadius: '10px', border: '1px solid #eab308' }}>
            <span>🪙</span>
            <strong style={{ fontSize: '12px', color: '#fde047' }}>{gold}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.45)', padding: '4px 10px', borderRadius: '10px', border: '1px solid #a855f7' }}>
            <span>💎</span>
            <strong style={{ fontSize: '12px', color: '#c084fc' }}>{gems}</strong>
          </div>

          <button
            onClick={() => setConfigOpen(!configOpen)}
            style={{
              background: 'none',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '5px 9px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
            title="Configurações"
          >
            ⚙️
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                padding: '6px 11px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              ✕ Fechar
            </button>
          )}
        </div>
      </header>

      {/* ⚙️ PAINEL DE CONFIGURAÇÕES */}
      {configOpen && (
        <div
          style={{
            position: 'absolute',
            top: '62px',
            right: '18px',
            width: '300px',
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            border: '2px solid #00f0ff',
            borderRadius: '16px',
            padding: '15px',
            zIndex: 100,
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', color: '#00f0ff', fontSize: '12px', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '6px' }}>
            ⚙️ CONFIGURAÇÕES DUEL LINKS 3D
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Qualidade 3D:</label>
              <select
                value={qualidade3D}
                onChange={(e) => setQualidade3D(e.target.value)}
                style={{ width: '100%', padding: '6px', background: '#0f172a', border: '1px solid #0284c7', color: '#fff', borderRadius: '6px' }}
              >
                <option value="Ultra Futurista">Ultra Futurista</option>
                <option value="Alta">Alta Performance</option>
                <option value="Economica">Econômica (Mobile)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Câmera 3D:</label>
              <select
                value={modoCamera}
                onChange={(e) => setModoCamera(e.target.value)}
                style={{ width: '100%', padding: '6px', background: '#0f172a', border: '1px solid #0284c7', color: '#fff', borderRadius: '6px' }}
              >
                <option value="Dinamica 3D">Dinâmica Frontal</option>
                <option value="Isometrica">Isométrica Duel Links</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Volume Vozes PT-BR: {volumeVozes}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeVozes}
                onChange={(e) => setVolumeVozes(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00f0ff' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 🌌 ÁREA CENTRAL */}
      <main style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <div ref={mount3DRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '14px 18px',
            boxSizing: 'border-box'
          }}
        >
          {/* Topo: Mundos + Placar LP + Atalho Rápido Yugi & Kaiba */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '8px 10px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                🌌 MUNDOS YU-GI-OH! ({MUNDOS[mundoAtual].nome})
              </span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {Object.keys(MUNDOS).map((k) => (
                  <button
                    key={k}
                    onClick={() => selecionarMundo(k)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: mundoAtual === k ? '1px solid #fff' : '1px solid rgba(0,240,255,0.35)',
                      background: mundoAtual === k ? '#0284c7' : 'rgba(2, 6, 23, 0.7)',
                      color: '#fff',
                      fontSize: '9.5px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    setPersonagemP1('yugi');
                    falarEmPortugues(PERSONAGENS.yugi.falaEntrada, 'yugi');
                  }}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '6px',
                    border: '1px solid #facc15',
                    background: personagemP1 === 'yugi' ? '#7e22ce' : 'rgba(2,6,23,0.75)',
                    color: '#fde047',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Yugi 3D
                </button>
                <button
                  onClick={() => {
                    setPersonagemP2('kaiba');
                    falarEmPortugues(PERSONAGENS.kaiba.falaEntrada, 'kaiba');
                  }}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '6px',
                    border: '1px solid #38bdf8',
                    background: personagemP2 === 'kaiba' ? '#1d4ed8' : 'rgba(2,6,23,0.75)',
                    color: '#e0f2fe',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🐉 Kaiba 3D
                </button>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid #38bdf8',
                borderRadius: '12px',
                padding: '8px 14px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(0,240,255,0.2)'
              }}
            >
              <span style={{ fontSize: '9.5px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>
                {dueloStatus} • Turno: {turnoAtual}
              </span>
              <div style={{ display: 'flex', gap: '16px', marginTop: '4px', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', color: '#22c55e' }}>
                  {PERSONAGENS[personagemP1].nome}: <strong>{lpJogador} LP</strong>
                </span>
                <span style={{ fontSize: '11px', color: '#ef4444' }}>
                  {PERSONAGENS[personagemP2].nome}: <strong>{lpOponente} LP</strong>
                </span>
              </div>
              <span style={{ fontSize: '9px', color: '#fde047', display: 'block', marginTop: '3px' }}>
                {efeitoCartaAtivo}
              </span>
            </div>
          </div>

          {/* Modal de Missões */}
          {activeTab === 'missoes' && (
            <div
              style={{
                alignSelf: 'center',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '2px solid #eab308',
                borderRadius: '16px',
                padding: '14px',
                width: '100%',
                maxWidth: '460px',
                pointerEvents: 'auto',
                boxShadow: '0 0 30px rgba(234, 179, 8, 0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ color: '#fde047', fontSize: '12px' }}>🏆 MISSÕES COM RECOMPENSA</strong>
                <button
                  onClick={() => setActiveTab('gate')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {missoes.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(2, 6, 23, 0.8)',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(250, 204, 21, 0.35)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>{m.titulo}</div>
                      <div style={{ fontSize: '9.5px', color: '#38bdf8' }}>
                        Progresso: {m.progresso}/{m.meta} • Prêmio: +{m.recompensaGems} 💎 / +{m.recompensaGold} 🪙
                      </div>
                    </div>
                    <button
                      disabled={!m.concluida || m.resgatada}
                      onClick={() => resgatarRecompensaMissao(m.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        cursor: m.concluida && !m.resgatada ? 'pointer' : 'not-allowed',
                        background: m.resgatada ? '#334155' : m.concluida ? '#22c55e' : '#1e293b',
                        color: m.resgatada ? '#94a3b8' : m.concluida ? '#020617' : '#64748b'
                      }}
                    >
                      {m.resgatada ? 'Resgatada' : m.concluida ? 'Resgatar' : 'Em andamento'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rodapé da Arena: Personagens + Fala + Ações */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '10px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid #00f0ff',
                borderRadius: '14px',
                padding: '10px 12px',
                maxWidth: '420px',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div style={{ fontSize: '10.5px', color: '#fde047', fontStyle: 'italic', marginBottom: '8px' }}>
                🎙️ {falaAtual}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px' }}>
                <div>
                  <label style={{ color: '#38bdf8', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
                    Personagem P1:
                  </label>
                  <select
                    value={personagemP1}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPersonagemP1(val);
                      falarEmPortugues(PERSONAGENS[val].falaEntrada, val);
                    }}
                    style={{ width: '100%', padding: '5px', background: '#020617', color: '#fff', border: '1px solid #00f0ff', borderRadius: '6px' }}
                  >
                    {Object.values(PERSONAGENS).map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ color: '#f472b6', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
                    {modoJogo === 'auto_ia' ? 'Oponente Máquina:' : 'Personagem P2:'}
                  </label>
                  <select
                    value={personagemP2}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPersonagemP2(val);
                      falarEmPortugues(PERSONAGENS[val].falaEntrada, val);
                    }}
                    style={{ width: '100%', padding: '5px', background: '#020617', color: '#fff', border: '1px solid #ec4899', borderRadius: '6px' }}
                  >
                    {Object.values(PERSONAGENS).map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={iniciarDuelo3D}
                style={{
                  padding: '8px 13px',
                  backgroundColor: '#00f0ff',
                  color: '#020617',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: '900',
                  fontSize: '11px',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(0,240,255,0.5)'
                }}
              >
                ⚡ Duelo
              </button>

              <button
                onClick={invocarCarta3D}
                style={{
                  padding: '8px 13px',
                  backgroundColor: '#a855f7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: '900',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                🌟 Invocar 3D
              </button>

              <button
                onClick={() => executarAtaque('P1')}
                style={{
                  padding: '8px 13px',
                  backgroundColor: '#22c55e',
                  color: '#020617',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: '900',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                ⚔️ Atacar ({PERSONAGENS[personagemP1].nome.split(' ')[0]})
              </button>

              {modoJogo === 'vs_1v1' && (
                <button
                  onClick={() => executarAtaque('P2')}
                  style={{
                    padding: '8px 13px',
                    backgroundColor: '#ec4899',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: '900',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  🔥 Atacar ({PERSONAGENS[personagemP2].nome.split(' ')[0]})
                </button>
              )}

              <button
                onClick={girarCartasVersoEmanuelART}
                style={{
                  padding: '8px 13px',
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  border: '1px solid #00f0ff',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                🃏 Verso Emanuel ART
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 🎮 BARRA INFERIOR */}
      <footer
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '4px',
          background: 'rgba(10, 15, 29, 0.96)',
          borderTop: '2px solid #00f0ff',
          padding: '6px 10px',
          zIndex: 50
        }}
      >
        {[
          { id: 'gate', icon: '🚪', label: 'Gate 3D' },
          { id: 'duelos', icon: '⚔️', label: 'Arena' },
          { id: 'missoes', icon: '🏆', label: 'Missões' },
          { id: 'loja', icon: '🛒', label: 'Loja' },
          { id: 'deck', icon: '🎴', label: 'Deck 3D' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'duelos') iniciarDuelo3D();
              if (tab.id === 'deck') girarCartasVersoEmanuelART();
              if (tab.id === 'loja' && gems >= 10) {
                setGems(g => g - 10);
                setGold(gd => gd + 100);
                falarEmPortugues('Pacote holográfico aberto na loja! Ganhei +100 de Ouro!', personagemP1);
              }
            }}
            style={{
              padding: '8px 4px',
              background: activeTab === tab.id ? 'rgba(0, 240, 255, 0.22)' : 'transparent',
              border: activeTab === tab.id ? '1px solid #00f0ff' : '1px solid transparent',
              color: activeTab === tab.id ? '#00f0ff' : '#94a3b8',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '10.5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}