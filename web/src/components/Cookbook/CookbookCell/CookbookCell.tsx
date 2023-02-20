import type { FindCookbookById, FindCookbookByIdVariables } from 'types/graphql'
import { RECIPE_SHORT_INFO } from 'web/src/components/Recipe/recipeFragments'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Cookbook from '../Cookbook/Cookbook'

export const QUERY = () => {
  return gql`
    ${RECIPE_SHORT_INFO}
    query FindCookbookById($id: String!) {
      cookbook: cookbook(id: $id) {
        id
        title
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

export const Loading = () => <Cookbook />

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindCookbookByIdVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  cookbook,
}: CellSuccessProps<FindCookbookById, FindCookbookByIdVariables>) => {
  return <Cookbook cookbook={cookbook} />
}
