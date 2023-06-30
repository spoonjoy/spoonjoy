import { useOAuth } from 'src/auth'

import LinkOAuth from './LinkOAuth'
import LoginWithOAuth from './LoginWithOAuth'
import { Action } from './OAuthBtn'
import SignupWithOAuth from './SignupWithOAuth'

interface IOAuthBtnsProps {
  action: Action
}

const OAuthBtns = ({ action }: IOAuthBtnsProps) => {
  const { getOAuthUrls } = useOAuth()
  const oAuthUrls = getOAuthUrls({ method: action })
  switch (action) {
    case 'login':
      return <LoginWithOAuth />
    case 'signUp':
      return <SignupWithOAuth />
    case 'link':
    case 'unlink':
      return <LinkOAuth />
  }
}

export default OAuthBtns
