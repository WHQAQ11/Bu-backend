import { Router } from 'express';

const router = Router();

// 获取用户占卜历史
router.get('/', (req, res) => {
  res.status(501).json({ message: '功能开发中' });
});

module.exports = router;