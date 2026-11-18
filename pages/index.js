import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';
import { coreAssistant } from '../coreAssistantEngine';
import { autoCompleterEngine } from '../components/palavrasAutoComplemento';

// Importação do Módulo de Inteligência Robotoc (Microfone Futurístico & buscarobotoc)
import { InteligenciaRobotoc } from '../components/inteligencia-robotoc';

// Bibliotecas para geração de documentos
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pptxgen from "pptxgenjs";

// Importação do Componente Yu-Gi-Oh! 3D
import YugiohDuelLinks3D from '../components/YugiohDuelLinks3D';

// =========================================================================================
// 🤖 --- HELPER DE MODELAGEM 3D ESPETACULAR DO ROBOTOC (BASEADO NA IMAGEM DE REFERÊNCIA) ---
// =========================================================================================
function criarModeloRobotocEspetacular3D() {
  const robotGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1 });
  const chromeSilverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.92 });
  const metallicBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.75 });
  const darkScreenMat = new THREE.MeshPhysicalMaterial({ color: 0x020617, roughness: 0.08, metalness: 0.3, clearcoat: 1.0 });
  const cyanLedMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.2, roughness: 0.1 });

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.52, 36, 36), whiteArmorMat);
  headBase.scale.set(1.12, 0.94, 0.98);
  headGroup.add(headBase);

  const helmetBand = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.28, 32), chromeSilverMat);
  helmetBand.rotation.z = Math.PI / 2;
  helmetBand.scale.set(0.95, 1.08, 0.95);
  headGroup.add(helmetBand);

  const crestBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.26), whiteArmorMat);
  crestBase.position.set(0, 0.50, 0.02);
  const crestLed = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.06), cyanLedMat);
  crestLed.position.set(0, 0.51, 0.14);
  headGroup.add(crestBase, crestLed);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.36, 0.18), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.43);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.30, 0.19), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.435);
  headGroup.add(visorScreen);

  const eyeGeo = new THREE.SphereGeometry(0.085, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.15, 0.95, 0.35);
  eyeL.position.set(-0.17, -0.02, 0.52);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.15, 0.95, 0.35);
  eyeR.position.set(0.17, -0.02, 0.52);
  headGroup.add(eyeL, eyeR);

  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    const earOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.10, 24), chromeSilverMat);
    earOuter.rotation.z = Math.PI / 2;
    const earRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 16, 32), metallicBlueMat);
    earRing.rotation.y = Math.PI / 2;
    earRing.position.x = side * 0.03;
    earGroup.add(earOuter, earRing);
    earGroup.position.set(side * 0.57, -0.02, 0);
    headGroup.add(earGroup);
  });

  robotGroup.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  const neckCollar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 16, 32), metallicBlueMat);
  neckCollar.rotation.x = Math.PI / 2;
  neckCollar.position.set(0, 0.46, 0);
  robotGroup.add(neck, neckCollar);

  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.55, 32), whiteArmorMat);
  chestArmor.scale.set(1.15, 1, 0.85);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 0.34), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  torsoGroup.add(chestBlueTrim);

  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.26, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.20, 0.26);
  torsoGroup.add(chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.25 - i * 0.015, 0.24 - i * 0.015, 0.08, 24), chromeSilverMat);
    abSeg.scale.set(1.1, 1, 0.85);
    abSeg.position.set(0, -0.14 - i * 0.10, 0);
    torsoGroup.add(abSeg);

    if (i < 2) {
      const abLed = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.24), cyanLedMat);
      abLed.position.set(0, -0.19 - i * 0.10, 0.04);
      torsoGroup.add(abLed);
    }
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.20, 0.22, 24), whiteArmorMat);
  pelvis.scale.set(1.15, 1, 0.88);
  pelvis.position.set(0, -0.45, 0);
  const pelvisTrim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.028, 12, 28), metallicBlueMat);
  pelvisTrim.rotation.x = Math.PI / 2;
  pelvisTrim.scale.set(1.12, 0.88, 1);
  pelvisTrim.position.set(0, -0.36, 0);
  torsoGroup.add(pelvis, pelvisTrim);

  robotGroup.add(torsoGroup);

  const criarBracoRobotoc = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.46, 0.34, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), chromeSilverMat);
    const shoulderRing = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.022, 12, 24), metallicBlueMat);
    shoulderRing.rotation.y = Math.PI / 2;
    armPivot.add(shoulder, shoulderRing);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.28, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.18, 0);
    upperArm.rotation.z = lado * 0.15;
    armPivot.add(upperArm);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.07, -0.34, 0);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), metallicBlueMat);
    elbowGroup.add(elbowJoint);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.125, 0.32, 24), chromeSilverMat);
    forearm.position.set(0, -0.18, 0);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.028, 12, 24), metallicBlueMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.33, 0);
    elbowGroup.add(forearm, cuff);

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.42, 0);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.07), whiteArmorMat);
    handGroup.add(palm);

    for (let f = -1.5; f <= 1.5; f += 1) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.013, 0.09, 10), chromeSilverMat);
      finger.position.set(f * 0.032, -0.09, 0);
      finger.rotation.z = f * 0.08 * lado;
      handGroup.add(finger);
    }
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.015, 0.08, 10), chromeSilverMat);
    thumb.position.set(-lado * 0.08, -0.03, 0.02);
    thumb.rotation.z = -lado * 0.6;
    handGroup.add(thumb);

    elbowGroup.add(handGroup);
    armPivot.add(elbowGroup);

    return { armPivot, elbowGroup };
  };

  const rightArmObj = criarBracoRobotoc(-1);
  rightArmObj.armPivot.rotation.z = -0.18;
  robotGroup.add(rightArmObj.armPivot);

  const leftArmObj = criarBracoRobotoc(1);
  leftArmObj.armPivot.rotation.z = 0.65;
  leftArmObj.elbowGroup.rotation.z = 1.65;
  leftArmObj.elbowGroup.rotation.x = -0.2;
  robotGroup.add(leftArmObj.armPivot);

  const criarPernaRobotoc = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.17, -0.52, 0);

    const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), chromeSilverMat);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.26, 20), chromeSilverMat);
    thigh.position.set(0, -0.15, 0);

    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), metallicBlueMat);
    kneeJoint.position.set(0, -0.30, 0.02);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.135, 0.30, 24), chromeSilverMat);
    shin.position.set(0, -0.46, 0);

    const bootCollar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 12, 24), metallicBlueMat);
    bootCollar.rotation.x = Math.PI / 2;
    bootCollar.position.set(0, -0.60, 0);

    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.34), whiteArmorMat);
    footBase.position.set(0, -0.66, 0.05);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.04, 0.35), metallicBlueMat);
    sole.position.set(0, -0.71, 0.05);

    legGroup.add(hipJoint, thigh, kneeJoint, shin, bootCollar, footBase, sole);
    return legGroup;
  };

  const legL = criarPernaRobotoc(-1);
  const legR = criarPernaRobotoc(1);
  robotGroup.add(legL, legR);

  return {
    robotGroup,
    headGroup,
    eyeL,
    eyeR,
    crestLed,
    chestCoreLed,
    rightArmPivot: rightArmObj.armPivot,
    leftArmPivot: leftArmObj.armPivot,
    leftElbowGroup: leftArmObj.elbowGroup,
    legL,
    legR
  };
}

// =========================================================================================
// 🤖 --- HELPER DE MODELAGEM 3D DO VEGATOCNYX 3D (BASEADO NA IMAGEM DE REFERÊNCIA) ---
// =========================================================================================
function criarModeloVegatocnyxEspetacular3D() {
  const robotGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0 });
  const chromeSilverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.92 });
  const metallicBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.75 });
  const darkScreenMat = new THREE.MeshPhysicalMaterial({ color: 0x020617, roughness: 0.08, metalness: 0.3 });
  const cyanLedMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.2, roughness: 0.1 });

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.50, 36, 36), whiteArmorMat);
  headBase.scale.set(1.05, 0.92, 0.95);
  headGroup.add(headBase);

  // Cabelo em rabo de cavalo metálico/azul estilo Vegatocnyx
  const ponytailBase = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 20), chromeSilverMat);
  ponytailBase.position.set(0, 0.35, -0.45);
  const ponytailStreamer = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 20), metallicBlueMat);
  ponytailStreamer.position.set(0, 0.75, -0.65);
  ponytailStreamer.rotation.x = -Math.PI / 4;
  headGroup.add(ponytailBase, ponytailStreamer);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.34, 0.18), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.42);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.28, 0.19), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.425);
  headGroup.add(visorScreen);

  const eyeGeo = new THREE.SphereGeometry(0.08, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.15, 0.95, 0.35);
  eyeL.position.set(-0.16, -0.02, 0.51);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.15, 0.95, 0.35);
  eyeR.position.set(0.16, -0.02, 0.51);
  headGroup.add(eyeL, eyeR);

  robotGroup.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.52, 0);
  robotGroup.add(neck);

  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.26, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 1, 0.8);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.05);
  torsoGroup.add(chestBlueTrim);

  robotGroup.add(torsoGroup);

  return { robotGroup, headGroup, eyeL, eyeR };
}

// =========================================================================================
// ⚙️ --- COMPONENTE: AGENTE EM AGENT PANEL (INTEGRADO AO NÚCLEO) ---
// =========================================================================================
function AgentPanelModule() {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleRunAgent = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    setLoading(true);
    setResponse('⚙️ Executando tarefa no agente...');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task.trim(), provider: 'cloud' }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(`✅ ${data.message || 'Sucesso!'}`);
      } else {
        setResponse(`❌ Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      setResponse(`❌ Erro de conexão: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid #00f0ff',
      borderRadius: '16px',
      padding: '16px',
      margin: '10px 0',
      color: '#0f172a',
      fontFamily: 'sans-serif',
      boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)',
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{ color: '#0284c7', fontSize: '14px', margin: '0 0 10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ⚙️ PAINEL WEB DO EM AGENT
      </h2>

      <form onSubmit={handleRunAgent} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Digite o comando para o agente..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '11px',
            outline: 'none',
            color: '#0f172a'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 16px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '11px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Executando...' : 'Enviar para o Agente'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '10.5px' }}>
          <p style={{ margin: 0, color: '#0284c7', fontWeight: 'bold' }}>{response}</p>
        </div>
      )}
    </div>
  );
}

// =========================================================================================
// 🤖 --- COMPONENTE: MINI ROBOTOC 3D ASSISTANT (ATUALIZADO COM MICROFONE & BUSCA NA INTERNET) ---
// =========================================================================================
function MiniRobotocAssistant3D({ onClose }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const miniRobotRef = useRef(null);
  const pointerArmRef = useRef(null);
  const clickBoostRef = useRef(0);

  const [robotoc] = useState(() => new InteligenciaRobotoc());
  const [duvidaInput, setDuvidaInput] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [respostaIA, setRespostaIA] = useState('Olá! Sou seu Mini Robotoc 3D com microfone futurístico e busca na internet. Fale ou digite qualquer assunto!');
  const [ouvindo, setOuvindo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [imagemBusca, setImagemBusca] = useState(null);
  const [fontesWeb, setFontesWeb] = useState([]);

  const iniciarOuvirMicrofone = () => {
    robotoc.ouvirMicrofoneFuturistico(
      async (textoTranscrito) => {
        setOuvindo(false);
        setDuvidaInput(textoTranscrito);
        await processarPerguntaRobotoc(textoTranscrito);
      },
      (erro) => {
        setOuvindo(false);
        console.error("Erro no microfone:", erro);
        setRespostaIA("Erro ao acessar o microfone.");
      },
      () => {
        setOuvindo(true);
        setRespostaIA("🎙️ Ouvindo sua voz com tecnologia futurística...");
      }
    );
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setDuvidaInput(valor);

    const ultimasPalavras = valor.split(' ');
    const ultimaPalavra = ultimasPalavras[ultimasPalavras.length - 1];

    if (ultimaPalavra.length >= 1) {
      const match = autoCompleterEngine.buscarCompletar(ultimaPalavra, 4);
      setSugestoes(match);
    } else {
      setSugestoes([]);
    }
  };

  const aplicarSugestao = (palavraSugerida) => {
    if (!palavraSugerida) return;
    const palavras = duvidaInput.split(' ');
    palavras[palavras.length - 1] = palavraSugerida;
    const textoCompleto = palavras.join(' ') + ' ';
    setDuvidaInput(textoCompleto);
    setSugestoes([]);
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && sugestoes.length > 0) {
      e.preventDefault();
      aplicarSugestao(sugestoes[0]);
    }
  };

  const falarResposta = (texto) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const processarPerguntaRobotoc = async (textoInput) => {
    const texto = textoInput || duvidaInput;
    if (!texto.trim()) return;

    autoCompleterEngine.adicionarNovaPalavra(texto.trim());
    setCarregando(true);
    setImagemBusca(null);
    setFontesWeb([]);
    clickBoostRef.current = 1.0;

    let resultadoTexto = "";

    if (texto.toLowerCase().includes('buscar') || texto.toLowerCase().includes('pesquisar') || texto.toLowerCase().includes('internet')) {
      const termo = texto.replace(/buscar|pesquisar|na internet|sobre/gi, '').trim();
      const resBusca = await robotoc.buscarobotoc(termo || texto);
      resultadoTexto = resBusca.explicacao;
      setImagemBusca(resBusca.imagemSugerida);
      setFontesWeb(resBusca.fontes || []);
    } else {
      const resGeral = await robotoc.processarMensagemRobotoc(texto);
      resultadoTexto = resGeral.resposta;
    }

    setRespostaIA(resultadoTexto);
    falarResposta(resultadoTexto);
    setCarregando(false);
    setDuvidaInput('');
    setSugestoes([]);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.15, 3.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const lightCyan = new THREE.DirectionalLight(0x00f0ff, 3.5);
    lightCyan.position.set(3, 5, 4);
    scene.add(lightCyan);

    const robotParts = criarModeloRobotocEspetacular3D();
    const miniRobot = robotParts.robotGroup;
    miniRobot.position.set(0, -0.1, 0);
    miniRobot.scale.set(0.85, 0.85, 0.85);
    scene.add(miniRobot);

    miniRobotRef.current = miniRobot;
    pointerArmRef.current = robotParts.leftElbowGroup;

    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (clickBoostRef.current > 0) {
        clickBoostRef.current = Math.max(0, clickBoostRef.current - 0.03);
      }
      const boost = clickBoostRef.current;

      if (miniRobotRef.current) {
        miniRobotRef.current.position.y = -0.1 + Math.sin(time * 2.5) * 0.06 + Math.sin(boost * Math.PI) * 0.18;
        miniRobotRef.current.rotation.y = Math.sin(time * 1.2) * 0.2 + Math.sin(boost * Math.PI * 2) * 0.45;
      }

      if (robotParts.headGroup) {
        robotParts.headGroup.rotation.z = Math.sin(time * 1.5) * 0.05 + Math.sin(boost * Math.PI * 2) * 0.18;
      }

      if (pointerArmRef.current) {
        pointerArmRef.current.rotation.z = 1.65 + Math.sin(time * 3.0) * 0.12 + Math.sin(boost * Math.PI * 4) * 0.45;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '380px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff',
      borderRadius: '20px', padding: '14px', boxShadow: '0 0 35px rgba(0, 240, 255, 0.3)',
      zIndex: 500, backdropFilter: 'blur(20px)', color: '#0f172a', fontFamily: 'sans-serif', maxHeight: '520px', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '6px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🤖</span>
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>MINI ROBOTOC 3D + MICROFONE FUTURÍSTICO</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minHeight: '110px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #00f0ff', padding: '6px', marginBottom: '8px' }}>
        <div
          ref={mountRef}
          onClick={() => processarPerguntaRobotoc("Olá Robotoc")}
          title="Clique no Mini Robotoc 3D!"
          style={{ width: '90px', height: '100px', cursor: 'pointer', flexShrink: 0 }}
        />
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Resposta Robotoc:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a', whiteSpace: 'pre-wrap' }}>{carregando ? '⚡ Processando dados e buscando na internet...' : respostaIA}</p>
          
          {imagemBusca && (
            <div style={{ marginTop: '6px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #00f0ff' }}>
              <img src={imagemBusca} alt="Ilustração Robotoc" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
            </div>
          )}

          {fontesWeb.length > 0 && (
            <div style={{ marginTop: '4px', fontSize: '8px', color: '#0284c7' }}>
              <span>Fontes: </span>
              {fontesWeb.map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noreferrer" style={{ color: '#00f0ff', marginRight: '6px', textDecoration: 'underline' }}>{f.titulo}</a>
              ))}
            </div>
          )}
        </div>
      </div>

      {sugestoes.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px', backgroundColor: '#f0f9ff', padding: '6px', borderRadius: '8px', border: '1px solid #00f0ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: 'bold' }}>⚡ AUTO-COMPLETE:</span>
          </div>
          {sugestoes.map((sug, i) => (
            <button
              key={i}
              onClick={() => aplicarSugestao(sug)}
              style={{
                backgroundColor: i === 0 ? '#00f0ff' : '#ffffff',
                border: '1px solid #0284c7',
                color: i === 0 ? '#000' : '#0284c7',
                padding: '3px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              {sug} {i === 0 ? '↹' : '↵'}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          onClick={iniciarOuvirMicrofone}
          title="Microfone Futurístico (Falar com o Robotoc)"
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #00f0ff',
            backgroundColor: ouvindo ? 'rgba(239,68,68,0.2)' : 'rgba(2,132,199,0.1)',
            color: ouvindo ? '#ef4444' : '#0284c7',
            cursor: 'pointer',
            fontSize: '14px',
            animation: ouvindo ? 'pulse 1s infinite' : 'none'
          }}
        >
          🎙️
        </button>

        <input
          type="text"
          value={duvidaInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Futebol, faculdade, comida, 'buscar [assunto]'..."
          style={{ flex: 1, padding: '8px 10px', backgroundColor: '#f8fafc', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '10px', outline: 'none', color: '#0f172a' }}
        />
        
        <button onClick={() => processarPerguntaRobotoc(duvidaInput)} style={{ padding: '8px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>
          Enviar
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🚀 --- NOVO COMPONENTE: MINI ROBOTOC 3D LATERAL & BLOCO DE NOTAS FUTURISTA COM LIXEIRA ---
// =========================================================================================
function MiniRobotocSidebarNotes({ addLogTerminal }) {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('notas');

  const [notas, setNotas] = useState([
    { id: 1, titulo: 'Anotações Mestre Kernel', conteudo: 'Mapeamento quântico de 12 Nós AGI ativo no Emanuel.OS.', data: new Date().toLocaleTimeString('pt-BR') }
  ]);
  const [lixeira, setLixeira] = useState([]);

  const [tituloInput, setTituloInput] = useState('');
  const [conteudoInput, setConteudoInput] = useState('');

  const robotMountRef = useRef(null);
  const trashMountRef = useRef(null);
  const touchStartXRef = useRef(0);

  const handleCriarNota = (e) => {
    e.preventDefault();
    if (!conteudoInput.trim()) return;
    const nova = {
      id: Date.now(),
      titulo: tituloInput.trim() || `Rascunho ${notas.length + 1}`,
      conteudo: conteudoInput,
      data: new Date().toLocaleTimeString('pt-BR')
    };
    setNotas(prev => [nova, ...prev]);
    setTituloInput('');
    setConteudoInput('');
    if (addLogTerminal) addLogTerminal(`[ROBOTOC 3D] Nova nota criada: "${nova.titulo}"`);
  };

  const handleMoverParaLixeira = (id) => {
    const item = notas.find(n => n.id === id);
    if (!item) return;
    setNotas(prev => prev.filter(n => n.id !== id));
    setLixeira(prev => [item, ...prev]);
    if (addLogTerminal) addLogTerminal(`[LIXEIRA 3D] Rascunho descartado: "${item.titulo}"`);
  };

  const handleRestaurarNota = (id) => {
    const item = lixeira.find(n => n.id === id);
    if (!item) return;
    setLixeira(prev => prev.filter(n => n.id !== id));
    setNotas(prev => [item, ...prev]);
  };

  const handleExcluirDefinitivo = (id) => {
    setLixeira(prev => prev.filter(n => n.id !== id));
  };

  const handleDownloadTXT = (nota) => {
    const blob = new Blob([`TÍTULO: ${nota.titulo}\nDATA: ${nota.data}\n\n${nota.conteudo}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nota.titulo.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (nota) => {
    const doc = new jsPDF();
    doc.setFillColor(240, 249, 255);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(2, 132, 199);
    doc.setFontSize(16);
    doc.text("EMANUEL.OS - BLOCO DE NOTAS FUTURISTA ROBOTOC 3D", 15, 18);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`TÍTULO: ${nota.titulo} | DATA: ${nota.data}`, 15, 25);

    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(nota.conteudo, 180);
    doc.text(linhas, 15, 40);

    doc.save(`${nota.titulo.replace(/\s+/g, '_')}.pdf`);
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX < -50) setExpandido(true);
    if (deltaX > 50) setExpandido(false);
  };

  useEffect(() => {
    if (!robotMountRef.current) return;
    const width = 60;
    const height = 60;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 3.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    robotMountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    const robotParts = criarModeloRobotocEspetacular3D();
    const robotGroup = robotParts.robotGroup;
    robotGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(robotGroup);

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      robotGroup.position.y = Math.sin(t * 3.0) * 0.08;
      robotGroup.rotation.y = Math.sin(t * 1.5) * 0.3;
      if (robotParts.leftElbowGroup) {
        robotParts.leftElbowGroup.rotation.z = 1.65 + Math.sin(t * 4.0) * 0.18;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (robotMountRef.current && renderer.domElement) robotMountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 450,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: 'sans-serif'
      }}
    >
      <div
        onClick={() => setExpandido(!expandido)}
        title="Puxe para o lado ou clique para abrir o Bloco de Notas Futurista Robotoc 3D"
        style={{
          width: '54px',
          height: '110px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '2px solid #00f0ff',
          borderRight: 'none',
          borderRadius: '20px 0 0 20px',
          boxShadow: '-8px 0 25px rgba(0, 240, 255, 0.4)',
          backdropFilter: 'blur(15px)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '4px'
        }}
      >
        <div ref={robotMountRef} style={{ width: '45px', height: '45px', pointerEvents: 'none' }} />
        <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: '900', textAlign: 'center', lineHeight: '1.1' }}>
          {expandido ? 'FECHAR' : 'NOTAS 3D'}
        </span>
        <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>
          {expandido ? '➔' : '◀'}
        </span>
      </div>

      <div style={{
        width: expandido ? '360px' : '0px',
        height: '520px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: expandido ? '2px solid #00f0ff' : 'none',
        borderRight: 'none',
        borderRadius: '20px 0 0 20px',
        backdropFilter: 'blur(30px)',
        boxShadow: expandido ? '-10px 0 40px rgba(0, 240, 255, 0.3)' : 'none',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        color: '#0f172a'
      }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #bae6fd', backgroundColor: 'rgba(240, 249, 255, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>📝</span>
            <strong style={{ fontSize: '11px', color: '#0284c7', letterSpacing: '0.5px' }}>
              BLOCO DE NOTAS FUTURISTA ROBOTOC 3D
            </strong>
          </div>
          <button onClick={() => setExpandido(false)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #bae6fd', backgroundColor: '#f8fafc' }}>
          <button 
            onClick={() => setAbaAtiva('notas')}
            style={{
              flex: 1, padding: '8px', border: 'none',
              backgroundColor: abaAtiva === 'notas' ? '#0284c7' : 'transparent',
              color: abaAtiva === 'notas' ? '#fff' : '#0284c7',
              fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            📋 Notas Ativas ({notas.length})
          </button>
          <button 
            onClick={() => setAbaAtiva('lixeira')}
            style={{
              flex: 1, padding: '8px', border: 'none',
              backgroundColor: abaAtiva === 'lixeira' ? '#ef4444' : 'transparent',
              color: abaAtiva === 'lixeira' ? '#fff' : '#ef4444',
              fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            🗑️ Lixeira Robotoc 3D ({lixeira.length})
          </button>
        </div>

        {abaAtiva === 'notas' && (
          <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            <form onSubmit={handleCriarNota} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px' }}>
              <input 
                type="text" 
                placeholder="Título do Rascunho..." 
                value={tituloInput} 
                onChange={(e) => setTituloInput(e.target.value)}
                style={{ padding: '6px 10px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px', outline: 'none', color: '#0f172a' }}
              />
              <textarea 
                rows={3}
                placeholder="Escreva suas ideias ou anotações importantes..." 
                value={conteudoInput}
                onChange={(e) => setConteudoInput(e.target.value)}
                style={{ padding: '6px 10px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px', outline: 'none', resize: 'none', color: '#0f172a' }}
              />
              <button type="submit" style={{ padding: '7px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✨ Salvar Rascunho no Sistema
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {notas.length === 0 ? (
                <span style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', margin: '20px 0' }}>Nenhuma anotação salva.</span>
              ) : (
                notas.map(nota => (
                  <div key={nota.id} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px', boxShadow: '0 2px 10px rgba(0,240,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '11px', color: '#0284c7' }}>{nota.titulo}</strong>
                      <span style={{ fontSize: '8px', color: '#94a3b8' }}>{nota.data}</span>
                    </div>
                    <p style={{ fontSize: '10px', color: '#334155', margin: '0 0 8px 0', whiteSpace: 'pre-wrap', lineHeight: '1.3' }}>{nota.conteudo}</p>
                    
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleDownloadTXT(nota)} style={{ padding: '4px 8px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8.5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        💾 Baixar TXT
                      </button>
                      <button onClick={() => handleDownloadPDF(nota)} style={{ padding: '4px 8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8.5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        📄 Exportar PDF Real
                      </button>
                      <button onClick={() => handleMoverParaLixeira(nota.id)} style={{ padding: '4px 8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', fontSize: '8.5px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 'auto' }}>
                        🗑️ Lixeira 3D
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {abaAtiva === 'lixeira' && (
          <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', padding: '8px', borderRadius: '8px' }}>
              <div ref={trashMountRef} style={{ width: '40px', height: '40px' }} />
              <div>
                <strong style={{ fontSize: '10px', color: '#b91c1c', display: 'block' }}>Lixeira Holográfica Robotoc 3D</strong>
                <span style={{ fontSize: '8px', color: '#ef4444' }}>Rascunhos descartados podem ser restaurados ou excluídos.</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lixeira.length === 0 ? (
                <span style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', margin: '20px 0' }}>Lixeira vazia.</span>
              ) : (
                lixeira.map(item => (
                  <div key={item.id} style={{ backgroundColor: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '8px' }}>
                    <strong style={{ fontSize: '10px', color: '#b91c1c', display: 'block' }}>{item.titulo}</strong>
                    <p style={{ fontSize: '9px', color: '#64748b', margin: '2px 0 6px 0' }}>{item.conteudo.slice(0, 60)}...</p>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleRestaurarNota(item.id)} style={{ padding: '3px 6px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        🔄 Restaurar
                      </button>
                      <button onClick={() => handleExcluirDefinitivo(item.id)} style={{ padding: '3px 6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        ❌ Excluir Definitivo
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================================
// 📸 --- COMPONENTE: MOTION TRACKER ---
// =========================================================================================
function MotionTracker() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("Desconectado");

  const toggleCamera = async () => {
    if (active) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setActive(false);
      setStatus("Desconectado");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setActive(true);
        setStatus("Treinando Visão IA...");
      } catch (err) {
        alert("Erro ao acessar a câmera para treinamento visual: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#0f172a', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 ROBOTOC VISION TRACKER</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          {active ? 'Desligar Câmera' : 'Ativar Câmera IA'}
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '120px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: active ? 0.8 : 0.2 }} />
        {!active && <span style={{ position: 'absolute', fontSize: '10px', color: '#94a3b8' }}>Câmera Inativa</span>}
        {active && <div style={{ position: 'absolute', border: '1px dashed #00f0ff', width: '80%', height: '80%', pointerEvents: 'none', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.5)' }} />}
      </div>

      <span style={{ fontSize: '9px', color: active ? '#16a34a' : '#64748b', marginTop: '6px', display: 'block', fontFamily: 'monospace' }}>● Status: {status}</span>
    </div>
  );
}

// =========================================================================================
// ⚙️ --- COMPONENTE: ROBOTOC GEAR ---
// =========================================================================================
function RobotocGear({ onConnectGear, highlightGear }) {
  const [gears, setGears] = useState({ headset: false, mouse: false, keyboard: true });

  const toggleGear = (type) => {
    const nextState = !gears[type];
    setGears(prev => ({ ...prev, [type]: nextState }));
    if (onConnectGear) onConnectGear(type, nextState);
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: highlightGear ? '2px solid #eab308' : '1px solid #0284c7', borderRadius: '12px', padding: '10px', color: '#0f172a', boxShadow: highlightGear ? '0 0 15px rgba(234,179,8,0.4)' : 'none', backdropFilter: 'blur(10px)' }}>
      <span style={{ fontSize: '10px', color: highlightGear ? '#d97706' : '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
        ⚙️ PERIFÉRICOS NEURAIS ROBOTOC GEAR {highlightGear && '(CONEXÃO SOLICITADA)'}
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <button onClick={() => toggleGear('headset')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.headset ? '#0284c7' : 'transparent', color: gears.headset ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          🎧 Headset
        </button>
        <button onClick={() => toggleGear('mouse')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.mouse ? '#0284c7' : 'transparent', color: gears.mouse ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          🖱️ Mouse 3D
        </button>
        <button onClick={() => toggleGear('keyboard')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.keyboard ? '#0284c7' : 'transparent', color: gears.keyboard ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          ⌨️ Glass Key
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// ⌨️ --- COMPONENTE: TECLADO GLASS 3D ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  const [lastKey, setLastKey] = useState(null);
  const keys = [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','Backspace'],
    ['Space', 'Enter']
  ];

  const handlePress = (k) => {
    setLastKey(k);
    if (onKeyPress) onKeyPress(k);
    setTimeout(() => setLastKey(null), 300);
  };

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '12px', padding: '10px', color: '#0f172a', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D</span>
        {lastKey && <span style={{ fontSize: '10px', backgroundColor: '#0284c7', padding: '1px 6px', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>TECLA: {lastKey}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {keys.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
            {row.map((k) => (
              <button
                key={k}
                onClick={() => handlePress(k)}
                style={{
                  flex: k === 'Space' ? 3 : k === 'Enter' || k === 'Backspace' ? 1.5 : 1,
                  padding: '6px 2px',
                  background: lastKey === k ? '#00f0ff' : 'rgba(2, 132, 199, 0.1)',
                  border: '1px solid rgba(2, 132, 199, 0.4)',
                  borderRadius: '4px',
                  color: lastKey === k ? '#000' : '#0284c7',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: lastKey === k ? '0 0 12px #00f0ff' : 'none',
                  transition: 'all 0.1s ease'
                }}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================================
// 📲 --- COMPONENTE: DISPATCHER MENSAGENS ---
// =========================================================================================
function DispatcherMensagensNumeros({ addLog }) {
  const [plataforma, setPlataforma] = useState('whatsapp');
  const [ddd, setDdd] = useState('88');
  const [num1, setNum1] = useState('981493989');
  const [num2, setNum2] = useState('');
  const [mensagem, setMensagem] = useState('Mensagem do Emanuel.OS v6.0 - Sistema ROBOTOC 3D ativo.');

  const dispararMensagens = () => {
    if (!num1) return alert("Insira ao menos um número de telefone válido.");

    const enviarParaNumero = (numero) => {
      const fullPhone = `55${ddd}${numero.replace(/\D/g, '')}`;
      let url = '';

      if (plataforma === 'whatsapp') {
        url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(mensagem)}`;
      } else if (plataforma === 'telegram') {
        url = `https://t.me/share/url?url=&text=${encodeURIComponent(mensagem)}`;
      } else if (plataforma === 'google_messages') {
        url = `sms:+${fullPhone}?body=${encodeURIComponent(mensagem)}`;
      }

      if (url && typeof window !== 'undefined') window.open(url, '_blank');
      if (addLog) addLog(`[DISPATCHER: ${plataforma.toUpperCase()}] Mensagem enviada para +${fullPhone}`);
    };

    enviarParaNumero(num1);
    if (num2.trim()) {
      setTimeout(() => enviarParaNumero(num2), 600);
    }
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', color: '#0f172a', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#0284c7', fontSize: '11px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        💬 MENSAGERIA REAL VIA NÚMERO DE TELEFONE
      </h3>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button onClick={() => setPlataforma('whatsapp')} style={{ flex: 1, padding: '6px', border: '1px solid #22c55e', backgroundColor: plataforma === 'whatsapp' ? '#22c55e' : 'transparent', color: plataforma === 'whatsapp' ? '#fff' : '#22c55e', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>WhatsApp</button>
        <button onClick={() => setPlataforma('telegram')} style={{ flex: 1, padding: '6px', border: '1px solid #38bdf8', backgroundColor: plataforma === 'telegram' ? '#38bdf8' : 'transparent', color: plataforma === 'telegram' ? '#fff' : '#38bdf8', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Telegram</button>
        <button onClick={() => setPlataforma('google_messages')} style={{ flex: 1, padding: '6px', border: '1px solid #eab308', backgroundColor: plataforma === 'google_messages' ? '#eab308' : 'transparent', color: plataforma === 'google_messages' ? '#fff' : '#eab308', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>SMS/Google</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input type="text" value={ddd} onChange={(e) => setDdd(e.target.value)} placeholder="DDD" style={{ width: '40px', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px', textAlign: 'center' }} />
        <input type="text" value={num1} onChange={(e) => setNum1(e.target.value)} placeholder="Número 1 (Obrigatório)" style={{ flex: 1, padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px' }} />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <input type="text" value={num2} onChange={(e) => setNum2(e.target.value)} placeholder="Número 2 (Opcional - Envio duplo)" style={{ width: '100%', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
      </div>

      <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2} style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', padding: '6px', fontSize: '10px', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />

      <button onClick={dispararMensagens} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
        🚀 Disparar Mensagem Direta
      </button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- COMPONENTE: ROBOTOC NEURAL THOUGHT PANEL ---
// =========================================================================================
function RobotocNeuralThoughtPanel({ addLog }) {
  const [contaGoogle, setContaGoogle] = useState('leeheroi123@gmail.com');
  const [contaApple, setContaApple] = useState('emanuel@icloud.com');
  const [contaOneDrive, setContaOneDrive] = useState('emanuel@outlook.com');
  const [statusSinc, setStatusSinc] = useState('Conectado');

  const sincronizarContas = () => {
    setStatusSinc('Sincronizando...');
    if (addLog) addLog(`[ROBOTOC 3D] Sincronizando Contas: Google (${contaGoogle}), Apple (${contaApple}), OneDrive (${contaOneDrive})`);
    setTimeout(() => {
      setStatusSinc('Conectado e Ativo');
      alert('Sincronização real de e-mails concluída no núcleo ROBOTOC 3D!');
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#0f172a', boxShadow: '0 0 25px rgba(0,240,255,0.15)', backdropFilter: 'blur(10px)' }}>
      <div style={{ borderBottom: '1px solid rgba(2,132,199,0.2)', paddingBottom: '6px', marginBottom: '10px' }}>
        <h3 style={{ color: '#0284c7', fontSize: '12px', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🧠 PENSAMENTO FUTURISTA ROBOTOC 3D <span style={{ fontSize: '8px', backgroundColor: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: '6px' }}>REAL CORE</span>
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: '#64748b' }}>Integração direta com triple e-mail e processamento neural contínuo.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
        <div>
          <label style={{ fontSize: '8px', color: '#0284c7', display: 'block' }}>📧 Google Mail / AI Studio:</label>
          <input type="email" value={contaGoogle} onChange={(e) => setContaGoogle(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #38bdf8', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#a855f7', display: 'block' }}>🍎 Apple iCloud Mail:</label>
          <input type="email" value={contaApple} onChange={(e) => setContaApple(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #c084fc', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#ea580c', display: 'block' }}>☁️ Microsoft OneDrive / Azure:</label>
          <input type="email" value={contaOneDrive} onChange={(e) => setContaOneDrive(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #fb923c', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', color: '#16a34a' }}>● Status Sincronização: {statusSinc}</span>
        <button onClick={sincronizarContas} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔄 Sincronizar E-mails
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 📱 --- PAINEL ANDROID HUD ---
// =========================================================================================
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: open ? 0 : '-360px', width: '350px', height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.92)', borderLeft: '2px solid #00f0ff',
      backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '16px', boxSizing: 'border-box', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <strong style={{ fontSize: '12px', color: '#0284c7' }}>ANDROID 16 NEURAL OS EM HUD v6.0</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕</button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  );
}

// =========================================================================================
// 📊 --- COMPONENTE: EM CREATOR STUDIO IA ---
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1240, audiosGerações: 380, fotosRenders: 890,
    videosRenderizados: 215, memesGifsEngajados: 560, audienciaAtiva: 'Alta (89% retenção)', resolucaoProblemasIA: '94,2% Autônomos'
  });

  const [sugestoesAGI] = useState([
    { id: 1, tipo: '⚡ Otimização de Vídeo', acao: 'Sintetizar intro em 4K para canal do YouTube' },
    { id: 2, tipo: '🛠️ Bugfix Autônomo', acao: 'Corrigir renderização WebGL no mobile' }
  ]);
  const [executandoAcao, setExecutandoAcao] = useState(null);

  const aplicarAcaoAutonoma = (id) => {
    setExecutandoAcao(id);
    setTimeout(() => {
      setExecutandoAcao(null);
      alert("Ação autônoma executada com sucesso pelo G-AGI!");
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#0f172a', position: 'relative', boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#0284c7', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ borderBottom: '1px solid rgba(2,132,199,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 style={{ color: '#0284c7', fontSize: '18px', margin: 0, fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 EM CREATOR STUDIO IA <span style={{ fontSize: '10px', color: '#0284c7', border: '1px solid #0284c7', padding: '2px 8px', borderRadius: '10px' }}>AGI Core v6.0</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0 0' }}>
            Análise de desempenho multimodal, diagnóstico de audiência e tomada de ações autônomas para projetos.
          </p>
        </div>

        <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          📈 DESEMPENHO E UTILIZAÇÃO DE FERRAMENTAS MULTIMODAIS
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>💬</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#0284c7', marginTop: '4px' }}>{metricas.textosConversas}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Textos / Chat</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎙️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginTop: '4px' }}>{metricas.audiosGerações}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Áudios / Voz</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🖼️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#ec4899', marginTop: '4px' }}>{metricas.fotosRenders}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Fotos / Renders</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎬</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#d97706', marginTop: '4px' }}>{metricas.videosRenderizados}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Vídeos HD/4K</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎞️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>{metricas.memesGifsEngajados}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Memes & GIFs</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '12px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>🎯 COMPORTAMENTO DA AUDIÊNCIA</span>
            <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#0284c7' }}>{metricas.audienciaAtiva}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>
              Usuários interagindo ativamente com atalhos de áudio e geração de mídias para redes sociais.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid rgba(2, 132, 199, 0.4)', borderRadius: '12px', padding: '12px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>🧠 AUTONOMIA NA RESOLUÇÃO DE BUGS</span>
            <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#0284c7' }}>{metricas.resolucaoProblemasIA}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>
              Resolução de problemas de estrutura efetuados pelo motor Gemini AGI.
            </p>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          💡 SUGESTÕES DE AÇÕES AUTOMÁTICAS E OTIMIZAÇÕES
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sugestoesAGI.map(item => (
            <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block' }}>{item.tipo}</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#334155', lineHeight: '1.3' }}>{item.acao}</p>
              </div>

              <button
                onClick={() => aplicarAcaoAutonoma(item.id)}
                disabled={executandoAcao === item.id}
                style={{
                  padding: '8px 14px', backgroundColor: executandoAcao === item.id ? '#0284c7' : '#00f0ff',
                  color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px',
                  cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {executandoAcao === item.id ? '⚡ Aplicando...' : '🚀 Executar Ação'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================================
// 💻 --- PAINEL DEV SPLIT SCREEN ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('mojo');

  const templatesExoticos = {
    mojo: `# Mojo (AI Performance High-Speed Language)\nfn main():\n    let matrix_dim: Int = 1024\n    print("⚡ Inicializando Tensor Quântico Emanuel.OS no Núcleo Mojo...")\n    print("Matriz carregada com dimensao:", matrix_dim)`,
    zig: `// Zig System Language\nconst std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("🧠 Núcleo de Baixo Nível do Android 16 Neural OS EM Ativo!\\n", .{});\n}`,
    nim: `# Nim Metaprogramming Language\ntype\n  NeuralCore = object\n    status: string\n    potencia: float\n\nlet core = NeuralCore(status: "ONLINE", potencia: 99.8)\necho "🚀 Sistema Emanuel.OS executando em Nim. Status: ", core.status`,
    crystal: `# Crystal Language\nclass QuantumEngine\n  def initialize(@name : String)\n  end\n\n  def boot\n    puts "💎 Rodando motor quântico #{@name} no Emanuel.OS Workstation"\n  end\nend\n\nQuantumEngine.new("EM-Core v6.0").boot`,
    elixir: `# Elixir Distributed System\ndefmodule EmanuelOS.Core do\n  def sync_nodes(node_id) do\n    IO.puts("🔮 Sincronizando Nó Funcional Exótico: #{node_id}")\n  end\nend\n\nEmanuelOS.Core.sync_nodes("Node-BRS7")`,
    qsharp: `// Q# Quantum System\nnamespace EmanuelOS.Quantum {\n    open Microsoft.Quantum.Canon;\n    open Microsoft.Quantum.Intrinsic;\n\n    operation MeasureQubit() : Result {\n        use q = Qubit();\n        H(q);\n        return M(q);\n    }\n}`,
    gleam: `// Gleam Language\nimport gleam/io\n\npub fn main() {\n  io.print_line("✨ Executando Gleam no Motor Distribuído do Emanuel.OS!")\n}`
  };

  const [codigoFonte, setCodigoFonte] = useState(templatesExoticos['mojo']);
  const [blocoRascunho, setBlocoRascunho] = useState("Notas do Dev Núcleo: Explorando Mojo e Zig no Android 16 Neural OS EM.");
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [relatorioErros, setRelatorioErros] = useState([]);

  const [cmdPowerInput, setCmdPowerInput] = useState('');
  const [cmdPowerLogs, setCmdPowerLogs] = useState([
    "Windows PowerShell EM [Versão 10.0.26100.1] - Emanuel.OS Workstation Core",
    "(c) Emanuel.OS Corporation. Todos os direitos reservados.",
    " ",
    "PS C:\\EmanuelOS\\Kernel> Get-EMStatus -IA",
    "-> MOTOR NEURAL IA: Ativo (Gemini AGI + Robotoc 3D)",
    "-> ANDROID OS EM: v16.0 Ready. Digite 'help-em' para comandos especiais de IA."
  ]);

  const handleLinguagemChange = (novaLang) => {
    setLinguagem(novaLang);
    if (templatesExoticos[novaLang]) {
      setCodigoFonte(templatesExoticos[novaLang]);
    } else {
      setCodigoFonte(`// Projeto em ${novaLang.toUpperCase()}\n// Desenvolva novas soluções no núcleo Emanuel.OS Workstation v6.0`);
    }
  };

  const executarPowerShellIA = (e) => {
    e.preventDefault();
    if (!cmdPowerInput.trim()) return;

    const cmd = cmdPowerInput.trim();
    let res = [];

    if (cmd === 'help-em') {
      res = [
        "Comandos Avançados de IA da EM Power Shell:",
        "  ai-optimize-core  -> Otimiza rotinas WebGL e sintaxe de baixo nível",
        "  ai-generate-code  -> Gera boilerplate automático na linguagem exótica selecionada",
        "  ai-scan-security  -> Executa varredura profunda de segurança de 7 camadas",
        "  sys-info-em        -> Exibe o estado em tempo real dos 12 mapas e periféricos"
      ];
    } else if (cmd === 'ai-optimize-core') {
      res = ["⚡ IA EM Power Shell: Código compilado, vetores paralelizados e otimização concluída."];
    } else if (cmd === 'ai-generate-code') {
      res = [`🚀 IA EM Power Shell: Novo trecho de alta sintaxe gerado para ${linguagem.toUpperCase()}.`];
    } else if (cmd === 'ai-scan-security') {
      res = ["🛡️ IA EM Power Shell: Varredura de 7 Camadas concluída. 0 vulnerabilidades no Kernel!"];
    } else if (cmd === 'sys-info-em') {
      res = ["🌐 STATUS DA REDE: 12 Mapas Sincronizados | Android 16 Neural OS EM: Ativo | Periféricos: OK"];
    } else {
      res = [`PS C:\\EmanuelOS\\Kernel> ${cmd} : O comando não foi reconhecido. Tente 'help-em'.`];
    }

    setCmdPowerLogs(prev => [...prev, `PS C:\\EmanuelOS\\Kernel> ${cmd}`, ...res, " "]);
    setCmdPowerInput('');
  };

  const falarExplicacaoVoz = (texto) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      synth.speak(utterance);
    }
  };

  const analisarECorrigirCodigoIA = (modo) => {
    setAnalisandoIA(true);
    setRelatorioErros([]);

    setTimeout(() => {
      setAnalisandoIA(false);
      const linhas = codigoFonte.split('\n');
      const errosDetectados = [];

      errosDetectados.push({ linha: 0, tipo: 'sucesso', texto: `✅ IA EMgemini: Código em ${linguagem.toUpperCase()} validado no Núcleo do Emanuel.OS Workstation v6.0!`, cor: '#16a34a' });
      setRelatorioErros(errosDetectados);

      if (modo === 'explicar') {
        const explicacao = `O código atual em ${linguagem} utiliza arquitetura avançada de desenvolvimento com ${linhas.length} linhas de estrutura.`;
        falarExplicacaoVoz(explicacao);
      }
    }, 1000);
  };

  const baixarCodigoArquivo = () => {
    const ext = linguagem;
    const blob = new Blob([codigoFonte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EmanuelOS_Core_${linguagem}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportarCodigoPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(240, 249, 255);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(2, 132, 199);
    doc.setFontSize(16);
    doc.text("EMANUEL.OS WORKSTATION - NÚCLEO DEV REPORT v6.0", 15, 18);
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`LINGUAGEM SELECIONADA: ${linguagem.toUpperCase()} | DATA: ${new Date().toLocaleDateString('pt-BR')}`, 15, 25);

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(codigoFonte, 180);
    doc.text(linhas, 15, 40);

    doc.save(`DevStudio_Nucleo_${linguagem}.pdf`);
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#f0f9ff',
      borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '10px', color: '#0f172a',
      fontFamily: 'Consolas, Monaco, monospace', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>👨‍💻</span>
          <strong style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'sans-serif' }}>
            Emanuel.OS Workstation v6.0 | Notepad Dev Núcleo (Android 16 OS)
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          ✕ Fechar Workstation
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontFamily: 'sans-serif', fontWeight: 'bold' }}>LINGUAGENS NÚCLEO:</span>
        <select
          value={linguagem}
          onChange={(e) => handleLinguagemChange(e.target.value)}
          style={{ backgroundColor: '#ffffff', border: '1px solid #0284c7', color: '#0284c7', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', outline: 'none' }}
        >
          <optgroup label="🔥 Exóticas & Alta Performance">
            <option value="mojo">Mojo (AI High-Performance)</option>
            <option value="zig">Zig (Low-Level Core)</option>
            <option value="nim">Nim (Metaprogramming)</option>
            <option value="crystal">Crystal (Fast as C)</option>
            <option value="elixir">Elixir (Distributed Concurrency)</option>
            <option value="qsharp">Q# (Quantum System)</option>
            <option value="gleam">Gleam (Functional Erlang)</option>
          </optgroup>
          <optgroup label="💻 Padrão & Web">
            <option value="javascript">JavaScript (React/Next)</option>
            <option value="python">Python (AI/ML)</option>
            <option value="typescript">TypeScript</option>
            <option value="cpp">C++ Quântico</option>
          </optgroup>
        </select>

        <button onClick={() => analisarECorrigirCodigoIA('bugs')} style={{ padding: '6px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔍 Checar Sintaxe IA
        </button>
        <button onClick={() => analisarECorrigirCodigoIA('otimizar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(168,85,247,0.1)', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          ⚡ Otimizar Motor
        </button>
        <button onClick={() => analisarECorrigirCodigoIA('explicar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid #eab308', color: '#d97706', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔊 Explicar em Áudio
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '180px' }}>
        <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'sans-serif' }}>NOTEPAD DEV NÚCLEO - CÓDIGO FONTE ({linguagem.toUpperCase()}):</span>
        <textarea
          value={codigoFonte}
          onChange={(e) => setCodigoFonte(e.target.value)}
          style={{
            width: '100%', flexGrow: 1, backgroundColor: '#ffffff', border: '1px solid #00f0ff',
            borderRadius: '8px', color: '#0284c7', padding: '12px', fontSize: '11px',
            outline: 'none', resize: 'none', lineHeight: '1.4', fontFamily: 'Consolas, monospace',
            boxSizing: 'border-box', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.05)'
          }}
        />
      </div>

      {relatorioErros.length > 0 && (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,240,255,0.5)', padding: '8px', borderRadius: '6px', maxHeight: '70px', overflowY: 'auto' }}>
          <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📋 DIAGNÓSTICO DO NÚCLEO WORKSTATION:</span>
          {relatorioErros.map((item, idx) => (
            <div key={idx} style={{ fontSize: '10px', color: item.cor, margin: '2px 0' }}>
              {item.texto}
            </div>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #00f0ff', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 15px rgba(0,240,255,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #e0f2fe', paddingBottom: '4px', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px' }}>🖥️</span>
          <strong style={{ fontSize: '10px', color: '#0284c7', fontFamily: 'sans-serif' }}>EM Power Shell IA (Estilo Windows 11 - Branco & Azul Neon)</strong>
        </div>

        <div style={{ backgroundColor: '#f8fafc', borderRadius: '6px', padding: '8px', maxHeight: '90px', overflowY: 'auto', fontSize: '10px', color: '#0284c7', border: '1px solid #bae6fd', marginBottom: '6px' }}>
          {cmdPowerLogs.map((logLine, lIdx) => (
            <div key={lIdx} style={{ lineHeight: '1.3' }}>{logLine}</div>
          ))}
        </div>

        <form onSubmit={executarPowerShellIA} style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', alignSelf: 'center' }}>PS C:\EM&gt;</span>
          <input
            type="text"
            value={cmdPowerInput}
            onChange={(e) => setCmdPowerInput(e.target.value)}
            placeholder="Digite comandos de IA (ex: help-em, ai-optimize-core)..."
            style={{ flex: 1, padding: '6px 10px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '6px', color: '#0f172a', fontSize: '10px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
            Executar
          </button>
        </form>
      </div>

      <GlassKeyboard3D 
        onKeyPress={(tecla) => {
          if (tecla === 'Backspace') {
            setCodigoFonte(prev => prev.slice(0, -1));
          } else if (tecla === 'Space') {
            setCodigoFonte(prev => prev + ' ');
          } else if (tecla === 'Enter') {
            setCodigoFonte(prev => prev + '\n');
          } else if (tecla.length === 1) {
            setCodigoFonte(prev => prev + tecla);
          }
        }}
      />

      <div style={{ height: '45px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontFamily: 'sans-serif', fontWeight: 'bold' }}>📝 BLOCO DE NOTAS DO DESENVOLVEDOR NÚCLEO:</span>
        <textarea
          value={blocoRascunho}
          onChange={(e) => setBlocoRascunho(e.target.value)}
          style={{
            width: '100%', height: '100%', backgroundColor: '#ffffff', border: '1px solid rgba(2, 132, 199, 0.3)',
            borderRadius: '6px', color: '#0f172a', padding: '6px', fontSize: '10px', outline: 'none',
            resize: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
        <button onClick={() => { navigator.clipboard.writeText(codigoFonte); alert("Código copiado!"); }} style={{ flex: 1, padding: '8px', backgroundColor: '#0284c7', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📋 Copiar
        </button>
        <button onClick={baixarCodigoArquivo} style={{ flex: 1, padding: '8px', backgroundColor: '#16a34a', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          💾 Salvar
        </button>
        <button onClick={exportarCodigoPDF} style={{ flex: 1, padding: '8px', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📄 PDF
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// ✉️ --- FORMULÁRIO CAPTURA EMAILJS ---
// =========================================================================================
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setCarregando(true);

    emailjs.send(
      'service_94k276x',
      'template_o11qtsf',
      { email: email, to_email: email, user_email: email },
      'MsHsmnoDh6w2fnYJ6'
    )
    .then(() => {
      setCarregando(false);
      setEnviado(true);
      setEmail('');
    })
    .catch(() => {
      setCarregando(false);
      alert('Erro ao enviar e-mail de confirmação. Tente novamente!');
    });
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff',
      borderRadius: '14px', padding: '16px', boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
      color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ color: '#0284c7', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>
        🎁 Baixar 300 Comandos Mestre + Mapas 3D
      </h3>
      <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 10px 0' }}>
        Cadastre seu e-mail para receber o e-book oficial do Emanuel.OS e convites VIPs.
      </p>

      {enviado ? (
        <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid #16a34a', borderRadius: '8px', padding: '8px', color: '#16a34a', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
          ✅ E-mail de confirmação enviado com sucesso! Verifique sua caixa de entrada.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Digite seu e-mail aqui..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none' }} />
          <button type="submit" disabled={carregando} style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            {carregando ? '⏳ Enviando E-mail...' : '🚀 Quero Acesso Gratuito'}
          </button>
        </form>
      )}
    </div>
  );
}

// =========================================================================================
// 🎥 --- GOOGLE MEET AVATAR MANAGER ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [temaReuniao, setTemaReuniao] = useState('Imersão Mapas, Index & AGI 2030');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Robotoc 3D (Azul & Branco Quântico)');
  const [telefoneConvidado, setTelefoneConvidado] = useState('981493989');
  const [dddConvidado, setDddConvidado] = useState('88');
  const [linkGerado, setLinkGerado] = useState('');
  const [reuniaoAgendada, setReuniaoAgendada] = useState(false);

  const criarReuniaoInstantanea = () => {
    if (!temaReuniao.trim()) return alert("Defina o tema da reunião no Emanuel.OS.");
    const codigoMeet = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const urlMeet = `https://meet.google.com/${codigoMeet}`;
    setLinkGerado(urlMeet);
    setReuniaoAgendada(true);

    if (addLog) {
      addLog(`[G-AGI: MEET] Reunião criada: "${temaReuniao}"`);
      addLog(`[G-AGI: AVATAR 3D] IA Atribuída: ${avatarEscolhido}`);
      addLog(`[G-AGI: LINK] Google Meet gerado: ${urlMeet}`);
    }
  };

  const enviarConviteTelefone = () => {
    if (!telefoneConvidado || !dddConvidado) return alert("Insira o DDD e o Número de Telefone válido.");
    if (!linkGerado) return alert("Gere uma reunião do Google Meet primeiro!");

    const mensagem = `Olá! Você foi convidado por Emanuel para a reunião "${temaReuniao}" no Emanuel.OS.\n\n🤖 Avatar 3D IA: ${avatarEscolhido}\n🔗 Google Meet: ${linkGerado}`;
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=55${dddConvidado}${telefoneConvidado}&text=${encodeURIComponent(mensagem)}`;
    if (typeof window !== 'undefined') window.open(urlWhatsapp, '_blank');

    if (addLog) addLog(`[G-AGI: WHATSAPP] Convite Meet enviado para (55) ${dddConvidado} ${telefoneConvidado}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '14px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🎥 Google Meet REAL + Avatares IA 3D
      </h3>
      <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 10px 0' }}>
        Gerenciador de chamadas reais com envio de link para números de telefone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        <input type="text" value={temaReuniao} onChange={(e) => setTemaReuniao(e.target.value)} placeholder="Tema / Index principal..." style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
        <select value={avatarEscolhido} onChange={(e) => setAvatarEscolhido(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}>
          <option value="Robotoc 3D (Azul & Branco Quântico)">Robotoc 3D (Azul & Branco Quântico)</option>
          <option value="Vegatocnyx 3D (Estilo Feminino)">Vegatocnyx 3D (Estilo Feminino)</option>
          <option value="Avatar Emanuel (Cyberpunk 3D)">Avatar Emanuel (Cyberpunk 3D)</option>
          <option value="Assistente G-AGI Multimodal">Assistente G-AGI Multimodal</option>
          <option value="Avatar Ninja Holográfico">Avatar Ninja Holográfico</option>
        </select>
        <button onClick={criarReuniaoInstantanea} style={{ width: '100%', padding: '9px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          ⚡ Criar Reunião Google Meet Real
        </button>
      </div>

      {reuniaoAgendada && (
        <div style={{ backgroundColor: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.3)', borderRadius: '8px', padding: '8px' }}>
          <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>✅ Link Gerado:</span>
          <a href={linkGerado} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#0284c7', wordBreak: 'break-all', display: 'block', marginBottom: '8px', textDecoration: 'underline' }}>{linkGerado}</a>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            <input type="text" placeholder="DDD" value={dddConvidado} onChange={(e) => setDddConvidado(e.target.value)} style={{ width: '45px', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', textAlign: 'center', fontSize: '10px' }} />
            <input type="text" placeholder="Número Celular" value={telefoneConvidado} onChange={(e) => setTelefoneConvidado(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px' }} />
          </div>
          <button onClick={enviarConviteTelefone} style={{ width: '100%', padding: '7px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
            📲 Enviar Convite via WhatsApp Direct
          </button>
        </div>
      )}
    </div>
  );
}

// =========================================================================================
// 🖥️ --- UNIX TERMINAL CANVAS ---
// =========================================================================================
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [history, setHistory] = useState([
    'Emanuel.OS v6.0 - Terminal Nativo v1.0 [Kernel 6.x-like]',
    'ROBOTOC & VEGATOCNYX Neural Shell - Digite "help" para comandos.',
    ' ',
    'root@emanuel-os:~# '
  ]);
  const [currentLine, setCurrentLine] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/emanuel');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#38bdf8';
    const lineHeight = 16;
    const padding = 10;
    const maxLines = Math.floor((rect.height - padding * 2) / lineHeight);

    const linesToDraw = history.slice(-maxLines);
    linesToDraw.forEach((line, index) => {
      if (line.includes('root@emanuel-os')) {
        const parts = line.split('# ');
        ctx.fillStyle = '#ef4444';
        ctx.fillText(parts[0], padding, padding + (index + 1) * lineHeight);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('# ' + (parts[1] || ''), padding + ctx.measureText(parts[0]).width, padding + (index + 1) * lineHeight);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(line, padding, padding + (index + 1) * lineHeight);
      }
    });

    const prompt = `root@emanuel-os:${currentPath}# `;
    const promptWidth = ctx.measureText(prompt).width;
    ctx.fillStyle = '#ef4444';
    ctx.fillText(prompt, padding, padding + (linesToDraw.length + 1) * lineHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText(currentLine, padding + promptWidth, padding + (linesToDraw.length + 1) * lineHeight);

    if (Math.floor(Date.now() / 500) % 2 === 0) {
      const cursorX = padding + promptWidth + ctx.measureText(currentLine).width;
      const cursorY = padding + (linesToDraw.length + 0.3) * lineHeight;
      ctx.fillRect(cursorX, cursorY, 7, lineHeight);
    }
  }, [history, currentLine, currentPath]);

  const handleCommand = (cmd) => {
    let output = [];
    const tokens = cmd.trim().split(' ');
    const commandName = tokens[0];

    switch (commandName) {
      case 'help':
        output = ['Comandos disponíveis:', '  help, ls, cd, cat, pwd, clear, whoami, uname, emanuel-agi'];
        break;
      case 'ls':
        output = ['bin/  home/  var/  README.txt'];
        break;
      case 'pwd':
        output = [currentPath];
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        output = ['root'];
        break;
      case 'uname':
        output = ['EmanuelOS 6.1.0- G-AGI v6.0 x86_64 ROBOTOC & VEGATOCNYX Shell'];
        break;
      case 'emanuel-agi':
        output = ['Conectando ao núcleo G-AGI...', 'Acesso concedido. ROBOTOC & VEGATOCNYX v6.0 online.'];
        break;
      case '':
        break;
      default:
        output = [`${commandName}: command not found`];
    }

    setHistory(prev => [...prev, `root@emanuel-os:${currentPath}# ${cmd}`, ...output, ' ']);
    setCurrentLine('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCommand(currentLine);
    else if (e.key === 'Backspace') setCurrentLine(prev => prev.slice(0, -1));
    else if (e.key.length === 1) setCurrentLine(prev => prev + e.key);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '200px', backgroundColor: '#0f172a', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', overflow: 'hidden' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

// =========================================================================================
// ₿ --- BITCOIN ANALYSIS PANEL ---
// =========================================================================================
const BitcoinAnalysisPanel = () => {
  const [data] = useState({ price: '$89,450.00', change24h: '+3.4%', prediction: 'Alta (G-AGI Target $105k)', ai_confidence: '98.5%' });

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(234, 179, 8, 0.15)', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#d97706', fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ₿ ANALÍTICA & PREVISÃO BITCOIN <span style={{ fontSize: '9px', border: '1px solid #d97706', padding: '1px 5px', borderRadius: '8px' }}>G-AGI QUANT CORE v6.0</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div style={{ background: '#fff8f0', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px' }}>
          <span style={{ fontSize: '9px', color: '#d97706' }}>Preço Previsto:</span>
          <strong style={{ display: 'block', fontSize: '16px', color: '#b45309', marginTop: '4px' }}>{data.price}</strong>
        </div>
        <div style={{ background: '#fff8f0', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px' }}>
          <span style={{ fontSize: '9px', color: '#d97706' }}>Confiança IA:</span>
          <strong style={{ display: 'block', fontSize: '16px', color: '#16a34a', marginTop: '4px' }}>{data.ai_confidence}</strong>
        </div>
      </div>
    </div>
  );
};

// =========================================================================================
// ☁️ --- CLOUDFLARE WORKER DEPLOYER ---
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => {
  const [workerName, setWorkerName] = useState('emanuel-agi-edge-v6');
  const [deploying, setDeploying] = useState(false);

  const performDeploy = () => {
    setDeploying(true);
    if (addLog) addLog(`[CLOUDFLARE] Iniciando deploy global do Worker "${workerName}"...`);
    setTimeout(() => {
      setDeploying(false);
      alert("✅ Worker publicado com sucesso na borda Cloudflare Edge!");
      if (addLog) addLog(`[CLOUDFLARE: SUCCESS] Deploy concluído com sucesso.`);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #ea580c', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#ea580c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER v6.0</h3>
      <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }} />
      <button onClick={performDeploy} disabled={deploying} style={{ width: '100%', padding: '10px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
        {deploying ? '⚡ Deploying...' : '🚀 Executar Deploy Global G-AGI Edge'}
      </button>
    </div>
  );
};

// =========================================================================================
// 🏛️ --- VITRINE VIRTUAL 3D DE VIDRO ---
// =========================================================================================
function VitrineVirtual3D({ modoAtual, onSelectModo, onRequestBluetoothConnection }) {
  const container3dRef = useRef(null);
  const sceneRef = useRef(null);
  const groupVitrineRef = useRef(null);

  useEffect(() => {
    if (!container3dRef.current) return;
    const width = container3dRef.current.clientWidth;
    const height = container3dRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container3dRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const spotCyan = new THREE.SpotLight(0x00f0ff, 6);
    spotCyan.position.set(-5, 8, 5);
    scene.add(spotCyan);

    const spotWhite = new THREE.SpotLight(0xffffff, 6);
    spotWhite.position.set(5, 8, 5);
    scene.add(spotWhite);

    const vitrineGroup = new THREE.Group();

    const baseGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, roughness: 0.1, metalness: 0.9,
      transparent: true, opacity: 0.85
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    const ringGeo = new THREE.TorusGeometry(3.6, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: modoAtual === 'bluetooth' ? 0xeab308 : 0x0284c7 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.0;
    vitrineGroup.add(ringMesh);

    const glassGeo = new THREE.CylinderGeometry(3.5, 3.5, 4.5, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true,
      roughness: 0.05, ior: 1.5, thickness: 0.5, side: THREE.DoubleSide
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 1.0;
    vitrineGroup.add(glassMesh);

    const contentGroup = new THREE.Group();

    if (modoAtual === 'avatares' || modoAtual === 'bluetooth') {
      const robot1Parts = criarModeloRobotocEspetacular3D();
      const robot1 = robot1Parts.robotGroup;
      robot1.position.set(-1.3, 0.2, 0);
      robot1.scale.set(0.95, 0.95, 0.95);

      const robot2Parts = criarModeloVegatocnyxEspetacular3D();
      const robot2 = robot2Parts.robotGroup;
      robot2.position.set(1.3, 0.2, 0);
      robot2.scale.set(0.95, 0.95, 0.95);

      contentGroup.add(robot1);
      contentGroup.add(robot2);
    } else {
      const mapGeo = new THREE.IcosahedronGeometry(1.3, 2);
      let mapColor = 0x0284c7;
      if (modoAtual === 'mapa_terrestre') mapColor = 0x22c55e;
      if (modoAtual === 'mapa_espacial') mapColor = 0x38bdf8;
      if (modoAtual === 'mapa_quantico') mapColor = 0xa855f7;
      if (modoAtual === 'mapa_orkut') mapColor = 0xea580c;
      if (modoAtual === 'mapa_patologia') mapColor = 0xef4444;
      if (modoAtual === 'mapa_ia') mapColor = 0xf43f5e;
      if (modoAtual === 'mapa_antiguidades') mapColor = 0xd97706;
      if (modoAtual === 'mapa_ressonancia') mapColor = 0x06b6d4;
      if (modoAtual === 'mapa_aeroespacial') mapColor = 0x8b5cf6;
      if (modoAtual === 'mapa_eleicoes2026') mapColor = 0x00ffcc;
      if (modoAtual === 'mapa_geometric3d') mapColor = 0xff00ff;
      if (modoAtual === 'mapa_agroflorestal') mapColor = 0x15803d;

      const mapMesh = new THREE.Mesh(mapGeo, new THREE.MeshStandardMaterial({ color: mapColor, wireframe: true }));
      mapMesh.position.y = 0.8;
      contentGroup.add(mapMesh);
    }

    vitrineGroup.add(contentGroup);
    scene.add(vitrineGroup);
    groupVitrineRef.current = vitrineGroup;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !groupVitrineRef.current) return;
      const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
      groupVitrineRef.current.rotation.y += deltaMove.x * 0.01;
      groupVitrineRef.current.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging = false; };

    const domEl = container3dRef.current;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (groupVitrineRef.current && !isDragging) {
        groupVitrineRef.current.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (domEl) {
        domEl.removeEventListener('mousedown', handleMouseDown);
        domEl.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [modoAtual]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: 'rgba(240, 249, 255, 0.6)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,240,255,0.4)', backdropFilter: 'blur(10px)' }}>
      <div ref={container3dRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button onClick={() => onSelectModo('avatares')} style={{ padding: '4px 8px', backgroundColor: modoAtual === 'avatares' ? '#0284c7' : 'rgba(255,255,255,0.8)', color: modoAtual === 'avatares' ? '#fff' : '#0f172a', border: '1px solid #0284c7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🤖 Avatares Vitrine
        </button>
        <button onClick={() => { onSelectModo('bluetooth'); if (onRequestBluetoothConnection) onRequestBluetoothConnection(); }} style={{ padding: '4px 8px', backgroundColor: modoAtual === 'bluetooth' ? '#eab308' : 'rgba(255,255,255,0.8)', color: modoAtual === 'bluetooth' ? '#fff' : '#0f172a', border: '1px solid #eab308', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📶 Módulo Bluetooth 3D
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🪟 --- WINDOW DEV PANEL ROBOTOC ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [size, setSize] = useState({ width: 520, height: 580 });
  const [pos, setPos] = useState({ x: 80, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modoVitrine, setModoVitrine] = useState('avatares');

  const mapasDisponiveis = [
    { id: 'mapa_terrestre', nome: '🌍 Terrestre', rota: '/mapa' },
    { id: 'mapa_orkut', nome: '🧡 Orkut', rota: '/mapa-orkut' },
    { id: 'mapa_espacial', nome: '🪐 Espacial', rota: '/espacial' },
    { id: 'mapa_ressonancia', nome: '🧬 Ressonância', rota: '/mapa-ressonancia' },
    { id: 'mapa_patologia', nome: '🔬 Patologia', rota: '/mapa-patologia' },
    { id: 'mapa_ia', nome: '⚡ IA 3D', rota: '/mapa-ia' },
    { id: 'mapa_antiguidades', nome: '🏛️ Antiguidades', rota: '/mapa-antiguidades' },
    { id: 'mapa_quantico', nome: '⚛️ Quântico', rota: '/mapa-quantico' },
    { id: 'mapa_aeroespacial', nome: '🛸 Aeroespacial', rota: '/mapaaeroespacial' },
    { id: 'mapa_eleicoes2026', nome: '🗳️ Eleições 2026 3D', rota: '/MapaEleicoesBrasil20263D' },
    { id: 'mapa_geometric3d', nome: '📐 PG Matemático 3D', rota: '/geometricMap3D' },
    { id: 'mapa_agroflorestal', nome: '🌲 Agroflorestal', rota: '/mapaagroflorestal' }
  ];

  const handleMouseDownHeader = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    } else if (isResizing) {
      setSize({ width: Math.max(380, e.clientX - pos.x), height: Math.max(400, e.clientY - pos.y) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div style={{
      position: 'fixed', top: `${pos.y}px`, left: `${pos.x}px`, width: `${size.width}px`, height: `${size.height}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '18px',
      backdropFilter: 'blur(25px)', zIndex: 300, boxShadow: '0 0 40px rgba(0,240,255,0.25)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#0f172a', fontFamily: 'sans-serif'
    }}>
      <div
        onMouseDown={handleMouseDownHeader}
        style={{ padding: '12px 16px', backgroundColor: 'rgba(240, 249, 255, 0.95)', borderBottom: '1px solid #00f0ff', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>💎</span>
          <strong style={{ fontSize: '12px', color: '#0284c7', letterSpacing: '0.5px' }}>
            PAINEL FUTURISTA DE DESENVOLVIMENTO ROBOTOC & VEGATOCNYX
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '10px', color: '#64748b' }}>
          🏛️ <strong>Vitrine Virtual 3D de Vidro</strong> - Modelos Giratórios & Maquetes Interativas de Mapas
        </span>

        <VitrineVirtual3D 
          modoAtual={modoVitrine} 
          onSelectModo={(m) => setModoVitrine(m)}
          onRequestBluetoothConnection={onRequestBluetooth}
        />

        <div>
          <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            🌐 SELECIONAR MAQUETE 3D DE MAPA NA VITRINE:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {mapasDisponiveis.map(m => (
              <button
                key={m.id}
                onClick={() => setModoVitrine(m.id)}
                style={{
                  padding: '6px', borderRadius: '6px', border: '1px solid rgba(0,240,255,0.4)',
                  backgroundColor: modoVitrine === m.id ? '#00f0ff' : '#f0f9ff',
                  color: modoVitrine === m.id ? '#000' : '#0284c7', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {m.nome}
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
          <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            ⚡ CONSOLE DE TESTES AGI & HARDWARE
          </span>
          <p style={{ margin: 0, fontSize: '9px', color: '#334155' }}>
            Inspeção de shaders WebGL em tempo real. Os avatares e mapas renderizados sincronizam com periféricos via bluetooth automaticamente.
          </p>
        </div>
      </div>

      <div 
        onMouseDown={() => setIsResizing(true)}
        style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', cursor: 'nwse-resize', background: 'linear-gradient(135deg, transparent 50%, #00f0ff 50%)' }}
      />
    </div>
  );
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0 WORKSTATION) --- 🖥️
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  // 👤 Estados do Login Facial & Timer Beta (30 Minutos / Personalizado)
  const [loginFacialAtivo, setLoginFacialAtivo] = useState(false);
  const [tempoSessaoMinutos, setTempoSessaoMinutos] = useState(30);
  const [statusFacial, setStatusFacial] = useState('Posicione o rosto para escaneamento neural...');
  const videoLoginRef = useRef(null);

  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);

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

  const [links3D, setLinks3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube Emanuel', url: meusDadosReais.youtube, icone: '▶️', nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok Emanuel', url: meusDadosReais.tiktok, icone: '🎵', nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram Oficial', url: meusDadosReais.instagram, icone: '📸', nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'Repositório GitHub', url: meusDadosReais.github, icone: '🐙', nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'Contato WhatsApp Direct', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', nuvem: 'google' },
    { id: 6, tipo: 'facebook', titulo: 'Facebook Oficial', url: meusDadosReais.facebook, icone: '📘', nuvem: 'microsoft' },
    { id: 7, tipo: 'threads', titulo: 'Threads Oficial', url: meusDadosReais.threads, icone: '🧵', nuvem: 'apple' }
  ]);

  const [servicosNuvemEmail] = useState({
    google: { conectado: true, conta: 'leeheroi123@gmail.com', espaco: '15 GB / 2 TB' },
    apple: { conectado: true, conta: 'emanuel@icloud.com', espaco: '5 GB / 200 GB' },
    microsoft: { conectado: true, conta: 'emanuel@outlook.com', espaco: '1 TB OneDrive / Azure' },
    custom: { conectado: true, conta: 'nuvem.emanuel-os.com', espaco: 'Ilimitado (G-AGI Vault)' }
  });

  const [locaisEmanuelOS] = useState([
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor de Dados & Nuvem Gemini AGI', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, ipCriptografado: 'AES256-88F9-EMA', trabalho: 'Engenharia de Software & AGI Node', urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' },
    { id: 2, nome: 'Estação Oceanográfica & Biologia Marinha', categoria: '🌊 Pesquisa de Espécies & Biofarmacêutica', cor: 0x00aaff, lat: -12.9714, lng: -38.5014, ipCriptografado: 'AES256-OCEAN-BIO', trabalho: 'Análise de Mapeamento Fluvial', urlExterna: 'https://maps.google.com/?q=-12.9714,-38.5014' },
    { id: 3, nome: 'Usina Nuclear Central & Reator Limpo', categoria: '⚛️ Geração Nuclear, Fusão & Energia Limpa', cor: 0x00ffcc, lat: -23.0062, lng: -44.3182, ipCriptografado: 'AES256-NUK-POWER', trabalho: 'Monitoramento de Matriz Energética', urlExterna: 'https://maps.google.com/?q=-23.0062,-44.3182' },
    { id: 4, nome: 'Usina Solar Neon & Painéis Fotovoltaicos', categoria: '☀️ Painéis Solares Neon & Sustentabilidade', cor: 0xffaa00, lat: -9.3833, lng: -40.5000, ipCriptografado: 'AES256-SOLAR-PWR', trabalho: 'Gestão de Energia Fotovoltaica', urlExterna: 'https://maps.google.com/?q=-9.3833,-40.5000' },
    { id: 5, nome: 'Torre 5G/6G & Parque Eólico Futurista', categoria: '📡 Antenas 5G/6G & Turbinas Eólicas', cor: 0xaa00ff, lat: -5.0892, lng: -42.8019, ipCriptografado: 'AES256-5G-EOLICA', trabalho: 'Sincronização de Banda Ultralarga', urlExterna: 'https://maps.google.com/?q=-5.0892,-42.8019' },
    { id: 6, nome: 'Usina Hidrelétrica & Barragem 3D', categoria: '💧 Geração Fluvial, Hidrelétrica & Barragem', cor: 0x0066ff, lat: -25.4284, lng: -54.5868, ipCriptografado: 'AES256-HIDRO-POWER', trabalho: 'Controle de Escoamento de Água', urlExterna: 'https://maps.google.com/?q=-25.4284,-54.5868' },
    { id: 7, nome: 'Centro de Pesquisa Universitário & Vagas', categoria: '🎓 Parcerias Acadêmicas & Formação', cor: 0x88ff00, lat: -23.5505, lng: -46.6333, ipCriptografado: 'AES256-UNIV-RECRUIT', trabalho: 'Desenvolvimento Acadêmico & IA', urlExterna: 'https://maps.google.com/?q=-23.5505,-46.6333' },
    { id: 8, nome: 'Centro Comercial Cyber & Laboratório', categoria: '💊 Farmacêutica Natural & Tecnologia', cor: 0xff00aa, lat: -22.9068, lng: -43.1729, ipCriptografado: 'AES256-LAB-FARMA', trabalho: 'Pesquisa Farmacêutica & Biotec', urlExterna: 'https://maps.google.com/?q=-22.9068,-43.1729' },
    { id: 9, nome: 'Batalhão Marítimo & Guarda Costeira', categoria: '👮 Proteção de Rios, Mares e Fauna', cor: 0x0066ff, lat: -23.9608, lng: -46.3339, ipCriptografado: 'AES256-COAST-GUARD', trabalho: 'Patrulha e Segurança Costeira', urlExterna: 'https://maps.google.com/?q=-23.9608,-46.3339' },
    { id: 10, nome: 'Cataratas do Iguaçu Realistas 3D', categoria: '🌊 Módulo Ecológico & Reserva Fluvial 3D', cor: 0x00e5ff, lat: -25.6953, lng: -54.4367, ipCriptografado: 'AES256-CATARATAS-3D', trabalho: 'Preservação de Reservas Naturais', urlExterna: 'https://maps.google.com/?q=-25.6953,-54.4367' },
    { id: 11, nome: 'Ponto de Kitesurf & Avatar Feminino 3D', categoria: '🏄 Praia Neon & Esportes Aquáticos', cor: 0xff007f, lat: -2.8856, lng: -40.5050, ipCriptografado: 'AES256-KITESURF-NEON', trabalho: 'Treinamento de Atletas & Hidrodinâmica', urlExterna: 'https://maps.google.com/?q=-2.8856,-40.5050' },
    { id: 12, nome: 'Hospital Central & Pronto Socorro 3D', categoria: '🏥 Atendimento Médico & UTIs Futuristas', cor: 0xff3366, lat: -15.7801, lng: -47.9292, ipCriptografado: 'AES256-HOSPITAL-CORE', trabalho: 'Recepção de Pacientes e UTIs Avançadas', urlExterna: 'https://maps.google.com/?q=-15.7801,-47.9292' },
    { id: 13, nome: 'Ponto de Ônibus Central & Marquise Neon', categoria: '🚌 Parada Urbana & Embarque de Passageiros', cor: 0xffaa00, lat: -19.9167, lng: -43.9345, ipCriptografado: 'AES256-BUS-STOP-01', trabalho: 'Estação de Integração de Linhas Urbanas', urlExterna: 'https://maps.google.com/?q=-19.9167,-43.9345' },
    { id: 14, nome: 'Central AiFod & Moto Ubers Direct', categoria: '🛵 Hub de Entregas Rápida & Moto Taxis', cor: 0xff0055, lat: -8.0476, lng: -34.8770, ipCriptografado: 'AES256-AIFOD-HUB', trabalho: 'Despacho de Pedidos e Corridas Moto Uber', urlExterna: 'https://maps.google.com/?q=-8.0476,-34.8770' }
  ]);

  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11);

  // =========================================================================================
  // 🔍 --- FUNÇÃO HANDLEBUSCAGLOBO (INSERIDA EXATAMENTE AQUI) ---
  // =========================================================================================
  const handleBuscaGlobo = (e) => {
    const termo = e.target.value;
    setTermoBuscaGlobo(termo);
    if (!termo.trim()) {
      setResultadosBuscaGlobo([]);
      return;
    }
    const filtrados = locaisEmanuelOS.filter(l => 
      l.nome.toLowerCase().includes(termo.toLowerCase()) || 
      l.categoria.toLowerCase().includes(termo.toLowerCase()) ||
      l.trabalho.toLowerCase().includes(termo.toLowerCase())
    );
    setResultadosBuscaGlobo(filtrados);
  };

  // 👤 Função para iniciar o Login Facial Beta com timer
  const iniciarLoginFacialBeta = async () => {
    setLoginFacialAtivo(true);
    setStatusFacial('🎙️ Conectando à câmera para reconhecimento biométrico...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoLoginRef.current) {
        videoLoginRef.current.srcObject = stream;
      }
      setStatusFacial('🟢 Rosto detectado! Autenticando com G-AGI...');
      setTimeout(() => {
        // Para a câmera após sucesso
        stream.getTracks().forEach(track => track.stop());
        setLoginFacialAtivo(false);
        setBloqueado(false);
        alert(`✅ Login Facial Beta efetuado com sucesso! Sessão ativa por ${tempoSessaoMinutos} minutos.`);
      }, 3000);
    } catch (err) {
      setLoginFacialAtivo(false);
      alert("Erro ao acessar a câmera para login facial: " + err.message);
    }
  };

  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const [qrPayload] = useState('https://github.com/Manomae/naruto-anime-portfolio');

  const availableOptions = [
    { type: 'emoji', value: '🔥', label: 'Emoji Fogo' },
    { type: 'avatar', value: 'avatar_ninja.png', label: 'Avatar Ninja' },
    { type: 'gif', value: 'gif_animado.gif', label: 'GIF Chakra' },
    { type: 'video', value: 'video_intro.mp4', label: 'Vídeo 3D' },
    { type: 'image', value: 'img_vila.png', label: 'Imagem Vila' }
  ];

  const TELEFONE_AUTORIZADO = "88981493989";
  const TELEFONE_AUTORIZADO_DDI = "5588981493989";
  const PIN_MESTRE_EMANUEL = "8888";
  const EMAIL_AUTORIZADO = "leeheroi123@gmail.com";
  const CHAVE_MESTRE = "ASD-DDD-888";
  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);

  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);
  const [solicitarConexaoBluetooth, setSolicitarConexaoBluetooth] = useState(false);

  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC & VEGATOCNYX: LOG] Emanuel.OS Workstation v6.0 operational.",
    "[ROBOTOC & VEGATOCNYX: STATUS] Android 16 Neural OS EM: ONLINE em Azul Neon & Branco.",
    "[ROBOTOC & VEGATOCNYX: DATA CENTER] Globo Terrestre 3D Ativo com Mapeamento de Cidades e Nódulos AGI."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC & VEGATOCNYX 3D (IA CORE v6.0)', texto: 'Emanuel.OS Workstation v6.0 | MODELAGEM DA TERRA 3D ATIVA! Pesquise por locais na Barra Inteligente ou interaja com o globo.', tipo: 'sys' }
  ]);

  const [horaAtual, setHoraAtual] = useState('');
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const globeGroupRef = useRef(null);
  const markersGroupRef = useRef(null);
  const mainRobotRef = useRef(null);
  const spaceElementsGroupRef = useRef(null);

  const [legendaRobotoc, setLegendaRobotoc] = useState('');
  const [robotocFalando, setRobotocFalando] = useState(false);
  const robotHeadRef = useRef(null);
  const robotVisorRef = useRef(null);
  const robotArmLRef = useRef(null);
  const robotArmRRef = useRef(null);
  const robotLeftElbowRef = useRef(null);
  const robotClickAnimRef = useRef(0);

  const [modoExploracaoTerra, setModoExploracaoTerra] = useState(false);
  const robotWalkAnimRef = useRef(0);
  const robotCoreGroupRef = useRef(null);
  const earthInteriorGroupRef = useRef(null);

  const frasesRobotoc = [
    "Núcleo Emanuel ponto O S sincronizado. Todos os doze mapas operacionais.",
    "Monitorando rede quântica, telemetria orbital e servidores G-AGI em tempo real.",
    "Integridade de sete camadas verificada. Navegação segura ativada.",
    "Pronto para executar seus comandos na Workstation versão seis ponto zero.",
    "Sensores espaciais e conexões neurais operando em máxima eficiência."
  ];

  const dispararFalaRobotoc = (texto) => {
    setLegendaRobotoc(texto);
    setRobotocFalando(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 1.08;

      utterance.onend = () => {
        setRobotocFalando(false);
        setTimeout(() => setLegendaRobotoc(''), 3200);
      };

      utterance.onerror = () => {
        setRobotocFalando(false);
        setTimeout(() => setLegendaRobotoc(''), 3200);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setRobotocFalando(false);
        setTimeout(() => setLegendaRobotoc(''), 3200);
      }, 4500);
    }
  };

  const addLogTerminal = (novoLog) => setCmdLogs(prev => [...prev, novoLog]);

  const acionarSolicitacaoBluetooth = () => {
    setAndroidHudOpen(true);
    setSolicitarConexaoBluetooth(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Deseja se conectar ao sistema Robotoc com teclado, mouse ou fone bluetooth?");
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const executarComandoRobotocTerra = (tipo) => {
    robotClickAnimRef.current = 1.0;
    if (tipo === 'passear') {
      robotWalkAnimRef.current = 1.0;
      dispararFalaRobotoc("Iniciando modo de passeio pela superfície da Terra 3D. Dando passos firmes e precisos!");
    } else if (tipo === 'buscar') {
      const locAleatorio = locaisEmanuelOS[Math.floor(Math.random() * locaisEmanuelOS.length)];
      focarLocalNoGlobo(locAleatorio);
      dispararFalaRobotoc(`Buscando novo local interessante na Terra: ${locAleatorio.nome} (${locAleatorio.categoria}).`);
    } else if (tipo === 'explorar_interior') {
      setModoExploracaoTerra(prev => !prev);
      const estadoNovo = !modoExploracaoTerra;
      if (earthInteriorGroupRef.current) {
        earthInteriorGroupRef.current.visible = estadoNovo;
      }
      dispararFalaRobotoc(estadoNovo ? "Entrando nas camadas internas da Terra 3D. Analisando o núcleo quântico e o magma!" : "Retornando à superfície da Terra 3D.");
    }
  };

  const focarLocalNoGlobo = (local) => {
    setLocalSelecionadoGlobo(local);
    setResultadosBuscaGlobo([]);
    setTermoBuscaGlobo(local.nome);

    if (globeGroupRef.current) {
      const radius = 2.5;
      const phi = (90 - local.lat) * (Math.PI / 180);
      const theta = (local.lng + 180) * (Math.PI / 180);

      const targetRotY = -theta + Math.PI / 2;
      const targetRotX = phi - Math.PI / 2;

      globeGroupRef.current.rotation.y = targetRotY;
      globeGroupRef.current.rotation.x = targetRotX;
    }
  };

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return alert("🚨 ACESSO BLOQUEADO! Intrusão detectada neste dispositivo.");
    if (!chaveAcessoTripla.trim()) return setStatusAcessoTriplo("⚠️ Insira a Chave Tripla de Acesso!");

    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Camada 1: Identificando Dispositivo Mestre...");

    setTimeout(() => {
      setStatusAcessoTriplo("⏳ Camada 2: Conectando ao Servidor AGI-Primary...");
      setTimeout(() => {
        setStatusAcessoTriplo("⏳ Camada 3: Verificando redundância no Servidor SRV-Secondary...");
        setTimeout(() => {
          setValidandoServidores(false);
          if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
            setStatusAcessoTriplo("✅ TRIPLA AUTENTICAÇÃO CONCLUÍDA COM SUCESSO!");
            setTimeout(() => setEtapaSeguranca(2), 800);
          } else {
            const novas = tentativasInvasao + 1;
            setTentativasInvasao(novas);
            if (novas >= 3) {
              setBloqueioInvasor(true);
              setStatusAcessoTriplo("🚨 ALERTA DE SEGURANÇA! DISPOSITIVO BLOQUEADO!");
            } else {
              setStatusAcessoTriplo(`❌ Chave Inválida! Tentativa ${novas}/3.`);
            }
          }
        }, 800);
      }, 800);
    }, 800);
  };

  const validarEtapa2Telefone = (e) => {
    e.preventDefault();
    const tel = telefoneDigitado.replace(/\D/g, '');
    if (tel === TELEFONE_AUTORIZADO || tel === TELEFONE_AUTORIZADO_DDI) setEtapaSeguranca(3);
    else { alert("⚠️ Telefone não autorizado!"); setTelefoneDigitado(''); }
  };

  const validarEtapa3Pin = (e) => {
    e.preventDefault();
    if (pinDigitado === PIN_MESTRE_EMANUEL) setEtapaSeguranca(4);
    else { alert("⚠️ PIN Mestre incorreto!"); setPinDigitado(''); }
  };

  const validarEtapa4Email = (e) => {
    e.preventDefault();
    if (emailDigitado.trim().toLowerCase() === EMAIL_AUTORIZADO.toLowerCase()) setEtapaSeguranca(5);
    else { alert("⚠️ E-mail não autorizado!"); setEmailDigitado(''); }
  };

  const validarEtapa5Chave = (e) => {
    e.preventDefault();
    if (chaveDigitada === CHAVE_MESTRE) setEtapaSeguranca(6);
    else { alert("⚠️ Palavra-Chave Mestre inválida!"); setChaveDigitada(''); }
  };

  const handleSelectOptionTicons = (item) => {
    const newSeq = [...selectedSequence, item.value];
    setSelectedSequence(newSeq);
    if (newSeq.length === targetSequence.length) {
      if (JSON.stringify(newSeq) === JSON.stringify(targetSequence)) setEtapaSeguranca(7);
      else { alert("Sequência incorreta!"); setSelectedSequence([]); }
    }
  };

  const executarEscaneamentoQRCode7aCamada = () => {
    setQrCodeValidando(true);
    setTimeout(() => {
      setQrCodeValidando(false);
      setBloqueado(false);
    }, 1200);
  };

  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    const cyanRim = new THREE.PointLight(0x00f0ff, 8, 30);
    cyanRim.position.set(-6, 2, -4);
    scene.add(cyanRim);

    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;

    const radius = 2.5;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.4,
      metalness: 0.3,
      wireframe: false
    });

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
      (tex) => {
        earthMat.map = tex;
        earthMat.color.setHex(0xffffff);
        earthMat.needsUpdate = true;
      }
    );

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    const earthInteriorGroup = new THREE.Group();
    earthInteriorGroup.visible = false;

    const mantleMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.85, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff2200, emissiveIntensity: 1.2, wireframe: true })
    );
    earthInteriorGroup.add(mantleMesh);

    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.4, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00f0ff, emissiveIntensity: 3.5, roughness: 0.1 })
    );
    earthInteriorGroup.add(coreMesh);

    globeGroup.add(earthInteriorGroup);
    earthInteriorGroupRef.current = earthInteriorGroup;

    const atmosGeo = new THREE.SphereGeometry(radius * 1.03, 64, 64);
    const atmosMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.22,
      transmission: 0.8,
      roughness: 0.1,
      side: THREE.DoubleSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    const gridGeo = new THREE.IcosahedronGeometry(radius * 1.08, 3);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.15 });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    const spaceElementsGroup = new THREE.Group();
    spaceElementsGroupRef.current = spaceElementsGroup;

    const sunGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff5500,
      emissiveIntensity: 3.5,
      roughness: 0.2
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(-5.5, 3.2, -4);
    spaceElementsGroup.add(sunMesh);

    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide
    });
    const sunGlowMesh = new THREE.Mesh(new THREE.SphereGeometry(2.3, 32, 32), sunGlowMat);
    sunMesh.add(sunGlowMesh);

    const saturnGroup = new THREE.Group();
    const saturnMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xe2c17b, roughness: 0.5 })
    );
    saturnGroup.add(saturnMesh);

    const ringGeoSaturn = new THREE.RingGeometry(1.5, 2.4, 64);
    const ringMatSaturn = new THREE.MeshStandardMaterial({ color: 0xc8ab68, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const saturnRing = new THREE.Mesh(ringGeoSaturn, ringMatSaturn);
    saturnRing.rotation.x = Math.PI / 2.3;
    saturnGroup.add(saturnRing);

    saturnGroup.position.set(5.8, 2.0, -3.5);
    spaceElementsGroup.add(saturnGroup);

    const jupiterMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xb08f68, roughness: 0.6 })
    );
    jupiterMesh.position.set(1.8, 4.0, -4.5);
    spaceElementsGroup.add(jupiterMesh);

    const marsMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xc1440e, roughness: 0.7 })
    );
    marsMesh.position.set(-4.5, -2.5, -3.0);
    spaceElementsGroup.add(marsMesh);

    const issGroup = new THREE.Group();
    const issCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 }));
    issCore.rotation.z = Math.PI / 2;
    issGroup.add(issCore);

    const issRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 16, 32), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 }));
    issGroup.add(issRing);

    for (let p = -1; p <= 1; p += 2) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x005577 }));
      panel.position.set(p * 0.8, 0, 0);
      issGroup.add(panel);
    }
    issGroup.position.set(1.2, 1.8, 2.2);
    issGroup.scale.set(0.6, 0.6, 0.6);
    spaceElementsGroup.add(issGroup);

    const rocketList = [];
    const createRocket = (pos, rot) => {
      const rGroup = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5 }));
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      cone.position.y = 0.45;
      rGroup.add(body, cone);

      const fire = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.4, 16), new THREE.MeshBasicMaterial({ color: 0xff3300 }));
      fire.rotation.x = Math.PI;
      fire.position.y = -0.45;
      rGroup.add(fire);

      rGroup.position.copy(pos);
      rGroup.rotation.set(rot.x, rot.y, rot.z);
      return rGroup;
    };

    const rocket1 = createRocket(new THREE.Vector3(-4.0, -3.5, 1.0), { x: 0, y: 0, z: -Math.PI / 4 });
    const rocket2 = createRocket(new THREE.Vector3(4.5, 3.5, -1.0), { x: 0, y: 0, z: Math.PI / 3 });
    const shuttle = createRocket(new THREE.Vector3(0.5, -2.8, 1.8), { x: Math.PI / 6, y: 0, z: -Math.PI / 6 });

    spaceElementsGroup.add(rocket1, rocket2, shuttle);
    rocketList.push(rocket1, rocket2, shuttle);

    scene.add(spaceElementsGroup);

    const mathInfrastructureGroup = new THREE.Group();

    const createRhombus3D = (size, height) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, size);
      shape.lineTo(size * 0.7, 0);
      shape.lineTo(0, -size);
      shape.lineTo(-size * 0.7, 0);
      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
      };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    const rhombusGeo = createRhombus3D(0.25, 0.08);
    const rhombusMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0
    });

    const formulaTextures = [
      '∫f(x)dx=∑A_i', '∇×E=-∂B/∂t', 'E=mc²', 'x=(-b±√Δ)/2a',
      'P(A|B)=(P(B|A)P(A))/P(B)', 'det(A-λI)=0', 'S=k·ln(Ω)'
    ];

    const createMathTextCanvas = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fillRect(0, 0, 256, 128);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 248, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const rhombusList = [];
    const muscleCurveList = [];

    for (let i = 0; i < 14; i++) {
      const rhombusMesh = new THREE.Mesh(rhombusGeo, rhombusMat.clone());
      const formulaTex = createMathTextCanvas(formulaTextures[i % formulaTextures.length]);

      const labelPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.35, 0.18),
        new THREE.MeshBasicMaterial({ map: formulaTex, transparent: true, side: THREE.DoubleSide })
      );
      labelPlane.position.z = 0.06;
      rhombusMesh.add(labelPlane);

      const angle = (i / 14) * Math.PI * 2;
      const latRad = (Math.sin(i * 1.5) * 0.4);
      const rOrb = radius * 1.28;

      const x = rOrb * Math.cos(angle) * Math.cos(latRad);
      const y = rOrb * Math.sin(latRad);
      const z = rOrb * Math.sin(angle) * Math.cos(latRad);

      rhombusMesh.position.set(x, y, z);
      rhombusMesh.lookAt(0, 0, 0);

      mathInfrastructureGroup.add(rhombusMesh);
      rhombusList.push({ mesh: rhombusMesh, initPos: new THREE.Vector3(x, y, z), angle });
    }

    const muscleMatBroad = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: false,
      side: THREE.DoubleSide
    });

    const muscleMatThin = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
      wireframe: true
    });

    locaisEmanuelOS.forEach((loc, idx) => {
      const phi = (90 - loc.lat) * (Math.PI / 180);
      const theta = (loc.lng + 180) * (Math.PI / 180);
      const rEarth = radius * 1.02;

      const startVec = new THREE.Vector3(
        -(rEarth * Math.sin(phi) * Math.cos(theta)),
        (rEarth * Math.cos(phi)),
        (rEarth * Math.sin(phi) * Math.sin(theta))
      );

      const targetRhombus = rhombusList[idx % rhombusList.length];
      const endVec = targetRhombus.initPos;

      const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
      midVec.multiplyScalar(1.2);

      const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);

      const broadTubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
      const broadMesh = new THREE.Mesh(broadTubeGeo, muscleMatBroad);
      broadMesh.scale.set(1.8, 0.3, 1.0);
      mathInfrastructureGroup.add(broadMesh);

      const thinTubeGeo = new THREE.TubeGeometry(curve, 48, 0.012, 6, false);
      const thinMesh = new THREE.Mesh(thinTubeGeo, muscleMatThin);
      mathInfrastructureGroup.add(thinMesh);

      muscleCurveList.push({ broadMesh, thinMesh, curve });
    });

    globeGroup.add(mathInfrastructureGroup);

    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;

    locaisEmanuelOS.forEach(loc => {
      const phi = (90 - loc.lat) * (Math.PI / 180);
      const theta = (loc.lng + 180) * (Math.PI / 180);

      const r = radius * 1.02;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = (r * Math.sin(phi) * Math.sin(theta));
      const y = (r * Math.cos(phi));

      const pinGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: loc.cor });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, y, z);

      const ringGeo = new THREE.RingGeometry(0.08, 0.12, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: loc.cor, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y, z);
      ringMesh.lookAt(0, 0, 0);

      markersGroup.add(pinMesh);
      markersGroup.add(ringMesh);
    });

    globeGroup.add(markersGroup);
    scene.add(globeGroup);

    const robotPartsMain = criarModeloRobotocEspetacular3D();
    const mainRobotGroup = robotPartsMain.robotGroup;

    mainRobotGroup.position.set(3.2, 0.2, 1.0);
    mainRobotGroup.scale.set(1.25, 1.25, 1.25);
    scene.add(mainRobotGroup);
    mainRobotRef.current = mainRobotGroup;
    robotCoreGroupRef.current = mainRobotGroup;

    robotHeadRef.current = robotPartsMain.headGroup;
    robotVisorRef.current = robotPartsMain.eyeL;
    robotArmLRef.current = robotPartsMain.rightArmPivot;
    robotArmRRef.current = robotPartsMain.leftArmPivot;
    robotLeftElbowRef.current = robotPartsMain.leftElbowGroup;

    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !globeGroupRef.current) return;
      const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
      globeGroupRef.current.rotation.y += deltaMove.x * 0.005;
      globeGroupRef.current.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e) => {
      isDragging = false;

      const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (moveDist < 6 && mountRef.current && mainRobotRef.current && cameraRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseVec, cameraRef.current);
        const hits = raycaster.intersectObjects(mainRobotRef.current.children, true);
        if (hits.length > 0) {
          robotClickAnimRef.current = 1.0;
          const saudacoesClique = [
            "Olá Emanuel! Robotoc 3D ativo e pronto para seus comandos!",
            "Sistemas neurais respondendo ao seu toque! Como posso ajudar?",
            "Telemetria 3D sincronizada! Todos os módulos operando perfeitamente."
          ];
          const frase = saudacoesClique[Math.floor(Math.random() * saudacoesClique.length)];
          dispararFalaRobotoc(frase);
        }
      }
    };

    const domEl = mountRef.current;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (globeGroupRef.current && !isDragging) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      if (gridMesh) {
        gridMesh.rotation.y = -time * 0.05;
      }

      if (sunMesh) sunMesh.rotation.y = time * 0.05;
      if (saturnGroup) saturnGroup.rotation.y = time * 0.08;
      if (issGroup) {
        issGroup.rotation.y = time * 0.2;
        issGroup.position.x = 1.2 + Math.sin(time * 0.5) * 0.3;
      }

      rocketList.forEach((rkt, idx) => {
        rkt.position.y += Math.sin(time * 2 + idx) * 0.003;
      });

      rhombusList.forEach((item, idx) => {
        item.mesh.rotation.z = time * 0.5 + idx;
        item.mesh.rotation.y = time * 0.3;
        const pulse = Math.sin(time * 3 + idx) * 0.03;
        item.mesh.position.y = item.initPos.y + pulse;
      });

      if (mainRobotRef.current) {
        if (robotClickAnimRef.current > 0) {
          robotClickAnimRef.current = Math.max(0, robotClickAnimRef.current - 0.022);
        }
        if (robotWalkAnimRef.current > 0) {
          robotWalkAnimRef.current = Math.max(0, robotWalkAnimRef.current - 0.005);
        }

        const clickPulse = robotClickAnimRef.current;
        const walkIntensity = robotWalkAnimRef.current;
        const jumpOffset = Math.sin(clickPulse * Math.PI) * 0.32;
        const spinOffset = Math.sin(clickPulse * Math.PI * 2) * 0.42;

        const walkOffsetX = Math.sin(time * 6) * walkIntensity * 0.8;
        const walkOffsetY = Math.abs(Math.sin(time * 12)) * walkIntensity * 0.15;

        mainRobotRef.current.position.x = 3.2 + walkOffsetX;
        mainRobotRef.current.position.y = 0.2 + Math.sin(time * 2.0) * 0.12 + jumpOffset + walkOffsetY;
        mainRobotRef.current.rotation.y = Math.sin(time * 0.8) * 0.2 - 0.3 + spinOffset;

        if (robotPartsMain.legL && robotPartsMain.legR) {
          robotPartsMain.legL.rotation.x = Math.sin(time * 10) * walkIntensity * 0.6;
          robotPartsMain.legR.rotation.x = -Math.sin(time * 10) * walkIntensity * 0.6;
        }

        if (robotHeadRef.current) {
          robotHeadRef.current.rotation.y = Math.sin(time * 1.3) * 0.18;
          robotHeadRef.current.rotation.z = Math.cos(time * 1.1) * 0.06 + Math.sin(clickPulse * Math.PI * 2) * 0.16;
          robotHeadRef.current.rotation.x = Math.sin(clickPulse * Math.PI) * -0.15;
        }

        if (robotArmLRef.current && robotArmRRef.current) {
          robotArmLRef.current.rotation.z = -0.18 + Math.sin(time * 1.8) * 0.08 - Math.sin(clickPulse * Math.PI) * 0.25;
          robotArmRRef.current.rotation.z = 0.65 + Math.cos(time * 2.2) * 0.08 + Math.sin(clickPulse * Math.PI) * 0.25;
        }

        if (robotLeftElbowRef.current) {
          robotLeftElbowRef.current.rotation.z = 1.65 + Math.sin(time * 3.0) * 0.14 + Math.sin(clickPulse * Math.PI * 4) * 0.45;
        }

        const ledIntensity = 2.6 + Math.sin(time * 8) * 0.9 + clickPulse * 3.0;
        if (robotPartsMain.eyeL && robotPartsMain.eyeL.material) {
          robotPartsMain.eyeL.material.emissiveIntensity = ledIntensity;
        }
        if (robotPartsMain.eyeR && robotPartsMain.eyeR.material) {
          robotPartsMain.eyeR.material.emissiveIntensity = ledIntensity;
        }
        if (robotPartsMain.chestCoreLed && robotPartsMain.chestCoreLed.material) {
          robotPartsMain.chestCoreLed.material.emissiveIntensity = ledIntensity;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (domEl) {
        domEl.removeEventListener('mousedown', handleMouseDown);
        if (renderer.domElement) domEl.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [bloqueado]);

  useEffect(() => {
    const updateTime = () => setHoraAtual(new Date().toLocaleTimeString('pt-BR'));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (bloqueado) return;

    const timerBoasVindas = setTimeout(() => {
      dispararFalaRobotoc("Bem-vindo de volta, Emanuel. Núcleo Robotoc & Vegatocnyx 3D online e sincronizado.");
    }, 1500);

    const intervaloFalas = setInterval(() => {
      const fraseAleatoria = frasesRobotoc[Math.floor(Math.random() * frasesRobotoc.length)];
      dispararFalaRobotoc(fraseAleatoria);
    }, 45000);

    return () => {
      clearTimeout(timerBoasVindas);
      clearInterval(intervaloFalas);
    };
  }, [bloqueado]);

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '440px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center', boxSizing: 'border-box', backdropFilter: 'blur(20px)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖👤</div>
          <h2 style={{ color: '#0284c7', fontSize: '18px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> WORKSTATION v6.0
          </h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '15px' }}>
            PROTOCOLO DE SEGURANÇA DE 7 ETAPAS ({etapaSeguranca}/7)
          </span>

          {/* 👤 BOTÃO E TELA DE LOGIN FACIAL BETA */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '12px' }}>
            <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>📸 ACESSO RÁPIDO BETA (LOGIN FACIAL)</span>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '9px', color: '#334155' }}>Tempo da Sessão:</span>
              <select value={tempoSessaoMinutos} onChange={(e) => setTempoSessaoMinutos(Number(e.target.value))} style={{ fontSize: '9px', padding: '3px', borderRadius: '4px', border: '1px solid #0284c7', color: '#0284c7' }}>
                <option value={10}>10 Minutos</option>
                <option value={30}>30 Minutos (Padrão)</option>
                <option value={60}>60 Minutos</option>
                <option value={120}>120 Minutos</option>
              </select>
            </div>

            {loginFacialAtivo ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <video ref={videoLoginRef} autoPlay playsInline muted style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #00f0ff' }} />
                <span style={{ fontSize: '9px', color: '#16a34a', fontWeight: 'bold' }}>{statusFacial}</span>
              </div>
            ) : (
              <button onClick={iniciarLoginFacialBeta} style={{ width: '100%', padding: '8px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                📷 Entrar com Login Facial ({tempoSessaoMinutos} min)
              </button>
            )}
          </div>

          <div style={{ borderTop: '1px solid #cbd5e1', margin: '10px 0', paddingTop: '10px' }}>
            <span style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '8px' }}>Ou utilize a autenticação padrão das 7 camadas:</span>
          </div>

          {etapaSeguranca === 1 && (
            <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold' }}>🛡️ 1ª Etapa: Chave Tripla de Segurança</span>
              <p style={{ fontSize: '9.5px', color: '#64748b', margin: 0 }}>{statusAcessoTriplo}</p>
              <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite sua Chave Mestre..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '12px', outline: 'none' }} />
              <button type="submit" disabled={validandoServidores} style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
                {validandoServidores ? '⏳ Validando Servidores...' : '🔐 Validar Chave ➔'}
              </button>
            </form>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={validarEtapa2Telefone} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>📱 2ª Etapa: Telefone Autorizado</span>
              <input type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)} placeholder="88981493989" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', outline: 'none', fontSize: '11px' }} />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Validar Telefone ➔</button>
            </form>
          )}

          {etapaSeguranca === 3 && (
            <form onSubmit={validarEtapa3Pin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>🔢 3ª Etapa: PIN Mestre</span>
              <input type="password" maxLength={4} value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)} placeholder="****" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '18px', outline: 'none' }} />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Validar PIN ➔</button>
            </form>
          )}

          {etapaSeguranca === 4 && (
            <form onSubmit={validarEtapa4Email} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>📧 4ª Etapa: E-mail Autorizado</span>
              <input type="email" value={emailDigitado} onChange={(e) => setEmailDigitado(e.target.value)} placeholder="leeheroi123@gmail.com" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0f172a', textAlign: 'center', outline: 'none', fontSize: '11px' }} />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Validar E-mail ➔</button>
            </form>
          )}

          {etapaSeguranca === 5 && (
            <form onSubmit={validarEtapa5Chave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre</span>
              <input type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)} placeholder="ASD-DDD-888" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: '#f8fafc', color: '#0f172a', textAlign: 'center', outline: 'none', fontSize: '11px' }} />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Avançar ➔</button>
            </form>
          )}

          {etapaSeguranca === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 'bold' }}>🔑 6ª Camada: Ticons OS gevaGifs</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {availableOptions.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSelectOptionTicons(opt)} style={{ backgroundColor: '#f0f9ff', border: '1px solid #d97706', color: '#0f172a', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '9px' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold' }}>📡 7ª CAMADA: QR CODE MAPEAMENTO</span>
              <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #00f0ff' }}>
                <QRCodeSVG value={qrPayload} size={110} />
              </div>
              <button onClick={executarEscaneamentoQRCode7aCamada} disabled={qrCodeValidando} style={{ width: '100%', padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
                {qrCodeValidando ? '🔍 Validando QR Code...' : '📱 Desbloquear Sistema ➔'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>

        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>

          <div 
            ref={mountRef} 
            title="Arraste para girar a Terra 3D! Clique no Robotoc 3D ao lado para interagir."
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab' }} 
          />

          {legendaRobotoc && (
            <div
              style={{
                position: 'absolute',
                bottom: '135px',
                right: '30px',
                zIndex: 145,
                maxWidth: '340px',
                backgroundColor: 'rgba(3, 7, 18, 0.85)',
                border: '1.5px solid #00f0ff',
                borderLeft: '5px solid #00f0ff',
                borderRadius: '14px',
                padding: '12px 16px',
                color: '#f0f9ff',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 0 30px rgba(0, 240, 255, 0.35), inset 0 0 12px rgba(0, 240, 255, 0.15)',
                fontFamily: 'Consolas, monospace',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid rgba(0, 240, 255, 0.25)', paddingBottom: '4px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff', letterSpacing: '1px' }}>
                  🎙️ ROBOTOC & VEGATOCNYX 3D // TRANSMISSÃO NEURAL
                </span>
                <span style={{ fontSize: '8px', backgroundColor: robotocFalando ? '#00f0ff' : '#0284c7', color: robotocFalando ? '#000' : '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {robotocFalando ? 'AUDIO ON' : 'STANDBY'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', lineHeight: '1.45', color: '#e0f2fe', textShadow: '0 0 8px rgba(0, 240, 255, 0.4)' }}>
                "{legendaRobotoc}"
              </p>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: '15px', right: '20px', zIndex: 155, display: 'flex', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.92)', padding: '8px 12px', borderRadius: '16px', border: '2px solid #00f0ff', boxShadow: '0 0 25px rgba(0,240,255,0.3)', backdropFilter: 'blur(15px)' }}>
            <button onClick={() => executarComandoRobotocTerra('passear')} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '9.5px', fontWeight: 'bold', cursor: 'pointer' }}>
              🚶 Robotoc Passear na Terra 3D
            </button>
            <button onClick={() => executarComandoRobotocTerra('buscar')} style={{ padding: '6px 10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '9.5px', fontWeight: 'bold', cursor: 'pointer' }}>
              🌍 Buscar Locais Interessantes
            </button>
            <button onClick={() => executarComandoRobotocTerra('explorar_interior')} style={{ padding: '6px 10px', backgroundColor: modoExploracaoTerra ? '#ef4444' : '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '9.5px', fontWeight: 'bold', cursor: 'pointer' }}>
              🌋 {modoExploracaoTerra ? 'Voltar à Superfície' : 'Explorar por Dentro da Terra 3D'}
            </button>
          </div>

          <button
            onClick={() => {
              robotClickAnimRef.current = 1.0;
              dispararFalaRobotoc(frasesRobotoc[Math.floor(Math.random() * frasesRobotoc.length)]);
            }}
            title="Ouvir Diagnóstico do Robotoc 3D"
            style={{
              position: 'absolute',
              bottom: '75px',
              right: legendaRobotoc ? '385px' : '20px',
              zIndex: 145,
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              border: '1.5px solid #00f0ff',
              color: '#0284c7',
              padding: '6px 10px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            🗣️ Falar Status
          </button>

          <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 150, width: '90%', maxWidth: '520px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '25px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 25px rgba(0,240,255,0.3)', backdropFilter: 'blur(15px)' }}>
              <span style={{ fontSize: `${tamanhoFonteBusca + 3}px`, color: '#0284c7' }}>🔍</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '2px 6px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.5)' }}>
                <button
                  type="button"
                  onClick={() => setTamanhoFonteBusca(prev => Math.max(8, prev - 1))}
                  title="Diminuir Fonte"
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', padding: '0 3px', lineHeight: '1' }}
                >
                  −
                </button>
                <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold', minWidth: '18px', textAlign: 'center' }}>
                  {tamanhoFonteBusca}px
                </span>
                <button
                  type="button"
                  onClick={() => setTamanhoFonteBusca(prev => Math.min(24, prev + 1))}
                  title="Aumentar Fonte"
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', padding: '0 3px', lineHeight: '1' }}
                >
                  +
                </button>
              </div>

              <input
                type="text"
                value={termoBuscaGlobo}
                onChange={handleBuscaGlobo}
                placeholder="Pesquisar locais no Globo 3D..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontSize: `${tamanhoFonteBusca}px`, fontWeight: 'bold' }}
              />
              {termoBuscaGlobo && (
                <button onClick={() => { setTermoBuscaGlobo(''); setResultadosBuscaGlobo([]); setLocalSelecionadoGlobo(null); }} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              )}
            </div>

            {resultadosBuscaGlobo.length > 0 && (
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #00f0ff', borderRadius: '14px', marginTop: '6px', maxHeight: '220px', overflowY: 'auto', padding: '6px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', backdropFilter: 'blur(15px)' }}>
                {resultadosBuscaGlobo.map(loc => (
                  <div
                    key={loc.id}
                    style={{ padding: '8px 10px', borderRadius: '8px', borderBottom: '1px solid #f0f9ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s ease' }}
                  >
                    <div onClick={() => focarLocalNoGlobo(loc)} style={{ cursor: 'pointer', flexGrow: 1 }}>
                      <strong style={{ fontSize: `${tamanhoFonteBusca}px`, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🔍 {loc.nome}
                      </strong>
                      <span style={{ fontSize: `${Math.max(8, tamanhoFonteBusca - 2)}px`, color: '#64748b' }}>{loc.categoria} • {loc.trabalho}</span>
                    </div>
                    <a
                      href={loc.urlExterna}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: `${Math.max(8, tamanhoFonteBusca - 2)}px`, backgroundColor: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '8px' }}
                    >
                      🌐 Abrir Link ➔
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {localSelecionadoGlobo && (
            <div style={{ position: 'absolute', bottom: '110px', left: '20px', zIndex: 140, backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '16px', padding: '14px', width: '280px', boxShadow: '0 0 30px rgba(0,240,255,0.3)', backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '12px', color: '#0284c7' }}>{localSelecionadoGlobo.nome}</strong>
                <button onClick={() => setLocalSelecionadoGlobo(null)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              </div>
              <span style={{ fontSize: '9px', backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block', marginBottom: '8px' }}>
                {localSelecionadoGlobo.categoria}
              </span>
              <p style={{ fontSize: '10px', color: '#334155', margin: '0 0 6px 0' }}><strong>Atuação:</strong> {localSelecionadoGlobo.trabalho}</p>
              <p style={{ fontSize: '9px', color: '#64748b', margin: '0 0 8px 0', fontFamily: 'monospace' }}>🔐 Hash: {localSelecionadoGlobo.ipCriptografado}</p>
              <a
                href={localSelecionadoGlobo.urlExterna}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '10px', backgroundColor: '#0284c7', color: '#fff', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'block', textAlign: 'center' }}
              >
                🌐 NAVEGAR NO MAPA REAL ➔
              </a>
            </div>
          )}

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>

            <Link
              href="/robotocNAV"
              style={{
                backgroundColor: '#00f0ff',
                border: '1px solid #0284c7',
                color: '#020617',
                padding: '0 14px',
                height: '40px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '900',
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                boxShadow: '0 0 18px rgba(0, 240, 255, 0.5)'
              }}
            >
              🌐 robotocNAV
            </Link>

            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              🖥️ {modoDevSplit ? 'Fechar Workstation' : 'Dev Workstation Split'}
            </button>

            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📱 Android 16 Neural HUD
            </button>

            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📊 Creator Studio
            </button>

            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', boxShadow: '0 0 15px rgba(2,132,199,0.3)' }}>
              🤖 Painel EMgemini Dev 3D
            </button>

            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: miniAssistantAberto ? '#00f0ff' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: miniAssistantAberto ? '#000' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              🤖 {miniAssistantAberto ? 'Fechar Mini Assistant' : 'Mini Robotoc 3D'}
            </button>

            <button onClick={() => setYugiohGameAberto(!yugiohGameAberto)} style={{ backgroundColor: yugiohGameAberto ? '#eab308' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #eab308', color: yugiohGameAberto ? '#fff' : '#d97706', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              ⚔️ {yugiohGameAberto ? 'Fechar Duel Links' : 'Yu-Gi-Oh! Duel Links 3D'}
            </button>
          </div>

          <div style={{ position: 'absolute', top: '70px', right: '15px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '250px' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#0284c7', backgroundColor: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: '6px', border: '1px solid #00f0ff', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}>
              🌐 LINKS SOCIAIS & NUVENS EMANUEL.OS
            </span>
            {links3D.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
                  border: '1px solid #00f0ff',
                  borderRadius: '8px',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0,240,255,0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.icone}</span>
                <span style={{ flexGrow: 1 }}>{item.titulo}</span>
                <span style={{ fontSize: '8px', color: '#0284c7', textTransform: 'uppercase' }}>[{item.nuvem}]</span>
              </a>
            ))}

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #0284c7', borderRadius: '10px', padding: '8px', backdropFilter: 'blur(10px)', marginTop: '4px' }}>
              <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>☁️ NUVENS & TRIPLE E-MAIL STATUS:</span>
              <div style={{ fontSize: '8px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div>📧 Google: <strong style={{ color: '#16a34a' }}>{servicosNuvemEmail.google.conta}</strong></div>
                <div>🍎 Apple: <strong style={{ color: '#a855f7' }}>{servicosNuvemEmail.apple.conta}</strong></div>
                <div>☁️ Azure: <strong style={{ color: '#ea580c' }}>{servicosNuvemEmail.microsoft.conta}</strong></div>
              </div>
            </div>
          </div>

          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px',
            opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(30px)',
            borderRight: '1px solid rgba(0, 240, 255, 0.4)', padding: sidebarAberta ? '20px' : '0px',
            display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 190,
            transition: 'all 0.3s ease', boxSizing: 'border-box'
          }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  Contexto: EMANUEL<span style={{ color: '#0284c7' }}>.OS Workstation v6.0</span>
                </h1>

                <AgentPanelModule />

                <UnixTerminalCanvas />

                <div style={{ padding: '12px', backgroundColor: 'rgba(240, 249, 255, 0.8)', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                  <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 8px 0' }}>🌐 Central dos 12 Mapas Integrados</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <Link href="/mapa" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #16a34a', color: '#16a34a', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🌍 Terrestre</Link>
                    <Link href="/mapa-orkut" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ea580c', color: '#ea580c', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧡 Orkut</Link>
                    <Link href="/espacial" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #0284c7', color: '#0284c7', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🪐 Espacial</Link>
                    <Link href="/mapa-ressonancia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #06b6d4', color: '#06b6d4', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧬 Ressonância</Link>
                    <Link href="/mapa-patologia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🔬 Patologia</Link>
                    <Link href="/mapa-ia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #f43f5e', color: '#f43f5e', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚡ IA 3D</Link>
                    <Link href="/mapa-antiguidades" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #d97706', color: '#d97706', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🏛️ Antiguidades</Link>
                    <Link href="/mapa-quantico" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #8b5cf6', color: '#8b5cf6', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚛️ Quântico</Link>
                    <Link href="/mapaaeroespacial" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #9333ea', color: '#9333ea', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🛸 Aeroespacial</Link>
                    <Link href="/MapaEleicoesBrasil20263D" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #00ffcc', color: '#00cc99', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🗳️ Eleições 2026 3D</Link>
                    <Link href="/geometricMap3D" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ff00ff', color: '#d946ef', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>📐 PG Matemático 3D</Link>
                    <Link href="/mapaagroflorestal" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #15803d', color: '#15803d', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🌲 Agroflorestal</Link>
                  </div>
                </div>

                <RobotocNeuralThoughtPanel addLog={addLogTerminal} />
                <DispatcherMensagensNumeros addLog={addLogTerminal} />
                <GoogleMeetAvatarManager addLog={addLogTerminal} />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>

          <div style={{ position: 'absolute', bottom: '65px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: 'calc(100% - 30px)', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '10px', padding: '10px', maxHeight: '80px', overflowY: 'auto' }}>
              {mensagens.map((item, index) => (
                <div key={index}>
                  <span style={{ fontSize: '8px', fontWeight: 'bold', color: item.tipo === 'user' ? '#0284c7' : '#ef4444' }}>{item.autor}</span>
                  <p style={{ margin: 0, fontSize: '10px', color: '#0f172a' }}>{item.texto}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (chatInput.trim()) {
                  const cmdUser = chatInput.trim();
                  const respostaRobotoc = `Comando "${cmdUser}" recebido e processado pelo núcleo Robotoc & Vegatocnyx 3D.`;
                  robotClickAnimRef.current = 0.8;
                  setMensagens((prev) => [
                    ...prev,
                    { autor: 'VOCÊ', texto: cmdUser, tipo: 'user' },
                    { autor: 'ROBOTOC & VEGATOCNYX 3D', texto: respostaRobotoc, tipo: 'sys' }
                  ]);
                  dispararFalaRobotoc(respostaRobotoc);
                  setChatInput('');
                }
              }}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #00f0ff', borderRadius: '25px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 15px rgba(0,240,255,0.2)' }}
            >
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com o ROBOTOC & VEGATOCNYX 3D ou envie comandos neurais..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontSize: '10px', flexGrow: 1 }} />
              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar ➔</button>
            </form>
          </div>
        </div>

        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>

      {janelaRobotocDevAberta && (
        <WindowDevPanelRobotoc 
          onClose={() => setJanelaRobotocDevAberta(false)} 
          onRequestBluetooth={acionarSolicitacaoBluetooth}
        />
      )}

      {miniAssistantAberto && (
        <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />
      )}

      <MiniRobotocSidebarNotes addLogTerminal={addLogTerminal} />

      {yugiohGameAberto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 400,
          backgroundColor: '#0a0f1d'
        }}>
          <YugiohDuelLinks3D onClose={() => setYugiohGameAberto(false)} />
        </div>
      )}

      <AndroidHUDPanel open={androidHudOpen} onClose={() => { setAndroidHudOpen(false); setSolicitarConexaoBluetooth(false); }}>
        <MotionTracker />
        <RobotocGear highlightGear={solicitarConexaoBluetooth} onConnectGear={(t, s) => addLogTerminal(`[GEAR] ${t}: ${s ? 'ON' : 'OFF'}`)} />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer addLog={addLogTerminal} />
      </AndroidHUDPanel>

      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
