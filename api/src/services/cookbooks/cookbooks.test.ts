import type { Cookbook } from '@prisma/client'

import {
  cookbooks,
  cookbook,
  createCookbook,
  updateCookbook,
  deleteCookbook,
} from './cookbooks'
import type { StandardScenario } from './cookbooks.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('cookbooks', () => {
  scenario('returns all cookbooks', async (scenario: StandardScenario) => {
    const result = await cookbooks()

    expect(result.length).toEqual(Object.keys(scenario.cookbook).length)
  })

  scenario('returns a single cookbook', async (scenario: StandardScenario) => {
    const result = await cookbook({ id: scenario.cookbook.one.id })

    expect(result).toEqual(scenario.cookbook.one)
  })

  scenario('creates a cookbook', async (scenario: StandardScenario) => {
    const result = await createCookbook({
      input: { authorId: scenario.cookbook.two.authorId },
    })

    expect(result.authorId).toEqual(scenario.cookbook.two.authorId)
  })

  scenario('updates a cookbook', async (scenario: StandardScenario) => {
    const original = (await cookbook({
      id: scenario.cookbook.one.id,
    })) as Cookbook
    const result = await updateCookbook({
      id: original.id,
      input: { authorId: scenario.cookbook.two.authorId },
    })

    expect(result.authorId).toEqual(scenario.cookbook.two.authorId)
  })

  scenario('deletes a cookbook', async (scenario: StandardScenario) => {
    const original = (await deleteCookbook({
      id: scenario.cookbook.one.id,
    })) as Cookbook
    const result = await cookbook({ id: original.id })

    expect(result).toEqual(null)
  })
})
