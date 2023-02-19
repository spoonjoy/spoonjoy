export const schema = gql`
  type RecipeID {
    recipeId: ID!
  }

  type CookbookID {
    cookbookId: ID!
  }

  type Query {
    importRecipeFromWebsite(url: String!): RecipeID @skipAuth
    importRecipesFromCrouton(fileUrl: String!): CookbookID @requireAuth
  }
`
