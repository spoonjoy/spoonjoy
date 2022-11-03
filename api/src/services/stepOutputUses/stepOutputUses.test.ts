import { stepOutputUses, stepOutputUse } from './stepOutputUses'
import type { StandardScenario } from './stepOutputUses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('stepOutputUses', () => {
  scenario('returns all stepOutputUses', async (scenario: StandardScenario) => {
    const result = await stepOutputUses()

    expect(result.length).toEqual(Object.keys(scenario.stepOutputUse).length)
  })

  scenario(
    'returns a single stepOutputUse',
    async (scenario: StandardScenario) => {
      const result = await stepOutputUse({ id: scenario.stepOutputUse.one.id })

      expect(result).toEqual(scenario.stepOutputUse.one)
    }
  )

  // scenario('creates a stepOutputUse', async (scenario: StandardScenario) => {
  //   const result = await createStepOutputUse({
  //     input: {
  //       outputOfStepId: scenario.stepOutputUse.two.outputOfStep.id,
  //       inputOfStepId: scenario.stepOutputUse.two.inputOfStep.id,
  //     },
  //   })

  //   expect(result.outputOfStepId).toEqual(
  //     scenario.stepOutputUse.two.outputOfStep.id
  //   )
  //   expect(result.inputOfStepId).toEqual(
  //     scenario.stepOutputUse.two.inputOfStep.id
  //   )
  // })

  // scenario('updates a stepOutputUse', async (scenario: StandardScenario) => {
  //   const original = (await stepOutputUse({
  //     id: scenario.stepOutputUse.one.id,
  //   })) as StepOutputUse
  //   const result = await updateStepOutputUse({
  //     id: original.id,
  //     input: { outputOfStepId: scenario.stepOutputUse.two.outputOfStepId },
  //   })

  //   expect(result.outputOfStepId).toEqual(
  //     scenario.stepOutputUse.two.outputOfStepId
  //   )
  // })

  // scenario('deletes a stepOutputUse', async (scenario: StandardScenario) => {
  //   const original = (await deleteStepOutputUse({
  //     id: scenario.stepOutputUse.one.id,
  //   })) as StepOutputUse
  //   const result = await stepOutputUse({ id: original.id })

  //   expect(result).toEqual(null)
  // })
})
