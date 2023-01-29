import type { FindCookbookById, FindCookbookByIdVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Recipes from '../Recipe/Recipes'
import { RECIPE_SHORT_INFO } from '../Recipe/RecipesCell'

export const QUERY = gql`
  ${RECIPE_SHORT_INFO}
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
