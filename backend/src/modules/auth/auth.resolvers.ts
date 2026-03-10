import { GraphQLContext } from '../../shared/graphql/context';
import { hashPassword, comparePassword } from '../../shared/utils/password';
import { generateToken } from '../../shared/utils/jwt';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const user = await context.prisma.user.findUnique({
        where: { id: context.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    },
  },

  Mutation: {
    signUp: async (
      _: unknown,
      { email, password, name }: { email: string; password: string; name: string },
      context: GraphQLContext
    ) => {
      const existingUser = await context.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      const hashedPassword = await hashPassword(password);

      const user = await context.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const token = generateToken({ userId: user.id, email: user.email });

      return {
        token,
        user,
      };
    },

    signIn: async (
      _: unknown,
      { email, password }: { email: string; password: string },
      context: GraphQLContext
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        throw new Error('Credenciais inválidas');
      }

      const token = generateToken({ userId: user.id, email: user.email });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },

    updateProfile: async (
      _: unknown,
      { name }: { name: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const user = await context.prisma.user.update({
        where: { id: context.userId },
        data: { name },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    },
  },
};
