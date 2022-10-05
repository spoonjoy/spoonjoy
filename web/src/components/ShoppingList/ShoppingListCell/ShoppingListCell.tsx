import type {
  FindShoppingListQuery,
  FindShoppingListQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ShoppingList from '../ShoppingListComponent/ShoppingList'

export const QUERY = gql`
  query FindShoppingListQuery($id: String!) {
    shoppingList: shoppingList(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindShoppingListQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  shoppingList,
}: CellSuccessProps<FindShoppingListQuery, FindShoppingListQueryVariables>) => {
  return <ShoppingList />
}
