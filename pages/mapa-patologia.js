import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { jsPDF } from "jspdf";

// Importação do Gerenciador de Janelas Futuristas
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaPatologiaLaboratorio3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  // Estados de Interface e Diagnóstico
  const [filtroSistema, setFiltroSistema] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [sistemaSelecionado, setSistemaSelecionado] = useState(null);

  // Base de Dados de Patologia e Análise Celular Educativa
  const catalogoBiologico = [
    {
      id: 'celular',
      nome: 'Núcleo Celular & Mitocôndrias',
      sistema: 'Celular',
      status: 'Homeostase Estável (99.4%)',
      biomarcadores: 'ATP Ótimo, Integridade de Membrana Preservada',
      detalhes: 'Monitoramento da respiração celular, síntese proteica e resposta a estresse oxidativo.',
      icone: '🧬',
      corHex: 0x00f0ff
    },
    {
      id: 'imune',
      nome: 'Sistema Imunológico & Leucócitos',
      sistema: 'Imunológico',
      status: 'Resposta Ativa Vigilante',
      biomarcadores: 'Linfócitos T & B Balanceados, Citocinas Regulares',
      detalhes: 'Vigilância imunológica de tecidos epiteliais e neutralização de agentes estranhos.',
      icone: '🛡️',
      corHex: 0x22c55e
    },
    {
      id: 'neural',
      nome: 'Sinapses & Rede Neuronal',
      sistema: 'Neural',
      status: 'Condução Sináptica 100%',
      biomarcadores: 'Neurotransmissores Dopamina/GABA Estáveis',
      detalhes: 'Mapeamento elétrico dos axônios e barreira hematoencefálica.',
      icone: '🧠',
      corHex: 0xa855f7
    },
    {
      id: 'cardio',
      nome: 'Microcirculação & Tecido Vascular',
      sistema: 'Cardiovascular',
      status: 'Perfusão Adequada (80 bpm)',
      biomarcadores: 'Hemoglobina Otimizada, Pressão Microvascular Normal',
      detalhes: 'Trocas gasosas e transporte de nutrientes nos leitos capilares.',
      icone: '🫀',
      corHex: 0xff007f
    }
  ];

  // Configuração e Renderização 3D Three.js
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 4, 14);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação Holográfica de Laboratório
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const pointCyan = new THREE.PointLight(0x00f0ff, 3, 50);
    pointCyan.position.set(-8, 8, 8);
    scene.add(pointCyan);

    const pointMagenta = new THREE.PointLight(0xff007f, 3, 50);
    pointMagenta.position.set(8, -6, 6);
    scene.add(pointMagenta);

    // Estrutura Central: Bio-Holograma Celular
    const coreGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      emissive: 0x005577,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Anéis de Escaneamento Microscópico
    const ringGeo = new THREE.TorusGeometry(4.8, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff007f, transparent: true, opacity: 0.5 });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 2.5;
    scene.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.4 }));
    ringMesh2.rotation.y = Math.PI / 3;
    scene.add(ringMesh2);

    // Nódulos Flutuantes de Biomarcadores
    const nodulos = [];
    catalogoBiologico.forEach((item, index) => {
      const angle = (index / catalogoBiologico.length) * Math.PI * 2;
      const radius = 5.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const noduleGeo = new THREE.DodecahedronGeometry(0.6, 1);
      const noduleMat = new THREE.MeshStandardMaterial({
        color: item.corHex,
        emissive: item.corHex,
        emissiveIntensity: 0.7,
        roughness: 0.3
      });
      const mesh = new THREE.Mesh(noduleGeo, noduleMat);
      mesh.position.set(x, 0, z);
      scene.add(mesh);
      nodulos.push(mesh);
    });

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      coreMesh.rotation.y = elapsedTime * 0.3;
      coreMesh.rotation.x = elapsedTime * 0.15;
      ringMesh1.rotation.z = elapsedTime * 0.2;
      ringMesh2.rotation.x = elapsedTime * 0.25;

      nodulos.forEach((node, i) => {
        const curAngle = (i / nodulos.length) * Math.PI * 2 + elapsedTime * 0.25;
        node.position.x = Math.cos(curAngle) * 5.5;
        node.position.z = Math.sin(curAngle) * 5.5;
        node.position.y = Math.sin(elapsedTime * 2 + i) * 0.4;
      });

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
  }, []);

  // Exportar Laudo Laboratorial em PDF
  const exportarLaudoPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(8, 15, 30);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(0, 240, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("LABORATÓRIO DIGITAL & MAPA DE PATOLOGIA 3D", 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("SISTEMA DE ANÁLISE INTEGRADO AO MAPA DE RESSONÂNCIA | EMANUEL.OS", 14, 26);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text("DIAGNÓSTICO E MONITORAMENTO DE SISTEMAS BIOLÓGICOS", 14, 44);

    let yPos = 54;
    catalogoBiologico.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${index + 1}. ${item.nome} (${item.sistema})`, 14, yPos);

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Status: ${item.status}`, 14, yPos + 6);
      doc.text(`Biomarcadores: ${item.biomarcadores}`, 14, yPos + 12);
      const detalhesLinhas = doc.splitTextToSize(`Observações: ${item.detalhes}`, 180);
      doc.text(detalhesLinhas, 14, yPos + 18);

      yPos += 28 + (detalhesLinhas.length * 4);
    });

    doc.save("EmanuelOS_Laudo_Patologia_Laboratorio.pdf");
  };

  const itensFiltrados = catalogoBiologico.filter(item => {
    const correspondeFiltro = filtroSistema === 'todos' || item.sistema.toLowerCase() === filtroSistema.toLowerCase();
    const correspondeBusca = item.nome.toLowerCase().includes(termoBusca.toLowerCase()) || item.biomarcadores.toLowerCase().includes(termoBusca.toLowerCase());
    return correspondeFiltro && correspondeBusca;
  });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#030712',
      backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #030712 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Mapa de Patologia & Laboratório 3D | Emanuel.OS</title>
      </Head>

      {/* HEADER PRINCIPAL COM NAVEGAÇÃO ENTRE MAPAS */}
      <header style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/" style={{
          padding: '8px 14px', backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '10px',
          textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)'
        }}>
          ⬅ Voltar ao Core
        </Link>

        {/* 🧠 CONECTAR AO MAPA RESSONÂNCIA 3D */}
        <Link href="/mapa-ressonancia" style={{
          padding: '8px 14px', backgroundColor: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981', color: '#34d399', borderRadius: '10px',
          textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
        }}>
          🧠 Conectar ao Mapa Ressonância 3D
        </Link>

        <div>
          <h1 style={{ margin: 0, fontSize: '15px', color: '#00f0ff', fontWeight: '900', letterSpacing: '1px' }}>
            🔬 MAPA DE PATOLOGIA <span style={{ color: '#ff007f' }}>& LABORATÓRIO 3D</span>
          </h1>
          <span style={{ fontSize: '9px', color: '#94a3b8' }}>Análise Celular, Microorganismos e Fisiologia Humana</span>
        </div>
      </header>

      {/* THREE.JS CANVAS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* PAINEL ESQUERDO: FILTROS E PESQUISA DE BIOMARCADORES */}
      <div style={{
        position: 'absolute', top: '75px', left: '20px', width: '320px',
        backgroundColor: 'rgba(8, 15, 30, 0.90)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '16px', padding: '16px',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)', zIndex: 10
      }}>
        <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          🔍 PESQUISA & FILTRO DE SISTEMAS
        </span>

        <input
          type="text"
          placeholder="Pesquisar tecido, célula, biomarcador..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px', backgroundColor: '#020617',
            border: '1px solid #334155', borderRadius: '8px', color: '#fff',
            fontSize: '11px', outline: 'none', marginBottom: '10px', boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
          {['todos', 'celular', 'imunológico', 'neural', 'cardiovascular'].map(filtro => (
            <button
              key={filtro}
              onClick={() => setFiltroSistema(filtro)}
              style={{
                padding: '6px', borderRadius: '6px', border: '1px solid #00f0ff',
                backgroundColor: filtroSistema === filtro ? '#00f0ff' : 'transparent',
                color: filtroSistema === filtro ? '#000' : '#00f0ff',
                fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {filtro}
            </button>
          ))}
        </div>

        <button
          onClick={exportarLaudoPDF}
          style={{
            width: '100%', padding: '10px', backgroundColor: '#ff007f', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px',
            cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)'
          }}
        >
          📄 Exportar Laudo de Laboratório (.PDF)
        </button>
      </div>

      {/* PAINEL DIREITO: MONITORAMENTO DE TECIDOS E PATOLOGIA */}
      <div style={{
        position: 'absolute', top: '75px', right: '20px', width: '360px',
        maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
        backgroundColor: 'rgba(8, 15, 30, 0.90)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 0, 127, 0.4)', borderRadius: '16px', padding: '16px',
        boxShadow: '0 0 30px rgba(255, 0, 127, 0.2)', zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#ff007f', fontWeight: 'bold' }}>
            📊 MONITORAMENTO HISTOPATOLÓGICO
          </h3>
          <span style={{ fontSize: '9px', color: '#22c55e', fontFamily: 'monospace' }}>ONLINE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {itensFiltrados.map((item) => (
            <div
              key={item.id}
              onClick={() => setSistemaSelecionado(item)}
              style={{
                backgroundColor: '#020617', border: '1px solid #1e293b',
                borderRadius: '10px', padding: '12px', cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '11px', color: '#fff' }}>{item.icone} {item.nome}</strong>
                <span style={{ fontSize: '9px', color: '#38bdf8' }}>{item.sistema}</span>
              </div>
              <span style={{ fontSize: '9px', color: '#22c55e', display: 'block', marginBottom: '4px' }}>
                ● {item.status}
              </span>
              <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', lineHeight: '1.3' }}>
                {item.detalhes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GERENCIADOR DE JANELAS FUTURISTAS INTEGRADO */}
      <FuturisticWindowManager />
    </div>
  );
}