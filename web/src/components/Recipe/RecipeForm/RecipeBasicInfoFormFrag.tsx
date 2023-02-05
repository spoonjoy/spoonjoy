import { observer } from 'mobx-react-lite'

import { FieldErrors } from '@redwoodjs/forms'

import StyledNumberField from 'src/components/formComponents/StyledNumberField'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import { IRecipeInputStore } from 'src/stores/RecipeInputStore'

interface RecipeBasicInfoFormFragProps {
  recipeInputStore: IRecipeInputStore
  errors: FieldErrors
}
const RecipeBasicInfoFormFrag = ({
  recipeInputStore,
  errors,
}: RecipeBasicInfoFormFragProps) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    servings,
    setServings,
  } = recipeInputStore

  // Update based on Prisma schema
  const MAX_TITLE_LENGTH = 60
  const MAX_DESCRIPTION_LENGTH = 140

  return (
    <>
      <StyledTextField
        fieldName="title"
        label="title"
        defaultValue={title}
        onChange={(e) => {
          const { value } = e.target
          setTitle(value)
        }}
        validation={{ required: true, maxLength: MAX_TITLE_LENGTH }}
        maxLength={MAX_TITLE_LENGTH}
        currentLength={title.length}
      />
      <StyledTextAreaField
        fieldName="description"
        label="description"
        defaultValue={description}
        onChange={(e) => {
          const { value } = e.target
          setDescription(value)
        }}
        validation={{ maxLength: MAX_DESCRIPTION_LENGTH }}
        maxLength={MAX_DESCRIPTION_LENGTH}
        currentLength={description?.length || 0}
      />
      <StyledNumberField
        fieldName="servings"
        label="servings"
        defaultValue={servings}
        onChange={(e) => {
          const { value } = e.target
          setServings(Number(value))
        }}
        validation={{ valueAsNumber: true }}
      />
    </>
  )
}

export default observer(RecipeBasicInfoFormFrag)
