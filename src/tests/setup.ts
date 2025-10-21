// Jest测试环境设置
import { config } from 'dotenv';

// 加载测试环境变量
config({ path: '.env.test' });

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.TEST_PORT = '3003';

// 全局测试超时时间
jest.setTimeout(30000);

// 模拟console方法以减少测试输出
global.console = {
  ...console,
  // 保留error和warn，静默log和info
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  error: console.error,
  warn: console.warn,
};

// 全局测试工具函数
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidHexagram(): R;
      toBeValidDivinationResult(): R;
      toContainHexagramFeatures(): R;
    }
  }
}

// 自定义匹配器
expect.extend({
  toBeValidHexagram(received) {
    const pass = received &&
      typeof received.name === 'string' &&
      typeof received.number === 'number' &&
      received.number >= 1 && received.number <= 64 &&
      typeof received.upperTrigram === 'string' &&
      typeof received.lowerTrigram === 'string' &&
      Array.isArray(received.yaoci) &&
      received.yaoci.length === 6;

    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid hexagram`
          : `expected ${received} to be a valid hexagram with name, number (1-64), trigrams and 6 yaoci`,
      pass,
    };
  },

  toBeValidDivinationResult(received) {
    const pass = received &&
      typeof received.method === 'string' &&
      typeof received.question === 'string' &&
      (received.originalGua || received.result) &&
      typeof received.timestamp === 'object' &&
      received.interpretation;

    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid divination result`
          : `expected ${received} to be a valid divination result with method, question, result and interpretation`,
      pass,
    };
  },

  toContainHexagramFeatures(received) {
    const requiredFeatures = [
      '卦象本质：',
      '五行属性：',
      '时空特征：',
      '关系特征：'
    ];

    const pass = typeof received === 'string' &&
      requiredFeatures.every(feature => received.includes(feature));

    return {
      message: () =>
        pass
          ? `expected ${received} not to contain hexagram features`
          : `expected ${received} to contain all required hexagram features: ${requiredFeatures.join(', ')}`,
      pass,
    };
  },
});

// 测试数据库连接模拟
jest.mock('../database/postgres-connection', () => ({
  db: {
    testConnection: jest.fn().mockResolvedValue(true),
    runMigrations: jest.fn().mockResolvedValue(undefined),
    getDatabaseInfo: jest.fn().mockResolvedValue({
      databaseSize: '10MB',
      tables: ['users', 'divination_logs']
    })
  }
}));

// 测试智谱AI服务模拟
jest.mock('../services/zhipuAI', () => ({
  getZhipuAIService: jest.fn().mockReturnValue({
    getStatus: jest.fn().mockResolvedValue({ available: true }),
    interpretDivination: jest.fn().mockResolvedValue({
      success: true,
      interpretation: '测试AI解读内容',
      usage: { promptTokens: 100, completionTokens: 200, totalTokens: 300 }
    }),
    detailedInterpret: jest.fn().mockResolvedValue({
      success: true,
      interpretation: '测试详细AI解读内容',
      usage: { promptTokens: 150, completionTokens: 350, totalTokens: 500 }
    }),
    quickInterpret: jest.fn().mockResolvedValue({
      success: true,
      interpretation: '测试快速AI解读内容',
      usage: { promptTokens: 50, completionTokens: 100, totalTokens: 150 }
    })
  }),
  initializeZhipuAI: jest.fn(),
  getZhipuAIConfigFromEnv: jest.fn().mockReturnValue({
    apiKey: 'test-api-key',
    baseURL: 'https://api.test.com',
    timeout: 30000
  })
}));

// 清理函数
afterEach(() => {
  jest.clearAllMocks();
});