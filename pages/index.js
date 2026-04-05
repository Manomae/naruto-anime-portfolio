import React, { useState } from 'react';

export default function NarutoPortalIA() {
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerarConteudoIA = () => {
    if (!prompt) return alert("Escreva o que a IA deve gerar, Ninja!");
    setCarregando(true);
    
    // Simulação de geração (Enquanto configuramos a API gratuita depois)
    setTimeout(() => {
      setCarregando(false);
      alert("IA Processando: " + prompt + "\n(Em breve as imagens aparecerão aqui!)");
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Topo Simples */}
      <header style={{ padding: '20px', borderBottom: '2px solid orange', textAlign: 'center' }}>
        <h2 style={{ color: 'orange', margin: 0 }}>NARUTO GENERATOR IA 🤖</h2>
      </header>

      {/* Menu de Abas */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
        <button onClick={() => setAbaAtiva('inicio')} style={abaEstilo(abaAtiva === 'inicio')}>Início</button>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>Gerador IA</button>
      </nav>

      {/* Área da IA */}
      <main style={{ padding: '20px' }}>
        {abaAtiva === 'ia' && (
          <div style={cardIA}>
            <h3 style={{ color: 'orange' }}>🌀 O que você quer criar hoje?</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>Ex: "Naruto usando Rasengan no espaço" ou "Gif do Sasuke correndo"</p>
            
            <input 
              type="text" 
              placeholder="Descreva seu vídeo, imagem ou GIF..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={inputEstilo}
            />

            <button 
              onClick={gerarConteudoIA}
              disabled={carregando}
              style={botaoGerar(carregando)}>
              {carregando ? "Invocando Jutsu de IA..." : "Gerar com IA (Grátis)"}
            </button>

            <div style={{ marginTop: '30px', border: '1px dashed #444', height: '200px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#555' }}>O resultado aparecerá aqui em 5-10 segundos</p>
            </div>
          </div>
        )}

        {abaAtiva === 'inicio' && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>Bem-vindo ao Futuro do Portfólio!</h3>
            <p>Use a aba Gerador IA para testar nossa inteligência artificial.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Estilos
const abaEstilo = (ativo) => ({ background: 'none', border: 'none', color: ativo ? 'orange' : '#888', borderBottom: ativo ? '2px solid orange' : 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', padding: '10px' });
const cardIA = { maxWidth: '600px', margin: '0 auto', padding: '30px', backgroundColor: '#111', borderRadius: '20px', border: '1px solid #333', textAlign: 'center' };
const inputEstilo = { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid orange', backgroundColor: '#222', color: 'white', marginBottom: '20px', outline: 'none', fontSize: '16px' };
const botaoGerar = (carregando) => ({ width: '100%', padding: '15px', backgroundColor: carregando ? '#555' : 'orange', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' });
