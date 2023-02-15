export const schema = gql`
  type RecipeImport {
    returned: String
  }

  type Query {
    importRecipe(url: String!): RecipeImport @skipAuth
  }
`
