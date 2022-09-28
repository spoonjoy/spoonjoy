import { Prisma } from '@prisma/client'
import { Recipe, User } from 'types/graphql'

import type { ScenarioData } from '@redwoodjs/testing/api'

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
    },
  },
}

const userInput = {
  user: {
    bob: {
      data: {
        email: 'bob@spoonjoy.app',
        username: 'bob',
        hashedPassword: 'string',
        salt: 'string',
      },
    },
    linda: {
      data: {
        email: 'linda@spoonjoy.app',
        username: 'linda',
        hashedPassword: 'string',
        salt: 'string',
      },
    },
  },
}

export type StandardScenario = ScenarioData<Recipe, 'recipe', 'user'>
export const standard = defineScenario<
  Prisma.RecipeCreateArgs | Prisma.UserCreateArgs,
  'recipe' | 'user'
>({
  user: userInput.user,
  recipe: {
    // this is actually fine, but the type system probably needs to be updated
    pizza: (scenario) => ({
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
  },
})

export const createdUser = defineScenario<Prisma.UserCreateArgs>(userInput)

export type UserScenario = ScenarioData<User, 'user'>
