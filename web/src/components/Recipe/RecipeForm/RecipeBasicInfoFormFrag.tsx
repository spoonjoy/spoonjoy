import { useWatch } from '@redwoodjs/forms'

import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

const RecipeBasicInfoFormFrag = () => {
  // Update based on Prisma schema
  const MAX_TITLE_LENGTH = 60
  const MAX_DESCRIPTION_LENGTH = 140
  const MAX_SERVINGS_LENGTH = 40

  const onChange = usePersistValuesOnChange()

  return (
    // mr-6 is to make room for the character counter
    <div className="form-section-padding mr-6">
      <StyledTextField
        fieldName="title"
        label="title"
        placeholder="Garlic Knots"
        validation={{ required: true, maxLength: MAX_TITLE_LENGTH }}
        maxLength={MAX_TITLE_LENGTH}
        currentLength={useWatch({ name: 'title' })?.length || 0}
        onChange={onChange}
      />
      <StyledTextAreaField
        fieldName="description"
        label="description"
        placeholder="These garlicky, buttery knots are the perfect addition to any meal. Serve them warm and watch as your guests fight over the last one!"
        validation={{ maxLength: MAX_DESCRIPTION_LENGTH }}
        maxLength={MAX_DESCRIPTION_LENGTH}
        currentLength={useWatch({ name: 'description' })?.length || 0}
        onChange={onChange}
        markOptional
      />
      <StyledTextField
        fieldName="servings"
        label="servings"
        placeholder="4 normal garlic knots, or 1 giant one"
        validation={{ maxLength: MAX_SERVINGS_LENGTH }}
        maxLength={MAX_SERVINGS_LENGTH}
        currentLength={useWatch({ name: 'servings' })?.length || 0}
        onChange={onChange}
        markOptional
      />
    </div>
  )
}

export default RecipeBasicInfoFormFrag
