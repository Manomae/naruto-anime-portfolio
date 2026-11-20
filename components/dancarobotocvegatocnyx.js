import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { aplicarVisualModo3D } from './estilosmodos3ds.js';

const RITMOS_12 = [
  {
    id: 'FUNK',
    nome: 'Funk',
    bpm: 132,
    estilo: 'BALANCO_GRAVE',
    bg: 0x090517,
    fog: 0x090517,
    luzA: 0xff007f,
    luzB: 0x00f0ff,
    palcoCor: 0x160b2e,
    anelCor: 0xff007f,
    robotocCor: 0x0284c7,
    robotocLed: 0x00f0ff,
    vegaCor: 0xf472b6,
    vegaLed: 0xff007f,
    cenarioTipo: 'FUNK_BAILE'
  },
  {
    id: 'FORRO',
    nome: 'Forró',
    bpm: 122,
    estilo: 'ARRASTA_PE',
    bg: 0x1a0d05,
    fog: 0x1a0d05,
    luzA: 0xf59e0b,
    luzB: 0xef4444,
    palcoCor: 0x2c1608,
    anelCor: 0xfbbf24,
    robotocCor: 0xd97706,
    robotocLed: 0xfde047,
    vegaCor: 0xfb7185,
    vegaLed: 0xf59e0b,
    cenarioTipo: 'FORRO_SERTAO'
  },
  {
    id: 'PISEIRO',
    nome: 'Piseiro',
    bpm: 136,
    estilo: 'PISADA_SECA',
    bg: 0x17091f,
    fog: 0x17091f,
    luzA: 0xa855f7,
    luzB: 0x06b6d4,
    palcoCor: 0x261033,
    anelCor: 0xc084fc,
    robotocCor: 0x7c3aed,
    robotocLed: 0x22d3ee,
    vegaCor: 0xe879f9,
    vegaLed: 0xf472b6,
    cenarioTipo: 'PISEIRO_PAREDAO'
  },
  {
    id: 'SAMBA',
    nome: 'Samba',
    bpm: 112,
    estilo: 'MALANDRO_RODA',
    bg: 0x061a10,
    fog: 0x061a10,
    luzA: 0x22c55e,
    luzB: 0xeab308,
    palcoCor: 0x0c2d1c,
    anelCor: 0x4ade80,
    robotocCor: 0x16a34a,
    robotocLed: 0xfacc15,
    vegaCor: 0xfacc15,
    vegaLed: 0x22c55e,
    cenarioTipo: 'SAMBA_ESCOLA'
  },
  {
    id: 'PAGODE',
    nome: 'Pagode',
    bpm: 96,
    estilo: 'SWING_SUAVE',
    bg: 0x081326,
    fog: 0x081326,
    luzA: 0x38bdf8,
    luzB: 0xf472b6,
    palcoCor: 0x112240,
    anelCor: 0x7dd3fc,
    robotocCor: 0x0ea5e9,
    robotocLed: 0x38bdf8,
    vegaCor: 0xf9a8d4,
    vegaLed: 0xf472b6,
    cenarioTipo: 'PAGODE_LOUNGE'
  },
  {
    id: 'SERTANEJO',
    nome: 'Sertanejo',
    bpm: 118,
    estilo: 'MODAO_PALCO',
    bg: 0x181007,
    fog: 0x181007,
    luzA: 0xeab308,
    luzB: 0x38bdf8,
    palcoCor: 0x2b1d0d,
    anelCor: 0xfacc15,
    robotocCor: 0xca8a04,
    robotocLed: 0xfef08a,
    vegaCor: 0xf43f5e,
    vegaLed: 0xfbbf24,
    cenarioTipo: 'SERTANEJO_ARENA'
  },
  {
    id: 'AXE',
    nome: 'Axé',
    bpm: 140,
    estilo: 'TRIO_ELETRICO',
    bg: 0x1d0b04,
    fog: 0x1d0b04,
    luzA: 0xff5500,
    luzB: 0xffe600,
    palcoCor: 0x331306,
    anelCor: 0xff7700,
    robotocCor: 0xea580c,
    robotocLed: 0xfef08a,
    vegaCor: 0xfacc15,
    vegaLed: 0xff2a85,
    cenarioTipo: 'AXE_TRIO'
  },
  {
    id: 'BREGA_FUNK',
    nome: 'Brega Funk',
    bpm: 130,
    estilo: 'PASSINHO_RECIFE',
    bg: 0x1a0614,
    fog: 0x1a0614,
    luzA: 0xff1e8a,
    luzB: 0x3b82f6,
    palcoCor: 0x2e0b24,
    anelCor: 0xff4da6,
    robotocCor: 0x2563eb,
    robotocLed: 0x60a5fa,
    vegaCor: 0xff2a85,
    vegaLed: 0xff007f,
    cenarioTipo: 'BREGA_FUNK_NEON'
  },
  {
    id: 'TRAP',
    nome: 'Trap',
    bpm: 144,
    estilo: 'FLOW_SUBGRAVE',
    bg: 0x05050a,
    fog: 0x05050a,
    luzA: 0x8b5cf6,
    luzB: 0x10b981,
    palcoCor: 0x11111d,
    anelCor: 0xa78bfa,
    robotocCor: 0x4f46e5,
    robotocLed: 0x34d399,
    vegaCor: 0xc084fc,
    vegaLed: 0xa855f7,
    cenarioTipo: 'TRAP_UNDERGROUND'
  },
  {
    id: 'POP',
    nome: 'Pop',
    bpm: 124,
    estilo: 'COREOGRAFIA_POP',
    bg: 0x0c0a24,
    fog: 0x0c0a24,
    luzA: 0xec4899,
    luzB: 0x00f0ff,
    palcoCor: 0x1a1542,
    anelCor: 0x00f0ff,
    robotocCor: 0x0284c7,
    robotocLed: 0x00f0ff,
    vegaCor: 0xf472b6,
    vegaLed: 0xff007f,
    cenarioTipo: 'POP_STAR'
  },
  {
    id: 'ROCK',
    nome: 'Rock',
    bpm: 148,
    estilo: 'HEADBANG_RIFF',
    bg: 0x120506,
    fog: 0x120506,
    luzA: 0xef4444,
    luzB: 0xf97316,
    palcoCor: 0x24090c,
    anelCor: 0xf87171,
    robotocCor: 0xdc2626,
    robotocLed: 0xfca5a5,
    vegaCor: 0xfb7185,
    vegaLed: 0xef4444,
    cenarioTipo: 'ROCK_STADIUM'
  },
  {
    id: 'REGGAETON',
    nome: 'Reggaeton',
    bpm: 98,
    estilo: 'DEMBOW_LATINO',
    bg: 0x180916,
    fog: 0x180916,
    luzA: 0xf97316,
    luzB: 0xd946ef,
    palcoCor: 0x2b1027,
    anelCor: 0xfb923c,
    robotocCor: 0xea580c,
    robotocLed: 0xfdba74,
    vegaCor: 0xe879f9,
    vegaLed: 0xf97316,
    cenarioTipo: 'REGGAETON_CLUB'
  }
];

function calcularMovimentosMembrosRitmo(ritmoId, t, freq, amp, beat, beatRapido) {
  switch (ritmoId) {
    case 'FUNK':
      return {
        robArmLX: beatRapido * 0.55 * amp,
        robArmLZ: Math.abs(beat) * 0.35 * amp,
        robArmRX: -beatRapido * 0.45 * amp,
        robArmRZ: -Math.abs(beat) * 0.35 * amp,
        robLegLX: beat * 0.52 * amp,
        robLegLZ: Math.max(0, beat) * 0.22 * amp,
        robLegRX: -beat * 0.52 * amp,
        robLegRZ: -Math.max(0, -beat) * 0.22 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.72 * amp,
        vegArmLZ: 0.2 * amp,
        vegArmRX: Math.cos(t * freq * 2) * 0.72 * amp,
        vegArmRZ: -0.2 * amp,
        vegLegLX: -beat * 0.48 * amp,
        vegLegLZ: beat * 0.18 * amp,
        vegLegRX: beat * 0.48 * amp,
        vegLegRZ: -beat * 0.18 * amp
      };
    case 'FORRO':
      return {
        robArmLX: Math.sin(t * freq) * 0.35 * amp,
        robArmLZ: 0.28 * amp,
        robArmRX: Math.cos(t * freq) * 0.35 * amp,
        robArmRZ: -0.28 * amp,
        robLegLX: Math.sin(t * freq * 2) * 0.34 * amp,
        robLegLZ: Math.sin(t * freq) * 0.16 * amp,
        robLegRX: -Math.sin(t * freq * 2) * 0.34 * amp,
        robLegRZ: Math.sin(t * freq) * 0.16 * amp,
        vegArmLX: Math.cos(t * freq) * 0.55 * amp,
        vegArmLZ: 0.32 * amp,
        vegArmRX: Math.sin(t * freq) * 0.55 * amp,
        vegArmRZ: -0.32 * amp,
        vegLegLX: -Math.sin(t * freq * 2) * 0.36 * amp,
        vegLegLZ: -Math.sin(t * freq) * 0.16 * amp,
        vegLegRX: Math.sin(t * freq * 2) * 0.36 * amp,
        vegLegRZ: -Math.sin(t * freq) * 0.16 * amp
      };
    case 'PISEIRO':
      return {
        robArmLX: beatRapido * 0.48 * amp,
        robArmLZ: beat * 0.25 * amp,
        robArmRX: -beatRapido * 0.48 * amp,
        robArmRZ: -beat * 0.25 * amp,
        robLegLX: Math.abs(beatRapido) * 0.58 * amp,
        robLegLZ: 0.12 * amp,
        robLegRX: -Math.abs(beatRapido) * 0.58 * amp,
        robLegRZ: -0.12 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.78 * amp,
        vegArmLZ: 0.15 * amp,
        vegArmRX: -Math.sin(t * freq * 2) * 0.78 * amp,
        vegArmRZ: -0.15 * amp,
        vegLegLX: Math.abs(beatRapido) * 0.52 * amp,
        vegLegLZ: 0.14 * amp,
        vegLegRX: -Math.abs(beatRapido) * 0.52 * amp,
        vegLegRZ: -0.14 * amp
      };
    case 'SAMBA':
      return {
        robArmLX: Math.sin(t * freq * 2) * 0.42 * amp,
        robArmLZ: 0.24 * amp,
        robArmRX: -Math.sin(t * freq * 2) * 0.42 * amp,
        robArmRZ: -0.24 * amp,
        robLegLX: Math.sin(t * freq * 2) * 0.46 * amp,
        robLegLZ: Math.sin(t * freq) * 0.2 * amp,
        robLegRX: -Math.sin(t * freq * 2) * 0.46 * amp,
        robLegRZ: Math.sin(t * freq) * 0.2 * amp,
        vegArmLX: Math.cos(t * freq * 2) * 0.68 * amp,
        vegArmLZ: 0.3 * amp,
        vegArmRX: -Math.cos(t * freq * 2) * 0.68 * amp,
        vegArmRZ: -0.3 * amp,
        vegLegLX: -Math.sin(t * freq * 2) * 0.48 * amp,
        vegLegLZ: -Math.sin(t * freq) * 0.2 * amp,
        vegLegRX: Math.sin(t * freq * 2) * 0.48 * amp,
        vegLegRZ: -Math.sin(t * freq) * 0.2 * amp
      };
    case 'PAGODE':
      return {
        robArmLX: Math.sin(t * freq) * 0.28 * amp,
        robArmLZ: 0.16 * amp,
        robArmRX: Math.cos(t * freq) * 0.28 * amp,
        robArmRZ: -0.16 * amp,
        robLegLX: Math.sin(t * freq) * 0.25 * amp,
        robLegLZ: 0.1 * amp,
        robLegRX: -Math.sin(t * freq) * 0.25 * amp,
        robLegRZ: -0.1 * amp,
        vegArmLX: Math.sin(t * freq * 1.5) * 0.45 * amp,
        vegArmLZ: 0.18 * amp,
        vegArmRX: Math.cos(t * freq * 1.5) * 0.45 * amp,
        vegArmRZ: -0.18 * amp,
        vegLegLX: -Math.sin(t * freq) * 0.24 * amp,
        vegLegLZ: 0.1 * amp,
        vegLegRX: Math.sin(t * freq) * 0.24 * amp,
        vegLegRZ: -0.1 * amp
      };
    case 'SERTANEJO':
      return {
        robArmLX: beat * 0.36 * amp,
        robArmLZ: 0.2 * amp,
        robArmRX: -beat * 0.36 * amp,
        robArmRZ: -0.2 * amp,
        robLegLX: beat * 0.34 * amp,
        robLegLZ: 0.12 * amp,
        robLegRX: -beat * 0.34 * amp,
        robLegRZ: -0.12 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.58 * amp,
        vegArmLZ: 0.22 * amp,
        vegArmRX: Math.cos(t * freq * 2) * 0.58 * amp,
        vegArmRZ: -0.22 * amp,
        vegLegLX: -beat * 0.34 * amp,
        vegLegLZ: 0.12 * amp,
        vegLegRX: beat * 0.34 * amp,
        vegLegRZ: -0.12 * amp
      };
    case 'AXE':
      return {
        robArmLX: Math.sin(t * freq * 2) * 0.65 * amp,
        robArmLZ: 0.42 * amp,
        robArmRX: Math.cos(t * freq * 2) * 0.65 * amp,
        robArmRZ: -0.42 * amp,
        robLegLX: Math.sin(t * freq * 2) * 0.6 * amp,
        robLegLZ: 0.26 * amp,
        robLegRX: -Math.sin(t * freq * 2) * 0.6 * amp,
        robLegRZ: -0.26 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.85 * amp,
        vegArmLZ: 0.38 * amp,
        vegArmRX: Math.cos(t * freq * 2) * 0.85 * amp,
        vegArmRZ: -0.38 * amp,
        vegLegLX: -Math.sin(t * freq * 2) * 0.56 * amp,
        vegLegLZ: 0.24 * amp,
        vegLegRX: Math.sin(t * freq * 2) * 0.56 * amp,
        vegLegRZ: -0.24 * amp
      };
    case 'BREGA_FUNK':
      return {
        robArmLX: beatRapido * 0.58 * amp,
        robArmLZ: Math.sin(t * freq * 2) * 0.35 * amp,
        robArmRX: -beatRapido * 0.58 * amp,
        robArmRZ: -Math.sin(t * freq * 2) * 0.35 * amp,
        robLegLX: beatRapido * 0.54 * amp,
        robLegLZ: 0.24 * amp,
        robLegRX: -beatRapido * 0.54 * amp,
        robLegRZ: -0.24 * amp,
        vegArmLX: Math.cos(t * freq * 2) * 0.78 * amp,
        vegArmLZ: 0.28 * amp,
        vegArmRX: Math.sin(t * freq * 2) * 0.78 * amp,
        vegArmRZ: -0.28 * amp,
        vegLegLX: -beatRapido * 0.5 * amp,
        vegLegLZ: 0.22 * amp,
        vegLegRX: beatRapido * 0.5 * amp,
        vegLegRZ: -0.22 * amp
      };
    case 'TRAP':
      return {
        robArmLX: beat * 0.32 * amp,
        robArmLZ: 0.14 * amp,
        robArmRX: -beat * 0.32 * amp,
        robArmRZ: -0.14 * amp,
        robLegLX: beat * 0.38 * amp,
        robLegLZ: 0.16 * amp,
        robLegRX: -beat * 0.38 * amp,
        robLegRZ: -0.16 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.62 * amp,
        vegArmLZ: 0.12 * amp,
        vegArmRX: Math.cos(t * freq * 2) * 0.62 * amp,
        vegArmRZ: -0.12 * amp,
        vegLegLX: -beat * 0.36 * amp,
        vegLegLZ: 0.15 * amp,
        vegLegRX: beat * 0.36 * amp,
        vegLegRZ: -0.15 * amp
      };
    case 'POP':
      return {
        robArmLX: Math.sin(t * freq * 2) * 0.5 * amp,
        robArmLZ: 0.32 * amp,
        robArmRX: -Math.sin(t * freq * 2) * 0.5 * amp,
        robArmRZ: -0.32 * amp,
        robLegLX: beat * 0.46 * amp,
        robLegLZ: 0.18 * amp,
        robLegRX: -beat * 0.46 * amp,
        robLegRZ: -0.18 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.72 * amp,
        vegArmLZ: 0.3 * amp,
        vegArmRX: Math.cos(t * freq * 2) * 0.72 * amp,
        vegArmRZ: -0.3 * amp,
        vegLegLX: -beat * 0.44 * amp,
        vegLegLZ: 0.18 * amp,
        vegLegRX: beat * 0.44 * amp,
        vegLegRZ: -0.18 * amp
      };
    case 'ROCK':
      return {
        robArmLX: beatRapido * 0.62 * amp,
        robArmLZ: 0.25 * amp,
        robArmRX: beatRapido * 0.48 * amp,
        robArmRZ: -0.25 * amp,
        robLegLX: beatRapido * 0.58 * amp,
        robLegLZ: 0.28 * amp,
        robLegRX: -beatRapido * 0.58 * amp,
        robLegRZ: -0.28 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.88 * amp,
        vegArmLZ: 0.2 * amp,
        vegArmRX: Math.cos(t * freq * 2) * 0.88 * amp,
        vegArmRZ: -0.2 * amp,
        vegLegLX: -beatRapido * 0.54 * amp,
        vegLegLZ: 0.24 * amp,
        vegLegRX: beatRapido * 0.54 * amp,
        vegLegRZ: -0.24 * amp
      };
    case 'REGGAETON':
    default:
      return {
        robArmLX: Math.sin(t * freq * 2) * 0.42 * amp,
        robArmLZ: 0.26 * amp,
        robArmRX: Math.cos(t * freq * 2) * 0.42 * amp,
        robArmRZ: -0.26 * amp,
        robLegLX: beat * 0.44 * amp,
        robLegLZ: 0.22 * amp,
        robLegRX: -beat * 0.44 * amp,
        robLegRZ: -0.22 * amp,
        vegArmLX: Math.sin(t * freq * 2) * 0.66 * amp,
        vegArmLZ: 0.24 * amp,
        vegArmRX: Math.cos(t * freq * 2) * 0.66 * amp,
        vegArmRZ: -0.24 * amp,
        vegLegLX: -beat * 0.42 * amp,
        vegLegLZ: 0.2 * amp,
        vegLegRX: beat * 0.42 * amp,
        vegLegRZ: -0.2 * amp
      };
  }
}

function atualizarCameraDinamicaRitmo(camera, ritmoId, t, freq, amp, beat, beatRapido) {
  const baseX = 0;
  const baseY = 1.15;
  const baseZ = 7.6;

  if (!amp) {
    camera.position.x += (baseX - camera.position.x) * 0.08;
    camera.position.y += (baseY + Math.sin(t * 1.2) * 0.06 - camera.position.y) * 0.08;
    camera.position.z += (baseZ - camera.position.z) * 0.08;
    camera.lookAt(0, 0.2, 0);
    return;
  }

  let alvoX = baseX;
  let alvoY = baseY;
  let alvoZ = baseZ;

  switch (ritmoId) {
    case 'FUNK':
      alvoX = Math.sin(t * freq * 0.5) * 0.85 * Math.min(1.4, amp);
      alvoY = baseY + Math.abs(beat) * 0.22 * Math.min(1.3, amp);
      alvoZ = baseZ - Math.abs(beat) * 0.65 * Math.min(1.3, amp);
      break;
    case 'FORRO':
      alvoX = Math.sin(t * freq) * 1.15 * Math.min(1.3, amp);
      alvoY = baseY + Math.cos(t * freq) * 0.14;
      alvoZ = baseZ + 0.25;
      break;
    case 'PISEIRO':
      alvoX = Math.sin(t * freq * 1.5) * 0.75 * Math.min(1.4, amp);
      alvoY = baseY + Math.abs(beatRapido) * 0.26 * Math.min(1.3, amp);
      alvoZ = baseZ - Math.abs(beatRapido) * 0.55;
      break;
    case 'SAMBA':
      alvoX = Math.sin(t * freq) * 1.35 * Math.min(1.3, amp);
      alvoY = baseY + Math.sin(t * freq * 2) * 0.18;
      alvoZ = baseZ - 0.35 + Math.cos(t * freq) * 0.4;
      break;
    case 'PAGODE':
      alvoX = Math.sin(t * freq * 0.6) * 0.65;
      alvoY = baseY + Math.sin(t * freq * 0.6) * 0.1;
      alvoZ = baseZ + 0.35;
      break;
    case 'SERTANEJO':
      alvoX = Math.sin(t * freq * 0.5) * 0.95;
      alvoY = baseY + 0.25 + Math.sin(t * freq) * 0.12;
      alvoZ = baseZ + 0.4;
      break;
    case 'AXE':
      alvoX = Math.sin(t * freq) * 1.55 * Math.min(1.4, amp);
      alvoY = baseY + Math.abs(beatRapido) * 0.32 * Math.min(1.4, amp);
      alvoZ = baseZ - 0.5 + Math.sin(t * freq * 0.5) * 0.5;
      break;
    case 'BREGA_FUNK':
      alvoX = Math.cos(t * freq) * 0.9 * Math.min(1.4, amp);
      alvoY = baseY + beatRapido * 0.2 * Math.min(1.3, amp);
      alvoZ = baseZ - Math.abs(beat) * 0.7;
      break;
    case 'TRAP':
      alvoX = Math.sin(t * freq * 0.5) * 0.55;
      alvoY = baseY - 0.18 + Math.abs(beat) * 0.16;
      alvoZ = baseZ - 0.85;
      break;
    case 'POP':
      alvoX = Math.sin(t * freq * 0.75) * 1.2 * Math.min(1.3, amp);
      alvoY = baseY + Math.sin(t * freq * 1.5) * 0.22;
      alvoZ = baseZ - 0.4;
      break;
    case 'ROCK':
      alvoX = Math.sin(t * freq * 2) * 0.65 * Math.min(1.4, amp);
      alvoY = baseY + beatRapido * 0.28 * Math.min(1.4, amp);
      alvoZ = baseZ - 0.95 - Math.abs(beatRapido) * 0.4;
      break;
    case 'REGGAETON':
    default:
      alvoX = Math.sin(t * freq * 0.75) * 0.85;
      alvoY = baseY + Math.sin(t * freq * 1.5) * 0.15;
      alvoZ = baseZ - 0.45;
      break;
  }

  camera.position.x += (alvoX - camera.position.x) * 0.08;
  camera.position.y += (alvoY - camera.position.y) * 0.08;
  camera.position.z += (alvoZ - camera.position.z) * 0.08;
  camera.lookAt(alvoX * 0.22, 0.22, 0);
}

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
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xca8a04,
    emissiveIntensity: 0.45,
    metalness: 0.95,
    roughness: 0.18
  });
  const tattooMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.35,
    roughness: 0.5
  });
  const cigarPaperMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.7
  });
  const emberMat = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff2a00,
    emissiveIntensity: 2.6
  });
  const drinkGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.72,
    roughness: 0.1
  });
  const liquidGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.5
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

  // Cigarro 3D do Robotoc no modo Funk + fumaça 3D animada
  const cigarGroup = new THREE.Group();
  cigarGroup.position.set(0.14, -0.22, 0.46);
  cigarGroup.rotation.z = 0.25;
  cigarGroup.rotation.x = 0.15;
  const cigarBody = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12), cigarPaperMat);
  cigarBody.rotation.z = Math.PI / 2;
  cigarBody.position.x = 0.09;
  const cigarTip = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), emberMat);
  cigarTip.position.x = 0.2;
  cigarGroup.add(cigarBody, cigarTip);

  const smokeGroup = new THREE.Group();
  smokeGroup.position.set(0.2, 0.02, 0);
  const smokeParticles = [];
  for (let i = 0; i < 8; i++) {
    const pMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.45,
      roughness: 1,
      depthWrite: false
    });
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.035 + (i % 3) * 0.012, 12, 12), pMat);
    puff.userData = { phase: i / 8, driftX: (i % 2 === 0 ? 1 : -1) * 0.04, driftZ: ((i % 3) - 1) * 0.035 };
    smokeGroup.add(puff);
    smokeParticles.push(puff);
  }
  cigarGroup.add(smokeGroup);

  cigarGroup.visible = false;
  headGroup.add(cigarGroup);

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

  // Colar de ouro 3D do Robotoc no modo Funk
  const goldChainGroup = new THREE.Group();
  goldChainGroup.position.set(0, 0.34, 0.02);
  const chainRing = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.022, 12, 32), goldMat);
  chainRing.rotation.x = Math.PI / 2.3;
  const pendant = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), goldMat);
  pendant.position.set(0, -0.22, 0.24);
  goldChainGroup.add(chainRing, pendant);
  goldChainGroup.visible = false;
  torsoGroup.add(goldChainGroup);

  // Tatuagem 3D no braço/torso do Robotoc no modo Funk
  const tattooGroup = new THREE.Group();
  tattooGroup.position.set(-0.36, 0.22, 0.14);
  const tatBand1 = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.012, 8, 20), tattooMat);
  tatBand1.rotation.y = Math.PI / 2;
  const tatBand2 = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.01, 8, 20), tattooMat);
  tatBand2.rotation.y = Math.PI / 2;
  tatBand2.position.y = -0.07;
  tattooGroup.add(tatBand1, tatBand2);
  tattooGroup.visible = false;
  torsoGroup.add(tattooGroup);

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

  // Copo de bebida 3D na mão do Robotoc no modo Funk
  const drinkCupGroup = new THREE.Group();
  drinkCupGroup.position.set(0.04, -0.46, 0.36);
  const cupBody = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.048, 0.15, 18), drinkGlassMat);
  const cupLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.042, 0.1, 16), liquidGoldMat);
  cupLiquid.position.y = -0.01;
  drinkCupGroup.add(cupBody, cupLiquid);
  drinkCupGroup.visible = false;
  armR.add(drinkCupGroup);

  root.add(armL, armR);

  // Guitarra elétrica 3D
  const guitarGroup = new THREE.Group();
  guitarGroup.position.set(0, 0.02, 0.38);
  guitarGroup.rotation.z = 0.28;
  guitarGroup.rotation.y = -0.18;

  const guitarBodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.75, roughness: 0.2 });
  const guitarBody = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.07), guitarBodyMat);
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

  return {
    root,
    headGroup,
    torsoGroup,
    armL,
    armR,
    legL,
    legR,
    guitarGroup,
    eyeL,
    eyeR,
    visorFrame,
    guitarBodyMat,
    cigarGroup,
    smokeParticles,
    goldChainGroup,
    tattooGroup,
    drinkCupGroup
  };
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
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xca8a04,
    emissiveIntensity: 0.5,
    metalness: 0.95,
    roughness: 0.18
  });
  const drinkGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf472b6,
    transparent: true,
    opacity: 0.72,
    roughness: 0.1
  });
  const cocktailMat = new THREE.MeshStandardMaterial({
    color: 0xff2a85,
    emissive: 0xec4899,
    emissiveIntensity: 0.55
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

  // Colar de ouro patricinha 3D da Vegatocnyx no modo Funk
  const goldNecklaceGroup = new THREE.Group();
  goldNecklaceGroup.position.set(0, 0.33, 0.02);
  const necklaceRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.018, 12, 32), goldMat);
  necklaceRing.rotation.x = Math.PI / 2.3;
  const heartPendant = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), goldMat);
  heartPendant.position.set(0, -0.2, 0.21);
  goldNecklaceGroup.add(necklaceRing, heartPendant);
  goldNecklaceGroup.visible = false;
  torsoGroup.add(goldNecklaceGroup);

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

  // Bebida patricinha 3D na mão da Vegatocnyx no modo Funk
  const drinkGroup = new THREE.Group();
  drinkGroup.position.set(-0.04, -0.44, 0.36);
  const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.045, 0.14, 18), drinkGlassMat);
  const drinkLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.04, 0.095, 16), cocktailMat);
  drinkLiquid.position.y = -0.01;
  drinkGroup.add(glassMesh, drinkLiquid);
  drinkGroup.visible = false;
  armL.add(drinkGroup);

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

  const kickMat = new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.6, roughness: 0.25 });
  const kickDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.34, 28), kickMat);
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
    eyeR,
    ponytail,
    pinkArmor,
    kickMat,
    goldNecklaceGroup,
    drinkGroup
  };
}

function descartarGrupo3D(group) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
}

function criarCenarioRitmo3D(scene, ritmo) {
  const group = new THREE.Group();
  const corA = ritmo.luzA;
  const corB = ritmo.luzB;

  const propMatA = new THREE.MeshStandardMaterial({
    color: corA,
    emissive: corA,
    emissiveIntensity: 0.9,
    metalness: 0.7,
    roughness: 0.25
  });
  const propMatB = new THREE.MeshStandardMaterial({
    color: corB,
    emissive: corB,
    emissiveIntensity: 0.9,
    metalness: 0.7,
    roughness: 0.25
  });
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25
  });

  // Pilares laterais e elementos 3D específicos por ritmo
  [-3.8, 3.8].forEach((xPos, idx) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 20), pillarMat);
    col.position.set(xPos, 0.7, -2.2);
    group.add(col);

    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), idx === 0 ? propMatA : propMatB);
    orb.position.set(xPos, 2.95, -2.2);
    group.add(orb);
  });

  const arco = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.04, 12, 48, Math.PI), propMatA);
  arco.position.set(0, -1.1, -2.2);
  group.add(arco);

  if (ritmo.id === 'FUNK' || ritmo.id === 'PISEIRO' || ritmo.id === 'BREGA_FUNK') {
    // Torres de paredão / caixas acústicas 3D
    [-2.7, 2.7].forEach((xPos) => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.85, 0.75), pillarMat);
      box.position.set(xPos, -0.25, -1.6);
      const speaker = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24), propMatB);
      speaker.rotation.x = Math.PI / 2;
      speaker.position.set(xPos, 0.15, -1.2);
      group.add(box, speaker);
    });
  } else if (ritmo.id === 'FORRO' || ritmo.id === 'SERTANEJO') {
    // Estrelas / luzes de festa junina / arena
    for (let i = -2; i <= 2; i++) {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), i % 2 === 0 ? propMatA : propMatB);
      lamp.position.set(i * 1.4, 2.75, -1.5);
      group.add(lamp);
    }
  } else if (ritmo.id === 'SAMBA' || ritmo.id === 'PAGODE' || ritmo.id === 'AXE') {
    // Esferas festivas / percussão visual ao fundo
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 0), i > 0 ? propMatA : propMatB);
      sphere.position.set(i * 1.15, 1.9 + Math.abs(i) * 0.15, -2.4);
      group.add(sphere);
    }
  } else if (ritmo.id === 'TRAP' || ritmo.id === 'POP' || ritmo.id === 'REGGAETON') {
    // Colunas de luz geométricas / anéis de palco
    const ringBg = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.035, 12, 48), propMatB);
    ringBg.position.set(0, 1.1, -3.0);
    group.add(ringBg);
  } else if (ritmo.id === 'ROCK') {
    // Amplificadores empilhados e holofotes de arena
    [-2.8, 2.8].forEach((xPos) => {
      const amp = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.65), pillarMat);
      amp.position.set(xPos, -0.55, -1.6);
      const grill = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.95, 0.05), propMatA);
      grill.position.set(xPos, -0.55, -1.26);
      group.add(amp, grill);
    });
  }

  // Caixas de som extra para o modo Karaokê
  const karaokeSpeakers = new THREE.Group();
  [-3.25, 3.25].forEach((xPos) => {
    const spkBox = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.15, 0.55), pillarMat);
    spkBox.position.set(xPos, -0.55, -0.9);
    const woofer = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20), propMatA);
    woofer.rotation.x = Math.PI / 2;
    woofer.position.set(xPos, -0.45, -0.6);
    karaokeSpeakers.add(spkBox, woofer);
  });
  karaokeSpeakers.visible = false;
  group.add(karaokeSpeakers);

  // Cenário 3D de fazenda / vaquejada para o modo Forró
  const forroFarmGroup = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7, metalness: 0.15 });
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.75 });
  for (let i = -3; i <= 3; i++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 12), woodMat);
    post.position.set(i * 1.15, -0.65, -2.5);
    forroFarmGroup.add(post);
  }
  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.1, 0.08), fenceMat);
  rail1.position.set(0, -0.35, -2.5);
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.1, 0.08), fenceMat);
  rail2.position.set(0, -0.75, -2.5);
  forroFarmGroup.add(rail1, rail2);
  forroFarmGroup.visible = false;
  group.add(forroFarmGroup);

  // Cenário 3D Internacional - Modo Michael Jackson (World Arena & Spotlight Truss)
  const michaelWorldGroup = new THREE.Group();
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
  const goldSpotMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.4,
    metalness: 0.85,
    roughness: 0.2
  });
  const iceBeamMat = new THREE.MeshStandardMaterial({
    color: 0xe0f2fe,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.2,
    metalness: 0.7,
    roughness: 0.2
  });

  const topTruss = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.14, 0.14), trussMat);
  topTruss.position.set(0, 3.1, -2.4);
  michaelWorldGroup.add(topTruss);

  for (let i = -3; i <= 3; i++) {
    const spotHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.28, 16), trussMat);
    spotHousing.position.set(i * 1.15, 2.86, -2.4);
    spotHousing.rotation.x = Math.PI / 6;

    const spotLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 14, 14),
      Math.abs(i) % 2 === 0 ? goldSpotMat : iceBeamMat
    );
    spotLens.position.set(i * 1.15, 2.74, -2.32);
    michaelWorldGroup.add(spotHousing, spotLens);
  }

  const arenaRing = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.03, 12, 56), goldSpotMat);
  arenaRing.position.set(0, 1.05, -3.2);
  michaelWorldGroup.add(arenaRing);
  michaelWorldGroup.visible = false;
  group.add(michaelWorldGroup);

  // Cenário 3D Internacional - Modo Shakira (Global Stadium & Latin Neon Arcs)
  const shakiraWorldGroup = new THREE.Group();
  const latinPinkMat = new THREE.MeshStandardMaterial({
    color: 0xff2a85,
    emissive: 0xec4899,
    emissiveIntensity: 1.35,
    metalness: 0.75,
    roughness: 0.2
  });
  const latinGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.25,
    metalness: 0.85,
    roughness: 0.2
  });

  const archOuter = new THREE.Mesh(new THREE.TorusGeometry(3.35, 0.045, 14, 64, Math.PI), latinPinkMat);
  archOuter.position.set(0, -1.05, -2.6);
  const archInner = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.035, 14, 64, Math.PI), latinGoldMat);
  archInner.position.set(0, -1.05, -2.85);
  shakiraWorldGroup.add(archOuter, archInner);

  for (let i = -3; i <= 3; i++) {
    const beamTower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.09, 2.8, 12),
      i % 2 === 0 ? latinPinkMat : latinGoldMat
    );
    beamTower.position.set(i * 1.1, 0.35, -3.1);
    shakiraWorldGroup.add(beamTower);
  }
  shakiraWorldGroup.visible = false;
  group.add(shakiraWorldGroup);

  scene.add(group);
  return {
    group,
    karaokeSpeakers,
    forroFarmGroup,
    michaelWorldGroup,
    shakiraWorldGroup
  };
}

export default function DancaRobotocVegatocnyx({ onClose, addLog }) {
  const mountRef = useRef(null);
  const audioElRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const faixasRef = useRef([]);

  const [dancando, setDancando] = useState(true);
  const [bpm, setBpm] = useState(128);
  const [intensidadeDanca, setIntensidadeDanca] = useState(1.2);
  const [modoCoreografia, setModoCoreografia] = useState('FREESTYLE_NEON');
  const [ritmoAtualId, setRitmoAtualId] = useState('FUNK');

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
  const ritmoRef = useRef(RITMOS_12[0]);

  useEffect(() => {
    faixasRef.current = faixas;
  }, [faixas]);

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

  useEffect(() => {
    const encontrado = RITMOS_12.find((r) => r.id === ritmoAtualId) || RITMOS_12[0];
    ritmoRef.current = encontrado;
    setBpm(encontrado.bpm);
  }, [ritmoAtualId]);

  useEffect(() => {
    return () => {
      faixasRef.current.forEach((f) => {
        if (f.tipo === 'mp3' && f.url) {
          URL.revokeObjectURL(f.url);
        }
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const faixaAtiva = faixas.find((f) => f.id === faixaAtivaId) || faixas[0];

  const conectarAnalisadorAudio = (audioElemento) => {
    if (!audioElemento) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audioElemento);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
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
    e.target.value = '';
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
    const height = container.clientHeight || 360;

    const ritmoInicial = ritmoRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(ritmoInicial.bg);
    scene.fog = new THREE.FogExp2(ritmoInicial.fog, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 7.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const spotCyan = new THREE.PointLight(ritmoInicial.luzA, 6, 20);
    spotCyan.position.set(-3.5, 3.5, 3);
    scene.add(spotCyan);

    const spotPink = new THREE.PointLight(ritmoInicial.luzB, 6, 20);
    spotPink.position.set(3.5, 3.5, 3);
    scene.add(spotPink);

    // Palco neon circular
    const stageGeo = new THREE.CylinderGeometry(4.4, 4.7, 0.25, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: ritmoInicial.palcoCor,
      metalness: 0.85,
      roughness: 0.2
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.y = -1.25;
    scene.add(stageMesh);

    const stageRingGeo = new THREE.TorusGeometry(4.45, 0.045, 16, 64);
    const stageRingMat = new THREE.MeshBasicMaterial({ color: ritmoInicial.anelCor });
    const stageRing = new THREE.Mesh(stageRingGeo, stageRingMat);
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = -1.12;
    scene.add(stageRing);

    let cenarioObj = criarCenarioRitmo3D(scene, ritmoInicial);
    let ultimoRitmoAplicado = ritmoInicial.id;

    const robotoc = criarRobotocGuitarrista3D();
    robotoc.root.position.set(-1.65, -0.05, 0.4);
    robotoc.root.scale.set(1.05, 1.05, 1.05);
    scene.add(robotoc.root);

    const vegatocnyx = criarVegatocnyxBaterista3D();
    vegatocnyx.root.position.set(1.75, -0.05, 0.2);
    vegatocnyx.root.scale.set(1.05, 1.05, 1.05);
    scene.add(vegatocnyx.root);

    const aplicarTemaRitmo3D = (r) => {
      scene.background = new THREE.Color(r.bg);
      scene.fog = new THREE.FogExp2(r.fog, 0.03);
      spotCyan.color.setHex(r.luzA);
      spotPink.color.setHex(r.luzB);
      stageMat.color.setHex(r.palcoCor);
      stageRingMat.color.setHex(r.anelCor);

      robotoc.visorFrame.material.color.setHex(r.robotocCor);
      robotoc.guitarBodyMat.color.setHex(r.robotocCor);
      robotoc.eyeL.material.color.setHex(r.robotocLed);
      robotoc.eyeL.material.emissive.setHex(r.robotocLed);

      vegatocnyx.pinkArmor.color.setHex(r.vegaCor);
      vegatocnyx.kickMat.color.setHex(r.vegaCor);
      vegatocnyx.eyeL.material.color.setHex(r.vegaLed);
      vegatocnyx.eyeL.material.emissive.setHex(r.vegaLed);

      if (cenarioObj?.group) {
        scene.remove(cenarioObj.group);
        descartarGrupo3D(cenarioObj.group);
      }
      cenarioObj = criarCenarioRitmo3D(scene, r);
      ultimoRitmoAplicado = r.id;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const ritmoAtual = ritmoRef.current;
      if (ritmoAtual.id !== ultimoRitmoAplicado) {
        aplicarTemaRitmo3D(ritmoAtual);
      }

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

      aplicarVisualModo3D(robotoc, vegatocnyx, modo, t);

      const isKaraoke = modo === 'KARAOKE_DUO';
      const isFunkMode = modo === 'FUNK_PATRICINHA';
      const isForroMode = modo === 'FORRO_VAQUEJADA';
      const isMichaelMode = modo === 'MICHAEL_JACKSON_3D';
      const isShakiraMode = modo === 'SHAKIRA_3D';

      robotoc.cigarGroup.visible = isFunkMode;
      robotoc.goldChainGroup.visible = isFunkMode;
      robotoc.tattooGroup.visible = isFunkMode;
      robotoc.drinkCupGroup.visible = isFunkMode;

      if (isFunkMode && robotoc.smokeParticles) {
        robotoc.smokeParticles.forEach((puff) => {
          const cycle = (t * 0.65 + puff.userData.phase) % 1;
          puff.position.set(
            puff.userData.driftX + Math.sin(t * 3 + puff.userData.phase * 10) * 0.03 * cycle,
            cycle * 0.45,
            puff.userData.driftZ + Math.cos(t * 2.5 + puff.userData.phase * 8) * 0.03 * cycle
          );
          const s = 0.5 + cycle * 1.9;
          puff.scale.set(s, s, s);
          puff.material.opacity = (1 - cycle) * 0.45;
        });
      }

      vegatocnyx.goldNecklaceGroup.visible = isFunkMode;
      vegatocnyx.drinkGroup.visible = isFunkMode;

      if (cenarioObj?.karaokeSpeakers) {
        cenarioObj.karaokeSpeakers.visible = isKaraoke;
        if (isKaraoke) {
          const pulsoCaixa = 1 + Math.abs(Math.sin(t * freq * 2)) * 0.14 * Math.max(0.2, amp);
          cenarioObj.karaokeSpeakers.scale.set(pulsoCaixa, pulsoCaixa, 1);
        } else {
          cenarioObj.karaokeSpeakers.scale.set(1, 1, 1);
        }
      }

      if (cenarioObj?.forroFarmGroup) {
        cenarioObj.forroFarmGroup.visible = isForroMode;
      }

      if (cenarioObj?.michaelWorldGroup) {
        cenarioObj.michaelWorldGroup.visible = isMichaelMode;
        if (isMichaelMode) {
          cenarioObj.michaelWorldGroup.position.y = Math.sin(t * freq * 0.5) * 0.06 * Math.max(0.2, amp);
        } else {
          cenarioObj.michaelWorldGroup.position.y = 0;
        }
      }

      if (cenarioObj?.shakiraWorldGroup) {
        cenarioObj.shakiraWorldGroup.visible = isShakiraMode;
        if (isShakiraMode) {
          cenarioObj.shakiraWorldGroup.rotation.z = Math.sin(t * freq * 0.5) * 0.04 * Math.max(0.2, amp);
        } else {
          cenarioObj.shakiraWorldGroup.rotation.z = 0;
        }
      }

      const beat = Math.sin(t * freq);
      const beatRapido = Math.sin(t * freq * 2);
      const pulo = Math.abs(Math.sin(t * freq * 0.5));
      const mov = calcularMovimentosMembrosRitmo(ritmoAtual.id, t, freq, amp, beat, beatRapido);

      // Dança do ROBOTOC guitarrista adaptada ao ritmo e modo selecionado
      if (dancandoRef.current) {
        let saltoRobotoc = modo === 'SALTO_TOTAL' ? pulo * 0.42 * amp : Math.max(0, beat) * 0.14 * amp;
        let posXRobotoc = -1.65 + Math.sin(t * freq * 0.5) * 0.28 * amp;
        let posZRobotoc = 0.4;
        let rotYRobotoc = Math.sin(t * freq * 0.5) * 0.32 * amp;

        if (isKaraoke) {
          posXRobotoc = -0.95 + Math.sin(t * freq * 0.5) * 0.16 * amp;
          posZRobotoc = 0.75;
          rotYRobotoc = 0.22 + Math.sin(t * freq) * 0.15 * amp;
          saltoRobotoc = Math.abs(beat) * 0.12 * amp;
        } else if (isFunkMode) {
          posXRobotoc = -1.45 + Math.sin(t * freq) * 0.25 * amp;
          saltoRobotoc = Math.abs(beatRapido) * 0.18 * amp;
        } else if (isForroMode) {
          const faseChamado = Math.min(1, (t % 8) / 2.2);
          posXRobotoc = -1.65 + faseChamado * 1.45 + Math.sin(t * freq * 2) * 0.22 * amp;
          posZRobotoc = 0.4 + faseChamado * 0.45;
          rotYRobotoc = 0.25 + Math.sin(t * freq) * 0.26 * amp;
          saltoRobotoc = Math.abs(beatRapido) * 0.16 * amp;
        } else if (isMichaelMode) {
          posXRobotoc = -1.55 + Math.sin(t * freq * 0.75) * 0.45 * amp;
          posZRobotoc = 0.45 + Math.cos(t * freq * 0.5) * 0.2 * amp;
          rotYRobotoc = Math.sin(t * freq * 0.75) * 0.38 * amp;
          saltoRobotoc = Math.abs(beatRapido) * 0.19 * amp;
        } else if (isShakiraMode) {
          posXRobotoc = -1.55 + Math.cos(t * freq) * 0.35 * amp;
          posZRobotoc = 0.5 + Math.sin(t * freq * 2) * 0.15 * amp;
          rotYRobotoc = Math.sin(t * freq * 2) * 0.36 * amp;
          saltoRobotoc = Math.abs(beat) * 0.15 * amp;
        }

        robotoc.root.position.y = -0.05 + saltoRobotoc;
        robotoc.root.position.x = posXRobotoc;
        robotoc.root.position.z = posZRobotoc;
        robotoc.root.rotation.y = rotYRobotoc;

        robotoc.headGroup.rotation.x = isKaraoke ? Math.sin(t * freq * 3) * 0.18 * amp : beatRapido * 0.22 * amp;
        robotoc.headGroup.rotation.z = beat * 0.18 * amp;
        robotoc.torsoGroup.rotation.z = isMichaelMode
          ? Math.sin(t * freq) * 0.24 * amp
          : isShakiraMode
          ? Math.sin(t * freq * 2) * 0.22 * amp
          : -beat * 0.14 * amp;

        if (isKaraoke) {
          robotoc.armL.rotation.x = -0.95 + Math.sin(t * freq * 2) * 0.22 * amp;
          robotoc.armL.rotation.z = 0.35;
          robotoc.armR.rotation.x = -0.75 + Math.cos(t * freq * 2) * 0.22 * amp;
          robotoc.armR.rotation.z = -0.25;
        } else if (isForroMode) {
          robotoc.armL.rotation.x = -0.45 + Math.sin(t * freq * 2) * 0.25 * amp;
          robotoc.armL.rotation.z = 0.45;
          robotoc.armR.rotation.x = -0.75 + Math.cos(t * freq * 2) * 0.3 * amp;
          robotoc.armR.rotation.z = -0.45;
        } else if (isMichaelMode) {
          robotoc.armL.rotation.x = -0.65 + beatRapido * 0.45 * amp;
          robotoc.armL.rotation.z = 0.42 + Math.abs(beat) * 0.25 * amp;
          robotoc.armR.rotation.x = -0.85 - beatRapido * 0.35 * amp;
          robotoc.armR.rotation.z = -0.35;
        } else if (isShakiraMode) {
          robotoc.armL.rotation.x = -0.5 + Math.sin(t * freq * 2) * 0.55 * amp;
          robotoc.armL.rotation.z = 0.48 * amp;
          robotoc.armR.rotation.x = -0.5 + Math.cos(t * freq * 2) * 0.55 * amp;
          robotoc.armR.rotation.z = -0.48 * amp;
        } else {
          robotoc.armL.rotation.x = mov.robArmLX;
          robotoc.armL.rotation.z = mov.robArmLZ;
          robotoc.armR.rotation.x = isFunkMode ? -0.85 + Math.sin(t * freq) * 0.25 * amp : mov.robArmRX;
          robotoc.armR.rotation.z = mov.robArmRZ;
        }

        robotoc.guitarGroup.rotation.z = 0.28 + beat * 0.22 * amp;
        robotoc.guitarGroup.rotation.x = beatRapido * 0.18 * amp;

        robotoc.legL.rotation.x = mov.robLegLX;
        robotoc.legL.rotation.z = mov.robLegLZ;
        robotoc.legR.rotation.x = mov.robLegRX;
        robotoc.legR.rotation.z = mov.robLegRZ;

        stageRing.material.color.setHex(beat > 0 ? ritmoAtual.luzA : ritmoAtual.luzB);
      } else {
        robotoc.root.position.y = -0.05 + Math.sin(t * 1.5) * 0.04;
        robotoc.root.rotation.y = 0;
        robotoc.armL.rotation.z = 0;
        robotoc.armR.rotation.z = 0;
        robotoc.legL.rotation.x = 0;
        robotoc.legL.rotation.z = 0;
        robotoc.legR.rotation.x = 0;
        robotoc.legR.rotation.z = 0;
      }

      // Dança e bateria da VEGATOCNYX adaptada ao ritmo e modo selecionado
      if (dancandoRef.current) {
        let saltoVega = modo === 'BATERIA_TURBO' ? Math.abs(beatRapido) * 0.22 * amp : Math.max(0, -beat) * 0.15 * amp;
        let posXVega = 1.75 + Math.cos(t * freq * 0.5) * 0.22 * amp;
        let posZVega = 0.2;
        let rotYVega = -Math.sin(t * freq * 0.5) * 0.28 * amp;
        let rotXTorsoVega = 0;
        let rotZTorsoVega = beat * 0.16 * amp;

        if (isKaraoke) {
          posXVega = 0.95 + Math.cos(t * freq * 0.5) * 0.16 * amp;
          posZVega = 0.75;
          rotYVega = -0.22 + Math.cos(t * freq) * 0.15 * amp;
          saltoVega = Math.abs(beatRapido) * 0.14 * amp;
        } else if (isFunkMode) {
          // Rebolando até o chão no estilo patricinha
          const agachamentoFunk = Math.abs(Math.sin(t * freq)) * 0.52 * Math.min(1.5, amp);
          saltoVega = -agachamentoFunk;
          posXVega = 1.45 + Math.cos(t * freq) * 0.26 * amp;
          rotXTorsoVega = agachamentoFunk * 0.85;
          rotZTorsoVega = Math.sin(t * freq * 2) * 0.28 * amp;
          rotYVega = Math.sin(t * freq * 2) * 0.45 * amp;
        } else if (isForroMode) {
          const faseChamado = Math.min(1, (t % 8) / 2.2);
          posXVega = 1.75 - faseChamado * 1.15 + Math.cos(t * freq * 2) * 0.22 * amp;
          posZVega = 0.2 + faseChamado * 0.65;
          rotYVega = -0.25 + Math.cos(t * freq) * 0.26 * amp;
          saltoVega = Math.abs(beatRapido) * 0.16 * amp;
        } else if (isMichaelMode) {
          posXVega = 1.6 + Math.cos(t * freq * 0.75) * 0.42 * amp;
          posZVega = 0.35 + Math.sin(t * freq * 0.5) * 0.2 * amp;
          rotYVega = -Math.sin(t * freq * 0.75) * 0.35 * amp;
          rotZTorsoVega = Math.sin(t * freq) * 0.22 * amp;
          saltoVega = Math.abs(beatRapido) * 0.18 * amp;
        } else if (isShakiraMode) {
          posXVega = 1.6 + Math.sin(t * freq) * 0.34 * amp;
          posZVega = 0.45 + Math.cos(t * freq * 2) * 0.18 * amp;
          rotYVega = Math.sin(t * freq * 2) * 0.42 * amp;
          rotZTorsoVega = Math.sin(t * freq * 2) * 0.3 * amp;
          saltoVega = Math.abs(beatRapido) * 0.14 * amp;
        }

        vegatocnyx.root.position.y = -0.05 + saltoVega;
        vegatocnyx.root.position.x = posXVega;
        vegatocnyx.root.position.z = posZVega;
        vegatocnyx.root.rotation.y = rotYVega;

        vegatocnyx.headGroup.rotation.z = isFunkMode ? Math.sin(t * freq * 2) * 0.28 * amp : -beat * 0.24 * amp;
        vegatocnyx.headGroup.rotation.x = isKaraoke ? Math.cos(t * freq * 3) * 0.18 * amp : beatRapido * 0.2 * amp;
        vegatocnyx.torsoGroup.rotation.x = rotXTorsoVega;
        vegatocnyx.torsoGroup.rotation.z = rotZTorsoVega;
        vegatocnyx.ponytail.rotation.x = -Math.PI / 3.2 + Math.sin(t * freq) * 0.25 * amp;

        if (isKaraoke) {
          vegatocnyx.armL.rotation.x = -0.9 + Math.cos(t * freq * 2) * 0.22 * amp;
          vegatocnyx.armL.rotation.z = -0.35;
          vegatocnyx.armR.rotation.x = -0.7 + Math.sin(t * freq * 2) * 0.22 * amp;
          vegatocnyx.armR.rotation.z = 0.25;
        } else if (isFunkMode) {
          vegatocnyx.armL.rotation.x = -0.85 + Math.sin(t * freq) * 0.2 * amp;
          vegatocnyx.armL.rotation.z = -0.35;
          vegatocnyx.armR.rotation.x = Math.sin(t * freq * 2) * 0.55 * amp;
          vegatocnyx.armR.rotation.z = Math.abs(beatRapido) * 0.45 * amp;
        } else if (isForroMode) {
          vegatocnyx.armL.rotation.x = -0.75 + Math.sin(t * freq * 2) * 0.3 * amp;
          vegatocnyx.armL.rotation.z = 0.42;
          vegatocnyx.armR.rotation.x = -0.45 + Math.cos(t * freq * 2) * 0.25 * amp;
          vegatocnyx.armR.rotation.z = -0.42;
        } else if (isMichaelMode) {
          vegatocnyx.armL.rotation.x = -0.7 + Math.sin(t * freq * 2) * 0.55 * amp;
          vegatocnyx.armL.rotation.z = -0.35;
          vegatocnyx.armR.rotation.x = -0.7 - Math.sin(t * freq * 2) * 0.55 * amp;
          vegatocnyx.armR.rotation.z = 0.35;
        } else if (isShakiraMode) {
          vegatocnyx.armL.rotation.x = -0.45 + Math.cos(t * freq * 2) * 0.62 * amp;
          vegatocnyx.armL.rotation.z = -0.45 * amp;
          vegatocnyx.armR.rotation.x = -0.45 + Math.sin(t * freq * 2) * 0.62 * amp;
          vegatocnyx.armR.rotation.z = 0.45 * amp;
        } else {
          // Baquetas e braços batendo na bateria conforme o ritmo
          vegatocnyx.armL.rotation.x = mov.vegArmLX;
          vegatocnyx.armL.rotation.z = mov.vegArmLZ;
          vegatocnyx.armR.rotation.x = mov.vegArmRX;
          vegatocnyx.armR.rotation.z = mov.vegArmRZ;
        }

        vegatocnyx.legL.rotation.x = isFunkMode ? -0.45 * Math.abs(beat) * amp : mov.vegLegLX;
        vegatocnyx.legL.rotation.z = mov.vegLegLZ;
        vegatocnyx.legR.rotation.x = isFunkMode ? -0.45 * Math.abs(beat) * amp : mov.vegLegRX;
        vegatocnyx.legR.rotation.z = mov.vegLegRZ;
      } else {
        vegatocnyx.root.position.y = -0.05 + Math.sin(t * 1.5) * 0.04;
        vegatocnyx.root.rotation.y = 0;
        vegatocnyx.torsoGroup.rotation.x = 0;
        vegatocnyx.armL.rotation.z = 0;
        vegatocnyx.armR.rotation.z = 0;
        vegatocnyx.legL.rotation.x = 0;
        vegatocnyx.legL.rotation.z = 0;
        vegatocnyx.legR.rotation.x = 0;
        vegatocnyx.legR.rotation.z = 0;
      }

      atualizarCameraDinamicaRitmo(camera, ritmoAtual.id, t, freq, amp, beat, beatRapido);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (cenarioObj?.group) {
        scene.remove(cenarioObj.group);
        descartarGrupo3D(cenarioObj.group);
      }
      descartarGrupo3D(robotoc.root);
      descartarGrupo3D(vegatocnyx.root);
      stageGeo.dispose();
      stageMat.dispose();
      stageRingGeo.dispose();
      stageRingMat.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
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
                  value={ritmoAtualId}
                  onChange={(e) => setRitmoAtualId(e.target.value)}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    border: '1px solid #ff4da6',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '10.5px',
                    fontWeight: 'bold'
                  }}
                >
                  {RITMOS_12.map((r) => (
                    <option key={r.id} value={r.id}>
                      🎶 {r.nome} ({r.bpm} BPM)
                    </option>
                  ))}
                </select>

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
                  <option value="KARAOKE_DUO">🎤 Karaokê</option>
                  <option value="FUNK_PATRICINHA">🔥 Funk</option>
                  <option value="FORRO_VAQUEJADA">🤠 Forró</option>
                  <option value="MICHAEL_JACKSON_3D">🕺 Michael Jackson</option>
                  <option value="SHAKIRA_3D">💃 Shakira</option>
                  <option value="ROCK_STAGE">🤘 Rock Arena</option>
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