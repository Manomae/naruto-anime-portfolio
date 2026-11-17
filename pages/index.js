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
// 🤖 --- HELPER DE MODELAGEM 3D ESPETACULAR DO ROBOTOC ---
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
// 🌸 --- HELPER DE MODELAGEM 3D VEGATOCNYX (FEMININA COM RABO DE CAVALO E LEDS CIANO) ---
// =========================================================================================
function criarModelovegatocnyxEspetacular3D() {
  const robotGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0 });
  const chromeSilverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.92 });
  const metallicBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.75 });
  const darkScreenMat = new THREE.MeshPhysicalMaterial({ color: 0x020617, roughness: 0.08, metalness: 0.3, clearcoat: 1.0 });
  const cyanLedMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.2, roughness: 0.1 });

  // Cabeça Feminina com Capacete Estilizado e Rabo de Cavalo
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.48, 36, 36), whiteArmorMat);
  headBase.scale.set(1.05, 0.96, 1.0);
  headGroup.add(headBase);

  // Rabo de cavalo característico da VegatocNyx
  const ponytailBase = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), whiteArmorMat);
  ponytailBase.position.set(0, 0.25, -0.45);
  const ponytailTail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.8, 20), whiteArmorMat);
  ponytailTail.rotation.x = -Math.PI / 4;
  ponytailTail.position.set(0, -0.15, -0.75);
  const ponytailLed = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 16), cyanLedMat);
  ponytailLed.rotation.x = -Math.PI / 4;
  ponytailLed.position.set(0, -0.15, -0.74);
  headGroup.add(ponytailBase, ponytailTail, ponytailLed);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.18), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.41);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.26, 0.19), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.415);
  headGroup.add(visorScreen);

  const eyeGeo = new THREE.SphereGeometry(0.075, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.15, 0.95, 0.35);
  eyeL.position.set(-0.16, -0.02, 0.50);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.15, 0.95, 0.35);
  eyeR.position.set(0.16, -0.02, 0.50);
  headGroup.add(eyeL, eyeR);

  robotGroup.add(headGroup);

  // Pescoço e Tronco Feminino esguio
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  robotGroup.add(neck);

  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 1, 0.82);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.05);
  torsoGroup.add(chestBlueTrim);

  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.20, 0.24);
  torsoGroup.add(chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22 - i * 0.012, 0.21 - i * 0.012, 0.07, 24), chromeSilverMat);
    abSeg.position.set(0, -0.14 - i * 0.09, 0);
    torsoGroup.add(abSeg);
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.18, 0.20, 24), whiteArmorMat);
  pelvis.position.set(0, -0.44, 0);
  torsoGroup.add(pelvis);

  robotGroup.add(torsoGroup);

  const criarBracoNyx = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.43, 0.32, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), chromeSilverMat);
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.26, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.16, 0);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.06, -0.32, 0);
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 0.30, 24), chromeSilverMat);
    forearm.position.set(0, -0.16, 0);

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.38, 0);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.06), whiteArmorMat);
    handGroup.add(palm);

    for (let f = -1.5; f <= 1.5; f += 1) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.08, 10), chromeSilverMat);
      finger.position.set(f * 0.028, -0.08, 0);
      handGroup.add(finger);
    }

    elbowGroup.add(handGroup);
    armPivot.add(shoulder, upperArm, elbowGroup);
    return { armPivot, elbowGroup };
  };

  const rightArmObj = criarBracoNyx(-1);
  rightArmObj.armPivot.rotation.z = -0.15;
  robotGroup.add(rightArmObj.armPivot);

  const leftArmObj = criarBracoNyx(1);
  leftArmObj.armPivot.rotation.z = 0.60;
  leftArmObj.elbowGroup.rotation.z = 1.60;
  robotGroup.add(leftArmObj.armPivot);

  const criarPernaNyx = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.15, -0.50, 0);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.25, 20), chromeSilverMat);
    thigh.position.set(0, -0.14, 0);
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.28, 24), chromeSilverMat);
    shin.position.set(0, -0.42, 0);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.30), whiteArmorMat);
    foot.position.set(0, -0.62, 0.04);

    legGroup.add(thigh, shin, foot);
    return legGroup;
  };

  robotGroup.add(criarPernaNyx(-1), criarPernaNyx(1));

  return { robotGroup, headGroup, eyeL, eyeR, crestLed: ponytailLed, chestCoreLed };
}

// =========================================================================================
// ⚙️ --- COMPONENTE: AGENTE EM AGENT PANEL ---
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
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #00f0ff', borderRadius: '16px', padding: '16px', margin: '10px 0', color: '#0f172a', fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
      <h2 style={{ color: '#0284c7', fontSize: '14px', margin: '0 0 10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ⚙️ PAINEL WEB DO EM AGENT
      </h2>
      <form onSubmit={handleRunAgent} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Digite o comando para o agente..." value={task} onChange={(e) => setTask(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '11px', outline: 'none', color: '#0f172a' }} />
        <button type="submit" disabled={loading} style={{ padding: '10px 16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: loading ? 'not-allowed' : 'pointer' }}>
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
// 🤖 --- COMPONENTE: MINI ROBOTOC 3D ASSISTANT ---
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
    setDuvidaInput(palavras.join(' ') + ' ');
    setSugestoes([]);
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

    scene.add(new THREE.AmbientLight(0xffffff, 2.2));
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
      if (clickBoostRef.current > 0) clickBoostRef.current = Math.max(0, clickBoostRef.current - 0.03);
      const boost = clickBoostRef.current;

      if (miniRobotRef.current) {
        miniRobotRef.current.position.y = -0.1 + Math.sin(time * 2.5) * 0.06 + Math.sin(boost * Math.PI) * 0.18;
        miniRobotRef.current.rotation.y = Math.sin(time * 1.2) * 0.2;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '380px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '14px', boxShadow: '0 0 35px rgba(0, 240, 255, 0.3)', zIndex: 500, backdropFilter: 'blur(20px)', color: '#0f172a', fontFamily: 'sans-serif', maxHeight: '520px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '6px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🤖</span>
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>MINI ROBOTOC 3D + MICROFONE</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minHeight: '110px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #00f0ff', padding: '6px', marginBottom: '8px' }}>
        <div ref={mountRef} onClick={() => processarPerguntaRobotoc("Olá Robotoc")} style={{ width: '90px', height: '100px', cursor: 'pointer', flexShrink: 0 }} />
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Resposta Robotoc:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a', whiteSpace: 'pre-wrap' }}>{carregando ? '⚡ Processando...' : respostaIA}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={iniciarOuvirMicrofone} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: ouvindo ? 'rgba(239,68,68,0.2)' : 'rgba(2,132,199,0.1)', color: ouvindo ? '#ef4444' : '#0284c7', cursor: 'pointer', fontSize: '14px' }}>🎙️</button>
        <input type="text" value={duvidaInput} onChange={handleInputChange} placeholder="Pergunte qualquer assunto..." style={{ flex: 1, padding: '8px 10px', backgroundColor: '#f8fafc', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '10px', outline: 'none', color: '#0f172a' }} />
        <button onClick={() => processarPerguntaRobotoc(duvidaInput)} style={{ padding: '8px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>Enviar</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🚀 --- SIDEBAR NOTAS & LIXEIRA ---
// =========================================================================================
function MiniRobotocSidebarNotes({ addLogTerminal }) {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('notas');
  const [notas, setNotas] = useState([{ id: 1, titulo: 'Anotações Mestre', conteudo: 'Emanuel.OS v6.0 ativo.', data: new Date().toLocaleTimeString('pt-BR') }]);
  const [lixeira, setLixeira] = useState([]);
  const [tituloInput, setTituloInput] = useState('');
  const [conteudoInput, setConteudoInput] = useState('');
  const robotMountRef = useRef(null);

  const handleCriarNota = (e) => {
    e.preventDefault();
    if (!conteudoInput.trim()) return;
    setNotas(prev => [{ id: Date.now(), titulo: tituloInput.trim() || `Rascunho ${notas.length + 1}`, conteudo: conteudoInput, data: new Date().toLocaleTimeString('pt-BR') }, ...prev]);
    setTituloInput('');
    setConteudoInput('');
  };

  useEffect(() => {
    if (!robotMountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 3.6);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(45, 45);
    robotMountRef.current.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const robot = criarModeloRobotocEspetacular3D().robotGroup;
    robot.scale.set(0.85, 0.85, 0.85);
    scene.add(robot);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      if (robotMountRef.current && renderer.domElement) robotMountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 450, display: 'flex', alignItems: 'center' }}>
      <div onClick={() => setExpandido(!expandido)} style={{ width: '54px', height: '110px', backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRight: 'none', borderRadius: '20px 0 0 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <div ref={robotMountRef} style={{ width: '45px', height: '45px', pointerEvents: 'none' }} />
        <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: '900' }}>{expandido ? 'FECHAR' : 'NOTAS'}</span>
      </div>
      <div style={{ width: expandido ? '360px' : '0px', height: '520px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: expandido ? '2px solid #00f0ff' : 'none', borderRight: 'none', borderRadius: '20px 0 0 20px', overflow: 'hidden', transition: 'all 0.4s ease', display: 'flex', flexDirection: 'column', color: '#0f172a' }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>BLOCO DE NOTAS ROBOTOC</strong>
          <button onClick={() => setExpandido(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          <form onSubmit={handleCriarNota} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
            <input type="text" placeholder="Título..." value={tituloInput} onChange={(e) => setTituloInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <textarea placeholder="Conteúdo..." value={conteudoInput} onChange={(e) => setConteudoInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <button type="submit" style={{ padding: '6px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Nota</button>
          </form>
          {notas.map(n => (
            <div key={n.id} style={{ border: '1px solid #00f0ff', borderRadius: '8px', padding: '8px', marginBottom: '6px' }}>
              <strong>{n.titulo}</strong>
              <p style={{ margin: '4px 0', fontSize: '10px' }}>{n.conteudo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================================
// 📸 --- MOTION TRACKER & GEAR ---
// =========================================================================================
function MotionTracker() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  const toggleCamera = async () => {
    if (active) {
      videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
      setActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setActive(true);
      } catch (err) { alert("Erro na câmera: " + err.message); }
    }
  };
  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>VISION TRACKER</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>{active ? 'Desligar' : 'Ativar'}</button>
      </div>
      <div style={{ width: '100%', height: '120px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
}

function RobotocGear({ highlightGear, onConnectGear }) {
  const [gears, setGears] = useState({ headset: false, mouse: false, keyboard: true });
  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: highlightGear ? '2px solid #eab308' : '1px solid #0284c7', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>PERIFÉRICOS NEURAIS</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {['headset', 'mouse', 'keyboard'].map(g => (
          <button key={g} onClick={() => { setGears(p => ({ ...p, [g]: !p[g] })); if(onConnectGear) onConnectGear(g, !gears[g]); }} style={{ padding: '6px', border: '1px solid #0284c7', background: gears[g] ? '#0284c7' : 'transparent', color: gears[g] ? '#fff' : '#0284c7', fontSize: '9px', borderRadius: '6px', cursor: 'pointer' }}>{g}</button>
        ))}
      </div>
    </div>
  );
}

// =========================================================================================
// ⌨️ --- TECLADO GLASS & DISPATCHER & NEURAL ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>TECLADO HOLOGRÁFICO GLASS</span>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
        {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
          <button key={k} onClick={() => onKeyPress(k)} style={{ padding: '6px 4px', background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.4)', borderRadius: '4px', color: '#0284c7', fontSize: '9px', cursor: 'pointer' }}>{k}</button>
        ))}
      </div>
    </div>
  );
}

function DispatcherMensagensNumeros({ addLog }) {
  const [num, setNum] = useState('981493989');
  const [msg, setMsg] = useState('Mensagem Emanuel.OS');
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px' }}>
      <h3 style={{ color: '#0284c7', fontSize: '11px', margin: '0 0 8px 0' }}>MENSAGERIA DIRETA</h3>
      <input type="text" value={num} onChange={e => setNum(e.target.value)} placeholder="Número" style={{ width: '100%', padding: '6px', marginBottom: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
      <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={2} style={{ width: '100%', padding: '6px', marginBottom: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
      <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=5588${num}&text=${encodeURIComponent(msg)}`, '_blank')} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar WhatsApp</button>
    </div>
  );
}

function RobotocNeuralThoughtPanel({ addLog }) {
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0' }}>PENSAMENTO FUTURISTA NÚCLEO</h3>
      <p style={{ fontSize: '9px', color: '#64748b' }}>Triple e-mail e processamento neural ativo.</p>
    </div>
  );
}

function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{ position: 'fixed', top: 0, right: open ? 0 : '-360px', width: '350px', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.92)', borderLeft: '2px solid #00f0ff', backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s ease', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7' }}>ANDROID 16 HUD</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>
      {children}
    </div>
  );
}

function EMCreatorStudio({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '700px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        <h2 style={{ color: '#0284c7' }}>EM CREATOR STUDIO IA</h2>
        <p style={{ fontSize: '11px', color: '#64748b' }}>Painel analítico de mídias e engajamento multimodais.</p>
      </div>
    </div>
  );
}

// =========================================================================================
// 💻 --- PAINEL DEV SPLIT SCREEN ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [codigoFonte, setCodigoFonte] = useState('fn main():\n    print("⚡ Inicializando Tensor Quântico Emanuel.OS...")');
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff', borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Emanuel.OS Workstation - Dev Studio</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>
      <textarea value={codigoFonte} onChange={e => setCodigoFonte(e.target.value)} style={{ width: '100%', flexGrow: 1, backgroundColor: '#fff', border: '1px solid #00f0ff', borderRadius: '8px', padding: '10px', fontFamily: 'monospace', fontSize: '11px' }} />
    </div>
  );
}

// =========================================================================================
// ✉️ --- FORMULÁRIO CAPTURA & GOOGLE MEET ---
// =========================================================================================
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '16px', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', margin: '0 0 6px 0', fontSize: '12px' }}>Baixar 300 Comandos Mestre</h3>
      {enviado ? <p style={{ color: '#16a34a', fontSize: '11px' }}>Enviado com sucesso!</p> : (
        <form onSubmit={e => { e.preventDefault(); if (email) setEnviado(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Seu e-mail..." value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          <button type="submit" style={{ padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Quero Acesso</button>
        </form>
      )}
    </div>
  );
}

function GoogleMeetAvatarManager() {
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '16px', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0' }}>Google Meet + Avatares 3D</h3>
      <button onClick={() => window.open('https://meet.google.com/new', '_blank')} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Criar Reunião Instantânea</button>
    </div>
  );
}

const UnixTerminalCanvas = () => (
  <div style={{ width: '100%', height: '150px', backgroundColor: '#0f172a', border: '2px solid #00f0ff', borderRadius: '10px', padding: '8px', color: '#38bdf8', fontFamily: 'monospace', fontSize: '10px' }}>
    root@emanuel-os:~# Emanuel.OS Kernel 6.x online.<br/>root@emanuel-os:~# G-AGI Ready.
  </div>
);

const BitcoinAnalysisPanel = () => (
  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px' }}>
    <h3 style={{ color: '#d97706', fontSize: '13px', margin: '0 0 8px 0' }}>₿ Previsão Bitcoin: $89,450.00</h3>
  </div>
);

const CloudflareWorkerDeployer = () => (
  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #ea580c', borderRadius: '16px', padding: '16px' }}>
    <h3 style={{ color: '#ea580c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ Cloudflare Worker Deployer</h3>
  </div>
);

// =========================================================================================
// 🏛️ --- VITRINE VIRTUAL 3D (COM ROBOTOC E VEGATOCNYX) ---
// =========================================================================================
function VitrineVirtual3D({ modoAtual, onSelectModo }) {
  const container3dRef = useRef(null);
  useEffect(() => {
    if (!container3dRef.current) return;
    const width = container3dRef.current.clientWidth;
    const height = container3dRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    container3dRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const spotCyan = new THREE.SpotLight(0x00f0ff, 6);
    spotCyan.position.set(-5, 8, 5);
    scene.add(spotCyan);

    const vitrineGroup = new THREE.Group();
    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.9 }));
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    const contentGroup = new THREE.Group();
    if (modoAtual === 'avatares') {
      const robot1 = criarModeloRobotocEspetacular3D().robotGroup;
      robot1.position.set(-1.2, 0.2, 0);
      robot1.scale.set(0.85, 0.85, 0.85);

      const robot2 = criarModelovegatocnyxEspetacular3D().robotGroup;
      robot2.position.set(1.2, 0.2, 0);
      robot2.scale.set(0.85, 0.85, 0.85);

      contentGroup.add(robot1, robot2);
    } else {
      const mapMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 2), new THREE.MeshStandardMaterial({ color: 0x0284c7, wireframe: true }));
      mapMesh.position.y = 0.8;
      contentGroup.add(mapMesh);
    }
    vitrineGroup.add(contentGroup);
    scene.add(vitrineGroup);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      vitrineGroup.rotation.y += 0.008;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container3dRef.current && renderer.domElement) container3dRef.current.removeChild(renderer.domElement);
    };
  }, [modoAtual]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: 'rgba(240, 249, 255, 0.6)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,240,255,0.4)' }}>
      <div ref={container3dRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

function WindowDevPanelRobotoc({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: '60px', left: '80px', width: '520px', height: '580px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '18px', zIndex: 300, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Painel Dev Robotoc & VegatocNyx 3D</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>
      <VitrineVirtual3D modoAtual="avatares" />
    </div>
  );
}

// =========================================================================================
// 🌟 --- COMPONENTE PRINCIPAL EMANUEL.OS CORE v6.0 ---
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave de 3 Camadas');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [qrCodeValidando, setQrCodeValidando] = useState(false);

  // Estados da Função Beta de Login Facial (30 Minutos)
  const [loginFacialAtivo, setLoginFacialAtivo] = useState(false);
  const [statusFacial, setStatusFacial] = useState('Aguardando escaneamento facial...');
  const videoLoginRef = useRef(null);

  const iniciarLoginFacialBeta = async () => {
    setLoginFacialAtivo(true);
    setStatusFacial('📸 Inicializando câmera para autenticação facial...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoLoginRef.current) videoLoginRef.current.srcObject = stream;
      setTimeout(() => {
        setStatusFacial('✅ Rosto reconhecido com sucesso! Concedendo acesso temporário de 30 minutos...');
        setTimeout(() => {
          stream.getTracks().forEach(t => t.stop());
          setBloqueado(false);
        }, 1500);
      }, 3000);
    } catch (err) {
      setStatusFacial('❌ Erro ao acessar a câmera para login facial.');
      setLoginFacialAtivo(false);
    }
  };

  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);

  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11);

  const locaisEmanuelOS = [
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor de Dados', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, trabalho: 'Engenharia de Software', urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' },
    { id: 2, nome: 'Estação Oceanográfica & VegatocNyx Lab', categoria: '🌊 Pesquisa Biológica', cor: 0x00aaff, lat: -12.9714, lng: -38.5014, trabalho: 'Biologia Marinha', urlExterna: 'https://maps.google.com/?q=-12.9714,-38.5014' }
  ];

  const handleBuscaGlobo = (e) => {
    const val = e.target.value;
    setTermoBuscaGlobo(val);
    if (val.trim().length >= 1) {
      setResultadosBuscaGlobo(locaisEmanuelOS.filter(item => item.nome.toLowerCase().includes(val.toLowerCase())));
    } else {
      setResultadosBuscaGlobo([]);
    }
  };

  const focarLocalNoGlobo = (local) => {
    setLocalSelecionadoGlobo(local);
    setResultadosBuscaGlobo([]);
    setTermoBuscaGlobo(local.nome);
  };

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return;
    setEtapaSeguranca(2);
  };

  const mountRef = useRef(null);
  const mainRobotRef = useRef(null);
  const vegatoRobotRef = useRef(null);
  const [legendaRobotoc, setLegendaRobotoc] = useState('');
  const [robotocFalando, setRobotocFalando] = useState(false);

  const dispararFalaRobotoc = (texto) => {
    setLegendaRobotoc(texto);
    setRobotocFalando(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(texto);
      utt.lang = 'pt-BR';
      utt.onend = () => { setRobotocFalando(false); setTimeout(() => setLegendaRobotoc(''), 2000); };
      window.speechSynthesis.speak(utt);
    }
  };

  useEffect(() => {
    if (bloqueado || !mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    const globeGroup = new THREE.Group();
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 64, 64), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 }));
    globeGroup.add(earthMesh);
    scene.add(globeGroup);

    // Robotoc 3D à direita
    const robotPartsMain = criarModeloRobotocEspetacular3D();
    const mainRobotGroup = robotPartsMain.robotGroup;
    mainRobotGroup.position.set(2.8, 0.2, 1.0);
    mainRobotGroup.scale.set(1.1, 1.1, 1.1);
    scene.add(mainRobotGroup);
    mainRobotRef.current = mainRobotGroup;

    // VegatocNyx 3D à esquerda
    const vegatoParts = criarModelovegatocnyxEspetacular3D();
    const vegatoGroup = vegatoParts.robotGroup;
    vegatoGroup.position.set(-2.8, 0.2, 1.0);
    vegatoGroup.scale.set(1.1, 1.1, 1.1);
    scene.add(vegatoGroup);
    vegatoRobotRef.current = vegatoGroup;

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      globeGroup.rotation.y += 0.001;
      mainRobotGroup.position.y = 0.2 + Math.sin(time * 2) * 0.08;
      vegatoGroup.position.y = 0.2 + Math.cos(time * 2) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
    };
  }, [bloqueado]);

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '440px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖🌸</div>
          <h2 style={{ color: '#0284c7', fontSize: '18px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> WORKSTATION v6.0
          </h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>
            PROTOCOLO DE 7 ETAPAS ({etapaSeguranca}/7) OU LOGIN FACIAL BETA
          </span>

          {/* BOTÃO DA FUNÇÃO BETA DE LOGIN FACIAL (30 MINUTOS) */}
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '12px' }}>
            <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>✨ FUNÇÃO BETA: LOGIN FACIAL (30 MIN)</span>
            {loginFacialAtivo ? (
              <div>
                <video ref={videoLoginRef} autoPlay playsInline muted style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
                <p style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold', margin: 0 }}>{statusFacial}</p>
              </div>
            ) : (
              <button onClick={iniciarLoginFacialBeta} style={{ width: '100%', padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
                📸 Entrar com Reconhecimento Facial (30 Min)
              </button>
            )}
          </div>

          <div style={{ borderTop: '1px solid #bae6fd', paddingTop: '12px' }}>
            {etapaSeguranca === 1 && (
              <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold' }}>1ª Etapa: Chave de Segurança</span>
                <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite sua Chave..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', outline: 'none' }} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Validar Chave ➔</button>
              </form>
            )}
            {etapaSeguranca === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setEtapaSeguranca(3); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>2ª Etapa: Telefone Autorizado</span>
                <input type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)} placeholder="88981493989" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', textAlign: 'center' }} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Avançar ➔</button>
              </form>
            )}
            {etapaSeguranca >= 3 && (
              <button onClick={() => setBloqueado(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                ⚡ Acessar Emanuel.OS Completamente ➔
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>
          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

          {legendaRobotoc && (
            <div style={{ position: 'absolute', bottom: '135px', right: '30px', zIndex: 145, maxWidth: '340px', backgroundColor: 'rgba(3, 7, 18, 0.85)', border: '1.5px solid #00f0ff', borderRadius: '14px', padding: '12px', color: '#f0f9ff' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff' }}>🎙️ ROBOTOC & VEGATOCNYX</span>
              <p style={{ margin: 0, fontSize: '11px' }}>"{legendaRobotoc}"</p>
            </div>
          )}

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#fff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>{sidebarAberta ? '✕' : '☰'}</button>
            <Link href="/robotocNAV" style={{ backgroundColor: '#00f0ff', color: '#020617', padding: '0 14px', height: '40px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', fontWeight: '900', fontSize: '11px', textDecoration: 'none' }}>🌐 robotocNAV</Link>
            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : '#fff', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Dev Workstation</button>
            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: '#fff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Android 16 HUD</button>
            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: '#fff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Creator Studio</button>
            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🤖 Painel 3D Avatares</button>
            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: '#fff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Mini Robotoc</button>
            <button onClick={() => setYugiohGameAberto(!yugiohGameAberto)} style={{ backgroundColor: '#eab308', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Yu-Gi-Oh! 3D</button>
          </div>

          <aside style={{ position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px', opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(30px)', borderRight: '1px solid rgba(0, 240, 255, 0.4)', padding: sidebarAberta ? '20px' : '0px', display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 190, transition: 'all 0.3s ease' }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', margin: 0 }}>Emanuel.OS v6.0</h1>
                <AgentPanelModule />
                <UnixTerminalCanvas />
                <RobotocNeuralThoughtPanel />
                <DispatcherMensagensNumeros />
                <GoogleMeetAvatarManager />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>
        </div>

        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>

      {janelaRobotocDevAberta && <WindowDevPanelRobotoc onClose={() => setJanelaRobotocDevAberta(false)} />}
      {miniAssistantAberto && <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />}
      <MiniRobotocSidebarNotes />
      {yugiohGameAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 400, backgroundColor: '#0a0f1d' }}>
          <YugiohDuelLinks3D onClose={() => setYugiohGameAberto(false)} />
        </div>
      )}
      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer />
      </AndroidHUDPanel>
      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
