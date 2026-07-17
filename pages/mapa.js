import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Importações dinâmicas para evitar erros de renderização no servidor (SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapaAkatsukiRikudo() {
  // Coordenadas estratégicas simulando pontos globais de interesse da Akatsuki
  const centroMapa = [20.0, 10.0]; 

  const caminhosDePain = [
    {
      nome: "Caminho Deva (Tendō)",
      local: [35.6762, 139.6503], // Tóquio
      status: "Líder - Yahiko",
      jutsu: "Shinra Tensei / Chibaku Tensei",
      descricao: "Controla as forças de atração e repulsão. Alvo principal localizado."
    },
    {
      nome: "Caminho Asura (Shuradō)",
      local: [40.7128, -74.0060], // Nova York
      status: "Ativo",
      jutsu: "Armamento Mecânico & Mísseis Chakraticos",
      descricao: "Corpo cibernético modificado para combate balístico de longo alcance."
    },
    {
      nome: "Caminho Humano (Ningendō)",
      local: [48.8566, 2.3522], // Paris
      status: "Em infiltração",
      jutsu: "Extração de Alma / Leitura de Mente",
      descricao: "Remoção instantânea de informações da mente do alvo através do toque."
    },
    {
      nome: "Caminho Animal (Chikushōdō)",
      local: [-22.9068, -43.1729], // Rio de Janeiro
      status: "Invocação Pronta",
      jutsu: "Kuchiyose no Jutsu (Invocações Múltiplas)",
      descricao: "Capaz de invocar criaturas gigantescas com receptores de chakra pretos."
    },
    {
      nome: "Caminho Preta (Gakidō)",
      local: [51.5074, -0.1278], // Londres
      status: "Defesa Absoluta",
      jutsu: "Fūjutsu Kyūin (Absorção de Ninjutsu)",
      descricao: "Absorve qualquer ataque baseado em chakra puro ou transformações da natureza."
    },
    {
      nome: "Caminho Naraka (Jigokudō)",
      local: [31.2304, 121.4737], // Xangai
      status: "Suporte / Interrogatório",
      jutsu: "Invocação do Rei do Inferno",
      descricao: "Restaura os outros caminhos destruídos e realiza julgamentos de alma."
    }
  ];

  // Injeta estilos CSS customizados para os ícones da Akatsuki se estiver no navegador
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    
    // Criação de um ícone ninja customizado usando CSS puro (Nuvem Vermelha brilhante)
    const criarIconeAkatsuki = () => L.divIcon({
      className: 'custom-akatsuki-marker',
      html: `<div style="
        width: 18px;
        height: 18px;
        background-color: #ff0055;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 15px #ff0055, 0 0 25px #ff0055;
        animation: pulse 1.5s infinite alternate;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.8); box-shadow: 0 0 10px #ff0055; }
          100% { transform: scale(1.2); box-shadow: 0 0 25px #ff00ff, 0 0 35px #ff0055; }
        }
      </style>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    caminhosDePain.forEach(caminho => {
      caminho.icone = criarIconeAkatsuki();
    });
  }

  return (
    <div style={{ height: "100vh", width: "100%", backgroundColor: "#0a0a0c", color: "#fff", fontFamily: "'Courier New', Courier, monospace" }}>
      
      {/* Header Estilo Terminal de Comando do Pain */}
      <header style={{ 
        padding: "15px 30px", 
        background: "linear-gradient(180deg, #120202 0%, #000000 100%)", 
        borderBottom: "3px solid #ff0055",
        boxShadow: "0 4px 20px rgba(255, 0, 85, 0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, color: "#ff0055", letterSpacing: "3px", textShadow: "0 0 10px #ff0055" }}>
              NAGATO DETECTION RADAR // RIKUDŌ PAIN
            </h1>
            <p style={{ margin: "5px 0 0", color: "#8a8a93", fontSize: "12px" }}>
              STATUS DO JUTSU: Ukiyo no Jutsu (Chuva de Detecção) Ativado • Coletando Chakra
            </p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <span style={{ color: "#00ff66", fontWeight: "bold", animation: "blinker 1s linear infinite" }}>🟢 TRANSMISSÃO ONLINE</span>
            <style>{`@keyframes blinker { 50% { opacity: 0; } }`}</style>
          </div>
        </div>
      </header>

      {/* Container do Mapa */}
      <div style={{ height: "calc(100vh - 85px)", width: "100%", position: "relative" }}>
        
        {typeof window !== 'undefined' && (
          <MapContainer center={centroMapa} zoom={2.5} style={{ height: "100%", width: "100%", background: "#0b0c10" }}>
            
            {/* Mapa de fundo ultra escuro premium */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Renderização Dinâmica dos Seis Caminhos */}
            {caminhosDePain.map((caminho, idx) => (
              caminho.icone && (
                <Marker key={idx} position={caminho.local} icon={caminho.icone}>
                  <Popup>
                    <div style={{ 
                      color: "#fff", 
                      backgroundColor: "#111", 
                      padding: "10px", 
                      borderRadius: "5px",
                      border: "1px solid #ff0055",
                      fontFamily: "sans-serif",
                      width: "220px"
                    }}>
                      <h3 style={{ margin: "0 0 5px 0", color: "#ff0055", borderBottom: "1px solid #333", paddingBottom: "5px" }}>
                        {caminho.nome}
                      </h3>
                      <p style={{ margin: "5px 0", fontSize: "12px" }}>
                        <strong>⚡ Jutsu:</strong> <span style={{ color: "#ffaa00" }}>{caminho.jutsu}</span>
                      </p>
                      <p style={{ margin: "5px 0", fontSize: "12px" }}>
                        <strong>🔴 Status:</strong> {caminho.status}
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "11px", color: "#aaa", fontStyle: "italic" }}>
                        "{caminho.descricao}"
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        )}
        
        {/* Painel Lateral Flutuante estilo Interface Hack Ninja */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,
          backgroundColor: "rgba(10, 10, 12, 0.85)",
          border: "1px solid #ff0055",
          padding: "15px",
          borderRadius: "4px",
          backdropFilter: "blur(5px)",
          width: "280px",
          boxShadow: "0 0 20px rgba(0,0,0,0.8)"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#ff0055", fontSize: "14px" }}>LOG DE SINCRONIZAÇÃO:</h4>
          <ul style={{ margin: 0, paddingLeft: "15px", fontSize: "11px", color: "#00ffbb", lineHeight: "1.6" }}>
            <li>Rinnegan linkado aos 6 corpos... OK</li>
            <li>Receptores de Chakra: Estáveis</li>
            <li>Sinal de satélite da Chuva: 98.7%</li>
            <li>"O mundo conhecerá a dor."</li>
          </ul>
        </div>

      </div>
    </div>
  );
}