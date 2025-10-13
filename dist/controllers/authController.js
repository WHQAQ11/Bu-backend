"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, nickname } = req.body;
            if (!email || !password) {
                const response = {
                    success: false,
                    message: '邮箱和密码为必填项'
                };
                res.status(400).json(response);
                return;
            }
            if (!auth_1.AuthUtils.isValidEmail(email)) {
                const response = {
                    success: false,
                    message: '邮箱格式不正确'
                };
                res.status(400).json(response);
                return;
            }
            const passwordValidation = auth_1.AuthUtils.validatePassword(password);
            if (!passwordValidation.isValid) {
                const response = {
                    success: false,
                    message: passwordValidation.message || '密码不符合要求'
                };
                res.status(400).json(response);
                return;
            }
            if (nickname && nickname.length > 50) {
                const response = {
                    success: false,
                    message: '昵称长度不能超过50个字符'
                };
                res.status(400).json(response);
                return;
            }
            const existingUser = await User_1.UserModel.findByEmail(email);
            if (existingUser) {
                const response = {
                    success: false,
                    message: '该邮箱已被注册'
                };
                res.status(409).json(response);
                return;
            }
            const passwordHash = await auth_1.AuthUtils.hashPassword(password);
            const createUserData = {
                email,
                password_hash: passwordHash,
                nickname: nickname || email.split('@')[0]
            };
            const newUser = await User_1.UserModel.create(createUserData);
            const token = auth_1.AuthUtils.generateToken({
                userId: newUser.id,
                email: newUser.email
            });
            const response = {
                success: true,
                message: '注册成功',
                user: newUser,
                token
            };
            console.log(`✅ 新用户注册成功: ${email}`);
            res.status(201).json(response);
        }
        catch (error) {
            console.error('❌ 用户注册失败:', error);
            const response = {
                success: false,
                message: '注册失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                const response = {
                    success: false,
                    message: '邮箱和密码为必填项'
                };
                res.status(400).json(response);
                return;
            }
            if (!auth_1.AuthUtils.isValidEmail(email)) {
                const response = {
                    success: false,
                    message: '邮箱格式不正确'
                };
                res.status(400).json(response);
                return;
            }
            const user = await User_1.UserModel.findByEmail(email);
            if (!user) {
                const response = {
                    success: false,
                    message: '邮箱或密码错误'
                };
                res.status(401).json(response);
                return;
            }
            const isPasswordValid = await auth_1.AuthUtils.comparePassword(password, user.password_hash);
            if (!isPasswordValid) {
                const response = {
                    success: false,
                    message: '邮箱或密码错误'
                };
                res.status(401).json(response);
                return;
            }
            const token = auth_1.AuthUtils.generateToken({
                userId: user.id,
                email: user.email
            });
            const { password_hash, ...userWithoutPassword } = user;
            const response = {
                success: true,
                message: '登录成功',
                user: userWithoutPassword,
                token
            };
            console.log(`✅ 用户登录成功: ${email}`);
            res.status(200).json(response);
        }
        catch (error) {
            console.error('❌ 用户登录失败:', error);
            const response = {
                success: false,
                message: '登录失败，请稍后重试'
            };
            res.status(500).json(response);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map