import { db } from '../../database/memory-database';
import { User, CreateUserRequest, CreateUserData } from '../types/user';

export class UserModel {
  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<User | null> {
    return await db.findByEmail(email);
  }

  // 根据 ID 查找用户
  static async findById(id: number): Promise<Omit<User, 'password_hash'> | null> {
    return await db.findById(id);
  }

  // 创建新用户
  static async create(userData: CreateUserData): Promise<Omit<User, 'password_hash'>> {
    return await db.createUser(userData);
  }

  // 检查邮箱是否已存在
  static async emailExists(email: string): Promise<boolean> {
    return await db.emailExists(email);
  }

  // 更新用户信息
  static async update(id: number, updates: Partial<Pick<User, 'nickname' | 'bazi_info'>>): Promise<Omit<User, 'password_hash'> | null> {
    return await db.updateUser(id, updates);
  }

  // 删除用户
  static async delete(id: number): Promise<boolean> {
    return await db.deleteUser(id);
  }
}