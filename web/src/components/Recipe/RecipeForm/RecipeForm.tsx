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

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormRecipe = NonNullable<EditRecipeById['recipe']>

interface RecipeFormProps {
  recipe?: EditRecipeById['recipe']
  onSave: (data: UpdateRecipeInput, id?: FormRecipe['id']) => void
  error: RWGqlError
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
    props.onSave(data, props?.recipe?.id)
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
          defaultValue={recipeInputStore?.title}
          onChange={(e) => {
            const { value } = e.target
            console.log('title value:', value)
            recipeInputStore?.setTitle(value)
          }}
          validation={{ required: true }}
          fieldErrors={errors.title}
        />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.recipe?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="servings"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Servings
        </Label>

        <NumberField
          name="servings"
          defaultValue={props.recipe?.servings}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="servings" className="rw-field-error" />

        <Label
          name="chefId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Chef id
        </Label>

        <TextField
          name="chefId"
          defaultValue={props.recipe?.chefId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="chefId" className="rw-field-error" />

        <Label
          name="deletedAt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Deleted at
        </Label>

        <DatetimeLocalField
          name="deletedAt"
          defaultValue={formatDatetime(props.recipe?.deletedAt)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="deletedAt" className="rw-field-error" />

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
