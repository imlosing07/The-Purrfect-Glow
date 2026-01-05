// user.repository.ts
import { UserPort } from './user.port';
import { User, UserProps } from './user.entity';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

const prisma = prismaClientGlobal;

export class UserRepository implements UserPort {
  async getUserById(id: string): Promise<User | undefined> {
    const userRecord = await prisma.user.findUnique({ where: { id } });
    return userRecord ? this.mapToEntity(userRecord) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const userRecord = await prisma.user.findFirst({ where: { email } });
    return userRecord ? this.mapToEntity(userRecord) : undefined;
  }

  async createUser(user: Omit<UserProps, 'id' | 'updatedAt' | 'createdAt' | 'emailVerified' | 'image'>): Promise<User> {
    const userRecord = await prisma.user.create({
      data: { ...user, createdAt: new Date(), updatedAt: new Date() },
    });
    return this.mapToEntity(userRecord);
  }

  private mapToEntity(record: any): User {
    return new User({
      id: record.id,
      name: record.name,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      emailVerified: record.emailVerified,
      image: record.image,
      role: record.role,
    });
  }
}