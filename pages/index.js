import React, { useState } from 'react';

export default function EmanuelNarutoAIPro() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [user, setUser] = useState(null);

  // Função de Login Simulada (Para não dar erro de falta de chave)
  const fazerLogin = () => {
    setUser({ nome: "Ninja Emanuel", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naruto" });
    alert("Bem-vindo ao Emanuel Naruto AI Pro! Login realizado.");
  };

  const gerarImagem = () => {
    if (!prompt) return alert("Escreva seu comando, Emanuel!");
    
    setCarregando(true);
    setResultado(null);

    // Usando um motor de IA mais estável
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " naruto style anime high quality")}`;
    
    // Força o carregamento da imagem antes de mostrar
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setResultado(url);
      setCarregando(false);
    };
    img.onerror = () => {
      alert("Chakra insuficiente! Tente gerar novamente.");
      setCarregando(false);
    };
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER COM SEU NOME */}
      <header style={{ padding: '20px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111' }}>
        <h2 style={{ color: 'orange', margin: 0 }}>EMANUEL NARUTO AI PRO 🍥</h2>
        <button onClick={fazerLogin} style={botaoLogin}>
          {user ? `Logado como ${user.nome}` : "Entrar com Google"}
        </button>
      </header>

      <main style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={containerIA}>
          <h3 style={{ color: 'orange' }}>Gerador de Invocações</h3>
          <input 
            type="text" 
            placeholder="Ex: Naruto usando Rasengan azul..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={inputEstilo}
          />

          <button onClick={gerarImagem} disabled={carregando} style={botaoGerar(carregando)}>
            {carregando ? "INVOCANDO JUTSU..." : "GERAR IMAGEM AGORA"}
          </button>

          {/* ÁREA DO RESULTADO */}
          <div style={{ marginTop: '20px' }}>
            {carregando && <p style={{ color: 'orange' }}>🌀 Concentrando Chakra... Aguarde.</p>}
            {resultado && (
              <div style={molduraImagem}>
                <img src={resultado} alt="IA Naruto" style={{ width: '100%', borderRadius: '10px' }} />
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#888' }}>Gerado por Emanuel Naruto AI Pro</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ESTILOS
const botaoLogin = { backgroundColor: '#4285F4', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const containerIA = { backgroundColor: '#111', padding: '25px', borderRadius: '20px', border: '1px solid #333' };
const inputEstilo = { width: '100%', padding: '15px', borderRadius: '10px', border: '2px solid orange', backgroundColor: '#222', color: 'white', marginBottom: '15px', outline: 'none' };
const botaoGerar = (c) => ({ width: '100%', padding: '15px', backgroundColor: c ? '#555' : 'orange', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' });
const molduraImagem = { border: '2px solid orange', padding: '10px', borderRadius: '15px', backgroundColor: '#000' };
