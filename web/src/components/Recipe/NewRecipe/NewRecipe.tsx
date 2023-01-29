import type { CreateRecipeInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RecipeForm, { onCreateRecipe } from 'src/components/Recipe/RecipeForm'
import { useStore } from 'src/stores/RootStore'

const CREATE_RECIPE_MUTATION = gql`
  mutation CreateRecipeMutation($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
    }
  }
`

const NewRecipe = () => {
  const { recipeInputStore } = useStore()

  if (recipeInputStore.id) {
    recipeInputStore.clear()
  }

  const [createRecipe, { loading, error }] = useMutation(
    CREATE_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Recipe created')
        navigate(routes.myRecipes())
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
      {/* Only render the form once the store reflects a new recipe */}
      {!recipeInputStore.id && (
        <RecipeForm onSave={onSave} loading={loading} error={error} />
      )}
    </>
  )
}

export default NewRecipe
