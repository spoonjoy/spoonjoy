export const schema = gql`
  type ShoppingListItem {
    id: ID!
    shoppingList: ShoppingList!
    quantity: Float
    unit: Unit
    ingredientRef: IngredientRef!
  }

  type Query {
    shoppingListItems: [ShoppingListItem!]! @requireAuth
    shoppingListItem(id: String!): ShoppingListItem @requireAuth
  }

  input CreateShoppingListItemInput {
    quantity: Float
    unitName: String
    ingredientName: String!
  }

  input UpdateShoppingListItemInput {
    quantity: Float
    unitName: String
    ingredientName: String!
  }

  type Mutation {
    createShoppingListItem(
      input: CreateShoppingListItemInput!
    ): ShoppingListItem! @requireAuth
    updateShoppingListItem(
      id: String!
      input: UpdateShoppingListItemInput!
    ): ShoppingListItem! @requireAuth
    deleteShoppingListItem(id: String!): ShoppingListItem! @requireAuth
  }
`
