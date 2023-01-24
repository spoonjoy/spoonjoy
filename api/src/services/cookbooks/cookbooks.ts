import type {
  QueryResolvers,
  MutationResolvers,
  CookbookRelationResolvers,
  RequiredResolverFn,
  ResolversParentTypes,
  ResolversTypes,
} from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { db } from 'src/lib/db'

export const cookbooks: QueryResolvers['cookbooks'] = () => {
  return db.cookbook.findMany()
}

export const cookbook: QueryResolvers['cookbook'] = ({ id }) => {
  return db.cookbook.findUnique({
    where: { id },
  })
}

export const createCookbook: MutationResolvers['createCookbook'] = ({
  input,
}) => {
  return db.cookbook.create({
    data: input,
  })
}

export const updateCookbook: MutationResolvers['updateCookbook'] = ({
  id,
  input,
}) => {
  return db.cookbook.update({
    data: input,
    where: { id },
  })
}

export const deleteCookbook: MutationResolvers['deleteCookbook'] = ({ id }) => {
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
    Array<ResolversTypes['RecipesInCookbooks']>,
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
}
