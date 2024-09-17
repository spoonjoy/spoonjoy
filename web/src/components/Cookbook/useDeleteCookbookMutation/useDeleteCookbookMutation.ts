import { gql } from 'graphql-tag'
import { DeleteCookbookMutation } from 'types/graphql'

import { RWGqlError } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DELETE_COOKBOOK_MUTATION = gql`
  mutation DeleteCookbookMutation($id: String!) {
    cookbook: deleteCookbook(id: $id) {
      id
    }
  }
`

export type onDeleteCookbook = (id: string) => void

export interface IUseDeleteCookbookMutationOutput {
  onDelete: onDeleteCookbook
  loading: boolean
  error?: RWGqlError
}

interface IUseDeleteCookbookMutation {
  onDeleteCookbookComplete?: (cookbookId: string) => void
}

const useDeleteCookbookMutation = ({
  onDeleteCookbookComplete,
}: IUseDeleteCookbookMutation): IUseDeleteCookbookMutationOutput => {
  const [deleteCookbook, { loading, error }] =
    useMutation<DeleteCookbookMutation>(DELETE_COOKBOOK_MUTATION, {
      onCompleted: (data) => {
        toast.success('cookbook deleted')
        onDeleteCookbookComplete && onDeleteCookbookComplete(data.cookbook.id)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const onDelete: onDeleteCookbook = (id: string) => {
    deleteCookbook({ variables: { id } })
  }

  return {
    onDelete,
    loading,
    error,
  }
}

export default useDeleteCookbookMutation
