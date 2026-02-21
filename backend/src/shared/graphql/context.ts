import type { PrismaClient } from "@prisma/client";
import { verifyToken } from '../utils/jwt';

export interface GraphQLContext {
  prisma: PrismaClient;
  userId?: string;
}

export async function createContext(
  prisma: PrismaClient,
  token?: string
): Promise<GraphQLContext> {
  const context: GraphQLContext = { prisma };

  if (token) {
    try {
      const payload = verifyToken(token);
      context.userId = payload.userId;
    } catch (error) {
      // Token inválido ou expirado
    }
  }

  return context;
}
