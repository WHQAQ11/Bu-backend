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
const hexagramDatabase_1 = require("../data/hexagramDatabase");
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
    const hexagram = hexagramDatabase_1.COMPLETE_HEXAGRAMS.find(h => h.upper === upperTrigramKey && h.lower === lowerTrigramKey) ||
        hexagramDatabase_1.COMPLETE_HEXAGRAMS[0];
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
            wuxing: hexagram.elements.wuxing,
            bagua: getBaguaAttribute(hexagram.number),
            yuanyang: getYuanyangAttribute(hexagram.number),
            symbolism: hexagram.symbolism,
            season: hexagram.elements.season,
            direction: hexagram.elements.direction,
            nature: hexagram.elements.nature,
            relationship: hexagram.elements.relationship
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
    const hexagram = (0, hexagramDatabase_1.getHexagramByNumber)(originalGua.number) || hexagramDatabase_1.COMPLETE_HEXAGRAMS[0];
    const questionType = (0, hexagramDatabase_1.detectQuestionType)(question);
    return {
        method: 'liuyao',
        question,
        originalGua,
        changedGua: originalGua.changedGua,
        interpretation: {
            guaci: hexagram.guaci,
            yaoci: generateDynamicYaoci(originalGua.yaos, hexagram),
            shiyi: hexagram.shiyi,
            analysis: generateEnhancedAnalysis(originalGua, hexagram, question, questionType)
        },
        timestamp: new Date()
    };
}
function generateDynamicYaoci(yaos, hexagram) {
    return yaos.map((yao, index) => {
        const yaociText = hexagram.yaoci?.[index] || '爻辞待补';
        return `${['初', '二', '三', '四', '五', '上'][index]}${yao.yinYang === 'yin' ? '六' : '九'}：${yaociText}${yao.isChanging ? ' 【动爻】' : ''}`;
    });
}
function generateEnhancedAnalysis(gua, hexagram, question, questionType) {
    const changingCount = gua.yaos.filter(y => y.isChanging).length;
    let analysis = `问卦：${question}\n\n`;
    analysis += `得卦为${gua.name}卦（第${gua.number}卦），${gua.lowerTrigram}上${gua.upperTrigram}下。\n\n`;
    analysis += `卦象本质：${hexagram.symbolism}\n`;
    analysis += `五行属性：${hexagram.elements.wuxing}（${hexagram.elements.nature}）\n`;
    analysis += `时空特征：${hexagram.elements.direction}方位，${hexagram.elements.season}季\n`;
    analysis += `关系特征：${hexagram.elements.relationship}\n\n`;
    if (changingCount > 0 && gua.changedGua) {
        const changedHexagram = (0, hexagramDatabase_1.getHexagramByNumber)(gua.changedGua.number);
        if (changedHexagram) {
            analysis += `变卦分析：卦中有${changingCount}个动爻，将变为${gua.changedGua.name}卦。\n`;
            analysis += `从${hexagram.elements.relationship}转变为${changedHexagram.elements.relationship}，`;
            analysis += `象征着从${hexagram.nature}到${changedHexagram.elements.nature}的演变。\n\n`;
        }
    }
    else {
        analysis += `卦象特征：此为静卦，${hexagram.elements.relationship}，状态稳定。\n\n`;
    }
    if (questionType !== 'general' && hexagram.analysis[questionType]) {
        analysis += `针对"${question}"的${(0, hexagramDatabase_1.getQuestionTypeName)(questionType)}分析：\n`;
        analysis += `${hexagram.analysis[questionType]}\n\n`;
    }
    analysis += `综合指导：\n`;
    analysis += `此卦${gua.properties.yuanyang}，${hexagram.elements.relationship}。`;
    analysis += `建议保持${hexagram.elements.nature}的态度，`;
    if (hexagram.elements.nature === '刚健' || hexagram.elements.nature === '创造') {
        analysis += '积极主动，但要注意适度，不要过度。';
    }
    else if (hexagram.elements.nature === '柔顺' || hexagram.elements.nature === '包容') {
        analysis += '温和渐进，顺其自然，但不要消极被动。';
    }
    else if (hexagram.elements.nature === '等待' || hexagram.elements.nature === '积蓄') {
        analysis += '耐心准备，当时机成熟时果断行动。';
    }
    else {
        analysis += '根据实际情况灵活应对，保持中庸之道。';
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