import type {
  QueryResolvers,
  MutationResolvers,
  UnitRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const units: QueryResolvers['units'] = () => {
  return db.unit.findMany()
}

export const unit: QueryResolvers['unit'] = ({ id }) => {
  return db.unit.findUnique({
    where: { id },
  })
}

export const createUnit: MutationResolvers['createUnit'] = ({ input }) => {
  return db.unit.create({
    data: input,
  })
}

export const updateUnit: MutationResolvers['updateUnit'] = ({ id, input }) => {
  return db.unit.update({
    data: input,
    where: { id },
  })
}

export const deleteUnit: MutationResolvers['deleteUnit'] = ({ id }) => {
  return db.unit.delete({
    where: { id },
  })
}

export const Unit: UnitRelationResolvers = {
  ingredients: (_obj, { root }) => {
    return db.unit.findUnique({ where: { id: root?.id } }).ingredients()
  },
}
