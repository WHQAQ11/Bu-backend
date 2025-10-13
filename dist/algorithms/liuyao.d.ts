export interface Yao {
    value: number;
    isChanging: boolean;
    yinYang: 'yin' | 'yang';
    symbol: string;
}
export interface Gua {
    name: string;
    upperTrigram: string;
    lowerTrigram: string;
    number: number;
    yaos: Yao[];
    changedGua?: Gua;
    properties: {
        wuxing: string;
        bagua: string;
        yuanyang: string;
    };
}
export interface DivinationResult {
    method: 'liuyao';
    question: string;
    originalGua: Gua;
    changedGua?: Gua;
    interpretation: {
        guaci: string;
        yaoci: string[];
        shiyi: string;
        analysis: string;
    };
    timestamp: Date;
}
export declare function simulateCoinToss(): number;
export declare function createYao(value: number): Yao;
export declare function createGua(yaoValues: number[]): Gua;
export declare function performDivination(question: string): DivinationResult;
//# sourceMappingURL=liuyao.d.ts.map