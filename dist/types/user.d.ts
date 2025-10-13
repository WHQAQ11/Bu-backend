export interface User {
    id: number;
    email: string;
    password_hash: string;
    nickname?: string;
    bazi_info?: Record<string, any>;
    created_at: Date;
    updated_at?: Date;
}
export interface CreateUserRequest {
    email: string;
    password: string;
    nickname?: string;
}
export interface CreateUserData {
    email: string;
    password_hash: string;
    nickname?: string;
    bazi_info?: Record<string, any>;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    success: boolean;
    message: string;
    user?: Omit<User, 'password_hash'>;
    token?: string;
}
export interface JwtPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=user.d.ts.map