import React, { useState } from 'react';

export default function NarutoPortalPro() {
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Função para Gerar Imagem Real (Usando repositório gratuito de IA)
  const gerarComIA = async () => {
    if (!prompt) return alert("Escreva algo para a IA, Ninja!");
    
    setCarregando(true);
    setResultado(null);

    // Criando um link de imagem baseado na sua descrição (Usa IA Pollinations - Grátis)
    const urlGerada = `https://pollinations.ai/p/${encodeURIComponent(prompt + " naruto anime style high resolution")}`;
    
    // Simulando o tempo de "pensamento" da IA
    setTimeout(() => {
      setResultado(urlGerada);
      setCarregando(false);
    }, 3000);
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Barra de Topo com Login Google */}
      <header style={{ padding: '15px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111' }}>
        <h2 style={{ color: 'orange', margin: 0 }}>NARUTO AI PRO 🍥</h2>
        <button 
          onClick={() => alert("Firebase: Iniciando Login com Google...")} 
          style={{ backgroundColor: '#4285F4', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          Entrar com Google
        </button>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ color: 'orange' }}>Gerador de Invocações (IA)</h3>
          <p style={{ color: '#888' }}>Descreva qualquer coisa de Naruto e a IA criará para você.</p>
        </div>

        {/* Campo de Texto */}
        <input 
          type="text" 
          placeholder="Ex: Naruto modo Baryon lutando..." 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid orange', backgroundColor: '#222', color: 'white', marginBottom: '15px', outline: 'none' }}
        />

        <button 
          onClick={gerarComIA}
          disabled={carregando}
          style={{ width: '100%', padding: '15px', backgroundColor: carregando ? '#555' : 'orange', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          {carregando ? "EXECUTANDO JUTSU DE IA..." : "GERAR IMAGEM AGORA"}
        </button>

        {/* RESULTADO DA IA */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          {carregando && (
            <div style={{ padding: '20px', border: '2px dashed orange', borderRadius: '10px' }}>
              <p>Concentrando Chakra... (Aguarde 5 segundos)</p>
            </div>
          )}

          {resultado && !carregando && (
            <div style={{ borderRadius: '15px', overflow: 'hidden', border: '2px solid orange', boxShadow: '0 0 20px rgba(255, 165, 0, 0.5)' }}>
              <img src={resultado} alt="Resultado IA" style={{ width: '100%', display: 'block' }} />
              <div style={{ padding: '10px', backgroundColor: '#111' }}>
                <p style={{ fontSize: '12px', color: 'orange' }}>Imagem gerada com sucesso! 🔥</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
