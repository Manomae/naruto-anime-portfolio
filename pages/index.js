import React, { useState } from 'react';

export default function EmanuelNarutoAIPro() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [chakra, setChakra] = useState(5);
  const [modoNoite, setModoNoite] = useState(true);

  // Alternar entre Modo Noturno e Dia
  const toggleTema = () => setModoNoite(!modoNoite);

  const cores = {
    fundo: modoNoite ? '#0a0a0a' : '#f0f0f0',
    texto: modoNoite ? '#fff' : '#000',
    card: modoNoite ? '#111' : '#fff',
    borda: 'orange'
  };

  const gerarImagem = (custo, extraPrompt = "") => {
    if (chakra < custo) return alert(`❌ Chakra insuficiente! Você precisa de ${custo} Chakras.`);
    if (!prompt) return alert("Escreva seu comando!");
    
    setCarregando(true);
    setResultado(null);

    // Variação Aleatória para não repetir fotos
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " " + extraPrompt + " naruto style anime 4k") }?seed=${seed}&width=1024&height=1024`;
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setResultado(url);
      setCarregando(false);
      setChakra(prev => prev - custo);
    };
  };

  const baixarImagem = () => {
    const link = document.createElement('a');
    link.href = resultado;
    link.download = `Emanuel_AI_Naruto_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: cores.fundo, color: cores.texto, minHeight: '100vh', fontFamily: 'sans-serif', transition: '0.3s' }}>
      
      <header style={headerEstilo(cores)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h4 style={{ color: 'orange', margin: 0, fontSize: '12px' }}>EMANUEL NARUTO AI</h4>
          <button onClick={toggleTema} style={botaoTema}>
            {modoNoite ? '☀️ Dia' : '🌙 Noite'}
          </button>
        </div>

        <div style={badgeChakra}>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Chakra: {chakra}</span>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        <div style={containerIA(cores)}>
          <h3 style={{ color: 'orange' }}>Invocação de Arte Ninja</h3>
          <input 
            type="text" 
            placeholder="Ex: Sasuke vs Itachi..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={inputEstilo(cores)}
          />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => gerarImagem(1)} disabled={carregando} style={botaoSimples}>
              Gerar Comum (1 C)
            </button>
            <button onClick={() => gerarImagem(10, "highly detailed, cinematic lighting, masterpiece, sharp focus")} disabled={carregando} style={botaoAvancado}>
              Busca Aprofundada (10 C)
            </button>
          </div>

          <button onClick={() => setChakra(chakra + 5)} style={botaoAnuncio}>
            📺 RECUPERAR +5 CHAKRA
          </button>

          <div style={{ marginTop: '20px' }}>
            {carregando && <p style={{ color: 'orange' }}>🌀 Realizando Jutsu de Busca...</p>}
            {resultado && (
              <div style={molduraImagem}>
                <img src={resultado} alt="IA" style={{ width: '100%', borderRadius: '10px' }} />
                <button onClick={baixarImagem} style={botaoDownload}>
                  ⬇️ BAIXAR FOTO (DOWNLOAD)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ESTILOS
const headerEstilo = (c) => ({ padding: '10px 15px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: c.card });
const containerIA = (c) => ({ backgroundColor: c.card, padding: '20px', borderRadius: '20px', border: `1px solid ${c.borda}`, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' });
const inputEstilo = (c) => ({ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid orange', backgroundColor: c.fundo, color: c.texto, marginBottom: '15px' });
const badgeChakra = { backgroundColor: '#000', padding: '5px 12px', borderRadius: '15px', border: '1px solid #4285F4', color: '#fff' };
const botaoSimples = { flex: 1, padding: '12px', backgroundColor: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const botaoAvancado = { flex: 1, padding: '12px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const botaoAnuncio = { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' };
const botaoDownload = { marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#fff', color: '#000', border: '1px solid #000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const molduraImagem = { border: '2px solid orange', padding: '10px', borderRadius: '15px', backgroundColor: '#000', marginTop: '20px' };
const botaoTema = { padding: '5px 10px', borderRadius: '5px', border: '1px solid orange', background: 'none', color: 'orange', fontSize: '10px', cursor: 'pointer' };
