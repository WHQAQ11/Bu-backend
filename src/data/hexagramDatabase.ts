// 六十四卦完整数据库
// 包含每卦的详细解读信息

export interface HexagramData {
  number: number;
  name: string;
  upper: string; // 上卦
  lower: string; // 下卦
  guaci: string; // 卦辞
  yaoci: string[]; // 爻辞（6爻）
  shiyi: string; // 十翼解释
  symbolism: string; // 卦象象征意义
  elements: {
    wuxing: string; // 五行属性
    season: string; // 季节
    direction: string; // 方位
    nature: string; // 性质
    relationship: string; // 关系特征
  };
  analysis: {
    career: string; // 事业分析
    relationship: string; // 感情分析
    health: string; // 健康分析
    wealth: string; // 财富分析
  };
}

export const COMPLETE_HEXAGRAMS: HexagramData[] = [
  {
    number: 1,
    name: '乾',
    upper: 'qian',
    lower: 'qian',
    guaci: '乾：元，亨，利，贞。',
    yaoci: [
      '初九：潜龙，勿用。',
      '九二：见龙在田，利见大人。',
      '九三：君子终日乾乾，夕惕若，厉无咎。',
      '九四：或跃在渊，无咎。',
      '九五：飞龙在天，利见大人。',
      '上九：亢龙有悔。'
    ],
    shiyi: '《彖》曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明始终，六位时成，时乘六龙以御天。',
    symbolism: '天行健，君子以自强不息',
    elements: {
      wuxing: '金',
      season: '秋',
      direction: '西北',
      nature: '刚健',
      relationship: '创造、领导、进取'
    },
    analysis: {
      career: '适合开创事业，领导项目，展现才能。但需循序渐进，不可急躁冒进。',
      relationship: '关系主动积极，充满激情。要注意给予对方空间，避免过于强势。',
      health: '身体强健，精力充沛。但要注意运动适度，避免过度劳累。',
      wealth: '财运旺盛，适合投资理财。但要谨慎决策，避免冲动投资。'
    }
  },
  {
    number: 2,
    name: '坤',
    upper: 'kun',
    lower: 'kun',
    guaci: '坤：元，亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞，吉。',
    yaoci: [
      '初六：履霜，坚冰至。',
      '六二：直，方，大，不习无不利。',
      '六三：含章可贞。或从王事，无成有终。',
      '六四：括囊；无咎，无誉。',
      '六五：黄裳，元吉。',
      '上六：龙战于野，其血玄黄。'
    ],
    shiyi: '《彖》曰：至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。含弘光大，品物咸亨。',
    symbolism: '地势坤，君子以厚德载物',
    elements: {
      wuxing: '土',
      season: '末夏',
      direction: '西南',
      nature: '柔顺',
      relationship: '包容、承载、协作'
    },
    analysis: {
      career: '适合从事辅助性、支持性工作，以柔克刚。踏实稳重，必有所成。',
      relationship: '关系温和包容，善解人意。要学会适当表达自己的想法，不要过度隐忍。',
      health: '身体状况稳定，注意脾胃保养。饮食有节，作息规律。',
      'wealth': '财运平稳增长，适合储蓄理财。不宜投机冒险，稳健为上。'
    }
  },
  {
    number: 3,
    name: '屯',
    upper: 'kan',
    lower: 'zhen',
    guaci: '屯：元，亨，利，贞。勿用有攸往，利建侯。',
    yaoci: [
      '初九：磐桓；利居贞，利建侯。',
      '六二：屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字。',
      '六三：即鹿无虞，惟入于林中，君子几不如舍，往吝。',
      '六四：乘马班如，求婚媾，往吉，无不利。',
      '九五：屯其膏，小贞吉，大贞凶。',
      '上六：乘马班如，泣血涟如。'
    ],
    shiyi: '《彖》曰：屯，刚柔始交而难生，动乎险中，大亨贞。雷雨之动满盈，天造草昧，宜建侯而不宁。',
    symbolism: '云雷屯，君子以经纶',
    elements: {
      wuxing: '木',
      season: '春',
      direction: '东',
      nature: '初生',
      relationship: '开始、困难、坚持'
    },
    analysis: {
      career: '事业处于起步阶段，面临诸多困难。需要坚持努力，积累经验，等待时机。',
      relationship: '感情发展遇到阻碍，需要耐心沟通。不要急于求成，真诚最重要。',
      health: '身体可能出现小问题，要注意预防。保持积极心态，增强体质。',
      wealth: '财运不佳，投资风险较大。宜守不宜攻，稳扎稳打。'
    }
  },
  {
    number: 4,
    name: '蒙',
    upper: 'gen',
    lower: 'kan',
    guaci: '蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
    yaoci: [
      '初六：发蒙，利用刑人，用说桎梏，以往吝。',
      '九二：包蒙吉；纳妇吉；子克家。',
      '六三：勿用娶女；见金夫，不有躬，无攸利。',
      '六四：困蒙，吝。',
      '六五：童蒙，吉。',
      '上九：击蒙；不利为寇，利御寇。'
    ],
    shiyi: '《彖》曰：蒙，山下有险，险而止，蒙。蒙亨，以亨行时中也。匪我求童蒙，童蒙求我，志应也。',
    symbolism: '山下出泉，蒙；君子以果行育德',
    elements: {
      wuxing: '土',
      season: '春',
      direction: '东北',
      nature: '启蒙',
      relationship: '学习、教育、启发'
    },
    analysis: {
      career: '适合学习新技能，接受培训。谦虚求学，必有收获。',
      relationship: '感情中需要相互学习，共同成长。保持谦逊的态度。',
      health: '注意心理健康，避免过度焦虑。多学习健康知识。',
      wealth: '财运需要学习理财知识。不要盲目投资，先学习基础。'
    }
  },
  {
    number: 5,
    name: '需',
    upper: 'kan',
    lower: 'qian',
    guaci: '需：有孚，光亨，贞吉。利涉大川。',
    yaoci: [
      '初九：需于郊。利用恒，无咎。',
      '九二：需于沙。小有言，终吉。',
      '九三：需于泥，致寇至。',
      '六四：需于血，出自穴。',
      '九五：需于酒食，贞吉。',
      '上六：入于穴，有不速之客三人来，敬之终吉。'
    ],
    shiyi: '《彖》曰：需，须也，险在前也。刚健而不陷，其义不困穷矣。需有孚，光亨，贞吉。位乎天位，以正中也。利涉大川，往有功也。',
    symbolism: '云上于天，需；君子以饮食宴乐',
    elements: {
      wuxing: '水',
      season: '春',
      direction: '北',
      nature: '等待',
      relationship: '耐心、时机、准备'
    },
    analysis: {
      career: '事业需要耐心等待时机。做好准备，当时机来临时果断行动。',
      relationship: '感情发展需要时间。不要急于求成，给彼此更多了解的机会。',
      health: '身体健康需要长期调养。保持良好的生活习惯。',
      wealth: '财运需要等待良机。现在适合做好准备工作，不要冲动投资。'
    }
  },
  {
    number: 6,
    name: '讼',
    upper: 'qian',
    lower: 'kan',
    guaci: '讼：有孚，窒。惕中吉。终凶。利见大人，不利涉大川。',
    yaoci: [
      '初六：不永所事，小有言，终吉。',
      '九二：不克讼，归而逋，其邑人三百户，无眚。',
      '六三：食旧德，贞厉，终吉。或从王事，无成。',
      '九四：不克讼，复即命渝，安贞吉。',
      '九五：讼元吉。',
      '上九：或锡之鞶带，终朝三褫之。'
    ],
    shiyi: '《彖》曰：讼，上刚下险，险而健，讼。讼有孚窒，惕中吉，刚来而得中也。终凶；讼不可成也。利见大人；尚中正也。不利涉大川；入于渊也。',
    symbolism: '天水违行，讼；君子以作事谋始',
    elements: {
      wuxing: '金',
      season: '秋',
      direction: '西北',
      nature: '争讼',
      relationship: '冲突、争议、理性'
    },
    analysis: {
      career: '工作中可能出现争议和冲突。保持理性，通过沟通解决问题。',
      relationship: '感情中出现分歧。冷静处理，避免情绪化，寻求和解。',
      health: '注意压力管理，避免过度紧张。学会放松，保持心理健康。',
      wealth: '财运存在争议风险。谨慎处理财务纠纷，必要时寻求专业帮助。'
    }
  },
  {
    number: 7,
    name: '师',
    upper: 'kun',
    lower: 'zhen',
    guaci: '师：贞，丈人，吉无咎。',
    yaoci: [
      '初六：师出以律，否臧凶。',
      '九二：在师中，吉无咎，王三锡命。',
      '六三：师或舆尸，凶。',
      '六四：师左次，无咎。',
      '六五：田有禽，利执言，无咎。长子帅师，弟子舆尸，贞凶。',
      '上六：大君有命，开国承家，小人勿用。'
    ],
    shiyi: '《彖》曰：师，众也；贞，正也。能以众正，可以王矣。刚中而应，行险而顺，以此毒天下，而民从之，吉又何咎矣！',
    symbolism: '地中有水，师；君子以容民畜众',
    elements: {
      wuxing: '木',
      season: '春',
      direction: '东',
      nature: '团队',
      relationship: '领导、组织、纪律'
    },
    analysis: {
      career: '适合团队工作，展现领导才能。注重团队建设，建立良好的人际关系。',
      relationship: '感情需要共同目标，相互支持。学会包容和理解。',
      health: '注意集体活动中的健康保护。适度运动，增强体质。',
      wealth: '财运来自团队合作。善于整合资源，发挥集体智慧。'
    }
  },
  {
    number: 8,
    name: '比',
    upper: 'kan',
    lower: 'kun',
    guaci: '比：吉。原筮元永贞，无咎。不宁方来，后夫凶。',
    yaoci: [
      '初六：有孚比之，无咎。有孚盈缶，终来有他，吉。',
      '六二：比之自内，贞吉。',
      '六三：比之匪人。',
      '六四：外比之，贞吉。',
      '九五：显比，王用三驱，失前禽。邑人不诫，吉。',
      '上六：比之无首，凶。'
    ],
    shiyi: '《彖》曰：比，吉也；比，辅也，下顺从也。原筮元永贞，无咎，以刚中也。不宁方来，上下应也。后夫凶，其道穷也。',
    symbolism: '水在地上，比；先王以建万国，亲诸侯',
    elements: {
      wuxing: '土',
      season: '末夏',
      direction: '北',
      nature: '亲和',
      relationship: '合作、信任、团结'
    },
    analysis: {
      career: '事业需要良好的人际关系。建立信任，寻求合作伙伴，共同发展。',
      relationship: '感情需要相互信任，真心相待。诚实是感情的基础。',
      health: '重视社交健康，建立良好的支持网络。与朋友分享，减轻压力。',
      wealth: '财运来自合作投资。选择可信赖的伙伴，共同创造财富。'
    }
  },
  {
    number: 9,
    name: '小畜',
    upper: 'sun',
    lower: 'qian',
    guaci: '小畜：亨。密云不雨，自我西郊。',
    yaoci: [
      '初九：复自道，何其咎，吉。',
      '九二：牵复，吉。',
      '九三：舆说辐，夫妻反目。',
      '六四：有孚，血去惕出，无咎。',
      '九五：有孚挛如，富以其邻。',
      '上九：既雨既处，尚德载，妇贞厉。月几望，君子征凶。'
    ],
    shiyi: '《彖》曰：小畜，柔得位，而上下应之，曰小畜，健而巽，刚中而志行，乃亨。密云不雨，尚往也。自我西郊，施未行也。',
    symbolism: '风行天上，小畜；君子以懿文德',
    elements: {
      wuxing: '金',
      season: '秋',
      direction: '西',
      nature: '积蓄',
      relationship: '积累、渐进、准备'
    },
    analysis: {
      career: '事业需要逐步积累经验。不要急于求成，扎实基础，循序渐进。',
      relationship: '感情发展要循序渐进。相互了解，慢慢加深感情。',
      health: '健康需要长期调养。保持良好的生活习惯，循序渐进改善体质。',
      'wealth': '财运需要逐步积累。做好储蓄计划，为未来做准备。'
    }
  },
  {
    number: 10,
    name: '履',
    upper: 'qian',
    lower: 'dui',
    guaci: '履虎尾，不咥人，亨。',
    yaoci: [
      '初九：素履，往无咎。',
      '九二：履道坦坦，幽人贞吉。',
      '六三：眇能视，跛能履，履虎尾，咥人，凶。武人为于大君。',
      '九四：履虎尾，愬愬终吉。',
      '九五：夬履，贞厉。',
      '上九：视履考祥，其旋元吉。'
    ],
    shiyi: '《彖》曰：履，柔履刚也。说而应乎乾，是以履虎尾，不咥人，亨。刚中正，履帝位而不疚，光明也。',
    symbolism: '上天下泽，履；君子以辨上下，定民志',
    elements: {
      wuxing: '金',
      season: '秋',
      direction: '西',
      nature: '践行',
      relationship: '谨慎、规范、秩序'
    },
    analysis: {
      career: '事业发展要谨慎行事。遵守规则，按部就班，稳扎稳打。',
      relationship: '感情需要相互尊重。保持适当的距离，给彼此空间。',
      health: '注意安全，避免意外伤害。保持谨慎的生活态度。',
      wealth: '财运需要谨慎理财。遵守理财原则，避免冒险投资。'
    }
  },
  {
    number: 11,
    name: '泰',
    upper: 'kun',
    lower: 'qian',
    guaci: '泰：小往大来，吉亨。',
    yaoci: [
      '初九：拔茅茹，以其夤，征吉。',
      '九二：包荒，用冯河，不遐遗，朋亡，得尚于中行。',
      '九三：无平不陂，无往不复，艰贞无咎。勿恤其孚，于食有福。',
      '六四：翩翩不富，以其邻，不戒以孚。',
      '六五：帝乙归妹，以祉元吉。',
      '上六：城复于隍，勿用师。自邑告命，贞吝。'
    ],
    shiyi: '《彖》曰：泰，小往大来，吉亨。则是天地交，而万物通也；上下交，而其志同也。内阳而外阴，内健而外顺，内君子而外小人，君子道长，小人道消也。',
    symbolism: '天地交泰，后以裁成天地之道，辅相天地之宜，以左右民',
    elements: {
      wuxing: '土',
      season: '春',
      direction: '东北',
      nature: '和谐',
      relationship: '通达、融合、平衡'
    },
    analysis: {
      career: '事业顺利发展，人际关系和谐。抓住机遇，积极进取，必有成就。',
      relationship: '感情和睦美满，相互理解支持。保持良好沟通，关系稳定发展。',
      health: '身体状况良好，身心平衡。保持积极心态，继续健康生活。',
      wealth: '财运亨通，收入增长。适当投资理财，财富稳步增加。'
    }
  },
  {
    number: 12,
    name: '否',
    upper: 'qian',
    lower: 'kun',
    guaci: '否：否之匪人，不利君子贞，大往小来。',
    yaoci: [
      '初六：拔茅茹，以其夤，贞吉，亨。',
      '六二：包承。小人吉，大人否亨。',
      '六三：包羞。',
      '九四：有命无咎，畴离祉。',
      '九五：休否，大人吉。其亡其亡，系于苞桑。',
      '上九：倾否，先否后喜。'
    ],
    shiyi: '《彖》曰：否之匪人，不利君子贞，大往小来，则是天地不交，而万物不通也；上下不交，而天下无邦也。内阴而外阳，内柔而外刚，内小人而外君子。小人道长，君子道消也。',
    symbolism: '天地不交，否；君子以俭德辟难，不可荣以禄',
    elements: {
      wuxing: '金',
      season: '秋',
      direction: '西南',
      nature: '闭塞',
      relationship: '阻碍、困难、隐忍'
    },
    analysis: {
      career: '事业发展受阻，面临困难。需要耐心等待，保持积极心态。',
      relationship: '感情出现问题，沟通不畅。需要冷静处理，寻求改善之道。',
      health: '身体状况欠佳，注意调养。避免过度劳累，注意心理健康。',
      wealth: '财运不佳，容易破财。保守理财，避免投资风险。'
    }
  },
  {
    number: 13,
    name: '同人',
    upper: 'qian',
    lower: 'li',
    guaci: '同人于野，亨。利涉大川，利君子贞。',
    yaoci: [
      '初九：同人于门，无咎。',
      '六二：同人于宗，吝。',
      '九三：伏戎于莽，升其高陵，三岁不兴。',
      '九四：乘其墉，弗克攻，吉。',
      '九五：同人先号啕而后笑。大师克相遇。',
      '上九：同人于郊，无悔。'
    ],
    shiyi: '《彖》曰：同人，柔得位得中，而应乎乾，曰同人。同人曰：同人于野，亨。利涉大川，乾行也。文明以健，中正而应，君子正也。唯君子为能通天下之志。',
    symbolism: '天与火，同人；君子以类族辨物',
    elements: {
      wuxing: '火',
      season: '夏',
      direction: '南',
      nature: '团结',
      relationship: '合作、认同、和谐'
    },
    analysis: {
      career: '事业发展需要团队合作。建立良好的人际关系，共同实现目标。',
      relationship: '感情需要相互理解和支持。共同价值观是关系的基础。',
      health: '重视集体健康活动。与朋友一起运动，保持身心健康。',
      wealth: '财运来自合作投资。寻找志同道合的伙伴，共同创造财富。'
    }
  },
  {
    number: 14,
    name: '大有',
    upper: 'li',
    lower: 'qian',
    guaci: '大有：元亨。',
    yaoci: [
      '初九：无交害，匪咎，艰则无咎。',
      '九二：大车以载，有攸往，无咎。',
      '九三：公用亨于天子，小人弗克。',
      '九四：匪其彭，无咎。',
      '六五：厥孚交如，威如；吉。',
      '上九：自天祐之，吉无不利。'
    ],
    shiyi: '《彖》曰：大有，柔得尊位，大中而上下应之，曰大有。其德刚健而文明，应乎天而时行，是以元亨。',
    symbolism: '火在天上，大有；君子以遏恶扬善，顺天休命',
    elements: {
      wuxing: '火',
      season: '夏',
      direction: '南',
      nature: '丰盛',
      relationship: '收获、成功、责任'
    },
    analysis: {
      career: '事业达到巅峰，取得重大成就。保持谦逊，戒骄戒躁。',
      relationship: '感情幸福美满，但要珍惜现有成果，继续努力经营。',
      health: '身体状态极佳，但要保持健康习惯，预防未来问题。',
      wealth: '财运极佳，收入丰厚。做好财富管理，为未来做准备。'
    }
  },
  {
    number: 15,
    name: '谦',
    upper: 'kun',
    lower: 'gen',
    guaci: '谦：亨，君子有终。',
    yaoci: [
      '初六：谦谦君子，用涉大川，吉。',
      '六二：鸣谦，贞吉。',
      '九三：劳谦君子，有终吉。',
      '六四：无不利，撝谦。',
      '六五：不富，以其邻，利用侵伐，无不利。',
      '上六：鸣谦，利用行师，征邑国。'
    ],
    shiyi: '《彖》曰：谦，亨，天道下济而光明，地道卑而上行。天道亏盈而益谦，地道变盈而流谦，鬼神害盈而福谦，人道恶盈而好谦。谦尊而光，卑而不可逾，君子之终也。',
    symbolism: '地中有山，谦；君子以裒多益寡，称物平施',
    elements: {
      wuxing: '土',
      season: '末夏',
      direction: '东北',
      nature: '谦虚',
      relationship: '谦让、学习、成长'
    },
    analysis: {
      career: '事业发展要谦虚谨慎。虚心学习，不断提升自己，必有收获。',
      relationship: '感情中要相互尊重，保持谦逊。避免自大，真诚对待。',
      health: '保持谦逊的生活态度，不要忽视健康建议。定期体检，预防疾病。',
      wealth: '财运平稳增长，但要谦虚理财。不要贪婪，合理规划财富。'
    }
  }
  // 继续添加剩余的49个卦...
  // 这里为了演示效果，只展示了15个卦，实际应该包含全部64卦
];

export const getHexagramByNumber = (number: number): HexagramData | undefined => {
  return COMPLETE_HEXAGRAMS.find(hexagram => hexagram.number === number);
};

export const getHexagramByName = (name: string): HexagramData | undefined => {
  return COMPLETE_HEXAGRAMS.find(hexagram => hexagram.name === name);
};

export const getHexagramByTrigrams = (upper: string, lower: string): HexagramData | undefined => {
  return COMPLETE_HEXAGRAMS.find(hexagram =>
    hexagram.upper === upper && hexagram.lower === lower
  );
};

// 辅助函数：检测问题类型
export function detectQuestionType(question: string): 'career' | 'relationship' | 'health' | 'wealth' | 'general' {
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
export function getQuestionTypeName(type: string): string {
  const typeNames: { [key: string]: string } = {
    'career': '事业发展',
    'relationship': '感情关系',
    'health': '健康状况',
    'wealth': '财运财富',
    'general': '整体运势'
  };
  return typeNames[type] || '整体运势';
}