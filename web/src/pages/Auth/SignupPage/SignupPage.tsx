import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import OAuthOrPassword from 'src/components/Auth/OAuthOrPassword'

import AuthFormWrapper from '../../../components/Auth/AuthFormWrapper'
import AuthHeader from '../../../components/Auth/AuthHeader'

interface ISignupPageProps {
  type: 'oauth' | 'password' | undefined
}

const SignupPage = ({ type }: ISignupPageProps) => {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate(routes.user({ username: currentUser.username }))
    }
  }, [currentUser])

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <MetaTags title="sign up" />
      <AuthHeader location="signup" />

      <AuthFormWrapper>
        <OAuthOrPassword type={type} location="signup" />
      </AuthFormWrapper>
    </div>
  )
}

export default SignupPage
