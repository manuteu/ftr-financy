/**
 * Extrai a mensagem de erro de respostas GraphQL.
 *
 * A API retorna erros no formato padrão GraphQL:
 * { "errors": [{ "message": "Credenciais inválidas", ... }], "data": null }
 *
 * O Apollo Client (v4 usa CombinedGraphQLErrors) encapsula isso em um objeto
 * com a propriedade `errors` contendo o array de erros.
 */
export function getGraphQLErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "errors" in error) {
    const errs = (error as { errors: Array<{ message?: string }> }).errors
    if (Array.isArray(errs) && errs[0]?.message) {
      return errs[0].message
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Ocorreu um erro inesperado. Tente novamente."
}
