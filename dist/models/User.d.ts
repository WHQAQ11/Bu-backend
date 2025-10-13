import { User, CreateUserData } from '../types/user';
export declare class UserModel {
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: number): Promise<Omit<User, 'password_hash'> | null>;
    static create(userData: CreateUserData): Promise<Omit<User, 'password_hash'>>;
    static emailExists(email: string): Promise<boolean>;
    static update(id: number, updates: Partial<Pick<User, 'nickname' | 'bazi_info'>>): Promise<Omit<User, 'password_hash'> | null>;
    static delete(id: number): Promise<boolean>;
    static getUserStats(id: number): Promise<any>;
}
//# sourceMappingURL=User.d.ts.map