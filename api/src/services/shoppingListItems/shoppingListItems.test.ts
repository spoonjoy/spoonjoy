import type { ShoppingListItem } from '@prisma/client'

import {
  shoppingListItems,
  shoppingListItem,
  createShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
} from './shoppingListItems'
import type { StandardScenario } from './shoppingListItems.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('shoppingListItems', () => {
  scenario(
    'returns all shoppingListItems',
    async (scenario: StandardScenario) => {
      const result = await shoppingListItems()

      expect(result.length).toEqual(
        Object.keys(scenario.shoppingListItem).length
      )
    }
  )

  scenario(
    'returns a single shoppingListItem',
    async (scenario: StandardScenario) => {
      const result = await shoppingListItem({
        id: scenario.shoppingListItem.one.id,
      })

      expect(result).toEqual(scenario.shoppingListItem.one)
    }
  )

  scenario('updates a shoppingListItem', async (scenario: StandardScenario) => {
    const original = (await shoppingListItem({
      id: scenario.shoppingListItem.one.id,
    })) as ShoppingListItem
    const result = await updateShoppingListItem({
      id: original.id,
      input: { quantity: 8529529.203485327 },
    })

    expect(result.quantity).toEqual(8529529.203485327)
  })

  scenario('deletes a shoppingListItem', async (scenario: StandardScenario) => {
    const original = (await deleteShoppingListItem({
      id: scenario.shoppingListItem.one.id,
    })) as ShoppingListItem
    const result = await shoppingListItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
