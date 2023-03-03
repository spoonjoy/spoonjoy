import { FingerPrintIcon } from '@heroicons/react/24/outline'

import AuthFormWrapper from '../shared/AuthFormWrapper'

interface IAuthWebAuthnPromptProps {
  onAuthenticate: () => Promise<void>
}

export const AuthWebAuthnPrompt = ({
  onAuthenticate,
}: IAuthWebAuthnPromptProps) => (
  <AuthFormWrapper>
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
      <FingerPrintIcon className="h-8 w-8 text-red-400" aria-hidden="true" />
    </div>
    <div className="mt-3 text-center sm:mt-5">
      <h2 className="text-lg font-medium leading-6 text-gray-900">
        passwordless login enabled
      </h2>
      <p>log in with your fingerprint, face or PIN</p>
    </div>
    <div className="mt-5">
      <button className="btn-primary w-full" onClick={onAuthenticate}>
        open authenticator
      </button>
    </div>
    <div className=" mt-5 text-center text-sm text-gray-300">
      <span>or login with </span>{' '}
      <a
        href="?type=password"
        className="text-indigo-500 hover:text-indigo-700 hover:underline"
      >
        username and password
      </a>
    </div>
  </AuthFormWrapper>
)

interface IRegisterWebAuthnPromptProps {
  onRegister: () => Promise<void>
  onSkip: () => void
}

export const RegisterWebAuthnPrompt = ({
  onRegister,
  onSkip,
}: IRegisterWebAuthnPromptProps) => (
  <AuthFormWrapper>
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
      <FingerPrintIcon className="h-8 w-8 text-red-400" aria-hidden="true" />
    </div>
    <div className="mt-3 text-center sm:mt-5">
      <h2 className="text-lg font-medium leading-6 text-gray-900">
        no more passwords!
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        depending on your device you can log in with your fingerprint, face or
        PIN next time.
      </p>
    </div>
    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <button
        className="btn-primary inline-flex w-full justify-center sm:col-start-2"
        onClick={onRegister}
      >
        turn on
      </button>
      <button
        className="btn-dismiss mt-2 inline-flex w-full justify-center sm:col-start-1 sm:mt-0"
        onClick={onSkip}
      >
        skip for now
      </button>
    </div>
  </AuthFormWrapper>
)
