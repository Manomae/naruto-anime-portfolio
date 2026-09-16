import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GoogleGenAI } from '@google/genai';

// ==========================================
// 1. MAPA 3D DA PROGRESSÃO GEOMÉTRICA (THREE.JS)
// ==========================================

export class GeometricProgressionMap3D {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.init();
  }

  init() {
    this.renderer.setSize(this.container.clientWidth || window.innerWidth, this.container.clientHeight || window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(15, 15, 25);

    // Controles de Câmera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(10, 20, 15);
    this.scene.add(ambientLight, dirLight);

    // Grade de referência 3D
    const gridHelper = new THREE.GridHelper(30, 30, 0x00ffcc, 0x333333);
    this.scene.add(gridHelper);

    // Grupo de Objetos da PG
    this.pgGroup = new THREE.Group();
    this.scene.add(this.pgGroup);

    this.onResize = () => this.onWindowResize();
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  renderPG(a1, q, nTerms) {
    while (this.pgGroup.children.length > 0) {
      const obj = this.pgGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    const points = [];
    const validTerms = Math.min(Math.max(nTerms, 1), 30);

    for (let n = 1; n <= validTerms; n++) {
      const val = a1 * Math.pow(q, n - 1);

      const x = (n - 1) * 2 - (validTerms * 0.9);
      const y = Math.min(Math.max(val / 2, -50), 50);
      const z = Math.sin(n * 0.5) * 2;

      const height = Math.max(Math.abs(y * 2), 0.2);
      const geometry = new THREE.CylinderGeometry(0.35, 0.35, height, 16);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${(n * 40) % 360}, 100%, 50%)`),
        shininess: 90
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y >= 0 ? height / 2 : -height / 2, z);
      this.pgGroup.add(mesh);

      points.push(new THREE.Vector3(x, y >= 0 ? height : -height, z));
    }

    if (points.length > 1) {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
      const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
      this.pgGroup.add(tubeMesh);
    }
  }

  animate() {
    this.animFrame = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

// ==========================================
// 2. INTEGRAÇÃO MULTIMODAL COM GEMINI API
// ==========================================

export class MathSolverAI {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async solveProblem({ text, imageFile, audioBlob }) {
    const contents = [];

    // 1. Processa foto/imagem se houver
    if (imageFile) {
      const imageBase64 = await this.fileToBase64(imageFile);
      contents.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageFile.type || 'image/png'
        }
      });
    }

    // 2. Processa gravação de áudio em tempo real se houver
    if (audioBlob) {
      const audioBase64 = await this.fileToBase64(audioBlob);
      contents.push({
        inlineData: {
          data: audioBase64,
          mimeType: 'audio/webm'
        }
      });
    }

    // 3. Processa texto digitado, copiado ou prompt base
    let promptText = text ? text : '';
    if (!promptText) {
      if (imageFile && audioBlob) {
        promptText = 'Ouça o áudio do usuário e execute a instrução solicitada com base na imagem fornecida.';
      } else if (audioBlob) {
        promptText = 'Transcreva e resolva a instrução ou problema matemático gravado no áudio.';
      } else if (imageFile) {
        promptText = 'Analise a imagem fornecida e resolva o problema matemático contido nela.';
      }
    }
    
    contents.push(promptText);

    const systemPrompt = `
      Você é um assistente especialista em matemática e análise multimodal.
      
      Instruções de Resposta:
      1. Se o usuário forneceu áudio e imagem, interprete o comando falado no áudio em relação ao conteúdo visual da imagem.
      2. Aceite e interprete com precisão perguntas, expressões matemáticas, textos copiados da internet ou descrições em linguagem natural.
      3. Resolva o problema matemático passo a passo de forma clara.
      4. Se o problema envolver ou puder ser representado por uma Progressão Geométrica (PG), inclua obrigatoriamente no final da resposta a seguinte linha exata em formato JSON:
         [PG_DATA]: {"a1": numero, "q": numero, "n": numero}
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt
      }
    });

    return response.text;
  }
}

// ==========================================
// 3. INTERFACE DE USUÁRIO (UI / CAPTURA MULTIMODAL)
// ==========================================

export class MathUIController {
  constructor(map3d, solverAI) {
    this.map3d = map3d;
    this.solverAI = solverAI;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordedAudioBlob = null;

    this.createUI();
    this.attachEvents();
  }

  createUI() {
    if (document.getElementById('math-ui-panel')) return;

    const style = document.createElement('style');
    style.id = 'math-ui-style';
    style.textContent = `
      #math-ui-panel {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 100;
        background: rgba(18, 24, 38, 0.85);
        backdrop-filter: blur(8px);
        border: 1px solid #00ffcc44;
        border-radius: 12px;
        padding: 16px;
        color: #fff;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        width: 320px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      }
      #math-ui-panel h3 { margin: 0 0 12px 0; color: #00ffcc; font-size: 1.1rem; }
      .ui-group { margin-bottom: 12px; }
      .ui-group label { display: block; font-size: 0.8rem; color: #aaa; margin-bottom: 4px; }
      .ui-group input[type="number"], .ui-group textarea {
        width: 100%; padding: 8px; background: rgba(255,255,255,0.08); border: 1px solid #444;
        border-radius: 6px; color: #fff; box-sizing: border-box; font-size: 0.9rem;
      }
      .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
      .btn {
        background: #0088cc; color: #fff; border: none; padding: 8px 12px; border-radius: 6px;
        cursor: pointer; font-size: 0.85rem; font-weight: bold; transition: all 0.2s;
      }
      .btn:hover { background: #00aaff; }
      .btn-accent { background: #00cc88; }
      .btn-accent:hover { background: #00ffaa; color: #000; }
      .btn-danger { background: #cc3333; }
      .btn-danger:hover { background: #ff4444; }
      #response-box {
        background: rgba(0,0,0,0.4); padding: 10px; border-radius: 6px; border-left: 3px solid #00ffcc;
        font-size: 0.85rem; white-space: pre-wrap; max-height: 200px; overflow-y: auto; margin-top: 10px;
      }
      .file-input-wrapper { position: relative; overflow: hidden; display: inline-block; width: 100%; }
      .file-input-wrapper input[type=file] { position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; height: 100%; width: 100%; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'math-ui-panel';
    panel.innerHTML = `
      <h3>PG 3D + Gemini AI Solver</h3>
      
      <div class="ui-group">
        <label>Termo Inicial (a1) / Razão (q) / Termos (n)</label>
        <div style="display: flex; gap: 6px;">
          <input type="number" id="input-a1" value="1" step="any" placeholder="a1">
          <input type="number" id="input-q" value="1.5" step="any" placeholder="q">
          <input type="number" id="input-n" value="10" min="1" max="30" placeholder="n">
        </div>
      </div>
      <button id="btn-update-pg" class="btn btn-accent" style="width: 100%; margin-bottom: 12px;">Atualizar Gráfico 3D</button>

      <hr style="border-color: #333; margin: 12px 0;">

      <div class="ui-group">
        <label>Enviar Foto / Imagem do Problema:</label>
        <div class="file-input-wrapper">
          <button class="btn" style="width: 100%;">Selecionar ou Tirar Foto 📷</button>
          <input type="file" id="input-file" accept="image/*">
        </div>
        <span id="file-name-display" style="font-size: 0.75rem; color: #00ffcc; display: block; margin-top: 4px;"></span>
      </div>

      <div class="ui-group">
        <label>Gravação de Áudio ao Vivo (Microfone):</label>
        <div class="btn-grid">
          <button id="btn-record-audio" class="btn">Grave Voz 🎙️</button>
          <button id="btn-stop-audio" class="btn btn-danger" disabled>Parar ⏹️</button>
        </div>
        <audio id="audio-preview" controls style="width: 100%; display: none; margin-top: 6px;"></audio>
      </div>

      <div class="ui-group">
        <label>Ou digite / cole a questão matemática:</label>
        <textarea id="input-text-prompt" rows="2" placeholder="Ex: Qual a soma dos 10 primeiros termos de uma PG com a1=2 e q=3?"></textarea>
      </div>

      <button id="btn-submit-ai" class="btn btn-accent" style="width: 100%;">Analisar & Resolver com Gemini ✨</button>

      <div id="response-box" style="display: none;"></div>
    `;

    document.body.appendChild(panel);
  }

  attachEvents() {
    document.getElementById('btn-update-pg')?.addEventListener('click', () => {
      const a1 = parseFloat(document.getElementById('input-a1').value) || 1;
      const q = parseFloat(document.getElementById('input-q').value) || 1;
      const n = parseInt(document.getElementById('input-n').value) || 10;
      this.map3d.renderPG(a1, q, n);
    });

    const fileInput = document.getElementById('input-file');
    fileInput?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        document.getElementById('file-name-display').textContent = `Imagem anexada: ${e.target.files[0].name}`;
      }
    });

    const recordBtn = document.getElementById('btn-record-audio');
    const stopBtn = document.getElementById('btn-stop-audio');
    const audioPreview = document.getElementById('audio-preview');

    recordBtn?.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.recordedAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          audioPreview.src = URL.createObjectURL(this.recordedAudioBlob);
          audioPreview.style.display = 'block';
        };

        this.mediaRecorder.start();
        recordBtn.disabled = true;
        stopBtn.disabled = false;
        recordBtn.textContent = 'Gravando... 🔴';
      } catch (err) {
        alert('Acesso ao microfone negado ou não suportado no navegador: ' + err.message);
      }
    });

    stopBtn?.addEventListener('click', () => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        recordBtn.disabled = false;
        stopBtn.disabled = true;
        recordBtn.textContent = 'Grave Voz 🎙️';
      }
    });

    document.getElementById('btn-submit-ai')?.addEventListener('click', () => this.handleAISubmission());
  }

  async handleAISubmission() {
    const responseBox = document.getElementById('response-box');
    const textPrompt = document.getElementById('input-text-prompt').value;
    const fileInput = document.getElementById('input-file');
    
    let imageFile = fileInput.files.length > 0 ? fileInput.files[0] : null;
    let audioBlob = this.recordedAudioBlob;

    if (!textPrompt && !imageFile && !audioBlob) {
      alert('Por favor, digite um texto, anexe uma imagem ou grave um áudio para prosseguir.');
      return;
    }

    responseBox.style.display = 'block';
    responseBox.textContent = 'Analisando problema com o Gemini AI... Aguarde.';

    try {
      const resultText = await this.solverAI.solveProblem({
        text: textPrompt,
        imageFile: imageFile,
        audioBlob: audioBlob
      });

      responseBox.textContent = resultText;

      const pgMatch = resultText.match(/\[PG_DATA\]:\s*(\{.*\})/);
      if (pgMatch) {
        try {
          const pgData = JSON.parse(pgMatch[1]);
          document.getElementById('input-a1').value = pgData.a1;
          document.getElementById('input-q').value = pgData.q;
          document.getElementById('input-n').value = pgData.n || 10;
          this.map3d.renderPG(pgData.a1, pgData.q, pgData.n || 10);
        } catch (e) {
          console.warn('Falha ao processar JSON de PG:', e);
        }
      }
    } catch (err) {
      responseBox.textContent = 'Erro ao consultar a IA: ' + err.message;
    }
  }

  destroy() {
    const panel = document.getElementById('math-ui-panel');
    const style = document.getElementById('math-ui-style');
    if (panel) panel.remove();
    if (style) style.remove();
  }
}

// ==========================================
// 4. COMPONENTE REACT (NEXT.JS COMPATÍVEL)
// ==========================================

export default function GeometricMapPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'SUA_CHAVE_API_GEMINI';

    const map3D = new GeometricProgressionMap3D(containerRef.current);
    map3D.renderPG(1, 1.5, 10);

    const solverAI = new MathSolverAI(API_KEY);
    const uiController = new MathUIController(map3D, solverAI);

    return () => {
      uiController.destroy();
      map3D.destroy();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="canvas-container" 
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }} 
    />
  );
}
