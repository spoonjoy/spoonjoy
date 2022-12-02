import { Prisma } from '@prisma/client'
import { Recipe, User } from 'types/graphql'

import {
  userScenarioData,
  standard as userScenario,
} from '../users/users.scenarios'

// This is type Prisma.RecipeInclude, but if you include it here, it'll throw off the generated type for any returned objects (ie from findUnique)
export const recipeIncludeAllRelations = {
  chef: true,
  steps: {
    include: {
      ingredients: {
        include: {
          ingredientRef: true,
          unit: true,
        },
      },
      usingSteps: {
        include: {
          outputOfStep: true,
          inputOfStep: true,
        },
      },
    },
  },
}

// I believe this is necessary so that this scenario will exist for the recipe tests, but there may be a better way to do this
export const userOnlyScenario = userScenario

export type StandardScenario = {
  user: Record<keyof typeof userScenarioData, User>
  recipe: Record<keyof typeof recipeScenarioData, Recipe>
}

export const getPizzaScenarioData = (
  chefId: string
): Prisma.RecipeCreateArgs['data'] => ({
  chefId,
  title: 'Yummy pizza',
  description: "The yummiest pizza you've ever had.",
  servings: 2,
  steps: {
    create: [
      {
        stepNum: 1,
        stepTitle: 'First step',
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
        stepTitle: 'Second step',
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
})

export const getDeletedPizzaScenarioData = (
  chefId: string
): Prisma.RecipeCreateArgs['data'] => ({
  chefId,
  deletedAt: new Date(), // This is otherwise the same as the above recipe
  title: 'Yummy deleted pizza',
  description: "The yummiest pizza you've ever had.",
  servings: 2,
  steps: {
    create: [
      {
        stepNum: 1,
        stepTitle: 'First step',
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
        stepTitle: 'Second step',
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
})

export const bobsRecipeScenarioData = {
  bobsPizza: (scenario: StandardScenario): Prisma.RecipeCreateArgs => ({
    data: getPizzaScenarioData(scenario.user.bob.id),
    include: recipeIncludeAllRelations,
  }),
}
export const deletedBobsRecipeScenarioData = {
  deletedBobsPizza: (scenario: StandardScenario): Prisma.RecipeCreateArgs => ({
    data: getDeletedPizzaScenarioData(scenario.user.bob.id),
    include: recipeIncludeAllRelations,
  }),
}

export const lindasRecipeScenarioData = {
  lindasPizza: (scenario: StandardScenario): Prisma.RecipeCreateArgs => ({
    data: getPizzaScenarioData(scenario.user.linda.id),
    include: recipeIncludeAllRelations,
  }),
}

export const deletedLindasRecipeScenarioData = {
  deletedPizza: (scenario: StandardScenario): Prisma.RecipeCreateArgs => ({
    data: getDeletedPizzaScenarioData(scenario.user.linda.id),
    include: recipeIncludeAllRelations,
  }),
}

export const recipeScenarioData = {
  ...bobsRecipeScenarioData,
  ...lindasRecipeScenarioData,
}

export const deletedRecipeScenarioData = {
  ...deletedBobsRecipeScenarioData,
  ...deletedLindasRecipeScenarioData,
}

export const standard = {
  user: userScenarioData,
  recipe: { ...recipeScenarioData, ...deletedRecipeScenarioData },
}
