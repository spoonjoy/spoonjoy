import { OAuthButtons } from '@spoonjoy/redwoodjs-dbauth-oauth-web'

import { useOAuth } from 'src/auth'

import PasswordOrWebAuthn from './PasswordOrWebAuthn'
import SignupForm from './SignupForm'

interface IOAuthOrPasswordProps {
  type: 'oauth' | 'password' | undefined
  location: 'login' | 'signup' | 'new-cookbook'
  onSignupComplete?: () => void
}

const OAuthOrPassword = ({
  type,
  location,
  onSignupComplete,
}: IOAuthOrPasswordProps) => {
  const { getOAuthUrls } = useOAuth()
  return (
    <>
      {type === 'oauth' || type === undefined ? (
        <div>
          <OAuthButtons
            action={location === 'login' ? 'login' : 'signup'}
            getOAuthUrls={getOAuthUrls}
          />
        </div>
      ) : location === 'login' ? (
        <PasswordOrWebAuthn />
      ) : (
        <SignupForm onComplete={onSignupComplete} />
      )}
      <p className="mt-10 text-center text-sm text-gray-600">
        or{' '}
        <a
          href={`?type=${
            type === 'oauth' || type === undefined ? 'password' : 'oauth'
          }`}
          className="link text-center font-medium"
        >
          {type === 'oauth' || type === undefined
            ? 'use your username and password'
            : 'sign in with a provider'}
        </a>
      </p>
    </>
  )
}

export default OAuthOrPassword
