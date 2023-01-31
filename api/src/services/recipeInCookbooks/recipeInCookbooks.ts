import type { RecipeInCookbookRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const RecipeInCookbook: RecipeInCookbookRelationResolvers = {
  cookbook: (_obj, { root }) => {
    return db.recipeInCookbook
      .findUnique({ where: { id: root?.id } })
      .cookbook()
  },
  recipe: (_obj, { root }) => {
    return db.recipeInCookbook.findUnique({ where: { id: root?.id } }).recipe()
  },
  addedBy: (_obj, { root }) => {
    return db.recipeInCookbook.findUnique({ where: { id: root?.id } }).addedBy()
  },
}
