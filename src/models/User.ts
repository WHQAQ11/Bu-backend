import { db } from '../database/postgres-connection';
import { User, CreateUserRequest, CreateUserData } from '../types/user';

export class UserModel {
  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (error) {
      console.error('❌ 根据邮箱查找用户失败:', error);
      throw error;
    }
  }

  // 根据 ID 查找用户（不返回密码哈希）
  static async findById(id: number): Promise<Omit<User, 'password_hash'> | null> {
    try {
      const result = await db.query(
        'SELECT id, email, nickname, bazi_info, created_at, updated_at FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as Omit<User, 'password_hash'>;
    } catch (error) {
      console.error('❌ 根据ID查找用户失败:', error);
      throw error;
    }
  }

  // 创建新用户
  static async create(userData: CreateUserData): Promise<Omit<User, 'password_hash'>> {
    try {
      const result = await db.query(
        `INSERT INTO users (email, password_hash, nickname, bazi_info)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, nickname, bazi_info, created_at, updated_at`,
        [userData.email, userData.password_hash, userData.nickname, userData.bazi_info]
      );

      return result.rows[0] as Omit<User, 'password_hash'>;
    } catch (error) {
      console.error('❌ 创建用户失败:', error);
      throw error;
    }
  }

  // 检查邮箱是否已存在
  static async emailExists(email: string): Promise<boolean> {
    try {
      const result = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      return result.rows.length > 0;
    } catch (error) {
      console.error('❌ 检查邮箱是否存在失败:', error);
      throw error;
    }
  }

  // 更新用户信息
  static async update(id: number, updates: Partial<Pick<User, 'nickname' | 'bazi_info'>>): Promise<Omit<User, 'password_hash'> | null> {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updates.nickname !== undefined) {
        setClauses.push(`nickname = $${paramIndex++}`);
        values.push(updates.nickname);
      }

      if (updates.bazi_info !== undefined) {
        setClauses.push(`bazi_info = $${paramIndex++}`);
        values.push(updates.bazi_info);
      }

      if (setClauses.length === 0) {
        return this.findById(id);
      }

      setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await db.query(
        `UPDATE users
         SET ${setClauses.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING id, email, nickname, bazi_info, created_at, updated_at`,
        values
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as Omit<User, 'password_hash'>;
    } catch (error) {
      console.error('❌ 更新用户失败:', error);
      throw error;
    }
  }

  // 删除用户
  static async delete(id: number): Promise<boolean> {
    try {
      const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('❌ 删除用户失败:', error);
      throw error;
    }
  }

  // 获取用户统计信息
  static async getUserStats(id: number): Promise<any> {
    try {
      const result = await db.query(
        `SELECT
           COUNT(*) as total_divinations,
           COUNT(DISTINCT method) as unique_methods,
           MIN(created_at) as first_divination,
           MAX(created_at) as last_divination
         FROM divination_logs
         WHERE user_id = $1`,
        [id]
      );

      const stats = result.rows[0];
      return {
        totalDivinations: parseInt(stats.total_divinations) || 0,
        uniqueMethods: parseInt(stats.unique_methods) || 0,
        firstDivination: stats.first_divination,
        lastDivination: stats.last_divination
      };
    } catch (error) {
      console.error('❌ 获取用户统计失败:', error);
      throw error;
    }
  }
}