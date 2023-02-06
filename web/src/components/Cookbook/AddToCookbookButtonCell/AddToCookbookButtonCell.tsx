import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline'
import type {
  FindCookbooksForDropdown,
  FindCookbooksForDropdownVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
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

export const Loading = () => (
  <BookmarkIconOutline className="h-5 w-5 text-gray-300" aria-hidden="true" />
)

export const Empty = () => (
  <Link to={routes.myCookbooks({ newCookbook: true })}>
    <BookmarkIconOutline className="h-5 w-5 text-white" aria-hidden="true" />
  </Link>
)

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
