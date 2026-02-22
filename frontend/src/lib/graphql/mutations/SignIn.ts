import { gql } from "@apollo/client"

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`
