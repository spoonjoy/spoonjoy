import { useState, useRef } from 'react'
import { useEffect } from 'react'

import { IFormSignin } from 'types/auth'

import { Form, Submit } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import StyledPasswordField from 'src/components/formComponents/StyledPasswordField'
import StyledTextField from 'src/components/formComponents/StyledTextField'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

import { AuthWebAuthnPrompt, RegisterWebAuthnPrompt } from './WebAuthnPrompt'

const WELCOME_MESSAGE = 'welcome back!'
const REDIRECT = routes.welcome()

interface ILoginPageProps {
  type: string
}
const LoginPage = ({ type }: ILoginPageProps) => {
  const {
    isAuthenticated,
    client: webAuthn,
    loading,
    logIn,
    reauthenticate,
  } = useAuth()
  const [shouldShowWebAuthn, setShouldShowWebAuthn] = useState(false)
  const [showWebAuthn, setShowWebAuthn] = useState(
    webAuthn?.isEnabled() && type !== 'password'
  )

  const onAuthenticate = React.useCallback(async () => {
    try {
      await webAuthn?.authenticate()
      await reauthenticate()
      toast.success(WELCOME_MESSAGE)
      navigate(REDIRECT)
    } catch (e: any) {
      if (e.name === 'WebAuthnDeviceNotFoundError') {
        toast.error(
          'Device not found, log in with username/password to continue'
        )
        setShowWebAuthn(false)
      } else {
        toast.error(e.message)
      }
    }
  }, [webAuthn, reauthenticate])

  // should redirect right after login or wait to show the webAuthn prompts?
  useEffect(() => {
    if (isAuthenticated && (!shouldShowWebAuthn || webAuthn?.isEnabled())) {
      navigate(REDIRECT)
    }
  }, [isAuthenticated, shouldShowWebAuthn, webAuthn])

  // if WebAuthn is enabled, show the prompt as soon as the page loads
  useEffect(() => {
    if (!loading && !isAuthenticated && showWebAuthn) {
      onAuthenticate()
    }
  }, [loading, isAuthenticated, showWebAuthn, onAuthenticate])

  // focus on the username field as soon as the page loads
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [usernameRef])

  const onSubmit = async (data: IFormSignin) => {
    const webAuthnSupported = await webAuthn?.isSupported()

    if (webAuthnSupported) {
      setShouldShowWebAuthn(true)
    }
    const response = await logIn({
      username: data.username,
      password: data.password,
    })

    if (response.message) {
      // auth details good, but user not logged in
      toast(response.message)
    } else if (response.error) {
      // error while authenticating
      toast.error(response.error)
    } else {
      // user logged in
      if (webAuthnSupported) {
        setShowWebAuthn(true)
      } else {
        toast.success(WELCOME_MESSAGE)
      }
    }
  }

  const onRegister = async () => {
    try {
      await webAuthn?.register()
      toast.success(WELCOME_MESSAGE)
      navigate(REDIRECT)
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const onSkipWebAuthn = () => {
    toast.success(WELCOME_MESSAGE)
    setShouldShowWebAuthn(false)
  }

  const PasswordForm = () => (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthHeader location="login" />

      <AuthFormWrapper>
        <Form<IFormSignin> onSubmit={onSubmit} className="space-y-6">
          <StyledTextField
            label="username"
            fieldName="username"
            validation={{ required: true }}
            ref={usernameRef}
          />
          <StyledPasswordField
            label="password"
            fieldName="password"
            validation={{ required: true }}
          />

          {/* TODO forgot password flow */}
          {/* <div className="text-right text-xs text-gray-500 hover:text-indigo-700 hover:underline">
            <Link to={routes.forgotPassword()}>Forgot Password?</Link>
          </div> */}

          <div className="flex justify-center">
            <Submit disabled={loading} className="btn-submit-primary">
              sign In
            </Submit>
          </div>
        </Form>
      </AuthFormWrapper>
    </div>
  )

  const formToRender = () => {
    if (showWebAuthn) {
      if (webAuthn?.isEnabled()) {
        return <AuthWebAuthnPrompt onAuthenticate={onAuthenticate} />
      } else {
        return (
          <RegisterWebAuthnPrompt
            onRegister={onRegister}
            onSkip={onSkipWebAuthn}
          />
        )
      }
    } else {
      return <PasswordForm />
    }
  }

  if (loading) {
    return null
  }

  return (
    <>
      <MetaTags title="Login" />
      {formToRender()}
    </>
  )
}

export default LoginPage
