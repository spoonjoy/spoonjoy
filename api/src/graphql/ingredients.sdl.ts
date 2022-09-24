export const schema = gql`
  type Ingredient {
    id: String!
    recipeStepId: String!
    recipeStep: RecipeStep!
    quantity: Float!
    unitId: String!
    unit: Unit!
    ingredientRefId: String!
    ingredientRef: IngredientRef!
  }

  type Query {
    ingredients: [Ingredient!]! @requireAuth
    ingredient(id: String!): Ingredient @requireAuth
  }

  input CreateIngredientInput {
    quantity: Float!
    unitName: String!
    ingredientName: String!
  }

  input UpdateIngredientInput {
    recipeStepId: String
    quantity: Float
    unitId: String
    ingredientRefId: String
  }

  # type Mutation {
  #   createIngredient(input: CreateIngredientInput!): Ingredient! @requireAuth
  #   updateIngredient(id: String!, input: UpdateIngredientInput!): Ingredient!
  #     @requireAuth
  #   deleteIngredient(id: String!): Ingredient! @requireAuth
  # }
`
