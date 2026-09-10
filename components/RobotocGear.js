import React, { useState } from 'react';

export default function RobotocGear({ onConnectGear }) {
  const [activeConnections, setActiveConnections] = useState({
    headset: false,
    mouse: false,
    keyboard: false
  });

  const toggleGear = (type) => {
    const newState = !activeConnections[type];
    setActiveConnections(prev => ({ ...prev, [type]: newState }));
    if (onConnectGear) onConnectGear(type, newState);
  };

  return (
    <div style={{
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '16px',
      padding: '14px',
      color: '#fff',
      fontFamily: 'sans-serif',
      margin: '10px 0'
    }}>
      <h4 style={{ color: '#00f0ff', margin: '0 0 8px 0', fontSize: '11px', textAlign: 'center' }}>
        🎧 CONEXÕES DE PERIFÉRICOS BLUETOOTH (ROBOTOC GEAR)
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {/* Fone Holográfico */}
        <button
          onClick={() => toggleGear('headset')}
          style={{
            padding: '10px 6px',
            backgroundColor: activeConnections.headset ? 'rgba(0, 240, 255, 0.2)' : 'rgba(15, 23, 42, 0.8)',
            border: `1px solid ${activeConnections.headset ? '#00f0ff' : '#334155'}`,
            borderRadius: '10px',
            color: activeConnections.headset ? '#00f0ff' : '#94a3b8',
            fontSize: '9px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🎧 Headset AI
          <span style={{ display: 'block', fontSize: '7px', color: activeConnections.headset ? '#4ade80' : '#ef4444', marginTop: '4px' }}>
            {activeConnections.headset ? '● ÁUDIO ON' : '○ OFF'}
          </span>
        </button>

        {/* Mouse Laser */}
        <button
          onClick={() => toggleGear('mouse')}
          style={{
            padding: '10px 6px',
            backgroundColor: activeConnections.mouse ? 'rgba(255, 0, 127, 0.2)' : 'rgba(15, 23, 42, 0.8)',
            border: `1px solid ${activeConnections.mouse ? '#ff007f' : '#334155'}`,
            borderRadius: '10px',
            color: activeConnections.mouse ? '#ff007f' : '#94a3b8',
            fontSize: '9px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🖱️ Mouse Quantum
          <span style={{ display: 'block', fontSize: '7px', color: activeConnections.mouse ? '#4ade80' : '#ef4444', marginTop: '4px' }}>
            {activeConnections.mouse ? '● LINKED' : '○ OFF'}
          </span>
        </button>

        {/* Teclado Bluetooth */}
        <button
          onClick={() => toggleGear('keyboard')}
          style={{
            padding: '10px 6px',
            backgroundColor: activeConnections.keyboard ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.8)',
            border: `1px solid ${activeConnections.keyboard ? '#a855f7' : '#334155'}`,
            borderRadius: '10px',
            color: activeConnections.keyboard ? '#c084fc' : '#94a3b8',
            fontSize: '9px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ⌨️ Teclado BT
          <span style={{ display: 'block', fontSize: '7px', color: activeConnections.keyboard ? '#4ade80' : '#ef4444', marginTop: '4px' }}>
            {activeConnections.keyboard ? '● SYNCED' : '○ OFF'}
          </span>
        </button>
      </div>
    </div>
  );
}