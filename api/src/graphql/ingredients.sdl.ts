export const schema = gql`
  type Ingredient {
    id: String!
    recipeStepId: String!
    recipeStep: RecipeStep!
    quantity: Float!
    unitId: String!
    unit: Unit!
    ingredeientRefId: String!
    ingredientRef: IngredientRef!
  }

  type Query {
    ingredients: [Ingredient!]! @requireAuth
    ingredient(id: String!): Ingredient @requireAuth
  }

  input CreateIngredientInput {
    recipeStepId: String!
    quantity: Float!
    unitId: String!
    ingredeientRefId: String!
  }

  input UpdateIngredientInput {
    recipeStepId: String
    quantity: Float
    unitId: String
    ingredeientRefId: String
  }

  type Mutation {
    createIngredient(input: CreateIngredientInput!): Ingredient! @requireAuth
    updateIngredient(id: String!, input: UpdateIngredientInput!): Ingredient!
      @requireAuth
    deleteIngredient(id: String!): Ingredient! @requireAuth
  }
`
