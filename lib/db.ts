// lib/db.ts
import { PrismaClient } from '@prisma/client';

// Augment the global scope with the PrismaClient instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = (): PrismaClient => {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient({ log: ['warn', 'error'] });
  }

  // Cast globalThis to a type that includes your custom prisma property
  const globalWithPrisma = globalThis as typeof globalThis & {
    prisma: PrismaClient | undefined;
  };

  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  return globalWithPrisma.prisma;
};

const prisma = prismaClientSingleton();

export default prisma;
