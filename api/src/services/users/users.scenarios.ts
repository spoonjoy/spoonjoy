import type { Prisma, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

// TODO: figure out how to type this. My current attempts just end up in "possibly infinite" type errors
export const userScenarioData = {
  user: {
    bob: {
      data: {
        email: 'bob@spoonjoy.app',
        username: 'bob',
        hashedPassword: 'string',
        salt: 'string',
      },
    },
    linda: {
      data: {
        email: 'linda@spoonjoy.app',
        username: 'linda',
        hashedPassword: 'string',
        salt: 'string',
      },
    },
  },
}
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

// export const standard = defineScenario<Prisma.UserCreateArgs>(userScenarioData)

// export type StandardScenario = ScenarioData<User, 'user'>
