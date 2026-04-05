import React, { useState } from 'react';

export default function NarutoPortfolio() {
  const [abaAtiva, setAbaAtiva] = useState('classico');

  const episodios = {
    classico: [
      { id: 1, titulo: "Episódio 01", desc: "Entra Naruto Uzumaki!" },
      { id: 2, titulo: "Episódio 02", desc: "Meu nome é Konohamaru!" },
    ],
    shippuden: [
      { id: 1, titulo: "Episódio 01", desc: "Volta para Casa" },
      { id: 2, titulo: "Episódio 02", desc: "Os Akatsuki em Ação" },
    ]
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      
      <header style={{ textAlign: 'center', borderBottom: '2px solid orange', marginBottom: '30px', paddingBottom: '10px' }}>
        <h1 style={{ color: 'orange', textTransform: 'uppercase', letterSpacing: '2px' }}>Naruto Archive 🍥</h1>
        <p style={{ color: '#888' }}>Portfólio de Episódios Dublados</p>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        <button onClick={() => setAbaAtiva('classico')} style={botaoEstilo(abaAtiva === 'classico')}>Naruto Clássico</button>
        <button onClick={() => setAbaAtiva('shippuden')} style={botaoEstilo(abaAtiva === 'shippuden')}>Naruto Shippuden</button>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {episodios[abaAtiva].map(ep => (
          <div key={ep.id} style={cardEstilo}>
            <div style={{ height: '150px', backgroundColor: '#222', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #444' }}>
              <span style={{ color: 'orange' }}>PLAYER DE VÍDEO</span>
            </div>
            <h3 style={{ margin: '5px 0', color: 'orange' }}>{ep.titulo}</h3>
            <p style={{ fontSize: '14px', color: '#ccc' }}>{ep.desc}</p>
            <button style={assistirBotao}>Assistir Dublado</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const botaoEstilo = (ativo) => ({
  padding: '10px 20px',
  backgroundColor: ativo ? 'orange' : 'transparent',
  color: ativo ? '#000' : 'orange',
  border: '2px solid orange',
  cursor: 'pointer',
  fontWeight: 'bold',
  borderRadius: '5px'
});

const cardEstilo = {
  backgroundColor: '#151515',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid #333'
};

const assistirBotao = {
  marginTop: '10px',
  width: '100%',
  padding: '8px',
  backgroundColor: '#ff4500',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};
