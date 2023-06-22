import { OAuthConnectionInfo } from 'types/graphql'

import { useOAuth } from 'src/auth'
import {
  useAuthQuery,
  useUnlinkGoogleAccountMutation,
} from 'src/components/Auth/OAuthHelpers'

interface IAddOAuthProps {
  oAuthConnections: OAuthConnectionInfo[]
}

const AddOAuth = ({ oAuthConnections }: IAddOAuthProps) => {
  const { getOAuthUrls } = useOAuth()

  const oAuthUrls = getOAuthUrls(window.location.href)

  const { data: connectAppleUrl } = useAuthQuery('APPLE')

  const { unlinkAccount: unlinkGoogle } = useUnlinkGoogleAccountMutation()

  const hasGoogle = oAuthConnections.some(
    (connection) => connection.provider === 'GOOGLE'
  )
  const hasApple = oAuthConnections.some(
    (connection) => connection.provider === 'APPLE'
  )
  return (
    <ul>
      {oAuthUrls?.google && (
        <li>
          {hasGoogle ? (
            <button onClick={() => unlinkGoogle()}>Disconnect Google</button>
          ) : (
            <a href={oAuthUrls.google} rel="noreferrer">
              Connect Google
            </a>
          )}
        </li>
      )}
      {oAuthUrls?.apple && (
        <li>
          {hasApple ? (
            <button onClick={() => {}}>Disconnect Apple</button>
          ) : (
            <a href={connectAppleUrl} rel="noreferrer">
              Connect Apple
            </a>
          )}
        </li>
      )}
    </ul>
  )
}

export default AddOAuth
