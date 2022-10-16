import { DevTool } from '@hookform/devtools'
import { observer } from 'mobx-react-lite'
import type {
  CreateRecipeInput,
  EditRecipeById,
  UpdateRecipeInput,
} from 'types/graphql'

import { RWGqlError } from '@redwoodjs/forms'
import { Form, FormError, Submit, useForm } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import { useStore } from 'src/stores/RootStore'

import RecipeBasicInfoFormFrag from './RecipeBasicInfoFormFrag'
import StepFormFrag from './StepFormFrag'

type FormRecipe = NonNullable<EditRecipeById['recipe']>

interface RecipeFormProps {
  recipe?: EditRecipeById['recipe']
  onSave: (
    data: CreateRecipeInput | UpdateRecipeInput,
    onSaveComplete?: () => void,
    id?: FormRecipe['id']
  ) => void
  error?: RWGqlError
  loading: boolean
}

const RecipeForm = (props: RecipeFormProps) => {
  const { recipeInputStore } = useStore()
  const formMethods = useForm()
  const {
    formState: { errors },
    control,
    unregister,
  } = formMethods

  const onSubmit = (data: FormRecipe) => {
    console.log('onSubmit data:', data)
    props.onSave(
      data,
      () => {
        recipeInputStore.clear()
      },
      props?.recipe?.id
    )
  }

  const getIngredientFieldsNames = (stepNum: number, ingIdx: number) => {
    return [
      `steps[${stepNum - 1}].ingredients[${ingIdx}].quantity`,
      `steps[${stepNum - 1}].ingredients[${ingIdx}].unitName`,
      `steps[${stepNum - 1}].ingredients[${ingIdx}].ingredientName`,
    ]
  }

  const getStepFieldsNames = (stepNum: number) => {
    return [
      `steps[${stepNum - 1}].stepNum`,
      `steps[${stepNum - 1}].description`,
    ]
  }

  const removeIngredientFields = (stepNum: number, ingIdx: number) => {
    unregister(getIngredientFieldsNames(stepNum, ingIdx))
  }

  const removeStepFields = (stepNum: number) => {
    const numOfIngs = recipeInputStore.steps[stepNum - 1].ingredients.length
    for (let i = 0; i < numOfIngs; i++) {
      removeIngredientFields(stepNum, i)
    }
    unregister(getStepFieldsNames(stepNum))
  }

  return (
    <div className="p-5">
      <Form<FormRecipe>
        formMethods={formMethods}
        onSubmit={onSubmit}
        error={props.error}
        config={{ mode: 'onBlur' }}
      >
        <FormError
          error={props.error}
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
              step={step}
              removeIngredientFields={removeIngredientFields}
              errors={errors}
            />
          )
        })}

        <AddRemBtns
          id="add-rem-steps-btns"
          itemName="Step"
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

        <div className="flex justify-end">
          <div className="flex flex-col">
            {recipeInputStore.steps.length < 1 && (
              <span className="mb-2 text-sm text-red-600">
                You need to add at least 1 step.
              </span>
            )}
            <Submit
              disabled={props.loading || recipeInputStore.steps.length < 1}
              className="rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 enabled:bg-indigo-600 disabled:bg-gray-400"
            >
              {recipeInputStore.id ? 'Update Recipe' : 'Create New Recipe'}
            </Submit>
            <button
              onClick={(e) => {
                e.preventDefault() // needed so that this button doesn't try to submit the form
                recipeInputStore.clear()
                window.location.reload() // easiest way to do this but can also explore instead directly setting the form fields directly
              }}
              className="rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 enabled:bg-indigo-600 disabled:bg-gray-400"
            >
              Reset Form
            </button>
          </div>
        </div>
      </Form>
      <DevTool control={control} />
    </div>
  )
}

export default observer(RecipeForm)
