import type { Prisma, ShoppingList } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ShoppingListCreateArgs>({
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

export type StandardScenario = ScenarioData<ShoppingList, 'shoppingList'>
