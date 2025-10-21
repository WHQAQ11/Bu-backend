export interface HexagramData {
    number: number;
    name: string;
    upper: string;
    lower: string;
    guaci: string;
    yaoci: string[];
    shiyi: string;
    symbolism: string;
    elements: {
        wuxing: string;
        season: string;
        direction: string;
        nature: string;
        relationship: string;
    };
    analysis: {
        career: string;
        relationship: string;
        health: string;
        wealth: string;
    };
}
export declare const COMPLETE_HEXAGRAMS: HexagramData[];
export declare const getHexagramByNumber: (number: number) => HexagramData | undefined;
export declare const getHexagramByName: (name: string) => HexagramData | undefined;
export declare const getHexagramByTrigrams: (upper: string, lower: string) => HexagramData | undefined;
export declare function detectQuestionType(question: string): 'career' | 'relationship' | 'health' | 'wealth' | 'general';
export declare function getQuestionTypeName(type: string): string;
//# sourceMappingURL=hexagramDatabase.d.ts.map