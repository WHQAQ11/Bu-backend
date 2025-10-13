import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { AuthUtils } from '../utils/auth';
import { CreateUserRequest, CreateUserData, AuthResponse } from '../types/user';

export class AuthController {
  // 用户注册
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, nickname }: CreateUserRequest = req.body;

      // 输入验证
      if (!email || !password) {
        const response: AuthResponse = {
          success: false,
          message: '邮箱和密码为必填项'
        };
        res.status(400).json(response);
        return;
      }

      // 验证邮箱格式
      if (!AuthUtils.isValidEmail(email)) {
        const response: AuthResponse = {
          success: false,
          message: '邮箱格式不正确'
        };
        res.status(400).json(response);
        return;
      }

      // 验证密码强度
      const passwordValidation = AuthUtils.validatePassword(password);
      if (!passwordValidation.isValid) {
        const response: AuthResponse = {
          success: false,
          message: passwordValidation.message || '密码不符合要求'
        };
        res.status(400).json(response);
        return;
      }

      // 验证昵称长度
      if (nickname && nickname.length > 50) {
        const response: AuthResponse = {
          success: false,
          message: '昵称长度不能超过50个字符'
        };
        res.status(400).json(response);
        return;
      }

      // 检查邮箱是否已存在
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        const response: AuthResponse = {
          success: false,
          message: '该邮箱已被注册'
        };
        res.status(409).json(response);
        return;
      }

      // 密码哈希加密
      const passwordHash = await AuthUtils.hashPassword(password);

      // 创建用户
      const createUserData: CreateUserData = {
        email,
        password_hash: passwordHash,
        nickname: nickname || email.split('@')[0] // 默认昵称为邮箱前缀
      };
      const newUser = await UserModel.create(createUserData);

      // 生成 JWT token
      const token = AuthUtils.generateToken({
        userId: newUser.id,
        email: newUser.email
      });

      const response: AuthResponse = {
        success: true,
        message: '注册成功',
        user: newUser,
        token
      };

      console.log(`✅ 新用户注册成功: ${email}`);
      res.status(201).json(response);

    } catch (error) {
      console.error('❌ 用户注册失败:', error);
      const response: AuthResponse = {
        success: false,
        message: '注册失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }

  // 用户登录
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // 输入验证
      if (!email || !password) {
        const response: AuthResponse = {
          success: false,
          message: '邮箱和密码为必填项'
        };
        res.status(400).json(response);
        return;
      }

      // 验证邮箱格式
      if (!AuthUtils.isValidEmail(email)) {
        const response: AuthResponse = {
          success: false,
          message: '邮箱格式不正确'
        };
        res.status(400).json(response);
        return;
      }

      // 查找用户
      const user = await UserModel.findByEmail(email);
      if (!user) {
        const response: AuthResponse = {
          success: false,
          message: '邮箱或密码错误'
        };
        res.status(401).json(response);
        return;
      }

      // 验证密码
      const isPasswordValid = await AuthUtils.comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        const response: AuthResponse = {
          success: false,
          message: '邮箱或密码错误'
        };
        res.status(401).json(response);
        return;
      }

      // 生成 JWT token
      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email
      });

      // 移除密码哈希
      const { password_hash, ...userWithoutPassword } = user;

      const response: AuthResponse = {
        success: true,
        message: '登录成功',
        user: userWithoutPassword,
        token
      };

      console.log(`✅ 用户登录成功: ${email}`);
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ 用户登录失败:', error);
      const response: AuthResponse = {
        success: false,
        message: '登录失败，请稍后重试'
      };
      res.status(500).json(response);
    }
  }
}