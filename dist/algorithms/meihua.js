"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meihuaNumberDivination = meihuaNumberDivination;
exports.meihuaTimeDivination = meihuaTimeDivination;
exports.meihuaWordDivination = meihuaWordDivination;
exports.performMeihuaDivination = performMeihuaDivination;
const BAGUA_NUMBERS = {
    1: '坎',
    2: '坤',
    3: '震',
    4: '巽',
    6: '乾',
    7: '兑',
    8: '艮',
    9: '离'
};
const NUMBER_TO_BAGUA = {
    1: 'kan', 2: 'kun', 3: 'zhen', 4: 'sun',
    6: 'qian', 7: 'dui', 8: 'gen', 9: 'li'
};
const BAGUA_NAMES = {
    qian: '乾', kun: '坤', zhen: '震', sun: '巽',
    kan: '坎', li: '离', gen: '艮', dui: '兑'
};
const hexagramDatabase_1 = require("../data/hexagramDatabase");
function meihuaNumberDivination(numbers) {
    if (numbers.length < 2) {
        throw new Error('梅花易数数字起卦至少需要2个数字');
    }
    let upperNum = numbers[0];
    let lowerNum = numbers[1];
    upperNum = upperNum > 8 ? (upperNum % 8 || 8) : upperNum;
    lowerNum = lowerNum > 8 ? (lowerNum % 8 || 8) : lowerNum;
    let changingYao;
    if (numbers.length >= 3) {
        let yaoNum = numbers[2];
        changingYao = yaoNum > 6 ? (yaoNum % 6 || 6) : yaoNum;
    }
    return createMeihuaGua(upperNum, lowerNum, changingYao, 'number', { numbers });
}
function meihuaTimeDivination(year, month, day, hour) {
    const yearNum = year % 100;
    const upperTotal = yearNum + month + day;
    let upperNum = upperTotal % 8;
    if (upperNum === 0)
        upperNum = 8;
    const lowerTotal = yearNum + month + day + hour;
    let lowerNum = lowerTotal % 8;
    if (lowerNum === 0)
        lowerNum = 8;
    let changingYao = (yearNum + month + day + hour) % 6;
    if (changingYao === 0)
        changingYao = 6;
    return createMeihuaGua(upperNum, lowerNum, changingYao, 'time', {
        year, month, day, hour
    });
}
function meihuaWordDivination(text) {
    if (!text || text.trim().length === 0) {
        throw new Error('字数起卦需要提供文字');
    }
    const cleanText = text.trim();
    const chars = cleanText.split('');
    let upperNum;
    let lowerNum;
    let changingYao;
    if (chars.length === 1) {
        const strokeCount = getStrokeCount(chars[0] || '');
        upperNum = strokeCount > 8 ? (strokeCount % 8 || 8) : strokeCount;
        lowerNum = upperNum;
    }
    else if (chars.length === 2) {
        const upperStrokeCount = getStrokeCount(chars[0] || '');
        const lowerStrokeCount = getStrokeCount(chars[1] || '');
        upperNum = upperStrokeCount > 8 ?
            (upperStrokeCount % 8 || 8) : upperStrokeCount;
        lowerNum = lowerStrokeCount > 8 ?
            (lowerStrokeCount % 8 || 8) : lowerStrokeCount;
    }
    else {
        const mid = Math.ceil(chars.length / 2);
        const upperStrokes = chars.slice(0, mid).reduce((sum, char) => sum + getStrokeCount(char), 0);
        const lowerStrokes = chars.slice(mid).reduce((sum, char) => sum + getStrokeCount(char), 0);
        upperNum = upperStrokes > 8 ? (upperStrokes % 8 || 8) : upperStrokes;
        lowerNum = lowerStrokes > 8 ? (lowerStrokes % 8 || 8) : lowerStrokes;
        const totalStrokes = upperStrokes + lowerStrokes;
        changingYao = totalStrokes > 6 ? (totalStrokes % 6 || 6) : totalStrokes;
    }
    return createMeihuaGua(upperNum, lowerNum, changingYao, 'word', { words: cleanText });
}
function createMeihuaGua(upperNum, lowerNum, changingYao, method, sourceInfo) {
    const upperKey = NUMBER_TO_BAGUA[upperNum] || 'qian';
    const lowerKey = NUMBER_TO_BAGUA[lowerNum] || 'qian';
    const hexagram = hexagramDatabase_1.COMPLETE_HEXAGRAMS.find(h => h.upper === upperKey && h.lower === lowerKey) ||
        hexagramDatabase_1.COMPLETE_HEXAGRAMS[0];
    return {
        name: hexagram.name,
        upperTrigram: BAGUA_NAMES[upperKey],
        lowerTrigram: BAGUA_NAMES[lowerKey],
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
function getStrokeCount(char) {
    const simpleStrokes = {
        '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
        '人': 2, '大': 3, '天': 4, '地': 6, '日': 4, '月': 4, '水': 4, '火': 4, '木': 4, '金': 8,
        '中': 4, '国': 8, '家': 10, '爱': 10, '福': 13, '寿': 7, '喜': 12, '财': 7, '运': 7
    };
    return simpleStrokes[char] || Math.floor(Math.random() * 10) + 1;
}
function generateEnhancedMeihuaAnalysis(hexagram, changingYao, method) {
    let analysis = `梅花易数${method}起卦，得${hexagram.name}卦`;
    if (changingYao) {
        const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
        analysis += `，${yaoNames[changingYao - 1]}为动爻`;
    }
    analysis += `。\n\n`;
    analysis += `卦象本质：${hexagram.symbolism}\n`;
    analysis += `五行属性：${hexagram.elements.wuxing}（${hexagram.elements.nature}）\n`;
    analysis += `时空特征：${hexagram.elements.direction}方位，${hexagram.elements.season}季\n`;
    analysis += `关系特征：${hexagram.elements.relationship}\n\n`;
    analysis += `梅花易数心法：`;
    analysis += `此卦${hexagram.elements.relationship}，${hexagram.elements.nature}。`;
    if (hexagram.elements.nature === '刚健' || hexagram.elements.nature === '创造') {
        analysis += '梅花易数认为此时应主动出击，把握时机，但需防止过度。';
    }
    else if (hexagram.elements.nature === '柔顺' || hexagram.elements.nature === '包容') {
        analysis += '梅花易数主张以柔克刚，顺势而为，静待时机。';
    }
    else if (hexagram.elements.nature === '和谐' || hexagram.elements.nature === '团结') {
        analysis += '梅花易数强调此时应注重人际关系，寻求合作共赢。';
    }
    else if (hexagram.elements.nature === '等待' || hexagram.elements.nature === '积蓄') {
        analysis += '梅花易数提醒此时需耐心准备，厚积薄发。';
    }
    else {
        analysis += '梅花易数建议根据实际情况灵活应对，保持中庸之道。';
    }
    analysis += `\n\n体用分析：`;
    analysis += `${hexagram.name}卦${hexagram.elements.relationship}，`;
    if (method === 'number') {
        analysis += '数字起卦重在数理，应关注时机把握。';
    }
    else if (method === 'time') {
        analysis += '时间起卦重在天时，应顺应自然规律。';
    }
    else if (method === 'word') {
        analysis += '字数起卦重在感应，应相信直觉判断。';
    }
    if (changingYao) {
        analysis += `\n\n动爻解析：第${changingYao}爻为动爻，预示着`;
        if (changingYao <= 2) {
            analysis += '事情处于初始阶段，变化刚刚开始。';
        }
        else if (changingYao <= 4) {
            analysis += '事情发展进入关键阶段，需要特别关注。';
        }
        else {
            analysis += '事情接近完成，需要善始善终。';
        }
    }
    return analysis;
}
function performMeihuaDivination(question) {
    const numbers = Array(3).fill(0).map(() => Math.floor(Math.random() * 9) + 1);
    const result = meihuaNumberDivination(numbers);
    return {
        method: 'meihua',
        question,
        result,
        timestamp: new Date()
    };
}
//# sourceMappingURL=meihua.js.map