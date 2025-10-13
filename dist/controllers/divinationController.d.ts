import { Request, Response } from 'express';
export declare class DivinationController {
    static calculate(req: Request, res: Response): Promise<void>;
    static getUserLogs(req: Request, res: Response): Promise<void>;
    static getUserStats(req: Request, res: Response): Promise<void>;
    static getLogById(req: Request, res: Response): Promise<void>;
    static deleteLog(req: Request, res: Response): Promise<void>;
    static interpret(req: Request, res: Response): Promise<void>;
    static quickInterpret(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=divinationController.d.ts.map