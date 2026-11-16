/**
 * Inteligencia Robotoc.js - Módulo de IA Multimodal e Voz Futurística
 * Desenvolvido para o ecossistema EmanuelsilvART
 */

import { GoogleGenAI } from '@google/genai';

export class InteligenciaRobotoc {
  constructor(apiKey) {
    // Inicializa o SDK do Google GenAI com a chave fornecida
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    this.isListening = false;
    this.recognition = null;
    this.setupSpeechRecognition();
  }

  /**
   * Configura o Reconhecimento de Voz Futurístico (Web Speech API)
   */
  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'pt-BR';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  /**
   * Ativa o microfone futurístico e retorna a transcrição do áudio do usuário
   */
  ouvirMicrofoneFuturistico(onResult, onError, onStart) {
    if (!this.recognition) {
      if (onError) onError("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[0].isFinal) {
        this.isListening = false;
        if (onResult) onResult(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  /**
   * Função central de raciocínio do Robotoc para qualquer assunto do dia a dia
   */
  async processarMensagemRobotoc(perguntaUsuario, contextoExtra = "") {
    try {
      const promptSistema = `
        Você é o Mini Robotoc 3D, um assistente de inteligência artificial futurista, amigável, inteligente e carismático criado por Emanuel da Silva (EmanuelsilvART).
        Você entende absolutamente tudo sobre o dia a dia: futebol, lazer, comidas, descanso, trabalho, estudo, faculdade, arquitetura (casas, apartamentos, quintal), ruas, lugares, documentos e assuntos em geral.
        Responda sempre com clareza, precisão, utilidade e um toque tecnológico/futurista divertido.
        ${contextoExtra ? `Contexto adicional: ${contextoExtra}` : ""}
      `;

      // Atualizado para utilizar o modelo gemini-3.8-flash compatível e atual
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${promptSistema}\n\nPergunta do usuário: ${perguntaUsuario}` }] }
        ]
      });

      return {
        sucesso: true,
        resposta: response.text || "Bip-bop! Processado com sucesso, mas sem texto retornado."
      };
    } catch (error) {
      console.error("Erro na inteligência Robotoc:", error);
      return {
        sucesso: false,
        resposta: "Erro crítico nos circuitos do Robotoc! Verifique sua chave de API."
      };
    }
  }

  /**
   * Função buscarobotoc: Pesquisa informações na web e traz explicação + imagens/links relevantes
   */
  async buscarobotoc(termoBusca) {
    try {
      // Prompt instruindo o modelo a realizar a busca e estruturar a resposta com dados ricos, explicações e imagens ilustrativas
      const promptBusca = `
        Pesquise e traga informações completas e atualizadas sobre: "${termoBusca}".
        Forneça:
        1. Uma explicação detalhada e clara.
        2. Curiosidades ou detalhes úteis sobre o assunto.
        3. Se possível, sugira termos de busca ou URLs de imagens públicas relevantes (como Wikimedia Commons ou descrições visuais vívidas) que ilustrem o tema.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: promptBusca }] },
        ],
        config: {
          // Ativa ferramentas de busca na web integradas
          tools: [{ googleSearch: {} }],
        }
      });

      // Extrai metadados de busca (grounding) se disponíveis
      const searchMetadata = response.candidates?.[0]?.groundingMetadata;
      const webChunks = searchMetadata?.groundingChunks || [];
      const sources = webChunks.map(chunk => ({
        titulo: chunk.web?.title || 'Fonte Web',
        url: chunk.web?.uri || '#'
      }));

      return {
        sucesso: true,
        termo: termoBusca,
        explicacao: response.text,
        fontes: sources,
        // Sugere uma imagem baseada em busca visual ou placeholder ilustrativo inteligente
        imagemSugerida: `https://source.unsplash.com/featured/?${encodeURIComponent(termoBusca)}`
      };
    } catch (error) {
      console.error("Erro na função buscarobotoc:", error);
      return {
        sucesso: false,
        explicacao: "Os radares da internet do Robotoc falharam momentaneamente ao buscar essa informação."
      };
    }
  }
}