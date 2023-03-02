import type {
  QueryResolvers,
  IngredientRefRelationResolvers,
} from 'types/graphql'

import {
  cacheFindMany,
  getIngredientsUsingIngredientRefCacheKey,
} from 'src/lib/cache'
import { db } from 'src/lib/db'

export const ingredientRefs: QueryResolvers['ingredientRefs'] = () => {
  return db.ingredientRef.findMany()
}

export const ingredientRef: QueryResolvers['ingredientRef'] = ({ id }) => {
  return db.ingredientRef.findUnique({
    where: { id },
  })
}

// export const createIngredientRef: MutationResolvers['createIngredientRef'] = ({
//   input,
// }) => {
//   return db.ingredientRef.create({
//     data: input,
//   })
// }

// export const updateIngredientRef: MutationResolvers['updateIngredientRef'] = ({
//   id,
//   input,
// }) => {
//   return db.ingredientRef.update({
//     data: input,
//     where: { id },
//   })
// }

// export const deleteIngredientRef: MutationResolvers['deleteIngredientRef'] = ({
//   id,
// }) => {
//   return db.ingredientRef.delete({
//     where: { id },
//   })
// }

export const IngredientRef: IngredientRefRelationResolvers = {
  ingredients: (_obj, { root }) => {
    return cacheFindMany(
      getIngredientsUsingIngredientRefCacheKey(root.id),
      db.ingredient,
      {
        conditions: {
          where: {
            ingredientRefId: root.id,
          },
        },
      }
    )
  },
}
