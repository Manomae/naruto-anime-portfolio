import React, { useState } from 'react';

export default function EmanuelNarutoAIPro() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [chakra, setChakra] = useState(0);
  const [user, setUser] = useState(null);

  const fazerLogin = () => {
    setUser({ nome: "Emanuel" });
    alert("Iniciando Login com Google...");
  };

  const assistirAnuncioParaGanharChakra = () => {
    alert("🎥 Carregando anúncio...");
    setTimeout(() => {
      setChakra(prev => prev + 5);
      alert("✅ +5 de Chakra recuperados!");
    }, 2000);
  };

  const gerarImagem = () => {
    if (chakra <= 0) return alert("❌ Chakra Esgotado! Assista a um anúncio.");
    if (!prompt) return alert("Escreva seu comando!");
    
    setCarregando(true);
    setResultado(null);

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " naruto style anime high quality")}`;
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setResultado(url);
      setCarregando(false);
      setChakra(prev => prev - 1);
    };
    img.onerror = () => {
      alert("Erro na invocação!");
      setCarregando(false);
    };
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER ATUALIZADO: Nome, Login e Chakra juntos */}
      <header style={headerEstilo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h4 style={{ color: 'orange', margin: 0, fontSize: '14px', textTransform: 'uppercase' }}>Emanuel Naruto AI</h4>
          <button onClick={fazerLogin} style={botaoLogin}>
            {user ? "Conectado" : "Conectar Google"}
          </button>
        </div>

        <div style={badgeChakra}>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Chakra: {chakra}</span>
          <div style={barraChakraFundo}>
             <div style={{ height: '100%', width: `${Math.min((chakra/10)*100, 100)}%`, backgroundColor: '#4285F4', borderRadius: '5px', transition: '0.5s' }}></div>
          </div>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        <div style={containerMonetizacao}>
          <button onClick={assistirAnuncioParaGanharChakra} style={botaoAnuncio}>
            📺 ASSISTIR ANÚNCIO (+5 CHAKRA)
          </button>
        </div>

        <div style={containerIA}>
          <h3 style={{ color: 'orange', marginTop: 0 }}>Gerador de Invocações IA</h3>
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

          <div style={{ marginTop: '20px' }}>
            {carregando && <p style={{ color: 'orange' }}>🌀 Concentrando Chakra...</p>}
            {resultado && (
              <div style={molduraImagem}>
                <img src={resultado} alt="IA Naruto" style={{ width: '100%', borderRadius: '10px' }} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ESTILOS ATUALIZADOS
const headerEstilo = { 
  padding: '10px 15px', 
  borderBottom: '2px solid orange', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  backgroundColor: '#111',
  position: 'sticky',
  top: 0,
  zIndex: 100
};

const botaoLogin = { 
  backgroundColor: '#4285F4', 
  color: 'white', 
  border: 'none', 
  padding: '6px 10px', 
  borderRadius: '4px', 
  cursor: 'pointer', 
  fontSize: '11px', 
  fontWeight: 'bold' 
};

const badgeChakra = { 
  display: 'flex', 
  alignItems: 'center', 
  backgroundColor: '#000', 
  padding: '5px 10px', 
  borderRadius: '15px', 
  border: '1px solid #4285F4' 
};

const barraChakraFundo = { 
  height: '6px', 
  width: '40px', 
  backgroundColor: '#333', 
  borderRadius: '5px', 
  marginLeft: '8px',
  overflow: 'hidden'
};

const containerMonetizacao = { backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '15px', marginBottom: '20px', border: '1px dashed orange' };
const botaoAnuncio = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };
const containerIA = { backgroundColor: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #333' };
const inputEstilo = { width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid orange', backgroundColor: '#222', color: 'white', marginBottom: '15px', outline: 'none' };
const botaoGerar = (c) => ({ width: '100%', padding: '15px', backgroundColor: c ? '#555' : 'orange', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' });
const molduraImagem = { border: '2px solid orange', padding: '8px', borderRadius: '12px', backgroundColor: '#000' };
