export const schema = gql`
  type Cookbook {
    id: String!
    authorId: String!
    author: User!
    recipes: [Recipe]!
  }

  type Query {
    cookbooks: [Cookbook!]! @requireAuth
    cookbook(id: String!): Cookbook @requireAuth
  }

  input CreateCookbookInput {
    authorId: String!
  }

  input UpdateCookbookInput {
    authorId: String
  }

  type Mutation {
    createCookbook(input: CreateCookbookInput!): Cookbook! @requireAuth
    updateCookbook(id: String!, input: UpdateCookbookInput!): Cookbook!
      @requireAuth
    deleteCookbook(id: String!): Cookbook! @requireAuth
  }
`
