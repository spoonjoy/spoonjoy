export const schema = gql`
  type RecipeStep {
    id: ID!
    recipeId: String!
    recipe: Recipe!
    stepNum: Int!
    stepTitle: String!
    description: String!
    ingredients: [Ingredient]!
    stepOutputUses: [StepOutputUse]!
  }

  type Query {
    recipeSteps: [RecipeStep!]! @requireAuth
    recipeStep(recipeId: String!, stepNum: Int!): RecipeStep @requireAuth
  }

  input CreateRecipeStepInput {
    stepNum: Int!
    stepTitle: String
    description: String!
    ingredients: [CreateIngredientInput!]
    stepOutputUses: [CreateStepOutputUseInput!]
  }

  """
  Use this for modifying existing recipes
  """
  input UpdateRecipeStepInput {
    recipeId: String!
    stepNum: Int!
    stepTitle: String
    description: String!
    ingredients: [UpdateIngredientInput!]
    stepOutputUses: [UpdateStepOutputUseInput!]
  }

  # type Mutation {
  #   createRecipeStep(input: CreateRecipeStepInput!): RecipeStep! @requireAuth
  #   updateRecipeStep(id: String!, input: UpdateRecipeStepInput!): RecipeStep!
  #     @requireAuth
  #   deleteRecipeStep(id: String!): RecipeStep! @requireAuth
  # }
`
