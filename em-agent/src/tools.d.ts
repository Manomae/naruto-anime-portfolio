export declare const toolsDefinition: ({
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            filePath: {
                type: string;
                description: string;
            };
            content?: never;
            command?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            filePath: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
            };
            command?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: {
            filePath?: never;
            content?: never;
            command: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
})[];
export declare function executeTool(name: string, args: any, workspaceDir: string): Promise<string>;
//# sourceMappingURL=tools.d.ts.map