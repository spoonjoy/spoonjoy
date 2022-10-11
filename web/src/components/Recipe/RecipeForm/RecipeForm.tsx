import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  DatetimeLocalField,
  Submit,
  useForm,
  HiddenField,
} from '@redwoodjs/forms'

import { DevTool } from '@hookform/devtools'

import type { EditRecipeById, UpdateRecipeInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { useStore } from 'src/stores/RootStore'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledNumberField from 'src/components/formComponents/StyledNumberField'
import { PlusIcon } from '@heroicons/react/20/solid'
import { MinusIcon } from '@heroicons/react/24/outline'
import { observer } from 'mobx-react-lite'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormRecipe = NonNullable<EditRecipeById['recipe']>

interface RecipeFormProps {
  recipe?: EditRecipeById['recipe']
  onSave: (data: UpdateRecipeInput, id?: FormRecipe['id']) => void
  error?: RWGqlError
  loading: boolean
}

const RecipeForm = (props: RecipeFormProps) => {
  const { recipeInputStore } = useStore()
  const formMethods = useForm()
  const {
    formState: { errors },
    control,
  } = formMethods

  const onSubmit = (data: FormRecipe) => {
    console.log('onSubmit data:', data)
    // props.onSave(data, props?.recipe?.id)
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

        <StyledTextField
          fieldName="title"
          label="Title"
          defaultValue={recipeInputStore.title}
          onChange={(e) => {
            const { value } = e.target
            recipeInputStore.setTitle(value)
          }}
          validation={{ required: true }}
          fieldErrors={errors.title}
        />

        <StyledTextAreaField
          fieldName="description"
          label="Description"
          defaultValue={recipeInputStore.description}
          onChange={(e) => {
            const { value } = e.target
            recipeInputStore.setDescription(value)
          }}
          fieldErrors={errors.description}
        />

        <StyledNumberField
          fieldName="servings"
          label="Servings"
          defaultValue={recipeInputStore.servings}
          onChange={(e) => {
            const { value } = e.target
            recipeInputStore.setServings(Number(value))
          }}
          fieldErrors={errors.servings}
        />

        {recipeInputStore.steps.map((step) => {
          const { stepNum, description, ingredients } = step
          return (
            <div className="mb-3" key={step.stepNum}>
              <h2 className="block text-lg font-medium text-gray-700">
                Step {step.stepNum}
                <HiddenField
                  name={`steps[${stepNum - 1}].stepNum`}
                  defaultValue={stepNum}
                />
                <StyledTextAreaField
                  fieldName={`steps[${stepNum - 1}].description`}
                  label="Description"
                  defaultValue={description}
                  onChange={(e) => {
                    const { value } = e.target
                    step.setDescription(value)
                  }}
                  fieldErrors={errors.description}
                />
              </h2>
            </div>
          )
        })}

        <div
          id="add-rem-steps-btns"
          className="flex items-center justify-center p-8"
        >
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              onClick={() => {
                recipeInputStore.addStep()
              }}
              type="button"
              className="relative inline-flex items-center rounded-l-md border border-green-800 border-r-gray-500 border-opacity-25 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-gray-50 hover:shadow-md focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span className="sr-only">Add Step</span>
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
              Step
            </button>
            <button
              onClick={() => {
                recipeInputStore.removeStep()
              }}
              type="button"
              className="relative -ml-px inline-flex items-center rounded-r-md border bg-white px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 enabled:border-red-800 enabled:border-l-gray-500 enabled:border-opacity-25 enabled:text-red-700 enabled:hover:bg-gray-50 enabled:hover:shadow-md disabled:border-gray-300 disabled:text-gray-500"
              disabled={recipeInputStore.steps.length > 0 ? false : true}
            >
              <span className="sr-only">Remove Step</span>
              <MinusIcon className="h-5 w-5" aria-hidden="true" />
              Step
            </button>
          </span>
        </div>

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
      <DevTool control={control} />
    </div>
  )
}

export default observer(RecipeForm)
