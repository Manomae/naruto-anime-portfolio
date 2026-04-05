import React, { useState } from 'react';

export default function NarutoPortfolio() {
  const [abaAtiva, setAbaAtiva] = useState('classico');

  const episodios = {
    classico: [
      { 
        id: 1, 
        titulo: "Episódio 01", 
        desc: "Entra Naruto Uzumaki!", 
        videoUrl: "https://www.youtube.com/embed/ogcXkCCpARU" 
      },
      { 
        id: 2, 
        titulo: "Episódio 02", 
        desc: "Meu nome é Konohamaru!", 
        videoUrl: "https://www.youtube.com/embed/DqmWg4-Updw" 
      },
    ],
    shippuden: [
      { 
        id: 1, 
        titulo: "Episódio 01", 
        desc: "Volta para Casa", 
        videoUrl: "https://www.youtube.com/embed/mtGFqv2r9x4" 
      },
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {episodios[abaAtiva].map(ep => (
          <div key={ep.id} style={cardEstilo}>
            <div style={{ height: '200px', marginBottom: '10px', border: '1px solid #444', borderRadius: '8px', overflow: 'hidden' }}>
              {/* O PLAYER DE VÍDEO REAL ENTRA AQUI */}
              <iframe 
                width="100%" 
                height="100%" 
                src={ep.videoUrl} 
                title={ep.titulo}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <h3 style={{ margin: '5px 0', color: 'orange' }}>{ep.titulo}</h3>
            <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '10px' }}>{ep.desc}</p>
            <a href={ep.videoUrl.replace('embed/', 'watch?v=')} target="_blank" rel="noreferrer" style={assistirBotao}>
              Abrir no YouTube
            </a>
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
  borderRadius: '5px',
  transition: '0.3s'
});

const cardEstilo = {
  backgroundColor: '#151515',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid #333'
};

const assistirBotao = {
  display: 'block',
  textAlign: 'center',
  textDecoration: 'none',
  marginTop: '10px',
  padding: '10px',
  backgroundColor: '#ff4500',
  color: 'white',
  borderRadius: '5px',
  fontWeight: 'bold'
};
