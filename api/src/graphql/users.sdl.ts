export const schema = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: DateTime!
    recipes: [Recipe]!
    fellowChefs: [User]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
    usersFellowChefs(username: String!): [User]! @skipAuth
  }

  input CreateUserInput {
    email: String!
    username: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
  }

  input UpdateUserInput {
    email: String
    username: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    webAuthnChallenge: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
