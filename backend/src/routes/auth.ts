import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// 用户注册
router.post('/register', AuthController.register);

// 用户登录
router.post('/login', AuthController.login);

module.exports = router;