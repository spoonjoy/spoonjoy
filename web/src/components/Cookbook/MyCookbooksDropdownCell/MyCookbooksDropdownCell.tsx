import type {
  FindCookbooksForDropdown,
  FindCookbooksForDropdownVariables,
  RecipeInCookbook,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

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
  inMyCookbooks: {
    cookbookId: string
  }[]
}

export const Success = ({
  myCookbooks,
  inMyCookbooks,
}: CellSuccessProps<
  FindCookbooksForDropdown,
  FindCookbooksForDropdownVariables
> &
  ICookbooksDropdownProps) => {
  return (
    <>
      <div>{JSON.stringify(myCookbooks)}</div>
      <div>{JSON.stringify(inMyCookbooks)}</div>
    </>
  )
}
