import { useWatch } from '@redwoodjs/forms'

import StyledNumberField from 'src/components/formComponents/StyledNumberField'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

const RecipeBasicInfoFormFrag = () => {
  // Update based on Prisma schema
  const MAX_TITLE_LENGTH = 60
  const MAX_DESCRIPTION_LENGTH = 140

  const onChange = usePersistValuesOnChange()

  return (
    <>
      <StyledTextField
        fieldName="title"
        label="title"
        validation={{ required: true, maxLength: MAX_TITLE_LENGTH }}
        maxLength={MAX_TITLE_LENGTH}
        currentLength={useWatch({ name: 'title' })?.length || 0}
        onChange={onChange}
      />
      <StyledTextAreaField
        fieldName="description"
        label="description"
        validation={{ maxLength: MAX_DESCRIPTION_LENGTH }}
        maxLength={MAX_DESCRIPTION_LENGTH}
        currentLength={useWatch({ name: 'description' })?.length || 0}
        onChange={onChange}
      />
      <StyledNumberField
        fieldName="servings"
        label="servings"
        validation={{ valueAsNumber: true }}
        onChange={onChange}
      />
    </>
  )
}

export default RecipeBasicInfoFormFrag
