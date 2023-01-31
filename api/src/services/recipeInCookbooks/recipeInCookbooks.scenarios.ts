import type { Prisma, RecipeInCookbook } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RecipeInCookbookCreateArgs>({
  recipeInCookbook: {
    one: {
      data: {
        cookbook: {
          create: {
            title: 'String',
            author: {
              create: {
                email: 'String4170056',
                username: 'String6456441',
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
                email: 'String4279526',
                username: 'String8705516',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        addedBy: {
          create: {
            email: 'String6203383',
            username: 'String6757765',
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
            title: 'String',
            author: {
              create: {
                email: 'String9255550',
                username: 'String9876460',
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
                email: 'String3872714',
                username: 'String2022713',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
        addedBy: {
          create: {
            email: 'String2053146',
            username: 'String7591475',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  RecipeInCookbook,
  'recipeInCookbook'
>
