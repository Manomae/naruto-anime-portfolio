import { CameraXArquivo } from './cameraxarquivo.mjs';

async function rodarExemplos() {
  console.log("=== INICIANDO PROCESSAMENTO COM MINI ROBOTOC & GEMINI ===");

  // 1. Exemplo de Análise de Imagem (Leitura de placas, matemática, objetos perdidos)
  console.log("\n--- Executando Análise de Imagem ---");
  const resultadoImagem = await CameraXArquivo.analisarImagem(
    './uploads/foto_rua.jpg', // Coloque o caminho da sua imagem aqui
    'Qual é a placa do veículo e quais objetos ou sinalizações você consegue detectar na imagem?'
  );

  if (resultadoImagem.sucesso) {
    console.log("Resposta do Robotoc:\n", resultadoImagem.resposta);
  } else {
    console.error("Erro na análise da imagem:", resultadoImagem.erro);
  }

  // 2. Exemplo de Edição e Geração de Novo Arquivo (PDF / Documentos / Texto)
  console.log("\n--- Editando e Gerando Novo Arquivo ---");
  const resultadoEdicao = await CameraXArquivo.editarEGerarArquivo(
    './documentos/contrato.txt', // Arquivo de entrada
    './documentos/contrato_editado.txt', // Novo arquivo editado a ser gerado
    'Revise o texto, corrija erros de digitação e adicione um resumo ao final.',
    'application/pdf'
  );

  if (resultadoEdicao.sucesso) {
    console.log(`\nNovo arquivo criado com sucesso em: ${resultadoEdicao.caminhoArquivoGerado}`);
  } else {
    console.error("Erro ao gerar novo arquivo:", resultadoEdicao.erro);
  }
}

// Executa o script
rodarExemplos();