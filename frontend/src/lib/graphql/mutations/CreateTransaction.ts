import { gql } from "@apollo/client"

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $description: String!
    $amount: Float!
    $type: String!
    $date: Date!
    $categoryId: String
  ) {
    createTransaction(
      description: $description
      amount: $amount
      type: $type
      date: $date
      categoryId: $categoryId
    ) {
      id
      description
      amount
      type
      date
      category {
        id
        name
        color
        icon
        description
      }
    }
  }
`
