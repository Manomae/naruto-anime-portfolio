export default function Aeroespacial() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#050510',
      color: '#00ffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1>🚀 Central Aeroespacial</h1>
      <p>Página em desenvolvimento para integração de mapas estelares e IA!</p>
      <a href="/mapa-ia" style={{ color: '#ff007f', marginTop: '20px' }}>← Voltar para o Mapa IA</a>
    </div>
  );
}