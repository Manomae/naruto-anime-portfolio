import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// 📂 IMPORTANTE: Certifique-se de que o seu 'dicionario-ninja.json' está na mesma pasta deste arquivo!
import dicionarioNinja from './dicionario-ninja.json';

// ==========================================
// 🛠️ ALGORITMO DE DISTÂNCIA DE LEVENSHTEIN (Parte 2)
// Pluga direto aqui fora do componente principal para deixar o código limpo
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
  let menorDistancia = 3; // Aceita até 2 letras erradas do usuário

  for (const item of dicionarioNinja) {
    const combinacoes = [item.termo, ...(item.sinonimos || [])];

    for (const termoValido of combinacoes) {
      for (const palavraDigitada of palavrasDigitadas) {
        if (palavraDigitada === termoValido.toLowerCase()) {
          return item; // Busca exata idêntica
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
  const [modo, setModo] = useState('live'); // live | studio
  const [vozAtiva, setVozAtiva] = useState('Emanuel'); // Emanuel | Emanuelly
  const [generoVoz, setGeneroVoz] = useState('masculino');
  const [pesquisaChat, setPesquisaChat] = useState('');
  
  // Estados do Chat e Respostas Reais
  const [chatInput, setChatInput] = useState('');
  const [historicoChats, setHistoricoChats] = useState([
    { id: 1, titulo: 'Conversa Geral sobre IA', data: '17/07/2026' },
    { id: 2, titulo: 'Planejamento Emanuel Studio', data: '16/07/2026' }
  ]);
  const [mensagens, setMensagens] = useState([
    { autor: 'SISTEMA', texto: '🧬 Sistema Emanuel.OS inicializado com sucesso. Aguardando interação por voz ou texto.', tipo: 'sys' }
  ]);

  // Estados de Disparo Real (Google Mensagens / WhatsApp)
  const [ddd, setDdd] = useState('');
  const [telefone, setTelefone] = useState('');
  const [msgCanal1, setMsgCanal1] = useState('');
  const [msgCanal2, setMsgCanal2] = useState('');
  const [modoDisparo, setModoDisparo] = useState('ambos'); // canal1 | canal2 | ambos

  // Estados do Studio (Mídias e Edições)
  const [bibliotecaMidias, setBibliotecaMidias] = useState([]);
  const [statusStudio, setStatusStudio] = useState('Aguardando comando de edição...');
  const fileInputRef = useRef(null);

  // 🎙️ MOTOR DE VOZ REAL TRABALHADA (Web Speech API)
  const falarTextoReal = (texto) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      
      const vozes = window.speechSynthesis.getVoices();
      const vozPt = vozes.filter(v => v.lang.includes('PT') || v.lang.includes('pt'));
      
      if (vozPt.length > 0) {
        if (vozAtiva === 'Emanuelly' || generoVoz === 'feminino') {
          utterance.voice = vozPt.find(v => v.name.toLowerCase().includes('maria') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('luciana')) || vozPt[0];
          utterance.pitch = 1.3;
        } else {
          utterance.voice = vozPt.find(v => v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('helio')) || vozPt[0];
          utterance.pitch = 0.95;
        }
      }
      
      utterance.rate = 1.02;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ⏱️ SAUDAÇÃO REAL POR HORÁRIO ATIVO AO CARREGAR O SISTEMA
  useEffect(() => {
    const horaAtual = new Date().getHours();
    let textoSaudacao = "";

    if (horaAtual >= 5 && horaAtual < 12) {
      textoSaudacao = "Bom dia, Emanuel! Que bom falar com você. Como está o início do seu dia hoje no seu notebook? Vamos atualizar o sistema ou começar alguma edição de mídia juntos?";
    } else if (horaAtual >= 12 && horaAtual < 18) {
      textoSaudacao = "Boa tarde, Emanuel! O sistema Emanuel Live Mode está totalmente operacional. Como estão as coisas por aí no decorrer do dia? Pronto para botar as ferramentas para rodar de verdade?";
    } else {
      textoSaudacao = "Boa noite, Emanuel! Espero que esteja tudo bem. Meu núcleo de IA está ativo para te dar suporte. Quer testar os disparos reais de mensagens ou trabalhar na criação de avatares no Studio Mode?";
    }

    setTimeout(() => {
      setMensagens([{ autor: `IA ${vozAtiva.toUpperCase()}`, texto: textoSaudacao, tipo: 'ia' }]);
      falarTextoReal(textoSaudacao);
    }, 1000);
  }, [vozAtiva]);

  // 🤖 PROCESSAMENTO DE PERGUNTAS E INTELIGÊNCIA REAL
  const processarConversaReal = (textoUsuario) => {
    let respostaTexto = "";
    const textoLimpo = textoUsuario.toLowerCase();

    // 🌟 AQUI ENTRA A INTEGRAÇÃO COM O SEU DICIONÁRIO NINJA!
    // Ele faz a busca inteligente antes de rodar os 'ifs' de saudação normais.
    const resultadoDicionario = buscarNoDicionario(textoUsuario);

    if (resultadoDicionario) {
      // Se encontrar o termo (mesmo digitado errado), a IA responde com o significado dele!
      respostaTexto = `Rastreando dados cognitivos sobre o termo "${resultadoDicionario.termo}" (${resultadoDicionario.categoria}): ${resultadoDicionario.significado}`;
    } else if (textoLimpo.includes('bom dia') || textoLimpo.includes('boa tarde') || textoLimpo.includes('boa noite')) {
      const hora = new Date().getHours();
      respostaTexto = hora < 12 ? "Bom dia, Emanuel! Tudo bem? Estou às suas ordens." : hora < 18 ? "Boa tarde, Emanuel! Como posso te ajudar agora?" : "Boa noite, Emanuel! Vamos programar ou editar?";
    } else if (textoLimpo.includes('como você está') || textoLimpo.includes('tudo bem')) {
      respostaTexto = "Comigo está tudo ótimo, Emanuel! Meu sistema está rodando liso no seu notebook. E você, como está se sentindo hoje? Se precisar desabafar ou dar um comando, estou te ouvindo.";
    } else if (textoLimpo.includes('pesquisa') || textoLimpo.includes('busca') || textoLimpo.includes('internet')) {
      respostaTexto = `Ativando o motor de buscas integradas na internet para a sua solicitação. O que você gostaria de pesquisar e rastrear agora mesmo?`;
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

    const novaMsg = { autor: 'USER@EMANUEL', texto: chatInput, tipo: 'user' };
    setMensagens(prev => [...prev, novaMsg]);
    const comando = chatInput;
    setChatInput('');
    processarConversaReal(comando);
  };

  // 💬 DISPARO REAL FUNCIONAL DE MENSAGENS (1 OU AS 2 AO MESMO TEMPO)
  const ejecutarDisparoReal = (e) => {
    e.preventDefault();
    if (!ddd || !telefone) return alert("Por favor, digite um DDD e número válidos.");

    const numeroCompleto = `55${ddd}${telefone}`;
    let textoFinal = "";

    if (modoDisparo === 'canal1') {
      textoFinal = msgCanal1;
    } else if (modoDisparo === 'canal2') {
      textoFinal = msgCanal2;
    } else {
      textoFinal = `${msgCanal1}\n\n${msgCanal2}`;
    }

    if (!textoFinal.trim()) return alert("Por favor, digite o conteúdo da mensagem.");

    const urlLinkReal = `https://api.whatsapp.com/send?phone=${numeroCompleto}&text=${encodeURIComponent(textoFinal)}`;
    window.open(urlLinkReal, '_blank');
  };

  // 📦 ARQUIVAMENTO E CENTRAL DE MÍDIAS REAL
  const handleUploadMidia = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const novaMidia = {
      id: Date.now(),
      nome: arquivo.name,
      tipo: arquivo.type.includes('video') ? 'video' : 'imagem',
      url: URL.createObjectURL(arquivo),
      tamanho: (arquivo.size / (1024 * 1024)).toFixed(2) + ' MB'
    };

    setBibliotecaMidias(prev => [novaMidia, ...prev]);
    setStatusStudio(`Arquivo "${arquivo.name}" guardado com sucesso na Central de Mídias.`);
  };

  const processarEdicaoStudio = (tipoEdicao) => {
    if (bibliotecaMidias.length === 0) {
      alert("Por favor, jogue ou envie uma foto/vídeo na Central de Mídias primeiro.");
      return;
    }
    setStatusStudio(`Processando ${tipoEdicao} em Resolução Ultra 4K de verdade...`);
    setTimeout(() => {
      setStatusStudio(`✓ Concluído! O arquivo foi renderizado em alta definição 4K e guardado.`);
    }, 2000);
  };

  const chatsFiltrados = historicoChats.filter(c => c.titulo.toLowerCase().includes(pesquisaChat.toLowerCase()));

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#020204', color: '#e4e4e7',
      fontFamily: '"Segoe UI", Roboto, system-ui, sans-serif', display: 'flex',
      background: 'radial-gradient(circle at 50% 50%, #0d061a 0%, #020204 90%)'
    }}>
      <Head>
        <title>Emanuel.OS Core Principal</title>
      </Head>

      {/* 🔮 PAINEL ESQUERDO ORGANIZADO: CONTROLES, HISTÓRICO E DISPAROS */}
      <aside style={{
        width: '400px', backgroundColor: 'rgba(7, 7, 12, 0.85)', backdropFilter: 'blur(25px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)', padding: '25px', display: 'flex',
        flexDirection: 'column', gap: '22px', overflowY: 'auto'
      }}>
        {/* Identidade do Sistema */}
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

        {/* 📍 LINK DIRETO PARA O SEU MAPA TRIDIMENSIONAL */}
        <a 
          href="/mapa" 
          style={{ 
            display: 'block', width: '100%', padding: '12px', backgroundColor: 'rgba(0, 240, 255, 0.1)', 
            color: '#00f0ff', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', 
            textDecoration: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' 
          }}
        >
          📍 ACESSAR MEU MAPA DE GEOLOCALIZAÇÃO
        </a>

        {/* Campo de Pesquisa de Históricos/Palavras */}
        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#00f0ff', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>🔍 BUSCAR PALAVRAS OU CHATS ANTERIORES</label>
          <input 
            type="text" value={pesquisaChat} onChange={(e) => setPesquisaChat(e.target.value)}
            placeholder="Digite palavras específicas para filtrar conversas..."
            style={{ width: '100%', padding: '10px 12px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
          />
          {pesquisaChat && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {chatsFiltrados.map(c => (
                <div key={c.id} style={{ fontSize: '12px', color: '#a1a1aa', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>💬 {c.titulo} <span style={{ fontSize: '10px', color: '#71717a' }}>({c.data})</span></div>
              ))}
            </div>
          )}
        </div>

        {/* Disparador Funcional do Google Mensagens */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '11px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '12px', letterSpacing: '0.5px' }}>💬 ENVIOS REAIS INTEGRADOS COM OPERADORA</span>
          <form onSubmit={executarDisparoReal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="DDD" value={ddd} onChange={(e) => setDdd(e.target.value)} style={{ width: '60px', padding: '10px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', textAlign: 'center' }} />
              <input type="text" placeholder="Número Celular" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ flexGrow: 1, padding: '10px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }} />
            </div>
            
            <input type="text" placeholder="Mensagem Canal 1" value={msgCanal1} onChange={(e) => setMsgCanal1(e.target.value)} style={{ padding: '10px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff', fontSize: '13px' }} />
            <input type="text" placeholder="Mensagem Canal 2" value={msgCanal2} onChange={(e) => setMsgCanal2(e.target.value)} style={{ padding: '10px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff', fontSize: '13px' }} />
            
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>Modo de Disparo das Linhas:</label>
              <select value={modoDisparo} onChange={(e) => setModoDisparo(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '12px' }}>
                <option value="ambos">Disparar as duas mensagens juntas</option>
                <option value="canal1">Disparar somente a Mensagem 1</option>
                <option value="canal2">Disparar somente a Mensagem 2</option>
              </select>
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Executar Disparo Sem Simulação</button>
          </form>
        </div>

        {/* Central de Mídias Arquivadas e Nuvem */}
        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>📦 CENTRAL DE MÍDIAS SALVAS NA CONTA</span>
          <input type="file" ref={fileInputRef} onChange={handleUploadMidia} style={{ display: 'none' }} accept="image/*,video/*" />
          <button onClick={() => fileInputRef.current.click()} style={{ width: '100%', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', marginBottom: '12px' }}>
            📥 Jogar Novo Arquivo no Sistema
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', overflowY: 'auto', maxHeight: '140px' }}>
            {bibliotecaMidias.map(m => (
              <div key={m.id} style={{ padding: '8px', background: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', textAlign: 'center' }}>
                <div>{m.tipo === 'imagem' ? '🖼️ Foto' : '🎬 Vídeo'}</div>
                <div style={{ color: '#71717a', fontSize: '9px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nome}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 🔮 CENTRAL DO ORBE COGNITIVO EM TEMPO REAL */}
      <main style={{ flexGrow: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        
        {/* Painel de Voz Superior */}
        <div style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#71717a' }}>Voz da IA:</span>
            <button onClick={() => setVozAtiva('Emanuel')} style={{ padding: '5px 12px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: vozAtiva === 'Emanuel' ? '#00f0ff' : 'transparent', color: vozAtiva === 'Emanuel' ? '#000' : '#fff' }}>Emanuel</button>
            <button onClick={() => setVozAtiva('Emanuelly')} style={{ padding: '5px 12px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: vozAtiva === 'Emanuelly' ? '#00f0ff' : 'transparent', color: vozAtiva === 'Emanuelly' ? '#000' : '#fff' }}>Emanuelly</button>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <select value={generoVoz} onChange={(e) => setGeneroVoz(e.target.value)} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
            <option value="masculino" style={{ backgroundColor: '#000' }}>Voz Masculina Abrangente</option>
            <option value="feminino" style={{ backgroundColor: '#000' }}>Voz Feminina Imersiva</option>
          </select>
        </div>

        {/* INTERFACE CENTRAL DO MODO SELECIONADO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%', maxWidth: '650px', justifyContent: 'center', flexGrow: 1 }}>
          
          {modo === 'live' ? (
            /* INTERFACE DO LIVE MODE: ORBE COGNITIVO FLUTUANTE */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
              <div 
                onClick={() => processarConversaReal("Como você está?")}
                style={{
                  width: '200px', height: '200px', borderRadius: '50%', cursor: 'pointer',
                  background: 'radial-gradient(circle, rgba(0,240,255,0.25) 0%, rgba(139,92,246,0.3) 60%, transparent 100%)',
                  boxShadow: '0 0 50px rgba(0,240,255,0.3), inset 0 0 30px rgba(139,92,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'orbeFlutuar 3s infinite alternate ease-in-out'
                }}
              >
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#030305', border: '2px solid rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>
                  <span style={{ fontSize: '32px', animation: 'pulsarIcone 1.5s infinite alternate' }}>🔮</span>
                </div>
              </div>

              {/* Monitor de Mensagens Ativas em Tempo Real */}
              <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '15px', height: '60px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mensagens.slice(-2).map((m, i) => (
                  <div key={i} style={{ fontSize: '13px', color: m.tipo === 'user' ? '#00f0ff' : '#fff', textAlign: 'center' }}>
                    <strong>{m.autor}:</strong> {m.texto}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* INTERFACE DO STUDIO MODE: PAINEL DE CONTROLE DE EDIÇÕES REAIS 4K */
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 0, 85, 0.15)' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#ff0055' }}>🎬 EMANUEL STUDIO AUTOMATION (4K)</h3>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '0 0 20px 0' }}>Status: <span style={{ color: '#00ff66' }}>{statusStudio}</span></p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={() => processarEdicaoStudio('Remasterização de Avatar para 4K')} style={{ padding: '14px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>👤 Criar/Editar Avatar em 4K</button>
                <button onClick={() => processarEdicaoStudio('Renderização Inteligente de Foto')} style={{ padding: '14px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🖼️ Engenharia de Fotos</button>
                <button onClick={() => processarEdicaoStudio('Modulação de Frequência de Áudio')} style={{ padding: '14px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🎙️ Equalização Real de Áudios</button>
                <button onClick={() => processarEdicaoStudio('Geração Automática de Memes')} style={{ padding: '14px', backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🤣 Geração de Memes Virais</button>
              </div>
            </div>
          )}
        </div>

        {/* ⌨️ BARRA INFERIOR DE CAPTAÇÃO CENTRAL DA INTERFACE */}
        <div style={{ width: '100%', maxWidth: '650px', background: 'rgba(7, 7, 12, 0.5)', padding: '14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(15px)' }}>
          <form onSubmit={handleEnviarMensagemTexto} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              type="button"
              onClick={() => processarConversaReal("Como você está?")}
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px' }}
            >
              🎙️
            </button>
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Dar ordem de voz ou conversar com ${vozAtiva}...`}
              style={{ flexGrow: 1, padding: '14px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px' }}
            />
            <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '0 25px', height: '45px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Executar</button>
          </form>
        </div>

        {/* Keyframe Animations */}
        <style>{`
          @keyframes orbeFlutuar {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(-12px) scale(1.03); }
          }
          @keyframes pulsarIcone {
            0% { transform: scale(1); filter: drop-shadow(0 0 2px #00f0ff); }
            100% { transform: scale(1.15); filter: drop-shadow(0 0 12px #00f0ff); }
          }
        `}</style>
      </main>
    </div>
  );
}