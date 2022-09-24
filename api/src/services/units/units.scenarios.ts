import type { Prisma, Unit } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UnitCreateArgs>({
  unit: {
    one: { data: { name: 'String2016155' } },
    two: { data: { name: 'String1224374' } },
  },
})

export type StandardScenario = ScenarioData<Unit, 'unit'>
