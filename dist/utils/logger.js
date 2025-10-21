"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor() {
        this.isEnabled = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
        this.minLevel = this.getLogLevel(process.env.LOG_LEVEL || 'info');
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    getLogLevel(level) {
        switch (level.toLowerCase()) {
            case 'debug': return LogLevel.DEBUG;
            case 'info': return LogLevel.INFO;
            case 'warn': return LogLevel.WARN;
            case 'error': return LogLevel.ERROR;
            default: return LogLevel.INFO;
        }
    }
    shouldLog(level) {
        return this.isEnabled && level >= this.minLevel;
    }
    formatMessage(entry) {
        const levelEmoji = {
            [LogLevel.DEBUG]: '🔍',
            [LogLevel.INFO]: '📝',
            [LogLevel.WARN]: '⚠️',
            [LogLevel.ERROR]: '❌',
        };
        const levelName = {
            [LogLevel.DEBUG]: 'DEBUG',
            [LogLevel.INFO]: 'INFO',
            [LogLevel.WARN]: 'WARN',
            [LogLevel.ERROR]: 'ERROR',
        };
        let message = `${levelEmoji[entry.level]} [${levelName[entry.level]}] [${entry.category}] ${entry.message}`;
        if (entry.data) {
            message += `\n${JSON.stringify(entry.data, null, 2)}`;
        }
        return message;
    }
    log(level, category, message, data) {
        if (!this.shouldLog(level)) {
            return;
        }
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data,
        };
        const formattedMessage = this.formatMessage(entry);
        switch (level) {
            case LogLevel.DEBUG:
            case LogLevel.INFO:
                console.log(formattedMessage);
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage);
                break;
            case LogLevel.ERROR:
                console.error(formattedMessage);
                break;
        }
    }
    debug(category, message, data) {
        this.log(LogLevel.DEBUG, category, message, data);
    }
    info(category, message, data) {
        this.log(LogLevel.INFO, category, message, data);
    }
    warn(category, message, data) {
        this.log(LogLevel.WARN, category, message, data);
    }
    error(category, message, data) {
        this.log(LogLevel.ERROR, category, message, data);
    }
    divinationRequest(question, method, userId) {
        this.info('占卜请求', `用户发起占卜`, {
            userId,
            method,
            question,
            timestamp: new Date().toISOString(),
        });
    }
    divinationResult(result, userId) {
        this.info('占卜结果', `占卜计算完成`, {
            userId,
            hexagramName: result.name,
            hexagramNumber: result.number,
            hasChangingLines: result.yaos?.some((y) => y.isChanging),
            timestamp: new Date().toISOString(),
        });
    }
    aiRequest(prompt, params) {
        this.debug('AI请求', `发送提示词到智谱AI`, {
            promptLength: prompt.length,
            promptPreview: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
            params,
        });
    }
    aiResponse(response, usage) {
        this.debug('AI响应', `收到智谱AI回复`, {
            responseLength: response?.interpretation?.length || 0,
            responsePreview: response?.interpretation?.substring(0, 150) + (response?.interpretation?.length > 150 ? '...' : ''),
            usage,
        });
    }
    promptConstruction(context, prompt) {
        this.debug('提示词构造', `生成AI提示词`, {
            method: context.method,
            question: context.question,
            hexagramName: context.guaName,
            hexagramNumber: context.guaInfo?.number,
            promptLength: prompt.length,
        });
    }
    hexagramData(hexagramData) {
        this.debug('卦象数据', `使用卦象数据库`, {
            name: hexagramData.name,
            number: hexagramData.number,
            symbolism: hexagramData.symbolism,
            elements: hexagramData.elements,
            analysisKeys: Object.keys(hexagramData.analysis || {}),
        });
    }
    apiResponse(apiPath, response, duration) {
        this.debug('API响应', `返回数据给前端`, {
            apiPath,
            success: response.success,
            dataType: response.data ? typeof response.data : 'undefined',
            responseSize: JSON.stringify(response).length,
            duration,
        });
    }
}
exports.Logger = Logger;
exports.logger = Logger.getInstance();
//# sourceMappingURL=logger.js.map