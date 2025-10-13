export type DivinationMethod = 'liuyao' | 'meihua' | 'zhouyi' | 'other';
export interface CreateDivinationLogRequest {
    user_id: number;
    method: DivinationMethod;
    question: string;
    input_data: any;
    raw_result: any;
    ai_interpretation: string;
    user_feedback?: string;
}
export interface DivinationLog {
    id: number;
    user_id: number;
    method: DivinationMethod;
    question: string;
    input_data: any;
    raw_result: any;
    ai_interpretation: string;
    user_feedback?: string;
    created_at: Date;
}
export interface DivinationRequest {
    method: DivinationMethod;
    question: string;
    input_data?: any;
}
export interface DivinationResponse {
    success: boolean;
    message: string;
    data?: {
        log_id: number;
        method: DivinationMethod;
        question: string;
        result: any;
        ai_interpretation?: string;
        timestamp: Date;
    };
}
export interface UserStatsResponse {
    success: boolean;
    message: string;
    data?: {
        total: number;
        byMethod: {
            [key: string]: number;
        };
        recentCount: number;
    };
}
export interface DivinationLogListResponse {
    success: boolean;
    message: string;
    data?: {
        logs: DivinationLog[];
        total: number;
        page: number;
        pageSize: number;
    };
}
//# sourceMappingURL=divination.d.ts.map