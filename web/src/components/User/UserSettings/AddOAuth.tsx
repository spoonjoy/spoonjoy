import { OAuth, OAuthConnectionInfo } from 'types/graphql'

import { useGoogleAuthQuery } from 'src/components/Auth/OAuthHelpers'

interface IAddOAuthProps {
  oAuthConnections: OAuthConnectionInfo[]
}

const AddOAuth = ({ oAuthConnections }: IAddOAuthProps) => {
  const { data: connectGoogleUrl } = useGoogleAuthQuery()

  const hasGoogle = oAuthConnections.some(
    (connection) => connection.provider === 'GOOGLE'
  )
  return (
    <div>
      <a href={connectGoogleUrl}>Connect Google</a>
    </div>
  )
}

export default AddOAuth
