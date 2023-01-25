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
    cookbook(id: String!): Cookbook @skipAuth
  }

  input CreateCookbookInput {
    title: String!
  }

  input UpdateCookbookInput {
    title: String!
  }

  type Mutation {
    createCookbook(input: CreateCookbookInput!): Cookbook! @requireAuth
    updateCookbook(id: String!, input: UpdateCookbookInput!): Cookbook!
      @requireAuth
    addToCookbook(id: String!, recipeId: String!): Cookbook! @requireAuth
    deleteCookbook(id: String!): Cookbook! @requireAuth
  }
`
