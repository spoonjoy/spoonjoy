import { gql } from 'graphql-tag'
import type {
  AddToCookbookMutation,
  RemoveFromCookbookMutation,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const ADD_TO_COOKBOOK_MUTATION = gql`
  mutation AddToCookbookMutation($id: String!, $recipeId: String!) {
    addToCookbook(id: $id, recipeId: $recipeId) {
      cookbookId
    }
  }
`

const REMOVE_FROM_COOKBOOK_MUTATION = gql`
  mutation RemoveFromCookbookMutation($id: String!, $recipeId: String!) {
    removeFromCookbook(id: $id, recipeId: $recipeId) {
      cookbookId
    }
  }
`

export type onAddRemFromCookbook = (id: string, recipeId: string) => void

export interface IUseAddRemoveCookbookMutationsOutput {
  onAddToCookbook: onAddRemFromCookbook
  onRemoveFromCookbook: onAddRemFromCookbook
  loadingAdd: boolean
  loadingRemove: boolean
  errorAdd?: Error
  errorRemove?: Error
}

interface IUseAddRemoveCookbookMutations {
  onAddToCookbookComplete?: (cookbookId: string) => void
  onRemoveFromCookbookComplete?: (cookbookId: string) => void
}

const useAddRemoveCookbookMutations = ({
  onAddToCookbookComplete,
  onRemoveFromCookbookComplete,
}: IUseAddRemoveCookbookMutations): IUseAddRemoveCookbookMutationsOutput => {
  const [addToCookbook, { loading: loadingAdd, error: errorAdd }] =
    useMutation<AddToCookbookMutation>(ADD_TO_COOKBOOK_MUTATION, {
      onCompleted: (data) => {
        toast.success('recipe added to cookbook')
        onAddToCookbookComplete &&
          onAddToCookbookComplete(data.addToCookbook.cookbookId)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const [removeFromCookbook, { loading: loadingRemove, error: errorRemove }] =
    useMutation<RemoveFromCookbookMutation>(REMOVE_FROM_COOKBOOK_MUTATION, {
      onCompleted: (data) => {
        toast.success('recipe removed from cookbook')
        onRemoveFromCookbookComplete &&
          onRemoveFromCookbookComplete(data.removeFromCookbook.cookbookId)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const onAddToCookbook: onAddRemFromCookbook = (
    id: string,
    recipeId: string
  ) => {
    addToCookbook({ variables: { id, recipeId } })
  }

  const onRemoveFromCookbook: onAddRemFromCookbook = (
    id: string,
    recipeId: string
  ) => {
    removeFromCookbook({ variables: { id, recipeId } })
  }

  return {
    onAddToCookbook,
    onRemoveFromCookbook,
    loadingAdd,
    loadingRemove,
    errorAdd,
    errorRemove,
  }
}

export default useAddRemoveCookbookMutations
