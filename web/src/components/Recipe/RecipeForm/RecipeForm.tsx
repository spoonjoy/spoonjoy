import { DevTool } from '@hookform/devtools'
import type {
  CreateRecipeInput,
  EditRecipeById,
  UpdateRecipeInput,
} from 'types/graphql'

import { Control, HiddenField, RWGqlError } from '@redwoodjs/forms'
import { Form, FormError, useForm, FormProvider } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/dist/toast'

import { getPersistedFormValuesAsDefaultValues } from 'src/components/formComponents/usePersistFormValues'
import { classNames } from 'src/helpers/css'

import RecipeSaveLoading from '../RecipeSaveLoading/RecipeSaveLoading'

import RecipeBasicInfoFormFrag from './RecipeBasicInfoFormFrag'
import ResetSubmitRecipeBtns from './ResetSubmitRecipeBtns'
import StepsFormFrag from './StepsFormFrag'

export type FormUpdateRecipe = NonNullable<UpdateRecipeInput>
export type FormCreateRecipe = NonNullable<CreateRecipeInput>
export type RecipeFormType = FormUpdateRecipe | FormCreateRecipe

const emptyRecipeFormValues: RecipeFormType = {
  title: '',
  description: '',
  servings: NaN,
  steps: [],
}

export type RecipeFormControl = Control<
  UpdateRecipeInput | CreateRecipeInput,
  any
>

export type onCreateRecipe = (data: CreateRecipeInput) => void
export type onUpdateRecipe = (recipeId: string, data: UpdateRecipeInput) => void

interface RecipeFormProps {
  recipe?: EditRecipeById['recipe']
  onSave: onCreateRecipe | onUpdateRecipe
  error?: RWGqlError
  loading: boolean
}

const RecipeForm = ({ recipe, onSave, error, loading }: RecipeFormProps) => {
  const formMethods = useForm<RecipeFormType>({
    mode: 'onTouched',
    defaultValues: getPersistedFormValuesAsDefaultValues<RecipeFormType>(
      'recipe-form',
      emptyRecipeFormValues
    ),
  })
  const { control, reset } = formMethods

  const onSubmit = (data: FormUpdateRecipe | FormCreateRecipe) => {
    console.log('onSubmit data:', data)
    setShowLoadingScreen(true)

    if (recipe) {
      ;(onSave as onUpdateRecipe)(recipe.id, data as FormUpdateRecipe)
    } else {
      ;(onSave as onCreateRecipe)(data as FormCreateRecipe)
    }
  }

  const [showLoadingScreen, setShowLoadingScreen] = React.useState(false)

  React.useEffect(() => {
    if (error) {
      setShowLoadingScreen(false)
    }
  }, [error])

  return (
    <FormProvider {...formMethods}>
      {showLoadingScreen && <RecipeSaveLoading />}
      <div className={classNames(showLoadingScreen && 'h-0 overflow-hidden')}>
        <Form<FormUpdateRecipe | FormCreateRecipe>
          formMethods={formMethods}
          onSubmit={onSubmit}
          error={error}
        >
          <FormError
            error={error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />

          {recipe && <HiddenField name={`recipeId`} defaultValue={recipe.id} />}

          <RecipeBasicInfoFormFrag />

          <StepsFormFrag />

          <ResetSubmitRecipeBtns
            loading={loading}
            mode={recipe ? 'update' : 'create'}
            onReset={(e) => {
              e.preventDefault() // needed so that this button doesn't try to submit the form
              reset(emptyRecipeFormValues)
              if (recipe) {
                navigate(routes.recipe({ id: recipe.id }))
                toast('recipe changes have been discarded')
              } else {
                toast('recipe form has been reset')
              }
            }}
          />
        </Form>
        {/* this starting showing up in prod for some reason */}
        {process.env.NODE_ENV === 'development' && (
          <DevTool control={control} />
        )}
      </div>
    </FormProvider>
  )
}

export default RecipeForm
