import type { CreateCookbookInput, CreateCookbookMutation } from 'types/graphql'

import { RWGqlError } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

const CREATE_COOKBOOK_MUTATION = gql`
  mutation CreateCookbookMutation($input: CreateCookbookInput!) {
    cookbook: createCookbook(input: $input) {
      id
    }
  }
`
export type onCreateCookbook = (data: CreateCookbookInput) => void

export interface IWithNewCookbookMutationChildProps {
  onSave: onCreateCookbook
  loading: boolean
  error?: RWGqlError
}

interface IWithNewCookbookMutationProps<T extends object = object> {
  child: React.FC<IWithNewCookbookMutationChildProps & T>
  onCreateCookbook?: (newCookbookId: string) => void
  outerProps: T
}

/**
 * This was split out from the NewCookbook component into a HOC to make it reusable for SignupAndCreateCookbook
 * @param child - the component that will be wrapped
 * @param onCreateCookbook - a callback that will be called when the new cookbook has been created
 * @param outerProps - any props that will be passed to the child component
 */
const withNewCookbookMutation = <T extends object>({
  child,
  onCreateCookbook,
  outerProps,
}: IWithNewCookbookMutationProps<T>) => {
  const WithNewCookbookMutationComponent = () => {
    const [createCookbook, { loading, error }] =
      useMutation<CreateCookbookMutation>(CREATE_COOKBOOK_MUTATION, {
        onCompleted: (data) => {
          toast.success('Cookbook created')
          navigate(routes.cookbook({ id: data.cookbook.id }))
          onCreateCookbook && onCreateCookbook(data.cookbook.id)
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

    const innerProps = {
      onSave,
      loading,
      error,
    }

    return child({ ...innerProps, ...outerProps })
  }
  return WithNewCookbookMutationComponent
}

export default withNewCookbookMutation
