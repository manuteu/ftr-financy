import { GraphQLContext } from '../../shared/graphql/context';

export const categoryResolvers = {
  Query: {
    categories: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      return context.prisma.category.findMany({
        where: { userId: context.userId },
        orderBy: { name: 'asc' },
      });
    },

    category: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const category = await context.prisma.category.findFirst({
        where: {
          id,
          userId: context.userId,
        },
      });

      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      return category;
    },
  },

  Mutation: {
    createCategory: async (
      _: any,
      args: { name: string; color?: string; icon?: string; description?: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      return context.prisma.category.create({
        data: {
          name: args.name,
          color: args.color,
          icon: args.icon,
          description: args.description,
          userId: context.userId,
        },
      });
    },

    updateCategory: async (
      _: any,
      args: { id: string; name?: string; color?: string; icon?: string; description?: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const existingCategory = await context.prisma.category.findFirst({
        where: {
          id: args.id,
          userId: context.userId,
        },
      });

      if (!existingCategory) {
        throw new Error('Categoria não encontrada');
      }

      return context.prisma.category.update({
        where: { id: args.id },
        data: {
          ...(args.name && { name: args.name }),
          ...(args.color !== undefined && { color: args.color }),
          ...(args.icon !== undefined && { icon: args.icon }),
          ...(args.description !== undefined && { description: args.description }),
        },
      });
    },

    deleteCategory: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Não autenticado');
      }

      const category = await context.prisma.category.findFirst({
        where: {
          id,
          userId: context.userId,
        },
      });

      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      const transactionCount = await context.prisma.transaction.count({
        where: { categoryId: id, userId: context.userId },
      });

      if (transactionCount > 0) {
        throw new Error(
          `Esta categoria possui ${transactionCount} transação(ões) vinculada(s). Remova ou altere a categoria das transações antes de excluir.`
        );
      }

      await context.prisma.category.delete({
        where: { id },
      });

      return true;
    },
  },
};
