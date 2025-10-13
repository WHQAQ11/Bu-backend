export interface User {
    id: number;
    email: string;
    password_hash: string;
    nickname?: string;
    bazi_info?: any;
    created_at: Date;
    updated_at?: Date;
}
export interface DivinationLog {
    id: number;
    user_id: number;
    method: string;
    question: string;
    input_data: any;
    raw_result: any;
    ai_interpretation: string;
    user_feedback?: string;
    created_at: Date;
}
export declare class MemoryDatabase {
    private static instance;
    private constructor();
    static getInstance(): MemoryDatabase;
    createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<Omit<User, 'password_hash'> | null>;
    emailExists(email: string): Promise<boolean>;
    updateUser(id: number, updates: Partial<Pick<User, 'nickname' | 'bazi_info'>>): Promise<Omit<User, 'password_hash'> | null>;
    deleteUser(id: number): Promise<boolean>;
    createDivinationLog(logData: Omit<DivinationLog, 'id' | 'created_at'>): Promise<DivinationLog>;
    findDivinationLogsByUserId(userId: number): Promise<DivinationLog[]>;
    findDivinationLogById(id: number): Promise<DivinationLog | null>;
    testConnection(): Promise<boolean>;
    close(): Promise<void>;
    getAllUsers(): Promise<User[]>;
    getAllDivinationLogs(): Promise<DivinationLog[]>;
}
export declare const db: MemoryDatabase;
//# sourceMappingURL=memory-database.d.ts.map