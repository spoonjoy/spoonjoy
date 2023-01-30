import type {
  QueryResolvers,
  MutationResolvers,
  CookbookRelationResolvers,
  RequiredResolverFn,
  ResolversParentTypes,
  ResolversTypes,
} from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { requireAuth, requireCookbookAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const cookbooks: QueryResolvers['cookbooks'] = () => {
  requireAuth()
  return db.cookbook.findMany()
}

export const usersCookbooks: QueryResolvers['usersCookbooks'] = ({
  username,
}) => {
  return db.cookbook.findMany({
    where: {
      author: { username },
    },
  })
}

export const cookbook: QueryResolvers['cookbook'] = ({ id }) => {
  return db.cookbook.findUnique({
    where: { id },
  })
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
  })
}

export const updateCookbook: MutationResolvers['updateCookbook'] = async ({
  id,
  input,
}) => {
  await requireCookbookAuth(id)
  return db.cookbook.update({
    data: input,
    where: { id },
  })
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
  })
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
    const maybeAuthor = await db.cookbook
      .findUnique({ where: { id: root?.id } })
      .author()
    if (!maybeAuthor) {
      throw new Error('Could not resolve cookbook author')
    }
    return maybeAuthor
  },
  recipes: async (_obj, { root }) => {
    const maybeRecipes = await db.cookbook
      .findUnique({ where: { id: root?.id } })
      .recipes()
    if (!maybeRecipes) {
      throw new Error('Could not resolve cookbook recipes')
    }
    return maybeRecipes
  },
  imageUrl: async (_obj, { root }) => {
    // The cookbook image is up to 4 recipe images in a grid

    const maybeRecipes = await db.cookbook
      .findUnique({ where: { id: root?.id } })
      .recipes({ take: 4 })

    const recipeIds = []
    maybeRecipes?.forEach((recipe) => {
      recipeIds.push(recipe.recipeId)
    })
    // Fill up any remaining spots with a transparent box
    while (recipeIds?.length < 4) {
      recipeIds.push('transparent_box')
    }

    return `https://res.cloudinary.com/dpjmyc4uz/image/upload/w_250,h_250,c_fill/l_${recipeIds[1]},w_250,h_250,c_fill,x_250/l_${recipeIds[2]},w_250,h_250,c_fill,y_250,x_-125/l_${recipeIds[3]},w_250,h_250,c_fill,y_125,x_125/${recipeIds[0]}`
  },
}
