import React, { useState } from 'react';

export default function EmanuelNarutoAIPro() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [chakra, setChakra] = useState(0); // Começa com 0 Chakra

  // Simulação de Ganhar Chakra assistindo anúncio
  const assistirAnuncioParaGanharChakra = () => {
    alert("🎥 Carregando anúncio... (No futuro, aqui abrirá o Google AdSense)");
    setTimeout(() => {
      setChakra(prev => prev + 5); // Ganha 5 de Chakra
      alert("✅ Anúncio assistido! Você recuperou 5 de Chakra.");
    }, 2000);
  };

  const gerarImagem = () => {
    if (chakra <= 0) return alert("❌ Chakra Esgotado! Assista a um anúncio para recuperar suas energias.");
    if (!prompt) return alert("Escreva seu comando, Emanuel!");
    
    setCarregando(true);
    setResultado(null);

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " naruto style anime high quality")}`;
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setResultado(url);
      setCarregando(false);
      setChakra(prev => prev - 1); // Gasta 1 de Chakra por geração
    };
    img.onerror = () => {
      alert("Erro na invocação! Tente novamente.");
      setCarregando(false);
    };
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Barra de Topo com Contador de Chakra */}
      <header style={headerEstilo}>
        <h2 style={{ color: 'orange', margin: 0 }}>EMANUEL NARUTO AI PRO 🍥</h2>
        <div style={badgeChakra}>
          <span>Chakra: {chakra}</span>
          <div style={{ height: '8px', width: '50px', backgroundColor: '#333', borderRadius: '5px', marginLeft: '10px' }}>
             <div style={{ height: '100%', width: `${(chakra/10)*100}%`, backgroundColor: '#4285F4', borderRadius: '5px' }}></div>
          </div>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* BOTÃO DE MONETIZAÇÃO (GANHAR CHAKRA) */}
        <div style={containerMonetizacao}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Ficou sem energia? Recupere agora!</p>
          <button onClick={assistirAnuncioParaGanharChakra} style={botaoAnuncio}>
            📺 ASSISTIR ANÚNCIO (+5 CHAKRA)
          </button>
        </div>

        <div style={containerIA}>
          <h3 style={{ color: 'orange' }}>Gerador de Invocações IA</h3>
          <input 
            type="text" 
            placeholder="Ex: Naruto Modo Sennin..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={inputEstilo}
          />

          <button onClick={gerarImagem} disabled={carregando} style={botaoGerar(carregando)}>
            {carregando ? "INVOCANDO JUTSU..." : "GERAR (Gasta 1 Chakra)"}
          </button>

          {/* ÁREA DO RESULTADO */}
          <div style={{ marginTop: '20px' }}>
            {carregando && <p style={{ color: 'orange' }}>🌀 Concentrando Chakra... Aguarde.</p>}
            {resultado && (
              <div style={molduraImagem}>
                <img src={resultado} alt="IA Naruto" style={{ width: '100%', borderRadius: '10px' }} />
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#888' }}>Desenvolvido por Emanuel</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ESTILOS
const headerEstilo = { padding: '15px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', flexWrap: 'wrap', gap: '10px' };
const badgeChakra = { display: 'flex', alignItems: 'center', backgroundColor: '#000', padding: '10px', borderRadius: '20px', border: '1px solid #4285F4' };
const containerMonetizacao = { backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '15px', marginBottom: '20px', border: '1px dashed orange' };
const botaoAnuncio = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const containerIA = { backgroundColor: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #333' };
const inputEstilo = { width: '100%', padding: '15px', borderRadius: '10px', border: '2px solid orange', backgroundColor: '#222', color: 'white', marginBottom: '15px', outline: 'none' };
const botaoGerar = (c) => ({ width: '100%', padding: '15px', backgroundColor: c ? '#555' : 'orange', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' });
const molduraImagem = { border: '2px solid orange', padding: '10px', borderRadius: '15px', backgroundColor: '#000' };
