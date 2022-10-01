import type { Prisma, User } from '@prisma/client'

export const userScenarioDataTyped = {
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
  user: userScenarioDataTyped,
}
export type StandardScenario = {
  user: Record<keyof typeof userScenarioDataTyped, User>
}
