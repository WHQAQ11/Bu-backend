import { DivinationLog, CreateDivinationLogRequest } from '../types/divination';
export declare class DivinationLogModel {
    static create(logData: CreateDivinationLogRequest): Promise<DivinationLog>;
    static findByUserId(userId: number): Promise<DivinationLog[]>;
    static findById(id: number): Promise<DivinationLog | null>;
    static update(id: number, updates: Partial<Pick<DivinationLog, 'ai_interpretation' | 'user_feedback'>>): Promise<DivinationLog | null>;
    static updateAIInterpretation(id: number, aiInterpretation: string): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
    static getUserStats(userId: number): Promise<{
        total: number;
        byMethod: {
            [key: string]: number;
        };
        recentCount: number;
    }>;
    static findRecentByUserId(userId: number, limit?: number, offset?: number): Promise<DivinationLog[]>;
}
//# sourceMappingURL=DivinationLog.d.ts.map