import 'dotenv/config';
interface AgentOptions {
    task: string;
    workspaceDir: string;
    provider: 'local' | 'cloud';
    modelName: string;
}
export declare function runEMAgent({ task, workspaceDir, provider, modelName }: AgentOptions): Promise<void>;
export {};
//# sourceMappingURL=engine.d.ts.map