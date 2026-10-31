import { runEMAgent } from '../../em-agent/dist/engine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { task, provider, model } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'A tarefa é obrigatória.' });
  }

  try {
    const result = await runEMAgent({
      task,
      workspaceDir: process.cwd(), // Define a pasta raiz do seu projeto como workspace
      provider: provider || 'cloud',
      modelName: model || 'gemini-3.8-flash',
    });

    return res.status(200).json({ success: true, message: result || 'Tarefa executada!' });
  } catch (error) {
    console.error('Erro no agente:', error);
    return res.status(500).json({ error: error.message || 'Erro ao executar o agente.' });
  }
}