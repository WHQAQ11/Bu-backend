import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { UserModel } from '../models/User';
import { JwtPayload } from '../types/user';

// 扩展 Request 接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nickname?: string;
        bazi_info?: Record<string, any>;
      };
    }
  }
}

export class AuthMiddleware {
  // JWT 认证中间件
  static authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 从请求头中获取 token
      const authHeader = req.headers.authorization;
      const token = AuthUtils.extractTokenFromHeader(authHeader);

      if (!token) {
        res.status(401).json({
          success: false,
          message: '缺少认证令牌'
        });
        return;
      }

      // 验证 token
      const decoded = AuthUtils.verifyToken(token);

      // 从数据库中获取用户信息（确保用户仍然存在）
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }

      // 将用户信息添加到请求对象中
      req.user = user;

      next();
    } catch (error) {
      console.error('❌ 认证失败:', error);

      let message = '认证失败';
      if (error instanceof Error) {
        if (error.message.includes('过期')) {
          message = 'Token 已过期，请重新登录';
        } else if (error.message.includes('无效')) {
          message = '无效的 Token';
        }
      }

      res.status(401).json({
        success: false,
        message
      });
    }
  };

  // 可选认证中间件（不强制要求登录）
  static optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = AuthUtils.extractTokenFromHeader(authHeader);

      if (token) {
        // 如果有 token，则验证并添加用户信息
        const decoded = AuthUtils.verifyToken(token);
        const user = await UserModel.findById(decoded.userId);

        if (user) {
          req.user = user;
        }
      }

      next();
    } catch (error) {
      // 可选认证失败时不阻止请求继续，只记录日志
      console.warn('⚠️ 可选认证失败:', error);
      next();
    }
  };

  // 检查用户是否已登录的辅助函数
  static requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '需要登录才能访问此资源'
      });
      return;
    }
    next();
  };
}