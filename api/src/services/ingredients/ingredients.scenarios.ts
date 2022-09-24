import type { Prisma, Ingredient } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.IngredientCreateArgs>({
  ingredient: {
    one: {
      data: {
        quantity: 6232008.396773363,
        recipeStep: {
          create: {
            stepNum: 453873,
            recipe: {
              create: {
                title: 'String',
                chef: {
                  create: {
                    email: 'String182211',
                    username: 'String3530097',
                    hashedPassword: 'String',
                    salt: 'String',
                  },
                },
              },
            },
          },
        },
        unit: { create: { name: 'String5732752' } },
        ingredientRef: { create: { name: 'String8058502' } },
      },
    },
    two: {
      data: {
        quantity: 7814155.22514092,
        recipeStep: {
          create: {
            stepNum: 7890004,
            recipe: {
              create: {
                title: 'String',
                chef: {
                  create: {
                    email: 'String7260837',
                    username: 'String3651972',
                    hashedPassword: 'String',
                    salt: 'String',
                  },
                },
              },
            },
          },
        },
        unit: { create: { name: 'String7443825' } },
        ingredientRef: { create: { name: 'String4297388' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Ingredient, 'ingredient'>
