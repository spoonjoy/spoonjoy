import { ShoppingListItem, User } from 'types/graphql'

import {
  shoppingLists,
  shoppingList,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  ShoppingList,
} from './shoppingLists'
import type { StandardScenario } from './shoppingLists.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('shoppingLists', () => {
  beforeEach(() => {
    mockCurrentUser(null) // TODO this is actually allowed but redwood types need to be updated
  })
  scenario('returns all shoppingLists', async (scenario: StandardScenario) => {
    const result = await shoppingLists()
    expect(result.length).toEqual(Object.keys(scenario.shoppingList).length)
  })
  scenario(
    'returns a single shoppingList',
    async (scenario: StandardScenario) => {
      const { bobsList } = scenario.shoppingList

      const numOfSingleAssertions = 1 // Author check
      const numOfItems = bobsList.items.length
      const numAssertionsPerItem = 3 // Update based on below items.forEach

      expect.assertions(
        numAssertionsPerItem * numOfItems + numOfSingleAssertions
      ) // This will need to be updated if the scenario is updated

      const result = await shoppingList({
        id: bobsList.id,
      })

      await ShoppingList.author!({}, { root: result }).then((author: User) => {
        expect(author).toEqual(bobsList.author)
      })

      await ShoppingList.items!({}, { root: result }).then(
        (items: ShoppingListItem[]) => {
          items.forEach((returnedItem, itemIdx) => {
            const scenarioItem = bobsList.items[itemIdx]

            expect(returnedItem.quantity).toEqual(scenarioItem!.quantity)
            expect(returnedItem.ingredientRefId).toEqual(
              scenarioItem!.ingredientRefId
            )
            expect(returnedItem.unitId).toEqual(scenarioItem!.unitId)
          })
        }
      )
    }
  )
  // scenario('creates a shoppingList', async (scenario: StandardScenario) => {
  //   const result = await createShoppingList({
  //     input: { authorId: scenario.shoppingList.two.authorId },
  //   })
  //   expect(result.authorId).toEqual(scenario.shoppingList.two.authorId)
  // })
  // scenario('updates a shoppingList', async (scenario: StandardScenario) => {
  //   const original = (await shoppingList({
  //     id: scenario.shoppingList.bobsList.id,
  //   })) as ShoppingList
  //   const result = await updateShoppingList({
  //     id: original.id,
  //     input: { authorId: scenario.shoppingList.two.authorId },
  //   })
  //   expect(result.authorId).toEqual(scenario.shoppingList.two.authorId)
  // })
  // scenario('deletes a shoppingList', async (scenario: StandardScenario) => {
  //   const original = (await deleteShoppingList({
  //     id: scenario.shoppingList.bobsList.id,
  //   })) as ShoppingList
  //   const result = await shoppingList({ id: original.id })
  //   expect(result).toEqual(null)
  // })
})
