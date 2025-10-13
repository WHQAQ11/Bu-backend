"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_connection_1 = require("./database/postgres-connection");
const zhipuAI_1 = require("./services/zhipuAI");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/divination', require('./routes/divination'));
app.use('/api/logs', require('./routes/logs'));
app.use('*', (req, res) => {
    res.status(404).json({
        error: '接口不存在',
        path: req.originalUrl
    });
});
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
    });
});
const startServer = async () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`🚀 后端服务启动成功，端口: ${PORT}`);
            console.log(`📖 环境: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API 地址: http://localhost:${PORT}/api`);
            console.log(`❤️  健康检查: http://localhost:${PORT}/health`);
        });
        initializeBackgroundServices();
    }
    catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
};
const initializeBackgroundServices = async () => {
    try {
        console.log('🤖 初始化智谱AI服务...');
        const zhipuAIConfig = (0, zhipuAI_1.getZhipuAIConfigFromEnv)();
        const zhipuAIService = (0, zhipuAI_1.initializeZhipuAI)(zhipuAIConfig);
        const zhipuValidation = zhipuAIService.validateConfig();
        if (zhipuValidation.valid) {
            console.log('✅ 智谱AI服务配置验证通过');
            zhipuAIService.getStatus().then(status => {
                if (status.available) {
                    console.log('✅ 智谱AI服务连接正常');
                }
                else {
                    console.warn('⚠️ 智谱AI服务连接异常:', status.error);
                    console.warn('💡 AI解读功能可能不可用，请检查API密钥配置');
                }
            }).catch(error => {
                console.warn('⚠️ 智谱AI服务测试失败:', error.message);
            });
        }
        else {
            console.warn('⚠️ 智谱AI服务配置验证失败:', zhipuValidation.error);
            console.warn('💡 AI解读功能将不可用，请设置 ZHIPUAI_API_KEY 环境变量');
        }
        const isConnected = await postgres_connection_1.db.testConnection();
        if (!isConnected) {
            console.warn('⚠️  PostgreSQL数据库连接失败，某些功能可能不可用');
            console.warn('💡 请确保Railway PostgreSQL服务已正确配置');
        }
        else {
            console.log('🗄️  PostgreSQL数据库状态: 已连接');
            postgres_connection_1.db.runMigrations().then(() => {
                console.log('✅ 数据库迁移完成');
                postgres_connection_1.db.getDatabaseInfo().then(info => {
                    if (info) {
                        console.log(`📊 数据库大小: ${info.databaseSize}`);
                        console.log(`📋 数据库表数量: ${info.tables.length}`);
                    }
                });
            }).catch(error => {
                console.warn('⚠️ 数据库迁移失败:', error.message);
            });
        }
        console.log(`🤖 智谱AI状态: ${zhipuValidation.valid ? '已配置' : '未配置'}`);
    }
    catch (error) {
        console.warn('⚠️ 后台服务初始化出现警告:', error);
        console.warn('💡 这不会影响核心服务运行');
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map