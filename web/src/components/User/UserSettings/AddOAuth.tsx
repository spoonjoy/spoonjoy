import { OAuth } from 'types/graphql'

import { useGoogleAuthQuery } from 'src/components/Auth/OAuthHelpers'

interface IAddOAuthProps {
  oAuthConnections: Pick<OAuth, 'provider'>[]
}

const AddOAuth = ({ oAuthConnections }: IAddOAuthProps) => {
  const { data: connectGoogleUrl } = useGoogleAuthQuery()

  return (
    <div>
      <a href={connectGoogleUrl}>Connect Google</a>
    </div>
  )
}

export default AddOAuth
