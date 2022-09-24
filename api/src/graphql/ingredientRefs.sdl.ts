export const schema = gql`
  type IngredientRef {
    id: String!
    name: String!
    ingredients: [Ingredient]!
  }

  type Query {
    ingredientRefs: [IngredientRef!]! @requireAuth
    ingredientRef(id: String!): IngredientRef @requireAuth
  }

  input CreateIngredientRefInput {
    name: String!
  }

  input UpdateIngredientRefInput {
    name: String
  }

  type Mutation {
    createIngredientRef(input: CreateIngredientRefInput!): IngredientRef!
      @requireAuth
    updateIngredientRef(
      id: String!
      input: UpdateIngredientRefInput!
    ): IngredientRef! @requireAuth
    deleteIngredientRef(id: String!): IngredientRef! @requireAuth
  }
`
