"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const liuyao_1 = require("./liuyao");
console.log('=== 测试爻的生成 ===');
for (let i = 0; i < 10; i++) {
    const value = (0, liuyao_1.simulateCoinToss)();
    console.log(`第${i + 1}次摇卦: ${value} (${value === 6 ? '老阴' : value === 7 ? '少阳' : value === 8 ? '少阴' : '老阳'})`);
}
console.log('\n=== 测试完整占卜流程 ===');
const question = '我的事业发展会如何？';
const result = (0, liuyao_1.performDivination)(question);
console.log(`问题: ${result.question}`);
console.log(`本卦: ${result.originalGua.name}卦 (第${result.originalGua.number}卦)`);
console.log(`上卦: ${result.originalGua.upperTrigram}, 下卦: ${result.originalGua.lowerTrigram}`);
console.log(`五行属性: ${result.originalGua.properties.wuxing}`);
console.log(`八宫归属: ${result.originalGua.properties.bagua}`);
console.log(`乾坤属性: ${result.originalGua.properties.yuanyang}`);
console.log('\n六爻排列:');
result.originalGua.yaos.forEach((yao, index) => {
    const position = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][index];
    const nature = yao.yinYang === 'yin' ? '阴爻' : '阳爻';
    const type = yao.value === 6 ? '老阴' : yao.value === 7 ? '少阳' : yao.value === 8 ? '少阴' : '老阳';
    const changing = yao.isChanging ? ' (动爻)' : '';
    console.log(`${position}: ${yao.symbol} ${nature} ${type}${changing}`);
});
if (result.changedGua) {
    console.log(`\n变卦: ${result.changedGua.name}卦 (第${result.changedGua.number}卦)`);
    console.log(`上卦: ${result.changedGua.upperTrigram}, 下卦: ${result.changedGua.lowerTrigram}`);
}
console.log('\n卦辞:');
console.log(result.interpretation.guaci);
console.log('\n爻辞:');
result.interpretation.yaoci.forEach((yaoci, index) => {
    console.log(yaoci);
});
console.log('\n十翼:');
console.log(result.interpretation.shiyi);
console.log('\n综合分析:');
console.log(result.interpretation.analysis);
console.log('\n占卜时间:', result.timestamp.toLocaleString('zh-CN'));
//# sourceMappingURL=test-liuyao.js.map