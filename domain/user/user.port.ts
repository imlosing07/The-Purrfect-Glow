// user.port.ts
import { User, UserProps } from './user.entity';

export interface UserPort {
  createUser(user: Omit<UserProps, 'id' | 'updatedAt' | 'createdAt' | 'emailVerified' | 'image'>): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
}
