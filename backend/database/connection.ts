import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 数据库连接池配置
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'daily_divination',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 2000, // 连接超时时间
};

// 创建连接池
const pool = new Pool(poolConfig);

// 数据库连接类
export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = pool;

    // 监听连接事件
    this.pool.on('connect', () => {
      console.log('✅ 数据库连接成功');
    });

    this.pool.on('error', (err) => {
      console.error('❌ 数据库连接错误:', err);
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
  public getPool(): Pool {
    return this.pool;
  }

  // 执行查询
  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  // 获取事务客户端
  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  // 测试连接
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      console.log('🗄️  数据库连接测试成功:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ 数据库连接测试失败:', error);
      return false;
    }
  }

  // 关闭连接池
  public async close(): Promise<void> {
    await this.pool.end();
    console.log('🔌 数据库连接池已关闭');
  }
}

// 导出数据库实例
export const db = Database.getInstance();