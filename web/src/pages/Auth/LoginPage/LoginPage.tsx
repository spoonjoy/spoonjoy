import { useState } from 'react'

import { OAuthButtons } from '@spoonjoy/redwoodjs-dbauth-oauth-web'

import { MetaTags } from '@redwoodjs/web'

import { useOAuth } from 'src/auth'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

import PasswordOrWebauthn from './PasswordOrWebauthn'

interface ILoginPageProps {
  type: string
}
const LoginPage = ({ type }: ILoginPageProps) => {
  const [loginMethod, setLoginMethod] = useState<'oauth' | 'password'>('oauth')

  const { getOAuthUrls } = useOAuth()

  return (
    <>
      <MetaTags title="sign in" />
      <AuthHeader location="login" />

      <AuthFormWrapper>
        {loginMethod === 'oauth' ? (
          <OAuthButtons action="login" getOAuthUrls={getOAuthUrls} />
        ) : (
          <PasswordOrWebauthn type={type} />
        )}
        <button
          className="w-full text-center text-sm"
          onClick={() =>
            setLoginMethod(loginMethod === 'oauth' ? 'password' : 'oauth')
          }
        >
          {loginMethod === 'oauth'
            ? 'use your username and password'
            : 'sign in with a provider'}
        </button>
      </AuthFormWrapper>
    </>
  )
}

export default LoginPage
