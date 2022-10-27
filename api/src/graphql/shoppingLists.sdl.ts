export const schema = gql`
  type ShoppingList {
    id: ID!
    authorId: String!
    author: User!
    items: [ShoppingListItem]!
  }

  type Query {
    # shoppingLists: [ShoppingList!]! @requireAuth
    shoppingList(id: String!): ShoppingList @requireAuth
    myShoppingList: ShoppingList @requireAuth
  }

  input CreateShoppingListInput {
    items: [CreateShoppingListItemInput]!
  }

  input UpdateShoppingListInput {
    items: [UpdateShoppingListItemInput]!
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
