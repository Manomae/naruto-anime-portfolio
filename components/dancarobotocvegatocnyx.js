import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function extrairIdYouTube(url) {
  if (!url) return null;
  const trimmed = url.trim();
  const match =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/) ||
    trimmed.match(/^([a-zA-Z0-9_-]{11})$/);
  return match ? match[1] : null;
}

function extrairIdPlaylistYouTube(url) {
  if (!url) return null;
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function criarRobotocGuitarrista3D() {
  const root = new THREE.Group();

  const whiteArmor = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.15,
    clearcoat: 1.0
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.2,
    metalness: 0.92
  });
  const blueMetal = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.25,
    metalness: 0.8
  });
  const cyanLed = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 3.4
  });
  const darkVisor = new THREE.MeshPhysicalMaterial({
    color: 0x020617,
    roughness: 0.08,
    clearcoat: 1.0
  });

  // Cabeça
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), whiteArmor);
  head.scale.set(1.08, 0.94, 0.96);
  headGroup.add(head);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.16), blueMetal);
  visorFrame.position.set(0, -0.02, 0.41);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.26, 0.17), darkVisor);
  visorScreen.position.set(0, -0.02, 0.415);
  headGroup.add(visorScreen);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), cyanLed);
  eyeL.scale.set(1.15, 0.9, 0.35);
  eyeL.position.set(-0.16, -0.02, 0.50);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), cyanLed);
  eyeR.scale.set(1.15, 0.9, 0.35);
  eyeR.position.set(0.16, -0.02, 0.50);
  headGroup.add(eyeL, eyeR);

  // Fone de ouvido azul/ciano
  [-1, 1].forEach((side) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24), blueMetal);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(side * 0.55, 0.02, 0);

    const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.022, 12, 24), cyanLed);
    glowRing.rotation.y = Math.PI / 2;
    glowRing.position.set(side * 0.60, 0.02, 0);

    headGroup.add(cup, glowRing);
  });

  const headband = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.032, 12, 36, Math.PI), chrome);
  headband.position.set(0, 0.02, 0);
  headGroup.add(headband);

  // Microfone no fone do Robotoc
  const micBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.34, 12), chrome);
  micBoom.position.set(0.52, -0.14, 0.24);
  micBoom.rotation.x = Math.PI / 2.6;
  micBoom.rotation.z = -0.35;

  const micTip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), cyanLed);
  micTip.position.set(0.42, -0.22, 0.38);
  headGroup.add(micBoom, micTip);

  root.add(headGroup);

  // Torso
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.26, 0.55, 28), whiteArmor);
  chest.scale.set(1.15, 1, 0.85);
  chest.position.set(0, 0.18, 0);
  torsoGroup.add(chest);

  const coreLed = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.05), cyanLed);
  coreLed.position.set(0, 0.12, 0.28);
  torsoGroup.add(coreLed);

  root.add(torsoGroup);

  // Braços
  const armL = new THREE.Group();
  armL.position.set(-0.44, 0.32, 0);
  const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.55, 18), chrome);
  armLMesh.position.set(0, -0.24, 0.12);
  armLMesh.rotation.x = -0.55;
  armL.add(armLMesh);

  const armR = new THREE.Group();
  armR.position.set(0.44, 0.32, 0);
  const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.55, 18), chrome);
  armRMesh.position.set(0, -0.24, 0.14);
  armRMesh.rotation.x = -0.65;
  armR.add(armRMesh);

  root.add(armL, armR);

  // Guitarra elétrica 3D
  const guitarGroup = new THREE.Group();
  guitarGroup.position.set(0, 0.02, 0.38);
  guitarGroup.rotation.z = 0.28;
  guitarGroup.rotation.y = -0.18;

  const guitarBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.48, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.75, roughness: 0.2 })
  );
  guitarBody.scale.set(1.15, 0.95, 1);
  guitarGroup.add(guitarBody);

  const guitarTrim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 10, 24), cyanLed);
  guitarTrim.position.set(0, -0.02, 0.04);
  guitarGroup.add(guitarTrim);

  const guitarNeck = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.78, 0.04), chrome);
  guitarNeck.position.set(0.12, 0.42, 0.01);
  guitarNeck.rotation.z = -0.25;
  guitarGroup.add(guitarNeck);

  const guitarHeadstock = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.18, 0.045), blueMetal);
  guitarHeadstock.position.set(0.22, 0.80, 0.01);
  guitarHeadstock.rotation.z = -0.25;
  guitarGroup.add(guitarHeadstock);

  root.add(guitarGroup);

  // Pernas
  const legL = new THREE.Group();
  legL.position.set(-0.17, -0.52, 0);
  const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.65, 20), chrome);
  legLMesh.position.y = -0.32;
  legL.add(legLMesh);

  const legR = new THREE.Group();
  legR.position.set(0.17, -0.52, 0);
  const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.65, 20), chrome);
  legRMesh.position.y = -0.32;
  legR.add(legRMesh);

  root.add(legL, legR);

  return { root, headGroup, torsoGroup, armL, armR, legL, legR, guitarGroup, eyeL, eyeR };
}

function criarVegatocnyxBaterista3D() {
  const root = new THREE.Group();

  const whiteArmor = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1.0
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.2,
    metalness: 0.9
  });
  const pinkNeon = new THREE.MeshStandardMaterial({
    color: 0xff2a85,
    emissive: 0xff007f,
    emissiveIntensity: 3.3
  });
  const pinkArmor = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.25,
    metalness: 0.65
  });
  const darkVisor = new THREE.MeshPhysicalMaterial({
    color: 0x020617,
    roughness: 0.08,
    clearcoat: 1.0
  });

  // Cabeça
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.47, 32, 32), whiteArmor);
  head.scale.set(1.0, 0.92, 0.92);
  headGroup.add(head);

  // Cabelo / rabo de cavalo brilhante
  const ponytail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.85, 20), pinkArmor);
  ponytail.position.set(0, 0.42, -0.52);
  ponytail.rotation.x = -Math.PI / 3.2;
  headGroup.add(ponytail);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.24, 0.16), darkVisor);
  visorScreen.position.set(0, -0.02, 0.41);
  headGroup.add(visorScreen);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 20), pinkNeon);
  eyeL.scale.set(1.15, 0.9, 0.35);
  eyeL.position.set(-0.15, -0.02, 0.49);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 20), pinkNeon);
  eyeR.scale.set(1.15, 0.9, 0.35);
  eyeR.position.set(0.15, -0.02, 0.49);
  headGroup.add(eyeL, eyeR);

  // Fone de ouvido rosa com microfone
  [-1, 1].forEach((side) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 24), pinkArmor);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(side * 0.51, 0.02, 0);

    const pinkRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 12, 24), pinkNeon);
    pinkRing.rotation.y = Math.PI / 2;
    pinkRing.position.set(side * 0.56, 0.02, 0);

    headGroup.add(cup, pinkRing);
  });

  const headband = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.028, 12, 36, Math.PI), pinkArmor);
  headband.position.set(0, 0.02, 0);
  headGroup.add(headband);

  const micArm = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.32, 12), chrome);
  micArm.position.set(-0.48, -0.14, 0.22);
  micArm.rotation.x = Math.PI / 2.6;
  micArm.rotation.z = 0.35;

  const micCapsule = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), pinkNeon);
  micCapsule.position.set(-0.38, -0.22, 0.36);
  headGroup.add(micArm, micCapsule);

  root.add(headGroup);

  // Torso
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.22, 0.52, 28), whiteArmor);
  chest.scale.set(1.1, 1, 0.8);
  chest.position.set(0, 0.18, 0);
  torsoGroup.add(chest);

  const heartLed = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.04), pinkNeon);
  heartLed.position.set(0, 0.12, 0.25);
  torsoGroup.add(heartLed);

  root.add(torsoGroup);

  // Braços com baquetas
  const stickMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 });

  const armL = new THREE.Group();
  armL.position.set(-0.40, 0.32, 0);
  const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.48, 16), chrome);
  armLMesh.position.set(0, -0.20, 0.16);
  armLMesh.rotation.x = -0.85;
  const stickL = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.01, 0.48, 12), stickMat);
  stickL.position.set(-0.04, -0.36, 0.42);
  stickL.rotation.x = -1.25;
  armL.add(armLMesh, stickL);

  const armR = new THREE.Group();
  armR.position.set(0.40, 0.32, 0);
  const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.48, 16), chrome);
  armRMesh.position.set(0, -0.20, 0.16);
  armRMesh.rotation.x = -0.85;
  const stickR = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.01, 0.48, 12), stickMat);
  stickR.position.set(0.04, -0.36, 0.42);
  stickR.rotation.x = -1.25;
  armR.add(armRMesh, stickR);

  root.add(armL, armR);

  // Pernas
  const legL = new THREE.Group();
  legL.position.set(-0.15, -0.50, 0);
  const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.62, 18), chrome);
  legLMesh.position.y = -0.30;
  legL.add(legLMesh);

  const legR = new THREE.Group();
  legR.position.set(0.15, -0.50, 0);
  const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.62, 18), chrome);
  legRMesh.position.y = -0.30;
  legR.add(legRMesh);

  root.add(legL, legR);

  // Bateria completa 3D ao redor da Vegatocnyx
  const drumKit = new THREE.Group();

  const kickDrum = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.34, 28),
    new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.6, roughness: 0.25 })
  );
  kickDrum.rotation.x = Math.PI / 2;
  kickDrum.position.set(0, -0.65, 0.52);
  drumKit.add(kickDrum);

  const snareDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 24), chrome);
  snareDrum.position.set(-0.34, -0.32, 0.45);
  drumKit.add(snareDrum);

  const tom1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24), pinkArmor);
  tom1.position.set(-0.16, -0.14, 0.36);
  tom1.rotation.x = 0.25;

  const tom2 = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.18, 24), pinkArmor);
  tom2.position.set(0.18, -0.14, 0.36);
  tom2.rotation.x = 0.25;

  const floorTom = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.28, 24), chrome);
  floorTom.position.set(0.45, -0.44, 0.32);

  drumKit.add(tom1, tom2, floorTom);

  const cymbalMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.95,
    roughness: 0.15
  });

  const hiHat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24), cymbalMat);
  hiHat.position.set(-0.62, -0.05, 0.38);

  const crashCymbal = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.02, 28), cymbalMat);
  crashCymbal.position.set(0.58, 0.08, 0.24);
  crashCymbal.rotation.z = -0.12;

  drumKit.add(hiHat, crashCymbal);

  root.add(drumKit);

  return {
    root,
    headGroup,
    torsoGroup,
    armL,
    armR,
    legL,
    legR,
    drumKit,
    hiHat,
    crashCymbal,
    eyeL,
    eyeR
  };
}

export default function DancaRobotocVegatocnyx({ onClose, addLog }) {
  const mountRef = useRef(null);
  const audioElRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const [dancando, setDancando] = useState(true);
  const [bpm, setBpm] = useState(128);
  const [intensidadeDanca, setIntensidadeDanca] = useState(1.2);
  const [modoCoreografia, setModoCoreografia] = useState('FREESTYLE_NEON');

  // Mídias: MP3, YouTube e Playlists de redes sociais / internet
  const [faixas, setFaixas] = useState([
    {
      id: 'demo-1',
      titulo: 'Cyber Synth Stage (Ritmo 3D)',
      tipo: 'interno',
      url: '',
      youtubeId: null
    }
  ]);
  const [faixaAtivaId, setFaixaAtivaId] = useState('demo-1');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [playlistInput, setPlaylistInput] = useState('');
  const [tituloLinkInput, setTituloLinkInput] = useState('');
  const [playlistsSalvas, setPlaylistsSalvas] = useState([]);

  const dancandoRef = useRef(dancando);
  const bpmRef = useRef(bpm);
  const intensidadeRef = useRef(intensidadeDanca);
  const modoRef = useRef(modoCoreografia);

  useEffect(() => {
    dancandoRef.current = dancando;
  }, [dancando]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    intensidadeRef.current = intensidadeDanca;
  }, [intensidadeDanca]);

  useEffect(() => {
    modoRef.current = modoCoreografia;
  }, [modoCoreografia]);

  const faixaAtiva = faixas.find((f) => f.id === faixaAtivaId) || faixas[0];

  const conectarAnalisadorAudio = (audioElemento) => {
    if (!audioElemento || analyserRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaElementSource(audioElemento);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      // Caso já conectado ou bloqueado pelo navegador, segue com animação por BPM
    }
  };

  const handleImportarMP3 = (e) => {
    const arquivos = Array.from(e.target.files || []);
    if (!arquivos.length) return;

    const novasFaixas = arquivos.map((file, idx) => ({
      id: `mp3-${Date.now()}-${idx}`,
      titulo: `🎵 ${file.name.replace(/\.mp3$/i, '')}`,
      tipo: 'mp3',
      url: URL.createObjectURL(file),
      youtubeId: null
    }));

    setFaixas((prev) => [...novasFaixas, ...prev]);
    setFaixaAtivaId(novasFaixas[0].id);
    setDancando(true);
    if (addLog) addLog(`[DANÇA 3D] Importados ${novasFaixas.length} arquivo(s) MP3 para Robotoc & Vegatocnyx.`);
  };

  const handleAdicionarYouTube = (e) => {
    e.preventDefault();
    const ytId = extrairIdYouTube(youtubeInput);
    if (!ytId) {
      alert('Cole um link válido do YouTube (ex: https://www.youtube.com/watch?v=...).');
      return;
    }

    const novaFaixa = {
      id: `yt-${Date.now()}`,
      titulo: tituloLinkInput.trim() ? `▶️ ${tituloLinkInput.trim()}` : `▶️ YouTube (${ytId})`,
      tipo: 'youtube',
      url: youtubeInput.trim(),
      youtubeId: ytId
    };

    setFaixas((prev) => [novaFaixa, ...prev]);
    setFaixaAtivaId(novaFaixa.id);
    setYoutubeInput('');
    setTituloLinkInput('');
    setDancando(true);
    if (addLog) addLog(`[DANÇA 3D] Link do YouTube adicionado: ${novaFaixa.titulo}`);
  };

  const handleAdicionarPlaylistWeb = (e) => {
    e.preventDefault();
    const urlLimpa = playlistInput.trim();
    if (!urlLimpa) return;

    const ytListId = extrairIdPlaylistYouTube(urlLimpa);
    const novaPlaylist = {
      id: `pl-${Date.now()}`,
      nome: tituloLinkInput.trim() || (ytListId ? `Playlist YouTube (${ytListId})` : 'Playlist / Link Social'),
      url: urlLimpa,
      ytListId
    };

    setPlaylistsSalvas((prev) => [novaPlaylist, ...prev]);
    setPlaylistInput('');
    setTituloLinkInput('');
    if (addLog) addLog(`[DANÇA 3D] Playlist da rede/internet salva: ${novaPlaylist.nome}`);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 720;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050816);
    scene.fog = new THREE.FogExp2(0x050816, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 7.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const spotCyan = new THREE.PointLight(0x00f0ff, 6, 20);
    spotCyan.position.set(-3.5, 3.5, 3);
    scene.add(spotCyan);

    const spotPink = new THREE.PointLight(0xff007f, 6, 20);
    spotPink.position.set(3.5, 3.5, 3);
    scene.add(spotPink);

    // Palco neon circular
    const stageGeo = new THREE.CylinderGeometry(4.4, 4.7, 0.25, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.2
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.y = -1.25;
    scene.add(stageMesh);

    const stageRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.45, 0.045, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = -1.12;
    scene.add(stageRing);

    const robotoc = criarRobotocGuitarrista3D();
    robotoc.root.position.set(-1.65, -0.05, 0.4);
    robotoc.root.scale.set(1.05, 1.05, 1.05);
    scene.add(robotoc.root);

    const vegatocnyx = criarVegatocnyxBaterista3D();
    vegatocnyx.root.position.set(1.75, -0.05, 0.2);
    vegatocnyx.root.scale.set(1.05, 1.05, 1.05);
    scene.add(vegatocnyx.root);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      let energiaAudio = 0.5;
      if (analyserRef.current && dataArrayRef.current && dancandoRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        let soma = 0;
        for (let i = 0; i < 16; i++) {
          soma += dataArrayRef.current[i];
        }
        energiaAudio = Math.min(2.2, (soma / (16 * 255)) * 2.4);
      }

      const freq = (bpmRef.current / 60) * Math.PI;
      const amp = dancandoRef.current ? intensidadeRef.current * (0.75 + energiaAudio * 0.45) : 0;
      const modo = modoRef.current;

      const beat = Math.sin(t * freq);
      const beatRapido = Math.sin(t * freq * 2);
      const pulo = Math.abs(Math.sin(t * freq * 0.5));

      // Dança do ROBOTOC guitarrista
      if (dancandoRef.current) {
        const saltoRobotoc = modo === 'SALTO_TOTAL' ? pulo * 0.42 * amp : Math.max(0, beat) * 0.14 * amp;
        robotoc.root.position.y = -0.05 + saltoRobotoc;
        robotoc.root.position.x = -1.65 + Math.sin(t * freq * 0.5) * 0.28 * amp;
        robotoc.root.rotation.y = Math.sin(t * freq * 0.5) * 0.32 * amp;

        robotoc.headGroup.rotation.x = beatRapido * 0.22 * amp;
        robotoc.headGroup.rotation.z = beat * 0.18 * amp;
        robotoc.torsoGroup.rotation.z = -beat * 0.14 * amp;

        robotoc.armL.rotation.x = beatRapido * 0.45 * amp;
        robotoc.armR.rotation.z = beatRapido * 0.35 * amp;
        robotoc.guitarGroup.rotation.z = 0.28 + beat * 0.22 * amp;
        robotoc.guitarGroup.rotation.x = beatRapido * 0.18 * amp;

        robotoc.legL.rotation.x = beat * 0.48 * amp;
        robotoc.legR.rotation.x = -beat * 0.48 * amp;

        stageRing.material.color.setHex(beat > 0 ? 0x00f0ff : 0xff007f);
      } else {
        robotoc.root.position.y = -0.05 + Math.sin(t * 1.5) * 0.04;
        robotoc.root.rotation.y = 0;
        robotoc.legL.rotation.x = 0;
        robotoc.legR.rotation.x = 0;
      }

      // Dança e bateria da VEGATOCNYX
      if (dancandoRef.current) {
        const saltoVega = modo === 'BATERIA_TURBO' ? Math.abs(beatRapido) * 0.22 * amp : Math.max(0, -beat) * 0.15 * amp;
        vegatocnyx.root.position.y = -0.05 + saltoVega;
        vegatocnyx.root.position.x = 1.75 + Math.cos(t * freq * 0.5) * 0.22 * amp;
        vegatocnyx.root.rotation.y = -Math.sin(t * freq * 0.5) * 0.28 * amp;

        vegatocnyx.headGroup.rotation.z = -beat * 0.24 * amp;
        vegatocnyx.headGroup.rotation.x = beatRapido * 0.2 * amp;
        vegatocnyx.torsoGroup.rotation.z = beat * 0.16 * amp;

        // Baquetas batendo na bateria
        vegatocnyx.armL.rotation.x = Math.sin(t * freq * 2) * 0.65 * amp;
        vegatocnyx.armR.rotation.x = Math.cos(t * freq * 2) * 0.65 * amp;

        vegatocnyx.legL.rotation.x = -beat * 0.42 * amp;
        vegatocnyx.legR.rotation.x = beat * 0.42 * amp;
      } else {
        vegatocnyx.root.position.y = -0.05 + Math.sin(t * 1.5) * 0.04;
        vegatocnyx.root.rotation.y = 0;
        vegatocnyx.legL.rotation.x = 0;
        vegatocnyx.legR.rotation.x = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 600,
        backgroundColor: 'rgba(2, 6, 23, 0.86)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#090d1e',
          border: '2px solid #00f0ff',
          borderRadius: '20px',
          padding: '18px',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.28), 0 0 30px rgba(255, 0, 127, 0.2)'
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0, 240, 255, 0.3)',
            paddingBottom: '10px',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', color: '#00f0ff', fontWeight: 900 }}>
              🎸🥁 DANÇA ROBOTOC & VEGATOCNYX 3D — PALCO MUSICAL
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#cbd5e1' }}>
              Robotoc na guitarra com fone & microfone • Vegatocnyx na bateria com fone rosa & microfone
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            ✕ Fechar
          </button>
        </div>

        {/* Grade Principal: Palco 3D + Controles de Música/Playlist */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '14px'
          }}
        >
          {/* Palco 3D */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              ref={mountRef}
              style={{
                width: '100%',
                height: '360px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1.5px solid #00f0ff'
              }}
            />

            {/* Controles de Dança */}
            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => setDancando((prev) => !prev)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: dancando ? '#00f0ff' : '#22c55e',
                    color: '#020617',
                    fontWeight: 900,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {dancando ? '⏸ Pausar Dança' : '💃 Fazer Dançar Muito!'}
                </button>

                <select
                  value={modoCoreografia}
                  onChange={(e) => setModoCoreografia(e.target.value)}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    border: '1px solid #00f0ff',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '10.5px',
                    fontWeight: 'bold'
                  }}
                >
                  <option value="FREESTYLE_NEON">⚡ Freestyle Neon</option>
                  <option value="SALTO_TOTAL">🚀 Salto Total no Palco</option>
                  <option value="BATERIA_TURBO">🥁 Bateria Turbo</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '10.5px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>BPM / Ritmo: <strong>{bpm} BPM</strong></span>
                  <input
                    type="range"
                    min={70}
                    max={200}
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Intensidade: <strong>{intensidadeDanca.toFixed(1)}x</strong></span>
                  <input
                    type="range"
                    min={0.4}
                    max={2.4}
                    step={0.1}
                    value={intensidadeDanca}
                    onChange={(e) => setIntensidadeDanca(Number(e.target.value))}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Painel de MP3, YouTube e Playlists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Importar MP3 */}
            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                borderRadius: '12px',
                padding: '10px'
              }}
            >
              <strong style={{ fontSize: '11px', color: '#00f0ff', display: 'block', marginBottom: '6px' }}>
                🎧 1. Importar Arquivos MP3 do Dispositivo
              </strong>
              <input
                type="file"
                accept="audio/mp3,audio/*"
                multiple
                onChange={handleImportarMP3}
                style={{ fontSize: '10.5px', color: '#e2e8f0', width: '100%' }}
              />
            </div>

            {/* Adicionar Link do YouTube */}
            <form
              onSubmit={handleAdicionarYouTube}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 0, 127, 0.45)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <strong style={{ fontSize: '11px', color: '#ff4da6' }}>
                ▶️ 2. Adicionar Link de Música do YouTube
              </strong>
              <input
                type="text"
                placeholder="Nome da música (opcional)"
                value={tituloLinkInput}
                onChange={(e) => setTituloLinkInput(e.target.value)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  fontSize: '10.5px'
                }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Cole o link do YouTube aqui..."
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    fontSize: '10.5px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#ec4899',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '10.5px',
                    cursor: 'pointer'
                  }}
                >
                  + YouTube
                </button>
              </div>
            </form>

            {/* Playlists de Redes Sociais ou da Internet */}
            <form
              onSubmit={handleAdicionarPlaylistWeb}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <strong style={{ fontSize: '11px', color: '#38bdf8' }}>
                🛜 3. Playlists de Redes Sociais ou da Internet
              </strong>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Cole URL de playlist / rede social / internet..."
                  value={playlistInput}
                  onChange={(e) => setPlaylistInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    fontSize: '10.5px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '10.5px',
                    cursor: 'pointer'
                  }}
                >
                  Salvar Playlist
                </button>
              </div>

              {playlistsSalvas.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  {playlistsSalvas.map((pl) => (
                    <a
                      key={pl.id}
                      href={pl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '10px',
                        color: '#7dd3fc',
                        backgroundColor: '#1e293b',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      🛜 {pl.nome} ➔ Abrir Playlist
                    </a>
                  ))}
                </div>
              )}
            </form>

            {/* Fila de Faixas & Player Ativo */}
            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(0, 240, 255, 0.35)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <strong style={{ fontSize: '11px', color: '#00f0ff' }}>
                🎶 Faixa Selecionada: {faixaAtiva?.titulo}
              </strong>

              {faixaAtiva?.tipo === 'mp3' && faixaAtiva.url && (
                <audio
                  ref={audioElRef}
                  src={faixaAtiva.url}
                  controls
                  autoPlay
                  onPlay={() => conectarAnalisadorAudio(audioElRef.current)}
                  style={{ width: '100%', height: '34px' }}
                />
              )}

              {faixaAtiva?.tipo === 'youtube' && faixaAtiva.youtubeId && (
                <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: '8px', overflow: 'hidden' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${faixaAtiva.youtubeId}?autoplay=1`}
                    title={faixaAtiva.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '110px', overflowY: 'auto' }}>
                {faixas.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFaixaAtivaId(f.id)}
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: f.id === faixaAtiva?.id ? '1px solid #00f0ff' : '1px solid #1e293b',
                      backgroundColor: f.id === faixaAtiva?.id ? 'rgba(0, 240, 255, 0.14)' : '#1e293b',
                      color: '#f8fafc',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {f.titulo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}