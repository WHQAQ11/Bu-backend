// 环境配置管理
// 支持不同环境的配置和功能开关

export interface EnvironmentConfig {
  // 基础配置
  nodeEnv: string;
  port: number;
  database: {
    url: string;
    ssl: boolean;
    timeout: number;
  };

  // AI服务配置
  ai: {
    zhipuApiKey: string;
    zhipuBaseUrl: string;
    zhipuTimeout: number;
    model: string;
    temperature: number;
    maxTokens: number;
  };

  // 功能开关
  features: {
    useCompleteHexagramDatabase: boolean;
    enhancedAIAnalysis: boolean;
    enableQuestionTypeDetection: boolean;
    enableHexagramSpecificPrompts: boolean;
    enableDetailedLogging: boolean;
  };

  // 日志配置
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
    enableFile: boolean;
    maxFileSize: string;
    maxFiles: number;
  };

  // 安全配置
  security: {
    jwtSecret: string;
    jwtExpiration: string;
    bcryptRounds: number;
    rateLimitWindow: number;
    rateLimitMax: number;
  };

  // 业务配置
  business: {
    maxDailyDivinations: number;
    enableUserStatistics: boolean;
    cacheEnabled: boolean;
    cacheTimeout: number;
  };
}

// 开发环境配置
const developmentConfig: EnvironmentConfig = {
  nodeEnv: 'development',
  port: parseInt(process.env.PORT || '3002'),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/bu_dev',
    ssl: false,
    timeout: 30000
  },
  ai: {
    zhipuApiKey: process.env.ZHIPUAI_API_KEY || '',
    zhipuBaseUrl: process.env.ZHIPUAI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
    zhipuTimeout: parseInt(process.env.ZHIPUAI_TIMEOUT || '30000'),
    model: 'glm-4-flash',
    temperature: 0.7,
    maxTokens: 2000
  },
  features: {
    useCompleteHexagramDatabase: process.env.FEATURE_COMPLETE_HEXAGRAMS !== 'false',
    enhancedAIAnalysis: process.env.FEATURE_ENHANCED_AI !== 'false',
    enableQuestionTypeDetection: process.env.FEATURE_QUESTION_DETECTION !== 'false',
    enableHexagramSpecificPrompts: process.env.FEATURE_SPECIFIC_PROMPTS !== 'false',
    enableDetailedLogging: true
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableFile: false,
    maxFileSize: '10m',
    maxFiles: 5
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    jwtExpiration: '7d',
    bcryptRounds: 10,
    rateLimitWindow: 15 * 60 * 1000, // 15分钟
    rateLimitMax: 100
  },
  business: {
    maxDailyDivinations: 50,
    enableUserStatistics: true,
    cacheEnabled: true,
    cacheTimeout: 300000 // 5分钟
  }
};

// 生产环境配置
const productionConfig: EnvironmentConfig = {
  nodeEnv: 'production',
  port: parseInt(process.env.PORT || '3002'),
  database: {
    url: process.env.DATABASE_URL || '',
    ssl: true,
    timeout: 60000
  },
  ai: {
    zhipuApiKey: process.env.ZHIPUAI_API_KEY || '',
    zhipuBaseUrl: process.env.ZHIPUAI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
    zhipuTimeout: parseInt(process.env.ZHIPUAI_TIMEOUT || '30000'),
    model: 'glm-4-flash',
    temperature: 0.7,
    maxTokens: 2000
  },
  features: {
    useCompleteHexagramDatabase: process.env.FEATURE_COMPLETE_HEXAGRAMS === 'true',
    enhancedAIAnalysis: process.env.FEATURE_ENHANCED_AI === 'true',
    enableQuestionTypeDetection: process.env.FEATURE_QUESTION_DETECTION !== 'false',
    enableHexagramSpecificPrompts: process.env.FEATURE_SPECIFIC_PROMPTS !== 'false',
    enableDetailedLogging: false
  },
  logging: {
    level: 'info',
    enableConsole: true,
    enableFile: true,
    maxFileSize: '20m',
    maxFiles: 10
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiration: '7d',
    bcryptRounds: 12,
    rateLimitWindow: 15 * 60 * 1000, // 15分钟
    rateLimitMax: 50
  },
  business: {
    maxDailyDivinations: 20,
    enableUserStatistics: true,
    cacheEnabled: true,
    cacheTimeout: 600000 // 10分钟
  }
};

// 测试环境配置
const testConfig: EnvironmentConfig = {
  nodeEnv: 'test',
  port: parseInt(process.env.TEST_PORT || '3003'),
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/bu_test',
    ssl: false,
    timeout: 15000
  },
  ai: {
    zhipuApiKey: 'test-api-key',
    zhipuBaseUrl: 'https://api.test.com',
    zhipuTimeout: 5000,
    model: 'glm-4-flash',
    temperature: 0.5,
    maxTokens: 500
  },
  features: {
    useCompleteHexagramDatabase: true,
    enhancedAIAnalysis: true,
    enableQuestionTypeDetection: true,
    enableHexagramSpecificPrompts: true,
    enableDetailedLogging: false
  },
  logging: {
    level: 'error',
    enableConsole: false,
    enableFile: false,
    maxFileSize: '1m',
    maxFiles: 1
  },
  security: {
    jwtSecret: 'test-secret-key',
    jwtExpiration: '1h',
    bcryptRounds: 4,
    rateLimitWindow: 60000, // 1分钟
    rateLimitMax: 1000
  },
  business: {
    maxDailyDivinations: 100,
    enableUserStatistics: false,
    cacheEnabled: false,
    cacheTimeout: 60000 // 1分钟
  }
};

// 获取当前环境配置
export function getConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}

// 获取功能开关
export function getFeatures() {
  return getConfig().features;
}

// 检查功能是否启用
export function isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
  return getFeatures()[feature];
}

// 获取AI配置
export function getAIConfig() {
  return getConfig().ai;
}

// 获取数据库配置
export function getDatabaseConfig() {
  return getConfig().database;
}

// 获取安全配置
export function getSecurityConfig() {
  return getConfig().security;
}

// 获取业务配置
export function getBusinessConfig() {
  return getConfig().business;
}

// 获取日志配置
export function getLoggingConfig() {
  return getConfig().logging;
}

// 验证必需的环境变量
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const config = getConfig();
  const errors: string[] = [];

  // 验证生产环境必需的配置
  if (config.nodeEnv === 'production') {
    if (!config.database.url) {
      errors.push('DATABASE_URL is required in production');
    }
    if (!config.ai.zhipuApiKey) {
      errors.push('ZHIPUAI_API_KEY is required in production');
    }
    if (!config.security.jwtSecret || config.security.jwtSecret === 'dev-secret-key-change-in-production') {
      errors.push('JWT_SECRET must be set in production');
    }
  }

  // 验证功能配置的一致性
  if (config.features.enhancedAIAnalysis && !config.features.useCompleteHexagramDatabase) {
    errors.push('enhancedAIAnalysis requires useCompleteHexagramDatabase to be enabled');
  }

  if (config.features.enableHexagramSpecificPrompts && !config.features.useCompleteHexagramDatabase) {
    errors.push('enableHexagramSpecificPrompts requires useCompleteHexagramDatabase to be enabled');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// 打印配置摘要（用于启动时显示）
export function printConfigSummary(): void {
  const config = getConfig();
  const features = getFeatures();

  console.log('🔧 环境配置摘要:');
  console.log(`   环境: ${config.nodeEnv}`);
  console.log(`   端口: ${config.port}`);
  console.log(`   数据库: ${config.database.url ? '已配置' : '未配置'}`);
  console.log(`   AI服务: ${config.ai.zhipuApiKey ? '已配置' : '未配置'}`);
  console.log('');

  console.log('🚀 功能开关:');
  console.log(`   完整卦象数据库: ${features.useCompleteHexagramDatabase ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   增强AI分析: ${features.enhancedAIAnalysis ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   问题类型检测: ${features.enableQuestionTypeDetection ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   卦象特定提示词: ${features.enableHexagramSpecificPrompts ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   详细日志: ${features.enableDetailedLogging ? '✅ 启用' : '❌ 禁用'}`);
  console.log('');

  // 验证配置
  const validation = validateEnvironment();
  if (!validation.valid) {
    console.log('⚠️ 配置警告:');
    validation.errors.forEach(error => {
      console.log(`   - ${error}`);
    });
    console.log('');
  }
}

export default {
  getConfig,
  getFeatures,
  isFeatureEnabled,
  getAIConfig,
  getDatabaseConfig,
  getSecurityConfig,
  getBusinessConfig,
  getLoggingConfig,
  validateEnvironment,
  printConfigSummary
};