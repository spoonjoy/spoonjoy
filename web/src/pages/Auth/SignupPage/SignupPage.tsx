import { useRef } from 'react'
import { useEffect } from 'react'

import { IFormSignup } from 'types/auth'

import { useAuth } from '@redwoodjs/auth'
import { Form, useForm, Submit } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import StyledPasswordField from 'src/components/formComponents/StyledPasswordField'
import StyledTextField from 'src/components/formComponents/StyledTextField'

import AuthFormWrapper from '../shared/AuthFormWrapper'
import AuthHeader from '../shared/AuthHeader'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()
  const formMethods = useForm<IFormSignup>()

  const {
    formState: { errors },
  } = formMethods

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.recipes())
    }
  }, [isAuthenticated])

  // focus on username box on page load
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit = async (data: IFormSignup) => {
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
          <Form<IFormSignup>
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
            <StyledTextField
              label="Email"
              fieldName="email"
              fieldErrors={errors.email}
              validation={{ required: true }}
            />

            <StyledPasswordField
              label="Password"
              fieldName="password"
              fieldErrors={errors.password}
              validation={{ required: true }}
            />

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
