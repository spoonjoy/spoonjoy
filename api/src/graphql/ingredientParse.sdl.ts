export const schema = gql`
  """
  This should be the same as CreateIngredientInput
  """
  type IngredientInputType {
    quantity: Float!
    unitName: String!
    ingredientName: String!
  }
  type Query {
    parseIngredient(input: String!): IngredientInputType! @requireAuth
  }
`
