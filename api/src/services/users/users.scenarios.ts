import type { Prisma, User } from '@prisma/client'

export const userScenarioData = {
  bob: {
    data: {
      email: 'bob@spoonjoy.app',
      username: 'bob',
      hashedPassword: 'string',
      salt: 'string',
    },
  } as Prisma.UserCreateArgs,
  linda: {
    data: {
      email: 'linda@spoonjoy.app',
      username: 'linda',
      hashedPassword: 'string',
      salt: 'string',
    },
  } as Prisma.UserCreateArgs,
}

export const standard = {
  user: userScenarioData,
}
export type StandardScenario = {
  user: Record<keyof typeof userScenarioData, User>
}
