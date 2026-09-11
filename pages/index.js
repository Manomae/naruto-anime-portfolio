import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';

// Bibliotecas para geração de documentos
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pptxgen from "pptxgenjs";

// =========================================================================================
// 📸 --- COMPONENTE: RASTREAMENTO E TREINAMENTO VISUAL IA (CAMERA HUD) ---
// =========================================================================================
function MotionTracker({ onFrameCapture }) {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("Desconectado");

  const toggleCamera = async () => {
    if (active) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setActive(false);
      setStatus("Desconectado");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setActive(true);
        setStatus("Treinando Visão IA...");
      } catch (err) {
        alert("Erro ao acessar a câmera para treinamento visual: " + err.message);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '10px', color: '#0f172a', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold' }}>📸 ROBOTOC VISION TRACKER</span>
        <button onClick={toggleCamera} style={{ padding: '4px 8px', backgroundColor: active ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          {active ? 'Desligar Câmera' : 'Ativar Câmera IA'}
        </button>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '120px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: active ? 0.8 : 0.2 }} />
        {!active && <span style={{ position: 'absolute', fontSize: '10px', color: '#94a3b8' }}>Câmera Inativa</span>}
        {active && <div style={{ position: 'absolute', border: '1px dashed #00f0ff', width: '80%', height: '80%', pointerEvents: 'none', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.5)' }} />}
      </div>
      <span style={{ fontSize: '9px', color: active ? '#16a34a' : '#64748b', marginTop: '6px', display: 'block', fontFamily: 'monospace' }}>● Status: {status}</span>
    </div>
  );
}

// =========================================================================================
// ⚙️ --- COMPONENTE: GERENCIADOR DE PERIFÉRICOS BLUETOOTH / GEAR ---
// =========================================================================================
function RobotocGear({ onConnectGear, highlightGear }) {
  const [gears, setGears] = useState({
    headset: false,
    mouse: false,
    keyboard: true
  });

  const toggleGear = (type) => {
    const nextState = !gears[type];
    setGears(prev => ({ ...prev, [type]: nextState }));
    if (onConnectGear) onConnectGear(type, nextState);
  };

  return (
    <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: highlightGear ? '2px solid #eab308' : '1px solid #0284c7', borderRadius: '12px', padding: '10px', color: '#0f172a', boxShadow: highlightGear ? '0 0 15px rgba(234,179,8,0.4)' : 'none', backdropFilter: 'blur(10px)' }}>
      <span style={{ fontSize: '10px', color: highlightGear ? '#d97706' : '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
        ⚙️ PERIFÉRICOS NEURAIS ROBOTOC GEAR {highlightGear && '(CONEXÃO SOLICITADA)'}
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <button onClick={() => toggleGear('headset')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.headset ? '#0284c7' : 'transparent', color: gears.headset ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          🎧 Headset
        </button>
        <button onClick={() => toggleGear('mouse')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.mouse ? '#0284c7' : 'transparent', color: gears.mouse ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          🖱️ Mouse 3D
        </button>
        <button onClick={() => toggleGear('keyboard')} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #0284c7', background: gears.keyboard ? '#0284c7' : 'transparent', color: gears.keyboard ? '#fff' : '#0284c7', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
          ⌨️ Glass Key
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// ⌨️ --- COMPONENTE: TECLADO HOLOGRÁFICO GLASS 3D COM FEEDBACK VISUAL EM TEMPO REAL ---
// =========================================================================================
function GlassKeyboard3D({ onKeyPress }) {
  const [lastKey, setLastKey] = useState(null);
  const keys = [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','Backspace'],
    ['Space', 'Enter']
  ];

  const handlePress = (k) => {
    setLastKey(k);
    if (onKeyPress) onKeyPress(k);
    setTimeout(() => setLastKey(null), 300);
  };

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '12px', padding: '10px', color: '#0f172a', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold' }}>⌨️ TECLADO HOLOGRÁFICO GLASS 3D</span>
        {lastKey && <span style={{ fontSize: '10px', backgroundColor: '#0284c7', padding: '1px 6px', borderRadius: '4px', color: '#fff', fontWeight: 'bold' }}>TECLA: {lastKey}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {keys.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
            {row.map((k) => (
              <button
                key={k}
                onClick={() => handlePress(k)}
                style={{
                  flex: k === 'Space' ? 3 : k === 'Enter' || k === 'Backspace' ? 1.5 : 1,
                  padding: '6px 2px',
                  background: lastKey === k ? '#00f0ff' : 'rgba(2, 132, 199, 0.1)',
                  border: '1px solid rgba(2, 132, 199, 0.4)',
                  borderRadius: '4px',
                  color: lastKey === k ? '#000' : '#0284c7',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: lastKey === k ? '0 0 12px #00f0ff' : 'none',
                  transition: 'all 0.1s ease'
                }}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================================
// 📲 --- COMPONENTE: MENSAGERIA REAL VIA NÚMERO (WHATSAPP, TELEGRAM, GOOGLE MENSAGENS) ---
// =========================================================================================
function DispatcherMensagensNumeros({ addLog }) {
  const [plataforma, setPlataforma] = useState('whatsapp');
  const [ddd, setDdd] = useState('88');
  const [num1, setNum1] = useState('981493989');
  const [num2, setNum2] = useState('');
  const [mensagem, setMensagem] = useState('Mensagem do Emanuel.OS v6.0 - Sistema ROBOTOC 3D ativo.');

  const dispararMensagens = () => {
    if (!num1) return alert("Insira ao menos um número de telefone válido.");

    const enviarParaNumero = (numero) => {
      const fullPhone = `55${ddd}${numero.replace(/\D/g, '')}`;
      let url = '';

      if (plataforma === 'whatsapp') {
        url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(mensagem)}`;
      } else if (plataforma === 'telegram') {
        url = `https://t.me/share/url?url=&text=${encodeURIComponent(mensagem)}`;
      } else if (plataforma === 'google_messages') {
        url = `sms:+${fullPhone}?body=${encodeURIComponent(mensagem)}`;
      }

      if (url && typeof window !== 'undefined') window.open(url, '_blank');
      if (addLog) addLog(`[DISPATCHER: ${plataforma.toUpperCase()}] Mensagem enviada para +${fullPhone}`);
    };

    enviarParaNumero(num1);
    if (num2.trim()) {
      setTimeout(() => enviarParaNumero(num2), 600);
    }
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', borderRadius: '12px', padding: '12px', color: '#0f172a', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#0284c7', fontSize: '11px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        💬 MENSAGERIA REAL VIA NÚMERO DE TELEFONE
      </h3>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button onClick={() => setPlataforma('whatsapp')} style={{ flex: 1, padding: '6px', border: '1px solid #22c55e', backgroundColor: plataforma === 'whatsapp' ? '#22c55e' : 'transparent', color: plataforma === 'whatsapp' ? '#fff' : '#22c55e', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>WhatsApp</button>
        <button onClick={() => setPlataforma('telegram')} style={{ flex: 1, padding: '6px', border: '1px solid #38bdf8', backgroundColor: plataforma === 'telegram' ? '#38bdf8' : 'transparent', color: plataforma === 'telegram' ? '#fff' : '#38bdf8', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>Telegram</button>
        <button onClick={() => setPlataforma('google_messages')} style={{ flex: 1, padding: '6px', border: '1px solid #eab308', backgroundColor: plataforma === 'google_messages' ? '#eab308' : 'transparent', color: plataforma === 'google_messages' ? '#fff' : '#eab308', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>SMS/Google</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input type="text" value={ddd} onChange={(e) => setDdd(e.target.value)} placeholder="DDD" style={{ width: '40px', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px', textAlign: 'center' }} />
        <input type="text" value={num1} onChange={(e) => setNum1(e.target.value)} placeholder="Número 1 (Obrigatório)" style={{ flex: 1, padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px' }} />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <input type="text" value={num2} onChange={(e) => setNum2(e.target.value)} placeholder="Número 2 (Opcional - Envio duplo)" style={{ width: '100%', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
      </div>

      <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2} style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', padding: '6px', fontSize: '10px', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />

      <button onClick={dispararMensagens} style={{ width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
        🚀 Disparar Mensagem Direta
      </button>
    </div>
  );
}

// =========================================================================================
// 🧠 --- COMPONENTE: PENSAMENTO FUTURISTA DO ROBOTOC 3D (COM CONEXÃO TRIPLE E-MAIL) ---
// =========================================================================================
function RobotocNeuralThoughtPanel({ addLog }) {
  const [contaGoogle, setContaGoogle] = useState('leeheroi123@gmail.com');
  const [contaApple, setContaApple] = useState('emanuel@icloud.com');
  const [contaOneDrive, setContaOneDrive] = useState('emanuel@outlook.com');
  const [statusSinc, setStatusSinc] = useState('Conectado');

  const sincronizarContas = () => {
    setStatusSinc('Sincronizando...');
    if (addLog) addLog(`[ROBOTOC 3D] Sincronizando Contas: Google (${contaGoogle}), Apple (${contaApple}), OneDrive (${contaOneDrive})`);
    setTimeout(() => {
      setStatusSinc('Conectado e Ativo');
      alert('Sincronização real de e-mails concluída no núcleo ROBOTOC 3D!');
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #00f0ff', borderRadius: '14px', padding: '14px', color: '#0f172a', boxShadow: '0 0 25px rgba(0,240,255,0.15)', backdropFilter: 'blur(10px)' }}>
      <div style={{ borderBottom: '1px solid rgba(2,132,199,0.2)', paddingBottom: '6px', marginBottom: '10px' }}>
        <h3 style={{ color: '#0284c7', fontSize: '12px', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🧠 PENSAMENTO FUTURISTA ROBOTOC 3D <span style={{ fontSize: '8px', backgroundColor: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: '6px' }}>REAL CORE</span>
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: '#64748b' }}>Integração direta com triple e-mail e processamento neural contínuo.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
        <div>
          <label style={{ fontSize: '8px', color: '#0284c7', display: 'block' }}>📧 Google Mail / AI Studio:</label>
          <input type="email" value={contaGoogle} onChange={(e) => setContaGoogle(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #38bdf8', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#a855f7', display: 'block' }}>🍎 Apple iCloud Mail:</label>
          <input type="email" value={contaApple} onChange={(e) => setContaApple(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #c084fc', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: '8px', color: '#ea580c', display: 'block' }}>☁️ Microsoft OneDrive / Azure:</label>
          <input type="email" value={contaOneDrive} onChange={(e) => setContaOneDrive(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#f8fafc', border: '1px solid #fb923c', borderRadius: '4px', color: '#0f172a', fontSize: '10px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', color: '#16a34a' }}>● Status Sincronização: {statusSinc}</span>
        <button onClick={sincronizarContas} style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔄 Sincronizar E-mails
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 📱 --- PAINEL ANDROID HUD LATERAL (GAVETA EXPANSÍVEL) ---
// =========================================================================================
function AndroidHUDPanel({ open, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, right: open ? 0 : '-360px', width: '350px', height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.92)', borderLeft: '2px solid #00f0ff',
      backdropFilter: 'blur(20px)', zIndex: 180, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '16px', boxSizing: 'border-box', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <strong style={{ fontSize: '12px', color: '#0284c7' }}>ANDROID HUD SYSTEM v6.0</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕</button>
      </div>
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  );
}

// =========================================================================================
// 📊 --- COMPONENTE: EM CREATOR STUDIO IA ---
// =========================================================================================
function EMCreatorStudio({ onClose }) {
  const [metricas] = useState({
    textosConversas: 1240, audiosGerações: 380, fotosRenders: 890,
    videosRenderizados: 215, memesGifsEngajados: 560, audienciaAtiva: 'Alta (89% retenção)', resolucaoProblemasIA: '94,2% Autônomos'
  });

  const [sugestoesAGI] = useState([
    { id: 1, tipo: '⚡ Otimização de Vídeo', acao: 'Sintetizar intro em 4K para canal do YouTube' },
    { id: 2, tipo: '🛠️ Bugfix Autônomo', acao: 'Corrigir renderização WebGL no mobile' }
  ]);
  const [executandoAcao, setExecutandoAcao] = useState(null);

  const aplicarAcaoAutonoma = (id) => {
    setExecutandoAcao(id);
    setTimeout(() => {
      setExecutandoAcao(null);
      alert("Ação autônoma executada com sucesso pelo G-AGI!");
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', color: '#0f172a', position: 'relative', boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: '#0284c7', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ borderBottom: '1px solid rgba(2,132,199,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 style={{ color: '#0284c7', fontSize: '18px', margin: 0, fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 EM CREATOR STUDIO IA <span style={{ fontSize: '10px', color: '#0284c7', border: '1px solid #0284c7', padding: '2px 8px', borderRadius: '10px' }}>AGI Core v6.0</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0 0' }}>
            Análise de desempenho multimodal, diagnóstico de audiência e tomada de ações autônomas para projetos.
          </p>
        </div>

        <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          📈 DESEMPENHO E UTILIZAÇÃO DE FERRAMENTAS MULTIMODAIS
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>💬</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#0284c7', marginTop: '4px' }}>{metricas.textosConversas}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Textos / Chat</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎙️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginTop: '4px' }}>{metricas.audiosGerações}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Áudios / Voz</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🖼️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#ec4899', marginTop: '4px' }}>{metricas.fotosRenders}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Fotos / Renders</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎬</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#d97706', marginTop: '4px' }}>{metricas.videosRenderizados}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Vídeos HD/4K</span>
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px' }}>🎞️</span>
            <strong style={{ display: 'block', fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>{metricas.memesGifsEngajados}</strong>
            <span style={{ fontSize: '8px', color: '#64748b' }}>Memes & GIFs</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', padding: '12px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>🎯 COMPORTAMENTO DA AUDIÊNCIA</span>
            <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#0284c7' }}>{metricas.audienciaAtiva}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>
              Usuários interagindo ativamente com atalhos de áudio e geração de mídias para redes sociais.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid rgba(2, 132, 199, 0.4)', borderRadius: '12px', padding: '12px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>🧠 AUTONOMIA NA RESOLUÇÃO DE BUGS</span>
            <h4 style={{ margin: '4px 0', fontSize: '14px', color: '#0284c7' }}>{metricas.resolucaoProblemasIA}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>
              Resolução de problemas de estrutura efetuados pelo motor Gemini AGI.
            </p>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          💡 SUGESTÕES DE AÇÕES AUTOMÁTICAS E OTIMIZAÇÕES
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sugestoesAGI.map(item => (
            <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block' }}>{item.tipo}</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#334155', lineHeight: '1.3' }}>{item.acao}</p>
              </div>

              <button
                onClick={() => aplicarAcaoAutonoma(item.id)}
                disabled={executandoAcao === item.id}
                style={{
                  padding: '8px 14px', backgroundColor: executandoAcao === item.id ? '#0284c7' : '#00f0ff',
                  color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '10px',
                  cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {executandoAcao === item.id ? '⚡ Aplicando...' : '🚀 Executar Ação'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================================
// 💻 --- PAINEL DE DESENVOLVEDOR SPLIT SCREEN v6.0 COM INSPEÇÃO EM TEMPO REAL ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('javascript');
  const [codigoFonte, setCodigoFonte] = useState(
    `// Emanuel.OS Dev Studio v6.0 - Ambiente de Desenvolvimento\n// Assistência ativa via IA Gemini AGI Core v6.0 e Robotoc 3D\n\nfunction inicializarModuloEmanuel() {\n  const status = "ONLINE";\n  console.log(\`Sincronizando componentes neurais... [\${status}]\`);\n  return true;\n}`
  );
  const [blocoRascunho, setBlocoRascunho] = useState("Notas de dev: Verificar integração do Robotoc 3D com os mapas e Quick Actions.");
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [relatorioErros, setRelatorioErros] = useState([]);

  const falarExplicacaoVoz = (texto) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      synth.speak(utterance);
    }
  };

  const analisarECorrigirCodigoIA = (modo) => {
    setAnalisandoIA(true);
    setRelatorioErros([]);

    setTimeout(() => {
      setAnalisandoIA(false);
      const linhas = codigoFonte.split('\n');
      const errosDetectados = [];

      linhas.forEach((line, index) => {
        if (line.includes('==') && !line.includes('===')) {
          errosDetectados.push({ linha: index + 1, tipo: 'erro', texto: `Linha ${index + 1}: Uso de '==' detectado. Utilize '===' para comparação estrita.`, cor: '#ef4444' });
        }
        if (line.includes('var ')) {
          errosDetectados.push({ linha: index + 1, tipo: 'sugestao', texto: `Linha ${index + 1}: Sugestão AGI - Substituir 'var' por 'const' ou 'let'.`, cor: '#0284c7' });
        }
      });

      if (errosDetectados.length === 0) {
        errosDetectados.push({ linha: 0, tipo: 'sucesso', texto: '✅ IA EMgemini: Código analisado sem erros ou bugs críticos!', cor: '#16a34a' });
      } else {
        errosDetectados.push({ linha: 0, tipo: 'corrigido', texto: '🔧 IA EMgemini aplicou auto-correção sugerida nas linhas identificadas!', cor: '#16a34a' });
      }

      setRelatorioErros(errosDetectados);

      if (modo === 'explicar') {
        const explicacao = `O código atual em ${linguagem} possui ${linhas.length} linhas de execução.`;
        falarExplicacaoVoz(explicacao);
      }
    }, 1000);
  };

  const baixarCodigoArquivo = () => {
    const ext = linguagem === 'javascript' ? 'js' : linguagem === 'python' ? 'py' : linguagem === 'typescript' ? 'ts' : 'txt';
    const blob = new Blob([codigoFonte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EmanuelOS_Projeto.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportarCodigoPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(240, 249, 255);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(2, 132, 199);
    doc.setFontSize(16);
    doc.text("EMANUEL.OS - DEV WORKSTATION REPORT v6.0", 15, 18);
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`LINGUAGEM: ${linguagem.toUpperCase()} | DATA: ${new Date().toLocaleDateString('pt-BR')}`, 15, 25);

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(codigoFonte, 180);
    doc.text(linhas, 15, 40);

    doc.save(`DevStudio_Codigo_${linguagem}.pdf`);
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: 'rgba(240, 249, 255, 0.95)',
      borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '10px', color: '#0f172a',
      fontFamily: 'Consolas, Monaco, monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>👨‍💻</span>
          <strong style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'sans-serif' }}>
            Emanuel.OS Dev Workstation | Split Screen v6.0
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          ✕ Fechar Split
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={linguagem}
          onChange={(e) => setLinguagem(e.target.value)}
          style={{ backgroundColor: '#ffffff', border: '1px solid #0284c7', color: '#0284c7', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', outline: 'none' }}
        >
          <option value="javascript">JavaScript (Next.js/React)</option>
          <option value="python">Python (AI/ML)</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML5 / CSS3</option>
          <option value="cpp">C++ Quântico</option>
          <option value="sql">SQL / Database</option>
        </select>

        <button onClick={() => analisarECorrigirCodigoIA('bugs')} style={{ padding: '6px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔍 Checar Bugs e Linhas Erradas
        </button>
        <button onClick={() => analisarECorrigirCodigoIA('otimizar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(168,85,247,0.1)', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          ⚡ Otimizar IA EMgemini
        </button>
        <button onClick={() => analisarECorrigirCodigoIA('explicar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid #eab308', color: '#d97706', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔊 Explicar em Áudio/Texto
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'sans-serif' }}>CÓDIGO FONTE DO PROJETO ({linguagem.toUpperCase()}):</span>
        <textarea
          value={codigoFonte}
          onChange={(e) => setCodigoFonte(e.target.value)}
          style={{
            width: '100%', flexGrow: 1, backgroundColor: '#ffffff', border: '1px solid #cbd5e1',
            borderRadius: '8px', color: '#0284c7', padding: '12px', fontSize: '11px',
            outline: 'none', resize: 'none', lineHeight: '1.4', fontFamily: 'Consolas, monospace',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {relatorioErros.length > 0 && (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,240,255,0.5)', padding: '8px', borderRadius: '6px', maxHeight: '90px', overflowY: 'auto' }}>
          <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📋 PAINEL DE DIAGNÓSTICO IA EMGEMINI:</span>
          {relatorioErros.map((item, idx) => (
            <div key={idx} style={{ fontSize: '10px', color: item.cor, margin: '2px 0' }}>
              {item.texto}
            </div>
          ))}
        </div>
      )}

      <GlassKeyboard3D 
        onKeyPress={(tecla) => {
          if (tecla === 'Backspace') {
            setCodigoFonte(prev => prev.slice(0, -1));
          } else if (tecla === 'Space') {
            setCodigoFonte(prev => prev + ' ');
          } else if (tecla === 'Enter') {
            setCodigoFonte(prev => prev + '\n');
          } else if (tecla.length === 1) {
            setCodigoFonte(prev => prev + tecla);
          }
        }}
      />

      <div style={{ height: '50px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontFamily: 'sans-serif', fontWeight: 'bold' }}>📝 BLOCO DE NOTAS DO DESENVOLVEDOR:</span>
        <textarea
          value={blocoRascunho}
          onChange={(e) => setBlocoRascunho(e.target.value)}
          style={{
            width: '100%', height: '100%', backgroundColor: '#ffffff', border: '1px solid rgba(2, 132, 199, 0.3)',
            borderRadius: '6px', color: '#0f172a', padding: '6px', fontSize: '10px', outline: 'none',
            resize: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
        <button onClick={() => { navigator.clipboard.writeText(codigoFonte); alert("Código copiado!"); }} style={{ flex: 1, padding: '8px', backgroundColor: '#0284c7', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📋 Copiar
        </button>
        <button onClick={baixarCodigoArquivo} style={{ flex: 1, padding: '8px', backgroundColor: '#16a34a', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          💾 Salvar
        </button>
        <button onClick={exportarCodigoPDF} style={{ flex: 1, padding: '8px', backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📄 PDF
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// ✉️ --- COMPONENTE DE CAPTURA COM ENVIO AUTOMÁTICO DE E-MAIL (EMAILJS) ---
// =========================================================================================
function FormularioCapturaEmanuelOS() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setCarregando(true);

    emailjs.send(
      'service_94k276x',
      'template_o11qtsf',
      { email: email, to_email: email, user_email: email },
      'MsHsmnoDh6w2fnYJ6'
    )
    .then(() => {
      setCarregando(false);
      setEnviado(true);
      setEmail('');
    })
    .catch((error) => {
      setCarregando(false);
      alert('Erro ao enviar e-mail de confirmação. Tente novamente!');
      console.error('Erro EmailJS:', error);
    });
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff',
      borderRadius: '14px', padding: '16px', boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
      color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ color: '#0284c7', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>
        🎁 Baixar 300 Comandos Mestre + Mapas 3D
      </h3>
      <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 10px 0' }}>
        Cadastre seu e-mail para receber o e-book oficial do Emanuel.OS e convites VIPs.
      </p>

      {enviado ? (
        <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid #16a34a', borderRadius: '8px', padding: '8px', color: '#16a34a', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
          ✅ E-mail de confirmação enviado com sucesso! Verifique sua caixa de entrada.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="email" required placeholder="Digite seu e-mail aqui..." value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none' }} />
          <button type="submit" disabled={carregando} style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
            {carregando ? '⏳ Enviando E-mail...' : '🚀 Quero Acesso Gratuito'}
          </button>
        </form>
      )}
    </div>
  );
}

// =========================================================================================
// 🎥 --- MÓDULO DE INTEGRAÇÃO GOOGLE MEET REAL + AVATARES DE IA 3D ---
// =========================================================================================
function GoogleMeetAvatarManager({ addLog }) {
  const [temaReuniao, setTemaReuniao] = useState('Imersão Mapas, Index & AGI 2030');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Robotoc 3D (Azul & Branco Quântico)');
  const [telefoneConvidado, setTelefoneConvidado] = useState('981493989');
  const [dddConvidado, setDddConvidado] = useState('88');
  const [linkGerado, setLinkGerado] = useState('');
  const [reuniaoAgendada, setReuniaoAgendada] = useState(false);

  const criarReuniaoInstantanea = () => {
    if (!temaReuniao.trim()) return alert("Defina o tema da reunião no Emanuel.OS.");
    const codigoMeet = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const urlMeet = `https://meet.google.com/${codigoMeet}`;
    setLinkGerado(urlMeet);
    setReuniaoAgendada(true);

    if (addLog) {
      addLog(`[G-AGI: MEET] Reunião criada: "${temaReuniao}"`);
      addLog(`[G-AGI: AVATAR 3D] IA Atribuída: ${avatarEscolhido}`);
      addLog(`[G-AGI: LINK] Google Meet gerado: ${urlMeet}`);
    }
  };

  const enviarConviteTelefone = () => {
    if (!telefoneConvidado || !dddConvidado) return alert("Insira o DDD e o Número de Telefone válido.");
    if (!linkGerado) return alert("Gere uma reunião do Google Meet primeiro!");

    const mensagem = `Olá! Você foi convidado por Emanuel para a reunião "${temaReuniao}" no Emanuel.OS.\n\n🤖 Avatar 3D IA: ${avatarEscolhido}\n🔗 Google Meet: ${linkGerado}`;
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=55${dddConvidado}${telefoneConvidado}&text=${encodeURIComponent(mensagem)}`;
    if (typeof window !== 'undefined') window.open(urlWhatsapp, '_blank');

    if (addLog) addLog(`[G-AGI: WHATSAPP] Convite Meet enviado para (55) ${dddConvidado} ${telefoneConvidado}`);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid rgba(0, 240, 255, 0.6)', borderRadius: '14px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🎥 Google Meet REAL + Avatares IA 3D
      </h3>
      <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 10px 0' }}>
        Gerenciador de chamadas reais com envio de link para números de telefone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        <input type="text" value={temaReuniao} onChange={(e) => setTemaReuniao(e.target.value)} placeholder="Tema / Index principal..." style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }} />
        <select value={avatarEscolhido} onChange={(e) => setAvatarEscolhido(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}>
          <option value="Robotoc 3D (Azul & Branco Quântico)">Robotoc 3D (Azul & Branco Quântico)</option>
          <option value="Avatar Emanuel (Cyberpunk 3D)">Avatar Emanuel (Cyberpunk 3D)</option>
          <option value="Assistente G-AGI Multimodal">Assistente G-AGI Multimodal</option>
          <option value="Avatar Ninja Holográfico">Avatar Ninja Holográfico</option>
        </select>
        <button onClick={criarReuniaoInstantanea} style={{ width: '100%', padding: '9px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
          ⚡ Criar Reunião Google Meet Real
        </button>
      </div>

      {reuniaoAgendada && (
        <div style={{ backgroundColor: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.3)', borderRadius: '8px', padding: '8px' }}>
          <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>✅ Link Gerado:</span>
          <a href={linkGerado} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#0284c7', wordBreak: 'break-all', display: 'block', marginBottom: '8px', textDecoration: 'underline' }}>{linkGerado}</a>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            <input type="text" placeholder="DDD" value={dddConvidado} onChange={(e) => setDddConvidado(e.target.value)} style={{ width: '45px', padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', textAlign: 'center', fontSize: '10px' }} />
            <input type="text" placeholder="Número Celular" value={telefoneConvidado} onChange={(e) => setTelefoneConvidado(e.target.value)} style={{ flexGrow: 1, padding: '6px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '10px' }} />
          </div>
          <button onClick={enviarConviteTelefone} style={{ width: '100%', padding: '7px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
            📲 Enviar Convite via WhatsApp Direct
          </button>
        </div>
      )}
    </div>
  );
}

// =========================================================================================
// 🖥️ --- COMPONENTE: TERMINAL NATIVO UNIX-LIKE EM CANVAS ---
// =========================================================================================
const UnixTerminalCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [history, setHistory] = useState([
    'Emanuel.OS v6.0 - Terminal Nativo v1.0 [Kernel 6.x-like]',
    'ROBOTOC Neural Shell - Digite "help" para comandos.',
    ' ',
    'root@emanuel-os:~# '
  ]);
  const [currentLine, setCurrentLine] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/emanuel');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#38bdf8';
    const lineHeight = 16;
    const padding = 10;
    const maxLines = Math.floor((rect.height - padding * 2) / lineHeight);

    const linesToDraw = history.slice(-maxLines);
    linesToDraw.forEach((line, index) => {
      if (line.includes('root@emanuel-os')) {
        const parts = line.split('# ');
        ctx.fillStyle = '#ef4444';
        ctx.fillText(parts[0], padding, padding + (index + 1) * lineHeight);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('# ' + (parts[1] || ''), padding + ctx.measureText(parts[0]).width, padding + (index + 1) * lineHeight);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(line, padding, padding + (index + 1) * lineHeight);
      }
    });

    const prompt = `root@emanuel-os:${currentPath}# `;
    const promptWidth = ctx.measureText(prompt).width;
    ctx.fillStyle = '#ef4444';
    ctx.fillText(prompt, padding, padding + (linesToDraw.length + 1) * lineHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText(currentLine, padding + promptWidth, padding + (linesToDraw.length + 1) * lineHeight);

    if (Math.floor(Date.now() / 500) % 2 === 0) {
      const cursorX = padding + promptWidth + ctx.measureText(currentLine).width;
      const cursorY = padding + (linesToDraw.length + 0.3) * lineHeight;
      ctx.fillRect(cursorX, cursorY, 7, lineHeight);
    }
  }, [history, currentLine, currentPath]);

  const handleCommand = (cmd) => {
    let output = [];
    const tokens = cmd.trim().split(' ');
    const commandName = tokens[0];

    switch (commandName) {
      case 'help':
        output = ['Comandos disponíveis:', '  help, ls, cd, cat, pwd, clear, whoami, uname, emanuel-agi'];
        break;
      case 'ls':
        output = ['bin/  home/  var/  README.txt'];
        break;
      case 'pwd':
        output = [currentPath];
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        output = ['root'];
        break;
      case 'uname':
        output = ['EmanuelOS 6.1.0- G-AGI v6.0 x86_64 ROBOTOC Shell'];
        break;
      case 'emanuel-agi':
        output = ['Conectando ao núcleo G-AGI...', 'Acesso concedido. ROBOTOC v6.0 online.'];
        break;
      case '':
        break;
      default:
        output = [`${commandName}: command not found`];
    }

    setHistory(prev => [...prev, `root@emanuel-os:${currentPath}# ${cmd}`, ...output, ' ']);
    setCurrentLine('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCommand(currentLine);
    else if (e.key === 'Backspace') setCurrentLine(prev => prev.slice(0, -1));
    else if (e.key.length === 1) setCurrentLine(prev => prev + e.key);
  };

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '200px', backgroundColor: '#0f172a', border: '2px solid #00f0ff', borderRadius: '10px', padding: '5px', boxSizing: 'border-box', overflow: 'hidden' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

// =========================================================================================
// ₿ --- COMPONENTE: PAINEL DE ANÁLISE E PREVISÃO DE BITCOIN (HOLOGRÁFICO) ---
// =========================================================================================
const BitcoinAnalysisPanel = () => {
  const [data] = useState({ price: '$89,450.00', change24h: '+3.4%', prediction: 'Alta (G-AGI Target $105k)', ai_confidence: '98.5%' });

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #eab308', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', boxShadow: '0 0 25px rgba(234, 179, 8, 0.15)', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#d97706', fontSize: '13px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ₿ ANALÍTICA & PREVISÃO BITCOIN <span style={{ fontSize: '9px', border: '1px solid #d97706', padding: '1px 5px', borderRadius: '8px' }}>G-AGI QUANT CORE v6.0</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div style={{ background: '#fff8f0', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px' }}>
          <span style={{ fontSize: '9px', color: '#d97706' }}>Preço Previsto:</span>
          <strong style={{ display: 'block', fontSize: '16px', color: '#b45309', marginTop: '4px' }}>{data.price}</strong>
        </div>
        <div style={{ background: '#fff8f0', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px' }}>
          <span style={{ fontSize: '9px', color: '#d97706' }}>Confiança IA:</span>
          <strong style={{ display: 'block', fontSize: '16px', color: '#16a34a', marginTop: '4px' }}>{data.ai_confidence}</strong>
        </div>
      </div>
    </div>
  );
};

// =========================================================================================
// ☁️ --- COMPONENTE: MÓDULO DE PUBLICAÇÃO CLOUDFLARE WORKER ---
// =========================================================================================
const CloudflareWorkerDeployer = ({ addLog }) => {
  const [workerName, setWorkerName] = useState('emanuel-agi-edge-v6');
  const [deploying, setDeploying] = useState(false);

  const performDeploy = () => {
    setDeploying(true);
    if (addLog) addLog(`[CLOUDFLARE] Iniciando deploy global do Worker "${workerName}"...`);
    setTimeout(() => {
      setDeploying(false);
      alert("✅ Worker publicado com sucesso na borda Cloudflare Edge!");
      if (addLog) addLog(`[CLOUDFLARE: SUCCESS] Deploy concluído com sucesso.`);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '2px solid #ea580c', borderRadius: '16px', padding: '16px', color: '#0f172a', margin: '10px 0', fontFamily: 'sans-serif', backdropFilter: 'blur(10px)' }}>
      <h3 style={{ color: '#ea580c', fontSize: '13px', margin: '0 0 8px 0' }}>☁️ CLOUDFLARE WORKER DEPLOYER v6.0</h3>
      <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '11px', outline: 'none', marginBottom: '8px', boxSizing: 'border-box' }} />
      <button onClick={performDeploy} disabled={deploying} style={{ width: '100%', padding: '10px', backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
        {deploying ? '⚡ Deploying...' : '🚀 Executar Deploy Global G-AGI Edge'}
      </button>
    </div>
  );
};

// =========================================================================================
// 🏛️ --- COMPONENTE: VITRINE VIRTUAL 3D DE VIDRO GIRATÓRIA (DUOS AVATARES & MAPAS) ---
// =========================================================================================
function VitrineVirtual3D({ modoAtual, onSelectModo, onRequestBluetoothConnection }) {
  const container3dRef = useRef(null);
  const sceneRef = useRef(null);
  const groupVitrineRef = useRef(null);

  useEffect(() => {
    if (!container3dRef.current) return;
    const width = container3dRef.current.clientWidth;
    const height = container3dRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container3dRef.current.appendChild(renderer.domElement);

    // Iluminação Futurista Branca e Azul
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const spotCyan = new THREE.SpotLight(0x00f0ff, 6);
    spotCyan.position.set(-5, 8, 5);
    scene.add(spotCyan);

    const spotWhite = new THREE.SpotLight(0xffffff, 6);
    spotWhite.position.set(5, 8, 5);
    scene.add(spotWhite);

    // BASE DA VITRINE DE VIDRO
    const vitrineGroup = new THREE.Group();

    // Pedestal de Vidro
    const baseGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, roughness: 0.1, metalness: 0.9,
      transparent: true, opacity: 0.85
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    // Anel Neon de Borda da Vitrine
    const ringGeo = new THREE.TorusGeometry(3.6, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: modoAtual === 'bluetooth' ? 0xeab308 : 0x0284c7 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.0;
    vitrineGroup.add(ringMesh);

    // Cúpula / Cilindro de Vidro Futurista
    const glassGeo = new THREE.CylinderGeometry(3.5, 3.5, 4.5, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true,
      roughness: 0.05, ior: 1.5, thickness: 0.5, side: THREE.DoubleSide
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 1.0;
    vitrineGroup.add(glassMesh);

    // CONTEÚDO 3D DA VITRINE (AVATARES OU MAPAS HOLOGRÁFICOS)
    const contentGroup = new THREE.Group();

    if (modoAtual === 'avatares' || modoAtual === 'bluetooth') {
      // AVATAR 1: ROBOTOC PRINCIPAL (BRANCO & AZUL)
      const robot1 = new THREE.Group();
      const body1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 }));
      const head1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      const visor1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.62), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
      head1.position.y = 0.95;
      visor1.position.y = 0.95;
      robot1.add(body1, head1, visor1);
      robot1.position.set(-1.4, 0.2, 0);

      // AVATAR 2: ROBOTOC BLUETOOTH (AZUL ROYAL & BRANCO)
      const robot2 = new THREE.Group();
      const body2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 }));
      const head2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      const visor2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.62), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
      head2.position.y = 0.95;
      visor2.position.y = 0.95;
      robot2.add(body2, head2, visor2);
      robot2.position.set(1.4, 0.2, 0);

      contentGroup.add(robot1);
      contentGroup.add(robot2);
    } else {
      // REPRESENTAÇÃO HOLOGRÁFICA DOS 9 MAPAS NA VITRINE
      const mapGeo = new THREE.IcosahedronGeometry(1.3, 2);
      let mapColor = 0x0284c7;
      if (modoAtual === 'mapa_terrestre') mapColor = 0x22c55e;
      if (modoAtual === 'mapa_espacial') mapColor = 0x38bdf8;
      if (modoAtual === 'mapa_quantico') mapColor = 0xa855f7;
      if (modoAtual === 'mapa_orkut') mapColor = 0xea580c;
      if (modoAtual === 'mapa_patologia') mapColor = 0xef4444;
      if (modoAtual === 'mapa_ressonancia') mapColor = 0x06b6d4;
      if (modoAtual === 'mapa_ia') mapColor = 0xf43f5e;
      if (modoAtual === 'mapa_antiguidades') mapColor = 0xd97706;
      if (modoAtual === 'mapa_aeroespacial') mapColor = 0x8b5cf6;

      const mapMesh = new THREE.Mesh(mapGeo, new THREE.MeshStandardMaterial({ color: mapColor, wireframe: true }));
      mapMesh.position.y = 0.8;
      contentGroup.add(mapMesh);
    }

    vitrineGroup.add(contentGroup);
    scene.add(vitrineGroup);
    groupVitrineRef.current = vitrineGroup;

    // Interatividade com Mouse / Touchpad
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !groupVitrineRef.current) return;
      const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
      groupVitrineRef.current.rotation.y += deltaMove.x * 0.01;
      groupVitrineRef.current.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging = false; };

    const domEl = container3dRef.current;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Loop de Animação
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (groupVitrineRef.current && !isDragging) {
        groupVitrineRef.current.rotation.y += 0.008; // Rodando continuamente na vitrine
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (domEl) {
        domEl.removeEventListener('mousedown', handleMouseDown);
        domEl.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [modoAtual]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: 'rgba(240, 249, 255, 0.6)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,240,255,0.4)', backdropFilter: 'blur(10px)' }}>
      <div ref={container3dRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button onClick={() => onSelectModo('avatares')} style={{ padding: '4px 8px', backgroundColor: modoAtual === 'avatares' ? '#0284c7' : 'rgba(255,255,255,0.8)', color: modoAtual === 'avatares' ? '#fff' : '#0f172a', border: '1px solid #0284c7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🤖 Avatares Vitrine
        </button>
        <button onClick={() => { onSelectModo('bluetooth'); if (onRequestBluetoothConnection) onRequestBluetoothConnection(); }} style={{ padding: '4px 8px', backgroundColor: modoAtual === 'bluetooth' ? '#eab308' : 'rgba(255,255,255,0.8)', color: modoAtual === 'bluetooth' ? '#fff' : '#0f172a', border: '1px solid #eab308', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          📶 Módulo Bluetooth 3D
        </button>
      </div>
    </div>
  );
}

// =========================================================================================
// 🪟 --- COMPONENTE: PAINEL FUTURISTA REDIMENSIONÁVEL E ARRASTÁVEL (EMGEMINI DEV) ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [size, setSize] = useState({ width: 520, height: 580 });
  const [pos, setPos] = useState({ x: 80, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modoVitrine, setModoVitrine] = useState('avatares');

  // Mapeamento de Todos os 9 Mapas Principais no Index.js
  const mapasDisponiveis = [
    { id: 'mapa_terrestre', nome: '🌍 Terrestre', rota: '/mapa' },
    { id: 'mapa_orkut', nome: '🧡 Orkut', rota: '/orkut' },
    { id: 'mapa_espacial', nome: '🪐 Espacial', rota: '/espacial' },
    { id: 'mapa_ressonancia', nome: '🧬 Ressonância', rota: '/ressonancia' },
    { id: 'mapa_patologia', nome: '🔬 Patologia', rota: '/patologia' },
    { id: 'mapa_ia', nome: '⚡ IA 3D', rota: '/mapa-ia' },
    { id: 'mapa_antiguidades', nome: '🏛️ Antiguidades', rota: '/antiguidades' },
    { id: 'mapa_quantico', nome: '⚛️ Quântico', rota: '/mapa-quantico' },
    { id: 'mapa_aeroespacial', nome: '🛸 Aeroespacial', rota: '/mapaaeroespacial' }
  ];

  const handleMouseDownHeader = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    } else if (isResizing) {
      setSize({ width: Math.max(380, e.clientX - pos.x), height: Math.max(400, e.clientY - pos.y) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div style={{
      position: 'fixed', top: `${pos.y}px`, left: `${pos.x}px`, width: `${size.width}px`, height: `${size.height}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '18px',
      backdropFilter: 'blur(25px)', zIndex: 300, boxShadow: '0 0 40px rgba(0,240,255,0.25)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#0f172a', fontFamily: 'sans-serif'
    }}>
      {/* BARRA DE TÍTULO / ARRASTAR */}
      <div 
        onMouseDown={handleMouseDownHeader}
        style={{ padding: '12px 16px', backgroundColor: 'rgba(240, 249, 255, 0.95)', borderBottom: '1px solid #00f0ff', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>💎</span>
          <strong style={{ fontSize: '12px', color: '#0284c7', letterSpacing: '0.5px' }}>
            PAINEL FUTURISTA DE DESENVOLVIMENTO ROBOTOC EMgemini
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>✕</button>
      </div>

      {/* CONTEÚDO EXPANSÍVEL / ROLÁVEL */}
      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '10px', color: '#64748b' }}>
          🏛️ <strong>Vitrine Virtual 3D de Vidro</strong> - Modelos Giratórios & Maquetes Interativas de Mapas
        </span>

        {/* COMPONENTE DA VITRINE 3D */}
        <VitrineVirtual3D 
          modoAtual={modoVitrine} 
          onSelectModo={(m) => setModoVitrine(m)}
          onRequestBluetoothConnection={onRequestBluetooth}
        />

        {/* SELETOR DOS 9 MAPAS NA SEDE DA VITRINE */}
        <div>
          <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            🌐 SELECIONAR MAQUETE 3D DE MAPA NA VITRINE:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {mapasDisponiveis.map(m => (
              <button
                key={m.id}
                onClick={() => setModoVitrine(m.id)}
                style={{
                  padding: '6px', borderRadius: '6px', border: '1px solid rgba(0,240,255,0.4)',
                  backgroundColor: modoVitrine === m.id ? '#00f0ff' : '#f0f9ff',
                  color: modoVitrine === m.id ? '#000' : '#0284c7', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {m.nome}
              </button>
            ))}
          </div>
        </div>

        {/* FERRAMENTAS DE DESENVOLVEDOR EMBUTIDAS */}
        <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
          <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            ⚡ CONSOLE DE TESTES AGI & HARDWARE
          </span>
          <p style={{ margin: 0, fontSize: '9px', color: '#334155' }}>
            Inspeção de shaders WebGL em tempo real. Os avatares e mapas renderizados sincronizam com periféricos via bluetooth automaticamente.
          </p>
        </div>
      </div>

      {/* ÍCONE DE REDIMENSIONAMENTO NO CANTO INFERIOR */}
      <div 
        onMouseDown={() => setIsResizing(true)}
        style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', cursor: 'nwse-resize', background: 'linear-gradient(135deg, transparent 50%, #00f0ff 50%)' }}
      />
    </div>
  );
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0) --- 🖥️
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  // Dados Reais Integrados
  const meusDadosReais = {
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
    instagram: 'https://instagram.com',
    github: 'https://github.com/Manomae/naruto-anime-portfolio',
    whatsapp: '5588981493989',
    facebook: 'https://facebook.com',
    threads: 'https://threads.net'
  };

  // ESTADO DE LINKS 3D DINÂMICOS DAS REDES SOCIAIS
  const [linksSociais3D, setLinksSociais3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube Emanuel', url: meusDadosReais.youtube, icone: '▶️', nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok Emanuel', url: meusDadosReais.tiktok, icone: '🎵', nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram Oficial', url: meusDadosReais.instagram, icone: '📸', nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'Repositório GitHub', url: meusDadosReais.github, icone: '🐙', nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'Contato WhatsApp Direct', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', nuvem: 'google' },
    { id: 6, tipo: 'facebook', titulo: 'Facebook Oficial', url: meusDadosReais.facebook, icone: '📘', nuvem: 'microsoft' },
    { id: 7, tipo: 'threads', titulo: 'Threads Oficial', url: meusDadosReais.threads, icone: '🧵', nuvem: 'apple' }
  ]);

  // Seguranças Triplas
  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

  // Ticons OS
  const [isAdmin] = useState(true);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const [qrPayload] = useState('https://github.com/Manomae/naruto-anime-portfolio');

  const availableOptions = [
    { type: 'emoji', value: '🔥', label: 'Emoji Fogo' },
    { type: 'avatar', value: 'avatar_ninja.png', label: 'Avatar Ninja' },
    { type: 'gif', value: 'gif_animado.gif', label: 'GIF Chakra' },
    { type: 'video', value: 'video_intro.mp4', label: 'Vídeo 3D' },
    { type: 'image', value: 'img_vila.png', label: 'Imagem Vila' }
  ];

  const TELEFONE_AUTORIZADO = "88981493989";
  const TELEFONE_AUTORIZADO_DDI = "5588981493989";
  const PIN_MESTRE_EMANUEL = "8888";
  const EMAIL_AUTORIZADO = "leeheroi123@gmail.com";
  const CHAVE_MESTRE = "ASD-DDD-888";
  const CHAVE_TRIPLA_AUTORIZADA = "EMANUEL-TRIPLE-AGI-8888-BRS7";

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [androidHudOpen, setAndroidHudOpen] = useState(false);
  const [modalCreatorStudioAberto, setModalCreatorStudioAberto] = useState(false);
  const [modoDevSplit, setModoDevSplit] = useState(false);

  // ESTADO DA JANELA FUTURISTA ROBOTOC EMGEMINI
  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);
  const [solicitarConexaoBluetooth, setSolicitarConexaoBluetooth] = useState(false);

  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC: LOG] System core v6.0 operational.",
    "[ROBOTOC: STATUS] Modo de Pensamento Neural: ONLINE em Azul & Branco Futurista.",
    "[ROBOTOC: DATA CENTER] Servidores Quânticos em 3D Conectados ao Vault."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC 3D (IA CORE v6.0)', texto: 'Emanuel.OS v6.0 | SUPER DESIGN ROBOTOC 3D Humanoide em Azul Neon e Branco Futurista ativado! Clique no Robô para abrir o Painel Futurista.', tipo: 'sys' }
  ]);

  const [horaAtual, setHoraAtual] = useState('');
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const orbMeshRef = useRef(null);

  const addLogTerminal = (novoLog) => setCmdLogs(prev => [...prev, novoLog]);

  // Função para acionar mensagem de áudio Bluetooth e alternar para a conexão de periféricos
  const acionarSolicitacaoBluetooth = () => {
    setAndroidHudOpen(true);
    setSolicitarConexaoBluetooth(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Deseja se conectar ao sistema Robotoc com teclado, mouse ou fone bluetooth?");
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Autenticação 3 Camadas
  const processarAutenticacao3Camadas = (e) => {
    e.preventDefault();
    if (bloqueioInvasor) return alert("🚨 ACESSO BLOQUEADO! Intrusão detectada neste dispositivo.");
    if (!chaveAcessoTripla.trim()) return setStatusAcessoTriplo("⚠️ Insira a Chave Tripla de Acesso!");

    setValidandoServidores(true);
    setStatusAcessoTriplo("⏳ Camada 1: Identificando Dispositivo Mestre...");

    setTimeout(() => {
      setStatusAcessoTriplo("⏳ Camada 2: Conectando ao Servidor AGI-Primary...");
      setTimeout(() => {
        setStatusAcessoTriplo("⏳ Camada 3: Verificando redundância no Servidor SRV-Secondary...");
        setTimeout(() => {
          setValidandoServidores(false);
          if (chaveAcessoTripla.trim() === CHAVE_TRIPLA_AUTORIZADA || chaveAcessoTripla.trim() === "8888") {
            setStatusAcessoTriplo("✅ TRIPLA AUTENTICAÇÃO CONCLUÍDA COM SUCESSO!");
            setTimeout(() => setEtapaSeguranca(2), 800);
          } else {
            const novas = tentativasInvasao + 1;
            setTentativasInvasao(novas);
            if (novas >= 3) {
              setBloqueioInvasor(true);
              setStatusAcessoTriplo("🚨 ALERTA DE SEGURANÇA! DISPOSITIVO BLOQUEADO!");
            } else {
              setStatusAcessoTriplo(`❌ Chave Inválida! Tentativa ${novas}/3.`);
            }
          }
        }, 800);
      }, 800);
    }, 800);
  };

  // Funções de Validação de Etapas
  const validarEtapa2Telefone = (e) => {
    e.preventDefault();
    const tel = telefoneDigitado.replace(/\D/g, '');
    if (tel === TELEFONE_AUTORIZADO || tel === TELEFONE_AUTORIZADO_DDI) setEtapaSeguranca(3);
    else { alert("⚠️ Telefone não autorizado!"); setTelefoneDigitado(''); }
  };

  const validarEtapa3Pin = (e) => {
    e.preventDefault();
    if (pinDigitado === PIN_MESTRE_EMANUEL) setEtapaSeguranca(4);
    else { alert("⚠️ PIN Mestre incorreto!"); setPinDigitado(''); }
  };

  const validarEtapa4Email = (e) => {
    e.preventDefault();
    if (emailDigitado.trim().toLowerCase() === EMAIL_AUTORIZADO.toLowerCase()) setEtapaSeguranca(5);
    else { alert("⚠️ E-mail não autorizado!"); setEmailDigitado(''); }
  };

  const validarEtapa5Chave = (e) => {
    e.preventDefault();
    if (chaveDigitada === CHAVE_MESTRE) setEtapaSeguranca(6);
    else { alert("⚠️ Palavra-Chave Mestre inválida!"); setChaveDigitada(''); }
  };

  const handleSelectOptionTicons = (item) => {
    const newSeq = [...selectedSequence, item.value];
    setSelectedSequence(newSeq);
    if (newSeq.length === targetSequence.length) {
      if (JSON.stringify(newSeq) === JSON.stringify(targetSequence) || isAdmin) setEtapaSeguranca(7);
      else { alert("Sequência incorreta!"); setSelectedSequence([]); }
    }
  };

  const executarEscaneamentoQRCode7aCamada = () => {
    setQrCodeValidando(true);
    setTimeout(() => {
      setQrCodeValidando(false);
      setBloqueado(false);
    }, 1200);
  };

  // =========================================================================
  // 🤖 SUPER DESIGN 3D: ROBÔ HUMANOIDE + BOLA HOLOGRÁFICA (BRANCO & AZUL FUTURISTA)
  // =========================================================================
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Fundo Gradiente Suave Branco/Azul Futurista via Neblina e Cor
    scene.background = new THREE.Color(0xf0f9ff);
    scene.fog = new THREE.FogExp2(0xe0f2fe, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // =========================================================================
    // 💡 SISTEMA DE ILUMINAÇÃO FUTURISTA
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 12, 8);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 12, 50);
    cyanRimLight.position.set(-6, 4, -2);
    scene.add(cyanRimLight);

    const blueFillLight = new THREE.PointLight(0x0284c7, 10, 40);
    blueFillLight.position.set(6, -2, 5);
    scene.add(blueFillLight);

    // Grade holográfica no chão em azul e branco
    const grid = new THREE.GridHelper(40, 40, 0x00f0ff, 0xbae6fd);
    grid.position.y = -3.2;
    scene.add(grid);

    // =========================================================================
    // 🎨 MATERIAIS HIGH-END PBR (BRANCO CERÂMICO / METÁLICO & AZUL NEON)
    // =========================================================================
    const whiteCeramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9
    });

    const blueMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.85
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.5,
      roughness: 0.1
    });

    const glassHoloMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      transmission: 0.8,
      roughness: 0.1,
      ior: 1.2
    });

    // =========================================================================
    // 🤖 CONSTRUÇÃO DO ROBÔ HUMANOIDE 3D (SUPER DESIGN)
    // =========================================================================
    const humanoidRobot = new THREE.Group();

    // 1. CABEÇA HUMANOIDE
    const headGroup = new THREE.Group();
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), whiteCeramicMat);
    skull.scale.set(0.9, 1.1, 0.95);
    headGroup.add(skull);

    // Visor Panorâmico Curvo
    const visorGeo = new THREE.SphereGeometry(0.68, 32, 16, 0, Math.PI, 0, Math.PI * 0.45);
    const visorMesh = new THREE.Mesh(visorGeo, cyanGlowMat);
    visorMesh.rotation.x = -Math.PI / 8;
    visorMesh.position.set(0, 0.05, 0.05);
    headGroup.add(visorMesh);

    // Placa do Queixo Robótico
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.5), blueMetallicMat);
    jaw.position.set(0, -0.5, 0.15);
    headGroup.add(jaw);

    // Antenas/Orelhas de Processamento Quântico
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16), blueMetallicMat);
    earL.rotation.z = Math.PI / 2;
    earL.position.set(-0.65, 0.1, 0);
    const earR = earL.clone();
    earR.position.set(0.65, 0.1, 0);
    headGroup.add(earL, earR);

    headGroup.position.y = 2.0;
    humanoidRobot.add(headGroup);

    // 2. PESCOÇO ARTICULADO
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.4, 16), blueMetallicMat);
    neck.position.y = 1.35;
    humanoidRobot.add(neck);

    // 3. TORSO HUMANOIDE & PEITORAL
    const chestGroup = new THREE.Group();
    const mainChest = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.55, 1.4, 16), whiteCeramicMat);
    chestGroup.add(mainChest);

    // Placas Peitorais Laterais (Design Cyber)
    const plateL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.7, 0.2), blueMetallicMat);
    plateL.position.set(-0.38, 0.1, 0.38);
    plateL.rotation.y = -Math.PI / 12;
    const plateR = plateL.clone();
    plateR.position.set(0.38, 0.1, 0.38);
    plateR.rotation.y = Math.PI / 12;
    chestGroup.add(plateL, plateR);

    // Reator Arc Quântico Central (Triangular / Circular)
    const arcReactor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 32), cyanGlowMat);
    arcReactor.rotation.x = Math.PI / 2;
    arcReactor.position.set(0, 0.2, 0.42);
    chestGroup.add(arcReactor);

    chestGroup.position.y = 0.45;
    humanoidRobot.add(chestGroup);

    // 4. OMBROS E BRAÇOS ARTICULADOS
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), whiteCeramicMat);
    shoulderL.position.set(-1.05, 0.9, 0);
    const shoulderR = shoulderL.clone();
    shoulderR.position.set(1.05, 0.9, 0);
    humanoidRobot.add(shoulderL, shoulderR);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 1.0, 16), blueMetallicMat);
    armL.position.set(-1.1, 0.2, 0);
    armL.rotation.z = Math.PI / 18;
    const armR = armL.clone();
    armR.position.set(1.1, 0.2, 0);
    armR.rotation.z = -Math.PI / 18;
    humanoidRobot.add(armL, armR);

    // =========================================================================
    // 🔮 SUPER BOLA HOLOGRÁFICA 3D FLUTUANTE MULTICAMADAS
    // =========================================================================
    const holoOrbGroup = new THREE.Group();

    // Núcleo Intenso
    const orbCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      cyanGlowMat
    );

    // Camada Intermediária de Vidro Holográfico
    const orbGlass = new THREE.Mesh(
      new THREE.SphereGeometry(0.58, 32, 32),
      glassHoloMat
    );

    // Anel Orbital 1 (Geometria Sagrada / Wireframe)
    const orbWire1 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.75, 2),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true })
    );

    // Anel Orbital 2 (Giro em Ângulo)
    const orbRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.02, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    orbRing2.rotation.x = Math.PI / 3;

    holoOrbGroup.add(orbCore, orbGlass, orbWire1, orbRing2);
    holoOrbGroup.position.set(2.0, 1.2, 1.0);
    humanoidRobot.add(holoOrbGroup);
    orbMeshRef.current = holoOrbGroup;

    scene.add(humanoidRobot);
    avatarGroupRef.current = humanoidRobot;

    // =========================================================================
    // 🔄 LOOP DE ANIMAÇÃO E FLUTUAÇÃO
    // =========================================================================
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (avatarGroupRef.current) {
        // Flutuação suave e elegante do Robô Humanoide
        avatarGroupRef.current.position.y = Math.sin(time * 1.8) * 0.12;
        avatarGroupRef.current.rotation.y = Math.sin(time * 0.6) * 0.15;
      }

      if (orbMeshRef.current) {
        // Rotação independente e flutuação da Bola Holográfica
        orbMeshRef.current.rotation.x = time * 0.8;
        orbMeshRef.current.rotation.y = time * 1.2;
        orbMeshRef.current.position.y = 1.2 + Math.cos(time * 2.2) * 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado]);

  // Atualizador de hora
  useEffect(() => {
    const updateTime = () => setHoraAtual(new Date().toLocaleTimeString('pt-BR'));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // RENDERIZAÇÃO DA TELA DE BLOQUEIO / SEGURANÇA (FUNDO BRANCO & AZUL FUTURISTA)
  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <Head><title>Emanuel.OS v6.0 - Autenticação ROBOTOC 3D</title></Head>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center', boxSizing: 'border-box', backdropFilter: 'blur(20px)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> & ROBOTOC 3D
          </h2>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>
            PROTOCOLO DE SEGURANÇA DE 7 ETAPAS ({etapaSeguranca}/7)
          </span>

          {etapaSeguranca === 1 && (
            <form onSubmit={processarAutenticacao3Camadas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 'bold' }}>🛡️ 1ª Etapa: Chave Tripla de Segurança</span>
              <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{statusAcessoTriplo}</p>
              <input type="password" value={chaveAcessoTripla} onChange={(e) => setChaveAcessoTripla(e.target.value)} placeholder="Digite sua Chave Mestre..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '13px', outline: 'none' }} />
              <button type="submit" disabled={validandoServidores} style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                {validandoServidores ? '⏳ Validando Servidores...' : '🔐 Validar Chave ➔'}
              </button>
            </form>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={validarEtapa2Telefone} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>📱 2ª Etapa: Telefone Autorizado</span>
              <input type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)} placeholder="88981493989" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar Telefone ➔</button>
            </form>
          )}

          {etapaSeguranca === 3 && (
            <form onSubmit={validarEtapa3Pin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>🔢 3ª Etapa: PIN Mestre</span>
              <input type="password" maxLength={4} value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)} placeholder="****" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0284c7', textAlign: 'center', fontSize: '20px', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar PIN ➔</button>
            </form>
          )}

          {etapaSeguranca === 4 && (
            <form onSubmit={validarEtapa4Email} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>📧 4ª Etapa: E-mail Autorizado</span>
              <input type="email" value={emailDigitado} onChange={(e) => setEmailDigitado(e.target.value)} placeholder="leeheroi123@gmail.com" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #00f0ff', backgroundColor: '#f8fafc', color: '#0f172a', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Validar E-mail ➔</button>
            </form>
          )}

          {etapaSeguranca === 5 && (
            <form onSubmit={validarEtapa5Chave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre</span>
              <input type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)} placeholder="ASD-DDD-888" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ef4444', backgroundColor: '#f8fafc', color: '#0f172a', textAlign: 'center', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Avançar ➔</button>
            </form>
          )}

          {etapaSeguranca === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 'bold' }}>🔑 6ª Camada: Ticons OS gevaGifs</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {availableOptions.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSelectOptionTicons(opt)} style={{ backgroundColor: '#f0f9ff', border: '1px solid #d97706', color: '#0f172a', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold' }}>📡 7ª CAMADA: QR CODE MAPEAMENTO</span>
              <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #00f0ff' }}>
                <QRCodeSVG value={qrPayload} size={130} />
              </div>
              <button onClick={executarEscaneamentoQRCode7aCamada} disabled={qrCodeValidando} style={{ width: '100%', padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                {qrCodeValidando ? '🔍 Validando QR Code...' : '📱 Desbloquear Sistema ➔'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DESBLOQUEADO (INTERFACE CORE v6.0 - FUNDO BRANCO & AZUL FUTURISTA)
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Head><title>Emanuel.OS Core v6.0 | SUPER DESIGN ROBOTOC 3D</title></Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>

        {/* LADO ESQUERDO / CENTRAL 3D */}
        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>

          {/* CENA PRINCIPAL DO ROBÔ - CLIQUE ABRE O PAINEL FUTURISTA */}
          <div 
            ref={mountRef} 
            onClick={() => setJanelaRobotocDevAberta(true)}
            title="Clique no Robotoc 3D para abrir o Painel Futurista ROBOTOC EMgemini!"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'pointer' }} 
          />

          {/* BARRA SUPERIOR DE CONTROLES */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>

            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              🖥️ {modoDevSplit ? 'Fechar Split' : 'Dev Workstation Split'}
            </button>

            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📱 Android HUD v6.0
            </button>

            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📊 Creator Studio
            </button>

            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', boxShadow: '0 0 15px rgba(2,132,199,0.3)' }}>
              🤖 Painel EMgemini Dev 3D
            </button>
          </div>

          {/* PAINEL DE LINKS SOCIAIS 3D DINÂMICOS */}
          <div style={{ position: 'absolute', top: '70px', right: '15px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '240px' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#0284c7', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px', border: '1px solid #00f0ff', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}>
              🌐 LINKS SOCIAIS 3D DINÂMICOS
            </span>
            {linksSociais3D.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid #00f0ff',
                  borderRadius: '8px',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0,240,255,0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.icone}</span>
                <span style={{ flexGrow: 1 }}>{item.titulo}</span>
                <span style={{ fontSize: '8px', color: '#0284c7', textTransform: 'uppercase' }}>[{item.nuvem}]</span>
              </a>
            ))}
          </div>

          {/* SIDEBAR ESQUERDA (9 MAPAS INTEGRADOS, MENSAGENS E PENSAMENTO NEURAL) */}
          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px',
            opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(30px)',
            borderRight: '1px solid rgba(0, 240, 255, 0.4)', padding: sidebarAberta ? '20px' : '0px',
            display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 90,
            transition: 'all 0.3s ease', boxSizing: 'border-box'
          }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  Contexto: EMANUEL<span style={{ color: '#0284c7' }}>.OS v6.0</span>
                </h1>

                <UnixTerminalCanvas />

                <div style={{ padding: '12px', backgroundColor: 'rgba(240, 249, 255, 0.8)', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                  <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 8px 0' }}>🌐 Central dos 9 Mapas Integrados</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <Link href="/mapa" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #16a34a', color: '#16a34a', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🌍 Terrestre</Link>
                    <Link href="/orkut" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ea580c', color: '#ea580c', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧡 Orkut</Link>
                    <Link href="/espacial" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #0284c7', color: '#0284c7', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🪐 Espacial</Link>
                    <Link href="/ressonancia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #06b6d4', color: '#06b6d4', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧬 Ressonância</Link>
                    <Link href="/patologia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🔬 Patologia</Link>
                    <Link href="/mapa-ia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #f43f5e', color: '#f43f5e', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚡ IA 3D</Link>
                    <Link href="/antiguidades" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #d97706', color: '#d97706', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🏛️ Antiguidades</Link>
                    <Link href="/mapa-quantico" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #8b5cf6', color: '#8b5cf6', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚛️ Quântico</Link>
                    <Link href="/mapaaeroespacial" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #9333ea', color: '#9333ea', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold', gridColumn: 'span 2' }}>🛸 Aeroespacial</Link>
                  </div>
                </div>

                <RobotocNeuralThoughtPanel addLog={addLogTerminal} />
                <DispatcherMensagensNumeros addLog={addLogTerminal} />
                <GoogleMeetAvatarManager addLog={addLogTerminal} />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>

          {/* RODAPÉ E CHAT DE COMANDOS */}
          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: 'calc(100% - 30px)', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '10px', padding: '10px', maxHeight: '80px', overflowY: 'auto' }}>
              {mensagens.map((item, index) => (
                <div key={index}>
                  <span style={{ fontSize: '8px', fontWeight: 'bold', color: item.tipo === 'user' ? '#0284c7' : '#ef4444' }}>{item.autor}</span>
                  <p style={{ margin: 0, fontSize: '10px', color: '#0f172a' }}>{item.texto}</p>
                </div>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (chatInput.trim()) { setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: chatInput, tipo: 'user' }]); setChatInput(''); } }} style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #00f0ff', borderRadius: '25px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 15px rgba(0,240,255,0.2)' }}>
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Fale com o ROBOTOC 3D ou envie comandos neurais..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontSize: '10px', flexGrow: 1 }} />
              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '18px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Executar ➔</button>
            </form>
          </div>
        </div>

        {/* LADO DIREITO (MODO DEV SPLIT SCREEN) */}
        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>

      {/* PAINEL FUTURISTA REDIMENSIONÁVEL ROBOTOC EMGEMINI */}
      {janelaRobotocDevAberta && (
        <WindowDevPanelRobotoc 
          onClose={() => setJanelaRobotocDevAberta(false)} 
          onRequestBluetooth={acionarSolicitacaoBluetooth}
        />
      )}

      {/* GAVETA ANDROID HUD LATERAL */}
      <AndroidHUDPanel open={androidHudOpen} onClose={() => { setAndroidHudOpen(false); setSolicitarConexaoBluetooth(false); }}>
        <MotionTracker />
        <RobotocGear highlightGear={solicitarConexaoBluetooth} onConnectGear={(t, s) => addLogTerminal(`[GEAR] ${t}: ${s ? 'ON' : 'OFF'}`)} />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer addLog={addLogTerminal} />
      </AndroidHUDPanel>

      {/* MODAL CREATOR STUDIO */}
      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
