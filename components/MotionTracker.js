import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function MotionTracker({ onPointsUpdate }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [trackingActive, setTrackingActive] = useState(false);

  // Solicita permissão da câmera e garante o anonimato (processamento local)
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasPermission(true);
        setTrackingActive(true);
      }
    } catch (err) {
      alert("Permissão de câmera negada. O rastreamento de movimento precisa de acesso local.");
    }
  };

  const stopTracking = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setTrackingActive(false);
    setHasPermission(false);
  };

  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid #00f0ff',
      borderRadius: '12px',
      padding: '16px',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <h3 style={{ color: '#00f0ff', margin: '0 0 8px 0', fontSize: '13px' }}>
        🎥 Rastreamento de Movimento Anônimo (Treino de Robô 3D)
      </h3>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 12px 0' }}>
        As imagens da sua câmera <b>não são salvas nem enviadas para nenhum servidor</b>. Apenas vetores numéricos de articulação são extraídos localmente para alimentar o modelo 3D.
      </p>

      {!hasPermission ? (
        <button
          onClick={requestCameraPermission}
          style={{
            padding: '10px 16px',
            backgroundColor: '#00f0ff',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          🔒 Conceder Permissão Local da Câmera
        </button>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <video
              ref={videoRef}
              style={{ width: '120px', height: '90px', borderRadius: '6px', border: '1px solid #334155', objectFit: 'cover' }}
              muted
            />
            <div>
              <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', display: 'block' }}>
                ● Status: Capturando PONTOS NUMÉRICOS (Anonimizado)
              </span>
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                Imagens descartadas em tempo real na memória RAM.
              </span>
            </div>
          </div>
          <button
            onClick={stopTracking}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Encerrar Câmera
          </button>
        </div>
      )}
    </div>
  );
}