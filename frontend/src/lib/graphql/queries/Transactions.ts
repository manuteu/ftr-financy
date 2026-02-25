import { gql } from "@apollo/client"

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
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
      }
    }
  }
`
