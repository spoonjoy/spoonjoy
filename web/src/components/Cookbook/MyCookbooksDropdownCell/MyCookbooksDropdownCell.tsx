import type {
  FindCookbooksForDropdown,
  FindCookbooksForDropdownVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AddToCookbookButton, {
  IInMyCookbook,
} from '../AddToCookbook/AddToCookbookButton'

export const QUERY = gql`
  query FindCookbooksForDropdown($username: String!) {
    myCookbooks: usersCookbooks(username: $username) {
      id
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindCookbooksForDropdownVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

interface ICookbooksDropdownProps {
  currentRecipeId: string
  inMyCookbooks: IInMyCookbook[]
}

export const Success = ({
  currentRecipeId,
  myCookbooks,
  inMyCookbooks,
}: CellSuccessProps<
  FindCookbooksForDropdown,
  FindCookbooksForDropdownVariables
> &
  ICookbooksDropdownProps) => {
  return (
    <AddToCookbookButton
      currentRecipeId={currentRecipeId}
      myCookbooks={myCookbooks}
      inMyCookbooks={inMyCookbooks}
    />
  )
}
