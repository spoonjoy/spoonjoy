import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditCookbookById, UpdateCookbookInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'




type FormCookbook = NonNullable<EditCookbookById['cookbook']>

interface CookbookFormProps {
  cookbook?: EditCookbookById['cookbook']
  onSave: (data: UpdateCookbookInput, id?: FormCookbook['id']) => void
  error: RWGqlError
  loading: boolean
}

const CookbookForm = (props: CookbookFormProps) => {
  const onSubmit = (data: FormCookbook) => {
  
    
    
  
    
    
  
    props.onSave(data, props?.cookbook?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormCookbook> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
      
        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>
        
          <TextField
            name="title"
            defaultValue={props.cookbook?.title}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="title" className="rw-field-error" />

        <Label
          name="authorId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Author id
        </Label>
        
          <TextField
            name="authorId"
            defaultValue={props.cookbook?.authorId}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="authorId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CookbookForm
