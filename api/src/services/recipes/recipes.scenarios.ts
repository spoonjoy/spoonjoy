import type { Prisma, Recipe } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

interface RecipeCreateNoChefArgs {
  data: Prisma.RecipeCreateWithoutChefInput
}

export const standard = defineScenario<RecipeCreateNoChefArgs>({
  recipe: {
    pizza: {
      data: {
        title: 'Yummy pizza',
        description: "The yummiest pizza you've ever had.",
        servings: 2,
        steps: {
          create: [
            {
              stepNum: 1,
              description: 'First step, do a thing',
              ingredients: {
                create: [
                  {
                    quantity: 1.0,
                    unit: {
                      connectOrCreate: {
                        where: { name: 'pound' },
                        create: { name: 'pound' },
                      },
                    },
                    ingredientRef: {
                      connectOrCreate: {
                        where: { name: 'cheese' },
                        create: { name: 'cheese' },
                      },
                    },
                  },
                ],
              },
            },
            {
              stepNum: 2,
              description: 'Next, eat some toast!',
              ingredients: {
                create: [
                  {
                    quantity: 1.5,
                    unit: {
                      connectOrCreate: {
                        where: { name: 'loaf' },
                        create: { name: 'loaf' },
                      },
                    },
                    ingredientRef: {
                      connectOrCreate: {
                        where: { name: 'toast' },
                        create: { name: 'toast' },
                      },
                    },
                  },
                  {
                    quantity: 1.0,
                    unit: {
                      connectOrCreate: {
                        where: { name: 'stick' },
                        create: { name: 'stick' },
                      },
                    },
                    ingredientRef: {
                      connectOrCreate: {
                        where: { name: 'butter' },
                        create: { name: 'butter' },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Recipe, 'recipe'>
