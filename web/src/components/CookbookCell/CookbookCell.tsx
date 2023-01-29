import type { FindCookbookById, FindCookbookByIdVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { RECIPE_SHORT_INFO } from '../Recipe/recipeFragments'
import Recipes from '../Recipe/Recipes'

export const QUERY = () => {
  return gql`
    ${RECIPE_SHORT_INFO}xw
    query FindCookbookById($id: String!) {
      cookbook: cookbook(id: $id) {
        id
        author {
          id
          username
        }
        recipes {
          recipe {
            ...RecipeShortInfo
          }
        }
      }
    }
  `
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindCookbookByIdVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  cookbook,
}: CellSuccessProps<FindCookbookById, FindCookbookByIdVariables>) => {
  const recipes = cookbook.recipes.map((recipeInCookbook) => {
    return recipeInCookbook?.recipe
  })
  return <Recipes recipes={recipes} />
}
