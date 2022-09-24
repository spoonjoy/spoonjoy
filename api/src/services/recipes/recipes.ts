import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  RecipeRelationResolvers,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const recipes: QueryResolvers['recipes'] = () => {
  return db.recipe.findMany()
}

export const recipe: QueryResolvers['recipe'] = ({ id }) => {
  return db.recipe.findUnique({
    where: { id },
  })
}

export const createRecipe: MutationResolvers['createRecipe'] = ({
  input,
}: Prisma.RecipeCreateWithoutChefInput) => {
  requireAuth()
  return db.recipe.create({
    data: { ...input, chefId: context.currentUser!.id },
  })
}

export const updateRecipe: MutationResolvers['updateRecipe'] = ({
  id,
  input,
}) => {
  return db.recipe.update({
    data: input,
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
