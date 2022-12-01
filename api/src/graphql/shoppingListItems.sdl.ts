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

  input CreateOrUpdateShoppingListItemInput {
    quantity: Float
    unitName: String
    ingredientName: String!
  }

  input AddItemToShoppingListInput {
    item: CreateOrUpdateShoppingListItemInput!
  }

  type Mutation {
    updateShoppingListItem(
      id: String!
      input: CreateOrUpdateShoppingListItemInput!
    ): ShoppingListItem! @requireAuth
    addItemToShoppingList(
      shoppingListId: String!
      input: AddItemToShoppingListInput!
    ): ShoppingList! @requireAuth
    deleteShoppingListItem(id: String!): ShoppingListItem! @requireAuth
  }
`
