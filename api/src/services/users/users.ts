import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import {
  cache,
  cacheFindMany,
  deleteCacheKey,
  getUserCacheKey,
  getUsersCacheKey,
} from 'src/lib/cache'
import { db } from 'src/lib/db'

import { usersRecipes } from '../recipes/recipes'

export const users: QueryResolvers['users'] = () => {
  return cacheFindMany(getUsersCacheKey(), db.user)
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return cache(getUserCacheKey(id), () => db.user.findUnique({ where: { id } }))
}

export const usersFellowChefs: QueryResolvers['usersFellowChefs'] = ({
  username,
}) => {
  return db.user.findMany({
    where: {
      username: {
        not: username,
      },
      recipes: {
        some: {
          cookbooks: {
            some: {
              addedBy: {
                username,
              },
            },
          },
        },
      },
    },
    distinct: ['username'],
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = async ({
  id,
  input,
}) => {
  await deleteCacheKey(getUserCacheKey(id))
  return db.user.update({
    data: {
      email: input.email || undefined,
      username: input.username || undefined,
    },
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  recipes: (_obj, { root }) => {
    return usersRecipes({ username: root.username })
  },
  fellowChefs: (_obj, { root }) => {
    return usersFellowChefs({ username: root.username })
  },
}
