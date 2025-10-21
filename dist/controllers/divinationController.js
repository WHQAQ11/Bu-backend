"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivinationController = void 0;
const DivinationLog_1 = require("../models/DivinationLog");
const liuyao_1 = require("../algorithms/liuyao");
const meihua_1 = require("../algorithms/meihua");
const zhipuAI_1 = require("../services/zhipuAI");
const logger_1 = require("../utils/logger");
class DivinationController {
    static async calculate(req, res) {
        const startTime = Date.now();
        try {
            const userId = req.user?.id;
            if (!userId) {
                const response = {
                    success: false,
                    message: '用户未登录'
                };
                logger_1.logger.apiResponse('/api/divination/calculate', response, Date.now() - startTime);
                res.status(401).json(response);
                return;
            }
            const { method, question, input_data } = req.body;
            logger_1.logger.divinationRequest(question, method, userId);
            logger_1.logger.debug('占卜请求', '接收到的请求数据', { method, question, input_data });
            if (!method || !question) {
                const response = {
                    success: false,
                    message: '占卜方法和问题为必填项'
                };
                res.status(400).json(response);
                return;
            }
            const supportedMethods = ['liuyao', 'meihua', 'zhouyi'];
            if (!supportedMethods.includes(method)) {
                const response = {
                    success: false,
                    message: `不支持的占卜方法: ${method}`
                };
                res.status(400).json(response);
                return;
            }
            if (question.length < 5 || question.length > 500) {
                const response = {
                    success: false,
                    message: '问题长度应在5-500字符之间'
                };
                res.status(400).json(response);
                return;
            }
            let result;
            switch (method) {
                case 'liuyao':
                    result = (0, liuyao_1.performDivination)(question);
                    break;
                case 'meihua':
                    result = (0, meihua_1.performMeihuaDivination)(question);
                    break;
                case 'zhouyi':
                    result = { error: '周易占卜算法尚未实现' };
                    break;
                default:
                    result = { error: '未知占卜方法' };
            }
            if (result.error) {
                logger_1.logger.error('占卜计算', `占卜计算失败: ${result.error}`, { method, question, result });
                const response = {
                    success: false,
                    message: result.error
                };
                logger_1.logger.apiResponse('/api/divination/calculate', response, Date.now() - startTime);
                res.status(500).json(response);
                return;
            }
            logger_1.logger.divinationResult(result, userId);
            logger_1.logger.debug('占卜结果', '占卜计算完成', {
                hexagramName: result.name,
                hexagramNumber: result.number,
                originalGua: result.originalGua,
                changedGua: result.changedGua,
                interpretation: result.interpretation
            });
            const logData = {
                user_id: userId,
                method,
                question,
                input_data: input_data || {},
                raw_result: result,
                ai_interpretation: result.interpretation ? JSON.stringify(result.interpretation) : ''
            };
            const log = await DivinationLog_1.DivinationLogModel.create(logData);
            const response = {
                success: true,
                message: '占卜成功',
                data: {
                    log_id: log.id,
                    method,
                    question,
                    result,
                    ai_interpretation: result.interpretation ? JSON.stringify(result.interpretation) : undefined,
                    timestamp: log.created_at
                }
            };
            console.log(`✅ 用户${userId}完成${method}占卜: ${question}`);
            logger_1.logger.apiResponse('/api/divination/calculate', response, Date.now() - startTime);
            res.status(201).json(response);
        }
        catch (error) {
            console.error('❌ 占卜计算失败:', error);
            const response = {
                success: false,
                message: '占卜失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
    static async getUserLogs(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                const response = {
                    success: false,
                    message: '用户未登录'
                };
                res.status(401).json(response);
                return;
            }
            const page = parseInt(req.query.page) || 1;
            const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 50);
            const logs = await DivinationLog_1.DivinationLogModel.findByUserId(userId);
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedLogs = logs.slice(startIndex, endIndex);
            const response = {
                success: true,
                message: '获取占卜记录成功',
                data: {
                    logs: paginatedLogs,
                    total: logs.length,
                    page,
                    pageSize
                }
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ 获取占卜记录失败:', error);
            const response = {
                success: false,
                message: '获取占卜记录失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
    static async getUserStats(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                const response = {
                    success: false,
                    message: '用户未登录'
                };
                res.status(401).json(response);
                return;
            }
            const stats = await DivinationLog_1.DivinationLogModel.getUserStats(userId);
            const response = {
                success: true,
                message: '获取统计数据成功',
                data: stats
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ 获取占卜统计失败:', error);
            const response = {
                success: false,
                message: '获取统计数据失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
    static async getLogById(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                const response = {
                    success: false,
                    message: '用户未登录'
                };
                res.status(401).json(response);
                return;
            }
            const logId = parseInt(req.params.id || '');
            if (isNaN(logId)) {
                const response = {
                    success: false,
                    message: '无效的记录ID'
                };
                res.status(400).json(response);
                return;
            }
            const log = await DivinationLog_1.DivinationLogModel.findById(logId);
            if (!log) {
                const response = {
                    success: false,
                    message: '占卜记录不存在'
                };
                res.status(404).json(response);
                return;
            }
            if (log.user_id !== userId) {
                const response = {
                    success: false,
                    message: '无权访问该记录'
                };
                res.status(403).json(response);
                return;
            }
            const response = {
                success: true,
                message: '获取记录成功',
                data: {
                    log_id: log.id,
                    method: log.method,
                    question: log.question,
                    result: log.raw_result,
                    ai_interpretation: log.ai_interpretation,
                    timestamp: log.created_at
                }
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ 获取占卜记录详情失败:', error);
            const response = {
                success: false,
                message: '获取记录失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
    static async deleteLog(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                const response = {
                    success: false,
                    message: '用户未登录'
                };
                res.status(401).json(response);
                return;
            }
            const logId = parseInt(req.params.id || '');
            if (isNaN(logId)) {
                const response = {
                    success: false,
                    message: '无效的记录ID'
                };
                res.status(400).json(response);
                return;
            }
            const log = await DivinationLog_1.DivinationLogModel.findById(logId);
            if (!log) {
                const response = {
                    success: false,
                    message: '占卜记录不存在'
                };
                res.status(404).json(response);
                return;
            }
            if (log.user_id !== userId) {
                const response = {
                    success: false,
                    message: '无权删除该记录'
                };
                res.status(403).json(response);
                return;
            }
            const deleted = await DivinationLog_1.DivinationLogModel.delete(logId);
            if (!deleted) {
                const response = {
                    success: false,
                    message: '删除失败，请稍后重试'
                };
                res.status(500).json(response);
                return;
            }
            const response = {
                success: true,
                message: '删除记录成功'
            };
            console.log(`✅ 用户${userId}删除占卜记录: ${logId}`);
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ 删除占卜记录失败:', error);
            const response = {
                success: false,
                message: '删除失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
    static async interpret(req, res) {
        const startTime = Date.now();
        try {
            const userId = req.user?.id;
            if (!userId) {
                const response = {
                    success: false,
                    message: '用户未登录'
                };
                logger_1.logger.apiResponse('/api/divination/interpret', response, Date.now() - startTime);
                res.status(401).json(response);
                return;
            }
            const { log_id, style, focus, language } = req.body;
            logger_1.logger.debug('AI解读请求', '用户请求AI解读', { userId, log_id, style, focus, language });
            if (!log_id) {
                const response = {
                    success: false,
                    message: '占卜记录ID为必填项'
                };
                res.status(400).json(response);
                return;
            }
            const validStyles = ['traditional', 'modern', 'detailed', 'concise'];
            if (style && !validStyles.includes(style)) {
                const response = {
                    success: false,
                    message: `无效的解读风格: ${style}。支持的样式: ${validStyles.join(', ')}`
                };
                res.status(400).json(response);
                return;
            }
            const validFocuses = ['career', 'relationship', 'health', 'wealth', 'general'];
            if (focus && !validFocuses.includes(focus)) {
                const response = {
                    success: false,
                    message: `无效的关注领域: ${focus}。支持的领域: ${validFocuses.join(', ')}`
                };
                res.status(400).json(response);
                return;
            }
            const validLanguages = ['chinese', 'bilingual'];
            if (language && !validLanguages.includes(language)) {
                const response = {
                    success: false,
                    message: `无效的语言设置: ${language}。支持的语言: ${validLanguages.join(', ')}`
                };
                res.status(400).json(response);
                return;
            }
            const log = await DivinationLog_1.DivinationLogModel.findById(parseInt(log_id));
            if (!log) {
                const response = {
                    success: false,
                    message: '占卜记录不存在'
                };
                res.status(404).json(response);
                return;
            }
            if (log.user_id !== userId) {
                const response = {
                    success: false,
                    message: '无权访问该记录'
                };
                res.status(403).json(response);
                return;
            }
            try {
                const zhipuAIService = (0, zhipuAI_1.getZhipuAIService)();
                const status = await zhipuAIService.getStatus();
                if (!status.available) {
                    const response = {
                        success: false,
                        message: `智谱AI服务不可用: ${status.error || '未知错误'}`
                    };
                    res.status(503).json(response);
                    return;
                }
            }
            catch (error) {
                const response = {
                    success: false,
                    message: '智谱AI服务未初始化或配置错误'
                };
                res.status(503).json(response);
                return;
            }
            const divinationData = log.raw_result;
            if (!divinationData || !divinationData.result) {
                const response = {
                    success: false,
                    message: '占卜数据不完整，无法进行AI解读'
                };
                res.status(400).json(response);
                return;
            }
            const { method, question, result } = divinationData;
            logger_1.logger.debug('AI解读', '开始调用智谱AI', {
                question,
                method,
                hexagramName: result.name,
                hexagramInfo: result,
                focus: focus || 'general'
            });
            const zhipuAIService = (0, zhipuAI_1.getZhipuAIService)();
            const aiResponse = await zhipuAIService.detailedInterpret(question, method, result.name, result, focus || 'general');
            if (!aiResponse.success) {
                logger_1.logger.error('AI解读', `AI解读失败: ${aiResponse.error}`, {
                    question,
                    method,
                    hexagramName: result.name,
                    error: aiResponse.error
                });
                const response = {
                    success: false,
                    message: `AI解读失败: ${aiResponse.error}`
                };
                logger_1.logger.apiResponse('/api/divination/interpret', response, Date.now() - startTime);
                res.status(500).json(response);
                return;
            }
            logger_1.logger.debug('AI解读', 'AI解读成功', {
                question,
                method,
                hexagramName: result.name,
                interpretationLength: aiResponse.interpretation?.length || 0,
                usage: aiResponse.usage
            });
            await DivinationLog_1.DivinationLogModel.updateAIInterpretation(log.id, aiResponse.interpretation || '');
            const response = {
                success: true,
                message: 'AI解读成功',
                data: {
                    log_id: log.id,
                    method: log.method,
                    question: log.question,
                    result: log.raw_result,
                    ai_interpretation: aiResponse.interpretation,
                    timestamp: new Date()
                }
            };
            console.log(`✅ 用户${userId}完成AI解读: ${question}`);
            logger_1.logger.apiResponse('/api/divination/interpret', response, Date.now() - startTime);
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ AI解读失败:', error);
            const response = {
                success: false,
                message: 'AI解读失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
    static async quickInterpret(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                const response = {
                    success: false,
                    message: '用户未登录'
                };
                res.status(401).json(response);
                return;
            }
            const { method, question, hexagram_name, hexagram_info } = req.body;
            if (!method || !question || !hexagram_name || !hexagram_info) {
                const response = {
                    success: false,
                    message: '占卜方法、问题、卦象名称和卦象信息为必填项'
                };
                res.status(400).json(response);
                return;
            }
            try {
                const zhipuAIService = (0, zhipuAI_1.getZhipuAIService)();
                const status = await zhipuAIService.getStatus();
                if (!status.available) {
                    const response = {
                        success: false,
                        message: `智谱AI服务不可用: ${status.error || '未知错误'}`
                    };
                    res.status(503).json(response);
                    return;
                }
            }
            catch (error) {
                const response = {
                    success: false,
                    message: '智谱AI服务未初始化或配置错误'
                };
                res.status(503).json(response);
                return;
            }
            const zhipuAIService = (0, zhipuAI_1.getZhipuAIService)();
            const aiResponse = await zhipuAIService.quickInterpret(question, hexagram_name, hexagram_info);
            if (!aiResponse.success) {
                const response = {
                    success: false,
                    message: `AI解读失败: ${aiResponse.error}`
                };
                res.status(500).json(response);
                return;
            }
            const response = {
                success: true,
                message: '快速AI解读成功',
                data: {
                    log_id: 0,
                    method,
                    question,
                    result: {},
                    ai_interpretation: aiResponse.interpretation,
                    timestamp: new Date()
                }
            };
            console.log(`✅ 用户${userId}完成快速AI解读: ${question}`);
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ 快速AI解读失败:', error);
            const response = {
                success: false,
                message: '快速AI解读失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
}
exports.DivinationController = DivinationController;
//# sourceMappingURL=divinationController.js.map