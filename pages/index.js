import React, { useState } from 'react';

export default function EmanuelNarutoAIPro() {
  const [abaAtiva, setAbaAtiva] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [chakra, setChakra] = useState(5);
  const [modoNoite, setModoNoite] = useState(true);
  const [user, setUser] = useState(null);
  const [mensagens, setMensagens] = useState([
    { id: 1, texto: "Bem-vindo à Vila da Folha! 🍥", user: "Kakashi" },
    { id: 2, texto: "Alguém quer treinar hoje? 🦊", user: "Naruto" }
  ]);

  const toggleTema = () => setModoNoite(!modoNoite);
  const fazerLogin = () => {
    setUser({ nome: "Emanuel" });
    alert("Iniciando Login com Google...");
  };

  const cores = {
    fundo: modoNoite ? '#0a0a0a' : '#f0f0f0',
    texto: modoNoite ? '#fff' : '#000',
    card: modoNoite ? '#111' : '#fff',
    borda: 'orange'
  };

  const gerarImagem = (custo, extraPrompt = "") => {
    if (chakra < custo) return alert(`❌ Chakra insuficiente! Precisa de ${custo}.`);
    if (!prompt) return alert("Escreva seu comando!");
    setCarregando(true);
    setResultado(null);
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " " + extraPrompt + " naruto style anime") }?seed=${seed}`;
    const img = new Image();
    img.src = url;
    img.onload = () => { setResultado(url); setCarregando(false); setChakra(prev => prev - custo); };
  };

  return (
    <div style={{ backgroundColor: cores.fundo, color: cores.texto, minHeight: '100vh', fontFamily: 'sans-serif', transition: '0.3s' }}>
      
      {/* HEADER COMPLETO */}
      <header style={headerEstilo(cores)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h4 style={{ color: 'orange', margin: 0, fontSize: '11px' }}>EMANUEL AI</h4>
          <button onClick={fazerLogin} style={botaoLogin}>
            {user ? "Conectado" : "Conectar Google"}
          </button>
          <button onClick={toggleTema} style={botaoTema}>
            {modoNoite ? '☀️' : '🌙'}
          </button>
        </div>
        <div style={badgeChakra}>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Chakra: {chakra}</span>
        </div>
      </header>

      {/* MENU DE ABAS */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px' }}>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>Gerador IA</button>
        <button onClick={() => setAbaAtiva('chat')} style={abaEstilo(abaAtiva === 'chat')}>Vila da Folha (Chat)</button>
      </nav>

      <main style={{ padding: '15px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        
        {abaAtiva === 'ia' && (
          <div style={containerCard(cores)}>
            <input 
              type="text" placeholder="Ex: Naruto vs Sasuke..." value={prompt}
              onChange={(e) => setPrompt(e.target.value)} style={inputEstilo(cores)}
            />
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => gerarImagem(1)} style={botaoSimples}>Comum (1C)</button>
              <button onClick={() => gerarImagem(10, "masterpiece, ultra detailed")} style={botaoAvancado}>Aprofundada (10C)</button>
            </div>
            <button onClick={() => setChakra(chakra + 5)} style={botaoAnuncio}>📺 +5 CHAKRA</button>
            <div style={{ marginTop: '15px' }}>
              {carregando && <p style={{ color: 'orange' }}>🌀 Realizando Jutsu...</p>}
              {resultado && (
                <div style={molduraImagem}>
                  <img src={resultado} alt="IA" style={{ width: '100%', borderRadius: '10px' }} />
                  <a href={resultado} download style={botaoDownload}>⬇️ BAIXAR FOTO</a>
                </div>
              )}
            </div>
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={containerCard(cores)}>
            <h3 style={{ color: 'orange', marginTop: 0 }}>Bate-papo Ninja 🍥</h3>
            <div style={boxChat}>
              {mensagens.map(m => (
                <div key={m.id} style={{ textAlign: 'left', marginBottom: '10px', padding: '5px' }}>
                  <b style={{ color: 'orange', fontSize: '12px' }}>{m.user}:</b>
                  <p style={{ margin: 0, fontSize: '14px' }}>{m.texto}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              <input type="text" placeholder="Diga algo... 🦊⚡🗡️" style={inputEstilo(cores)} />
              <button style={botaoSimples}>Enviar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS
const headerEstilo = (c) => ({ padding: '10px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: c.card, position: 'sticky', top: 0, zIndex: 100 });
const botaoLogin = { backgroundColor: '#4285F4', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' };
const badgeChakra = { backgroundColor: '#000', padding: '5px 10px', borderRadius: '15px', border: '1px solid #4285F4', color: '#fff' };
const abaEstilo = (ativo) => ({ background: 'none', border: 'none', color: ativo ? 'orange' : '#888', borderBottom: ativo ? '2px solid orange' : 'none', cursor: 'pointer', fontWeight: 'bold', padding: '5px' });
const containerCard = (c) => ({ backgroundColor: c.card, padding: '20px', borderRadius: '20px', border: `1px solid ${c.borda}` });
const inputEstilo = (c) => ({ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid orange', backgroundColor: c.fundo, color: c.texto });
const botaoSimples = { flex: 1, padding: '10px', backgroundColor: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const botaoAvancado = { flex: 1, padding: '10px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const botaoAnuncio = { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const botaoDownload = { display: 'block', marginTop: '10px', padding: '8px', backgroundColor: '#fff', color: '#000', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' };
const molduraImagem = { border: '2px solid orange', padding: '8px', borderRadius: '12px', backgroundColor: '#000' };
const botaoTema = { background: 'none', border: '1px solid orange', borderRadius: '50%', cursor: 'pointer', padding: '4px' };
const boxChat = { height: '200px', backgroundColor: '#000', borderRadius: '10px', padding: '10px', overflowY: 'scroll', border: '1px solid #333' };
