import type { CreateCookbookInput, CreateCookbookMutation } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import CookbookForm, {
  onCreateCookbook,
} from 'src/components/Cookbook/CookbookForm'

const CREATE_COOKBOOK_MUTATION = gql`
  mutation CreateCookbookMutation($input: CreateCookbookInput!) {
    createCookbook(input: $input) {
      id
    }
  }
`

const NewCookbook = () => {
  const [createCookbook, { loading, error }] =
    useMutation<CreateCookbookMutation>(CREATE_COOKBOOK_MUTATION, {
      onCompleted: (data) => {
        toast.success('Cookbook created')
        navigate(routes.cookbook({ id: data.createCookbook.id }))
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const onSave: onCreateCookbook = (
    input: CreateCookbookInput,
    onSaveComplete?: () => void
  ) => {
    createCookbook({ variables: { input } }).then((response) => {
      !response.errors && onSaveComplete && onSaveComplete()
    })
  }

  return <CookbookForm onSave={onSave} loading={loading} error={error} />
}

export default NewCookbook
