import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { jsPDF } from "jspdf";

// Importação do Gerenciador de Janelas Futuristas (Win11 CMD, Dev Notepad & Android HUD)
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaOrkutSocial3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  // 🌟 ESTADOS DO PAINEL ORKUT SOCIAL
  const [isBarraFluidaOpen, setIsBarraFluidaOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaFiltro, setFiltroCategoria] = useState('tudo');

  // Perfil Ativo do Orkut 2030
  const [perfilUsuario, setPacientePerfil] = useState({
    nome: "Emanuel da Silva (Arquiteto OS)",
    statusBio: "Criando a nova era das Redes Sociais 3D e Matriz G-AGI 2030 🚀",
    confiavel: 100, // %
    legal: 100,     // %
    sexy: 98,       // %
    fasCount: 2450,
    amigosCount: 890,
    comunidadesCount: 142
  });

  // Lista de Depoimentos (Testimonials)
  const [depoimentos, setDepoimentos] = useState([
    { id: 1, autor: "Dev Cyberpunk", texto: "O Emanuel é um cara 100% confiável e gênio do Three.js! O Emanuel.OS tá insano!", data: "14/03/2030", status: "Aprovado" },
    { id: 2, autor: "IA Gemini AGI", texto: "Sincronização neural concluída com sucesso. Arquiteto mestre do ciberespaço!", data: "14/03/2030", status: "Aprovado" }
  ]);

  // Mural de Recados (Scraps)
  const [scraps, setScraps] = useState([
    { id: 1, autor: "Otaku Ninja", texto: "Passando pra deixar aquele recado no mural! Add aí nas comunidades de Naruto!", horario: "10:15" },
    { id: 2, autor: "Sora 3D", texto: "O mapa Orkut 3D tá incrível! Bora marcar um Meet no mapa?", horario: "11:40" }
  ]);

  const [novoScrapInput, setNovoScrapInput] = useState('');
  const [novoDepoimentoInput, setNovoDepoimentoInput] = useState('');
  const [abaMuralAtiva, setAbaMuralAtiva] = useState('scraps'); // 'scraps' ou 'depoimentos'

  // Base de Dados de Comunidades Orkut 2030
  const comunidadesBase = [
    { id: 1, nome: "Eu odeio acordar cedo", membros: "1.2M membros", tipo: "comunidade", icone: "⏰" },
    { id: 2, nome: "Emanuel.OS & G-AGI 2030", membros: "850K membros", tipo: "tech", icone: "🤖" },
    { id: 3, nome: "Eu amo Animes & Cyberpunk", membros: "540K membros", tipo: "anime", icone: "🍥" },
    { id: 4, nome: "Yu-Gi-Oh! & Pokédex 3D", membros: "310K membros", tipo: "games", icone: "🃏" },
    { id: 5, nome: "Futebol & Memes do Milênio", membros: "990K membros", tipo: "memes", icone: "⚽" }
  ];

  const palavrasChaveOrkut = [
    "#comunidades", "#depoimentos", "#scraps", "#confiavel100%", "#legal100%", "#sexy98%", "#fas", "#orkut2030"
  ];

  // Cenário Three.js (Matriz Orkut 3D Magenta & Neon)
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0212); // Fundo Roxo Ciberespacial

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 5, 18);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação Rosa Orkut / Cyan Ciberpunk
    const pinkLight = new THREE.PointLight(0xff007f, 4, 100);
    pinkLight.position.set(-10, 10, 10);
    scene.add(pinkLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4, 100);
    cyanLight.position.set(10, -10, 10);
    scene.add(cyanLight);

    scene.add(new THREE.AmbientLight(0x2a0835, 1.8));

    // NÓDULO CENTRAL DO ORKUT (NÚCLEO DE REDE SOCIAL)
    const coreGeo = new THREE.IcosahedronGeometry(3, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      wireframe: true,
      emissive: 0xaa0055,
      emissiveIntensity: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // ANÉIS ORBITAIS (COMUNIDADES & AMIGOS EM ÓRBITA)
    const ringGeo = new THREE.RingGeometry(7, 7.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    scene.add(ringMesh);

    // Esferas Flutuantes de Comunidades
    const esferasComunidade = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * 7;
      const z = Math.sin(angle) * 7;

      const nodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xff007f : 0x00f0ff,
        emissive: i % 2 === 0 ? 0xff007f : 0x00f0ff,
        emissiveIntensity: 0.5,
        roughness: 0.2
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, 0, z);
      scene.add(nodeMesh);
      esferasComunidade.push(nodeMesh);

      // Linhas de Conexão Neural (Chakra de Amizade)
      const lineMat = new THREE.LineBasicMaterial({ color: 0xff007f, transparent: true, opacity: 0.5 });
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
    }

    // Animação Contínua
    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.x = elapsedTime * 0.2;
      ringMesh.rotation.z = elapsedTime * 0.1;

      esferasComunidade.forEach((esfera, index) => {
        const currentAngle = (index / 6) * Math.PI * 2 + elapsedTime * 0.3;
        esfera.position.x = Math.cos(currentAngle) * 7;
        esfera.position.z = Math.sin(currentAngle) * 7;
        esfera.position.y = Math.sin(elapsedTime * 2 + index) * 0.5;
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

  // Adicionar Novo Scrap (Recado)
  const enviarScrap = (e) => {
    e.preventDefault();
    if (!novoScrapInput.trim()) return;
    setScraps(prev => [
      { id: Date.now(), autor: "Você (Visitante)", texto: novoScrapInput, horario: "Agora" },
      ...prev
    ]);
    setNovoScrapInput('');
  };

  // Adicionar Novo Depoimento
  const enviarDepoimento = (e) => {
    e.preventDefault();
    if (!novoDepoimentoInput.trim()) return;
    setDepoimentos(prev => [
      { id: Date.now(), autor: "Você (Amigo VIP)", texto: novoDepoimentoInput, data: new Date().toLocaleDateString('pt-BR'), status: "Aprovado" },
      ...prev
    ]);
    setNovoDepoimentoInput('');
    alert("💖 Depoimento de coração enviado ao perfil do Emanuel!");
  };

  // Exportar Perfil e Depoimentos em PDF
  const exportarPerfilOrkutPDF = () => {
    const doc = new jsPDF();

    // Banner Superior Rosa Orkut
    doc.setFillColor(255, 0, 127);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("ORKUT 2030 - PERFIL SOCIAL & LAUDO DE DEPOIMENTOS", 14, 18);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text("SISTEMA DE REDE SOCIAL MISTURA 3D | EMANUEL.OS CORE v5.1", 14, 26);

    // Dados do Perfil
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`PERFIL: ${perfilUsuario.nome.toUpperCase()}`, 14, 44);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Status Bio: ${perfilUsuario.statusBio}`, 14, 52);
    doc.text(`Avaliações: 😇 Confiável (${perfilUsuario.confiavel}%) | 😎 Legal (${perfilUsuario.legal}%) | 🔥 Sexy (${perfilUsuario.sexy}%)`, 14, 60);
    doc.text(`Métricas: ❤️ ${perfilUsuario.fasCount} Fãs | 👥 ${perfilUsuario.amigosCount} Amigos | 🌐 ${perfilUsuario.comunidadesCount} Comunidades`, 14, 67);

    // Linha de Divisão
    doc.setDrawColor(255, 0, 127);
    doc.setLineWidth(0.5);
    doc.line(14, 73, 196, 73);

    // Depoimentos
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 0, 127);
    doc.text("💬 DEPOIMENTOS DE CORAÇÃO APROVADOS", 14, 84);

    let yPos = 94;
    depoimentos.forEach((dep, idx) => {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. De: ${dep.autor} (${dep.data})`, 14, yPos);

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(51, 65, 85);
      const linhasTexto = doc.splitTextToSize(`"${dep.texto}"`, 180);
      doc.text(linhasTexto, 14, yPos + 6);
      yPos += 18 + (linhasTexto.length * 4);
    });

    doc.save(`Orkut_2030_Perfil_${perfilUsuario.nome.replace(/\s+/g, '_')}.pdf`);
  };

  const comunidadesFiltradas = comunidadesBase.filter(c =>
    c.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    c.membros.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0a0212',
      backgroundImage: 'radial-gradient(circle at center, #2a0835 0%, #0a0212 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Orkut Social 3D | Emanuel.OS 2030</title>
      </Head>

      {/* HEADER PRINCIPAL */}
      <header style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link href="/" style={{
          padding: '8px 14px', backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid #ff007f', color: '#ff007f', borderRadius: '10px',
          textDecoration: 'none', fontWeight: 'bold', fontSize: '11px',
          boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)'
        }}>
          ⬅ Voltar ao Emanuel.OS Core
        </Link>

        <div>
          <h1 style={{ margin: 0, fontSize: '16px', color: '#ff007f', fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💖 ORKUT<span style={{ color: '#00f0ff' }}>.SOCIAL 3D</span>
          </h1>
          <span style={{ fontSize: '9px', color: '#94a3b8' }}>Rede Social Clássica de 2004 Reinventada no Ciberespaço 2030</span>
        </div>
      </header>

      {/* 🌟 BARRA FLUIDA SUPERIOR RETRÁTIL (PUXAR PARA BAIXO) */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 110, width: '90%', maxWidth: '650px' }}>
        <div 
          onClick={() => setIsBarraFluidaOpen(!isBarraFluidaOpen)}
          style={{
            backgroundColor: 'rgba(20, 5, 30, 0.95)',
            backdropFilter: 'blur(15px)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            border: '1px solid #ff007f',
            borderTop: 'none',
            padding: '8px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            color: '#ff007f',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(255, 0, 127, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>{isBarraFluidaOpen ? '▲ Recolher Painel Orkut' : '▼ Puxe para Baixo (Pesquisa de Comunidades, Scraps & Amigos VIP)'}</span>
        </div>

        {isBarraFluidaOpen && (
          <div style={{
            backgroundColor: 'rgba(10, 2, 18, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '16px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 0, 127, 0.5)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            marginTop: '6px'
          }}>
            <input
              type="text"
              placeholder="🔍 Pesquise comunidades (ex: 'Eu odeio acordar cedo'), depoimentos, amigos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px',
                backgroundColor: '#09090b',
                border: '1px solid #ff007f',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* TAGS CLÁSSICAS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
              {palavrasChaveOrkut.map((tag, idx) => (
                <span 
                  key={idx} 
                  onClick={() => setTermoBusca(tag.replace('#', ''))}
                  style={{ fontSize: '9px', backgroundColor: 'rgba(255, 0, 127, 0.15)', color: '#ff007f', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255, 0, 127, 0.3)', cursor: 'pointer' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* RESULTADOS DA BUSCA */}
            {termoBusca.trim() !== '' && (
              <div style={{ marginTop: '12px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {comunidadesFiltradas.length === 0 ? (
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Nenhuma comunidade ou amigo localizado para "{termoBusca}".</span>
                ) : (
                  comunidadesFiltradas.map((c) => (
                    <div key={c.id} style={{ padding: '8px 12px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '12px', marginRight: '6px' }}>{c.icone}</span>
                        <b style={{ color: '#00f0ff' }}>{c.nome}</b>
                        <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>{c.membros}</span>
                      </div>
                      <button onClick={() => alert(`Você entrou na comunidade "${c.nome}"!`)} style={{ padding: '4px 10px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
                        + Participar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CANVAS THREE.JS DE FUNDO */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* PAINEL ESQUERDO: CARTÃO DE PERFIL ORKUT NOSTÁLGICO */}
      <div style={{
        position: 'absolute', top: '75px', left: '20px', width: '310px',
        backgroundColor: 'rgba(15, 5, 25, 0.90)', backdropFilter: 'blur(20px)',
        border: '1px solid #ff007f', borderRadius: '16px', padding: '16px',
        boxShadow: '0 0 30px rgba(255, 0, 127, 0.25)', zIndex: 10
      }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff007f, #00f0ff)', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 15px #ff007f' }}>
            👑
          </div>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>{perfilUsuario.nome}</h3>
          <span style={{ fontSize: '9px', color: '#00f0ff', display: 'block', marginTop: '2px' }}>{perfilUsuario.statusBio}</span>
        </div>

        {/* SELOS CLÁSSICOS: CONFIÁVEL, LEGAL, SEXY */}
        <span style={{ fontSize: '10px', color: '#ff007f', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
          ⭐ AVALIAÇÕES ORKUT (MÉTRICAS):
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '14px', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(0,240,255,0.3)' }}>
            <span style={{ fontSize: '10px', display: 'block' }}>😇 Confiável</span>
            <strong style={{ fontSize: '11px', color: '#00f0ff' }}>{perfilUsuario.confiavel}%</strong>
          </div>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(234,179,8,0.3)' }}>
            <span style={{ fontSize: '10px', display: 'block' }}>😎 Legal</span>
            <strong style={{ fontSize: '11px', color: '#eab308' }}>{perfilUsuario.legal}%</strong>
          </div>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,0,127,0.3)' }}>
            <span style={{ fontSize: '10px', display: 'block' }}>🔥 Sexy</span>
            <strong style={{ fontSize: '11px', color: '#ff007f' }}>{perfilUsuario.sexy}%</strong>
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#cbd5e1', backgroundColor: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '8px', marginBottom: '12px' }}>
          <span>❤️ <b>{perfilUsuario.fasCount}</b> Fãs</span>
          <span>👥 <b>{perfilUsuario.amigosCount}</b> Amigos</span>
          <span>🌐 <b>{perfilUsuario.comunidadesCount}</b> Comunidades</span>
        </div>

        <button 
          onClick={exportarPerfilOrkutPDF}
          style={{
            width: '100%', padding: '9px', backgroundColor: '#ff007f', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px',
            cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)'
          }}
        >
          📄 Baixar Perfil & Depoimentos (.PDF)
        </button>
      </div>

      {/* PAINEL DIREITO: MURAL DE SCRAPS (RECADOS) & DEPOIMENTOS */}
      <div style={{
        position: 'absolute', top: '75px', right: '20px', width: '360px',
        backgroundColor: 'rgba(15, 5, 25, 0.90)', backdropFilter: 'blur(20px)',
        border: '1px solid #00f0ff', borderRadius: '16px', padding: '16px',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)', zIndex: 10, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto'
      }}>
        {/* ABAS DO MURAL */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          <button 
            onClick={() => setAbaMuralAtiva('scraps')}
            style={{
              flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #00f0ff',
              backgroundColor: abaMuralAtiva === 'scraps' ? '#00f0ff' : 'transparent',
              color: abaMuralAtiva === 'scraps' ? '#000' : '#00f0ff', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer'
            }}
          >
            📝 Scraps ({scraps.length})
          </button>
          <button 
            onClick={() => setAbaMuralAtiva('depoimentos')}
            style={{
              flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #ff007f',
              backgroundColor: abaMuralAtiva === 'depoimentos' ? '#ff007f' : 'transparent',
              color: abaMuralAtiva === 'depoimentos' ? '#fff' : '#ff007f', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer'
            }}
          >
            💬 Depoimentos ({depoimentos.length})
          </button>
        </div>

        {/* MURAL DE SCRAPS (RECADOS PÚBLICOS) */}
        {abaMuralAtiva === 'scraps' && (
          <div>
            <form onSubmit={enviarScrap} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Escreva um recado rápido no mural de scraps..."
                value={novoScrapInput}
                onChange={(e) => setNovoScrapInput(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #00f0ff', borderRadius: '6px', color: '#fff', fontSize: '10px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ padding: '6px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
                ✉️ Deixar Recado (Scrap)
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scraps.map((s) => (
                <div key={s.id} style={{ backgroundColor: '#020617', padding: '8px', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00f0ff', fontWeight: 'bold', marginBottom: '2px' }}>
                    <span>{s.autor}</span>
                    <span style={{ fontSize: '8px', color: '#64748b' }}>{s.horario}</span>
                  </div>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.3' }}>{s.texto}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MURAL DE DEPOIMENTOS DE CORAÇÃO */}
        {abaMuralAtiva === 'depoimentos' && (
          <div>
            <form onSubmit={enviarDepoimento} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <textarea
                placeholder="Escreva um depoimento especial (Só envie de coração!)..."
                value={novoDepoimentoInput}
                onChange={(e) => setNovoDepoimentoInput(e.target.value)}
                style={{ width: '100%', height: '50px', padding: '8px', backgroundColor: '#020617', border: '1px solid #ff007f', borderRadius: '6px', color: '#fff', fontSize: '10px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ padding: '6px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
                💖 Enviar Depoimento de Coração
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {depoimentos.map((d) => (
                <div key={d.id} style={{ backgroundColor: '#020617', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,0,127,0.3)', fontSize: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff007f', fontWeight: 'bold', marginBottom: '2px' }}>
                    <span>{d.autor}</span>
                    <span style={{ fontSize: '8px', color: '#64748b' }}>{d.data}</span>
                  </div>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.3', fontStyle: 'italic' }}>"{d.texto}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PAINEL DE JANELAS FUTURISTAS INTEGRADO (WIN11 CMD, NOTEPAD & ANDROID HUD) */}
      <FuturisticWindowManager />
    </div>
  );
}
