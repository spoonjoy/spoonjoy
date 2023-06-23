import { OAuthConnectionInfo } from 'types/graphql'

import { toast } from '@redwoodjs/web/toast'

import { useOAuth } from 'src/auth'

interface IAddOAuthProps {
  oAuthConnections: OAuthConnectionInfo[]
}

const AddOAuth = ({ oAuthConnections }: IAddOAuthProps) => {
  const { getOAuthUrls, unlinkAccount } = useOAuth()

  const onUnlinkAccount = async (provider: 'apple' | 'google') => {
    const response = await unlinkAccount(provider)
    if (response.error) {
      console.log('error unlinking account', response.error)
      toast.error(`failed to disconnect ${provider}`)
    } else if (response.provider.toUpperCase() === provider.toUpperCase()) {
      toast.success(`successfully disconnected ${provider}`)
    } else {
      toast(`something might have gone wrong`)
    }
  }

  const oAuthUrls = getOAuthUrls(window.location.href)

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
            <button onClick={() => onUnlinkAccount('google')}>
              Disconnect Google
            </button>
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
            <button
              onClick={() => {
                onUnlinkAccount('apple')
              }}
            >
              Disconnect Apple
            </button>
          ) : (
            <a href={oAuthUrls.apple} rel="noreferrer">
              Connect Apple
            </a>
          )}
        </li>
      )}
    </ul>
  )
}

export default AddOAuth
