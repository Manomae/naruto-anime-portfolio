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
// 🤖 --- HELPER DE MODELAGEM 3D DO ROBOTOC (BASEADO NA IMAGEM DE REFERÊNCIA) ---
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

  // Cabeça Robotoc
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

  // Tronco Robotoc
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
// 🌸 --- HELPER DE MODELAGEM 3D DA VEGATOCNYX (ROBÔ FEMININA COM RABO DE CAVALO E VESTE NEON) ---
// =========================================================================================
function criarModeloVegatocnyxEspetacular3D() {
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

  // Cabeça Vegatocnyx (feminina, delicada e com visor oval)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.48, 36, 36), whiteArmorMat);
  headBase.scale.set(1.05, 0.92, 0.95);
  headGroup.add(headBase);

  // Rabo de cavalo metálico arqueado com frisos LED ciano (estilo referência)
  const ponytailGroup = new THREE.Group();
  ponytailGroup.position.set(0, 0.25, -0.32);
  ponytailGroup.rotation.x = -Math.PI / 4;

  const baseTail = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.7, 24), whiteArmorMat);
  baseTail.position.set(0, 0.3, 0);
  const tailCurve = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 16, 32, Math.PI * 1.2), chromeSilverMat);
  tailCurve.rotation.z = Math.PI / 2;
  tailCurve.position.set(0, 0.6, 0.2);

  const tailLed = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 16), cyanLedMat);
  tailLed.position.set(0, 0.3, 0.02);

  ponytailGroup.add(baseTail, tailCurve, tailLed);
  headGroup.add(ponytailGroup);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.32, 0.16), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.40);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.26, 0.17), darkScreenMat);
  visorScreen.position.set(0, -0.02, 0.405);
  headGroup.add(visorScreen);

  const eyeGeo = new THREE.SphereGeometry(0.075, 24, 24);
  const eyeL = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeL.scale.set(1.15, 0.95, 0.35);
  eyeL.position.set(-0.15, -0.02, 0.48);

  const eyeR = new THREE.Mesh(eyeGeo, cyanLedMat);
  eyeR.scale.set(1.15, 0.95, 0.35);
  eyeR.position.set(0.15, -0.02, 0.48);
  headGroup.add(eyeL, eyeR);

  robotGroup.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  const neckCollar = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 16, 32), metallicBlueMat);
  neckCollar.rotation.x = Math.PI / 2;
  neckCollar.position.set(0, 0.46, 0);
  robotGroup.add(neck, neckCollar);

  // Tronco feminino armadurado com curvas refinadas e gema "VEGATOCNYX"
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.24, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 0.95, 0.82);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  torsoGroup.add(chestBlueTrim);

  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.20, 0.25);
  torsoGroup.add(chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22 - i * 0.015, 0.20 - i * 0.015, 0.07, 24), chromeSilverMat);
    abSeg.scale.set(1.05, 1, 0.82);
    abSeg.position.set(0, -0.14 - i * 0.09, 0);
    torsoGroup.add(abSeg);

    if (i < 2) {
      const abLed = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.02, 0.22), cyanLedMat);
      abLed.position.set(0, -0.18 - i * 0.09, 0.04);
      torsoGroup.add(abLed);
    }
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.20, 24), whiteArmorMat);
  pelvis.scale.set(1.2, 1, 0.9);
  pelvis.position.set(0, -0.44, 0);
  const pelvisTrim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.025, 12, 28), metallicBlueMat);
  pelvisTrim.rotation.x = Math.PI / 2;
  pelvisTrim.position.set(0, -0.35, 0);
  torsoGroup.add(pelvis, pelvisTrim);

  robotGroup.add(torsoGroup);

  const criarBracoVegatocnyx = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.44, 0.32, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), chromeSilverMat);
    const shoulderRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 12, 24), metallicBlueMat);
    shoulderRing.rotation.y = Math.PI / 2;
    armPivot.add(shoulder, shoulderRing);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.26, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.17, 0);
    upperArm.rotation.z = lado * 0.15;
    armPivot.add(upperArm);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.07, -0.32, 0);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), metallicBlueMat);
    elbowGroup.add(elbowJoint);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 0.30, 24), chromeSilverMat);
    forearm.position.set(0, -0.17, 0);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.025, 12, 24), metallicBlueMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.31, 0);
    elbowGroup.add(forearm, cuff);

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.40, 0);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.06), whiteArmorMat);
    handGroup.add(palm);

    for (let f = -1.5; f <= 1.5; f += 1) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.08, 10), chromeSilverMat);
      finger.position.set(f * 0.028, -0.08, 0);
      finger.rotation.z = f * 0.08 * lado;
      handGroup.add(finger);
    }
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.013, 0.07, 10), chromeSilverMat);
    thumb.position.set(-lado * 0.07, -0.02, 0.02);
    thumb.rotation.z = -lado * 0.6;
    handGroup.add(thumb);

    elbowGroup.add(handGroup);
    armPivot.add(elbowGroup);

    return { armPivot, elbowGroup };
  };

  const rightArmObj = criarBracoVegatocnyx(-1);
  rightArmObj.armPivot.rotation.z = -0.18;
  robotGroup.add(rightArmObj.armPivot);

  const leftArmObj = criarBracoVegatocnyx(1);
  leftArmObj.armPivot.rotation.z = 0.65;
  leftArmObj.elbowGroup.rotation.z = 1.65;
  leftArmObj.elbowGroup.rotation.x = -0.2;
  robotGroup.add(leftArmObj.armPivot);

  const criarPernaVegatocnyx = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.16, -0.50, 0);

    const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), chromeSilverMat);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.25, 20), chromeSilverMat);
    thigh.position.set(0, -0.14, 0);

    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), metallicBlueMat);
    kneeJoint.position.set(0, -0.28, 0.02);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.28, 24), chromeSilverMat);
    shin.position.set(0, -0.44, 0);

    const bootCollar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 12, 24), metallicBlueMat);
    bootCollar.rotation.x = Math.PI / 2;
    bootCollar.position.set(0, -0.58, 0);

    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, 0.32), whiteArmorMat);
    footBase.position.set(0, -0.64, 0.05);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.035, 0.33), metallicBlueMat);
    sole.position.set(0, -0.69, 0.05);

    legGroup.add(hipJoint, thigh, kneeJoint, shin, bootCollar, footBase, sole);
    return legGroup;
  };

  const legL = criarPernaVegatocnyx(-1);
  const legR = criarPernaVegatocnyx(1);
  robotGroup.add(legL, legR);

  return {
    robotGroup,
    headGroup,
    eyeL,
    eyeR,
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
// 🤖 --- COMPONENTE: MINI ASSISTANT 3D (ROBOTOC & VEGATOCNYX) ---
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
  const [respostaIA, setRespostaIA] = useState('Olá! Sou seu assistente 3D com inteligência e microfone futurístico. Fale ou digite qualquer assunto!');
  const [ouvindo, setOuvindo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [imagemBusca, setImagemBusca] = useState(null);
  const [fontesWeb, setFontesWeb] = useState([]);
  const [tipoAvatarAtivo, setTipoAvatarAtivo] = useState('robotoc'); // 'robotoc' ou 'vegatocnyx'

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

    // Seleciona o modelo 3D baseado no avatar ativo
    const robotParts = tipoAvatarAtivo === 'vegatocnyx' 
      ? criarModeloVegatocnyxEspetacular3D() 
      : criarModeloRobotocEspetacular3D();

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
  }, [tipoAvatarAtivo]);

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '390px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff',
      borderRadius: '20px', padding: '14px', boxShadow: '0 0 35px rgba(0, 240, 255, 0.3)',
      zIndex: 500, backdropFilter: 'blur(20px)', color: '#0f172a', fontFamily: 'sans-serif', maxHeight: '560px', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '6px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{tipoAvatarAtivo === 'vegatocnyx' ? '🌸' : '🤖'}</span>
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>
            {tipoAvatarAtivo === 'vegatocnyx' ? 'VEGATOCNYX 3D ASSISTANT' : 'MINI ROBOTOC 3D ASSISTANT'}
          </strong>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button 
            onClick={() => setTipoAvatarAtivo(prev => prev === 'robotoc' ? 'vegatocnyx' : 'robotoc')}
            title="Alternar entre Robotoc 3D e Vegatocnyx 3D"
            style={{ fontSize: '9px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Trocar Avatar ({tipoAvatarAtivo === 'robotoc' ? 'Vegatocnyx' : 'Robotoc'})
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minHeight: '110px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #00f0ff', padding: '6px', marginBottom: '8px' }}>
        <div
          ref={mountRef}
          onClick={() => processarPerguntaRobotoc("Olá Assistente")}
          title="Clique no Avatar 3D!"
          style={{ width: '90px', height: '100px', cursor: 'pointer', flexShrink: 0 }}
        />
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Resposta IA:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a', whiteSpace: 'pre-wrap' }}>{carregando ? '⚡ Processando dados e buscando na internet...' : respostaIA}</p>
          
          {imagemBusca && (
            <div style={{ marginTop: '6px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #00f0ff' }}>
              <img src={imagemBusca} alt="Ilustração IA" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
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
// 🚀 --- COMPONENTE: SIDEBAR NOTES & BLOC DE NOTAS COM ROBOTOC/VEGATOCNYX ---
// =========================================================================================
function MiniRobotocSidebarNotes({ addLogTerminal }) {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('notas');
  const [tipoAvatarSidebar, setTipoAvatarSidebar] = useState('robotoc');

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
    if (addLogTerminal) addLogTerminal(`[SISTEMA 3D] Nova nota criada: "${nova.titulo}"`);
  };

  const handleMoverParaLixeira = (id) => {
    const item = notas.find(n => n.id === id);
    if (!item) return;
    setNotas(prev => prev.filter(n => n.id !== id));
    setLixeira(prev => [item, ...prev]);
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
    doc.text("EMANUEL.OS - BLOCO DE NOTAS FUTURISTA", 15, 18);

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

    const robotParts = tipoAvatarSidebar === 'vegatocnyx' 
      ? criarModeloVegatocnyxEspetacular3D() 
      : criarModeloRobotocEspetacular3D();

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
  }, [tipoAvatarSidebar]);

  return (
    <div style={{
      position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)',
      zIndex: 450, display: 'flex', alignItems: 'center', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: 'sans-serif'
    }}>
      <div
        onClick={() => setExpandido(!expandido)}
        title="Clique para abrir o Bloco de Notas"
        style={{
          width: '54px', height: '110px', backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '2px solid #00f0ff', borderRight: 'none', borderRadius: '20px 0 0 20px',
          boxShadow: '-8px 0 25px rgba(0, 240, 255, 0.4)', backdropFilter: 'blur(15px)',
          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '4px'
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
        width: expandido ? '360px' : '0px', height: '520px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)', border: expandido ? '2px solid #00f0ff' : 'none',
        borderRight: 'none', borderRadius: '20px 0 0 20px', backdropFilter: 'blur(30px)',
        boxShadow: expandido ? '-10px 0 40px rgba(0, 240, 255, 0.3)' : 'none', overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', color: '#0f172a'
      }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #bae6fd', backgroundColor: 'rgba(240, 249, 255, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>📝</span>
            <strong style={{ fontSize: '11px', color: '#0284c7', letterSpacing: '0.5px' }}>
              BLOCO DE NOTAS {tipoAvatarSidebar === 'vegatocnyx' ? 'VEGATOCNYX' : 'ROBOTOC'} 3D
            </strong>
          </div>
          <button 
            onClick={() => setTipoAvatarSidebar(prev => prev === 'robotoc' ? 'vegatocnyx' : 'robotoc')}
            style={{ fontSize: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {tipoAvatarSidebar === 'robotoc' ? 'Usar Vegatocnyx' : 'Usar Robotoc'}
          </button>
          <button onClick={() => setExpandido(false)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #bae6fd', backgroundColor: '#f8fafc' }}>
          <button 
            onClick={() => setAbaAtiva('notas')}
            style={{ flex: 1, padding: '8px', border: 'none', backgroundColor: abaAtiva === 'notas' ? '#0284c7' : 'transparent', color: abaAtiva === 'notas' ? '#fff' : '#0284c7', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📋 Notas Ativas ({notas.length})
          </button>
          <button 
            onClick={() => setAbaAtiva('lixeira')}
            style={{ flex: 1, padding: '8px', border: 'none', backgroundColor: abaAtiva === 'lixeira' ? '#ef4444' : 'transparent', color: abaAtiva === 'lixeira' ? '#fff' : '#ef4444', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🗑️ Lixeira ({lixeira.length})
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
                        💾 TXT
                      </button>
                      <button onClick={() => handleDownloadPDF(nota)} style={{ padding: '4px 8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '8.5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        📄 PDF
                      </button>
                      <button onClick={() => handleMoverParaLixeira(nota.id)} style={{ padding: '4px 8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', fontSize: '8.5px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 'auto' }}>
                        🗑️ Lixeira
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
              <div>
                <strong style={{ fontSize: '10px', color: '#b91c1c', display: 'block' }}>Lixeira Holográfica</strong>
                <span style={{ fontSize: '8px', color: '#ef4444' }}>Rascunhos descartados podem ser restaurados.</span>
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
        alert("Erro ao acessar a câmera: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#0f172a', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 VISION TRACKER AI</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          {active ? 'Desligar Câmera' : 'Ativar Câmera IA'}
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '120px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: active ? 0.8 : 0.2 }} />
        {!active && <span style={{ position: 'absolute', fontSize: '10px', color: '#94a3b8' }}>Câmera Inativa</span>}
        {active && <div style={{ position: 'absolute', border: '1px dashed #00f0ff', width: '80%', height: '80%', pointerEvents: 'none' }} />}
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
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: highlightGear ? '2px solid #eab308' : '1px solid #0284c7', borderRadius: '12px', padding: '10px', color: '#0f172a', backdropFilter: 'blur(10px)' }}>
      <span style={{ fontSize: '10px', color: highlightGear ? '#d97706' : '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
        ⚙️ PERIFÉRICOS NEURAIS {highlightGear && '(CONEXÃO SOLICITADA)'}
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
    <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '12px', padding: '10px', color: '#0f172a' }}>
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
// 📲 --- COMPONENTE: DISPATCHER MENSAGENS ---
// =========================================================================================
function DispatcherMensagensNumeros({ addLog }) {
  const [plataforma, setPlataforma] = useState('whatsapp');
  const [ddd, setDdd] = useState('88');
  const [num1, setNum1] = useState('981493989');
  const [num2, setNum2] = useState('');
  const [mensagem, setMensagem] = useState('Mensagem do Emanuel.OS v6.0 - Sistema 3D Ativo.');

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
        <input type="text" value={num1} onChange={(e) => setNum1(e.target.value)} placeholder="Número 1" style={{ flex: 1, padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px' }} />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <input type="text" value={num2} onChange={(e) => setNum2(e.target.value)} placeholder="Número 2 (Opcional)" style={{ width: '100%', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
      </div>

      <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2} style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', padding: '6px', fontSize: '10px', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />

      <button onClick={dispararMensagens} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
        🚀 Disparar Mensagem Direta
      </button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- COMPONENTE: NEURAL THOUGHT PANEL ---
// =========================================================================================
function RobotocNeuralThoughtPanel({ addLog }) {
  const [contaGoogle, setContaGoogle] = useState('leeheroi123@gmail.com');
  const [contaApple, setContaApple] = useState('emanuel@icloud.com');
  const [contaOneDrive, setContaOneDrive] = useState('emanuel@outlook.com');
  const [statusSinc, setStatusSinc] = useState('Conectado');

  const sincronizarContas = () => {
    setStatusSinc('Sincronizando...');
    if (addLog) addLog(`[SISTEMA 3D] Sincronizando Contas: Google (${contaGoogle}), Apple (${contaApple}), OneDrive (${contaOneDrive})`);
    setTimeout(() => {
      setStatusSinc('Conectado e Ativo');
      alert('Sincronização real de e-mails concluída!');
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#0f172a', boxShadow: '0 0 25px rgba(0,240,255,0.15)', backdropFilter: 'blur(10px)' }}>
      <div style={{ borderBottom: '1px solid rgba(2,132,199,0.2)', paddingBottom: '6px', marginBottom: '10px' }}>
        <h3 style={{ color: '#0284c7', fontSize: '12px', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🧠 PENSAMENTO FUTURISTA <span style={{ fontSize: '8px', backgroundColor: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: '6px' }}>REAL CORE</span>
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: '#64748b' }}>Integração direta com triple e-mail e processamento neural.</p>
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
        <span style={{ fontSize: '9px', color: '#16a34a' }}>● Status: {statusSinc}</span>
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
          <strong style={{ fontSize: '12px', color: '#0284c7' }}>ANDROID 16 NEURAL OS EM HUD</strong>
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
      alert("Ação autônoma executada com sucesso!");
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#0f172a', position: 'relative', boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#0284c7', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ borderBottom: '1px solid rgba(2,132,199,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 style={{ color: '#0284c7', fontSize: '18px', margin: 0, fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 EM CREATOR STUDIO IA <span style={{ fontSize: '10px', color: '#0284c7', border: '1px solid #0284c7', padding: '2px 8px', borderRadius: '10px' }}>AGI Core</span>
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
    mojo: `# Mojo (AI Performance High-Speed Language)\nfn main():\n    let matrix_dim: Int = 1024\n    print("⚡ Inicializando Tensor Quântico...")`,
    zig: `// Zig System Language\nconst std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("🧠 Núcleo Ativo!\\n", .{});\n}`,
    nim: `# Nim Metaprogramming Language\nlet core = "ONLINE"\necho "🚀 Sistema executando em Nim. Status: ", core`,
    crystal: `# Crystal Language\nclass QuantumEngine\n  def boot\n    puts "💎 Rodando motor quântico"\n  end\nend\nQuantumEngine.new.boot`,
    elixir: `# Elixir Distributed System\ndefmodule EmanuelOS.Core do\n  def sync_nodes do\n    IO.puts("🔮 Sincronizando Nó Funcional Exótico")\n  end\nend`,
    qsharp: `// Q# Quantum System\nnamespace EmanuelOS.Quantum {\n    open Microsoft.Quantum.Intrinsic;\n}`,
    gleam: `// Gleam Language\nimport gleam/io\npub fn main() {\n  io.print_line("✨ Executando Gleam!")\n}`
  };

  const [codigoFonte, setCodigoFonte] = useState(templatesExoticos['mojo']);
  const [blocoRascunho, setBlocoRascunho] = useState("Notas do Dev Núcleo.");
  const [relatorioErros, setRelatorioErros] = useState([]);
  const [cmdPowerInput, setCmdPowerInput] = useState('');
  const [cmdPowerLogs, setCmdPowerLogs] = useState([
    "Windows PowerShell EM [Versão 10.0] - Workstation Core",
    "PS C:\\EmanuelOS\\Kernel> Get-EMStatus -IA",
    "-> MOTOR NEURAL IA: Ativo"
  ]);

  const handleLinguagemChange = (novaLang) => {
    setLinguagem(novaLang);
    if (templatesExoticos[novaLang]) {
      setCodigoFonte(templatesExoticos[novaLang]);
    }
  };

  const executarPowerShellIA = (e) => {
    e.preventDefault();
    if (!cmdPowerInput.trim()) return;
    setCmdPowerLogs(prev => [...prev, `PS C:\\> ${cmdPowerInput}`, "Executado com sucesso.", " "]);
    setCmdPowerInput('');
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#f0f9ff',
      borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '10px', color: '#0f172a',
      fontFamily: 'Consolas, monospace', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'sans-serif' }}>
          Emanuel.OS Workstation | Notepad Dev Núcleo
        </strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕ Fechar</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={linguagem} onChange={(e) => handleLinguagemChange(e.target.value)} style={{ backgroundColor: '#ffffff', border: '1px solid #0284c7', color: '#0284c7', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>
          <option value="mojo">Mojo</option>
          <option value="zig">Zig</option>
          <option value="nim">Nim</option>
          <option value="crystal">Crystal</option>
          <option value="elixir">Elixir</option>
          <option value="qsharp">Q#</option>
          <option value="gleam">Gleam</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>

      <textarea
        value={codigoFonte}
        onChange={(e) => setCodigoFonte(e.target.value)}
        style={{ width: '100%', height: '180px', backgroundColor: '#ffffff', border: '1px solid #00f0ff', borderRadius: '8px', color: '#0284c7', padding: '10px', fontSize: '11px', outline: 'none', resize: 'none' }}
      />

      <GlassKeyboard3D onKeyPress={(tecla) => {
        if (tecla === 'Backspace') setCodigoFonte(prev => prev.slice(0, -1));
        else if (tecla === 'Space') setCodigoFonte(prev => prev + ' ');
        else if (tecla === 'Enter') setCodigoFonte(prev => prev + '\n');
        else if (tecla.length === 1) setCodigoFonte(prev => prev + tecla);
      }} />
    </div>
  );
}

// =========================================================================================
// 🏛️ --- VITRINE VIRTUAL 3D (ROBOTOC & VEGATOCNYX) ---
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
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    const glassGeo = new THREE.CylinderGeometry(3.5, 3.5, 4.5, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5, thickness: 0.5, side: THREE.DoubleSide });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 1.0;
    vitrineGroup.add(glassMesh);

    const contentGroup = new THREE.Group();

    if (modoAtual === 'avatares' || modoAtual === 'bluetooth') {
      // Exibe simultaneamente o Robotoc 3D e a Vegatocnyx 3D na vitrine de vidro!
      const robotParts = criarModeloRobotocEspetacular3D();
      const robotObj = robotParts.robotGroup;
      robotObj.position.set(-1.3, 0.2, 0);
      robotObj.scale.set(0.95, 0.95, 0.95);

      const vegatocParts = criarModeloVegatocnyxEspetacular3D();
      const vegatocObj = vegatocParts.robotGroup;
      vegatocObj.position.set(1.3, 0.2, 0);
      vegatocObj.scale.set(0.95, 0.95, 0.95);

      contentGroup.add(robotObj);
      contentGroup.add(vegatocObj);
    } else {
      const mapGeo = new THREE.IcosahedronGeometry(1.3, 2);
      const mapMesh = new THREE.Mesh(mapGeo, new THREE.MeshStandardMaterial({ color: 0x0284c7, wireframe: true }));
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
          🤖 Robotoc & Vegatocnyx 3D
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🪟 --- WINDOW DEV PANEL ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [size, setSize] = useState({ width: 520, height: 580 });
  const [pos, setPos] = useState({ x: 80, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modoVitrine, setModoVitrine] = useState('avatares');

  return (
    <div style={{
      position: 'fixed', top: `${pos.y}px`, left: `${pos.x}px`, width: `${size.width}px`, height: `${size.height}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '18px',
      backdropFilter: 'blur(25px)', zIndex: 300, boxShadow: '0 0 40px rgba(0,240,255,0.25)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#0f172a', fontFamily: 'sans-serif'
    }}>
      <div style={{ padding: '12px 16px', backgroundColor: 'rgba(240, 249, 255, 0.95)', borderBottom: '1px solid #00f0ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '12px', color: '#0284c7' }}>PAINEL DE DESENVOLVIMENTO 3D (ROBOTOC & VEGATOCNYX)</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <VitrineVirtual3D modoAtual={modoVitrine} onSelectModo={(m) => setModoVitrine(m)} onRequestBluetoothConnection={onRequestBluetooth} />
      </div>
    </div>
  );
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0) --- 🖥️
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);

  const meusDadosReais = {
    nome: "Emanuel da Silva",
    whatsapp: "5588981493989",
    email: "leeheroi123@gmail.com",
    tiktok: "https://www.tiktok.com/@emanueldasilva26",
    instagram: "https://www.instagram.com/emanuelsilva432",
    github: "https://github.com/Manomae",
    youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
  };

  const [links3D] = useState([
    { id: 1, titulo: 'Canal YouTube', url: meusDadosReais.youtube, icone: '▶️', nuvem: 'google' },
    { id: 2, titulo: 'TikTok', url: meusDadosReais.tiktok, icone: '🎵', nuvem: 'custom' },
    { id: 3, titulo: 'Instagram', url: meusDadosReais.instagram, icone: '📸', nuvem: 'apple' },
    { id: 4, titulo: 'GitHub', url: meusDadosReais.github, icone: '🐙', nuvem: 'microsoft' },
    { id: 5, titulo: 'WhatsApp', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', nuvem: 'google' }
  ]);

  const [locaisEmanuelOS] = useState([
    { id: 1, nome: 'Emanuel.OS Core Data Center', categoria: '🖥️ Servidor', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, ipCriptografado: 'AES256', trabalho: 'Engenharia de Software', urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' },
    { id: 2, nome: 'Usina Nuclear Central', categoria: '⚛️ Energia', cor: 0x00ffcc, lat: -23.0062, lng: -44.3182, ipCriptografado: 'AES256', trabalho: 'Matriz Energética', urlExterna: 'https://maps.google.com/?q=-23.0062,-44.3182' }
  ]);

  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11);

  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de Segurança');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);

  const [mensagens, setMensagens] = useState([
    { autor: 'SISTEMA 3D', texto: 'Emanuel.OS v6.0 | Robotoc 3D & Vegatocnyx 3D Online!', tipo: 'sys' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const mountRef = useRef(null);
  const globeGroupRef = useRef(null);
  const mainRobotRef = useRef(null);
  const vegatocnyxRef = useRef(null); // Referência 3D para a Vegatocnyx principal no globo

  const [legendaRobotoc, setLegendaRobotoc] = useState('');
  const [robotocFalando, setRobotocFalando] = useState(false);
  const robotHeadRef = useRef(null);
  const robotClickAnimRef = useRef(0);

  const dispararFalaRobotoc = (texto) => {
    setLegendaRobotoc(texto);
    setRobotocFalando(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.onend = () => { setRobotocFalando(false); setTimeout(() => setLegendaRobotoc(''), 3200); };
      window.speechSynthesis.speak(utterance);
    }
  };

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return;
    setValidandoServidores(true);
    setTimeout(() => {
      setValidandoServidores(false);
      setEtapaSeguranca(7); // Libera direto para o app
    }, 800);
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

    const radius = 2.5;
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 64),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 })
    );
    globeGroup.add(earthMesh);
    scene.add(globeGroup);

    // Adicionando o Robotoc 3D principal à direita
    const robotPartsMain = criarModeloRobotocEspetacular3D();
    const mainRobotGroup = robotPartsMain.robotGroup;
    mainRobotGroup.position.set(2.8, 0.2, 1.0);
    mainRobotGroup.scale.set(1.15, 1.15, 1.15);
    scene.add(mainRobotGroup);
    mainRobotRef.current = mainRobotGroup;

    // Adicionando a Vegatocnyx 3D principal à esquerda do globo na tela principal!
    const vegatocPartsMain = criarModeloVegatocnyxEspetacular3D();
    const vegatocGroup = vegatocPartsMain.robotGroup;
    vegatocGroup.position.set(-2.8, 0.2, 1.0);
    vegatocGroup.scale.set(1.15, 1.15, 1.15);
    scene.add(vegatocGroup);
    vegatocnyxRef.current = vegatocGroup;

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.001;
      }

      // Animação sutil de flutuação e aceno para o Robotoc e Vegatocnyx
      if (mainRobotRef.current) {
        mainRobotRef.current.position.y = 0.2 + Math.sin(time * 2.0) * 0.1;
      }
      if (vegatocnyxRef.current) {
        vegatocnyxRef.current.position.y = 0.2 + Math.cos(time * 2.0) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado]);

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖🌸</div>
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> WORKSTATION v6.0
          </h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>
            ROBOTOC & VEGATOCNYX 3D CORE
          </span>

          <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite sua Chave Mestre..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '13px', outline: 'none' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              Desbloquear Sistema ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>
          
          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab' }} />

          {legendaRobotoc && (
            <div style={{ position: 'absolute', bottom: '135px', right: '30px', zIndex: 145, maxWidth: '340px', backgroundColor: 'rgba(3, 7, 18, 0.85)', border: '1.5px solid #00f0ff', borderRadius: '14px', padding: '12px 16px', color: '#f0f9ff' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff' }}>🎙️ ASSISTENTE 3D // TRANSMISSÃO</span>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#e0f2fe' }}>"{legendaRobotoc}"</p>
            </div>
          )}

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>

            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🖥️ Dev Workstation Split
            </button>

            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📱 Android HUD
            </button>

            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              📊 Creator Studio
            </button>

            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🤖 Painel Dev 3D (Robotoc & Vegatocnyx)
            </button>

            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: miniAssistantAberto ? '#00f0ff' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              🤖 Assistant 3D
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
                  Contexto: EMANUEL<span style={{ color: '#0284c7' }}>.OS Workstation v6.0</span>
                </h1>
                <AgentPanelModule />
                <RobotocNeuralThoughtPanel />
                <DispatcherMensagensNumeros />
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

      {janelaRobotocDevAberta && (
        <WindowDevPanelRobotoc onClose={() => setJanelaRobotocDevAberta(false)} />
      )}

      {miniAssistantAberto && (
        <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />
      )}

      <MiniRobotocSidebarNotes />

      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear />
      </AndroidHUDPanel>

      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
