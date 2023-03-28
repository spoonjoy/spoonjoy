import type { CreateRecipeInput, CreateRecipeMutation } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {
  clearPersistedFormValues,
  getPersistedFormValues,
} from 'src/components/formComponents/usePersistFormValues'
import RecipeForm, {
  onCreateRecipe,
  RecipeFormType,
} from 'src/components/Recipe/RecipeForm'

const CREATE_RECIPE_MUTATION = gql`
  mutation CreateRecipeMutation($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
    }
  }
`

const NewRecipe = () => {
  const [shouldRenderForm, setShouldRenderForm] = React.useState(false)
  if (!shouldRenderForm) {
    getPersistedFormValues<RecipeFormType>('recipe-form').then(
      (persistedValues) => {
        if (persistedValues && 'recipeId' in persistedValues) {
          clearPersistedFormValues('recipe-form').then(() =>
            setShouldRenderForm(true)
          )
        } else {
          setShouldRenderForm(true)
        }
      }
    )
  }

  const [createRecipe, { loading, error }] = useMutation<CreateRecipeMutation>(
    CREATE_RECIPE_MUTATION,
    {
      onCompleted: (data) => {
        toast.success('recipe created')
        navigate(routes.recipe({ id: data.createRecipe.id }))
        clearPersistedFormValues('recipe-form')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave: onCreateRecipe = (
    input: CreateRecipeInput,
    onSaveComplete?: () => void
  ) => {
    createRecipe({ variables: { input } }).then((response) => {
      !response.errors && onSaveComplete && onSaveComplete()
    })
  }

  return (
    <>
      {shouldRenderForm && (
        <RecipeForm onSave={onSave} loading={loading} error={error} />
      )}
    </>
  )
}

export default NewRecipe
