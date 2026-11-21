import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CIDADES_DATA = [
  {
    id: 'florianopolis',
    nome: 'Florianópolis',
    uf: 'SC',
    apelido: 'Ilha do Silício',
    posicao: [-38, 0, -22],
    corPrimaria: '#00f0ff',
    corBioma: '#16a34a',
    bioma: 'Mata Atlântica Costeira',
    detalheBioma: 'Mais de 40 praias, dunas da Joaquina, Lagoa da Conceição, Lagoa do Peri e trilhas preservadas.',
    tecnologia: 'Sapiens Parque, ACATE, centenas de startups e alta densidade de empresas de TI por habitante.'
  },
  {
    id: 'curitiba',
    nome: 'Curitiba',
    uf: 'PR',
    apelido: 'Capital Smart City',
    posicao: [-38, 0, 22],
    corPrimaria: '#22c55e',
    corBioma: '#15803d',
    bioma: 'Mata Atlântica e Floresta com Araucárias',
    detalheBioma: 'Mais de 30 parques e bosques urbanos integrados, como Parque Barigui e Jardim Botânico.',
    tecnologia: 'Vale do Pinhão, transporte integrado digital, iluminação inteligente, mobilidade elétrica e dados urbanos.'
  },
  {
    id: 'manaus',
    nome: 'Manaus',
    uf: 'AM',
    apelido: 'Hub Industrial da Amazônia',
    posicao: [0, 0, -34],
    corPrimaria: '#10b981',
    corBioma: '#15803d',
    bioma: 'Amazônia',
    detalheBioma: 'Encontro dos rios Negro e Solimões, reservas ecológicas, cachoeiras de Presidente Figueiredo e megabiodiversidade.',
    tecnologia: 'Polo Industrial de Manaus (PIM), eletrônicos, semicondutores, biotecnologia, bioeconomia e automação.'
  },
  {
    id: 'campinas',
    nome: 'Campinas',
    uf: 'SP',
    apelido: 'Vale do Silício Brasileiro',
    posicao: [0, 0, 34],
    corPrimaria: '#38bdf8',
    corBioma: 'Transição Mata Atlântica e Cerrado',
    detalheBioma: 'APA de Campinas em Sousas e Joaquim Egídio, serras, trilhas ecológicas e áreas verdes preservadas.',
    tecnologia: 'Unicamp, CNPEM / Sirius (acelerador de partículas), parques tecnológicos e P&D de multinacionais.'
  },
  {
    id: 'recife',
    nome: 'Recife',
    uf: 'PE',
    apelido: 'Porto Digital & Mangue Tech',
    posicao: [38, 0, -22],
    corPrimaria: '#f59e0b',
    corBioma: 'Ecossistemas Costeiros, Manguezais e Mata Atlântica',
    detalheBioma: 'Rios, pontes, Parque dos Manguezais, praias de águas mornas e reservas de Mata Atlântica.',
    tecnologia: 'Porto Digital no Recife Antigo, software, games, economia criativa e inteligência artificial.'
  },
  {
    id: 'sjc',
    nome: 'São José dos Campos',
    uf: 'SP',
    apelido: 'Capital Aeroespacial e de Defesa',
    posicao: [38, 0, 22],
    corPrimaria: '#a855f7',
    corBioma: 'Mata Atlântica e Serra da Mantiqueira',
    detalheBioma: 'Vale do Paraíba aos pés da Serra da Mantiqueira, São Francisco Xavier, cachoeiras e araucárias.',
    tecnologia: 'ITA, INPE, DCTA e Embraer: desenvolvimento de satélites, aeronaves e monitoramento ambiental.'
  }
];

function criarPainelHolografico3D(cidade) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(6, 15, 34, 0.78)';
  ctx.fillRect(12, 12, 488, 168);

  ctx.strokeStyle = cidade.corPrimaria;
  ctx.lineWidth = 5;
  ctx.strokeRect(12, 12, 488, 168);

  ctx.fillStyle = cidade.corPrimaria;
  ctx.font = 'bold 34px system-ui, sans-serif';
  ctx.fillText(`${cidade.nome.toUpperCase()} (${cidade.uf})`, 32, 68);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(cidade.apelido, 32, 108);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(`Bioma: ${cidade.bioma}`, 32, 145);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 2.7), mat);
  plane.position.set(0, 11.4, 0);
  plane.userData = { cidadeId: cidade.id };

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.25, 4.2, 12, 1, true),
    new THREE.MeshBasicMaterial({
      color: cidade.corPrimaria,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  beam.position.set(0, 8.2, 0);

  const holoGroup = new THREE.Group();
  holoGroup.add(plane, beam);
  return { holoGroup, plane, baseY: 11.4 };
}

function criarCarro3D(corHex) {
  const car = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: corHex,
    metalness: 0.75,
    roughness: 0.25
  });
  const cabinMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.4,
    transparent: true,
    opacity: 0.85
  });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 2.5), bodyMat);
  chassis.position.y = 0.42;
  car.add(chassis);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.36, 1.3), cabinMat);
  cabin.position.set(0, 0.76, -0.1);
  car.add(cabin);

  const dash = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.14, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
  );
  dash.position.set(0, 0.72, 0.36);
  car.add(dash);

  const headLightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

  const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.06), headLightMat);
  hlL.position.set(-0.42, 0.44, 1.27);
  const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.06), headLightMat);
  hlR.position.set(0.42, 0.44, 1.27);

  const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.06), tailLightMat);
  tlL.position.set(-0.42, 0.44, -1.27);
  const tlR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.06), tailLightMat);
  tlR.position.set(0.42, 0.44, -1.27);

  car.add(hlL, hlR, tlL, tlR);

  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const beamGeo = new THREE.ConeGeometry(0.65, 5.5, 16, 1, true);
  beamGeo.rotateX(Math.PI / 2);

  const beamL = new THREE.Mesh(beamGeo, beamMat);
  beamL.position.set(-0.42, 0.42, 3.95);
  const beamR = new THREE.Mesh(beamGeo, beamMat);
  beamR.position.set(0.42, 0.42, 3.95);
  car.add(beamL, beamR);

  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 14);
  wheelGeo.rotateZ(Math.PI / 2);

  const offsets = [
    [-0.68, 0.28, 0.8],
    [0.68, 0.28, 0.8],
    [-0.68, 0.28, -0.8],
    [0.68, 0.28, -0.8]
  ];
  offsets.forEach(([x, y, z]) => {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.position.set(x, y, z);
    car.add(w);
  });

  return { car, beamL, beamR, beamMat };
}

function criarPessoa3D(corRoupa) {
  const person = new THREE.Group();
  const shirtMat = new THREE.MeshStandardMaterial({ color: corRoupa, roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.7 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.58, 10), shirtMat);
  torso.position.y = 0.85;
  person.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), skinMat);
  head.position.y = 1.3;
  person.add(head);

  const legGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.55, 8);
  const legL = new THREE.Mesh(legGeo, pantsMat);
  legL.position.set(-0.08, 0.28, 0);
  const legR = new THREE.Mesh(legGeo, pantsMat);
  legR.position.set(0.08, 0.28, 0);
  person.add(legL, legR);

  return { person, legL, legR };
}

function criarCiclista3D(corQuadra = 0x38bdf8, corCamisa = 0xfacc15) {
  const bikeGroup = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: corQuadra, metalness: 0.7, roughness: 0.25 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: corCamisa, roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.7 });

  const wheelGeo = new THREE.TorusGeometry(0.32, 0.045, 8, 18);
  const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
  frontWheel.position.set(0, 0.32, 0.58);
  frontWheel.rotation.y = Math.PI / 2;

  const rearWheel = new THREE.Mesh(wheelGeo, tireMat);
  rearWheel.position.set(0, 0.32, -0.58);
  rearWheel.rotation.y = Math.PI / 2;

  const frameBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.15), frameMat);
  frameBar.position.set(0, 0.52, 0);
  frameBar.rotation.x = -0.15;

  const riderTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.48, 10), shirtMat);
  riderTorso.position.set(0, 0.92, -0.05);
  riderTorso.rotation.x = 0.25;

  const riderHead = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), skinMat);
  riderHead.position.set(0, 1.26, 0.05);

  const legGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.42, 8);
  const legL = new THREE.Mesh(legGeo, tireMat);
  legL.position.set(-0.09, 0.54, 0.02);
  const legR = new THREE.Mesh(legGeo, tireMat);
  legR.position.set(0.09, 0.54, 0.02);

  bikeGroup.add(frontWheel, rearWheel, frameBar, riderTorso, riderHead, legL, legR);
  return { bikeGroup, legL, legR };
}

function criarDrone3D(corLed = 0x00f0ff) {
  const drone = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 });
  const armMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
  const ledMat = new THREE.MeshBasicMaterial({ color: corLed });

  const hull = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.9), bodyMat);
  drone.add(hull);

  const led = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), ledMat);
  led.position.set(0, -0.05, 0.48);
  drone.add(led);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.08), armMat);
  arm.rotation.y = Math.PI / 4;
  const arm2 = arm.clone();
  arm2.rotation.y = -Math.PI / 4;
  drone.add(arm, arm2);

  const rotors = [];
  const rotorGeo = new THREE.BoxGeometry(0.45, 0.02, 0.06);
  const rotorMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });

  [[-0.6, 0.1, -0.6], [0.6, 0.1, -0.6], [-0.6, 0.1, 0.6], [0.6, 0.1, 0.6]].forEach(([x, y, z]) => {
    const r = new THREE.Mesh(rotorGeo, rotorMat);
    r.position.set(x, y, z);
    drone.add(r);
    rotors.push(r);
  });

  return { drone, rotors };
}

function criarHelicoptero3D(corFus = 0x00f0ff) {
  const heli = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: corFus, metalness: 0.75, roughness: 0.25 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.3, roughness: 0.1 });
  const rotorMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });

  const cabin = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12), bodyMat);
  cabin.scale.set(0.85, 0.75, 1.45);
  heli.add(cabin);

  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.68, 14, 10), glassMat);
  cockpit.position.set(0, 0.08, 0.45);
  cockpit.scale.set(0.82, 0.68, 1.0);
  heli.add(cockpit);

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.26, 2.2, 10), bodyMat);
  tail.rotation.x = Math.PI / 2;
  tail.position.set(0, 0.1, -1.65);
  heli.add(tail);

  const mainRotor = new THREE.Group();
  mainRotor.position.set(0, 0.78, 0);
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 0.16), rotorMat);
  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 3.8), rotorMat);
  mainRotor.add(blade1, blade2);
  heli.add(mainRotor);

  const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.85, 0.1), rotorMat);
  tailRotor.position.set(0.18, 0.15, -2.65);
  heli.add(tailRotor);

  return { heli, mainRotor, tailRotor };
}

function criarFoguete3D() {
  const rocket = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.85, roughness: 0.2 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.7, roughness: 0.25 });
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.9 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 2.8, 16), hullMat);
  body.position.y = 1.4;
  rocket.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.9, 16), accentMat);
  nose.position.y = 3.25;
  rocket.add(nose);

  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.42), accentMat);
    const ang = (i * Math.PI) / 2;
    fin.position.set(Math.sin(ang) * 0.36, 0.35, Math.cos(ang) * 0.36);
    fin.rotation.y = ang;
    rocket.add(fin);
  }

  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.3, 12), flameMat);
  flame.rotation.x = Math.PI;
  flame.position.y = -0.6;
  rocket.add(flame);

  return { rocket, flame };
}

function criarBarco3D(corCasco = 0xf8fafc, corDetalhe = 0x0284c7) {
  const boat = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: corCasco, roughness: 0.35, metalness: 0.4 });
  const trimMat = new THREE.MeshStandardMaterial({ color: corDetalhe, roughness: 0.4, metalness: 0.5 });

  const hull = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.24, 1.55), hullMat);
  hull.position.y = 0.12;
  boat.add(hull);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.55, 4), trimMat);
  bow.rotation.x = Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(0, 0.14, 1.0);
  boat.add(bow);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.22, 0.55), trimMat);
  cabin.position.set(0, 0.32, -0.1);
  boat.add(cabin);

  return boat;
}

function criarArvoreBioma3D(tipoBioma, scale = 1) {
  const tree = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
  const leafMat = new THREE.MeshStandardMaterial({
    color: tipoBioma === 'araucaria' ? 0x14532d : tipoBioma === 'amazonia' ? 0x15803d : 0x16a34a,
    roughness: 0.75
  });

  if (tipoBioma === 'araucaria') {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 3.6, 8), trunkMat);
    trunk.position.y = 1.8;
    tree.add(trunk);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.4, 0.65, 12), leafMat);
    crown.position.y = 3.75;
    tree.add(crown);
  } else if (tipoBioma === 'amazonia') {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 2.4, 8), trunkMat);
    trunk.position.y = 1.2;
    tree.add(trunk);

    const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), leafMat);
    c1.position.set(0, 2.9, 0);
    const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 1), leafMat);
    c2.position.set(0.75, 2.5, 0.4);
    tree.add(c1, c2);
  } else {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 2.2, 8), trunkMat);
    trunk.position.y = 1.1;
    tree.add(trunk);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.4, 10), leafMat);
    canopy.position.y = 2.8;
    tree.add(canopy);
  }

  tree.scale.setScalar(scale);
  return tree;
}

function criarTurbinaEolica3D(scale = 1) {
  const turbine = new THREE.Group();
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.6, roughness: 0.25 });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 });

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.34, 7.5, 12), towerMat);
  tower.position.y = 3.75;
  turbine.add(tower);

  const rotor = new THREE.Group();
  rotor.position.set(0, 7.5, 0.28);

  const hub = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), hubMat);
  rotor.add(hub);

  const bladeGeo = new THREE.BoxGeometry(0.14, 2.8, 0.04);
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(bladeGeo, towerMat);
    const ang = (i * Math.PI * 2) / 3;
    blade.position.set(Math.sin(ang) * 1.35, Math.cos(ang) * 1.35, 0);
    blade.rotation.z = -ang;
    rotor.add(blade);
  }

  turbine.add(rotor);
  turbine.scale.setScalar(scale);
  return { turbine, rotor };
}

function criarFarolCosteiro3D(corLuz = 0x00f0ff) {
  const lighthouse = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.4 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
  const lanternMat = new THREE.MeshBasicMaterial({ color: corLuz });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 6.2, 16), baseMat);
  body.position.y = 3.1;
  lighthouse.add(body);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.72, 1.2, 16), stripeMat);
  band.position.y = 3.4;
  lighthouse.add(band);

  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.9, 16), lanternMat);
  lantern.position.y = 6.6;
  lighthouse.add(lantern);

  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.8, 16), stripeMat);
  cap.position.y = 7.4;
  lighthouse.add(cap);

  const beaconPivot = new THREE.Group();
  beaconPivot.position.set(0, 6.6, 0);

  const rayGeo = new THREE.ConeGeometry(1.4, 9.5, 18, 1, true);
  rayGeo.rotateZ(-Math.PI / 2);
  const rayMat = new THREE.MeshBasicMaterial({
    color: corLuz,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const rayMesh = new THREE.Mesh(rayGeo, rayMat);
  rayMesh.position.set(4.8, 0, 0);
  beaconPivot.add(rayMesh);

  lighthouse.add(beaconPivot);
  return { lighthouse, beaconPivot, rayMat };
}

function criarPonteAlta3D(p1, p2) {
  const bridgeGroup = new THREE.Group();
  const v1 = new THREE.Vector3(...p1);
  const v2 = new THREE.Vector3(...p2);
  const dist = v1.distanceTo(v2);
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);

  const deckMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.65, roughness: 0.3 });
  const railMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.35 });

  const deckHeight = 4.6;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.24, dist * 0.72), deckMat);
  deck.position.set(0, deckHeight, 0);
  bridgeGroup.add(deck);

  [-1.8, 1.8].forEach((rx) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, dist * 0.72), railMat);
    rail.position.set(rx, deckHeight + 0.35, 0);
    bridgeGroup.add(rail);
  });

  [-dist * 0.22, dist * 0.22].forEach((pz) => {
    [-1.6, 1.6].forEach((px) => {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.32, deckHeight + 4.2, 0.32), pillarMat);
      tower.position.set(px, (deckHeight + 4.2) / 2, pz);
      bridgeGroup.add(tower);
    });
    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.28, 0.35), pillarMat);
    crossBeam.position.set(0, deckHeight + 3.4, pz);
    bridgeGroup.add(crossBeam);
  });

  bridgeGroup.position.set(mid.x, 0, mid.z);
  bridgeGroup.lookAt(v2.x, 0, v2.z);
  bridgeGroup.rotateY(Math.PI / 2);

  return bridgeGroup;
}

function criarSemaforoInteligente3D() {
  const group = new THREE.Group();
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5, roughness: 0.4 });

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.6, 10), poleMat);
  pole.position.y = 1.8;
  group.add(pole);

  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.88, 0.28), boxMat);
  housing.position.set(0, 3.3, 0);
  group.add(housing);

  const redMat = new THREE.MeshBasicMaterial({ color: 0x3f1212 });
  const yellowMat = new THREE.MeshBasicMaterial({ color: 0x3f3208 });
  const greenMat = new THREE.MeshBasicMaterial({ color: 0x0b3b1e });

  const redLight = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), redMat);
  redLight.position.set(0, 3.55, 0.15);

  const yellowLight = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), yellowMat);
  yellowLight.position.set(0, 3.3, 0.15);

  const greenLight = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), greenMat);
  greenLight.position.set(0, 3.05, 0.15);

  group.add(redLight, yellowLight, greenLight);
  return { group, redMat, yellowMat, greenMat };
}

export default function CidadesInteligentesFuturistico() {
  const mountRef = useRef(null);
  const radarCanvasRef = useRef(null);

  const [cidadeAtiva, setCidadeAtiva] = useState(CIDADES_DATA[0]);
  const [modoPasseio, setModoPasseio] = useState(true);
  const [modoNoturno, setModoNoturno] = useState(false);
  const [clima, setClima] = useState('limpo');
  const [pilotMode, setPilotMode] = useState('none');
  const [primeiraPessoa, setPrimeiraPessoa] = useState(false);
  const [somAmbienteAtivo, setSomAmbienteAtivo] = useState(false);
  const [mostrarPainelInfo, setMostrarPainelInfo] = useState(true);
  const [modoFoto, setModoFoto] = useState(false);
  const [hudData, setHudData] = useState({ speedKmh: 0, altOrY: 0, label: '' });

  const cameraTargetRef = useRef(new THREE.Vector3(-38, 12, -2));
  const lookAtTargetRef = useRef(new THREE.Vector3(-38, 1.5, -22));
  const modoPasseioRef = useRef(modoPasseio);
  const modoNoturnoRef = useRef(modoNoturno);
  const climaRef = useRef(clima);
  const pilotModeRef = useRef(pilotMode);
  const primeiraPessoaRef = useRef(primeiraPessoa);
  const cidadeAtivaRef = useRef(cidadeAtiva);

  const audioCtxRef = useRef(null);
  const audioGainRef = useRef(null);
  const engineOscRef = useRef(null);
  const engineGainRef = useRef(null);

  useEffect(() => {
    modoPasseioRef.current = modoPasseio;
  }, [modoPasseio]);

  useEffect(() => {
    modoNoturnoRef.current = modoNoturno;
  }, [modoNoturno]);

  useEffect(() => {
    climaRef.current = clima;
  }, [clima]);

  useEffect(() => {
    pilotModeRef.current = pilotMode;
    if (pilotMode !== 'none') {
      modoPasseioRef.current = false;
      setModoPasseio(false);
    } else {
      setPrimeiraPessoa(false);
      primeiraPessoaRef.current = false;
      setHudData({ speedKmh: 0, altOrY: 0, label: '' });
    }
  }, [pilotMode]);

  useEffect(() => {
    primeiraPessoaRef.current = primeiraPessoa;
  }, [primeiraPessoa]);

  useEffect(() => {
    cidadeAtivaRef.current = cidadeAtiva;
    const [cx, , cz] = cidadeAtiva.posicao;
    cameraTargetRef.current.set(cx, 13, cz + 21);
    lookAtTargetRef.current.set(cx, 1.5, cz);
  }, [cidadeAtiva]);

  const garantirAudioContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtxRef.current) {
      const ctx = new AudioContextClass();
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.06;
      masterGain.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 340;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.14;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 180;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      whiteNoise.connect(filter);
      filter.connect(masterGain);

      const cityHum = ctx.createOscillator();
      cityHum.type = 'sine';
      cityHum.frequency.value = 62;
      const humGain = ctx.createGain();
      humGain.gain.value = 0.18;
      cityHum.connect(humGain);
      humGain.connect(masterGain);

      const engineOsc = ctx.createOscillator();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.value = 75;
      const engineFilter = ctx.createBiquadFilter();
      engineFilter.type = 'lowpass';
      engineFilter.frequency.value = 260;
      const engineGain = ctx.createGain();
      engineGain.gain.value = 0.0001;
      engineOsc.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(masterGain);

      whiteNoise.start();
      lfo.start();
      cityHum.start();
      engineOsc.start();

      audioCtxRef.current = ctx;
      audioGainRef.current = masterGain;
      engineOscRef.current = engineOsc;
      engineGainRef.current = engineGain;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  };

  const tocarBuzina = () => {
    const ctx = garantirAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(420, now);
    osc2.frequency.setValueAtTime(525, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  };

  const toggleSomAmbiente = () => {
    if (somAmbienteAtivo) {
      if (audioGainRef.current && audioCtxRef.current) {
        audioGainRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.15);
      }
      setSomAmbienteAtivo(false);
      return;
    }

    const ctx = garantirAudioContext();
    if (!ctx) return;
    audioGainRef.current.gain.setTargetAtTime(0.06, ctx.currentTime, 0.15);
    setSomAmbienteAtivo(true);
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const focarCidade = (cidade) => {
    setPilotMode('none');
    pilotModeRef.current = 'none';
    setPrimeiraPessoa(false);
    primeiraPessoaRef.current = false;
    setCidadeAtiva(cidade);
    const [cx, , cz] = cidade.posicao;
    cameraTargetRef.current.set(cx, 13, cz + 21);
    lookAtTargetRef.current.set(cx, 1.5, cz);
  };

  const handleRadarClick = (e) => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const scale = (size * 0.44) / 85;

    const worldX = (clickX - cx) / scale;
    const worldZ = (clickY - cy) / scale;

    let nearest = CIDADES_DATA[0];
    let bestDist = Infinity;
    CIDADES_DATA.forEach((c) => {
      const [px, , pz] = c.posicao;
      const d = Math.hypot(px - worldX, pz - worldZ);
      if (d < bestDist) {
        bestDist = d;
        nearest = c;
      }
    });
    focarCidade(nearest);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09162e);
    scene.fog = new THREE.FogExp2(0x09162e, 0.004);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 500);
    camera.position.set(-38, 14, -1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xdbeafe, 1.45);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight.position.set(45, 70, 35);
    scene.add(dirLight);

    // Raio / Relâmpago na Tempestade
    const boltGeo = new THREE.BufferGeometry();
    const boltPositions = new Float32Array(7 * 3);
    boltGeo.setAttribute('position', new THREE.BufferAttribute(boltPositions, 3));
    const boltMat = new THREE.LineBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0 });
    const boltLine = new THREE.Line(boltGeo, boltMat);
    scene.add(boltLine);
    let boltTimer = 0;
    let nextBoltIn = 3.5;

    const cyanLight = new THREE.PointLight(0x00f0ff, 20, 90);
    cyanLight.position.set(-38, 12, -22);
    scene.add(cyanLight);

    const greenLight = new THREE.PointLight(0x22c55e, 18, 90);
    greenLight.position.set(0, 12, -34);
    scene.add(greenLight);

    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0b172a, roughness: 0.85, metalness: 0.15 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 150), groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const grid = new THREE.GridHelper(180, 36, 0x0284c7, 0x1e293b);
    grid.position.y = 0.02;
    scene.add(grid);

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.3 });
    const laneMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const rotas = [
      [[-38, 0.04, -22], [0, 0.04, -34]],
      [[0, 0.04, -34], [38, 0.04, -22]],
      [[-38, 0.04, -22], [-38, 0.04, 22]],
      [[-38, 0.04, 22], [0, 0.04, 34]],
      [[0, 0.04, 34], [38, 0.04, 22]],
      [[38, 0.04, -22], [38, 0.04, 22]],
      [[-38, 0.04, -22], [38, 0.04, 22]],
      [[-38, 0.04, 22], [38, 0.04, -22]]
    ];

    rotas.forEach(([p1, p2], idx) => {
      const v1 = new THREE.Vector3(...p1);
      const v2 = new THREE.Vector3(...p2);
      const dist = v1.distanceTo(v2);
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);

      const road = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, dist), roadMat);
      road.position.copy(mid);
      road.lookAt(v2);
      road.rotateY(Math.PI / 2);
      scene.add(road);

      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, dist * 0.96), laneMat);
      strip.position.copy(mid);
      strip.position.y = 0.05;
      strip.lookAt(v2);
      strip.rotateY(Math.PI / 2);
      scene.add(strip);

      if (idx === 0 || idx === 2 || idx === 5) {
        const ponte = criarPonteAlta3D(p1, p2);
        scene.add(ponte);
      }
    });

    const animatedProps = [];
    const turbines = [];
    const lighthouses = [];
    const streetLamps = [];
    const trafficLights = [];
    const drones = [];
    const boats = [];
    const holoPanels = [];
    const clickableHoloMeshes = [];
    let rocketObj = null;

    CIDADES_DATA.forEach((cidade, cIdx) => {
      const [cx, , cz] = cidade.posicao;
      const cityGroup = new THREE.Group();
      cityGroup.position.set(cx, 0, cz);

      const baseCity = new THREE.Mesh(
        new THREE.CylinderGeometry(14.5, 15.2, 0.25, 36),
        new THREE.MeshStandardMaterial({ color: 0x0f1f38, roughness: 0.5, metalness: 0.4 })
      );
      baseCity.position.y = 0.12;
      cityGroup.add(baseCity);

      const rimRing = new THREE.Mesh(
        new THREE.RingGeometry(14.3, 14.6, 48),
        new THREE.MeshBasicMaterial({ color: cidade.corPrimaria, side: THREE.DoubleSide })
      );
      rimRing.rotation.x = -Math.PI / 2;
      rimRing.position.y = 0.26;
      cityGroup.add(rimRing);

      const holo = criarPainelHolografico3D(cidade);
      cityGroup.add(holo.holoGroup);
      holoPanels.push(holo);
      clickableHoloMeshes.push(holo.plane);

      const droneObj = criarDrone3D(cidade.corPrimaria);
      droneObj.drone.position.set(cx, 8.8 + (cIdx % 2) * 1.4, cz);
      scene.add(droneObj.drone);
      drones.push({
        ...droneObj,
        cx,
        cz,
        baseY: 8.8 + (cIdx % 2) * 1.4,
        angle: cIdx * 1.2,
        radius: 6.5 + (cIdx % 3) * 1.8,
        speed: 0.015 + (cIdx % 3) * 0.004
      });

      const tl1 = criarSemaforoInteligente3D();
      tl1.group.position.set(4.8, 0.25, 6.2);
      cityGroup.add(tl1.group);
      trafficLights.push({ ...tl1, phaseOffset: cIdx * 1.4 });

      const tl2 = criarSemaforoInteligente3D();
      tl2.group.position.set(-5.2, 0.25, -6.0);
      tl2.group.rotation.y = Math.PI;
      cityGroup.add(tl2.group);
      trafficLights.push({ ...tl2, phaseOffset: cIdx * 1.4 + 2.2 });

      for (let l = 0; l < 4; l++) {
        const ang = (l * Math.PI) / 2 + 0.4;
        const lampGroup = new THREE.Group();
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
        );
        pole.position.y = 1.6;
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), bulbMat);
        bulb.position.y = 3.25;
        lampGroup.add(pole, bulb);
        lampGroup.position.set(Math.cos(ang) * 6.8, 0.25, Math.sin(ang) * 6.8);
        cityGroup.add(lampGroup);
        streetLamps.push(bulbMat);
      }

      const t1 = criarTurbinaEolica3D(0.95);
      t1.turbine.position.set(-6.5, 0.25, -6.2);
      cityGroup.add(t1.turbine);
      turbines.push({ rotor: t1.rotor, speed: 0.035 + (cidade.nome.length % 4) * 0.006 });

      const t2 = criarTurbinaEolica3D(0.8);
      t2.turbine.position.set(-8.8, 0.25, -4.5);
      cityGroup.add(t2.turbine);
      turbines.push({ rotor: t2.rotor, speed: 0.042 });

      if (cidade.id === 'florianopolis') {
        const lagoon = new THREE.Mesh(
          new THREE.CylinderGeometry(3.6, 3.6, 0.12, 24),
          new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, roughness: 0.15, transmission: 0.5, transparent: true, opacity: 0.85 })
        );
        lagoon.position.set(5.2, 0.26, 4.2);
        cityGroup.add(lagoon);

        const boatFloripa = criarBarco3D(0xf8fafc, 0x00f0ff);
        scene.add(boatFloripa);
        boats.push({
          mesh: boatFloripa,
          mode: 'orbit',
          cx: cx + 5.2,
          cz: cz + 4.2,
          radius: 1.9,
          angle: 0,
          heading: 0,
          manualSpeed: 0,
          speed: 0.018
        });

        const lh = criarFarolCosteiro3D(0x00f0ff);
        lh.lighthouse.position.set(7.6, 0.25, 5.8);
        cityGroup.add(lh.lighthouse);
        lighthouses.push(lh);

        [[-3.5, 4.5, -2.5], [0, 6.2, -3.5], [3.2, 3.8, -1.8]].forEach(([x, h, z]) => {
          const b = new THREE.Mesh(
            new THREE.BoxGeometry(2.1, h, 2.1),
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.65, roughness: 0.25 })
          );
          b.position.set(x, h / 2 + 0.2, z);
          cityGroup.add(b);
        });
      } else if (cidade.id === 'curitiba') {
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshPhysicalMaterial({ color: 0x86efac, transparent: true, opacity: 0.65, roughness: 0.1 })
        );
        dome.position.set(-2.5, 0.25, -2.5);
        cityGroup.add(dome);

        const spire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.65, 5.5, 12),
          new THREE.MeshStandardMaterial({ color: 0x22c55e, metalness: 0.5, roughness: 0.3 })
        );
        spire.position.set(3.4, 2.8, -2.0);
        cityGroup.add(spire);
      } else if (cidade.id === 'manaus') {
        const river = new THREE.Mesh(
          new THREE.BoxGeometry(13.5, 0.1, 2.6),
          new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2, metalness: 0.4 })
        );
        river.position.set(0, 0.25, 5.5);
        cityGroup.add(river);

        const boatManaus = criarBarco3D(0xfef3c7, 0x10b981);
        scene.add(boatManaus);
        boats.push({
          mesh: boatManaus,
          mode: 'lineX',
          minX: cx - 5.2,
          maxX: cx + 5.2,
          z: cz + 5.5,
          t: 0.2,
          dir: 1,
          heading: Math.PI / 2,
          manualSpeed: 0,
          speed: 0.0045
        });

        const lh = criarFarolCosteiro3D(0x10b981);
        lh.lighthouse.position.set(6.4, 0.25, 5.5);
        cityGroup.add(lh.lighthouse);
        lighthouses.push(lh);

        const bioDome = new THREE.Mesh(
          new THREE.SphereGeometry(2.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x065f46, emissiveIntensity: 0.35, roughness: 0.3 })
        );
        bioDome.position.set(-2.5, 0.25, -2.0);
        cityGroup.add(bioDome);

        const factory = new THREE.Mesh(
          new THREE.BoxGeometry(3.8, 3.2, 2.6),
          new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 })
        );
        factory.position.set(3.2, 1.7, -2.2);
        cityGroup.add(factory);
      } else if (cidade.id === 'campinas') {
        const siriusRing = new THREE.Mesh(
          new THREE.TorusGeometry(2.6, 0.38, 16, 36),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5, metalness: 0.85, roughness: 0.2 })
        );
        siriusRing.rotation.x = Math.PI / 2;
        siriusRing.position.set(-1.8, 1.3, -1.8);
        cityGroup.add(siriusRing);
        animatedProps.push({ mesh: siriusRing, rotY: 0.015 });

        const rdTower = new THREE.Mesh(
          new THREE.CylinderGeometry(1.1, 1.4, 5.2, 16),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.6, roughness: 0.25 })
        );
        rdTower.position.set(3.5, 2.7, -2.5);
        cityGroup.add(rdTower);
      } else if (cidade.id === 'recife') {
        const canal = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 0.12, 13.5),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25 })
        );
        canal.position.set(2.5, 0.25, 0);
        cityGroup.add(canal);

        const boatRecife = criarBarco3D(0xf8fafc, 0xf59e0b);
        scene.add(boatRecife);
        boats.push({
          mesh: boatRecife,
          mode: 'lineZ',
          x: cx + 2.5,
          minZ: cz - 5.2,
          maxZ: cz + 5.2,
          t: 0.4,
          dir: 1,
          heading: 0,
          manualSpeed: 0,
          speed: 0.0045
        });

        const lh = criarFarolCosteiro3D(0xf59e0b);
        lh.lighthouse.position.set(6.8, 0.25, 4.8);
        cityGroup.add(lh.lighthouse);
        lighthouses.push(lh);

        [[-3.2, 4.8, -2.5], [-2.8, 3.6, 2.5], [6.2, 5.4, -2.0]].forEach(([x, h, z]) => {
          const tower = new THREE.Mesh(
            new THREE.BoxGeometry(1.9, h, 1.9),
            new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.55, roughness: 0.3 })
          );
          tower.position.set(x, h / 2 + 0.2, z);
          cityGroup.add(tower);
        });
      } else if (cidade.id === 'sjc') {
        const hangar = new THREE.Mesh(
          new THREE.CylinderGeometry(2.6, 2.6, 4.4, 20, 1, false, 0, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8, roughness: 0.25 })
        );
        hangar.rotation.z = Math.PI / 2;
        hangar.rotation.y = Math.PI / 2;
        hangar.position.set(-2.2, 0.25, -2.0);
        cityGroup.add(hangar);

        const createdRocket = criarFoguete3D();
        createdRocket.rocket.position.set(cx + 4.8, 0.5, cz + 3.2);
        scene.add(createdRocket.rocket);
        rocketObj = {
          ...createdRocket,
          baseX: cx + 4.8,
          baseZ: cz + 3.2,
          cycle: 0
        };

        const satGroup = new THREE.Group();
        const satBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.35, 1.4, 12),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9, roughness: 0.15 })
        );
        satBody.rotation.z = Math.PI / 2;
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.05, 2.6),
          new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x4f46e5, emissiveIntensity: 0.5 })
        );
        satGroup.add(satBody, panel);
        satGroup.position.set(2.5, 6.2, -1.5);
        cityGroup.add(satGroup);
        animatedProps.push({ mesh: satGroup, rotY: 0.02, bobY: true, baseY: 6.2 });
      }

      const tipoArvore =
        cidade.id === 'manaus' ? 'amazonia' :
        cidade.id === 'curitiba' || cidade.id === 'sjc' ? 'araucaria' : 'costeira';

      for (let i = 0; i < 14; i++) {
        const ang = (i / 14) * Math.PI * 2;
        const r = 8.2 + (i % 3) * 1.4;
        const tx = Math.cos(ang) * r;
        const tz = Math.sin(ang) * r;
        const tree = criarArvoreBioma3D(tipoArvore, 0.75 + (i % 4) * 0.15);
        tree.position.set(tx, 0.2, tz);
        cityGroup.add(tree);
      }

      scene.add(cityGroup);
    });

    const helicopters = [];
    [0x00f0ff, 0xa855f7].forEach((corH, hIdx) => {
      const hObj = criarHelicoptero3D(corH);
      scene.add(hObj.heli);
      helicopters.push({
        ...hObj,
        angle: hIdx * Math.PI,
        rx: 46,
        rz: 28,
        y: 15.5 + hIdx * 2.5,
        heading: 0,
        forwardSpeed: 0,
        speed: 0.0085 + hIdx * 0.002
      });
    });

    const cars = [];
    const trailParticles = [];
    const carColors = [0x00f0ff, 0x22c55e, 0xf59e0b, 0xa855f7, 0xec4899, 0x38bdf8];
    const particleGeo = new THREE.SphereGeometry(0.18, 8, 8);

    for (let i = 0; i < 12; i++) {
      const rota = rotas[i % rotas.length];
      const vStart = new THREE.Vector3(...rota[0]);
      const vEnd = new THREE.Vector3(...rota[1]);
      const corHex = carColors[i % carColors.length];
      const carObj = criarCarro3D(corHex);
      carObj.car.position.lerpVectors(vStart, vEnd, (i / 12));
      carObj.car.lookAt(vEnd.x, carObj.car.position.y, vEnd.z);
      scene.add(carObj.car);

      cars.push({
        ...carObj,
        corHex,
        start: vStart,
        end: vEnd,
        t: (i / 12),
        speed: 0.0012 + (i % 5) * 0.00025,
        heading: Math.atan2(vEnd.x - vStart.x, vEnd.z - vStart.z),
        manualSpeed: 0,
        trailTimer: 0
      });
    }

    const people = [];
    const cyclists = [];
    const shirtColors = [0x38bdf8, 0xf43f5e, 0xfacc15, 0x34d399, 0xc084fc, 0xfb923c];

    CIDADES_DATA.forEach((cidade, cIdx) => {
      const [cx, , cz] = cidade.posicao;
      for (let p = 0; p < 6; p++) {
        const personObj = criarPessoa3D(shirtColors[(cIdx + p) % shirtColors.length]);
        const baseAngle = (p / 6) * Math.PI * 2;
        const orbitR = 4.2 + (p % 2) * 1.6;
        personObj.person.position.set(
          cx + Math.cos(baseAngle) * orbitR,
          0.25,
          cz + Math.sin(baseAngle) * orbitR
        );
        scene.add(personObj.person);
        people.push({
          ...personObj,
          cx,
          cz,
          angle: baseAngle,
          radius: orbitR,
          speed: 0.006 + p * 0.0012
        });
      }

      for (let b = 0; b < 2; b++) {
        const bikeObj = criarCiclista3D(
          carColors[(cIdx + b) % carColors.length],
          shirtColors[(cIdx + b + 2) % shirtColors.length]
        );
        const startAng = b * Math.PI + cIdx;
        const bikeR = 6.2 + b * 1.2;
        bikeObj.bikeGroup.position.set(
          cx + Math.cos(startAng) * bikeR,
          0.25,
          cz + Math.sin(startAng) * bikeR
        );
        scene.add(bikeObj.bikeGroup);
        cyclists.push({
          ...bikeObj,
          cx,
          cz,
          angle: startAng,
          radius: bikeR,
          speed: 0.014 + b * 0.004
        });
      }
    });

    const rainCount = 900;
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 160;
      rainPositions[i * 3 + 1] = Math.random() * 45 + 2;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.35,
      transparent: true,
      opacity: 0.0
    });
    const rainPoints = new THREE.Points(rainGeo, rainMat);
    scene.add(rainPoints);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let isDragging = false;
    let pointerDownPos = { x: 0, y: 0 };
    let prevPos = { x: 0, y: 0 };
    const keysPressed = {};

    const onMouseDown = (e) => {
      isDragging = true;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      prevPos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPos.x;
      const dy = e.clientY - prevPos.y;
      prevPos = { x: e.clientX, y: e.clientY };

      modoPasseioRef.current = false;
      setModoPasseio(false);

      const offset = camera.position.clone().sub(lookAtTargetRef.current);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.theta -= dx * 0.006;
      spherical.phi = Math.max(0.25, Math.min(Math.PI / 2.08, spherical.phi - dy * 0.006));
      offset.setFromSpherical(spherical);
      camera.position.copy(lookAtTargetRef.current).add(offset);
      camera.lookAt(lookAtTargetRef.current);
    };

    const onMouseUp = (e) => {
      const movedDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      isDragging = false;

      if (movedDist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(clickableHoloMeshes, false);
        if (hits.length > 0) {
          const cid = hits[0].object.userData?.cidadeId;
          const found = CIDADES_DATA.find((c) => c.id === cid);
          if (found) focarCidade(found);
        }
      }
    };

    const onWheel = (e) => {
      modoPasseioRef.current = false;
      setModoPasseio(false);
      const dir = camera.position.clone().sub(lookAtTargetRef.current).normalize();
      const dist = camera.position.distanceTo(lookAtTargetRef.current);
      const nextDist = Math.max(7, Math.min(110, dist + e.deltaY * 0.02));
      camera.position.copy(lookAtTargetRef.current).addScaledVector(dir, nextDist);
    };

    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed[k] = true;
      if (k === 'b' && pilotModeRef.current.startsWith('car-')) {
        tocarBuzina();
      }
      if (k === 'h') {
        setModoFoto((prev) => !prev);
      }
    };
    const onKeyUp = (e) => {
      keysPressed[e.key.toLowerCase()] = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let animId;
    let tick = 0;
    let hudTick = 0;

    const spawnTrail = (pos, colorHex, isNight) => {
      const mat = new THREE.MeshBasicMaterial({
        color: isNight ? colorHex : 0xcbd5e1,
        transparent: true,
        opacity: isNight ? 0.65 : 0.35
      });
      const mesh = new THREE.Mesh(particleGeo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);
      trailParticles.push({ mesh, mat, life: 1.0 });
    };

    const drawRadar = () => {
      const canvas = radarCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const size = canvas.width;
      const cx = size / 2;
      const cy = size / 2;
      const scale = (size * 0.44) / 85;

      ctx.clearRect(0, 0, size, size);

      ctx.fillStyle = 'rgba(6, 15, 34, 0.88)';
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.47, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.24, 0, Math.PI * 2);
      ctx.stroke();

      const sweepAng = tick * 1.4;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAng) * size * 0.46, cy + Math.sin(sweepAng) * size * 0.46);
      ctx.stroke();

      CIDADES_DATA.forEach((c) => {
        const [px, , pz] = c.posicao;
        const rx = cx + px * scale;
        const ry = cy + pz * scale;
        ctx.fillStyle = c.corPrimaria;
        ctx.beginPath();
        ctx.arc(rx, ry, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      cars.forEach((carItem) => {
        const rx = cx + carItem.car.position.x * scale;
        const ry = cy + carItem.car.position.z * scale;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(rx - 1.5, ry - 1.5, 3, 3);
      });

      const camRx = cx + camera.position.x * scale;
      const camRy = cy + camera.position.z * scale;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(camRx, camRy, 4.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      tick += 0.02;
      hudTick += 1;

      const noite = modoNoturnoRef.current;
      const climaAtual = climaRef.current;
      const pMode = pilotModeRef.current;
      const fpv = primeiraPessoaRef.current;

      const baseSkyHex =
        climaAtual === 'tempestade' ? 0x050811 :
        climaAtual === 'chuva' ? 0x0a1324 :
        noite ? 0x02040a : 0x09162e;

      scene.background.lerp(new THREE.Color(baseSkyHex), 0.08);
      if (scene.fog) scene.fog.color.copy(scene.background);

      // Efeito de relâmpago / raio na tempestade
      let flashBoost = 0;
      if (climaAtual === 'tempestade') {
        nextBoltIn -= 0.02;
        if (nextBoltIn <= 0 && boltTimer <= 0) {
          boltTimer = 0.16;
          nextBoltIn = 3.2 + Math.random() * 4.5;
          const bx = (Math.random() - 0.5) * 110;
          const bz = (Math.random() - 0.5) * 90;
          const attr = boltGeo.getAttribute('position');
          for (let s = 0; s < 7; s++) {
            const frac = s / 6;
            const jitterX = s === 0 || s === 6 ? 0 : (Math.random() - 0.5) * 3.5;
            const jitterZ = s === 0 || s === 6 ? 0 : (Math.random() - 0.5) * 3.5;
            attr.setXYZ(s, bx + jitterX, 38 * (1 - frac), bz + jitterZ);
          }
          attr.needsUpdate = true;
          boltMat.opacity = 0.95;
        }
        if (boltTimer > 0) {
          boltTimer -= 0.02;
          flashBoost = Math.sin((boltTimer / 0.16) * Math.PI) * 3.2;
          boltMat.opacity = Math.max(0, (boltTimer / 0.16) * 0.95);
        } else {
          boltMat.opacity = 0;
        }
      } else {
        boltMat.opacity = 0;
        boltTimer = 0;
      }

      const targetAmbient = climaAtual === 'tempestade' ? 0.3 : climaAtual === 'chuva' ? 0.65 : (noite ? 0.35 : 1.45);
      const targetDir = (climaAtual === 'tempestade' ? 0.45 : climaAtual === 'chuva' ? 1.1 : (noite ? 0.35 : 2.4)) + flashBoost;
      ambient.intensity += (targetAmbient - ambient.intensity) * 0.08;
      dirLight.intensity += (targetDir - dirLight.intensity) * 0.08;

      if (climaAtual === 'chuva' || climaAtual === 'tempestade') {
        rainMat.opacity = climaAtual === 'tempestade' ? 0.72 : 0.48;
        rainMat.size = climaAtual === 'tempestade' ? 0.45 : 0.32;
        const posAttr = rainGeo.getAttribute('position');
        const fallSpeed = climaAtual === 'tempestade' ? 1.35 : 0.9;
        for (let i = 0; i < rainCount; i++) {
          let y = posAttr.getY(i) - fallSpeed;
          let x = posAttr.getX(i) - (climaAtual === 'tempestade' ? 0.14 : 0.04);
          if (y < 0.2) {
            y = 45;
            x = (Math.random() - 0.5) * 160;
          }
          posAttr.setY(i, y);
          posAttr.setX(i, x);
        }
        posAttr.needsUpdate = true;
      } else {
        rainMat.opacity += (0.0 - rainMat.opacity) * 0.12;
      }

      holoPanels.forEach((hp) => {
        hp.plane.position.y = hp.baseY + Math.sin(tick * 2.2) * 0.35;
        hp.plane.lookAt(camera.position);
      });

      streetLamps.forEach((bulbMat) => {
        bulbMat.color.setHex(noite || climaAtual === 'tempestade' ? 0xfef08a : 0x94a3b8);
      });

      lighthouses.forEach((lh) => {
        lh.beaconPivot.rotation.y += noite ? 0.045 : 0.015;
        lh.rayMat.opacity = noite ? 0.38 : 0.12;
      });

      turbines.forEach((tb) => {
        tb.rotor.rotation.z -= tb.speed;
      });

      drones.forEach((d) => {
        d.angle += d.speed;
        const dx = d.cx + Math.cos(d.angle) * d.radius;
        const dz = d.cz + Math.sin(d.angle) * d.radius;
        const dy = d.baseY + Math.sin(tick * 2.4 + d.angle) * 0.45;
        d.drone.position.set(dx, dy, dz);
        d.drone.rotation.y = -d.angle;
        d.rotors.forEach((r) => {
          r.rotation.y += 0.65;
        });
      });

      helicopters.forEach((h, hIdx) => {
        h.mainRotor.rotation.y += 0.55;
        h.tailRotor.rotation.x += 0.65;

        if (hIdx === 0 && pMode === 'heli-0') {
          if (keysPressed['arrowup'] || keysPressed['r']) {
            h.forwardSpeed = Math.min(0.75, h.forwardSpeed + 0.025);
          } else if (keysPressed['arrowdown'] || keysPressed['f']) {
            h.forwardSpeed = Math.max(-0.35, h.forwardSpeed - 0.02);
          } else {
            h.forwardSpeed *= 0.94;
          }

          if (keysPressed['a'] || keysPressed['arrowleft']) h.heading += 0.038;
          if (keysPressed['d'] || keysPressed['arrowright']) h.heading -= 0.038;

          if (keysPressed['w']) h.y = Math.min(42, h.y + 0.24);
          if (keysPressed['s']) h.y = Math.max(3.5, h.y - 0.24);
          if (keysPressed[' ']) h.forwardSpeed *= 0.85;

          h.heli.rotation.y = h.heading;
          h.heli.position.x += Math.sin(h.heading) * h.forwardSpeed;
          h.heli.position.z += Math.cos(h.heading) * h.forwardSpeed;
          h.heli.position.y = h.y + Math.sin(tick * 2) * 0.12;
          h.heli.position.x = Math.max(-84, Math.min(84, h.heli.position.x));
          h.heli.position.z = Math.max(-70, Math.min(70, h.heli.position.z));

          if (hudTick % 4 === 0) {
            setHudData({
              speedKmh: Math.round(Math.abs(h.forwardSpeed) * 240),
              altOrY: Number(h.heli.position.y.toFixed(1)),
              label: `🚁 Helicóptero • Alt ${h.heli.position.y.toFixed(1)}m`
            });
          }

          if (fpv) {
            const cPos = h.heli.position.clone().add(new THREE.Vector3(Math.sin(h.heading) * 0.5, 0.25, Math.cos(h.heading) * 0.5));
            const fLook = h.heli.position.clone().add(new THREE.Vector3(Math.sin(h.heading) * 12, -0.5, Math.cos(h.heading) * 12));
            camera.position.lerp(cPos, 0.35);
            camera.lookAt(fLook);
          } else {
            const desiredCam = h.heli.position.clone().add(new THREE.Vector3(-Math.sin(h.heading) * 11, 4.5, -Math.cos(h.heading) * 11));
            camera.position.lerp(desiredCam, 0.12);
            lookAtTargetRef.current.lerp(h.heli.position.clone().add(new THREE.Vector3(Math.sin(h.heading) * 4, 0, Math.cos(h.heading) * 4)), 0.18);
            camera.lookAt(lookAtTargetRef.current);
          }
        } else {
          h.angle += h.speed;
          const hx = Math.cos(h.angle) * h.rx;
          const hz = Math.sin(h.angle) * h.rz;
          const hy = h.y + Math.sin(tick * 1.5 + h.angle) * 0.8;
          const nextX = Math.cos(h.angle + 0.02) * h.rx;
          const nextZ = Math.sin(h.angle + 0.02) * h.rz;
          h.heli.position.set(hx, hy, hz);
          h.heli.lookAt(nextX, hy, nextZ);
          h.heading = Math.atan2(nextX - hx, nextZ - hz);
          h.y = hy;
        }
      });

      if (rocketObj) {
        rocketObj.cycle = (rocketObj.cycle + 0.0045) % 1;
        const alt = rocketObj.cycle < 0.75
          ? Math.pow(rocketObj.cycle / 0.75, 1.8) * 32
          : (1 - (rocketObj.cycle - 0.75) / 0.25) * 32;
        rocketObj.rocket.position.set(
          rocketObj.baseX + Math.sin(rocketObj.cycle * Math.PI) * 3.5,
          0.5 + alt,
          rocketObj.baseZ
        );
        rocketObj.rocket.rotation.z = -Math.sin(rocketObj.cycle * Math.PI) * 0.22;
        rocketObj.flame.scale.y = 0.8 + Math.sin(tick * 18) * 0.35;
      }

      boats.forEach((b, bIdx) => {
        if (bIdx === 0 && pMode === 'boat-0') {
          const accel = (keysPressed['w'] || keysPressed['arrowup']) ? 0.015 :
                        (keysPressed['s'] || keysPressed['arrowdown']) ? -0.01 : 0;
          if (keysPressed[' ']) {
            b.manualSpeed *= 0.84;
          } else if (accel !== 0) {
            b.manualSpeed = Math.max(-0.22, Math.min(0.38, b.manualSpeed + accel));
          } else {
            b.manualSpeed *= 0.95;
          }

          if (keysPressed['a'] || keysPressed['arrowleft']) b.heading += 0.035;
          if (keysPressed['d'] || keysPressed['arrowright']) b.heading -= 0.035;

          b.mesh.rotation.y = b.heading;
          b.mesh.position.x += Math.sin(b.heading) * b.manualSpeed;
          b.mesh.position.z += Math.cos(b.heading) * b.manualSpeed;
          b.mesh.position.y = 0.32 + Math.sin(tick * 3.5) * 0.025;
          b.mesh.position.x = Math.max(-80, Math.min(80, b.mesh.position.x));
          b.mesh.position.z = Math.max(-66, Math.min(66, b.mesh.position.z));

          if (hudTick % 4 === 0) {
            setHudData({
              speedKmh: Math.round(Math.abs(b.manualSpeed) * 145),
              altOrY: 0,
              label: `🚤 Barco • Nós/Setor (${Math.round(b.mesh.position.x)}, ${Math.round(b.mesh.position.z)})`
            });
          }

          if (fpv) {
            const cPos = b.mesh.position.clone().add(new THREE.Vector3(Math.sin(b.heading) * 0.2, 0.95, Math.cos(b.heading) * 0.2));
            const fLook = b.mesh.position.clone().add(new THREE.Vector3(Math.sin(b.heading) * 8, 0.65, Math.cos(b.heading) * 8));
            camera.position.lerp(cPos, 0.35);
            camera.lookAt(fLook);
          } else {
            const desiredCam = b.mesh.position.clone().add(new THREE.Vector3(-Math.sin(b.heading) * 7.5, 4.2, -Math.cos(b.heading) * 7.5));
            camera.position.lerp(desiredCam, 0.12);
            lookAtTargetRef.current.lerp(b.mesh.position.clone().add(new THREE.Vector3(Math.sin(b.heading) * 3, 0.5, Math.cos(b.heading) * 3)), 0.18);
            camera.lookAt(lookAtTargetRef.current);
          }
        } else if (b.mode === 'orbit') {
          b.angle += b.speed;
          const bx = b.cx + Math.cos(b.angle) * b.radius;
          const bz = b.cz + Math.sin(b.angle) * b.radius;
          const nextX = b.cx + Math.cos(b.angle + 0.04) * b.radius;
          const nextZ = b.cz + Math.sin(b.angle + 0.04) * b.radius;
          b.mesh.position.set(bx, 0.32 + Math.sin(tick * 3 + b.angle) * 0.02, bz);
          b.mesh.lookAt(nextX, b.mesh.position.y, nextZ);
          b.heading = Math.atan2(nextX - bx, nextZ - bz);
        } else if (b.mode === 'lineX') {
          b.t += b.speed * b.dir;
          if (b.t >= 1) { b.t = 1; b.dir = -1; }
          if (b.t <= 0) { b.t = 0; b.dir = 1; }
          const bx = b.minX + (b.maxX - b.minX) * b.t;
          b.mesh.position.set(bx, 0.32 + Math.sin(tick * 3) * 0.02, b.z);
          b.heading = b.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
          b.mesh.rotation.y = b.heading;
        } else if (b.mode === 'lineZ') {
          b.t += b.speed * b.dir;
          if (b.t >= 1) { b.t = 1; b.dir = -1; }
          if (b.t <= 0) { b.t = 0; b.dir = 1; }
          const bz = b.minZ + (b.maxZ - b.minZ) * b.t;
          b.mesh.position.set(b.x, 0.32 + Math.sin(tick * 3) * 0.02, bz);
          b.heading = b.dir > 0 ? 0 : Math.PI;
          b.mesh.rotation.y = b.heading;
        }
      });

      trafficLights.forEach((tl) => {
        const cycle = (tick * 0.5 + tl.phaseOffset) % 6;
        if (cycle < 2.6) {
          tl.greenMat.color.setHex(0x22c55e);
          tl.yellowMat.color.setHex(0x3f3208);
          tl.redMat.color.setHex(0x3f1212);
        } else if (cycle < 3.4) {
          tl.greenMat.color.setHex(0x0b3b1e);
          tl.yellowMat.color.setHex(0xfacc15);
          tl.redMat.color.setHex(0x3f1212);
        } else {
          tl.greenMat.color.setHex(0x0b3b1e);
          tl.yellowMat.color.setHex(0x3f3208);
          tl.redMat.color.setHex(0xef4444);
        }
      });

      const pilotCarIdx = pMode.startsWith('car-') ? Number(pMode.split('-')[1]) : -1;
      const isAnyPilot = pMode !== 'none';

      if (engineOscRef.current && engineGainRef.current && audioCtxRef.current) {
        if (pilotCarIdx >= 0 && cars[pilotCarIdx]) {
          const spdRatio = Math.min(1, Math.abs(cars[pilotCarIdx].manualSpeed) / 0.65);
          engineOscRef.current.frequency.setTargetAtTime(72 + spdRatio * 145, audioCtxRef.current.currentTime, 0.08);
          engineGainRef.current.gain.setTargetAtTime(0.08 + spdRatio * 0.14, audioCtxRef.current.currentTime, 0.08);
        } else if (pMode === 'heli-0') {
          engineOscRef.current.frequency.setTargetAtTime(115 + Math.abs(helicopters[0].forwardSpeed) * 120, audioCtxRef.current.currentTime, 0.08);
          engineGainRef.current.gain.setTargetAtTime(0.11, audioCtxRef.current.currentTime, 0.08);
        } else {
          engineGainRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.12);
        }
      }

      cars.forEach((c, idx) => {
        c.beamMat.opacity = noite ? 0.32 : 0.0;

        if (idx === pilotCarIdx) {
          const accel = (keysPressed['w'] || keysPressed['arrowup']) ? 0.022 :
                        (keysPressed['s'] || keysPressed['arrowdown']) ? -0.015 : 0;
          const braking = keysPressed[' '] || keysPressed['spacebar'];
          if (braking) {
            c.manualSpeed *= 0.82;
          } else if (accel !== 0) {
            c.manualSpeed = Math.max(-0.35, Math.min(0.65, c.manualSpeed + accel));
          } else {
            c.manualSpeed *= 0.94;
          }

          const turnSpeed = 0.045 * (Math.abs(c.manualSpeed) > 0.01 ? 1 : 0.6);
          if (keysPressed['a'] || keysPressed['arrowleft']) {
            c.heading += turnSpeed;
          }
          if (keysPressed['d'] || keysPressed['arrowright']) {
            c.heading -= turnSpeed;
          }

          c.car.rotation.y = c.heading;
          c.car.position.x += Math.sin(c.heading) * c.manualSpeed;
          c.car.position.z += Math.cos(c.heading) * c.manualSpeed;
          c.car.position.x = Math.max(-82, Math.min(82, c.car.position.x));
          c.car.position.z = Math.max(-68, Math.min(68, c.car.position.z));

          if (hudTick % 4 === 0) {
            setHudData({
              speedKmh: Math.round(Math.abs(c.manualSpeed) * 210),
              altOrY: 0,
              label: `🏎️ Carro #${idx + 1} • ${fpv ? '1ª Pessoa' : '3ª Pessoa'}`
            });
          }

          if (Math.abs(c.manualSpeed) > 0.05) {
            c.trailTimer += 1;
            if (c.trailTimer % 4 === 0) {
              const rearPos = c.car.position.clone().add(
                new THREE.Vector3(-Math.sin(c.heading) * 1.45, 0.35, -Math.cos(c.heading) * 1.45)
              );
              spawnTrail(rearPos, c.corHex, noite);
            }
          }

          if (fpv) {
            const cockpitPos = c.car.position.clone().add(
              new THREE.Vector3(Math.sin(c.heading) * 0.15, 1.08, Math.cos(c.heading) * 0.15)
            );
            const frontLook = c.car.position.clone().add(
              new THREE.Vector3(Math.sin(c.heading) * 9.0, 1.05, Math.cos(c.heading) * 9.0)
            );
            camera.position.lerp(cockpitPos, 0.35);
            camera.lookAt(frontLook);
          } else {
            const camOffset = new THREE.Vector3(
              -Math.sin(c.heading) * 9.5,
              5.2,
              -Math.cos(c.heading) * 9.5
            );
            const desiredCamPos = c.car.position.clone().add(camOffset);
            camera.position.lerp(desiredCamPos, 0.12);
            lookAtTargetRef.current.lerp(
              c.car.position.clone().add(new THREE.Vector3(Math.sin(c.heading) * 4, 1.2, Math.cos(c.heading) * 4)),
              0.18
            );
            camera.lookAt(lookAtTargetRef.current);
          }
        } else {
          let nearRed = false;
          for (let tli = 0; tli < trafficLights.length; tli++) {
            const tl = trafficLights[tli];
            const worldPos = new THREE.Vector3();
            tl.group.getWorldPosition(worldPos);
            const distToLight = c.car.position.distanceTo(worldPos);
            const isRed = ((tick * 0.5 + tl.phaseOffset) % 6) >= 3.4;
            if (distToLight < 4.5 && isRed) {
              nearRed = true;
              break;
            }
          }

          if (!nearRed) {
            c.t = (c.t + c.speed) % 1;
            c.car.position.lerpVectors(c.start, c.end, c.t);
            c.car.lookAt(c.end.x, c.car.position.y, c.end.z);

            c.trailTimer += 1;
            if (c.trailTimer % 8 === 0) {
              spawnTrail(c.car.position.clone().add(new THREE.Vector3(0, 0.32, 0)), c.corHex, noite);
            }
          }
        }
      });

      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.life -= 0.025;
        p.mesh.position.y += 0.015;
        p.mesh.scale.multiplyScalar(1.03);
        p.mat.opacity = Math.max(0, p.life * (noite ? 0.6 : 0.3));
        if (p.life <= 0) {
          scene.remove(p.mesh);
          p.mat.dispose();
          trailParticles.splice(i, 1);
        }
      }

      if (!isAnyPilot) {
        const moveSpeed = 0.45;
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

        let movedByKey = false;
        if (keysPressed['w'] || keysPressed['arrowup']) {
          camera.position.addScaledVector(forward, moveSpeed);
          lookAtTargetRef.current.addScaledVector(forward, moveSpeed);
          movedByKey = true;
        }
        if (keysPressed['s'] || keysPressed['arrowdown']) {
          camera.position.addScaledVector(forward, -moveSpeed);
          lookAtTargetRef.current.addScaledVector(forward, -moveSpeed);
          movedByKey = true;
        }
        if (keysPressed['d'] || keysPressed['arrowright']) {
          camera.position.addScaledVector(right, moveSpeed);
          lookAtTargetRef.current.addScaledVector(right, moveSpeed);
          movedByKey = true;
        }
        if (keysPressed['a'] || keysPressed['arrowleft']) {
          camera.position.addScaledVector(right, -moveSpeed);
          lookAtTargetRef.current.addScaledVector(right, -moveSpeed);
          movedByKey = true;
        }

        if (movedByKey && modoPasseioRef.current) {
          modoPasseioRef.current = false;
          setModoPasseio(false);
        }

        if (modoPasseioRef.current && !isDragging) {
          const [cx, , cz] = cidadeAtivaRef.current.posicao;
          const desiredCam = new THREE.Vector3(
            cx + Math.sin(tick * 0.35) * 16,
            11.5 + Math.cos(tick * 0.25) * 2.2,
            cz + Math.cos(tick * 0.35) * 16
          );
          camera.position.lerp(desiredCam, 0.03);
          lookAtTargetRef.current.lerp(new THREE.Vector3(cx, 1.5, cz), 0.06);
          camera.lookAt(lookAtTargetRef.current);
        }
      }

      people.forEach((p) => {
        p.angle += p.speed;
        const nx = p.cx + Math.cos(p.angle) * p.radius;
        const nz = p.cz + Math.sin(p.angle) * p.radius;
        const dx = nx - p.person.position.x;
        const dz = nz - p.person.position.z;
        p.person.position.x = nx;
        p.person.position.z = nz;
        p.person.rotation.y = Math.atan2(dx, dz);
        p.legL.rotation.x = Math.sin(tick * 6 + p.angle * 3) * 0.45;
        p.legR.rotation.x = -Math.sin(tick * 6 + p.angle * 3) * 0.45;
      });

      cyclists.forEach((b) => {
        b.angle += b.speed;
        const nx = b.cx + Math.cos(b.angle) * b.radius;
        const nz = b.cz + Math.sin(b.angle) * b.radius;
        const dx = nx - b.bikeGroup.position.x;
        const dz = nz - b.bikeGroup.position.z;
        b.bikeGroup.position.x = nx;
        b.bikeGroup.position.z = nz;
        b.bikeGroup.rotation.y = Math.atan2(dx, dz);
        b.legL.rotation.x = Math.sin(tick * 9 + b.angle * 4) * 0.55;
        b.legR.rotation.x = -Math.sin(tick * 9 + b.angle * 4) * 0.55;
      });

      animatedProps.forEach((item) => {
        if (item.rotY) item.mesh.rotation.y += item.rotY;
        if (item.bobY) item.mesh.position.y = item.baseY + Math.sin(tick * 2) * 0.35;
      });

      drawRadar();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const estaPilotandoVeiculo = pilotMode !== 'none';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#060d1f', fontFamily: 'system-ui, sans-serif', color: '#f8fafc' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {modoFoto && (
        <button
          onClick={() => setModoFoto(false)}
          style={{
            position: 'fixed', top: '14px', right: '14px', zIndex: 30,
            padding: '7px 12px', borderRadius: '999px',
            border: '1px solid rgba(0, 240, 255, 0.55)',
            backgroundColor: 'rgba(10, 19, 38, 0.72)', color: '#00f0ff',
            fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          🎛️ Mostrar Controles (H)
        </button>
      )}

      {!modoFoto && (
        <>
          <div style={{
            position: 'fixed', top: '14px', left: '14px', right: '14px', zIndex: 20,
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(10, 19, 38, 0.88)', border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRadius: '14px', padding: '10px 14px', backdropFilter: 'blur(14px)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              <strong style={{ fontSize: '12px', color: '#00f0ff', marginRight: '4px' }}>
                🌆 CIDADES INTELIGENTES 3D
              </strong>
              {CIDADES_DATA.map((c) => {
                const ativa = cidadeAtiva.id === c.id && !estaPilotandoVeiculo;
                return (
                  <button
                    key={c.id}
                    onClick={() => focarCidade(c)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${ativa ? '#00f0ff' : 'rgba(148,163,184,0.35)'}`,
                      backgroundColor: ativa ? '#0284c7' : 'rgba(15, 23, 42, 0.7)',
                      color: '#fff',
                      fontSize: '10.5px',
                      fontWeight: ativa ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    {c.nome} ({c.uf})
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              <select
                value={pilotMode}
                onChange={(e) => setPilotMode(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #38bdf8',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                <option value="none">🎮 Câmera Livre / Cidades</option>
                <option value="car-0">🏎️ Pilotar Carro #1 (Ciano)</option>
                <option value="car-1">🚙 Pilotar Carro #2 (Verde)</option>
                <option value="car-2">🚕 Pilotar Carro #3 (Âmbar)</option>
                <option value="car-3">🚘 Pilotar Carro #4 (Roxo)</option>
                <option value="car-4">🚗 Pilotar Carro #5 (Rosa)</option>
                <option value="car-5">🚐 Pilotar Carro #6 (Azul)</option>
                <option value="heli-0">🚁 Pilotar Helicóptero #1</option>
                <option value="boat-0">🚤 Pilotar Barco (Lagoa/Rios)</option>
              </select>

              {estaPilotandoVeiculo && (
                <>
                  <button
                    onClick={() => setPrimeiraPessoa(!primeiraPessoa)}
                    style={{
                      padding: '6px 11px',
                      borderRadius: '8px',
                      border: '1px solid #00f0ff',
                      backgroundColor: primeiraPessoa ? '#00f0ff' : 'rgba(15, 23, 42, 0.85)',
                      color: primeiraPessoa ? '#000' : '#00f0ff',
                      fontSize: '10.5px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {primeiraPessoa ? '👁️ 1ª Pessoa' : '🎥 3ª Pessoa'}
                  </button>
                  {pilotMode.startsWith('car-') && (
                    <button
                      onClick={tocarBuzina}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        fontSize: '10.5px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      📢 Buzina (B)
                    </button>
                  )}
                </>
              )}

              <select
                value={clima}
                onChange={(e) => setClima(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #7dd3fc',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                <option value="limpo">⛅ Clima: Limpo</option>
                <option value="chuva">🌧️ Clima: Chuva</option>
                <option value="tempestade">⛈️ Clima: Tempestade</option>
              </select>

              <button
                onClick={toggleSomAmbiente}
                style={{
                  padding: '6px 11px',
                  borderRadius: '8px',
                  border: '1px solid #38bdf8',
                  backgroundColor: somAmbienteAtivo ? '#0284c7' : 'rgba(15, 23, 42, 0.85)',
                  color: '#fff',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {somAmbienteAtivo ? '🔊 Som ON' : '🔇 Som'}
              </button>

              <button
                onClick={() => setModoNoturno(!modoNoturno)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #facc15',
                  backgroundColor: modoNoturno ? '#1e1b4b' : '#eab308',
                  color: modoNoturno ? '#fef08a' : '#0f172a',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {modoNoturno ? '🌙 Noite' : '☀️ Dia'}
              </button>

              <button
                onClick={() => {
                  setPilotMode('none');
                  pilotModeRef.current = 'none';
                  setModoPasseio(!modoPasseio);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: modoPasseio ? '#22c55e' : '#0284c7',
                  color: '#fff',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {modoPasseio ? '🚶 Passeio' : '🎮 Livre'}
              </button>

              <button
                onClick={() => setModoFoto(true)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #c084fc',
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  color: '#e9d5ff',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                📷 Foto (H)
              </button>

              <button
                onClick={() => setMostrarPainelInfo(!mostrarPainelInfo)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,240,255,0.45)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#00f0ff',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {mostrarPainelInfo ? 'Ocultar Ficha' : 'Ficha'}
              </button>
            </div>
          </div>

          {mostrarPainelInfo && (
            <div style={{
              position: 'fixed', bottom: '16px', left: '16px', maxWidth: '420px', zIndex: 20,
              backgroundColor: 'rgba(10, 19, 38, 0.9)', border: `1.5px solid ${cidadeAtiva.corPrimaria}`,
              borderRadius: '16px', padding: '14px 16px', backdropFilter: 'blur(16px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: cidadeAtiva.corPrimaria }}>
                  {cidadeAtiva.nome} — {cidadeAtiva.uf}
                </h3>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(2,132,199,0.25)', border: '1px solid #38bdf8', padding: '2px 8px', borderRadius: '999px' }}>
                  {cidadeAtiva.apelido}
                </span>
              </div>

              <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#e2e8f0', lineHeight: '1.45' }}>
                <strong style={{ color: '#38bdf8' }}>⚡ Tecnologia:</strong> {cidadeAtiva.tecnologia}
              </p>
              <p style={{ margin: '0 0 6px 0', fontSize: '11.5px', color: '#dcfce7', lineHeight: '1.45' }}>
                <strong style={{ color: '#4ade80' }}>🌿 Bioma ({cidadeAtiva.bioma}):</strong> {cidadeAtiva.detalheBioma}
              </p>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                {pilotMode === 'heli-0'
                  ? 'Helicóptero: W/S sobe/desce, Seta Cima/Baixo (ou R/F) avança/ré, A/D gira, Espaço paira.'
                  : pilotMode === 'boat-0'
                  ? 'Barco: W/S acelera/ré, A/D leme, Espaço freia.'
                  : pilotMode.startsWith('car-')
                  ? 'Carro: W/S acelera/ré, A/D vira, Espaço freia, B buzina.'
                  : 'Dica: Clique no painel 3D ou no radar para viajar, arraste para girar, H modo foto.'}
              </span>
            </div>
          )}

          {/* HUD Digital / Velocímetro ao Pilotar */}
          {estaPilotandoVeiculo && (
            <div style={{
              position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 25,
              backgroundColor: 'rgba(6, 15, 34, 0.9)', border: '1px solid rgba(0, 240, 255, 0.55)',
              borderRadius: '14px', padding: '8px 18px', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'baseline', gap: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>{hudData.label}</span>
              <strong style={{ fontSize: '20px', color: '#00f0ff', fontVariantNumeric: 'tabular-nums' }}>
                {hudData.speedKmh} <small style={{ fontSize: '11px', color: '#94a3b8' }}>KM/H</small>
              </strong>
            </div>
          )}

          {/* Minimapa Radar 2D em Tempo Real (Clicável) */}
          <div
            onClick={handleRadarClick}
            title="Clique no radar para viajar para a cidade mais próxima"
            style={{
              position: 'fixed', bottom: '16px', right: '16px', zIndex: 20,
              backgroundColor: 'rgba(10, 19, 38, 0.72)', border: '1px solid rgba(0, 240, 255, 0.45)',
              borderRadius: '999px', padding: '6px', backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)', cursor: 'pointer'
            }}
          >
            <canvas ref={radarCanvasRef} width={132} height={132} style={{ display: 'block', borderRadius: '999px' }} />
          </div>
        </>
      )}
    </div>
  );
}