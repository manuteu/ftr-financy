import { gql } from "@apollo/client"

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $color: String, $icon: String, $description: String) {
    createCategory(name: $name, color: $color, icon: $icon, description: $description) {
      id
      name
      color
      icon
      description
    }
  }
`
