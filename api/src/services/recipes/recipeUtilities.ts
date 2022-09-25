import type { Prisma, RecipeStep, Ingredient } from '@prisma/client'
import {
  CreateRecipeStepInput,
  CreateIngredientInput,
  InputMaybe,
} from 'types/graphql'

import type { ScenarioData } from '@redwoodjs/testing/api'

// The below types are created based on the recipe scenarios. Trying to use the generated Prisma types was too...nonsensical
export interface IConnectOrCreate {
  where: {
    name: string
  }
  create: {
    name: string
  }
}
export interface IIngredientsDbInput {
  create: Array<{
    quantity: number
    unit: {
      connectOrCreate: IConnectOrCreate
    }
  }>
}
export interface IStepsDbInput {
  create: Array<{
    stepNum: number
    description: string
    ingredients: IIngredientsDbInput
  }>
}

export interface IUnitDbOutput {
  name: string
}

export interface IIngredientRefDbOutput {
  name: string
}

export interface IIngredientDbOutput {
  quantity: number
  unit: IUnitDbOutput
  ingredientRef: IIngredientRefDbOutput
}

export interface IRecipeStepDbOutput {
  stepNum: number
  description?: string
  ingredients: IIngredientDbOutput[]
}

export const mapIngredientsDbInputToMutationInput = (
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

export const mapStepsDbInputToMutationInput = (
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

export const mapIngredientsDbResponseToMutationInput = (
  ingredients: IIngredientDbOutput[]
): InputMaybe<CreateIngredientInput>[] => {
  return ingredients.map((ingredient) => {
    const { quantity, unit, ingredientRef } = ingredient
    return {
      quantity,
      unitName: unit.name,
      ingredientName: ingredientRef.name,
    }
  })
}

export const mapStepsDbResponseToMutationInput = (
  steps: IRecipeStepDbOutput[]
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

export const mapIngredientsMutationInputToDbInput = (
  ingredients: InputMaybe<CreateIngredientInput>[]
): Prisma.IngredientCreateNestedManyWithoutRecipeStepInput => {
  return {
    create: ingredients.map((ingredient) => {
      const { quantity, unitName, ingredientName } = ingredient!
      return {
        quantity,
        unit: {
          connectOrCreate: {
            where: { name: unitName.toLowerCase() },
            create: { name: unitName.toLowerCase() },
          },
        },
        ingredientRef: {
          connectOrCreate: {
            where: { name: ingredientName.toLowerCase() },
            create: { name: ingredientName.toLowerCase() },
          },
        },
      }
    }),
  }
}

export const mapStepsMutationInputToDbInput = (
  steps: InputMaybe<CreateRecipeStepInput>[]
): Prisma.RecipeStepCreateNestedManyWithoutRecipeInput | undefined => {
  return {
    create: steps.map((step) => {
      const { stepNum, description, ingredients } = step!
      return {
        stepNum,
        description,
        ingredients: mapIngredientsMutationInputToDbInput(ingredients),
      }
    }),
  }
}
