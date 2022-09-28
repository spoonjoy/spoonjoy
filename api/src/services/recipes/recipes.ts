import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  RecipeRelationResolvers,
} from 'types/graphql'

import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import {
  mapStepsMutationInputToDbCreateInput,
  mapStepsMutationInputToDbUpdateInput,
} from './recipeUtilities'

export const recipes: QueryResolvers['recipes'] = () => {
  return db.recipe.findMany()
}

export const recipe: QueryResolvers['recipe'] = ({ id }) => {
  return db.recipe.findUnique({
    where: { id },
  })
}

export const createRecipe: MutationResolvers['createRecipe'] = ({ input }) => {
  const currentUser = context.currentUser
  if (!currentUser) throw new AuthenticationError('You are not logged in!')

  const { title, description, servings, steps } = input

  const dbInput: Prisma.RecipeCreateInput = {
    title,
    description,
    servings,
    chef: {
      connect: {
        id: currentUser.id,
      },
    },
    steps: mapStepsMutationInputToDbCreateInput(steps),
  }

  return db.recipe.create({
    data: dbInput,
  })
}

export const updateRecipe: MutationResolvers['updateRecipe'] = ({
  id,
  input,
}) => {
  const currentUser = context.currentUser
  if (!currentUser) throw new AuthenticationError('You are not logged in!')

  const { title, description, servings, steps } = input
  const dbInput: Prisma.RecipeUpdateInput = {
    title,
    description,
    servings,
    steps: mapStepsMutationInputToDbUpdateInput(steps, id),
  }

  return db.recipe.update({
    data: dbInput,
    where: { id },
  })
}

export const deleteRecipe: MutationResolvers['deleteRecipe'] = ({ id }) => {
  return db.recipe.delete({
    where: { id },
  })
}

export const Recipe: RecipeRelationResolvers = {
  chef: (_obj, { root }) => {
    return db.recipe.findUnique({ where: { id: root?.id } }).chef()
  },
  steps: (_obj, { root }) => {
    return db.recipe.findUnique({ where: { id: root?.id } }).steps()
  },
}
