"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const auth_1 = require("../utils/auth");
const User_1 = require("../models/User");
class AuthMiddleware {
}
exports.AuthMiddleware = AuthMiddleware;
_a = AuthMiddleware;
AuthMiddleware.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = auth_1.AuthUtils.extractTokenFromHeader(authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: '缺少认证令牌'
            });
            return;
        }
        const decoded = auth_1.AuthUtils.verifyToken(token);
        const user = await User_1.UserModel.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: '用户不存在'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('❌ 认证失败:', error);
        let message = '认证失败';
        if (error instanceof Error) {
            if (error.message.includes('过期')) {
                message = 'Token 已过期，请重新登录';
            }
            else if (error.message.includes('无效')) {
                message = '无效的 Token';
            }
        }
        res.status(401).json({
            success: false,
            message
        });
    }
};
AuthMiddleware.optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = auth_1.AuthUtils.extractTokenFromHeader(authHeader);
        if (token) {
            const decoded = auth_1.AuthUtils.verifyToken(token);
            const user = await User_1.UserModel.findById(decoded.userId);
            if (user) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        console.warn('⚠️ 可选认证失败:', error);
        next();
    }
};
AuthMiddleware.requireAuth = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: '需要登录才能访问此资源'
        });
        return;
    }
    next();
};
//# sourceMappingURL=auth.js.map