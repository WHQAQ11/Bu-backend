export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    category: string;
    message: string;
    data?: any;
}
export declare class Logger {
    private static instance;
    private isEnabled;
    private minLevel;
    private constructor();
    static getInstance(): Logger;
    private getLogLevel;
    private shouldLog;
    private formatMessage;
    private log;
    debug(category: string, message: string, data?: any): void;
    info(category: string, message: string, data?: any): void;
    warn(category: string, message: string, data?: any): void;
    error(category: string, message: string, data?: any): void;
    divinationRequest(question: string, method: string, userId?: number): void;
    divinationResult(result: any, userId?: number): void;
    aiRequest(prompt: string, params?: any): void;
    aiResponse(response: any, usage?: any): void;
    promptConstruction(context: any, prompt: string): void;
    hexagramData(hexagramData: any): void;
    apiResponse(apiPath: string, response: any, duration?: number): void;
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map