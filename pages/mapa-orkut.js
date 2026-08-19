import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as THREE from 'three';
import { jsPDF } from "jspdf";

// Importação do Gerenciador de Janelas Futuristas
import FuturisticWindowManager from '../components/FuturisticWindowManager';

export default function MapaOrkutSocial3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  // Estados de expansão/recolhimento dos blocos centrais com as setinhas
  const [blocoPerfilExpandido, setBlocoPerfilExpandido] = useState(true);
  const [blocoMuralExpandido, setBlocoMuralExpandido] = useState(true);

  // Estados de navegação e abas
  const [isBarraFluidaOpen, setIsBarraFluidaOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [abaMuralAtiva, setAbaMuralAtiva] = useState('scraps'); // 'scraps', 'depoimentos', 'gerenciar'

  // Perfil Oficial Emanuel ART
  const [perfilUsuario] = useState({
    nome: "Emanuel ART",
    statusBio: "Arquiteto do Emanuel.OS v5.1 | Hub Integrado de Redes Sociais & 3D 🚀",
    relacionamento: "Solteiro",
    aniversario: "24 de Janeiro",
    localizacao: "Brasil",
    profissao: "Desenvolvedor & Artista Digital 3D",
    quemSouEu: "Construindo a nova geração das redes sociais unificadas. Conecte-se comigo pelo Orkut 3D ou pelas minhas redes oficiais!",
    confiavel: 100,
    legal: 100,
    sexy: 98
  });

  // Redes Sociais Conectadas
  const canaisSociais = [
    { id: 'yt', nome: 'YouTube', icone: '▶️', url: 'https://youtube.com', cor: '#ef4444' },
    { id: 'tk', nome: 'TikTok', icone: '🎵', url: 'https://tiktok.com', cor: '#000000' },
    { id: 'kw', nome: 'Kwai', icone: '🟠', url: 'https://kwai.com', cor: '#f97316' },
    { id: 'ig', nome: 'Instagram', icone: '📸', url: 'https://instagram.com', cor: '#e1306c' },
    { id: 'th', nome: 'Threads', icone: '🧵', url: 'https://threads.net', cor: '#111827' },
    { id: 'fb', nome: 'Facebook', icone: '👥', url: 'https://facebook.com', cor: '#1877f2' },
    { id: 'gm', nome: 'Gmail', icone: '✉️', url: 'mailto:leeheroi123@gmail.com', cor: '#ea4335' },
    { id: 'gg', nome: 'Google', icone: '🌐', url: 'https://google.com', cor: '#4285f4' }
  ];

  // Listas Dinâmicas
  const [amigos, setAmigos] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);

  // Estados de Formulários e Marcação (@amigo, @namorada, @comunidade)
  const [novoAmigoInput, setNovoAmigoInput] = useState('');
  const [novoAmigoTipoAcao, setNovoAmigoTipoAcao] = useState('link');
  const [novoAmigoRede, setNovoAmigoRede] = useState('Instagram');

  const [buscaGrupoInput, setBuscaGrupoInput] = useState('');
  const [novaComunidadeRede, setNovaComunidadeRede] = useState('Instagram');
  const [novaComunidadeTipo, setNovaComunidadeTipo] = useState('Geral');

  // Scrap com Marcação
  const [novoScrapInput, setNovoScrapInput] = useState('');
  const [marcacaoScrapTipo, setMarcacaoScrapTipo] = useState('Amigo(a)');
  const [marcacaoScrapAlvo, setMarcacaoScrapAlvo] = useState('');

  // Depoimento com Marcação
  const [novoDepoimentoInput, setNovoDepoimentoInput] = useState('');
  const [marcacaoDepoimentoTipo, setMarcacaoDepoimentoTipo] = useState('Amigo(a)');
  const [marcacaoDepoimentoAlvo, setMarcacaoDepoimentoAlvo] = useState('');

  // Carregar dados salvos do navegador
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const amigosSalvos = JSON.parse(localStorage.getItem('orkut_amigos_reais')) || [
      { id: 1, nome: '@cyber_ninja', rede: 'Instagram', icone: '📸', tipo: 'Link @' },
      { id: 2, nome: 'Canal Oficial 3D', rede: 'YouTube', icone: '▶️', tipo: 'Solicitação' },
      { id: 3, nome: '@harley_queen', rede: 'TikTok', icone: '🎵', tipo: 'Link @' }
    ];

    const comunidadesSalvas = JSON.parse(localStorage.getItem('orkut_comunidades_reais')) || [
      { id: 1, nome: 'Eu odeio acordar cedo', tipo: 'Comunidade Clássica', rede: 'Orkut', icone: '⏰' },
      { id: 2, nome: '@EmanuelOS_Oficial', tipo: 'Grupo Tech', rede: 'Threads', icone: '🧵' },
      { id: 3, nome: 'Grupo Ninjas & Anime 2026', tipo: 'Comunidade', rede: 'YouTube', icone: '▶️' }
    ];

    const scrapsSalvos = JSON.parse(localStorage.getItem('orkut_scraps_reais')) || [
      { id: 1, autor: 'Visitante', marcadoPara: 'Amigo(a): @cyber_ninja', texto: 'Fala Emanuel ART! Passando pra deixar aquele scrap top!', horario: 'Hoje' }
    ];

    const depoimentosSalvos = JSON.parse(localStorage.getItem('orkut_depoimentos_reais')) || [
      { id: 1, autor: 'Comunidade Dev', marcadoPara: 'Comunidade: @EmanuelOS_Oficial', texto: 'O sistema mais poderoso e inteligente de 2026!', data: '2026', status: 'Aprovado' }
    ];

    setAmigos(amigosSalvos);
    setComunidades(comunidadesSalvas);
    setScraps(scrapsSalvos);
    setDepoimentos(depoimentosSalvos);
  }, []);

  // Adicionar Amigo via Link / @ / Solicitação
  const adicionarAmigo = (e) => {
    e.preventDefault();
    if (!novoAmigoInput.trim()) return;

    const novo = {
      id: Date.now(),
      nome: novoAmigoInput.startsWith('@') || novoAmigoInput.startsWith('http') ? novoAmigoInput : `@${novoAmigoInput}`,
      rede: novoAmigoRede,
      tipo: novoAmigoTipoAcao === 'solicitacao' ? 'Solicitação Enviada ✉️' : 'Link @ Conectado 🔗',
      icone: novoAmigoRede === 'YouTube' ? '▶️' : novoAmigoRede === 'TikTok' ? '🎵' : novoAmigoRede === 'Instagram' ? '📸' : novoAmigoRede === 'Kwai' ? '🟠' : novoAmigoRede === 'Threads' ? '🧵' : novoAmigoRede === 'Gmail' ? '✉️' : '🌐'
    };

    const atualizados = [novo, ...amigos];
    setAmigos(atualizados);
    localStorage.setItem('orkut_amigos_reais', JSON.stringify(atualizados));
    alert(`${novo.tipo} para ${novo.nome} na rede ${novoAmigoRede}!`);
    setNovoAmigoInput('');
  };

  // Buscar e Conectar Grupo ou Comunidade
  const conectarGrupoOuComunidade = (e) => {
    e.preventDefault();
    if (!buscaGrupoInput.trim()) return;

    const nova = {
      id: Date.now(),
      nome: buscaGrupoInput.startsWith('@') || buscaGrupoInput.startsWith('http') ? buscaGrupoInput : `@${buscaGrupoInput}`,
      tipo: novaComunidadeTipo,
      rede: novaComunidadeRede,
      icone: '🌐'
    };

    const atualizadas = [nova, ...comunidades];
    setComunidades(atualizadas);
    localStorage.setItem('orkut_comunidades_reais', JSON.stringify(atualizadas));
    alert(`Grupo/Comunidade "${nova.nome}" conectado via ${novaComunidadeRede}!`);
    setBuscaGrupoInput('');
  };

  // Enviar Scrap com Marcação
  const enviarScrap = (e) => {
    e.preventDefault();
    if (!novoScrapInput.trim()) return;

    const alvoTexto = marcacaoScrapAlvo.trim() ? `${marcacaoScrapTipo}: ${marcacaoScrapAlvo}` : `Público (${marcacaoScrapTipo})`;

    const novo = {
      id: Date.now(),
      autor: "Você",
      marcadoPara: alvoTexto,
      texto: novoScrapInput,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const atualizados = [novo, ...scraps];
    setScraps(atualizados);
    localStorage.setItem('orkut_scraps_reais', JSON.stringify(atualizados));
    setNovoScrapInput('');
    setMarcacaoScrapAlvo('');
  };

  // Enviar Depoimento com Marcação
  const enviarDepoimento = (e) => {
    e.preventDefault();
    if (!novoDepoimentoInput.trim()) return;

    const alvoTexto = marcacaoDepoimentoAlvo.trim() ? `${marcacaoDepoimentoTipo}: ${marcacaoDepoimentoAlvo}` : `Destaque (${marcacaoDepoimentoTipo})`;

    const novo = {
      id: Date.now(),
      autor: "Você (Depoimento VIP)",
      marcadoPara: alvoTexto,
      texto: novoDepoimentoInput,
      data: new Date().toLocaleDateString('pt-BR'),
      status: "Aprovado"
    };

    const atualizados = [novo, ...depoimentos];
    setDepoimentos(atualizados);
    localStorage.setItem('orkut_depoimentos_reais', JSON.stringify(atualizados));
    setNovoDepoimentoInput('');
    setMarcacaoDepoimentoAlvo('');
    alert("💖 Depoimento com marcação enviado de coração!");
  };

  // Three.js 3D Background
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xd4e2f4);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const pinkLight = new THREE.PointLight(0xff007f, 3, 50);
    pinkLight.position.set(-10, 10, 10);
    scene.add(pinkLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 50);
    cyanLight.position.set(10, -10, 10);
    scene.add(cyanLight);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const coreGeo = new THREE.IcosahedronGeometry(2.5, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xed2580,
      wireframe: true,
      emissive: 0xd81e74,
      emissiveIntensity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    const ringGeo = new THREE.TorusGeometry(6, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b5998, transparent: true, opacity: 0.3 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      coreMesh.rotation.y = elapsedTime * 0.3;
      coreMesh.rotation.x = elapsedTime * 0.15;
      ringMesh.rotation.z = elapsedTime * 0.2;
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

  const exportarPerfilOrkutPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(237, 37, 128);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("ORKUT 2026 - PERFIL OFICIAL EMANUEL ART", 14, 18);
    doc.setFontSize(9);
    doc.text("HUB DE REDES SOCIAIS & MATRIZ G-AGI | EMANUEL.OS", 14, 25);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(`Nome: ${perfilUsuario.nome}`, 14, 40);
    doc.text(`Bio: ${perfilUsuario.statusBio}`, 14, 46);
    doc.text(`Amigos Conectados: ${amigos.length} | Comunidades Ativas: ${comunidades.length}`, 14, 52);

    doc.save("Perfil_Orkut_Emanuel_ART.pdf");
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#e4ebf5',
      color: '#333',
      fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>orkut - Emanuel ART | Central Social</title>
      </Head>

      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, opacity: 0.5 }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* HEADER CLÁSSICO AZUL ORKUT */}
        <header style={{
          backgroundColor: '#557ca5',
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #3b5998',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ed2580', letterSpacing: '-1px' }}>orkut</span>
            <span style={{ fontSize: '10px', color: '#fff', backgroundColor: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '4px' }}>
              Rede Social Ativa
            </span>
          </div>

          <nav style={{ display: 'flex', gap: '12px', fontSize: '11px', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>início</Link>
            <span style={{ color: '#c4d7ed' }}>|</span>
            <span style={{ color: '#fff', cursor: 'pointer' }} onClick={() => setAbaMuralAtiva('scraps')}>recados</span>
            <span style={{ color: '#c4d7ed' }}>|</span>
            <span style={{ color: '#fff', cursor: 'pointer' }} onClick={() => setAbaMuralAtiva('gerenciar')}>+ conectar redes & grupos</span>
            <span style={{ color: '#c4d7ed' }}>|</span>
            <Link href="/" style={{ color: '#00f0ff', textDecoration: 'none', fontWeight: 'bold' }}>Emanuel.OS ➔</Link>
          </nav>
        </header>

        {/* HUB DE REDES SOCIAIS OFICIAIS */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #c0d0e6', padding: '6px 20px', display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#557ca5', whiteSpace: 'nowrap' }}>Canais Integrados:</span>
          {canaisSociais.map(rede => (
            <a
              key={rede.id}
              href={rede.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '10px', textDecoration: 'none', color: '#fff', backgroundColor: rede.cor,
                padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                fontWeight: 'bold', whiteSpace: 'nowrap'
              }}
            >
              <span>{rede.icone}</span> {rede.nome}
            </a>
          ))}
        </div>

        {/* CORPO DO PERFIL */}
        <main style={{
          maxWidth: '1100px',
          width: '95%',
          margin: '15px auto 40px auto',
          display: 'grid',
          gridTemplateColumns: '270px 1fr 300px',
          gap: '15px',
          boxSizing: 'border-box'
        }}>

          {/* COLUNA ESQUERDA: FOTO E MENU */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #c0d0e6', borderRadius: '4px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ border: '2px solid #ed2580', padding: '4px', borderRadius: '6px', backgroundColor: '#fafafa', marginBottom: '8px' }}>
                <img
                  src="/logo-orkut.png"
                  alt="Emanuel ART"
                  style={{ width: '100%', height: 'auto', maxHeight: '280px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                />
              </div>

              <h2 style={{ fontSize: '15px', color: '#3b5998', margin: '4px 0 2px 0', fontWeight: 'bold' }}>{perfilUsuario.nome}</h2>
              <span style={{ fontSize: '10px', color: '#666', display: 'block' }}>{perfilUsuario.relacionamento}, {perfilUsuario.localizacao}</span>
              <span style={{ fontSize: '9px', color: '#ed2580', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>🔥 Poderoso e Inteligente</span>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #c0d0e6', borderRadius: '4px', padding: '10px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b5998', cursor: 'pointer', padding: '3px 0' }}>
                <span>👤</span> <b>perfil oficial</b>
              </div>
              <div onClick={() => setAbaMuralAtiva('scraps')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b5998', cursor: 'pointer', padding: '3px 0' }}>
                <span>📝</span> <b>recados ({scraps.length})</b>
              </div>
              <div onClick={() => setAbaMuralAtiva('depoimentos')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b5998', cursor: 'pointer', padding: '3px 0' }}>
                <span>💬</span> <b>depoimentos ({depoimentos.length})</b>
              </div>
              <div onClick={() => setAbaMuralAtiva('gerenciar')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ed2580', cursor: 'pointer', padding: '3px 0' }}>
                <span>⚙️</span> <b>conectar @ links & grupos</b>
              </div>
            </div>

            <button
              onClick={exportarPerfilOrkutPDF}
              style={{
                padding: '9px', backgroundColor: '#557ca5', color: '#fff', border: 'none',
                borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              📄 Baixar Perfil Orkut (.PDF)
            </button>
          </section>

          {/* COLUNA CENTRAL: BIO, SELOS, MURAIS COM SETINHAS RETRÁTEIS */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* 🌟 1º QUADRADINHO: PERFIL, BIO, SELOS (COM SETINHA PARA RECOLHER/EXPANDIR) */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #c0d0e6', borderRadius: '4px', padding: '14px', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: blocoPerfilExpandido ? '8px' : '0' }}>
                <h1 style={{ fontSize: '18px', color: '#3b5998', margin: 0, fontWeight: 'bold' }}>{perfilUsuario.nome}</h1>
                <button
                  onClick={() => setBlocoPerfilExpandido(!blocoPerfilExpandido)}
                  style={{
                    background: 'none', border: 'none', color: '#557ca5', fontSize: '13px',
                    cursor: 'pointer', fontWeight: 'bold', padding: '2px 6px', lineHeight: 1
                  }}
                  title={blocoPerfilExpandido ? "Recolher Informações do Perfil" : "Expandir Informações do Perfil"}
                >
                  {blocoPerfilExpandido ? '▲' : '▼'}
                </button>
              </div>

              {blocoPerfilExpandido && (
                <div>
                  <p style={{ fontSize: '11px', color: '#555', margin: '0 0 12px 0', fontStyle: 'italic' }}>"{perfilUsuario.statusBio}"</p>

                  {/* SELOS CLÁSSICOS */}
                  <div style={{ display: 'flex', gap: '18px', padding: '8px 12px', backgroundColor: '#f0f5fb', borderRadius: '4px', border: '1px solid #d8e4f2', fontSize: '11px' }}>
                    <div><span style={{ color: '#666', display: 'block', fontSize: '10px' }}>confiável:</span><span style={{ color: '#22c55e' }}>😊😊😊</span> <b>{perfilUsuario.confiavel}%</b></div>
                    <div><span style={{ color: '#666', display: 'block', fontSize: '10px' }}>legal:</span><span style={{ color: '#3b82f6' }}>🧊🧊🧊</span> <b>{perfilUsuario.legal}%</b></div>
                    <div><span style={{ color: '#666', display: 'block', fontSize: '10px' }}>sexy:</span><span style={{ color: '#ef4444' }}>🔥🔥🔥</span> <b>{perfilUsuario.sexy}%</b></div>
                  </div>

                  <div style={{ marginTop: '14px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#444' }}>
                    <div><b style={{ color: '#3b5998' }}>aniversário:</b> {perfilUsuario.aniversario}</div>
                    <div><b style={{ color: '#3b5998' }}>profissão:</b> {perfilUsuario.profissao}</div>
                    <div><b style={{ color: '#3b5998' }}>quem sou eu:</b> {perfilUsuario.quemSouEu}</div>
                  </div>
                </div>
              )}
            </div>

            {/* 🌟 2º QUADRADINHO: MURAL, CONEXÕES, SCRAPS E DEPOIMENTOS (COM SETINHA PARA RECOLHER/EXPANDIR) */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #c0d0e6', borderRadius: '4px', padding: '14px', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: blocoMuralExpandido ? '1px solid #e0eaf5' : 'none', paddingBottom: blocoMuralExpandido ? '8px' : '0', marginBottom: blocoMuralExpandido ? '10px' : '0' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setAbaMuralAtiva('scraps')} style={{ padding: '6px 12px', border: 'none', borderRadius: '3px', backgroundColor: abaMuralAtiva === 'scraps' ? '#557ca5' : '#e4ebf5', color: abaMuralAtiva === 'scraps' ? '#fff' : '#3b5998', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📝 Scraps ({scraps.length})
                  </button>
                  <button onClick={() => setAbaMuralAtiva('depoimentos')} style={{ padding: '6px 12px', border: 'none', borderRadius: '3px', backgroundColor: abaMuralAtiva === 'depoimentos' ? '#ed2580' : '#e4ebf5', color: abaMuralAtiva === 'depoimentos' ? '#fff' : '#ed2580', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    💖 Depoimentos ({depoimentos.length})
                  </button>
                  <button onClick={() => setAbaMuralAtiva('gerenciar')} style={{ padding: '6px 12px', border: 'none', borderRadius: '3px', backgroundColor: abaMuralAtiva === 'gerenciar' ? '#10b981' : '#e4ebf5', color: abaMuralAtiva === 'gerenciar' ? '#fff' : '#059669', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ⚙️ Conectar Links & Grupos
                  </button>
                </div>

                <button
                  onClick={() => setBlocoMuralExpandido(!blocoMuralExpandido)}
                  style={{
                    background: 'none', border: 'none', color: '#557ca5', fontSize: '13px',
                    cursor: 'pointer', fontWeight: 'bold', padding: '2px 6px', lineHeight: 1
                  }}
                  title={blocoMuralExpandido ? "Recolher Mural e Conexões" : "Expandir Mural e Conexões"}
                >
                  {blocoMuralExpandido ? '▲' : '▼'}
                </button>
              </div>

              {blocoMuralExpandido && (
                <div>
                  {/* ABA: SCRAPS COM MARCAÇÃO */}
                  {abaMuralAtiva === 'scraps' && (
                    <div>
                      <form onSubmit={enviarScrap} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select 
                            value={marcacaoScrapTipo} 
                            onChange={(e) => setMarcacaoScrapTipo(e.target.value)} 
                            style={{ padding: '6px', fontSize: '10px', border: '1px solid #557ca5', borderRadius: '3px', backgroundColor: '#f0f5fb', fontWeight: 'bold', color: '#3b5998' }}
                          >
                            <option value="Amigo(a)">👤 Marcar Amigo / Amiga</option>
                            <option value="Namorado(a)">❤️ Marcar Namorado / Namorada</option>
                            <option value="Grupo / Comunidade">🌐 Jogar no Grupo / Comunidade</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Nome, @usuario ou nome do grupo..." 
                            value={marcacaoScrapAlvo} 
                            onChange={(e) => setMarcacaoScrapAlvo(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px 8px', fontSize: '10px', border: '1px solid #c0d0e6', borderRadius: '3px', outline: 'none' }} 
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            required
                            placeholder="Escreva o Scrap (Recado)..." 
                            value={novoScrapInput} 
                            onChange={(e) => setNovoScrapInput(e.target.value)} 
                            style={{ flexGrow: 1, padding: '7px 10px', fontSize: '11px', border: '1px solid #c0d0e6', borderRadius: '3px', outline: 'none' }} 
                          />
                          <button type="submit" style={{ padding: '7px 14px', backgroundColor: '#557ca5', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Postar Scrap
                          </button>
                        </div>
                      </form>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {scraps.map(s => (
                          <div key={s.id} style={{ backgroundColor: '#f7f9fc', border: '1px solid #e0eaf5', padding: '8px 10px', borderRadius: '3px', fontSize: '11px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3b5998', fontWeight: 'bold' }}>
                              <span>{s.autor} <span style={{ color: '#ed2580', fontSize: '9px' }}>({s.marcadoPara})</span></span>
                              <span style={{ fontSize: '9px', color: '#999' }}>{s.horario}</span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', color: '#444' }}>{s.texto}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABA: DEPOIMENTOS COM MARCAÇÃO */}
                  {abaMuralAtiva === 'depoimentos' && (
                    <div>
                      <form onSubmit={enviarDepoimento} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select 
                            value={marcacaoDepoimentoTipo} 
                            onChange={(e) => setMarcacaoDepoimentoTipo(e.target.value)} 
                            style={{ padding: '6px', fontSize: '10px', border: '1px solid #ed2580', borderRadius: '3px', backgroundColor: '#fff5f8', fontWeight: 'bold', color: '#ed2580' }}
                          >
                            <option value="Amigo(a)">👤 Depoimento para Amigo(a)</option>
                            <option value="Namorado(a)">❤️ Declaração para Namorado(a)</option>
                            <option value="Grupo / Comunidade">🌐 Jogar no Grupo / Comunidade</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Nome, @usuario ou comunidade..." 
                            value={marcacaoDepoimentoAlvo} 
                            onChange={(e) => setMarcacaoDepoimentoAlvo(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px 8px', fontSize: '10px', border: '1px solid #ed2580', borderRadius: '3px', outline: 'none' }} 
                          />
                        </div>

                        <textarea 
                          required
                          placeholder="Escreva um depoimento especial de coração..." 
                          value={novoDepoimentoInput} 
                          onChange={(e) => setNovoDepoimentoInput(e.target.value)} 
                          style={{ width: '100%', height: '50px', padding: '6px 10px', fontSize: '11px', border: '1px solid #ed2580', borderRadius: '3px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} 
                        />
                        <button type="submit" style={{ padding: '6px', backgroundColor: '#ed2580', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                          💖 Enviar Depoimento com Marcação
                        </button>
                      </form>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {depoimentos.map(d => (
                          <div key={d.id} style={{ backgroundColor: '#fff5f8', border: '1px solid #fbd0df', padding: '8px 10px', borderRadius: '3px', fontSize: '11px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ed2580', fontWeight: 'bold' }}>
                              <span>{d.autor} <span style={{ color: '#557ca5', fontSize: '9px' }}>({d.marcadoPara})</span></span>
                              <span style={{ fontSize: '9px', color: '#999' }}>{d.data}</span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', color: '#444', fontStyle: 'italic' }}>"{d.texto}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABA: GERENCIADOR DE CONEXÕES LINK @ & SOLICITAÇÃO */}
                  {abaMuralAtiva === 'gerenciar' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      
                      {/* FORMULÁRIO: CONECTAR AMIGO VIA LINK @ OU SOLICITAÇÃO */}
                      <form onSubmit={adicionarAmigo} style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '11px', color: '#16a34a', display: 'block', marginBottom: '6px' }}>
                          ➕ Conectar Novo Amigo das Redes (Link @ ou Solicitação)
                        </strong>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                          <select value={novoAmigoRede} onChange={(e) => setNovoAmigoRede(e.target.value)} style={{ padding: '6px', fontSize: '10px', border: '1px solid #86efac', borderRadius: '3px' }}>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Kwai">Kwai</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Threads">Threads</option>
                            <option value="Gmail">Gmail</option>
                            <option value="Google">Google</option>
                          </select>

                          <select value={novoAmigoTipoAcao} onChange={(e) => setNovoAmigoTipoAcao(e.target.value)} style={{ padding: '6px', fontSize: '10px', border: '1px solid #86efac', borderRadius: '3px' }}>
                            <option value="link">Vincular por Link / @</option>
                            <option value="solicitacao">Enviar Solicitação Direta</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            required 
                            placeholder="Digite o @usuario ou link do perfil..." 
                            value={novoAmigoInput} 
                            onChange={(e) => setNovoAmigoInput(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px', fontSize: '10px', border: '1px solid #86efac', borderRadius: '3px' }} 
                          />
                          <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Conectar
                          </button>
                        </div>
                      </form>

                      {/* FORMULÁRIO: BUSCAR / CONECTAR GRUPO OU COMUNIDADE */}
                      <form onSubmit={conectarGrupoOuComunidade} style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '11px', color: '#2563eb', display: 'block', marginBottom: '6px' }}>
                          🔍 Buscar / Conectar Grupo ou Comunidade (Link @ ou Solicitação)
                        </strong>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                          <select value={novaComunidadeRede} onChange={(e) => setNovaComunidadeRede(e.target.value)} style={{ padding: '6px', fontSize: '10px', border: '1px solid #93c5fd', borderRadius: '3px' }}>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Kwai">Kwai</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Threads">Threads</option>
                            <option value="Gmail">Gmail</option>
                            <option value="Google">Google</option>
                          </select>

                          <input 
                            type="text" 
                            placeholder="Categoria (ex: Animes, Games, Vídeos)..." 
                            value={novaComunidadeTipo} 
                            onChange={(e) => setNovaComunidadeTipo(e.target.value)} 
                            style={{ padding: '6px', fontSize: '10px', border: '1px solid #93c5fd', borderRadius: '3px' }} 
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            required 
                            placeholder="Nome do grupo, @comunidade ou link do grupo..." 
                            value={buscaGrupoInput} 
                            onChange={(e) => setBuscaGrupoInput(e.target.value)} 
                            style={{ flexGrow: 1, padding: '6px', fontSize: '10px', border: '1px solid #93c5fd', borderRadius: '3px' }} 
                          />
                          <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Conectar Grupo
                          </button>
                        </div>
                      </form>

                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* COLUNA DIREITA: AMIGOS E COMUNIDADES REAIS CONECTADOS */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* LISTA DE AMIGOS CADASTRADOS */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #c0d0e6', borderRadius: '4px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0eaf5', paddingBottom: '6px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12px', color: '#3b5998', margin: 0, fontWeight: 'bold' }}>meus amigos ({amigos.length})</h3>
                <span onClick={() => { setBlocoMuralExpandido(true); setAbaMuralAtiva('gerenciar'); }} style={{ fontSize: '10px', color: '#557ca5', cursor: 'pointer' }}>+ adicionar</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                {amigos.slice(0, 9).map(a => (
                  <div key={a.id} style={{ fontSize: '9px' }}>
                    <div style={{ width: '42px', height: '42px', backgroundColor: '#e4ebf5', border: '1px solid #c0d0e6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', margin: '0 auto 2px auto' }}>
                      {a.icone || '👤'}
                    </div>
                    <span style={{ color: '#3b5998', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.nome}</span>
                    <span style={{ color: '#888', fontSize: '8px' }}>{a.rede}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LISTA DE COMUNIDADES E GRUPOS CADASTRADOS */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #c0d0e6', borderRadius: '4px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0eaf5', paddingBottom: '6px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12px', color: '#3b5998', margin: 0, fontWeight: 'bold' }}>comunidades & grupos ({comunidades.length})</h3>
                <span onClick={() => { setBlocoMuralExpandido(true); setAbaMuralAtiva('gerenciar'); }} style={{ fontSize: '10px', color: '#557ca5', cursor: 'pointer' }}>+ buscar</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {comunidades.slice(0, 5).map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', padding: '4px 0', borderBottom: '1px dashed #f0f0f0' }}>
                    <span style={{ fontSize: '16px' }}>{c.icone || '🌐'}</span>
                    <div>
                      <strong style={{ color: '#3b5998', display: 'block' }}>{c.nome}</strong>
                      <span style={{ color: '#888', fontSize: '8px' }}>{c.tipo} ({c.rede})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGO EM SOCIAL 3D */}
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff', border: '1px solid #c0d0e6', borderRadius: '4px' }}>
              <span style={{ fontSize: '10px', color: '#ed2580', fontWeight: 'bold', display: 'block' }}>ORKUT EM SOCIAL 3D</span>
              <span style={{ fontSize: '9px', color: '#888' }}>Poderoso e Inteligente</span>
            </div>

          </section>

        </main>
      </div>

      <FuturisticWindowManager />
    </div>
  );
}