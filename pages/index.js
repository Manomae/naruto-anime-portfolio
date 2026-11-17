import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';
import { coreAssistant } from '../coreAssistantEngine';
import { autoCompleterEngine } from '../components/palavrasAutoComplemento';

// Importação do Módulo de Inteligência Robotoc & Vegatocnyx (Microfone Futurístico & busca)
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
// 🌸 --- HELPER DE MODELAGEM 3D DA VEGATOCNYX 3D (BASEADO NA IMAGEM DE REFERÊNCIA) ---
// =========================================================================================
function criarModeloVegatocnyxEspetacular3D() {
  const vegGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0 });
  const chromeSilverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.92 });
  const metallicBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.75 });
  const darkScreenMat = new THREE.MeshPhysicalMaterial({ color: 0x020617, roughness: 0.08, metalness: 0.3, clearcoat: 1.0 });
  const cyanLedMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.2, roughness: 0.1 });

  // 1. CABEÇA DELICADA COM VISEIRA AZUL/PRETA E RABO DE CAVALO ROBÓTICO CIANO
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.48, 36, 36), whiteArmorMat);
  headBase.scale.set(1.05, 0.92, 0.95);
  headGroup.add(headBase);

  // Rabo de cavalo robótico característico da Vegatocnyx
  const ponytailGroup = new THREE.Group();
  ponytailGroup.position.set(0, 0.25, -0.42);
  const baseHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.2, 20), metallicBlueMat);
  baseHolder.rotation.x = Math.PI / 3;
  const tailCurve = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 20), whiteArmorMat);
  tailCurve.position.set(0, 0.35, -0.15);
  tailCurve.rotation.x = -Math.PI / 4;
  const tailLed = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.75, 16), cyanLedMat);
  tailLed.position.set(0, 0.38, -0.15);
  tailLed.rotation.x = -Math.PI / 4;
  ponytailGroup.add(baseHolder, tailCurve, tailLed);
  headGroup.add(ponytailGroup);

  // Viseira frontal elegante
  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.28, 0.18), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.42);
  headGroup.add(visorScreen);

  // Olhos digitais ciano brilhantes femininos
  const eyeGeo = new THREE.SphereGeometry(0.075, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.1, 1.1, 0.35);
  eyeL.position.set(-0.16, -0.01, 0.51);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.1, 1.1, 0.35);
  eyeR.position.set(0.16, -0.01, 0.51);
  headGroup.add(eyeL, eyeR);

  vegGroup.add(headGroup);

  // Pescoço e colar azul
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  const neckCollar = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.03, 16, 32), metallicBlueMat);
  neckCollar.rotation.x = Math.PI / 2;
  neckCollar.position.set(0, 0.46, 0);
  vegGroup.add(neck, neckCollar);

  // 2. TRONCO ESTILIZADO VEGATOCNYX COM GRAVURA NO PEITO
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 0.98, 0.82);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  torsoGroup.add(chestBlueTrim);

  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.20, 0.25);
  torsoGroup.add(chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.23 - i * 0.015, 0.22 - i * 0.015, 0.07, 24), chromeSilverMat);
    abSeg.scale.set(1.05, 1, 0.82);
    abSeg.position.set(0, -0.14 - i * 0.09, 0);
    torsoGroup.add(abSeg);

    if (i < 2) {
      const abLed = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.02, 0.22), cyanLedMat);
      abLed.position.set(0, -0.18 - i * 0.09, 0.04);
      torsoGroup.add(abLed);
    }
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.20, 24), whiteArmorMat);
  pelvis.scale.set(1.1, 1, 0.85);
  pelvis.position.set(0, -0.44, 0);
  const pelvisTrim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 12, 28), metallicBlueMat);
  pelvisTrim.rotation.x = Math.PI / 2;
  pelvisTrim.position.set(0, -0.35, 0);
  torsoGroup.add(pelvis, pelvisTrim);

  vegGroup.add(torsoGroup);

  // 3. BRAÇOS E PERNAS COM FINO ACABAMENTO DA VEGATOCNYX
  const criarBracoVeg = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.44, 0.34, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), chromeSilverMat);
    const shoulderRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 12, 24), metallicBlueMat);
    shoulderRing.rotation.y = Math.PI / 2;
    armPivot.add(shoulder, shoulderRing);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.26, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.16, 0);
    armPivot.add(upperArm);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.06, -0.32, 0);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), metallicBlueMat);
    elbowGroup.add(elbowJoint);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 0.30, 24), chromeSilverMat);
    forearm.position.set(0, -0.16, 0);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.025, 12, 24), metallicBlueMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.31, 0);
    elbowGroup.add(forearm, cuff);

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.39, 0);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.06), whiteArmorMat);
    handGroup.add(palm);

    for (let f = -1.5; f <= 1.5; f += 1) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.08, 10), chromeSilverMat);
      finger.position.set(f * 0.028, -0.08, 0);
      handGroup.add(finger);
    }

    elbowGroup.add(handGroup);
    armPivot.add(elbowGroup);

    return { armPivot, elbowGroup };
  };

  const rightArmObj = criarBracoVeg(-1);
  rightArmObj.armPivot.rotation.z = -0.18;
  vegGroup.add(rightArmObj.armPivot);

  const leftArmObj = criarBracoVeg(1);
  leftArmObj.armPivot.rotation.z = 0.65;
  leftArmObj.elbowGroup.rotation.z = 1.65;
  vegGroup.add(leftArmObj.armPivot);

  const criarPernaVeg = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.15, -0.50, 0);

    const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), chromeSilverMat);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.24, 20), chromeSilverMat);
    thigh.position.set(0, -0.14, 0);

    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), metallicBlueMat);
    kneeJoint.position.set(0, -0.28, 0.02);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.28, 24), chromeSilverMat);
    shin.position.set(0, -0.42, 0);

    const bootCollar = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 12, 24), metallicBlueMat);
    bootCollar.rotation.x = Math.PI / 2;
    bootCollar.position.set(0, -0.55, 0);

    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.10, 0.30), whiteArmorMat);
    footBase.position.set(0, -0.61, 0.04);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.035, 0.31), metallicBlueMat);
    sole.position.set(0, -0.65, 0.04);

    legGroup.add(hipJoint, thigh, kneeJoint, shin, bootCollar, footBase, sole);
    return legGroup;
  };

  const legL = criarPernaVeg(-1);
  const legR = criarPernaVeg(1);
  vegGroup.add(legL, legR);

  return {
    robotGroup: vegGroup,
    headGroup,
    eyeL,
    eyeR,
    crestLed: chestCoreLed,
    chestCoreLed,
    rightArmPivot: rightArmObj.armPivot,
    leftArmPivot: leftArmObj.armPivot,
    leftElbowGroup: leftArmObj.elbowGroup,
    legL,
    legR
  };
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
// 🌸 --- COMPONENTE: MINI VEGATOCNYX & ROBOTOC 3D ASSISTANT ---
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
  const [respostaIA, setRespostaIA] = useState('Olá! Sou a Vegatocnyx 3D junto ao Robotoc, com microfone futurístico e busca na internet. Fale ou digite qualquer assunto!');
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
        setRespostaIA("🎙️ Vegatocnyx ouvindo sua voz com tecnologia futurística...");
      }
    );
  };

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setDuvidaInput(valor);
    const ultimasPalavras = valor.split(' ');
    const ultimaPalavra = ultimasPalavras[ultimasPalavras.length - 1];
    if (ultimaPalavra.length >= 1) {
      setSugestoes(autoCompleterEngine.buscarCompletar(ultimaPalavra, 4));
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

    const robotParts = criarModeloVegatocnyxEspetacular3D();
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
        miniRobotRef.current.rotation.y = Math.sin(time * 1.2) * 0.2 + Math.sin(boost * Math.PI * 2) * 0.45;
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
          <span style={{ fontSize: '14px' }}>🌸</span>
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>MINI VEGATOCNYX 3D + MICROFONE FUTURÍSTICO</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minHeight: '110px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #00f0ff', padding: '6px', marginBottom: '8px' }}>
        <div ref={mountRef} onClick={() => processarPerguntaRobotoc("Olá Vegatocnyx")} title="Clique na Mini Vegatocnyx 3D!" style={{ width: '90px', height: '100px', cursor: 'pointer', flexShrink: 0 }} />
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Resposta Vegatocnyx:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a', whiteSpace: 'pre-wrap' }}>{carregando ? '⚡ Processando dados e buscando na internet...' : respostaIA}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={iniciarOuvirMicrofone} title="Microfone Futurístico (Falar com a Vegatocnyx)" style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: ouvindo ? 'rgba(239,68,68,0.2)' : 'rgba(2,132,199,0.1)', color: ouvindo ? '#ef4444' : '#0284c7', cursor: 'pointer', fontSize: '14px' }}>🎙️</button>
        <input type="text" value={duvidaInput} onChange={handleInputChange} placeholder="Futebol, faculdade, comida, 'buscar [assunto]'..." style={{ flex: 1, padding: '8px 10px', backgroundColor: '#f8fafc', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '10px', outline: 'none', color: '#0f172a' }} />
        <button onClick={() => processarPerguntaRobotoc(duvidaInput)} style={{ padding: '8px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>Enviar</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🚀 --- COMPONENTE: MINI VEGATOCNYX SIDEBAR & BLOCO DE NOTAS FUTURISTA ---
// =========================================================================================
function MiniRobotocSidebarNotes({ addLogTerminal }) {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('notas');
  const [notas, setNotas] = useState([{ id: 1, titulo: 'Anotações Mestre Kernel', conteudo: 'Mapeamento quântico de Nós AGI com Vegatocnyx 3D ativo.', data: new Date().toLocaleTimeString('pt-BR') }]);
  const [lixeira, setLixeira] = useState([]);
  const [tituloInput, setTituloInput] = useState('');
  const [conteudoInput, setConteudoInput] = useState('');
  const robotMountRef = useRef(null);

  const handleCriarNota = (e) => {
    e.preventDefault();
    if (!conteudoInput.trim()) return;
    const nova = { id: Date.now(), titulo: tituloInput.trim() || `Rascunho ${notas.length + 1}`, conteudo: conteudoInput, data: new Date().toLocaleTimeString('pt-BR') };
    setNotas(prev => [nova, ...prev]);
    setTituloInput('');
    setConteudoInput('');
    if (addLogTerminal) addLogTerminal(`[VEGATOCNYX 3D] Nova nota criada: "${nova.titulo}"`);
  };

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

    const robotParts = criarModeloVegatocnyxEspetacular3D();
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
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (robotMountRef.current && renderer.domElement) robotMountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 450, display: 'flex', alignItems: 'center', transition: 'all 0.4s ease', fontFamily: 'sans-serif' }}>
      <div onClick={() => setExpandido(!expandido)} title="Abrir Bloco de Notas Vegatocnyx 3D" style={{ width: '54px', height: '110px', backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRight: 'none', borderRadius: '20px 0 0 20px', boxShadow: '-8px 0 25px rgba(0, 240, 255, 0.4)', backdropFilter: 'blur(15px)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '4px' }}>
        <div ref={robotMountRef} style={{ width: '45px', height: '45px', pointerEvents: 'none' }} />
        <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: '900', textAlign: 'center' }}>{expandido ? 'FECHAR' : 'NOTAS 3D'}</span>
      </div>

      <div style={{ width: expandido ? '360px' : '0px', height: '520px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: expandido ? '2px solid #00f0ff' : 'none', borderRight: 'none', borderRadius: '20px 0 0 20px', backdropFilter: 'blur(30px)', overflow: 'hidden', transition: 'all 0.4s ease', display: 'flex', flexDirection: 'column', color: '#0f172a' }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #bae6fd', backgroundColor: 'rgba(240, 249, 255, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>📝 BLOCO DE NOTAS VEGATOCNYX 3D</strong>
          <button onClick={() => setExpandido(false)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          <form onSubmit={handleCriarNota} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px' }}>
            <input type="text" placeholder="Título do Rascunho..." value={tituloInput} onChange={(e) => setTituloInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px' }} />
            <textarea rows={3} placeholder="Escreva suas ideias..." value={conteudoInput} onChange={(e) => setConteudoInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px', resize: 'none' }} />
            <button type="submit" style={{ padding: '7px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✨ Salvar Rascunho</button>
          </form>
          {notas.map(n => (
            <div key={n.id} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px' }}>
              <strong style={{ fontSize: '11px', color: '#0284c7' }}>{n.titulo}</strong>
              <p style={{ fontSize: '10px', color: '#334155', margin: '4px 0' }}>{n.conteudo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================================
// 📸 --- MOTION TRACKER ---
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
        if (videoRef.current) videoRef.current.srcObject = stream;
        setActive(true);
        setStatus("Treinando Visão IA Vegatocnyx...");
      } catch (err) {
        alert("Erro ao acessar a câmera: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 VEGATOCNYX VISION TRACKER</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          {active ? 'Desligar Câmera' : 'Ativar Câmera IA'}
        </button>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '120px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: active ? 0.8 : 0.2 }} />
        {!active && <span style={{ position: 'absolute', fontSize: '10px', color: '#94a3b8' }}>Câmera Inativa</span>}
      </div>
    </div>
  );
}

// =========================================================================================
// ⚙️ --- COMPONENTE: ROBOTOC & VEGATOCNYX GEAR ---
// =========================================================================================
function RobotocGear({ onConnectGear, highlightGear }) {
  const [gears, setGears] = useState({ headset: false, mouse: false, keyboard: true });
  const toggleGear = (type) => {
    const nextState = !gears[type];
    setGears(prev => ({ ...prev, [type]: nextState }));
    if (onConnectGear) onConnectGear(type, nextState);
  };
  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: highlightGear ? '2px solid #eab308' : '1px solid #0284c7', borderRadius: '12px', padding: '10px', color: '#0f172a' }}>
      <span style={{ fontSize: '10px', color: highlightGear ? '#d97706' : '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
        ⚙️ PERIFÉRICOS NEURAIS VEGATOCNYX GEAR
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <button onClick={() => toggleGear('headset')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.headset ? '#0284c7' : 'transparent', color: gears.headset ? '#fff' : '#0284c7', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🎧 Headset</button>
        <button onClick={() => toggleGear('mouse')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.mouse ? '#0284c7' : 'transparent', color: gears.mouse ? '#fff' : '#0284c7', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🖱️ Mouse 3D</button>
        <button onClick={() => toggleGear('keyboard')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.keyboard ? '#0284c7' : 'transparent', color: gears.keyboard ? '#fff' : '#0284c7', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>⌨️ Glass Key</button>
      </div>
    </div>
  );
}

// =========================================================================================
// ⌨️ --- COMPONENTE: TECLADO GLASS 3D ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  const [lastKey, setLastKey] = useState(null);
  const keys = [['1','2','3','4','5','6','7','8','9','0'],['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M','Backspace'],['Space', 'Enter']];
  const handlePress = (k) => { setLastKey(k); if (onKeyPress) onKeyPress(k); setTimeout(() => setLastKey(null), 300); };
  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '12px', padding: '10px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D</span>
        {lastKey && <span style={{ fontSize: '10px', backgroundColor: '#0284c7', padding: '1px 6px', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>TECLA: {lastKey}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {keys.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
            {row.map((k) => (
              <button key={k} onClick={() => handlePress(k)} style={{ flex: k === 'Space' ? 3 : k === 'Enter' || k === 'Backspace' ? 1.5 : 1, padding: '6px 2px', background: lastKey === k ? '#00f0ff' : 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.4)', borderRadius: '4px', color: lastKey === k ? '#000' : '#0284c7', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>{k}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================================
// 📲 --- DISPATCHER MENSAGENS ---
// =========================================================================================
function DispatcherMensagensNumeros({ addLog }) {
  const [plataforma, setPlataforma] = useState('whatsapp');
  const [ddd, setDdd] = useState('88');
  const [num1, setNum1] = useState('981493989');
  const [num2, setNum2] = useState('');
  const [mensagem, setMensagem] = useState('Mensagem do Emanuel.OS v7.0 - Sistema VEGATOCNYX & ROBOTOC 3D ativo.');

  const dispararMensagens = () => {
    if (!num1) return alert("Insira ao menos um número de telefone válido.");
    const enviarParaNumero = (numero) => {
      const fullPhone = `55${ddd}${numero.replace(/\D/g, '')}`;
      let url = plataforma === 'whatsapp' ? `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(mensagem)}` : `https://t.me/share/url?url=&text=${encodeURIComponent(mensagem)}`;
      if (url && typeof window !== 'undefined') window.open(url, '_blank');
      if (addLog) addLog(`[DISPATCHER] Mensagem enviada para +${fullPhone}`);
    };
    enviarParaNumero(num1);
    if (num2.trim()) setTimeout(() => enviarParaNumero(num2), 600);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', color: '#0f172a' }}>
      <h3 style={{ color: '#0284c7', fontSize: '11px', margin: '0 0 8px 0' }}>💬 MENSAGERIA REAL VIA NÚMERO DE TELEFONE</h3>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button onClick={() => setPlataforma('whatsapp')} style={{ flex: 1, padding: '6px', border: '1px solid #22c55e', backgroundColor: plataforma === 'whatsapp' ? '#22c55e' : 'transparent', color: plataforma === 'whatsapp' ? '#fff' : '#22c55e', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>WhatsApp</button>
        <button onClick={() => setPlataforma('telegram')} style={{ flex: 1, padding: '6px', border: '1px solid #38bdf8', backgroundColor: plataforma === 'telegram' ? '#38bdf8' : 'transparent', color: plataforma === 'telegram' ? '#fff' : '#38bdf8', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Telegram</button>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input type="text" value={ddd} onChange={(e) => setDdd(e.target.value)} placeholder="DDD" style={{ width: '40px', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px', textAlign: 'center' }} />
        <input type="text" value={num1} onChange={(e) => setNum1(e.target.value)} placeholder="Número 1" style={{ flex: 1, padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px' }} />
      </div>
      <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px', fontSize: '10px', marginBottom: '8px', boxSizing: 'border-box' }} />
      <button onClick={dispararMensagens} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>🚀 Disparar Mensagem Direta</button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- NEURAL THOUGHT PANEL ---
// =========================================================================================
function RobotocNeuralThoughtPanel({ addLog }) {
  const [contaGoogle] = useState('leeheroi123@gmail.com');
  const [contaApple] = useState('emanuel@icloud.com');
  const [contaOneDrive] = useState('emanuel@outlook.com');
  const [statusSinc, setStatusSinc] = useState('Conectado');

  const sincronizarContas = () => {
    setStatusSinc('Sincronizando...');
    if (addLog) addLog(`[VEGATOCNYX & ROBOTOC 3D] Sincronizando Contas: Google (${contaGoogle}), Apple (${contaApple}), OneDrive (${contaOneDrive})`);
    setTimeout(() => { setStatusSinc('Conectado e Ativo'); alert('Sincronização real de e-mails concluída no núcleo v7.0!'); }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#0f172a' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0', fontWeight: 'bold' }}>🧠 PENSAMENTO FUTURISTA VEGATOCNYX & ROBOTOC 3D</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
        <input type="email" value={contaGoogle} readOnly style={{ width: '100%', padding: '5px', fontSize: '10px', boxSizing: 'border-box' }} />
        <input type="email" value={contaApple} readOnly style={{ width: '100%', padding: '5px', fontSize: '10px', boxSizing: 'border-box' }} />
        <input type="email" value={contaOneDrive} readOnly style={{ width: '100%', padding: '5px', fontSize: '10px', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', color: '#16a34a' }}>● Status: {statusSinc}</span>
        <button onClick={sincronizarContas} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🔄 Sincronizar</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 📱 --- ANDROID HUD ---
// =========================================================================================
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{ position: 'fixed', top: 0, right: open ? 0 : '-360px', width: '350px', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.92)', borderLeft: '2px solid #00f0ff', backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s ease', padding: '16px', boxSizing: 'border-box', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7' }}>🤖 ANDROID 16 NEURAL OS v7.0 HUD</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  );
}

// =========================================================================================
// 📊 --- CREATOR STUDIO IA ---
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#0f172a', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#0284c7', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        <h2 style={{ color: '#0284c7', fontSize: '18px', margin: '0 0 10px 0', fontWeight: '900' }}>📊 EM CREATOR STUDIO IA v7.0 (VEGATOCNYX & ROBOTOC)</h2>
        <p style={{ color: '#64748b', fontSize: '11px' }}>Análise de desempenho multimodal e diagnóstico avançado do núcleo AGI.</p>
      </div>
    </div>
  );
}

// =========================================================================================
// 💻 --- DEV SPLIT SCREEN ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('mojo');
  const [codigoFonte, setCodigoFonte] = useState('fn main():\n    print("⚡ Inicializando Vegatocnyx & Robotoc 3D v7.0...")');
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff', borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px', color: '#0f172a', fontFamily: 'monospace', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'sans-serif' }}>Emanuel.OS Workstation v7.0 | Dev Núcleo</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold' }}>✕ Fechar</button>
      </div>
      <textarea value={codigoFonte} onChange={(e) => setCodigoFonte(e.target.value)} style={{ width: '100%', flexGrow: 1, backgroundColor: '#ffffff', border: '1px solid #00f0ff', borderRadius: '8px', color: '#0284c7', padding: '12px', fontSize: '11px', outline: 'none', resize: 'none' }} />
    </div>
  );
}

// =========================================================================================
// ✉️ --- FORMULÁRIO CAPTURA EMAILJS ---
// =========================================================================================
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    emailjs.send('service_94k276x', 'template_o11qtsf', { email, to_email: email, user_email: email }, 'MsHsmnoDh6w2fnYJ6')
      .then(() => { setEnviado(true); setEmail(''); })
      .catch(() => alert('Erro ao enviar e-mail.'));
  };
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>🎁 Baixar 300 Comandos Mestre + Mapas 3D v7.0</h3>
      {enviado ? <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: 'bold' }}>✅ E-mail enviado com sucesso!</div> : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Digite seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
          <button type="submit" style={{ padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 Quero Acesso Gratuito</button>
        </form>
      )}
    </div>
  );
}

// =========================================================================================
// 🎥 --- GOOGLE MEET AVATAR MANAGER ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [temaReuniao, setTemaReuniao] = useState('Imersão Vegatocnyx & Robotoc 2030');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Vegatocnyx 3D (Cibernética Ciano)');
  const [linkGerado, setLinkGerado] = useState('');

  const criarReuniaoInstantanea = () => {
    const urlMeet = `https://meet.google.com/abc-xyz-123`;
    setLinkGerado(urlMeet);
    if (addLog) addLog(`[G-AGI: MEET] Reunião criada com ${avatarEscolhido}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '14px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0' }}>🎥 Google Meet REAL + Avatares IA 3D v7.0</h3>
      <input type="text" value={temaReuniao} onChange={(e) => setTemaReuniao(e.target.value)} style={{ width: '100%', padding: '6px', marginBottom: '6px', fontSize: '11px', boxSizing: 'border-box' }} />
      <select value={avatarEscolhido} onChange={(e) => setAvatarEscolhido(e.target.value)} style={{ width: '100%', padding: '6px', marginBottom: '6px', fontSize: '11px', boxSizing: 'border-box' }}>
        <option value="Vegatocnyx 3D (Cibernética Ciano)">Vegatocnyx 3D (Cibernética Ciano)</option>
        <option value="Robotoc 3D (Azul & Branco Quântico)">Robotoc 3D (Azul & Branco Quântico)</option>
      </select>
      <button onClick={criarReuniaoInstantanea} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>⚡ Criar Google Meet</button>
      {linkGerado && <a href={linkGerado} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#0284c7', display: 'block', marginTop: '6px' }}>{linkGerado}</a>}
    </div>
  );
}

// =========================================================================================
// 🖥️ --- UNIX TERMINAL CANVAS ---
// =========================================================================================
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [history] = useState(['Emanuel.OS v7.0 - Vegatocnyx & Robotoc Shell Ativos.', 'root@emanuel-os:~# ']);
  return (
    <div ref={containerRef} style={{ width: '100%', height: '160px', backgroundColor: '#0f172a', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', color: '#38bdf8', fontSize: '11px', fontFamily: 'monospace', overflowY: 'auto' }}>
      {history.map((h, i) => <div key={i}>{h}</div>)}
    </div>
  );
};

// =========================================================================================
// ₿ --- BITCOIN ANALYSIS PANEL ---
// =========================================================================================
const BitcoinAnalysisPanel = () => {
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
      <h3 style={{ color: '#d97706', fontSize: '13px', margin: '0 0 8px 0' }}>₿ ANALÍTICA & PREVISÃO BITCOIN v7.0</h3>
      <strong style={{ fontSize: '16px', color: '#b45309' }}>$89,450.00 (G-AGI Target $105k)</strong>
    </div>
  );
};

// =========================================================================================
// ☁️ --- CLOUDFLARE WORKER DEPLOYER ---
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => {
  const performDeploy = () => {
    if (addLog) addLog(`[CLOUDFLARE] Deploy global v7.0 concluído.`);
    alert("✅ Worker publicado na borda Cloudflare Edge!");
  };
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #ea580c', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
      <h3 style={{ color: '#ea580c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER v7.0</h3>
      <button onClick={performDeploy} style={{ width: '100%', padding: '10px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 Executar Deploy Global</button>
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
    container3dRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const spotCyan = new THREE.SpotLight(0x00f0ff, 6);
    spotCyan.position.set(-5, 8, 5);
    scene.add(spotCyan);

    const vitrineGroup = new THREE.Group();
    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 }));
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    const contentGroup = new THREE.Group();
    if (modoAtual === 'avatares' || modoAtual === 'bluetooth') {
      const vegaParts = criarModeloVegatocnyxEspetacular3D();
      const vega = vegaParts.robotGroup;
      vega.position.set(-1.3, 0.2, 0);
      vega.scale.set(0.95, 0.95, 0.95);

      const robotParts = criarModeloRobotocEspetacular3D();
      const robot = robotParts.robotGroup;
      robot.position.set(1.3, 0.2, 0);
      robot.scale.set(0.95, 0.95, 0.95);

      contentGroup.add(vega);
      contentGroup.add(robot);
    } else {
      const mapMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 2), new THREE.MeshStandardMaterial({ color: 0x0284c7, wireframe: true }));
      mapMesh.position.y = 0.8;
      contentGroup.add(mapMesh);
    }

    vitrineGroup.add(contentGroup);
    scene.add(vitrineGroup);
    groupVitrineRef.current = vitrineGroup;

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (groupVitrineRef.current) groupVitrineRef.current.rotation.y += 0.008;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container3dRef.current && renderer.domElement) container3dRef.current.removeChild(renderer.domElement);
    };
  }, [modoAtual]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: 'rgba(240, 249, 255, 0.6)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,240,255,0.4)', backdropFilter: 'blur(10px)' }}>
      <div ref={container3dRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '6px' }}>
        <button onClick={() => onSelectModo('avatares')} style={{ padding: '4px 8px', backgroundColor: modoAtual === 'avatares' ? '#0284c7' : '#fff', color: modoAtual === 'avatares' ? '#fff' : '#0f172a', border: '1px solid #0284c7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🌸🤖 Vegatocnyx & Robotoc Vitrine</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🪟 --- WINDOW DEV PANEL ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [modoVitrine, setModoVitrine] = useState('avatares');
  return (
    <div style={{ position: 'fixed', top: '60px', left: '80px', width: '520px', height: '580px', backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '18px', backdropFilter: 'blur(25px)', zIndex: 300, display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#0f172a' }}>
      <div style={{ padding: '12px 16px', backgroundColor: '#f0f9ff', borderBottom: '1px solid #00f0ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7' }}>PAINEL VEGATOCNYX & ROBOTOC DEV v7.0</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <VitrineVirtual3D modoAtual={modoVitrine} onSelectModo={setModoVitrine} onRequestBluetoothConnection={onRequestBluetooth} />
      </div>
    </div>
  );
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (v7.0) --- 🖥️
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas v7.0');

  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const locaisEmanuelOS = [
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor & Nuvem AGI', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, ipCriptografado: 'AES256-EMA', trabalho: 'Engenharia de Software', urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' }
  ];

  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11);
  const [legendaRobotoc, setLegendaRobotoc] = useState('');
  const [robotocFalando, setRobotocFalando] = useState(false);
  const [modoExploracaoTerra, setModoExploracaoTerra] = useState(false);

  const mountRef = useRef(null);
  const globeGroupRef = useRef(null);
  const earthInteriorGroupRef = useRef(null);
  const mainRobotRef = useRef(null);
  const robotClickAnimRef = useRef(0);
  const robotWalkAnimRef = useRef(0);

  const dispararFalaRobotoc = (texto) => {
    setLegendaRobotoc(texto);
    setRobotocFalando(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.onend = () => { setRobotocFalando(false); setTimeout(() => setLegendaRobotoc(''), 3200); };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => { setRobotocFalando(false); setTimeout(() => setLegendaRobotoc(''), 3200); }, 4500);
    }
  };

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (chaveAcessoTripla.trim() === "EMANUEL-TRIPLE-AGI-8888-BRS7" || chaveAcessoTripla.trim() === "8888") {
      setStatusAcessoTriplo("✅ ACESSO CONCEDIDO AO NÚCLEO v7.0!");
      setTimeout(() => setBloqueado(false), 800);
    } else {
      setStatusAcessoTriplo("❌ Chave Inválida!");
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
    globeGroupRef.current = globeGroup;

    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 64, 64), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 }));
    globeGroup.add(earthMesh);

    const earthInteriorGroup = new THREE.Group();
    earthInteriorGroup.visible = false;
    earthInteriorGroup.add(new THREE.Mesh(new THREE.SphereGeometry(2.1, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff5500, wireframe: true })));
    globeGroup.add(earthInteriorGroup);
    earthInteriorGroupRef.current = earthInteriorGroup;

    scene.add(globeGroup);

    // Adicionando a Vegatocnyx 3D no ambiente principal junto ao Robotoc!
    const vegaParts = criarModeloVegatocnyxEspetacular3D();
    const vegaGroup = vegaParts.robotGroup;
    vegaGroup.position.set(2.8, 0.2, 1.0);
    vegaGroup.scale.set(1.2, 1.2, 1.2);
    scene.add(vegaGroup);

    const robotParts = criarModeloRobotocEspetacular3D();
    const robotGroup = robotParts.robotGroup;
    robotGroup.position.set(3.8, 0.2, 0.8);
    robotGroup.scale.set(1.2, 1.2, 1.2);
    scene.add(robotGroup);
    mainRobotRef.current = robotGroup;

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (globeGroupRef.current) globeGroupRef.current.rotation.y += 0.0012;
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
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌸🤖</div>
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> v7.0</h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>VEGATOCNYX & ROBOTOC 3D SECURE KERNEL</span>
          <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{statusAcessoTriplo}</p>
            <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite sua Chave (ex: 8888)..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '13px', outline: 'none' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Desbloquear Sistema ➔</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>
          <div ref={mountRef} title="Terra 3D com Vegatocnyx e Robotoc" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab' }} />

          {legendaRobotoc && (
            <div style={{ position: 'absolute', bottom: '135px', right: '30px', zIndex: 145, maxWidth: '340px', backgroundColor: 'rgba(3, 7, 18, 0.85)', border: '1.5px solid #00f0ff', borderLeft: '5px solid #00f0ff', borderRadius: '14px', padding: '12px 16px', color: '#f0f9ff', backdropFilter: 'blur(16px)' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff' }}>🌸🎙️ VEGATOCNYX & ROBOTOC 3D // NEURAL</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#e0f2fe' }}>"{legendaRobotoc}"</p>
            </div>
          )}

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#fff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>{sidebarAberta ? '✕' : '☰'}</button>
            <Link href="/robotocNAV" style={{ backgroundColor: '#00f0ff', color: '#020617', padding: '0 14px', height: '40px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: '900', fontSize: '11px' }}>🌐 robotocNAV</Link>
            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : 'rgba(255,255,255,0.85)', border: '1px solid #0284c7', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🖥️ Dev Workstation</button>
            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>📱 Android 16 HUD</button>
            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>📊 Creator Studio</button>
            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🌸🤖 Painel Vegatocnyx Dev</button>
            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🌸 Mini Vegatocnyx 3D</button>
            <button onClick={() => setYugiohGameAberto(!yugiohGameAberto)} style={{ backgroundColor: '#eab308', color: '#fff', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>⚔️ Yu-Gi-Oh! Duel Links</button>
          </div>

          <aside style={{ position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px', opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(30px)', borderRight: '1px solid rgba(0, 240, 255, 0.4)', padding: sidebarAberta ? '20px' : '0px', display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 190, transition: 'all 0.3s ease', boxSizing: 'border-box' }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a', margin: 0 }}>EMANUEL<span style={{ color: '#0284c7' }}>.OS v7.0 Workstation</span></h1>
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
