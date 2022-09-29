export const schema = gql`
  type ShoppingListItem {
    id: String!
    shoppingListId: String!
    shoppingList: ShoppingList!
    quantity: Float!
    unitId: String!
    unit: Unit!
    ingredientRefId: String!
    ingredientRef: IngredientRef!
  }

  type Query {
    shoppingListItems: [ShoppingListItem!]! @requireAuth
    shoppingListItem(id: String!): ShoppingListItem @requireAuth
  }

  input CreateShoppingListItemInput {
    shoppingListId: String!
    quantity: Float!
    unitId: String!
    ingredientRefId: String!
  }

  input UpdateShoppingListItemInput {
    shoppingListId: String
    quantity: Float
    unitId: String
    ingredientRefId: String
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
