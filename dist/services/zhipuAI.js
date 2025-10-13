"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhipuAIService = void 0;
exports.initializeZhipuAI = initializeZhipuAI;
exports.getZhipuAIService = getZhipuAIService;
exports.getZhipuAIConfigFromEnv = getZhipuAIConfigFromEnv;
class ZhipuAIService {
    constructor(config) {
        this.config = config;
        this.baseURL = config.baseURL || 'https://open.bigmodel.cn/api/paas/v4';
    }
    async interpretDivination(request) {
        try {
            if (!this.config.apiKey) {
                return {
                    success: false,
                    error: '智谱AI API密钥未配置'
                };
            }
            const requestData = {
                model: 'glm-4-flash',
                messages: [
                    {
                        role: 'system',
                        content: '你是一位精通中国传统文化和易经占卜的专业占卜师。请基于提供的占卜信息，给出专业、准确、实用的解读。'
                    },
                    {
                        role: 'user',
                        content: request.prompt
                    }
                ],
                temperature: request.temperature || 0.7,
                max_tokens: request.maxTokens || 2000,
                top_p: 0.9,
                stream: false
            };
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify(requestData),
                signal: AbortSignal.timeout(this.config.timeout || 30000)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('智谱AI API调用失败:', response.status, errorData);
                return {
                    success: false,
                    error: `智谱AI API调用失败: ${response.status} ${response.statusText}`
                };
            }
            const responseData = await response.json();
            const interpretation = responseData.choices?.[0]?.message?.content;
            if (!interpretation) {
                return {
                    success: false,
                    error: 'AI解读内容为空'
                };
            }
            const usage = responseData.usage ? {
                promptTokens: responseData.usage.prompt_tokens || 0,
                completionTokens: responseData.usage.completion_tokens || 0,
                totalTokens: responseData.usage.total_tokens || 0
            } : undefined;
            console.log(`✅ 智谱AI解读成功，使用${usage?.totalTokens || 0}个token`);
            return {
                success: true,
                interpretation: interpretation.trim(),
                usage
            };
        }
        catch (error) {
            console.error('❌ 智谱AI解读失败:', error);
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    return {
                        success: false,
                        error: '请求超时，请稍后重试'
                    };
                }
                if (error.message.includes('fetch')) {
                    return {
                        success: false,
                        error: '网络连接失败，请检查网络连接'
                    };
                }
            }
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            };
        }
    }
    async quickInterpret(question, hexagramName, hexagramInfo) {
        const quickPrompt = `作为专业占卜师，请解读${hexagramName}卦对问题"${question}"的启示。

卦象信息：${hexagramInfo.upperTrigram}上${hexagramInfo.lowerTrigram}下${hexagramInfo.changingYao ? `，第${hexagramInfo.changingYao}爻为动爻` : ''}
卦辞：${hexagramInfo.interpretation.guaci}

请提供简洁明了的解读，包括卦象含义和实用建议。`;
        return this.interpretDivination({
            prompt: quickPrompt,
            temperature: 0.5,
            maxTokens: 500
        });
    }
    async detailedInterpret(question, method, hexagramName, hexagramInfo, focus) {
        const { AIPromptBuilder } = await Promise.resolve().then(() => __importStar(require('./aiPromptBuilder')));
        const context = {
            method: method,
            question,
            guaName: hexagramName,
            guaInfo: hexagramInfo
        };
        const options = {
            style: 'detailed',
            focus: focus || 'general',
            language: 'chinese',
            includeAdvice: true,
            includeWarnings: true
        };
        const detailedPrompt = AIPromptBuilder.buildDivinationPrompt(context, options);
        return this.interpretDivination({
            prompt: detailedPrompt,
            temperature: 0.7,
            maxTokens: 2000
        });
    }
    validateConfig() {
        if (!this.config.apiKey) {
            return {
                valid: false,
                error: '智谱AI API密钥未配置'
            };
        }
        if (typeof this.config.apiKey !== 'string' || this.config.apiKey.length < 10) {
            return {
                valid: false,
                error: '智谱AI API密钥格式无效'
            };
        }
        return {
            valid: true
        };
    }
    async getStatus() {
        try {
            const validation = this.validateConfig();
            if (!validation.valid) {
                return {
                    available: false,
                    error: validation.error
                };
            }
            const testResponse = await this.interpretDivination({
                prompt: '请简单回复"测试成功"',
                temperature: 0.1,
                maxTokens: 50
            });
            return {
                available: testResponse.success,
                error: testResponse.error
            };
        }
        catch (error) {
            return {
                available: false,
                error: error instanceof Error ? error.message : '未知错误'
            };
        }
    }
}
exports.ZhipuAIService = ZhipuAIService;
let zhipuAIService = null;
function initializeZhipuAI(config) {
    zhipuAIService = new ZhipuAIService(config);
    console.log('✅ 智谱AI服务初始化完成');
    return zhipuAIService;
}
function getZhipuAIService() {
    if (!zhipuAIService) {
        throw new Error('智谱AI服务未初始化，请先调用 initializeZhipuAI');
    }
    return zhipuAIService;
}
function getZhipuAIConfigFromEnv() {
    const apiKey = process.env.ZHIPUAI_API_KEY;
    if (!apiKey) {
        console.warn('⚠️ 环境变量 ZHIPUAI_API_KEY 未设置');
    }
    return {
        apiKey: apiKey || '',
        baseURL: process.env.ZHIPUAI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
        timeout: parseInt(process.env.ZHIPUAI_TIMEOUT || '30000')
    };
}
//# sourceMappingURL=zhipuAI.js.map