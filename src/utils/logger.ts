// 调试日志工具类
// 用于记录详细的占卜和AI交互过程

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

export class Logger {
  private static instance: Logger;
  private isEnabled: boolean;
  private minLevel: LogLevel;

  private constructor() {
    // 从环境变量读取调试配置
    this.isEnabled = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
    this.minLevel = this.getLogLevel(process.env.LOG_LEVEL || 'info');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.isEnabled && level >= this.minLevel;
  }

  private formatMessage(entry: LogEntry): string {
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

  private log(level: LogLevel, category: string, message: string, data?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
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

  // 公共方法
  public debug(category: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  public info(category: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  public warn(category: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  public error(category: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, category, message, data);
  }

  // 专门的占卜日志方法
  public divinationRequest(question: string, method: string, userId?: number): void {
    this.info('占卜请求', `用户发起占卜`, {
      userId,
      method,
      question,
      timestamp: new Date().toISOString(),
    });
  }

  public divinationResult(result: any, userId?: number): void {
    this.info('占卜结果', `占卜计算完成`, {
      userId,
      hexagramName: result.name,
      hexagramNumber: result.number,
      hasChangingLines: result.yaos?.some((y: any) => y.isChanging),
      timestamp: new Date().toISOString(),
    });
  }

  public aiRequest(prompt: string, params?: any): void {
    this.debug('AI请求', `发送提示词到智谱AI`, {
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
      params,
    });
  }

  public aiResponse(response: any, usage?: any): void {
    this.debug('AI响应', `收到智谱AI回复`, {
      responseLength: response?.interpretation?.length || 0,
      responsePreview: response?.interpretation?.substring(0, 150) + (response?.interpretation?.length > 150 ? '...' : ''),
      usage,
    });
  }

  public promptConstruction(context: any, prompt: string): void {
    this.debug('提示词构造', `生成AI提示词`, {
      method: context.method,
      question: context.question,
      hexagramName: context.guaName,
      hexagramNumber: context.guaInfo?.number,
      promptLength: prompt.length,
    });
  }

  public hexagramData(hexagramData: any): void {
    this.debug('卦象数据', `使用卦象数据库`, {
      name: hexagramData.name,
      number: hexagramData.number,
      symbolism: hexagramData.symbolism,
      elements: hexagramData.elements,
      analysisKeys: Object.keys(hexagramData.analysis || {}),
    });
  }

  public apiResponse(apiPath: string, response: any, duration?: number): void {
    this.debug('API响应', `返回数据给前端`, {
      apiPath,
      success: response.success,
      dataType: response.data ? typeof response.data : 'undefined',
      responseSize: JSON.stringify(response).length,
      duration,
    });
  }
}

// 导出单例实例
export const logger = Logger.getInstance();