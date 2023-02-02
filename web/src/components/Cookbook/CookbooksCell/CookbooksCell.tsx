import type { FindCookbooksByUser } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { COOKBOOK_INFO } from '../cookbookFragments'
import Cookbooks from '../Cookbooks/Cookbooks'

export const QUERY = () => gql`
  ${COOKBOOK_INFO}
  query FindCookbooksByUser($username: String!) {
    cookbooks: usersCookbooks(username: $username) {
      ...CookbookInfo
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <Cookbooks cookbooks={[]} />

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  cookbooks,
}: CellSuccessProps<FindCookbooksByUser>) => {
  return <Cookbooks cookbooks={cookbooks} />
}
