import React, { useState } from 'react';
import { jsPDF } from "jspdf";

export default function FuturisticWindowManager() {
  const [painelAberto, setPainelAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('cmd'); // 'cmd', 'notepad', 'android'
  const [cmdInputWindow, setCmdInputWindow] = useState('');
  const [copiadoIdx, setCopiadoIdx] = useState(null);

  const [cmdLogsWindow, setCmdLogsWindow] = useState([
    "[SYSTEM: WIN11_CORE] Windows 11 Cyber Kernel v10.0 active.",
    "[SYSTEM: ANDROID_HUD] Subsystem Android 15 Neural Sync: ONLINE.",
    "[SYSTEM: DEV_STUDIO] Code Editor ready. JS/Next.js/Three.js mode enabled."
  ]);

  const [textoNotas, setTextoNotas] = useState(
    `// Emanuel.OS - DevStudio Notepad\n// Digite rascunhos de código ou anotações aqui\n\nfunction inicializarMatrizQuantica() {\n  console.log("Qubits sincronizados com Gemini AGI Core v5.1");\n}`
  );

  // Copiar texto para a área de transferência
  const copiarParaTransferencia = (texto, index) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto);
      setCopiadoIdx(index);
      setTimeout(() => setCopiadoIdx(null), 2000);
    }
  };

  // Gerar Códigos de Exemplo via IA
  const gerarCodigoIA = (tipo) => {
    let codigoGerado = '';
    if (tipo === 'react') {
      codigoGerado = `// Componente React Autônomo Emanuel.OS\nimport React, { useState } from 'react';\n\nexport default function QuantumWidget() {\n  const [status, setStatus] = useState("SYNC_OK");\n  return (\n    <div style={{ color: '#00f0ff', padding: '10px' }}>\n      <h3>Status do Qubit: {status}</h3>\n    </div>\n  );\n}`;
    } else if (tipo === 'three') {
      codigoGerado = `// Animação 3D Three.js Emanuel.OS\nconst scene = new THREE.Scene();\nconst geometry = new THREE.IcosahedronGeometry(2, 4);\nconst material = new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true });\nconst mesh = new THREE.Mesh(geometry, material);\nscene.add(mesh);`;
    } else if (tipo === 'python') {
      codigoGerado = `# Script Python AI Emanuel.OS\nimport numpy as np\n\ndef processar_matriz_neural(dados):\n    print("Processando tensores AGI v5.1...")\n    return np.array(dados) * 1.618`;
    }

    setTextoNotas(prev => `${prev}\n\n${codigoGerado}`);
    setCmdLogsWindow(prev => [...prev, `[G-AGI CODE] Modelo de código (${tipo.toUpperCase()}) gerado no DevStudio!`]);
  };

  // Exportar conteúdo do Dev Notepad em PDF
  const baixarCodigoPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(0, 240, 255);
    doc.setFontSize(16);
    doc.text("EMANUEL.OS - DEVSTUDIO CODE REPORT", 15, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("REGISTRO DE CÓDIGO E NOTAS DO DESENVOLVEDOR", 15, 25);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont("courier", "normal");

    const linhasCodigo = doc.splitTextToSize(textoNotas, 180);
    doc.text(linhasCodigo, 15, 40);

    doc.save("EmanuelOS_DevStudio_Code.pdf");
    setCmdLogsWindow(prev => [...prev, "[PDF] Código do Dev Notepad exportado com sucesso (.PDF)!"]);
  };

  const rodarComandoWindow = (e) => {
    e.preventDefault();
    if (!cmdInputWindow.trim()) return;
    const cmd = cmdInputWindow.trim();
    setCmdLogsWindow(prev => [...prev, `PS C:\\EmanuelOS\\System32> ${cmd}`]);

    if (cmd === 'help') {
      setCmdLogsWindow(prev => [...prev, "Comandos disponíveis: status, clear, matrix, dev, quantico"]);
    } else if (cmd === 'clear') {
      setCmdLogsWindow([]);
    } else if (cmd === 'status') {
      setCmdLogsWindow(prev => [...prev, "[STATUS] All HUD Modules & Quantum Maps Running at 60 FPS."]);
    } else {
      setCmdLogsWindow(prev => [...prev, `[G-AGI EXEC] Executando script: '${cmd}'... OK`]);
    }
    setCmdInputWindow('');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: painelAberto ? '20px' : '-440px',
      width: '430px',
      height: '420px',
      backgroundColor: 'rgba(8, 15, 30, 0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '16px',
      boxShadow: '0 0 35px rgba(0, 240, 255, 0.25)',
      zIndex: 150,
      transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff'
    }}>
      {/* Botão Retrátil de Controle (Setinha no Canto) */}
      <button
        onClick={() => setPainelAberto(!painelAberto)}
        style={{
          position: 'absolute',
          right: '-42px',
          bottom: '30px',
          width: '42px',
          height: '48px',
          backgroundColor: 'rgba(8, 15, 30, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          borderLeft: 'none',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
          color: '#00f0ff',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '5px 0 15px rgba(0, 240, 255, 0.2)'
        }}
      >
        {painelAberto ? '◀' : '➔'}
      </button>

      {/* Header Estilo Windows 11 Fluent Design */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(2, 6, 23, 0.6)',
        borderRadius: '16px 16px 0 0'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px' }}>💻</span>
          <strong style={{ fontSize: '11px', color: '#00f0ff', letterSpacing: '0.5px' }}>
            Emanuel.OS Workstation v5.1
          </strong>
        </div>

        {/* Abas de Navegação */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setAbaAtiva('cmd')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #00f0ff',
              backgroundColor: abaAtiva === 'cmd' ? '#00f0ff' : 'transparent',
              color: abaAtiva === 'cmd' ? '#000' : '#00f0ff',
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🖥️ CMD Win11
          </button>
          <button
            onClick={() => setAbaAtiva('notepad')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #a855f7',
              backgroundColor: abaAtiva === 'notepad' ? '#a855f7' : 'transparent',
              color: abaAtiva === 'notepad' ? '#fff' : '#c084fc',
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📝 Dev Notepad
          </button>
          <button
            onClick={() => setAbaAtiva('android')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #22c55e',
              backgroundColor: abaAtiva === 'android' ? '#22c55e' : 'transparent',
              color: abaAtiva === 'android' ? '#000' : '#4ade80',
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📱 Android HUD
          </button>
        </div>
      </div>

      {/* Conteúdo das Janelas */}
      <div style={{ flexGrow: 1, padding: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* JANELA 1: CMD WINDOWS 11 CIBERESPACIAL COM BOTÃO DE CÓPIA 📋 */}
        {abaAtiva === 'cmd' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
              flexGrow: 1,
              backgroundColor: '#010409',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '8px',
              padding: '10px',
              fontFamily: 'Consolas, monospace',
              fontSize: '10px',
              color: '#38bdf8',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {cmdLogsWindow.map((log, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ wordBreak: 'break-all' }}>{log}</span>
                  <button
                    onClick={() => copiarParaTransferencia(log, i)}
                    title="Copiar mensagem"
                    style={{
                      backgroundColor: 'rgba(0,240,255,0.1)',
                      border: '1px solid rgba(0,240,255,0.3)',
                      color: copiadoIdx === i ? '#4ade80' : '#00f0ff',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '9px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {copiadoIdx === i ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={rodarComandoWindow} style={{ display: 'flex', marginTop: '8px', gap: '6px' }}>
              <input
                type="text"
                value={cmdInputWindow}
                onChange={(e) => setCmdInputWindow(e.target.value)}
                placeholder="Comando PowerShell / Terminal... (ex: help, status)"
                style={{
                  flexGrow: 1,
                  padding: '6px 10px',
                  backgroundColor: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#00f0ff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                EXEC
              </button>
            </form>
          </div>
        )}

        {/* JANELA 2: DEVSTUDIO NOTEPAD (GERAÇÃO DE CÓDIGOS, CÓPIA 📋 E DOWNLOAD EM PDF) */}
        {abaAtiva === 'notepad' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* BOTÕES DE GERAÇÃO RÁPIDA DE CÓDIGO POR IA */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              <button onClick={() => gerarCodigoIA('react')} style={{ flex: 1, padding: '4px', backgroundColor: 'rgba(56,189,248,0.2)', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                ⚡ Gerar React
              </button>
              <button onClick={() => gerarCodigoIA('three')} style={{ flex: 1, padding: '4px', backgroundColor: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                ⚡ Gerar Three.js
              </button>
              <button onClick={() => gerarCodigoIA('python')} style={{ flex: 1, padding: '4px', backgroundColor: 'rgba(234,179,8,0.2)', border: '1px solid #eab308', color: '#fef08a', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                ⚡ Gerar Python
              </button>
            </div>

            <textarea
              value={textoNotas}
              onChange={(e) => setTextoNotas(e.target.value)}
              style={{
                flexGrow: 1,
                backgroundColor: '#020617',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                color: '#e2e8f0',
                fontFamily: 'Consolas, monospace',
                fontSize: '10px',
                outline: 'none',
                resize: 'none',
                lineHeight: '1.4'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', gap: '6px' }}>
              <button
                onClick={() => copiarParaTransferencia(textoNotas, 'notepad')}
                style={{
                  padding: '6px 10px',
                  backgroundColor: 'rgba(0,240,255,0.15)',
                  border: '1px solid #00f0ff',
                  color: '#00f0ff',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                📋 Copiar Código
              </button>

              <button
                onClick={baixarCodigoPDF}
                style={{
                  padding: '6px 10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                📄 Baixar PDF
              </button>

              <button
                onClick={() => alert("Rascunho salvo na memória cache do Emanuel.OS!")}
                style={{
                  padding: '6px 10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid #a855f7',
                  color: '#d8b4fe',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💾 Salvar Rascunho
              </button>
            </div>
          </div>
        )}

        {/* JANELA 3: ANDROID HUD MOBILE */}
        {abaAtiva === 'android' && (
          <div style={{
            height: '100%',
            backgroundColor: '#020617',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', pb: '6px' }}>
              <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold' }}>📲 Android 15 Neural OS</span>
              <span style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'monospace' }}>5G FULL SYNC</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '15px 0' }}>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center', cursor: 'pointer' }} onClick={() => alert("Iniciando WhatsApp ID Neural...")}>
                <div style={{ fontSize: '18px' }}>💬</div>
                <span style={{ fontSize: '9px', color: '#fff', display: 'block', marginTop: '4px' }}>WhatsApp ID</span>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center', cursor: 'pointer' }} onClick={() => alert("Conectando ao Google Meet...")}>
                <div style={{ fontSize: '18px' }}>🎥</div>
                <span style={{ fontSize: '9px', color: '#fff', display: 'block', marginTop: '4px' }}>Meet IA</span>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #334155', borderRadius: '10px', padding: '10px', textAlign: 'center', cursor: 'pointer' }} onClick={() => alert("Sincronizando Galeria...")}>
                <div style={{ fontSize: '18px' }}>🖼️</div>
                <span style={{ fontSize: '9px', color: '#fff', display: 'block', marginTop: '4px' }}>Galeria 3D</span>
              </div>
            </div>

            <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '9px', color: '#4ade80' }}>Dispositivo Pareado: Moto g75 (Emanuel da Silva)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}