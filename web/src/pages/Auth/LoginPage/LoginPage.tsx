import { useState } from 'react'
import { useEffect } from 'react'

import { IFormSignin } from 'types/auth'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
  useForm,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import StyledPasswordField from 'src/components/formComponents/StyledPasswordField'
import StyledTextField from 'src/components/formComponents/StyledTextField'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

const WELCOME_MESSAGE = 'Welcome back!'
const REDIRECT = routes.welcome()

const LoginPage = ({ type }) => {
  const {
    isAuthenticated,
    client: webAuthn,
    loading,
    logIn,
    reauthenticate,
  } = useAuth()
  const formMethods = useForm<IFormSignin>()

  const {
    formState: { errors },
  } = formMethods

  const [shouldShowWebAuthn, setShouldShowWebAuthn] = useState(false)
  const [showWebAuthn, setShowWebAuthn] = useState(
    webAuthn.isEnabled() && type !== 'password'
  )

  const onAuthenticate = React.useCallback(async () => {
    try {
      await webAuthn.authenticate()
      await reauthenticate()
      toast.success(WELCOME_MESSAGE)
      navigate(REDIRECT)
    } catch (e) {
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
    if (isAuthenticated && (!shouldShowWebAuthn || webAuthn.isEnabled())) {
      navigate(REDIRECT)
    }
  }, [isAuthenticated, shouldShowWebAuthn, webAuthn])

  // if WebAuthn is enabled, show the prompt as soon as the page loads
  useEffect(() => {
    if (!loading && !isAuthenticated && showWebAuthn) {
      onAuthenticate()
    }
  }, [loading, isAuthenticated, showWebAuthn, onAuthenticate])

  const onSubmit = async (data) => {
    const webAuthnSupported = await webAuthn.isSupported()

    if (webAuthnSupported) {
      setShouldShowWebAuthn(true)
    }
    const response = await logIn({ ...data })

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
      await webAuthn.register()
      toast.success(WELCOME_MESSAGE)
      navigate(REDIRECT)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onSkip = () => {
    toast.success(WELCOME_MESSAGE)
    setShouldShowWebAuthn(false)
  }

  const AuthWebAuthnPrompt = () => {
    return (
      <div className="rw-webauthn-wrapper">
        <h2>WebAuthn Login Enabled</h2>
        <p>Log in with your fingerprint, face or PIN</p>
        <div className="rw-button-group">
          <button className="rw-button rw-button-blue" onClick={onAuthenticate}>
            Open Authenticator
          </button>
        </div>
      </div>
    )
  }

  const RegisterWebAuthnPrompt = () => (
    <div className="rw-webauthn-wrapper">
      <h2>No more passwords!</h2>
      <p>
        Depending on your device you can log in with your fingerprint, face or
        PIN next time.
      </p>
      <div className="rw-button-group">
        <button className="rw-button rw-button-blue" onClick={onRegister}>
          Turn On
        </button>
        <button className="rw-button" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  )

  const PasswordForm = () => (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthHeader location="login" />

      <AuthFormWrapper>
        <Form<IFormSignin>
          formMethods={formMethods}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <StyledTextField
            label="Username"
            fieldName="username"
            fieldErrors={errors.username}
            validation={{ required: true }}
          />
          <StyledPasswordField
            label="Password"
            fieldName="password"
            fieldErrors={errors.password}
            validation={{ required: true }}
          />

          <div className="text-right text-xs text-gray-500 hover:text-indigo-700 hover:underline">
            <Link to={routes.forgotPassword()}>Forgot Password?</Link>
          </div>

          <div className="flex justify-center">
            <Submit disabled={loading} className="btn-submit-primary">
              Sign In
            </Submit>
          </div>
        </Form>
      </AuthFormWrapper>
    </div>
  )

  const formToRender = () => {
    if (showWebAuthn) {
      if (webAuthn.isEnabled()) {
        return <AuthWebAuthnPrompt />
      } else {
        return <RegisterWebAuthnPrompt />
      }
    } else {
      return <PasswordForm />
    }
  }

  const linkToRender = () => {
    if (showWebAuthn) {
      if (webAuthn.isEnabled()) {
        return (
          <div className="rw-login-link">
            <span>or login with </span>{' '}
            <a href="?type=password" className="rw-link">
              username and password
            </a>
          </div>
        )
      }
    }
  }

  if (loading) {
    return null
  }

  return (
    <>
      <MetaTags title="Login" />
      {formToRender()}
      {linkToRender()}
    </>
  )
}

export default LoginPage
