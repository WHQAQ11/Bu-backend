// AI 提示词构造器
// 用于生成智谱AI的专业占卜解读提示词

export interface DivinationContext {
  method: 'liuyao' | 'meihua' | 'zhouyi';
  question: string;
  guaName: string;
  guaInfo: {
    number: number;
    upperTrigram: string;
    lowerTrigram: string;
    changingYao?: number;
    interpretation: {
      guaci: string;
      yaoci?: string[];
      shiyi?: string;
      analysis?: string;
    };
  };
  userInfo?: {
    name?: string;
    gender?: string;
    birthYear?: number;
    birthMonth?: number;
    birthDay?: number;
  };
}

export interface PromptOptions {
  style?: 'traditional' | 'modern' | 'detailed' | 'concise';
  focus?: 'career' | 'relationship' | 'health' | 'wealth' | 'general';
  language?: 'chinese' | 'bilingual';
  includeAdvice?: boolean;
  includeWarnings?: boolean;
}

export class AIPromptBuilder {
  // 主提示词构造器
  static buildDivinationPrompt(context: DivinationContext, options: PromptOptions = {}): string {
    const style = options.style || 'detailed';
    const focus = options.focus || 'general';
    const language = options.language || 'chinese';
    const includeAdvice = options.includeAdvice !== false;
    const includeWarnings = options.includeWarnings !== false;

    let prompt = this.buildSystemPrompt();
    prompt += this.buildContextPrompt(context, style, language);
    prompt += this.buildDivinationAnalysis(context, style, language);

    if (focus !== 'general') {
      prompt += this.buildFocusPrompt(focus, context.question, language);
    }

    if (includeAdvice) {
      prompt += this.buildAdvicePrompt(style, language);
    }

    if (includeWarnings) {
      prompt += this.buildWarningsPrompt(language);
    }

    prompt += this.buildOutputFormatPrompt(language);

    return prompt;
  }

  // 系统提示词
  private static buildSystemPrompt(): string {
    return `你是一位精通中国传统文化和易经占卜的专业占卜师。你拥有深厚的六爻、梅花易数等传统占卜方法的知识，能够结合现代生活的实际情况，为用户提供准确、实用的占卜解读。

你的回答应该：
- 基于传统易经理论，同时结合现代生活实际
- 语言通俗易懂，避免过于神秘的术语
- 提供建设性意见和实用建议
- 保持积极正面的引导

请始终以专业、负责任的态度进行占卜解读。`;
  }

  // 上下文提示词
  private static buildContextPrompt(context: DivinationContext, style: string, language: string): string {
    const { method, question, guaName, guaInfo } = context;

    let contextPrompt = `\n\n【占卜基本信息】`;
    contextPrompt += `\n占卜方法：${this.getMethodName(method)}`;
    contextPrompt += `\n所问问题：${question}`;
    contextPrompt += `\n得到卦象：${guaName}卦（第${guaInfo.number}卦）`;
    contextPrompt += `\n上卦：${guaInfo.upperTrigram}，下卦：${guaInfo.lowerTrigram}`;

    if (guaInfo.changingYao) {
      contextPrompt += `\n动爻：第${guaInfo.changingYao}爻`;
    } else {
      contextPrompt += `\n动爻：无`;
    }

    contextPrompt += `\n\n【经典文献】`;
    contextPrompt += `\n卦辞：${guaInfo.interpretation.guaci}`;

    if (guaInfo.interpretation.shiyi) {
      contextPrompt += `\n十翼：${guaInfo.interpretation.shiyi}`;
    }

    if (guaInfo.interpretation.analysis) {
      contextPrompt += `\n传统分析：${guaInfo.interpretation.analysis}`;
    }

    return contextPrompt;
  }

  // 占卜分析提示词
  private static buildDivinationAnalysis(context: DivinationContext, style: string, language: string): string {
    let analysisPrompt = `\n\n【占卜深度分析】`;

    analysisPrompt += `\n请从以下几个方面对本次占卜进行专业分析：`;
    analysisPrompt += `\n1. 卦象解析：解释${context.guaName}卦的基本含义、象征意义和核心特征`;
    analysisPrompt += `\n2. 爻母关系：分析上卦${context.guaInfo.upperTrigram}和下卦${context.guaInfo.lowerTrigram}的相互作用关系`;

    if (context.guaInfo.changingYao) {
      analysisPrompt += `\n3. 动爻意义：详细解读第${context.guaInfo.changingYao}爻的含义及其对整体卦象的影响`;
    } else {
      analysisPrompt += `\n3. 静卦特征：分析此卦象的稳定性和持续性`;
    }

    analysisPrompt += `\n4. 时机判断：根据当前的时间和环境因素，分析卦象所指示的时机是否合适`;
    analysisPrompt += `\n5. 吉凶判断：综合以上分析，对此卦象的吉凶性质做出客观判断`;

    return analysisPrompt;
  }

  // 重点关注提示词
  private static buildFocusPrompt(focus: string, question: string, language: string): string {
    let focusPrompt = `\n\n【专项分析】`;

    focusPrompt += `\n请特别关注${this.getFocusAreaName(focus)}方面的解读：`;
    focusPrompt += `\n结合用户的问题"${question}"，重点分析卦象在这一领域的指导意义`;

    if (focus === 'career') {
      focusPrompt += `\n包括：事业发展机遇、工作环境变化、职场人际关系、职业规划建议等`;
    } else if (focus === 'relationship') {
      focusPrompt += `\n包括：感情发展趋势、人际关系处理、婚姻家庭状况、情感建议等`;
    } else if (focus === 'health') {
      focusPrompt += `\n包括：身体健康状况、心理状态调节、养生保健建议、疾病预防提醒等`;
    } else if (focus === 'wealth') {
      focusPrompt += `\n包括：财运发展趋势、投资理财建议、风险管理、财富增长机会等`;
    }

    return focusPrompt;
  }

  // 建议提示词
  private static buildAdvicePrompt(style: string, language: string): string {
    return `\n\n【实用建议】\n请根据占卜结果，为用户提供3-5条具体、可操作的建议或指导原则。建议应该具有实用性，能够帮助用户在实际生活中做出更好的决策。`;
  }

  // 警示提示词
  private static buildWarningsPrompt(language: string): string {
    return `\n\n【重要提示】\n请务必包含以下免责声明：\n- 占卜结果仅供参考，不能替代专业咨询\n- 重要决策请理性思考，结合实际情况\n- 保持积极心态，相信自己的判断能力`;
  }

  // 输出格式提示词
  private static buildOutputFormatPrompt(language: string): string {
    return `\n\n【输出要求】\n请按照以下格式输出：\n\n📜 占卜结果摘要\n\n🔮 卦象解析\n\n💡 核心启示\n\n🎯 行动建议\n\n⚠️ 温馨提示\n\n请确保回答既专业又易懂，避免过于复杂的术语。`;
  }

  // 获取占卜方法名称
  private static getMethodName(method: string): string {
    const methodNames = {
      'liuyao': '六爻占卜',
      'meihua': '梅花易数',
      'zhouyi': '周易占卜'
    };
    return methodNames[method] || '传统占卜';
  }

  // 获取关注领域名称
  private static getFocusAreaName(focus: string): string {
    const focusNames = {
      'career': '事业发展',
      'relationship': '感情关系',
      'health': '健康状况',
      'wealth': '财运财富',
      'general': '整体运势'
    };
    return focusNames[focus] || '整体运势';
  }

  // 生成简短版提示词（用于快速回复）
  static buildQuickPrompt(context: DivinationContext): string {
    return `作为专业占卜师，请解读${context.guaName}卦对问题"${context.question}"的启示。

卦象信息：${context.guaInfo.upperTrigram}上${context.guaInfo.lowerTrigram}下${context.guaInfo.changingYao ? `，第${context.guaInfo.changingYao}爻为动爻` : ''}
卦辞：${context.guaInfo.interpretation.guaci}

请提供简洁明了的解读，包括卦象含义和实用建议。`;
  }

  // 生成英文版提示词
  static buildEnglishPrompt(context: DivinationContext, options: PromptOptions = {}): string {
    const { method, question, guaName, guaInfo } = context;

    return `You are a professional Chinese divination expert specializing in I Ching (Book of Changes) interpretations.

**Divination Context:**
- Method: ${this.getMethodName(method)}
- Question: ${question}
- Hexagram: ${guaName} (Hexagram ${guaInfo.number})
- Upper Trigram: ${guaInfo.upperTrigram}
- Lower Trigram: ${guaInfo.lowerTrigram}
- Changing Lines: ${guaInfo.changingYao ? `Line ${guaInfo.changingYao}` : 'None'}

**Classic Text:**
- Judgment: ${guaInfo.interpretation.guaci}
- ${guaInfo.interpretation.shiyi ? `Wings: ${guaInfo.interpretation.shiyi}` : ''}

Please provide a professional interpretation in English that combines traditional I Ching wisdom with modern practical guidance. Include the hexagram's core meaning, the interaction between trigrams, and practical advice for the user's question.

Format your response clearly with sections for interpretation and guidance.`;
  }

  // 生成情感化提示词
  static buildEmotionalPrompt(context: DivinationContext, options: PromptOptions = {}): string {
    let prompt = this.buildDivinationPrompt(context, { ...options, style: 'detailed' });

    prompt += `\n\n【情感化表达】\n请用温暖、关怀的语调进行解读，让用户感受到理解和支持。`;
    prompt += `\n在保持专业性的同时，适当加入情感色彩，使解读更有温度和人情味。`;

    return prompt;
  }
}