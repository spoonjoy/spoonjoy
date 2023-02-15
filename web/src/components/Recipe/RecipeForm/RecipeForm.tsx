import { DevTool } from '@hookform/devtools'
import { observer } from 'mobx-react-lite'
import type {
  CreateRecipeInput,
  EditRecipeById,
  UpdateRecipeInput,
} from 'types/graphql'

import { Control, RWGqlError } from '@redwoodjs/forms'
import { Form, FormError, Submit, useForm } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/dist/toast'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import { classNames } from 'src/helpers/css'
import { useStore } from 'src/stores/RootStore'

import RecipeSaveLoading from '../RecipeSaveLoading/RecipeSaveLoading'

import RecipeBasicInfoFormFrag from './RecipeBasicInfoFormFrag'
import StepFormFrag from './StepFormFrag'

type FormUpdateRecipe = NonNullable<UpdateRecipeInput>
type FormCreateRecipe = NonNullable<CreateRecipeInput>

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
  const { recipeInputStore } = useStore()
  const formMethods = useForm<FormUpdateRecipe | FormCreateRecipe>({
    mode: 'onTouched',
  })
  const {
    formState: { errors },
    control,
    unregister,
    reset,
  } = formMethods

  const onSubmit = (data: FormUpdateRecipe | FormCreateRecipe) => {
    console.log('onSubmit data:', data)
    if (recipe) {
      ;(onSave as onUpdateRecipe)(recipe.id, data as FormUpdateRecipe)
    } else {
      ;(onSave as onCreateRecipe)(data as FormCreateRecipe)
    }
  }

  const getIngredientFieldsNames = (
    stepNum: number,
    ingIdx: number
  ): Array<
    | `steps.${number}.ingredients.${number}.quantity`
    | `steps.${number}.ingredients.${number}.unitName`
    | `steps.${number}.ingredients.${number}.ingredientName`
  > => {
    return [
      `steps.${stepNum - 1}.ingredients.${ingIdx}.quantity`,
      `steps.${stepNum - 1}.ingredients.${ingIdx}.unitName`,
      `steps.${stepNum - 1}.ingredients.${ingIdx}.ingredientName`,
    ]
  }

  const getStepOutputFieldsNames = (
    stepNum: number
  ): Array<`steps.${number}.stepOutputUses`> => {
    return [`steps.${stepNum - 1}.stepOutputUses`]
  }

  const getStepFieldsNames = (
    stepNum: number
  ): Array<
    | `steps.${number}.recipeId`
    | `steps.${number}.description`
    | `steps.${number}.stepNum`
    | `steps.${number}.stepTitle`
  > => {
    return [
      `steps.${stepNum - 1}.recipeId`,
      `steps.${stepNum - 1}.stepNum`,
      `steps.${stepNum - 1}.stepTitle`,
      `steps.${stepNum - 1}.description`,
    ]
  }

  const removeIngredientFields = (stepNum: number, ingIdx: number) => {
    unregister(getIngredientFieldsNames(stepNum, ingIdx))
  }

  const removeStepOutputFields = (stepNum: number) => {
    unregister(getStepOutputFieldsNames(stepNum))
  }

  const removeStepFields = (stepNum: number) => {
    const numOfIngs = recipeInputStore.steps[stepNum - 1].ingredients.length
    const numOfStepOutputUses =
      recipeInputStore.steps[stepNum - 1].stepOutputUses.length
    for (let i = 0; i < numOfIngs; i++) {
      removeIngredientFields(stepNum, i)
    }
    for (let i = 0; i < numOfStepOutputUses; i++) {
      removeStepOutputFields(stepNum)
    }
    unregister(getStepFieldsNames(stepNum))
  }

  /** For use by the stepOutputUse dropdown */
  const getStepTitle = (stepNum: number): string | null => {
    return recipeInputStore.steps[stepNum - 1].stepTitle
  }

  const [showLoadingScreen, setShowLoadingScreen] = React.useState(false)

  React.useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setShowLoadingScreen(true)
      }, 1000)
    }
    // can reenable this if necessary but it causes a flash of the form before redirect when saving is complete
    // else {
    //   setShowLoadingScreen(false)
    // }
  }, [loading])

  return (
    <>
      {showLoadingScreen && <RecipeSaveLoading />}
      <div
        className={classNames(
          showLoadingScreen && 'h-0 overflow-hidden',
          'p-5'
        )}
      >
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

          <RecipeBasicInfoFormFrag
            recipeInputStore={recipeInputStore}
            errors={errors}
          />

          {recipeInputStore.steps.map((step) => {
            return (
              <StepFormFrag
                key={`step-${step.stepNum}`}
                recipeId={recipeInputStore.id}
                step={step}
                removeIngredientFields={removeIngredientFields}
                removeStepOutputFields={removeStepOutputFields}
                errors={errors}
                control={control}
                getStepTitle={getStepTitle}
              />
            )
          })}

          <AddRemBtns
            id="add-rem-steps-btns"
            itemName="step"
            onAdd={() => {
              recipeInputStore.addStep()
            }}
            onRem={() => {
              removeStepFields(recipeInputStore.steps.length)
              recipeInputStore.removeStep()
            }}
            canRem={recipeInputStore.steps.length > 0}
            containerClassName="flex items-center justify-center p-8"
          />

          <div className="flex justify-center sm:justify-end">
            <div className="flex flex-col">
              {recipeInputStore.steps.length < 1 && (
                <span className="mb-2 text-sm text-red-600">
                  you need to add at least 1 step.
                </span>
              )}
              <Submit
                disabled={loading || recipeInputStore.steps.length < 1}
                className="btn-submit-primary"
              >
                {recipe ? 'update recipe' : 'create new recipe'}
              </Submit>
              <button
                onClick={(e) => {
                  e.preventDefault() // needed so that this button doesn't try to submit the form
                  recipeInputStore.clear()
                  reset({
                    title: '',
                    description: '',
                    servings: null,
                  })
                  if (recipe) {
                    navigate(routes.recipe({ id: recipe.id }))
                    toast('recipe changes have been discarded')
                  } else {
                    toast('recipe form has been reset')
                  }
                }}
                className="mt-4 rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 enabled:bg-red-600"
              >
                {recipe ? 'discard changes' : 'reset'}
              </button>
            </div>
          </div>
        </Form>
        <DevTool control={control} />
      </div>
    </>
  )
}

export default observer(RecipeForm)
