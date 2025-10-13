import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { db } from '../database/memory-database';
import { initializeZhipuAI, getZhipuAIConfigFromEnv } from './services/zhipuAI';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: '每日一卦后端服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// API 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/divination', require('./routes/divination'));
app.use('/api/logs', require('./routes/logs'));

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

const startServer = async () => {
  try {
    // 初始化智谱AI服务
    console.log('🤖 初始化智谱AI服务...');
    const zhipuAIConfig = getZhipuAIConfigFromEnv();
    const zhipuAIService = initializeZhipuAI(zhipuAIConfig);

    // 验证智谱AI配置
    const zhipuValidation = zhipuAIService.validateConfig();
    if (zhipuValidation.valid) {
      console.log('✅ 智谱AI服务配置验证通过');

      // 测试智谱AI连接（异步，不阻塞启动）
      zhipuAIService.getStatus().then(status => {
        if (status.available) {
          console.log('✅ 智谱AI服务连接正常');
        } else {
          console.warn('⚠️ 智谱AI服务连接异常:', status.error);
          console.warn('💡 AI解读功能可能不可用，请检查API密钥配置');
        }
      }).catch(error => {
        console.warn('⚠️ 智谱AI服务测试失败:', error.message);
      });
    } else {
      console.warn('⚠️ 智谱AI服务配置验证失败:', zhipuValidation.error);
      console.warn('💡 AI解读功能将不可用，请设置 ZHIPUAI_API_KEY 环境变量');
    }

    // 测试数据库连接（但不强制要求）
    const isConnected = await db.testConnection();
    if (!isConnected) {
      console.warn('⚠️  数据库连接失败，某些功能可能不可用');
      console.warn('💡 请确保 PostgreSQL 已启动并配置正确');
    }

    app.listen(PORT, () => {
      console.log(`🚀 后端服务启动成功，端口: ${PORT}`);
      console.log(`📖 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  数据库状态: ${isConnected ? '已连接' : '未连接'}`);
      console.log(`🤖 智谱AI状态: ${zhipuValidation.valid ? '已配置' : '未配置'}`);
      console.log(`🔗 API 地址: http://localhost:${PORT}/api`);
      console.log(`❤️  健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 启动服务器
startServer();

export default app;