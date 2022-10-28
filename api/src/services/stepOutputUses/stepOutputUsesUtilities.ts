import type { Prisma } from '@prisma/client'
import { CreateRecipeStepInput } from 'types/graphql'

export const mapStepsMutationInputToDbCreateManyStepOutputUsesInput = (
  recipeId: string,
  steps: CreateRecipeStepInput[]
): Prisma.StepOutputUseCreateManyInput[] => {
  return steps
    .filter((step) => step.stepOutputUses?.length)
    .flatMap((step) => {
      return step.stepOutputUses!.map((stepOutputUse) => ({
        recipeId,
        outputStepNum: stepOutputUse.outputOfStepNum,
        inputStepNum: step.stepNum,
      }))
    })
}
