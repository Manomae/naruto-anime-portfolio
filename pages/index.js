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

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1
  });
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
// 🌸 --- HELPER DE MODELAGEM 3D DO VEGATOCNYX (ROBÔ FEMININO COM RABO DE CAVALO & LUZES NEON) ---
// =========================================================================================
function criarModeloVegatocnyxEspetacular3D() {
  const robotGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0 });
  const chromeSilverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.92 });
  const metallicBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.75 });
  const darkScreenMat = new THREE.MeshPhysicalMaterial({ color: 0x020617, roughness: 0.08, metalness: 0.3, clearcoat: 1.0 });
  const cyanLedMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.2, roughness: 0.1 });

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.50, 36, 36), whiteArmorMat);
  headBase.scale.set(1.05, 0.95, 0.95);
  headGroup.add(headBase);

  // Rabo de Cavalo Metálico Curvado (Característica Exclusiva Vegatocnyx)
  const ponytailGroup = new THREE.Group();
  ponytailGroup.position.set(0, 0.35, -0.32);
  const hairBase = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.75, 20), whiteArmorMat);
  hairBase.rotation.x = -Math.PI / 4;
  hairBase.position.set(0, 0.25, -0.2);
  const hairRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 16, 32), metallicBlueMat);
  hairRing.position.set(0, 0.05, 0);
  ponytailGroup.add(hairBase, hairRing);
  headGroup.add(ponytailGroup);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.18), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.41);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.26, 0.19), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.415);
  headGroup.add(visorScreen);

  const eyeGeo = new THREE.SphereGeometry(0.08, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.15, 0.95, 0.35);
  eyeL.position.set(-0.16, -0.02, 0.50);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.15, 0.95, 0.35);
  eyeR.position.set(0.16, -0.02, 0.50);
  headGroup.add(eyeL, eyeR);

  robotGroup.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.53, 0);
  robotGroup.add(neck);

  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.24, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 1, 0.8);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  torsoGroup.add(chestBlueTrim);

  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.20, 0.25);
  torsoGroup.add(chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22 - i * 0.015, 0.21 - i * 0.015, 0.07, 24), chromeSilverMat);
    abSeg.scale.set(1.05, 1, 0.8);
    abSeg.position.set(0, -0.13 - i * 0.09, 0);
    torsoGroup.add(abSeg);
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.20, 24), whiteArmorMat);
  pelvis.scale.set(1.1, 1, 0.85);
  pelvis.position.set(0, -0.43, 0);
  torsoGroup.add(pelvis);

  robotGroup.add(torsoGroup);

  const criarBracoVegatocnyx = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.44, 0.33, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), chromeSilverMat);
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.27, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.17, 0);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.06, -0.32, 0);
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 0.30, 24), chromeSilverMat);
    forearm.position.set(0, -0.17, 0);

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.40, 0);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.06), whiteArmorMat);
    handGroup.add(palm);

    for (let f = -1.5; f <= 1.5; f += 1) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.08, 10), chromeSilverMat);
      finger.position.set(f * 0.028, -0.08, 0);
      handGroup.add(finger);
    }

    elbowGroup.add(handGroup, forearm);
    armPivot.add(shoulder, upperArm, elbowGroup);
    return { armPivot, elbowGroup };
  };

  const rightArmObj = criarBracoVegatocnyx(-1);
  const leftArmObj = criarBracoVegatocnyx(1);
  leftArmObj.armPivot.rotation.z = 0.65;
  leftArmObj.elbowGroup.rotation.z = 1.65;

  robotGroup.add(rightArmObj.armPivot, leftArmObj.armPivot);

  const criarPernaVegatocnyx = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.16, -0.50, 0);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.25, 20), chromeSilverMat);
    thigh.position.set(0, -0.14, 0);
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.28, 24), chromeSilverMat);
    shin.position.set(0, -0.44, 0);
    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, 0.32), whiteArmorMat);
    footBase.position.set(0, -0.62, 0.04);

    legGroup.add(thigh, shin, footBase);
    return legGroup;
  };

  robotGroup.add(criarPernaVegatocnyx(-1), criarPernaVegatocnyx(1));

  return { robotGroup, headGroup, eyeL, eyeR, leftElbowGroup: leftArmObj.elbowGroup };
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
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #00f0ff',
      borderRadius: '16px', padding: '16px', margin: '10px 0', color: '#0f172a',
      fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)', backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{ color: '#0284c7', fontSize: '14px', margin: '0 0 10px 0', fontWeight: 'bold' }}>
        ⚙️ PAINEL WEB DO EM AGENT
      </h2>
      <form onSubmit={handleRunAgent} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Digite o comando para o agente..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '11px', outline: 'none', color: '#0f172a' }}
        />
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
// 🤖 --- COMPONENTE: MINI ROBOTOC 3D & VEGATOCNYX 3D ASSISTANT ---
// =========================================================================================
function MiniRobotocAssistant3D({ onClose }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const miniRobotRef = useRef(null);
  const clickBoostRef = useRef(0);

  const [robotoc] = useState(() => new InteligenciaRobotoc());
  const [tipoAvatar, setTipoAvatar] = useState('robotoc'); // 'robotoc' ou 'vegatocnyx'
  const [duvidaInput, setDuvidaInput] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [respostaIA, setRespostaIA] = useState('Olá! Sou seu Assistente 3D com microfone e busca na internet. Fale ou digite qualquer assunto!');
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

    const robotParts = tipoAvatar === 'robotoc' ? criarModeloRobotocEspetacular3D() : criarModeloVegatocnyxEspetacular3D();
    const miniRobot = robotParts.robotGroup;
    miniRobot.position.set(0, -0.1, 0);
    miniRobot.scale.set(0.85, 0.85, 0.85);
    scene.add(miniRobot);
    miniRobotRef.current = miniRobot;

    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      if (clickBoostRef.current > 0) clickBoostRef.current = Math.max(0, clickBoostRef.current - 0.03);
      const boost = clickBoostRef.current;

      if (miniRobotRef.current) {
        miniRobotRef.current.position.y = -0.1 + Math.sin(time * 2.5) * 0.06 + Math.sin(boost * Math.PI) * 0.18;
        miniRobotRef.current.rotation.y = Math.sin(time * 1.2) * 0.2 + Math.sin(boost * Math.PI * 2) * 0.45;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
    };
  }, [tipoAvatar]);

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '390px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff',
      borderRadius: '20px', padding: '14px', boxShadow: '0 0 35px rgba(0, 240, 255, 0.3)',
      zIndex: 500, backdropFilter: 'blur(20px)', color: '#0f172a', fontFamily: 'sans-serif', maxHeight: '540px', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '6px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🤖</span>
          <strong style={{ fontSize: '10.5px', color: '#0284c7' }}>MINI {tipoAvatar === 'robotoc' ? 'ROBOTOC' : 'VEGATOCNYX'} 3D</strong>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button onClick={() => setTipoAvatar(prev => prev === 'robotoc' ? 'vegatocnyx' : 'robotoc')} style={{ padding: '2px 6px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8.5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Alternar Avatar
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minHeight: '110px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #00f0ff', padding: '6px', marginBottom: '8px' }}>
        <div ref={mountRef} onClick={() => processarPerguntaRobotoc("Olá assistente")} title="Clique no Robô 3D!" style={{ width: '90px', height: '100px', cursor: 'pointer', flexShrink: 0 }} />
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Resposta:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a', whiteSpace: 'pre-wrap' }}>{carregando ? '⚡ Processando dados e buscando na internet...' : respostaIA}</p>
          {imagemBusca && (
            <div style={{ marginTop: '6px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #00f0ff' }}>
              <img src={imagemBusca} alt="Busca" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={iniciarOuvirMicrofone} title="Microfone Futurístico" style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: ouvindo ? 'rgba(239,68,68,0.2)' : 'rgba(2,132,199,0.1)', color: ouvindo ? '#ef4444' : '#0284c7', cursor: 'pointer', fontSize: '14px' }}>
          🎙️
        </button>
        <input
          type="text"
          value={duvidaInput}
          onChange={handleInputChange}
          placeholder="Futebol, estudos, 'buscar [assunto]'..."
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
// 🚀 --- OUTROS MÓDULOS DE SUPORTE (Bloco de Notas, Motion Tracker, etc. mantidos íntegros) ---
// =========================================================================================
function MiniRobotocSidebarNotes({ addLogTerminal }) {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('notas');
  const [notas, setNotas] = useState([{ id: 1, titulo: 'Anotações Mestre', conteudo: 'Sistemas 3D integrados no Emanuel.OS.', data: new Date().toLocaleTimeString('pt-BR') }]);
  const [lixeira, setLixeira] = useState([]);
  const [tituloInput, setTituloInput] = useState('');
  const [conteudoInput, setConteudoInput] = useState('');
  const robotMountRef = useRef(null);

  useEffect(() => {
    if (!robotMountRef.current) return;
    const width = 60, height = 60;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 3.6);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    robotMountRef.current.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const dirLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);
    const robotParts = criarModeloRobotocEspetacular3D();
    scene.add(robotParts.robotGroup);

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      robotParts.robotGroup.position.y = Math.sin(t * 3.0) * 0.08;
      robotParts.robotGroup.rotation.y = Math.sin(t * 1.5) * 0.3;
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
      <div onClick={() => setExpandido(!expandido)} style={{ width: '54px', height: '110px', backgroundColor: 'rgba(255,255,255,0.92)', border: '2px solid #00f0ff', borderRight: 'none', borderRadius: '20px 0 0 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <div ref={robotMountRef} style={{ width: '45px', height: '45px', pointerEvents: 'none' }} />
        <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: '900' }}>{expandido ? 'FECHAR' : 'NOTAS'}</span>
      </div>
      <div style={{ width: expandido ? '360px' : '0px', height: '520px', backgroundColor: 'rgba(255,255,255,0.95)', border: expandido ? '2px solid #00f0ff' : 'none', borderRight: 'none', borderRadius: '20px 0 0 20px', overflow: 'hidden', transition: 'all 0.4s ease', display: 'flex', flexDirection: 'column', padding: expandido ? '12px' : '0' }}>
        {expandido && (
          <div>
            <strong style={{ fontSize: '11px', color: '#0284c7' }}>📝 NOTAS RÁPIDAS</strong>
            <input type="text" placeholder="Título..." value={tituloInput} onChange={e => setTituloInput(e.target.value)} style={{ width: '100%', margin: '6px 0', padding: '6px' }} />
            <textarea placeholder="Conteúdo..." value={conteudoInput} onChange={e => setConteudoInput(e.target.value)} style={{ width: '100%', height: '80px', padding: '6px' }} />
            <button onClick={() => { if (conteudoInput) setNotas([{ id: Date.now(), titulo: tituloInput || 'Nota', conteudo: conteudoInput, data: new Date().toLocaleTimeString() }, ...notas]); setConteudoInput(''); }} style={{ width: '100%', padding: '6px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px' }}>Salvar</button>
            <div style={{ marginTop: '10px', maxHeight: '250px', overflowY: 'auto' }}>
              {notas.map(n => (<div key={n.id} style={{ background: '#f0f9ff', padding: '6px', margin: '4px 0', borderRadius: '6px' }}><strong>{n.titulo}</strong><p style={{ margin: '2px 0', fontSize: '9px' }}>{n.conteudo}</p></div>))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MotionTracker() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  const toggleCamera = async () => {
    if (active) {
      if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      setActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setActive(true);
      } catch (e) { alert("Câmera indisponível: " + e.message); }
    }
  };
  return (
    <div style={{ background: 'rgba(240,249,255,0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 VISION TRACKER</span>
      <button onClick={toggleCamera} style={{ display: 'block', margin: '6px 0', padding: '4px 8px', background: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px' }}>{active ? 'Desligar' : 'Ligar Câmera'}</button>
      <div style={{ width: '100%', height: '100px', background: '#000', borderRadius: '6px', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
}

function RobotocGear() {
  return (
    <div style={{ background: 'rgba(240,249,255,0.85)', border: '1px solid #0284c7', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>⚙️ PERIFÉRICOS NEURAIS</span>
      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
        <span style={{ fontSize: '9px', background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Headset OK</span>
        <span style={{ fontSize: '9px', background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>Mouse 3D OK</span>
      </div>
    </div>
  );
}

function BitcoinAnalysisPanel() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #eab308', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '10px', color: '#d97706', fontWeight: 'bold' }}>₿ BITCOIN QUANT ANALYSIS</span>
      <strong style={{ display: 'block', fontSize: '14px', color: '#b45309', marginTop: '4px' }}>$89,450.00 (Tendência Alta)</strong>
    </div>
  );
}

function CloudflareWorkerDeployer() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #ea580c', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '10px', color: '#ea580c', fontWeight: 'bold' }}>☁️ CLOUDFLARE EDGE DEPLOY</span>
      <button onClick={() => alert("Worker publicado com sucesso!")} style={{ width: '100%', marginTop: '6px', padding: '6px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px' }}>Deploy Global</button>
    </div>
  );
}

function AndroidHUDPanel({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: '340px', height: '100vh', background: 'rgba(255,255,255,0.95)', borderLeft: '2px solid #00f0ff', zIndex: 600, padding: '16px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <strong>Android 16 HUD</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontWeight: 'bold' }}>✕</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  );
}

function EMCreatorStudio({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', width: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontWeight: 'bold' }}>✕</button>
        <h3>Creator Studio AI</h3>
        <p style={{ fontSize: '11px', color: '#64748b' }}>Métricas de engajamento e análises autônomas ativas.</p>
      </div>
    </div>
  );
}

function WindowDevPanelRobotoc({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: '100px', left: '100px', width: '400px', background: '#fff', border: '2px solid #00f0ff', borderRadius: '12px', padding: '16px', zIndex: 650 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong>Painel Dev EMgemini</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none' }}>✕</button>
      </div>
      <p style={{ fontSize: '10px' }}>Inspeção de shaders e renderização 3D em tempo real.</p>
    </div>
  );
}

// =========================================================================================
// 🌟 --- COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0) ---
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [tempoRestanteSessao, setTempoRestanteSessao] = useState(0); // Em segundos (30 min = 1800s)
  const [modoBetaFacialAtivo, setModoBetaFacialAtivo] = useState(false);
  const [webcamLigada, setWebcamLigada] = useState(false);
  const webcamVideoRef = useRef(null);

  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única ou use o Login Facial Beta');
  const [validandoServidores, setValidandoServidores] = useState(false);

  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);

  const [locaisEmanuelOS] = useState([
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor', lat: -3.7172, lng: -38.5437, urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' },
    { id: 2, nome: 'Usina Nuclear Central', categoria: '⚛️ Energia', lat: -23.0062, lng: -44.3182, urlExterna: 'https://maps.google.com/?q=-23.0062,-44.3182' }
  ]);

  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11);

  const [legendaRobotoc, setLegendaRobotoc] = useState('');
  const [robotocFalando, setRobotocFalando] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const globeGroupRef = useRef(null);
  const mainRobotRef = useRef(null);

  // Timer regressivo para o modo Beta de 30 minutos
  useEffect(() => {
    if (tempoRestanteSessao <= 0) return;
    const timer = setInterval(() => {
      setTempoRestanteSessao(prev => {
        if (prev <= 1) {
          setBloqueado(true);
          setModoBetaFacialAtivo(false);
          alert("⏱️ O tempo de teste beta de 30 minutos expirou. Faça login novamente.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tempoRestanteSessao]);

  // Função para ligar a câmera para o Login Facial Beta
  const iniciarLoginFacialBeta = async (minutosEscolha = 30) => {
    setModoBetaFacialAtivo(true);
    setStatusAcessoTriplo("📷 Ativando câmera para escaneamento facial...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
      setWebcamLigada(true);
      setStatusAcessoTriplo("👤 Posicione o rosto na câmera. Autenticando com IA...");

      setTimeout(() => {
        if (webcamVideoRef.current && webcamVideoRef.current.srcObject) {
          webcamVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
        }
        setWebcamLigada(false);
        setModoBetaFacialAtivo(false);
        setBloqueado(false);
        setTempoRestanteSessao(minutosEscolha * 60); // Ex: 30 minutos em segundos
        alert(`✅ Login facial aprovado! Acesso liberado por ${minutosEscolha} minutos.`);
      }, 3000);
    } catch (e) {
      setWebcamLigada(false);
      setModoBetaFacialAtivo(false);
      alert("⚠️ Erro ao acessar a webcam para login facial: " + e.message);
      setStatusAcessoTriplo("🔐 Insira a Chave Mestre ou tente novamente.");
    }
  };

  const processarAutenticacao = (e) => {
    e.preventDefault();
    if (chaveAcessoTripla.trim() === "EMANUEL-TRIPLE-AGI-8888-BRS7" || chaveAcessoTripla.trim() === "8888") {
      setBloqueado(false);
      setTempoRestanteSessao(1800); // 30 minutos padrão para acesso mestre também
    } else {
      alert("⚠️ Chave inválida! Use '8888' ou utilize o Login Facial Beta de 30 minutos.");
    }
  };

  const dispararFalaRobotoc = (texto) => {
    setLegendaRobotoc(texto);
    setRobotocFalando(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.onend = () => { setRobotocFalando(false); setTimeout(() => setLegendaRobotoc(''), 3000); };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setRobotocFalando(false), 3000);
    }
  };

  useEffect(() => {
    if (bloqueado || !mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 64, 64),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.3 })
    );
    globeGroup.add(earthMesh);
    scene.add(globeGroup);

    // Adicionando o Robotoc 3D principal na cena 3D
    const robotParts = criarModeloRobotocEspetacular3D();
    const mainRobotGroup = robotParts.robotGroup;
    mainRobotGroup.position.set(3.2, 0.2, 1.0);
    mainRobotGroup.scale.set(1.25, 1.25, 1.25);
    scene.add(mainRobotGroup);
    mainRobotRef.current = mainRobotGroup;

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      if (globeGroupRef.current) globeGroupRef.current.rotation.y += 0.001;
      if (mainRobotRef.current) {
        mainRobotRef.current.position.y = 0.2 + Math.sin(time * 2.0) * 0.12;
      }
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
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> WORKSTATION v6.0
          </h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>
            PORTAL DE ACESSO & TESTE BETA
          </span>

          <p style={{ fontSize: '11px', color: '#334155', marginBottom: '15px' }}>{statusAcessoTriplo}</p>

          {modoBetaFacialAtivo && (
            <div style={{ margin: '15px 0', borderRadius: '12px', overflow: 'hidden', border: '2px solid #00f0ff', background: '#000' }}>
              <video ref={webcamVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <span style={{ color: '#00f0ff', fontSize: '10px', display: 'block', padding: '6px' }}>Escaneando feições faciais para liberação beta...</span>
            </div>
          )}

          {!modoBetaFacialAtivo && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <form onSubmit={processarAutenticacao} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Chave Mestre (ex: 8888)..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff', textAlign: 'center', outline: 'none' }} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar com Chave</button>
              </form>

              <div style={{ borderTop: '1px solid #bae6fd', margin: '10px 0', paddingTop: '10px' }}>
                <button onClick={() => iniciarLoginFacialBeta(30)} style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
                  👤 Entrar com Login Facial Beta (30 Min)
                </button>
                <span style={{ fontSize: '8.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>Liberação automática por reconhecimento facial via IA para visitantes.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* Barra superior de status do Modo Beta */}
      {tempoRestanteSessao > 0 && (
        <div style={{ position: 'absolute', top: '15px', right: '20px', zIndex: 300, background: 'rgba(2, 132, 199, 0.9)', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', backdropFilter: 'blur(10px)', border: '1px solid #00f0ff' }}>
          ⏱️ Sessão Beta Ativa: {Math.floor(tempoRestanteSessao / 60)}m {tempoRestanteSessao % 60}s restantes
        </div>
      )}

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

        {legendaRobotoc && (
          <div style={{ position: 'absolute', bottom: '135px', right: '30px', zIndex: 145, maxWidth: '340px', backgroundColor: 'rgba(3, 7, 18, 0.85)', border: '1.5px solid #00f0ff', borderRadius: '14px', padding: '12px 16px', color: '#f0f9ff' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff' }}>🎙️ ROBOTOC 3D // TRANSMISSÃO</span>
            <p style={{ margin: 0, fontSize: '11.5px', color: '#e0f2fe' }}>"{legendaRobotoc}"</p>
          </div>
        )}

        {/* Menu Superior de Atalhos */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ background: '#fff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>☰</button>
          
          <button onClick={() => setAndroidHudOpen(true)} style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>📱 Android 16 HUD</button>
          <button onClick={() => setModalCreatorStudioAberto(true)} style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>📊 Creator Studio</button>
          <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🤖 Painel Dev 3D</button>
          <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ background: miniAssistantAberto ? '#00f0ff' : 'rgba(255,255,255,0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🤖 Mini Assistente (Robotoc/Vegatocnyx)</button>
          <button onClick={() => setYugiohGameAberto(!yugiohGameAberto)} style={{ background: '#eab308', color: '#fff', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>⚔️ Yu-Gi-Oh! 3D</button>
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '380px' : '0px', height: '100vh', background: 'rgba(255,255,255,0.92)', borderRight: '1px solid #00f0ff', padding: sidebarAberta ? '20px' : '0px', overflowY: 'auto', zIndex: 190, transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sidebarAberta && (
            <>
              <h2 style={{ fontSize: '16px', color: '#0284c7', margin: 0 }}>EMANUEL.OS v6.0 Core</h2>
              <AgentPanelModule />
              <button onClick={() => setSidebarAberta(false)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Fechar Menu</button>
            </>
          )}
        </aside>
      </div>

      {/* Janelas e Modais Integrados */}
      {miniAssistantAberto && <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />}
      <MiniRobotocSidebarNotes />
      {janelaRobotocDevAberta && <WindowDevPanelRobotoc onClose={() => setJanelaRobotocDevAberta(false)} />}
      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer />
      </AndroidHUDPanel>

      {yugiohGameAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 400, background: '#0a0f1d' }}>
          <YugiohDuelLinks3D onClose={() => setYugiohGameAberto(false)} />
        </div>
      )}
    </div>
  );
}
