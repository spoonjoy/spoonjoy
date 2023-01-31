import type { RecipeInCookbook } from '@prisma/client'

import {
  recipeInCookbooks,
  recipeInCookbook,
  createRecipeInCookbook,
  updateRecipeInCookbook,
  deleteRecipeInCookbook,
} from './recipeInCookbooks'
import type { StandardScenario } from './recipeInCookbooks.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('recipeInCookbooks', () => {
  scenario(
    'returns all recipeInCookbooks',
    async (scenario: StandardScenario) => {
      const result = await recipeInCookbooks()

      expect(result.length).toEqual(
        Object.keys(scenario.recipeInCookbook).length
      )
    }
  )

  scenario(
    'returns a single recipeInCookbook',
    async (scenario: StandardScenario) => {
      const result = await recipeInCookbook({
        id: scenario.recipeInCookbook.one.id,
      })

      expect(result).toEqual(scenario.recipeInCookbook.one)
    }
  )

  scenario('creates a recipeInCookbook', async (scenario: StandardScenario) => {
    const result = await createRecipeInCookbook({
      input: {
        cookbookId: scenario.recipeInCookbook.two.cookbookId,
        recipeId: scenario.recipeInCookbook.two.recipeId,
        addedById: scenario.recipeInCookbook.two.addedById,
      },
    })

    expect(result.cookbookId).toEqual(scenario.recipeInCookbook.two.cookbookId)
    expect(result.recipeId).toEqual(scenario.recipeInCookbook.two.recipeId)
    expect(result.addedById).toEqual(scenario.recipeInCookbook.two.addedById)
  })

  scenario('updates a recipeInCookbook', async (scenario: StandardScenario) => {
    const original = (await recipeInCookbook({
      id: scenario.recipeInCookbook.one.id,
    })) as RecipeInCookbook
    const result = await updateRecipeInCookbook({
      id: original.id,
      input: { cookbookId: scenario.recipeInCookbook.two.cookbookId },
    })

    expect(result.cookbookId).toEqual(scenario.recipeInCookbook.two.cookbookId)
  })

  scenario('deletes a recipeInCookbook', async (scenario: StandardScenario) => {
    const original = (await deleteRecipeInCookbook({
      id: scenario.recipeInCookbook.one.id,
    })) as RecipeInCookbook
    const result = await recipeInCookbook({ id: original.id })

    expect(result).toEqual(null)
  })
})
