import {
  AddToCookbookMutation,
  RemoveFromCookbookMutation,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

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

export interface IWithAddRemoveCookbookMutationsChildProps {
  onAddToCookbook: onAddRemFromCookbook
  onRemoveFromCookbook: onAddRemFromCookbook
  loadingAdd: boolean
  loadingRemove: boolean
}

interface IWithAddRemoveCookbookMutationsProps<T extends object = object> {
  child: React.FC<IWithAddRemoveCookbookMutationsChildProps & T>
  onAddToCookbookComplete?: (cookbookId: string) => void
  onRemoveFromCookbookComplete?: (cookbookId: string) => void
  outerProps: T
}

const withAddRemoveCookbookMutations = <T extends object>({
  child,
  onAddToCookbookComplete,
  onRemoveFromCookbookComplete,
  outerProps,
}: IWithAddRemoveCookbookMutationsProps<T>) => {
  const WithAddRemoveCookbookMutationsComponent = () => {
    const [addToCookbook, { loading: loadingAdd }] =
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

    const [removeFromCookbook, { loading: loadingRemove }] =
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

    const innerProps = {
      onAddToCookbook,
      onRemoveFromCookbook,
      loadingAdd,
      loadingRemove,
    }

    return child({ ...innerProps, ...outerProps })
  }
  return WithAddRemoveCookbookMutationsComponent
}

export default withAddRemoveCookbookMutations
