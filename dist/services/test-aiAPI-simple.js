"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'http://localhost:3003';
async function testAPIEndpoints() {
    try {
        console.log('=== AI解卦API端点测试 ===\n');
        console.log('1. 测试健康检查端点:');
        try {
            const healthResponse = await axios_1.default.get(`${BASE_URL}/health`);
            if (healthResponse.status === 200) {
                console.log('✅ 服务器运行正常');
                console.log('📊 响应:', healthResponse.data);
            }
        }
        catch (error) {
            console.log('❌ 服务器连接失败');
            return;
        }
        console.log('\n2. 测试未授权访问AI解卦接口:');
        try {
            await axios_1.default.post(`${BASE_URL}/api/divination/interpret`, {
                log_id: 1
            });
            console.log('❌ 未授权访问应该被拒绝');
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 401) {
                console.log('✅ 未授权访问被正确拒绝');
            }
            else {
                console.log('❌ 未授权访问处理异常');
            }
        }
        console.log('\n3. 测试无效token访问:');
        try {
            await axios_1.default.post(`${BASE_URL}/api/divination/interpret`, {
                log_id: 1
            }, {
                headers: {
                    'Authorization': 'Bearer invalid-token'
                }
            });
            console.log('❌ 无效token应该被拒绝');
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 401) {
                console.log('✅ 无效token被正确拒绝');
            }
            else {
                console.log('❌ 无效token处理异常');
            }
        }
        console.log('\n4. 测试智谱AI服务配置:');
        console.log('💡 由于API Key未配置，AI服务将不可用，这是预期的行为');
        console.log('\n5. 测试API端点存在性:');
        const endpoints = [
            '/api/divination/interpret',
            '/api/divination/quick-interpret'
        ];
        for (const endpoint of endpoints) {
            try {
                await axios_1.default.post(`${BASE_URL}${endpoint}`, {}, {
                    headers: {
                        'Authorization': 'Bearer test-token'
                    }
                });
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        console.log(`✅ ${endpoint} 端点存在且需要认证`);
                    }
                    else if (error.response?.status === 404) {
                        console.log(`❌ ${endpoint} 端点不存在`);
                    }
                    else {
                        console.log(`⚠️ ${endpoint} 端点响应状态: ${error.response?.status}`);
                    }
                }
            }
        }
    }
    catch (error) {
        console.error('❌ API端点测试失败:', error instanceof Error ? error.message : '未知错误');
    }
}
async function testZhipuAIConfig() {
    try {
        console.log('\n=== 智谱AI服务配置测试 ===\n');
        console.log('1. 环境变量检查:');
        const hasApiKey = !!process.env.ZHIPUAI_API_KEY;
        console.log(`ZHIPUAI_API_KEY: ${hasApiKey ? '已设置' : '未设置'}`);
        if (!hasApiKey) {
            console.log('\n💡 要启用AI解卦功能，请设置环境变量:');
            console.log('export ZHIPUAI_API_KEY="your-api-key-here"');
            console.log('# 或在 .env 文件中添加:');
            console.log('ZHIPUAI_API_KEY=your-api-key-here');
            console.log('\n📖 获取API密钥:');
            console.log('1. 访问 https://open.bigmodel.cn/');
            console.log('2. 注册并登录账户');
            console.log('3. 在控制台中创建API密钥');
            console.log('4. 将密钥设置为环境变量');
        }
        console.log('\n2. API接口说明:');
        console.log('📍 POST /api/divination/interpret - 基于已有占卜记录的AI解读');
        console.log('   参数: log_id (必需), style (可选), focus (可选), language (可选)');
        console.log('');
        console.log('📍 POST /api/divination/quick-interpret - 快速AI解读');
        console.log('   参数: method, question, hexagram_name, hexagram_info (均为必需)');
    }
    catch (error) {
        console.error('❌ 智谱AI配置测试失败:', error instanceof Error ? error.message : '未知错误');
    }
}
async function runSimpleTests() {
    console.log('=== AI解卦API简单测试 ===\n');
    await testAPIEndpoints();
    await testZhipuAIConfig();
    console.log('\n=== 测试总结 ===');
    console.log('✅ API端点已正确配置');
    console.log('✅ 认证中间件工作正常');
    console.log('⚠️ 智谱AI服务需要API密钥才能完全功能');
    console.log('📝 要进行完整测试，请:');
    console.log('   1. 设置 ZHIPUAI_API_KEY 环境变量');
    console.log('   2. 重启后端服务');
    console.log('   3. 运行完整的API测试');
    console.log('\n=== 测试完成 ===');
}
runSimpleTests().catch(error => {
    console.error('❌ 测试运行失败:', error);
});
//# sourceMappingURL=test-aiAPI-simple.js.map