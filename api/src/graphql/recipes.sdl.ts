export const schema = gql`
  type Recipe {
    id: ID!
    title: String!
    description: String
    servings: Int
    chef: User!
    createdAt: DateTime!
    deletedAt: DateTime
    steps: [RecipeStep!]!
    imageUrl: String
  }

  type Query {
    myRecipes: [Recipe!]! @requireAuth
    recipes: [Recipe!]! @requireAuth
    usersRecipes(username: String!): [Recipe!]! @skipAuth
    recipe(id: String!): Recipe @skipAuth
  }

  input CreateRecipeInput {
    title: String!
    description: String
    servings: Int
    steps: [CreateRecipeStepInput!]!
  }

  input UpdateRecipeInput {
    title: String!
    description: String
    servings: Int
    steps: [UpdateRecipeStepInput!]!
  }

  type Mutation {
    createRecipe(input: CreateRecipeInput!): Recipe! @requireAuth
    updateRecipe(id: String!, input: UpdateRecipeInput!): Recipe! @requireAuth
    deleteRecipe(id: String!): Recipe! @requireAuth
  }
`
