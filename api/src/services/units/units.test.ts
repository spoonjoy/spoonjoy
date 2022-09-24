import type { Unit } from '@prisma/client'

import { units, unit, createUnit, updateUnit, deleteUnit } from './units'
import type { StandardScenario } from './units.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('units', () => {
  scenario('returns all units', async (scenario: StandardScenario) => {
    const result = await units()

    expect(result.length).toEqual(Object.keys(scenario.unit).length)
  })

  scenario('returns a single unit', async (scenario: StandardScenario) => {
    const result = await unit({ id: scenario.unit.one.id })

    expect(result).toEqual(scenario.unit.one)
  })

  scenario('creates a unit', async () => {
    const result = await createUnit({
      input: { name: 'String6828018' },
    })

    expect(result.name).toEqual('String6828018')
  })

  scenario('updates a unit', async (scenario: StandardScenario) => {
    const original = (await unit({ id: scenario.unit.one.id })) as Unit
    const result = await updateUnit({
      id: original.id,
      input: { name: 'String77931342' },
    })

    expect(result.name).toEqual('String77931342')
  })

  scenario('deletes a unit', async (scenario: StandardScenario) => {
    const original = (await deleteUnit({ id: scenario.unit.one.id })) as Unit
    const result = await unit({ id: original.id })

    expect(result).toEqual(null)
  })
})
