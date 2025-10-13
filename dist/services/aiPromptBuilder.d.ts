export interface DivinationContext {
    method: 'liuyao' | 'meihua' | 'zhouyi';
    question: string;
    guaName: string;
    guaInfo: {
        number: number;
        upperTrigram: string;
        lowerTrigram: string;
        changingYao?: number;
        interpretation: {
            guaci: string;
            yaoci?: string[];
            shiyi?: string;
            analysis?: string;
        };
    };
    userInfo?: {
        name?: string;
        gender?: string;
        birthYear?: number;
        birthMonth?: number;
        birthDay?: number;
    };
}
export interface PromptOptions {
    style?: 'traditional' | 'modern' | 'detailed' | 'concise';
    focus?: 'career' | 'relationship' | 'health' | 'wealth' | 'general';
    language?: 'chinese' | 'bilingual';
    includeAdvice?: boolean;
    includeWarnings?: boolean;
}
export declare class AIPromptBuilder {
    static buildDivinationPrompt(context: DivinationContext, options?: PromptOptions): string;
    private static buildSystemPrompt;
    private static buildContextPrompt;
    private static buildDivinationAnalysis;
    private static buildFocusPrompt;
    private static buildAdvicePrompt;
    private static buildWarningsPrompt;
    private static buildOutputFormatPrompt;
    private static getMethodName;
    private static getFocusAreaName;
    static buildQuickPrompt(context: DivinationContext): string;
    static buildEnglishPrompt(context: DivinationContext, options?: PromptOptions): string;
    static buildEmotionalPrompt(context: DivinationContext, options?: PromptOptions): string;
}
//# sourceMappingURL=aiPromptBuilder.d.ts.map