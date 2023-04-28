export const schema = gql`
  type Ingredient {
    id: ID!
    recipeId: String!
    stepNum: Int!
    recipeStep: RecipeStep!
    quantity: Float!
    unitId: String!
    unit: Unit!
    ingredientRefId: String!
    ingredientRef: IngredientRef!
  }

  type Query {
    ingredients: [Ingredient] @requireAuth
    ingredient(
      recipeId: String!
      stepNum: Int!
      unitId: String!
      ingredientRefId: String!
    ): Ingredient @requireAuth
  }

  input CreateIngredientInput {
    quantity: Float!
    unitName: String!
    ingredientName: String!
    # """
    # This is not currently used by the resolver, which will eventually be updated to allow for this item to be used to create the ingredient so that the client doesn't need to parse it itself.
    # """
    # rawIngredientInput: String
  }

  input UpdateIngredientInput {
    # needed when updating the recipe step's ingredients as it's the only unique input (see Prisma.IngredientWhereUniqueInput)
    # however it's not required as updating a step sometimes involves adding new ingredients
    id: String
    quantity: Float!
    unitName: String!
    ingredientName: String!
    # """
    # This is not currently used by the resolver, which will eventually be updated to allow for this item to be used to update the ingredient so that the client doesn't need to parse it itself.
    # """
    # rawIngredientInput: String
  }

  # type Mutation {
  #   createIngredient(input: CreateIngredientInput!): Ingredient! @requireAuth
  #   updateIngredient(id: String!, input: UpdateIngredientInput!): Ingredient!
  #     @requireAuth
  #   deleteIngredient(id: String!): Ingredient! @requireAuth
  # }
`
