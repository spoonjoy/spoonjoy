import {
  CacheKey,
  createCache,
  InMemoryClient,
  RedisClient,
} from '@redwoodjs/api/cache'

import { logger } from './logger'

export let client: InMemoryClient | RedisClient

if (process.env.NODE_ENV === 'test') {
  client = new InMemoryClient()
} else {
  try {
    client = new RedisClient({ url: process.env.CACHE_HOST, logger })
  } catch (e) {
    if (e instanceof Error) {
      logger.error(`Could not connect to cache: ${e.message}`)
    } else {
      logger.error(`Could not connect to cache: ${e}`)
    }
  }
}

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
export const getUsersRecipesCacheKey = (username: string) =>
  `${recipeCacheKeyPrefix}s-${username}`
export const getRecipesCacheKey = () => `${recipeCacheKeyPrefix}s`

const userCacheKeyPrefix = 'v1-user'
export const getUserCacheKey = (id: string) => `${userCacheKeyPrefix}-${id}`
export const getUsersCacheKey = () => `${userCacheKeyPrefix}s`

const cookbookCacheKeyPrefix = 'v1-cookbook'
export const getCookbookCacheKey = (id: string) =>
  `${cookbookCacheKeyPrefix}-${id}`
export const getUsersCookbooksCacheKey = (username: string) =>
  `${cookbookCacheKeyPrefix}s-${username}`
export const getCookbooksCacheKey = () => `${cookbookCacheKeyPrefix}s`
