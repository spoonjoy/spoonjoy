import type { UserOAuthConnectionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AddOAuth from '../AddOAuth'

import { USER_OAUTH_CONNECTIONS_QUERY } from './UserOAuthConnectionsQuery'

// this is a function because redwoodjs has a fragments bug and can't handle them otherwise
export const QUERY = () => USER_OAUTH_CONNECTIONS_QUERY

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <AddOAuth oAuthConnections={[]} />
}

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  user: { oAuth: oAuthConnections },
}: CellSuccessProps<UserOAuthConnectionsQuery>) => {
  return <AddOAuth oAuthConnections={oAuthConnections} />
}
