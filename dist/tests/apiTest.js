"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
describe('占卜系统API测试', () => {
    let authToken;
    let testUserId;
    beforeAll(async () => {
        const registerResponse = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            username: 'testuser_divination',
            email: 'test@example.com',
            password: 'testpassword123'
        });
        if (registerResponse.status === 201) {
            testUserId = registerResponse.body.data.user.id;
            const loginResponse = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/login')
                .send({
                username: 'testuser_divination',
                password: 'testpassword123'
            });
            if (loginResponse.status === 200) {
                authToken = loginResponse.body.data.token;
            }
        }
    });
    describe('占卜计算接口测试', () => {
        test('六爻占卜计算 - 基本功能', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'liuyao',
                question: '我的事业发展前景如何？'
            });
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('占卜成功');
            const data = response.body.data;
            expect(data).toHaveProperty('log_id');
            expect(data).toHaveProperty('method', 'liuyao');
            expect(data).toHaveProperty('question', '我的事业发展前景如何？');
            expect(data).toHaveProperty('result');
            expect(data).toHaveProperty('timestamp');
            const result = data.result;
            expect(result).toHaveProperty('originalGua');
            expect(result).toHaveProperty('interpretation');
            const originalGua = result.originalGua;
            expect(originalGua).toHaveProperty('name');
            expect(originalGua).toHaveProperty('number');
            expect(originalGua).toHaveProperty('upperTrigram');
            expect(originalGua).toHaveProperty('lowerTrigram');
            expect(originalGua).toHaveProperty('yaos');
            expect(originalGua).toHaveProperty('properties');
            expect(originalGua.yaos).toHaveLength(6);
            expect(originalGua.yaos.every((yao) => yao.value >= 6 && yao.value <= 9)).toBe(true);
            const interpretation = result.interpretation;
            expect(interpretation).toHaveProperty('guaci');
            expect(interpretation).toHaveProperty('yaoci');
            expect(interpretation).toHaveProperty('shiyi');
            expect(interpretation).toHaveProperty('analysis');
            expect(interpretation.analysis).toContain('卦象本质：');
            expect(interpretation.analysis).toContain('五行属性：');
            expect(interpretation.analysis).toContain('时空特征：');
            expect(interpretation.analysis).toContain('关系特征：');
        });
        test('梅花易数占卜计算', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'meihua',
                question: '我的感情状况如何？'
            });
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            const data = response.body.data;
            expect(data.method).toBe('meihua');
            expect(data.result).toHaveProperty('result');
            const meihuaResult = data.result.result;
            expect(meihuaResult).toHaveProperty('name');
            expect(meihuaResult).toHaveProperty('upperNumber');
            expect(meihuaResult).toHaveProperty('lowerNumber');
            expect(meihuaResult).toHaveProperty('method');
            expect(meihuaResult.interpretation.analysis).toContain('卦象本质：');
            expect(meihuaResult.interpretation.analysis).toContain('梅花易数心法：');
        });
        test('不同占卜方法结果差异性', async () => {
            const question = '财运发展前景如何？';
            const liuyaoResponse = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'liuyao',
                question
            });
            const meihuaResponse = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'meihua',
                question
            });
            expect(liuyaoResponse.status).toBe(201);
            expect(meihuaResponse.status).toBe(201);
            const liuyaoData = liuyaoResponse.body.data;
            const meihuaData = meihuaResponse.body.data;
            expect(liuyuaData.result.originalGua.name).toBeTruthy();
            expect(meihuaData.result.result.name).toBeTruthy();
            expect(liuyuaData.result.interpretation.analysis).toContain('卦象本质：');
            expect(meihuaData.result.result.interpretation.analysis).toContain('卦象本质：');
        });
        test('输入验证测试', async () => {
            let response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'liuyao'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('问题为必填项');
            response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'invalid_method',
                question: '测试问题'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('不支持的占卜方法');
            response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'liuyao',
                question: '太短'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('问题长度应在5-500字符之间');
        });
        test('未认证用户访问', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .send({
                method: 'liuyao',
                question: '测试问题'
            });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('用户未登录');
        });
    });
    describe('AI解读接口测试', () => {
        let testLogId;
        beforeAll(async () => {
            const divinationResponse = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'liuyao',
                question: '事业发展咨询测试'
            });
            if (divinationResponse.status === 201) {
                testLogId = divinationResponse.body.data.log_id;
            }
        });
        test('AI解读 - 基本功能', async () => {
            if (!testLogId) {
                console.warn('跳过AI解读测试：无法创建测试占卜记录');
                return;
            }
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/interpret')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                log_id: testLogId,
                style: 'detailed',
                focus: 'career',
                language: 'chinese'
            });
            expect([200, 503]).toContain(response.status);
            if (response.status === 200) {
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('AI解读成功');
                const data = response.body.data;
                expect(data).toHaveProperty('log_id', testLogId);
                expect(data).toHaveProperty('ai_interpretation');
                expect(data.ai_interpretation).toBeTruthy();
                expect(typeof data.ai_interpretation).toBe('string');
                expect(data.ai_interpretation.length).toBeGreaterThan(0);
            }
            else if (response.status === 503) {
                expect(response.body.success).toBe(false);
                expect(response.body.message).toContain('智谱AI服务不可用');
            }
        });
        test('AI解读 - 快速模式', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/quick-interpret')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                method: 'liuyao',
                question: '感情发展快速咨询',
                hexagram_name: '乾',
                hexagram_info: {
                    upperTrigram: '乾',
                    lowerTrigram: '乾',
                    changingYao: 3,
                    interpretation: {
                        guaci: '乾：元，亨，利，贞。'
                    }
                }
            });
            expect([200, 503]).toContain(response.status);
            if (response.status === 200) {
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('快速AI解读成功');
                expect(response.body.data).toHaveProperty('ai_interpretation');
                expect(response.body.data.ai_interpretation.length).toBeGreaterThan(0);
            }
        });
        test('AI解读参数验证', async () => {
            let response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/interpret')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                style: 'detailed'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('占卜记录ID为必填项');
            response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/interpret')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                log_id: testLogId || 1,
                style: 'invalid_style'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('无效的解读风格');
            response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/interpret')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                log_id: testLogId || 1,
                focus: 'invalid_focus'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('无效的关注领域');
        });
    });
    describe('占卜记录查询测试', () => {
        test('获取用户占卜记录列表', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/divination/logs')
                .set('Authorization', `Bearer ${authToken}`)
                .query({
                page: 1,
                pageSize: 10
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('获取占卜记录成功');
            const data = response.body.data;
            expect(data).toHaveProperty('logs');
            expect(data).toHaveProperty('total');
            expect(data).toHaveProperty('page', 1);
            expect(data).toHaveProperty('pageSize', 10);
            expect(Array.isArray(data.logs)).toBe(true);
            if (data.logs.length > 0) {
                const log = data.logs[0];
                expect(log).toHaveProperty('id');
                expect(log).toHaveProperty('method');
                expect(log).toHaveProperty('question');
                expect(log).toHaveProperty('raw_result');
                expect(log).toHaveProperty('created_at');
            }
        });
        test('分页功能测试', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/divination/logs')
                .set('Authorization', `Bearer ${authToken}`)
                .query({
                page: 2,
                pageSize: 5
            });
            expect(response.status).toBe(200);
            expect(response.body.data.page).toBe(2);
            expect(response.body.data.pageSize).toBe(5);
        });
        test('获取用户占卜统计', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/divination/stats')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('获取统计数据成功');
            const data = response.body.data;
            expect(data).toHaveProperty('total');
            expect(data).toHaveProperty('byMethod');
            expect(data).toHaveProperty('recentCount');
            expect(typeof data.total).toBe('number');
            expect(typeof data.recentCount).toBe('number');
            expect(typeof data.byMethod).toBe('object');
        });
    });
    describe('错误处理测试', () => {
        test('不存在的占卜记录', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/divination/logs/99999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('占卜记录不存在');
        });
        test('访问他人占卜记录', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/divination/logs/1')
                .set('Authorization', `Bearer ${authToken}`);
            expect([403, 404]).toContain(response.status);
            expect(response.body.success).toBe(false);
        });
        test('无效的token', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/divination/calculate')
                .set('Authorization', 'Bearer invalid_token')
                .send({
                method: 'liuyao',
                question: '测试问题'
            });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
describe('数据完整性验证', () => {
    test('占卜数据保存完整性', async () => {
        const loginResponse = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({
            username: 'testuser_divination',
            password: 'testpassword123'
        });
        if (loginResponse.status !== 200) {
            console.warn('跳过数据完整性测试：无法登录测试用户');
            return;
        }
        const token = loginResponse.body.data.token;
        const divinationResponse = await (0, supertest_1.default)(index_1.default)
            .post('/api/divination/calculate')
            .set('Authorization', `Bearer ${token}`)
            .send({
            method: 'liuyao',
            question: '数据完整性测试问题'
        });
        expect(divinationResponse.status).toBe(201);
        const logId = divinationResponse.body.data.log_id;
        const logResponse = await (0, supertest_1.default)(index_1.default)
            .get(`/api/divination/logs/${logId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(logResponse.status).toBe(200);
        expect(logResponse.body.success).toBe(true);
        const savedData = logResponse.body.data.raw_result;
        const originalData = divinationResponse.body.data.result;
        expect(savedData.originalGua.name).toBe(originalData.originalGua.name);
        expect(savedData.originalGua.number).toBe(originalData.originalGua.number);
        expect(savedData.interpretation.guaci).toBe(originalData.interpretation.guaci);
        expect(savedData.interpretation.analysis).toContain('卦象本质：');
    });
});
//# sourceMappingURL=apiTest.js.map