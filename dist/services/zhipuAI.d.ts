export interface ZhipuAIConfig {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
}
export interface AIInterpretationRequest {
    prompt: string;
    context?: string;
    temperature?: number;
    maxTokens?: number;
}
export interface AIInterpretationResponse {
    success: boolean;
    interpretation?: string;
    error?: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
export declare class ZhipuAIService {
    private config;
    private baseURL;
    constructor(config: ZhipuAIConfig);
    interpretDivination(request: AIInterpretationRequest): Promise<AIInterpretationResponse>;
    quickInterpret(question: string, hexagramName: string, hexagramInfo: any): Promise<AIInterpretationResponse>;
    detailedInterpret(question: string, method: string, hexagramName: string, hexagramInfo: any, focus?: string): Promise<AIInterpretationResponse>;
    validateConfig(): {
        valid: boolean;
        error?: string;
    };
    getStatus(): Promise<{
        available: boolean;
        error?: string;
    }>;
}
export declare function initializeZhipuAI(config: ZhipuAIConfig): ZhipuAIService;
export declare function getZhipuAIService(): ZhipuAIService;
export declare function getZhipuAIConfigFromEnv(): ZhipuAIConfig;
//# sourceMappingURL=zhipuAI.d.ts.map