import type {
  FindCookbooksByUser,
  FindCookbooksByUserVariables,
} from 'types/graphql'

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

export const Loading = () => <Cookbooks />

export const Empty = (props: { variables: FindCookbooksByUserVariables }) => (
  <Cookbooks cookbooks={[]} ownerUsername={props.variables.username} />
)

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  cookbooks,
  variables,
}: CellSuccessProps<FindCookbooksByUser, FindCookbooksByUserVariables>) => {
  return <Cookbooks cookbooks={cookbooks} ownerUsername={variables?.username} />
}
