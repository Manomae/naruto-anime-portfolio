import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [nickname, setNickname] = useState('Novo Shinobi');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/pixel-art/svg?seed=Naruto');
  const [highContrast, setHighContrast] = useState(false);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    const savedNick = localStorage.getItem('shinobi_nick');
    const savedAvatar = localStorage.getItem('shinobi_avatar');
    if (savedNick) setNickname(savedNick);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  // --- FUNÇÕES DE PERFIL ---
  const handleProfile = () => {
    const action = prompt("1. Mudar Nickname\n2. Gerar Foto Anime");
    if (action === "1") {
      const n = prompt("Seu Nickname:");
      if (n) {
        setNickname(n);
        localStorage.setItem('shinobi_nick', n);
      }
    } else if (action === "2") {
      const newAv = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random()}`;
      setAvatar(newAv);
      localStorage.setItem('shinobi_avatar', newAv);
    }
  };

  // --- FUNÇÕES DE CHAMADA (WEB API) ---
  const startCall = async (type) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
      alert(`Chamada de ${type} iniciada com sucesso!`);
    } catch (err) {
      alert("Erro ao acessar hardware: " + err.message);
    }
  };

  return (
    <div style={{ 
      backgroundColor: highContrast ? '#000' : '#1a1a1a', 
      color: highContrast ? '#fff' : '#ffa500',
      minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' 
    }}>
      <Head>
        <title>Meu Shinobi - Projeto</title>
      </Head>

      {/* ANIMAÇÃO DO NARUTO NO PC (O QUADRADO) */}
      <div style={{ position: 'relative', maxWidth: '500px', margin: '100px auto 0' }}>
        
        <div style={{ position: 'absolute', top: '-80px', left: '10px' }}>
          <img 
            src="https://i.pinimg.com/originals/e4/20/83/e420835f082e0787e7428f5228189c4d.gif" 
            alt="Naruto Animado" 
            style={{ width: '100px' }} 
          />
        </div>

        <div style={{ 
          border: '4px solid #ffa500', borderRadius: '15px', 
          padding: '20px', background: '#2c3e50' 
        }}>
          <h2 style={{ textAlign: 'center' }}>MEU SHINOBI</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
             <img src={avatar} style={{ width: '50px', borderRadius: '50%' }} alt="Perfil" />
             <span>Conversando com: <strong>{nickname}</strong></span>
          </div>

          {/* ÁREA DE BOTÕES FUNCIONAIS */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => startCall('audio')} style={btnStyle}>📞 Áudio</button>
            <button onClick={() => startCall('video')} style={btnStyle}>📹 Vídeo</button>
            <label style={btnStyle}>
              📎 Arquivo
              <input type="file" hidden onChange={(e) => alert('Arquivo: ' + e.target.files[0].name)} />
            </label>
          </div>
        </div>
      </div>

      {/* BOTÃO DE CONFIGURAÇÕES FLUTUANTE */}
      <button 
        onClick={() => {
          const opt = prompt("1. Acessibilidade (Contraste)\n2. Perfil\n3. Limpar Conta");
          if(opt === "1") setHighContrast(!highContrast);
          if(opt === "2") handleProfile();
          if(opt === "3") { localStorage.clear(); location.reload(); }
        }}
        style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '15px', borderRadius: '50%', cursor: 'pointer' }}
      >
        ⚙️
      </button>
    </div>
  );
}

const btnStyle = {
  padding: '10px', background: '#ffa500', border: 'none', 
  borderRadius: '5px', color: '#000', cursor: 'pointer', fontWeight: 'bold'
};
