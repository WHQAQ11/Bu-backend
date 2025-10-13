// AI 提示词构造器测试文件
import { AIPromptBuilder, DivinationContext, PromptOptions } from './aiPromptBuilder';

console.log('=== AI 提示词构造器测试 ===\n');

// 测试1: 六爻占卜的完整提示词
console.log('1. 六爻占卜 - 完整提示词测试:');
const liuyaoContext: DivinationContext = {
  method: 'liuyao',
  question: '我的事业发展会如何？',
  guaName: '乾',
  guaInfo: {
    number: 1,
    upperTrigram: '乾',
    lowerTrigram: '乾',
    changingYao: 5,
    interpretation: {
      guaci: '乾：元，亨，利，贞。',
      yaoci: ['初九：潜龙，勿用。', '九二：见龙在田，利见大人。', '九五：飞龙在天，利见大人。'],
      shiyi: '《彖》曰：大哉乾元，万物资始，乃统天。',
      analysis: '乾卦为天，象征刚健中正。此卦显示事情发展顺利，宜积极进取。'
    }
  },
  userInfo: {
    name: '张三',
    gender: '男',
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15
  }
};

const liuyaoOptions: PromptOptions = {
  style: 'detailed',
  focus: 'career',
  language: 'chinese',
  includeAdvice: true,
  includeWarnings: true
};

const liuyaoPrompt = AIPromptBuilder.buildDivinationPrompt(liuyaoContext, liuyaoOptions);
console.log('提示词长度:', liuyaoPrompt.length, '字符');
console.log('提示词预览:\n', liuyaoPrompt.substring(0, 500) + '...\n');

// 测试2: 梅花易数的简洁提示词
console.log('\n2. 梅花易数 - 简洁提示词测试:');
const meihuaContext: DivinationContext = {
  method: 'meihua',
  question: '我的感情运势如何？',
  guaName: '坤',
  guaInfo: {
    number: 2,
    upperTrigram: '坤',
    lowerTrigram: '坤',
    changingYao: 3,
    interpretation: {
      guaci: '坤：元，亨，利牝马之贞。',
      yaoci: ['六三：含章可贞。', '六五：黄裳元吉。'],
      shiyi: '《彖》曰：至哉坤元，万物资生，乃顺承天。',
      analysis: '坤卦为地，象征柔顺包容。此卦显示宜静不宜动，以柔克刚。'
    }
  }
};

const meihuaOptions: PromptOptions = {
  style: 'concise',
  language: 'chinese'
};

const meihuaPrompt = AIPromptBuilder.buildDivinationPrompt(meihuaContext, meihuaOptions);
console.log('提示词长度:', meihuaPrompt.length, '字符');
console.log('提示词预览:\n', meihuaPrompt.substring(0, 400) + '...\n');

// 测试3: 快速提示词
console.log('\n3. 快速提示词测试:');
const quickPrompt = AIPromptBuilder.buildQuickPrompt(liuyaoContext);
console.log('快速提示词:\n', quickPrompt);
console.log('提示词长度:', quickPrompt.length, '字符\n');

// 测试4: 英文提示词
console.log('4. 英文提示词测试:');
const englishPrompt = AIPromptBuilder.buildEnglishPrompt(liuyaoContext);
console.log('英文提示词长度:', englishPrompt.length, '字符');
console.log('英文提示词预览:\n', englishPrompt.substring(0, 600) + '...\n');

// 测试5: 情感化提示词
console.log('5. 情感化提示词测试:');
const emotionalPrompt = AIPromptBuilder.buildEmotionalPrompt(meihuaContext);
console.log('情感化提示词长度:', emotionalPrompt.length, '字符');
console.log('情感化提示词预览:\n', emotionalPrompt.substring(0, 500) + '...\n');

// 测试6: 不同关注领域
console.log('\n6. 不同关注领域测试:');
const focuses: PromptOptions['focus'][] = ['career', 'relationship', 'health', 'wealth', 'general'];

focuses.forEach(focus => {
  const focusOptions: PromptOptions = {
    style: 'detailed',
    focus: focus,
    language: 'chinese'
  };
  const focusPrompt = AIPromptBuilder.buildDivinationPrompt(liuyaoContext, focusOptions);
  console.log(`${focus}关注点提示词长度:`, focusPrompt.length, '字符');
});

console.log('\n=== AI 提示词构造器测试完成 ===');