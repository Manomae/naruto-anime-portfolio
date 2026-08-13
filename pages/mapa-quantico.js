import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { jsPDF } from "jspdf";

// Importação do Gerenciador de Janelas Futuristas (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaQuantico() {
  const mountRef = useRef(null);
  const [qubitState, setQubitState] = useState({ alpha: 0.707, beta: 0.707, entropia: 0.982 });
  const [frequencia, setFrequencia] = useState(432);
  const [simulandoColapso, setSimulandoColapso] = useState(false);
  const [logQuantico, setLogQuantico] = useState([
    "[QUBIT: CORE] Matriz de Hilbert inicializada em estado de superposição.",
    "[EQUAÇÃO: SCHRÖDINGER] iℏ ∂/∂t Ψ(r,t) = Ĥ Ψ(r,t) sincronizada.",
    "[G-AGI: QUANTUM] Pronto para simulação e cálculo vetorial."
  ]);

  // --- MOTOR THREE.JS DE CAMPO QUANTICO E ONDA DE PROBABILIDADE ---
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.05);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação Holográfica
    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 50);
    cyanLight.position.set(-5, 5, 5);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 50);
    purpleLight.position.set(5, -5, 5);
    scene.add(purpleLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    // Esfera de Bloch
    const BlochGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const BlochMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.6
    });
    const blochSphere = new THREE.Mesh(BlochGeometry, BlochMaterial);
    scene.add(blochSphere);

    // Núcleo do Qubit
    const coreGeometry = new THREE.IcosahedronGeometry(0.8, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      wireframe: true
    });
    const quantumCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(quantumCore);

    // Anéis de Emaranhamento
    const ringGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(2.3 + i * 0.4, 0.02, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x00f0ff : i === 1 ? 0xff007f : 0x8b5cf6,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / (i + 1);
      ring.rotation.y = Math.PI / (i + 2);
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    // Nuvem de Partículas Quânticas
    const particlesCount = 800;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      quantumCore.rotation.x = elapsedTime * 0.5;
      quantumCore.rotation.y = elapsedTime * 0.8;

      blochSphere.rotation.y = elapsedTime * 0.2;
      ringGroup.rotation.x = elapsedTime * 0.3;
      ringGroup.rotation.y = elapsedTime * 0.4;

      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const simularColapsoOnda = () => {
    setSimulandoColapso(true);
    setLogQuantico(prev => [...prev, "[QUBIT] Aplicando Porta Hadamard H_1... Colapsando função de onda..."]);

    setTimeout(() => {
      const alphaVal = parseFloat((Math.random()).toFixed(3));
      const betaVal = parseFloat(Math.sqrt(1 - Math.pow(alphaVal, 2)).toFixed(3));
      const entropiaVal = parseFloat((Math.random() * 0.5 + 0.5).toFixed(3));

      setQubitState({ alpha: alphaVal, beta: betaVal, entropia: entropiaVal });
      setSimulandoColapso(false);
      setLogQuantico(prev => [
        ...prev,
        `[SUCESSO] Colapso registrado: |Ψ⟩ = ${alphaVal}|0⟩ + ${betaVal}|1⟩ (Entropia: ${entropiaVal})`
      ]);
    }, 1200);
  };

  const exportarRelatorioQuanticoPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("EMANUEL.OS - RELATÓRIO MATEMÁTICO QUÂNTICO 3D", 15, 20);
    doc.setFontSize(12);
    doc.text("Arquiteto do Sistema: Emanuel da Silva", 15, 30);
    doc.text(`Data do Cálculo: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 15, 38);
    
    doc.setFontSize(14);
    doc.text("Métricas de Estado Qubit (Matriz de Hilbert):", 15, 50);
    doc.setFontSize(11);
    doc.text(`* Amplitude |0⟩ (Alpha): ${qubitState.alpha}`, 20, 60);
    doc.text(`* Amplitude |1⟩ (Beta): ${qubitState.beta}`, 20, 68);
    doc.text(`* Entropia Quântica Von Neumann: ${qubitState.entropia}`, 20, 76);
    doc.text(`* Frequência Osciladora do Campo: ${frequencia} Hz`, 20, 84);

    doc.setFontSize(14);
    doc.text("Equação Fundamental da Simulação:", 15, 100);
    doc.setFontSize(11);
    doc.text("iℏ (∂/∂t) |Ψ(t)⟩ = Ĥ |Ψ(t)⟩", 20, 110);
    doc.text("Vetor de Estado Unificado pelo Núcleo G-AGI.", 20, 118);

    doc.save("EmanuelOS_Relatorio_Matematico_Quantico.pdf");

    setLogQuantico(prev => [...prev, "[PDF] Relatório Matematico Quântico baixado com sucesso."]);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#020617',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Head>
        <title>Emanuel.OS | Mapa Matemático Quântico 3D (2030)</title>
      </Head>

      <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

      <header style={{
        position: 'absolute', top: '20px', left: '20px', right: '20px',
        zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/" style={{
            color: '#00f0ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
            border: '1px solid #00f0ff', padding: '10px 18px', borderRadius: '10px',
            background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(15px)',
            boxShadow: '0 0 15px rgba(0,240,255,0.2)'
          }}>
            ⬅ Voltar ao Núcleo Emanuel.OS
          </Link>
          <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 'bold', letterSpacing: '1px' }}>
            ⚛️ MAPA MATEMÁTICO QUÂNTICO 3D
          </span>
        </div>

        <div style={{
          pointerEvents: 'auto', background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '10px',
          padding: '8px 16px', fontSize: '11px', color: '#a855f7', fontWeight: 'bold'
        }}>
          STATUS CORE: <span style={{ color: '#4ade80' }}>EMARANHAMENTO 100% OK</span>
        </div>
      </header>

      <div style={{
        position: 'absolute', top: '80px', left: '20px', width: '360px',
        maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', zIndex: 10,
        backgroundColor: 'rgba(8, 15, 30, 0.88)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '18px',
        padding: '20px', boxShadow: '0 0 30px rgba(139, 92, 246, 0.25)', color: '#fff'
      }}>
        <h2 style={{ fontSize: '14px', color: '#c084fc', margin: '0 0 10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🔮 Matriz de Qubits & Equações
        </h2>
        <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 16px 0' }}>
          Simulador de superposição e calculadora de estados quânticos em tempo real.
        </p>

        <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            📐 Estado Quântico Psi (|Ψ⟩)
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', fontFamily: 'monospace' }}>
            <div style={{ background: '#020617', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,240,255,0.2)' }}>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '9px' }}>α (|0⟩ Amplitude)</span>
              <strong style={{ color: '#00f0ff' }}>{qubitState.alpha}</strong>
            </div>
            <div style={{ background: '#020617', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,0,127,0.2)' }}>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '9px' }}>β (|1⟩ Amplitude)</span>
              <strong style={{ color: '#ff007f' }}>{qubitState.beta}</strong>
            </div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '10px', color: '#cbd5e1' }}>
            Entropia Quântica: <strong style={{ color: '#eab308' }}>{qubitState.entropia}</strong>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            🔊 Frequência de Ressonância (Hz): {frequencia} Hz
          </label>
          <input
            type="range" min="100" max="999" value={frequencia}
            onChange={(e) => setFrequencia(e.target.value)}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#8b5cf6' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={simularColapsoOnda}
            disabled={simulandoColapso}
            style={{
              padding: '12px', backgroundColor: simulandoColapso ? '#4c1d95' : '#8b5cf6',
              color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold',
              fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            {simulandoColapso ? '⏳ Colapsando Função de Onda...' : '⚡ Colapsar Função de Onda'}
          </button>

          <button
            onClick={exportarRelatorioQuanticoPDF}
            style={{
              padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '10px',
              fontWeight: 'bold', fontSize: '10px', cursor: 'pointer'
            }}
          >
            📄 Baixar Relatório Quântico (.PDF)
          </button>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '20px', right: '20px', width: '420px',
        maxHeight: '220px', zIndex: 10, backgroundColor: 'rgba(8, 15, 30, 0.90)',
        backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '16px', padding: '14px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>
            🖥️ Terminal Quântico G-AGI
          </span>
          <span style={{ fontSize: '9px', color: '#4ade80', fontFamily: 'monospace' }}>LIVE STREAM</span>
        </div>

        <div style={{
          flexGrow: 1, backgroundColor: '#020617', border: '1px solid #1e293b',
          borderRadius: '8px', padding: '10px', overflowY: 'auto', fontFamily: 'monospace',
          fontSize: '10px', color: '#38bdf8', display: 'flex', flexDirection: 'column', gap: '4px'
        }}>
          {logQuantico.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>

      {/* PAINEL DE JANELAS FUTURISTAS INTEGRADO (WIN11 CMD, NOTEPAD & ANDROID HUD) */}
      <FuturisticWindowManager />
    </div>
  );
}