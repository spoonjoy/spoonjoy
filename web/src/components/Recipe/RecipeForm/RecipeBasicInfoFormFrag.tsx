import { FieldErrors, useFormContext } from '@redwoodjs/forms'

import StyledNumberField from 'src/components/formComponents/StyledNumberField'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import usePersistFormValues from 'src/components/formComponents/usePersistFormValues'

interface RecipeBasicInfoFormFragProps {
  errors: FieldErrors
}
const RecipeBasicInfoFormFrag = ({ errors }: RecipeBasicInfoFormFragProps) => {
  // Update based on Prisma schema
  const MAX_TITLE_LENGTH = 60
  const MAX_DESCRIPTION_LENGTH = 140

  const formMethods = useFormContext()

  const { getValues } = formMethods

  usePersistFormValues()

  return (
    <>
      <StyledTextField
        fieldName="title"
        label="title"
        validation={{ required: true, maxLength: MAX_TITLE_LENGTH }}
        maxLength={MAX_TITLE_LENGTH}
        currentLength={getValues('title')?.length}
      />
      <StyledTextAreaField
        fieldName="description"
        label="description"
        validation={{ maxLength: MAX_DESCRIPTION_LENGTH }}
        maxLength={MAX_DESCRIPTION_LENGTH}
        currentLength={getValues('description')?.length || 0}
      />
      <StyledNumberField
        fieldName="servings"
        label="servings"
        validation={{ valueAsNumber: true }}
      />
    </>
  )
}

export default RecipeBasicInfoFormFrag
