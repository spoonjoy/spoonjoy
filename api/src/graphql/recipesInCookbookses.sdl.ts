export const schema = gql`
  type RecipesInCookbooks {
    id: String!
    cookbookId: String!
    cookbook: Cookbook!
    recipeId: String!
    recipe: Recipe!
    addedById: String!
    addedBy: User!
  }
`
