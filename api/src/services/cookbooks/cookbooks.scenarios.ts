import type { Prisma, Cookbook } from '@prisma/client'
import { Recipe, User } from 'types/graphql'

import { recipeScenarioData } from '../recipes/recipes.scenarios'
import { userScenarioData } from '../users/users.scenarios'

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
  title: 'Lunch',
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
  recipe: recipeScenarioData,
  cookbook: { ...cookbookScenarioData },
}

export type StandardScenario = {
  user: Record<keyof typeof userScenarioData, User>
  cookbook: Record<keyof typeof cookbookScenarioData, Cookbook>
  recipe: Record<keyof typeof recipeScenarioData, Recipe>
}
