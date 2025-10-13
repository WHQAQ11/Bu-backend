// 占卜相关的类型定义

export type DivinationMethod = 'liuyao' | 'meihua' | 'zhouyi' | 'other';

export interface CreateDivinationLogRequest {
  user_id: number;
  method: DivinationMethod;
  question: string;
  input_data: any; // 占卜输入数据（如爻值、数字等）
  raw_result: any; // 原始占卜结果（卦象信息等）
  ai_interpretation: string; // AI解卦结果
  user_feedback?: string; // 用户反馈
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
    byMethod: { [key: string]: number };
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