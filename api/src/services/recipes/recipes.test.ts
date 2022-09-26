import type { Recipe } from '@prisma/client'
import { CreateRecipeInput } from 'types/graphql'

import { removeNulls } from '@redwoodjs/api'

import { db } from 'src/lib/db'

import {
  recipes,
  recipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from './recipes'
import {
  recipeIncludeAllRelations,
  StandardScenario as RecipeScenario,
  UserScenario,
} from './recipes.scenarios'
// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('recipes', () => {
  scenario('returns all recipes', async (scenario: RecipeScenario) => {
    const result = await recipes()

    expect(result.length).toEqual(Object.keys(scenario.recipe).length)
  })

  scenario('returns a single recipe', async (scenario: RecipeScenario) => {
    const result = await recipe({ id: scenario.recipe.pizza.id })

    expect(result).toEqual(scenario.recipe.pizza)
  })

  scenario(
    'createdUser',
    'creates a recipe',
    async (scenario: UserScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })

      const mutationInput: { input: CreateRecipeInput } = {
        input: {
          title: 'Pizza!',
          description: "The yummiest pizza you've ever had.",
          servings: 2,
          steps: [
            {
              stepNum: 1,
              description: 'first step!',
              ingredients: [
                {
                  quantity: 1.5,
                  unitName: 'pounds',
                  ingredientName: 'cheese',
                },
                {
                  quantity: 2,
                  unitName: 'gallons',
                  ingredientName: 'tomato sauce',
                },
              ],
            },
            {
              stepNum: 2,
              description: null,
              ingredients: [
                {
                  quantity: 1.0,
                  unitName: 'stick',
                  ingredientName: 'butter',
                },
                {
                  quantity: 19,
                  unitName: 'loaf',
                  ingredientName: 'toast',
                },
              ],
            },
          ],
        },
      }

      const result = await createRecipe(mutationInput)
      const resultWithRelations = await db.recipe.findUnique({
        where: { id: result.id },
        include: recipeIncludeAllRelations,
      })

      const { input } = mutationInput
      const { bob } = scenario.user

      expect(resultWithRelations).toBeTruthy()
      if (resultWithRelations) {
        const { chef, title, steps, description } = resultWithRelations
        expect(chef.username).toEqual(bob.username)
        expect(title).toEqual(input.title)
        expect(description).toEqual(input.description)
        expect(steps.length).toEqual(input.steps.length)

        steps.forEach((step, idx) => {
          expect(step.stepNum).toBe(input.steps[idx]?.stepNum)
          expect(step.description).toBe(input.steps[idx]?.description)

          expect(step.ingredients.length).toBe(
            input.steps[idx]?.ingredients.length
          )
        })
      } else {
        fail('No recipe got returned!')
      }
    }
  )

  //   scenario('updates a recipe', async (scenario: RecipeScenario) => {
  //     const original = (await recipe({ id: scenario.recipe.one.id })) as Recipe
  //     const result = await updateRecipe({
  //       id: original.id,
  //       input: { title: 'String2' },
  //     })

  //     expect(result.title).toEqual('String2')
  //   })

  //   scenario('deletes a recipe', async (scenario: RecipeScenario) => {
  //     const original = (await deleteRecipe({
  //       id: scenario.recipe.one.id,
  //     })) as Recipe
  //     const result = await recipe({ id: original.id })

  //     expect(result).toEqual(null)
  //   })
})
