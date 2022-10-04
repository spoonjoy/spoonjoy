import type { Prisma, ShoppingListItem } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ShoppingListItemCreateArgs>({
  shoppingListItem: {
    one: {
      data: {
        quantity: 1830624.4945550265,
        shoppingList: {
          create: {
            author: {
              create: {
                email: 'String3852439',
                username: 'String1798123',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        unit: { create: { name: 'String1416663' } },
        ingredientRef: { create: { name: 'String8597000' } },
      },
    },
    two: {
      data: {
        quantity: 3786480.6358592617,
        shoppingList: {
          create: {
            author: {
              create: {
                email: 'String5779533',
                username: 'String6115589',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        unit: { create: { name: 'String2171482' } },
        ingredientRef: { create: { name: 'String7765833' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  ShoppingListItem,
  'shoppingListItem'
>
