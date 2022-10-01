import type { Prisma } from '@prisma/client'
import { CreateShoppingListItemInput, InputMaybe } from 'types/graphql'

export const mapItemsMutationInputToDbCreateInput = (
  items: InputMaybe<CreateShoppingListItemInput>[]
):
  | Prisma.ShoppingListItemCreateNestedManyWithoutShoppingListInput
  | undefined => {
  return {
    create: items.map((item) => {
      const { quantity, unitName, ingredientName } = item!
      return {
        quantity,
        unit: {
          connectOrCreate: {
            where: { name: unitName.toLowerCase() },
            create: { name: unitName.toLowerCase() },
          },
        },
        ingredientRef: {
          connectOrCreate: {
            where: { name: ingredientName.toLowerCase() },
            create: { name: ingredientName.toLowerCase() },
          },
        },
      }
    }),
  }
}
