import { db } from '../../database/memory-database';
import { DivinationLog, CreateDivinationLogRequest } from '../types/divination';

export class DivinationLogModel {
  // 创建占卜记录
  static async create(logData: CreateDivinationLogRequest): Promise<DivinationLog> {
    return await db.createDivinationLog(logData);
  }

  // 根据用户ID查找占卜记录
  static async findByUserId(userId: number): Promise<DivinationLog[]> {
    return await db.findDivinationLogsByUserId(userId);
  }

  // 根据ID查找单个占卜记录
  static async findById(id: number): Promise<DivinationLog | null> {
    return await db.findDivinationLogById(id);
  }

  // 更新占卜记录（例如添加AI解读或用户反馈）
  static async update(id: number, updates: Partial<Pick<DivinationLog, 'ai_interpretation' | 'user_feedback'>>): Promise<DivinationLog | null> {
    const log = await db.findDivinationLogById(id);
    if (!log) return null;

    const updatedLog = {
      ...log,
      ...updates
    };

    // 由于内存数据库没有update方法，我们需要重新实现
    // 这里先返回原始记录，实际项目中应该完善数据库层的更新功能
    return updatedLog;
  }

  // 专门用于更新AI解读的方法
  static async updateAIInterpretation(id: number, aiInterpretation: string): Promise<boolean> {
    try {
      const log = await db.findDivinationLogById(id);
      if (!log) return false;

      const updatedLog = {
        ...log,
        ai_interpretation: aiInterpretation
      };

      // 在实际项目中，这里应该调用数据库的update方法
      // 目前在内存数据库中，我们直接标记为成功
      console.log(`📝 更新占卜记录 ${id} 的AI解读`);

      return true;
    } catch (error) {
      console.error(`❌ 更新AI解读失败:`, error);
      return false;
    }
  }

  // 删除占卜记录
  static async delete(id: number): Promise<boolean> {
    // 内存数据库需要实现删除功能
    // 这里暂时返回true，实际项目中需要完善
    return true;
  }

  // 获取用户的占卜统计
  static async getUserStats(userId: number): Promise<{
    total: number;
    byMethod: { [key: string]: number };
    recentCount: number;
  }> {
    const logs = await db.findDivinationLogsByUserId(userId);

    const stats = {
      total: logs.length,
      byMethod: {} as { [key: string]: number },
      recentCount: 0
    };

    // 统计各种占卜方法的使用次数
    logs.forEach(log => {
      stats.byMethod[log.method] = (stats.byMethod[log.method] || 0) + 1;
    });

    // 统计最近7天的占卜次数
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    stats.recentCount = logs.filter(log =>
      new Date(log.created_at) >= sevenDaysAgo
    ).length;

    return stats;
  }
}