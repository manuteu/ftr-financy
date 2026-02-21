import { GraphQLContext } from '../../shared/graphql/context';

export const transactionResolvers = {
  Query: {
    transactions: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      return context.prisma.transaction.findMany({
        where: { userId: context.userId },
        include: { category: true },
        orderBy: { date: 'desc' },
      });
    },

    transaction: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const transaction = await context.prisma.transaction.findFirst({
        where: {
          id,
          userId: context.userId,
        },
        include: { category: true },
      });

      if (!transaction) {
        throw new Error('Transação não encontrada');
      }

      return transaction;
    },
  },

  Mutation: {
    createTransaction: async (
      _: any,
      args: {
        description: string;
        amount: number;
        type: string;
        date: Date;
        categoryId?: string;
      },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      if (args.type !== 'income' && args.type !== 'expense') {
        throw new Error('Tipo deve ser "income" ou "expense"');
      }

      if (args.categoryId) {
        const category = await context.prisma.category.findFirst({
          where: {
            id: args.categoryId,
            userId: context.userId,
          },
        });

        if (!category) {
          throw new Error('Categoria não encontrada');
        }
      }

      return context.prisma.transaction.create({
        data: {
          description: args.description,
          amount: args.amount,
          type: args.type,
          date: args.date,
          userId: context.userId,
          categoryId: args.categoryId,
        },
        include: { category: true },
      });
    },

    updateTransaction: async (
      _: any,
      args: {
        id: string;
        description?: string;
        amount?: number;
        type?: string;
        date?: Date;
        categoryId?: string;
      },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const existingTransaction = await context.prisma.transaction.findFirst({
        where: {
          id: args.id,
          userId: context.userId,
        },
      });

      if (!existingTransaction) {
        throw new Error('Transação não encontrada');
      }

      if (args.type && args.type !== 'income' && args.type !== 'expense') {
        throw new Error('Tipo deve ser "income" ou "expense"');
      }

      if (args.categoryId) {
        const category = await context.prisma.category.findFirst({
          where: {
            id: args.categoryId,
            userId: context.userId,
          },
        });

        if (!category) {
          throw new Error('Categoria não encontrada');
        }
      }

      return context.prisma.transaction.update({
        where: { id: args.id },
        data: {
          ...(args.description && { description: args.description }),
          ...(args.amount !== undefined && { amount: args.amount }),
          ...(args.type && { type: args.type }),
          ...(args.date && { date: args.date }),
          ...(args.categoryId !== undefined && { categoryId: args.categoryId }),
        },
        include: { category: true },
      });
    },

    deleteTransaction: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const transaction = await context.prisma.transaction.findFirst({
        where: {
          id,
          userId: context.userId,
        },
      });

      if (!transaction) {
        throw new Error('Transação não encontrada');
      }

      await context.prisma.transaction.delete({
        where: { id },
      });

      return true;
    },
  },
};
