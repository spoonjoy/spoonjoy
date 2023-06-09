export const schema = gql`
  type OAuth {
    userId: String!
    user: User!
  }

  enum Provider {
    GOOGLE
  }

  type Query {
    getAuthUrl(provider: Provider!): String! @skipAuth
  }

  type Mutation {
    linkAccount(provider: Provider!, code: String!): User! @skipAuth
  }
`
