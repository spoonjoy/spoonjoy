import { gql } from 'graphql-tag'
import type { CreateCookbookInput, CreateCookbookMutation } from 'types/graphql'

import { RWGqlError } from '@redwoodjs/forms'
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

export interface IUseNewCookbookMutationOutput {
  onSave: onCreateCookbook
  loading: boolean
  error?: RWGqlError
}

const useNewCookbookMutation = (
  onCreateCookbookComplete?: (newCookbookId: string) => void
): IUseNewCookbookMutationOutput => {
  const [createCookbook, { loading, error }] =
    useMutation<CreateCookbookMutation>(CREATE_COOKBOOK_MUTATION, {
      onCompleted: (data) => {
        toast.success('Cookbook created')
        onCreateCookbookComplete && onCreateCookbookComplete(data.cookbook.id)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const onSave: onCreateCookbook = (input: CreateCookbookInput) => {
    createCookbook({ variables: { input } })
  }

  return {
    onSave,
    loading,
    error,
  }
}

export default useNewCookbookMutation
