import { Request, Response } from 'express';
import { DivinationLogModel } from '../models/DivinationLog';
import { performDivination } from '../algorithms/liuyao';
import { performMeihuaDivination } from '../algorithms/meihua';
import { getZhipuAIService } from '../services/zhipuAI';
import {
  DivinationRequest,
  DivinationResponse,
  UserStatsResponse,
  DivinationLogListResponse
} from '../types/divination';
import { logger } from '../utils/logger';

export class DivinationController {
  // 执行占卜
  static async calculate(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    try {
      const userId = (req as any).user?.id; // 从JWT token中获取用户ID
      if (!userId) {
        const response: DivinationResponse = {
          success: false,
          message: '用户未登录'
        };
        logger.apiResponse('/api/divination/calculate', response, Date.now() - startTime);
        res.status(401).json(response);
        return;
      }

      const { method, question, input_data }: DivinationRequest = req.body;

      // 记录占卜请求
      logger.divinationRequest(question, method, userId);
      logger.debug('占卜请求', '接收到的请求数据', { method, question, input_data });

      // 输入验证
      if (!method || !question) {
        const response: DivinationResponse = {
          success: false,
          message: '占卜方法和问题为必填项'
        };
        res.status(400).json(response);
        return;
      }

      // 验证占卜方法
      const supportedMethods = ['liuyao', 'meihua', 'zhouyi'];
      if (!supportedMethods.includes(method)) {
        const response: DivinationResponse = {
          success: false,
          message: `不支持的占卜方法: ${method}`
        };
        res.status(400).json(response);
        return;
      }

      // 验证问题长度
      if (question.length < 5 || question.length > 500) {
        const response: DivinationResponse = {
          success: false,
          message: '问题长度应在5-500字符之间'
        };
        res.status(400).json(response);
        return;
      }

      // 执行占卜计算
      let result: any;
      switch (method) {
        case 'liuyao':
          result = performDivination(question);
          break;
        case 'meihua':
          result = performMeihuaDivination(question);
          break;
        case 'zhouyi':
          // TODO: 实现周易占卜算法
          result = { error: '周易占卜算法尚未实现' };
          break;
        default:
          result = { error: '未知占卜方法' };
      }

      if (result.error) {
        logger.error('占卜计算', `占卜计算失败: ${result.error}`, { method, question, result });
        const response: DivinationResponse = {
          success: false,
          message: result.error
        };
        logger.apiResponse('/api/divination/calculate', response, Date.now() - startTime);
        res.status(500).json(response);
        return;
      }

      // 记录占卜结果
      logger.divinationResult(result, userId);
      logger.debug('占卜结果', '占卜计算完成', {
        hexagramName: result.name,
        hexagramNumber: result.number,
        originalGua: result.originalGua,
        changedGua: result.changedGua,
        interpretation: result.interpretation
      });

      // 保存占卜记录到数据库
      const logData = {
        user_id: userId,
        method,
        question,
        input_data: input_data || {},
        raw_result: result,
        ai_interpretation: result.interpretation ? JSON.stringify(result.interpretation) : ''
      };

      const log = await DivinationLogModel.create(logData);

      // 返回占卜结果
      const response: DivinationResponse = {
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
      logger.apiResponse('/api/divination/calculate', response, Date.now() - startTime);
      res.status(201).json(response);

    } catch (error) {
      console.error('❌ 占卜计算失败:', error);
      const response: DivinationResponse = {
        success: false,
        message: '占卜失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }

  // 获取用户的占卜记录列表
  static async getUserLogs(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        const response: DivinationLogListResponse = {
          success: false,
          message: '用户未登录'
        };
        res.status(401).json(response);
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = Math.min(parseInt(req.query.pageSize as string) || 10, 50); // 限制最大50条

      // 获取用户的占卜记录
      const logs = await DivinationLogModel.findByUserId(userId);

      // 分页处理
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedLogs = logs.slice(startIndex, endIndex);

      const response: DivinationLogListResponse = {
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

    } catch (error) {
      console.error('❌ 获取占卜记录失败:', error);
      const response: DivinationLogListResponse = {
        success: false,
        message: '获取占卜记录失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }

  // 获取用户的占卜统计
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        const response: UserStatsResponse = {
          success: false,
          message: '用户未登录'
        };
        res.status(401).json(response);
        return;
      }

      const stats = await DivinationLogModel.getUserStats(userId);

      const response: UserStatsResponse = {
        success: true,
        message: '获取统计数据成功',
        data: stats
      };

      res.status(200).json(response);

    } catch (error) {
      console.error('❌ 获取占卜统计失败:', error);
      const response: UserStatsResponse = {
        success: false,
        message: '获取统计数据失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }

  // 获取单个占卜记录详情
  static async getLogById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        const response: DivinationResponse = {
          success: false,
          message: '用户未登录'
        };
        res.status(401).json(response);
        return;
      }

      const logId = parseInt(req.params.id || '');
      if (isNaN(logId)) {
        const response: DivinationResponse = {
          success: false,
          message: '无效的记录ID'
        };
        res.status(400).json(response);
        return;
      }

      const log = await DivinationLogModel.findById(logId);
      if (!log) {
        const response: DivinationResponse = {
          success: false,
          message: '占卜记录不存在'
        };
        res.status(404).json(response);
        return;
      }

      // 验证记录属于当前用户
      if (log.user_id !== userId) {
        const response: DivinationResponse = {
          success: false,
          message: '无权访问该记录'
        };
        res.status(403).json(response);
        return;
      }

      const response: DivinationResponse = {
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

    } catch (error) {
      console.error('❌ 获取占卜记录详情失败:', error);
      const response: DivinationResponse = {
        success: false,
        message: '获取记录失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }

  // 删除占卜记录
  static async deleteLog(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        const response: DivinationResponse = {
          success: false,
          message: '用户未登录'
        };
        res.status(401).json(response);
        return;
      }

      const logId = parseInt(req.params.id || '');
      if (isNaN(logId)) {
        const response: DivinationResponse = {
          success: false,
          message: '无效的记录ID'
        };
        res.status(400).json(response);
        return;
      }

      const log = await DivinationLogModel.findById(logId);
      if (!log) {
        const response: DivinationResponse = {
          success: false,
          message: '占卜记录不存在'
        };
        res.status(404).json(response);
        return;
      }

      // 验证记录属于当前用户
      if (log.user_id !== userId) {
        const response: DivinationResponse = {
          success: false,
          message: '无权删除该记录'
        };
        res.status(403).json(response);
        return;
      }

      const deleted = await DivinationLogModel.delete(logId);
      if (!deleted) {
        const response: DivinationResponse = {
          success: false,
          message: '删除失败，请稍后重试'
        };
        res.status(500).json(response);
        return;
      }

      const response: DivinationResponse = {
        success: true,
        message: '删除记录成功'
      };

      console.log(`✅ 用户${userId}删除占卜记录: ${logId}`);
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ 删除占卜记录失败:', error);
      const response: DivinationResponse = {
        success: false,
        message: '删除失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }

  // AI解卦接口
  static async interpret(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        const response: DivinationResponse = {
          success: false,
          message: '用户未登录'
        };
        logger.apiResponse('/api/divination/interpret', response, Date.now() - startTime);
        res.status(401).json(response);
        return;
      }

      const { log_id, style, focus, language } = req.body;

      logger.debug('AI解读请求', '用户请求AI解读', { userId, log_id, style, focus, language });

      // 输入验证
      if (!log_id) {
        const response: DivinationResponse = {
          success: false,
          message: '占卜记录ID为必填项'
        };
        res.status(400).json(response);
        return;
      }

      // 验证style参数
      const validStyles = ['traditional', 'modern', 'detailed', 'concise'];
      if (style && !validStyles.includes(style)) {
        const response: DivinationResponse = {
          success: false,
          message: `无效的解读风格: ${style}。支持的样式: ${validStyles.join(', ')}`
        };
        res.status(400).json(response);
        return;
      }

      // 验证focus参数
      const validFocuses = ['career', 'relationship', 'health', 'wealth', 'general'];
      if (focus && !validFocuses.includes(focus)) {
        const response: DivinationResponse = {
          success: false,
          message: `无效的关注领域: ${focus}。支持的领域: ${validFocuses.join(', ')}`
        };
        res.status(400).json(response);
        return;
      }

      // 验证language参数
      const validLanguages = ['chinese', 'bilingual'];
      if (language && !validLanguages.includes(language)) {
        const response: DivinationResponse = {
          success: false,
          message: `无效的语言设置: ${language}。支持的语言: ${validLanguages.join(', ')}`
        };
        res.status(400).json(response);
        return;
      }

      // 获取占卜记录
      const log = await DivinationLogModel.findById(parseInt(log_id));
      if (!log) {
        const response: DivinationResponse = {
          success: false,
          message: '占卜记录不存在'
        };
        res.status(404).json(response);
        return;
      }

      // 验证记录属于当前用户
      if (log.user_id !== userId) {
        const response: DivinationResponse = {
          success: false,
          message: '无权访问该记录'
        };
        res.status(403).json(response);
        return;
      }

      // 检查智谱AI服务是否可用
      try {
        const zhipuAIService = getZhipuAIService();
        const status = await zhipuAIService.getStatus();
        if (!status.available) {
          const response: DivinationResponse = {
            success: false,
            message: `智谱AI服务不可用: ${status.error || '未知错误'}`
          };
          res.status(503).json(response);
          return;
        }
      } catch (error) {
        const response: DivinationResponse = {
          success: false,
          message: '智谱AI服务未初始化或配置错误'
        };
        res.status(503).json(response);
        return;
      }

      // 提取占卜数据
      const divinationData = log.raw_result;
      if (!divinationData || !divinationData.result) {
        const response: DivinationResponse = {
          success: false,
          message: '占卜数据不完整，无法进行AI解读'
        };
        res.status(400).json(response);
        return;
      }

      const { method, question, result } = divinationData;

      logger.debug('AI解读', '开始调用智谱AI', {
        question,
        method,
        hexagramName: result.name,
        hexagramInfo: result,
        focus: focus || 'general'
      });

      // 调用智谱AI进行解读
      const zhipuAIService = getZhipuAIService();
      const aiResponse = await zhipuAIService.detailedInterpret(
        question,
        method,
        result.name,
        result,
        focus || 'general'
      );

      if (!aiResponse.success) {
        logger.error('AI解读', `AI解读失败: ${aiResponse.error}`, {
          question,
          method,
          hexagramName: result.name,
          error: aiResponse.error
        });
        const response: DivinationResponse = {
          success: false,
          message: `AI解读失败: ${aiResponse.error}`
        };
        logger.apiResponse('/api/divination/interpret', response, Date.now() - startTime);
        res.status(500).json(response);
        return;
      }

      logger.debug('AI解读', 'AI解读成功', {
        question,
        method,
        hexagramName: result.name,
        interpretationLength: aiResponse.interpretation?.length || 0,
        usage: aiResponse.usage
      });

      // 更新占卜记录的AI解读
      await DivinationLogModel.updateAIInterpretation(log.id, aiResponse.interpretation || '');

      // 返回AI解读结果
      const response: DivinationResponse = {
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
      logger.apiResponse('/api/divination/interpret', response, Date.now() - startTime);
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ AI解读失败:', error);
      const response: DivinationResponse = {
        success: false,
        message: 'AI解读失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }

  // 快速AI解卦接口
  static async quickInterpret(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        const response: DivinationResponse = {
          success: false,
          message: '用户未登录'
        };
        res.status(401).json(response);
        return;
      }

      const { method, question, hexagram_name, hexagram_info } = req.body;

      // 输入验证
      if (!method || !question || !hexagram_name || !hexagram_info) {
        const response: DivinationResponse = {
          success: false,
          message: '占卜方法、问题、卦象名称和卦象信息为必填项'
        };
        res.status(400).json(response);
        return;
      }

      // 检查智谱AI服务是否可用
      try {
        const zhipuAIService = getZhipuAIService();
        const status = await zhipuAIService.getStatus();
        if (!status.available) {
          const response: DivinationResponse = {
            success: false,
            message: `智谱AI服务不可用: ${status.error || '未知错误'}`
          };
          res.status(503).json(response);
          return;
        }
      } catch (error) {
        const response: DivinationResponse = {
          success: false,
          message: '智谱AI服务未初始化或配置错误'
        };
        res.status(503).json(response);
        return;
      }

      // 调用智谱AI进行快速解读
      const zhipuAIService = getZhipuAIService();
      const aiResponse = await zhipuAIService.quickInterpret(
        question,
        hexagram_name,
        hexagram_info
      );

      if (!aiResponse.success) {
        const response: DivinationResponse = {
          success: false,
          message: `AI解读失败: ${aiResponse.error}`
        };
        res.status(500).json(response);
        return;
      }

      // 返回快速AI解读结果
      const response: DivinationResponse = {
        success: true,
        message: '快速AI解读成功',
        data: {
          log_id: 0, // 快速解读没有记录ID
          method,
          question,
          result: {}, // 快速解读没有原始结果
          ai_interpretation: aiResponse.interpretation,
          timestamp: new Date()
        }
      };

      console.log(`✅ 用户${userId}完成快速AI解读: ${question}`);
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ 快速AI解读失败:', error);
      const response: DivinationResponse = {
        success: false,
        message: '快速AI解读失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }
}