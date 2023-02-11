import { IFormSignup } from 'types/auth'

import { useAuth } from '@redwoodjs/auth'
import { Form, Submit } from '@redwoodjs/forms'
import { toast } from '@redwoodjs/web/dist/toast'

import StyledPasswordField from '../formComponents/StyledPasswordField'
import StyledTextField from '../formComponents/StyledTextField'

interface ISignupFormProps {
  onComplete?: () => void
}

const SignupForm = ({ onComplete }: ISignupFormProps) => {
  const { signUp } = useAuth()

  const [loading, setLoading] = React.useState(false)
  const onSubmit = async (data: IFormSignup) => {
    setLoading(true)
    const response = await signUp({ ...data })
    setLoading(false)

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('welcome to spoonjoy!')
      onComplete && onComplete()
    }
  }

  return (
    <Form<IFormSignup> onSubmit={onSubmit} className="space-y-6">
      <StyledTextField
        label="username"
        fieldName="username"
        validation={{ required: true }}
      />
      <StyledTextField
        label="email"
        fieldName="email"
        validation={{ required: true }}
      />

      <StyledPasswordField
        label="password"
        fieldName="password"
        validation={{ required: true }}
      />

      <div className="flex justify-center">
        <Submit disabled={loading} className="btn-submit-primary">
          sign up
        </Submit>
      </div>
    </Form>
  )
}

export default SignupForm
