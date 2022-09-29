import type {
  QueryResolvers,
  MutationResolvers,
  ShoppingListItemRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const shoppingListItems: QueryResolvers['shoppingListItems'] = () => {
  return db.shoppingListItem.findMany()
}

export const shoppingListItem: QueryResolvers['shoppingListItem'] = ({
  id,
}) => {
  return db.shoppingListItem.findUnique({
    where: { id },
  })
}

export const createShoppingListItem: MutationResolvers['createShoppingListItem'] =
  ({ input }) => {
    return db.shoppingListItem.create({
      data: input,
    })
  }

export const updateShoppingListItem: MutationResolvers['updateShoppingListItem'] =
  ({ id, input }) => {
    return db.shoppingListItem.update({
      data: input,
      where: { id },
    })
  }

export const deleteShoppingListItem: MutationResolvers['deleteShoppingListItem'] =
  ({ id }) => {
    return db.shoppingListItem.delete({
      where: { id },
    })
  }

export const ShoppingListItem: ShoppingListItemRelationResolvers = {
  shoppingList: (_obj, { root }) => {
    return db.shoppingListItem
      .findUnique({ where: { id: root?.id } })
      .shoppingList()
  },
  unit: (_obj, { root }) => {
    return db.shoppingListItem.findUnique({ where: { id: root?.id } }).unit()
  },
  ingredientRef: (_obj, { root }) => {
    return db.shoppingListItem
      .findUnique({ where: { id: root?.id } })
      .ingredientRef()
  },
}
