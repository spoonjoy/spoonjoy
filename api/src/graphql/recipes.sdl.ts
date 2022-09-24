export const schema = gql`
  type Recipe {
    id: String!
    title: String!
    description: String
    servings: Int
    chef: User!
    createdAt: DateTime!
    deletedAt: DateTime
    steps: [RecipeStep]!
  }

  type Query {
    recipes: [Recipe!]! @requireAuth
    recipe(id: String!): Recipe @requireAuth
  }

  input CreateRecipeInput {
    title: String!
    description: String
    servings: Int
    chefId: String!
    deletedAt: DateTime
  }

  input UpdateRecipeInput {
    title: String
    description: String
    servings: Int
    chefId: String
    deletedAt: DateTime
  }

  type Mutation {
    createRecipe(input: CreateRecipeInput!): Recipe! @requireAuth
    updateRecipe(id: String!, input: UpdateRecipeInput!): Recipe! @requireAuth
    deleteRecipe(id: String!): Recipe! @requireAuth
  }
`
