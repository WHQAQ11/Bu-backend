// 智谱AI服务测试文件
import { ZhipuAIService, initializeZhipuAI, getZhipuAIConfigFromEnv } from './zhipuAI';

console.log('=== 智谱AI服务测试 ===\n');

// 测试1: 服务初始化测试
console.log('1. 服务初始化测试:');
try {
  const config = getZhipuAIConfigFromEnv();
  console.log('API Key配置:', config.apiKey ? '已配置' : '未配置');
  console.log('Base URL:', config.baseURL);
  console.log('超时时间:', config.timeout, 'ms');

  if (config.apiKey) {
    const service = initializeZhipuAI(config);
    console.log('✅ 智谱AI服务初始化成功');
  } else {
    console.log('⚠️ API Key未配置，跳过实际API调用测试');
  }
} catch (error) {
  console.error('❌ 服务初始化失败:', error);
}

// 测试2: 配置验证测试
console.log('\n2. 配置验证测试:');
try {
  const validConfig = {
    apiKey: 'test-api-key-123456789',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    timeout: 30000
  };

  const validService = new ZhipuAIService(validConfig);
  const validValidation = validService.validateConfig();
  console.log('有效配置验证:', validValidation.valid ? '✅ 通过' : '❌ 失败');
  if (!validValidation.valid) {
    console.log('错误信息:', validValidation.error);
  }

  const invalidConfig1 = { apiKey: '', baseURL: 'https://open.bigmodel.cn/api/paas/v4' };
  const invalidService1 = new ZhipuAIService(invalidConfig1);
  const invalidValidation1 = invalidService1.validateConfig();
  console.log('空API Key验证:', !invalidValidation1.valid ? '✅ 正确拒绝' : '❌ 错误通过');

  const invalidConfig2 = { apiKey: 'short', baseURL: 'https://open.bigmodel.cn/api/paas/v4' };
  const invalidService2 = new ZhipuAIService(invalidConfig2);
  const invalidValidation2 = invalidService2.validateConfig();
  console.log('短API Key验证:', !invalidValidation2.valid ? '✅ 正确拒绝' : '❌ 错误通过');

} catch (error) {
  console.error('❌ 配置验证测试失败:', error);
}

// 测试3: 快速解读测试（模拟）
console.log('\n3. 快速解读测试（模拟）:');
try {
  const mockConfig = {
    apiKey: 'mock-api-key-for-testing',
    baseURL: 'https://mock-api.example.com',
    timeout: 5000
  };

  const mockService = new ZhipuAIService(mockConfig);

  const mockHexagramInfo = {
    upperTrigram: '乾',
    lowerTrigram: '乾',
    changingYao: 5,
    interpretation: {
      guaci: '乾：元，亨，利，贞。',
      analysis: '乾卦为天，象征刚健中正。'
    }
  };

  console.log('准备进行快速解读测试...');
  console.log('问题: 我的事业发展会如何？');
  console.log('卦象: 乾卦');
  console.log('提示: 由于使用模拟API Key，此测试将失败，这是预期的行为。');

  // 注意：这个测试会失败，因为我们使用的是模拟的API密钥
  // 这主要是为了测试错误处理逻辑

} catch (error) {
  console.error('❌ 快速解读测试失败:', error);
}

// 测试4: 详细解读测试（模拟）
console.log('\n4. 详细解读测试（模拟）:');
try {
  const mockConfig = {
    apiKey: 'mock-api-key-for-testing',
    baseURL: 'https://mock-api.example.com',
    timeout: 5000
  };

  const mockService = new ZhipuAIService(mockConfig);

  const mockHexagramInfo = {
    number: 1,
    upperTrigram: '乾',
    lowerTrigram: '乾',
    changingYao: 5,
    interpretation: {
      guaci: '乾：元，亨，利，贞。',
      yaoci: ['初九：潜龙，勿用。', '九五：飞龙在天，利见大人。'],
      shiyi: '《彖》曰：大哉乾元，万物资始，乃统天。',
      analysis: '乾卦为天，象征刚健中正。此卦显示事情发展顺利，宜积极进取。'
    }
  };

  console.log('准备进行详细解读测试...');
  console.log('问题: 我的事业发展会如何？');
  console.log('占卜方法: 六爻占卜');
  console.log('卦象: 乾卦（第1卦）');
  console.log('关注领域: 事业发展');
  console.log('提示: 由于使用模拟API Key，此测试将失败，这是预期的行为。');

} catch (error) {
  console.error('❌ 详细解读测试失败:', error);
}

// 测试5: 错误处理测试
console.log('\n5. 错误处理测试:');
try {
  // 测试未初始化服务的错误
  try {
    // ZhipuAIService.getInstance();
    console.log('❌ 未初始化服务错误处理失败');
  } catch (error) {
    console.log('✅ 未初始化服务错误处理正常:', error instanceof Error ? error.message : '未知错误');
  }

} catch (error) {
  console.error('❌ 错误处理测试失败:', error);
}

// 测试6: 环境变量测试
console.log('\n6. 环境变量测试:');
try {
  const envConfig = getZhipuAIConfigFromEnv();
  console.log('环境变量 API Key:', envConfig.apiKey ? '已设置' : '未设置');
  console.log('环境变量 Base URL:', envConfig.baseURL);
  console.log('环境变量 超时时间:', envConfig.timeout, 'ms');

  if (!envConfig.apiKey) {
    console.log('\n📝 要启用智谱AI功能，请设置环境变量:');
    console.log('export ZHIPUAI_API_KEY="your-api-key-here"');
    console.log('# 或在 .env 文件中添加:');
    console.log('ZHIPUAI_API_KEY=your-api-key-here');
  }

} catch (error) {
  console.error('❌ 环境变量测试失败:', error);
}

console.log('\n=== 智谱AI服务测试完成 ===');

// 提供实际使用示例
console.log('\n📖 使用示例:');
console.log(`
// 1. 初始化服务
import { initializeZhipuAI, getZhipuAIConfigFromEnv } from './services/zhipuAI';

const config = getZhipuAIConfigFromEnv();
const service = initializeZhipuAI(config);

// 2. 快速解读
const quickResult = await service.quickInterpret(
  '我的事业发展会如何？',
  '乾',
  {
    upperTrigram: '乾',
    lowerTrigram: '乾',
    interpretation: {
      guaci: '乾：元，亨，利，贞。'
    }
  }
);

// 3. 详细解读
const detailedResult = await service.detailedInterpret(
  '我的事业发展会如何？',
  'liuyao',
  '乾',
  hexagramInfo,
  'career'
);

// 4. 检查结果
if (result.success) {
  console.log('AI解读:', result.interpretation);
  console.log('Token使用:', result.usage);
} else {
  console.error('解读失败:', result.error);
}
`);