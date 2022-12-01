import type { Prisma } from '@prisma/client'
import { CreateOrUpdateShoppingListItemInput } from 'types/graphql'

/** This is used for creating any new shopping list item */
export const mapShoppingListItemInputToDbCreateInput = (
  shoppingListId: string,
  item: CreateOrUpdateShoppingListItemInput
): Prisma.ShoppingListItemCreateInput => {
  const { ingredientName, unitName, quantity } = item
  const baseCreateInput: Prisma.ShoppingListItemCreateInput = {
    shoppingList: { connect: { id: shoppingListId } },
    ingredientRef: {
      connectOrCreate: {
        where: { name: ingredientName.toLowerCase() },
        create: { name: ingredientName.toLowerCase() },
      },
    },
  }

  if (unitName && quantity) {
    return {
      ...baseCreateInput,
      unit: {
        connectOrCreate: {
          where: { name: unitName.toLowerCase() },
          create: { name: unitName.toLowerCase() },
        },
      },
      quantity: quantity,
    }
  } else {
    return baseCreateInput
  }
}
