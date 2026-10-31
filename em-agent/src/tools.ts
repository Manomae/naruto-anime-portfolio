import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function validatePath(targetPath: string, workspaceDir: string): string {
  const absolutePath = path.resolve(workspaceDir, targetPath);
  if (!absolutePath.startsWith(workspaceDir)) {
    throw new Error(`Acesso negado: O caminho "${targetPath}" está fora da pasta ativa.`);
  }
  return absolutePath;
}

export const toolsDefinition = [
  {
    name: 'read_file',
    description: 'Lê o conteúdo textual de um ficheiro na pasta de trabalho.',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Caminho relativo do ficheiro (ex: src/app.js).' }
      },
      required: ['filePath']
    }
  },
  {
    name: 'write_file',
    description: 'Cria ou sobrescreve um ficheiro no diretório de trabalho.',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Caminho relativo do ficheiro.' },
        content: { type: 'string', description: 'Conteúdo completo do ficheiro.' }
      },
      required: ['filePath', 'content']
    }
  },
  {
    name: 'run_command',
    description: 'Executa um comando de terminal na pasta de trabalho atual.',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Comando a ser executado.' }
      },
      required: ['command']
    }
  }
];

export async function executeTool(name: string, args: any, workspaceDir: string): Promise<string> {
  try {
    switch (name) {
      case 'read_file': {
        const fullPath = validatePath(args.filePath, workspaceDir);
        return await fs.readFile(fullPath, 'utf-8');
      }
      case 'write_file': {
        const fullPath = validatePath(args.filePath, workspaceDir);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, args.content, 'utf-8');
        return `[OK] Ficheiro "${args.filePath}" gravado com sucesso.`;
      }
      case 'run_command': {
        const { stdout, stderr } = await execAsync(args.command, { cwd: workspaceDir });
        return stdout || stderr || '[OK] Comando executado sem retorno de texto.';
      }
      default:
        throw new Error(`Ferramenta desconhecida: ${name}`);
    }
  } catch (error: any) {
    return `[ERRO] ${error.message}`;
  }
}