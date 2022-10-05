import { ShoppingList } from 'types/graphql'

const mockShoppingList1: RecursivePartial<ShoppingList> = {
  id: 'testShoppingListId',
  author: {
    id: 'testUserId',
    username: 'ari',
  },
  items: [
    {
      id: 'testIngId1',
      quantity: 1.5,
      unit: {
        name: 'cups',
      },
      ingredientRef: {
        name: 'chana dal',
      },
    },
    {
      id: 'testIngId2',
      quantity: 1,
      unit: {
        name: 'tsp',
      },
      ingredientRef: {
        name: 'baking soda',
      },
    },
  ],
}

export const standard = (/* vars, { ctx, req } */) => ({
  shoppingList: mockShoppingList1,
})
