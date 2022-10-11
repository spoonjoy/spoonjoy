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
} from '@redwoodjs/forms'

import { DevTool } from '@hookform/devtools'

import type { EditRecipeById, UpdateRecipeInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { useStore } from 'src/stores/RootStore'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'

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
    <div className="rw-form-wrapper">
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
          fieldErrors={errors.title}
        />

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

export default RecipeForm
