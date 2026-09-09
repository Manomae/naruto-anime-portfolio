import React, { useState } from 'react';

export default function GlassKeyboard3D({ onKeyPress }) {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div style={{
      backgroundColor: 'rgba(2, 6, 23, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)',
      margin: '10px 0'
    }}>
      <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 'bold', display: 'block', marginBottom: '10px', textAlign: 'center' }}>
        ⌨️ TECLADO HOLOGRÁFICO LCD GLASS 3D
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '6px' }}>
            {row.map((char) => (
              <button
                key={char}
                onClick={() => onKeyPress && onKeyPress(char)}
                style={{
                  width: '32px',
                  height: '36px',
                  backgroundColor: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.5)',
                  borderRadius: '6px',
                  color: '#00f0ff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  boxShadow: 'inset 0 0 10px rgba(0, 240, 255, 0.2), 0 4px 10px rgba(0,0,0,0.5)',
                  transition: 'all 0.15s ease'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(2px)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.3)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.08)';
                }}
              >
                {char}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}