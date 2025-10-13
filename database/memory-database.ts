// 临时内存数据库解决方案
// 用于快速开发，后续可替换为真实数据库

export interface User {
  id: number;
  email: string;
  password_hash: string;
  nickname?: string;
  bazi_info?: any;
  created_at: Date;
  updated_at?: Date;
}

import { DivinationMethod } from '../src/types/divination';

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

// 内存数据存储
const users = new Map<number, User>();
const divinationLogs = new Map<number, DivinationLog>();
let nextUserId = 1;
let nextLogId = 1;

// 内存数据库类
export class MemoryDatabase {
  private static instance: MemoryDatabase;

  private constructor() {
    console.log('✅ 内存数据库初始化成功');
  }

  // 单例模式
  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase();
    }
    return MemoryDatabase.instance;
  }

  // 用户相关操作
  public async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      ...userData,
      id: nextUserId++,
      created_at: new Date(),
      updated_at: new Date()
    };
    users.set(user.id, user);
    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  public async findById(id: number): Promise<Omit<User, 'password_hash'> | null> {
    const user = users.get(id);
    if (!user) return null;

    // 不返回密码哈希
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async emailExists(email: string): Promise<boolean> {
    return await this.findByEmail(email) !== null;
  }

  public async updateUser(id: number, updates: Partial<Pick<User, 'nickname' | 'bazi_info'>>): Promise<Omit<User, 'password_hash'> | null> {
    const user = users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updated_at: new Date()
    };
    users.set(id, updatedUser);

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  public async deleteUser(id: number): Promise<boolean> {
    return users.delete(id);
  }

  // 占卜记录相关操作
  public async createDivinationLog(logData: Omit<DivinationLog, 'id' | 'created_at'>): Promise<DivinationLog> {
    const log: DivinationLog = {
      ...logData,
      id: nextLogId++,
      created_at: new Date()
    };
    divinationLogs.set(log.id, log);
    return log;
  }

  public async findDivinationLogsByUserId(userId: number): Promise<DivinationLog[]> {
    const logs: DivinationLog[] = [];
    for (const log of divinationLogs.values()) {
      if (log.user_id === userId) {
        logs.push(log);
      }
    }
    return logs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  public async findDivinationLogById(id: number): Promise<DivinationLog | null> {
    return divinationLogs.get(id) || null;
  }

  // 测试连接
  public async testConnection(): Promise<boolean> {
    console.log('🗄️  内存数据库连接测试成功');
    return true;
  }

  // 关闭连接
  public async close(): Promise<void> {
    users.clear();
    divinationLogs.clear();
    nextUserId = 1;
    nextLogId = 1;
    console.log('🔌 内存数据库已关闭');
  }

  // 获取所有数据（用于调试）
  public async getAllUsers(): Promise<User[]> {
    return Array.from(users.values());
  }

  public async getAllDivinationLogs(): Promise<DivinationLog[]> {
    return Array.from(divinationLogs.values());
  }
}

// 导出数据库实例
export const db = MemoryDatabase.getInstance();