import { OAuthButtons } from '@spoonjoy/redwoodjs-dbauth-oauth-web'

import { MetaTags } from '@redwoodjs/web'

import { useOAuth } from 'src/auth'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

import PasswordOrWebAuthn from './PasswordOrWebAuthn'

interface ILoginPageProps {
  type: 'oauth' | 'password' | undefined
}
const LoginPage = ({ type }: ILoginPageProps) => {
  const { getOAuthUrls } = useOAuth()

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <MetaTags title="sign in" />
      <AuthHeader location="login" />

      <AuthFormWrapper>
        {type === 'oauth' || type === undefined ? (
          <div>
            <OAuthButtons action="login" getOAuthUrls={getOAuthUrls} />
          </div>
        ) : (
          <PasswordOrWebAuthn />
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
      </AuthFormWrapper>
    </div>
  )
}

export default LoginPage
