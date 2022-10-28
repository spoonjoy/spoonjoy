export const schema = gql`
  type StepOutputUse {
    id: String!
    "The step who's output is being used"
    outputOfStep: RecipeStep!
    "The step who's doing the using"
    inputOfStep: RecipeStep!
  }

  type Query {
    stepOutputUses: [StepOutputUse!]! @requireAuth
    stepOutputUse(id: String!): StepOutputUse @requireAuth
  }

  input CreateStepOutputUseInput {
    "The step who's output is being used"
    outputOfStepNum: Int!
    "The step who's doing the using. Can be left out if creating steps output uses at the same time as the recipeSteps"
    inputOfStepNum: Int
  }

  input UpdateStepOutputUseInput {
    "The step who's output is being used"
    outputOfStepNum: Int!
    "The step who's doing the using. Can be left out if creating steps output uses at the same time as the recipeSteps"
    inputOfStepNum: Int
  }

  #   type Mutation {
  #     createStepOutputUse(input: CreateStepOutputUseInput!): StepOutputUse!
  #       @requireAuth
  #     updateStepOutputUse(
  #       id: String!
  #       input: UpdateStepOutputUseInput!
  #     ): StepOutputUse! @requireAuth
  #     deleteStepOutputUse(id: String!): StepOutputUse! @requireAuth
  #   }
  #
`
