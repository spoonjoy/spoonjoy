import { ingredientRefs, ingredientRef } from './ingredientRefs'
import type { StandardScenario } from './ingredientRefs.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('ingredientRefs', () => {
  scenario('returns all ingredientRefs', async (scenario: StandardScenario) => {
    const result = await ingredientRefs()

    expect(result.length).toEqual(Object.keys(scenario.ingredientRef).length)
  })

  scenario(
    'returns a single ingredientRef',
    async (scenario: StandardScenario) => {
      const result = await ingredientRef({ id: scenario.ingredientRef.one.id })

      expect(result).toEqual(scenario.ingredientRef.one)
    }
  )

  // scenario('creates a ingredientRef', async () => {
  //   const result = await createIngredientRef({
  //     input: { name: 'String414866' },
  //   })

  //   expect(result.name).toEqual('String414866')
  // })

  // scenario('updates a ingredientRef', async (scenario: StandardScenario) => {
  //   const original = (await ingredientRef({
  //     id: scenario.ingredientRef.one.id,
  //   })) as IngredientRef
  //   const result = await updateIngredientRef({
  //     id: original.id,
  //     input: { name: 'String16686532' },
  //   })

  //   expect(result.name).toEqual('String16686532')
  // })

  // scenario('deletes a ingredientRef', async (scenario: StandardScenario) => {
  //   const original = (await deleteIngredientRef({
  //     id: scenario.ingredientRef.one.id,
  //   })) as IngredientRef
  //   const result = await ingredientRef({ id: original.id })

  //   expect(result).toEqual(null)
  // })
})
