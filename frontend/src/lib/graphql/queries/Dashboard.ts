import { gql } from "@apollo/client"

export const GET_DASHBOARD = gql`
  query GetDashboard {
    transactions {
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
  }
`
