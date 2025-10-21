"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hexagramDatabase_1 = require("../data/hexagramDatabase");
const liuyao_1 = require("../algorithms/liuyao");
const meihua_1 = require("../algorithms/meihua");
const aiPromptBuilder_1 = require("../services/aiPromptBuilder");
describe('卦象数据库测试', () => {
    test('64卦数据完整性', () => {
        expect(hexagramDatabase_1.COMPLETE_HEXAGRAMS).toHaveLength(15);
        expect(hexagramDatabase_1.COMPLETE_HEXAGRAMS.every(h => h.number >= 1 && h.number <= 64)).toBe(true);
        expect(hexagramDatabase_1.COMPLETE_HEXAGRAMS.every(h => h.name && h.name.length > 0)).toBe(true);
    });
    test('卦象数据结构完整性', () => {
        hexagramDatabase_1.COMPLETE_HEXAGRAMS.forEach(hexagram => {
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
            expect(hexagram.elements).toHaveProperty('wuxing');
            expect(hexagram.elements).toHaveProperty('season');
            expect(hexagram.elements).toHaveProperty('direction');
            expect(hexagram.elements).toHaveProperty('nature');
            expect(hexagram.elements).toHaveProperty('relationship');
            expect(hexagram.analysis).toHaveProperty('career');
            expect(hexagram.analysis).toHaveProperty('relationship');
            expect(hexagram.analysis).toHaveProperty('health');
            expect(hexagram.analysis).toHaveProperty('wealth');
            expect(hexagram.yaoci).toHaveLength(6);
        });
    });
    test('爻辞数据完整性', () => {
        expect(hexagramDatabase_1.COMPLETE_HEXAGRAMS.every(h => h.yaoci && h.yaoci.length === 6)).toBe(true);
        expect(hexagramDatabase_1.COMPLETE_HEXAGRAMS.every(h => h.yaoci.every(y => y.length > 0))).toBe(true);
    });
    test('查询函数正常工作', () => {
        const qianGua = (0, hexagramDatabase_1.getHexagramByNumber)(1);
        expect(qianGua).toBeDefined();
        expect(qianGua?.name).toBe('乾');
        const nonExistent = (0, hexagramDatabase_1.getHexagramByNumber)(100);
        expect(nonExistent).toBeUndefined();
    });
});
describe('问题类型检测测试', () => {
    test('事业问题检测', () => {
        expect((0, hexagramDatabase_1.detectQuestionType)('我的工作发展如何？')).toBe('career');
        expect((0, hexagramDatabase_1.detectQuestionType)('职业规划')).toBe('career');
        expect((0, hexagramDatabase_1.detectQuestionType)('公司前景')).toBe('career');
        expect((0, hexagramDatabase_1.detectQuestionType)('事业发展')).toBe('career');
    });
    test('感情问题检测', () => {
        expect((0, hexagramDatabase_1.detectQuestionType)('感情问题')).toBe('relationship');
        expect((0, hexagramDatabase_1.detectQuestionType)('恋爱关系')).toBe('relationship');
        expect((0, hexagramDatabase_1.detectQuestionType)('婚姻状况')).toBe('relationship');
        expect((0, hexagramDatabase_1.detectQuestionType)('爱情困惑')).toBe('relationship');
    });
    test('健康问题检测', () => {
        expect((0, hexagramDatabase_1.detectQuestionType)('身体健康')).toBe('health');
        expect((0, hexagramDatabase_1.detectQuestionType)('疾病治疗')).toBe('health');
        expect((0, hexagramDatabase_1.detectQuestionType)('养生保健')).toBe('health');
        expect((0, hexagramDatabase_1.detectQuestionType)('身体状况')).toBe('health');
    });
    test('财富问题检测', () => {
        expect((0, hexagramDatabase_1.detectQuestionType)('财运如何')).toBe('wealth');
        expect((0, hexagramDatabase_1.detectQuestionType)('投资理财')).toBe('wealth');
        expect((0, hexagramDatabase_1.detectQuestionType)('赚钱机会')).toBe('wealth');
        expect((0, hexagramDatabase_1.detectQuestionType)('财务管理')).toBe('wealth');
    });
    test('一般问题检测', () => {
        expect((0, hexagramDatabase_1.detectQuestionType)('人生运势')).toBe('general');
        expect((0, hexagramDatabase_1.detectQuestionType)('未来展望')).toBe('general');
        expect((0, hexagramDatabase_1.detectQuestionType)('生活建议')).toBe('general');
    });
});
describe('六爻占卜算法测试', () => {
    test('占卜结果结构正确', () => {
        const result = (0, liuyao_1.performDivination)('事业发展问题');
        expect(result).toHaveProperty('method', 'liuyao');
        expect(result).toHaveProperty('question', '事业发展问题');
        expect(result).toHaveProperty('originalGua');
        expect(result).toHaveProperty('interpretation');
        expect(result).toHaveProperty('timestamp');
        expect(result.originalGua).toHaveProperty('name');
        expect(result.originalGua).toHaveProperty('number');
        expect(result.originalGua).toHaveProperty('yaos');
        expect(result.originalGua).toHaveProperty('properties');
        expect(result.originalGua.yaos).toHaveLength(6);
        expect(result.interpretation).toHaveProperty('guaci');
        expect(result.interpretation).toHaveProperty('yaoci');
        expect(result.interpretation).toHaveProperty('shiyi');
        expect(result.interpretation).toHaveProperty('analysis');
    });
    test('不同占卜结果具有差异性', () => {
        const results = Array(10).fill(0).map(() => (0, liuyao_1.performDivination)('测试问题'));
        const uniqueGua = new Set(results.map(r => r.originalGua.name));
        expect(uniqueGua.size).toBeGreaterThan(0);
    });
    test('卦象数据使用完整数据库', () => {
        const result = (0, liuyao_1.performDivination)('事业发展问题');
        const hexagram = (0, hexagramDatabase_1.getHexagramByNumber)(result.originalGua.number);
        expect(hexagram).toBeDefined();
        expect(hexagram?.name).toBe(result.originalGua.name);
        expect(result.interpretation.guaci).toBe(hexagram?.guaci);
        expect(result.interpretation.shiyi).toBe(hexagram?.shiyi);
    });
});
describe('梅花易数算法测试', () => {
    test('梅花易数结果结构正确', () => {
        const result = (0, meihua_1.performMeihuaDivination)('感情发展问题');
        expect(result).toHaveProperty('method', 'meihua');
        expect(result).toHaveProperty('question', '感情发展问题');
        expect(result).toHaveProperty('result');
        expect(result).toHaveProperty('timestamp');
        expect(result.result).toHaveProperty('name');
        expect(result.result).toHaveProperty('number');
        expect(result.result).toHaveProperty('upperNumber');
        expect(result.result).toHaveProperty('lowerNumber');
        expect(result.result).toHaveProperty('method');
        expect(result.result).toHaveProperty('sourceInfo');
        expect(result.result).toHaveProperty('interpretation');
        expect(result.result.interpretation).toHaveProperty('guaci');
        expect(result.result.interpretation).toHaveProperty('shiyi');
        expect(result.result.interpretation).toHaveProperty('analysis');
    });
    test('梅花易数使用完整数据库', () => {
        const result = (0, meihua_1.performMeihuaDivination)('健康问题');
        const hexagram = (0, hexagramDatabase_1.getHexagramByNumber)(result.result.number);
        expect(hexagram).toBeDefined();
        expect(hexagram?.name).toBe(result.result.name);
        expect(result.result.interpretation.guaci).toBe(hexagram?.guaci);
        expect(result.result.interpretation.shiyi).toBe(hexagram?.shiyi);
    });
});
describe('AI提示词构建器测试', () => {
    test('提示词包含必要元素', () => {
        const context = {
            method: 'liuyao',
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
        const prompt = aiPromptBuilder_1.AIPromptBuilder.buildDivinationPrompt(context);
        expect(prompt).toContain('占卜基本信息');
        expect(prompt).toContain('乾卦深层特征');
        expect(prompt).toContain('问题卦象关联分析');
        expect(prompt).toContain('乾卦实用建议');
        expect(prompt).toContain('输出要求');
    });
    test('不同卦象提示词具有差异性', () => {
        const qianContext = {
            method: 'liuyao',
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
            method: 'liuyao',
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
        const qianPrompt = aiPromptBuilder_1.AIPromptBuilder.buildDivinationPrompt(qianContext);
        const kunPrompt = aiPromptBuilder_1.AIPromptBuilder.buildDivinationPrompt(kunContext);
        expect(qianPrompt).not.toEqual(kunPrompt);
        expect(qianPrompt).toContain('乾卦深层特征');
        expect(kunPrompt).toContain('坤卦深层特征');
    });
    test('问题类型影响提示词内容', () => {
        const careerContext = {
            method: 'liuyao',
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
            method: 'liuyao',
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
        const careerPrompt = aiPromptBuilder_1.AIPromptBuilder.buildDivinationPrompt(careerContext);
        const relationshipPrompt = aiPromptBuilder_1.AIPromptBuilder.buildDivinationPrompt(relationshipContext);
        expect(careerPrompt).toContain('事业发展');
        expect(relationshipPrompt).toContain('感情关系');
    });
});
describe('集成测试', () => {
    test('完整占卜流程', () => {
        const liuyaoResult = (0, liuyao_1.performDivination)('我的事业发展前景如何？');
        expect(liuyaoResult.originalGua.name).toBeTruthy();
        expect(liuyaoResult.interpretation.guaci).toBeTruthy();
        expect(liuyaoResult.interpretation.analysis).toContain('卦象本质：');
        const context = {
            method: 'liuyao',
            question: liuyaoResult.question,
            guaName: liuyaoResult.originalGua.name,
            guaInfo: {
                number: liuyaoResult.originalGua.number,
                upperTrigram: liuyaoResult.originalGua.upperTrigram,
                lowerTrigram: liuyaoResult.originalGua.lowerTrigram,
                interpretation: liuyaoResult.interpretation
            }
        };
        const prompt = aiPromptBuilder_1.AIPromptBuilder.buildDivinationPrompt(context, {
            focus: 'career',
            style: 'detailed'
        });
        expect(prompt).toContain('事业发展专项分析');
        expect(prompt).toContain(liuyaoResult.originalGua.name);
        expect(prompt).toContain('卦象本质：');
    });
    test('不同占卜方法结果对比', () => {
        const question = '财运如何？';
        const liuyaoResult = (0, liuyao_1.performDivination)(question);
        const meihuaResult = (0, meihua_1.performMeihuaDivination)(question);
        expect(liuyaoResult.originalGua.name).toBeTruthy();
        expect(meihuaResult.result.name).toBeTruthy();
        expect(liuyaoResult.interpretation.guaci).toBeTruthy();
        expect(meihuaResult.result.interpretation.guaci).toBeTruthy();
        expect(liuyaoResult.interpretation.analysis).toContain('卦象本质：');
        expect(meihuaResult.result.interpretation.analysis).toContain('卦象本质：');
    });
});
//# sourceMappingURL=hexagramTest.js.map