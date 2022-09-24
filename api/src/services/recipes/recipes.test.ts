import type { Recipe, RecipeStep, Ingredient } from '@prisma/client'
import {
  CreateRecipeStepInput,
  CreateIngredientInput,
  InputMaybe,
} from 'types/graphql'

import type { ScenarioData } from '@redwoodjs/testing/api'

import {
  recipes,
  recipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from './recipes'
import type { StandardScenario } from './recipes.scenarios'

// The below types are created based on the recipe scenarios. Trying to use the generated Prisma types was too...nonsensical
interface IConnectOrCreate {
  where: {
    name: string
  }
  create: {
    name: string
  }
}

interface IIngredientsDbInput {
  create: Array<{
    quantity: number
    unit: {
      connectOrCreate: IConnectOrCreate
    }
  }>
}

interface IStepsDbInput {
  create: Array<{
    stepNum: number
    description: string
    ingredients: IIngredientsDbInput
  }>
}

const mapIngredientsDbInputToMutationInput = (
  ingredients: IIngredientsDbInput
): InputMaybe<CreateIngredientInput>[] => {
  return ingredients.create.map((ingredient) => {
    const { quantity, unit, ingredientName } = ingredient
    return {
      quantity,
      unitName: unit.connectOrCreate.where.name,
      ingredientName,
    }
  })
}

const mapStepsDbInputToMutationInput = (
  steps: IStepsDbInput
): InputMaybe<CreateRecipeStepInput>[] => {
  return steps.create.map((step) => {
    const { stepNum, description, ingredients } = step
    return {
      stepNum,
      description,
      ingredients: mapIngredientsDbInputToMutationInput(ingredients),
    }
  })
}

const mapIngredientsDbResponseToMutationInput = (
  ingredients: ScenarioData<Ingredient>[]
): InputMaybe<CreateIngredientInput>[] => {
  return ingredients.map((ingredient) => {
    const { quantity, unit, ingredientName } = ingredient
    return {
      quantity,
      unitName: unit.connectOrCreate.where.name,
      ingredientName,
    }
  })
}

const mapStepsDbResponseToMutationInput = (
  steps: ScenarioData<RecipeStep>[]
): InputMaybe<CreateRecipeStepInput>[] => {
  return steps.map((step) => {
    const { stepNum, description, ingredients } = step
    return {
      stepNum,
      description,
      ingredients: mapIngredientsDbResponseToMutationInput(ingredients),
    }
  })
}

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('recipes', () => {
  scenario('returns all recipes', async (scenario: StandardScenario) => {
    const result = await recipes()

    expect(result.length).toEqual(Object.keys(scenario.recipe).length)
  })

  scenario('returns a single recipe', async (scenario: StandardScenario) => {
    const result = await recipe({ id: scenario.recipe.one.id })

    expect(result).toEqual(scenario.recipe.one)
  })

  scenario('creates a recipe', async (scenario: StandardScenario) => {
    const { pizza } = scenario.recipe
    const { chef } = pizza

    mockCurrentUser({
      id: chef.id,
      username: chef.username,
      email: chef.email,
    })

    const { title, description, servings, steps } = pizza

    const result = await createRecipe({
      input: {
        title,
        description,
        servings,
        steps: mapStepsDbResponseToMutationInput(steps),
      },
    })

    expect(result.title).toEqual('String')
    expect(result.chef.username).toEqual('ari')
  })

  scenario('updates a recipe', async (scenario: StandardScenario) => {
    const original = (await recipe({ id: scenario.recipe.one.id })) as Recipe
    const result = await updateRecipe({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a recipe', async (scenario: StandardScenario) => {
    const original = (await deleteRecipe({
      id: scenario.recipe.one.id,
    })) as Recipe
    const result = await recipe({ id: original.id })

    expect(result).toEqual(null)
  })
})
