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
    apple: <AppleLogo className="ml-[0.6rem] pt-[.1rem] pb-[.1rem]" />,
    google: <GoogleLogo className="ml-[0.6rem] pt-[.1rem] pb-[.1rem]" />,
  }

  const actions = {
    signIn: 'Sign in with',
    signUp: 'Sign up with',
    connect: 'Connect to',
    disconnect: 'Disconnect',
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
      className="relative h-[41px] w-[260px] justify-center rounded border border-gray-200 bg-white
      text-gray-900 transition-colors duration-200 ease-in-out hover:bg-gray-200"
    >
      <div className="absolute top-[50%] -translate-y-1/2">
        {logos[provider]}
      </div>
      <div className="font-medium">{`${actions[action]} ${providerName}`}</div>
    </ButtonComponent>
  )
}

export default React.memo(OAuthBtn)
