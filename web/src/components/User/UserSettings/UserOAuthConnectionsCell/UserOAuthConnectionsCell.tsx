import type { UserOAuthConnectionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AddOAuth from '../AddOAuth'

export const QUERY = gql`
  query UserOAuthConnectionsQuery($id: String!) {
    user(id: $id) {
      oAuth {
        provider
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  user: { oAuth: oAuthConnections },
}: CellSuccessProps<UserOAuthConnectionsQuery>) => {
  return <AddOAuth oAuth={oAuthConnections} />
}
