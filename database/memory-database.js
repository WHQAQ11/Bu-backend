"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.MemoryDatabase = void 0;
const users = new Map();
const divinationLogs = new Map();
let nextUserId = 1;
let nextLogId = 1;
class MemoryDatabase {
    constructor() {
        console.log('✅ 内存数据库初始化成功');
    }
    static getInstance() {
        if (!MemoryDatabase.instance) {
            MemoryDatabase.instance = new MemoryDatabase();
        }
        return MemoryDatabase.instance;
    }
    async createUser(userData) {
        const user = {
            ...userData,
            id: nextUserId++,
            created_at: new Date(),
            updated_at: new Date()
        };
        users.set(user.id, user);
        return user;
    }
    async findByEmail(email) {
        for (const user of users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }
    async findById(id) {
        const user = users.get(id);
        if (!user)
            return null;
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async emailExists(email) {
        return await this.findByEmail(email) !== null;
    }
    async updateUser(id, updates) {
        const user = users.get(id);
        if (!user)
            return null;
        const updatedUser = {
            ...user,
            ...updates,
            updated_at: new Date()
        };
        users.set(id, updatedUser);
        const { password_hash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async deleteUser(id) {
        return users.delete(id);
    }
    async createDivinationLog(logData) {
        const log = {
            ...logData,
            id: nextLogId++,
            created_at: new Date()
        };
        divinationLogs.set(log.id, log);
        return log;
    }
    async findDivinationLogsByUserId(userId) {
        const logs = [];
        for (const log of divinationLogs.values()) {
            if (log.user_id === userId) {
                logs.push(log);
            }
        }
        return logs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
    async findDivinationLogById(id) {
        return divinationLogs.get(id) || null;
    }
    async testConnection() {
        console.log('🗄️  内存数据库连接测试成功');
        return true;
    }
    async close() {
        users.clear();
        divinationLogs.clear();
        nextUserId = 1;
        nextLogId = 1;
        console.log('🔌 内存数据库已关闭');
    }
    async getAllUsers() {
        return Array.from(users.values());
    }
    async getAllDivinationLogs() {
        return Array.from(divinationLogs.values());
    }
}
exports.MemoryDatabase = MemoryDatabase;
exports.db = MemoryDatabase.getInstance();
//# sourceMappingURL=memory-database.js.map