import { CreateShoppingListInput, ShoppingListItem, User } from 'types/graphql'

import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { StandardScenario as UserScenario } from '../users/users.scenarios'

import {
  shoppingLists,
  shoppingList,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  ShoppingList,
} from './shoppingLists'
import {
  shoppingListIncludeAllRelations,
  StandardScenario as ShoppingListScenario,
} from './shoppingLists.scenarios'
import {
  IShoppingListResponse,
  mapShoppingListDbResponseToUpdateMutationInput,
} from './shoppingListUtilities'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('shoppingLists', () => {
  beforeEach(() => {
    mockCurrentUser(null) // TODO this is actually allowed but redwood types need to be updated
  })
  scenario(
    'returns all shoppingLists',
    async (scenario: ShoppingListScenario) => {
      const result = await shoppingLists()
      expect(result.length).toEqual(Object.keys(scenario.shoppingList).length)
    }
  )
  scenario(
    'returns a single shoppingList',
    async (scenario: ShoppingListScenario) => {
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

  const shoppingListMutationInput: { input: CreateShoppingListInput } = {
    input: {
      items: [
        {
          quantity: 500.2348,
          unitName: 'grams',
          ingredientName: 'yumminess',
        },
        {
          quantity: 2000.234,
          unitName: 'mlems',
          ingredientName: 'toast',
        },
        {
          quantity: 2384.29,
          unitName: 'grams',
          ingredientName: 'tastiness',
        },
        {
          quantity: 2384892.23938,
          unitName: 'oz',
          ingredientName: 'liquor',
        },
      ],
    },
  }

  scenario(
    'userOnlyScenario',
    'fails to create a shopping list while not logged in',
    async () => {
      expect.assertions(1)
      expect(() => {
        createShoppingList(shoppingListMutationInput)
      }).toThrow()
    }
  )

  scenario(
    'userOnlyScenario',
    "creates a shoppingList while logged in if user doesn't already have one",
    async (scenario: UserScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })

      // TODO update this with non-hardcoded number
      expect.assertions(11)

      const result = await createShoppingList(shoppingListMutationInput)
      const resultWithRelations = await db.shoppingList.findUnique({
        where: { id: result.id },
        include: shoppingListIncludeAllRelations,
      })

      const { input } = shoppingListMutationInput
      const { bob } = scenario.user

      expect(resultWithRelations).toBeTruthy()
      if (resultWithRelations) {
        const { author, items } = resultWithRelations
        expect(author.username).toEqual(bob.username)
        expect(items.length).toEqual(input.items.length)

        // Because items will come back in a random order, we're sorting them by quantity. Please note that for this to work, we need to use unique quantities.
        const sortedResultItems = items.sort((a, b) => {
          return a.quantity - b.quantity
        })
        const sortedInputItems = input.items.sort((a, b) => {
          return a!.quantity - b!.quantity
        })
        sortedResultItems.forEach((item, idx) => {
          expect(item.unit.name).toBe(sortedInputItems[idx]?.unitName)
          expect(item.ingredientRef.name).toBe(
            sortedInputItems[idx]?.ingredientName
          )
        })
      } else {
        fail('No recipe got returned!')
      }
    }
  )

  scenario(
    'fails to update a shopping list when not logged in',
    async (scenario: ShoppingListScenario) => {
      const original = await db.shoppingList.findUnique({
        where: { id: scenario.shoppingList.bobsList.id },
        include: shoppingListIncludeAllRelations,
      })
      const updated = mapShoppingListDbResponseToUpdateMutationInput(
        original as unknown as IShoppingListResponse
      )

      const updatedInput = {
        id: original!.id,
        input: updated.input,
      }

      expect.assertions(1)
      try {
        await updateShoppingList(updatedInput)
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
    }
  )

  // scenario('updates a shoppingList', async (scenario: ShoppingListScenario) => {
  //   const original = (await shoppingList({
  //     id: scenario.shoppingList.bobsList.id,
  //   })) as ShoppingList
  //   const result = await updateShoppingList({
  //     id: original.id,
  //     input: { authorId: scenario.shoppingList.two.authorId },
  //   })
  //   expect(result.authorId).toEqual(scenario.shoppingList.two.authorId)
  // })
  // scenario('deletes a shoppingList', async (scenario: ShoppingListScenario) => {
  //   const original = (await deleteShoppingList({
  //     id: scenario.shoppingList.bobsList.id,
  //   })) as ShoppingList
  //   const result = await shoppingList({ id: original.id })
  //   expect(result).toEqual(null)
  // })
})
