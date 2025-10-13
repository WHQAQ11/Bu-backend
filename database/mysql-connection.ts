import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL数据库连接配置
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'daily_divination',
  charset: 'utf8mb4',
  connectionLimit: 20, // 最大连接数
  acquireTimeout: 60000, // 获取连接超时时间
  timeout: 60000, // 查询超时时间
  reconnect: true, // 自动重连
};

// 创建连接池
const pool = mysql.createPool(connectionConfig);

// 数据库连接类
export class Database {
  private static instance: Database;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = pool;

    // 监听连接事件
    this.pool.on('connection', (connection) => {
      console.log('✅ MySQL数据库连接成功');
    });

    this.pool.on('error', (err) => {
      console.error('❌ MySQL数据库连接错误:', err);
    });
  }

  // 单例模式获取数据库实例
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // 获取连接池
  public getPool(): mysql.Pool {
    return this.pool;
  }

  // 执行查询
  public async query(sql: string, params?: any[]): Promise<any> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return { rows };
    } catch (error) {
      console.error('❌ 查询执行失败:', error);
      throw error;
    }
  }

  // 执行事务
  public async transaction(callback: (connection: mysql.PoolConnection) => Promise<any>): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // 测试连接
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      console.log('🗄️  MySQL数据库连接测试成功:', result[0]);
      return true;
    } catch (error) {
      console.error('❌ MySQL数据库连接测试失败:', error);
      return false;
    }
  }

  // 关闭连接池
  public async close(): Promise<void> {
    await this.pool.end();
    console.log('🔌 MySQL数据库连接池已关闭');
  }

  // 创建数据库（如果不存在）
  public async createDatabase(): Promise<void> {
    const { database, ...configWithoutDb } = connectionConfig;
    const tempPool = mysql.createPool(configWithoutDb);

    try {
      await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ 数据库 ${database} 创建成功`);
    } catch (error) {
      console.error('❌ 创建数据库失败:', error);
      throw error;
    } finally {
      await tempPool.end();
    }
  }
}

// 导出数据库实例
export const db = Database.getInstance();