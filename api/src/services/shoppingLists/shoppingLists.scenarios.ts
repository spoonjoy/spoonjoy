import type { Prisma, ShoppingList } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

import { userScenarioData } from '../users/users.scenarios'

export const shoppingListIncludeAllRelations: Prisma.ShoppingListInclude = {
  author: true,
  items: {
    include: {
      ingredientRef: true,
      unit: true,
    },
  },
}

const getFirstShoppingListData = (
  authorId: string
): Prisma.ShoppingListCreateArgs => {
  return {
    data: {
      authorId: authorId,
      items: {
        create: [
          {
            quantity: 8394.128,
            unit: {
              connectOrCreate: {
                where: { name: 'oz' },
                create: { name: 'oz' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'cheese' },
                create: { name: 'cheese' },
              },
            },
          },
          {
            quantity: 2834972.2393,
            unit: {
              connectOrCreate: {
                where: { name: 'gram' },
                create: { name: 'gram' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'onion' },
                create: { name: 'onion' },
              },
            },
          },
          {
            quantity: 23.918,
            unit: {
              connectOrCreate: {
                where: { name: 'oz' },
                create: { name: 'oz' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'mozzarella' },
                create: { name: 'mozzarella' },
              },
            },
          },
          {
            quantity: 912,
            unit: {
              connectOrCreate: {
                where: { name: 'gram' },
                create: { name: 'gram' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'diced tomato' },
                create: { name: 'diced tomato' },
              },
            },
          },
          {
            quantity: 8923.28,
            unit: {
              connectOrCreate: {
                where: { name: 'tbsp' },
                create: { name: 'tbsp' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'onion' },
                create: { name: 'onion' },
              },
            },
          },
          {
            quantity: 82.19,
            unit: {
              connectOrCreate: {
                where: { name: 'gram' },
                create: { name: 'gram' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'cinnamon' },
                create: { name: 'cinnamon' },
              },
            },
          },
          {
            quantity: 1891,
            unit: {
              connectOrCreate: {
                where: { name: 'kilogram' },
                create: { name: 'kilogram' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'fruit' },
                create: { name: 'fruit' },
              },
            },
          },
          {
            quantity: 801,
            unit: {
              connectOrCreate: {
                where: { name: 'milligram' },
                create: { name: 'milligram' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'toasted bread' },
                create: { name: 'toasted bread' },
              },
            },
          },
          {
            quantity: 283018,
            unit: {
              connectOrCreate: {
                where: { name: 'tsp' },
                create: { name: 'tsp' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'garlic' },
                create: { name: 'garlic' },
              },
            },
          },
          {
            quantity: 2892,
            unit: {
              connectOrCreate: {
                where: { name: 'oz' },
                create: { name: 'oz' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'tahini' },
                create: { name: 'tahini' },
              },
            },
          },
          {
            quantity: 81920,
            unit: {
              connectOrCreate: {
                where: { name: 'oz' },
                create: { name: 'oz' },
              },
            },
            ingredientRef: {
              connectOrCreate: {
                where: { name: 'chickpea' },
                create: { name: 'chickpea' },
              },
            },
          },
        ],
      },
    },
    include: shoppingListIncludeAllRelations,
  }
}

export type StandardScenario = ScenarioData<
  ShoppingList,
  'shoppingList',
  'user'
>
export const standard = defineScenario<
  Prisma.ShoppingListCreateArgs | Prisma.UserCreateArgs,
  'recipe' | 'user'
>({
  user: userScenarioData.user,
  shoppingList: {
    // TODO: this is actually fine, but the type system probably needs to be updated
    bobsList: (scenario) => getFirstShoppingListData(scenario.user.bob.id),
  },
})
