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
const HEXAGRAMS = [
    { number: 1, name: '乾', upper: 'qian', lower: 'qian', guaci: '乾：元，亨，利，贞。' },
    { number: 2, name: '坤', upper: 'kun', lower: 'kun', guaci: '坤：元，亨，利牝马之贞。' },
    { number: 3, name: '屯', upper: 'kan', lower: 'zhen', guaci: '屯：元，亨，利，贞。勿用有攸往，利建侯。' },
    { number: 4, name: '蒙', upper: 'gen', lower: 'kan', guaci: '蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
    { number: 5, name: '需', upper: 'kan', lower: 'qian', guaci: '需：有孚，光亨，贞吉。利涉大川。' },
    { number: 6, name: '讼', upper: 'qian', lower: 'kan', guaci: '讼：有孚，窒。惕中吉。终凶。利见大人，不利涉大川。' },
    { number: 7, name: '师', upper: 'kun', lower: 'zhen', guaci: '师：贞，丈人吉，无咎。' },
    { number: 8, name: '比', upper: 'kan', lower: 'kun', guaci: '比：吉。原筮元永贞，无咎。不宁方来，后夫凶。' },
    { number: 9, name: '小畜', upper: 'sun', lower: 'qian', guaci: '小畜：亨。密云不雨，自我西郊。' },
    { number: 10, name: '履', upper: 'qian', lower: 'dui', guaci: '履：履虎尾，不咥人，亨。' },
    { number: 11, name: '泰', upper: 'kun', lower: 'qian', guaci: '泰：小往大来，吉亨。' },
    { number: 12, name: '否', upper: 'qian', lower: 'kun', guaci: '否：否之匪人，不利君子贞，大往小来。' },
    { number: 13, name: '同人', upper: 'qian', lower: 'li', guaci: '同人：同人于野，亨。利涉大川，利君子贞。' },
    { number: 14, name: '大有', upper: 'li', lower: 'qian', guaci: '大有：元亨。' },
    { number: 15, name: '谦', upper: 'gen', lower: 'kun', guaci: '谦：亨，君子有终。' },
    { number: 16, name: '豫', upper: 'kun', lower: 'zhen', guaci: '豫：利建侯行师。' },
    { number: 17, name: '随', upper: 'dui', lower: 'zhen', guaci: '随：元亨，利贞，无咎。' },
    { number: 18, name: '蛊', upper: 'gen', lower: 'sun', guaci: '蛊：元亨，利涉大川。先甲三日，后甲三日。' },
    { number: 19, name: '临', upper: 'kun', lower: 'dui', guaci: '临：元亨，利贞。至于八月有凶。' },
    { number: 20, name: '观', upper: 'sun', lower: 'kun', guaci: '观：盥而不荐，有孚顒若。' },
];
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
    const hexagram = HEXAGRAMS.find(h => h.upper === upperKey && h.lower === lowerKey) ||
        { number: 1, name: '乾', upper: 'qian', lower: 'qian', guaci: '乾：元，亨，利，贞。' };
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
            shiyi: generateShiyi(hexagram.name),
            analysis: generateMeihuaAnalysis(hexagram.name, changingYao, method)
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
function generateShiyi(guaName) {
    const shiyiMap = {
        '乾': '《彖》曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。',
        '坤': '《彖》曰：至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。',
        '震': '《彖》曰：震，亨。震来虩虩，笑言哑哑。',
        '巽': '《彖》曰：重巽以申命，刚巽乎中正而志行。',
        '坎': '《彖》曰：习坎，重险也。水流而不盈，行险而不失其信。',
        '离': '《彖》曰：离，丽也。日月丽乎天，百谷草木丽乎土。',
        '艮': '《彖》曰：艮，止也。时止则止，时行则行，动静不失其时。',
        '兑': '《彖》曰：兑，说也。刚中而柔外，说以利贞，是以顺乎天而应乎人。'
    };
    return shiyiMap[guaName] || '《彖》曰：天道循环，生生不息。';
}
function generateMeihuaAnalysis(guaName, changingYao, method) {
    let analysis = `梅花易数${method}起卦，得${guaName}卦`;
    if (changingYao) {
        const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
        analysis += `，${yaoNames[changingYao - 1]}为动爻`;
    }
    analysis += `。\n\n`;
    const guaAnalysis = {
        '乾': '乾卦为天，象征刚健中正。此卦显示事情发展顺利，宜积极进取，但有刚愎自用之嫌。',
        '坤': '坤卦为地，象征柔顺包容。此卦显示宜静不宜动，以柔克刚，厚德载物。',
        '震': '震卦为雷，象征震动奋起。此卦显示将有变动或机遇，宜勇敢面对，但需谨慎。',
        '巽': '巽卦为风，象征顺从渐进。此卦显示宜顺势而为，循序渐进，不可急躁。',
        '坎': '坎卦为水，象征险陷困难。此卦显示前方有险阻，需谨慎应对，坚守诚信。',
        '离': '离卦为火，象征光明附着。此卦显示前途光明，但需明辨是非，保持中正。',
        '艮': '艮卦为山，象征静止停止。此卦显示宜适可而止，知止而止，避免冒进。',
        '兑': '兑卦为泽，象征喜悦言说。此卦显示将有喜事，但需言行一致，保持诚信。'
    };
    analysis += guaAnalysis[guaName] || '此卦象征天道循环，需要顺应时势，中正行事。';
    if (changingYao) {
        analysis += `\n\n动爻为第${changingYao}爻，预示着变化即将来临，需要特别关注。`;
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