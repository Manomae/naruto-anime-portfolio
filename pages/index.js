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

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const chromeSilverMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.2,
    metalness: 0.92
  });

  const metallicBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.25,
    metalness: 0.75
  });

  const darkScreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x020617,
    roughness: 0.08,
    metalness: 0.3,
    clearcoat: 1.0
  });

  const cyanLedMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 3.2,
    roughness: 0.1
  });

  // Cabeça
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

  // Tronco
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

  // Braços
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

  // Pernas
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
// 🌸 --- HELPER DE MODELAGEM 3D DA VEGATOCNYX 3D (BASEADA NA IMAGEM DE REFERÊNCIA) ---
// =========================================================================================
function criarModeloVegatocnyxEspetacular3D() {
  const vegaGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const chromeSilverMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.2,
    metalness: 0.92
  });

  const metallicBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.25,
    metalness: 0.75
  });

  const darkScreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x020617,
    roughness: 0.08,
    metalness: 0.3,
    clearcoat: 1.0
  });

  const cyanLedMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 3.2,
    roughness: 0.1
  });

  // Cabeça Feminina Estilizada Robotizada
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.50, 36, 36), whiteArmorMat);
  headBase.scale.set(1.05, 0.95, 0.98);
  headGroup.add(headBase);

  // Viseira / Olhos Ciano Brilhantes
  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.34, 0.18), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.42);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.28, 0.19), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.425);
  headGroup.add(visorScreen);

  const eyeGeo = new THREE.SphereGeometry(0.08, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.1, 0.9, 0.35);
  eyeL.position.set(-0.16, -0.02, 0.51);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.1, 0.9, 0.35);
  eyeR.position.set(0.16, -0.02, 0.51);
  headGroup.add(eyeL, eyeR);

  // Rabo de Cavalo Robótico Arqueado (Pigtail traseiro com anéis azuis luminosos)
  const pigtailGroup = new THREE.Group();
  pigtailGroup.position.set(0, 0.32, -0.28);
  pigtailGroup.rotation.x = -0.4;

  const tailBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.65, 20), chromeSilverMat);
  tailBase.position.set(0, 0.3, 0);
  tailBase.rotation.z = -0.2;
  pigtailGroup.add(tailBase);

  for (let t = 0; t < 3; t++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15 - t * 0.02, 0.03, 16, 32), cyanLedMat);
    ring.position.set(-0.02 * t, 0.15 + t * 0.2, 0);
    ring.rotation.x = Math.PI / 2;
    pigtailGroup.add(ring);
  }
  headGroup.add(pigtailGroup);
  vegaGroup.add(headGroup);

  // Pescoço
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  vegaGroup.add(neck);

  // Tronco Feminino Armadurado
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.26, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 0.95, 0.82);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  torsoGroup.add(chestBlueTrim);

  // Placa com nome VEGATOCNYX no peito
  const namePlate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.04), darkScreenMat);
  namePlate.position.set(0, 0.22, 0.24);
  torsoGroup.add(namePlate);

  const coreLed = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), cyanLedMat);
  coreLed.position.set(0, 0.12, 0.25);
  torsoGroup.add(coreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22 - i * 0.012, 0.21 - i * 0.012, 0.07, 24), chromeSilverMat);
    abSeg.scale.set(1.05, 1, 0.82);
    abSeg.position.set(0, -0.14 - i * 0.09, 0);
    torsoGroup.add(abSeg);
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.19, 0.20, 24), whiteArmorMat);
  pelvis.scale.set(1.18, 1, 0.88);
  pelvis.position.set(0, -0.44, 0);
  torsoGroup.add(pelvis);

  vegaGroup.add(torsoGroup);

  // Braços
  const criarBracoVega = (lado) => {
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
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.013, 0.07, 10), chromeSilverMat);
    thumb.position.set(-lado * 0.07, -0.02, 0.02);
    handGroup.add(thumb);

    elbowGroup.add(handGroup);
    armPivot.add(elbowGroup);

    return { armPivot, elbowGroup };
  };

  const rightArmObj = criarBracoVega(-1);
  rightArmObj.armPivot.rotation.z = -0.15;
  vegaGroup.add(rightArmObj.armPivot);

  const leftArmObj = criarBracoVega(1);
  leftArmObj.armPivot.rotation.z = 0.60;
  leftArmObj.elbowGroup.rotation.z = 1.60;
  vegaGroup.add(leftArmObj.armPivot);

  // Pernas
  const criarPernaVega = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.16, -0.52, 0);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.085, 0.28, 20), chromeSilverMat);
    thigh.position.set(0, -0.15, 0);

    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), metallicBlueMat);
    kneeJoint.position.set(0, -0.30, 0.02);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.30, 24), chromeSilverMat);
    shin.position.set(0, -0.46, 0);

    const bootCollar = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 12, 24), metallicBlueMat);
    bootCollar.rotation.x = Math.PI / 2;
    bootCollar.position.set(0, -0.60, 0);

    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, 0.32), whiteArmorMat);
    footBase.position.set(0, -0.65, 0.05);

    legGroup.add(thigh, kneeJoint, shin, bootCollar, footBase);
    return legGroup;
  };

  const legL = criarPernaVega(-1);
  const legR = criarPernaVega(1);
  vegaGroup.add(legL, legR);

  return {
    vegaGroup,
    headGroup,
    eyeL,
    eyeR,
    coreLed,
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
// 🤖 --- COMPONENTE: MINI ROBOTOC & VEGATOCNYX ASSISTANT 3D ---
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
  const [respostaIA, setRespostaIA] = useState('Olá! Sou seu assistente 3D com inteligência avançada. Fale ou digite qualquer assunto!');
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

    const lightFront = new THREE.DirectionalLight(0xffffff, 2.0);
    lightFront.position.set(-2, 3, 5);
    scene.add(lightFront);

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
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>MINI ROBOTOC & VEGATOCNYX 3D</strong>
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
          <strong>💡 Resposta:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a', whiteSpace: 'pre-wrap' }}>{carregando ? '⚡ Processando dados e buscando na internet...' : respostaIA}</p>
          
          {imagemBusca && (
            <div style={{ marginTop: '6px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #00f0ff' }}>
              <img src={imagemBusca} alt="Ilustração" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
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
          title="Microfone Futurístico"
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
// 🚀 --- COMPONENTE: MINI SIDEBAR NOTAS COM ROBOTOC 3D ---
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
    <div style={{
      position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 450,
      display: 'flex', alignItems: 'center', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: 'sans-serif'
    }}>
      <div
        onClick={() => setExpandido(!expandido)}
        title="Abrir Bloco de Notas"
        style={{
          width: '54px', height: '110px', backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '2px solid #00f0ff', borderRight: 'none', borderRadius: '20px 0 0 20px',
          boxShadow: '-8px 0 25px rgba(0, 240, 255, 0.4)', backdropFilter: 'blur(15px)',
          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '4px', padding: '4px'
        }}
      >
        <div ref={robotMountRef} style={{ width: '45px', height: '45px', pointerEvents: 'none' }} />
        <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: '900', textAlign: 'center' }}>
          {expandido ? 'FECHAR' : 'NOTAS 3D'}
        </span>
      </div>

      <div style={{
        width: expandido ? '360px' : '0px', height: '520px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)', border: expandido ? '2px solid #00f0ff' : 'none',
        borderRight: 'none', borderRadius: '20px 0 0 20px', backdropFilter: 'blur(30px)',
        overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column', color: '#0f172a'
      }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #bae6fd', backgroundColor: 'rgba(240, 249, 255, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>📝 BLOCO DE NOTAS ROBOTOC 3D</strong>
          <button onClick={() => setExpandido(false)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          <form onSubmit={handleCriarNota} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px' }}>
            <input type="text" placeholder="Título..." value={tituloInput} onChange={(e) => setTituloInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px' }} />
            <textarea rows={3} placeholder="Escreva sua nota..." value={conteudoInput} onChange={(e) => setConteudoInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px', resize: 'none' }} />
            <button type="submit" style={{ padding: '7px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Nota</button>
          </form>

          {notas.map(nota => (
            <div key={nota.id} style={{ backgroundColor: '#fff', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px' }}>
              <strong style={{ fontSize: '11px', color: '#0284c7' }}>{nota.titulo}</strong>
              <p style={{ fontSize: '10px', color: '#334155', margin: '4px 0' }}>{nota.conteudo}</p>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => handleDownloadTXT(nota)} style={{ padding: '4px 8px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8.5px', cursor: 'pointer' }}>TXT</button>
                <button onClick={() => handleDownloadPDF(nota)} style={{ padding: '4px 8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8.5px', cursor: 'pointer' }}>PDF</button>
              </div>
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setActive(true);
        setStatus("Treinando Visão IA...");
      } catch (err) {
        alert("Erro ao acessar a câmera: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 ROBOTOC VISION TRACKER</span>
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
// ⚙️ --- ROBOTOC GEAR ---
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
        ⚙️ PERIFÉRICOS NEURAIS ROBOTOC GEAR
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <button onClick={() => toggleGear('headset')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.headset ? '#0284c7' : 'transparent', color: gears.headset ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>🎧 Headset</button>
        <button onClick={() => toggleGear('mouse')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.mouse ? '#0284c7' : 'transparent', color: gears.mouse ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>🖱️ Mouse 3D</button>
        <button onClick={() => toggleGear('keyboard')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.keyboard ? '#0284c7' : 'transparent', color: gears.keyboard ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>⌨️ Glass Key</button>
      </div>
    </div>
  );
}

// =========================================================================================
// ⌨️ --- TECLADO GLASS 3D ---
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
    <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '12px', padding: '10px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D</span>
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
                  cursor: 'pointer'
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
// 📲 --- DISPATCHER MENSAGENS ---
// =========================================================================================
function DispatcherMensagensNumeros({ addLog }) {
  const [plataforma, setPlataforma] = useState('whatsapp');
  const [ddd, setDdd] = useState('88');
  const [num1, setNum1] = useState('981493989');
  const [num2, setNum2] = useState('');
  const [mensagem, setMensagem] = useState('Mensagem do Emanuel.OS v6.0 - Sistema ROBOTOC & VEGATOCNYX ativo.');

  const dispararMensagens = () => {
    if (!num1) return alert("Insira um número válido.");
    const fullPhone = `55${ddd}${num1.replace(/\D/g, '')}`;
    let url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    if (addLog) addLog(`[DISPATCHER] Mensagem enviada para +${fullPhone}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', color: '#0f172a' }}>
      <h3 style={{ color: '#0284c7', fontSize: '11px', margin: '0 0 8px 0' }}>💬 MENSAGERIA REAL VIA TELEFONE</h3>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input type="text" value={ddd} onChange={(e) => setDdd(e.target.value)} style={{ width: '40px', padding: '6px', borderRadius: '6px', fontSize: '10px' }} />
        <input type="text" value={num1} onChange={(e) => setNum1(e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '6px', fontSize: '10px' }} />
      </div>
      <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2} style={{ width: '100%', borderRadius: '6px', padding: '6px', fontSize: '10px', marginBottom: '8px' }} />
      <button onClick={dispararMensagens} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Disparar Mensagem</button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- ROBOTOC NEURAL THOUGHT PANEL ---
// =========================================================================================
function RobotocNeuralThoughtPanel({ addLog }) {
  const [contaGoogle] = useState('leeheroi123@gmail.com');
  const [statusSinc, setStatusSinc] = useState('Conectado');

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#0f172a' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0', fontWeight: 'bold' }}>🧠 PENSAMENTO NEURAL ROBOTOC & VEGATOCNYX</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', color: '#16a34a' }}>● Status: {statusSinc}</span>
        <button onClick={() => { setStatusSinc('Sincronizado'); if (addLog) addLog('[NEURAL] Sincronizado com sucesso.'); }} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', cursor: 'pointer' }}>Sincronizar</button>
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
        <strong style={{ fontSize: '12px', color: '#0284c7' }}>ANDROID 16 NEURAL OS EM HUD v6.0</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  );
}

// =========================================================================================
// 📊 --- EM CREATOR STUDIO IA ---
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#0f172a', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#0284c7', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        <h2 style={{ color: '#0284c7', fontSize: '18px', margin: '0 0 10px 0' }}>📊 EM CREATOR STUDIO IA</h2>
        <p style={{ fontSize: '11px', color: '#64748b' }}>Análise de desempenho multimodal e ações autônomas para projetos.</p>
      </div>
    </div>
  );
}

// =========================================================================================
// 💻 --- PAINEL DEV SPLIT SCREEN ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('mojo');
  const [codigoFonte, setCodigoFonte] = useState(`# Mojo AI High-Performance\nfn main():\n    print("⚡ Inicializando Robotoc & Vegatocnyx Core...")`);
  
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff', borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px', color: '#0f172a', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7' }}>Emanuel.OS Workstation v6.0 | Dev Núcleo</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold' }}>✕ Fechar</button>
      </div>
      <textarea value={codigoFonte} onChange={(e) => setCodigoFonte(e.target.value)} style={{ width: '100%', flexGrow: 1, backgroundColor: '#fff', border: '1px solid #00f0ff', borderRadius: '8px', color: '#0284c7', padding: '12px', fontSize: '11px', fontFamily: 'Consolas' }} />
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
    emailjs.send('service_94k276x', 'template_o11qtsf', { email, to_email: email }, 'MsHsmnoDh6w2fnYJ6')
      .then(() => { setEnviado(true); setEmail(''); })
      .catch(() => alert('Erro ao enviar e-mail.'));
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', margin: '0 0 6px 0', fontSize: '12px' }}>🎁 Baixar 300 Comandos Mestre + Mapas 3D</h3>
      {enviado ? <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '11px' }}>✅ E-mail enviado com sucesso!</p> : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
          <button type="submit" style={{ padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Quero Acesso Gratuito</button>
        </form>
      )}
    </div>
  );
}

// =========================================================================================
// 🎥 --- GOOGLE MEET AVATAR MANAGER ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [tema, setTema] = useState('Imersão Robotoc & Vegatocnyx 3D');
  const [avatar, setAvatar] = useState('Robotoc 3D & Vegatocnyx 3D');
  const [link, setLink] = useState('');

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0' }}>🎥 Google Meet REAL + Avatares 3D</h3>
      <input type="text" value={tema} onChange={(e) => setTema(e.target.value)} style={{ width: '100%', padding: '6px', marginBottom: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px' }} />
      <button onClick={() => { setLink('https://meet.google.com/abc-defg-hij'); if (addLog) addLog('[MEET] Reunião criada.'); }} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Criar Reunião</button>
      {link && <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#0284c7', display: 'block', marginTop: '6px' }}>{link}</a>}
    </div>
  );
}

// =========================================================================================
// 🖥️ --- UNIX TERMINAL CANVAS ---
// =========================================================================================
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [history] = useState(['Emanuel.OS v6.0 - Terminal Nativo', 'Robotoc & Vegatocnyx Shell Online.']);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px monospace';
    history.forEach((h, i) => ctx.fillText(h, 10, 20 + i * 16));
  }, [history]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '180px', backgroundColor: '#0f172a', border: '2px solid #00f0ff', borderRadius: '10px', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// =========================================================================================
// ₿ --- BITCOIN ANALYSIS PANEL ---
// =========================================================================================
const BitcoinAnalysisPanel = () => (
  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
    <h3 style={{ color: '#d97706', fontSize: '13px', margin: '0 0 8px 0' }}>₿ ANALÍTICA BITCOIN G-AGI</h3>
    <strong style={{ fontSize: '16px', color: '#b45309' }}>$89,450.00</strong>
  </div>
);

// =========================================================================================
// ☁️ --- CLOUDFLARE WORKER DEPLOYER ---
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => (
  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #ea580c', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0' }}>
    <h3 style={{ color: '#ea580c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER</h3>
    <button onClick={() => { alert("Deploy realizado!"); if (addLog) addLog('[CLOUDFLARE] Deploy OK.'); }} style={{ width: '100%', padding: '8px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar Deploy</button>
  </div>
);

// =========================================================================================
// 🏛️ --- VITRINE VIRTUAL 3D DE VIDRO (Com Robotoc e Vegatocnyx lado a lado) ---
// =========================================================================================
function VitrineVirtual3D({ modoAtual, onSelectModo, onRequestBluetoothConnection }) {
  const container3dRef = useRef(null);
  const groupVitrineRef = useRef(null);

  useEffect(() => {
    if (!container3dRef.current) return;
    const width = container3dRef.current.clientWidth;
    const height = container3dRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container3dRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const spotCyan = new THREE.SpotLight(0x00f0ff, 6);
    spotCyan.position.set(-5, 8, 5);
    scene.add(spotCyan);

    const vitrineGroup = new THREE.Group();

    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.9 }));
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 4.5, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5, side: THREE.DoubleSide }));
    glassMesh.position.y = 1.0;
    vitrineGroup.add(glassMesh);

    const contentGroup = new THREE.Group();

    if (modoAtual === 'avatares' || modoAtual === 'bluetooth') {
      // Robotoc 3D à esquerda
      const robotParts = criarModeloRobotocEspetacular3D();
      const robot = robotParts.robotGroup;
      robot.position.set(-1.3, 0.2, 0);
      robot.scale.set(0.9, 0.9, 0.9);
      contentGroup.add(robot);

      // Vegatocnyx 3D à direita
      const vegaParts = criarModeloVegatocnyxEspetacular3D();
      const vega = vegaParts.vegaGroup;
      vega.position.set(1.3, 0.2, 0);
      vega.scale.set(0.9, 0.9, 0.9);
      contentGroup.add(vega);
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

    const domEl = container3dRef.current;
    return () => {
      cancelAnimationFrame(animId);
      if (domEl && renderer.domElement) domEl.removeChild(renderer.domElement);
    };
  }, [modoAtual]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: 'rgba(240, 249, 255, 0.6)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,240,255,0.4)' }}>
      <div ref={container3dRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '6px' }}>
        <button onClick={() => onSelectModo('avatares')} style={{ padding: '4px 8px', backgroundColor: modoAtual === 'avatares' ? '#0284c7' : '#fff', color: modoAtual === 'avatares' ? '#fff' : '#0f172a', border: '1px solid #0284c7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🤖 Robotoc & Vegatocnyx</button>
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
    <div style={{
      position: 'fixed', top: '60px', left: '80px', width: '520px', height: '580px',
      backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '18px',
      backdropFilter: 'blur(25px)', zIndex: 300, boxShadow: '0 0 40px rgba(0,240,255,0.25)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#0f172a', fontFamily: 'sans-serif'
    }}>
      <div style={{ padding: '12px 16px', backgroundColor: 'rgba(240, 249, 255, 0.95)', borderBottom: '1px solid #00f0ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7' }}>PAINEL FUTURISTA ROBOTOC & VEGATOCNYX</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <VitrineVirtual3D modoAtual={modoVitrine} onSelectModo={(m) => setModoVitrine(m)} onRequestBluetoothConnection={onRequestBluetooth} />
      </div>
    </div>
  );
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL EMANUEL.OS CORE v6.0 ---
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);
  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);
  const [solicitarConexaoBluetooth, setSolicitarConexaoBluetooth] = useState(false);

  const [cmdLogs, setCmdLogs] = useState(["[ROBOTOC & VEGATOCNYX] Online e operacionais."]);
  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC & VEGATOCNYX 3D', texto: 'Sistema operacional Emanuel.OS v6.0 ativado com sucesso!', tipo: 'sys' }
  ]);
  const [legendaRobotoc, setLegendaRobotoc] = useState('');
  const [robotocFalando, setRobotocFalando] = useState(false);

  const mountRef = useRef(null);
  const mainRobotRef = useRef(null);
  const mainVegaRef = useRef(null);

  const locaisEmanuelOS = [
    { id: 1, nome: 'Emanuel.OS Core Data Center', categoria: '🖥️ Servidor & AGI', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, trabalho: 'Engenharia AGI', urlExterna: 'https://maps.google.com' }
  ];

  const dispararFalaRobotoc = (texto) => {
    setLegendaRobotoc(texto);
    setRobotocFalando(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.onend = () => { setRobotocFalando(false); setTimeout(() => setLegendaRobotoc(''), 3200); };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => { setRobotocFalando(false); setTimeout(() => setLegendaRobotoc(''), 3200); }, 4500);
    }
  };

  const addLogTerminal = (log) => setCmdLogs(prev => [...prev, log]);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    // Globo Terra 3D
    const globeGroup = new THREE.Group();
    const radius = 2.5;
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 }));
    globeGroup.add(earthMesh);
    scene.add(globeGroup);

    // Adicionando o Robotoc 3D à cena principal
    const robotParts = criarModeloRobotocEspetacular3D();
    const robotGroup = robotParts.robotGroup;
    robotGroup.position.set(2.5, 0.2, 1.0);
    robotGroup.scale.set(1.1, 1.1, 1.1);
    scene.add(robotGroup);
    mainRobotRef.current = robotGroup;

    // Adicionando a Vegatocnyx 3D à cena principal (ao lado do Robotoc)
    const vegaParts = criarModeloVegatocnyxEspetacular3D();
    const vegaGroup = vegaParts.vegaGroup;
    vegaGroup.position.set(4.2, 0.2, 0.5);
    vegaGroup.scale.set(1.1, 1.1, 1.1);
    scene.add(vegaGroup);
    mainVegaRef.current = vegaGroup;

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      globeGroup.rotation.y += 0.001;

      if (mainRobotRef.current) {
        mainRobotRef.current.position.y = 0.2 + Math.sin(time * 2.0) * 0.08;
      }
      if (mainVegaRef.current) {
        mainVegaRef.current.position.y = 0.2 + Math.cos(time * 2.0) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    const domEl = mountRef.current;
    return () => {
      cancelAnimationFrame(animId);
      if (domEl && renderer.domElement) domEl.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>
          
          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab' }} />

          {legendaRobotoc && (
            <div style={{
              position: 'absolute', bottom: '135px', right: '30px', zIndex: 145, maxWidth: '340px',
              backgroundColor: 'rgba(3, 7, 18, 0.85)', border: '1.5px solid #00f0ff', borderLeft: '5px solid #00f0ff',
              borderRadius: '14px', padding: '12px 16px', color: '#f0f9ff', backdropFilter: 'blur(16px)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.35)', fontFamily: 'Consolas, monospace'
            }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff', display: 'block', marginBottom: '4px' }}>🎙️ ROBOTOC & VEGATOCNYX 3D</span>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#e0f2fe' }}>"{legendaRobotoc}"</p>
            </div>
          )}

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#fff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>
            <Link href="/robotocNAV" style={{ backgroundColor: '#00f0ff', color: '#020617', padding: '0 14px', height: '40px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', fontWeight: '900', fontSize: '11px', textDecoration: 'none' }}>
              🌐 robotocNAV
            </Link>
            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : 'rgba(255,255,255,0.85)', border: '1px solid #0284c7', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🖥️ Dev Workstation
            </button>
            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📱 Android HUD
            </button>
            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📊 Creator Studio
            </button>
            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🤖 Painel Vitrine 3D
            </button>
            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🤖 Mini Assistant
            </button>
            <button onClick={() => setYugiohGameAberto(!yugiohGameAberto)} style={{ backgroundColor: '#eab308', color: '#fff', border: 'none', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              ⚔️ Yu-Gi-Oh! 3D
            </button>
          </div>

          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px',
            opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(30px)',
            borderRight: '1px solid rgba(0, 240, 255, 0.4)', padding: sidebarAberta ? '20px' : '0px',
            display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 190, transition: 'all 0.3s ease'
          }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  EMANUEL<span style={{ color: '#0284c7' }}>.OS Workstation v6.0</span>
                </h1>
                <AgentPanelModule />
                <UnixTerminalCanvas />
                <RobotocNeuralThoughtPanel addLog={addLogTerminal} />
                <DispatcherMensagensNumeros addLog={addLogTerminal} />
                <GoogleMeetAvatarManager addLog={addLogTerminal} />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>

          <div style={{ position: 'absolute', bottom: '65px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: 'calc(100% - 30px)', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (chatInput.trim()) {
                  const cmdUser = chatInput.trim();
                  const respostaRobotoc = `Comando "${cmdUser}" processado por Robotoc & Vegatocnyx 3D.`;
                  setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: cmdUser, tipo: 'user' }, { autor: 'ROBOTOC & VEGATOCNYX', texto: respostaRobotoc, tipo: 'sys' }]);
                  dispararFalaRobotoc(respostaRobotoc);
                  setChatInput('');
                }
              }}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #00f0ff', borderRadius: '25px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com Robotoc & Vegatocnyx 3D..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontSize: '10px', flexGrow: 1 }} />
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
        <WindowDevPanelRobotoc onClose={() => setJanelaRobotocDevAberta(false)} onRequestBluetooth={() => setSolicitarConexaoBluetooth(true)} />
      )}

      {miniAssistantAberto && (
        <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />
      )}

      <MiniRobotocSidebarNotes addLogTerminal={addLogTerminal} />

      {yugiohGameAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 400, backgroundColor: '#0a0f1d' }}>
          <YugiohDuelLinks3D onClose={() => setYugiohGameAberto(false)} />
        </div>
      )}

      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear highlightGear={solicitarConexaoBluetooth} onConnectGear={(t, s) => addLogTerminal(`[GEAR] ${t}: ${s ? 'ON' : 'OFF'}`)} />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer addLog={addLogTerminal} />
      </AndroidHUDPanel>

      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
