export const schema = gql`
  type Query {
    parseIngredient(input: String!): CreateIngredientInput @requireAuth
  }
`
