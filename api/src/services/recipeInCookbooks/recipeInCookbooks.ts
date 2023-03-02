import type { RecipeInCookbookRelationResolvers } from 'types/graphql'

import { cookbook } from '../cookbooks/cookbooks'
import { recipe } from '../recipes/recipes'
import { user } from '../users/users'

export const RecipeInCookbook: RecipeInCookbookRelationResolvers = {
  cookbook: async (_obj, { root }) => {
    const maybeCookbook = await cookbook({ id: root.cookbookId })
    if (!maybeCookbook) {
      throw new Error('Could not resolve cookbook')
    }
    return maybeCookbook
  },
  recipe: async (_obj, { root }) => {
    const maybeRecipe = await recipe({ id: root.recipeId })
    if (!maybeRecipe) {
      throw new Error('Could not resolve recipe')
    }
    return maybeRecipe
  },
  addedBy: async (_obj, { root }) => {
    const maybeUser = await user({ id: root.addedById })
    if (!maybeUser) {
      throw new Error('Could not resolve user')
    }
    return maybeUser
  },
}
