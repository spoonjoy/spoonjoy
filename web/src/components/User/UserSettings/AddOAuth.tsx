import { OAuthConnectionInfo } from 'types/graphql'

import {
  useGoogleAuthQuery,
  useUnlinkGoogleAccountMutation,
} from 'src/components/Auth/OAuthHelpers'

interface IAddOAuthProps {
  oAuthConnections: OAuthConnectionInfo[]
}

const AddOAuth = ({ oAuthConnections }: IAddOAuthProps) => {
  const { data: connectGoogleUrl } = useGoogleAuthQuery()

  const { unlinkAccount: unlinkGoogle } = useUnlinkGoogleAccountMutation()

  const hasGoogle = oAuthConnections.some(
    (connection) => connection.provider === 'GOOGLE'
  )
  return (
    <div>
      {hasGoogle ? (
        <button onClick={() => unlinkGoogle()}>Disconnect Google</button>
      ) : (
        <a href={connectGoogleUrl}>Connect Google</a>
      )}
    </div>
  )
}

export default AddOAuth
