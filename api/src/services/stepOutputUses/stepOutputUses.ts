import type {
  QueryResolvers,
  MutationResolvers,
  StepOutputUseRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const stepOutputUses: QueryResolvers['stepOutputUses'] = () => {
  return db.stepOutputUse.findMany()
}

export const stepOutputUse: QueryResolvers['stepOutputUse'] = ({ id }) => {
  return db.stepOutputUse.findUnique({
    where: { id },
  })
}

export const createStepOutputUse: MutationResolvers['createStepOutputUse'] = ({
  input,
}) => {
  return db.stepOutputUse.create({
    data: input,
  })
}

export const updateStepOutputUse: MutationResolvers['updateStepOutputUse'] = ({
  id,
  input,
}) => {
  return db.stepOutputUse.update({
    data: input,
    where: { id },
  })
}

export const deleteStepOutputUse: MutationResolvers['deleteStepOutputUse'] = ({
  id,
}) => {
  return db.stepOutputUse.delete({
    where: { id },
  })
}

export const StepOutputUse: StepOutputUseRelationResolvers = {
  outputOfStep: (_obj, { root }) => {
    return db.stepOutputUse
      .findUnique({ where: { id: root?.id } })
      .outputOfStep()
  },
  inputOfStep: (_obj, { root }) => {
    return db.stepOutputUse
      .findUnique({ where: { id: root?.id } })
      .inputOfStep()
  },
}
