import type { UserOAuthConnectionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AddOAuth from '../AddOAuth'

export const OAUTH_CONNECTION_INFO = gql`
  fragment OAuthConnectionInfo on OAuth {
    provider
    userId
  }
`

// this is a function because redwoodjs has a fragments bug and can't handle them otherwise
export const QUERY = () => gql`
  ${OAUTH_CONNECTION_INFO}
  query UserOAuthConnectionsQuery($id: String!) {
    user(id: $id) {
      oAuth {
        ...OAuthConnectionInfo
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
  return <AddOAuth oAuthConnections={oAuthConnections} />
}
