import type { Prisma, StepOutputUse } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.StepOutputUseCreateArgs>({
  stepOutputUse: {
    one: {
      data: {
        outputOfStep: {
          create: {
            stepNum: 6325878,
            recipe: {
              create: {
                title: 'String',
                chef: {
                  create: {
                    email: 'String3315050',
                    username: 'String2019167',
                    hashedPassword: 'String',
                    salt: 'String',
                  },
                },
              },
            },
          },
        },
        inputOfStep: {
          create: {
            stepNum: 1347324,
            recipe: {
              create: {
                title: 'String',
                chef: {
                  create: {
                    email: 'String8544555',
                    username: 'String8504729',
                    hashedPassword: 'String',
                    salt: 'String',
                  },
                },
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        outputOfStep: {
          create: {
            stepNum: 8235176,
            recipe: {
              create: {
                title: 'String',
                chef: {
                  create: {
                    email: 'String1174294',
                    username: 'String5959286',
                    hashedPassword: 'String',
                    salt: 'String',
                  },
                },
              },
            },
          },
        },
        inputOfStep: {
          create: {
            stepNum: 5065817,
            recipe: {
              create: {
                title: 'String',
                chef: {
                  create: {
                    email: 'String3473076',
                    username: 'String7589600',
                    hashedPassword: 'String',
                    salt: 'String',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<StepOutputUse, 'stepOutputUse'>
