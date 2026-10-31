import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import ora from 'ora';
import chalk from 'chalk';
import { toolsDefinition, executeTool } from './tools.js';
export async function runEMAgent({ task, workspaceDir, provider, modelName }) {
    console.log(chalk.bold.cyan(`\n🤖 EM Agent ativado`));
    console.log(chalk.gray(`Pasta ativa: ${workspaceDir}`));
    console.log(chalk.gray(`Provedor: ${provider} (${modelName})\n`));
    // --- EXECUÇÃO VIA NUVEM (GEMINI) ---
    if (provider === 'cloud') {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error(chalk.red('Erro: Variável GEMINI_API_KEY não configurada no ambiente ou no arquivo .env.'));
            return;
        }
        const ai = new GoogleGenAI({ apiKey });
        const targetModel = modelName && modelName !== 'qwen2.5-coder:7b' ? modelName : 'gemini-3.8-flash';
        const spinner = ora('Processando tarefa na nuvem...').start();
        try {
            const response = await ai.models.generateContent({
                model: targetModel,
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `Tarefa: ${task}\nPasta de trabalho atual: ${workspaceDir}` }]
                    }
                ],
                config: {
                    systemInstruction: 'Você é o EM Agent, um agente de IA de código aberto para desktop. Execute tarefas lendo e editando arquivos locais.',
                    tools: [{ functionDeclarations: toolsDefinition }]
                }
            });
            spinner.stop();
            const functionCalls = response.functionCalls;
            if (functionCalls && functionCalls.length > 0) {
                for (const call of functionCalls) {
                    if (call.name) {
                        console.log(chalk.yellow(`🛠️ Executando: ${call.name}(${JSON.stringify(call.args)})`));
                        const toolResult = await executeTool(call.name, call.args, workspaceDir);
                        console.log(chalk.green(`\n💬 ${toolResult}`));
                    }
                }
            }
            else {
                console.log(chalk.green(`\n💬 Resposta do EM Agent:`));
                console.log(response.text);
            }
        }
        catch (error) {
            spinner.fail('Erro durante a execução na nuvem.');
            console.error(chalk.red(error.message));
        }
        return;
    }
    // --- EXECUÇÃO LOCAL (OLLAMA) ---
    const messages = [
        {
            role: 'system',
            content: `Você é o EM Agent, um agente de IA de código aberto para desktop.
Você executa tarefas lendo arquivos, criando novos e rodando comandos diretamente na pasta ativa do usuário (${workspaceDir}).
Seja direto, execute ações reais usando as ferramentas disponíveis e confirme a conclusão.`
        },
        { role: 'user', content: task }
    ];
    let stepCount = 0;
    const maxSteps = 15;
    while (stepCount < maxSteps) {
        stepCount++;
        const spinner = ora(`Pensando no próximo passo (${stepCount}/${maxSteps})...`).start();
        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: modelName,
                    messages,
                    tools: toolsDefinition,
                    stream: false
                })
            });
            if (!response.ok) {
                throw new Error(`Servidor Ollama indisponível (${response.statusText}). Certifique-se de executar 'ollama serve'.`);
            }
            const data = await response.json();
            spinner.stop();
            const assistantMessage = data.message;
            messages.push(assistantMessage);
            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                for (const call of assistantMessage.tool_calls) {
                    const fnName = call.function.name;
                    const fnArgs = call.function.arguments;
                    console.log(chalk.yellow(`🛠️ Executando: ${fnName}(${JSON.stringify(fnArgs)})`));
                    const toolResult = await executeTool(fnName, fnArgs, workspaceDir);
                    console.log(chalk.dim(`↳ Resultado: ${toolResult}`));
                    messages.push({ role: 'tool', content: toolResult });
                }
            }
            else {
                console.log(chalk.green(`\n💬 Resposta do EM Agent:`));
                console.log(assistantMessage.content);
                break;
            }
        }
        catch (error) {
            spinner.fail('Erro durante a execução do agente.');
            console.error(chalk.red(error.message));
            break;
        }
    }
}
