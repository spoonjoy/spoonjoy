import { createCache, InMemoryClient, RedisClient } from '@redwoodjs/api/cache'

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

export const { cache, cacheFindMany, cacheClient, deleteCacheKey } =
  createCache(client, {
    logger,
    timeout: 500,
    // If we need to invalidate all cache entries, we can change this prefix
    prefix: 'alpha',
    fields: {
      id: 'id',
      updatedAt: 'updatedAt',
    },
  })

const recipeCacheKeyPrefix = 'v1-recipe'
export const getRecipeCacheKey = (id: string) => `${recipeCacheKeyPrefix}-${id}`
export const getUsersRecipesCacheKey = (username: string) =>
  `${recipeCacheKeyPrefix}s-${username}`
export const getRecipesCacheKey = () => `${recipeCacheKeyPrefix}s`
