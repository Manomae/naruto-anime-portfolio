#!/usr/bin/env node
import { Command } from 'commander';
import { runEMAgent } from './engine.js';
const program = new Command();
program
    .name('em-agent')
    .description('EM Agent - Agente de IA de código aberto para desktop')
    .version('1.0.0')
    .argument('<tarefa>', 'Descrição da tarefa a ser executada na pasta atual')
    .option('-m, --model <nome>', 'Modelo a ser utilizado', 'gemini-3.8-flash')
    .option('-p, --provider <tipo>', 'Provedor (local ou cloud)', 'cloud')
    .action(async (task, options) => {
    const workspaceDir = process.cwd();
    await runEMAgent({
        task,
        workspaceDir,
        provider: options.provider,
        modelName: options.model
    });
});
program.parse(process.argv);
