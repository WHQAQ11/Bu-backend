"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthUtils {
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcryptjs_1.default.hash(password, saltRounds);
    }
    static async comparePassword(password, hash) {
        return await bcryptjs_1.default.compare(password, hash);
    }
    static generateToken(payload) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET 环境变量未设置');
        }
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    }
    static verifyToken(token) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET 环境变量未设置');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error('Token 已过期');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error('无效的 Token');
            }
            else {
                throw new Error('Token 验证失败');
            }
        }
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader) {
            return null;
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        return parts[1] || null;
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static validatePassword(password) {
        if (password.length < 6) {
            return { isValid: false, message: '密码长度至少为6位' };
        }
        if (password.length > 50) {
            return { isValid: false, message: '密码长度不能超过50位' };
        }
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        if (!hasLetter || !hasNumber) {
            return { isValid: false, message: '密码必须包含字母和数字' };
        }
        return { isValid: true };
    }
}
exports.AuthUtils = AuthUtils;
//# sourceMappingURL=auth.js.map