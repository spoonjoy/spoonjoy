import { CreateRecipeInput, User } from 'types/graphql'

import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { ingredient, Ingredient } from '../ingredients/ingredients'
import { RecipeStep } from '../recipeSteps/recipeSteps'
import { StandardScenario as UserScenario } from '../users/users.scenarios'

import {
  recipes,
  recipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  Recipe,
} from './recipes'
import {
  recipeIncludeAllRelations,
  StandardScenario as RecipeScenario,
} from './recipes.scenarios'
import {
  IRecipeResponse,
  mapRecipeDbResponseToMutationInput,
} from './recipeUtilities'
// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('recipes', () => {
  beforeEach(() => {
    mockCurrentUser(null) // TODO this is actually allowed but redwood types need to be updated
  })
  scenario('returns all recipes', async (scenario: RecipeScenario) => {
    const result = await recipes()
    expect(result.length).toEqual(Object.keys(scenario.recipe).length)
  })

  scenario('returns a single recipe', async (scenario: RecipeScenario) => {
    const { pizza } = scenario.recipe

    const numOfSingleAssertions = 1 // Chef check
    const numOfSteps = pizza.steps.length
    const numOfIngredientsTotal = pizza.steps.reduce((totalNumIng, step) => {
      return totalNumIng + step!.ingredients.length
    }, 0)
    const numAssertionsPerStep = 2 // Update based on below steps.forEach
    const numAssertionsPerIng = 3 // Update based on below ingredientsByStep[stepIdx].forEach

    expect.assertions(
      numOfSingleAssertions +
        numOfSteps * numAssertionsPerStep +
        numOfIngredientsTotal * numAssertionsPerIng
    ) // This will need to be updated if the scenario is updated

    const result = await recipe({ id: pizza.id })

    Recipe.chef!({}, { root: result }).then((chef: User) => {
      expect(chef).toEqual(pizza.chef)
    })

    const steps = await Recipe.steps({}, { root: result })
    const ingredientsByStep = await Promise.all(
      steps.map((step) => {
        return RecipeStep.ingredients({}, { root: step })
      })
    )
    steps.forEach((returnedStep, stepIdx) => {
      const scenarioStep = pizza.steps[stepIdx] as typeof RecipeStep

      // TODO fix all these weird type issues
      expect(returnedStep!.stepNum).toEqual(scenarioStep.stepNum)
      expect(returnedStep!.description).toEqual(scenarioStep.description)

      ingredientsByStep[stepIdx].forEach((returnedIng, ingIdx) => {
        const scenarioIng = scenarioStep.ingredients[ingIdx]

        expect(returnedIng!.quantity).toEqual(scenarioIng.quantity)
        expect(returnedIng!.ingredientRefId).toEqual(
          scenarioIng.ingredientRefId
        )
        expect(returnedIng!.unitId).toEqual(scenarioIng.unitId)
      })
    })
  })

  const recipeMutationInput: { input: CreateRecipeInput } = {
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

  scenario(
    'userOnlyScenario',
    'fails to create a recipe while not logged in',
    async () => {
      expect.assertions(1)
      expect(() => {
        createRecipe(recipeMutationInput)
      }).toThrow()
    }
  )

  scenario(
    'userOnlyScenario',
    'creates a recipe while logged in',
    async (scenario: UserScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })

      const result = await createRecipe(recipeMutationInput)
      const resultWithRelations = await db.recipe.findUnique({
        where: { id: result.id },
        include: recipeIncludeAllRelations,
      })

      const { input } = recipeMutationInput
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

  scenario(
    'fails to update a recipe when not logged in',
    async (scenario: RecipeScenario) => {
      const original = await db.recipe.findUnique({
        where: { id: scenario.recipe.pizza.id },
        include: recipeIncludeAllRelations,
      })
      const updated = mapRecipeDbResponseToMutationInput(
        original as unknown as IRecipeResponse
      )

      const updatedInput = {
        id: original!.id,
        input: updated.input,
      }

      expect.assertions(1)
      try {
        await updateRecipe(updatedInput)
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
    }
  )

  scenario(
    'updates a recipe while logged in',
    async (scenario: RecipeScenario) => {
      await db.user
        .findUnique({
          where: { id: scenario.recipe.pizza.chef.id },
        })
        .then((user) => {
          mockCurrentUser({
            id: user!.id,
            username: user!.username,
          })
        })

      const original = await db.recipe.findUnique({
        where: { id: scenario.recipe.pizza.id },
        include: recipeIncludeAllRelations,
      })
      const updated = mapRecipeDbResponseToMutationInput(
        original as unknown as IRecipeResponse
      )

      updated.input.title = 'New title!'
      updated.input.description = 'New description!'
      updated.input.servings = 10000
      updated.input.steps = [
        {
          stepNum: 1,
          description: 'new first step!',
          ingredients: [
            {
              quantity: 500,
              unitName: 'grams',
              ingredientName: 'yumminess',
            },
          ],
        },
        {
          stepNum: 2,
          description: 'new second step!',
          ingredients: [
            {
              quantity: 500.2348,
              unitName: 'grams',
              ingredientName: 'yumminess',
            },
            {
              quantity: 2000.234,
              unitName: 'mlems',
              ingredientName: 'toast',
            },
            {
              quantity: 2384.29,
              unitName: 'grams',
              ingredientName: 'yumminess',
            },
            {
              quantity: 2384892.23938,
              unitName: 'fruits',
              ingredientName: 'labor',
            },
          ],
        },
      ]

      const result = await updateRecipe({
        id: original!.id,
        input: updated.input,
      })
      const resultWithRelations = await db.recipe.findUnique({
        where: { id: result.id },
        include: recipeIncludeAllRelations,
      })

      expect(resultWithRelations).toBeTruthy()
      if (resultWithRelations) {
        const { chef, title, steps, description, servings } =
          resultWithRelations
        expect(chef!.id).toBe(scenario.recipe.pizza.chefId)
        expect(title).toBe(updated.input.title)
        expect(description).toBe(updated.input.description)
        expect(servings).toBe(updated.input.servings)

        expect(steps.length).toBe(updated.input.steps.length)
        steps.forEach((step, sIdx) => {
          expect(step.description).toBe(updated.input.steps[sIdx]?.description)
          expect(step.stepNum).toBe(updated.input.steps[sIdx]?.stepNum)
          expect(step.stepNum).toBe(updated.input.steps[sIdx]?.stepNum)
          expect(step.ingredients.length).toBe(
            updated.input.steps[sIdx]?.ingredients.length
          )
          step.ingredients.forEach((ingredient, iIdx) => {
            expect(ingredient.quantity).toBe(
              updated.input.steps[sIdx]?.ingredients[iIdx]?.quantity
            )
            expect(ingredient.ingredientRef.name).toBe(
              updated.input.steps[sIdx]?.ingredients[iIdx]?.ingredientName
            )
            expect(ingredient.unit.name).toBe(
              updated.input.steps[sIdx]?.ingredients[iIdx]?.unitName
            )
          })
        })
      } else {
        fail('No recipe got returned!')
      }
    }
  )

  scenario(
    'deletes a recipe while logged in',
    async (scenario: RecipeScenario) => {
      await db.user
        .findUnique({
          where: { id: scenario.recipe.pizza.chefId },
        })
        .then((user) => {
          mockCurrentUser({
            id: user!.id,
            username: user!.username,
          })
        })
      const original = await recipe({ id: scenario.recipe.pizza.id })

      const result = await deleteRecipe({
        id: scenario.recipe.pizza.id,
      })

      expect(original?.deletedAt).toBe(null)
      expect(result?.deletedAt).not.toBe(null)
    }
  )

  scenario(
    "can't delete another user's recipe",
    async (scenario: RecipeScenario) => {
      mockCurrentUser({
        id: scenario.user.linda.id,
        username: scenario.user.linda.username,
      })

      expect.assertions(1)
      try {
        await deleteRecipe({
          id: scenario.recipe.pizza.id,
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You can only delete your own recipes!')
        )
      }
    }
  )

  scenario(
    "can't delete a recipe while not logged in",
    async (scenario: RecipeScenario) => {
      expect.assertions(1)
      try {
        await deleteRecipe({
          id: scenario.recipe.pizza.id,
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
    }
  )
})
