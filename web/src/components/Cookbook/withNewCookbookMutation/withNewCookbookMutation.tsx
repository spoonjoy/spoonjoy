import type { CreateCookbookInput, CreateCookbookMutation } from 'types/graphql'

import { RWGqlError } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

const CREATE_COOKBOOK_MUTATION = gql`
  mutation CreateCookbookMutation($input: CreateCookbookInput!) {
    createCookbook(input: $input) {
      id
    }
  }
`
export type onCreateCookbook = (data: CreateCookbookInput) => void

interface IWithNewCookbookMutationChildProps {
  onSave: onCreateCookbook
  loading: boolean
  error?: RWGqlError
}

interface IWithNewCookbookMutationProps {
  child: React.FC<IWithNewCookbookMutationChildProps>
}

const withNewCookbookMutation = ({ child }: IWithNewCookbookMutationProps) => {
  const WithNewCookbookMutationComponent = () => {
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

    return child({ onSave, loading, error })
  }
  return WithNewCookbookMutationComponent
}

export default withNewCookbookMutation
