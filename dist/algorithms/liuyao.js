"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateCoinToss = simulateCoinToss;
exports.createYao = createYao;
exports.createGua = createGua;
exports.performDivination = performDivination;
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
const HEXAGRAMS = [
    { number: 1, name: '乾', upper: 'qian', lower: 'qian', guaci: '乾：元，亨，利，贞。' },
    { number: 2, name: '坤', upper: 'kun', lower: 'kun', guaci: '坤：元，亨，利牝马之贞。' },
    { number: 3, name: '屯', upper: 'kan', lower: 'zhen', guaci: '屯：元，亨，利，贞。勿用有攸往，利建侯。' },
    { number: 4, name: '蒙', upper: 'gen', lower: 'kan', guaci: '蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
    { number: 5, name: '需', upper: 'kan', lower: 'qian', guaci: '需：有孚，光亨，贞吉。利涉大川。' },
    { number: 6, name: '讼', upper: 'qian', lower: 'kan', guaci: '讼：有孚，窒。惕中吉。终凶。利见大人，不利涉大川。' },
];
function simulateCoinToss() {
    const coins = Array(3).fill(0).map(() => Math.random() < 0.5 ? 0 : 1);
    const backs = coins.reduce((sum, coin) => sum + coin, 0);
    switch (backs) {
        case 0: return 7;
        case 1: return 8;
        case 2: return 6;
        case 3: return 9;
        default: return 7;
    }
}
function createYao(value) {
    const isChanging = value === 6 || value === 9;
    const yinYang = (value === 6 || value === 8) ? 'yin' : 'yang';
    let symbol;
    switch (value) {
        case 6:
            symbol = '⚋';
            break;
        case 7:
            symbol = '⚊';
            break;
        case 8:
            symbol = '⚋';
            break;
        case 9:
            symbol = '⚊';
            break;
        default: symbol = '⚊';
    }
    return {
        value,
        isChanging,
        yinYang,
        symbol
    };
}
function createGua(yaoValues) {
    if (yaoValues.length !== 6) {
        throw new Error('卦象必须由六个爻组成');
    }
    const yaos = yaoValues.map(value => createYao(value));
    const lowerTrigramValues = yaoValues.slice(0, 3);
    const upperTrigramValues = yaoValues.slice(3, 6);
    const lowerTrigramKey = getTrigramKey(lowerTrigramValues);
    const upperTrigramKey = getTrigramKey(upperTrigramValues);
    const lowerTrigram = TRIGRAMS[lowerTrigramKey];
    const upperTrigram = TRIGRAMS[upperTrigramKey];
    const hexagram = HEXAGRAMS.find(h => h.upper === upperTrigramKey && h.lower === lowerTrigramKey) ||
        { number: 1, name: '乾', upper: 'qian', lower: 'qian', guaci: '乾：元，亨，利，贞。' };
    let changedGua;
    const changingYaos = yaos.filter(yao => yao.isChanging);
    if (changingYaos.length > 0) {
        const changedYaoValues = yaos.map(yao => {
            if (yao.isChanging) {
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
function getTrigramKey(yaoValues) {
    const binary = yaoValues.map(value => (value === 7 || value === 9) ? 1 : 0);
    const patterns = {
        '111': 'qian',
        '000': 'kun',
        '100': 'zhen',
        '010': 'kan',
        '001': 'gen',
        '011': 'sun',
        '101': 'li',
        '110': 'dui'
    };
    const key = binary.join('');
    return patterns[key] || 'qian';
}
function getWuxingAttribute(guaNumber) {
    const wuxingMap = {
        1: '金', 2: '土', 3: '火', 4: '木', 5: '木',
        6: '水', 7: '土', 8: '土', 9: '金', 10: '水'
    };
    return wuxingMap[guaNumber] || '金';
}
function getBaguaAttribute(guaNumber) {
    const baguaOrder = ['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'];
    return baguaOrder[Math.floor((guaNumber - 1) / 8) % 8] || '乾';
}
function getYuanyangAttribute(guaNumber) {
    return guaNumber <= 32 ? '阳卦' : '阴卦';
}
function performDivination(question) {
    const yaoValues = Array(6).fill(0).map(() => simulateCoinToss());
    const originalGua = createGua(yaoValues);
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
function generateYaoci(yaos) {
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
function generateShiyi(gua) {
    return `《彖》曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明始终，六位时成，时乘六龙以御天。`;
}
function generateAnalysis(gua, question) {
    const changingCount = gua.yaos.filter(y => y.isChanging).length;
    let analysis = `问卦：${question}\n\n`;
    analysis += `得卦为${gua.name}卦（第${gua.number}卦），${gua.lowerTrigram}上${gua.upperTrigram}下。\n\n`;
    if (changingCount > 0) {
        analysis += `卦中${changingCount}个动爻，将变为${gua.changedGua?.name}卦。\n\n`;
    }
    analysis += `此卦${gua.properties.yuanyang}，五行属${gua.properties.wuxing}，`;
    analysis += `在${gua.properties.bagua}宫，象征着${getGuaSymbolism(gua.name)}。\n\n`;
    analysis += `总体来看，此卦显示`;
    if (gua.number <= 10) {
        analysis += '事情刚开始，需要耐心等待时机，不可急躁冒进。';
    }
    else if (gua.number <= 30) {
        analysis += '事情处于发展阶段，需要坚持努力，保持谨慎。';
    }
    else if (gua.number <= 50) {
        analysis += '事情已进入关键阶段，需要把握机会，果断行动。';
    }
    else {
        analysis += '事情接近完成，需要善始善终，注意收尾工作。';
    }
    return analysis;
}
function getGuaSymbolism(guaName) {
    const symbolism = {
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
//# sourceMappingURL=liuyao.js.map