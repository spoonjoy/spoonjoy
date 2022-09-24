import type {
  QueryResolvers,
  MutationResolvers,
  RecipeStepRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const recipeSteps: QueryResolvers['recipeSteps'] = () => {
  return db.recipeStep.findMany()
}

export const recipeStep: QueryResolvers['recipeStep'] = ({ id }) => {
  return db.recipeStep.findUnique({
    where: { id },
  })
}

export const createRecipeStep: MutationResolvers['createRecipeStep'] = ({
  input,
}) => {
  return db.recipeStep.create({
    data: input,
  })
}

export const updateRecipeStep: MutationResolvers['updateRecipeStep'] = ({
  id,
  input,
}) => {
  return db.recipeStep.update({
    data: input,
    where: { id },
  })
}

export const deleteRecipeStep: MutationResolvers['deleteRecipeStep'] = ({
  id,
}) => {
  return db.recipeStep.delete({
    where: { id },
  })
}

export const RecipeStep: RecipeStepRelationResolvers = {
  recipe: (_obj, { root }) => {
    return db.recipeStep.findUnique({ where: { id: root?.id } }).recipe()
  },
  ingredients: (_obj, { root }) => {
    return db.recipeStep.findUnique({ where: { id: root?.id } }).ingredients()
  },
}
