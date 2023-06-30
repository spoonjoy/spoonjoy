import { Provider } from '@spoonjoy/redwoodjs-dbauth-oauth-web'

import { useParams } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'

import { useOAuth } from 'src/auth'

const ConnectOAuth = () => {
  const urlWithoutQSPs = window.location.origin + window.location.pathname

  const { getOAuthUrls, unlinkAccount, getConnectedAccounts } = useOAuth()

  const oAuthUrls = getOAuthUrls({
    method: 'link',
  })

  const [linkedAccounts, setLinkedAccounts] = React.useState<{
    [key in Provider]: boolean | undefined
  }>({
    google: undefined,
    apple: undefined,
  })

  React.useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        const response = await getConnectedAccounts()
        const hasApple = response.some(
          (connection) => connection.provider === 'apple'
        )
        const hasGoogle = response.some(
          (connection) => connection.provider === 'google'
        )
        setLinkedAccounts({
          apple: hasApple,
          google: hasGoogle,
        })
      } catch (error) {
        console.error('Failed to fetch connected accounts:', error)
      }
    }

    fetchConnectedAccounts()
    // this is intentionally empty, we only want to run this on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      {oAuthUrls.google && (
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
      {oAuthUrls.apple && (
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

export default ConnectOAuth
