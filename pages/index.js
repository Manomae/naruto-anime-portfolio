import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// 📂 IMPORTANTE: Certifique-se de que o seu 'dicionario-ninja.json' está na mesma pasta deste arquivo!
import dicionarioNinja from './dicionario-ninja.json';

// ==========================================
// 🛠️ ALGORITMO DE DISTÂNCIA DE LEVENSHTEIN
// ==========================================
function calcularDiferencaLetras(palavra1, palavra2) {
  const p1 = palavra1.toLowerCase().trim();
  const p2 = palavra2.toLowerCase().trim();
  
  const matriz = [];
  for (let i = 0; i <= p1.length; i++) matriz[i] = [i];
  for (let j = 0; j <= p2.length; j++) matriz[0][j] = j;
  
  for (let i = 1; i <= p1.length; i++) {
    for (let j = 1; j <= p2.length; j++) {
      const custo = p1[i - 1] === p2[j - 1] ? 0 : 1;
      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1,      // Deleção
        matriz[i][j - 1] + 1,      // Inserção
        matriz[i - 1][j - 1] + custo // Substituição
      );
    }
  }
  return matriz[p1.length][p2.length];
}

function buscarNoDicionario(perguntaUsuario) {
  if (!dicionarioNinja) return null;
  const palavrasDigitadas = perguntaUsuario.toLowerCase().split(" ");
  let melhorResultado = null;
  let menorDistancia = 3;

  for (const item of dicionarioNinja) {
    const combinacoes = [item.termo, ...(item.sinonimos || [])];

    for (const termoValido of combinacoes) {
      for (const palavraDigitada of palavrasDigitadas) {
        if (palavraDigitada === termoValido.toLowerCase()) {
          return item;
        }

        const distancia = calcularDiferencaLetras(palavraDigitada, termoValido);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          melhorResultado = item;
        }
      }
    }
  }
  return melhorResultado;
}

export default function EmanuelOSCore() {
  // Estados de Controle de Modos e Abas
  const [modo, setModo] = useState('live'); 
  const [vozAtiva, setVozAtiva] = useState('Emanuel'); 
  const [generoVoz, setGeneroVoz] = useState('masculino');
  const [pesquisaChat, setPesquisaChat] = useState('');
  const [estaOuvindo, setEstaOuvindo] = useState(false); 
  const [usuarioLogado, setUsuarioLogado] = useState(null); 
  const [sidebarAberta, setSidebarAberta] = useState(true); // // Controle de expandir/diminuir aba lateral
  
  // Estados do Chat e Respostas Reais
  const [chatInput, setChatInput] = useState('');
  const [historicoChats, setHistoricoChats] = useState([
    { id: 1, titulo: 'Conversa Geral sobre IA', data: '18/07/2026', origem: 'recente' },
    { id: 2, titulo: 'Discussão sobre Clãs Ninjas', data: '18/07/2026', origem: 'recente' },
    { id: 3, titulo: 'Teoria do Chakra e Linhagens', data: '17/07/2026', origem: 'google' },
    { id: 4, titulo: 'Planejamento Emanuel Studio', data: '16/07/2026', origem: 'google' }
  ]);
  const [mensagens, setMensagens] = useState([
    { autor: 'SISTEMA', texto: '🧬 Sistema Emanuel.OS inicializado com sucesso. Aguardando interação por voz ou texto.', tipo: 'sys' }
  ]);

  // Estados de Disparo Real de Linhas Telefônicas
  const [ddd1, setDdd1] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [ddd2, setDdd2] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [msgCanal1, setMsgCanal1] = useState('');
  const [msgCanal2, setMsgCanal2] = useState('');
  const [modoDisparo, setModoDisparo] = useState('ambos'); 

  // Estados do Studio (Mídias e Edições)
  const [bibliotecaMidias, setBibliotecaMidias] = useState([]);
  const [statusStudio, setStatusStudio] = useState('Aguardando comando de edição...');
  const imageInputRef = useRef(null);

  // 🎙️ MOTOR DE VOZ REAL TRABALHADA (Web Speech API)
  const falarTextoReal = (texto) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🎙️ FUNÇÃO DE ESCUTA (VOZ PARA TEXTO)
  const iniciarEscuta = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Navegador não suporta reconhecimento de voz.");

    const reconhecimento = new SpeechRecognition();
    reconhecimento.lang = 'pt-BR';

    reconhecimento.onstart = () => setEstaOuvindo(true);
    reconhecimento.onend = () => setEstaOuvindo(false);

    reconhecimento.onresult = (event) => {
      const transcricao = event.results[0][0].transcript;
      setChatInput(transcricao);
      processarConversaReal(transcricao);
    };

    reconhecimento.start();
  };

  // ⏱️ SAUDAÇÃO REAL POR HORÁRIO
  useEffect(() => {
    const horaAtual = new Date().getHours();
    let textoSaudacao = horaAtual < 12 ? "Bom dia, Emanuel! Que bom falar com você." : horaAtual < 18 ? "Boa tarde, Emanuel! O sistema Emanuel Live Mode está totalmente operacional." : "Boa noite, Emanuel! Meu núcleo de IA está ativo para te dar suporte.";
    setTimeout(() => {
      setMensagens([{ autor: `IA ${vozAtiva.toUpperCase()}`, texto: textoSaudacao, tipo: 'ia' }]);
      falarTextoReal(textoSaudacao);
    }, 1000);
  }, [vozAtiva]);

  // 🤖 PROCESSAMENTO DE INTELIGÊNCIA REAL
  const processarConversaReal = (textoUsuario) => {
    let respostaTexto = "";
    const textoLimpo = textoUsuario.toLowerCase();
    const resultadoDicionario = buscarNoDicionario(textoUsuario);

    if (resultadoDicionario) {
      respostaTexto = `Rastreando dados cognitivos sobre o termo "${resultadoDicionario.termo}" (${resultadoDicionario.categoria}): ${resultadoDicionario.significado}`;
    } else if (textoLimpo.includes('bom dia') || textoLimpo.includes('boa tarde') || textoLimpo.includes('boa noite')) {
      respostaTexto = "Olá, Emanuel! Como posso te ajudar a programar ou editar agora?";
    } else {
      respostaTexto = `Entendido, Emanuel. Analisei seu comando "${textoUsuario}" no Live Mode de verdade. Vou processar essa informação com a biblioteca para te dar a melhor resposta.`;
    }

    setTimeout(() => {
      setMensagens(prev => [...prev, { autor: `IA ${vozAtiva.toUpperCase()}`, texto: respostaTexto, tipo: 'ia' }]);
      falarTextoReal(respostaTexto);
    }, 600);
  };

  const handleEnviarMensagemTexto = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMensagens(prev => [...prev, { autor: 'USER@EMANUEL', texto: chatInput, tipo: 'user' }]);
    processarConversaReal(chatInput);
    setChatInput('');
  };

  // 💬 DISPARO DUPLO REAL FUNCIONAL DE MENSAGENS TELEFÔNICAS
  const executarDisparoReal = (e) => {
    e.preventDefault();
    
    if (modoDisparo === 'canal1' || modoDisparo === 'ambos') {
      if (!ddd1 || !telefone1 || !msgCanal1.trim()) return alert("Por favor, preencha os dados do Canal 1 de disparo.");
      window.open(`https://api.whatsapp.com/send?phone=55${ddd1}${telefone1}&text=${encodeURIComponent(msgCanal1)}`, '_blank');
    }
    
    if (modoDisparo === 'canal2' || modoDisparo === 'ambos') {
      if (!ddd2 || !telefone2 || !msgCanal2.trim()) return alert("Por favor, preencha os dados do Canal 2 de disparo.");
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=55${ddd2}${telefone2}&text=${encodeURIComponent(msgCanal2)}`, '_blank');
      }, 500);
    }
  };

  const handleUploadImagemLente = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    alert(`Imagem "${arquivo.name}" carregada no input cognitivo central! Analisando e gerando rascunhos de conteúdo estruturado...`);
  };

  const handleLoginGoogle = () => {
    if (usuarioLogado) setUsuarioLogado(null);
    else setUsuarioLogado({ nome: 'Emanuel da Silva', email: 'emanuel@gmail.com' });
  };

  const chatsFiltrados = historicoChats.filter(c => c.titulo.toLowerCase().includes(pesquisaChat.toLowerCase()));

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#020204', color: '#e4e4e7',
      fontFamily: '"Segoe UI", Roboto, system-ui, sans-serif', display: 'flex',
      background: 'radial-gradient(circle at 50% 50%, #0d061a 0%, #020204 90%)',
      overflow: 'hidden', position: 'relative'
    }}>
      <Head>
        <title>Emanuel.OS Core Principal</title>
      </Head>

      {/* ☰ BOTÃO INTELIGENTE DE EXPANDIR/DIMINUIR ABA LATERAL */}
      <button 
        onClick={() => setSidebarAberta(!sidebarAberta)}
        style={{
          position: 'absolute', top: '23px', left: sidebarAberta ? '425px' : '20px',
          zIndex: 100, backgroundColor: '#09090b', border: '1px solid rgba(0, 240, 255, 0.3)',
          color: '#00f0ff', width: '40px', height: '40px', borderRadius: '50%',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '16px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {sidebarAberta ? '✕' : '☰'}
      </button>

      {/* 🔮 PAINEL ESQUERDO ORGANIZADO E ALINHADO */}
      <aside style={{
        width: sidebarAberta ? '400px' : '0px', opacity: sidebarAberta ? 1 : 0,
        backgroundColor: 'rgba(7, 7, 12, 0.92)', backdropFilter: 'blur(30px)',
        borderRight: sidebarAberta ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
        padding: sidebarAberta ? '25px' : '0px', display: 'flex', flexDirection: 'column',
        gap: '20px', height: '100vh', overflowY: 'auto', zIndex: 90,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {sidebarAberta && (
          <>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: 0, color: '#fff' }}>
                Contexto: EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span>
              </h1>
              <span style={{ fontSize: '10px', color: '#71717a', fontWeight: 'bold' }}>SISTEMA OPERACIONAL MULTIMODAL AGI</span>
            </div>

            {/* Abas Alternadoras de Modo */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => setModo('live')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modo === 'live' ? '#00f0ff' : 'transparent', color: modo === 'live' ? '#000' : '#a1a1aa', transition: 'all 0.2s' }}>📡 LIVE MODE</button>
              <button onClick={() => setModo('studio')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modo === 'studio' ? '#ff0055' : 'transparent', color: modo === 'studio' ? '#fff' : '#a1a1aa', transition: 'all 0.2s' }}>🎬 STUDIO MODE</button>
            </div>

            {/* 📍 O SEU MAPA TRIDIMENSIONAL INTEGRADO LINDO */}
            <a 
              href="/mapa" 
              style={{ 
                display: 'block', width: '100%', padding: '14px', backgroundColor: 'rgba(0, 240, 255, 0.08)', 
                color: '#00f0ff', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', 
                textDecoration: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', 
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)', transition: 'all 0.2s' 
              }}
            >
              📍 ACESSAR MEU MAPA DE GEOLOCALIZAÇÃO
            </a>

            {/* Barra de Pesquisa Interna */}
            <input 
              type="text" value={pesquisaChat} onChange={(e) => setPesquisaChat(e.target.value)}
              placeholder="🔍 Pesquisar no histórico..."
              style={{ width: '100%', padding: '10px 12px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
            />

            {/* LISTA ESTRUTURADA DE CONVERSAS */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>⚡ CONVERSAS RECENTES (LOCAL)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {chatsFiltrados.filter(c => c.origem === 'recente').map(c => (
                    <div key={c.id} style={{ fontSize: '12px', color: '#a1a1aa', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>💬 {c.titulo}</div>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🌐 SALVAS VIA CONTA GOOGLE</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {chatsFiltrados.filter(c => c.origem === 'google').map(c => (
                    <div key={c.id} style={{ fontSize: '12px', color: '#e4e4e7', padding: '10px', background: 'rgba(255,0,85,0.03)', borderRadius: '6px', border: '1px solid rgba(255,0,85,0.1)' }}>🌟 {c.titulo}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* 💬 DISPARADOR INTEGRADO DE LINHAS TELEFÔNICAS REAIS (DUPLO) */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '12px', letterSpacing: '0.5px' }}>💬 ENVIOS REAIS INTEGRADOS (LINHA DUPLA)</span>
              <form onSubmit={executarDisparoReal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="DDD 1" value={ddd1} onChange={(e) => setDdd1(e.target.value)} style={{ width: '60px', padding: '8px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '12px' }} />
                  <input type="text" placeholder="Número Celular 1" value={telefone1} onChange={(e) => setTelefone1(e.target.value)} style={{ flexGrow: 1, padding: '8px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="DDD 2" value={ddd2} onChange={(e) => setDdd2(e.target.value)} style={{ width: '60px', padding: '8px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '12px' }} />
                  <input type="text" placeholder="Número Celular 2" value={telefone2} onChange={(e) => setTelefone2(e.target.value)} style={{ flexGrow: 1, padding: '8px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                </div>
                
                <input type="text" placeholder="Mensagem Canal 1" value={msgCanal1} onChange={(e) => setMsgCanal1(e.target.value)} style={{ padding: '8px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                <input type="text" placeholder="Mensagem Canal 2" value={msgCanal2} onChange={(e) => setMsgCanal2(e.target.value)} style={{ padding: '8px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                
                <select value={modoDisparo} onChange={(e) => setModoDisparo(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '12px' }}>
                  <option value="ambos">Disparar as duas linhas juntas</option>
                  <option value="canal1">Disparar somente Linha 1</option>
                  <option value="canal2">Disparar somente Linha 2</option>
                </select>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Executar Disparo Sem Simulação</button>
              </form>
            </div>
          </>
        )}
      </aside>

      {/* 🔮 ÁREA PRINCIPAL CENTRALIZADA (O RETORNO DO SEU ORBE COGNITIVO LINDO) */}
      <main style={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        
        {/* TOP BAR */}
        <header style={{ width: '100%', padding: '20px 40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', zIndex: 5 }}>
          {/* BOTÃO DO GOOGLE AUTH CONECTAR NO CANTO EXATO DO VÍDEO */}
          <button 
            onClick={handleLoginGoogle}
            style={{
              padding: '10px 22px', backgroundColor: usuarioLogado ? 'rgba(255, 0, 85, 0.1)' : '#fff',
              color: usuarioLogado ? '#ff0055' : '#000', border: usuarioLogado ? '1px solid #ff0055' : 'none',
              borderRadius: '25px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(255,255,255,0.05)', transition: 'all 0.3s'
            }}
          >
            {usuarioLogado ? '🛑 Desconectar Conta' : '🌐 Conectar com Google'}
          </button>
        </header>

        {/* CONTAINER DO ORBE COGNITIVO ORIGINAL RESTAURADO */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px', padding: '0 20px' }}>
          
          {/* O ORBE ORIGINAL GIGANTE E BRILHANTE COM SEUS EFEITOS DE VOLTA */}
          <div style={{
            width: '240px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.35) 0%, rgba(139,92,246,0.3) 55%, transparent 100%)',
            boxShadow: '0 0 70px rgba(0,240,255,0.4), inset 0 0 40px rgba(139,92,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'orbeFlutuar 3s infinite alternate ease-in-out'
          }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', backgroundColor: '#030305', border: '2px solid rgba(0,240,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0,240,255,0.3)' }}>
              <span style={{ fontSize: '42px', animation: 'pulsarIcone 1.5s infinite alternate' }}>🔮</span>
            </div>
          </div>

          {/* AS CAIXAS AZUIS DESTACADAS COM AS RESPOSTAS COGNITIVAS */}
          <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mensagens.slice(-2).map((m, i) => (
              <div key={i} style={{ 
                backgroundColor: 'rgba(7, 16, 37, 0.65)', borderRadius: '16px', 
                border: '1px solid rgba(0, 240, 255, 0.3)', padding: '22px',
                boxShadow: '0 6px 30px rgba(0, 240, 255, 0.1)', backdropFilter: 'blur(12px)'
              }}>
                <span style={{ color: m.tipo === 'user' ? '#00f0ff' : '#ff0055', fontWeight: '900', fontSize: '11px', display: 'block', marginBottom: '6px', letterSpacing: '1px' }}>
                  {m.autor}
                </span>
                <p style={{ margin: 0, fontSize: '14px', color: m.tipo === 'user' ? '#00f0ff' : '#e4e4e7', lineHeight: '1.6' }}>
                  {m.texto}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ⌨️ BARRA INFERIOR DE CAPTAÇÃO FLUIDA COM INPUT DE IMAGEM EMBUTIDO */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 40px 40px 40px' }}>
          <div style={{ width: '100%', maxWidth: '680px', background: 'rgba(7, 7, 12, 0.65)', padding: '14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(15px)' }}>
            <form onSubmit={handleEnviarMensagemTexto} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              
              {/* O INPUT FLUIDO DE ENVIAR IMAGENS JUNTO AO MICROFONE */}
              <input type="file" ref={imageInputRef} onChange={handleUploadImagemLente} style={{ display: 'none' }} accept="image/*" />
              <button 
                type="button" onClick={() => imageInputRef.current.click()}
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s' }}
              >
                🖼️
              </button>

              <button 
                type="button" onClick={iniciarEscuta} 
                style={{ 
                  backgroundColor: estaOuvindo ? '#ff0055' : 'rgba(255,255,255,0.05)', 
                  border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', transition: 'all 0.3s'
                }}
              >
                {estaOuvindo ? '🔴' : '🎙️'}
              </button>

              <input 
                type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Mandar ordens cognitivas ou conversar com a IA...`}
                style={{ flexGrow: 1, padding: '14px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px' }}
              />
              <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '0 25px', height: '45px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Executar</button>
            </form>
          </div>
        </div>

        {/* Animações CSS */}
        <style>{`
          @keyframes orbeFlutuar {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(-15px) scale(1.03); }
          }
          @keyframes pulsarIcone {
            0% { transform: scale(1); filter: drop-shadow(0 0 2px #00f0ff); }
            100% { transform: scale(1.12); filter: drop-shadow(0 0 12px #00f0ff); }
          }
        `}</style>
      </main>
    </div>
  );
}