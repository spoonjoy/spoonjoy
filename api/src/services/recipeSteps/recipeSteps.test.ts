import type { RecipeStep } from '@prisma/client'

import {
  recipeSteps,
  recipeStep,
  createRecipeStep,
  updateRecipeStep,
  deleteRecipeStep,
} from './recipeSteps'
import type { StandardScenario } from './recipeSteps.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('recipeSteps', () => {
  scenario('returns all recipeSteps', async (scenario: StandardScenario) => {
    const result = await recipeSteps()

    expect(result.length).toEqual(Object.keys(scenario.recipeStep).length)
  })

  scenario(
    'returns a single recipeStep',
    async (scenario: StandardScenario) => {
      const result = await recipeStep({ id: scenario.recipeStep.one.id })

      expect(result).toEqual(scenario.recipeStep.one)
    }
  )

  scenario('creates a recipeStep', async (scenario: StandardScenario) => {
    const result = await createRecipeStep({
      input: { recipeId: scenario.recipeStep.two.recipeId, stepNum: 1407538 },
    })

    expect(result.recipeId).toEqual(scenario.recipeStep.two.recipeId)
    expect(result.stepNum).toEqual(1407538)
  })

  scenario('updates a recipeStep', async (scenario: StandardScenario) => {
    const original = (await recipeStep({
      id: scenario.recipeStep.one.id,
    })) as RecipeStep
    const result = await updateRecipeStep({
      id: original.id,
      input: { stepNum: 3093023 },
    })

    expect(result.stepNum).toEqual(3093023)
  })

  scenario('deletes a recipeStep', async (scenario: StandardScenario) => {
    const original = (await deleteRecipeStep({
      id: scenario.recipeStep.one.id,
    })) as RecipeStep
    const result = await recipeStep({ id: original.id })

    expect(result).toEqual(null)
  })
})
