"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'http://localhost:3003';
let authToken = '';
async function loginTestUser() {
    try {
        const response = await axios_1.default.post(`${BASE_URL}/api/auth/login`, {
            email: 'test4@example.com',
            password: 'password123'
        });
        if (response.data.success) {
            authToken = response.data.data.token;
            console.log('✅ 用户登录成功，获取到token');
            return true;
        }
        else {
            console.error('❌ 用户登录失败:', response.data.message);
            return false;
        }
    }
    catch (error) {
        console.error('❌ 登录请求失败:', error instanceof Error ? error.message : '未知错误');
        return false;
    }
}
async function testAIInterpret() {
    try {
        console.log('\n=== 测试AI解卦接口（基于已有记录） ===');
        const logsResponse = await axios_1.default.get(`${BASE_URL}/api/divination/logs`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!logsResponse.data.success || logsResponse.data.data.logs.length === 0) {
            console.log('⚠️ 没有找到占卜记录，先创建一个测试记录');
            const calculateResponse = await axios_1.default.post(`${BASE_URL}/api/divination/calculate`, {
                method: 'liuyao',
                question: '我能否在新的工作中取得成功？'
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!calculateResponse.data.success) {
                console.error('❌ 创建占卜记录失败:', calculateResponse.data.message);
                return;
            }
            console.log('✅ 创建占卜记录成功');
            const newLogsResponse = await axios_1.default.get(`${BASE_URL}/api/divination/logs`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!newLogsResponse.data.success || newLogsResponse.data.data.logs.length === 0) {
                console.error('❌ 仍然无法获取占卜记录');
                return;
            }
            var logs = newLogsResponse.data.data.logs;
        }
        else {
            var logs = logsResponse.data.data.logs;
        }
        const firstLog = logs[0];
        console.log(`📜 使用占卜记录: ID=${firstLog.id}, 问题="${firstLog.question}"`);
        const interpretResponse = await axios_1.default.post(`${BASE_URL}/api/divination/interpret`, {
            log_id: firstLog.id,
            style: 'detailed',
            focus: 'career',
            language: 'chinese'
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (interpretResponse.data.success) {
            console.log('✅ AI解卦成功');
            console.log('📊 解读风格:', interpretResponse.data.data.interpretation_style);
            console.log('🎯 关注领域:', interpretResponse.data.data.focus_area);
            console.log('💬 AI解读长度:', interpretResponse.data.data.ai_interpretation?.length || 0, '字符');
            if (interpretResponse.data.data.usage) {
                console.log('🔢 Token使用量:', interpretResponse.data.data.usage);
            }
            console.log('📝 AI解读预览:');
            console.log(interpretResponse.data.data.ai_interpretation?.substring(0, 200) + '...');
        }
        else {
            console.error('❌ AI解卦失败:', interpretResponse.data.message);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response?.status === 503) {
                console.log('⚠️ AI服务不可用（这是预期的，因为API Key未配置）');
                console.log('💡 要启用AI功能，请设置 ZHIPUAI_API_KEY 环境变量');
            }
            else {
                console.error('❌ AI解卦请求失败:', error.response?.data || error.message);
            }
        }
        else {
            console.error('❌ AI解卦测试失败:', error instanceof Error ? error.message : '未知错误');
        }
    }
}
async function testQuickAIInterpret() {
    try {
        console.log('\n=== 测试快速AI解卦接口 ===');
        const quickInterpretResponse = await axios_1.default.post(`${BASE_URL}/api/divination/quick-interpret`, {
            method: 'liuyao',
            question: '我的感情运势如何？',
            hexagram_name: '坤',
            hexagram_info: {
                upperTrigram: '坤',
                lowerTrigram: '坤',
                interpretation: {
                    guaci: '坤：元，亨，利牝马之贞。',
                    analysis: '坤卦为地，象征柔顺包容。此卦显示宜静不宜动，以柔克刚。'
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (quickInterpretResponse.data.success) {
            console.log('✅ 快速AI解卦成功');
            console.log('💬 AI解读长度:', quickInterpretResponse.data.data.ai_interpretation?.length || 0, '字符');
            if (quickInterpretResponse.data.data.usage) {
                console.log('🔢 Token使用量:', quickInterpretResponse.data.data.usage);
            }
            console.log('📝 AI解读预览:');
            console.log(quickInterpretResponse.data.data.ai_interpretation?.substring(0, 200) + '...');
        }
        else {
            console.error('❌ 快速AI解卦失败:', quickInterpretResponse.data.message);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response?.status === 503) {
                console.log('⚠️ AI服务不可用（这是预期的，因为API Key未配置）');
                console.log('💡 要启用AI功能，请设置 ZHIPUAI_API_KEY 环境变量');
            }
            else {
                console.error('❌ 快速AI解卦请求失败:', error.response?.data || error.message);
            }
        }
        else {
            console.error('❌ 快速AI解卦测试失败:', error instanceof Error ? error.message : '未知错误');
        }
    }
}
async function testParameterValidation() {
    try {
        console.log('\n=== 测试参数验证 ===');
        console.log('1. 测试无效的style参数:');
        const invalidStyleResponse = await axios_1.default.post(`${BASE_URL}/api/divination/interpret`, {
            log_id: 1,
            style: 'invalid_style'
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).catch(error => error.response);
        if (invalidStyleResponse?.status === 400) {
            console.log('✅ 无效style参数验证正常');
        }
        else {
            console.log('❌ 无效style参数验证失败');
        }
        console.log('2. 测试无效的focus参数:');
        const invalidFocusResponse = await axios_1.default.post(`${BASE_URL}/api/divination/interpret`, {
            log_id: 1,
            focus: 'invalid_focus'
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).catch(error => error.response);
        if (invalidFocusResponse?.status === 400) {
            console.log('✅ 无效focus参数验证正常');
        }
        else {
            console.log('❌ 无效focus参数验证失败');
        }
        console.log('3. 测试缺少log_id参数:');
        const missingParamsResponse = await axios_1.default.post(`${BASE_URL}/api/divination/interpret`, {
            style: 'detailed'
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).catch(error => error.response);
        if (missingParamsResponse?.status === 400) {
            console.log('✅ 缺少必要参数验证正常');
        }
        else {
            console.log('❌ 缺少必要参数验证失败');
        }
        console.log('4. 测试快速解读缺少参数:');
        const quickMissingParamsResponse = await axios_1.default.post(`${BASE_URL}/api/divination/quick-interpret`, {
            method: 'liuyao',
            question: '测试问题'
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).catch(error => error.response);
        if (quickMissingParamsResponse?.status === 400) {
            console.log('✅ 快速解读缺少参数验证正常');
        }
        else {
            console.log('❌ 快速解读缺少参数验证失败');
        }
    }
    catch (error) {
        console.error('❌ 参数验证测试失败:', error instanceof Error ? error.message : '未知错误');
    }
}
async function runTests() {
    console.log('=== AI解卦API测试开始 ===\n');
    const loginSuccess = await loginTestUser();
    if (!loginSuccess) {
        console.error('❌ 无法获取认证token，测试终止');
        return;
    }
    await testAIInterpret();
    await testQuickAIInterpret();
    await testParameterValidation();
    console.log('\n=== AI解卦API测试完成 ===');
}
runTests().catch(error => {
    console.error('❌ 测试运行失败:', error);
});
//# sourceMappingURL=test-aiInterpret.js.map