import type {
  QueryResolvers,
  MutationResolvers,
  RecipesInCookbooksRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const recipesInCookbookses: QueryResolvers['recipesInCookbookses'] =
  () => {
    return db.recipesInCookbooks.findMany()
  }

export const recipesInCookbooks: QueryResolvers['recipesInCookbooks'] = ({
  id,
}) => {
  return db.recipesInCookbooks.findUnique({
    where: { id },
  })
}

export const createRecipesInCookbooks: MutationResolvers['createRecipesInCookbooks'] =
  ({ input }) => {
    return db.recipesInCookbooks.create({
      data: input,
    })
  }

export const updateRecipesInCookbooks: MutationResolvers['updateRecipesInCookbooks'] =
  ({ id, input }) => {
    return db.recipesInCookbooks.update({
      data: input,
      where: { id },
    })
  }

export const deleteRecipesInCookbooks: MutationResolvers['deleteRecipesInCookbooks'] =
  ({ id }) => {
    return db.recipesInCookbooks.delete({
      where: { id },
    })
  }

export const RecipesInCookbooks: RecipesInCookbooksRelationResolvers = {
  cookbook: (_obj, { root }) => {
    return db.recipesInCookbooks
      .findUnique({ where: { id: root?.id } })
      .cookbook()
  },
  recipe: (_obj, { root }) => {
    return db.recipesInCookbooks
      .findUnique({ where: { id: root?.id } })
      .recipe()
  },
  addedBy: (_obj, { root }) => {
    return db.recipesInCookbooks
      .findUnique({ where: { id: root?.id } })
      .addedBy()
  },
}
