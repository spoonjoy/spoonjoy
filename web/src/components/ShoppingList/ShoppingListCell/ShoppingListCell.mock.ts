import { ShoppingList } from 'types/graphql'

const mockShoppingList1: RecursivePartial<ShoppingList> = {
  id: 'testShoppingListId',
  author: {
    id: 'testUserId',
    username: 'ari',
  },
  items: [
    {
      id: 'testItemId1',
      quantity: 1.5,
      unit: {
        name: 'cups',
      },
      ingredientRef: {
        name: 'chana dal',
      },
    },
    {
      id: 'testItemId2',
      quantity: 1,
      unit: {
        name: 'tsp',
      },
      ingredientRef: {
        name: 'baking soda',
      },
    },
    {
      id: 'testItemId3',
      quantity: 0.5,
      unit: {
        name: 'tbsp',
      },
      ingredientRef: {
        name: 'salt',
      },
    },
    {
      id: 'testItemId4',
      quantity: 2,
      unit: {
        name: 'tsp',
      },
      ingredientRef: {
        name: 'granulated citric acid',
      },
    },
    {
      id: 'testItemId5',
      quantity: 3,
      unit: {
        name: 'cloves',
      },
      ingredientRef: {
        name: 'garlic',
      },
    },
    {
      id: 'testItemId6',
      quantity: 16,
      unit: {
        name: 'oz',
      },
      ingredientRef: {
        name: 'tahini',
      },
    },
    {
      id: 'testItemId7',
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
