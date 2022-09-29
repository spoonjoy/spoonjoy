export const schema = gql`
  type ShoppingList {
    id: String!
    authorId: String!
    author: User!
  }

  type Query {
    shoppingLists: [ShoppingList!]! @requireAuth
    shoppingList(id: String!): ShoppingList @requireAuth
  }

  input CreateShoppingListInput {
    authorId: String!
  }

  input UpdateShoppingListInput {
    authorId: String
  }

  type Mutation {
    createShoppingList(input: CreateShoppingListInput!): ShoppingList!
      @requireAuth
    updateShoppingList(
      id: String!
      input: UpdateShoppingListInput!
    ): ShoppingList! @requireAuth
    deleteShoppingList(id: String!): ShoppingList! @requireAuth
  }
`
