import { gql } from "@apollo/client"

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction(
    $id: ID!
    $description: String
    $amount: Float
    $type: String
    $date: Date
    $categoryId: String
  ) {
    updateTransaction(
      id: $id
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
