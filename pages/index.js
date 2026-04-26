// Lista de contatos extraída da sua agenda selecionada
const contatosSelecionados = [
  { id: 1, nome: "Mãe", status: "online", cla: "Uzumaki" },
  { id: 2, nome: "Lorena Calderón", status: "offline", cla: "Hyuuga" },
  { id: 3, nome: "Gabriel", status: "online", cla: "Uchiha" },
  { id: 4, nome: "Jeferson", status: "online", cla: "Nara" },
  { id: 5, nome: "Juliana Luz 🙏🙏", status: "away", cla: "Haruno" },
  { id: 6, nome: "Roney de Oliveira Lima", status: "online", cla: "Aburame" },
  { id: 7, nome: "Tia Lidia", status: "offline", cla: "Senju" }
];

// Componente de Lista de Contatos para sua Sidebar
function ListaContatos() {
  return (
    <div className="ninja-contacts">
      <p className="section-title">NINJAS DISPONÍVEIS PARA CONEXÃO</p>
      {contatosSelecionados.map(contato => (
        <div key={contato.id} className={`contact-card ${contato.status}`}>
          <div className="status-indicator"></div>
          <div className="contact-info">
            <span className="contact-name">{contato.nome}</span>
            <span className="contact-cla">Clã {contato.cla}</span>
          </div>
          <button className="connect-btn" onClick={() => alert(`Iniciando conexão segura com ${contato.nome}...`)}>
            Conectar
          </button>
        </div>
      ))}

      <style jsx>{`
        .ninja-contacts { padding: 10px; }
        .contact-card {
          display: flex;
          align-items: center;
          padding: 10px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          margin-bottom: 8px;
          border: 1px solid rgba(255, 145, 0, 0.1);
        }
        .contact-info { flex: 1; margin-left: 10px; }
        .contact-name { display: block; font-size: 0.9rem; font-weight: bold; }
        .contact-cla { font-size: 0.7rem; color: #888; text-transform: uppercase; }
        
        .status-indicator {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .online .status-indicator { background: #00ff88; box-shadow: 0 0 5px #00ff88; }
        .offline .status-indicator { background: #555; }
        .away .status-indicator { background: #ffcc00; }

        .connect-btn {
          background: transparent;
          border: 1px solid #ff9100;
          color: #ff9100;
          padding: 4px 8px;
          border-radius: 5px;
          font-size: 0.7rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .connect-btn:hover { background: #ff9100; color: black; }
      `}</style>
    </div>
  );
}
