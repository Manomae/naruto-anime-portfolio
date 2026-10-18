import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// =========================================================================================
// 🌲 CLASS CORE: ENGINE DO MAPA AGROFLORESTAL 3D (SISTEMA SAF)
// =========================================================================================
class MapaAgroflorestalEngine {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    if (!this.container) {
      throw new Error(`Container do Mapa Agroflorestal não encontrado.`);
    }

    // Configurações do Sistema SAF
    this.options = {
      tipoSAF: options.tipoSAF || 'sucessional', // 'simples', 'complexo', 'agropastoril', 'sucessional'
      tamanhoTerreno: options.tamanhoTerreno || 100,
      densidadeArvore: options.densidadeArvore || 0.6,
      comAnimais: options.comAnimais || false,
      velocidadeDiaNoite: options.velocidadeDiaNoite || 1,
      horaInicial: options.horaInicial || 12,
      ...options
    };

    // Componentes Three.js
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.sol = null;
    this.lua = null;
    this.luzAmbiente = null;
    this.elementosSAF = [];
    this.animais = [];

    // Raycaster / Seleção 3D
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Sistema de Chuva
    this.chuvaAtiva = false;
    this.particulasChuva = null;
    this.geometriaChuva = null;
    this.quantidadeGotas = 2500;

    // Estado do Ciclo Dia/Noite (Formato 24h)
    this.horaDia = this.options.horaInicial; 
    this.pausadoCiclo = false;

    // Dados do Solo
    this.statusSolo = {
      umidade: 55,           // %
      materiaOrganica: 6.4,  // %
      pH: 6.5,               // pH
      atividadeBiologica: 82 // %
    };

    this.init();
  }

  init() {
    // 1. Cena
    this.scene = new THREE.Scene();

    // 2. Câmera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(60, 40, 80);

    // 3. Renderizador WebGL
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Não atravessa o solo
    this.controls.minDistance = 10;
    this.controls.maxDistance = 200;
    this.controls.target.set(0, 5, 0);

    // 5. Iluminação e Sol/Lua para Ciclo Dia/Noite
    this.setupIluminacaoEDiaNoite();

    // 6. Terreno fértil (Solo Vivo)
    this.gerarTerreno();

    // 7. Popular Agrofloresta
    this.construirSAF();

    // 8. Efeito de Chuva / Irrigação
    this.setupSistemaChuva();

    // 9. UI e Painéis
    this.criarPainelStatusSolo();
    this.criarPainelControleDiaNoite();
    this.criarPainelIrrigacao();
    this.criarModalDetalhesEspecie();

    // Eventos
    this.resizeHandler = () => this.onWindowResize();
    this.pointerHandler = (e) => this.onPointerDown(e);

    window.addEventListener('resize', this.resizeHandler);
    this.renderer.domElement.addEventListener('pointerdown', this.pointerHandler);

    // Loop de Animação
    this.animate();
  }

  setupIluminacaoEDiaNoite() {
    this.luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.luzAmbiente);

    this.sol = new THREE.DirectionalLight(0xfff5d6, 2.0);
    this.sol.castShadow = true;
    this.sol.shadow.mapSize.width = 2048;
    this.sol.shadow.mapSize.height = 2048;
    this.sol.shadow.camera.near = 0.5;
    this.sol.shadow.camera.far = 300;

    const d = 90;
    this.sol.shadow.camera.left = -d;
    this.sol.shadow.camera.right = d;
    this.sol.shadow.camera.top = d;
    this.sol.shadow.camera.bottom = -d;
    this.scene.add(this.sol);

    this.lua = new THREE.DirectionalLight(0x7391c8, 0.4);
    this.lua.castShadow = false;
    this.scene.add(this.lua);

    this.atualizarPosicaoAstroEIluminacao();
  }

  atualizarPosicaoAstroEIluminacao() {
    const angulo = ((this.horaDia - 6) / 24) * Math.PI * 2;
    const raio = 120;

    const solX = Math.cos(angulo) * raio;
    const solY = Math.sin(angulo) * raio;
    const solZ = Math.sin(angulo * 0.5) * 30;

    this.sol.position.set(solX, solY, solZ);
    this.lua.position.set(-solX, -solY, -solZ);

    if (solY > 0) {
      // Dia
      const tomCeu = new THREE.Color().lerpColors(
        new THREE.Color(0xfd5e53),
        new THREE.Color(0x87ceeb),
        Math.min(1, solY / 30)
      );
      this.scene.background = tomCeu;
      this.scene.fog = new THREE.FogExp2(tomCeu, 0.004);

      this.sol.intensity = Math.max(0.2, (solY / raio) * 2.5);
      this.lua.intensity = 0;
      this.luzAmbiente.color.setHex(0xdff0d8);
      this.luzAmbiente.intensity = 0.6 + (solY / raio) * 0.4;
    } else {
      // Noite
      const tomCeuNoite = new THREE.Color(0x0a0e1a);
      this.scene.background = tomCeuNoite;
      this.scene.fog = new THREE.FogExp2(tomCeuNoite, 0.006);

      this.sol.intensity = 0;
      this.lua.intensity = 0.5;
      this.luzAmbiente.color.setHex(0x1a2636);
      this.luzAmbiente.intensity = 0.2;
    }

    const RelogioEl = document.getElementById('relogio-hora-saf');
    if (RelogioEl) {
      const horas = Math.floor(this.horaDia).toString().padStart(2, '0');
      const minutos = Math.floor((this.horaDia % 1) * 60).toString().padStart(2, '0');
      RelogioEl.innerText = `${horas}:${minutos}`;
    }
  }

  gerarTerreno() {
    const size = this.options.tamanhoTerreno;
    const geometry = new THREE.PlaneGeometry(size, size, 64, 64);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.5;
      pos.setY(i, y);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0x3d2314,
      roughness: 0.9,
      metalness: 0.1
    });

    const terreno = new THREE.Mesh(geometry, material);
    terreno.receiveShadow = true;
    this.scene.add(terreno);
  }

  construirSAF() {
    const quantidade = Math.floor(this.options.tamanhoTerreno * this.options.densidadeArvore);

    for (let i = 0; i < quantidade; i++) {
      const x = (Math.random() - 0.5) * (this.options.tamanhoTerreno - 10);
      const z = (Math.random() - 0.5) * (this.options.tamanhoTerreno - 10);

      const tipo = Math.random();
      if (tipo > 0.75) {
        this.criarArvore(x, z, {
          nome: 'Castanheira / Jatobá',
          estrato: 'Emergente (Luz Direta)',
          funcao: 'Produção de madeira, biomassa e sombra para o sistema',
          altura: 14,
          corCopa: 0x1b4332,
          raioCopa: 4.0,
          fruto: false
        });
      } else if (tipo > 0.45) {
        this.criarArvore(x, z, {
          nome: 'Laranjeira / Mangueira',
          estrato: 'Alto / Médio',
          funcao: 'Produção comercial de frutas e diversificação de renda',
          altura: 8,
          corCopa: 0x2d6a4f,
          raioCopa: 2.5,
          fruto: true
        });
      } else if (tipo > 0.2) {
        this.criarArvore(x, z, {
          nome: 'Cacau / Café',
          estrato: 'Médio / Baixo (Sombra Parcial)',
          funcao: 'Cultura de sub-bosque rica em valor agregado',
          altura: 5,
          corCopa: 0x40916c,
          raioCopa: 1.8,
          fruto: true
        });
      } else {
        this.criarPlantaRasteira(x, z, {
          nome: 'Mandioca / Plantas Medicinais',
          estrato: 'Rasteiro / Solo',
          funcao: 'Cobrimento vegetal, fixação de nutrientes e alimento rápido'
        });
      }
    }

    if (this.options.tipoSAF === 'agropastoril' || this.options.comAnimais) {
      this.gerarAnimais();
    }
  }

  criarArvore(x, z, config) {
    const grupo = new THREE.Group();

    const geoTronco = new THREE.CylinderGeometry(0.3, 0.5, config.altura, 8);
    const matTronco = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 });
    const tronco = new THREE.Mesh(geoTronco, matTronco);
    tronco.position.y = config.altura / 2;
    tronco.castShadow = true;
    tronco.receiveShadow = true;
    grupo.add(tronco);

    const geoCopa = new THREE.DodecahedronGeometry(config.raioCopa, 1);
    const matCopa = new THREE.MeshStandardMaterial({ color: config.corCopa, roughness: 0.6 });
    const copa = new THREE.Mesh(geoCopa, matCopa);
    copa.position.y = config.altura;
    copa.castShadow = true;
    copa.receiveShadow = true;
    grupo.add(copa);

    if (config.fruto) {
      const geoFruto = new THREE.SphereGeometry(0.35, 8, 8);
      const matFruto = new THREE.MeshStandardMaterial({ color: 0xffa726, roughness: 0.3 });

      for (let i = 0; i < 6; i++) {
        const fruto = new THREE.Mesh(geoFruto, matFruto);
        fruto.position.set(
          (Math.random() - 0.5) * config.raioCopa,
          config.altura + (Math.random() - 0.5) * config.raioCopa,
          (Math.random() - 0.5) * config.raioCopa
        );
        grupo.add(fruto);
      }
    }

    grupo.position.set(x, 0, z);

    grupo.userData = {
      nome: config.nome,
      estrato: config.estrato,
      funcao: config.funcao,
      comFrutos: config.fruto ? 'Sim (Em Frutificação)' : 'Não'
    };

    this.scene.add(grupo);
    this.elementosSAF.push(grupo);
  }

  criarPlantaRasteira(x, z, config) {
    const geo = new THREE.ConeGeometry(0.8, 1.2, 5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x7cfc00, roughness: 0.5 });
    const planta = new THREE.Mesh(geo, mat);
    planta.position.set(x, 0.6, z);
    planta.castShadow = true;

    planta.userData = {
      nome: config.nome,
      estrato: config.estrato,
      funcao: config.funcao,
      comFrutos: 'N/A'
    };

    this.scene.add(planta);
    this.elementosSAF.push(planta);
  }

  gerarAnimais() {
    for (let i = 0; i < 5; i++) {
      const animal = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(1.2, 0.8, 1.8);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const body = new THREE.Mesh(bodyGeo, mat);
      body.position.y = 0.8;
      body.castShadow = true;
      animal.add(body);

      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      animal.position.set(x, 0, z);

      this.scene.add(animal);
      this.animais.push(animal);
    }
  }

  setupSistemaChuva() {
    this.geometriaChuva = new THREE.BufferGeometry();
    const posicoes = new Float32Array(this.quantidadeGotas * 3);
    const tamanhos = this.options.tamanhoTerreno;

    for (let i = 0; i < this.quantidadeGotas * 3; i += 3) {
      posicoes[i] = (Math.random() - 0.5) * tamanhos;
      posicoes[i + 1] = Math.random() * 60;
      posicoes[i + 2] = (Math.random() - 0.5) * tamanhos;
    }

    this.geometriaChuva.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));

    const materialChuva = new THREE.PointsMaterial({
      color: 0x80d8ff,
      size: 0.5,
      transparent: true,
      opacity: 0.7
    });

    this.particulasChuva = new THREE.Points(this.geometriaChuva, materialChuva);
    this.particulasChuva.visible = false;
    this.scene.add(this.particulasChuva);
  }

  animarChuva() {
    if (!this.chuvaAtiva) return;

    const pos = this.geometriaChuva.attributes.position;
    for (let i = 1; i < pos.count * 3; i += 3) {
      pos.array[i] -= 1.8;
      if (pos.array[i] < 0) {
        pos.array[i] = 60;
      }
    }
    pos.needsUpdate = true;

    if (this.statusSolo.umidade < 100) {
      this.statusSolo.umidade = Math.min(100, +(this.statusSolo.umidade + 0.15).toFixed(1));
      this.statusSolo.atividadeBiologica = Math.min(100, +(this.statusSolo.atividadeBiologica + 0.05).toFixed(1));
      this.atualizarExibicaoStatusSolo();
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      let objetoSelecionado = intersects[0].object;

      while (objetoSelecionado.parent && objetoSelecionado.parent !== this.scene && !objetoSelecionado.userData.nome) {
        objetoSelecionado = objetoSelecionado.parent;
      }

      if (objetoSelecionado.userData && objetoSelecionado.userData.nome) {
        this.exibirDetalhesEspecie(objetoSelecionado.userData);
      }
    }
  }

  criarModalDetalhesEspecie() {
    const modalExistente = document.getElementById('modal-especie-saf');
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-especie-saf';
    modal.style.cssText = `position: absolute; top: 50%; left: 20px; transform: translateY(-50%); background: rgba(15, 23, 16, 0.9); backdrop-filter: blur(10px); border: 1px solid rgba(129, 199, 132, 0.5); border-radius: 16px; padding: 20px; color: #fff; font-family: 'Segoe UI', sans-serif; width: 280px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5); display: none; z-index: 1001;`;

    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 id="modal-nome" style="margin: 0; font-size: 16px; color: #81c784;">🌳 Espécie</h3>
        <button id="modal-fechar" style="background: transparent; border: none; color: #aaa; cursor: pointer; font-size: 16px;">✕</button>
      </div>
      <div style="font-size: 13px; display: flex; flex-direction: column; gap: 8px;">
        <div><strong>Estrato:</strong> <span id="modal-estrato" style="color: #a5d6a7;">-</span></div>
        <div><strong>Função no SAF:</strong> <span id="modal-funcao" style="color: #e0e0e0;">-</span></div>
        <div><strong>Frutificação:</strong> <span id="modal-frutos" style="color: #ffcc80;">-</span></div>
      </div>
    `;

    this.container.appendChild(modal);

    document.getElementById('modal-fechar').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  exibirDetalhesEspecie(data) {
    const modal = document.getElementById('modal-especie-saf');
    if (!modal) return;

    document.getElementById('modal-nome').innerText = `🌿 ${data.nome}`;
    document.getElementById('modal-estrato').innerText = data.estrato;
    document.getElementById('modal-funcao').innerText = data.funcao;
    document.getElementById('modal-frutos').innerText = data.comFrutos;

    modal.style.display = 'block';
  }

  criarPainelIrrigacao() {
    const btnExistente = document.getElementById('btn-irrigacao-saf');
    if (btnExistente) btnExistente.remove();

    const btnIrrigacao = document.createElement('button');
    btnIrrigacao.id = 'btn-irrigacao-saf';
    btnIrrigacao.innerText = '🌧️ Ativar Chuva / Irrigação';
    btnIrrigacao.style.cssText = `position: absolute; top: 20px; left: 20px; background: rgba(3, 169, 244, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px; padding: 10px 18px; color: #fff; font-family: 'Segoe UI', sans-serif; font-weight: bold; font-size: 13px; cursor: pointer; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); z-index: 1000; transition: all 0.3s;`;

    btnIrrigacao.addEventListener('click', () => {
      this.chuvaAtiva = !this.chuvaAtiva;
      this.particulasChuva.visible = this.chuvaAtiva;

      if (this.chuvaAtiva) {
        btnIrrigacao.innerText = '☀️ Desativar Chuva';
        btnIrrigacao.style.background = 'rgba(239, 108, 0, 0.85)';
      } else {
        btnIrrigacao.innerText = '🌧️ Ativar Chuva / Irrigação';
        btnIrrigacao.style.background = 'rgba(3, 169, 244, 0.85)';
      }
    });

    this.container.appendChild(btnIrrigacao);
  }

  criarPainelControleDiaNoite() {
    const painelExistente = document.getElementById('painel-dianoite-saf');
    if (painelExistente) painelExistente.remove();

    const painel = document.createElement('div');
    painel.id = 'painel-dianoite-saf';
    painel.style.cssText = `position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 16, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(255, 235, 59, 0.4); border-radius: 30px; padding: 10px 24px; color: #fff; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; gap: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); z-index: 1000;`;

    painel.innerHTML = `
      <span style="font-size: 18px;">☀️ / 🌙</span>
      <span id="relogio-hora-saf" style="font-weight: bold; font-size: 16px; min-width: 50px;">12:00</span>
      <input type="range" id="slider-hora-saf" min="0" max="24" step="0.1" value="${this.horaDia}" style="cursor: pointer; width: 140px;">
      <button id="btn-pause-saf" style="background: #388e3c; border: none; color: white; padding: 6px 12px; border-radius: 12px; cursor: pointer; font-size: 12px;">Pausar</button>
    `;

    this.container.appendChild(painel);

    const slider = document.getElementById('slider-hora-saf');
    const btnPause = document.getElementById('btn-pause-saf');

    slider.addEventListener('input', (e) => {
      this.horaDia = parseFloat(e.target.value);
      this.atualizarPosicaoAstroEIluminacao();
    });

    btnPause.addEventListener('click', () => {
      this.pausadoCiclo = !this.pausadoCiclo;
      btnPause.innerText = this.pausadoCiclo ? 'Iniciar' : 'Pausar';
      btnPause.style.background = this.pausadoCiclo ? '#f57c00' : '#388e3c';
    });
  }

  criarPainelStatusSolo() {
    const painelExistente = document.getElementById('painel-solo-saf');
    if (painelExistente) painelExistente.remove();

    const painel = document.createElement('div');
    painel.id = 'painel-solo-saf';
    painel.style.cssText = `position: absolute; top: 20px; right: 20px; background: rgba(15, 23, 16, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(76, 175, 80, 0.4); border-radius: 12px; padding: 16px 20px; color: #e8f5e9; font-family: 'Segoe UI', sans-serif; width: 230px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); z-index: 1000;`;

    painel.innerHTML = `
      <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #81c784; display: flex; align-items: center; gap: 8px;">
        🌱 Status do Solo
      </h3>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
        <div>Umidade: <strong id="val-umidade">${this.statusSolo.umidade}%</strong></div>
        <div>Matéria Orgânica: <strong id="val-mo">${this.statusSolo.materiaOrganica}%</strong></div>
        <div>pH: <strong id="val-ph">${this.statusSolo.pH}</strong></div>
        <div>Atividade Biológica: <strong id="val-bio">${this.statusSolo.atividadeBiologica}%</strong></div>
      </div>
    `;

    this.container.appendChild(painel);
  }

  atualizarExibicaoStatusSolo() {
    const elUmidade = document.getElementById('val-umidade');
    const elBio = document.getElementById('val-bio');

    if (elUmidade) elUmidade.innerText = `${this.statusSolo.umidade}%`;
    if (elBio) elBio.innerText = `${this.statusSolo.atividadeBiologica}%`;
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (!this.pausadoCiclo) {
      this.horaDia = (this.horaDia + 0.01 * this.options.velocidadeDiaNoite) % 24;
      this.atualizarPosicaoAstroEIluminacao();

      if (!this.chuvaAtiva && this.horaDia > 8 && this.horaDia < 17 && this.statusSolo.umidade > 30) {
        this.statusSolo.umidade = Math.max(30, +(this.statusSolo.umidade - 0.01).toFixed(1));
        this.atualizarExibicaoStatusSolo();
      }

      const slider = document.getElementById('slider-hora-saf');
      if (slider) slider.value = this.horaDia;
    }

    this.animarChuva();

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeHandler);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.pointerHandler);
      if (this.container && this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}

// =========================================================================================
// ⚛️ PAGE COMPONENT: ROUTE /mapaagroflorestal (NEXT.JS REACT COMPONENT)
// =========================================================================================
export default function MapaAgroflorestalPage() {
  const mountRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Inicializa o Engine 3D Agroflorestal completo
    engineRef.current = new MapaAgroflorestalEngine(mountRef.current, {
      tipoSAF: 'sucessional',
      tamanhoTerreno: 100,
      densidadeArvore: 0.6,
      comAnimais: true,
      velocidadeDiaNoite: 1,
      horaInicial: 12
    });

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#052e16', overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif' }}>
      <Head>
        <title>🌲 Mapa Agroflorestal 3D | Emanuel.OS Workstation</title>
      </Head>

      {/* Botão de Voltar para a Central Emanuel.OS */}
      <div style={{
        position: 'absolute', top: '20px', left: '200px', zIndex: 1002,
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <Link href="/" style={{
          padding: '10px 16px', backgroundColor: 'rgba(21, 128, 61, 0.9)',
          color: '#ffffff', borderRadius: '20px', textDecoration: 'none',
          fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)'
        }}>
          ⬅ Voltar à Central Emanuel.OS
        </Link>
      </div>

      {/* Container Principal onde o Three.js e as interfaces da Engine serão renderizados */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
    </div>
  );
}