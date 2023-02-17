export const schema = gql`
  type IngredientParse {
    quantity: Float
    unitName: String
    ingredientName: String
    rawJsonReturned: String!
  }

  type Query {
    parseIngredient(input: String!): IngredientParse @skipAuth
  }
`
