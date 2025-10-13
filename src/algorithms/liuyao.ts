// 六爻占卜算法实现
// 实现传统的铜钱摇卦算法

export interface Yao {
  // 爻的属性：阴爻(--, 6)或阳爻(—, 7)，以及老阴(6, --x)、老阳(7, —o)的动爻变化
  value: number; // 6 (老阴), 7 (少阳), 8 (少阴), 9 (老阳)
  isChanging: boolean; // 是否为动爻
  yinYang: 'yin' | 'yang'; // 阴阳属性
  symbol: string; // 爻的符号表示
}

export interface Gua {
  // 卦象信息
  name: string; // 卦名
  upperTrigram: string; // 上卦名
  lowerTrigram: string; // 下卦名
  number: number; // 卦序 (1-64)
  yaos: Yao[]; // 六爻 (从下往上: 初爻、二爻、三爻、四爻、五爻、上爻)
  changedGua?: Gua; // 变卦 (如果有动爻)
  properties: {
    wuxing: string; // 五行属性
    bagua: string; // 八宫归属
    yuanyang: string; // 乾坤属性
  };
}

export interface DivinationResult {
  // 占卜结果
  method: 'liuyao';
  question: string;
  originalGua: Gua; // 本卦
  changedGua?: Gua; // 变卦
  interpretation: {
    guaci: string; // 卦辞
    yaoci: string[]; // 爻辞
    shiyi: string; // 十翼解释
    analysis: string; // 综合分析
  };
  timestamp: Date;
}

// 八卦基础信息
const TRIGRAMS = {
  qian: { name: '乾', symbol: '☰', nature: '天', attribute: '健', number: 1 },
  kun: { name: '坤', symbol: '☷', nature: '地', attribute: '顺', number: 8 },
  zhen: { name: '震', symbol: '☳', nature: '雷', attribute: '动', number: 4 },
  kan: { name: '坎', symbol: '☵', nature: '水', attribute: '陷', number: 6 },
  gen: { name: '艮', symbol: '☶', nature: '山', attribute: '止', number: 7 },
  sun: { name: '巽', symbol: '☴', nature: '风', attribute: '入', number: 5 },
  li: { name: '离', symbol: '☲', nature: '火', attribute: '丽', number: 3 },
  dui: { name: '兑', symbol: '☱', nature: '泽', attribute: '说', number: 2 }
};

// 六十四卦信息
const HEXAGRAMS = [
  { number: 1, name: '乾', upper: 'qian', lower: 'qian', guaci: '乾：元，亨，利，贞。' },
  { number: 2, name: '坤', upper: 'kun', lower: 'kun', guaci: '坤：元，亨，利牝马之贞。' },
  { number: 3, name: '屯', upper: 'kan', lower: 'zhen', guaci: '屯：元，亨，利，贞。勿用有攸往，利建侯。' },
  { number: 4, name: '蒙', upper: 'gen', lower: 'kan', guaci: '蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
  { number: 5, name: '需', upper: 'kan', lower: 'qian', guaci: '需：有孚，光亨，贞吉。利涉大川。' },
  { number: 6, name: '讼', upper: 'qian', lower: 'kan', guaci: '讼：有孚，窒。惕中吉。终凶。利见大人，不利涉大川。' },
  // ... 继续定义其他卦象
];

// 模拟铜钱摇卦
export function simulateCoinToss(): number {
  // 模拟三枚铜钱的投掷结果
  // 返回值：6 (老阴，两个背一个面), 7 (少阳，一个背两个面), 8 (少阴，两个面一个背), 9 (老阳，三个背)
  const coins = Array(3).fill(0).map(() => Math.random() < 0.5 ? 0 : 1); // 0为面，1为背
  const backs = coins.reduce((sum: number, coin) => sum + coin, 0);

  switch (backs) {
    case 0: return 7; // 一个背两个面 - 少阳
    case 1: return 8; // 两个面一个背 - 少阴
    case 2: return 6; // 两个背一个面 - 老阴
    case 3: return 9; // 三个背 - 老阳
    default: return 7;
  }
}

// 创建爻
export function createYao(value: number): Yao {
  const isChanging = value === 6 || value === 9; // 老阴、老阳为动爻
  const yinYang = (value === 6 || value === 8) ? 'yin' : 'yang';

  let symbol: string;
  switch (value) {
    case 6: symbol = '⚋'; break; // 老阴 (断开的横线)
    case 7: symbol = '⚊'; break; // 少阳 (实线)
    case 8: symbol = '⚋'; break; // 少阴 (断开的横线)
    case 9: symbol = '⚊'; break; // 老阳 (实线)
    default: symbol = '⚊';
  }

  return {
    value,
    isChanging,
    yinYang,
    symbol
  };
}

// 根据六个爻值创建卦象
export function createGua(yaoValues: number[]): Gua {
  if (yaoValues.length !== 6) {
    throw new Error('卦象必须由六个爻组成');
  }

  const yaos = yaoValues.map(value => createYao(value));

  // 分为上下卦 (下卦为初二三爻，上卦为四五上爻)
  const lowerTrigramValues = yaoValues.slice(0, 3);
  const upperTrigramValues = yaoValues.slice(3, 6);

  // 根据爻的排列确定八卦
  const lowerTrigramKey = getTrigramKey(lowerTrigramValues);
  const upperTrigramKey = getTrigramKey(upperTrigramValues);

  const lowerTrigram = TRIGRAMS[lowerTrigramKey as keyof typeof TRIGRAMS];
  const upperTrigram = TRIGRAMS[upperTrigramKey as keyof typeof TRIGRAMS];

  // 查找对应的六十四卦
  const hexagram = HEXAGRAMS.find(h =>
    h.upper === upperTrigramKey && h.lower === lowerTrigramKey) ||
    { number: 1, name: '乾', upper: 'qian', lower: 'qian', guaci: '乾：元，亨，利，贞。' };

  // 检查是否有动爻，计算变卦
  let changedGua: Gua | undefined;
  const changingYaos = yaos.filter(yao => yao.isChanging);

  if (changingYaos.length > 0) {
    const changedYaoValues = yaos.map(yao => {
      if (yao.isChanging) {
        // 老阴(6)变少阳(7)，老阳(9)变少阴(8)
        return yao.value === 6 ? 7 : 8;
      }
      return yao.value;
    });

    changedGua = createGua(changedYaoValues);
  }

  return {
    name: hexagram.name,
    upperTrigram: upperTrigram.name,
    lowerTrigram: lowerTrigram.name,
    number: hexagram.number,
    yaos,
    changedGua,
    properties: {
      wuxing: getWuxingAttribute(hexagram.number),
      bagua: getBaguaAttribute(hexagram.number),
      yuanyang: getYuanyangAttribute(hexagram.number)
    }
  };
}

// 根据三爻的阴阳排列确定八卦
function getTrigramKey(yaoValues: number[]): string {
  // 将爻值转换为二进制表示 (1=阳爻, 0=阴爻)
  const binary = yaoValues.map(value => (value === 7 || value === 9) ? 1 : 0);

  // 后天八卦对应关系 (从下往上)
  const patterns: { [key: string]: string } = {
    '111': 'qian', // 乾 ☰ 天
    '000': 'kun',  // 坤 ☷ 地
    '100': 'zhen', // 震 ☳ 雷 (阳爻在下)
    '010': 'kan',  // 坎 ☵ 水 (阳爻在中)
    '001': 'gen',  // 艮 ☶ 山 (阳爻在上)
    '011': 'sun',  // 巽 ☴ 风 (阴爻在下)
    '101': 'li',   // 离 ☲ 火 (阴爻在中)
    '110': 'dui'   // 兑 ☱ 泽 (阴爻在上)
  };

  const key = binary.join('');
  return patterns[key] || 'qian';
}

// 获取五行属性
function getWuxingAttribute(guaNumber: number): string {
  const wuxingMap: { [key: number]: string } = {
    1: '金', 2: '土', 3: '火', 4: '木', 5: '木',
    6: '水', 7: '土', 8: '土', 9: '金', 10: '水'
  };
  return wuxingMap[guaNumber] || '金';
}

// 获取八宫属性
function getBaguaAttribute(guaNumber: number): string {
  const baguaOrder = ['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'];
  return baguaOrder[Math.floor((guaNumber - 1) / 8) % 8] || '乾';
}

// 获取乾坤属性
function getYuanyangAttribute(guaNumber: number): string {
  return guaNumber <= 32 ? '阳卦' : '阴卦';
}

// 执行六爻占卜
export function performDivination(question: string): DivinationResult {
  // 进行六次摇卦
  const yaoValues = Array(6).fill(0).map(() => simulateCoinToss());

  // 创建本卦
  const originalGua = createGua(yaoValues);

  // 生成基础解释
  const hexagram = HEXAGRAMS.find(h => h.number === originalGua.number) ||
    { number: 1, name: '乾', upper: 'qian', lower: 'qian', guaci: '乾：元，亨，利，贞。' };

  return {
    method: 'liuyao',
    question,
    originalGua,
    changedGua: originalGua.changedGua,
    interpretation: {
      guaci: hexagram.guaci,
      yaoci: generateYaoci(originalGua.yaos),
      shiyi: generateShiyi(originalGua),
      analysis: generateAnalysis(originalGua, question)
    },
    timestamp: new Date()
  };
}

// 生成爻辞
function generateYaoci(yaos: Yao[]): string[] {
  const yaociTexts = [
    '初九：潜龙，勿用。',
    '九二：见龙在田，利见大人。',
    '九三：君子终日乾乾，夕惕若，厉无咎。',
    '九四：或跃在渊，无咎。',
    '九五：飞龙在天，利见大人。',
    '上九：亢龙有悔。'
  ];

  return yaos.map((yao, index) => {
    if (yao.isChanging) {
      return `${['初', '二', '三', '四', '五', '上'][index]}${yao.yinYang === 'yin' ? '六' : '九'}：${yaociTexts[index] || '爻辞待补'} 【动爻】`;
    }
    return `${['初', '二', '三', '四', '五', '上'][index]}${yao.yinYang === 'yin' ? '六' : '九'}：${yaociTexts[index] || '爻辞待补'}`;
  });
}

// 生成十翼解释
function generateShiyi(gua: Gua): string {
  return `《彖》曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明始终，六位时成，时乘六龙以御天。`;
}

// 生成综合分析
function generateAnalysis(gua: Gua, question: string): string {
  const changingCount = gua.yaos.filter(y => y.isChanging).length;

  let analysis = `问卦：${question}\n\n`;
  analysis += `得卦为${gua.name}卦（第${gua.number}卦），${gua.lowerTrigram}上${gua.upperTrigram}下。\n\n`;

  if (changingCount > 0) {
    analysis += `卦中${changingCount}个动爻，将变为${gua.changedGua?.name}卦。\n\n`;
  }

  analysis += `此卦${gua.properties.yuanyang}，五行属${gua.properties.wuxing}，`;
  analysis += `在${gua.properties.bagua}宫，象征着${getGuaSymbolism(gua.name)}。\n\n`;

  analysis += `总体来看，此卦显示`;

  // 根据卦象给出基本判断
  if (gua.number <= 10) {
    analysis += '事情刚开始，需要耐心等待时机，不可急躁冒进。';
  } else if (gua.number <= 30) {
    analysis += '事情处于发展阶段，需要坚持努力，保持谨慎。';
  } else if (gua.number <= 50) {
    analysis += '事情已进入关键阶段，需要把握机会，果断行动。';
  } else {
    analysis += '事情接近完成，需要善始善终，注意收尾工作。';
  }

  return analysis;
}

// 获取卦象象征意义
function getGuaSymbolism(guaName: string): string {
  const symbolism: { [key: string]: string } = {
    '乾': '天行健，君子以自强不息',
    '坤': '地势坤，君子以厚德载物',
    '震': '洊雷震，君子以恐惧修省',
    '坎': '水洊至，君子以常德行，习教事',
    '艮': '兼山艮，君子以思不出其位',
    '巽': '随风巽，君子以申命行事',
    '离': '明两作离，君子以继明照于四方',
    '兑': '丽泽兑，君子以朋友讲习'
  };

  return symbolism[guaName] || '天道循环，生生不息';
}