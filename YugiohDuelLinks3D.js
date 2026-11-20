import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Componente: Yu-Gi-Oh! Duel Links Futurista 3D — Emanuel ART Edition
 * - Começa com partida ativa, deck de 30 cartas (24 no deck + 6 na mão) e ações prontas
 * - Seleção de Avatares 3D (Emanuel ART, Yami Yugi 3D, Seto Kaiba 3D, Robotoc 3D, Vegatocnyx 3D)
 * - Perfil do Jogador com Nome Personalizado
 * - Embaralhar Deck, Comprar Carta, Escolher/Invocar Carta da Mão e Atacar na Arena 3D
 * - Modos: 1 x Máquina, 1 x 1 e Máquina Automático (IA vs IA)
 * - Habilidades Únicas por Partida (Destino das Cartas, Explosão do Dragão Branco, Arquitetura Emanuel.OS, Protocolo Níquel-Azul, Overdrive Cyber-Neon)
 * - Inspeção 3D Detalhada da Carta (Frente Holográfica + Verso Oficial Emanuel ART)
 */

const PERSONAGENS = {
  emanuel: {
    id: 'emanuel',
    nome: 'Emanuel ART',
    titulo: 'Criador & Duelista Supremo',
    corPrincipal: 0x00f0ff,
    corSecundaria: 0xe2e8f0,
    corDetalhe: 0x0284c7,
    corHex: '#00f0ff',
    habilidade: {
      nome: 'Arquitetura Emanuel.OS',
      desc: 'Aumenta o ATK do monstro em campo em +800 e compra 1 carta.',
      tipo: 'buff_draw'
    },
    falaEntrada: 'Emanuel ART na arena! Sistema Emanuel.OS sincronizado para o duelo!',
    falaInvocar: 'Invocação holográfica Emanuel ART! Entre em campo com poder máximo!',
    falaAtaque: 'Ataque direto Emanuel ART! Impacto digital total!',
    falaVitoria: 'Vitória de Emanuel ART! Engenharia e estratégia impecáveis!'
  },
  yugi: {
    id: 'yugi',
    nome: 'Yami Yugi 3D',
    titulo: 'Rei dos Jogos do Milênio',
    corPrincipal: 0x7e22ce,
    corSecundaria: 0xfacc15,
    corDetalhe: 0x00f0ff,
    corHex: '#facc15',
    habilidade: {
      nome: 'Destino das Cartas',
      desc: 'Invoca o Mago Negro Supremo (2800 ATK) e restaura +600 LP.',
      tipo: 'yugi_miracle'
    },
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
    corHex: '#38bdf8',
    habilidade: {
      nome: 'Explosão do Dragão Branco',
      desc: 'Invoca o Dragão Branco de Olhos Azuis (3000 ATK) e causa 600 de dano direto.',
      tipo: 'kaiba_dragon'
    },
    falaEntrada: 'Patético! A tecnologia da KaibaCorp esmagará qualquer estratégia!',
    falaInvocar: 'Surgindo no campo com a potência máxima da KaibaCorp!',
    falaAtaque: 'Esmague-os sem piedade! Rajada Branca de Destruição!',
    falaVitoria: 'Hmph. Como esperado da superioridade da KaibaCorp.'
  },
  robotoc: {
    id: 'robotoc',
    nome: 'Robotoc 3D',
    titulo: 'Unidade Tática Níquel & Azul',
    corPrincipal: 0x0284c7,
    corSecundaria: 0xf8fafc,
    corDetalhe: 0x00f0ff,
    corHex: '#38bdf8',
    habilidade: {
      nome: 'Protocolo Níquel-Azul',
      desc: 'Blindagem tática: restaura +1000 LP e fortalece o campo em +500 ATK.',
      tipo: 'shield_boost'
    },
    falaEntrada: 'Unidade Robotoc 3D online. Probabilidade de vitória calculada em 99,9%.',
    falaInvocar: 'Unidade de combate 3D mobilizada na zona principal.',
    falaAtaque: 'Disparo de plasma ativado! Impacto confirmado no adversário.',
    falaVitoria: 'Missão cumprida. Oponente neutralizado com precisão Robotoc.'
  },
  vegatocnyx: {
    id: 'vegatocnyx',
    nome: 'Vegatocnyx 3D',
    titulo: 'Valkyrie Cyber-Neon',
    corPrincipal: 0xec4899,
    corSecundaria: 0xf8fafc,
    corDetalhe: 0x00f0ff,
    corHex: '#ec4899',
    habilidade: {
      nome: 'Overdrive Cyber-Neon',
      desc: 'Causa 800 de dano sônico ao oponente e compra 1 carta extra.',
      tipo: 'neon_burn'
    },
    falaEntrada: 'Vegatocnyx 3D em cena! Vamos iluminar essa arena com energia cyber-neon!',
    falaInvocar: 'Entrando em campo com brilho estelar Vegatocnyx 3D!',
    falaAtaque: 'Golpe estelar Vegatocnyx! Ninguém segura esse ritmo!',
    falaVitoria: 'Que espetáculo! Vegatocnyx 3D dominou completamente a arena!'
  }
};

const MUNDOS = {
  dm: {
    id: 'dm',
    nome: 'Duel Monsters (DM)',
    corFundo: 0x090d1e,
    corGrade1: 0xfacc15,
    corGrade2: 0x1e3a8a,
    corLuz: 0x38bdf8
  },
  gx: {
    id: 'gx',
    nome: 'GX Academy',
    corFundo: 0x071a14,
    corGrade1: 0xef4444,
    corGrade2: 0x10b981,
    corLuz: 0x4ade80
  },
  vrains: {
    id: 'vrains',
    nome: 'VRAINS Link',
    corFundo: 0x050b18,
    corGrade1: 0x00f0ff,
    corGrade2: 0xec4899,
    corLuz: 0x00f0ff
  },
  sevens: {
    id: 'sevens',
    nome: 'SEVENS Rush',
    corFundo: 0x140924,
    corGrade1: 0xf43f5e,
    corGrade2: 0x38bdf8,
    corLuz: 0xf43f5e
  },
  gorush: {
    id: 'gorush',
    nome: 'GO RUSH!! Galáxia',
    corFundo: 0x061021,
    corGrade1: 0x2dd4bf,
    corGrade2: 0x818cf8,
    corLuz: 0x2dd4bf
  }
};

const CATALOGO_CARTAS = [
  { nome: 'Dragão Branco Olhos Azuis', atk: 3000, def: 2500, nivel: 8, atributo: 'LUZ', tipo: 'Dragão', cor: '#38bdf8', aura: '#e0f2fe', efeito: 'Este dragão lendário é uma poderosa máquina de destruição.' },
  { nome: 'Mago Negro Supremo', atk: 2500, def: 2100, nivel: 7, atributo: 'TREVAS', tipo: 'Mago', cor: '#a855f7', aura: '#f3e8ff', efeito: 'O mago definitivo em termos de ataque e defesa.' },
  { nome: 'Pequena Maga Negra', atk: 2000, def: 1700, nivel: 6, atributo: 'TREVAS', tipo: 'Mago', cor: '#ec4899', aura: '#fbcfe8', efeito: 'Ganha +300 ATK para cada Mago no campo.' },
  { nome: 'Exodia, o Proibido', atk: 2800, def: 2800, nivel: 8, atributo: 'TREVAS', tipo: 'Mago', cor: '#facc15', aura: '#fef08a', efeito: 'Poder ancestral selado que liberta energia infinita na arena.' },
  { nome: 'Kuriboh Alado Neon', atk: 1400, def: 1200, nivel: 4, atributo: 'LUZ', tipo: 'Fada', cor: '#fde047', aura: '#38bdf8', efeito: 'Protege o duelista contra danos críticos.' },
  { nome: 'Sky Striker Ace - Raye', atk: 2200, def: 1800, nivel: 4, atributo: 'TREVAS', tipo: 'Guerreiro', cor: '#00f0ff', aura: '#0284c7', efeito: 'Armadura cibernética de alta velocidade Emanuel ART.' },
  { nome: 'Neos Elementar 3D', atk: 2500, def: 2000, nivel: 7, atributo: 'LUZ', tipo: 'Guerreiro', cor: '#f8fafc', aura: '#ef4444', efeito: 'Herói do espaço sideral com golpe solar.' },
  { nome: 'Decode Talker Cyber', atk: 2300, def: 1900, nivel: 6, atributo: 'TREVAS', tipo: 'Ciberso', cor: '#00f0ff', aura: '#ec4899', efeito: 'Conecta circuitos link para amplificar o ataque.' },
  { nome: 'Sevens Road Magician', atk: 2100, def: 1500, nivel: 7, atributo: 'TREVAS', tipo: 'Mago', cor: '#c084fc', aura: '#f43f5e', efeito: 'Invoca a estrada dos sete elementos.' },
  { nome: 'Dragão Negro Olhos Vermelhos', atk: 2400, def: 2000, nivel: 7, atributo: 'TREVAS', tipo: 'Dragão', cor: '#ef4444', aura: '#fca5a5', efeito: 'Dragão feroz com chamas negras devastadoras.' }
];

function embaralharArray(lista) {
  if (!Array.isArray(lista)) return [];
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function gerarDeck30Cartas() {
  const deck = [];
  for (let i = 0; i < 30; i++) {
    const base = CATALOGO_CARTAS[i % CATALOGO_CARTAS.length];
    deck.push({
      ...base,
      uid: `card-${i}-${Math.random().toString(36).slice(2, 7)}`
    });
  }
  return embaralharArray(deck);
}

function criarTexturaFrenteCarta(cartaInput) {
  const carta = cartaInput || CATALOGO_CARTAS[0];
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, '#090f24');
  grad.addColorStop(0.5, '#172554');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  ctx.strokeStyle = carta.cor || '#00f0ff';
  ctx.lineWidth = 18;
  ctx.strokeRect(14, 14, 484, 740);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 456, 712);

  ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
  ctx.fillRect(42, 42, 428, 56);
  ctx.strokeStyle = carta.cor || '#00f0ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 428, 56);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(String(carta.nome || 'Carta').slice(0, 23), 56, 78);

  ctx.beginPath();
  ctx.arc(440, 70, 20, 0, Math.PI * 2);
  ctx.fillStyle = carta.cor || '#00f0ff';
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(String(carta.atributo || 'LUZ').slice(0, 3), 440, 74);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('★'.repeat(Math.min(8, carta.nivel || 4)), 466, 122);

  const artGrad = ctx.createRadialGradient(256, 315, 20, 256, 315, 195);
  artGrad.addColorStop(0, '#ffffff');
  artGrad.addColorStop(0.28, carta.aura || '#e0f2fe');
  artGrad.addColorStop(0.68, carta.cor || '#38bdf8');
  artGrad.addColorStop(1, '#090d1e');
  ctx.fillStyle = artGrad;
  ctx.fillRect(46, 134, 420, 370);

  ctx.save();
  ctx.translate(256, 319);
  for (let r = 0; r < 3; r++) {
    ctx.rotate(Math.PI / 6);
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-95 + r * 14, -95 + r * 14, 190 - r * 28, 190 - r * 28);
  }
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.55)';
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(carta.tipo || 'MONSTRO').toUpperCase(), 0, 6);
  ctx.restore();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(46, 134, 420, 370);

  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
  ctx.fillRect(46, 520, 420, 196);
  ctx.strokeStyle = carta.cor || '#00f0ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(46, 520, 420, 196);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`[${carta.tipo || 'Efeito'} / Efeito 3D]`, 62, 548);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '15px Arial';
  const palavras = String(carta.efeito || '').split(' ');
  let linha = '';
  let y = 576;
  palavras.forEach((p) => {
    if ((linha + p).length > 42) {
      ctx.fillText(linha, 62, y);
      linha = p + ' ';
      y += 22;
    } else {
      linha += p + ' ';
    }
  });
  ctx.fillText(linha, 62, y);

  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.moveTo(62, 668);
  ctx.lineTo(450, 668);
  ctx.stroke();

  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`ATK/${carta.atk || 2000}   DEF/${carta.def || 1500}`, 450, 700);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('EMANUEL ART • 3D EDITION', 46, 738);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function criarTexturaVersoEmanuelART() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const bgGrad = ctx.createLinearGradient(0, 0, 512, 768);
  bgGrad.addColorStop(0, '#030b1c');
  bgGrad.addColorStop(0.5, '#0b2954');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 768);

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 16;
  ctx.strokeRect(18, 18, 476, 732);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 440, 696);

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.lineWidth = 3;
  for (let i = 1; i <= 5; i++) {
    const r = i * 44;
    ctx.beginPath();
    ctx.moveTo(256, 384 - r);
    ctx.lineTo(256 + r * 0.78, 384);
    ctx.lineTo(256, 384 + r);
    ctx.lineTo(256 - r * 0.78, 384);
    ctx.closePath();
    ctx.stroke();
  }

  const coreGrad = ctx.createRadialGradient(256, 384, 15, 256, 384, 145);
  coreGrad.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
  coreGrad.addColorStop(0.6, 'rgba(2, 132, 199, 0.45)');
  coreGrad.addColorStop(1, 'rgba(2, 6, 23, 0.9)');
  ctx.beginPath();
  ctx.arc(256, 384, 140, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#00f0ff';
  ctx.stroke();

  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 24;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EMANUEL', 256, 362);

  ctx.fillStyle = '#facc15';
  ctx.font = '900 40px Arial, sans-serif';
  ctx.fillText('ART', 256, 414);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('OFFICIAL DUEL LINKS 3D', 256, 690);

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
    metalness: 0.6,
    roughness: 0.22
  });
  const matArmadura = new THREE.MeshStandardMaterial({
    color: p.corSecundaria,
    metalness: 0.72,
    roughness: 0.18
  });
  const matNeon = new THREE.MeshStandardMaterial({
    color: p.corDetalhe,
    emissive: p.corDetalhe,
    emissiveIntensity: 2.4
  });

  const baseRing = new THREE.Mesh(
    new THREE.RingGeometry(0.48, 0.66, 32),
    new THREE.MeshBasicMaterial({ color: p.corDetalhe, side: THREE.DoubleSide })
  );
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = -0.35;
  group.add(baseRing);

  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.55, 12), matArmadura);
  legL.position.set(-0.18, -0.08, 0);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.55, 12), matArmadura);
  legR.position.set(0.18, -0.08, 0);
  group.add(legL, legR);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.82, 20), matCorpo);
  torso.position.y = 0.45;
  group.add(torso);

  const chestCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), matNeon);
  chestCore.position.set(0, 0.58, 0.32);
  group.add(chestCore);

  const headGroup = new THREE.Group();
  headGroup.position.y = 1.15;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), matArmadura);
  headGroup.add(head);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.13, 0.14), matNeon);
  visor.position.set(0, 0.02, 0.28);
  headGroup.add(visor);

  if (personagemId === 'yugi') {
    const spike1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.62, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    spike1.position.set(-0.24, 0.44, 0);
    spike1.rotation.z = 0.38;
    const spike2 = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.72, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    spike2.position.set(0, 0.54, 0);
    const spike3 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.62, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    spike3.position.set(0.24, 0.44, 0);
    spike3.rotation.z = -0.38;
    const puzzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.2, 4),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.92, roughness: 0.12 })
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
      new THREE.BoxGeometry(0.96, 0.78, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 })
    );
    coat.position.set(0, -0.72, -0.24);
    coat.rotation.x = 0.25;
    headGroup.add(hairL, hairR, coat);
  } else if (personagemId === 'vegatocnyx') {
    const ponytail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.75, 12), matNeon);
    ponytail.position.set(0, 0.28, -0.46);
    ponytail.rotation.x = -0.9;
    headGroup.add(ponytail);
  } else if (personagemId === 'emanuel') {
    const crown = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.04, 12, 24), matNeon);
    crown.rotation.x = Math.PI / 2;
    crown.position.y = 0.26;
    headGroup.add(crown);
  } else {
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.42, 12), matNeon);
    antenna.position.set(0, 0.5, 0);
    headGroup.add(antenna);
  }

  group.add(headGroup);

  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.65, 12), matArmadura);
  armL.position.set(-0.48, 0.48, 0.12);
  armL.rotation.z = 0.25;

  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.65, 12), matArmadura);
  armR.position.set(0.48, 0.48, 0.12);
  armR.rotation.z = -0.25;

  const duelDisk = new THREE.Mesh(
    new THREE.RingGeometry(0.18, 0.32, 16),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
  );
  duelDisk.position.set(-0.62, 0.36, 0.26);
  duelDisk.rotation.x = Math.PI / 2.4;
  group.add(armL, armR, duelDisk);

  return { group, headGroup, armL, armR, chestCore };
}

function AvatarPreview3D({ personagemId }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth || 170;
    const height = container.clientHeight || 165;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.7, 3.2);
    camera.lookAt(0, 0.55, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 2.2);
    const pt = new THREE.PointLight(0x00f0ff, 12, 20);
    pt.position.set(2, 3, 3);
    scene.add(amb, pt);

    const avatar = criarAvatar3DPersonagem(personagemId, 1.0);
    scene.add(avatar.group);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      avatar.group.rotation.y = t * 1.1;
      avatar.group.position.y = Math.sin(t * 2.5) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [personagemId]);

  return <div ref={mountRef} style={{ width: '100%', height: '165px' }} />;
}

function CartaDetalhadaModal3D({ carta, onClose }) {
  const mountRef = useRef(null);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const targetRotYRef = useRef(0);

  useEffect(() => {
    targetRotYRef.current = mostrarVerso ? Math.PI : 0;
  }, [mostrarVerso]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !carta) return;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 330;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.3);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 2.4);
    const pLight = new THREE.PointLight(0x00f0ff, 14, 25);
    pLight.position.set(2, 2, 4);
    scene.add(amb, pLight);

    const geo = new THREE.BoxGeometry(1.9, 2.8, 0.07);
    const frenteTex = criarTexturaFrenteCarta(carta);
    const versoTex = criarTexturaVersoEmanuelART();

    const frenteMat = new THREE.MeshStandardMaterial({ map: frenteTex, metalness: 0.45, roughness: 0.25 });
    const versoMat = new THREE.MeshStandardMaterial({ map: versoTex, metalness: 0.55, roughness: 0.25 });

    const mesh = new THREE.Mesh(geo, [versoMat, versoMat, versoMat, versoMat, frenteMat, versoMat]);
    scene.add(mesh);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mesh.rotation.y += (targetRotYRef.current - mesh.rotation.y) * 0.1;
      mesh.rotation.x = Math.sin(t * 1.5) * 0.08;
      mesh.position.y = Math.sin(t * 2.2) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      frenteTex.dispose();
      versoTex.dispose();
      renderer.dispose();
    };
  }, [carta]);

  if (!carta) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #0f172a, #020617)',
          border: '2px solid #00f0ff',
          borderRadius: '20px',
          padding: '18px',
          maxWidth: '430px',
          width: '100%',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.35)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '12px' }}>
            🔍 INSPEÇÃO HOLOGRÁFICA 3D
          </span>
          <button
            onClick={onClose}
            style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>

        <div ref={mountRef} style={{ width: '100%', height: '330px' }} />

        <div style={{ marginTop: '8px', marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>{carta.nome}</div>
          <div style={{ fontSize: '11px', color: '#fde047', marginTop: '2px' }}>
            {carta.atributo} • Nível {carta.nivel} • ATK {carta.atk} / DEF {carta.def}
          </div>
          <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '6px 0 0 0' }}>{carta.efeito}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => setMostrarVerso(false)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #00f0ff',
              background: !mostrarVerso ? '#00f0ff' : 'transparent',
              color: !mostrarVerso ? '#020617' : '#00f0ff',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            🖼️ Ver Frente da Carta
          </button>
          <button
            onClick={() => setMostrarVerso(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #facc15',
              background: mostrarVerso ? '#facc15' : 'transparent',
              color: mostrarVerso ? '#020617' : '#facc15',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            ✨ Ver Verso Emanuel ART
          </button>
        </div>
      </div>
    </div>
  );
}

export default function YugiohDuelLinks3D({ onClose }) {
  const [modalSelecaoAberto, setModalSelecaoAberto] = useState(false);
  const [nomeJogador, setNomeJogador] = useState('Emanuel ART');

  const [stage, setStage] = useState(2);
  const [gems, setGems] = useState(120);
  const [gold, setGold] = useState(500);
  const [activeTab, setActiveTab] = useState('gate');
  const [configOpen, setConfigOpen] = useState(false);

  const [personagemP1, setPersonagemP1] = useState('emanuel');
  const [personagemP2, setPersonagemP2] = useState('kaiba');
  const [mundoAtual, setMundoAtual] = useState('dm');

  const [modoJogo, setModoJogo] = useState('1v_maquina');
  const [turnoAtual, setTurnoAtual] = useState('P1');
  const [lpJogador, setLpJogador] = useState(4000);
  const [lpOponente, setLpOponente] = useState(4000);
  const [dueloStatus, setDueloStatus] = useState('Duelo Ativo • Deck: 30 Cartas (6 na mão)');
  const [falaAtual, setFalaAtual] = useState('Emanuel ART: "Emanuel ART na arena! Sistema Emanuel.OS sincronizado para o duelo!"');
  const [habilidadeUsada, setHabilidadeUsada] = useState(false);

  const [maoP1, setMaoP1] = useState(() => gerarDeck30Cartas().slice(0, 6));
  const [deckP1, setDeckP1] = useState(() => gerarDeck30Cartas().slice(6));
  const [cartaCampoP1, setCartaCampoP1] = useState(() => CATALOGO_CARTAS[0]);
  const [cartaCampoP2, setCartaCampoP2] = useState(() => CATALOGO_CARTAS[1]);
  const [cartaInspecionada, setCartaInspecionada] = useState(null);

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
  const attackAnimRef = useRef(0);
  const flipAnimRef = useRef(0);
  const summonAnimRef = useRef(0);

  const falarEmPortugues = (texto, personagemKey = personagemP1) => {
    const p = PERSONAGENS[personagemKey] || PERSONAGENS.emanuel;
    const prefixo = personagemKey === personagemP1 ? `${nomeJogador || p.nome}` : p.nome;
    setFalaAtual(`${prefixo}: "${texto}"`);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && volumeVozes > 0) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.volume = Math.min(1, Math.max(0, volumeVozes / 100));
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const iniciarNovaPartida30 = () => {
    const novoDeck = gerarDeck30Cartas();
    const maoInicial = novoDeck.slice(0, 6);
    const restante = novoDeck.slice(6);

    setMaoP1(maoInicial);
    setDeckP1(restante);
    setCartaCampoP1(maoInicial[0] || CATALOGO_CARTAS[0]);
    setCartaCampoP2(CATALOGO_CARTAS[personagemP2 === 'kaiba' ? 0 : 1]);
    setLpJogador(4000);
    setLpOponente(4000);
    setTurnoAtual('P1');
    setHabilidadeUsada(false);
    setModalSelecaoAberto(false);
    summonAnimRef.current = 1.0;
    flipAnimRef.current = 1.0;

    setDueloStatus('⚡ Nova Partida Iniciada! Deck: 30 Cartas (6 na mão)');
    falarEmPortugues(PERSONAGENS[personagemP1].falaEntrada, personagemP1);
  };

  const embaralharCartas = () => {
    const deckEmbaralhado = embaralharArray(deckP1);
    const maoEmbaralhada = embaralharArray(maoP1);
    setDeckP1(deckEmbaralhado);
    setMaoP1(maoEmbaralhada);
    flipAnimRef.current = 1.0;
    setDueloStatus(`🔀 Deck (${deckEmbaralhado.length} cartas) e Mão (${maoEmbaralhada.length} cartas) embaralhados!`);
    falarEmPortugues('Cartas embaralhadas com sucesso na arena!', personagemP1);
  };

  const comprarCartaDoDeck = () => {
    if (deckP1.length === 0) {
      setDueloStatus('⚠️ O baralho de 30 cartas acabou! Clique em Novo Deck 30.');
      return;
    }
    const [novaCarta, ...resto] = deckP1;
    setDeckP1(resto);
    setMaoP1((prev) => [...prev, novaCarta]);
    flipAnimRef.current = 0.6;
    setDueloStatus(`🎴 ${nomeJogador} comprou "${novaCarta.nome}"! (${resto.length} no deck)`);
  };

  const escolherEInvocarCarta = (carta) => {
    if (!carta) return;
    setCartaCampoP1(carta);
    setMaoP1((prev) => prev.filter((c) => c.uid !== carta.uid));
    summonAnimRef.current = 1.0;
    flipAnimRef.current = 0.8;
    setDueloStatus(`🌟 ${nomeJogador} invocou "${carta.nome}" (ATK ${carta.atk}) na Arena 3D!`);
    falarEmPortugues(PERSONAGENS[personagemP1].falaInvocar, personagemP1);
  };

  const usarHabilidadeDaPartida = () => {
    if (habilidadeUsada) {
      setDueloStatus('⚠️ Habilidade desta partida já foi ativada!');
      return;
    }
    const hab = PERSONAGENS[personagemP1].habilidade;
    setHabilidadeUsada(true);
    summonAnimRef.current = 1.0;
    flipAnimRef.current = 0.8;

    if (hab.tipo === 'buff_draw') {
      setCartaCampoP1((prev) => ({ ...(prev || CATALOGO_CARTAS[0]), atk: (prev?.atk || 2500) + 800 }));
      comprarCartaDoDeck();
    } else if (hab.tipo === 'yugi_miracle') {
      setCartaCampoP1({ ...CATALOGO_CARTAS[1], atk: 2800, uid: 'yugi-skill' });
      setLpJogador((lp) => lp + 600);
    } else if (hab.tipo === 'kaiba_dragon') {
      setCartaCampoP1({ ...CATALOGO_CARTAS[0], atk: 3000, uid: 'kaiba-skill' });
      setLpOponente((lp) => Math.max(0, lp - 600));
    } else if (hab.tipo === 'shield_boost') {
      setLpJogador((lp) => lp + 1000);
      setCartaCampoP1((prev) => ({ ...(prev || CATALOGO_CARTAS[0]), atk: (prev?.atk || 2500) + 500 }));
    } else if (hab.tipo === 'neon_burn') {
      setLpOponente((lp) => Math.max(0, lp - 800));
      comprarCartaDoDeck();
    }

    setDueloStatus(`⚡ Habilidade Ativada: ${hab.nome}!`);
    falarEmPortugues(`Ativando habilidade ${hab.nome}!`, personagemP1);
  };

  const incrementarMissao = (idMissao, qtd = 1) => {
    setMissoes((prev) =>
      prev.map((m) => {
        if (m.id !== idMissao || m.resgatada) return m;
        const novoProg = Math.min(m.meta, m.progresso + qtd);
        return { ...m, progresso: novoProg, concluida: novoProg >= m.meta };
      })
    );
  };

  const resgatarRecompensaMissao = (idMissao) => {
    setMissoes((prev) =>
      prev.map((m) => {
        if (m.id === idMissao && m.concluida && !m.resgatada) {
          setGems((g) => g + m.recompensaGems);
          setGold((gd) => gd + m.recompensaGold);
          setStage((s) => s + 1);
          falarEmPortugues(`Recompensa resgatada! +${m.recompensaGems} Gemas e +${m.recompensaGold} Ouro!`, personagemP1);
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
    falarEmPortugues(`Entrando no mundo de ${infoMundo.nome}!`, personagemP1);
  };

  const executarAtaque = (atacante = 'P1') => {
    attackAnimRef.current = 1.0;
    flipAnimRef.current = 0.75;

    if (atacante === 'P1') {
      const dano = Math.max(800, Math.round((cartaCampoP1?.atk || 2500) * 0.45));
      setLpOponente((prev) => {
        const novoLp = Math.max(0, prev - dano);
        if (novoLp === 0) {
          incrementarMissao(3, 1);
          setDueloStatus(`🏆 Vitória de ${nomeJogador} (${PERSONAGENS[personagemP1].nome})!`);
          falarEmPortugues(PERSONAGENS[personagemP1].falaVitoria, personagemP1);
        } else {
          setDueloStatus(`⚔️ ${cartaCampoP1?.nome || 'Monstro'} causou ${dano} de dano!`);
          falarEmPortugues(PERSONAGENS[personagemP1].falaAtaque, personagemP1);
        }
        return novoLp;
      });
      incrementarMissao(1, 1);

      if (modoJogo === '1v_maquina' || modoJogo === 'auto_maquina') {
        setTimeout(() => {
          setTurnoAtual('P2');
          const danoIa = Math.max(700, Math.round((cartaCampoP2?.atk || 2200) * 0.4));
          attackAnimRef.current = 0.85;
          setLpJogador((prev) => Math.max(0, prev - danoIa));
          setDueloStatus(`🤖 ${PERSONAGENS[personagemP2].nome} atacou (${danoIa} dano)!`);
          falarEmPortugues(PERSONAGENS[personagemP2].falaAtaque, personagemP2);
          setTimeout(() => {
            setTurnoAtual('P1');
          }, 1000);
        }, 1200);
      } else {
        setTurnoAtual('P2');
      }
    } else {
      const dano = Math.max(800, Math.round((cartaCampoP2?.atk || 2300) * 0.45));
      setLpJogador((prev) => {
        const novoLp = Math.max(0, prev - dano);
        if (novoLp === 0) {
          setDueloStatus(`🏆 Vitória de ${PERSONAGENS[personagemP2].nome}!`);
          falarEmPortugues(PERSONAGENS[personagemP2].falaVitoria, personagemP2);
        } else {
          setDueloStatus(`🔥 ${PERSONAGENS[personagemP2].nome} causou ${dano} de dano!`);
          falarEmPortugues(PERSONAGENS[personagemP2].falaAtaque, personagemP2);
        }
        return novoLp;
      });
      setTurnoAtual('P1');
    }
  };

  useEffect(() => {
    if (modoJogo !== 'auto_maquina' || modalSelecaoAberto) return;
    if (lpJogador <= 0 || lpOponente <= 0) return;

    const timer = setInterval(() => {
      executarAtaque('P1');
    }, 3400);

    return () => clearInterval(timer);
  }, [modoJogo, modalSelecaoAberto, lpJogador, lpOponente, cartaCampoP1, cartaCampoP2]);

  useEffect(() => {
    const container = mount3DRef.current;
    if (!container) return;

    const width = Math.max(300, container.clientWidth || window.innerWidth);
    const height = Math.max(240, container.clientHeight || window.innerHeight - 110);
    const mundo = MUNDOS[mundoAtual] || MUNDOS.dm;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(mundo.corFundo);
    scene.fog = new THREE.FogExp2(mundo.corFundo, 0.018);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    if (modoCamera === 'Isometrica') {
      camera.position.set(6.2, 6.2, 8.2);
    } else {
      camera.position.set(0, 4.1, 8.6);
    }
    camera.lookAt(0, 0.45, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: qualidade3D !== 'Economica'
    });
    renderer.setClearColor(mundo.corFundo, 1);
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      qualidade3D === 'Ultra Futurista' ? Math.min(window.devicePixelRatio || 1, 2) : 1
    );

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

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

    const p1Obj = criarAvatar3DPersonagem(personagemP1, 1.05);
    p1Obj.group.position.set(-3.6, 0.25, 1.4);
    p1Obj.group.rotation.y = 0.65;
    scene.add(p1Obj.group);
    avatarP1Ref.current = p1Obj;

    const p2Obj = criarAvatar3DPersonagem(personagemP2, 1.05);
    p2Obj.group.position.set(3.6, 0.25, -1.2);
    p2Obj.group.rotation.y = -2.35;
    scene.add(p2Obj.group);
    avatarP2Ref.current = p2Obj;

    const cartasGroup = new THREE.Group();
    const cardGeo = new THREE.BoxGeometry(1.42, 2.08, 0.06);
    const versoTex = criarTexturaVersoEmanuelART();
    const versoMat = new THREE.MeshStandardMaterial({
      map: versoTex,
      metalness: 0.65,
      roughness: 0.22,
      emissive: 0x0284c7,
      emissiveIntensity: 0.28
    });

    const frenteTex1 = criarTexturaFrenteCarta(cartaCampoP1 || CATALOGO_CARTAS[0]);
    const frenteMat1 = new THREE.MeshStandardMaterial({
      map: frenteTex1,
      metalness: 0.55,
      roughness: 0.2
    });
    const cardMesh1 = new THREE.Mesh(cardGeo, [versoMat, versoMat, versoMat, versoMat, frenteMat1, versoMat]);
    cardMesh1.position.set(-1.35, 0.95, 0.5);
    cardMesh1.rotation.y = 0.25;

    const frenteTex2 = criarTexturaFrenteCarta(cartaCampoP2 || CATALOGO_CARTAS[1]);
    const frenteMat2 = new THREE.MeshStandardMaterial({
      map: frenteTex2,
      metalness: 0.55,
      roughness: 0.2
    });
    const cardMesh2 = new THREE.Mesh(cardGeo, [versoMat, versoMat, versoMat, versoMat, frenteMat2, versoMat]);
    cardMesh2.position.set(1.35, 0.95, -0.5);
    cardMesh2.rotation.y = -0.25;

    const auraGeo = new THREE.TorusGeometry(1.05, 0.025, 12, 48);
    const auraMat = new THREE.MeshBasicMaterial({ color: mundo.corLuz });
    const aura1 = new THREE.Mesh(auraGeo, auraMat);
    aura1.rotation.x = Math.PI / 2.6;

    const aura2 = new THREE.Mesh(auraGeo, auraMat);
    aura2.rotation.x = Math.PI / 2.6;

    const particleCount = 54;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const ang = (i / particleCount) * Math.PI * 2;
      const rad = 1.6 + (i % 4) * 0.48;
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

      if (attackAnimRef.current > 0) attackAnimRef.current = Math.max(0, attackAnimRef.current - 0.025);
      if (flipAnimRef.current > 0) flipAnimRef.current = Math.max(0, flipAnimRef.current - 0.02);
      if (summonAnimRef.current > 0) summonAnimRef.current = Math.max(0, summonAnimRef.current - 0.02);

      const atkPulse = Math.sin(attackAnimRef.current * Math.PI);
      const summonLift = Math.sin(summonAnimRef.current * Math.PI) * 0.85;
      const giroExtra = flipAnimRef.current * Math.PI * 2;

      cardMesh1.position.y = 0.95 + Math.sin(t * 2.5) * 0.14 + atkPulse * 0.5 + summonLift;
      cardMesh1.position.z = 0.5 + atkPulse * 1.35;
      cardMesh1.rotation.y = 0.25 + Math.sin(t * 1.6) * 0.22 + giroExtra;

      cardMesh2.position.y = 0.95 + Math.cos(t * 2.5) * 0.14;
      cardMesh2.rotation.y = -0.25 + Math.cos(t * 1.6) * 0.22 - giroExtra * 0.5;

      aura1.position.copy(cardMesh1.position);
      aura1.rotation.z = t * 1.8;
      aura2.position.copy(cardMesh2.position);
      aura2.rotation.z = -t * 1.8;

      particles.rotation.y = t * 0.45;

      if (avatarP1Ref.current) {
        avatarP1Ref.current.group.position.y = 0.25 + Math.abs(Math.sin(t * 3.2)) * 0.12;
        avatarP1Ref.current.group.position.x = -3.6 + Math.sin(t * 1.1) * 0.25 + atkPulse * 0.6;
        avatarP1Ref.current.headGroup.rotation.y = Math.sin(t * 2) * 0.25;
        avatarP1Ref.current.armR.rotation.x = -0.45 - atkPulse * 1.3 - summonLift * 0.5;
      }

      if (avatarP2Ref.current) {
        avatarP2Ref.current.group.position.y = 0.25 + Math.abs(Math.cos(t * 3.2)) * 0.12;
        avatarP2Ref.current.group.position.x = 3.6 + Math.cos(t * 1.1) * 0.25;
        avatarP2Ref.current.headGroup.rotation.y = Math.cos(t * 2) * 0.25;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount3DRef.current) return;
      const w = Math.max(300, mount3DRef.current.clientWidth || window.innerWidth);
      const h = Math.max(240, mount3DRef.current.clientHeight || window.innerHeight - 110);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      versoTex.dispose();
      frenteTex1.dispose();
      frenteTex2.dispose();
      renderer.dispose();
    };
  }, [personagemP1, personagemP2, mundoAtual, modoCamera, qualidade3D, cartaCampoP1, cartaCampoP2]);

  const totalCartasRestantes = deckP1.length + maoP1.length;

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
      {/* Modal de Seleção de Avatar 3D, Nome do Duelista & Habilidade da Partida */}
      {modalSelecaoAberto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.92)',
            backdropFilter: 'blur(12px)',
            zIndex: 180,
            overflowY: 'auto',
            padding: '18px'
          }}
        >
          <div
            style={{
              maxWidth: '980px',
              margin: '0 auto',
              background: 'linear-gradient(155deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))',
              border: '2px solid #00f0ff',
              borderRadius: '20px',
              padding: '18px',
              boxShadow: '0 0 40px rgba(0,240,255,0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#00f0ff', fontWeight: 'bold' }}>EMANUEL ART • SELEÇÃO DE AVATARES 3D</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '17px' }}>Perfil do Duelista, Modo & Habilidade da Partida</h3>
              </div>
              <button
                onClick={() => setModalSelecaoAberto(false)}
                style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕ Voltar à Arena
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', marginBottom: '4px' }}>
                  👤 Nome do Duelista:
                </label>
                <input
                  type="text"
                  value={nomeJogador}
                  onChange={(e) => setNomeJogador(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #00f0ff', background: '#020617', color: '#fff', fontWeight: 'bold', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#facc15', fontWeight: 'bold', marginBottom: '4px' }}>
                  🎮 Modo de Jogo:
                </label>
                <select
                  value={modoJogo}
                  onChange={(e) => setModoJogo(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #facc15', background: '#020617', color: '#fff', fontWeight: 'bold' }}
                >
                  <option value="1v_maquina">🎮 1 x Máquina</option>
                  <option value="1v1">⚔️ 1 x 1 Local</option>
                  <option value="auto_maquina">🤖 Máquina Automático (IA vs IA)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#f472b6', fontWeight: 'bold', marginBottom: '4px' }}>
                  🆚 Oponente 3D:
                </label>
                <select
                  value={personagemP2}
                  onChange={(e) => setPersonagemP2(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ec4899', background: '#020617', color: '#fff', fontWeight: 'bold' }}
                >
                  {Object.values(PERSONAGENS).map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: '10px', marginTop: '14px' }}>
              {Object.values(PERSONAGENS).map((p) => {
                const ativo = personagemP1 === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPersonagemP1(p.id)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '14px',
                      padding: '8px',
                      background: ativo ? 'rgba(2, 132, 199, 0.35)' : 'rgba(2, 6, 23, 0.75)',
                      border: ativo ? `2px solid ${p.corHex}` : '1px solid rgba(148,163,184,0.25)',
                      textAlign: 'center'
                    }}
                  >
                    <AvatarPreview3D personagemId={p.id} />
                    <div style={{ fontWeight: '900', fontSize: '13px', color: p.corHex }}>{p.nome}</div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8', marginBottom: '5px' }}>{p.titulo}</div>
                    <div style={{ fontSize: '9px', color: '#fde047', background: 'rgba(15,23,42,0.9)', padding: '5px', borderRadius: '8px' }}>
                      ⚡ <strong>{p.habilidade.nome}</strong>
                      <div style={{ color: '#cbd5e1', marginTop: '2px' }}>{p.habilidade.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={iniciarNovaPartida30}
                style={{
                  padding: '11px 22px',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'linear-gradient(90deg, #00f0ff, #0284c7)',
                  color: '#020617',
                  fontWeight: '900',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🚀 Iniciar Partida com Deck de 30 Cartas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inspeção 3D Frente / Verso Emanuel ART */}
      <CartaDetalhadaModal3D
        carta={cartaInspecionada}
        onClose={() => setCartaInspecionada(null)}
      />

      {/* 🚀 BARRA SUPERIOR */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(10, 15, 29, 0.9)',
          borderBottom: '2px solid #00f0ff',
          backdropFilter: 'blur(12px)',
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalSelecaoAberto(true)}
            style={{
              background: 'rgba(2, 132, 199, 0.35)',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '5px 10px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '10.5px',
              cursor: 'pointer'
            }}
          >
            🎭 Avatares 3D & Modo
          </button>

          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7, #00f0ff)',
              padding: '4px 10px',
              borderRadius: '16px',
              fontWeight: '900',
              fontSize: '10.5px',
              color: '#020617'
            }}
          >
            STAGE {stage} • {nomeJogador || PERSONAGENS[personagemP1].nome}
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(2, 6, 23, 0.8)', padding: '3px', borderRadius: '10px', border: '1px solid #0284c7' }}>
            {[
              { id: '1v_maquina', label: '🎮 1xMáquina' },
              { id: '1v1', label: '⚔️ 1x1' },
              { id: 'auto_maquina', label: '🤖 Auto IA' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModoJogo(m.id)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  background: modoJogo === m.id ? '#00f0ff' : 'transparent',
                  color: modoJogo === m.id ? '#020617' : '#94a3b8'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(0,0,0,0.45)', padding: '4px 9px', borderRadius: '10px', border: '1px solid #00f0ff', fontSize: '11px' }}>
            🃏 Deck: <strong style={{ color: '#00f0ff' }}>{deckP1.length}</strong> ({totalCartasRestantes}/30)
          </div>
          <div style={{ background: 'rgba(0,0,0,0.45)', padding: '4px 9px', borderRadius: '10px', border: '1px solid #eab308', fontSize: '11px', color: '#fde047' }}>
            🪙 <strong>{gold}</strong>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.45)', padding: '4px 9px', borderRadius: '10px', border: '1px solid #a855f7', fontSize: '11px', color: '#c084fc' }}>
            💎 <strong>{gems}</strong>
          </div>
          <button
            onClick={() => setConfigOpen(!configOpen)}
            style={{ background: 'none', border: '1px solid #00f0ff', color: '#00f0ff', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}
          >
            ⚙️
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* ⚙️ PAINEL DE CONFIGURAÇÕES */}
      {configOpen && (
        <div
          style={{
            position: 'absolute',
            top: '58px',
            right: '16px',
            width: '280px',
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            border: '2px solid #00f0ff',
            borderRadius: '16px',
            padding: '14px',
            zIndex: 100
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#00f0ff', fontSize: '12px' }}>⚙️ CONFIGURAÇÕES 3D</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
            <div>
              <label style={{ color: '#94a3b8', display: 'block' }}>Qualidade Gráfica:</label>
              <select
                value={qualidade3D}
                onChange={(e) => setQualidade3D(e.target.value)}
                style={{ width: '100%', padding: '5px', background: '#0f172a', border: '1px solid #0284c7', color: '#fff', borderRadius: '6px' }}
              >
                <option value="Ultra Futurista">Ultra Futurista</option>
                <option value="Alta">Alta Performance</option>
                <option value="Economica">Econômica (Mobile)</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', display: 'block' }}>Câmera Arena:</label>
              <select
                value={modoCamera}
                onChange={(e) => setModoCamera(e.target.value)}
                style={{ width: '100%', padding: '5px', background: '#0f172a', border: '1px solid #0284c7', color: '#fff', borderRadius: '6px' }}
              >
                <option value="Dinamica 3D">Dinâmica Frontal</option>
                <option value="Isometrica">Isométrica Duel Links</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', display: 'block' }}>Vozes PT-BR: {volumeVozes}%</label>
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

      {/* 🌌 ARENA 3D PRINCIPAL */}
      <main style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', minHeight: '280px' }}>
        <div ref={mount3DRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }} />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px 14px',
            boxSizing: 'border-box'
          }}
        >
          {/* Topo HUD: Mundos + Placar LP */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '6px 9px', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                🌌 MUNDOS ({MUNDOS[mundoAtual].nome})
              </span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {Object.keys(MUNDOS).map((k) => (
                  <button
                    key={k}
                    onClick={() => selecionarMundo(k)}
                    style={{
                      padding: '3px 7px',
                      borderRadius: '6px',
                      border: mundoAtual === k ? '1px solid #fff' : '1px solid rgba(0,240,255,0.35)',
                      background: mundoAtual === k ? '#0284c7' : 'rgba(2, 6, 23, 0.7)',
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid #38bdf8',
                borderRadius: '12px',
                padding: '7px 14px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(0,240,255,0.2)'
              }}
            >
              <span style={{ fontSize: '9.5px', color: '#00f0ff', fontWeight: 'bold', display: 'block' }}>
                {dueloStatus} • Turno: {turnoAtual}
              </span>
              <div style={{ display: 'flex', gap: '16px', marginTop: '3px', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', color: '#22c55e' }}>
                  {nomeJogador || PERSONAGENS[personagemP1].nome} ({PERSONAGENS[personagemP1].nome}): <strong>{lpJogador} LP</strong>
                </span>
                <span style={{ fontSize: '11px', color: '#ef4444' }}>
                  {PERSONAGENS[personagemP2].nome}: <strong>{lpOponente} LP</strong>
                </span>
              </div>
              <div style={{ fontSize: '9px', color: '#fde047', marginTop: '2px' }}>
                Campo P1: {cartaCampoP1?.nome} (ATK {cartaCampoP1?.atk})
              </div>
            </div>
          </div>

          {/* Modal de Missões */}
          {activeTab === 'missoes' && (
            <div
              style={{
                alignSelf: 'center',
                background: 'rgba(15, 23, 42, 0.96)',
                border: '2px solid #eab308',
                borderRadius: '16px',
                padding: '12px',
                width: '100%',
                maxWidth: '450px',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ color: '#fde047', fontSize: '12px' }}>🏆 MISSÕES COM RECOMPENSA</strong>
                <button onClick={() => setActiveTab('gate')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {missoes.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.85)', padding: '7px 10px', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{m.titulo}</div>
                      <div style={{ fontSize: '9.5px', color: '#38bdf8' }}>
                        {m.progresso}/{m.meta} • +{m.recompensaGems} 💎 / +{m.recompensaGold} 🪙
                      </div>
                    </div>
                    <button
                      disabled={!m.concluida || m.resgatada}
                      onClick={() => resgatarRecompensaMissao(m.id)}
                      style={{
                        padding: '5px 9px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        background: m.resgatada ? '#334155' : m.concluida ? '#22c55e' : '#1e293b',
                        color: m.concluida && !m.resgatada ? '#020617' : '#94a3b8',
                        cursor: m.concluida && !m.resgatada ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {m.resgatada ? 'Resgatada' : m.concluida ? 'Resgatar' : 'Em progresso'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Área Inferior: Mão de Cartas Clicáveis + Fala + Botões de Ação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'auto' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                padding: '6px 8px',
                background: 'rgba(2, 6, 23, 0.82)',
                borderRadius: '14px',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {maoP1.map((carta) => (
                <div
                  key={carta.uid}
                  style={{
                    minWidth: '136px',
                    background: 'linear-gradient(160deg, #0f172a, #1e293b)',
                    border: `1.5px solid ${carta.cor}`,
                    borderRadius: '10px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '4px'
                  }}
                >
                  <div
                    onClick={() => setCartaInspecionada(carta)}
                    style={{ cursor: 'pointer' }}
                    title="Clique para inspecionar a arte 3D (Frente & Verso Emanuel ART)"
                  >
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {carta.nome}
                    </div>
                    <div style={{ fontSize: '9px', color: '#00f0ff', fontFamily: 'monospace' }}>
                      ATK {carta.atk} / DEF {carta.def}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                    <button
                      onClick={() => escolherEInvocarCarta(carta)}
                      style={{
                        flex: 1,
                        padding: '4px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#a855f7',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🌟 Escolher
                    </button>
                    <button
                      onClick={() => setCartaInspecionada(carta)}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '6px',
                        border: '1px solid #00f0ff',
                        background: 'transparent',
                        color: '#00f0ff',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🔍 3D
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #00f0ff',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '10.5px',
                  color: '#fde047',
                  fontStyle: 'italic',
                  maxWidth: '420px'
                }}
              >
                🎙️ {falaAtual}
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={usarHabilidadeDaPartida}
                  disabled={habilidadeUsada}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: habilidadeUsada ? '#334155' : '#facc15',
                    color: habilidadeUsada ? '#94a3b8' : '#020617',
                    border: 'none',
                    borderRadius: '20px',
                    fontWeight: '900',
                    fontSize: '10.5px',
                    cursor: habilidadeUsada ? 'not-allowed' : 'pointer'
                  }}
                >
                  ⚡ {PERSONAGENS[personagemP1].habilidade.nome}
                </button>

                <button
                  onClick={embaralharCartas}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    border: '1px solid #00f0ff',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '10.5px',
                    cursor: 'pointer'
                  }}
                >
                  🔀 Embaralhar
                </button>

                <button
                  onClick={comprarCartaDoDeck}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    border: '1px solid #00f0ff',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '10.5px',
                    cursor: 'pointer'
                  }}
                >
                  🎴 Comprar
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
                  ⚔️ Atacar
                </button>

                {modoJogo === '1v1' && (
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
                    🔥 Atacar P2
                  </button>
                )}

                <button
                  onClick={() => setCartaInspecionada(cartaCampoP1)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#0f172a',
                    color: '#00f0ff',
                    border: '1px solid #00f0ff',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '10.5px',
                    cursor: 'pointer'
                  }}
                >
                  🃏 Frente & Verso Emanuel ART
                </button>
              </div>
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
          padding: '5px 10px',
          zIndex: 50
        }}
      >
        {[
          { id: 'gate', icon: '🎭', label: 'Avatares 3D' },
          { id: 'duelos', icon: '🔄', label: 'Novo Deck 30' },
          { id: 'missoes', icon: '🏆', label: 'Missões' },
          { id: 'loja', icon: '🛒', label: 'Loja' },
          { id: 'deck', icon: '🃏', label: 'Ver Carta 3D' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'gate') setModalSelecaoAberto(true);
              if (tab.id === 'duelos') iniciarNovaPartida30();
              if (tab.id === 'deck') setCartaInspecionada(cartaCampoP1);
              if (tab.id === 'loja' && gems >= 10) {
                setGems((g) => g - 10);
                setGold((gd) => gd + 100);
                falarEmPortugues('Pacote holográfico Emanuel ART aberto! +100 Ouro!', personagemP1);
              }
            }}
            style={{
              padding: '6px 4px',
              background: activeTab === tab.id ? 'rgba(0, 240, 255, 0.22)' : 'transparent',
              border: activeTab === tab.id ? '1px solid #00f0ff' : '1px solid transparent',
              color: activeTab === tab.id ? '#00f0ff' : '#94a3b8',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '10px',
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