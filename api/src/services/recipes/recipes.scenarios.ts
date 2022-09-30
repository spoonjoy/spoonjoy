import { Prisma } from '@prisma/client'
import { Recipe, User } from 'types/graphql'

import type { ScenarioData } from '@redwoodjs/testing/api'

import { userScenarioData } from '../users/users.scenarios'

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

// TODO this is really the type of Prisma.RecipeCreateArgs but adding it in pisses off the typechecker
const getFirstRecipeData = (chefId: string) => {
  return {
    data: {
      chefId: chefId,
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
  }
}

export type StandardScenario = ScenarioData<Recipe, 'recipe', 'user'>
export const standard = defineScenario<
  Prisma.RecipeCreateArgs | Prisma.UserCreateArgs,
  'recipe' | 'user'
>({
  user: userScenarioData.user,
  recipe: {
    // TODO: this is actually fine, but the type system probably needs to be updated
    pizza: (scenario) => getFirstRecipeData(scenario.user.bob.id),
  },
})

export const createdUser =
  defineScenario<Prisma.UserCreateArgs>(userScenarioData)

export type UserScenario = ScenarioData<User, 'user'>
