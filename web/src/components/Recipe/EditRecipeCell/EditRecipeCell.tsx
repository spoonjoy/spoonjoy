import type { EditRecipeById, UpdateRecipeInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { CellSuccessProps, CellFailureProps, MetaTags } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {
  clearPersistedFormValues,
  getPersistedFormValues,
  setPersistedFormValues,
} from 'src/components/formComponents/usePersistFormValues'
import RecipeForm, {
  onUpdateRecipe,
  RecipeFormType,
} from 'src/components/Recipe/RecipeForm'
import { SimpleHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

import { recipeQueryResponseToFormUpdateRecipe } from '../EditRecipeHelpers/EditRecipeHelpers'

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
        stepNum
        stepTitle
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
        stepOutputUses {
          id
          outputOfStep {
            stepNum
            stepTitle
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

export const Success = ({ recipe }: CellSuccessProps<EditRecipeById>) => {
  const [shouldRenderForm, setShouldRenderForm] = React.useState(false)

  // only want this to run on first load
  if (!shouldRenderForm) {
    getPersistedFormValues<RecipeFormType>('recipe-form').then(
      (persistedValues) => {
        // if you're editing a recipe, and leave the page, and then go back to editing the recipe, we don't want to erase your work. so:
        // set the persisted form values to the fresh values of the recipe that's being edited IF:
        if (
          !persistedValues || // ...there aren't already persisted values, or...
          !('recipeId' in persistedValues) || // ...the persisted values are for a new recipe, ie no 'recipeId', or...
          persistedValues.recipeId !== recipe.id // ...the persisted values are for editing a recipe, but that's not the recipe we're trying to edit
        ) {
          setPersistedFormValues(
            'recipe-form',
            recipeQueryResponseToFormUpdateRecipe(recipe),
            () => setShouldRenderForm(true)
          )
        } else {
          setShouldRenderForm(true)
        }
      }
    )
  }

  const [updateRecipe, { loading, error }] = useMutation(
    UPDATE_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('recipe updated!')
        navigate(routes.recipe({ id: recipe.id }))
        clearPersistedFormValues('recipe-form')
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
      <HeaderSlot.Plug id="edit-recipe">
        <SimpleHeader title={`edit recipe "${recipe.title}"`} />
      </HeaderSlot.Plug>
      {/* only render the form once the store's id reflects the recipes id, aka the store has been set to the recipe that's being edited */}
      {shouldRenderForm && (
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
