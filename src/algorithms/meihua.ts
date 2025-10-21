// 梅花易数算法实现
// 基于邵雍《梅花易数》的数字起卦法

export interface MeihuaGua {
  // 梅花易数卦象信息
  name: string; // 卦名
  upperTrigram: string; // 上卦名
  lowerTrigram: string; // 下卦名
  number: number; // 卦序 (1-64)
  upperNumber: number; // 上卦数
  lowerNumber: number; // 下卦数
  changingYao?: number; // 动爻位置 (1-6)
  method: 'time' | 'number' | 'word'; // 起卦方法
  sourceInfo: {
    // 起卦源信息
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    numbers?: number[];
    words?: string;
  };
  interpretation: {
    guaci: string; // 卦辞
    shiyi: string; // 十翼解释
    analysis: string; // 综合分析
  };
}

export interface MeihuaDivinationResult {
  // 梅花易数占卜结果
  method: 'meihua';
  question: string;
  result: MeihuaGua;
  timestamp: Date;
}

// 八卦对应数字（后天八卦数）
const BAGUA_NUMBERS = {
  1: '坎', // 一数坎
  2: '坤', // 二数坤
  3: '震', // 三数震
  4: '巽', // 四数巽
  6: '乾', // 六数乾
  7: '兑', // 七数兑
  8: '艮', // 八数艮
  9: '离'  // 九数离
};

// 数字对应八卦
const NUMBER_TO_BAGUA: { [key: number]: string } = {
  1: 'kan', 2: 'kun', 3: 'zhen', 4: 'sun',
  6: 'qian', 7: 'dui', 8: 'gen', 9: 'li'
};

// 八卦名称
const BAGUA_NAMES = {
  qian: '乾', kun: '坤', zhen: '震', sun: '巽',
  kan: '坎', li: '离', gen: '艮', dui: '兑'
};

// 导入完整的六十四卦数据库
import { COMPLETE_HEXAGRAMS, getHexagramByNumber, detectQuestionType } from '../data/hexagramDatabase';

// 数字起卦法
export function meihuaNumberDivination(numbers: number[]): MeihuaGua {
  if (numbers.length < 2) {
    throw new Error('梅花易数数字起卦至少需要2个数字');
  }

  // 取前两个数字作为上下卦的基础
  let upperNum = numbers[0];
  let lowerNum = numbers[1];

  // 数字超过8的需要除以8取余数（余数为0时取8）
  upperNum = upperNum! > 8 ? (upperNum! % 8 || 8) : upperNum!;
  lowerNum = lowerNum! > 8 ? (lowerNum! % 8 || 8) : lowerNum!;

  // 计算动爻
  let changingYao: number | undefined;
  if (numbers.length >= 3) {
    let yaoNum = numbers[2];
    // 动爻用6除，取余数（余数为0时取6）
    changingYao = yaoNum! > 6 ? (yaoNum! % 6 || 6) : yaoNum!;
  }

  return createMeihuaGua(upperNum, lowerNum, changingYao, 'number', { numbers });
}

// 时间起卦法（农历时间）
export function meihuaTimeDivination(year: number, month: number, day: number, hour: number): MeihuaGua {
  // 年数取后两位
  const yearNum = year % 100;

  // 上卦 = (年数 + 月数 + 日数) % 8，余数为0时取8
  const upperTotal = yearNum + month + day;
  let upperNum = upperTotal % 8;
  if (upperNum === 0) upperNum = 8;

  // 下卦 = (年数 + 月数 + 日数 + 时数) % 8，余数为0时取8
  const lowerTotal = yearNum + month + day + hour;
  let lowerNum = lowerTotal % 8;
  if (lowerNum === 0) lowerNum = 8;

  // 动爻 = (年数 + 月数 + 日数 + 时数) % 6，余数为0时取6
  let changingYao = (yearNum + month + day + hour) % 6;
  if (changingYao === 0) changingYao = 6;

  return createMeihuaGua(upperNum, lowerNum, changingYao, 'time', {
    year, month, day, hour
  });
}

// 字数起卦法（根据字的笔画数）
export function meihuaWordDivination(text: string): MeihuaGua {
  if (!text || text.trim().length === 0) {
    throw new Error('字数起卦需要提供文字');
  }

  const cleanText = text.trim();
  const chars = cleanText.split('');

  let upperNum: number;
  let lowerNum: number;
  let changingYao: number | undefined;

  if (chars.length === 1) {
    // 单字：取字笔画总数
    const strokeCount = getStrokeCount(chars[0] || '');
    upperNum = strokeCount > 8 ? (strokeCount % 8 || 8) : strokeCount;
    lowerNum = upperNum;
  } else if (chars.length === 2) {
    // 两字：前字为上卦，后字为下卦
    const upperStrokeCount = getStrokeCount(chars[0] || '');
    const lowerStrokeCount = getStrokeCount(chars[1] || '');
    upperNum = upperStrokeCount > 8 ?
      (upperStrokeCount % 8 || 8) : upperStrokeCount;
    lowerNum = lowerStrokeCount > 8 ?
      (lowerStrokeCount % 8 || 8) : lowerStrokeCount;
  } else {
    // 多字：前半部分为上卦，后半部分为下卦
    const mid = Math.ceil(chars.length / 2);
    const upperStrokes = chars.slice(0, mid).reduce((sum, char) =>
      sum + getStrokeCount(char), 0);
    const lowerStrokes = chars.slice(mid).reduce((sum, char) =>
      sum + getStrokeCount(char), 0);

    upperNum = upperStrokes > 8 ? (upperStrokes % 8 || 8) : upperStrokes;
    lowerNum = lowerStrokes > 8 ? (lowerStrokes % 8 || 8) : lowerStrokes;

    // 总笔画数确定动爻
    const totalStrokes = upperStrokes + lowerStrokes;
    changingYao = totalStrokes > 6 ? (totalStrokes % 6 || 6) : totalStrokes;
  }

  return createMeihuaGua(upperNum, lowerNum, changingYao, 'word', { words: cleanText });
}

// 创建梅花易数卦象
function createMeihuaGua(
  upperNum: number,
  lowerNum: number,
  changingYao: number | undefined,
  method: 'time' | 'number' | 'word',
  sourceInfo: any
): MeihuaGua {
  // 转换为八卦键名
  const upperKey = NUMBER_TO_BAGUA[upperNum] || 'qian';
  const lowerKey = NUMBER_TO_BAGUA[lowerNum] || 'qian';

  // 查找对应的六十四卦
  const hexagram = COMPLETE_HEXAGRAMS.find(h =>
    h.upper === upperKey && h.lower === lowerKey) ||
    COMPLETE_HEXAGRAMS[0]; // fallback to 乾卦

  return {
    name: hexagram.name,
    upperTrigram: BAGUA_NAMES[upperKey as keyof typeof BAGUA_NAMES],
    lowerTrigram: BAGUA_NAMES[lowerKey as keyof typeof BAGUA_NAMES],
    number: hexagram.number,
    upperNumber: upperNum,
    lowerNumber: lowerNum,
    changingYao,
    method,
    sourceInfo,
    interpretation: {
      guaci: hexagram.guaci,
      shiyi: hexagram.shiyi,
      analysis: generateEnhancedMeihuaAnalysis(hexagram, changingYao, method)
    }
  };
}

// 获取汉字笔画数（简化版，实际项目中需要完整的笔画数据库）
function getStrokeCount(char: string): number {
  // 这里使用简化版的笔画数估算
  // 实际项目中应该使用完整的汉字笔画数据库
  const simpleStrokes: { [key: string]: number } = {
    '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
    '人': 2, '大': 3, '天': 4, '地': 6, '日': 4, '月': 4, '水': 4, '火': 4, '木': 4, '金': 8,
    '中': 4, '国': 8, '家': 10, '爱': 10, '福': 13, '寿': 7, '喜': 12, '财': 7, '运': 7
  };

  return simpleStrokes[char] || Math.floor(Math.random() * 10) + 1; // 随机分配笔画数
}

// 生成增强的梅花易数分析
function generateEnhancedMeihuaAnalysis(hexagram: any, changingYao: number | undefined, method: string): string {
  let analysis = `梅花易数${method}起卦，得${hexagram.name}卦`;

  if (changingYao) {
    const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    analysis += `，${yaoNames[changingYao - 1]}为动爻`;
  }

  analysis += `。\n\n`;

  // 添加卦象特有信息
  analysis += `卦象本质：${hexagram.symbolism}\n`;
  analysis += `五行属性：${hexagram.elements.wuxing}（${hexagram.elements.nature}）\n`;
  analysis += `时空特征：${hexagram.elements.direction}方位，${hexagram.elements.season}季\n`;
  analysis += `关系特征：${hexagram.elements.relationship}\n\n`;

  // 梅花易数特色分析
  analysis += `梅花易数心法：`;
  analysis += `此卦${hexagram.elements.relationship}，${hexagram.elements.nature}。`;

  if (hexagram.elements.nature === '刚健' || hexagram.elements.nature === '创造') {
    analysis += '梅花易数认为此时应主动出击，把握时机，但需防止过度。';
  } else if (hexagram.elements.nature === '柔顺' || hexagram.elements.nature === '包容') {
    analysis += '梅花易数主张以柔克刚，顺势而为，静待时机。';
  } else if (hexagram.elements.nature === '和谐' || hexagram.elements.nature === '团结') {
    analysis += '梅花易数强调此时应注重人际关系，寻求合作共赢。';
  } else if (hexagram.elements.nature === '等待' || hexagram.elements.nature === '积蓄') {
    analysis += '梅花易数提醒此时需耐心准备，厚积薄发。';
  } else {
    analysis += '梅花易数建议根据实际情况灵活应对，保持中庸之道。';
  }

  analysis += `\n\n体用分析：`;
  analysis += `${hexagram.name}卦${hexagram.elements.relationship}，`;

  if (method === 'number') {
    analysis += '数字起卦重在数理，应关注时机把握。';
  } else if (method === 'time') {
    analysis += '时间起卦重在天时，应顺应自然规律。';
  } else if (method === 'word') {
    analysis += '字数起卦重在感应，应相信直觉判断。';
  }

  if (changingYao) {
    analysis += `\n\n动爻解析：第${changingYao}爻为动爻，预示着`;
    if (changingYao <= 2) {
      analysis += '事情处于初始阶段，变化刚刚开始。';
    } else if (changingYao <= 4) {
      analysis += '事情发展进入关键阶段，需要特别关注。';
    } else {
      analysis += '事情接近完成，需要善始善终。';
    }
  }

  return analysis;
}

// 执行梅花易数占卜（随机数字起卦）
export function performMeihuaDivination(question: string): MeihuaDivinationResult {
  // 生成3个随机数字（1-9）
  const numbers = Array(3).fill(0).map(() => Math.floor(Math.random() * 9) + 1);

  const result = meihuaNumberDivination(numbers);

  return {
    method: 'meihua',
    question,
    result,
    timestamp: new Date()
  };
}