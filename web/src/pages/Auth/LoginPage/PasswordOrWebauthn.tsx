import { IFormSignin } from 'types/auth'

import { navigate } from '@redwoodjs/router'
import { routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

import { PasswordForm } from './PasswordForm'
import { AuthWebAuthnPrompt, RegisterWebAuthnPrompt } from './WebAuthnPrompt'

const WELCOME_MESSAGE = 'welcome back!'
const REDIRECT = routes.welcome()

const PasswordOrWebAuthn = () => {
  const {
    isAuthenticated,
    client: webAuthn,
    loading,
    logIn,
    reauthenticate,
  } = useAuth()

  const [shouldShowWebAuthn, setShouldShowWebAuthn] = React.useState(false)
  const [showWebAuthn, setShowWebAuthn] = React.useState(webAuthn?.isEnabled())

  const onAuthenticate = React.useCallback(async () => {
    try {
      await webAuthn?.authenticate()
      await reauthenticate()
      toast.success(WELCOME_MESSAGE)
      navigate(REDIRECT)
    } catch (e: any) {
      if (e.name === 'WebAuthnDeviceNotFoundError') {
        toast.error(
          'device not found, log in with username/password to continue'
        )
        setShowWebAuthn(false)
      } else {
        toast.error(e.message)
      }
    }
  }, [webAuthn, reauthenticate])

  // should redirect right after login or wait to show the webAuthn prompts?
  React.useEffect(() => {
    if (isAuthenticated && (!shouldShowWebAuthn || webAuthn?.isEnabled())) {
      navigate(REDIRECT)
    }
  }, [isAuthenticated, shouldShowWebAuthn, webAuthn])

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

  if (showWebAuthn) {
    if (webAuthn?.isEnabled()) {
      return (
        <AuthWebAuthnPrompt
          onAuthenticate={onAuthenticate}
          onDismiss={() => setShowWebAuthn(false)}
        />
      )
    } else {
      return (
        <RegisterWebAuthnPrompt
          onRegister={onRegister}
          onSkip={onSkipWebAuthn}
        />
      )
    }
  } else {
    return (
      <>
        <PasswordForm onSubmit={onSubmit} loading={loading} />
      </>
    )
  }
}

export default PasswordOrWebAuthn
