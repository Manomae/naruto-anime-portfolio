import * as THREE from 'three';

function garantirGrupoExtra(parent, nome, builder) {
  let grupo = parent.getObjectByName(nome);
  if (!grupo) {
    grupo = builder();
    grupo.name = nome;
    parent.add(grupo);
  }
  return grupo;
}

function construirVisualRockRobotoc() {
  const g = new THREE.Group();
  const spikeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15
  });
  const flameLedMat = new THREE.MeshStandardMaterial({
    color: 0xff3b00,
    emissive: 0xff2200,
    emissiveIntensity: 3.2
  });

  [-0.48, 0.48].forEach((xPos) => {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28, 12), spikeMat);
    spike.position.set(xPos, 0.42, 0);
    spike.rotation.z = xPos < 0 ? 0.45 : -0.45;
    g.add(spike);
  });

  const rockBar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.06), flameLedMat);
  rockBar.position.set(0, 0.24, 0.29);
  g.add(rockBar);

  return g;
}

function construirVisualRockVegatocnyx() {
  const g = new THREE.Group();
  const studMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 1.4,
    metalness: 0.85,
    roughness: 0.2
  });

  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.38), studMat);
  crest.position.set(0, 0.52, -0.04);
  g.add(crest);

  return g;
}

function construirFedoraMJ(corAba = 0x1e293b, corFaixa = 0xfacc15) {
  const g = new THREE.Group();
  const brimMat = new THREE.MeshStandardMaterial({
    color: corAba,
    metalness: 0.85,
    roughness: 0.22
  });
  const crownMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.88,
    roughness: 0.2
  });
  const bandMat = new THREE.MeshStandardMaterial({
    color: corFaixa,
    emissive: corFaixa,
    emissiveIntensity: 0.9,
    metalness: 0.95,
    roughness: 0.15
  });

  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.48, 0.025, 28), brimMat);
  brim.position.set(0, 0.46, 0.04);
  brim.rotation.x = 0.12;

  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.25, 0.2, 24), crownMat);
  crown.position.set(0, 0.56, 0.02);
  crown.rotation.x = 0.12;

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.254, 0.256, 0.04, 24), bandMat);
  band.position.set(0, 0.48, 0.035);
  band.rotation.x = 0.12;

  g.add(brim, crown, band);
  return g;
}

function construirGloveMJ() {
  const g = new THREE.Group();
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.55,
    metalness: 0.45,
    roughness: 0.2
  });
  const cuffMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.2,
    metalness: 0.9,
    roughness: 0.2
  });

  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.05, 18), cuffMat);
  cuff.position.set(0, -0.34, 0.24);
  cuff.rotation.x = -0.6;

  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), gloveMat);
  hand.position.set(0, -0.44, 0.34);

  g.add(cuff, hand);
  return g;
}

function construirCintoShakira(corNeon = 0xfbbf24) {
  const g = new THREE.Group();
  const beltMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 1.15,
    metalness: 0.9,
    roughness: 0.18
  });

  const beltRing = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.022, 12, 32), beltMat);
  beltRing.rotation.x = Math.PI / 2;
  beltRing.position.set(0, -0.1, 0);

  g.add(beltRing);
  return g;
}

function construirBraceleteShakira(corNeon = 0xff2a85) {
  const g = new THREE.Group();
  const cuffMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 1.35,
    metalness: 0.85,
    roughness: 0.2
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.018, 10, 24), cuffMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, -0.38, 0.28);

  g.add(ring);
  return g;
}

function construirMicrofoneKaraoke(corLed = 0x00f0ff) {
  const g = new THREE.Group();
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.25
  });
  const headMat = new THREE.MeshStandardMaterial({
    color: corLed,
    emissive: corLed,
    emissiveIntensity: 2.4,
    metalness: 0.6,
    roughness: 0.2
  });

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.02, 0.22, 14), handleMat);
  handle.position.set(0, -0.36, 0.34);
  handle.rotation.x = -0.7;

  const grille = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 16), headMat);
  grille.position.set(0, -0.26, 0.42);

  g.add(handle, grille);
  return g;
}

function construirChapeuVaquejada(corCouro = 0x78350f, corFaixa = 0xf59e0b) {
  const g = new THREE.Group();
  const leatherMat = new THREE.MeshStandardMaterial({
    color: corCouro,
    roughness: 0.65,
    metalness: 0.15
  });
  const bandMat = new THREE.MeshStandardMaterial({
    color: corFaixa,
    emissive: corFaixa,
    emissiveIntensity: 0.95,
    roughness: 0.3,
    metalness: 0.6
  });

  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.56, 0.024, 28), leatherMat);
  brim.position.set(0, 0.46, 0.03);
  brim.rotation.x = 0.08;

  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.2, 24), leatherMat);
  crown.position.set(0, 0.56, 0.02);
  crown.rotation.x = 0.08;

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.264, 0.266, 0.038, 24), bandMat);
  band.position.set(0, 0.48, 0.028);
  band.rotation.x = 0.08;

  g.add(brim, crown, band);
  return g;
}

function construirLencoForro(corLenco = 0xf59e0b) {
  const g = new THREE.Group();
  const scarfMat = new THREE.MeshStandardMaterial({
    color: corLenco,
    emissive: corLenco,
    emissiveIntensity: 1.0,
    roughness: 0.4,
    metalness: 0.3
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.024, 12, 28), scarfMat);
  ring.rotation.x = Math.PI / 2.2;
  ring.position.set(0, 0.38, 0.02);

  g.add(ring);
  return g;
}

function construirTiaraNeon(corNeon = 0x00f0ff) {
  const g = new THREE.Group();
  const neonMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 2.2,
    metalness: 0.7,
    roughness: 0.2
  });

  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.018, 12, 32), neonMat);
  halo.rotation.x = Math.PI / 2.4;
  halo.position.set(0, 0.52, 0);

  g.add(halo);
  return g;
}

function construirPulseiraNeon(corNeon = 0x00f0ff) {
  const g = new THREE.Group();
  const neonMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 2.1,
    metalness: 0.8,
    roughness: 0.2
  });

  const band = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.016, 10, 24), neonMat);
  band.rotation.x = Math.PI / 2;
  band.position.set(0, -0.32, 0.22);

  g.add(band);
  return g;
}

function construirPropulsorSalto(corNeon = 0x00f0ff) {
  const g = new THREE.Group();
  const thrusterMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 2.3,
    metalness: 0.85,
    roughness: 0.2
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.028, 12, 32), thrusterMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, -0.18, -0.16);

  g.add(ring);
  return g;
}

function construirAnelBateriaTurbo(corNeon = 0xfacc15) {
  const g = new THREE.Group();
  const turboMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 2.2,
    metalness: 0.9,
    roughness: 0.18
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 10, 24), turboMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, -0.36, 0.34);

  g.add(ring);
  return g;
}

function construirViseiraFunkBaile(corNeon = 0xfacc15) {
  const g = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 1.8,
    metalness: 0.9,
    roughness: 0.2
  });

  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.05, 0.06), frameMat);
  bar.position.set(0, 0.14, 0.45);

  g.add(bar);
  return g;
}

function construirLacoPatricinha(corRosa = 0xff2a85, corDourado = 0xfacc15) {
  const g = new THREE.Group();
  const bowMat = new THREE.MeshStandardMaterial({
    color: corRosa,
    emissive: corRosa,
    emissiveIntensity: 2.1,
    metalness: 0.65,
    roughness: 0.22
  });
  const knotMat = new THREE.MeshStandardMaterial({
    color: corDourado,
    emissive: corDourado,
    emissiveIntensity: 1.5,
    metalness: 0.9,
    roughness: 0.2
  });

  const leftWing = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 12), bowMat);
  leftWing.position.set(-0.12, 0.5, 0.12);
  leftWing.rotation.z = Math.PI / 2.3;

  const rightWing = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 12), bowMat);
  rightWing.position.set(0.12, 0.5, 0.12);
  rightWing.rotation.z = -Math.PI / 2.3;

  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 14), knotMat);
  knot.position.set(0, 0.5, 0.14);

  g.add(leftWing, rightWing, knot);
  return g;
}

function construirTornozeleiraFunk(corNeon = 0xff2a85) {
  const g = new THREE.Group();
  const ankletMat = new THREE.MeshStandardMaterial({
    color: corNeon,
    emissive: corNeon,
    emissiveIntensity: 2.0,
    metalness: 0.85,
    roughness: 0.2
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.018, 10, 24), ankletMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, -0.52, 0);

  g.add(ring);
  return g;
}

// =========================================================================
// ROUPAS 3D EXCLUSIVAS PARA CADA ESTILO (SOBREPOSTAS SEM ALTERAR O CORPO BASE)
// =========================================================================

function construirTrajeTorso3D({
  corBase = 0x0f172a,
  corDetalhe = 0x00f0ff,
  raioTop = 0.41,
  raioBottom = 0.29,
  altura = 0.48,
  escalaX = 1.16,
  escalaZ = 0.88,
  comOmbreiras = true,
  comSaia = false,
  corSaia = 0xff2a85
}) {
  const g = new THREE.Group();

  const vestMat = new THREE.MeshStandardMaterial({
    color: corBase,
    metalness: 0.55,
    roughness: 0.35
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: corDetalhe,
    emissive: corDetalhe,
    emissiveIntensity: 1.25,
    metalness: 0.85,
    roughness: 0.2
  });

  const vest = new THREE.Mesh(new THREE.CylinderGeometry(raioTop, raioBottom, altura, 28), vestMat);
  vest.scale.set(escalaX, 1, escalaZ);
  vest.position.set(0, 0.18, 0);
  g.add(vest);

  // Gola / detalhe frontal
  const collar = new THREE.Mesh(new THREE.TorusGeometry(raioTop * 0.72, 0.018, 10, 28), trimMat);
  collar.rotation.x = Math.PI / 2.25;
  collar.position.set(0, 0.41, 0.04);
  g.add(collar);

  // Faixas laterais / zíper estilizado
  [-1, 1].forEach((side) => {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.03, altura * 0.86, 0.035), trimMat);
    stripe.position.set(side * 0.13, 0.18, raioTop * escalaZ * 0.84);
    stripe.rotation.z = side * -0.08;
    g.add(stripe);

    if (comOmbreiras) {
      const pad = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16), vestMat);
      pad.scale.set(1.25, 0.75, 1.0);
      pad.position.set(side * (raioTop * escalaX * 0.96), 0.38, 0);

      const padRim = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.014, 8, 20), trimMat);
      padRim.rotation.y = Math.PI / 2;
      padRim.position.set(side * (raioTop * escalaX * 0.98), 0.38, 0);
      g.add(pad, padRim);
    }
  });

  // Barra inferior / cintura
  const hem = new THREE.Mesh(new THREE.TorusGeometry(raioBottom * 1.03, 0.016, 10, 28), trimMat);
  hem.rotation.x = Math.PI / 2;
  hem.position.set(0, -0.05, 0);
  g.add(hem);

  if (comSaia) {
    const skirtMat = new THREE.MeshStandardMaterial({
      color: corSaia,
      emissive: corSaia,
      emissiveIntensity: 0.45,
      metalness: 0.4,
      roughness: 0.35
    });
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(raioBottom * 1.02, raioBottom * 1.68, 0.3, 28, 1, true), skirtMat);
    skirt.scale.set(escalaX, 1, escalaZ * 1.08);
    skirt.position.set(0, -0.2, 0);

    const skirtHem = new THREE.Mesh(new THREE.TorusGeometry(raioBottom * 1.68, 0.015, 10, 32), trimMat);
    skirtHem.rotation.x = Math.PI / 2;
    skirtHem.scale.set(escalaX, escalaZ * 1.08, 1);
    skirtHem.position.set(0, -0.35, 0);

    g.add(skirt, skirtHem);
  }

  return g;
}

function construirCalcaPerna3D(corCalca = 0x1e293b, corDetalhe = 0x00f0ff) {
  const g = new THREE.Group();
  const pantMat = new THREE.MeshStandardMaterial({
    color: corCalca,
    metalness: 0.45,
    roughness: 0.4
  });
  const stripeMat = new THREE.MeshStandardMaterial({
    color: corDetalhe,
    emissive: corDetalhe,
    emissiveIntensity: 1.0,
    metalness: 0.8,
    roughness: 0.2
  });

  const legCover = new THREE.Mesh(new THREE.CylinderGeometry(0.104, 0.122, 0.56, 20), pantMat);
  legCover.position.set(0, -0.29, 0);

  const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.123, 0.015, 8, 22), stripeMat);
  cuff.rotation.x = Math.PI / 2;
  cuff.position.set(0, -0.56, 0);

  g.add(legCover, cuff);
  return g;
}

function amortecerAngulo(atual, alvo, fator = 0.22) {
  return atual + (alvo - atual) * fator;
}

export function aplicarVisualModo3D(robotoc, vegatocnyx, modo, t = 0) {
  if (!robotoc || !vegatocnyx) return;

  const rockRobGroup = garantirGrupoExtra(
    robotoc.torsoGroup,
    'visual_modo_rock_robotoc',
    construirVisualRockRobotoc
  );
  const rockVegGroup = garantirGrupoExtra(
    vegatocnyx.headGroup,
    'visual_modo_rock_vega',
    construirVisualRockVegatocnyx
  );

  const mjHatRob = garantirGrupoExtra(
    robotoc.headGroup,
    'acessorio_mj_hat_robotoc',
    () => construirFedoraMJ(0x1e293b, 0xfacc15)
  );
  const mjHatVeg = garantirGrupoExtra(
    vegatocnyx.headGroup,
    'acessorio_mj_hat_vega',
    () => construirFedoraMJ(0x1e293b, 0x38bdf8)
  );
  const mjGloveRob = garantirGrupoExtra(
    robotoc.armR,
    'acessorio_mj_glove_robotoc',
    construirGloveMJ
  );
  const mjGloveVeg = garantirGrupoExtra(
    vegatocnyx.armL,
    'acessorio_mj_glove_vega',
    construirGloveMJ
  );

  const shakiraBeltRob = garantirGrupoExtra(
    robotoc.torsoGroup,
    'acessorio_shakira_belt_robotoc',
    () => construirCintoShakira(0xfbbf24)
  );
  const shakiraBeltVeg = garantirGrupoExtra(
    vegatocnyx.torsoGroup,
    'acessorio_shakira_belt_vega',
    () => construirCintoShakira(0xff2a85)
  );
  const shakiraCuffRob = garantirGrupoExtra(
    robotoc.armL,
    'acessorio_shakira_cuff_robotoc',
    () => construirBraceleteShakira(0xff2a85)
  );
  const shakiraCuffVeg = garantirGrupoExtra(
    vegatocnyx.legL,
    'acessorio_shakira_cuff_vega',
    () => construirBraceleteShakira(0xfbbf24)
  );

  const karaokeMicRob = garantirGrupoExtra(
    robotoc.armL,
    'acessorio_karaoke_mic_robotoc',
    () => construirMicrofoneKaraoke(0x00f0ff)
  );
  const karaokeMicVeg = garantirGrupoExtra(
    vegatocnyx.armR,
    'acessorio_karaoke_mic_vega',
    () => construirMicrofoneKaraoke(0xff2a85)
  );

  const forroHatRob = garantirGrupoExtra(
    robotoc.headGroup,
    'acessorio_forro_hat_robotoc',
    () => construirChapeuVaquejada(0x78350f, 0xf59e0b)
  );
  const forroHatVeg = garantirGrupoExtra(
    vegatocnyx.headGroup,
    'acessorio_forro_hat_vega',
    () => construirChapeuVaquejada(0x92400e, 0xfb7185)
  );
  const forroScarfRob = garantirGrupoExtra(
    robotoc.torsoGroup,
    'acessorio_forro_scarf_robotoc',
    () => construirLencoForro(0xf59e0b)
  );
  const forroScarfVeg = garantirGrupoExtra(
    vegatocnyx.torsoGroup,
    'acessorio_forro_scarf_vega',
    () => construirLencoForro(0xfb7185)
  );

  const freestyleHaloRob = garantirGrupoExtra(
    robotoc.headGroup,
    'acessorio_freestyle_halo_robotoc',
    () => construirTiaraNeon(0x00f0ff)
  );
  const freestyleHaloVeg = garantirGrupoExtra(
    vegatocnyx.headGroup,
    'acessorio_freestyle_halo_vega',
    () => construirTiaraNeon(0xff2a85)
  );
  const freestyleCuffRob = garantirGrupoExtra(
    robotoc.armL,
    'acessorio_freestyle_cuff_robotoc',
    () => construirPulseiraNeon(0x00f0ff)
  );
  const freestyleCuffVeg = garantirGrupoExtra(
    vegatocnyx.armR,
    'acessorio_freestyle_cuff_vega',
    () => construirPulseiraNeon(0xff2a85)
  );

  const saltoThrusterRob = garantirGrupoExtra(
    robotoc.torsoGroup,
    'acessorio_salto_thruster_robotoc',
    () => construirPropulsorSalto(0x00f0ff)
  );
  const saltoThrusterVeg = garantirGrupoExtra(
    vegatocnyx.torsoGroup,
    'acessorio_salto_thruster_vega',
    () => construirPropulsorSalto(0xff2a85)
  );

  const bateriaRingRob = garantirGrupoExtra(
    robotoc.armR,
    'acessorio_bateria_ring_robotoc',
    () => construirAnelBateriaTurbo(0x38bdf8)
  );
  const bateriaRingVegL = garantirGrupoExtra(
    vegatocnyx.armL,
    'acessorio_bateria_ring_vega_l',
    () => construirAnelBateriaTurbo(0xfacc15)
  );
  const bateriaRingVegR = garantirGrupoExtra(
    vegatocnyx.armR,
    'acessorio_bateria_ring_vega_r',
    () => construirAnelBateriaTurbo(0xff2a85)
  );

  const funkVisorRob = garantirGrupoExtra(
    robotoc.headGroup,
    'acessorio_funk_visor_robotoc',
    () => construirViseiraFunkBaile(0xfacc15)
  );
  const funkCuffRob = garantirGrupoExtra(
    robotoc.armL,
    'acessorio_funk_cuff_robotoc',
    () => construirPulseiraNeon(0xfacc15)
  );
  const funkBowVeg = garantirGrupoExtra(
    vegatocnyx.headGroup,
    'acessorio_funk_bow_vega',
    () => construirLacoPatricinha(0xff2a85, 0xfacc15)
  );
  const funkAnkletVeg = garantirGrupoExtra(
    vegatocnyx.legR,
    'acessorio_funk_anklet_vega',
    () => construirTornozeleiraFunk(0xff2a85)
  );

  // Roupas 3D exclusivas para cada estilo
  const roupaRockRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_rock_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x111827, corDetalhe: 0xef4444, comOmbreiras: true })
  );
  const roupaRockVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_rock_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x18181b,
      corDetalhe: 0xf43f5e,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comSaia: true,
      corSaia: 0x9f1239
    })
  );

  const roupaMjRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_mj_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x090d16, corDetalhe: 0xfacc15, comOmbreiras: true })
  );
  const roupaMjVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_mj_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x0f172a,
      corDetalhe: 0x38bdf8,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comOmbreiras: true
    })
  );

  const roupaShakiraRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_shakira_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x3b0764, corDetalhe: 0xfbbf24, comOmbreiras: false })
  );
  const roupaShakiraVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_shakira_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x831843,
      corDetalhe: 0xfbbf24,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comOmbreiras: false,
      comSaia: true,
      corSaia: 0xff2a85
    })
  );

  const roupaKaraokeRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_karaoke_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x0c4a6e, corDetalhe: 0x00f0ff, comOmbreiras: true })
  );
  const roupaKaraokeVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_karaoke_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x701a75,
      corDetalhe: 0xff2a85,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comSaia: true,
      corSaia: 0xc026d3
    })
  );

  const roupaForroRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_forro_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x78350f, corDetalhe: 0xf59e0b, comOmbreiras: false })
  );
  const roupaForroVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_forro_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x9a3412,
      corDetalhe: 0xfde047,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comOmbreiras: false,
      comSaia: true,
      corSaia: 0xfb7185
    })
  );

  const roupaFreestyleRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_freestyle_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x0f172a, corDetalhe: 0x00f0ff, comOmbreiras: true })
  );
  const roupaFreestyleVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_freestyle_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x1e1b4b,
      corDetalhe: 0xff2a85,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comSaia: true,
      corSaia: 0xec4899
    })
  );

  const roupaSaltoRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_salto_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x0369a1, corDetalhe: 0x38bdf8, comOmbreiras: true })
  );
  const roupaSaltoVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_salto_vega', () =>
    construirTrajeTorso3D({
      corBase: 0xbe185d,
      corDetalhe: 0xf472b6,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comOmbreiras: true
    })
  );

  const roupaBateriaRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_bateria_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x1e293b, corDetalhe: 0x38bdf8, comOmbreiras: true })
  );
  const roupaBateriaVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_bateria_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x4c1d95,
      corDetalhe: 0xfacc15,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comOmbreiras: true
    })
  );

  const roupaFunkRob = garantirGrupoExtra(robotoc.torsoGroup, 'roupa_funk_robotoc', () =>
    construirTrajeTorso3D({ corBase: 0x090517, corDetalhe: 0xfacc15, comOmbreiras: false })
  );
  const roupaFunkVeg = garantirGrupoExtra(vegatocnyx.torsoGroup, 'roupa_funk_vega', () =>
    construirTrajeTorso3D({
      corBase: 0x500724,
      corDetalhe: 0xff2a85,
      raioTop: 0.38,
      raioBottom: 0.25,
      escalaX: 1.11,
      escalaZ: 0.83,
      comOmbreiras: false,
      comSaia: true,
      corSaia: 0xf472b6
    })
  );

  // Calças estilizadas nas pernas do Robotoc para completar o visual de palco
  const calcaRobL = garantirGrupoExtra(robotoc.legL, 'calca_estilo_robotoc_l', () =>
    construirCalcaPerna3D(0x0f172a, 0x38bdf8)
  );
  const calcaRobR = garantirGrupoExtra(robotoc.legR, 'calca_estilo_robotoc_r', () =>
    construirCalcaPerna3D(0x0f172a, 0x38bdf8)
  );

  const isRockStage = modo === 'ROCK_STAGE';
  const isMichael = modo === 'MICHAEL_JACKSON_3D';
  const isShakira = modo === 'SHAKIRA_3D';
  const isKaraoke = modo === 'KARAOKE_DUO';
  const isForro = modo === 'FORRO_VAQUEJADA';
  const isFreestyle = modo === 'FREESTYLE_NEON';
  const isSalto = modo === 'SALTO_TOTAL';
  const isBateriaTurbo = modo === 'BATERIA_TURBO';
  const isFunkPatricinha = modo === 'FUNK_PATRICINHA';

  rockRobGroup.visible = isRockStage;
  rockVegGroup.visible = isRockStage;

  mjHatRob.visible = isMichael;
  mjHatVeg.visible = isMichael;
  mjGloveRob.visible = isMichael;
  mjGloveVeg.visible = isMichael;

  shakiraBeltRob.visible = isShakira;
  shakiraBeltVeg.visible = isShakira;
  shakiraCuffRob.visible = isShakira;
  shakiraCuffVeg.visible = isShakira;

  karaokeMicRob.visible = isKaraoke;
  karaokeMicVeg.visible = isKaraoke;

  forroHatRob.visible = isForro;
  forroHatVeg.visible = isForro;
  forroScarfRob.visible = isForro;
  forroScarfVeg.visible = isForro;

  freestyleHaloRob.visible = isFreestyle;
  freestyleHaloVeg.visible = isFreestyle;
  freestyleCuffRob.visible = isFreestyle;
  freestyleCuffVeg.visible = isFreestyle;

  saltoThrusterRob.visible = isSalto;
  saltoThrusterVeg.visible = isSalto;

  bateriaRingRob.visible = isBateriaTurbo;
  bateriaRingVegL.visible = isBateriaTurbo;
  bateriaRingVegR.visible = isBateriaTurbo;

  funkVisorRob.visible = isFunkPatricinha;
  funkCuffRob.visible = isFunkPatricinha;
  funkBowVeg.visible = isFunkPatricinha;
  funkAnkletVeg.visible = isFunkPatricinha;

  roupaRockRob.visible = isRockStage;
  roupaRockVeg.visible = isRockStage;

  roupaMjRob.visible = isMichael;
  roupaMjVeg.visible = isMichael;

  roupaShakiraRob.visible = isShakira;
  roupaShakiraVeg.visible = isShakira;

  roupaKaraokeRob.visible = isKaraoke;
  roupaKaraokeVeg.visible = isKaraoke;

  roupaForroRob.visible = isForro;
  roupaForroVeg.visible = isForro;

  roupaFreestyleRob.visible = isFreestyle;
  roupaFreestyleVeg.visible = isFreestyle;

  roupaSaltoRob.visible = isSalto;
  roupaSaltoVeg.visible = isSalto;

  roupaBateriaRob.visible = isBateriaTurbo;
  roupaBateriaVeg.visible = isBateriaTurbo;

  roupaFunkRob.visible = isFunkPatricinha;
  roupaFunkVeg.visible = isFunkPatricinha;

  const corCalca = isRockStage
    ? 0xef4444
    : isMichael
    ? 0xfacc15
    : isShakira
    ? 0xfbbf24
    : isForro
    ? 0xf59e0b
    : isFunkPatricinha
    ? 0xfacc15
    : 0x00f0ff;

  calcaRobL.visible = true;
  calcaRobR.visible = true;
  calcaRobL.children[1].material.color.setHex(corCalca);
  calcaRobL.children[1].material.emissive.setHex(corCalca);
  calcaRobR.children[1].material.color.setHex(corCalca);
  calcaRobR.children[1].material.emissive.setHex(corCalca);

  // =========================================================================
  // MOVIMENTOS MAIS NATURAIS E ORGÂNICOS PARA CADA ESTILO
  // =========================================================================
  const respiracao = Math.sin(t * 2.4) * 0.035;
  const balancoNatural = Math.sin(t * 3.2);

  if (isRockStage) {
    const pulso = 2.8 + Math.abs(Math.sin(t * 8)) * 2.2;
    robotoc.eyeL.material.color.setHex(0xff3b00);
    robotoc.eyeL.material.emissive.setHex(0xff2200);
    robotoc.eyeL.material.emissiveIntensity = pulso;
    robotoc.eyeR.material.color.setHex(0xff3b00);
    robotoc.eyeR.material.emissive.setHex(0xff2200);
    robotoc.eyeR.material.emissiveIntensity = pulso;

    vegatocnyx.eyeL.material.color.setHex(0xfb7185);
    vegatocnyx.eyeL.material.emissive.setHex(0xf43f5e);
    vegatocnyx.eyeL.material.emissiveIntensity = pulso;
    vegatocnyx.eyeR.material.color.setHex(0xfb7185);
    vegatocnyx.eyeR.material.emissive.setHex(0xf43f5e);
    vegatocnyx.eyeR.material.emissiveIntensity = pulso;

    rockRobGroup.rotation.z = Math.sin(t * 10) * 0.08;
    rockVegGroup.rotation.x = Math.sin(t * 12) * 0.1;

    // Movimento natural de Rock: headbang orgânico e base firme
    robotoc.headGroup.rotation.x = amortecerAngulo(robotoc.headGroup.rotation.x, Math.sin(t * 7.5) * 0.24, 0.28);
    robotoc.torsoGroup.rotation.x = amortecerAngulo(robotoc.torsoGroup.rotation.x, 0.12 + Math.sin(t * 3.8) * 0.06, 0.22);
    vegatocnyx.headGroup.rotation.x = amortecerAngulo(vegatocnyx.headGroup.rotation.x, Math.cos(t * 8.0) * 0.26, 0.28);
  } else if (isMichael) {
    robotoc.eyeL.material.color.setHex(0xfacc15);
    robotoc.eyeL.material.emissive.setHex(0xf59e0b);
    robotoc.eyeL.material.emissiveIntensity = 3.2;
    robotoc.eyeR.material.color.setHex(0x38bdf8);
    robotoc.eyeR.material.emissive.setHex(0x0284c7);
    robotoc.eyeR.material.emissiveIntensity = 3.2;

    vegatocnyx.eyeL.material.color.setHex(0xfacc15);
    vegatocnyx.eyeL.material.emissive.setHex(0xf59e0b);
    vegatocnyx.eyeL.material.emissiveIntensity = 3.2;
    vegatocnyx.eyeR.material.color.setHex(0x38bdf8);
    vegatocnyx.eyeR.material.emissive.setHex(0x0284c7);
    vegatocnyx.eyeR.material.emissiveIntensity = 3.2;

    mjHatRob.rotation.z = Math.sin(t * 4) * 0.08;
    mjHatVeg.rotation.z = -Math.sin(t * 4) * 0.08;
    mjGloveRob.rotation.z = Math.sin(t * 6) * 0.14;
    mjGloveVeg.rotation.z = -Math.sin(t * 6) * 0.14;

    // Movimento natural Michael Jackson: inclinação suave (lean), giro de ombros e passo fluido
    const leanMJ = Math.sin(t * 2.6) * 0.14;
    robotoc.torsoGroup.rotation.x = amortecerAngulo(robotoc.torsoGroup.rotation.x, Math.max(0, leanMJ), 0.18);
    robotoc.headGroup.rotation.y = amortecerAngulo(robotoc.headGroup.rotation.y, Math.sin(t * 5.2) * 0.22, 0.25);
    vegatocnyx.torsoGroup.rotation.x = amortecerAngulo(vegatocnyx.torsoGroup.rotation.x, Math.max(0, -leanMJ), 0.18);
    vegatocnyx.headGroup.rotation.y = amortecerAngulo(vegatocnyx.headGroup.rotation.y, -Math.sin(t * 5.2) * 0.22, 0.25);
  } else if (isShakira) {
    robotoc.eyeL.material.color.setHex(0xfbbf24);
    robotoc.eyeL.material.emissive.setHex(0xf59e0b);
    robotoc.eyeL.material.emissiveIntensity = 3.1;
    robotoc.eyeR.material.color.setHex(0xff2a85);
    robotoc.eyeR.material.emissive.setHex(0xec4899);
    robotoc.eyeR.material.emissiveIntensity = 3.1;

    vegatocnyx.eyeL.material.color.setHex(0xff2a85);
    vegatocnyx.eyeL.material.emissive.setHex(0xec4899);
    vegatocnyx.eyeL.material.emissiveIntensity = 3.3;
    vegatocnyx.eyeR.material.color.setHex(0xfbbf24);
    vegatocnyx.eyeR.material.emissive.setHex(0xf59e0b);
    vegatocnyx.eyeR.material.emissiveIntensity = 3.3;

    shakiraBeltRob.rotation.y = t * 2.5;
    shakiraBeltVeg.rotation.y = -t * 2.5;
    shakiraCuffRob.scale.setScalar(1 + Math.abs(Math.sin(t * 7)) * 0.12);
    shakiraCuffVeg.scale.setScalar(1 + Math.abs(Math.cos(t * 7)) * 0.12);

    // Movimento natural Shakira: gingado latino de quadril/torso e ondulação de ombros
    const gingado = Math.sin(t * 6.4) * 0.24;
    robotoc.torsoGroup.rotation.y = amortecerAngulo(robotoc.torsoGroup.rotation.y, gingado, 0.24);
    vegatocnyx.torsoGroup.rotation.y = amortecerAngulo(vegatocnyx.torsoGroup.rotation.y, -gingado * 1.25, 0.26);
    vegatocnyx.headGroup.rotation.z = amortecerAngulo(vegatocnyx.headGroup.rotation.z, Math.cos(t * 6.4) * 0.18, 0.22);
  } else if (isKaraoke) {
    const pulsoMic = 2.6 + Math.abs(Math.sin(t * 9)) * 1.8;
    robotoc.eyeL.material.color.setHex(0x00f0ff);
    robotoc.eyeL.material.emissive.setHex(0x00f0ff);
    robotoc.eyeL.material.emissiveIntensity = pulsoMic;
    robotoc.eyeR.material.color.setHex(0xff2a85);
    robotoc.eyeR.material.emissive.setHex(0xff007f);
    robotoc.eyeR.material.emissiveIntensity = pulsoMic;

    vegatocnyx.eyeL.material.color.setHex(0xff2a85);
    vegatocnyx.eyeL.material.emissive.setHex(0xff007f);
    vegatocnyx.eyeL.material.emissiveIntensity = pulsoMic;
    vegatocnyx.eyeR.material.color.setHex(0x00f0ff);
    vegatocnyx.eyeR.material.emissive.setHex(0x00f0ff);
    vegatocnyx.eyeR.material.emissiveIntensity = pulsoMic;

    karaokeMicRob.rotation.x = Math.sin(t * 6) * 0.14;
    karaokeMicVeg.rotation.x = Math.cos(t * 6) * 0.14;

    // Movimento natural Karaokê: interação entre a dupla e expressão vocal
    robotoc.headGroup.rotation.y = amortecerAngulo(robotoc.headGroup.rotation.y, 0.24 + Math.sin(t * 2.5) * 0.12, 0.2);
    vegatocnyx.headGroup.rotation.y = amortecerAngulo(vegatocnyx.headGroup.rotation.y, -0.24 + Math.cos(t * 2.5) * 0.12, 0.2);
  } else if (isForro) {
    robotoc.eyeL.material.color.setHex(0xfde047);
    robotoc.eyeL.material.emissive.setHex(0xf59e0b);
    robotoc.eyeL.material.emissiveIntensity = 3.1;
    robotoc.eyeR.material.color.setHex(0xf59e0b);
    robotoc.eyeR.material.emissive.setHex(0xd97706);
    robotoc.eyeR.material.emissiveIntensity = 3.1;

    vegatocnyx.eyeL.material.color.setHex(0xfb7185);
    vegatocnyx.eyeL.material.emissive.setHex(0xf43f5e);
    vegatocnyx.eyeL.material.emissiveIntensity = 3.2;
    vegatocnyx.eyeR.material.color.setHex(0xfde047);
    vegatocnyx.eyeR.material.emissive.setHex(0xf59e0b);
    vegatocnyx.eyeR.material.emissiveIntensity = 3.2;

    forroHatRob.rotation.z = Math.sin(t * 5) * 0.08;
    forroHatVeg.rotation.z = -Math.sin(t * 5) * 0.08;

    // Movimento natural Forró: dois-pra-lá dois-pra-cá e giro de saia
    const arrasta = Math.sin(t * 4.4) * 0.18;
    robotoc.torsoGroup.rotation.y = amortecerAngulo(robotoc.torsoGroup.rotation.y, arrasta, 0.22);
    vegatocnyx.torsoGroup.rotation.y = amortecerAngulo(vegatocnyx.torsoGroup.rotation.y, -arrasta, 0.22);
  } else if (isFreestyle) {
    freestyleHaloRob.rotation.z = t * 2.2;
    freestyleHaloVeg.rotation.z = -t * 2.2;
    freestyleCuffRob.scale.setScalar(1 + Math.abs(Math.sin(t * 6)) * 0.14);
    freestyleCuffVeg.scale.setScalar(1 + Math.abs(Math.cos(t * 6)) * 0.14);
    robotoc.eyeL.material.emissiveIntensity = 3.4;
    robotoc.eyeR.material.emissiveIntensity = 3.4;
    vegatocnyx.eyeL.material.emissiveIntensity = 3.3;
    vegatocnyx.eyeR.material.emissiveIntensity = 3.3;

    // Movimento natural Freestyle: balanço fluido de ombros e respiração rítmica
    robotoc.torsoGroup.rotation.x = amortecerAngulo(robotoc.torsoGroup.rotation.x, respiracao, 0.18);
    vegatocnyx.torsoGroup.rotation.x = amortecerAngulo(vegatocnyx.torsoGroup.rotation.x, -respiracao, 0.18);
  } else if (isSalto) {
    const escalaSalto = 1 + Math.abs(Math.sin(t * 7)) * 0.25;
    saltoThrusterRob.scale.setScalar(escalaSalto);
    saltoThrusterVeg.scale.setScalar(escalaSalto);
    robotoc.eyeL.material.emissiveIntensity = 3.4;
    robotoc.eyeR.material.emissiveIntensity = 3.4;
    vegatocnyx.eyeL.material.emissiveIntensity = 3.3;
    vegatocnyx.eyeR.material.emissiveIntensity = 3.3;

    // Movimento natural Salto Total: amortecimento de tronco no impulso
    robotoc.torsoGroup.rotation.x = amortecerAngulo(robotoc.torsoGroup.rotation.x, Math.abs(balancoNatural) * 0.12, 0.24);
    vegatocnyx.torsoGroup.rotation.x = amortecerAngulo(vegatocnyx.torsoGroup.rotation.x, Math.abs(balancoNatural) * 0.12, 0.24);
  } else if (isBateriaTurbo) {
    const pulsoTurbo = 1 + Math.abs(Math.sin(t * 11)) * 0.22;
    bateriaRingRob.scale.setScalar(pulsoTurbo);
    bateriaRingVegL.scale.setScalar(pulsoTurbo);
    bateriaRingVegR.scale.setScalar(pulsoTurbo);
    robotoc.eyeL.material.emissiveIntensity = 3.4;
    robotoc.eyeR.material.emissiveIntensity = 3.4;
    vegatocnyx.eyeL.material.emissiveIntensity = 3.3;
    vegatocnyx.eyeR.material.emissiveIntensity = 3.3;

    // Movimento natural Bateria Turbo: inclinação dinâmica sobre o kit
    vegatocnyx.torsoGroup.rotation.x = amortecerAngulo(vegatocnyx.torsoGroup.rotation.x, 0.14 + Math.sin(t * 9) * 0.06, 0.26);
  } else if (isFunkPatricinha) {
    const pulsoFunk = 1 + Math.abs(Math.sin(t * 8)) * 0.16;
    funkVisorRob.rotation.z = Math.sin(t * 5) * 0.06;
    funkCuffRob.scale.setScalar(pulsoFunk);
    funkBowVeg.rotation.z = Math.sin(t * 7) * 0.14;
    funkAnkletVeg.scale.setScalar(pulsoFunk);
    robotoc.eyeL.material.emissiveIntensity = 3.4;
    robotoc.eyeR.material.emissiveIntensity = 3.4;
    vegatocnyx.eyeL.material.emissiveIntensity = 3.3;
    vegatocnyx.eyeR.material.emissiveIntensity = 3.3;

    // Movimento natural Funk: postura despojada do Robotoc e rebolado suave da Vegatocnyx
    robotoc.torsoGroup.rotation.x = amortecerAngulo(robotoc.torsoGroup.rotation.x, -0.08 + Math.sin(t * 4) * 0.05, 0.2);
    vegatocnyx.headGroup.rotation.y = amortecerAngulo(vegatocnyx.headGroup.rotation.y, Math.sin(t * 5.5) * 0.2, 0.22);
  } else {
    robotoc.eyeL.material.emissiveIntensity = 3.4;
    robotoc.eyeR.material.emissiveIntensity = 3.4;
    vegatocnyx.eyeL.material.emissiveIntensity = 3.3;
    vegatocnyx.eyeR.material.emissiveIntensity = 3.3;
    robotoc.torsoGroup.rotation.x = amortecerAngulo(robotoc.torsoGroup.rotation.x, respiracao, 0.15);
    vegatocnyx.torsoGroup.rotation.x = amortecerAngulo(vegatocnyx.torsoGroup.rotation.x, -respiracao, 0.15);
  }
}