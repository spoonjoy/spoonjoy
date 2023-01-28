import type { Cookbook } from '@prisma/client'

import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

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

  scenario(
    'returns all cookbooks when logged in',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })

      const result = await cookbooks()

      expect(result.length).toEqual(Object.keys(scenario.cookbook).length)
    }
  )

  scenario('fails to return all cookbooks when not logged in', async () => {
    try {
      await cookbooks()
    } catch (e) {
      expect(e).toMatchObject(new RedwoodGraphQLError('You are not logged in!'))
    }
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
      },
    })

    expect(result.title).toEqual('String')
    expect(result.authorId).toEqual(scenario.user.bob.id)
  })

  scenario(
    'updates a users own cookbook while logged in',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })
      const original = (await cookbook({
        id: scenario.cookbook.bobsBreakfast.id,
      })) as Cookbook
      expect(original.title).toEqual(scenario.cookbook.bobsBreakfast.title)
      const result = await updateCookbook({
        id: original.id,
        input: { title: 'String2' },
      })

      expect(result.title).toEqual('String2')
    }
  )

  scenario(
    'fails to update another users cookbook while logged in',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.linda.id,
        username: scenario.user.linda.username,
      })
      const original = (await cookbook({
        id: scenario.cookbook.bobsBreakfast.id,
      })) as Cookbook
      expect(original.title).toEqual(scenario.cookbook.bobsBreakfast.title)
      try {
        await updateCookbook({
          id: original.id,
          input: { title: 'String2' },
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You can only modify your own cookbooks!')
        )
      }
    }
  )

  scenario(
    'fails to update a cookbook while not logged in',
    async (scenario: StandardScenario) => {
      const original = (await cookbook({
        id: scenario.cookbook.bobsBreakfast.id,
      })) as Cookbook
      expect(original.title).toEqual(scenario.cookbook.bobsBreakfast.title)
      try {
        await updateCookbook({
          id: original.id,
          input: { title: 'String2' },
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
    }
  )

  scenario(
    'deletes a cookbook while logged in',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })
      const original = (await deleteCookbook({
        id: scenario.cookbook.bobsBreakfast.id,
      })) as Cookbook
      const result = await cookbook({ id: original.id })

      expect(result).toEqual(null)
    }
  )

  scenario(
    'fails to delete another users cookbook while logged in',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: scenario.user.linda.id,
        username: scenario.user.linda.username,
      })
      try {
        ;(await deleteCookbook({
          id: scenario.cookbook.bobsBreakfast.id,
        })) as Cookbook
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You can only modify your own cookbooks!')
        )
      }
    }
  )

  scenario(
    'fails to delete a cookbook while not logged in',
    async (scenario: StandardScenario) => {
      try {
        ;(await deleteCookbook({
          id: scenario.cookbook.bobsBreakfast.id,
        })) as Cookbook
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
    }
  )
})
