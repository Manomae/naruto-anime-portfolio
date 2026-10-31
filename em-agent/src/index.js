#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const engine_1 = require("./engine");
const program = new commander_1.Command();
program
    .name('em-agent')
    .description('EM Agent - Agente de IA de código aberto para desktop')
    .version('1.0.0')
    .argument('<tarefa>', 'Descrição da tarefa a ser executada na pasta atual')
    .option('-m, --model <nome>', 'Modelo a ser utilizado', 'gemini-3.8-flash')
    .option('-p, --provider <tipo>', 'Provedor (local ou cloud)', 'cloud')
    .action(async (task, options) => {
    const workspaceDir = process.cwd();
    await (0, engine_1.runEMAgent)({
        task,
        workspaceDir,
        provider: options.provider,
        modelName: options.model
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map