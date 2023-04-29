export const schema = gql`
  type RecipeStep {
    id: ID!
    recipeId: String!
    recipe: Recipe!
    stepNum: Int!
    stepTitle: String
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
    """
    TODO: This is not currently used by the resolver, but is rather here to support the form type. Need to figure out how to move this out of the SDL, which shouldn't know about this.
    """
    newIngRawInput: String
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
    """
    TODO: This is not currently used by the resolver, but is rather here to support the form type. Need to figure out how to move this out of the SDL, which shouldn't know about this.
    """
    newIngRawInput: String
  }

  # type Mutation {
  #   createRecipeStep(input: CreateRecipeStepInput!): RecipeStep! @requireAuth
  #   updateRecipeStep(id: String!, input: UpdateRecipeStepInput!): RecipeStep!
  #     @requireAuth
  #   deleteRecipeStep(id: String!): RecipeStep! @requireAuth
  # }
`
