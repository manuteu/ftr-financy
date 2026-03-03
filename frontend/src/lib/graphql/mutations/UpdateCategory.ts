import { gql } from "@apollo/client"

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String, $color: String, $icon: String, $description: String) {
    updateCategory(id: $id, name: $name, color: $color, icon: $icon, description: $description) {
      id
      name
      color
      icon
      description
    }
  }
`
