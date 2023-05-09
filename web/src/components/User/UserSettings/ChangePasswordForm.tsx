import type { UpdateUserPasswordInput } from 'types/graphql'

import { Form, Submit } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import StyledPasswordField from 'src/components/formComponents/StyledPasswordField'

const CHANGE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation(
    $id: String!
    $input: UpdateUserPasswordInput!
  ) {
    updateUserPassword(id: $id, input: $input) {
      id
    }
  }
`

const ChangePasswordForm = () => {
  const { currentUser } = useAuth()
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: () => {
      toast.success('password updated!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Form<UpdateUserPasswordInput>
      onSubmit={(input) => {
        changePassword({
          variables: {
            id: currentUser?.id,
            input,
          },
        })
      }}
    >
      <StyledPasswordField
        label="change password"
        fieldName="newPassword"
        placeholder="new password"
        validation={{ required: true }}
      />
      <div className="flex justify-center">
        <Submit disabled={loading} className="btn-secondary">
          change password
        </Submit>
      </div>
    </Form>
  )
}

export default ChangePasswordForm
