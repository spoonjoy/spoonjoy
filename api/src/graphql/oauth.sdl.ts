export const schema = gql`
  type OAuth {
    provider: Provider!
    userId: String!
    user: User!
  }

  enum Provider {
    GOOGLE
    APPLE
  }

  type Query {
    getAuthUrl(provider: Provider!): String! @skipAuth
  }

  type Mutation {
    linkAccount(provider: Provider!, code: String!): OAuth! @skipAuth
    unlinkAccount(provider: Provider!): OAuth! @requireAuth
  }
`
