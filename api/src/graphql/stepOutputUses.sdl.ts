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
    outputOfStepId: String!
    inputOfStepId: String!
  }

  input UpdateStepOutputUseInput {
    outputOfStepId: String
    inputOfStepId: String
  }

  type Mutation {
    createStepOutputUse(input: CreateStepOutputUseInput!): StepOutputUse!
      @requireAuth
    updateStepOutputUse(
      id: String!
      input: UpdateStepOutputUseInput!
    ): StepOutputUse! @requireAuth
    deleteStepOutputUse(id: String!): StepOutputUse! @requireAuth
  }
`
