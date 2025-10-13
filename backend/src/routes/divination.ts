import express from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { DivinationController } from '../controllers/divinationController';

const router = express.Router();

// 所有占卜接口都需要用户认证
router.use(AuthMiddleware.authenticate);

// POST /api/divination/calculate - 执行占卜计算
router.post('/calculate', DivinationController.calculate);

// GET /api/divination/logs - 获取用户的占卜记录列表
router.get('/logs', DivinationController.getUserLogs);

// GET /api/divination/stats - 获取用户的占卜统计
router.get('/stats', DivinationController.getUserStats);

// GET /api/divination/logs/:id - 获取单个占卜记录详情
router.get('/logs/:id', DivinationController.getLogById);

// DELETE /api/divination/logs/:id - 删除占卜记录
router.delete('/logs/:id', DivinationController.deleteLog);

// POST /api/divination/interpret - AI解卦接口（基于已有占卜记录）
router.post('/interpret', DivinationController.interpret);

// POST /api/divination/quick-interpret - 快速AI解卦接口（直接基于卦象信息）
router.post('/quick-interpret', DivinationController.quickInterpret);

module.exports = router;