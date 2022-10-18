import type {
  FindShoppingListById,
  FindShoppingListByIdVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ShoppingList from '../ShoppingListComponent/ShoppingList'

export const QUERY = gql`
  query FindMyShoppingList {
    shoppingList: myShoppingList {
      id
      author {
        id
        username
      }
      items {
        id
        quantity
        ingredientRef {
          name
        }
        unit {
          name
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindShoppingListByIdVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  shoppingList,
}: CellSuccessProps<FindShoppingListById, FindShoppingListByIdVariables>) => {
  return <ShoppingList shoppingList={shoppingList} />
}
