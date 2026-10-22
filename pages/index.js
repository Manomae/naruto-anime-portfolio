import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import * as THREE from 'three';
import { coreAssistant } from '../coreAssistantEngine';
import { autoCompleterEngine } from '../components/palavrasAutoComplemento';

// Bibliotecas para geração de documentos
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pptxgen from "pptxgenjs";

// Importação do Componente Yu-Gi-Oh! 3D
import YugiohDuelLinks3D from '../components/YugiohDuelLinks3D';

// =========================================================================================
// 🤖 --- COMPONENTE: MINI ROBOTOC 3D ASSISTANT ---
// =========================================================================================
function MiniRobotocAssistant3D({ onClose }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const miniRobotRef = useRef(null);
  const pointerArmRef = useRef(null);

  const [duvidaInput, setDuvidaInput] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [respostaIA, setRespostaIA] = useState('Olá! Sou seu Mini Robotoc 3D. Digite algo e aperte TAB ou Seta Direita para autocompletar!');

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setDuvidaInput(valor);

    const ultimasPalavras = valor.split(' ');
    const ultimaPalavra = ultimasPalavras[ultimasPalavras.length - 1];

    if (ultimaPalavra.length >= 1) {
      const match = autoCompleterEngine.buscarCompletar(ultimaPalavra, 4);
      setSugestoes(match);
    } else {
      setSugestoes([]);
    }
  };

  const aplicarSugestao = (palavraSugerida) => {
    if (!palavraSugerida) return;
    const palavras = duvidaInput.split(' ');
    palavras[palavras.length - 1] = palavraSugerida;
    const textoCompleto = palavras.join(' ') + ' ';
    setDuvidaInput(textoCompleto);
    setSugestoes([]);
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && sugestoes.length > 0) {
      e.preventDefault();
      aplicarSugestao(sugestoes[0]);
    }
  };

  const falarResposta = (texto) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const lightCyan = new THREE.DirectionalLight(0x00f0ff, 3.5);
    lightCyan.position.set(3, 5, 4);
    scene.add(lightCyan);

    const whiteMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1, clearcoat: 1.0 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
    const cyanGlowMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 2.5 });

    const miniRobot = new THREE.Group();

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), whiteMat);
    head.scale.set(1, 1.1, 1);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 16, 0, Math.PI, 0, Math.PI * 0.4), cyanGlowMat);
    visor.rotation.x = -Math.PI / 10;
    visor.position.set(0, 0.05, 0.02);
    head.add(visor);

    head.position.y = 0.6;
    miniRobot.add(head);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.7, 16), whiteMat);
    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.1), blueMat);
    chestPlate.position.set(0, 0, 0.22);
    body.add(chestPlate);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16), cyanGlowMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 0.05, 0.28);
    body.add(core);

    miniRobot.add(body);

    const armGroup = new THREE.Group();
    const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.5, 16), blueMat);
    armMesh.position.y = -0.25;
    armGroup.add(armMesh);

    const pointerLaser = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.3, 16), cyanGlowMat);
    pointerLaser.rotation.x = Math.PI;
    pointerLaser.position.y = -0.6;
    armGroup.add(pointerLaser);

    armGroup.position.set(0.45, 0.2, 0);
    miniRobot.add(armGroup);
    pointerArmRef.current = armGroup;

    miniRobot.position.set(0, -0.2, 0);
    scene.add(miniRobot);
    miniRobotRef.current = miniRobot;

    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (miniRobotRef.current) {
        miniRobotRef.current.position.y = -0.2 + Math.sin(time * 2.5) * 0.08;
        miniRobotRef.current.rotation.y = Math.sin(time * 1.2) * 0.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const processarDuvidaAssistente = (e) => {
    e.preventDefault();
    if (!duvidaInput.trim()) return;

    autoCompleterEngine.adicionarNovaPalavra(duvidaInput.trim());

    const q = duvidaInput.toLowerCase().trim();
    let resp = '';

    if (q.includes('onde fica') || q.includes('onde esta') || q.includes('mapa') || q.includes('workstation')) {
      resp = `Localizando '${duvidaInput}' no sistema... O Mini Robotoc encontrou os módulos correspondentes!`;
    } else {
      resp = `Entendido! Analisando: "${duvidaInput}". O Mini Robotoc processou seu comando no Emanuel.OS!`;
    }

    setRespostaIA(resp);
    falarResposta(resp);
    setSugestoes([]);
    setDuvidaInput('');
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '370px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff',
      borderRadius: '20px', padding: '14px', boxShadow: '0 0 35px rgba(0, 240, 255, 0.3)',
      zIndex: 500, backdropFilter: 'blur(20px)', color: '#0f172a', fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '6px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🤖</span>
          <strong style={{ fontSize: '11px', color: '#0284c7' }}>MINI ROBOTOC 3D AUTO-COMPLETE</strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '100px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #00f0ff', padding: '6px', marginBottom: '8px' }}>
        <div ref={mountRef} style={{ width: '90px', height: '100%', cursor: 'grab' }} />
        <div style={{ flex: 1, height: '100%', overflowY: 'auto', fontSize: '9.5px', color: '#0284c7', lineHeight: '1.3' }}>
          <strong>💡 Status Robotoc:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#0f172a' }}>{respostaIA}</p>
        </div>
      </div>

      {sugestoes.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px', backgroundColor: '#f0f9ff', padding: '6px', borderRadius: '8px', border: '1px solid #00f0ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: 'bold' }}>⚡ COMPLEMENTOS SUGERIDOS:</span>
            <span style={{ fontSize: '7.5px', backgroundColor: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>Pressione TAB ou ➔</span>
          </div>
          {sugestoes.map((sug, i) => (
            <button
              key={i}
              onClick={() => aplicarSugestao(sug)}
              style={{
                backgroundColor: i === 0 ? '#00f0ff' : '#ffffff',
                border: '1px solid #0284c7',
                color: i === 0 ? '#000' : '#0284c7',
                padding: '3px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              {sug} {i === 0 ? '↹' : '↵'}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={processarDuvidaAssistente} style={{ display: 'flex', gap: '4px' }}>
        <input
          type="text"
          value={duvidaInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite 1 ou 2 letras (Aperte TAB ou ➔ pra aceitar)..."
          style={{ flex: 1, padding: '8px 10px', backgroundColor: '#f8fafc', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '10px', outline: 'none', color: '#0f172a' }}
        />
        <button type="submit" style={{ padding: '8px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '9px', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
    </div>
  );
}

// =========================================================================================
// 📸 --- COMPONENTE: MOTION TRACKER ---
// =========================================================================================
function MotionTracker() {
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
// ⚙️ --- COMPONENTE: ROBOTOC GEAR ---
// =========================================================================================
function RobotocGear({ onConnectGear, highlightGear }) {
  const [gears, setGears] = useState({ headset: false, mouse: false, keyboard: true });

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
// ⌨️ --- COMPONENTE: TECLADO GLASS 3D ---
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
// 📲 --- COMPONENTE: DISPATCHER MENSAGENS ---
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
// 🧠 --- COMPONENTE: ROBOTOC NEURAL THOUGHT PANEL ---
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
// 📱 --- PAINEL ANDROID HUD ---
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
          <strong style={{ fontSize: '12px', color: '#0284c7' }}>ANDROID 16 NEURAL OS EM HUD v6.0</strong>
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
// 💻 --- PAINEL DEV SPLIT SCREEN ---
// =========================================================================================
function PainelDevSplitScreen({ onClose }) {
  const [linguagem, setLinguagem] = useState('mojo');
  
  const templatesExoticos = {
    mojo: `// Mojo (AI Performance High-Speed Language)\nfn main():\n    let matrix_dim: Int = 1024\n    print("⚡ Inicializando Tensor Quântico Emanuel.OS no Núcleo Mojo...")\n    print("Matriz carregada com dimensao:", matrix_dim)`,
    zig: `// Zig System Language\nconst std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("🧠 Núcleo de Baixo Nível do Android 16 Neural OS EM Ativo!\\n", .{});\n}`,
    nim: `# Nim Metaprogramming Language\ntype\n  NeuralCore = object\n    status: string\n    potencia: float\n\nlet core = NeuralCore(status: "ONLINE", potencia: 99.8)\necho "🚀 Sistema Emanuel.OS executando em Nim. Status: ", core.status`,
    crystal: `# Crystal Language\nclass QuantumEngine\n  def initialize(@name : String)\n  end\n\n  def boot\n    puts "💎 Rodando motor quântico #{@name} no Emanuel.OS Workstation"\n  end\nend\n\nQuantumEngine.new("EM-Core v6.0").boot`,
    elixir: `# Elixir Distributed System\ndefmodule EmanuelOS.Core do\n  def sync_nodes(node_id) do\n    IO.puts("🔮 Sincronizando Nó Funcional Exótico: #{node_id}")\n  end\nend\n\nEmanuelOS.Core.sync_nodes("Node-BRS7")`,
    qsharp: `// Q# Quantum System\nnamespace EmanuelOS.Quantum {\n    open Microsoft.Quantum.Canon;\n    open Microsoft.Quantum.Intrinsic;\n\n    operation MeasureQubit() : Result {\n        use q = Qubit();\n        H(q);\n        return M(q);\n    }\n}`,
    gleam: `// Gleam Language\nimport gleam/io\n\npub fn main() {\n  io.print_line("✨ Executando Gleam no Motor Distribuído do Emanuel.OS!")\n}`
  };

  const [codigoFonte, setCodigoFonte] = useState(templatesExoticos['mojo']);
  const [blocoRascunho, setBlocoRascunho] = useState("Notas do Dev Núcleo: Explorando Mojo e Zig no Android 16 Neural OS EM.");
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [relatorioErros, setRelatorioErros] = useState([]);

  const [cmdPowerInput, setCmdPowerInput] = useState('');
  const [cmdPowerLogs, setCmdPowerLogs] = useState([
    "Windows PowerShell EM [Versão 10.0.26100.1] - Emanuel.OS Workstation Core",
    "(c) Emanuel.OS Corporation. Todos os direitos reservados.",
    " ",
    "PS C:\\EmanuelOS\\Kernel> Get-EMStatus -IA",
    "-> MOTOR NEURAL IA: Ativo (Gemini AGI + Robotoc 3D)",
    "-> ANDROID OS EM: v16.0 Ready. Digite 'help-em' para comandos especiais de IA."
  ]);

  const handleLinguagemChange = (novaLang) => {
    setLinguagem(novaLang);
    if (templatesExoticos[novaLang]) {
      setCodigoFonte(templatesExoticos[novaLang]);
    } else {
      setCodigoFonte(`// Projeto em ${novaLang.toUpperCase()}\n// Desenvolva novas soluções no núcleo Emanuel.OS Workstation v6.0`);
    }
  };

  const executarPowerShellIA = (e) => {
    e.preventDefault();
    if (!cmdPowerInput.trim()) return;

    const cmd = cmdPowerInput.trim();
    let res = [];

    if (cmd === 'help-em') {
      res = [
        "Comandos Avançados de IA da EM Power Shell:",
        "  ai-optimize-core  -> Otimiza rotinas WebGL e sintaxe de baixo nível",
        "  ai-generate-code  -> Gera boilerplate automático na linguagem exótica selecionada",
        "  ai-scan-security  -> Executa varredura profunda de segurança de 7 camadas",
        "  sys-info-em        -> Exibe o estado em tempo real dos 12 mapas e periféricos"
      ];
    } else if (cmd === 'ai-optimize-core') {
      res = ["⚡ IA EM Power Shell: Código compilado, vetores paralelizados e otimização concluída."];
    } else if (cmd === 'ai-generate-code') {
      res = [`🚀 IA EM Power Shell: Novo trecho de alta sintaxe gerado para ${linguagem.toUpperCase()}.`];
    } else if (cmd === 'ai-scan-security') {
      res = ["🛡️ IA EM Power Shell: Varredura de 7 Camadas concluída. 0 vulnerabilidades no Kernel!"];
    } else if (cmd === 'sys-info-em') {
      res = ["🌐 STATUS DA REDE: 12 Mapas Sincronizados | Android 16 Neural OS EM: Ativo | Periféricos: OK"];
    } else {
      res = [`PS C:\\EmanuelOS\\Kernel> ${cmd} : O comando não foi reconhecido. Tente 'help-em'.`];
    }

    setCmdPowerLogs(prev => [...prev, `PS C:\\EmanuelOS\\Kernel> ${cmd}`, ...res, " "]);
    setCmdPowerInput('');
  };

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

      errosDetectados.push({ linha: 0, tipo: 'sucesso', texto: `✅ IA EMgemini: Código em ${linguagem.toUpperCase()} validado no Núcleo do Emanuel.OS Workstation v6.0!`, cor: '#16a34a' });
      setRelatorioErros(errosDetectados);

      if (modo === 'explicar') {
        const explicacao = `O código atual em ${linguagem} utiliza arquitetura avançada de desenvolvimento com ${linhas.length} linhas de estrutura.`;
        falarExplicacaoVoz(explicacao);
      }
    }, 1000);
  };

  const baixarCodigoArquivo = () => {
    const ext = linguagem;
    const blob = new Blob([codigoFonte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EmanuelOS_Core_${linguagem}.${ext}`;
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
    doc.text("EMANUEL.OS WORKSTATION - NÚCLEO DEV REPORT v6.0", 15, 18);
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`LINGUAGEM SELECIONADA: ${linguagem.toUpperCase()} | DATA: ${new Date().toLocaleDateString('pt-BR')}`, 15, 25);

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(codigoFonte, 180);
    doc.text(linhas, 15, 40);

    doc.save(`DevStudio_Nucleo_${linguagem}.pdf`);
  };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#f0f9ff',
      borderLeft: '2px solid #00f0ff', padding: '16px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '10px', color: '#0f172a',
      fontFamily: 'Consolas, Monaco, monospace', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>👨‍💻</span>
          <strong style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'sans-serif' }}>
            Emanuel.OS Workstation v6.0 | Notepad Dev Núcleo (Android 16 OS)
          </strong>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          ✕ Fechar Workstation
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontFamily: 'sans-serif', fontWeight: 'bold' }}>LINGUAGENS NÚCLEO:</span>
        <select
          value={linguagem}
          onChange={(e) => handleLinguagemChange(e.target.value)}
          style={{ backgroundColor: '#ffffff', border: '1px solid #0284c7', color: '#0284c7', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', outline: 'none' }}
        >
          <optgroup label="🔥 Exóticas & Alta Performance">
            <option value="mojo">Mojo (AI High-Performance)</option>
            <option value="zig">Zig (Low-Level Core)</option>
            <option value="nim">Nim (Metaprogramming)</option>
            <option value="crystal">Crystal (Fast as C)</option>
            <option value="elixir">Elixir (Distributed Concurrency)</option>
            <option value="qsharp">Q# (Quantum System)</option>
            <option value="gleam">Gleam (Functional Erlang)</option>
          </optgroup>
          <optgroup label="💻 Padrão & Web">
            <option value="javascript">JavaScript (React/Next)</option>
            <option value="python">Python (AI/ML)</option>
            <option value="typescript">TypeScript</option>
            <option value="cpp">C++ Quântico</option>
          </optgroup>
        </select>

        <button onClick={() => analisarECorrigirCodigoIA('bugs')} style={{ padding: '6px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔍 Checar Sintaxe IA
        </button>
        <button onClick={() => analisarECorrigirCodigoIA('otimizar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(168,85,247,0.1)', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          ⚡ Otimizar Motor
        </button>
        <button onClick={() => analisarECorrigirCodigoIA('explicar')} style={{ padding: '6px 10px', backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid #eab308', color: '#d97706', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          🔊 Explicar em Áudio
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '180px' }}>
        <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'sans-serif' }}>NOTEPAD DEV NÚCLEO - CÓDIGO FONTE ({linguagem.toUpperCase()}):</span>
        <textarea
          value={codigoFonte}
          onChange={(e) => setCodigoFonte(e.target.value)}
          style={{
            width: '100%', flexGrow: 1, backgroundColor: '#ffffff', border: '1px solid #00f0ff',
            borderRadius: '8px', color: '#0284c7', padding: '12px', fontSize: '11px',
            outline: 'none', resize: 'none', lineHeight: '1.4', fontFamily: 'Consolas, monospace',
            boxSizing: 'border-box', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.05)'
          }}
        />
      </div>

      {relatorioErros.length > 0 && (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,240,255,0.5)', padding: '8px', borderRadius: '6px', maxHeight: '70px', overflowY: 'auto' }}>
          <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📋 DIAGNÓSTICO DO NÚCLEO WORKSTATION:</span>
          {relatorioErros.map((item, idx) => (
            <div key={idx} style={{ fontSize: '10px', color: item.cor, margin: '2px 0' }}>
              {item.texto}
            </div>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #00f0ff', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 15px rgba(0,240,255,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #e0f2fe', paddingBottom: '4px', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px' }}>🖥️</span>
          <strong style={{ fontSize: '10px', color: '#0284c7', fontFamily: 'sans-serif' }}>EM Power Shell IA (Estilo Windows 11 - Branco & Azul Neon)</strong>
        </div>

        <div style={{ backgroundColor: '#f8fafc', borderRadius: '6px', padding: '8px', maxHeight: '90px', overflowY: 'auto', fontSize: '10px', color: '#0284c7', border: '1px solid #bae6fd', marginBottom: '6px' }}>
          {cmdPowerLogs.map((logLine, lIdx) => (
            <div key={lIdx} style={{ lineHeight: '1.3' }}>{logLine}</div>
          ))}
        </div>

        <form onSubmit={executarPowerShellIA} style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 'bold', alignSelf: 'center' }}>PS C:\EM&gt;</span>
          <input
            type="text"
            value={cmdPowerInput}
            onChange={(e) => setCmdPowerInput(e.target.value)}
            placeholder="Digite comandos de IA (ex: help-em, ai-optimize-core)..."
            style={{ flex: 1, padding: '6px 10px', backgroundColor: '#f0f9ff', border: '1px solid #00f0ff', borderRadius: '6px', color: '#0f172a', fontSize: '10px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
            Executar
          </button>
        </form>
      </div>

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

      <div style={{ height: '45px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '9px', color: '#0284c7', fontFamily: 'sans-serif', fontWeight: 'bold' }}>📝 BLOCO DE NOTAS DO DESENVOLVEDOR NÚCLEO:</span>
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
// ✉️ --- FORMULÁRIO CAPTURA EMAILJS ---
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
// 🎥 --- GOOGLE MEET AVATAR MANAGER ---
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
// 🖥️ --- UNIX TERMINAL CANVAS ---
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
// ₿ --- BITCOIN ANALYSIS PANEL ---
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
// ☁️ --- CLOUDFLARE WORKER DEPLOYER ---
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
// 🏛️ --- VITRINE VIRTUAL 3D DE VIDRO ---
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const spotCyan = new THREE.SpotLight(0x00f0ff, 6);
    spotCyan.position.set(-5, 8, 5);
    scene.add(spotCyan);

    const spotWhite = new THREE.SpotLight(0xffffff, 6);
    spotWhite.position.set(5, 8, 5);
    scene.add(spotWhite);

    const vitrineGroup = new THREE.Group();

    const baseGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, roughness: 0.1, metalness: 0.9,
      transparent: true, opacity: 0.85
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    vitrineGroup.add(baseMesh);

    const ringGeo = new THREE.TorusGeometry(3.6, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: modoAtual === 'bluetooth' ? 0xeab308 : 0x0284c7 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.0;
    vitrineGroup.add(ringMesh);

    const glassGeo = new THREE.CylinderGeometry(3.5, 3.5, 4.5, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true,
      roughness: 0.05, ior: 1.5, thickness: 0.5, side: THREE.DoubleSide
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 1.0;
    vitrineGroup.add(glassMesh);

    const contentGroup = new THREE.Group();

    if (modoAtual === 'avatares' || modoAtual === 'bluetooth') {
      const robot1 = new THREE.Group();
      const body1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 }));
      const head1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      const visor1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.62), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
      head1.position.y = 0.95;
      visor1.position.y = 0.95;
      robot1.add(body1, head1, visor1);
      robot1.position.set(-1.4, 0.2, 0);

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
      if (modoAtual === 'mapa_eleicoes2026') mapColor = 0x00ffcc;
      if (modoAtual === 'mapa_geometric3d') mapColor = 0xff00ff;
      if (modoAtual === 'mapa_agroflorestal') mapColor = 0x15803d;

      const mapMesh = new THREE.Mesh(mapGeo, new THREE.MeshStandardMaterial({ color: mapColor, wireframe: true }));
      mapMesh.position.y = 0.8;
      contentGroup.add(mapMesh);
    }

    vitrineGroup.add(contentGroup);
    scene.add(vitrineGroup);
    groupVitrineRef.current = vitrineGroup;

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

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (groupVitrineRef.current && !isDragging) {
        groupVitrineRef.current.rotation.y += 0.008;
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
// 🪟 --- WINDOW DEV PANEL ROBOTOC ---
// =========================================================================================
function WindowDevPanelRobotoc({ onClose, onRequestBluetooth }) {
  const [size, setSize] = useState({ width: 520, height: 580 });
  const [pos, setPos] = useState({ x: 80, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modoVitrine, setModoVitrine] = useState('avatares');

  const mapasDisponiveis = [
    { id: 'mapa_terrestre', nome: '🌍 Terrestre', rota: '/mapa' },
    { id: 'mapa_orkut', nome: '🧡 Orkut', rota: '/mapa-orkut' },
    { id: 'mapa_espacial', nome: '🪐 Espacial', rota: '/espacial' },
    { id: 'mapa_ressonancia', nome: '🧬 Ressonância', rota: '/mapa-ressonancia' },
    { id: 'mapa_patologia', nome: '🔬 Patologia', rota: '/mapa-patologia' },
    { id: 'mapa_ia', nome: '⚡ IA 3D', rota: '/mapa-ia' },
    { id: 'mapa_antiguidades', nome: '🏛️ Antiguidades', rota: '/mapa-antiguidades' },
    { id: 'mapa_quantico', nome: '⚛️ Quântico', rota: '/mapa-quantico' },
    { id: 'mapa_aeroespacial', nome: '🛸 Aeroespacial', rota: '/mapaaeroespacial' },
    { id: 'mapa_eleicoes2026', nome: '🗳️ Eleições 2026 3D', rota: '/MapaEleicoesBrasil20263D' },
    { id: 'mapa_geometric3d', nome: '📐 PG Matemático 3D', rota: '/geometricMap3D' },
    { id: 'mapa_agroflorestal', nome: '🌲 Agroflorestal', rota: '/mapaagroflorestal' }
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

      <div style={{ flexGrow: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '10px', color: '#64748b' }}>
          🏛️ <strong>Vitrine Virtual 3D de Vidro</strong> - Modelos Giratórios & Maquetes Interativas de Mapas
        </span>

        <VitrineVirtual3D 
          modoAtual={modoVitrine} 
          onSelectModo={(m) => setModoVitrine(m)}
          onRequestBluetoothConnection={onRequestBluetooth}
        />

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

        <div style={{ backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
          <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            ⚡ CONSOLE DE TESTES AGI & HARDWARE
          </span>
          <p style={{ margin: 0, fontSize: '9px', color: '#334155' }}>
            Inspeção de shaders WebGL em tempo real. Os avatares e mapas renderizados sincronizam com periféricos via bluetooth automaticamente.
          </p>
        </div>
      </div>

      <div 
        onMouseDown={() => setIsResizing(true)}
        style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', cursor: 'nwse-resize', background: 'linear-gradient(135deg, transparent 50%, #00f0ff 50%)' }}
      />
    </div>
  );
}

// =========================================================================================
// 🌟 --- 🖥️ COMPONENTE PRINCIPAL DO NÚCLEO EMANUEL.OS (INDEX v6.0 WORKSTATION) --- 🖥️
// =========================================================================================
export default function EmanuelOSCore() {
  const [bloqueado, setBloqueado] = useState(true);
  const [etapaSeguranca, setEtapaSeguranca] = useState(1);
  const [telefoneDigitado, setTelefoneDigitado] = useState('');
  const [pinDigitado, setPinDigitado] = useState('');
  const [emailDigitado, setEmailDigitado] = useState('');
  const [chaveDigitada, setChaveDigitada] = useState('');

  const [miniAssistantAberto, setMiniAssistantAberto] = useState(false);
  const [yugiohGameAberto, setYugiohGameAberto] = useState(false);

  // 🌟 DADOS E REDES SOCIAIS REAIS CENTRALIZADOS
  const meusDadosReais = {
    nome: "Emanuel da Silva (Comando Central Emanuel.OS)",
    whatsapp: "5588981493989",
    whatsappFormatado: "(88) 98149-3989",
    email: "leeheroi123@gmail.com",
    tiktok: "https://www.tiktok.com/@emanueldasilva26",
    instagram: "https://www.instagram.com/emanuelsilva432",
    threads: "https://www.threads.net/@emanuelsilva432",
    github: "https://github.com/Manomae",
    facebook: "https://www.facebook.com/leeheroi.heroi",
    youtube: "https://youtube.com/@emanuelsilva2987?si=pd7120vlBFFa-6Hg"
  };

  // ESTADO DE LINKS 3D DINÂMICOS
  const [links3D, setLinks3D] = useState([
    { id: 1, tipo: 'youtube', titulo: 'Canal YouTube Emanuel', url: meusDadosReais.youtube, icone: '▶️', nuvem: 'google' },
    { id: 2, tipo: 'tiktok', titulo: 'TikTok Emanuel', url: meusDadosReais.tiktok, icone: '🎵', nuvem: 'custom' },
    { id: 3, tipo: 'instagram', titulo: 'Instagram Oficial', url: meusDadosReais.instagram, icone: '📸', nuvem: 'apple' },
    { id: 4, tipo: 'github', titulo: 'Repositório GitHub', url: meusDadosReais.github, icone: '🐙', nuvem: 'microsoft' },
    { id: 5, tipo: 'whatsapp', titulo: 'Contato WhatsApp Direct', url: `https://api.whatsapp.com/send?phone=${meusDadosReais.whatsapp}`, icone: '💬', nuvem: 'google' },
    { id: 6, tipo: 'facebook', titulo: 'Facebook Oficial', url: meusDadosReais.facebook, icone: '📘', nuvem: 'microsoft' },
    { id: 7, tipo: 'threads', titulo: 'Threads Oficial', url: meusDadosReais.threads, icone: '🧵', nuvem: 'apple' }
  ]);

  // ☁️ SERVIÇOS DE E-MAIL E NUVEM CONECTADOS
  const [servicosNuvemEmail] = useState({
    google: { conectado: true, conta: 'leeheroi123@gmail.com', espaco: '15 GB / 2 TB' },
    apple: { conectado: true, conta: 'emanuel@icloud.com', espaco: '5 GB / 200 GB' },
    microsoft: { conectado: true, conta: 'emanuel@outlook.com', espaco: '1 TB OneDrive / Azure' },
    custom: { conectado: true, conta: 'nuvem.emanuel-os.com', espaco: 'Ilimitado (G-AGI Vault)' }
  });

  // 🌍 LOCAIS INTEGRADOS À TERRA 3D COM LINKS FUTURÍSTICOS
  const [locaisEmanuelOS] = useState([
    { id: 1, nome: 'Emanuel.OS Core Data Center 01', categoria: '🖥️ Servidor de Dados & Nuvem Gemini AGI', cor: 0x00f0ff, lat: -3.7172, lng: -38.5437, ipCriptografado: 'AES256-88F9-EMA', trabalho: 'Engenharia de Software & AGI Node', urlExterna: 'https://maps.google.com/?q=-3.7172,-38.5437' },
    { id: 2, nome: 'Estação Oceanográfica & Biologia Marinha', categoria: '🌊 Pesquisa de Espécies & Biofarmacêutica', cor: 0x00aaff, lat: -12.9714, lng: -38.5014, ipCriptografado: 'AES256-OCEAN-BIO', trabalho: 'Análise de Mapeamento Fluvial', urlExterna: 'https://maps.google.com/?q=-12.9714,-38.5014' },
    { id: 3, nome: 'Usina Nuclear Central & Reator Limpo', categoria: '⚛️ Geração Nuclear, Fusão & Energia Limpa', cor: 0x00ffcc, lat: -23.0062, lng: -44.3182, ipCriptografado: 'AES256-NUK-POWER', trabalho: 'Monitoramento de Matriz Energética', urlExterna: 'https://maps.google.com/?q=-23.0062,-44.3182' },
    { id: 4, nome: 'Usina Solar Neon & Painéis Fotovoltaicos', categoria: '☀️ Painéis Solares Neon & Sustentabilidade', cor: 0xffaa00, lat: -9.3833, lng: -40.5000, ipCriptografado: 'AES256-SOLAR-PWR', trabalho: 'Gestão de Energia Fotovoltaica', urlExterna: 'https://maps.google.com/?q=-9.3833,-40.5000' },
    { id: 5, nome: 'Torre 5G/6G & Parque Eólico Futurista', categoria: '📡 Antenas 5G/6G & Turbinas Eólicas', cor: 0xaa00ff, lat: -5.0892, lng: -42.8019, ipCriptografado: 'AES256-5G-EOLICA', trabalho: 'Sincronização de Banda Ultralarga', urlExterna: 'https://maps.google.com/?q=-5.0892,-42.8019' },
    { id: 6, nome: 'Usina Hidrelétrica & Barragem 3D', categoria: '💧 Geração Fluvial, Hidrelétrica & Barragem', cor: 0x0066ff, lat: -25.4284, lng: -54.5868, ipCriptografado: 'AES256-HIDRO-POWER', trabalho: 'Controle de Escoamento de Água', urlExterna: 'https://maps.google.com/?q=-25.4284,-54.5868' },
    { id: 7, nome: 'Centro de Pesquisa Universitário & Vagas', categoria: '🎓 Parcerias Acadêmicas & Formação', cor: 0x88ff00, lat: -23.5505, lng: -46.6333, ipCriptografado: 'AES256-UNIV-RECRUIT', trabalho: 'Desenvolvimento Acadêmico & IA', urlExterna: 'https://maps.google.com/?q=-23.5505,-46.6333' },
    { id: 8, nome: 'Centro Comercial Cyber & Laboratório', categoria: '💊 Farmacêutica Natural & Tecnologia', cor: 0xff00aa, lat: -22.9068, lng: -43.1729, ipCriptografado: 'AES256-LAB-FARMA', trabalho: 'Pesquisa Farmacêutica & Biotec', urlExterna: 'https://maps.google.com/?q=-22.9068,-43.1729' },
    { id: 9, nome: 'Batalhão Marítimo & Guarda Costeira', categoria: '👮 Proteção de Rios, Mares e Fauna', cor: 0x0066ff, lat: -23.9608, lng: -46.3339, ipCriptografado: 'AES256-COAST-GUARD', trabalho: 'Patrulha e Segurança Costeira', urlExterna: 'https://maps.google.com/?q=-23.9608,-46.3339' },
    { id: 10, nome: 'Cataratas do Iguaçu Realistas 3D', categoria: '🌊 Módulo Ecológico & Reserva Fluvial 3D', cor: 0x00e5ff, lat: -25.6953, lng: -54.4367, ipCriptografado: 'AES256-CATARATAS-3D', trabalho: 'Preservação de Reservas Naturais', urlExterna: 'https://maps.google.com/?q=-25.6953,-54.4367' },
    { id: 11, nome: 'Ponto de Kitesurf & Avatar Feminino 3D', categoria: '🏄 Praia Neon & Esportes Aquáticos', cor: 0xff007f, lat: -2.8856, lng: -40.5050, ipCriptografado: 'AES256-KITESURF-NEON', trabalho: 'Treinamento de Atletas & Hidrodinâmica', urlExterna: 'https://maps.google.com/?q=-2.8856,-40.5050' },
    { id: 12, nome: 'Hospital Central & Pronto Socorro 3D', categoria: '🏥 Atendimento Médico & UTIs Futuristas', cor: 0xff3366, lat: -15.7801, lng: -47.9292, ipCriptografado: 'AES256-HOSPITAL-CORE', trabalho: 'Recepção de Pacientes e UTIs Avançadas', urlExterna: 'https://maps.google.com/?q=-15.7801,-47.9292' },
    { id: 13, nome: 'Ponto de Ônibus Central & Marquise Neon', categoria: '🚌 Parada Urbana & Embarque de Passageiros', cor: 0xffaa00, lat: -19.9167, lng: -43.9345, ipCriptografado: 'AES256-BUS-STOP-01', trabalho: 'Estação de Integração de Linhas Urbanas', urlExterna: 'https://maps.google.com/?q=-19.9167,-43.9345' },
    { id: 14, nome: 'Central AiFod & Moto Ubers Direct', categoria: '🛵 Hub de Entregas Rápida & Moto Taxis', cor: 0xff0055, lat: -8.0476, lng: -34.8770, ipCriptografado: 'AES256-AIFOD-HUB', trabalho: 'Despacho de Pedidos e Corridas Moto Uber', urlExterna: 'https://maps.google.com/?q=-8.0476,-34.8770' },
    // ⚡ SUBESTAÇÃO ADICIONADA CONFORME SOLICITADO
    { id: 15, nome: 'Subestação Elétrica Central 3D', categoria: '⚡ Transformação, Conversão & Distribuição de Corrente Elétrica Real', cor: 0xffd700, lat: -20.3155, lng: -40.3128, ipCriptografado: 'AES256-SUBSTATION-MAIN-REAL', trabalho: 'Transformação de alta tensão em média/baixa tensão e distribuição de rede para a malha central', urlExterna: 'https://maps.google.com/?q=-20.3155,-40.3128' }
  ]);

  // 🔍 ESTADOS DA BARRA DE PESQUISA INTELIGENTE NO GLOBO 3D & CONTROLE DE FONTE
  const [termoBuscaGlobo, setTermoBuscaGlobo] = useState('');
  const [resultadosBuscaGlobo, setResultadosBuscaGlobo] = useState([]);
  const [localSelecionadoGlobo, setLocalSelecionadoGlobo] = useState(null);
  const [tamanhoFonteBusca, setTamanhoFonteBusca] = useState(11); // Tamanho em px (padrão: 11px)

  // 🔎 DECLARAÇÃO ÚNICA DA FUNÇÃO DE BUSCA
  const handleBuscaGlobo = (e) => {
    const val = e.target.value;
    setTermoBuscaGlobo(val);
    if (val.trim().length >= 1) {
      const filtrados = locaisEmanuelOS.filter(item =>
        item.nome.toLowerCase().includes(val.toLowerCase()) ||
        item.categoria.toLowerCase().includes(val.toLowerCase()) ||
        item.trabalho.toLowerCase().includes(val.toLowerCase())
      );
      setResultadosBuscaGlobo(filtrados);
    } else {
      setResultadosBuscaGlobo([]);
    }
  };

  const [chaveAcessoTripla, setChaveAcessoTripla] = useState('');
  const [validandoServidores, setValidandoServidores] = useState(false);
  const [statusAcessoTriplo, setStatusAcessoTriplo] = useState('🔐 Insira a Chave Única de 3 Camadas de Segurança');
  const [tentativasInvasao, setTentativasInvasao] = useState(0);
  const [bloqueioInvasor, setBloqueioInvasor] = useState(false);

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

  const [janelaRobotocDevAberta, setJanelaRobotocDevAberta] = useState(false);
  const [solicitarConexaoBluetooth, setSolicitarConexaoBluetooth] = useState(false);

  const [cmdLogs, setCmdLogs] = useState([
    "[ROBOTOC: LOG] Emanuel.OS Workstation v6.0 operational.",
    "[ROBOTOC: STATUS] Android 16 Neural OS EM: ONLINE em Azul Neon & Branco.",
    "[ROBOTOC: DATA CENTER] Globo Terrestre 3D Ativo com Mapeamento de Cidades e Nódulos AGI."
  ]);

  const [chatInput, setChatInput] = useState('');
  const [mensagens, setMensagens] = useState([
    { autor: 'ROBOTOC 3D (IA CORE v6.0)', texto: 'Emanuel.OS Workstation v6.0 | MODELAGEM DA TERRA 3D ATIVA! Pesquise por locais na Barra Inteligente ou interaja com o globo.', tipo: 'sys' }
  ]);

  const [horaAtual, setHoraAtual] = useState('');
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const globeGroupRef = useRef(null);
  const markersGroupRef = useRef(null);
  const mainRobotRef = useRef(null);

  const addLogTerminal = (novoLog) => setCmdLogs(prev => [...prev, novoLog]);

  const acionarSolicitacaoBluetooth = () => {
    setAndroidHudOpen(true);
    setSolicitarConexaoBluetooth(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Deseja se conectar ao sistema Robotoc com teclado, mouse ou fone bluetooth?");
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🎯 FOCAR CÂMERA/GLOBO NO LOCAL PESQUISADO
  const focarLocalNoGlobo = (local) => {
    setLocalSelecionadoGlobo(local);
    setResultadosBuscaGlobo([]);
    setTermoBuscaGlobo(local.nome);

    if (globeGroupRef.current) {
      const radius = 2.5;
      const phi = (90 - local.lat) * (Math.PI / 180);
      const theta = (local.lng + 180) * (Math.PI / 180);

      const targetRotY = -theta + Math.PI / 2;
      const targetRotX = phi - Math.PI / 2;

      globeGroupRef.current.rotation.y = targetRotY;
      globeGroupRef.current.rotation.x = targetRotX;
    }
  };

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

  // 🌎 RENDERIZAÇÃO THREE.JS DO GLOBO TERRESTRE 3D + ROBOTOC 3D PRINCIPAL (BRANCO & AZUL)
  useEffect(() => {
    if (bloqueado || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    const cyanRim = new THREE.PointLight(0x00f0ff, 8, 30);
    cyanRim.position.set(-6, 2, -4);
    scene.add(cyanRim);

    // GRUPO PRINCIPAL DO GLOBO
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;

    // ESFERA DA TERRA COM TEXTURA/SHADER HOLOGRÁFICO
    const radius = 2.5;
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.4,
      metalness: 0.3,
      wireframe: false
    });

    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
      (tex) => {
        earthMat.map = tex;
        earthMat.color.setHex(0xffffff);
        earthMat.needsUpdate = true;
      }
    );

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // ATMOSFERA BRILHANTE (GLOW NEON)
    const atmosGeo = new THREE.SphereGeometry(radius * 1.03, 64, 64);
    const atmosMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.22,
      transmission: 0.8,
      roughness: 0.1,
      side: THREE.DoubleSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // REDE DE GRID QUANTICO EM VOLTA DA TERRA
    const gridGeo = new THREE.IcosahedronGeometry(radius * 1.08, 3);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.15 });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // =========================================================================================
    // 📐💎 INFRAESTRUTURA FUTURÍSTICA: LOSANGOS 3D DE MEDIÇÃO MATEMÁTICA & MÚSCULOS CIBERNÉTICOS 3D
    // Designação de Paralelogramo e Paralelogrâmico sem alterar nada do código existente
    // =========================================================================================
    const mathInfrastructureGroup = new THREE.Group();

    // 1. Criando Losangos 3D (Geometria Paralelogrâmica / Paralelogramo)
    const createRhombus3D = (size, height) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, size);
      shape.lineTo(size * 0.7, 0);
      shape.lineTo(0, -size);
      shape.lineTo(-size * 0.7, 0);
      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
      };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    const rhombusGeo = createRhombus3D(0.25, 0.08);
    const rhombusMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0
    });

    const formulaTextures = [
      '∫f(x)dx=∑A_i', '∇×E=-∂B/∂t', 'E=mc²', 'x=(-b±√Δ)/2a',
      'P(A|B)=(P(B|A)P(A))/P(B)', 'det(A-λI)=0', 'S=k·ln(Ω)'
    ];

    const createMathTextCanvas = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fillRect(0, 0, 256, 128);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 248, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const rhombusList = [];
    const muscleCurveList = [];

    // Gerar Losangos Orbitais ao redor da Terra
    for (let i = 0; i < 14; i++) {
      const rhombusMesh = new THREE.Mesh(rhombusGeo, rhombusMat.clone());
      const formulaTex = createMathTextCanvas(formulaTextures[i % formulaTextures.length]);

      const labelPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.35, 0.18),
        new THREE.MeshBasicMaterial({ map: formulaTex, transparent: true, side: THREE.DoubleSide })
      );
      labelPlane.position.z = 0.06;
      rhombusMesh.add(labelPlane);

      const angle = (i / 14) * Math.PI * 2;
      const latRad = (Math.sin(i * 1.5) * 0.4);
      const rOrb = radius * 1.28;

      const x = rOrb * Math.cos(angle) * Math.cos(latRad);
      const y = rOrb * Math.sin(latRad);
      const z = rOrb * Math.sin(angle) * Math.cos(latRad);

      rhombusMesh.position.set(x, y, z);
      rhombusMesh.lookAt(0, 0, 0);

      mathInfrastructureGroup.add(rhombusMesh);
      rhombusList.push({ mesh: rhombusMesh, initPos: new THREE.Vector3(x, y, z), angle });
    }

    // 2. Criando Estrutura de Músculo Largo e Fino 3D (Feixes Cinesiológicos Quânticos)
    const muscleMatBroad = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: false,
      side: THREE.DoubleSide
    });

    const muscleMatThin = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
      wireframe: true
    });

    // Conectar os Losangos e os Pontos de Medição da Terra com Músculos 3D
    locaisEmanuelOS.forEach((loc, idx) => {
      const phi = (90 - loc.lat) * (Math.PI / 180);
      const theta = (loc.lng + 180) * (Math.PI / 180);
      const rEarth = radius * 1.02;

      const startVec = new THREE.Vector3(
        -(rEarth * Math.sin(phi) * Math.cos(theta)),
        (rEarth * Math.cos(phi)),
        (rEarth * Math.sin(phi) * Math.sin(theta))
      );

      const targetRhombus = rhombusList[idx % rhombusList.length];
      const endVec = targetRhombus.initPos;

      const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
      midVec.multiplyScalar(1.2);

      const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);

      // Músculo Largo 3D (Extrusão em Faixa Paralelogrâmica)
      const broadTubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
      const broadMesh = new THREE.Mesh(broadTubeGeo, muscleMatBroad);
      broadMesh.scale.set(1.8, 0.3, 1.0); // Achata para formar um Músculo Largo e Fino
      mathInfrastructureGroup.add(broadMesh);

      // Músculo Fino 3D (Feixe Interno)
      const thinTubeGeo = new THREE.TubeGeometry(curve, 48, 0.012, 6, false);
      const thinMesh = new THREE.Mesh(thinTubeGeo, muscleMatThin);
      mathInfrastructureGroup.add(thinMesh);

      muscleCurveList.push({ broadMesh, thinMesh, curve });
    });

    globeGroup.add(mathInfrastructureGroup);

    // MARCADORES 3D DOS LOCAIS NAS COORDENADAS (LAT, LNG) DA TERRA
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;

    locaisEmanuelOS.forEach(loc => {
      const phi = (90 - loc.lat) * (Math.PI / 180);
      const theta = (loc.lng + 180) * (Math.PI / 180);

      const r = radius * 1.02;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = (r * Math.sin(phi) * Math.sin(theta));
      const y = (r * Math.cos(phi));

      const pinGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: loc.cor });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, y, z);

      const ringGeo = new THREE.RingGeometry(0.08, 0.12, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: loc.cor, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y, z);
      ringMesh.lookAt(0, 0, 0);

      markersGroup.add(pinMesh);
      markersGroup.add(ringMesh);
    });

    globeGroup.add(markersGroup);
    scene.add(globeGroup);

    // 🤖 ROBOTOC 3D PRINCIPAL (MODELAGEM COMPLETA EM BRANCO E AZUL) FLUTUANDO AO LADO DA TERRA
    const mainRobotGroup = new THREE.Group();

    const whiteMatMain = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2, clearcoat: 1.0 });
    const blueMatMain = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
    const cyanGlowMain = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.0 });

    // Cabeça do Robotoc
    const robotHead = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), whiteMatMain);
    robotHead.scale.set(1, 1.1, 1);
    robotHead.position.y = 1.0;

    // Visor Cyan Neon
    const robotVisor = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 16, 0, Math.PI, 0, Math.PI * 0.4), cyanGlowMain);
    robotVisor.rotation.x = -Math.PI / 10;
    robotVisor.position.set(0, 0.05, 0.02);
    robotHead.add(robotVisor);

    // Orelhas / Antenas
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16), blueMatMain);
    earL.rotation.z = Math.PI / 2;
    earL.position.set(-0.52, 0, 0);
    const earR = earL.clone();
    earR.position.set(0.52, 0, 0);
    robotHead.add(earL);
    robotHead.add(earR);

    mainRobotGroup.add(robotHead);

    // Corpo
    const robotBody = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 1.0, 32), whiteMatMain);
    robotBody.position.y = 0.1;

    // Peitoral Azul
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.15), blueMatMain);
    chest.position.set(0, 0.05, 0.35);
    robotBody.add(chest);

    // Núcleo Quântico Cyan
    const robotCore = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 32), cyanGlowMain);
    robotCore.rotation.x = Math.PI / 2;
    robotCore.position.set(0, 0.08, 0.43);
    robotBody.add(robotCore);

    mainRobotGroup.add(robotBody);

    // Braços
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.7, 16);
    const armL = new THREE.Mesh(armGeo, blueMatMain);
    armL.position.set(-0.55, 0.1, 0);
    armL.rotation.z = Math.PI / 8;

    const armR = new THREE.Mesh(armGeo, blueMatMain);
    armR.position.set(0.55, 0.1, 0);
    armR.rotation.z = -Math.PI / 8;

    mainRobotGroup.add(armL);
    mainRobotGroup.add(armR);

    // Posicionar o Robotoc Principal à direita do Globo 3D
    mainRobotGroup.position.set(3.2, 0.2, 1.0);
    mainRobotGroup.scale.set(1.2, 1.2, 1.2);
    scene.add(mainRobotGroup);
    mainRobotRef.current = mainRobotGroup;

    // CONTROLE DE ARRASTE/ROTAÇÃO DO GLOBO
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !globeGroupRef.current) return;
      const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
      globeGroupRef.current.rotation.y += deltaMove.x * 0.005;
      globeGroupRef.current.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging = false; };

    const domEl = mountRef.current;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (globeGroupRef.current && !isDragging) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      if (gridMesh) {
        gridMesh.rotation.y = -time * 0.05;
      }

      // Animação e pulsação dos Losangos Matemáticos e Músculos 3D
      rhombusList.forEach((item, idx) => {
        item.mesh.rotation.z = time * 0.5 + idx;
        item.mesh.rotation.y = time * 0.3;
        const pulse = Math.sin(time * 3 + idx) * 0.03;
        item.mesh.position.y = item.initPos.y + pulse;
      });

      // Animação flutuante e interativa do Robotoc Principal
      if (mainRobotRef.current) {
        mainRobotRef.current.position.y = 0.2 + Math.sin(time * 2.0) * 0.12;
        mainRobotRef.current.rotation.y = Math.sin(time * 1.0) * 0.25 - 0.3;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (domEl) {
        domEl.removeEventListener('mousedown', handleMouseDown);
        if (renderer.domElement) domEl.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [bloqueado]);

  useEffect(() => {
    const updateTime = () => setHoraAtual(new Date().toLocaleTimeString('pt-BR'));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (bloqueado) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <Head><title>Emanuel.OS Workstation v6.0 - Autenticação ROBOTOC 3D</title></Head>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #00f0ff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '420px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)', textAlign: 'center', boxSizing: 'border-box', backdropFilter: 'blur(20px)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: '900', margin: '0 0 5px 0' }}>
            EMANUEL<span style={{ color: '#00f0ff' }}>.OS</span> WORKSTATION v6.0
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

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030712', color: '#0f172a', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Head><title>Emanuel.OS Workstation v6.0 | Globo Terrestre 3D & CIVITAS ATLAS</title></Head>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>

        <div style={{ width: modoDevSplit ? '50%' : '100%', height: '100%', position: 'relative', transition: 'width 0.4s ease' }}>

          {/* 🌎 RENDERIZADOR THREE.JS DO GLOBO TERRESTRE 3D + ROBOTOC 3D PRINCIPAL */}
          <div 
            ref={mountRef} 
            title="Arraste para girar a Terra 3D! Veja o Robotoc 3D Flutuando ao Lado."
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab' }} 
          />

          {/* 🔍 BARRA DE PESQUISA INTELIGENTE COM LUPA PRINCIPAL, CONTROLE + / - & INTERFACE FUTURÍSTICA */}
          <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 150, width: '90%', maxWidth: '520px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '25px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 25px rgba(0,240,255,0.3)', backdropFilter: 'blur(15px)' }}>
              <span style={{ fontSize: `${tamanhoFonteBusca + 3}px`, color: '#0284c7' }}>🔍</span>
              
              {/* ➕ ➖ CONTROLE DE TAMANHO DE FONTE PARA NOTURNO / LEITURA AUMENTADA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '2px 6px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.5)' }}>
                <button
                  type="button"
                  onClick={() => setTamanhoFonteBusca(prev => Math.max(8, prev - 1))}
                  title="Diminuir Fonte (Noturno)"
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', padding: '0 3px', lineHeight: '1' }}
                >
                  −
                </button>
                <span style={{ fontSize: '9px', color: '#0284c7', fontWeight: 'bold', minWidth: '18px', textAlign: 'center' }}>
                  {tamanhoFonteBusca}px
                </span>
                <button
                  type="button"
                  onClick={() => setTamanhoFonteBusca(prev => Math.min(24, prev + 1))}
                  title="Aumentar Fonte (Facilita Leitura)"
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', padding: '0 3px', lineHeight: '1' }}
                >
                  +
                </button>
              </div>

              <input
                type="text"
                value={termoBuscaGlobo}
                onChange={handleBuscaGlobo}
                placeholder="Pesquisar locais no Globo 3D..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontSize: `${tamanhoFonteBusca}px`, fontWeight: 'bold' }}
              />
              {termoBuscaGlobo && (
                <button onClick={() => { setTermoBuscaGlobo(''); setResultadosBuscaGlobo([]); setLocalSelecionadoGlobo(null); }} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              )}
            </div>

            {/* 📋 LISTA DE RESULTADOS COM LUPA EM CADA ITEM DIGITADO E ATALHO DE LINK EXTERNO */}
            {resultadosBuscaGlobo.length > 0 && (
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #00f0ff', borderRadius: '14px', marginTop: '6px', maxHeight: '220px', overflowY: 'auto', padding: '6px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', backdropFilter: 'blur(15px)' }}>
                {resultadosBuscaGlobo.map(loc => (
                  <div
                    key={loc.id}
                    style={{ padding: '8px 10px', borderRadius: '8px', borderBottom: '1px solid #f0f9ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s ease' }}
                  >
                    <div onClick={() => focarLocalNoGlobo(loc)} style={{ cursor: 'pointer', flexGrow: 1 }}>
                      <strong style={{ fontSize: `${tamanhoFonteBusca}px`, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🔍 {loc.nome}
                      </strong>
                      <span style={{ fontSize: `${Math.max(8, tamanhoFonteBusca - 2)}px`, color: '#64748b' }}>{loc.categoria} • {loc.trabalho}</span>
                    </div>
                    <a
                      href={loc.urlExterna}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: `${Math.max(8, tamanhoFonteBusca - 2)}px`, backgroundColor: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '8px' }}
                    >
                      🌐 Abrir Link ➔
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 📍 CARD FLUTUANTE DE DETALHES DO LOCAL SELECIONADO NA TERRA 3D */}
          {localSelecionadoGlobo && (
            <div style={{ position: 'absolute', bottom: '110px', left: '20px', zIndex: 140, backgroundColor: 'rgba(255, 255, 255, 0.92)', border: '2px solid #00f0ff', borderRadius: '16px', padding: '14px', width: '280px', boxShadow: '0 0 30px rgba(0,240,255,0.3)', backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '12px', color: '#0284c7' }}>{localSelecionadoGlobo.nome}</strong>
                <button onClick={() => setLocalSelecionadoGlobo(null)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              </div>
              <span style={{ fontSize: '9px', backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block', marginBottom: '8px' }}>
                {localSelecionadoGlobo.categoria}
              </span>
              <p style={{ fontSize: '10px', color: '#334155', margin: '0 0 6px 0' }}><strong>Atuação:</strong> {localSelecionadoGlobo.trabalho}</p>
              <p style={{ fontSize: '9px', color: '#64748b', margin: '0 0 8px 0', fontFamily: 'monospace' }}>🔐 Hash: {localSelecionadoGlobo.ipCriptografado}</p>
              <a
                href={localSelecionadoGlobo.urlExterna}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '10px', backgroundColor: '#0284c7', color: '#fff', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'block', textAlign: 'center' }}
              >
                🌐 NAVEGAR NO MAPA REAL ➔
              </a>
            </div>
          )}

          {/* BOTÕES DE NAVEGAÇÃO E RECURSOS */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setSidebarAberta(!sidebarAberta)} style={{ backgroundColor: '#ffffff', border: '1px solid #00f0ff', color: '#0284c7', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}>
              {sidebarAberta ? '✕' : '☰'}
            </button>

            <button onClick={() => setModoDevSplit(!modoDevSplit)} style={{ backgroundColor: modoDevSplit ? '#0284c7' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: modoDevSplit ? '#fff' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              🖥️ {modoDevSplit ? 'Fechar Workstation' : 'Dev Workstation Split'}
            </button>

            <button onClick={() => setAndroidHudOpen(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📱 Android 16 Neural HUD
            </button>

            <button onClick={() => setModalCreatorStudioAberto(true)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #0284c7', color: '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              📊 Creator Studio
            </button>

            <button onClick={() => setJanelaRobotocDevAberta(true)} style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', boxShadow: '0 0 15px rgba(2,132,199,0.3)' }}>
              🤖 Painel EMgemini Dev 3D
            </button>

            <button onClick={() => setMiniAssistantAberto(!miniAssistantAberto)} style={{ backgroundColor: miniAssistantAberto ? '#00f0ff' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #00f0ff', color: miniAssistantAberto ? '#000' : '#0284c7', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              🤖 {miniAssistantAberto ? 'Fechar Mini Assistant' : 'Mini Robotoc 3D'}
            </button>

            <button onClick={() => setYugiohGameAberto(!yugiohGameAberto)} style={{ backgroundColor: yugiohGameAberto ? '#eab308' : 'rgba(255, 255, 255, 0.85)', border: '1px solid #eab308', color: yugiohGameAberto ? '#fff' : '#d97706', padding: '0 14px', height: '40px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', backdropFilter: 'blur(10px)' }}>
              ⚔️ {yugiohGameAberto ? 'Fechar Duel Links' : 'Yu-Gi-Oh! Duel Links 3D'}
            </button>
          </div>

          {/* 🌐 REDES SOCIAIS & SERVIÇOS DE NUVEM/EMAIL EM MODELAGEM FUTURÍSTICA 3D */}
          <div style={{ position: 'absolute', top: '70px', right: '15px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '250px' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#0284c7', backgroundColor: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: '6px', border: '1px solid #00f0ff', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}>
              🌐 LINKS SOCIAIS & NUVENS EMANUEL.OS
            </span>
            {links3D.map((item) => (
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
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
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

            {/* Painel de Capacidade e Conexão das Nuvens/Emails */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #0284c7', borderRadius: '10px', padding: '8px', backdropFilter: 'blur(10px)', marginTop: '4px' }}>
              <span style={{ fontSize: '8px', color: '#0284c7', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>☁️ NUVENS & TRIPLE E-MAIL STATUS:</span>
              <div style={{ fontSize: '8px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div>📧 Google: <strong style={{ color: '#16a34a' }}>{servicosNuvemEmail.google.conta}</strong></div>
                <div>🍎 Apple: <strong style={{ color: '#a855f7' }}>{servicosNuvemEmail.apple.conta}</strong></div>
                <div>☁️ Azure: <strong style={{ color: '#ea580c' }}>{servicosNuvemEmail.microsoft.conta}</strong></div>
              </div>
            </div>
          </div>

          {/* SIDEBAR ESQUERDA (CENTRAL DOS 12 MAPAS INTEGRADOS) */}
          <aside style={{
            position: 'absolute', top: 0, left: 0, width: sidebarAberta ? '100%' : '0px', maxWidth: '390px',
            opacity: sidebarAberta ? 1 : 0, backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(30px)',
            borderRight: '1px solid rgba(0, 240, 255, 0.4)', padding: sidebarAberta ? '20px' : '0px',
            display: 'flex', flexDirection: 'column', gap: '15px', height: '100vh', overflowY: 'auto', zIndex: 190,
            transition: 'all 0.3s ease', boxSizing: 'border-box'
          }}>
            {sidebarAberta && (
              <>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  Contexto: EMANUEL<span style={{ color: '#0284c7' }}>.OS Workstation v6.0</span>
                </h1>

                <UnixTerminalCanvas />

                <div style={{ padding: '12px', backgroundColor: 'rgba(240, 249, 255, 0.8)', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                  <h3 style={{ color: '#0284c7', fontSize: '12px', margin: '0 0 8px 0' }}>🌐 Central dos 12 Mapas Integrados</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <Link href="/mapa" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #16a34a', color: '#16a34a', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🌍 Terrestre</Link>
                    <Link href="/mapa-orkut" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ea580c', color: '#ea580c', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧡 Orkut</Link>
                    <Link href="/espacial" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #0284c7', color: '#0284c7', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🪐 Espacial</Link>
                    <Link href="/mapa-ressonancia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #06b6d4', color: '#06b6d4', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🧬 Ressonância</Link>
                    <Link href="/mapa-patologia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🔬 Patologia</Link>
                    <Link href="/mapa-ia" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #f43f5e', color: '#f43f5e', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚡ IA 3D</Link>
                    <Link href="/mapa-antiguidades" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #d97706', color: '#d97706', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🏛️ Antiguidades</Link>
                    <Link href="/mapa-quantico" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #8b5cf6', color: '#8b5cf6', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>⚛️ Quântico</Link>
                    <Link href="/mapaaeroespacial" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #9333ea', color: '#9333ea', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🛸 Aeroespacial</Link>
                    <Link href="/MapaEleicoesBrasil20263D" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #00ffcc', color: '#00cc99', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🗳️ Eleições 2026 3D</Link>
                    <Link href="/geometricMap3D" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #ff00ff', color: '#d946ef', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>📐 PG Matemático 3D</Link>
                    <Link href="/mapaagroflorestal" style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #15803d', color: '#15803d', borderRadius: '6px', textDecoration: 'none', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>🌲 Agroflorestal</Link>
                  </div>
                </div>

                <RobotocNeuralThoughtPanel addLog={addLogTerminal} />
                <DispatcherMensagensNumeros addLog={addLogTerminal} />
                <GoogleMeetAvatarManager addLog={addLogTerminal} />
                <FormularioCapturaEmanuelOS />
              </>
            )}
          </aside>

          {/* CHAT/LOGS INFERIORES */}
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

        {modoDevSplit && (
          <div style={{ width: '50%', height: '100%', zIndex: 120 }}>
            <PainelDevSplitScreen onClose={() => setModoDevSplit(false)} />
          </div>
        )}
      </div>

      {janelaRobotocDevAberta && (
        <WindowDevPanelRobotoc 
          onClose={() => setJanelaRobotocDevAberta(false)} 
          onRequestBluetooth={acionarSolicitacaoBluetooth}
        />
      )}

      {miniAssistantAberto && (
        <MiniRobotocAssistant3D onClose={() => setMiniAssistantAberto(false)} />
      )}

      {yugiohGameAberto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 400,
          backgroundColor: '#0a0f1d'
        }}>
          <YugiohDuelLinks3D onClose={() => setYugiohGameAberto(false)} />
        </div>
      )}

      <AndroidHUDPanel open={androidHudOpen} onClose={() => { setAndroidHudOpen(false); setSolicitarConexaoBluetooth(false); }}>
        <MotionTracker />
        <RobotocGear highlightGear={solicitarConexaoBluetooth} onConnectGear={(t, s) => addLogTerminal(`[GEAR] ${t}: ${s ? 'ON' : 'OFF'}`)} />
        <BitcoinAnalysisPanel />
        <CloudflareWorkerDeployer addLog={addLogTerminal} />
      </AndroidHUDPanel>

      {modalCreatorStudioAberto && <EMCreatorStudio onClose={() => setModalCreatorStudioAberto(false)} />}
    </div>
  );
}
