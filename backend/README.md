# Backend - FTR Financy

Backend GraphQL API desenvolvido com TypeScript, Prisma e SQLite.

## Tecnologias

- **TypeScript** - Linguagem de programação
- **GraphQL** - API GraphQL com Apollo Server
- **Prisma** - ORM para gerenciamento de banco de dados
- **SQLite** - Banco de dados

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```
JWT_SECRET=seu-secret-key-aqui
DATABASE_URL="file:./dev.db"
```

### 3. Configurar banco de dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate
```

### 4. Iniciar servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

O servidor estará disponível em `http://localhost:4000`

## Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/           # Módulos da aplicação
│   │   ├── auth/          # Autenticação
│   │   ├── transactions/  # Transações
│   │   └── categories/    # Categorias
│   ├── shared/            # Código compartilhado
│   │   ├── database/      # Configuração Prisma
│   │   ├── graphql/       # Configuração GraphQL
│   │   └── utils/         # Utilitários
│   └── server.ts          # Servidor principal
├── prisma/
│   └── schema.prisma      # Schema do banco de dados
└── package.json
```

## Funcionalidades

### Autenticação
- `signUp` - Criar conta
- `signIn` - Fazer login
- `me` - Obter usuário atual

### Transações
- `createTransaction` - Criar transação
- `updateTransaction` - Editar transação
- `deleteTransaction` - Deletar transação
- `transactions` - Listar transações
- `transaction` - Obter transação por ID

### Categorias
- `createCategory` - Criar categoria
- `updateCategory` - Editar categoria
- `deleteCategory` - Deletar categoria
- `categories` - Listar categorias
- `category` - Obter categoria por ID

## Autenticação

Para acessar endpoints protegidos, inclua o token JWT no header:

```
Authorization: Bearer <token>
```

O token é retornado nas mutations `signUp` e `signIn`.
