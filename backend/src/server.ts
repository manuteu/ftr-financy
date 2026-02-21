import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import prisma from './shared/database/prisma';
import { createContext } from './shared/graphql/context';
import { DateScalar } from './shared/graphql/types';
import { authResolvers } from './modules/auth/auth.resolvers';
import { transactionResolvers } from './modules/transactions/transactions.resolvers';
import { categoryResolvers } from './modules/categories/categories.resolvers';

dotenv.config();

function loadTypeDefs() {
  const baseDir = join(process.cwd(), 'src');
  const authSchema = readFileSync(
    join(baseDir, 'modules/auth/auth.graphql'),
    'utf-8'
  );
  const transactionSchema = readFileSync(
    join(baseDir, 'modules/transactions/transactions.graphql'),
    'utf-8'
  );
  const categorySchema = readFileSync(
    join(baseDir, 'modules/categories/categories.graphql'),
    'utf-8'
  );

  return [
    'scalar Date',
    authSchema,
    transactionSchema,
    categorySchema,
  ].join('\n\n');
}

function mergeResolvers(...resolvers: any[]) {
  const merged: any = {};
  
  resolvers.forEach((resolver) => {
    Object.keys(resolver).forEach((key) => {
      if (!merged[key]) {
        merged[key] = {};
      }
      merged[key] = { ...merged[key], ...resolver[key] };
    });
  });
  
  return merged;
}

async function startServer() {
  const typeDefs = loadTypeDefs();

  const resolvers = mergeResolvers(
    { Date: DateScalar },
    authResolvers,
    transactionResolvers,
    categoryResolvers
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const authHeader = Array.isArray(req.headers.authorization)
        ? req.headers.authorization[0]
        : req.headers.authorization;
      const token = authHeader?.replace('Bearer ', '') ?? undefined;
      return createContext(prisma, token);
    },
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer().catch((error) => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});
