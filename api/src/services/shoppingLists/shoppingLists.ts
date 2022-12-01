import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  ShoppingListRelationResolvers,
  RequiredResolverFn,
  ResolversParentTypes,
  ResolversTypes,
} from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { requireAuth, requireShoppingListAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import {
  mapItemsMutationInputToDbCreateInput,
  mapItemsMutationInputToDbUpdateInput,
} from './shoppingListUtilities'

// export const shoppingLists: QueryResolvers['shoppingLists'] = () => {
//   return db.shoppingList.findMany()
// }

export const shoppingList: QueryResolvers['shoppingList'] = ({ id }) => {
  const list = db.shoppingList.findUnique({
    where: { id },
  })
  return list
}

export const myShoppingList: QueryResolvers['myShoppingList'] = () => {
  requireAuth()

  const list = db.shoppingList.findUnique({
    where: { authorId: context.currentUser?.id },
  })
  return list
}

export const createShoppingList: MutationResolvers['createShoppingList'] = ({
  input,
}) => {
  requireAuth()

  const { items } = input

  const dbInput: Prisma.ShoppingListCreateInput = {
    author: {
      connect: {
        id: context.currentUser!.id,
      },
    },
    items: mapItemsMutationInputToDbCreateInput(items),
  }

  return db.shoppingList.create({
    data: dbInput,
  })
}

export const updateShoppingList: MutationResolvers['updateShoppingList'] =
  async ({ id, input }) => {
    await requireShoppingListAuth(id)

    const { items } = input
    const dbInput: Prisma.ShoppingListUpdateInput = {
      items: mapItemsMutationInputToDbUpdateInput(items),
    }

    return db.shoppingList.update({
      where: { id },
      data: dbInput,
    })
  }

export const deleteShoppingList: MutationResolvers['deleteShoppingList'] =
  async ({ id }) => {
    await requireShoppingListAuth(id)

    return db.shoppingList.delete({
      where: { id },
    })
  }

type RequiredShoppingListRelationResolvers = ShoppingListRelationResolvers & {
  author: RequiredResolverFn<
    ResolversTypes['User'],
    ResolversParentTypes['ShoppingList'],
    RedwoodGraphQLContext
  >
  items: NonNullable<ShoppingListRelationResolvers['items']>
}

export const ShoppingList: RequiredShoppingListRelationResolvers = {
  author: async (_obj, { root }) => {
    const maybeAuthor = await db.shoppingList
      .findUnique({ where: { id: root.id } })
      .author()
    if (!maybeAuthor) {
      throw new Error('Could not resolve author')
    }

    return maybeAuthor
  },

  items: async (_obj, { root }) => {
    const maybeIngredients = await db.shoppingList
      .findUnique({ where: { id: root.id } })
      .items()

    return maybeIngredients
  },
}
