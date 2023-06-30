import React, { MouseEvent } from 'react'

import AppleLogo from './assets/logos/AppleLogo'
import GoogleLogo from './assets/logos/GoogleLogo'

type Provider = 'apple' | 'google'
type Action = 'signIn' | 'signUp' | 'connect' | 'disconnect'

type ClickEvent = MouseEvent<HTMLButtonElement | HTMLAnchorElement>

interface OAuthBtnProps {
  provider: Provider
  action: Action
  href?: string
  onClick?: (event: ClickEvent) => void
}

const OAuthBtn: React.FC<OAuthBtnProps> = ({
  provider,
  action,
  href,
  onClick,
}) => {
  const logos = {
    apple: <AppleLogo />,
    google: <GoogleLogo />,
  }

  const actions = {
    signIn: 'Sign In with',
    signUp: 'Sign Up with',
    connect: 'Connect with',
    disconnect: 'Disconnect from',
  }

  const ButtonComponent = href ? 'a' : 'button'

  const providerName = (() => {
    switch (provider) {
      case 'apple':
        return 'Apple'
      case 'google':
        return 'Google'
      default:
        throw new Error('Invalid provider')
    }
  })()

  return (
    <ButtonComponent
      href={href}
      onClick={onClick}
      className={`flex w-[16.4rem] items-center justify-start gap-2 rounded border border-gray-300 bg-white px-4 py-2
      text-black transition-colors duration-200 ease-in-out hover:bg-gray-200`}
    >
      {logos[provider]}
      <span className="ml-2">{`${actions[action]} ${providerName}`}</span>
    </ButtonComponent>
  )
}

export default React.memo(OAuthBtn)
