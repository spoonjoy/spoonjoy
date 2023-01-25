import type { Cookbook } from '@prisma/client'

import {
  cookbooks,
  cookbook,
  createCookbook,
  updateCookbook,
  deleteCookbook,
} from './cookbooks'
import type { StandardScenario, userOnlyScenario } from './cookbooks.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('cookbooks', () => {
  beforeEach(() => {
    mockCurrentUser(null) // TODO this is actually allowed but redwood types need to be updated
  })

  scenario('returns all cookbooks', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.bob.id,
      username: scenario.user.bob.username,
    })

    const result = await cookbooks()

    expect(result.length).toEqual(Object.keys(scenario.cookbook).length)
  })

  scenario('returns a single cookbook', async (scenario: StandardScenario) => {
    const result = await cookbook({ id: scenario.cookbook.bobsBreakfast.id })

    expect(result).toEqual(scenario.cookbook.bobsBreakfast)
  })

  scenario('creates a cookbook', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.bob.id,
      username: scenario.user.bob.username,
    })
    const result = await createCookbook({
      input: {
        title: 'String',
        authorId: scenario.cookbook.bobsLunch.authorId,
      },
    })

    expect(result.title).toEqual('String')
    expect(result.authorId).toEqual(scenario.cookbook.bobsLunch.authorId)
  })

  scenario('updates a cookbook', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.bob.id,
      username: scenario.user.bob.username,
    })
    const original = (await cookbook({
      id: scenario.cookbook.bobsBreakfast.id,
    })) as Cookbook
    const result = await updateCookbook({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a cookbook', async (scenario: StandardScenario) => {
    mockCurrentUser({
      id: scenario.user.bob.id,
      username: scenario.user.bob.username,
    })
    const original = (await deleteCookbook({
      id: scenario.cookbook.bobsBreakfast.id,
    })) as Cookbook
    const result = await cookbook({ id: original.id })

    expect(result).toEqual(null)
  })
})
