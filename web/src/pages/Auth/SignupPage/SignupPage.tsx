import { useRef } from 'react'
import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.welcome())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({ ...data })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome to Spoonjoy!')
    }
  }

  return (
    <>
      <MetaTags title="Signup" />

      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <AuthHeader location="signup" />

        <AuthFormWrapper>
          <Form onSubmit={onSubmit} className="rw-form-wrapper">
            <Label
              name="username"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Username
            </Label>
            <TextField
              name="username"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              ref={usernameRef}
              validation={{
                required: {
                  value: true,
                  message: 'Username is required',
                },
              }}
            />
            <FieldError name="username" className="rw-field-error" />

            <Label
              name="username"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Email
            </Label>
            <TextField
              name="email"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{
                required: {
                  value: true,
                  message: 'Email is required',
                },
              }}
            />
            <FieldError name="email" className="rw-field-error" />

            <Label
              name="password"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Password
            </Label>
            <PasswordField
              name="password"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              autoComplete="current-password"
              validation={{
                required: {
                  value: true,
                  message: 'Password is required',
                },
              }}
            />
            <FieldError name="password" className="rw-field-error" />

            <div className="rw-button-group">
              <Submit className="rw-button rw-button-blue">Sign Up</Submit>
            </div>
          </Form>
        </AuthFormWrapper>
      </div>
    </>
  )
}

export default SignupPage
