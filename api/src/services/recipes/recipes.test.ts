import { ServiceValidationError } from '@redwoodjs/api'
import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { RecipeStep } from '../recipeSteps/recipeSteps'
import { StandardScenario as UserScenario } from '../users/users.scenarios'

import {
  recipeMutationInputIngsOnly,
  recipeMutationInputNoIngOrStepUses,
} from './recipeMockMutationInputs'
import {
  recipes,
  recipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  Recipe,
  myRecipes,
} from './recipes'
import {
  deletedRecipeScenarioData,
  lindasRecipeScenarioData,
  recipeIncludeAllRelations,
  recipeScenarioData,
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

  scenario(
    "returns all recipes that don't have 'deletedAt' set",
    async (scenario: RecipeScenario) => {
      const result = await recipes()
      const numDeletedRecipes = Object.keys(deletedRecipeScenarioData).length
      const numNotDeletedRecipes = Object.keys(recipeScenarioData).length
      expect(numDeletedRecipes > 0)
      expect(numNotDeletedRecipes > 0)
      expect(Object.keys(scenario.recipe).length).toEqual(
        numDeletedRecipes + numNotDeletedRecipes
      )
      expect(result.length).toEqual(numNotDeletedRecipes)
    }
  )

  scenario(
    "throws an error if a user that's not logged in tries to get their own recipes",
    async () => {
      expect.assertions(1)
      try {
        await myRecipes()
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
    }
  )

  scenario(
    'allows a logged in user to get their own (non-deleted) recipes',
    async (scenario: RecipeScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })
      const result = await myRecipes()
      expect(Object.keys(recipeScenarioData).length).toEqual(
        result.length + Object.keys(lindasRecipeScenarioData).length
      )
      expect(result.length)
    }
  )

  scenario('returns a single recipe', async (scenario: RecipeScenario) => {
    const { bobsPizza } = scenario.recipe

    const numOfSingleAssertions = 1 // Chef check
    const numOfSteps = bobsPizza.steps.length
    const numOfIngredientsTotal = bobsPizza.steps.reduce(
      (totalNumIng, step) => {
        return totalNumIng + step!.ingredients!.length
      },
      0
    )
    const numAssertionsPerStep = 2 // Update based on below steps.forEach
    const numAssertionsPerIng = 3 // Update based on below ingredientsByStep[stepIdx].forEach

    expect.assertions(
      numOfSingleAssertions +
        numOfSteps * numAssertionsPerStep +
        numOfIngredientsTotal * numAssertionsPerIng
    ) // This will need to be updated if the scenario is updated

    const result = await recipe({
      id: bobsPizza.id,
    })

    const chef = await Recipe.chef({}, { root: result })
    expect(chef).toEqual(bobsPizza.chef)

    const steps = await Recipe.steps({}, { root: result })
    const ingredientsByStep = await Promise.all(
      steps.map((step) => {
        return RecipeStep.ingredients({}, { root: step })
      })
    )
    steps.forEach((returnedStep, stepIdx) => {
      const scenarioStep = bobsPizza.steps[
        stepIdx
      ] as unknown as typeof RecipeStep

      // TODO fix all these weird type issues
      expect(returnedStep.stepNum).toEqual(scenarioStep.stepNum)
      expect(returnedStep.description).toEqual(scenarioStep.description)

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

  scenario(
    'userOnlyScenario',
    'fails to create a recipe while not logged in',
    async () => {
      expect.assertions(1)
      try {
        await createRecipe(recipeMutationInputIngsOnly)
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
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

      // TODO update this with non-hardcoded number
      expect.assertions(11)

      const result = await createRecipe(recipeMutationInputIngsOnly)
      const resultWithRelations = await db.recipe.findUnique({
        where: { id: result.id },
        include: recipeIncludeAllRelations,
      })

      const { input } = recipeMutationInputIngsOnly
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
            input.steps[idx]!.ingredients!.length
          )
        })
      } else {
        fail('No recipe got returned!')
      }
    }
  )

  scenario(
    'userOnlyScenario',
    "can't create recipe without ingredients or stepUses on all steps",
    async (scenario: UserScenario) => {
      mockCurrentUser({
        id: scenario.user.bob.id,
        username: scenario.user.bob.username,
      })

      expect.assertions(2)
      try {
        await createRecipe(recipeMutationInputNoIngOrStepUses)
      } catch (e) {
        expect(e).toMatchObject({
          name: 'ServiceValidationError',
        })
        expect(e).toStrictEqual(
          new ServiceValidationError(
            'Error: Step 1 must use at least one ingredient OR the output of at least one previous step,Error: Step 2 must use at least one ingredient OR the output of at least one previous step'
          )
        )
      }
    }
  )

  scenario(
    'fails to update a recipe when not logged in',
    async (scenario: RecipeScenario) => {
      const original = await db.recipe.findUnique({
        where: { id: scenario.recipe.bobsPizza.id },
        include: recipeIncludeAllRelations,
      })
      const updated = mapRecipeDbResponseToMutationInput(
        original as unknown as IRecipeResponse // this type is actually derived from the generated type of 'original'
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
    "can't update another user's recipe",
    async (scenario: RecipeScenario) => {
      mockCurrentUser({
        id: scenario.user.linda.id,
        username: scenario.user.linda.username,
      })

      const original = await db.recipe.findUnique({
        where: { id: scenario.recipe.bobsPizza.id },
        include: recipeIncludeAllRelations,
      })
      const updated = mapRecipeDbResponseToMutationInput(
        original as unknown as IRecipeResponse // this type is actually derived from the generated type of 'original'
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
          new RedwoodGraphQLError('You can only modify your own recipes!')
        )
      }
    }
  )

  scenario(
    'updates a recipe while logged in',
    async (scenario: RecipeScenario) => {
      await db.user
        .findUnique({
          where: { id: scenario.recipe.bobsPizza.chef.id },
        })
        .then((user) => {
          mockCurrentUser({
            id: user!.id,
            username: user!.username,
          })
        })

      const original = await db.recipe.findUnique({
        where: { id: scenario.recipe.bobsPizza.id },
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
              ingredientName: 'tastiness',
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
        expect(chef!.id).toBe(scenario.recipe.bobsPizza.chefId)
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
          where: { id: scenario.recipe.bobsPizza.chefId },
        })
        .then((user) => {
          mockCurrentUser({
            id: user!.id,
            username: user!.username,
          })
        })
      const original = await recipe({ id: scenario.recipe.bobsPizza.id })

      const result = await deleteRecipe({
        id: scenario.recipe.bobsPizza.id,
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
          id: scenario.recipe.bobsPizza.id,
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You can only modify your own recipes!')
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
          id: scenario.recipe.bobsPizza.id,
        })
      } catch (e) {
        expect(e).toMatchObject(
          new RedwoodGraphQLError('You are not logged in!')
        )
      }
    }
  )
})
