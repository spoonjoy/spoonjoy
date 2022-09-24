export const schema = gql`
  type Unit {
    id: String!
    name: String!
    ingredients: [Ingredient]!
  }

  type Query {
    units: [Unit!]! @requireAuth
    unit(id: String!): Unit @requireAuth
  }

  input CreateUnitInput {
    name: String!
  }

  input UpdateUnitInput {
    name: String
  }

  # type Mutation {
  #   createUnit(input: CreateUnitInput!): Unit! @requireAuth
  #   updateUnit(id: String!, input: UpdateUnitInput!): Unit! @requireAuth
  #   deleteUnit(id: String!): Unit! @requireAuth
  # }
`
