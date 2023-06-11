import type {
  CreateCookbookInput,
  EditCookbookById,
  UpdateCookbookInput,
} from 'types/graphql'

import { Form, FormError, Submit, useForm } from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { classNames } from 'src/helpers/css'

import { onCreateCookbook } from '../useNewCookbookMutation'

type FormUpdateCookbook = NonNullable<UpdateCookbookInput>
type FormCreateCookbook = NonNullable<CreateCookbookInput>

export type onUpdateCookbook = (
  cookbookId: string,
  data: UpdateCookbookInput
) => void

interface CookbookFormProps {
  // it's null while loading, and undefined when creating a new cookbook
  cookbook?: EditCookbookById['cookbook'] | null
  onSave: onCreateCookbook | onUpdateCookbook
  error?: RWGqlError
  loading: boolean
  inline?: boolean
}

/**
 * This form is designed for use in a modal dialog.
 */
const CookbookForm = ({
  cookbook,
  onSave,
  error,
  loading,
  inline = false,
}: CookbookFormProps) => {
  const formMethods = useForm<FormUpdateCookbook | FormCreateCookbook>({
    mode: inline ? 'onSubmit' : 'onBlur',
  })
  const fieldRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    fieldRef.current?.focus()
  }, [fieldRef])

  const { watch } = formMethods
  const onSubmit = (data: FormUpdateCookbook | FormCreateCookbook) => {
    console.log('onSubmit data:', data)
    if (cookbook) {
      ;(onSave as onUpdateCookbook)(cookbook.id, data as FormUpdateCookbook)
    } else {
      ;(onSave as onCreateCookbook)(data as FormCreateCookbook)
    }
  }

  // this is used only for new cookbooks when the form is inline
  const [isSubmitButtonChecked, setIsSubmitButtonChecked] =
    React.useState(false)

  // Update based on Prisma schema
  const MAX_TITLE_LENGTH = 60

  return (
    <div className={classNames(inline ? 'pt-5' : 'p-5')}>
      <Form<FormUpdateCookbook | FormCreateCookbook>
        formMethods={formMethods}
        onSubmit={onSubmit}
        error={error}
        className={classNames(inline && 'flex items-center')}
      >
        <FormError
          error={error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <StyledTextField
          fieldName="title"
          inline
          placeholder={cookbook === null ? 'loading...' : 'my favorite recipes'}
          defaultValue={cookbook?.title || undefined}
          validation={{ required: true, maxLength: MAX_TITLE_LENGTH }}
          maxLength={MAX_TITLE_LENGTH}
          currentLength={watch().title?.length || 0}
          ref={fieldRef}
          disabled={cookbook === null}
        />

        <div
          className={classNames(
            inline ? 'align-middle' : 'mt-10 flex justify-center'
          )}
        >
          <Submit
            disabled={loading}
            className={inline ? '' : 'btn-submit-primary'}
          >
            {cookbook === undefined ? (
              inline ? (
                <input
                  type="checkbox"
                  checked={isSubmitButtonChecked}
                  className="save-checkbox"
                  disabled={loading}
                  onChange={() => {
                    setIsSubmitButtonChecked(true)
                    onSubmit(watch())
                  }}
                />
              ) : (
                'create new cookbook'
              )
            ) : (
              'update cookbook'
            )}
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CookbookForm
