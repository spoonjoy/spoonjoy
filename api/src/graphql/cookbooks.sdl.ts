export const schema = gql`
  type Cookbook {
    id: String!
    title: String
    authorId: String!
    author: User!
    recipes: [RecipesInCookbooks]!
  }

  type Query {
    cookbooks: [Cookbook!]! @requireAuth
    usersCookbooks(username: String!): [Cookbook!]! @skipAuth
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
