import type { Prisma, Cookbook } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CookbookCreateArgs>({
  cookbook: {
    one: {
      data: {
        author: {
          create: {
            email: 'String6859389',
            username: 'String7496370',
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
            email: 'String4892640',
            username: 'String2739524',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Cookbook, 'cookbook'>
