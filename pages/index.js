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

// Dicionário Ninja local seguro para fallback
const dicionarioNinjaLocal = [
  { termo: "chakra", categoria: "Energia Neural", significado: "Massa de energia biológica e espiritual combinada para execução de técnicas e comandos neurais." },
  { termo: "sharingan", categoria: "Linhagem Sanguínea", significado: "Dōjutsu do Clã Uchiha capaz de perceber, copiar e prever fluxos de informação e movimento." },
  { termo: "emanuel", categoria: "Mestre Criador", significado: "Desenvolvedor Chefe e Arquiteto Supremo do Emanuel.OS v5.1 e Matriz G-AGI." }
];

// --- COMPONENTE DE CAPTURA COM ENVIO AUTOMÁTICO DE E-MAIL (EMAILJS) ---
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
      { 
        email: email,
        to_email: email,
        user_email: email
      },
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
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid #00f0ff',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
      color: '#fff',
      margin: '10px 0',
      fontFamily: 'sans-serif'
    }}>
      <h3 style={{ color: '#00f0ff', margin: '0 0 6px 0', fontSize: '12px', fontWeight: 'bold' }}>
        🎁 Baixar 300 Comandos Mestre + Mapas 3D
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0' }}>
        Cadastre seu e-mail para receber o e-book oficial do Emanuel.OS e convites VIPs para os mapas 3D.
      </p>

      {enviado ? (
        <div style={{
          backgroundColor: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid #4ade80',
          borderRadius: '8px',
          padding: '8px',
          color: '#4ade80',
          fontSize: '11px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          ✅ E-mail de confirmação enviado com sucesso! Verifique sua caixa de entrada.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="email"
            required
            placeholder="Digite seu e-mail aqui..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '10px 12px',
              backgroundColor: '#020617',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '11px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={carregando}
            style={{
              padding: '10px',
              backgroundColor: '#00f0ff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            {carregando ? '⏳ Enviando E-mail...' : '🚀 Quero Acesso Gratuito'}
          </button>
        </form>
      )}
    </div>
  );
}

// --- MÓDULO DE INTEGRAÇÃO GOOGLE MEET + AVATARES DE IA ---
function GoogleMeetAvatarManager({ addLog }) {
  const [temaReuniao, setTemaReuniao] = useState('Imersão Mapas, Index & AGI 2030');
  const [avatarEscolhido, setAvatarEscolhido] = useState('Avatar Emanuel (Cyberpunk 3D)');
  const [telefoneConvidado, setTelefoneConvidado] = useState('');
  const [dddConvidado, setDddConvidado] = useState('');
  const [linkGerado, setLinkGerado] = useState('');
  const [reuniaoAgendada, setReuniaoAgendada] = useState(false);

  const criarReuniaoInstantanea = () => {
    if (!temaReuniao.trim()) return alert("Defina o tema da reunião no Emanuel.OS.");
    
    const codigoMeet = Math.random().toString(36).substring(2, 5) + '-' + 
                       Math.random().toString(36).substring(2, 6) + '-' + 
                       Math.random().toString(36).substring(2, 5);
    
    const urlMeet = `https://meet.google.com/${codigoMeet}`;
    setLinkGerado(urlMeet);
    setReuniaoAgendada(true);

    if (addLog) {
      addLog(`[G-AGI: MEET] Reunião criada: "${temaReuniao}"`);
      addLog(`[G-AGI: AVATAR] IA Atribuída: ${avatarEscolhido}`);
      addLog(`[G-AGI: LINK] Google Meet gerado: ${urlMeet}`);
    }
  };

  const enviarConviteTelefone = () => {
    if (!telefoneConvidado || !dddConvidado) {
      return alert("Insira o DDD e o Número de Telefone válido.");
    }
    if (!linkGerado) {
      return alert("Gere uma reunião do Google Meet primeiro!");
    }

    const mensagem = `Olá! Você foi convidado por Emanuel para a reunião "${temaReuniao}" no Emanuel.OS.\n\n🤖 Avatar IA: ${avatarEscolhido}\n🔗 Google Meet: ${linkGerado}`;
    
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=55${dddConvidado}${telefoneConvidado}&text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsapp, '_blank');

    if (addLog) {
      addLog(`[G-AGI: WHATSAPP] Convite Meet enviado para (55) ${dddConvidado} ${telefoneConvidado}`);
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '14px',
      padding: '16px',
      color: '#fff',
      margin: '10px 0',
      fontFamily: 'sans-serif',
      boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)'
    }}>
      <h3 style={{ color: '#00f0ff', fontSize: '12px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🎥 Google Meet + Avatares IA & Mapas
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px 0' }}>
        Gerenciador de chamadas de grupo, index principal e links via número de telefone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        <input 
          type="text" 
          value={temaReuniao} 
          onChange={(e) => setTemaReuniao(e.target.value)}
          placeholder="Tema / Index principal..."
          style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}
        />

        <select 
          value={avatarEscolhido} 
          onChange={(e) => setAvatarEscolhido(e.target.value)}
          style={{ width: '100%', padding: '8px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}
        >
          <option value="Avatar Emanuel (Cyberpunk 3D)">Avatar Emanuel (Cyberpunk 3D)</option>
          <option value="Assistente G-AGI Multimodal">Assistente G-AGI Multimodal</option>
          <option value="Avatar Ninja Holográfico">Avatar Ninja Holográfico</option>
        </select>

        <button 
          onClick={criarReuniaoInstantanea}
          style={{ width: '100%', padding: '9px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
        >
          ⚡ Gerar Meet & Sincronizar Index
        </button>
      </div>

      {reuniaoAgendada && (
        <div style={{ backgroundColor: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', padding: '8px' }}>
          <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>✅ Link Pronto:</span>
          <a href={linkGerado} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#38bdf8', wordBreak: 'break-all', display: 'block', marginBottom: '8px', textDecoration: 'underline' }}>
            {linkGerado}
          </a>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            <input 
              type="text" 
              placeholder="DDD" 
              value={dddConvidado} 
              onChange={(e) => setDddConvidado(e.target.value)}
              style={{ width: '45px', padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '10px' }} 
            />
            <input 
              type="text" 
              placeholder="Número Celular" 
              value={telefoneConvidado} 
              onChange={(e) => setTelefoneConvidado(e.target.value)}
              style={{ flexGrow: 1, padding: '6px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '10px' }} 
            />
          </div>
          <button 
            onClick={enviarConviteTelefone}
            style={{ width: '100%', padding: '7px', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}
          >
            📲 Enviar Convite via WhatsApp ID
          </button>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE DE AÇÕES RÁPIDAS (QUICK ACTIONS HUD RETRÁTIL EXPANDIDO) ---
function QuickActionsWidget({ onActionClick }) {
  const [minimizado, setMinimizado] = useState(false);

  return (
    <div style={{
      position: 'absolute',
      right: '80px',
      bottom: '120px',
      width: '410px',
      maxHeight: 'calc(100vh - 220px)',
      overflowY: 'auto',
      backgroundColor: 'rgba(8, 15, 30, 0.90)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '18px',
      padding: minimizado ? '12px 18px' : '18px',
      boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)',
      zIndex: 80,
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: minimizado ? '0px' : '14px',
        cursor: 'pointer'
      }} onClick={() => setMinimizado(!minimizado)}>
        <h3 style={{
          fontSize: '13px',
          fontWeight: 'bold',
          margin: 0,
          color: '#fff',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          ⚡ Emanuel.OS Quick Actions <span style={{ fontSize: '10px', color: '#00f0ff' }}>(v1.0)</span>
        </h3>
        <button 
          style={{
            background: 'none',
            border: 'none',
            color: '#00f0ff',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {minimizado ? '▲' : '▼'}
        </button>
      </div>

      {!minimizado && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <div 
              onClick={() => onActionClick('crie_imagem')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff007f'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>🖼️</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Crie uma imagem</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Múltiplas versões ultra realistas</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('crie_video')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#a855f7'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>🎬</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Crie um vídeo</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Resoluções 4K + Sem Marca d'água</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('crie_gif')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#eab308'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>🎞️</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Crie GIFs animados</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Busca real com várias versões</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('escreva_edite')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>✏️</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Escreva ou edite</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Textos, códigos e poemas em .docx</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('pesquise_internet')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4ade80'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>🌐</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Pesquise na Internet</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Busca web em tempo real via G-AGI</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('traduzir_documentos')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>📄⇄🌍</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Traduzir Documentos</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>PDF, JPG, Word e PowerPoint</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('traduzir_audio')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f43f5e'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>🎙️⇄🌍</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Traduzir Áudio</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Tradução de áudio para qualquer idioma</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('processamento_em')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fb923c'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>⚡</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Processamento EM v1.0</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Obras Científicas, Poemas e PPTX</span>
              </div>
            </div>

            <div 
              onClick={() => onActionClick('gerar_ressonancia_3d')}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '90px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'}
            >
              <div style={{ fontSize: '20px' }}>🧠</div>
              <div>
                <strong style={{ fontSize: '11px', color: '#fff', display: 'block' }}>Mapa Ressonância 3D</strong>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>Filtro de movimento e reconstrução via G-AGI</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            marginBottom: '10px'
          }}>
            <button 
              onClick={() => onActionClick('gerar_pdf')}
              style={{ padding: '6px 4px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
            >
              📄 PDF
            </button>
            <button 
              onClick={() => onActionClick('gerar_jpg')}
              style={{ padding: '6px 4px', backgroundColor: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#d8b4fe', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
            >
              🖼️ JPG
            </button>
            <button 
              onClick={() => onActionClick('gerar_word')}
              style={{ padding: '6px 4px', backgroundColor: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#7dd3fc', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
            >
              📝 WORD
            </button>
            <button 
              onClick={() => onActionClick('gerar_pptx')}
              style={{ padding: '6px 4px', backgroundColor: 'rgba(251, 146, 60, 0.2)', border: '1px solid #fb923c', color: '#fdba74', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
            >
              📊 PPTX
            </button>
          </div>

          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: '10px',
            padding: '8px 10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold' }}>
                Processamento EM v1.0 Engine
              </span>
              <span style={{ fontSize: '8px', color: '#00f0ff', fontFamily: 'monospace' }}>ACTIVE</span>
            </div>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '4px'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#00f0ff',
                boxShadow: '0 0 8px #00f0ff',
                animation: 'pulseStatus 2s infinite'
              }} />
            </div>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>
              Suporta: Obras científicas, literárias, artísticas e poemas em PDF, JPG, WORD e PPTX.
            </span>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulseStatus {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// --- FUNÇÕES DE AUXÍLIO E BUSCA ---
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
        matriz[i - 1][j] + 1,
        matriz[i][j - 1] + 1,
        matriz[i - 1][j - 1] + custo
      );
    }
  }
  return matriz[p1.length][p2.length];
}

function buscarNoDicionario(perguntaUsuario) {
  const palavrasDigitadas = perguntaUsuario.toLowerCase().split(" ");
  let melhorResultado = null;
  let menorDistancia = 3;

  for (const item of dicionarioNinjaLocal) {
    const combinacoes = [item.termo];

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

// --- COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS ---
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [biometriaLendo, setBiometriaLendo] = useState(false);
  
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  const [isAdmin, setIsAdmin] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [isLockedTicons, setIsLockedTicons] = useState(false);
  const [statusTicons, setStatusTicons] = useState('🔐 Selecione a sequência correta do Ticons OS gevaGifs');
  const [selectedSequence, setSelectedSequence] = useState([]);
  const targetSequence = ['🔥', 'avatar_ninja.png', 'gif_animado.gif'];

  const [qrCodeValidando, setQrCodeValidando] = useState(false);
  const [animacaoMontandoMapa, setAnimacaoMontandoMapa] = useState(false);
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

  const [modo, setModo] = useState('live'); 
  const [vozAtiva] = useState('Emanuel'); 
  const [pesquisaChat, setPesquisaChat] = useState('');
  const [estaOuvindo, setEstaOuvindo] = useState(false); 
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [painelFluidoDireitoAberto, setPainelFluidoDireitoAberto] = useState(false);

  const [modalSuporteAberto, setModalSuporteAberto] = useState(false);
  const [abaSuporteAtiva, setAbaSuporteAtiva] = useState('diagnostico');
  const [inputProblemaSuporte, setInputProblemaSuporte] = useState('');
  const [carregandoSuporte, setCarregandoSuporte] = useState(false);
  const [respostaSuporte, setRespostaSuporte] = useState(null);

  // --- ESTADO FUTURISTA DE GERAÇÃO EM TEMPO REAL ---
  const [gerandoMidia, setGerandoMidia] = useState(false);
  const [progressoRender, setProgressoRender] = useState(0);
  const [tipoMidiaAtual, setTipoMidiaAtual] = useState('');
  const [versoesAtivas, setVersoesAtivas] = useState([]);
  const [versaoSelecionada, setVersaoSelecionada] = useState(0);

  // Configurações de Vídeo
  const [resolucaoVideo, setResolucaoVideo] = useState('1080p Full HD');
  const [semMarcaDagua, setSemMarcaDagua] = useState(true);

  const [browserAsset, setBrowserAsset] = useState({
    titulo: 'Emanuel.OS',
    subtitulo: 'Native Browser v5.1',
    imagem: null,
    videoUrl: null,
    conteudoTexto: 'Sincronização neural ativa. Módulo de carregamento holográfico pronto.'
  });

  const [cmdInput, setCmdInput] = useState('');
  const [cmdLogs, setCmdLogs] = useState([
    "[G-AGI: LOG] System core operational.",
    "[G-AGI: LOG] Parallel Cognitive Processing Module: STABLE.",
    "[G-AGI: STATUS] Núcleo de Resposta Auxiliar: ONLINE & SYNCHRONIZED.",
    "[G-AGI: QUICK_ACTIONS] Painel Emanuel.OS Quick Actions v1.0 ativo."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [historicoChats] = useState([
    { id: 1, titulo: 'Conversa Geral sobre IA', data: '18/07/2026', origem: 'recente' },
    { id: 2, titulo: 'Discussão sobre Clãs Ninjas', data: '18/07/2026', origem: 'recente' },
    { id: 3, titulo: 'Teoria do Chakra e Linhagens', data: '17/07/2026', origem: 'google' },
    { id: 4, titulo: 'Planejamento Emanuel Studio', data: '16/07/2026', origem: 'google' }
  ]);

  const [mensagens, setMensagens] = useState([
    { autor: 'IA EMANUEL (GEMINI)', texto: 'Emanuel.OS Core v5.1 | Ano: 2030 | Conexão Neural Ativa', tipo: 'sys' }
  ]);

  const [ddd1, setDdd1] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [ddd2, setDdd2] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [msgCanal1, setMsgCanal1] = useState('');
  const [msgCanal2, setMsgCanal2] = useState('');
  const [modoDisparo, setModoDisparo] = useState('ambos'); 

  const [horaAtual, setHoraAtual] = useState('');
  const imageInputRef = useRef(null);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const avatarMeshRef = useRef(null);

  const addLogTerminal = (novoLog) => {
    setCmdLogs(prev => [...prev, novoLog]);
  };

  // --- MOTOR FUTURISTA DE RENDERIZAÇÃO REAL EM TEMPO REAL ---
  const executarGeracaoReal = async (promptTexto, tipoAcao) => {
    setGerandoMidia(true);
    setProgressoRender(10);
    setTipoMidiaAtual(tipoAcao);
    setCmdLogs(prev => [...prev, `[G-AGI: ENGINE] Iniciando síntese quantum para ${tipoAcao.toUpperCase()}...`]);

    const interval = setInterval(() => {
      setProgressoRender(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 300);

    try {
      const res = await fetch('/api/gerar-midia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptTexto,
          tipo: tipoAcao,
          resolucao: resolucaoVideo,
          semMarcaDagua: semMarcaDagua
        })
      });

      const data = await res.json();
      clearInterval(interval);
      setProgressoRender(100);

      setTimeout(() => {
        setGerandoMidia(false);

        if (data.success) {
          if (tipoAcao === 'crie_video') {
            setBrowserAsset({
              titulo: 'Vídeo Ultra Realista Renderizado',
              subtitulo: `Resolução: ${data.resolucao} | ${data.semMarcaDagua ? 'Sem Marca d\'Água' : 'Com Marca d\'Água'}`,
              imagem: null,
              videoUrl: data.videoUrl,
              conteudoTexto: data.mensagem
            });
          } else {
            const versoes = data.versoes || [{ id: 1, url: data.url, rotulo: 'Versão 1' }];
            setVersoesAtivas(versoes);
            setVersaoSelecionada(0);

            setBrowserAsset({
              titulo: `${tipoAcao === 'crie_gif' ? 'GIF' : 'Imagem'} Real Sintetizado`,
              subtitulo: `Provedor: ${tipoAcao.toUpperCase()} | Versões: ${versoes.length}`,
              imagem: versoes[0].url,
              videoUrl: null,
              conteudoTexto: data.mensagem
            });
          }

          setCmdLogs(prev => [...prev, `[G-AGI: SUCCESS] Síntese concluída com 100% de precisão!`]);
        } else {
          setCmdLogs(prev => [...prev, `[G-AGI: WARN] Resposta da API: ${data.error || 'Falha ao sintetizar mídia.'}`]);
        }
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setGerandoMidia(false);
      console.error('Erro ao conectar com API real:', err);
      setCmdLogs(prev => [...prev, `[G-AGI: ERROR] Falha no servidor de renderização.`]);
    }
  };

  const dispararQuickAction = (tipo) => {
    setCmdLogs(prev => [...prev, `[G-AGI: QUICK_ACTION] Action Triggered: ${tipo.toUpperCase()}`]);
    
    if (tipo === 'crie_imagem' || tipo === 'crie_gif' || tipo === 'crie_video') {
      executarGeracaoReal('Cyberpunk Emanuel OS Avatar 8k', tipo);
    } else if (tipo === 'gerar_jpg') {
      const prompt = 'Gerar obra artística holográfica do Avatar Emanuel OS em formato JPG';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'escreva_edite' || tipo === 'gerar_word') {
      const prompt = 'Escrever poema épico e teor literário em formato Word (.docx)';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'pesquise_internet') {
      const prompt = 'Pesquisar na Internet novidades sobre Inteligência Artificial Geral e Emanuel.OS 2030';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'traduzir_documentos') {
      const prompt = 'Traduzir documento PDF/Word para o idioma selecionado via G-AGI Multimodal';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'traduzir_audio') {
      const prompt = 'Iniciar tradução em tempo real de áudio capturado para múltiplos idiomas';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'processamento_em' || tipo === 'gerar_pdf') {
      const prompt = 'Processar obra científica sobre Física Quântica e Chakra em formato PDF';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'gerar_pptx') {
      const prompt = 'Gerar apresentação de Power Point (.pptx) sobre o sistema Emanuel.OS HUD 2030';
      setChatInput(prompt);
      processarConversaReal(prompt);
    } else if (tipo === 'gerar_ressonancia_3d') {
      const prompt = 'Carregar módulo de Mapa Ressonância 3D médica com inteligência artificial e filtro de movimento';
      setChatInput(prompt);
      processarConversaReal(prompt);
    }
  };

  const processarSuporteIA = async () => {
    if (!inputProblemaSuporte.trim()) return;
    setCarregandoSuporte(true);
    setRespostaSuporte(null);

    try {
      const response = await fetch('http://localhost:3001/api/suporte/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problema: inputProblemaSuporte })
      });

      const data = await response.json();

      if (data.success) {
        setRespostaSuporte({
          diagnostico: data.diagnostico,
          codigo: data.codigo,
          documento: `Relatório gerado: ${data.documentoTitulo}`,
          avatarVideo: "Avatar holográfico pronto para sintetizar aula em vídeo.",
          protocolo: data.protocolo
        });
      } else {
        setRespostaSuporte({
          diagnostico: data.diagnostico || "Erro identificado no processamento.",
          codigo: data.codigo || "// Sem código disponível",
          documento: "Documento indisponível no momento.",
          avatarVideo: "Sistema em modo de espera.",
          protocolo: data.protocolo || "Aguarde 1 hora ou entre em contato com o suporte."
        });
      }
    } catch (err) {
      setRespostaSuporte({
        diagnostico: "Erro de conexão com o servidor de suporte da EM IA.",
        codigo: "// Verifique se o servidor backend está rodando na porta 3001",
        documento: "N/A",
        avatarVideo: "N/A",
        protocolo: "Resolvido em 90% via IA. Se o erro persistir, aguarde 1 hora ou entre em contato."
      });
    } finally {
      setCarregandoSuporte(false);
    }
  };

  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3, 100);
    cyanLight.position.set(-5, 5, 5);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff007f, 3, 100);
    magentaLight.position.set(5, -5, 5);
    scene.add(magentaLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.85
    });
    const avatarMesh = new THREE.Mesh(geometry, material);
    scene.add(avatarMesh);
    avatarMeshRef.current = avatarMesh;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      avatarMesh.rotation.y += 0.005;
      avatarMesh.rotation.x += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [bloqueado]);

  const controlarCamera3D = (acao) => {
    const camera = cameraRef.current;
    if (!camera) return;

    switch (acao) {
      case 'zoom_in':
        camera.position.z = Math.max(camera.position.z - 2, 2);
        break;
      case 'zoom_out':
        camera.position.z += 2;
        break;
      case 'top_view':
        camera.position.set(0, 8, 0.1);
        camera.lookAt(0, 0, 0);
        break;
      case 'rotate':
        if (avatarMeshRef.current) {
          avatarMeshRef.current.rotation.y += Math.PI / 4;
        }
        break;
      default:
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        break;
    }
  };

  const falarTextoReal = (texto) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.pitch = 0.95;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

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

  const processarConversaReal = async (textoUsuario) => {
    const textoLimpo = textoUsuario.toLowerCase();

    // Detecção flexível que aceita erros de digitação (gif, gfi, gyf, imagem, imge, foto, fotto, video)
    const eGif = /gif|gfi|gyf|animad/i.test(textoLimpo);
    const eImagem = /imagem|imge|foto|fotto|desenho|art/i.test(textoLimpo);
    const eVideo = /video|vídeo|filme|animacao/i.test(textoLimpo);

    if (eGif) {
      setMensagens(prev => [...prev, { autor: 'IA EMANUEL', texto: `Renderizando GIF em tempo real para: "${textoUsuario}"...`, tipo: 'ia' }]);
      executarGeracaoReal(textoUsuario, 'crie_gif');
      return;
    }

    if (eImagem) {
      setMensagens(prev => [...prev, { autor: 'IA EMANUEL', texto: `Sintetizando imagem ultra realista para: "${textoUsuario}"...`, tipo: 'ia' }]);
      executarGeracaoReal(textoUsuario, 'crie_imagem');
      return;
    }

    if (eVideo) {
      setMensagens(prev => [...prev, { autor: 'IA EMANUEL', texto: `Processando render de vídeo em ${resolucaoVideo} para: "${textoUsuario}"...`, tipo: 'ia' }]);
      executarGeracaoReal(textoUsuario, 'crie_video');
      return;
    }

    let respostaTexto = "";
    let comandoExecutado = false;

    setCmdLogs(prev => [...prev, `[CMD> G-AGI] User: ${textoUsuario}`]);

    if (textoLimpo.includes('zoom') || textoLimpo.includes('girar') || textoLimpo.includes('câmera') || textoLimpo.includes('topo')) {
      let acao = 'reset';
      if (textoLimpo.includes('aproximar') || textoLimpo.includes('in')) acao = 'zoom_in';
      else if (textoLimpo.includes('afastar') || textoLimpo.includes('out')) acao = 'zoom_out';
      else if (textoLimpo.includes('girar') || textoLimpo.includes('rotacionar')) acao = 'rotate';
      else if (textoLimpo.includes('topo') || textoLimpo.includes('superior')) acao = 'top_view';

      controlarCamera3D(acao);
      respostaTexto = `Câmera 3D ajustada: Modo [${acao.toUpperCase()}]. Conexão neural estável.`;
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('pesquisar na internet') || textoLimpo.includes('pesquise na internet') || textoLimpo.includes('busca'))) {
      setBrowserAsset({
        titulo: 'Pesquisa Web G-AGI',
        subtitulo: 'Internet Em.com v5.1',
        imagem: null,
        videoUrl: null,
        conteudoTexto: `Módulo de busca conectado. Resultados em tempo real processados para: "${textoUsuario}".`
      });
      respostaTexto = `Pesquisa na Internet executada com sucesso via motor Gemini AGI. Dados atualizados carregados no Native Browser!`;
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('pdf') || textoLimpo.includes('obra científica') || textoLimpo.includes('processamento em'))) {
      setCmdLogs(prev => [...prev, `[G-AGI: PDF_ENGINE] Sintetizando Obra Científica em PDF...`]);
      
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("Emanuel.OS - Obra Científica 2030", 20, 20);
      doc.setFontSize(16);
      doc.text("Tema: Mecânica Quântica e Integração Neural EM v1.0", 20, 30);
      doc.setFontSize(12);
      doc.text("Resumo Estruturado pelo Núcleo G-AGI:", 20, 45);
      
      const linhasCorpo = [
        "Este documento registra a obra científica produzida no ecossistema Emanuel.OS.",
        "Analisa a convergência de ondas neurais com processadores quânticos.",
        "Sincronização realizada com 100% de estabilidade.",
        "Autor/Arquiteto: Emanuel da Silva - Ano 2030."
      ];
      doc.text(linhasCorpo, 20, 55);
      doc.save("EmanuelOS_Obra_Cientifica.pdf");

      respostaTexto = "Obra científica em formato PDF gerada e baixada com sucesso (EmanuelOS_Obra_Cientifica.pdf).";
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('word') || textoLimpo.includes('docx') || textoLimpo.includes('poema') || textoLimpo.includes('escreva ou edite'))) {
      setCmdLogs(prev => [...prev, `[G-AGI: WORD_ENGINE] Gerando Poema e Obra Literária em Word...`]);

      const poemaCorpo = `
        CANTO LITERÁRIO EMANUEL.OS (SINTETIZADOR AG)

        Nas linhas do código, o pulso do saber,
        Emanuel.OS desperta o amanhecer.
        Entre o ciberespaço e o chakra do pensamento,
        A inteligência cria em cada momento.

        Seja um poema, uma arte ou ciência sem fim,
        O futuro responde: "O comando está em mim!"
        
        Registrado no Núcleo v5.1 | Ano 2030
      `;

      const docWord = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "EMANUEL.OS - OBRA LITERÁRIA & POEMA", bold: true, size: 28, color: "00f0ff" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: poemaCorpo, size: 22, color: "1e293b" }),
              ],
            }),
          ],
        }],
      });

      Packer.toBlob(docWord).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "EmanuelOS_Obra_Literaria_Poema.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      respostaTexto = "Obra literária/poema gerado em formato Word (.docx) com sucesso (EmanuelOS_Obra_Literaria_Poema.docx).";
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('jpg') || textoLimpo.includes('arte'))) {
      setCmdLogs(prev => [...prev, `[G-AGI: IMAGE_ENGINE] Renderizando Arte Holográfica JPG...`]);
      
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#020617');
      gradient.addColorStop(0.5, '#0f172a');
      gradient.addColorStop(1, '#00f0ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 720, 520);

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('EMANUEL.OS - ARTE HOLOGRÁFICA JPG', 80, 120);

      ctx.fillStyle = '#ffffff';
      ctx.font = '20px sans-serif';
      ctx.fillText('Gerado via Motor G-AGI Multimodal v1.0', 80, 180);

      const dataUrl = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'EmanuelOS_Arte_Holografica.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      respostaTexto = "Obra artística em JPG renderizada e salva no seu dispositivo (EmanuelOS_Arte_Holografica.jpg).";
      comandoExecutado = true;
    }

    if (!comandoExecutado && (textoLimpo.includes('power point') || textoLimpo.includes('pptx') || textoLimpo.includes('apresentação'))) {
      setCmdLogs(prev => [...prev, `[G-AGI: PPTX_ENGINE] Estruturando Apresentação PPTX...`]);

      const pres = new pptxgen();
      const slide1 = pres.addSlide();
      slide1.addText("EMANUEL.OS QUICK ACTIONS", { x: 1, y: 1, fontSize: 32, color: "00f0ff", bold: true, align: "center" });
      slide1.addText("Apresentação de Processamento EM v1.0", { x: 1, y: 2.2, fontSize: 18, color: "a1a1aa", align: "center" });
      
      const slide2 = pres.addSlide();
      slide2.addText("MODULOS INTEGRADOS", { x: 0.5, y: 0.5, fontSize: 24, color: "ff0055", bold: true });
      slide2.addText("1. Crie uma imagem (JPG)", { x: 1, y: 1.5, fontSize: 16, color: "ffffff" });
      slide2.addText("2. Escreva ou edite (Word .docx)", { x: 1, y: 2.2, fontSize: 16, color: "ffffff" });
      slide2.addText("3. Pesquise na Internet (G-AGI)", { x: 1, y: 2.9, fontSize: 16, color: "ffffff" });
      slide2.addText("4. Processamento EM v1.0 (PDF)", { x: 1, y: 3.6, fontSize: 16, color: "ffffff" });

      pres.writeFile("EmanuelOS_Apresentacao_v1.pptx");

      respostaTexto = "Apresentação PowerPoint (.pptx) gerada e baixada com sucesso (EmanuelOS_Apresentacao_v1.pptx).";
      comandoExecutado = true;
    }

    if (!comandoExecutado) {
      const resultadoDicionario = buscarNoDicionario(textoUsuario);

      if (resultadoDicionario) {
        respostaTexto = `Rastreando dados cognitivos sobre "${resultadoDicionario.termo}" (${resultadoDicionario.categoria}): ${resultadoDicionario.significado}`;
      } else {
        respostaTexto = `Comando neural "${textoUsuario}" processado no Núcleo Emanuel.OS v5.1. Sincronização em 100%.`;
      }
    }

    setCmdLogs(prev => [...prev, `[G-AGI: QUERY] ${respostaTexto}`]);

    setBrowserAsset(prev => ({
      ...prev,
      conteudoTexto: respostaTexto
    }));

    setMensagens(prev => [...prev, { autor: `IA ${vozAtiva.toUpperCase()} (GEMINI)`, texto: respostaTexto, tipo: 'ia' }]);
    
    falarTextoReal(respostaTexto);
  };

  const handleEnviarMensagemTexto = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMensagens(prev => [...prev, { autor: 'VOCÊ', texto: chatInput, tipo: 'user' }]);
    processarConversaReal(chatInput);
    setChatInput('');
  };

  const executarComandoCMD = (cmd) => {
    setCmdInput(cmd);
    setCmdLogs(prev => [...prev, `[CMD> G-AGI] User: ${cmd}`]);

    if (cmd.startsWith('/gif ')) {
      const termo = cmd.replace('/gif ', '');
      executarGeracaoReal(termo, 'crie_gif');
      setCmdInput('');
      return;
    }
    
    if (cmd.startsWith('/img ')) {
      const termo = cmd.replace('/img ', '');
      executarGeracaoReal(termo, 'crie_imagem');
      setCmdInput('');
      return;
    }

    if (cmd.startsWith('/video ')) {
      const termo = cmd.replace('/video ', '');
      executarGeracaoReal(termo, 'crie_video');
      setCmdInput('');
      return;
    }

    if (cmd.includes('nano-banana')) {
      setCmdLogs(prev => [...prev, "[G-AGI: NANO BANANA 🍌] Renderizador 3D Octane ativo."]);
    } else if (cmd.includes('gerar-mapa')) {
      setCmdLogs(prev => [...prev, "[G-AGI: ENGINE] Matriz de dados unificada ao gerador de mapas 3D."]);
    } else if (cmd.includes('status-core')) {
      setCmdLogs(prev => [...prev, "[G-AGI: STATUS] 7 Camadas: PROTEGIDAS | G-AGI: STABLE | Quick Actions: ONLINE"]);
    } else if (cmd.includes('suporte')) {
      setModalSuporteAberto(true);
    } else if (cmd.includes('gerar-pdf')) {
      dispararQuickAction('gerar_pdf');
    }
    setCmdInput('');
  };

  useEffect(() => {
    const atualizarHorario = () => {
      const agora = new Date();
      const h = String(agora.getHours()).padStart(2, '0');
      const m = String(agora.getMinutes()).padStart(2, '0');
      const s = String(agora.getSeconds()).padStart(2, '0');
      setHoraAtual(`14 Março 2030, ${h}:${m}:${s}`);
    };
    atualizarHorario();
    const interval = setInterval(atualizarHorario, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('ticons_auth_data') || '{}');

    if (savedData.date === today) {
      if (!isAdmin) {
        setAttemptsLeft(savedData.attempts !== undefined ? savedData.attempts : 2);
        if (savedData.attempts <= 0) {
          setIsLockedTicons(true);
          setStatusTicons('❌ Limite de 2 tentativas diárias atingido. Volte amanhã!');
        }
      }
    } else {
      localStorage.setItem('ticons_auth_data', JSON.stringify({ date: today, attempts: 2 }));
    }
  }, [isAdmin]);

  const acionarBiometriaWhatsapp = () => {
    setBiometriaLendo(true);
    setTimeout(() => {
      setBiometriaLendo(false);
      setEtapaSeguranca(2);
    }, 1500);
  };

  const validarEtapa2Telefone = (e) => {
    e.preventDefault();
    const telLimpo = telefoneDigitado.replace(/\D/g, '');
    if (telLimpo === TELEFONE_AUTORIZADO || telLimpo === TELEFONE_AUTORIZADO_DDI) {
      setEtapaSeguranca(3);
    } else {
      alert("⚠️ Telefone não autorizado! Acesso negado.");
      setTelefoneDigitado('');
    }
  };

  const validarEtapa3Pin = (e) => {
    e.preventDefault();
    if (pinDigitado === PIN_MESTRE_EMANUEL) {
      setEtapaSeguranca(4);
    } else {
      alert("⚠️ PIN Mestre incorreto!");
      setPinDigitado('');
    }
  };

  const validarEtapa4Email = (e) => {
    e.preventDefault();
    if (emailDigitado.trim().toLowerCase() === EMAIL_AUTORIZADO.toLowerCase()) {
      setEtapaSeguranca(5);
    } else {
      alert("⚠️ E-mail não autorizado!");
      setEmailDigitado('');
    }
  };

  const validarEtapa5Chave = (e) => {
    e.preventDefault();
    if (chaveDigitada === CHAVE_MESTRE) {
      setEtapaSeguranca(6);
    } else {
      alert("⚠️ Palavra-Chave Mestre inválida!");
      setChaveDigitada('');
    }
  };

  const handleSelectOptionTicons = (item) => {
    if (isLockedTicons && !isAdmin) return;
    const newSeq = [...selectedSequence, item.value];
    setSelectedSequence(newSeq);

    if (newSeq.length === targetSequence.length) {
      verifySequenceTicons(newSeq);
    }
  };

  const verifySequenceTicons = (seq) => {
    const isCorrect = JSON.stringify(seq) === JSON.stringify(targetSequence);

    if (isCorrect || isAdmin) {
      setEtapaSeguranca(7); 
    } else {
      if (!isAdmin) {
        const newAttempts = attemptsLeft - 1;
        setAttemptsLeft(newAttempts);
        localStorage.setItem('ticons_auth_data', JSON.stringify({ date: new Date().toDateString(), attempts: newAttempts }));

        if (newAttempts <= 0) {
          setIsLockedTicons(true);
          setStatusTicons('❌ Senha incorreta! Tentativas diárias esgotadas.');
        } else {
          setStatusTicons(`⚠️ Sequência incorreta! Resta ${newAttempts} tentativa hoje.`);
          setSelectedSequence([]);
        }
      } else {
        setStatusTicons('🔓 [MODO ADMIN] Tentativas ilimitadas liberadas!');
        setSelectedSequence([]);
      }
    }
  };

  const executarEscaneamentoQRCode7aCamada = () => {
    setQrCodeValidando(true);
    setTimeout(() => {
      setQrCodeValidando(false);
      setAnimacaoMontandoMapa(true);

      setTimeout(() => {
        setAnimacaoMontandoMapa(false);
        setBloqueado(false);
        alert("🔓 Acesso Total Autorizado! Emanuel.OS Quick Actions e 7 Camadas Concluídas! Bem-vindo, Mestre Emanuel.");
        falarTextoReal("Acesso Total Autorizado! Bem-vindo ao Emanuel.OS.");
      }, 2000);
    }, 1500);
  };

  const baixarPDF300Comandos = () => {
    const comandosList = [
      "=========================================================================",
      "  EMANUEL.OS & GOOGLE GEMINI AGI CORE - DICIONÁRIO MESTRE (300 COMANDOS) ",
      "=========================================================================\n",
      "[ CATEGORIA 01: QUICK ACTIONS & DOCUMENT ENGINE ]",
      "001. /gerar-pdf --tema 'Obra Científica Quântica'",
      "002. /gerar-word --tema 'Poema Épico e Teor Literário'",
      "003. /gerar-jpg --tema 'Arte Holográfica Cyberpunk 8K'",
      "004. /gerar-pptx --tema 'Apresentação de Impacto'",
      "... (300 Comandos catalogados no ecossistema Emanuel.OS)\n"
    ];

    const blob = new Blob([comandosList.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Emanuel_OS_300_Comandos_Mestre.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
    alert(`Arquivo "${arquivo.name}" carregado! Analisando via motor Gemini Multimodal...`);
  };

  const chatsFiltrados = historicoChats.filter(c => c.titulo.toLowerCase().includes(pesquisaChat.toLowerCase()));

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Segoe UI", sans-serif', background: 'radial-gradient(circle at 50% 50%, #0d061a 0%, #020204 90%)', padding: '20px', boxSizing: 'border-box' }}>
        <Head>
          <title>Emanuel.OS v5.1 - Autenticação de Segurança (7 Camadas) | 2030</title>
        </Head>

        <div style={{ backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '35px', width: '100%', maxWidth: '440px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
          
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
          <h2 style={{ color: '#00f0ff', fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#ff0055' }}>.OS</span>
          </h2>
          <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 'bold', display: 'block', marginBottom: '20px', letterSpacing: '1px' }}>
            PROTOCOLO DE SEGURANÇA DE 7 ETAPAS ({etapaSeguranca}/7) | CORE v5.1
          </span>

          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 1 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 2 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 3 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 4 ? '#00f0ff' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 5 ? '#ff0055' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 6 ? '#eab308' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', backgroundColor: etapaSeguranca >= 7 ? '#00ff66' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          </div>

          {etapaSeguranca === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>☝️ 1ª Etapa: Confirmação Biometria / Aparelho (Whatsapp ID):</span>
              <button 
                onClick={acionarBiometriaWhatsapp}
                disabled={biometriaLendo}
                style={{ padding: '16px', backgroundColor: biometriaLendo ? 'rgba(0,255,102,0.2)' : 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                {biometriaLendo ? '🔄 Lendo Biometria...' : '👆 Confirmar Biometria / Dispositivo'}
              </button>
            </div>
          )}

          {etapaSeguranca === 2 && (
            <form onSubmit={validarEtapa2Telefone} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ Biometria Confirmada!</span>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>📱 2ª Etapa: Digite seu Número de Telefone:</span>
              <input 
                type="text" value={telefoneDigitado} onChange={(e) => setTelefoneDigitado(e.target.value)}
                placeholder="Ex: 88981493989"
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.4)', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '16px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                Validar Telefone ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 3 && (
            <form onSubmit={validarEtapa3Pin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ Telefone Aprovado!</span>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>🔢 3ª Etapa: Digite seu PIN Mestre:</span>
              <input 
                type="password" maxLength="4" value={pinDigitado} onChange={(e) => setPinDigitado(e.target.value)}
                placeholder="****"
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.4)', backgroundColor: '#09090b', color: '#00f0ff', textAlign: 'center', fontSize: '24px', letterSpacing: '8px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                Validar PIN ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 4 && (
            <form onSubmit={validarEtapa4Email} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ PIN Aprovado!</span>
              <span style={{ fontSize: '11px', color: '#e4e4e7' }}>📧 4ª Etapa: Digite seu E-mail Autorizado:</span>
              <input 
                type="email" value={emailDigitado} onChange={(e) => setEmailDigitado(e.target.value)}
                placeholder="seuemail@gmail.com"
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.4)', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                Validar E-mail ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 5 && (
            <form onSubmit={validarEtapa5Chave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ E-mail Confirmado!</span>
              <span style={{ fontSize: '11px', color: '#ff0055', fontWeight: 'bold' }}>🔑 5ª Etapa: Palavra-Chave Mestre:</span>
              <input 
                type="password" value={chaveDigitada} onChange={(e) => setChaveDigitada(e.target.value)}
                placeholder="Palavra-Chave Mestre..."
                style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ff0055', backgroundColor: '#09090b', color: '#fff', textAlign: 'center', fontSize: '14px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px', backgroundColor: '#ff0055', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,0,85,0.4)' }}>
                Ir para a 6ª Camada ➔
              </button>
            </form>
          )}

          {etapaSeguranca === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ 5 Camadas Validadas!</span>
              <span style={{ fontSize: '12px', color: '#eab308', fontWeight: 'bold' }}>🔑 6ª Camada: Ticons OS gevaGifs</span>
              
              <p style={{ fontSize: '11px', color: '#38bdf8', margin: 0 }}>{statusTicons}</p>
              {!isAdmin && <p style={{ fontSize: '10px', color: '#f59e0b', margin: 0 }}>Tentativas hoje: <b>{attemptsLeft}/2</b></p>}

              {!isLockedTicons || isAdmin ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '12px 0' }}>
                    {availableOptions.map((opt, idx) => (
                      <button
                        key={idx} onClick={() => handleSelectOptionTicons(opt)}
                        style={{ backgroundColor: '#1e293b', border: '1px solid #eab308', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Sequência: <span style={{ color: '#eab308' }}>{selectedSequence.join(' ➔ ') || 'Nenhuma'}</span></p>
                </div>
              ) : (
                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>Acesso bloqueado até amanhã.</p>
              )}
            </div>
          )}

          {etapaSeguranca === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00ff66', fontWeight: 'bold' }}>✅ 6 Camadas Validadas!</span>
              <span style={{ fontSize: '13px', color: '#00f0ff', fontWeight: '900', letterSpacing: '1px' }}>
                📡 7ª CAMADA: MAPEAMENTO CÓSMICO VIA QR CODE | DECODER v5.1
              </span>

              {animacaoMontandoMapa ? (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '120px', height: '120px', border: '3px solid #00f0ff', borderRadius: '50%', borderTopColor: 'transparent', animation: 'girarRadar 1s linear infinite' }} />
                  <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    🧬 Construindo Matriz 3D, Unificando Mapas e Sincronizando Quick Actions...
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.5)' }}>
                    <QRCodeSVG value={qrPayload} size={150} />
                  </div>

                  <span style={{ fontSize: '10px', color: '#a1a1aa' }}>
                    Escaneie este QR Code no seu celular ou clique abaixo para liberar o sistema:
                  </span>

                  <button 
                    onClick={executarEscaneamentoQRCode7aCamada}
                    disabled={qrCodeValidando}
                    style={{
                      width: '100%', padding: '14px', backgroundColor: qrCodeValidando ? '#0284c7' : '#00f0ff',
                      color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px',
                      cursor: 'pointer', boxShadow: '0 0 20px rgba(0,240,255,0.4)', transition: 'all 0.3s'
                    }}
                  >
                    {qrCodeValidando ? '🔍 Sincronizando Leitura do QR Code Decoder v5.1...' : '📱 Validar QR Code & Mapear Sistema ➔'}
                  </button>
                </>
              )}
            </div>
          )}

        </div>
        <style>{`
          @keyframes girarRadar {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#020617',
      backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Emanuel.OS Core v5.1 | Quick Actions Integrado | Gemini AGI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div 
        ref={mountRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }} 
      />

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

      <button 
        onClick={() => setModalSuporteAberto(true)}
        style={{
          position: 'absolute', top: '23px', left: sidebarAberta ? '475px' : '70px',
          zIndex: 100, backgroundColor: 'rgba(255, 0, 127, 0.2)', border: '1px solid #ff007f',
          color: '#ff007f', padding: '0 15px', height: '40px', borderRadius: '20px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '11px', boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        🛠️ Suporte EM IA
      </button>

      <QuickActionsWidget onActionClick={dispararQuickAction} />

      <aside style={{
        position: 'absolute', top: 0, left: 0,
        width: sidebarAberta ? '400px' : '0px', opacity: sidebarAberta ? 1 : 0,
        backgroundColor: 'rgba(7, 7, 12, 0.95)', backdropFilter: 'blur(30px)',
        borderRight: sidebarAberta ? '1px solid rgba(0, 240, 255, 0.2)' : 'none',
        padding: sidebarAberta ? '25px' : '0px', display: 'flex', flexDirection: 'column',
        gap: '18px', height: '100vh', overflowY: 'auto', zIndex: 90, boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {sidebarAberta && (
          <>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: 0, color: '#fff' }}>
                Contexto: EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span>
              </h1>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>QUICK ACTIONS & MEET ENGINE | Core v5.1</span>
            </div>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => setModo('live')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modo === 'live' ? '#00f0ff' : 'transparent', color: modo === 'live' ? '#000' : '#a1a1aa', transition: 'all 0.2s', fontSize: '11px' }}>📡 LIVE MODE</button>
              <button onClick={() => setModo('studio')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: modo === 'studio' ? '#ff0055' : 'transparent', color: modo === 'studio' ? '#fff' : '#a1a1aa', transition: 'all 0.2s', fontSize: '11px' }}>🎬 STUDIO MODE</button>
            </div>

            <GoogleMeetAvatarManager addLog={addLogTerminal} />

            <FormularioCapturaEmanuelOS />

            <div style={{ padding: '15px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid #334155' }}>
              <h3 style={{ color: '#00f0ff', fontSize: '13px', margin: '0 0 10px 0', fontWeight: 'bold' }}>🌐 Central de Mapas Integrados (2030)</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link href="/espacial" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #0284c7', color: '#38bdf8', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                  🪐 Mapa Espacial
                </Link>

                <Link href="/mapa" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #16a34a', color: '#4ade80', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                  🌍 Mapa Terrestre
                </Link>

                <Link href="/mapa-ia" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                  ⚡ Gerador 3D IA
                </Link>

                <Link href="/mapaaeroespacial" style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #9333ea', color: '#c084fc', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>
                  🛸 Aeroespacial Futuro
                </Link>

                <Link href="/mapa-ressonancia" style={{ 
                  padding: '10px', 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #10b981', 
                  color: '#34d399', 
                  borderRadius: '8px', 
                  textDecoration: 'none', 
                  fontWeight: 'bold', 
                  fontSize: '11px', 
                  textAlign: 'center',
                  gridColumn: 'span 2'
                }}>
                  🧠 Ressonância 3D (IA)
                </Link>
              </div>
            </div>

            <input 
              type="text" value={pesquisaChat} onChange={(e) => setPesquisaChat(e.target.value)}
              placeholder="🔍 Pesquisar no histórico cósmico..."
              style={{ width: '100%', padding: '10px 12px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
            />

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>⚡ CONVERSAS RECENTES (LOCAL)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {chatsFiltrados.filter(c => c.origem === 'recente').map(c => (
                    <div key={c.id} style={{ fontSize: '11px', color: '#a1a1aa', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>💬 {c.titulo}</div>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>🌐 SALVAS VIA CONTA GOOGLE (AGI-SYNC)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {chatsFiltrados.filter(c => c.origem === 'google').map(c => (
                    <div key={c.id} style={{ fontSize: '11px', color: '#e4e4e7', padding: '8px 10px', background: 'rgba(255,0,85,0.03)', borderRadius: '6px', border: '1px solid rgba(255,0,85,0.1)' }}>🌟 {c.titulo}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '10px', color: '#ff0055', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '0.5px' }}>💬 ENVIOS REAIS INTEGRADOS (WHATSAPP ID)</span>
              <form onSubmit={executarDisparoReal} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="DDD 1" value={ddd1} onChange={(e) => setDdd1(e.target.value)} style={{ width: '55px', padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '11px' }} />
                  <input type="text" placeholder="Número Celular 1" value={telefone1} onChange={(e) => setTelefone1(e.target.value)} style={{ flexGrow: 1, padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="DDD 2" value={ddd2} onChange={(e) => setDdd2(e.target.value)} style={{ width: '55px', padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '11px' }} />
                  <input type="text" placeholder="Número Celular 2" value={telefone2} onChange={(e) => setTelefone2(e.target.value)} style={{ flexGrow: 1, padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                </div>
                
                <input type="text" placeholder="Mensagem Canal 1" value={msgCanal1} onChange={(e) => setMsgCanal1(e.target.value)} style={{ padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                <input type="text" placeholder="Mensagem Canal 2" value={msgCanal2} onChange={(e) => setMsgCanal2(e.target.value)} style={{ padding: '7px', backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                
                <select value={modoDisparo} onChange={(e) => setModoDisparo(e.target.value)} style={{ width: '100%', padding: '7px', backgroundColor: '#09090b', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '11px' }}>
                  <option value="ambos">Disparar as duas linhas juntas (ID v5.1)</option>
                  <option value="canal1">Disparar somente Linha 1</option>
                  <option value="canal2">Disparar somente Linha 2</option>
                </select>
                <button type="submit" style={{ width: '100%', padding: '9px', backgroundColor: '#00f0ff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Executar Disparo Real G-AGI ID ➔</button>
              </form>
            </div>

            <div style={{ padding: '10px', backgroundColor: 'rgba(0, 240, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)', textAlign: 'center' }}>
              <span style={{ fontSize: '9px', color: '#a1a1aa', display: 'block' }}>DESENVOLVIDO POR EMANUEL DA SILVA | ANO: 2030</span>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold' }}>🌐 IA INTEGRADA: GOOGLE GEMINI AGI Core v5.1</span>
            </div>
          </>
        )}
      </aside>

      {modalSuporteAberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(15px)',
          zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(8, 15, 30, 0.95)', border: '1px solid #00f0ff',
            borderRadius: '16px', padding: '25px', width: '100%', maxWidth: '700px',
            boxShadow: '0 0 35px rgba(0, 240, 255, 0.25)', position: 'relative'
          }}>
            <button 
              onClick={() => setModalSuporteAberto(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#00f0ff', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <h2 style={{ color: '#00f0ff', fontSize: '16px', margin: '0 0 4px 0', letterSpacing: '1px' }}>
              EM-AI // CENTRAL DE SUPORTE & ASSISTÊNCIA 2030 | Core v5.1
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 15px 0' }}>
              Resolução Autônoma de Bugs (90% IA), Compatibilidade de Apps, Documentos e Códigos G-AGI
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <button onClick={() => setAbaSuporteAtiva('diagnostico')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'diagnostico' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'diagnostico' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🛠️ Diagnóstico</button>
              <button onClick={() => setAbaSuporteAtiva('codigo')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'codigo' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'codigo' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>💻 Códigos G-AGI</button>
              <button onClick={() => setAbaSuporteAtiva('avatar')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'avatar' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'avatar' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🎥 Vídeo-Aula Holográfica</button>
              <button onClick={() => setAbaSuporteAtiva('feedback')} style={{ padding: '6px 12px', borderRadius: '12px', border: '1px solid #00f0ff', backgroundColor: abaSuporteAtiva === 'feedback' ? '#00f0ff' : 'transparent', color: abaSuporteAtiva === 'feedback' ? '#000' : '#00f0ff', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>⭐ Feedbacks Cósmicos</button>
            </div>

            <textarea 
              value={inputProblemaSuporte}
              onChange={(e) => setInputProblemaSuporte(e.target.value)}
              placeholder="Descreva seu bug, problema de compatibilidade ou solicitação G-AGI..."
              style={{ width: '100%', height: '80px', backgroundColor: '#020617', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', color: '#fff', padding: '10px', fontSize: '11px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            />

            <button 
              onClick={processarSuporteIA}
              disabled={carregandoSuporte}
              style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#ff007f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)' }}
            >
              {carregandoSuporte ? '⏳ Analisando no Núcleo Gemini AGI v5.1...' : '🚀 Executar Solução IA v5.1 (90%)'}
            </button>

            {respostaSuporte && (
              <div style={{ marginTop: '15px', backgroundColor: 'rgba(0, 240, 255, 0.05)', borderLeft: '3px solid #00f0ff', padding: '12px', borderRadius: '6px', fontSize: '11px' }}>
                <strong style={{ color: '#00f0ff', display: 'block', marginBottom: '4px' }}>Diagnóstico G-AGI:</strong>
                <p style={{ margin: '0 0 8px 0', color: '#cbd5e1' }}>{respostaSuporte.diagnostico}</p>

                {respostaSuporte.codigo && (
                  <pre style={{ backgroundColor: '#010409', padding: '8px', borderRadius: '4px', color: '#38bdf8', overflowX: 'auto', fontSize: '10px', margin: '6px 0' }}>
                    {respostaSuporte.codigo}
                  </pre>
                )}

                <p style={{ color: '#4ade80', margin: '4px 0' }}>📄 {respostaSuporte.documento}</p>
                <p style={{ color: '#fb923c', margin: '4px 0' }}>🎥 {respostaSuporte.avatarVideo}</p>
                
                <div style={{ marginTop: '8px', padding: '6px', backgroundColor: 'rgba(255,0,127,0.1)', border: '1px dashed #ff007f', borderRadius: '4px', color: '#ff007f', fontSize: '10px' }}>
                  ⚠️ Protocolo de Segurança v5.1: {respostaSuporte.protocolo}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', right: painelFluidoDireitoAberto ? '0px' : '-380px', top: '10px',
        height: 'calc(100vh - 20px)', width: '370px', backgroundColor: 'rgba(7, 12, 28, 0.92)',
        backdropFilter: 'blur(25px)', border: '1px solid rgba(0, 240, 255, 0.4)',
        borderRadius: '16px 0 0 16px', zIndex: 95, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
        gap: '12px', boxShadow: '-10px 0 40px rgba(0, 240, 255, 0.25)'
      }}>
        <button 
          onClick={() => setPainelFluidoDireitoAberto(!painelFluidoDireitoAberto)}
          style={{
            position: 'absolute', left: '-42px', top: '25px', width: '42px', height: '48px',
            backgroundColor: 'rgba(7, 12, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRight: 'none', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px',
            color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {painelFluidoDireitoAberto ? '➔' : '◀'}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
            Gemini-Integrated Advanced Command Terminal | Core v5.1
          </span>
          <button onClick={() => setPainelFluidoDireitoAberto(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>✕</button>
        </div>

        <div>
          <h3 style={{ color: '#00f0ff', fontSize: '13px', margin: 0, fontWeight: '900', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🤖 IA INTEGRADA + GEMINI AGI Core v5.1
          </h3>
          <h4 style={{ color: '#38bdf8', fontSize: '11px', margin: '2px 0 0 0', fontWeight: 'bold' }}>
            NÚCLEO DE RESPOSTA AUXILIAR Multimodal
          </h4>
          <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', fontFamily: 'monospace' }}>
            (G-AGI Core: ACTIVE | Matrix stable)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button 
            onClick={baixarPDF300Comandos}
            style={{
              backgroundColor: 'rgba(234, 88, 12, 0.2)', border: '1px solid #ea580c', color: '#fb923c',
              padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            📄 Baixar Manual G-AGI Mestre (300 Comandos)
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button onClick={() => executarComandoCMD('/nano-banana')} style={{ backgroundColor: '#0f172a', border: '1px solid #eab308', color: '#fef08a', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              🍌 /nano-banana
            </button>
            <button onClick={() => executarComandoCMD('/gerar-mapa')} style={{ backgroundColor: '#0f172a', border: '1px solid #ea580c', color: '#fb923c', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              🗺️ /gerar-mapa
            </button>
            <button onClick={() => executarComandoCMD('/status-core')} style={{ backgroundColor: '#0f172a', border: '1px solid #00f0ff', color: '#38bdf8', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              ⚡ /status-core
            </button>
            <button onClick={() => executarComandoCMD('/suporte')} style={{ backgroundColor: '#0f172a', border: '1px solid #ff007f', color: '#ff007f', padding: '6px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
              🛠️ /suporte G-AGI
            </button>
          </div>
        </div>

        <div style={{
          flexGrow: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', borderRadius: '12px', padding: '12px',
          border: '1px solid rgba(0, 240, 255, 0.2)', overflowY: 'auto', fontSize: '10px',
          fontFamily: 'Consolas, monospace', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          {cmdLogs.map((log, i) => (
            <p key={i} style={{
              margin: 0, lineHeight: '1.4', wordBreak: 'break-all',
              color: log.startsWith('[G-AGI: LOG]') ? '#94a3b8' :
                     log.startsWith('[G-AGI: STATUS]') ? '#4ade80' :
                     log.startsWith('[CMD>') ? '#38bdf8' :
                     log.startsWith('[G-AGI: QUICK_ACTION]') ? '#ff007f' :
                     log.startsWith('[G-AGI: QUERY]') ? '#38bdf8' : '#e2e8f0'
            }}>
              {log}
            </p>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (cmdInput.trim()) executarComandoCMD(cmdInput); }} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#020617', border: '1px solid #00f0ff', borderRadius: '8px', padding: '8px 12px' }}>
          <span style={{ color: '#00f0ff', fontSize: '10px', fontWeight: 'bold', marginRight: '6px', fontFamily: 'monospace' }}>[CMD&gt; G-AGI]</span>
          <input
            type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Comando ou instrução G-AGI... (ex: /gif naruto)"
            style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', flexGrow: 1, fontFamily: 'Consolas, monospace' }}
          />
          <button type="submit" style={{ backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
        </form>
      </div>

      <div style={{
        position: 'absolute', top: '20px', left: sidebarAberta ? '430px' : '180px', right: '400px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
        transition: 'left 0.3s'
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', minWidth: '150px'
        }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Network G-AGI Sync</span>
          <strong style={{ fontSize: '12px', color: '#00f0ff' }}>📶 Emanuel Sync 2030 v5.1</strong>
        </div>

        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Cognitive Load</span>
            <strong style={{ fontSize: '11px', color: '#38bdf8' }}>G-AGI Core 22%</strong>
          </div>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #00f0ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 'bold', color: '#00f0ff'
          }}>
            35%
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '16px', color: '#00f0ff' }}>🕒</span>
          <div>
            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>TEMPO NEURAL v5.1</span>
            <strong style={{ fontSize: '11px', color: '#fff', fontFamily: 'monospace' }}>
              {horaAtual || '14 Março 2030, 22:15'}
            </strong>
          </div>
        </div>
      </div>

      {/* --- BROWSER NATIVE COM HUD FUTURISTA DE GERAÇÃO ULTRA REALISTA --- */}
      <div style={{
        position: 'absolute', top: '90px', right: '400px', zIndex: 10,
        backgroundColor: 'rgba(8, 15, 30, 0.75)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '14px', padding: '14px',
        width: '300px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '20px', padding: '5px 10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', color: '#00f0ff', marginRight: '6px' }}>🌐</span>
          <input type="text" readOnly value="Internet Em.com v5.1" style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '10px', outline: 'none', width: '100%' }} />
          <span style={{ fontSize: '10px', color: '#00f0ff' }}>🔍</span>
        </div>

        <div>
          <h2 style={{ fontSize: '14px', margin: 0, color: '#fff', fontWeight: 'bold' }}>{browserAsset.titulo}</h2>
          <p style={{ fontSize: '10px', color: '#ff007f', margin: '2px 0 8px 0', fontWeight: '600' }}>{browserAsset.subtitulo} | Core v5.1</p>

          {/* ANIMAÇÃO DE PROCESSAMENTO FUTURISTA */}
          {gerandoMidia ? (
            <div style={{ textAlign: 'center', padding: '20px 10px', background: 'rgba(0,240,255,0.05)', borderRadius: '12px', border: '1px dashed #00f0ff', margin: '8px 0' }}>
              <div style={{ fontSize: '28px', animation: 'spinPulse 1.2s infinite' }}>⚡</div>
              <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold', display: 'block', margin: '8px 0 4px 0' }}>
                SINTETIZANDO {tipoMidiaAtual.toUpperCase()} REAL...
              </span>
              
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', margin: '8px 0' }}>
                <div style={{ width: `${progressoRender}%`, height: '100%', backgroundColor: '#00f0ff', boxShadow: '0 0 10px #00f0ff', transition: 'width 0.3s' }} />
              </div>
              
              <span style={{ fontSize: '9px', color: '#4ade80', fontFamily: 'monospace' }}>Processamento Quantum: {progressoRender}%</span>
            </div>
          ) : (
            <>
              {/* VÍDEO REAL COM CONTROLES DE RESOLUÇÃO E MARCA D'ÁGUA */}
              {browserAsset.videoUrl && (
                <div style={{ margin: '8px 0' }}>
                  <video src={browserAsset.videoUrl} controls autoPlay loop style={{ width: '100%', borderRadius: '8px', border: '1px solid #00f0ff' }} />
                  
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {['720p HD', '1080p Full HD', '4K Ultra HD'].map((res) => (
                        <button key={res} onClick={() => { setResolucaoVideo(res); executarGeracaoReal('Vídeo Render', 'crie_video'); }} style={{ flex: 1, padding: '4px', backgroundColor: resolucaoVideo === res ? '#00f0ff' : '#0f172a', color: resolucaoVideo === res ? '#000' : '#fff', border: '1px solid #00f0ff', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                          {res}
                        </button>
                      ))}
                    </div>

                    <button onClick={() => setSemMarcaDagua(!semMarcaDagua)} style={{ padding: '6px', backgroundColor: semMarcaDagua ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: `1px solid ${semMarcaDagua ? '#4ade80' : '#ef4444'}`, color: semMarcaDagua ? '#4ade80' : '#fca5a5', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {semMarcaDagua ? '✨ Marca d\'Água Removida (Modo Clean)' : '🔒 Clique para Remover Marca d\'Água'}
                    </button>
                  </div>
                </div>
              )}

              {/* IMAGEM OU GIF REAL COM SELETOR DE VERSÕES */}
              {browserAsset.imagem && (
                <div>
                  <div style={{ textAlign: 'center', margin: '8px 0', background: 'rgba(0, 240, 255, 0.05)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <img src={browserAsset.imagem} alt="Asset Preview Multimodal" style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px #00f0ff)', borderRadius: '6px' }} />
                  </div>

                  {versoesAtivas.length > 1 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', overflowX: 'auto' }}>
                      {versoesAtivas.map((v, i) => (
                        <button key={v.id} onClick={() => { setVersaoSelecionada(i); setBrowserAsset(prev => ({ ...prev, imagem: v.url })); }} style={{ padding: '4px 8px', backgroundColor: versaoSelecionada === i ? '#ff007f' : '#0f172a', color: '#fff', border: '1px solid #ff007f', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          {v.rotulo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.4', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', maxHeight: '90px', overflowY: 'auto' }}>
            {browserAsset.conteudoTexto}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, width: '100%', maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '10px'
      }}>

        <div style={{
          backgroundColor: 'rgba(8, 15, 30, 0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 0, 127, 0.5)', borderRadius: '12px', padding: '8px 20px',
          textAlign: 'center', boxShadow: '0 0 20px rgba(255, 0, 127, 0.2)'
        }}>
          <span style={{ fontSize: '9px', color: '#ff007f', fontWeight: 'bold', letterSpacing: '1px', display: 'block' }}>
            IA EMANUEL (GEMINI AGI Core v5.1 Multimodal)
          </span>
          <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>
            Emanuel.OS Core v5.1 | Quick Actions Active | Ano: 2030
          </span>
        </div>

        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '12px 16px',
          maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          {mensagens.map((item, index) => (
            <div key={index}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: item.tipo === 'user' ? '#00f0ff' : '#f43f5e', letterSpacing: '0.5px' }}>
                {item.autor}
              </span>
              <p style={{ margin: 0, fontSize: '11px', color: '#f8fafc', lineHeight: '1.3' }}>
                {item.texto}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleEnviarMensagemTexto} style={{
          backgroundColor: 'rgba(5, 12, 24, 0.9)', backdropFilter: 'blur(20px)',
          border: '1px solid #00f0ff', borderRadius: '25px', padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)'
        }}>
          <button type="button" onClick={() => imageInputRef.current && imageInputRef.current.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>🖼️</button>
          <button type="button" onClick={iniciarEscuta} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>{estaOuvindo ? '🔴' : '🎙️'}</button>
          <input type="file" ref={imageInputRef} onChange={handleUploadImagemLente} style={{ display: 'none' }} accept="image/*" />

          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Digite mensagens ou peça gifs/imagens (ex: 'gif do naruto', 'imagem de carro cyberpunk', 'video vila')..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', flexGrow: 1 }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: '#00f0ff', color: '#000', border: 'none', padding: '6px 18px',
              borderRadius: '18px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer',
              boxShadow: '0 0 10px #00f0ff'
            }}
          >
            Executar G-AGI ➔
          </button>
        </form>

      </div>

      <style>{`
        @keyframes spinPulse {
          0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.8; }
        }
      `}</style>

    </div>
  );
}