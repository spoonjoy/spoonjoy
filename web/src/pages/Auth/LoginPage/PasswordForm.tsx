import { useEffect, useRef } from 'react'

import { IFormSignin } from 'types/auth'

import { Form, Submit } from '@redwoodjs/forms'

import StyledPasswordField from 'src/components/formComponents/StyledPasswordField'
import StyledTextField from 'src/components/formComponents/StyledTextField'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

interface IPasswordFormProps {
  onSubmit: (data: IFormSignin) => void
  loading: boolean
}

export const PasswordForm = ({ onSubmit, loading }: IPasswordFormProps) => {
  // focus on the username field as soon as the page loads
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    // i couldn't figure out why, but this wasn't working without the setTimeout
    setTimeout(() => {
      usernameRef.current?.focus()
    }, 100)
  }, [usernameRef])

  return (
    <>
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
    </>
  )
}
