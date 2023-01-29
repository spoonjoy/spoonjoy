import type { Cookbook } from '@prisma/client'
import { RecipeInCookbook } from 'types/graphql'

import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import {
  cookbooks,
  cookbook,
  createCookbook,
  updateCookbook,
  deleteCookbook,
  addToCookbook,
  removeFromCookbook,
} from './cookbooks'
import type { StandardScenario } from './cookbooks.scenarios'

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

  scenario(
    'adds and removes users own recipe from cookbook while logged in',
    async (scenario: StandardScenario) => {
      const currentUserId = scenario.user.bob.id
      mockCurrentUser({
        id: currentUserId,
        username: scenario.user.bob.username,
      })

      const cookbookToUseToId = scenario.cookbook.bobsBreakfast.id
      const recipeToUseId = scenario.recipe.bobsPizza.id

      const cookbookInitial = await db.cookbook.findUnique({
        where: {
          id: cookbookToUseToId,
        },
        include: {
          recipes: true,
        },
      })
      expect(cookbookInitial!.recipes.length).toBe(0)

      const recipeInCookbookAddResult = (await addToCookbook({
        id: cookbookToUseToId,
        recipeId: recipeToUseId,
      })) as RecipeInCookbook
      expect(recipeInCookbookAddResult.addedById).toBe(currentUserId)
      expect(recipeInCookbookAddResult.cookbookId).toBe(cookbookToUseToId)
      expect(recipeInCookbookAddResult.recipeId).toBe(recipeToUseId)

      const cookbookAfterRecipeAdd = await db.cookbook.findUnique({
        where: {
          id: cookbookToUseToId,
        },
        include: {
          recipes: true,
        },
      })
      expect(cookbookAfterRecipeAdd!.recipes.length).toBe(1)
      expect(cookbookAfterRecipeAdd!.recipes[0]).toStrictEqual(
        recipeInCookbookAddResult
      )

      const recipeInCookbookRemoveResult = (await removeFromCookbook({
        id: cookbookToUseToId,
        recipeId: recipeToUseId,
      })) as RecipeInCookbook
      const removedResult = await db.recipeInCookbook.findUnique({
        where: { id: recipeInCookbookRemoveResult.id },
      })
      expect(removedResult).toBe(null)
      const cookbookAfterRecipeRemove = await db.cookbook.findUnique({
        where: {
          id: cookbookToUseToId,
        },
        include: {
          recipes: true,
        },
      })
      expect(cookbookAfterRecipeRemove!.recipes.length).toBe(0)
    }
  )

  // TODO dedupe with the above test, which is basically the same
  scenario(
    'adds and removes another users recipe to cookbook while logged in',
    async (scenario: StandardScenario) => {
      const currentUserId = scenario.user.bob.id
      mockCurrentUser({
        id: currentUserId,
        username: scenario.user.bob.username,
      })

      const cookbookToUseToId = scenario.cookbook.bobsBreakfast.id
      const recipeToUseId = scenario.recipe.lindasPizza.id

      const cookbookInitial = await db.cookbook.findUnique({
        where: {
          id: cookbookToUseToId,
        },
        include: {
          recipes: true,
        },
      })
      expect(cookbookInitial!.recipes.length).toBe(0)

      const recipeInCookbookAddResult = (await addToCookbook({
        id: cookbookToUseToId,
        recipeId: recipeToUseId,
      })) as RecipeInCookbook
      expect(recipeInCookbookAddResult.addedById).toBe(currentUserId)
      expect(recipeInCookbookAddResult.cookbookId).toBe(cookbookToUseToId)
      expect(recipeInCookbookAddResult.recipeId).toBe(recipeToUseId)

      const cookbookAfterRecipeAdd = await db.cookbook.findUnique({
        where: {
          id: cookbookToUseToId,
        },
        include: {
          recipes: true,
        },
      })
      expect(cookbookAfterRecipeAdd!.recipes.length).toBe(1)
      expect(cookbookAfterRecipeAdd!.recipes[0]).toStrictEqual(
        recipeInCookbookAddResult
      )

      const recipeInCookbookRemoveResult = (await removeFromCookbook({
        id: cookbookToUseToId,
        recipeId: recipeToUseId,
      })) as RecipeInCookbook
      const removedResult = await db.recipeInCookbook.findUnique({
        where: { id: recipeInCookbookRemoveResult.id },
      })
      expect(removedResult).toBe(null)
      const cookbookAfterRecipeRemove = await db.cookbook.findUnique({
        where: {
          id: cookbookToUseToId,
        },
        include: {
          recipes: true,
        },
      })
      expect(cookbookAfterRecipeRemove!.recipes.length).toBe(0)
    }
  )

  scenario(
    'fails to add a recipe to another users cookbook',
    async (scenario: StandardScenario) => {
      const currentUserId = scenario.user.linda.id
      mockCurrentUser({
        id: currentUserId,
        username: scenario.user.bob.username,
      })

      const cookbookToUseToId = scenario.cookbook.bobsBreakfast.id
      const recipeToUseId = scenario.recipe.lindasPizza.id

      try {
        await addToCookbook({
          id: cookbookToUseToId,
          recipeId: recipeToUseId,
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You can only modify your own cookbooks!')
        )
      }
    }
  )

  scenario(
    'fails to remove a recipe from another users cookbook',
    async (scenario: StandardScenario) => {
      const currentUserId = scenario.user.linda.id
      mockCurrentUser({
        id: currentUserId,
        username: scenario.user.bob.username,
      })

      const cookbookToUseToId = scenario.cookbook.bobsBreakfast.id
      const recipeToUseId = scenario.recipe.lindasPizza.id

      try {
        await removeFromCookbook({
          id: cookbookToUseToId,
          recipeId: recipeToUseId,
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You can only modify your own cookbooks!')
        )
      }
    }
  )
})
