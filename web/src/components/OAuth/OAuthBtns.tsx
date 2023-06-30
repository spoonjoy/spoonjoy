import { useOAuth } from 'src/auth'

import LinkOAuth from './LinkOAuth'
import LoginWithOAuth from './LoginWithOAuth'
import SignupWithOAuth from './SignupWithOAuth'

interface IOAuthBtnsProps {
  /**
   * The action to perform with the OAuth provider.
   * - `login` - login with the OAuth provider
   * - `signup` - sign up with the OAuth provider
   * - `link` - link (or unlink) the OAuth provider to/from the current user
   */
  action: 'login' | 'signup' | 'link'
}

const OAuthBtns = ({ action }: IOAuthBtnsProps) => {
  const { getOAuthUrls } = useOAuth()
  const oAuthUrls = getOAuthUrls({ method: action })
  return (
    <ul className="flex flex-col gap-2">
      {(() => {
        switch (action) {
          case 'login':
            return <LoginWithOAuth oAuthUrls={oAuthUrls} />
          case 'signup':
            return <SignupWithOAuth oAuthUrls={oAuthUrls} />
          case 'link':
            return <LinkOAuth oAuthUrls={oAuthUrls} />
        }
      })()}
    </ul>
  )
}

export default OAuthBtns
