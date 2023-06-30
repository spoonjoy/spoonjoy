import { useOAuth } from 'src/auth'

import OAuthBtn from './OAuthBtn'

const LoginWithOAuth = () => {
  const { getOAuthUrls } = useOAuth()

  const oAuthUrls = getOAuthUrls({
    method: 'login',
  })

  return (
    <ul className="flex flex-col gap-2">
      {oAuthUrls?.apple && (
        <li>
          <OAuthBtn provider="apple" action="login" href={oAuthUrls.apple} />
        </li>
      )}
      {oAuthUrls?.google && (
        <li>
          <OAuthBtn provider="google" action="login" href={oAuthUrls.google} />
        </li>
      )}
    </ul>
  )
}

export default LoginWithOAuth
