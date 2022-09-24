import type {
  QueryResolvers,
  MutationResolvers,
  IngredientRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const ingredients: QueryResolvers['ingredients'] = () => {
  return db.ingredient.findMany()
}

export const ingredient: QueryResolvers['ingredient'] = ({ id }) => {
  return db.ingredient.findUnique({
    where: { id },
  })
}

export const createIngredient: MutationResolvers['createIngredient'] = ({
  input,
}) => {
  return db.ingredient.create({
    data: input,
  })
}

export const updateIngredient: MutationResolvers['updateIngredient'] = ({
  id,
  input,
}) => {
  return db.ingredient.update({
    data: input,
    where: { id },
  })
}

export const deleteIngredient: MutationResolvers['deleteIngredient'] = ({
  id,
}) => {
  return db.ingredient.delete({
    where: { id },
  })
}

export const Ingredient: IngredientRelationResolvers = {
  recipeStep: (_obj, { root }) => {
    return db.ingredient.findUnique({ where: { id: root?.id } }).recipeStep()
  },
  unit: (_obj, { root }) => {
    return db.ingredient.findUnique({ where: { id: root?.id } }).unit()
  },
  ingredientRef: (_obj, { root }) => {
    return db.ingredient.findUnique({ where: { id: root?.id } }).ingredientRef()
  },
}
