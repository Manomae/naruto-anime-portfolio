import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';

// Importação do Gerenciador de Janelas Futuristas (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaRessonancia3D() {
  const mountRef = useRef(null);
  const [respiracaoLivre, setRespiracaoLivre] = useState(true);
  const [filtroMovimento, setFiltroMovimento] = useState(true);
  const [statusExame, setStatusMovimento] = useState('🟢 Aquisição em Tempo Real Estável');

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Luzes Cyberpunk / Médicas
    const greenLight = new THREE.PointLight(0x10b981, 4, 100);
    greenLight.position.set(-3, 3, 3);
    scene.add(greenLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 100);
    cyanLight.position.set(3, -3, 3);
    scene.add(cyanLight);

    scene.add(new THREE.AmbientLight(0x0f172a, 2));

    // Malha Simulando Volume de Escaneamento Médico (Torus Knot Holográfico)
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      wireframe: true,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Simulação de pulso e rotação de escaneamento contínuo
      mesh.rotation.y = elapsedTime * 0.4;
      mesh.rotation.x = elapsedTime * 0.2;

      if (respiracaoLivre) {
        // Simula sutil movimento de expansão pulmonar ajustado pela IA
        mesh.scale.setScalar(1 + Math.sin(elapsedTime * 1.5) * 0.05);
      }

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
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [respiracaoLivre]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#020617',
      backgroundImage: 'radial-gradient(circle at center, #064e3b 0%, #020617 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Mapa Ressonância 3D (IA) | Emanuel.OS</title>
      </Head>

      {/* Botão de Voltar para o Index */}
      <Link href="/" style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 100,
        padding: '10px 16px', backgroundColor: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid #10b981', color: '#34d399', borderRadius: '10px',
        textDecoration: 'none', fontWeight: 'bold', fontSize: '12px'
      }}>
        ⬅ Voltar ao Emanuel.OS Index
      </Link>

      {/* Canvas 3D de Escaneamento */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* Painel de Controle de Filtros e IA */}
      <div style={{
        position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, width: '90%', maxWidth: '600px', backgroundColor: 'rgba(8, 15, 30, 0.9)',
        border: '1px solid #10b981', borderRadius: '16px', padding: '20px',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)', backdropFilter: 'blur(20px)'
      }}>
        <h2 style={{ color: '#34d399', fontSize: '16px', margin: '0 0 6px 0' }}>
          🧠 Mapa de Ressonância Magnética 3D (IA G-AGI)
        </h2>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 14px 0' }}>
          Tecnologia de rastreamento volumétrico com suporte a respiração livre e filtro de movimento em tempo real.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <button 
            onClick={() => setRespiracaoLivre(!respiracaoLivre)}
            style={{
              padding: '10px', borderRadius: '8px', border: '1px solid #10b981',
              backgroundColor: respiracaoLivre ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: '#34d399', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {respiracaoLivre ? '✅ Respiração Livre Ativa' : '❌ Respiração Desativada'}
          </button>

          <button 
            onClick={() => setFiltroMovimento(!filtroMovimento)}
            style={{
              padding: '10px', borderRadius: '8px', border: '1px solid #00f0ff',
              backgroundColor: filtroMovimento ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
              color: '#00f0ff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {filtroMovimento ? '⚡ Correção de Movimento (G-AGI)' : '⚠️ Filtro Desativado'}
          </button>
        </div>

        <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '10px', color: '#cbd5e1' }}>
          <strong>Status do Sistema:</strong> {statusExame}
        </div>
      </div>

      {/* PAINEL DE JANELAS FUTURISTAS INTEGRADO (WIN11 CMD, NOTEPAD & ANDROID HUD) */}
      <FuturisticWindowManager />
    </div>
  );
}