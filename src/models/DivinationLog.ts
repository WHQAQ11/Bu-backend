import { db } from '../database/postgres-connection';
import { DivinationLog, CreateDivinationLogRequest } from '../types/divination';

export class DivinationLogModel {
  // 创建占卜记录
  static async create(logData: CreateDivinationLogRequest): Promise<DivinationLog> {
    try {
      const result = await db.query(
        `INSERT INTO divination_logs (user_id, method, question, input_data, raw_result, ai_interpretation, user_feedback)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          logData.user_id,
          logData.method,
          logData.question,
          JSON.stringify(logData.input_data),
          JSON.stringify(logData.raw_result),
          logData.ai_interpretation || null,
          logData.user_feedback || null
        ]
      );

      return result.rows[0] as DivinationLog;
    } catch (error) {
      console.error('❌ 创建占卜记录失败:', error);
      throw error;
    }
  }

  // 根据用户ID查找占卜记录（按创建时间倒序）
  static async findByUserId(userId: number): Promise<DivinationLog[]> {
    try {
      const result = await db.query(
        'SELECT * FROM divination_logs WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      return result.rows.map((row: any) => ({
        ...row,
        input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
        raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
      })) as DivinationLog[];
    } catch (error) {
      console.error('❌ 根据用户ID查找占卜记录失败:', error);
      throw error;
    }
  }

  // 根据ID查找单个占卜记录
  static async findById(id: number): Promise<DivinationLog | null> {
    try {
      const result = await db.query(
        'SELECT * FROM divination_logs WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        ...row,
        input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
        raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
      } as DivinationLog;
    } catch (error) {
      console.error('❌ 根据ID查找占卜记录失败:', error);
      throw error;
    }
  }

  // 更新占卜记录（例如添加AI解读或用户反馈）
  static async update(id: number, updates: Partial<Pick<DivinationLog, 'ai_interpretation' | 'user_feedback'>>): Promise<DivinationLog | null> {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updates.ai_interpretation !== undefined) {
        setClauses.push(`ai_interpretation = $${paramIndex++}`);
        values.push(updates.ai_interpretation);
      }

      if (updates.user_feedback !== undefined) {
        setClauses.push(`user_feedback = $${paramIndex++}`);
        values.push(updates.user_feedback);
      }

      if (setClauses.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      const result = await db.query(
        `UPDATE divination_logs
         SET ${setClauses.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        ...row,
        input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
        raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
      } as DivinationLog;
    } catch (error) {
      console.error('❌ 更新占卜记录失败:', error);
      throw error;
    }
  }

  // 专门用于更新AI解读的方法
  static async updateAIInterpretation(id: number, aiInterpretation: string): Promise<boolean> {
    try {
      const result = await db.query(
        'UPDATE divination_logs SET ai_interpretation = $1 WHERE id = $2',
        [aiInterpretation, id]
      );

      return result.rowCount > 0;
    } catch (error) {
      console.error('❌ 更新AI解读失败:', error);
      return false;
    }
  }

  // 删除占卜记录
  static async delete(id: number): Promise<boolean> {
    try {
      const result = await db.query('DELETE FROM divination_logs WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('❌ 删除占卜记录失败:', error);
      return false;
    }
  }

  // 获取用户的占卜统计
  static async getUserStats(userId: number): Promise<{
    total: number;
    byMethod: { [key: string]: number };
    recentCount: number;
  }> {
    try {
      // 获取总体统计
      const totalResult = await db.query(
        'SELECT COUNT(*) as total FROM divination_logs WHERE user_id = $1',
        [userId]
      );

      // 获取按方法分组的统计
      const methodResult = await db.query(
        `SELECT method, COUNT(*) as count
         FROM divination_logs
         WHERE user_id = $1
         GROUP BY method`,
        [userId]
      );

      // 获取最近7天的统计
      const recentResult = await db.query(
        `SELECT COUNT(*) as recent_count
         FROM divination_logs
         WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`,
        [userId]
      );

      const total = parseInt(totalResult.rows[0].total) || 0;
      const byMethod: { [key: string]: number } = {};

      methodResult.rows.forEach((row: any) => {
        byMethod[row.method] = parseInt(row.count);
      });

      const recentCount = parseInt(recentResult.rows[0].recent_count) || 0;

      return {
        total,
        byMethod,
        recentCount
      };
    } catch (error) {
      console.error('❌ 获取用户占卜统计失败:', error);
      return {
        total: 0,
        byMethod: {},
        recentCount: 0
      };
    }
  }

  // 获取最近的占卜记录（分页）
  static async findRecentByUserId(userId: number, limit: number = 10, offset: number = 0): Promise<DivinationLog[]> {
    try {
      const result = await db.query(
        'SELECT * FROM divination_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
      );

      return result.rows.map((row: any) => ({
        ...row,
        input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
        raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
      })) as DivinationLog[];
    } catch (error) {
      console.error('❌ 获取最近占卜记录失败:', error);
      throw error;
    }
  }
}