// PostgreSQL数据库连接配置
// 适配Railway PostgreSQL服务

import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL连接配置，使用Railway标准环境变量
const poolConfig = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'daily_divination',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时
  connectionTimeoutMillis: 2000, // 连接超时
};

// 创建连接池
const pool = new Pool(poolConfig);

// PostgreSQL数据库类
export class PostgreSQLDatabase {
  private static instance: PostgreSQLDatabase;
  private pool: Pool;

  private constructor() {
    this.pool = pool;

    // 监听连接事件
    this.pool.on('connect', (client) => {
      console.log('✅ PostgreSQL数据库连接成功');
    });

    this.pool.on('error', (err) => {
      console.error('❌ PostgreSQL数据库连接错误:', err);
    });

    this.pool.on('remove', () => {
      console.log('🔌 PostgreSQL数据库连接已移除');
    });
  }

  // 单例模式获取数据库实例
  public static getInstance(): PostgreSQLDatabase {
    if (!PostgreSQLDatabase.instance) {
      PostgreSQLDatabase.instance = new PostgreSQLDatabase();
    }
    return PostgreSQLDatabase.instance;
  }

  // 获取连接池
  public getPool(): Pool {
    return this.pool;
  }

  // 执行查询
  public async query(sql: string, params?: any[]): Promise<any> {
    try {
      const result = await this.pool.query(sql, params);
      return result;
    } catch (error) {
      console.error('❌ 查询执行失败:', error);
      throw error;
    }
  }

  // 执行事务
  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 测试连接
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW() as current_time, version() as version');
      console.log('🗄️ PostgreSQL数据库连接测试成功');
      console.log(`📊 数据库时间: ${result.rows[0].current_time}`);
      return true;
    } catch (error) {
      console.error('❌ PostgreSQL数据库连接测试失败:', error);
      console.error('💡 请检查以下环境变量是否正确设置:');
      console.error('   - PGHOST: 数据库主机');
      console.error('   - PGPORT: 数据库端口');
      console.error('   - PGUSER: 数据库用户名');
      console.error('   - PGPASSWORD: 数据库密码');
      console.error('   - PGDATABASE: 数据库名称');
      return false;
    }
  }

  // 关闭连接池
  public async close(): Promise<void> {
    await this.pool.end();
    console.log('🔌 PostgreSQL数据库连接池已关闭');
  }

  // 运行数据库迁移
  public async runMigrations(): Promise<void> {
    try {
      console.log('🔄 开始运行数据库迁移...');

      // 创建用户表
      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          nickname VARCHAR(50),
          bazi_info JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建占卜记录表
      await this.query(`
        CREATE TABLE IF NOT EXISTS divination_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          method VARCHAR(50) NOT NULL,
          question TEXT NOT NULL,
          input_data JSONB,
          raw_result JSONB,
          ai_interpretation TEXT,
          user_feedback TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建索引
      await this.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_divination_logs_user_id ON divination_logs(user_id)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_divination_logs_created_at ON divination_logs(created_at)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_divination_logs_method ON divination_logs(method)');

      // 创建更新时间触发器函数
      await this.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql'
      `);

      // 为用户表创建更新时间触发器
      await this.query(`
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
      `);

      console.log('✅ 数据库迁移完成');
    } catch (error) {
      console.error('❌ 数据库迁移失败:', error);
      throw error;
    }
  }

  // 获取数据库信息
  public async getDatabaseInfo(): Promise<any> {
    try {
      // 使用PostgreSQL特有的方式获取表信息和行数
      const tablesResult = await this.query(`
        SELECT
          t.table_name,
          COALESCE(s.n_tup_ins - s.n_tup_del, 0) as table_rows
        FROM information_schema.tables t
        LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
        WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name
      `);

      const sizeResult = await this.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
      `);

      return {
        tables: tablesResult.rows,
        databaseSize: sizeResult.rows[0]?.database_size || 'Unknown',
        connectedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ 获取数据库信息失败:', error);
      return null;
    }
  }
}

// 导出数据库实例
export const db = PostgreSQLDatabase.getInstance();