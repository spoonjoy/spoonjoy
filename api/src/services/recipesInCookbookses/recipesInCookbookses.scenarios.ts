import type { Prisma, RecipesInCookbooks } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RecipesInCookbooksCreateArgs>({
  recipesInCookbooks: {
    one: {
      data: {
        cookbook: {
          create: {
            author: {
              create: {
                email: 'String7111759',
                username: 'String3733493',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        recipe: {
          create: {
            title: 'String',
            chef: {
              create: {
                email: 'String4322051',
                username: 'String8791391',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        addedBy: {
          create: {
            email: 'String5622464',
            username: 'String7445024',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
    two: {
      data: {
        cookbook: {
          create: {
            author: {
              create: {
                email: 'String5873040',
                username: 'String3460016',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        recipe: {
          create: {
            title: 'String',
            chef: {
              create: {
                email: 'String4711403',
                username: 'String3776991',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        addedBy: {
          create: {
            email: 'String7124216',
            username: 'String7037275',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  RecipesInCookbooks,
  'recipesInCookbooks'
>
