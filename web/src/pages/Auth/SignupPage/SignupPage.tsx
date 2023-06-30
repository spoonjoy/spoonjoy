import { useEffect } from 'react'

import { OAuthButtons } from '@spoonjoy/redwoodjs-dbauth-oauth-web'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth, useOAuth } from 'src/auth'
import SignupForm from 'src/components/Auth/SignupForm'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

const SignupPage = () => {
  const { currentUser } = useAuth()
  const { getOAuthUrls } = useOAuth()

  useEffect(() => {
    if (currentUser) {
      navigate(routes.user({ username: currentUser.username }))
    }
  }, [currentUser])

  return (
    <>
      <MetaTags title="signup" />

      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <AuthHeader location="signup" />
        <AuthFormWrapper>
          <SignupForm />
        </AuthFormWrapper>
        <OAuthButtons action="signup" getOAuthUrls={getOAuthUrls} />
      </div>
    </>
  )
}

export default SignupPage
