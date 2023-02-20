import { FindCookbookById } from 'types/graphql'

import { mockRecipesSummaries } from 'src/components/Recipe/RecipesCell/RecipesCell.mock'

const mockCookbook: Unpacked<FindCookbookById['cookbook']> = {
  id: 'testId1',
  title: 'Greatest cookbook ever!',
  author: {
    id: 'testUserId',
    username: 'ari',
  },
  recipes: mockRecipesSummaries.map((recipe) => ({ recipe: recipe })),
}

export const standard = (/* vars, { ctx, req } */) => ({
  cookbook: mockCookbook,
})
