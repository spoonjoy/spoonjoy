import { useOAuth } from 'src/auth'

const SignupWithOAuth = () => {
  const { getOAuthUrls } = useOAuth()

  const oAuthUrls = getOAuthUrls({
    method: 'signup',
  })

  return (
    <ul>
      {oAuthUrls?.google && (
        <li>
          <a href={oAuthUrls.google}>Sign up with Google</a>
        </li>
      )}
      {oAuthUrls?.apple && (
        <li>
          <a href={oAuthUrls.apple}>Sign up with Apple</a>
        </li>
      )}
    </ul>
  )
}

export default SignupWithOAuth
