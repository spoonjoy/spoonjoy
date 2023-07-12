import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import OAuthOrPassword from 'src/components/Auth/OAuthOrPassword'

import AuthFormWrapper from '../../../components/Auth/AuthFormWrapper'
import AuthHeader from '../../../components/Auth/AuthHeader'

interface ILoginPageProps {
  type: 'oauth' | 'password' | undefined
}
const LoginPage = ({ type }: ILoginPageProps) => {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate(routes.user({ username: currentUser.username }))
    }
  }, [currentUser])

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <MetaTags title="sign in" />
      <AuthHeader location="login" />

      <AuthFormWrapper>
        <OAuthOrPassword type={type} location="login" />
      </AuthFormWrapper>
    </div>
  )
}

export default LoginPage
