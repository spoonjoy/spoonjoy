export const schema = gql`
  enum Provider {
    GOOGLE
  }

  type Query {
    getAuthUrl(provider: Provider!): String! @skipAuth
  }

  type Mutation {
    linkAccount(provider: Provider!, code: String!): String! @skipAuth
  }
`
