import { gql } from "@apollo/client"

export const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $description: String
    $type: String
    $categoryId: String
    $startDate: Date
    $endDate: Date
    $page: Int
    $pageSize: Int
  ) {
    transactions(
      description: $description
      type: $type
      categoryId: $categoryId
      startDate: $startDate
      endDate: $endDate
      page: $page
      pageSize: $pageSize
    ) {
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
      totalCount
    }
  }
`
