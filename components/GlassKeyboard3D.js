import React, { useState, useEffect } from 'react';

export default function GlassKeyboard3D({ onKeyPress }) {
  const [activeKey, setActiveKey] = useState(null);

  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Space', 'Backspace']
  ];

  const handleTriggerKey = (char) => {
    setActiveKey(char.toUpperCase());
    setTimeout(() => setActiveKey(null), 200); // Efeito visual de brilho rápido
    if (onKeyPress) onKeyPress(char);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = e.key;
      if (key === ' ') key = 'Space';
      handleTriggerKey(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '16px',
      padding: '12px',
      boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)',
      margin: '10px 0'
    }}>
      <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '8px', textAlign: 'center', letterSpacing: '1px' }}>
        ⌨️ TECLADO HOLOGRÁFICO LCD GLASS 3D (NEON SYNC)
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '4px' }}>
            {row.map((char) => {
              const isActive = activeKey === char.toUpperCase();
              const isWide = char === 'Space' || char === 'Backspace';

              return (
                <button
                  key={char}
                  onClick={() => handleTriggerKey(char)}
                  style={{
                    width: isWide ? '70px' : '28px',
                    height: '32px',
                    backgroundColor: isActive ? '#00f0ff' : 'rgba(0, 240, 255, 0.08)',
                    border: `1px solid ${isActive ? '#fff' : 'rgba(0, 240, 255, 0.5)'}`,
                    borderRadius: '6px',
                    color: isActive ? '#000' : '#00f0ff',
                    fontWeight: 'bold',
                    fontSize: isWide ? '9px' : '11px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    boxShadow: isActive ? '0 0 20px #00f0ff, inset 0 0 10px #fff' : 'inset 0 0 10px rgba(0, 240, 255, 0.2)',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {char === 'Space' ? 'ESPAÇO' : char === 'Backspace' ? '⌫' : char}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}