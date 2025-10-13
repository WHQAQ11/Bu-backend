import { JwtPayload } from '../types/user';
export declare class AuthUtils {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string;
    static verifyToken(token: string): JwtPayload;
    static extractTokenFromHeader(authHeader?: string): string | null;
    static isValidEmail(email: string): boolean;
    static validatePassword(password: string): {
        isValid: boolean;
        message?: string;
    };
}
//# sourceMappingURL=auth.d.ts.map