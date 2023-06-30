import { useOAuth } from 'src/auth'

import OAuthBtn from './OAuthBtn'

const SignupWithOAuth = () => {
  const { getOAuthUrls } = useOAuth()

  const oAuthUrls = getOAuthUrls({
    method: 'signup',
  })

  return (
    <ul className="flex flex-col gap-2">
      {oAuthUrls?.apple && (
        <li>
          <OAuthBtn provider="apple" action="signUp" href={oAuthUrls.apple} />
        </li>
      )}
      {oAuthUrls?.google && (
        <li>
          <OAuthBtn provider="google" action="signUp" href={oAuthUrls.google} />
        </li>
      )}
    </ul>
  )
}

export default SignupWithOAuth
