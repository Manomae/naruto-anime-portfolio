import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

// SUA CONFIGURAÇÃO REAL DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCbf0uWYYqZ0UnvxPUkrbN0-T1KrIw03og",
  authDomain: "emanuel-b526c.firebaseapp.com",
  projectId: "emanuel-b526c",
  storageBucket: "emanuel-b526c.firebasestorage.app",
  messagingSenderId: "340230465087",
  appId: "1:340230465087:web:72aea1349869155f02ba8a",
  measurementId: "G-QCEPQ0F5ME"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function EmanuelNarutoAIPro() {
  const [user, setUser] = useState(null);
  const [chakra, setChakra] = useState(5);
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('ia');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const loginGoogle = async () => {
    try { await signInWithPopup(auth, provider); } 
    catch (error) { alert("Erro: " + error.message); }
  };

  const gerarImagem = (custo) => {
    if (chakra < custo) return alert("Chakra insuficiente!");
    setCarregando(true);
    const seed = Math.floor(Math.random() * 999999);
    // Usando motor de imagem que permite download
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " naruto style anime") }?seed=${seed}&nologo=true`;
    
    const img = new Image();
    img.crossOrigin = "anonymous"; // Importante para o download!
    img.src = url;
    img.onload = () => {
      setResultado(url);
      setCarregando(false);
      setChakra(prev => prev - custo);
    };
  };

  // FUNÇÃO DE DOWNLOAD AUTOMÁTICO CORRIGIDA
  const baixarAutomático = async () => {
    if (!resultado) return;
    try {
      // 1. Busca a imagem como um arquivo blob
      const resposta = await fetch(resultado);
      const blob = await resposta.blob();
      
      // 2. Cria um link temporário para o arquivo
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `EmanuelNarutoAI_${Date.now()}.png`; // Nome do arquivo
      
      // 3. Força o clique no link e limpa
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob); // Libera memória
    } catch (error) {
      // Se der erro no modo automático, abre em nova aba
      window.open(resultado, '_blank');
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <header style={headerEstilo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h4 style={{ color: 'orange', margin: 0, fontSize: '11px' }}>EMANUEL AI</h4>
          <button onClick={loginGoogle} style={botaoLogin}>
            {user ? `Olá, ${user.displayName.split(' ')[0]}` : "Conectar Google"}
          </button>
        </div>
        <div style={badgeChakra}>Chakra: {chakra}</div>
      </header>

      <nav style={navEstilo}>
        <button onClick={() => setAbaAtiva('ia')} style={abaEstilo(abaAtiva === 'ia')}>Gerador IA</button>
        <button onClick={() => setAbaAtiva('chat')} style={abaEstilo(abaAtiva === 'chat')}>Vila da Folha (Chat)</button>
      </nav>

      <main style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        {abaAtiva === 'ia' && (
          <div style={card}>
            <input 
              type="text" placeholder="O que vamos invocar? 🍥" value={prompt}
              onChange={(e) => setPrompt(e.target.value)} style={input}
            />
            <button onClick={() => gerarImagem(1)} style={btnLaranja}>Gerar (1C)</button>
            <button onClick={() => setChakra(chakra + 5)} style={btnAnuncio}>📺 +5 CHAKRA</button>
            
            {resultado && (
              <div style={resultadoMoldura}>
                <img src={resultado} alt="IA" style={{ width: '100%', borderRadius: '10px' }} />
                {/* BOTÃO DOWNLOAD CORRIGIDO */}
                <button onClick={baixarAutomático} style={btnDownload}>DOWNLOAD AUTOMÁTICO</button>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'chat' && (
          <div style={card}>
            <h3 style={{ color: 'orange' }}>Bate-papo Ninja</h3>
            <div style={chatBox}><p><b>Sistema:</b> Chat em desenvolvimento.</p></div>
          </div>
        )}
      </main>
    </div>
  );
}

// Estilos rápidos
const headerEstilo = { padding: '10px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111' };
const botaoLogin = { backgroundColor: '#4285F4', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' };
const badgeChakra = { backgroundColor: '#000', padding: '5px 10px', borderRadius: '15px', border: '1px solid orange', fontSize: '11px' };
const navEstilo = { display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px' };
const abaEstilo = (a) => ({ background: 'none', border: 'none', color: a ? 'orange' : '#888', borderBottom: a ? '2px solid orange' : 'none', fontWeight: 'bold', cursor: 'pointer' });
const card = { backgroundColor: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #333', textAlign: 'center' };
const input = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid orange', backgroundColor: '#222', color: 'white', marginBottom: '10px' };
const btnLaranja = { width: '100%', padding: '12px', backgroundColor: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' };
const btnAnuncio = { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const resultadoMoldura = { marginTop: '20px', border: '1px solid orange', padding: '10px', borderRadius: '10px' };
const chatBox = { height: '100px', backgroundColor: '#000', padding: '10px', borderRadius: '10px', overflowY: 'scroll', textAlign: 'left' };
// Novo estilo para o botão de download
const btnDownload = { width: '100%', padding: '10px', backgroundColor: '#fff', color: '#000', border: '1px solid #000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
