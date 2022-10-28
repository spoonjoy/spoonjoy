import type { Prisma, RecipeStep, Ingredient } from '@prisma/client'
import {
  CreateRecipeStepInput,
  CreateIngredientInput,
  UpdateRecipeStepInput,
  UpdateIngredientInput,
  CreateStepOutputUseInput,
  InputMaybe,
  Recipe,
  User,
  CreateRecipeInput,
  IngredientRef,
  Unit,
  UpdateRecipeInput,
} from 'types/graphql'

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
    ingredientRef: {
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
// export type IIngredientDbOutput = Ingredient & {
//   ingredientRef: IngredientRef
//   unit: Unit
// }

export interface IRecipeStepDbOutput {
  stepNum: number
  description: string
  ingredients: IIngredientDbOutput[]
}
// export type IRecipeStepDbOutput = Maybe<RecipeStep>[] &
//   (RecipeStep & {
//     ingredients: IIngredientDbOutput[]
//   })[]

export const mapIngredientsDbInputToMutationInput = (
  ingredients: IIngredientsDbInput
): InputMaybe<CreateIngredientInput>[] => {
  return ingredients.create.map((ingredient) => {
    const { quantity, unit, ingredientRef } = ingredient
    return {
      quantity,
      unitName: unit.connectOrCreate.where.name,
      ingredientName: ingredientRef.connectOrCreate.where.name,
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
): UpdateRecipeStepInput[] => {
  return steps.map((step) => {
    const { stepNum, description, ingredients, recipeId } = step
    return {
      recipeId,
      stepNum,
      description,
      ingredients: mapIngredientsDbResponseToMutationInput(ingredients),
    }
  })
}

// this was copied from the generated return type of db.recipe.findUnique with the included relations.
export type IRecipeResponse = Recipe & {
  chef: User
  steps: (RecipeStep & {
    ingredients: (Ingredient & {
      ingredientRef: IngredientRef
      unit: Unit
    })[]
  })[]
}

export const mapRecipeDbResponseToMutationInput = (
  recipe: IRecipeResponse
): { input: UpdateRecipeInput } => {
  const { title, description, servings, steps } = recipe
  return {
    input: {
      title: title,
      description,
      servings,
      steps: mapStepsDbResponseToMutationInput(steps as IRecipeStepDbOutput[]),
    },
  }
}

export const mapIngredientsMutationInputToDbCreateInput = (
  ingredients: CreateIngredientInput[]
): Prisma.IngredientCreateNestedManyWithoutRecipeStepInput => {
  return {
    create: ingredients.map((ingredient) => {
      const { quantity, unitName, ingredientName } = ingredient
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

export const mapStepOutputUsesMutationInputToDbCreateInput = (
  recipeId: string,
  stepOutputUses: CreateStepOutputUseInput[]
): Prisma.StepOutputUseCreateNestedManyWithoutInputOfStepInput => {
  return {
    create: stepOutputUses.map((stepOutputUse) => {
      const { outputOfStepNum } = stepOutputUse
      return {
        outputOfStep: {
          connect: { recipeId_stepNum: { recipeId, stepNum: outputOfStepNum } },
        },
      }
    }),
  }
}

export const mapStepsMutationInputToDbCreateInputNoStepOutputUses = (
  steps: CreateRecipeStepInput[]
): Prisma.RecipeStepUpdateManyWithoutRecipeNestedInput => {
  return {
    create: steps.map((step) => {
      const { stepNum, description, ingredients } = step
      return {
        stepNum,
        description,
        ingredients: ingredients
          ? mapIngredientsMutationInputToDbCreateInput(ingredients)
          : undefined,
      }
    }),
  }
}

export const mapIngredientsMutationInputToDbUpdateInput = (
  ingredients: UpdateIngredientInput[]
): Prisma.IngredientUpdateManyWithoutRecipeStepNestedInput => {
  // const allIngIds = ingredients.map((ingredient) => {
  //   return ingredient!.id!
  // })
  return {
    deleteMany: {}, // delete them all! TODO: delete only the ones *not* being updated
    upsert: ingredients.map((ingredient) => {
      const { quantity, unitName, ingredientName } = ingredient
      return {
        where: {
          recipeId_stepNum_unitId_ingredientRefId: {
            // TODO figure out how to get these IDs in here
            recipeId: 'noid',
            stepNum: -1,
            unitId: 'noid',
            ingredientRefId: 'noid',
          },
        },
        update: {
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
        },
        create: {
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
        },
      }
    }),
  }
}

export const mapStepsMutationInputToDbUpdateInput = (
  steps: UpdateRecipeStepInput[],
  recipeId: string
): Prisma.RecipeStepUpdateManyWithoutRecipeNestedInput | undefined => {
  return {
    upsert: steps.map((step) => {
      const { stepNum, description, ingredients } = step
      return {
        where: {
          recipeId_stepNum: {
            recipeId: recipeId,
            stepNum: stepNum,
          },
        },
        update: {
          stepNum,
          description,
          ingredients:
            ingredients &&
            mapIngredientsMutationInputToDbUpdateInput(ingredients),
        },
        create: {
          stepNum,
          description,
          ingredients:
            ingredients &&
            mapIngredientsMutationInputToDbCreateInput(
              ingredients as CreateIngredientInput[] // these types overlap enough to do this
            ),
        },
      }
    }),
    deleteMany: {
      stepNum: {
        // because stepNum is 1 indexed, the length is the stepNum
        // so, for example, if there are 3 steps, we want to delete any steps with a stepNum > 3
        gt: steps.length,
      },
    },
  }
}
