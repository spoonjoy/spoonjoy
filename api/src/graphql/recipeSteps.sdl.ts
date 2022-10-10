export const schema = gql`
  type RecipeStep {
    id: String!
    recipeId: String!
    recipe: Recipe!
    stepNum: Int!
    description: String
    ingredients: [Ingredient]!
  }

  type Query {
    recipeSteps: [RecipeStep!]! @requireAuth
    recipeStep(id: String!): RecipeStep @requireAuth
  }

  input CreateRecipeStepInput {
    stepNum: Int!
    description: String!
    ingredients: [CreateIngredientInput]!
  }

  """Use this for modifying existing recipes"""
  input UpdateRecipeStepInput {
    recipeId: String
    stepNum: Int
    description: String!
    ingredients: [UpdateIngredientInput]!
  }

  # type Mutation {
  #   createRecipeStep(input: CreateRecipeStepInput!): RecipeStep! @requireAuth
  #   updateRecipeStep(id: String!, input: UpdateRecipeStepInput!): RecipeStep!
  #     @requireAuth
  #   deleteRecipeStep(id: String!): RecipeStep! @requireAuth
  # }
`
