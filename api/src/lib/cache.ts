import { RedwoodError } from '@redwoodjs/api'
import { createCache, InMemoryClient, RedisClient } from '@redwoodjs/api/cache'

import { logger } from './logger'

const getClient = () => {
  if (process.env.NODE_ENV === 'test') {
    return new InMemoryClient()
  } else {
    try {
      return new RedisClient({ url: process.env.CACHE_HOST, logger })
    } catch (e) {
      const errorString =
        e instanceof Error
          ? `Could not connect to cache: ${e.message}`
          : `Could not connect to cache: ${e}`
      throw new RedwoodError(errorString)
    }
  }
}

export const client = getClient()

export const {
  cache,
  cacheFindMany,
  cacheClient,
  deleteCacheKey: badDeleteCacheKey,
} = createCache(client, {
  logger,
  timeout: 500,
  // If we need to invalidate all cache entries, we can change this prefix
  prefix: 'alpha',
  fields: {
    id: 'id',
    updatedAt: 'updatedAt',
  },
})

// TODO The prefix needs to be specified here until https://github.com/redwoodjs/redwood/issues/7346 is closed
export const deleteCacheKey = (key: string) => badDeleteCacheKey(`alpha-${key}`)

const recipeCacheKeyPrefix = 'v1-recipe'
export const getRecipeCacheKey = (id: string) => `${recipeCacheKeyPrefix}-${id}`
export const getUsersRecipesCacheKey = (
  username: string,
  latestId: string | undefined,
  latestUpdatedAt: Date | undefined
) =>
  latestId && latestUpdatedAt
    ? `${recipeCacheKeyPrefix}s-${username}-${latestId}-${latestUpdatedAt.getTime()}`
    : `${recipeCacheKeyPrefix}s-${username}`
export const getRecipesCacheKey = () => `${recipeCacheKeyPrefix}s`

const recipesStepsCacheKeyPrefix = 'v1-recipesSteps'
export const getRecipesStepsCacheKey = (recipeId: string) =>
  `${recipesStepsCacheKeyPrefix}-${recipeId}`

const ingredientCacheKeyPrefix = 'v1-ingredient'
/** for ingredients in a recipe step */
export const getIngredientsInStepCacheKey = (
  recipeId: string,
  stepNum: number
) => `${ingredientCacheKeyPrefix}s-${recipeId}-${stepNum}`
/** for ingredients using a given ingredientRef */
export const getIngredientsUsingIngredientRefCacheKey = (
  ingredientRefId: string
) => `${ingredientCacheKeyPrefix}s-${ingredientRefId}`

const stepOutputUsesCacheKeyPrefix = 'v1-stepOutputUse'
/** for stepOutputUses in a recipe step */
export const getStepOutputUsesInStepCacheKey = (
  recipeId: string,
  inputStepNum: number
) => `${stepOutputUsesCacheKeyPrefix}s-${recipeId}-${inputStepNum}`

const userCacheKeyPrefix = 'v1-user'
export const getUserCacheKey = (id: string) => `${userCacheKeyPrefix}-${id}`
export const getUsersCacheKey = () => `${userCacheKeyPrefix}s`

const cookbookCacheKeyPrefix = 'v1-cookbook'
export const getCookbookCacheKey = (id: string) =>
  `${cookbookCacheKeyPrefix}-${id}`
export const getUsersCookbooksCacheKey = (username: string) =>
  `${cookbookCacheKeyPrefix}s-${username}`
export const getCookbooksCacheKey = () => `${cookbookCacheKeyPrefix}s`

const recipeInCookbookCacheKeyPrefix = 'v1-recipeInCookbook'
/** this is for finding the recipes in a cookbook */
export const getRecipeInCookbooksCacheKey = (cookbookId: string) =>
  `${recipeInCookbookCacheKeyPrefix}-${cookbookId}`

//** for finding the cookbooks that a recipe is in */
export const getRecipeInMyCookbooksCacheKey = (
  myUsername: string,
  recipeId: string
) => `${recipeInCookbookCacheKeyPrefix}s-${recipeId}-${myUsername}`
