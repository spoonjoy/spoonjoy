import type { Prisma, Cookbook } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

import {
  userScenarioData,
  standard as userScenario,
} from '../users/users.scenarios'

// I believe this is necessary so that this scenario will exist for the cookbook tests, but there may be a better way to do this
export const userOnlyScenario = userScenario

const getBreakfastCookbookScenarioData = (
  authorId: string
): Prisma.CookbookCreateArgs['data'] => ({
  authorId,
  title: 'Breakfast',
})

const getLunchCookbookScenarioData = (
  authorId: string
): Prisma.CookbookCreateArgs['data'] => ({
  authorId,
  title: 'Breakfast',
})

export const bobsCookbooksScenarioData = {
  bobsBreakfast: (scenario: StandardScenario): Prisma.CookbookCreateArgs => ({
    data: getBreakfastCookbookScenarioData(scenario.user.bob.id),
  }),
  bobsLunch: (scenario: StandardScenario): Prisma.CookbookCreateArgs => ({
    data: getLunchCookbookScenarioData(scenario.user.bob.id),
  }),
}

export const cookbookScenarioData = {
  ...bobsCookbooksScenarioData,
}

export const standard = {
  user: userScenarioData,
  cookbook: { ...cookbookScenarioData },
}

export type StandardScenario = {
  user: Record<keyof typeof userScenarioData, User>
  cookbook: Record<keyof typeof cookbookScenarioData, Cookbook>
}
