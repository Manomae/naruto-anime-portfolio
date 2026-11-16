export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { query } = req.body;

  try {
    // Exemplo de integração ou tratamento da pergunta com busca na web
    // Aqui você pode usar uma API de busca externa ou o SDK do Google com suporte a ferramentas
    const respostaFormatada = `Resultado da busca na internet para: "${query}". (Integrado com sucesso ao Emanuel.OS)`;
    
    return res.status(200).json({ success: true, resposta: respostaFormatada });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}