import type {
  QueryResolvers,
  MutationResolvers,
  ShoppingListItemRelationResolvers,
} from 'types/graphql'

import { requireShoppingListAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { mapShoppingListItemInputToDbCreateInput } from './shoppingListItemUtilities'

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

export const addItemToShoppingList: MutationResolvers['addItemToShoppingList'] =
  async ({ shoppingListId, input }) => {
    await requireShoppingListAuth(shoppingListId)

    const { item } = input

    // If this doesn't exist, we can completely positive that there is no item to merge with
    const existingIngRef = await db.ingredientRef.findUnique({
      where: { name: item.ingredientName.toLowerCase() },
    })
    if (existingIngRef) {
      const similarShoppingListItem = await db.shoppingListItem.findUnique({
        where: {
          shoppingListId_ingredientRefId: {
            shoppingListId: shoppingListId,
            ingredientRefId: existingIngRef.id,
          },
        },
        include: {
          unit: true,
        },
      })

      if (similarShoppingListItem) {
        // If the new item has no quantity/unit, there's nothing to do
        if (!item.quantity || !item.unitName) {
          return similarShoppingListItem
        }
        // If the existing item has no quantity/unit, we want to set it to the new quantity/unit
        else if (
          !similarShoppingListItem.quantity ||
          !similarShoppingListItem.unit
        ) {
          return db.shoppingListItem.update({
            where: { id: similarShoppingListItem.id },
            data: {
              unit: {
                connectOrCreate: {
                  where: {
                    name: item.unitName,
                  },
                  create: {
                    name: item.unitName,
                  },
                },
              },
              quantity: item.quantity,
            },
          })
        }
        // Otherwise, we know that both the input and the existing similar item both have a unit/quantity
        else {
          // Right now, we have no conversion between units, so items with different units will need to be two different items
          if (
            similarShoppingListItem.unit.name !== item.unitName.toLowerCase()
          ) {
            return db.shoppingListItem.create({
              data: mapShoppingListItemInputToDbCreateInput(
                shoppingListId,
                item
              ),
            })
          } else {
            return db.shoppingListItem.update({
              where: { id: similarShoppingListItem.id },
              data: {
                quantity: similarShoppingListItem.quantity + item.quantity,
              },
            })
          }
        }
      }
    } else {
      return db.shoppingListItem.create({
        data: mapShoppingListItemInputToDbCreateInput(shoppingListId, item),
      })
    }
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
