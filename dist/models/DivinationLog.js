"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivinationLogModel = void 0;
const postgres_connection_1 = require("../database/postgres-connection");
class DivinationLogModel {
    static async create(logData) {
        try {
            const result = await postgres_connection_1.db.query(`INSERT INTO divination_logs (user_id, method, question, input_data, raw_result, ai_interpretation, user_feedback)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, [
                logData.user_id,
                logData.method,
                logData.question,
                JSON.stringify(logData.input_data),
                JSON.stringify(logData.raw_result),
                logData.ai_interpretation || null,
                logData.user_feedback || null
            ]);
            return result.rows[0];
        }
        catch (error) {
            console.error('❌ 创建占卜记录失败:', error);
            throw error;
        }
    }
    static async findByUserId(userId) {
        try {
            const result = await postgres_connection_1.db.query('SELECT * FROM divination_logs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            return result.rows.map((row) => ({
                ...row,
                input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
                raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
            }));
        }
        catch (error) {
            console.error('❌ 根据用户ID查找占卜记录失败:', error);
            throw error;
        }
    }
    static async findById(id) {
        try {
            const result = await postgres_connection_1.db.query('SELECT * FROM divination_logs WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return null;
            }
            const row = result.rows[0];
            return {
                ...row,
                input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
                raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
            };
        }
        catch (error) {
            console.error('❌ 根据ID查找占卜记录失败:', error);
            throw error;
        }
    }
    static async update(id, updates) {
        try {
            const setClauses = [];
            const values = [];
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
            const result = await postgres_connection_1.db.query(`UPDATE divination_logs
         SET ${setClauses.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING *`, values);
            if (result.rows.length === 0) {
                return null;
            }
            const row = result.rows[0];
            return {
                ...row,
                input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
                raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
            };
        }
        catch (error) {
            console.error('❌ 更新占卜记录失败:', error);
            throw error;
        }
    }
    static async updateAIInterpretation(id, aiInterpretation) {
        try {
            const result = await postgres_connection_1.db.query('UPDATE divination_logs SET ai_interpretation = $1 WHERE id = $2', [aiInterpretation, id]);
            return result.rowCount > 0;
        }
        catch (error) {
            console.error('❌ 更新AI解读失败:', error);
            return false;
        }
    }
    static async delete(id) {
        try {
            const result = await postgres_connection_1.db.query('DELETE FROM divination_logs WHERE id = $1', [id]);
            return result.rowCount > 0;
        }
        catch (error) {
            console.error('❌ 删除占卜记录失败:', error);
            return false;
        }
    }
    static async getUserStats(userId) {
        try {
            const totalResult = await postgres_connection_1.db.query('SELECT COUNT(*) as total FROM divination_logs WHERE user_id = $1', [userId]);
            const methodResult = await postgres_connection_1.db.query(`SELECT method, COUNT(*) as count
         FROM divination_logs
         WHERE user_id = $1
         GROUP BY method`, [userId]);
            const recentResult = await postgres_connection_1.db.query(`SELECT COUNT(*) as recent_count
         FROM divination_logs
         WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`, [userId]);
            const total = parseInt(totalResult.rows[0].total) || 0;
            const byMethod = {};
            methodResult.rows.forEach((row) => {
                byMethod[row.method] = parseInt(row.count);
            });
            const recentCount = parseInt(recentResult.rows[0].recent_count) || 0;
            return {
                total,
                byMethod,
                recentCount
            };
        }
        catch (error) {
            console.error('❌ 获取用户占卜统计失败:', error);
            return {
                total: 0,
                byMethod: {},
                recentCount: 0
            };
        }
    }
    static async findRecentByUserId(userId, limit = 10, offset = 0) {
        try {
            const result = await postgres_connection_1.db.query('SELECT * FROM divination_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
            return result.rows.map((row) => ({
                ...row,
                input_data: typeof row.input_data === 'string' ? JSON.parse(row.input_data) : row.input_data,
                raw_result: typeof row.raw_result === 'string' ? JSON.parse(row.raw_result) : row.raw_result
            }));
        }
        catch (error) {
            console.error('❌ 获取最近占卜记录失败:', error);
            throw error;
        }
    }
}
exports.DivinationLogModel = DivinationLogModel;
//# sourceMappingURL=DivinationLog.js.map