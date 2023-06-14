import { OAuthConnectionInfo } from 'types/graphql'

import { useAuth } from 'src/auth'
import {
  useAuthQuery,
  useUnlinkGoogleAccountMutation,
} from 'src/components/Auth/OAuthHelpers'

interface IAddOAuthProps {
  oAuthConnections: OAuthConnectionInfo[]
}

const AddOAuth = ({ oAuthConnections }: IAddOAuthProps) => {
  const { getGoogleAuthUrl } = useAuth()

  if (getGoogleAuthUrl) {
    getGoogleAuthUrl().then((res) => {
      console.log(res)
    })
  }

  const { data: connectGoogleUrl } = useAuthQuery('GOOGLE')
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
      <li>
        {hasGoogle ? (
          <button onClick={() => unlinkGoogle()}>Disconnect Google</button>
        ) : (
          <a href={connectGoogleUrl}>Connect Google</a>
        )}
      </li>
      <li>
        {hasApple ? (
          <button onClick={() => {}}>Disconnect Apple</button>
        ) : (
          <a href={connectAppleUrl}>Connect Apple</a>
        )}
      </li>
    </ul>
  )
}

export default AddOAuth
