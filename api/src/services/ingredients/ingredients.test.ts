import type { Ingredient } from '@prisma/client'

import {
  ingredients,
  ingredient,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from './ingredients'
import type { StandardScenario } from './ingredients.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('ingredients', () => {
  scenario('returns all ingredients', async (scenario: StandardScenario) => {
    const result = await ingredients()

    expect(result.length).toEqual(Object.keys(scenario.ingredient).length)
  })

  scenario(
    'returns a single ingredient',
    async (scenario: StandardScenario) => {
      const result = await ingredient({ id: scenario.ingredient.one.id })

      expect(result).toEqual(scenario.ingredient.one)
    }
  )

  scenario('creates a ingredient', async (scenario: StandardScenario) => {
    const result = await createIngredient({
      input: {
        recipeStepId: scenario.ingredient.two.recipeStepId,
        quantity: 7071778.975578646,
        unitId: scenario.ingredient.two.unitId,
        ingredeientRefId: scenario.ingredient.two.ingredeientRefId,
      },
    })

    expect(result.recipeStepId).toEqual(scenario.ingredient.two.recipeStepId)
    expect(result.quantity).toEqual(7071778.975578646)
    expect(result.unitId).toEqual(scenario.ingredient.two.unitId)
    expect(result.ingredeientRefId).toEqual(
      scenario.ingredient.two.ingredeientRefId
    )
  })

  scenario('updates a ingredient', async (scenario: StandardScenario) => {
    const original = (await ingredient({
      id: scenario.ingredient.one.id,
    })) as Ingredient
    const result = await updateIngredient({
      id: original.id,
      input: { quantity: 1584794.7929764474 },
    })

    expect(result.quantity).toEqual(1584794.7929764474)
  })

  scenario('deletes a ingredient', async (scenario: StandardScenario) => {
    const original = (await deleteIngredient({
      id: scenario.ingredient.one.id,
    })) as Ingredient
    const result = await ingredient({ id: original.id })

    expect(result).toEqual(null)
  })
})
