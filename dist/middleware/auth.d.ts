import { Request, Response, NextFunction } from 'express';
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
export declare class AuthMiddleware {
    static authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static requireAuth: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=auth.d.ts.map