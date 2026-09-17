import * as THREE from 'three';
import { PDFDocument } from 'pdf-lib';

/**
 * Módulo Complementar Isolado (Não altera arquivos existentes)
 */
export class InputManager {
  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
      if (this.recognition) {
        this.recognition.continuous = false;
        this.recognition.lang = 'pt-BR';
      }
    }
  }

  listenAudio() {
    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject('Reconhecimento de voz não suportado neste navegador.');
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (err) => reject(err);
      this.recognition.start();
    });
  }

  processMessage(text) {
    return text ? text.trim() : '';
  }
}

export class OfflineVisionEngine {
  async processImage(imageElement) {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 224;
    canvas.height = 224;
    ctx.drawImage(imageElement, 0, 0, 224, 224);
    
    const imageData = ctx.getImageData(0, 0, 224, 224);
    
    return {
      status: "Processado Offline",
      dimensions: { width: canvas.width, height: canvas.height },
      rawDataLength: imageData.data.length
    };
  }
}

export class MathEngine {
  evaluate(expression) {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/().^sqrtMathpi]/g, '');
      return Function(`"use strict"; return (${sanitized})`)();
    } catch (e) {
      return "Erro no cálculo: Expressão inválida.";
    }
  }

  calculateAdvanced(type, params) {
    switch(type) {
      case 'area_circle':
        return Math.PI * Math.pow(params.radius, 2);
      case 'velocity':
        return params.distance / params.time;
      default:
        return null;
    }
  }
}

export class Robot3DRenderer {
  constructor(containerId) {
    if (typeof window === 'undefined') return;
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.renderer.setSize(this.container.clientWidth || 300, this.container.clientHeight || 300);
    this.container.appendChild(this.renderer.domElement);
    this.initRobot();
  }

  initRobot() {
    const geometry = new THREE.BoxGeometry(1, 1.5, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    this.robotMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.robotMesh);
    
    this.camera.position.z = 3;
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.robotMesh) {
      this.robotMesh.rotation.y += 0.01;
    }
    this.renderer.render(this.scene, this.camera);
  }
}

export class BookPDFGenerator {
  async generateBook(title, subject, chapters) {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]);
    const { height } = page.getSize();

    page.drawText(title.toUpperCase(), { x: 50, y: height - 100, size: 24 });
    page.drawText(`Categoria: ${subject}`, { x: 50, y: height - 140, size: 14 });
    page.drawText(`Gerado Offline pelo Engine JS`, { x: 50, y: 50, size: 10 });

    chapters.forEach((chap) => {
      page = pdfDoc.addPage([595.28, 841.89]);
      page.drawText(chap.title, { x: 50, y: height - 80, size: 18 });
      page.drawText(chap.content, { x: 50, y: height - 120, size: 12, lineSpacing: 4 });
    });

    return await pdfDoc.save();
  }
}

// Classe Centralizadora (Singleton)
class CoreAssistantEngine {
  constructor() {
    this.input = new InputManager();
    this.vision = new OfflineVisionEngine();
    this.math = new MathEngine();
    this.pdfGen = new BookPDFGenerator();
  }

  initRobot(containerId) {
    return new Robot3DRenderer(containerId);
  }

  async process(type, payload) {
    switch(type) {
      case 'CALCULO':
        return this.math.evaluate(payload);
      case 'GERAR_LIVRO':
        return await this.pdfGen.generateBook(payload.title, payload.subject, payload.chapters);
      case 'ANALISAR_IMAGEM':
        return await this.vision.processImage(payload.imageElement);
      case 'OUVIR_AUDIO':
        return await this.input.listenAudio();
      default:
        return "Comando não mapeado.";
    }
  }
}

export const coreAssistant = new CoreAssistantEngine();
