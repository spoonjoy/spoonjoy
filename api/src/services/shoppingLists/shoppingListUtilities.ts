import type { Prisma } from '@prisma/client'
import {
  CreateShoppingListItemInput,
  IngredientRef,
  InputMaybe,
  ShoppingList,
  ShoppingListItem,
  Unit,
  UpdateShoppingListInput,
  UpdateShoppingListItemInput,
  User,
} from 'types/graphql'

import {
  IIngredientRefDbOutput,
  IUnitDbOutput,
} from '../recipes/recipeUtilities'

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

export interface IShoppingListItemsOutput {
  quantity: number
  unit: IUnitDbOutput
  ingredientRef: IIngredientRefDbOutput
}

export const mapShoppingListItemsDbResponseToUpdateMutationInput = (
  items: IShoppingListItemsOutput[]
): InputMaybe<UpdateShoppingListItemInput>[] => {
  return items.map((item) => {
    const { quantity, unit, ingredientRef } = item
    return {
      quantity,
      unitName: unit.name,
      ingredientName: ingredientRef.name,
    }
  })
}

// this was copied from the generated return type of db.shoppingList.findUnique with the included relations.
export type IShoppingListResponse = ShoppingList & {
  author: User
  items: (ShoppingListItem & {
    ingredientRef: IngredientRef
    unit: Unit
  })[]
}

export const mapShoppingListDbResponseToUpdateMutationInput = (
  shoppingList: IShoppingListResponse
): { input: UpdateShoppingListInput } => {
  const { items } = shoppingList
  return {
    input: {
      items: mapShoppingListItemsDbResponseToUpdateMutationInput(items),
    },
  }
}
