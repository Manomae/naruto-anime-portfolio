// =========================================================================================
// 🧠 BANCO DE DADOS & MOTOR DE AUTO-COMPLEMENTO - EMANUEL.OS (TRIE DATA STRUCTURE)
// =========================================================================================

// 📚 1. Grande Banco de DADOS de Palavras-Chave do Sistema
export const BANCO_PALAVRAS_ROBOTOC = [
  // --- Comandos & Navegação do Sistema ---
  "ajuda", "algoritmo", "antiguidades", "aeroespacial", "assistente", "autenticacao",
  "bluetooth", "banco de dados", "bitcoin", "bugfix", "buscar",
  "camera", "chave", "chat", "cloudflare", "codigo", "creator studio",
  "desenvolvedor", "deploy", "diagnostico", "duvida",
  "email", "eleicoes", "espacial", "explicar",
  "funcao", "fechar", "formulario",
  "google meet", "gear", "glass keyboard", "github",
  "hud", "headset", "holografico",
  "index", "instagram", "ia 3d",
  "javascript", "jspdf",
  "link", "localizar", "links sociais",
  "mapa", "matematica", "mensagaria", "mojo", "mouse 3d",
  "neural", "nim", "notepad",
  "onde fica", "onde esta", "orkut", "otimizar",
  "patologia", "perifericos", "power shell", "progressao geometrica",
  "qr code", "quantico",
  "ressonancia", "reuniao", "robotoc",
  "seguranca", "sincronizar", "sintaxe", "sistema", "split screen",
  "teclado", "telefone", "telegram", "terrestre", "terminal", "ticons",
  "unix", "url",
  "video", "vitrine 3d", "visor",
  "webgl", "whatsapp", "workstation",
  "yu-gi-oh", "youtube", "zig",

  // --- Palavras Comuns em Português para Agilizar Digitação ---
  "abrir", "acessar", "adicionar", "atualizar", "analisar",
  "como", "configurar", "conectar", "corrigir",
  "desconectar", "download", "editar", "executar", "enviar",
  "fazer", "gerar", "iniciar", "limpar", "mostrar",
  "para", "pesquisar", "qual", "quais", "resolver", "salvar", "status"
];

// 🌲 2. Estrutura de Dados Trie para Busca Eficiente em Tempo Real
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class TrieAutoCompleter {
  constructor() {
    this.root = new TrieNode();
    this.carregarPalavras(BANCO_PALAVRAS_ROBOTOC);
  }

  // Insere uma palavra na árvore Trie
  inserir(palavra) {
    let node = this.root;
    const palavraClean = palavra.toLowerCase().trim();
    for (let char of palavraClean) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // Carrega lista inicial
  carregarPalavras(lista) {
    lista.forEach(p => this.inserir(p));
  }

  // Coleta sugestões a partir de um nó
  _coletarSugestoes(node, prefixo, resultados, limite) {
    if (resultados.length >= limite) return;
    if (node.isEndOfWord) {
      resultados.push(prefixo);
    }
    for (let char in node.children) {
      this._coletarSugestoes(node.children[char], prefixo + char, resultados, limite);
    }
  }

  // 🔍 Método Principal: Busca sugestões para as letras digitadas
  buscarCompletar(prefixo, limite = 5) {
    if (!prefixo || prefixo.trim().length === 0) return [];
    
    let node = this.root;
    const prefixoClean = prefixo.toLowerCase().trim();

    for (let char of prefixoClean) {
      if (!node.children[char]) {
        return []; // Nenhuma correspondência encontrada
      }
      node = node.children[char];
    }

    const resultados = [];
    this._coletarSugestoes(node, prefixoClean, resultados, limite);
    return resultados;
  }

  // Permite adicionar dinamicamente novas palavras em tempo de execução
  adicionarNovaPalavra(palavra) {
    if (palavra && !BANCO_PALAVRAS_ROBOTOC.includes(palavra.toLowerCase())) {
      BANCO_PALAVRAS_ROBOTOC.push(palavra.toLowerCase());
      this.inserir(palavra);
    }
  }
}

// Instância única para reutilização rápida (Singleton)
export const autoCompleterEngine = new TrieAutoCompleter();