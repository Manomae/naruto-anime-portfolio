import React, { useState, useEffect } from 'react';

export default function NarutoPortal() {
  const [abaAtiva, setAbaAtiva] = useState('diario');
  const [user, setUser] = useState(null);

  // Simulação de Anúncio Diário (Muda todo dia)
  const anuncioDoDia = {
    titulo: "🔥 DESTAQUE DE HOJE",
    videoUrl: "https://www.youtube.com/embed/ogcXkCCpARU", // Ep 1 como exemplo
    linkAfiliado: "#", // Aqui você colocará seu link de ganho no futuro
    texto: "Assista ao episódio lendário e ganhe pergaminhos!"
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Barra de Topo com Login */}
      <header style={{ padding: '15px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111' }}>
        <h2 style={{ color: 'orange', margin: 0 }}>NARUTO PRO 🍥</h2>
        <button 
          onClick={() => alert("Conectando ao Google...")} 
          style={loginBotao}>
          {user ? `Olá, Ninja` : "Entrar com Google"}
        </button>
      </header>

      {/* Seção de Anúncio Diário */}
      <section style={secaoAnuncio}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#ff4500' }}>{anuncioDoDia.titulo}</h3>
          <p>{anuncioDoDia.texto}</p>
          <button style={botaoAposta}>Apoiar Projeto / Ver Anúncio</button>
        </div>
        <div style={{ flex: 1, height: '200px', borderRadius: '10px', overflow: 'hidden' }}>
          <iframe width="100%" height="100%" src={anuncioDoDia.videoUrl} frameBorder="0" allowFullScreen></iframe>
        </div>
      </section>

      {/* Abas de Conteúdo */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
        <button onClick={() => setAbaAtiva('diario')} style={abaEstilo(abaAtiva === 'diario')}>Início</button>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>Gerador IA (Beta)</button>
        <button onClick={() => setAbaAtiva('chat')} style={abaEstilo(abaAtiva === 'chat')}>Vila da Folha (Chat)</button>
      </nav>

      {/* Conteúdo Dinâmico */}
      <main style={{ padding: '20px', textAlign: 'center' }}>
        {abaAtiva === 'diario' && <p>Bem-vindo ao portal! Os vídeos diários serão postados aqui.</p>}
        {abaAtiva === 'ia' && (
          <div style={cardIA}>
            <h3>🤖 Gerador de Vídeos IA</h3>
            <p>Em breve: Gere vídeos de 10s do seu Ninja favorito!</p>
            <button disabled style={{ padding: '10px', cursor: 'not-allowed' }}>Gerar com IA (Aguardando Créditos)</button>
          </div>
        )}
        {abaAtiva === 'chat' && <p>O Chat com emojis de Naruto está sendo selado...</p>}
      </main>
    </div>
  );
}

// Estilos
const loginBotao = { backgroundColor: '#4285F4', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
const secaoAnuncio = { margin: '20px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px solid #333', display: 'flex', gap: '20px', flexWrap: 'wrap' };
const botaoAposta = { backgroundColor: 'orange', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' };
const abaEstilo = (ativo) => ({ background: 'none', border: 'none', color: ativo ? 'orange' : '#888', borderBottom: ativo ? '2px solid orange' : 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' });
const cardIA = { padding: '40px', border: '2px dashed #444', borderRadius: '20px' };
