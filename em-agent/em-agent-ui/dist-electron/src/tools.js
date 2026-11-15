"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsDefinition = void 0;
exports.executeTool = executeTool;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function validatePath(targetPath, workspaceDir) {
    const absolutePath = path_1.default.resolve(workspaceDir, targetPath);
    if (!absolutePath.startsWith(workspaceDir)) {
        throw new Error(`Acesso negado: O caminho "${targetPath}" está fora da pasta ativa.`);
    }
    return absolutePath;
}
exports.toolsDefinition = [
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
async function executeTool(name, args, workspaceDir) {
    try {
        switch (name) {
            case 'read_file': {
                const fullPath = validatePath(args.filePath, workspaceDir);
                return await promises_1.default.readFile(fullPath, 'utf-8');
            }
            case 'write_file': {
                const fullPath = validatePath(args.filePath, workspaceDir);
                await promises_1.default.mkdir(path_1.default.dirname(fullPath), { recursive: true });
                await promises_1.default.writeFile(fullPath, args.content, 'utf-8');
                return `[OK] Ficheiro "${args.filePath}" gravado com sucesso.`;
            }
            case 'run_command': {
                const { stdout, stderr } = await execAsync(args.command, { cwd: workspaceDir });
                return stdout || stderr || '[OK] Comando executado sem retorno de texto.';
            }
            default:
                throw new Error(`Ferramenta desconhecida: ${name}`);
        }
    }
    catch (error) {
        return `[ERRO] ${error.message}`;
    }
}
