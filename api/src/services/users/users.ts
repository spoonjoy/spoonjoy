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

export const users: QueryResolvers['users'] = () => {
  return cacheFindMany(getUsersCacheKey(), db.user)
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return cache(getUserCacheKey(id), () => db.user.findUnique({ where: { id } }))
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
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  credentials: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).credentials()
  },
  recipes: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).recipes()
  },
}
