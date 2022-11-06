import type { Prisma } from '@prisma/client'
import { ShoppingList, User } from 'types/graphql'

import {
  userScenarioData,
  standard as userScenario,
} from '../users/users.scenarios'

// This is type Prisma.ShoppingListInclude, but if you include it here, it'll throw off the generated type for any returned objects (ie from findUnique)
export const shoppingListIncludeAllRelations = {
  author: true,
  items: {
    include: {
      ingredientRef: true,
      unit: true,
    },
  },
}

// I believe this is necessary so that this scenario will exist for the shoppingList tests, but there may be a better way to do this
export const userOnlyScenario = userScenario

export type StandardScenario = {
  user: Record<keyof typeof userScenarioData, User>
  shoppingList: Record<keyof typeof shoppingListScenarioData, ShoppingList>
}

export const getShoppingListScenarioData = (
  authorId: string
): Prisma.ShoppingListCreateArgs['data'] => ({
  authorId: authorId,
  items: {
    create: [
      {
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
})

const shoppingListScenarioData = {
  bobsList: (scenario: StandardScenario): Prisma.ShoppingListCreateArgs => ({
    data: getShoppingListScenarioData(scenario.user.bob.id),
    include: shoppingListIncludeAllRelations,
  }),
}

export const standard = {
  user: userScenarioData,
  shoppingList: shoppingListScenarioData,
}
