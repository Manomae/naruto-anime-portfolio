import React, { useState, useEffect } from 'react';

interface Message {
  sender: 'user' | 'agent' | 'system';
  text: string;
}

export default function App() {
  const [workspace, setWorkspace] = useState<string>('Carregando...');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'system', text: '🤖 EM Agent Desktop inicializado e pronto para executar tarefas locais.' }
  ]);
  const [inputTask, setInputTask] = useState('');
  const [provider, setProvider] = useState<'cloud' | 'local'>('cloud');
  const [model, setModel] = useState('gemini-3.8-flash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((window as any).emAgentAPI) {
      (window as any).emAgentAPI.getWorkspace().then((path: string) => setWorkspace(path));
    }
  }, []);

  const handleSelectWorkspace = async () => {
    if ((window as any).emAgentAPI) {
      const selected = await (window as any).emAgentAPI.selectWorkspace();
      if (selected) setWorkspace(selected);
    }
  };

  const handleSendTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTask.trim() || loading) return;

    const taskText = inputTask;
    setInputTask('');
    setMessages(prev => [...prev, { sender: 'user', text: taskText }]);
    setLoading(true);

    try {
      setMessages(prev => [...prev, { sender: 'agent', text: `⚙️ Processando tarefa na pasta: ${workspace}...` }]);
      if ((window as any).emAgentAPI) {
        const response = await (window as any).emAgentAPI.runTask(taskText, provider, model);
        setMessages(prev => [...prev, { sender: 'agent', text: response || 'Tarefa concluída com sucesso!' }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { sender: 'system', text: `❌ Erro: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Painel Esquerdo: Chat / Controlo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #334155' }}>
        {/* Topbar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🤖 EM Agent Desktop</span>
          <button onClick={handleSelectWorkspace} style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #475569', cursor: 'pointer' }}>
            📍 Pasta: {workspace}
          </button>
        </div>

        {/* Mensagens do Chat */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: m.sender === 'user' ? '#0284c7' : m.sender === 'agent' ? '#1e293b' : '#334155',
              padding: '10px 14px',
              borderRadius: '8px',
              maxWidth: '80%'
            }}>
              {m.text}
            </div>
          ))}
        </div>

        {/* Input e Opções */}
        <form onSubmit={handleSendTask} style={{ padding: '16px', borderTop: '1px solid #334155', display: 'flex', gap: '10px' }}>
          <select value={provider} onChange={e => setProvider(e.target.value as any)} style={{ padding: '8px', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }}>
            <option value="cloud">Nuvem (Gemini)</option>
            <option value="local">Local (Ollama)</option>
          </select>
          <input
            type="text"
            placeholder="Digite a tarefa a executar..."
            value={inputTask}
            onChange={e => setInputTask(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {loading ? 'A executar...' : 'Enviar'}
          </button>
        </form>
      </div>

      {/* Painel Direito: Monitorização da Pasta */}
      <div style={{ width: '320px', padding: '20px', backgroundColor: '#0b0f19' }}>
        <h3 style={{ marginTop: 0, color: '#94a3b8' }}>📂 Pasta de Trabalho</h3>
        <p style={{ fontSize: '12px', color: '#64748b', wordBreak: 'break-all' }}>{workspace}</p>
        <div style={{ marginTop: '20px', padding: '12px', border: '1px dashed #334155', borderRadius: '6px', fontSize: '13px', color: '#94a3b8' }}>
          Os ficheiros modificados ou criados pelo agente aparecerão atualizados aqui em tempo real.
        </div>
      </div>
    </div>
  );
}