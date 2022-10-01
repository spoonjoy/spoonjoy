import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  ShoppingListRelationResolvers,
} from 'types/graphql'

import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { mapItemsMutationInputToDbCreateInput } from './shoppingListUtilities'

export const shoppingLists: QueryResolvers['shoppingLists'] = () => {
  return db.shoppingList.findMany()
}

export const shoppingList: QueryResolvers['shoppingList'] = ({ id }) => {
  const list = db.shoppingList.findUnique({
    where: { id },
  })
  return list
}

export const createShoppingList: MutationResolvers['createShoppingList'] = ({
  input,
}) => {
  const currentUser = context.currentUser
  if (!currentUser) throw new AuthenticationError('You are not logged in!')

  const { items } = input

  const dbInput: Prisma.ShoppingListCreateInput = {
    author: {
      connect: {
        id: currentUser.id,
      },
    },
    items: mapItemsMutationInputToDbCreateInput(items),
  }

  return db.shoppingList.create({
    data: dbInput,
  })
}

export const updateShoppingList: MutationResolvers['updateShoppingList'] = ({
  id,
  input,
}) => {
  return db.shoppingList.update({
    data: input,
    where: { id },
  })
}

export const deleteShoppingList: MutationResolvers['deleteShoppingList'] = ({
  id,
}) => {
  return db.shoppingList.delete({
    where: { id },
  })
}

export const ShoppingList: ShoppingListRelationResolvers = {
  author: (_obj, { root }) => {
    return db.shoppingList.findUnique({ where: { id: root?.id } }).author()
  },

  items: (_obj, { root }) => {
    return db.shoppingList.findUnique({ where: { id: root?.id } }).items()
  },
}
