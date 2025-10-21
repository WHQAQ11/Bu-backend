export interface DivinationContext {
    method: 'liuyao' | 'meihua' | 'zhouyi';
    question: string;
    guaName: string;
    guaInfo: {
        number: number;
        upperTrigram: string;
        lowerTrigram: string;
        changingYao?: number;
        changedGua?: {
            name: string;
            number: number;
        };
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
    private static buildEnhancedContextPrompt;
    private static buildHexagramSpecificAnalysis;
    private static buildQuestionHexagramCorrelation;
    private static buildDivinationAnalysis;
    private static buildDynamicFocusPrompt;
    private static buildEnhancedAdvicePrompt;
    private static buildWarningsPrompt;
    private static buildOutputFormatPrompt;
    private static getMethodName;
    private static getFocusAreaName;
    static buildQuickPrompt(context: DivinationContext): string;
    static buildEnglishPrompt(context: DivinationContext, options?: PromptOptions): string;
    static buildEmotionalPrompt(context: DivinationContext, options?: PromptOptions): string;
    private static getHexagramData;
    private static detectQuestionType;
    private static getQuestionTypeName;
}
//# sourceMappingURL=aiPromptBuilder.d.ts.map