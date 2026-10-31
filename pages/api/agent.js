import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  const { task, provider, modelName } = req.body || {};

  if (!task || typeof task !== 'string') {
    return res.status(400).json({ error: 'Comando inválido ou não fornecido.' });
  }

  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Chave API do Gemini não configurada nas Variáveis de Ambiente.'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = modelName || 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: task,
    });

    const replyText = response.text || 'Tarefa processada com sucesso pelo agente.';

    return res.status(200).json({
      success: true,
      message: replyText,
      provider: provider || 'cloud',
    });
  } catch (error) {
    console.error('Erro na execução do EM Agent:', error);
    return res.status(500).json({
      error: error.message || 'Erro interno ao processar a tarefa no agente.'
    });
  }
}