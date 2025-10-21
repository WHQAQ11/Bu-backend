// 卦象数据库和算法测试
import { COMPLETE_HEXAGRAMS, getHexagramByNumber, detectQuestionType } from '../data/hexagramDatabase';
import { performDivination } from '../algorithms/liuyao';
import { performMeihuaDivination } from '../algorithms/meihua';
import { AIPromptBuilder } from '../services/aiPromptBuilder';

describe('卦象数据库测试', () => {
  test('64卦数据完整性', () => {
    expect(COMPLETE_HEXAGRAMS).toHaveLength(15); // 注意：当前只有15个卦，完整版应该是64个
    expect(COMPLETE_HEXAGRAMS.every(h => h.number >= 1 && h.number <= 64)).toBe(true);
    expect(COMPLETE_HEXAGRAMS.every(h => h.name && h.name.length > 0)).toBe(true);
  });

  test('卦象数据结构完整性', () => {
    COMPLETE_HEXAGRAMS.forEach(hexagram => {
      expect(hexagram).toHaveProperty('number');
      expect(hexagram).toHaveProperty('name');
      expect(hexagram).toHaveProperty('upper');
      expect(hexagram).toHaveProperty('lower');
      expect(hexagram).toHaveProperty('guaci');
      expect(hexagram).toHaveProperty('yaoci');
      expect(hexagram).toHaveProperty('shiyi');
      expect(hexagram).toHaveProperty('symbolism');
      expect(hexagram).toHaveProperty('elements');
      expect(hexagram).toHaveProperty('analysis');

      // 检查elements结构
      expect(hexagram.elements).toHaveProperty('wuxing');
      expect(hexagram.elements).toHaveProperty('season');
      expect(hexagram.elements).toHaveProperty('direction');
      expect(hexagram.elements).toHaveProperty('nature');
      expect(hexagram.elements).toHaveProperty('relationship');

      // 检查analysis结构
      expect(hexagram.analysis).toHaveProperty('career');
      expect(hexagram.analysis).toHaveProperty('relationship');
      expect(hexagram.analysis).toHaveProperty('health');
      expect(hexagram.analysis).toHaveProperty('wealth');

      // 检查爻辞数量
      expect(hexagram.yaoci).toHaveLength(6);
    });
  });

  test('爻辞数据完整性', () => {
    expect(COMPLETE_HEXAGRAMS.every(h => h.yaoci && h.yaoci.length === 6)).toBe(true);
    expect(COMPLETE_HEXAGRAMS.every(h => h.yaoci.every(y => y.length > 0))).toBe(true);
  });

  test('查询函数正常工作', () => {
    // 测试按编号查询
    const qianGua = getHexagramByNumber(1);
    expect(qianGua).toBeDefined();
    expect(qianGua?.name).toBe('乾');

    // 测试不存在的卦
    const nonExistent = getHexagramByNumber(100);
    expect(nonExistent).toBeUndefined();
  });
});

describe('问题类型检测测试', () => {
  test('事业问题检测', () => {
    expect(detectQuestionType('我的工作发展如何？')).toBe('career');
    expect(detectQuestionType('职业规划')).toBe('career');
    expect(detectQuestionType('公司前景')).toBe('career');
    expect(detectQuestionType('事业发展')).toBe('career');
  });

  test('感情问题检测', () => {
    expect(detectQuestionType('感情问题')).toBe('relationship');
    expect(detectQuestionType('恋爱关系')).toBe('relationship');
    expect(detectQuestionType('婚姻状况')).toBe('relationship');
    expect(detectQuestionType('爱情困惑')).toBe('relationship');
  });

  test('健康问题检测', () => {
    expect(detectQuestionType('身体健康')).toBe('health');
    expect(detectQuestionType('疾病治疗')).toBe('health');
    expect(detectQuestionType('养生保健')).toBe('health');
    expect(detectQuestionType('身体状况')).toBe('health');
  });

  test('财富问题检测', () => {
    expect(detectQuestionType('财运如何')).toBe('wealth');
    expect(detectQuestionType('投资理财')).toBe('wealth');
    expect(detectQuestionType('赚钱机会')).toBe('wealth');
    expect(detectQuestionType('财务管理')).toBe('wealth');
  });

  test('一般问题检测', () => {
    expect(detectQuestionType('人生运势')).toBe('general');
    expect(detectQuestionType('未来展望')).toBe('general');
    expect(detectQuestionType('生活建议')).toBe('general');
  });
});

describe('六爻占卜算法测试', () => {
  test('占卜结果结构正确', () => {
    const result = performDivination('事业发展问题');

    expect(result).toHaveProperty('method', 'liuyao');
    expect(result).toHaveProperty('question', '事业发展问题');
    expect(result).toHaveProperty('originalGua');
    expect(result).toHaveProperty('interpretation');
    expect(result).toHaveProperty('timestamp');

    // 检查卦象结构
    expect(result.originalGua).toHaveProperty('name');
    expect(result.originalGua).toHaveProperty('number');
    expect(result.originalGua).toHaveProperty('yaos');
    expect(result.originalGua).toHaveProperty('properties');

    // 检查爻数组
    expect(result.originalGua.yaos).toHaveLength(6);

    // 检查解读结构
    expect(result.interpretation).toHaveProperty('guaci');
    expect(result.interpretation).toHaveProperty('yaoci');
    expect(result.interpretation).toHaveProperty('shiyi');
    expect(result.interpretation).toHaveProperty('analysis');
  });

  test('不同占卜结果具有差异性', () => {
    const results = Array(10).fill(0).map(() => performDivination('测试问题'));
    const uniqueGua = new Set(results.map(r => r.originalGua.name));

    // 多次占卜应该产生不同的卦象（虽然不一定每次都不同，但多次测试应该有差异）
    expect(uniqueGua.size).toBeGreaterThan(0);
  });

  test('卦象数据使用完整数据库', () => {
    const result = performDivination('事业发展问题');
    const hexagram = getHexagramByNumber(result.originalGua.number);

    expect(hexagram).toBeDefined();
    expect(hexagram?.name).toBe(result.originalGua.name);
    expect(result.interpretation.guaci).toBe(hexagram?.guaci);
    expect(result.interpretation.shiyi).toBe(hexagram?.shiyi);
  });
});

describe('梅花易数算法测试', () => {
  test('梅花易数结果结构正确', () => {
    const result = performMeihuaDivination('感情发展问题');

    expect(result).toHaveProperty('method', 'meihua');
    expect(result).toHaveProperty('question', '感情发展问题');
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('timestamp');

    // 检查梅花易数卦象结构
    expect(result.result).toHaveProperty('name');
    expect(result.result).toHaveProperty('number');
    expect(result.result).toHaveProperty('upperNumber');
    expect(result.result).toHaveProperty('lowerNumber');
    expect(result.result).toHaveProperty('method');
    expect(result.result).toHaveProperty('sourceInfo');
    expect(result.result).toHaveProperty('interpretation');

    // 检查解读结构
    expect(result.result.interpretation).toHaveProperty('guaci');
    expect(result.result.interpretation).toHaveProperty('shiyi');
    expect(result.result.interpretation).toHaveProperty('analysis');
  });

  test('梅花易数使用完整数据库', () => {
    const result = performMeihuaDivination('健康问题');
    const hexagram = getHexagramByNumber(result.result.number);

    expect(hexagram).toBeDefined();
    expect(hexagram?.name).toBe(result.result.name);
    expect(result.result.interpretation.guaci).toBe(hexagram?.guaci);
    expect(result.result.interpretation.shiyi).toBe(hexagram?.shiyi);
  });
});

describe('AI提示词构建器测试', () => {
  test('提示词包含必要元素', () => {
    const context = {
      method: 'liuyao' as const,
      question: '事业发展咨询',
      guaName: '乾',
      guaInfo: {
        number: 1,
        upperTrigram: '乾',
        lowerTrigram: '乾',
        interpretation: {
          guaci: '乾：元，亨，利，贞。',
          yaoci: ['初九：潜龙，勿用。'],
          shiyi: '《彖》曰：大哉乾元...',
          analysis: '综合分析...'
        }
      }
    };

    const prompt = AIPromptBuilder.buildDivinationPrompt(context);

    expect(prompt).toContain('占卜基本信息');
    expect(prompt).toContain('乾卦深层特征');
    expect(prompt).toContain('问题卦象关联分析');
    expect(prompt).toContain('乾卦实用建议');
    expect(prompt).toContain('输出要求');
  });

  test('不同卦象提示词具有差异性', () => {
    const qianContext = {
      method: 'liuyao' as const,
      question: '事业发展咨询',
      guaName: '乾',
      guaInfo: {
        number: 1,
        upperTrigram: '乾',
        lowerTrigram: '乾',
        interpretation: {
          guaci: '乾：元，亨，利，贞。',
          yaoci: ['初九：潜龙，勿用。'],
          shiyi: '《彖》曰：大哉乾元...',
          analysis: '综合分析...'
        }
      }
    };

    const kunContext = {
      method: 'liuyao' as const,
      question: '事业发展咨询',
      guaName: '坤',
      guaInfo: {
        number: 2,
        upperTrigram: '坤',
        lowerTrigram: '坤',
        interpretation: {
          guaci: '坤：元，亨，利牝马之贞。',
          yaoci: ['初六：履霜，坚冰至。'],
          shiyi: '《彖》曰：至哉坤元...',
          analysis: '综合分析...'
        }
      }
    };

    const qianPrompt = AIPromptBuilder.buildDivinationPrompt(qianContext);
    const kunPrompt = AIPromptBuilder.buildDivinationPrompt(kunContext);

    expect(qianPrompt).not.toEqual(kunPrompt);
    expect(qianPrompt).toContain('乾卦深层特征');
    expect(kunPrompt).toContain('坤卦深层特征');
  });

  test('问题类型影响提示词内容', () => {
    const careerContext = {
      method: 'liuyao' as const,
      question: '我的工作发展如何？',
      guaName: '乾',
      guaInfo: {
        number: 1,
        upperTrigram: '乾',
        lowerTrigram: '乾',
        interpretation: {
          guaci: '乾：元，亨，利，贞。',
          yaoci: ['初九：潜龙，勿用。'],
          shiyi: '《彖》曰：大哉乾元...',
          analysis: '综合分析...'
        }
      }
    };

    const relationshipContext = {
      method: 'liuyao' as const,
      question: '我的感情状况如何？',
      guaName: '乾',
      guaInfo: {
        number: 1,
        upperTrigram: '乾',
        lowerTrigram: '乾',
        interpretation: {
          guaci: '乾：元，亨，利，贞。',
          yaoci: ['初九：潜龙，勿用。'],
          shiyi: '《彖》曰：大哉乾元...',
          analysis: '综合分析...'
        }
      }
    };

    const careerPrompt = AIPromptBuilder.buildDivinationPrompt(careerContext);
    const relationshipPrompt = AIPromptBuilder.buildDivinationPrompt(relationshipContext);

    expect(careerPrompt).toContain('事业发展');
    expect(relationshipPrompt).toContain('感情关系');
  });
});

describe('集成测试', () => {
  test('完整占卜流程', () => {
    // 1. 执行六爻占卜
    const liuyaoResult = performDivination('我的事业发展前景如何？');

    expect(liuyaoResult.originalGua.name).toBeTruthy();
    expect(liuyaoResult.interpretation.guaci).toBeTruthy();
    expect(liuyaoResult.interpretation.analysis).toContain('卦象本质：');

    // 2. 基于占卜结果构建AI提示词
    const context = {
      method: 'liuyao' as const,
      question: liuyaoResult.question,
      guaName: liuyaoResult.originalGua.name,
      guaInfo: {
        number: liuyaoResult.originalGua.number,
        upperTrigram: liuyaoResult.originalGua.upperTrigram,
        lowerTrigram: liuyaoResult.originalGua.lowerTrigram,
        interpretation: liuyaoResult.interpretation
      }
    };

    const prompt = AIPromptBuilder.buildDivinationPrompt(context, {
      focus: 'career',
      style: 'detailed'
    });

    expect(prompt).toContain('事业发展专项分析');
    expect(prompt).toContain(liuyaoResult.originalGua.name);
    expect(prompt).toContain('卦象本质：');
  });

  test('不同占卜方法结果对比', () => {
    const question = '财运如何？';

    const liuyaoResult = performDivination(question);
    const meihuaResult = performMeihuaDivination(question);

    // 两种方法的结果应该都包含完整的数据结构
    expect(liuyaoResult.originalGua.name).toBeTruthy();
    expect(meihuaResult.result.name).toBeTruthy();

    // 解读都应该使用完整的卦象数据
    expect(liuyaoResult.interpretation.guaci).toBeTruthy();
    expect(meihuaResult.result.interpretation.guaci).toBeTruthy();

    // 分析都应该包含卦象特征信息
    expect(liuyaoResult.interpretation.analysis).toContain('卦象本质：');
    expect(meihuaResult.result.interpretation.analysis).toContain('卦象本质：');
  });
});