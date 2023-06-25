import { OAuthConnectionInfo } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'

import { useOAuth } from 'src/auth'

interface IAddOAuthProps {
  oAuthConnections: OAuthConnectionInfo[]
}

const AddOAuth = ({ oAuthConnections }: IAddOAuthProps) => {
  const urlWithoutQSPs = window.location.origin + window.location.pathname

  const { getOAuthUrls, unlinkAccount } = useOAuth()

  const oAuthUrls = getOAuthUrls({
    currentUrl: urlWithoutQSPs,
    method: 'link',
  })

  const hasGoogle = oAuthConnections.some(
    (connection) => connection.provider === 'GOOGLE'
  )
  const hasApple = oAuthConnections.some(
    (connection) => connection.provider === 'APPLE'
  )
  const [linkedAccounts, setLinkedAccounts] = React.useState({
    google: hasGoogle,
    apple: hasApple,
  })

  const { linkedAccount } = useParams()
  // if this is here, it means the user just connected an account
  if (linkedAccount) {
    if (
      Object.keys(linkedAccounts).includes(linkedAccount) &&
      linkedAccounts[linkedAccount as 'google' | 'apple'] === true
    ) {
      toast.success(`successfully connected ${linkedAccount.toLowerCase()}`)
      window.history.replaceState(null, '', urlWithoutQSPs)
    } else {
      window.history.replaceState(null, '', urlWithoutQSPs)
    }
  }

  const onUnlinkAccount = async (provider: 'apple' | 'google') => {
    const response = await unlinkAccount(provider)
    if (response.error) {
      console.log('error unlinking account', response.error)
      toast.error(`failed to disconnect ${provider}`)
    } else if (response.provider?.toUpperCase() === provider.toUpperCase()) {
      toast.success(`successfully disconnected ${provider}`)
      setLinkedAccounts((prev) => ({ ...prev, [provider]: false }))
    } else {
      toast(
        `something might have gone wrong unlinking account, response was ${response}`
      )
    }
  }

  return (
    <ul>
      {oAuthUrls?.google && (
        <li>
          {linkedAccounts.google ? (
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
          {linkedAccounts.apple ? (
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
