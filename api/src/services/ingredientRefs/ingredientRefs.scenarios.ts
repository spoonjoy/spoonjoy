import type { Prisma, IngredientRef } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.IngredientRefCreateArgs>({
  ingredientRef: {
    one: { data: { name: 'String7302580' } },
    two: { data: { name: 'String9281886' } },
  },
})

export type StandardScenario = ScenarioData<IngredientRef, 'ingredientRef'>
