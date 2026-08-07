// pages/api/gerar-midia.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt, tipo } = req.body;

  try {
    // Exemplo 1: Geração Real de Imagens via DALL-E (OpenAI)
    if (tipo === 'crie_imagem') {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024'
        })
      });

      const data = await response.json();

      // Verificação de segurança contra erros de créditos/chave da OpenAI
      if (!response.ok || !data.data || !data.data[0]) {
        console.error('Erro retornado pela OpenAI:', data.error?.message || data);
        return res.status(400).json({ 
          error: data.error?.message || 'Falha ao gerar imagem com a OpenAI.' 
        });
      }

      const imageUrl = data.data[0].url;

      return res.status(200).json({ 
        success: true, 
        url: imageUrl, 
        mensagem: 'Imagem gerada com sucesso via DALL-E 3.' 
      });
    }

    // Exemplo 2: Busca de GIFs Reais via Giphy API
    if (tipo === 'crie_gif') {
      const giphyApiKey = process.env.GIPHY_API_KEY;
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(prompt)}&limit=1`
      );
      const data = await response.json();

      if (!response.ok || !data.data || !data.data[0]) {
        return res.status(400).json({
          error: 'Nenhum GIF encontrado para a busca especificada.'
        });
      }

      const gifUrl = data.data[0]?.images?.original?.url;

      return res.status(200).json({
        success: true,
        url: gifUrl,
        mensagem: 'GIF encontrado e carregado via Giphy API.'
      });
    }

    return res.status(400).json({ error: 'Tipo de ação não suportado' });

  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Falha ao processar solicitação de mídia real' });
  }
}