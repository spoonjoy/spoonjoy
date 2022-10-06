import { FindMyRecipes } from 'types/graphql'

const mockRecipesSummaries: Array<Unpacked<FindMyRecipes['recipes']>> = [
  {
    id: 'testId1',
    title: 'Greatest recipe ever!',
    description: 'This is a rather delicious recipe.',
  },
  {
    id: 'testId2',
    title: 'Second greatest recipe ever!',
    description: "You've seriously never had a better recipe.",
  },
  {
    id: 'testId3',
    title: 'Third greatest recipe ever!',
    description:
      "Believe me, this is the greatest recipe you'll ever have. I discovered it on an island in Fiji!",
  },
]
export const standard = (/* vars, { ctx, req } */) => ({
  recipes: mockRecipesSummaries,
})
