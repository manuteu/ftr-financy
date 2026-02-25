import { GraphQLContext } from '../../shared/graphql/context';

export const transactionResolvers = {
  Query: {
    transactions: async (
      _: any,
      args: {
        description?: string;
        type?: string;
        categoryId?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        pageSize?: number;
      },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const where: Record<string, any> = { userId: context.userId };

      if (args.description) {
        where.description = { contains: args.description };
      }
      if (args.type) {
        where.type = args.type;
      }
      if (args.categoryId) {
        where.categoryId = args.categoryId;
      }
      if (args.startDate && args.endDate) {
        where.date = { gte: args.startDate, lte: args.endDate };
      }

      const isPaginated = args.page !== undefined && args.page !== null;
      const page = args.page ?? 1;
      const pageSize = args.pageSize ?? 10;

      const [transactions, totalCount] = await Promise.all([
        context.prisma.transaction.findMany({
          where,
          include: { category: true },
          orderBy: { date: 'desc' },
          ...(isPaginated ? { skip: (page - 1) * pageSize, take: pageSize } : {}),
        }),
        context.prisma.transaction.count({ where }),
      ]);

      return { transactions, totalCount };
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
