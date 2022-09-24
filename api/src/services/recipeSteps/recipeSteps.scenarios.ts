import type { Prisma, RecipeStep } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RecipeStepCreateArgs>({
  recipeStep: {
    one: {
      data: {
        stepNum: 7184155,
        recipe: {
          create: {
            title: 'String',
            chef: {
              create: {
                email: 'String7338818',
                username: 'String2442434',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        stepNum: 4751606,
        recipe: {
          create: {
            title: 'String',
            chef: {
              create: {
                email: 'String7551104',
                username: 'String4416024',
                hashedPassword: 'String',
                salt: 'String',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<RecipeStep, 'recipeStep'>
