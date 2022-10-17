import { observer } from 'mobx-react-lite'
import { applySnapshot } from 'mobx-state-tree'
import type { EditRecipeById, UpdateRecipeInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { CellSuccessProps, CellFailureProps, MetaTags } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RecipeForm, { onUpdateRecipe } from 'src/components/Recipe/RecipeForm'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'
import { recipeQueryResponseToInputSnapshotIn } from 'src/stores/RecipeInputStore'
import { useStore } from 'src/stores/RootStore'

export const QUERY = gql`
  query EditRecipeById($id: String!) {
    recipe: recipe(id: $id) {
      id
      title
      description
      servings
      chef {
        id
        username
      }
      steps {
        id
        stepNum
        description
        ingredients {
          id
          quantity
          unit {
            name
          }
          ingredientRef {
            name
          }
        }
      }
    }
  }
`
const UPDATE_RECIPE_MUTATION = gql`
  mutation UpdateRecipeMutation($id: String!, $input: UpdateRecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = observer(
  ({ recipe }: CellSuccessProps<EditRecipeById>) => {
    const { recipeInputStore } = useStore()

    if (recipeInputStore.id !== recipe.id) {
      applySnapshot(
        recipeInputStore,
        recipeQueryResponseToInputSnapshotIn(recipe)
      )
    }

    const [updateRecipe, { loading, error }] = useMutation(
      UPDATE_RECIPE_MUTATION,
      {
        onCompleted: () => {
          toast.success('Recipe updated!')
          navigate(routes.recipe({ id: recipe.id }))
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )

    const onSave: onUpdateRecipe = (
      id: string,
      input: UpdateRecipeInput,
      onSaveComplete?: () => void
    ) => {
      updateRecipe({ variables: { id, input } }).then((response) => {
        !response.errors && onSaveComplete && onSaveComplete()
      })
    }

    return (
      <>
        <MetaTags
          title={`Edit Recipe "${recipe.title}"`}
          description="Edit Recipe Page"
        />
        <HeaderSlot.Plug id="edit-recipe">{`Edit Recipe "${recipe.title}"`}</HeaderSlot.Plug>
        {/* only render the form once the store's id reflects the recipes id, aka the store has been set to the recipe that's being edited */}
        {recipeInputStore.id === recipe.id && (
          <RecipeForm
            recipe={recipe}
            onSave={onSave}
            error={error}
            loading={loading}
          />
        )}
      </>
    )
  }
)
