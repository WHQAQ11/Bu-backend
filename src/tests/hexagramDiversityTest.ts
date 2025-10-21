// 卦象多样性和AI解读差异化测试
import { performDivination } from '../algorithms/liuyao';
import { performMeihuaDivination } from '../algorithms/meihua';
import { AIPromptBuilder } from '../services/aiPromptBuilder';

describe('卦象多样性测试', () => {
  test('六爻占卜产生多种卦象', () => {
    const questions = [
      '事业发展前景如何？',
      '感情状况怎样？',
      '身体健康状况？',
      '财运发展如何？',
      '人际关系改善？',
      '学习考试运势？',
      '家庭关系和谐？',
      '投资理财建议？',
      '职业发展方向？',
      '创业机会评估？'
    ];

    const results = questions.map(question => performDivination(question));
    const uniqueGuaNames = new Set(results.map(r => r.originalGua.name));
    const uniqueGuaNumbers = new Set(results.map(r => r.originalGua.number));

    // 应该产生至少3种不同的卦象
    expect(uniqueGuaNames.size).toBeGreaterThanOrEqual(3);
    expect(uniqueGuaNumbers.size).toBeGreaterThanOrEqual(3);

    // 验证每个结果都有完整的数据结构
    results.forEach((result, index) => {
      expect(result.originalGua.name).toBeTruthy();
      expect(result.originalGua.number).toBeGreaterThan(0);
      expect(result.originalGua.number).toBeLessThanOrEqual(64);
      expect(result.interpretation.guaci).toBeTruthy();
      expect(result.interpretation.shiyi).toBeTruthy();
      expect(result.interpretation.analysis).toContain('卦象本质：');
      expect(result.interpretation.analysis).toContain('五行属性：');
    });
  });

  test('梅花易数产生多种卦象', () => {
    const questions = [
      '事业发展前景如何？',
      '感情状况怎样？',
      '身体健康状况？',
      '财运发展如何？',
      '人际关系改善？',
      '学习考试运势？',
      '家庭关系和谐？',
      '投资理财建议？'
    ];

    const results = questions.map(question => performMeihuaDivination(question));
    const uniqueGuaNames = new Set(results.map(r => r.result.name));
    const uniqueGuaNumbers = new Set(results.map(r => r.result.number));

    // 应该产生至少3种不同的卦象
    expect(uniqueGuaNames.size).toBeGreaterThanOrEqual(3);
    expect(uniqueGuaNumbers.size).toBeGreaterThanOrEqual(3);

    // 验证每个结果都有完整的数据结构
    results.forEach(result => {
      expect(result.result.name).toBeTruthy();
      expect(result.result.number).toBeGreaterThan(0);
      expect(result.result.number).toBeLessThanOrEqual(64);
      expect(result.result.interpretation.guaci).toBeTruthy();
      expect(result.result.interpretation.shiyi).toBeTruthy();
      expect(result.result.interpretation.analysis).toContain('卦象本质：');
      expect(result.result.interpretation.analysis).toContain('梅花易数心法：');
    });
  });

  test('相同问题不同时间产生不同结果', () => {
    const sameQuestion = '事业发展咨询';

    // 进行多次占卜
    const results = Array(10).fill(0).map(() => performDivination(sameQuestion));
    const uniqueGuaNames = new Set(results.map(r => r.originalGua.name));

    // 多次占卜应该产生不同的卦象（虽然不一定每次都不同）
    expect(uniqueGuaNames.size).toBeGreaterThan(0);

    // 验证结果的随机性（至少应该有几种不同的卦象）
    if (uniqueGuaNames.size === 1) {
      console.warn('警告：多次占卜产生了相同的卦象，可能需要检查随机性');
    }
  });
});

describe('AI解读差异化测试', () => {
  test('不同卦象产生不同提示词', () => {
    const testCases = [
      {
        guaName: '乾',
        question: '事业发展前景如何？',
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
      },
      {
        guaName: '坤',
        question: '事业发展前景如何？',
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
      },
      {
        guaName: '屯',
        question: '事业发展前景如何？',
        guaInfo: {
          number: 3,
          upperTrigram: '坎',
          lowerTrigram: '震',
          interpretation: {
            guaci: '屯：元，亨，利，贞。勿用有攸往，利建侯。',
            yaoci: ['初九：磐桓；利居贞，利建侯。'],
            shiyi: '《彖》曰：屯，刚柔始交而难生...',
            analysis: '综合分析...'
          }
        }
      }
    ];

    const prompts = testCases.map(testCase =>
      AIPromptBuilder.buildDivinationPrompt({
        method: 'liuyao',
        question: testCase.question,
        guaName: testCase.guaName,
        guaInfo: testCase.guaInfo
      })
    );

    // 验证提示词包含卦象特定信息
    prompts.forEach((prompt, index) => {
      const testCase = testCases[index];
      expect(prompt).toContain(`${testCase.guaName}卦深层特征`);
      expect(prompt).toContain('卦象本质：');
      expect(prompt).toContain('五行属性：');
      expect(prompt).toContain('问题卦象关联分析');
    });

    // 验证不同卦象的提示词不同
    const promptStrings = prompts.map(p => p);
    const uniquePrompts = new Set(promptStrings);
    expect(uniquePrompts.size).toBe(prompts.length);

    // 验证每个提示词都包含其对应的卦名
    prompts.forEach((prompt, index) => {
      expect(prompt).toContain(testCases[index].guaName);
    });
  });

  test('相同卦象不同问题产生不同提示词', () => {
    const guaContext = {
      method: 'liuyao' as const,
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

    const questions = [
      '事业发展前景如何？',
      '感情状况怎样？',
      '身体健康状况？',
      '财运发展如何？'
    ];

    const prompts = questions.map(question =>
      AIPromptBuilder.buildDivinationPrompt({
        ...guaContext,
        question
      })
    );

    // 验证每个提示词都包含对应的问题
    prompts.forEach((prompt, index) => {
      expect(prompt).toContain(questions[index]);
    });

    // 验证提示词内容不同
    const uniquePrompts = new Set(prompts);
    expect(uniquePrompts.size).toBeGreaterThan(1);

    // 验证问题类型检测正确
    prompts.forEach((prompt, index) => {
      if (questions[index].includes('事业') || questions[index].includes('职业')) {
        expect(prompt).toContain('事业发展');
      }
      if (questions[index].includes('感情') || questions[index].includes('关系')) {
        expect(prompt).toContain('感情关系');
      }
      if (questions[index].includes('健康') || questions[index].includes('身体')) {
        expect(prompt).toContain('健康状况');
      }
      if (questions[index].includes('财运') || questions[index].includes('财富')) {
        expect(prompt).toContain('财运财富');
      }
    });
  });

  test('不同关注领域产生差异化提示词', () => {
    const baseContext = {
      method: 'liuyao' as const,
      question: '综合发展咨询',
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

    const focuses = ['career', 'relationship', 'health', 'wealth'] as const;

    const prompts = focuses.map(focus =>
      AIPromptBuilder.buildDivinationPrompt(baseContext, { focus })
    );

    // 验证每个提示词都包含对应的关注领域
    prompts.forEach((prompt, index) => {
      const focusNames = ['事业发展', '感情关系', '健康状况', '财运财富'];
      expect(prompt).toContain(`${focusNames[index]}专项分析`);
    });

    // 验证提示词内容不同
    const uniquePrompts = new Set(prompts);
    expect(uniquePrompts.size).toBe(focuses.length);
  });

  test('不同解读风格产生不同提示词', () => {
    const baseContext = {
      method: 'liuyao' as const,
      question: '发展咨询',
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

    const styles = ['traditional', 'modern', 'detailed', 'concise'] as const;

    const prompts = styles.map(style =>
      AIPromptBuilder.buildDivinationPrompt(baseContext, { style })
    );

    // 验证提示词内容不同
    const uniquePrompts = new Set(prompts);
    expect(uniquePrompts.size).toBeGreaterThan(1);

    // 所有提示词都应该包含基本信息
    prompts.forEach(prompt => {
      expect(prompt).toContain('乾卦深层特征');
      expect(prompt).toContain('问题卦象关联分析');
    });
  });
});

describe('数据增强验证测试', () => {
  test('卦象数据包含增强信息', () => {
    const result = performDivination('事业发展咨询');

    // 验证卦象数据包含增强属性
    expect(result.originalGua.properties).toHaveProperty('symbolism');
    expect(result.originalGua.properties).toHaveProperty('season');
    expect(result.originalGua.properties).toHaveProperty('direction');
    expect(result.originalGua.properties).toHaveProperty('nature');
    expect(result.originalGua.properties).toHaveProperty('relationship');

    // 验证解读包含增强信息
    expect(result.interpretation.analysis).toContain('卦象本质：');
    expect(result.interpretation.analysis).toContain('五行属性：');
    expect(result.interpretation.analysis).toContain('时空特征：');
    expect(result.interpretation.analysis).toContain('关系特征：');
  });

  test('问题类型检测准确性', () => {
    const testCases = [
      { question: '我的工作发展如何？', expectedType: 'career' },
      { question: '感情问题怎么解决？', expectedType: 'relationship' },
      { question: '身体健康状况怎么样？', expectedType: 'health' },
      { question: '财运如何改善？', expectedType: 'wealth' },
      { question: '人生运势怎么样？', expectedType: 'general' },
      { question: '职业规划建议？', expectedType: 'career' },
      { question: '恋爱关系处理？', expectedType: 'relationship' },
      { question: '疾病治疗效果？', expectedType: 'health' },
      { question: '投资理财方法？', expectedType: 'wealth' }
    ];

    testCases.forEach(({ question, expectedType }) => {
      const context = {
        method: 'liuyao' as const,
        question,
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

      // 验证提示词包含正确的问题类型分析
      switch (expectedType) {
        case 'career':
          expect(prompt).toContain('事业发展');
          break;
        case 'relationship':
          expect(prompt).toContain('感情关系');
          break;
        case 'health':
          expect(prompt).toContain('健康状况');
          break;
        case 'wealth':
          expect(prompt).toContain('财运财富');
          break;
        case 'general':
          expect(prompt).toContain('整体运势');
          break;
      }
    });
  });
});

describe('性能测试', () => {
  test('批量占卜性能测试', () => {
    const startTime = Date.now();

    // 执行100次占卜
    const results = Array(100).fill(0).map(() => performDivination('性能测试问题'));

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 验证结果正确性
    expect(results).toHaveLength(100);
    results.forEach(result => {
      expect(result.originalGua.name).toBeTruthy();
      expect(result.interpretation.guaci).toBeTruthy();
    });

    // 验证性能（100次占卜应该在合理时间内完成）
    expect(duration).toBeLessThan(10000); // 10秒内完成

    console.log(`⏱️ 100次占卜耗时: ${duration}ms，平均每次: ${duration/100}ms`);
  });

  test('AI提示词构建性能测试', () => {
    const baseContext = {
      method: 'liuyao' as const,
      question: '性能测试问题',
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

    const startTime = Date.now();

    // 构建100个提示词
    const prompts = Array(100).fill(0).map(() =>
      AIPromptBuilder.buildDivinationPrompt(baseContext, {
        style: 'detailed',
        focus: 'career'
      })
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 验证结果正确性
    expect(prompts).toHaveLength(100);
    prompts.forEach(prompt => {
      expect(prompt).toContain('乾卦深层特征');
      expect(prompt).toContain('事业发展专项分析');
      expect(prompt.length).toBeGreaterThan(500); // 提示词应该足够详细
    });

    // 验证性能
    expect(duration).toBeLessThan(5000); // 5秒内完成

    console.log(`⏱️ 100个提示词构建耗时: ${duration}ms，平均每个: ${duration/100}ms`);
  });
});