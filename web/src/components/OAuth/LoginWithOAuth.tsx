import { useOAuth } from 'src/auth'

const LoginWithOAuth = () => {
  const { getOAuthUrls } = useOAuth()

  const oAuthUrls = getOAuthUrls({
    method: 'login',
  })

  return (
    <ul>
      {oAuthUrls?.google && (
        <li>
          <a href={oAuthUrls.google}>Login with Google</a>
        </li>
      )}
      {oAuthUrls?.apple && (
        <li>
          <a href={oAuthUrls.apple}>Login with Apple</a>
        </li>
      )}
    </ul>
  )
}

export default LoginWithOAuth
