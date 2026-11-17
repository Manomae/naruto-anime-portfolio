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
// 🌸 --- HELPER DE MODELAGEM 3D VEGATOCNYX (FEMININO COM RABO DE PONTEIRA, BASEADO NA FOTO) ---
// =========================================================================================
function criarModelovegatocnyxEspetacular3D() {
  const robotGroup = new THREE.Group();

  const whiteArmorMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc, roughness: 0.15, metalness: 0.1, clearcoat: 1.0
  });
  const chromeSilverMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db, roughness: 0.2, metalness: 0.92
  });
  const metallicBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, roughness: 0.25, metalness: 0.75
  });
  const darkScreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x020617, roughness: 0.08, metalness: 0.3, clearcoat: 1.0
  });
  const cyanLedMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.2, roughness: 0.1
  });

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.48, 36, 36), whiteArmorMat);
  headBase.scale.set(1.05, 0.92, 0.96);
  headGroup.add(headBase);

  // Rabo de cavalo / crista em ponteira metálica com LED azul (como na imagem Vegatocnyx)
  const ponytailBase = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 24), chromeSilverMat);
  ponytailBase.position.set(0, 0.35, -0.42);
  ponytailBase.rotation.x = -Math.PI / 4;
  const ponytailLed = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.55, 16), cyanLedMat);
  ponytailLed.position.set(0, 0.38, -0.42);
  ponytailLed.rotation.x = -Math.PI / 4;
  headGroup.add(ponytailBase, ponytailLed);

  const visorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.32, 0.16), metallicBlueMat);
  visorFrame.position.set(0, -0.02, 0.40);
  headGroup.add(visorFrame);

  const visorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.26, 0.17), darkScreenMat);
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

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.20, 20), chromeSilverMat);
  neck.position.set(0, 0.54, 0);
  robotGroup.add(neck);

  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.05, 0);

  const chestArmor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.52, 32), whiteArmorMat);
  chestArmor.scale.set(1.1, 1, 0.8);
  chestArmor.position.set(0, 0.18, 0);
  torsoGroup.add(chestArmor);

  const chestBlueTrim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.32), metallicBlueMat);
  chestBlueTrim.position.set(0, 0.16, 0.06);
  torsoGroup.add(chestBlueTrim);

  const chestCoreLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.05), cyanLedMat);
  chestCoreLed.position.set(0, 0.18, 0.24);
  torsoGroup.add(chestCoreLed);

  for (let i = 0; i < 3; i++) {
    const abSeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22 - i * 0.015, 0.20 - i * 0.015, 0.07, 24), chromeSilverMat);
    abSeg.scale.set(1.05, 1, 0.8);
    abSeg.position.set(0, -0.12 - i * 0.09, 0);
    torsoGroup.add(abSeg);
  }

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.18, 0.20, 24), whiteArmorMat);
  pelvis.scale.set(1.1, 1, 0.85);
  pelvis.position.set(0, -0.42, 0);
  torsoGroup.add(pelvis);

  robotGroup.add(torsoGroup);

  const criarBracoVegatocnyx = (lado) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(lado * 0.44, 0.34, 0);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), chromeSilverMat);
    armPivot.add(shoulder);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.26, 20), chromeSilverMat);
    upperArm.position.set(lado * 0.04, -0.16, 0);
    armPivot.add(upperArm);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(lado * 0.06, -0.32, 0);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 0.30, 24), chromeSilverMat);
    forearm.position.set(0, -0.16, 0);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 12, 24), metallicBlueMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.30, 0);
    elbowGroup.add(forearm, cuff);

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.38, 0);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.06), whiteArmorMat);
    handGroup.add(palm);

    for (let f = -1.5; f <= 1.5; f += 1) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.08, 10), chromeSilverMat);
      finger.position.set(f * 0.028, -0.08, 0);
      handGroup.add(finger);
    }
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.013, 0.07, 10), chromeSilverMat);
    thumb.position.set(-lado * 0.07, -0.03, 0.02);
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
  robotGroup.add(leftArmObj.armPivot);

  const criarPernaVegatocnyx = (side) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.15, -0.50, 0);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.25, 20), chromeSilverMat);
    thigh.position.set(0, -0.14, 0);

    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), metallicBlueMat);
    kneeJoint.position.set(0, -0.28, 0.02);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.28, 24), chromeSilverMat);
    shin.position.set(0, -0.44, 0);

    const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.10, 0.31), whiteArmorMat);
    footBase.position.set(0, -0.63, 0.04);

    legGroup.add(thigh, kneeJoint, shin, footBase);
    return legGroup;
  };

  robotGroup.add(criarPernaVegatocnyx(-1), criarPernaVegatocnyx(1));

  return {
    robotGroup, headGroup, eyeL, eyeR, crestLed: ponytailLed, chestCoreLed, rightArmPivot: rightArmObj.armPivot, leftArmPivot: leftArmObj.armPivot, leftElbowGroup: leftArmObj.elbowGroup
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
    if (texto.toLowerCase().includes('buscar') || texto.toLowerCase().includes('pesquisar')) {
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

    pointerArmRef.current = robotParts.leftElbowGroup;
    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      if (clickBoostRef.current > 0) clickBoostRef.current = Math.max(0, clickBoostRef.current - 0.03);
      const boost = clickBoostRef.current;
      miniRobot.position.y = -0.1 + Math.sin(time * 2.5) * 0.06 + Math.sin(boost * Math.PI) * 0.18;
      miniRobot.rotation.y = Math.sin(time * 1.2) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
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
        <div ref={mountRef} onClick={() => processarPerguntaRobotoc("Olá Robotoc")} title="Clique no Mini Robotoc 3D!" style={{ width: '90px', height: '100px', cursor: 'pointer', flexShrink: 0 }} />
        <div style={{ flex: 1, maxHeight: '140px', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Resposta Robotoc:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a', whiteSpace: 'pre-wrap' }}>{carregando ? '⚡ Processando dados e buscando na internet...' : respostaIA}</p>
          {imagemBusca && <img src={imagemBusca} alt="Busca" style={{ width: '100%', height: '80px', objectFit: 'cover', marginTop: '6px', borderRadius: '6px' }} />}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={iniciarOuvirMicrofone} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #00f0ff', backgroundColor: ouvindo ? 'rgba(239,68,68,0.2)' : 'rgba(2,132,199,0.1)', color: ouvindo ? '#ef4444' : '#0284c7', cursor: 'pointer', fontSize: '14px' }}>🎙️</button>
        <input type="text" value={duvidaInput} onChange={handleInputChange} placeholder="Digite sua dúvida ou comando..." style={{ flex: 1, padding: '8px 10px', backgroundColor: '#f8fafc', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '10px', outline: 'none', color: '#0f172a' }} />
        <button onClick={() => processarPerguntaRobotoc(duvidaInput)} style={{ padding: '8px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>Enviar</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🚀 --- COMPONENTE: MINI ROBOTOC SIDEBAR & NOTAS ---
// =========================================================================================
function MiniRobotocSidebarNotes({ addLogTerminal }) {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('notas');
  const [notas, setNotas] = useState([{ id: 1, titulo: 'Anotações Mestre Kernel', conteudo: 'Mapeamento quântico ativo.', data: new Date().toLocaleTimeString('pt-BR') }]);
  const [lixeira, setLixeira] = useState([]);
  const [tituloInput, setTituloInput] = useState('');
  const [conteudoInput, setConteudoInput] = useState('');

  const robotMountRef = useRef(null);

  const handleCriarNota = (e) => {
    e.preventDefault();
    if (!conteudoInput.trim()) return;
    setNotas(prev => [{ id: Date.now(), titulo: tituloInput.trim() || `Rascunho`, conteudo: conteudoInput, data: new Date().toLocaleTimeString('pt-BR') }, ...prev]);
    setTituloInput(''); setConteudoInput('');
  };

  useEffect(() => {
    if (!robotMountRef.current) return;
    const width = 60; const height = 60;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 3.6);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    robotMountRef.current.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const robotParts = criarModeloRobotocEspetacular3D();
    scene.add(robotParts.robotGroup);

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
      <div onClick={() => setExpandido(!expandido)} style={{ width: '54px', height: '110px', backgroundColor: 'rgba(255,255,255,0.92)', border: '2px solid #00f0ff', borderRight: 'none', borderRadius: '20px 0 0 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <div ref={robotMountRef} style={{ width: '45px', height: '45px', pointerEvents: 'none' }} />
        <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: '900' }}>{expandido ? 'FECHAR' : 'NOTAS'}</span>
      </div>

      <div style={{ width: expandido ? '360px' : '0px', height: '520px', backgroundColor: 'rgba(255,255,255,0.95)', border: expandido ? '2px solid #00f0ff' : 'none', borderRight: 'none', borderRadius: '20px 0 0 20px', overflow: 'hidden', transition: 'all 0.4s ease', display: 'flex', flexDirection: 'column', padding: expandido ? '12px' : '0' }}>
        {expandido && (
          <>
            <strong style={{ fontSize: '11px', color: '#0284c7', marginBottom: '8px' }}>📝 BLOCO DE NOTAS ROBOTOC</strong>
            <form onSubmit={handleCriarNota} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
              <input type="text" placeholder="Título..." value={tituloInput} onChange={(e) => setTituloInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px' }} />
              <textarea placeholder="Conteúdo..." value={conteudoInput} onChange={(e) => setConteudoInput(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px', resize: 'none' }} rows={2} />
              <button type="submit" style={{ padding: '6px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Nota</button>
            </form>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {notas.map(n => (
                <div key={n.id} style={{ background: '#f8fafc', border: '1px solid #00f0ff', borderRadius: '8px', padding: '8px' }}>
                  <strong>{n.titulo}</strong>
                  <p style={{ margin: '4px 0', fontSize: '9px' }}>{n.conteudo}</p>
                </div>
              ))}
            </div>
          </>
        )}
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

  const toggleCamera = async () => {
    if (active) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
      setActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setActive(true);
      } catch (err) {
        alert("Erro ao acessar câmera: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(240,249,255,0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 VISION TRACKER</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>{active ? 'Desligar' : 'Ligar'}</button>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '120px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
}

// =========================================================================================
// ⚙️ --- ROBOTOC GEAR ---
// =========================================================================================
function RobotocGear({ onConnectGear, highlightGear }) {
  const [gears, setGears] = useState({ headset: false, mouse: false, keyboard: true });
  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: highlightGear ? '2px solid #eab308' : '1px solid #0284c7', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>⚙️ ROBOTOC GEAR</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {['headset', 'mouse', 'keyboard'].map(g => (
          <button key={g} onClick={() => setGears(p => ({ ...p, [g]: !p[g] }))} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears[g] ? '#0284c7' : 'transparent', color: gears[g] ? '#fff' : '#0284c7', fontSize: '9px', fontWeight: 'bold' }}>{g}</button>
        ))}
      </div>
    </div>
  );
}

// =========================================================================================
// ⌨️ --- GLASS KEYBOARD ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,240,255,0.6)', borderRadius: '12px', padding: '10px' }}>
      <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>⌨️ TECLADO GLASS 3D</span>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
        {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
          <button key={k} onClick={() => onKeyPress && onKeyPress(k)} style={{ padding: '6px', background: 'rgba(2,132,199,0.1)', border: '1px solid #0284c7', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>{k}</button>
        ))}
      </div>
    </div>
  );
}

// =========================================================================================
// 📲 --- DISPATCHER MENSAGENS ---
// =========================================================================================
function DispatcherMensagensNumeros({ addLog }) {
  const [num, setNum] = useState('');
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px' }}>
      <h3 style={{ color: '#0284c7', fontSize: '11px', margin: '0 0 8px 0' }}>💬 MENSAGERIA REAL</h3>
      <input type="text" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Número WhatsApp..." style={{ width: '100%', padding: '6px', marginBottom: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '10px' }} />
      <button onClick={() => alert("Mensagem disparada!")} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>🚀 Disparar</button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- NEURAL THOUGHT PANEL ---
// =========================================================================================
function RobotocNeuralThoughtPanel({ addLog }) {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0' }}>🧠 PENSAMENTO FUTURISTA 3D</h3>
      <button onClick={() => addLog && addLog("[ROBOTOC] Contas sincronizadas.")} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🔄 Sincronizar</button>
    </div>
  );
}

// =========================================================================================
// 📱 --- ANDROID HUD ---
// =========================================================================================
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{ position: 'fixed', top: 0, right: open ? 0 : '-360px', width: '350px', height: '100vh', backgroundColor: 'rgba(255,255,255,0.92)', borderLeft: '2px solid #00f0ff', backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s ease', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>🤖 ANDROID 16 HUD</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  );
}

// =========================================================================================
// 📊 --- CREATOR STUDIO ---
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '90%', maxWidth: '600px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        <h2 style={{ color: '#0284c7' }}>📊 EM CREATOR STUDIO IA</h2>
        <p style={{ fontSize: '12px' }}>Painel de métricas e AGI ativas no Emanuel.OS.</p>
      </div>
    </div>
  );
}

// =========================================================================================
// 💻 --- DEV SPLIT SCREEN ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff', borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Workstation Dev</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>
      <textarea defaultValue="// Código Núcleo Dev" style={{ flexGrow: 1, borderRadius: '8px', padding: '10px', fontFamily: 'monospace' }} />
    </div>
  );
}

// =========================================================================================
// ✉️ --- EMAILJS CAPTURA ---
// =========================================================================================
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #00f0ff', borderRadius: '14px', padding: '16px', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', margin: '0 0 6px 0', fontSize: '12px' }}>🎁 Baixar 300 Comandos Mestre</h3>
      <input type="email" placeholder="Seu e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', boxSizing: 'border-box' }} />
      <button onClick={() => alert("E-mail cadastrado!")} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>Quero Acesso</button>
    </div>
  );
}

// =========================================================================================
// 🎥 --- GOOGLE MEET AVATAR MANAGER ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,240,255,0.6)', borderRadius: '14px', padding: '16px', margin: '10px 0' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0' }}>🎥 Google Meet + Avatares 3D</h3>
      <button onClick={() => alert("Reunião Meet criada!")} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>Criar Reunião</button>
    </div>
  );
}

// =========================================================================================
// 🖥️ --- UNIX TERMINAL CANVAS ---
// =========================================================================================
const UnixTerminalCanvas = () => {
  return (
    <div style={{ width: '100%', height: '150px', backgroundColor: '#0f172a', border: '2px solid #00f0ff', borderRadius: '10px', padding: '8px', color: '#38bdf8', fontFamily: 'monospace', fontSize: '10px' }}>
      root@emanuel-os:~# Emanuel.OS Kernel Online.
    </div>
  );
};

// =========================================================================================
// ₿ --- BITCOIN ANALYSIS ---
// =========================================================================================
const BitcoinAnalysisPanel = () => {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#0f172a' }}>
      <h3 style={{ color: '#d97706', fontSize: '13px', margin: '0 0 8px 0' }}>₿ BITCOIN QUANT CORE</h3>
      <strong>Preço: $89,450.00 | Confiança IA: 98.5%</strong>
    </div>
  );
};

// =========================================================================================
// ☁️ --- CLOUDFLARE DEPLOYER ---
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '2px solid #ea580c', borderRadius: '16px', padding: '16px' }}>
      <h3 style={{ color: '#ea580c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE DEPLOYER</h3>
      <button onClick={() => alert("Deploy executado!")} style={{ width: '100%', padding: '8px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Deploy Global</button>
    </div>
  );
};

// =========================================================================================
// 🏛️ --- VITRINE VIRTUAL 3D DE VIDRO (COM ROBOTOC E VEGATOCNYX) ---
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

    const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 4.5, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5, thickness: 0.5, side: THREE.DoubleSide }));
    glassMesh.position.y = 1.0;
    vitrineGroup.add(glassMesh);

    const contentGroup = new THREE.Group();

    if (modoAtual === 'avatares' || modoAtual === 'bluetooth') {
      const robot1 = criarModeloRobotocEspetacular3D().robotGroup;
      robot1.position.set(-1.3, 0.2, 0);
      robot1.scale.set(0.95, 0.95, 0.95);

      const robot2 = criarModelovegatocnyxEspetacular3D().robotGroup;
      robot2.position.set(1.3, 0.2, 0);
      robot2.scale.set(0.95, 0.95, 0.95);

      contentGroup.add(robot1, robot2);
    } else {
      const mapGeo = new THREE.IcosahedronGeometry(1.3, 2);
      const mapMesh = new THREE.Mesh(mapGeo, new THREE.MeshStandardMaterial({ color: 0x0284c7, wireframe: true }));
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
      <div ref={container3dRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '6px' }}>
        <button onClick={() => onSelectModo('avatares')} style={{ padding: '4px 8px', backgroundColor: modoAtual === 'avatares' ? '#0284c7' : '#fff', color: modoAtual === 'avatares' ? '#fff' : '#0f172a', border: '1px solid #0284c7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>🤖 Robotoc & Vegatocnyx 3D</button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🪟 --- WINDOW DEV PANEL ROBOTOC ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [modoVitrine, setModoVitrine] = useState('avatares');
  return (
    <div style={{ position: 'fixed', top: '60px', left: '80px', width: '520px', height: '580px', backgroundColor: 'rgba(255,255,255,0.92)', border: '2px solid #00f0ff', borderRadius: '18px', zIndex: 300, padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>💎 PAINEL DEV ROBOTOC & VEGATOCNYX</strong>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
      </div>
      <VitrineVirtual3D modoAtual={modoVitrine} onSelectModo={setModoVitrine} onRequestBluetoothConnection={onRequestBluetooth} />
    </div>
  );
}

// =========================================================================================
// 🌟 --- COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0) --- 🌟
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  // 👤 ESTADOS DO LOGIN FACIAL BETA (30 MINUTOS)
  const [loginFacialAtivo, setLoginFacialAtivo] = useState(false);
  const [webcamAtiva, setWebcamAtiva] = useState(false);
  const [tempoSessaoRestante, setTempoSessaoRestante] = useState(null);
  const webcamVideoRef = useRef(null);

  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";

  // Temporizador da sessão facial de 30 minutos
  useEffect(() => {
    let timer;
    if (tempoSessaoRestante !== null && tempoSessaoRestante > 0) {
      timer = setInterval(() => {
        setTempoSessaoRestante(prev => {
          if (prev <= 1) {
            setBloqueado(true);
            setLoginFacialAtivo(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [tempoSessaoRestante]);

  const iniciarWebcamFacial = async () => {
    setLoginFacialAtivo(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
      setWebcamAtiva(true);
    } catch (err) {
      alert("Erro ao acessar a câmera para login facial: " + err.message);
      setLoginFacialAtivo(false);
    }
  };

  const confirmarLoginFacialBETA = () => {
    if (webcamVideoRef.current && webcamVideoRef.current.srcObject) {
      webcamVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    // Define 30 minutos (1800 segundos) de acesso livre
    setTempoSessaoRestante(1800);
    setBloqueado(false);
    setLoginFacialAtivo(false);
  };

  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return alert("🚨 ACESSO BLOQUEADO!");
    setValidandoServidores(true);
    setTimeout(() => {
      setValidandoServidores(false);
      if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
        setBloqueado(false);
      } else {
        const novas = tentativasInvasao + 1;
        setTentativasInvasao(novas);
        if (novas >= 3) setBloqueioInvasor(true);
        else setStatusAcessoTriplo(`❌ Chave Inválida! Tentativa ${novas}/3.`);
      }
    }, 1000);
  };

  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);
  const [solicitarConexaoBluetooth, setSolicitarConexaoBluetooth] = useState(false);

  const [locaisEmanuelOS] = useState([
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor de Dados', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, trabalho: 'Engenharia de Software', urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' },
    { id: 2, nome: 'Usina Nuclear Central', categoria: '⚛️ Geração Nuclear', cor: 0x00ffcc, lat: -23.0062, lng: -44.3182, trabalho: 'Energia Limpa', urlExterna: 'https://maps.google.com/?q=-23.0062,-44.3182' }
  ]);

  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11);

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

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const globeGroupRef = useRef(null);
  const mainRobotRef = useRef(null);
  const robotHeadRef = useRef(null);
  const robotVisorRef = useRef(null);
  const robotArmLRef = useRef(null);
  const robotArmRRef = useRef(null);
  const robotClickAnimRef = useRef(0);

  const [legendaRobotoc, setLegendaRobotoc] = useState('');
  const [robotocFalando, setRobotocFalando] = useState(false);

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

  useEffect(() => {
    if (bloqueado || !mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
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
    scene.add(globeGroup);

    // Adiciona o Robotoc Principal 3D na Cena Principal
    const robotPartsMain = criarModeloRobotocEspetacular3D();
    const mainRobotGroup = robotPartsMain.robotGroup;
    mainRobotGroup.position.set(3.2, 0.2, 1.0);
    mainRobotGroup.scale.set(1.25, 1.25, 1.25);
    scene.add(mainRobotGroup);
    mainRobotRef.current = mainRobotGroup;

    let animId;
    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      if (globeGroupRef.current) globeGroupRef.current.rotation.y += 0.0012;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
    };
  }, [bloqueado]);

  // =========================================================================================
  // 🔒 --- TELA DE BLOQUEIO (COM 7 CAMADAS + LOGIN FACIAL BETA DE 30 MINUTOS) ---
  // =========================================================================================
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '440px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center', boxSizing: 'border-box', backdropFilter: 'blur(20px)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> WORKSTATION v6.0
          </h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>
            PROTOCOLO DE 7 CAMADAS DE SEGURANÇA OU LOGIN FACIAL BETA (30 MIN)
          </span>

          {!loginFacialAtivo ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold' }}>🛡️ Acesso por Chave Mestre</span>
                <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{statusAcessoTriplo}</p>
                <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite sua Chave Mestre..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '13px', outline: 'none' }} />
                <button type="submit" disabled={validandoServidores} style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {validandoServidores ? '⏳ Validando...' : '🔐 Validar Chave ➔'}
                </button>
              </form>

              <div style={{ borderTop: '1px solid #bae6fd', paddingTop: '12px', marginTop: '4px' }}>
                <button onClick={iniciarWebcamFacial} style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                  📸 Entrar com Login Facial Beta (30 Minutos)
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>👤 Alinhe seu rosto com a câmera</span>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <video ref={webcamVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '15%', left: '25%', width: '50%', height: '70%', border: '2px dashed #00f0ff', borderRadius: '50%', pointerEvents: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <button onClick={() => setLoginFacialAtivo(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={confirmarLoginFacialBETA} style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Verificar & Entrar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================================
  // 🌟 --- WORKSTATION PRINCIPAL ---
  // =========================================================================================
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* ⏱️ Indicador de Sessão Facial Ativa (se aplicável) */}
      {tempoSessaoRestante !== null && (
        <div style={{ position: 'absolute', top: '15px', right: '280px', zIndex: 200, backgroundColor: 'rgba(22, 163, 74, 0.9)', color: '#fff', padding: '6px 12px', borderRadius: '15px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 0 15px rgba(22,163,74,0.4)', backdropFilter: 'blur(10px)' }}>
          ⏱️ Sessão Facial Beta: {Math.floor(tempoSessaoRestante / 60)}m {tempoSessaoRestante % 60}s restantes
        </div>
      )}

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>
          <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab' }} />

          {legendaRobotoc && (
            <div style={{ position: 'absolute', bottom: '135px', right: '30px', zIndex: 145, maxWidth: '340px', backgroundColor: 'rgba(3, 7, 18, 0.85)', border: '1.5px solid #00f0ff', borderRadius: '14px', padding: '12px 16px', color: '#f0f9ff', backdropFilter: 'blur(16px)' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#00f0ff' }}>🎙️ ROBOTOC 3D // TRANSMISSÃO NEURAL</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#e0f2fe' }}>"{legendaRobotoc}"</p>
            </div>
          )}

          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>☰</button>
            <Link href="/robotocNAV" style={{ backgroundColor: '#00f0ff', border: '1px solid #0284c7', color: '#020617', padding: '0 14px', height: '40px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', fontWeight: '900', fontSize: '11px', textDecoration: 'none' }}>🌐 robotocNAV</Link>
            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: '#fff', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🖥️ Dev Workstation</button>
            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: '#fff', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>📱 Android HUD</button>
            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: '#fff', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>📊 Creator Studio</button>
            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🤖 Painel Dev 3D</button>
            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: '#fff', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🤖 Mini Robotoc</button>
            <button onClick={() => setYugiohGameAberto(!yugiohGameAberto)} style={{ backgroundColor: '#eab308', border: 'none', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>⚔️ Yu-Gi-Oh! 3D</button>
          </div>

          <aside style={{ position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px', opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(30px)', borderRight: '1px solid rgba(0, 240, 255, 0.4)', padding: sidebarAberta ? '20px' : '0px', display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 190, transition: 'all 0.3s ease', boxSizing: 'border-box' }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>EMANUEL<span style={{ color: '#0284c7' }}>.OS v6.0</span></h1>
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

      {janelaRobotocDevAberta && <WindowDevPanelRobotoc onClose={() => setJanelaRobotocDevAberta(false)} onRequestBluetooth={() => setAndroidHudOpen(true)} />}
      {miniAssistantAberto && <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />}
      <MiniRobotocSidebarNotes />

      {yugiohGameAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 400, backgroundColor: '#0a0f1d' }}>
          <YugiohDuelLinks3D onClose={() => setYugiohGameAberto(false)} />
        </div>
      )}

      <AndroidHUDPanel open={androidHudOpen} onClose={() => setAndroidHudOpen(false)}>
        <MotionTracker />
        <RobotocGear highlightGear={false} />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer />
      </AndroidHUDPanel>

      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
