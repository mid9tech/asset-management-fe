import { gql } from "@apollo/client";

export const CREATE_CATEGORY_MUTATION = gql`
mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
  createCategory(createCategoryInput: $createCategoryInput) {
    id
    categoryCode
    categoryName
  }
}
`

export const GET_CATEGORY_QUERY = gql`
query GetCategories {
  getCategories {
      id
      categoryName
      categoryCode
  }
}
`







