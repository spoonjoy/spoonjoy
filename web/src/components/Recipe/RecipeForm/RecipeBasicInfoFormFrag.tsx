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
    <div className="mr-6">
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
      <StyledNumberField
        fieldName="servings"
        label="servings"
        placeholder="4"
        validation={{ valueAsNumber: true }}
        onChange={onChange}
        markOptional
      />
    </div>
  )
}

export default RecipeBasicInfoFormFrag
