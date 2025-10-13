"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const postgres_connection_1 = require("../database/postgres-connection");
class UserModel {
    static async findByEmail(email) {
        try {
            const result = await postgres_connection_1.db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('❌ 根据邮箱查找用户失败:', error);
            throw error;
        }
    }
    static async findById(id) {
        try {
            const result = await postgres_connection_1.db.query('SELECT id, email, nickname, bazi_info, created_at, updated_at FROM users WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('❌ 根据ID查找用户失败:', error);
            throw error;
        }
    }
    static async create(userData) {
        try {
            const result = await postgres_connection_1.db.query(`INSERT INTO users (email, password_hash, nickname, bazi_info)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, nickname, bazi_info, created_at, updated_at`, [userData.email, userData.password_hash, userData.nickname, userData.bazi_info]);
            return result.rows[0];
        }
        catch (error) {
            console.error('❌ 创建用户失败:', error);
            throw error;
        }
    }
    static async emailExists(email) {
        try {
            const result = await postgres_connection_1.db.query('SELECT id FROM users WHERE email = $1', [email]);
            return result.rows.length > 0;
        }
        catch (error) {
            console.error('❌ 检查邮箱是否存在失败:', error);
            throw error;
        }
    }
    static async update(id, updates) {
        try {
            const setClauses = [];
            const values = [];
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
            const result = await postgres_connection_1.db.query(`UPDATE users
         SET ${setClauses.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING id, email, nickname, bazi_info, created_at, updated_at`, values);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('❌ 更新用户失败:', error);
            throw error;
        }
    }
    static async delete(id) {
        try {
            const result = await postgres_connection_1.db.query('DELETE FROM users WHERE id = $1', [id]);
            return result.rowCount > 0;
        }
        catch (error) {
            console.error('❌ 删除用户失败:', error);
            throw error;
        }
    }
    static async getUserStats(id) {
        try {
            const result = await postgres_connection_1.db.query(`SELECT
           COUNT(*) as total_divinations,
           COUNT(DISTINCT method) as unique_methods,
           MIN(created_at) as first_divination,
           MAX(created_at) as last_divination
         FROM divination_logs
         WHERE user_id = $1`, [id]);
            const stats = result.rows[0];
            return {
                totalDivinations: parseInt(stats.total_divinations) || 0,
                uniqueMethods: parseInt(stats.unique_methods) || 0,
                firstDivination: stats.first_divination,
                lastDivination: stats.last_divination
            };
        }
        catch (error) {
            console.error('❌ 获取用户统计失败:', error);
            throw error;
        }
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map