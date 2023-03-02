import type {
  QueryResolvers,
  MutationResolvers,
  CookbookRelationResolvers,
  RequiredResolverFn,
  ResolversParentTypes,
  ResolversTypes,
  Cookbook as CookbookModel,
} from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { requireAuth, requireCookbookAuth } from 'src/lib/auth'
import { cacheFindMany, getRecipeInCookbooksCacheKey } from 'src/lib/cache'
import { db } from 'src/lib/db'

import { user } from '../users/users'

/**
 * TODO: Figure out if there's a better way to fix these incorrect type errors than putting `as unknown as CookbookModel[]` etc
 * - The reason it's needed is that the imageUrl attribute is generated in an async function, which is fine, but Typescript
 * is getting caught up on the return type (it thinks it's `Promise<string>` when it's really just `string`)
 */

export const cookbooks: QueryResolvers['cookbooks'] = async () => {
  requireAuth()
  return (await db.cookbook.findMany({
    select: { imageUrl: true },
  })) as unknown as CookbookModel[]
}

export const usersCookbooks: QueryResolvers['usersCookbooks'] = ({
  username,
}) => {
  return db.cookbook.findMany({
    where: {
      author: { username },
    },
    orderBy: { title: 'asc' },
  }) as unknown as CookbookModel[]
}

export const cookbook: QueryResolvers['cookbook'] = ({ id }) => {
  return db.cookbook.findUnique({
    where: { id },
  }) as unknown as CookbookModel
}

export const createCookbook: MutationResolvers['createCookbook'] = ({
  input,
}) => {
  requireAuth()

  const { title } = input
  return db.cookbook.create({
    data: {
      title,
      author: {
        connect: {
          id: context.currentUser!.id,
        },
      },
    },
  }) as unknown as CookbookModel
}

export const updateCookbook: MutationResolvers['updateCookbook'] = async ({
  id,
  input,
}) => {
  await requireCookbookAuth(id)
  return db.cookbook.update({
    data: input,
    where: { id },
  }) as unknown as CookbookModel
}

export const addToCookbook: MutationResolvers['addToCookbook'] = async ({
  id,
  recipeId,
}) => {
  await requireCookbookAuth(id)
  return db.recipeInCookbook.create({
    data: {
      cookbook: {
        connect: {
          id,
        },
      },
      recipe: {
        connect: {
          id: recipeId,
        },
      },
      addedBy: {
        connect: {
          id: context.currentUser!.id,
        },
      },
    },
  })
}

export const removeFromCookbook: MutationResolvers['removeFromCookbook'] =
  async ({ id, recipeId }) => {
    await requireCookbookAuth(id)
    return db.recipeInCookbook.delete({
      where: {
        cookbookId_recipeId: {
          cookbookId: id,
          recipeId,
        },
      },
    })
  }

export const deleteCookbook: MutationResolvers['deleteCookbook'] = async ({
  id,
}) => {
  await requireCookbookAuth(id)
  return db.cookbook.delete({
    where: { id },
  }) as unknown as CookbookModel
}

type RequiredCookbookRelationResolvers = CookbookRelationResolvers & {
  author: RequiredResolverFn<
    ResolversTypes['User'],
    ResolversParentTypes['Cookbook'],
    RedwoodGraphQLContext
  >
  recipes: RequiredResolverFn<
    Array<ResolversTypes['RecipeInCookbook']>,
    ResolversParentTypes['Cookbook'],
    RedwoodGraphQLContext
  >
}

export const Cookbook: RequiredCookbookRelationResolvers = {
  author: async (_obj, { root }) => {
    const maybeAuthor = await user({ id: root.authorId })
    if (!maybeAuthor) {
      throw new Error('Could not resolve cookbook author')
    }
    return maybeAuthor
  },
  // this is RecipeInCookbook[], which doesn't have any resolvers of its own, so implementing that here
  recipes: async (_obj, { root }) => {
    return cacheFindMany(
      getRecipeInCookbooksCacheKey(root.id),
      db.recipeInCookbook,
      {
        conditions: {
          where: {
            cookbookId: root.id,
          },
          orderBy: {
            recipe: {
              title: 'asc',
            },
          },
        },
      }
    )
  },
}
