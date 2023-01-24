import type { RecipesInCookbooks } from '@prisma/client'

import {
  recipesInCookbookses,
  recipesInCookbooks,
  createRecipesInCookbooks,
  updateRecipesInCookbooks,
  deleteRecipesInCookbooks,
} from './recipesInCookbookses'
import type { StandardScenario } from './recipesInCookbookses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('recipesInCookbookses', () => {
  scenario(
    'returns all recipesInCookbookses',
    async (scenario: StandardScenario) => {
      const result = await recipesInCookbookses()

      expect(result.length).toEqual(
        Object.keys(scenario.recipesInCookbooks).length
      )
    }
  )

  scenario(
    'returns a single recipesInCookbooks',
    async (scenario: StandardScenario) => {
      const result = await recipesInCookbooks({
        id: scenario.recipesInCookbooks.one.id,
      })

      expect(result).toEqual(scenario.recipesInCookbooks.one)
    }
  )

  scenario(
    'creates a recipesInCookbooks',
    async (scenario: StandardScenario) => {
      const result = await createRecipesInCookbooks({
        input: {
          cookbookId: scenario.recipesInCookbooks.two.cookbookId,
          recipeId: scenario.recipesInCookbooks.two.recipeId,
          addedById: scenario.recipesInCookbooks.two.addedById,
        },
      })

      expect(result.cookbookId).toEqual(
        scenario.recipesInCookbooks.two.cookbookId
      )
      expect(result.recipeId).toEqual(scenario.recipesInCookbooks.two.recipeId)
      expect(result.addedById).toEqual(
        scenario.recipesInCookbooks.two.addedById
      )
    }
  )

  scenario(
    'updates a recipesInCookbooks',
    async (scenario: StandardScenario) => {
      const original = (await recipesInCookbooks({
        id: scenario.recipesInCookbooks.one.id,
      })) as RecipesInCookbooks
      const result = await updateRecipesInCookbooks({
        id: original.id,
        input: { cookbookId: scenario.recipesInCookbooks.two.cookbookId },
      })

      expect(result.cookbookId).toEqual(
        scenario.recipesInCookbooks.two.cookbookId
      )
    }
  )

  scenario(
    'deletes a recipesInCookbooks',
    async (scenario: StandardScenario) => {
      const original = (await deleteRecipesInCookbooks({
        id: scenario.recipesInCookbooks.one.id,
      })) as RecipesInCookbooks
      const result = await recipesInCookbooks({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
