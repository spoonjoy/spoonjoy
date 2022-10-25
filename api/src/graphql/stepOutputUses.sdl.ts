export const schema = gql`
  type StepOutputUse {
    id: String!
    outputOfStepId: String!
    outputOfStep: RecipeStep!
    inputOfStepId: String!
    inputOfStep: RecipeStep!
  }

  type Query {
    stepOutputUses: [StepOutputUse!]! @requireAuth
    stepOutputUse(id: String!): StepOutputUse @requireAuth
  }

  input CreateStepOutputUseInput {
    "The step who's output is being used"
    outputOfStepNum: Int!
    "The step who's doing the using"
    inputOfStepNum: Int!
  }

  input UpdateStepOutputUseInput {
    "The step who's output is being used"
    outputOfStepNum: Int!
    "The step who's doing the using"
    inputOfStepNum: Int!
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
