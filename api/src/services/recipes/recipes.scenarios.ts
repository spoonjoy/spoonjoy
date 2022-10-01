import { Prisma } from '@prisma/client'
import { Recipe, User } from 'types/graphql'

import {
  userScenarioDataTyped,
  standard as userScenario,
} from '../users/users.scenarios'

export const recipeIncludeAllRelations: Prisma.RecipeInclude = {
  chef: true,
  steps: {
    include: {
      ingredients: {
        include: {
          ingredientRef: true,
          unit: true,
        },
      },
    },
  },
}

// I believe this is necessary so that this scenario will exist for the recipe tests, but there may be a better way to do this
export const userOnlyScenario = userScenario

export type StandardScenario = {
  user: Record<keyof typeof userScenarioDataTyped, User>
  recipe: Record<keyof typeof recipeScenarioData, Recipe>
}

const recipeScenarioData = {
  pizza: (scenario: StandardScenario): Prisma.RecipeCreateArgs => ({
    data: {
      chefId: scenario.user.bob.id,
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
    include: recipeIncludeAllRelations,
  }),
}

export const standard = {
  user: userScenarioDataTyped,
  recipe: recipeScenarioData,
}
