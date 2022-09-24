import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  RecipeRelationResolvers,
  CreateRecipeStepInput,
  InputMaybe,
  CreateIngredientInput,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const recipes: QueryResolvers['recipes'] = () => {
  return db.recipe.findMany()
}

export const recipe: QueryResolvers['recipe'] = ({ id }) => {
  return db.recipe.findUnique({
    where: { id },
  })
}

const mapIngredientsMutationInputToDbInput = (
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

const mapStepsMutationInputToDbInput = (
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

export const createRecipe: MutationResolvers['createRecipe'] = ({ input }) => {
  requireAuth()

  const { title, description, servings, steps } = input

  const dbInput: Prisma.RecipeCreateInput = {
    title,
    description,
    servings,
    chef: {
      connect: {
        id: context.currentUser!.id,
      },
    },
    steps: mapStepsMutationInputToDbInput(steps),
  }

  return db.recipe.create({
    data: dbInput,
  })
}

export const updateRecipe: MutationResolvers['updateRecipe'] = ({
  id,
  input,
}) => {
  return db.recipe.update({
    data: input,
    where: { id },
  })
}

export const deleteRecipe: MutationResolvers['deleteRecipe'] = ({ id }) => {
  return db.recipe.delete({
    where: { id },
  })
}

export const Recipe: RecipeRelationResolvers = {
  chef: (_obj, { root }) => {
    return db.recipe.findUnique({ where: { id: root?.id } }).chef()
  },
  steps: (_obj, { root }) => {
    return db.recipe.findUnique({ where: { id: root?.id } }).steps()
  },
}
