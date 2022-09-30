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
    one: {
      data: {
        author: {
          create: {
            email: 'String2919997',
            username: 'String9775063',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        author: {
          create: {
            email: 'String552602',
            username: 'String4319760',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})
