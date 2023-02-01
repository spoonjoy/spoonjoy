import type { FindCookbooksByUser } from 'types/graphql'

import { routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EmptyState from 'src/components/shared/EmptyState'

import { COOKBOOK_INFO } from '../cookbookFragments'
import Cookbooks from '../Cookbooks/Cookbooks'

/*
  IMAGE GEN TEST:
  - Take 4 recipe IDs:
    - clddo7dv40001jr088x6qssgk
    - cld9h73oe0001mg0810l6if0q
    - clc8l8bux000409l7tkpttjzc
    - clc8ssftb001008i93c0seuqu
  - https://res.cloudinary.com/dpjmyc4uz/image/upload/w_250,h_250,c_fill/l_${recipe_id},w_250,h_250,c_fill,x_250/l_${recipe_id},w_250,h_250,c_fill,y_250,x_-125/l_${recipe_id},w_250,h_250,c_fill,y_125,x_125/${recipe_id}
  - https://res.cloudinary.com/dpjmyc4uz/image/upload/w_250,h_250,c_fill/l_clddo7dv40001jr088x6qssgk,w_250,h_250,c_fill,x_250/l_cld9h73oe0001mg0810l6if0q,w_250,h_250,c_fill,y_250,x_-125/l_clc8l8bux000409l7tkpttjzc,w_250,h_250,c_fill,y_125,x_125/clc8ssftb001008i93c0seuqu
*/

export const QUERY = () => gql`
  ${COOKBOOK_INFO}
  query FindCookbooksByUser($username: String!) {
    cookbooks: usersCookbooks(username: $username) {
      ...CookbookInfo
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <EmptyState
    header="No cookbooks yet"
    subHeader="Get started by creating a new cookbook."
    createRoute={routes.newCookbook()}
    cta="New Cookbook"
  />
)

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  cookbooks,
}: CellSuccessProps<FindCookbooksByUser>) => {
  return <Cookbooks cookbooks={cookbooks} />
}
