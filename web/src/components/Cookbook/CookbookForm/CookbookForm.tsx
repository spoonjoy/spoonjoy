import type {
  CreateCookbookInput,
  EditCookbookById,
  UpdateCookbookInput,
} from 'types/graphql'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

import StyledTextField from 'src/components/formComponents/StyledTextField'

type FormUpdateCookbook = NonNullable<UpdateCookbookInput>
type FormCreateCookbook = NonNullable<CreateCookbookInput>

export type onCreateCookbook = (data: CreateCookbookInput) => void
export type onUpdateCookbook = (
  recipeId: string,
  data: UpdateCookbookInput
) => void

interface CookbookFormProps {
  cookbook?: EditCookbookById['cookbook']
  onSave: onCreateCookbook | onUpdateCookbook
  error?: RWGqlError
  loading: boolean
}

const CookbookForm = ({
  cookbook,
  onSave,
  error,
  loading,
}: CookbookFormProps) => {
  const onSubmit = (data: FormUpdateCookbook | FormCreateCookbook) => {
    console.log('onSubmit data:', data)
    if (cookbook) {
      ;(onSave as onUpdateCookbook)(cookbook.id, data as FormUpdateCookbook)
    } else {
      ;(onSave as onCreateCookbook)(data as FormCreateCookbook)
    }
  }

  // Update based on Prisma schema
  const MAX_TITLE_LENGTH = 191

  return (
    <div className="p-5">
      <Form<FormUpdateCookbook | FormCreateCookbook>
        onSubmit={onSubmit}
        error={error}
        config={{ mode: 'onTouched' }}
      >
        <FormError
          error={error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <StyledTextField
          fieldName="title"
          label="Title"
          defaultValue={cookbook?.title || undefined}
          validation={{ required: true, maxLength: MAX_TITLE_LENGTH }}
          // maxLength={MAX_TITLE_LENGTH}
          // currentLength={title.length}
        />

        <div className="flex justify-center sm:justify-end">
          <Submit disabled={loading} className="btn-submit-primary">
            {cookbook ? 'Update Cookbook' : 'Create New Cookbook'}
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CookbookForm
