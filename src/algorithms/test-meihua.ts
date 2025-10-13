// 梅花易数算法测试文件
import {
  performMeihuaDivination,
  meihuaNumberDivination,
  meihuaTimeDivination,
  meihuaWordDivination
} from './meihua';

console.log('=== 测试梅花易数算法 ===\n');

// 测试1: 随机数字起卦
console.log('1. 随机数字起卦测试:');
const randomResult = performMeihuaDivination('我的感情运势如何？');
console.log(`问题: ${randomResult.question}`);
console.log(`占卜方法: ${randomResult.method}`);
console.log(`卦象: ${randomResult.result.name}卦 (${randomResult.result.upperTrigram}上${randomResult.result.lowerTrigram}下)`);
console.log(`上卦数: ${randomResult.result.upperNumber}, 下卦数: ${randomResult.result.lowerNumber}`);
if (randomResult.result.changingYao) {
  console.log(`动爻: 第${randomResult.result.changingYao}爻`);
}
console.log(`起卦方式: ${randomResult.result.method}`);
console.log(`卦辞: ${randomResult.result.interpretation.guaci}`);
console.log(`分析: ${randomResult.result.interpretation.analysis}\n`);

// 测试2: 指定数字起卦
console.log('2. 指定数字起卦测试 (3, 7, 5):');
const numberResult = meihuaNumberDivination([3, 7, 5]);
console.log(`卦象: ${numberResult.name}卦 (${numberResult.upperTrigram}上${numberResult.lowerTrigram}下)`);
console.log(`上卦数: ${numberResult.upperNumber}, 下卦数: ${numberResult.lowerNumber}`);
console.log(`动爻: 第${numberResult.changingYao}爻`);
console.log(`起卦方式: ${numberResult.method}`);
console.log(`源信息: ${JSON.stringify(numberResult.sourceInfo)}`);
console.log(`分析: ${numberResult.interpretation.analysis}\n`);

// 测试3: 时间起卦
console.log('3. 时间起卦测试 (2024年10月12日17时):');
const timeResult = meihuaTimeDivination(2024, 10, 12, 17);
console.log(`卦象: ${timeResult.name}卦 (${timeResult.upperTrigram}上${timeResult.lowerTrigram}下)`);
console.log(`上卦数: ${timeResult.upperNumber}, 下卦数: ${timeResult.lowerNumber}`);
console.log(`动爻: 第${timeResult.changingYao}爻`);
console.log(`起卦方式: ${timeResult.method}`);
console.log(`源信息: ${JSON.stringify(timeResult.sourceInfo)}`);
console.log(`分析: ${timeResult.interpretation.analysis}\n`);

// 测试4: 字数起卦
console.log('4. 字数起卦测试 ("梅花易数"):');
const wordResult = meihuaWordDivination('梅花易数');
console.log(`卦象: ${wordResult.name}卦 (${wordResult.upperTrigram}上${wordResult.lowerTrigram}下)`);
console.log(`上卦数: ${wordResult.upperNumber}, 下卦数: ${wordResult.lowerNumber}`);
if (wordResult.changingYao) {
  console.log(`动爻: 第${wordResult.changingYao}爻`);
}
console.log(`起卦方式: ${wordResult.method}`);
console.log(`源信息: ${JSON.stringify(wordResult.sourceInfo)}`);
console.log(`分析: ${wordResult.interpretation.analysis}\n`);

// 测试5: 单字起卦
console.log('5. 单字起卦测试 ("福"):');
const singleWordResult = meihuaWordDivination('福');
console.log(`卦象: ${singleWordResult.name}卦 (${singleWordResult.upperTrigram}上${singleWordResult.lowerTrigram}下)`);
console.log(`上卦数: ${singleWordResult.upperNumber}, 下卦数: ${singleWordResult.lowerNumber}`);
console.log(`起卦方式: ${singleWordResult.method}`);
console.log(`源信息: ${JSON.stringify(singleWordResult.sourceInfo)}`);
console.log(`分析: ${singleWordResult.interpretation.analysis}\n`);

console.log('=== 梅花易数算法测试完成 ===');