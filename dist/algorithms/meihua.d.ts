export interface MeihuaGua {
    name: string;
    upperTrigram: string;
    lowerTrigram: string;
    number: number;
    upperNumber: number;
    lowerNumber: number;
    changingYao?: number;
    method: 'time' | 'number' | 'word';
    sourceInfo: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        numbers?: number[];
        words?: string;
    };
    interpretation: {
        guaci: string;
        shiyi: string;
        analysis: string;
    };
}
export interface MeihuaDivinationResult {
    method: 'meihua';
    question: string;
    result: MeihuaGua;
    timestamp: Date;
}
export declare function meihuaNumberDivination(numbers: number[]): MeihuaGua;
export declare function meihuaTimeDivination(year: number, month: number, day: number, hour: number): MeihuaGua;
export declare function meihuaWordDivination(text: string): MeihuaGua;
export declare function performMeihuaDivination(question: string): MeihuaDivinationResult;
//# sourceMappingURL=meihua.d.ts.map