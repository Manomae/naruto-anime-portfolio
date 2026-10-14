import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Inicialização da API com a tua chave
const ai = new GoogleGenAI({ apiKey: 'AIzaSyBZrQ4oocaGKhZID6pD1Sb5yHAmST3RvoM' });

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

export const CameraXArquivo = {

  /**
   * 1. Análise de Imagem (Placas de carros, trânsito, matemática, objetos)
   */
  async analisarImagem(imagePath, userPrompt, mimeType = 'image/jpeg') {
    try {
      const imagePart = fileToGenerativePart(imagePath, mimeType);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          userPrompt,
          imagePart
        ],
        config: {
          systemInstruction: 'Você é o assistente inteligente "Mini Robotoc 3D". Analise a imagem em detalhe, detete objetos perdidos, leia placas de trânsito e de veículos com precisão, resolva problemas matemáticos e responda às perguntas do utilizador.'
        }
      });

      return {
        sucesso: true,
        resposta: response.text
      };

    } catch (error) {
      console.error("Erro na análise de imagem pelo Mini Robotoc:", error);
      return { sucesso: false, erro: error.message };
    }
  },

  /**
   * 2. Edição de Documentos e Geração de Novo Ficheiro
   */
  async editarEGerarArquivo(inputFilePath, outputFilePath, instrucaoEdicao, mimeType) {
    try {
      const filePart = fileToGenerativePart(inputFilePath, mimeType);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          instrucaoEdicao,
          filePart
        ],
        config: {
          systemInstruction: 'Você é a unidade de processamento de documentos do Mini Robotoc. Leia o ficheiro fornecido, aplique estritamente as edições solicitadas pelo utilizador e devolva apenas o texto final completo.'
        }
      });

      const conteudoGerado = response.text;

      const dir = path.dirname(outputFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputFilePath, conteudoGerado, 'utf-8');

      return {
        sucesso: true,
        caminhoArquivoGerado: outputFilePath,
        conteudo: conteudoGerado
      };

    } catch (error) {
      console.error("Erro ao editar e gerar ficheiro pelo Mini Robotoc:", error);
      return { sucesso: false, erro: error.message };
    }
  }
};