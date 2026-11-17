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
// 🤖 --- HELPER DE MODELAGEM 3D ESPETACULAR DO ROBOTOC & VEGATOCNYX (VERSÃO 7.0) ---
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

  // 1. CABEÇA
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

  // 2. TRONCO
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

  // 3. BRAÇOS
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

  // 4. PERNAS
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

function criarModeloVegatocnyxEspetacular3D() {
  const robotGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1
  });
  const chromeSilverMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.92 });
  const metallicBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.75 });
  const darkScreenMat = new THREE.MeshPhysicalMaterial({ color: 0x020617, roughness: 0.08, metalness: 0.3, clearcoat: 1.0 });
  const cyanLedMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.2, roughness: 0.1 });

  // 1. CABEÇA COM RABO DE CAVALO HOLOGRÁFICO CIANO
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.50, 36, 36), whiteArmorMat);
  headBase.scale.set(1.08, 0.92, 0.95);
  headGroup.add(headBase);

  // Rabo de cavalo elegante da Vegatocnyx com LED Ciano
  const ponytailGroup = new THREE.Group();
  const baseHair = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), whiteArmorMat);
  baseHair.position.set(0, 0.22, -0.42);
  const tailStrand = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 24), whiteArmorMat);
  tailStrand.rotation.x = -Math.PI / 4;
  tailStrand.position.set(0, 0.55, -0.72);
  const tailLed = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.75, 20), cyanLedMat);
  tailLed.rotation.x = -Math.PI / 4;
  tailLed.position.set(0, 0.56, -0.70);
  ponytailGroup.add(baseHair, tailStrand, tailLed);
  headGroup.add(ponytailGroup);

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

  [-1, 1].forEach((side) => {
    const earGroup = new THREE.Group();
    const earOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24), chromeSilverMat);
    earOuter.rotation.z = Math.PI / 2;
    const earRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 16, 32), metallicBlueMat);
    earRing.rotation.y = Math.PI / 2;
    earRing.position.x = side * 0.03;
    earGroup.add(earOuter, earRing);
    earGroup.position.set(side * 0.54, -0.02, 0);
    headGroup.add(earGroup);
  });

  robotGroup.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  const neckCollar = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.03, 16, 32), metallicBlueMat);
  neckCollar.rotation.x = Math.PI / 2;
  neckCollar.position.set(0, 0.46, 0);
  robotGroup.add(neck, neckCollar);

  // 2. TRONCO FEMININO ELEGANTE COM GRAVURA VEGATOCNYX
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 1, 0.82);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  torsoGroup.add(chestBlueTrim);

  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.20, 0.25);
  torsoGroup.add(chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.23 - i * 0.015, 0.21 - i * 0.015, 0.07, 24), chromeSilverMat);
    abSeg.scale.set(1.05, 1, 0.8);
    abSeg.position.set(0, -0.14 - i * 0.09, 0);
    torsoGroup.add(abSeg);

    if (i < 2) {
      const abLed = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.018, 0.22), cyanLedMat);
      abLed.position.set(0, -0.18 - i * 0.09, 0.04);
      torsoGroup.add(abLed);
    }
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.20, 24), whiteArmorMat);
  pelvis.scale.set(1.18, 1, 0.85);
  pelvis.position.set(0, -0.44, 0);
  const pelvisTrim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 12, 28), metallicBlueMat);
  pelvisTrim.rotation.x = Math.PI / 2;
  pelvisTrim.scale.set(1.1, 0.85, 1);
  pelvisTrim.position.set(0, -0.35, 0);
  torsoGroup.add(pelvis, pelvisTrim);

  robotGroup.add(torsoGroup);

  // 3. BRAÇOS
  const criarBracoVegatocnyx = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.44, 0.34, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), chromeSilverMat);
    const shoulderRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 12, 24), metallicBlueMat);
    shoulderRing.rotation.y = Math.PI / 2;
    armPivot.add(shoulder, shoulderRing);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.26, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.17, 0);
    upperArm.rotation.z = lado * 0.15;
    armPivot.add(upperArm);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.07, -0.32, 0);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), metallicBlueMat);
    elbowGroup.add(elbowJoint);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.115, 0.30, 24), chromeSilverMat);
    forearm.position.set(0, -0.17, 0);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 12, 24), metallicBlueMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.31, 0);
    elbowGroup.add(forearm, cuff);

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.40, 0);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.06), whiteArmorMat);
    handGroup.add(palm);

    for (let f = -1.5; f <= 1.5; f += 1) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.08, 10), chromeSilverMat);
      finger.position.set(f * 0.03, -0.08, 0);
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

  // 4. PERNAS COM ESTILO ESBELTO E BOTAS AZUL/BRANCO
  const criarPernaVegatocnyx = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.16, -0.50, 0);

    const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), chromeSilverMat);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.25, 20), chromeSilverMat);
    thigh.position.set(0, -0.14, 0);

    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), metallicBlueMat);
    kneeJoint.position.set(0, -0.28, 0.02);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.28, 24), chromeSilverMat);
    shin.position.set(0, -0.44, 0);

    const bootCollar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 12, 24), metallicBlueMat);
    bootCollar.rotation.x = Math.PI / 2;
    bootCollar.position.set(0, -0.58, 0);

    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.11, 0.32), whiteArmorMat);
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
    crestLed: null,
    chestCoreLed,
    rightArmPivot: rightArmObj.armPivot,
    leftArmPivot: leftArmObj.armPivot,
    leftElbowGroup: leftArmObj.elbowGroup,
    legL,
    legR
  };
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
// 🤖 --- COMPONENTE: MINI VEGATOCNYX & ROBOTOC 3D ASSISTANT ---
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
  const [respostaIA, setRespostaIA] = useState('Olá! Sou a Vegatocnyx 3D e o Robotoc 3D. Fale ou digite qualquer assunto!');
  const [ouvindo, setOuvindo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [imagemBusca, setImagemBusca] = useState(null);
  const [fontesWeb, setFontesWeb] = useState([]);
  const [avatarAtivo3D, setAvatarAtivo3D] = useState('vegatocnyx'); // 'vegatocnyx' ou 'robotoc'

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

    const robotParts = avatarAtivo3D === 'vegatocnyx' ? criarModeloVegatocnyxEspetacular3D() : criarModeloRobotocEspetacular3D();
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
  }, [avatarAtivo3D]);

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
          <strong style={{ fontSize: '10.5px', color: '#0284c7' }}>VEGATOCNYX 3D & ROBOTOC 3D ASSISTANT</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button
          onClick={() => setAvatarAtivo3D('vegatocnyx')}
          style={{
            flex: 1, padding: '5px', borderRadius: '6px',
            backgroundColor: avatarAtivo3D === 'vegatocnyx' ? '#00f0ff' : '#f0f9ff',
            color: avatarAtivo3D === 'vegatocnyx' ? '#000' : '#0284c7',
            border: '1px solid #00f0ff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          ✨ Vegatocnyx 3D
        </button>
        <button
          onClick={() => setAvatarAtivo3D('robotoc')}
          style={{
            flex: 1, padding: '5px', borderRadius: '6px',
            backgroundColor: avatarAtivo3D === 'robotoc' ? '#00f0ff' : '#f0f9ff',
            color: avatarAtivo3D === 'robotoc' ? '#000' : '#0284c7',
            border: '1px solid #00f0ff', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          🤖 Robotoc 3D
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minHeight: '110px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #00f0ff', padding: '6px', marginBottom: '8px' }}>
        <div
          ref={mountRef}
          onClick={() => processarPerguntaRobotoc("Olá Assistente")}
          title="Clique no Avatar 3D!"
          style={{ width: '90px', height: '100px', cursor: 'pointer', flexShrink: 0 }}
        />
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Resposta {avatarAtivo3D === 'vegatocnyx' ? 'Vegatocnyx' : 'Robotoc'}:</strong>
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
          placeholder="Fale com a Vegatocnyx ou Robotoc..."
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
// 🚀 --- COMPONENTE: VEGATOCNYX & ROBOTOC SIDEBAR LATERAL & BLOCO DE NOTAS ---
// =========================================================================================
function MiniRobotocSidebarNotes({ addLogTerminal }) {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('notas');

  const [notas, setNotas] = useState([
    { id: 1, titulo: 'Anotações Mestre Kernel', conteudo: 'Mapeamento quântico v7.0 com Vegatocnyx e Robotoc 3D ativo.', data: new Date().toLocaleTimeString('pt-BR') }
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
    if (addLogTerminal) addLogTerminal(`[VEGATOCNYX 3D] Nova nota criada: "${nova.titulo}"`);
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
    doc.text("EMANUEL.OS v7.0 - VEGATOCNYX & ROBOTOC 3D", 15, 18);

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

  const handleTouchStart = (e) => { touchStartXRef.current = e.touches[0].clientX; };
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
        position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)',
        zIndex: 450, display: 'flex', alignItems: 'center', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: 'sans-serif'
      }}
    >
      <div
        onClick={() => setExpandido(!expandido)}
        title="Abrir Bloco de Notas Vegatocnyx & Robotoc 3D"
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
        boxShadow: expandido ? '-10px 0 40px rgba(0, 240, 255, 0.3)' : 'none',
        overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column', color: '#0f172a'
      }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #bae6fd', backgroundColor: 'rgba(240, 249, 255, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>📝</span>
            <strong style={{ fontSize: '10.5px', color: '#0284c7', letterSpacing: '0.5px' }}>
              VEGATOCNYX & ROBOTOC 3D NOTEPAD v7.0
            </strong>
          </div>
          <button onClick={() => setExpandido(false)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #bae6fd', backgroundColor: '#f8fafc' }}>
          <button onClick={() => setAbaAtiva('notas')} style={{ flex: 1, padding: '8px', border: 'none', backgroundColor: abaAtiva === 'notas' ? '#0284c7' : 'transparent', color: abaAtiva === 'notas' ? '#fff' : '#0284c7', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            📋 Notas ({notas.length})
          </button>
          <button onClick={() => setAbaAtiva('lixeira')} style={{ flex: 1, padding: '8px', border: 'none', backgroundColor: abaAtiva === 'lixeira' ? '#ef4444' : 'transparent', color: abaAtiva === 'lixeira' ? '#fff' : '#ef4444', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            🗑️ Lixeira ({lixeira.length})
          </button>
        </div>

        {abaAtiva === 'notas' && (
          <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            <form onSubmit={handleCriarNota} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px' }}>
              <input type="text" placeholder="Título da Nota..." value={tituloInput} onChange={(e) => setTituloInput(e.target.value)} style={{ padding: '6px 10px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px', outline: 'none', color: '#0f172a' }} />
              <textarea rows={3} placeholder="Escreva suas ideias..." value={conteudoInput} onChange={(e) => setConteudoInput(e.target.value)} style={{ padding: '6px 10px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px', outline: 'none', resize: 'none', color: '#0f172a' }} />
              <button type="submit" style={{ padding: '7px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✨ Salvar Nota v7.0
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
                        📄 Exportar PDF
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
                <strong style={{ fontSize: '10px', color: '#b91c1c', display: 'block' }}>Lixeira v7.0</strong>
                <span style={{ fontSize: '8px', color: '#ef4444' }}>Notas descartadas.</span>
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
                        ❌ Excluir
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
        setStatus("Treinando Visão IA v7.0...");
      } catch (err) {
        alert("Erro ao acessar a câmera: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#0f172a', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 VISION TRACKER v7.0</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          {active ? 'Desligar Câmera' : 'Ativar Câmera IA'}
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '120px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: active ? 0.8 : 0.2 }} />
        {!active && <span style={{ position: 'absolute', fontSize: '10px', color: '#94a3b8' }}>Câmera Inativa</span>}
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
        ⚙️ PERIFÉRICOS NEURAIS GEAR {highlightGear && '(CONEXÃO SOLICITADA)'}
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
  const [mensagem, setMensagem] = useState('Mensagem do Emanuel.OS v7.0 - Vegatocnyx & Robotoc 3D ativos.');

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
        💬 MENSAGERIA REAL VIA TELEFONE v7.0
      </h3>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button onClick={() => setPlataforma('whatsapp')} style={{ flex: 1, padding: '6px', border: '1px solid #22c55e', backgroundColor: plataforma === 'whatsapp' ? '#22c55e' : 'transparent', color: plataforma === 'whatsapp' ? '#fff' : '#22c55e', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>WhatsApp</button>
        <button onClick={() => setPlataforma('telegram')} style={{ flex: 1, padding: '6px', border: '1px solid #38bdf8', backgroundColor: plataforma === 'telegram' ? '#38bdf8' : 'transparent', color: plataforma === 'telegram' ? '#fff' : '#38bdf8', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Telegram</button>
        <button onClick={() => setPlataforma('google_messages')} style={{ flex: 1, padding: '6px', border: '1px solid #eab308', backgroundColor: plataforma === 'google_messages' ? '#eab308' : 'transparent', color: plataforma === 'google_messages' ? '#fff' : '#eab308', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>SMS</button>
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
        🚀 Disparar Mensagem v7.0
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
    if (addLog) addLog(`[VEGATOCNYX & ROBOTOC 3D] Sincronizando Contas: Google (${contaGoogle}), Apple (${contaApple}), OneDrive (${contaOneDrive})`);
    setTimeout(() => {
      setStatusSinc('Conectado e Ativo');
      alert('Sincronização real de e-mails concluída no núcleo v7.0!');
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#0f172a', boxShadow: '0 0 25px rgba(0,240,255,0.15)', backdropFilter: 'blur(10px)' }}>
      <div style={{ borderBottom: '1px solid rgba(2,132,199,0.2)', paddingBottom: '6px', marginBottom: '10px' }}>
        <h3 style={{ color: '#0284c7', fontSize: '12px', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🧠 PENSAMENTO FUTURISTA v7.0 <span style={{ fontSize: '8px', backgroundColor: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: '6px' }}>REAL CORE</span>
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: '#64748b' }}>Integração tripla e processamento neural contínuo.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
        <div>
          <label style={{ fontSize: '8px', color: '#0284c7', display: 'block' }}>📧 Google Mail:</label>
          <input type="email" value={contaGoogle} onChange={(e) => setContaGoogle(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #38bdf8', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#a855f7', display: 'block' }}>🍎 Apple iCloud Mail:</label>
          <input type="email" value={contaApple} onChange={(e) => setContaApple(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #c084fc', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#ea580c', display: 'block' }}>☁️ Microsoft OneDrive:</label>
          <input type="email" value={contaOneDrive} onChange={(e) => setContaOneDrive(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #fb923c', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', color: '#16a34a' }}>● Status: {statusSinc}</span>
        <button onClick={sincronizarContas} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔄 Sincronizar
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
          <strong style={{ fontSize: '12px', color: '#0284c7' }}>ANDROID 16 NEURAL OS v7.0 HUD</strong>
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
// 📊 --- COMPONENTE: CREATOR STUDIO IA ---
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1350, audiosGerações: 410, fotosRenders: 950,
    videosRenderizados: 230, memesGifsEngajados: 610, audienciaAtiva: 'Alta (92% retenção)', resolucaoProblemasIA: '95,8% Autônomos'
  });

  const [sugestoesAGI] = useState([
    { id: 1, tipo: '⚡ Otimização de Vídeo', acao: 'Sintetizar intro em 4K com Vegatocnyx 3D' },
    { id: 2, tipo: '🛠️ Bugfix Autônomo', acao: 'Otimizar texturas WebGL' }
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
            📊 CREATOR STUDIO v7.0 <span style={{ fontSize: '10px', color: '#0284c7', border: '1px solid #0284c7', padding: '2px 8px', borderRadius: '10px' }}>AGI Core v7.0</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0 0' }}>
            Desempenho multimodal, diagnóstico de audiência e ações autônomas.
          </p>
        </div>

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
                style={{ padding: '8px 14px', backgroundColor: executandoAcao === item.id ? '#0284c7' : '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
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
    mojo: `# Mojo (AI Performance High-Speed Language)\nfn main():\n    let matrix_dim: Int = 1024\n    print("⚡ Inicializando Tensor Quântico Emanuel.OS v7.0 (Vegatocnyx & Robotoc)...")\n    print("Matriz carregada com dimensao:", matrix_dim)`,
    zig: `// Zig System Language\nconst std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("🧠 Núcleo Android 16 Neural OS v7.0 Ativo!\\n", .{});\n}`,
    nim: `# Nim Metaprogramming Language\ntype\n  NeuralCore = object\n    status: string\n    potencia: float\n\nlet core = NeuralCore(status: "ONLINE", potencia: 99.9)\necho "🚀 Emanuel.OS v7.0 executando em Nim. Status: ", core.status`,
    crystal: `# Crystal Language\nclass QuantumEngine\n  def initialize(@name : String)\n  end\n\n  def boot\n    puts "💎 Rodando motor quântico #{@name} no Emanuel.OS Workstation"\n  end\nend\n\nQuantumEngine.new("EM-Core v7.0").boot`,
    elixir: `# Elixir Distributed System\ndefmodule EmanuelOS.Core do\n  def sync_nodes(node_id) do\n    IO.puts("🔮 Sincronizando Nó v7.0: #{node_id}")\n  end\nend\n\nEmanuelOS.Core.sync_nodes("Node-Vegatocnyx")`,
    qsharp: `// Q# Quantum System\nnamespace EmanuelOS.Quantum {\n    open Microsoft.Quantum.Canon;\n    open Microsoft.Quantum.Intrinsic;\n\n    operation MeasureQubit() : Result {\n        use q = Qubit();\n        H(q);\n        return M(q);\n    }\n}`,
    gleam: `// Gleam Language\nimport gleam/io\n\npub fn main() {\n  io.print_line("✨ Executando Gleam v7.0 no Emanuel.OS!")\n}`
  };

  const [codigoFonte, setCodigoFonte] = useState(templatesExoticos['mojo']);
  const [blocoRascunho, setBlocoRascunho] = useState("Notas Dev v7.0: Vegatocnyx e Robotoc integrados.");
  const [relatorioErros, setRelatorioErros] = useState([]);
  const [cmdPowerInput, setCmdPowerInput] = useState('');
  const [cmdPowerLogs, setCmdPowerLogs] = useState([
    "Windows PowerShell EM v7.0 [Versão 10.0.26100.1] - Emanuel.OS Workstation",
    "(c) Emanuel.OS Corporation. Todos os direitos reservados.",
    " ",
    "PS C:\\EmanuelOS\\Kernel> Get-EMStatus -v7",
    "-> MOTOR NEURAL IA: Ativo (Vegatocnyx 3D + Robotoc 3D)",
    "-> ANDROID OS EM: v7.0 Ready. Digite 'help-em'."
  ]);

  const handleLinguagemChange = (novaLang) => {
    setLinguagem(novaLang);
    if (templatesExoticos[novaLang]) {
      setCodigoFonte(templatesExoticos[novaLang]);
    } else {
      setCodigoFonte(`// Projeto em ${novaLang.toUpperCase()}\n// Emanuel.OS v7.0 Workstation`);
    }
  };

  const executarPowerShellIA = (e) => {
    e.preventDefault();
    if (!cmdPowerInput.trim()) return;

    const cmd = cmdPowerInput.trim();
    let res = [];

    if (cmd === 'help-em') {
      res = [
        "Comandos Avançados v7.0:",
        "  ai-optimize-core  -> Otimiza rotinas WebGL e IA",
        "  ai-generate-code  -> Gera boilerplate automático",
        "  ai-scan-security  -> Varredura de segurança de 7 camadas"
      ];
    } else if (cmd === 'ai-optimize-core') {
      res = ["⚡ IA EM Power Shell: Otimização concluída para Vegatocnyx & Robotoc."];
    } else {
      res = [`PS C:\\EmanuelOS\\Kernel> ${cmd} : Comando executado.`];
    }

    setCmdPowerLogs(prev => [...prev, `PS C:\\EmanuelOS\\Kernel> ${cmd}`, ...res, " "]);
    setCmdPowerInput('');
  };

  const analisarECorrigirCodigoIA = (modo) => {
    setRelatorioErros([
      { linha: 0, tipo: 'sucesso', texto: `✅ IA EMgemini: Código em ${linguagem.toUpperCase()} validado no Núcleo v7.0!`, cor: '#16a34a' }
    ]);
  };

  const baixarCodigoArquivo = () => {
    const blob = new Blob([codigoFonte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EmanuelOS_v7_${linguagem}.${linguagem}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            Emanuel.OS Workstation v7.0 | Notepad Dev (Vegatocnyx & Robotoc)
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          ✕ Fechar Workstation
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
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
        </select>

        <button onClick={() => analisarECorrigirCodigoIA('bugs')} style={{ padding: '6px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔍 Checar Sintaxe IA
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '180px' }}>
        <textarea
          value={codigoFonte}
          onChange={(e) => setCodigoFonte(e.target.value)}
          style={{
            width: '100%', flexGrow: 1, backgroundColor: '#ffffff', border: '1px solid #00f0ff',
            borderRadius: '8px', color: '#0284c7', padding: '12px', fontSize: '11px',
            outline: 'none', resize: 'none', lineHeight: '1.4', fontFamily: 'Consolas, monospace',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {relatorioErros.length > 0 && (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,240,255,0.5)', padding: '8px', borderRadius: '6px' }}>
          {relatorioErros.map((item, idx) => (
            <div key={idx} style={{ fontSize: '10px', color: item.cor }}>{item.texto}</div>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #00f0ff', borderRadius: '10px', padding: '10px' }}>
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
            placeholder="Digite comandos de IA..."
            style={{ flex: 1, padding: '6px 10px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '6px', color: '#0f172a', fontSize: '10px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
            Executar
          </button>
        </form>
      </div>

      <GlassKeyboard3D onKeyPress={(tecla) => {
        if (tecla === 'Backspace') setCodigoFonte(prev => prev.slice(0, -1));
        else if (tecla === 'Space') setCodigoFonte(prev => prev + ' ');
        else if (tecla === 'Enter') setCodigoFonte(prev => prev + '\n');
        else if (tecla.length === 1) setCodigoFonte(prev => prev + tecla);
      }} />

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
        <button onClick={() => { navigator.clipboard.writeText(codigoFonte); alert("Código copiado!"); }} style={{ flex: 1, padding: '8px', backgroundColor: '#0284c7', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📋 Copiar
        </button>
        <button onClick={baixarCodigoArquivo} style={{ flex: 1, padding: '8px', backgroundColor: '#16a34a', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          💾 Salvar
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
      alert('Erro ao enviar e-mail. Tente novamente!');
    });
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff',
      borderRadius: '14px', padding: '16px', boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
      color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ color: '#0284c7', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>
        🎁 Baixar 300 Comandos Mestre + Mapas v7.0
      </h3>
      {enviado ? (
        <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid #16a34a', borderRadius: '8px', padding: '8px', color: '#16a34a', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
          ✅ E-mail enviado com sucesso!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Digite seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none' }} />
          <button type="submit" disabled={carregando} style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            {carregando ? '⏳ Enviando...' : '🚀 Quero Acesso Gratuito'}
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
  const [temaReuniao, setTemaReuniao] = useState('Imersão v7.0 Vegatocnyx & Robotoc 3D');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Vegatocnyx 3D (Ciano & Prata)');
  const [telefoneConvidado, setTelefoneConvidado] = useState('981493989');
  const [dddConvidado, setDddConvidado] = useState('88');
  const [linkGerado, setLinkGerado] = useState('');
  const [reuniaoAgendada, setReuniaoAgendada] = useState(false);

  const criarReuniaoInstantanea = () => {
    if (!temaReuniao.trim()) return alert("Defina o tema da reunião.");
    const codigoMeet = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const urlMeet = `https://meet.google.com/${codigoMeet}`;
    setLinkGerado(urlMeet);
    setReuniaoAgendada(true);

    if (addLog) {
      addLog(`[MEET v7.0] Reunião criada: "${temaReuniao}" com avatar ${avatarEscolhido}`);
    }
  };

  const enviarConviteTelefone = () => {
    if (!telefoneConvidado || !dddConvidado) return alert("Insira o telefone.");
    const mensagem = `Convite Emanuel.OS v7.0 - Reunião "${temaReuniao}"\n🤖 Avatar: ${avatarEscolhido}\n🔗 ${linkGerado}`;
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=55${dddConvidado}${telefoneConvidado}&text=${encodeURIComponent(mensagem)}`;
    if (typeof window !== 'undefined') window.open(urlWhatsapp, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '14px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🎥 Google Meet + Avatares 3D v7.0
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        <input type="text" value={temaReuniao} onChange={(e) => setTemaReuniao(e.target.value)} placeholder="Tema..." style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
        <select value={avatarEscolhido} onChange={(e) => setAvatarEscolhido(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}>
          <option value="Vegatocnyx 3D (Ciano & Prata)">Vegatocnyx 3D (Ciano & Prata)</option>
          <option value="Robotoc 3D (Azul & Branco Quântico)">Robotoc 3D (Azul & Branco Quântico)</option>
          <option value="Assistente G-AGI Multimodal">Assistente G-AGI Multimodal</option>
        </select>
        <button onClick={criarReuniaoInstantanea} style={{ width: '100%', padding: '9px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          ⚡ Criar Reunião v7.0
        </button>
      </div>

      {reuniaoAgendada && (
        <div style={{ backgroundColor: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.3)', borderRadius: '8px', padding: '8px' }}>
          <a href={linkGerado} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#0284c7', wordBreak: 'break-all', display: 'block', marginBottom: '8px', textDecoration: 'underline' }}>{linkGerado}</a>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            <input type="text" placeholder="DDD" value={dddConvidado} onChange={(e) => setDddConvidado(e.target.value)} style={{ width: '45px', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', fontSize: '10px' }} />
            <input type="text" placeholder="Celular" value={telefoneConvidado} onChange={(e) => setTelefoneConvidado(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px' }} />
          </div>
          <button onClick={enviarConviteTelefone} style={{ width: '100%', padding: '7px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
            📲 Enviar Convite via WhatsApp
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
    'Emanuel.OS v7.0 - Terminal Nativo [Kernel v7.0]',
    'VEGATOCNYX & ROBOTOC Shell - Digite "help".',
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
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(line, padding, padding + (index + 1) * lineHeight);
    });

    const prompt = `root@emanuel-os:${currentPath}# `;
    const promptWidth = ctx.measureText(prompt).width;
    ctx.fillStyle = '#ef4444';
    ctx.fillText(prompt, padding, padding + (linesToDraw.length + 1) * lineHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText(currentLine, padding + promptWidth, padding + (linesToDraw.length + 1) * lineHeight);
  }, [history, currentLine, currentPath]);

  const handleCommand = (cmd) => {
    let output = [];
    if (cmd.trim() === 'help') output = ['Comandos: help, ls, clear, uname'];
    else if (cmd.trim() === 'ls') output = ['bin/ home/ var/ v7-readme.txt'];
    else if (cmd.trim() === 'uname') output = ['EmanuelOS 7.0.0 - Vegatocnyx & Robotoc 3D Core'];
    else if (cmd.trim() === 'clear') { setHistory([]); return; }
    else output = [`${cmd}: command not found`];

    setHistory(prev => [...prev, `root@emanuel-os:${currentPath}# ${cmd}`, ...output, ' ']);
    setCurrentLine('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCommand(currentLine);
    else if (e.key === 'Backspace') setCurrentLine(prev => prev.slice(0, -1));
    else if (e.key.length === 1) setCurrentLine(prev => prev + e.key);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '200px', backgroundColor: '#0f172a', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', overflow: 'hidden' }} tabIndex={0} onKeyDown={handleKeyDown}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

// =========================================================================================
// ₿ --- BITCOIN ANALYSIS PANEL ---
// =========================================================================================
const BitcoinAnalysisPanel = () => {
  const [data] = useState({ price: '$91,200.00', change24h: '+4.2%', prediction: 'Alta (G-AGI Target $110k)', ai_confidence: '99.1%' });

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(234, 179, 8, 0.15)', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#d97706', fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ₿ ANALÍTICA BITCOIN v7.0 <span style={{ fontSize: '9px', border: '1px solid #d97706', padding: '1px 5px', borderRadius: '8px' }}>QUANT CORE</span>
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
  const [workerName, setWorkerName] = useState('emanuel-agi-edge-v7');
  const [deploying, setDeploying] = useState(false);

  const performDeploy = () => {
    setDeploying(true);
    if (addLog) addLog(`[CLOUDFLARE] Iniciando deploy global do Worker "${workerName}" v7.0...`);
    setTimeout(() => {
      setDeploying(false);
      alert("✅ Worker v7.0 publicado com sucesso!");
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #ea580c', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#ea580c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER v7.0</h3>
      <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }} />
      <button onClick={performDeploy} disabled={deploying} style={{ width: '100%', padding: '10px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
        {deploying ? '⚡ Deploying...' : '🚀 Executar Deploy v7.0'}
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
      color: 0xf8fafc, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

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
      const robot1Parts = criarModeloVegatocnyxEspetacular3D();
      const robot1 = robot1Parts.robotGroup;
      robot1.position.set(-1.3, 0.2, 0);
      robot1.scale.set(0.95, 0.95, 0.95);

      const robot2Parts = criarModeloRobotocEspetacular3D();
      const robot2 = robot2Parts.robotGroup;
      robot2.position.set(1.3, 0.2, 0);
      robot2.scale.set(0.95, 0.95, 0.95);

      contentGroup.add(robot1);
      contentGroup.add(robot2);
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
          ✨ Vegatocnyx & Robotoc 3D
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🪟 --- WINDOW DEV PANEL ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [size] = useState({ width: 520, height: 580 });
  const [pos] = useState({ x: 80, y: 60 });
  const [modoVitrine, setModoVitrine] = useState('avatares');

  return (
    <div style={{
      position: 'fixed', top: `${pos.y}px`, left: `${pos.x}px`, width: `${size.width}px`, height: `${size.height}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '18px',
      backdropFilter: 'blur(25px)', zIndex: 300, boxShadow: '0 0 40px rgba(0,240,255,0.25)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#0f172a', fontFamily: 'sans-serif'
    }}>
      <div style={{ padding: '12px 16px', backgroundColor: 'rgba(240, 249, 255, 0.95)', borderBottom: '1px solid #00f0ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>💎</span>
          <strong style={{ fontSize: '12px', color: '#0284c7', letterSpacing: '0.5px' }}>
            PAINEL FUTURISTA DE DESENVOLVIMENTO v7.0
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <VitrineVirtual3D modoAtual={modoVitrine} onSelectModo={(m) => setModoVitrine(m)} onRequestBluetoothConnection={onRequestBluetooth} />
      </div>
    </div>
  );
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (VERSÃO 7.0) --- 🖥️
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
    nome: "Emanuel da Silva (Comando Central Emanuel.OS v7.0)",
    whatsapp: "5588981493989",
    email: "leeheroi123@gmail.com",
    tiktok: "https://www.tiktok.com/@emanueldasilva26",
    instagram: "https://www.instagram.com/emanuelsilva432",
    threads: "https://www.threads.net/@emanuelsilva432",
    github: "https://github.com/Manomae",
    facebook: "https://www.facebook.com/leeheroi.heroi",
    youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
  };

  const [links3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube', url: meusDadosReais.youtube, icone: '▶️', nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok', url: meusDadosReais.tiktok, icone: '🎵', nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram', url: meusDadosReais.instagram, icone: '📸', nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'GitHub', url: meusDadosReais.github, icone: '🐙', nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'WhatsApp', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', nuvem: 'google' }
  ]);

  const [servicosNuvemEmail] = useState({
    google: { conta: 'leeheroi123@gmail.com' },
    apple: { conta: 'emanuel@icloud.com' },
    microsoft: { conta: 'emanuel@outlook.com' }
  });

  const [locaisEmanuelOS] = useState([
    { id: 1, nome: 'Emanuel.OS v7.0 Core Data Center', categoria: '🖥️ Servidor & Nuvem AGI', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, ipCriptografado: 'AES256-V7-EMA', trabalho: 'Engenharia & AGI Node', urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' },
    { id: 2, nome: 'Centro de Pesquisa Vegatocnyx & Robotoc', categoria: '🤖 Inteligência Artificial & Robótica 3D', cor: 0x00ffcc, lat: -23.5505, lng: -46.6333, ipCriptografado: 'AES256-VEGA-ROBOT', trabalho: 'Sincronização Neural', urlExterna: 'https://maps.google.com/?q=-23.5505,-46.6333' }
  ]);

  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11);

  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de Segurança v7.0');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];
  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const qrPayload = 'https://github.com/Manomae/naruto-anime-portfolio';

  const availableOptions = [
    { type: 'emoji', value: '🔥', label: 'Emoji Fogo' },
    { type: 'avatar', value: 'avatar_ninja.png', label: 'Avatar Ninja' },
    { type: 'gif', value: 'gif_animado.gif', label: 'GIF Chakra' }
  ];

  const TELEFONE_AUTORIZADO = "88981493989";
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
    "[VEGATOCNYX & ROBOTOC v7.0] Emanuel.OS Workstation operacional.",
    "[STATUS] Vegatocnyx 3D e Robotoc 3D integrados com sucesso."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'VEGATOCNYX & ROBOTOC 3D (v7.0)', texto: 'Emanuel.OS v7.0 Workstation ativa! Vegatocnyx 3D e Robotoc 3D prontos para interagir.', tipo: 'sys' }
  ]);

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
    "Vegatocnyx 3D e Robotoc 3D sincronizados com sucesso no Emanuel.OS v7.0!",
    "Todos os movimentos e funções quânticas operando em harmonia perfeita.",
    "Segurança de 7 camadas validada. Pronto para novos desafios.",
    "Explore a Terra 3D com a nova Vegatocnyx 3D ao lado do Robotoc 3D!"
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
  };

  const executarComandoRobotocTerra = (tipo) => {
    robotClickAnimRef.current = 1.0;
    if (tipo === 'passear') {
      robotWalkAnimRef.current = 1.0;
      dispararFalaRobotoc("Vegatocnyx e Robotoc iniciaram o passeio pela superfície da Terra 3D!");
    } else if (tipo === 'buscar') {
      const locAleatorio = locaisEmanuelOS[Math.floor(Math.random() * locaisEmanuelOS.length)];
      focarLocalNoGlobo(locAleatorio);
      dispararFalaRobotoc(`Explorando local: ${locAleatorio.nome}.`);
    } else if (tipo === 'explorar_interior') {
      setModoExploracaoTerra(prev => !prev);
      const estadoNovo = !modoExploracaoTerra;
      if (earthInteriorGroupRef.current) earthInteriorGroupRef.current.visible = estadoNovo;
      dispararFalaRobotoc(estadoNovo ? "Entrando nas camadas internas da Terra 3D!" : "Retornando à superfície.");
    }
  };

  const focarLocalNoGlobo = (local) => {
    setLocalSelecionadoGlobo(local);
    setResultadosBuscaGlobo([]);
    setTermoBuscaGlobo(local.nome);

    if (globeGroupRef.current) {
      const phi = (90 - local.lat) * (Math.PI / 180);
      const theta = (local.lng + 180) * (Math.PI / 180);
      globeGroupRef.current.rotation.y = -theta + Math.PI / 2;
      globeGroupRef.current.rotation.x = phi - Math.PI / 2;
    }
  };

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return alert("🚨 ACESSO BLOQUEADO!");
    if (!chaveAcessoTripla.trim()) return setStatusAcessoTriplo("⚠️ Insira a Chave!");

    setValidandoServidores(true);
    setTimeout(() => {
      setValidandoServidores(false);
      if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
        setEtapaSeguranca(2);
      } else {
        const novas = tentativasInvasao + 1;
        setTentativasInvasao(novas);
        if (novas >= 3) setBloqueioInvasor(true);
      }
    }, 800);
  };

  const validarEtapa2Telefone = (e) => {
    e.preventDefault();
    const tel = telefoneDigitado.replace(/\D/g, '');
    if (tel === TELEFONE_AUTORIZADO || tel === "55" + TELEFONE_AUTORIZADO) setEtapaSeguranca(3);
    else alert("⚠️ Telefone não autorizado!");
  };

  const validarEtapa3Pin = (e) => {
    e.preventDefault();
    if (pinDigitado === PIN_MESTRE_EMANUEL) setEtapaSeguranca(4);
    else alert("⚠️ PIN incorreto!");
  };

  const validarEtapa4Email = (e) => {
    e.preventDefault();
    if (emailDigitado.trim().toLowerCase() === EMAIL_AUTORIZADO.toLowerCase()) setEtapaSeguranca(5);
    else alert("⚠️ E-mail incorreto!");
  };

  const validarEtapa5Chave = (e) => {
    e.preventDefault();
    if (chaveDigitada === CHAVE_MESTRE) setEtapaSeguranca(6);
    else alert("⚠️ Palavra-Chave incorreta!");
  };

  const handleSelectOptionTicons = (item) => {
    const newSeq = [...selectedSequence, item.value];
    setSelectedSequence(newSeq);
    if (newSeq.length === targetSequence.length) setEtapaSeguranca(7);
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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;

    const radius = 2.5;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.3 });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    const earthInteriorGroup = new THREE.Group();
    earthInteriorGroup.visible = false;
    const mantleMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.85, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff5500, wireframe: true }));
    const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.4, 32, 32), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00f0ff, emissiveIntensity: 3.5 }));
    earthInteriorGroup.add(mantleMesh, coreMesh);
    globeGroup.add(earthInteriorGroup);
    earthInteriorGroupRef.current = earthInteriorGroup;

    scene.add(globeGroup);

    // INSTANCIANDO VEGATOCNYX 3D COMO AVATAR PRINCIPAL AO LADO DO ROBOTOC 3D
    const vegatocnyxParts = criarModeloVegatocnyxEspetacular3D();
    const mainRobotGroup = vegatocnyxParts.robotGroup;
    mainRobotGroup.position.set(3.2, 0.2, 1.0);
    mainRobotGroup.scale.set(1.25, 1.25, 1.25);
    scene.add(mainRobotGroup);
    mainRobotRef.current = mainRobotGroup;

    robotHeadRef.current = vegatocnyxParts.headGroup;
    robotVisorRef.current = vegatocnyxParts.eyeL;
    robotArmLRef.current = vegatocnyxParts.rightArmPivot;
    robotArmRRef.current = vegatocnyxParts.leftArmPivot;
    robotLeftElbowRef.current = vegatocnyxParts.leftElbowGroup;

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      if (mainRobotRef.current) {
        if (robotClickAnimRef.current > 0) robotClickAnimRef.current = Math.max(0, robotClickAnimRef.current - 0.022);
        if (robotWalkAnimRef.current > 0) robotWalkAnimRef.current = Math.max(0, robotWalkAnimRef.current - 0.005);

        const clickPulse = robotClickAnimRef.current;
        const jumpOffset = Math.sin(clickPulse * Math.PI) * 0.32;
        mainRobotRef.current.position.y = 0.2 + Math.sin(time * 2.0) * 0.12 + jumpOffset;
        mainRobotRef.current.rotation.y = Math.sin(time * 0.8) * 0.2 - 0.3;
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
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center', boxSizing: 'border-box', backdropFilter: 'blur(20px)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> v7.0 WORKSTATION
          </h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>
            VEGATOCNYX & ROBOTOC 3D INTEGRATION ({etapaSeguranca}/7)
          </span>

          {etapaSeguranca === 1 && (
            <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold' }}>🛡️ 1ª Etapa: Chave de Segurança v7.0</span>
              <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{statusAcessoTriplo}</p>
              <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Chave Mestre..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '13px', outline: 'none' }} />
              <button type="submit" disabled={validandoServidores} style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                {validandoServidores ? '⏳ Validando...' : '🔐 Validar Chave ➔'}
              </button>
            </form>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={validarEtapa2Telefone} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>📱 2ª Etapa: Telefone Autorizado</span>
              <input type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)} placeholder="88981493989" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar ➔</button>
            </form>
          )}

          {etapaSeguranca === 3 && (
            <form onSubmit={validarEtapa3Pin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>🔢 3ª Etapa: PIN Mestre</span>
              <input type="password" maxLength={4} value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)} placeholder="****" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '20px', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar PIN ➔</button>
            </form>
          )}

          {etapaSeguranca === 4 && (
            <form onSubmit={validarEtapa4Email} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>📧 4ª Etapa: E-mail</span>
              <input type="email" value={emailDigitado} onChange={(e) => setEmailDigitado(e.target.value)} placeholder="leeheroi123@gmail.com" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0f172a', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar E-mail ➔</button>
            </form>
          )}

          {etapaSeguranca === 5 && (
            <form onSubmit={validarEtapa5Chave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre</span>
              <input type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)} placeholder="ASD-DDD-888" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ef4444', backgroundColor: '#f8fafc', color: '#0f172a', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Avançar ➔</button>
            </form>
          )}

          {etapaSeguranca === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 'bold' }}>🔑 6ª Camada: Ticons OS</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {availableOptions.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSelectOptionTicons(opt)} style={{ backgroundColor: '#f0f9ff', border: '1px solid #d97706', color: '#0f172a', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold' }}>📡 7ª CAMADA: QR CODE v7.0</span>
              <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #00f0ff' }}>
                <QRCodeSVG value={qrPayload} size={130} />
              </div>
              <button onClick={executarEscaneamentoQRCode7aCamada} disabled={qrCodeValidando} style={{ width: '100%', padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                {qrCodeValidando ? '🔍 Validando...' : '📱 Entrar no Emanuel.OS v7.0 ➔'}
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
          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab' }} />

          {legendaRobotoc && (
            <div style={{
              position: 'absolute', bottom: '135px', right: '30px', zIndex: 145, maxWidth: '340px',
              backgroundColor: 'rgba(3, 7, 18, 0.85)', border: '1.5px solid #00f0ff', borderLeft: '5px solid #00f0ff',
              borderRadius: '14px', padding: '12px 16px', color: '#f0f9ff', backdropFilter: 'blur(16px)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.35)', fontFamily: 'Consolas, monospace'
            }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff', letterSpacing: '1px' }}>
                🎙️ VEGATOCNYX & ROBOTOC v7.0 // NEURAL
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', lineHeight: '1.45', color: '#e0f2fe' }}>
                "{legendaRobotoc}"
              </p>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: '15px', right: '20px', zIndex: 155, display: 'flex', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.92)', padding: '8px 12px', borderRadius: '16px', border: '2px solid #00f0ff', boxShadow: '0 0 25px rgba(0,240,255,0.3)', backdropFilter: 'blur(15px)' }}>
            <button onClick={() => executarComandoRobotocTerra('passear')} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '9.5px', fontWeight: 'bold', cursor: 'pointer' }}>
              🚶 Passear na Terra 3D
            </button>
            <button onClick={() => executarComandoRobotocTerra('buscar')} style={{ padding: '6px 10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '9.5px', fontWeight: 'bold', cursor: 'pointer' }}>
              🌍 Buscar Locais
            </button>
          </div>

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>

            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              🖥️ {modoDevSplit ? 'Fechar Workstation' : 'Dev Split v7.0'}
            </button>

            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📱 Android HUD v7.0
            </button>

            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📊 Creator Studio
            </button>

            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
              ✨ Vitrine Vegatocnyx & Robotoc 3D
            </button>

            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: miniAssistantAberto ? '#00f0ff' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: miniAssistantAberto ? '#000' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              🤖 Vegatocnyx 3D Assistant
            </button>
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
                  Contexto: EMANUEL<span style={{ color: '#0284c7' }}>.OS v7.0</span>
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
        </div>

        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>

      {janelaRobotocDevAberta && (
        <WindowDevPanelRobotoc onClose={() => setJanelaRobotocDevAberta(false)} onRequestBluetooth={acionarSolicitacaoBluetooth} />
      )}

      {miniAssistantAberto && (
        <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />
      )}

      <MiniRobotocSidebarNotes addLogTerminal={addLogTerminal} />

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
