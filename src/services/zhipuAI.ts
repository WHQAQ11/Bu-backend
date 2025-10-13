// 智谱AI API服务
// 用于集成智谱AI的占卜解读功能

export interface ZhipuAIConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface AIInterpretationRequest {
  prompt: string;
  context?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIInterpretationResponse {
  success: boolean;
  interpretation?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class ZhipuAIService {
  private config: ZhipuAIConfig;
  private baseURL: string;

  constructor(config: ZhipuAIConfig) {
    this.config = config;
    this.baseURL = config.baseURL || 'https://open.bigmodel.cn/api/paas/v4';
  }

  // 调用智谱AI API进行占卜解读
  async interpretDivination(request: AIInterpretationRequest): Promise<AIInterpretationResponse> {
    try {
      // 验证API密钥
      if (!this.config.apiKey) {
        return {
          success: false,
          error: '智谱AI API密钥未配置'
        };
      }

      // 构建请求数据
      const requestData = {
        model: 'glm-4-flash', // 使用GLM-4-Flash模型，性价比高
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

      // 发送API请求
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

      const responseData = await response.json() as any;

      // 提取AI解读内容
      const interpretation = responseData.choices?.[0]?.message?.content;

      if (!interpretation) {
        return {
          success: false,
          error: 'AI解读内容为空'
        };
      }

      // 提取使用量信息
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

    } catch (error) {
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

  // 快速解读（简化版本）
  async quickInterpret(question: string, hexagramName: string, hexagramInfo: any): Promise<AIInterpretationResponse> {
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

  // 详细解读（完整版本）
  async detailedInterpret(
    question: string,
    method: string,
    hexagramName: string,
    hexagramInfo: any,
    focus?: string
  ): Promise<AIInterpretationResponse> {
    // 使用AI提示词构造器生成详细提示词
    const { AIPromptBuilder } = await import('./aiPromptBuilder');

    const context = {
      method: method as any,
      question,
      guaName: hexagramName,
      guaInfo: hexagramInfo
    };

    const options = {
      style: 'detailed' as const,
      focus: focus as any || 'general' as const,
      language: 'chinese' as const,
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

  // 验证API配置
  validateConfig(): { valid: boolean; error?: string } {
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

  // 获取API状态
  async getStatus(): Promise<{ available: boolean; error?: string }> {
    try {
      const validation = this.validateConfig();
      if (!validation.valid) {
        return {
          available: false,
          error: validation.error
        };
      }

      // 发送简单的测试请求
      const testResponse = await this.interpretDivination({
        prompt: '请简单回复"测试成功"',
        temperature: 0.1,
        maxTokens: 50
      });

      return {
        available: testResponse.success,
        error: testResponse.error
      };

    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
}

// 创建全局智谱AI服务实例
let zhipuAIService: ZhipuAIService | null = null;

export function initializeZhipuAI(config: ZhipuAIConfig): ZhipuAIService {
  zhipuAIService = new ZhipuAIService(config);
  console.log('✅ 智谱AI服务初始化完成');
  return zhipuAIService;
}

export function getZhipuAIService(): ZhipuAIService {
  if (!zhipuAIService) {
    throw new Error('智谱AI服务未初始化，请先调用 initializeZhipuAI');
  }
  return zhipuAIService;
}

// 环境变量配置
export function getZhipuAIConfigFromEnv(): ZhipuAIConfig {
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