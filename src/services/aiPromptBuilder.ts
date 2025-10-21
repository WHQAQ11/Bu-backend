// AI 提示词构造器
// 用于生成智谱AI的专业占卜解读提示词

import { logger } from '../utils/logger';

export interface DivinationContext {
  method: 'liuyao' | 'meihua' | 'zhouyi';
  question: string;
  guaName: string;
  guaInfo: {
    number: number;
    upperTrigram: string;
    lowerTrigram: string;
    changingYao?: number;
    changedGua?: { name: string; number: number; };
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

    logger.debug('提示词构造', '开始构造AI提示词', {
      method: context.method,
      question: context.question,
      guaName: context.guaName,
      guaNumber: context.guaInfo.number,
      options: { style, focus, language, includeAdvice, includeWarnings }
    });

    // 获取卦象数据并记录
    const hexagramData = this.getHexagramData(context.guaInfo.number);
    logger.hexagramData(hexagramData);

    let prompt = this.buildSystemPrompt();
    prompt += this.buildEnhancedContextPrompt(context, style, language);
    prompt += this.buildHexagramSpecificAnalysis(context);
    prompt += this.buildQuestionHexagramCorrelation(context);

    if (focus !== 'general') {
      prompt += this.buildDynamicFocusPrompt(context, focus, language);
    }

    if (includeAdvice) {
      prompt += this.buildEnhancedAdvicePrompt(context, style, language);
    }

    if (includeWarnings) {
      prompt += this.buildWarningsPrompt(language);
    }

    prompt += this.buildOutputFormatPrompt(language);

    logger.promptConstruction(context, prompt);

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

  // 增强的上下文提示词
  private static buildEnhancedContextPrompt(context: DivinationContext, style: string, language: string): string {
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

    // 显示爻辞
    if (guaInfo.interpretation.yaoci && guaInfo.interpretation.yaoci.length > 0) {
      contextPrompt += `\n爻辞：`;
      guaInfo.interpretation.yaoci.forEach((yaoci: string, index: number) => {
        contextPrompt += `\n  ${yaoci}`;
      });
    }

    if (guaInfo.interpretation.analysis) {
      contextPrompt += `\n传统分析：${guaInfo.interpretation.analysis}`;
    }

    return contextPrompt;
  }

  // 卦象特定分析
  private static buildHexagramSpecificAnalysis(context: DivinationContext): string {
    const hexagramData = this.getHexagramData(context.guaInfo.number);

    let prompt = `\n\n【${context.guaName}卦深层特征】`;
    prompt += `\n📖 卦象本质：${hexagramData.symbolism}`;
    prompt += `\n🌟 五行属性：${hexagramData.elements.wuxing} (${hexagramData.elements.nature})`;
    prompt += `\n🗺️ 方位时序：${hexagramData.elements.direction}方位，${hexagramData.elements.season}季`;
    prompt += `\n🔄 关系特征：${hexagramData.elements.relationship}`;

    if (context.guaInfo.changingYao && context.guaInfo.changedGua) {
      const changedHexagram = this.getHexagramData(context.guaInfo.changedGua.number);
      prompt += `\n\n🔄 本变卦对比：`;
      prompt += `\n   本卦${context.guaName}：${hexagramData.elements.relationship}`;
      prompt += `\n   变卦${context.guaInfo.changedGua}：${changedHexagram.elements.relationship}`;
      prompt += `\n   转变意义：分析这种变化对问题的特殊启示`;
    }

    return prompt;
  }

  // 问题与卦象关联分析
  private static buildQuestionHexagramCorrelation(context: DivinationContext): string {
    const questionType = this.detectQuestionType(context.question);
    const hexagramData = this.getHexagramData(context.guaInfo.number);

    let prompt = `\n\n【问题卦象关联分析】`;
    prompt += `\n问题类型：${this.getQuestionTypeName(questionType)}`;
    prompt += `\n卦象指导：${hexagramData.analysis[questionType] || '请结合卦象基本含义进行分析'}`;
    prompt += `\n请深入分析${context.guaName}卦对此类问题的独特指导价值，避免泛泛而谈。`;

    return prompt;
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

  // 动态重点关注提示词
  private static buildDynamicFocusPrompt(context: DivinationContext, focus: string, language: string): string {
    const hexagramData = this.getHexagramData(context.guaInfo.number);

    let focusPrompt = `\n\n【${this.getFocusAreaName(focus)}专项分析】`;

    focusPrompt += `\n基于${context.guaName}卦的特征，请深入分析卦象在${this.getFocusAreaName(focus)}方面的独特指导：`;
    focusPrompt += `\n结合用户的问题"${context.question}"，提供针对性的分析和建议。`;

    if (focus === 'career' && hexagramData.analysis.career) {
      focusPrompt += `\n\n卦象事业指导：${hexagramData.analysis.career}`;
    } else if (focus === 'relationship' && hexagramData.analysis.relationship) {
      focusPrompt += `\n\n卦象感情指导：${hexagramData.analysis.relationship}`;
    } else if (focus === 'health' && hexagramData.analysis.health) {
      focusPrompt += `\n\n卦象健康指导：${hexagramData.analysis.health}`;
    } else if (focus === 'wealth' && hexagramData.analysis.wealth) {
      focusPrompt += `\n\n卦象财富指导：${hexagramData.analysis.wealth}`;
    }

    focusPrompt += `\n\n请结合卦象的${hexagramData.elements.nature}特质，提供具体的行动建议。`;

    return focusPrompt;
  }

  // 增强的建议提示词
  private static buildEnhancedAdvicePrompt(context: DivinationContext, style: string, language: string): string {
    const hexagramData = this.getHexagramData(context.guaInfo.number);

    let advicePrompt = `\n\n【${context.guaName}卦实用建议】`;
    advicePrompt += `\n请基于${context.guaName}卦的${hexagramData.elements.nature}特征和${hexagramData.elements.relationship}特质，为用户提供5-7条具体、可操作的建议：`;

    advicePrompt += `\n\n1. 卦象核心原则：基于"${hexagramData.symbolism}"的指导思想`;
    advicePrompt += `\n2. 行动时机建议：结合${hexagramData.elements.season}季和${hexagramData.elements.direction}方位的特征`;
    advicePrompt += `\n3. 心态调整指导：根据${hexagramData.elements.nature}特质调整心理状态`;
    advicePrompt += `\n4. 具体行动计划：针对"${context.question}"的行动步骤`;
    advicePrompt += `\n5. 注意事项提醒：需要避免的行为和风险`;

    if (context.guaInfo.changingYao) {
      advicePrompt += `\n6. 变化应对策略：基于动爻变化的适应性调整`;
    }

    advicePrompt += `\n7. 长期发展建议：保持${hexagramData.elements.relationship}的长期策略`;

    advicePrompt += `\n\n建议要具体可执行，避免空泛的套话，体现${context.guaName}卦的独特性。`;

    return advicePrompt;
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
    const methodNames: { [key: string]: string } = {
      'liuyao': '六爻占卜',
      'meihua': '梅花易数',
      'zhouyi': '周易占卜'
    };
    return methodNames[method] || '传统占卜';
  }

  // 获取关注领域名称
  private static getFocusAreaName(focus: string): string {
    const focusNames: { [key: string]: string } = {
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

  // 获取卦象数据
  private static getHexagramData(guaNumber: number) {
    // 导入hexagram数据库
    const { COMPLETE_HEXAGRAMS } = require('../data/hexagramDatabase');
    return COMPLETE_HEXAGRAMS.find((h: any) => h.number === guaNumber) || COMPLETE_HEXAGRAMS[0];
  }

  // 检测问题类型
  private static detectQuestionType(question: string): string {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('工作') || lowerQuestion.includes('事业') || lowerQuestion.includes('职业') || lowerQuestion.includes('公司') || lowerQuestion.includes('发展')) {
      return 'career';
    }
    if (lowerQuestion.includes('感情') || lowerQuestion.includes('恋爱') || lowerQuestion.includes('关系') || lowerQuestion.includes('婚姻') || lowerQuestion.includes('爱情')) {
      return 'relationship';
    }
    if (lowerQuestion.includes('健康') || lowerQuestion.includes('身体') || lowerQuestion.includes('病') || lowerQuestion.includes('医') || lowerQuestion.includes('养')) {
      return 'health';
    }
    if (lowerQuestion.includes('财') || lowerQuestion.includes('钱') || lowerQuestion.includes('投资') || lowerQuestion.includes('生意') || lowerQuestion.includes('赚钱')) {
      return 'wealth';
    }

    return 'general';
  }

  // 获取问题类型名称
  private static getQuestionTypeName(type: string): string {
    const typeNames: { [key: string]: string } = {
      'career': '事业发展',
      'relationship': '感情关系',
      'health': '健康状况',
      'wealth': '财运财富',
      'general': '整体运势'
    };
    return typeNames[type] || '整体运势';
  }
}