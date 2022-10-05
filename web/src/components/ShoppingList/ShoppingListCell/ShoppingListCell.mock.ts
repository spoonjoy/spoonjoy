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
    {
      id: 'testIngId3',
      quantity: 0.5,
      unit: {
        name: 'tbsp',
      },
      ingredientRef: {
        name: 'salt',
      },
    },
    {
      id: 'testIngId4',
      quantity: 2,
      unit: {
        name: 'tsp',
      },
      ingredientRef: {
        name: 'granulated citric acid',
      },
    },
    {
      id: 'testIngId5',
      quantity: 3,
      unit: {
        name: 'cloves',
      },
      ingredientRef: {
        name: 'garlic',
      },
    },
    {
      id: 'testIngId6',
      quantity: 16,
      unit: {
        name: 'oz',
      },
      ingredientRef: {
        name: 'tahini',
      },
    },
    {
      id: 'testIngId7',
      quantity: 1,
      unit: {
        name: 'cup',
      },
      ingredientRef: {
        name: 'cold water',
      },
    },
  ],
}

export const standard = (/* vars, { ctx, req } */) => ({
  shoppingList: mockShoppingList1,
})
