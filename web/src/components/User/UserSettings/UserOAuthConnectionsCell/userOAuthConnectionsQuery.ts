export const OAUTH_CONNECTION_INFO = gql`
  fragment OAuthConnectionInfo on OAuth {
    provider
    userId
  }
`

export const USER_OAUTH_CONNECTIONS_QUERY = gql`
  ${OAUTH_CONNECTION_INFO}
  query UserOAuthConnectionsQuery($id: String!) {
    user(id: $id) {
      oAuth {
        ...OAuthConnectionInfo
      }
    }
  }
`
