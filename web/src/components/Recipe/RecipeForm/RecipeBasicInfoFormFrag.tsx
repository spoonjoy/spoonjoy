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

  // Update the following based on prisma schema - default `string` is 191
  const MAX_TITLE_LENGTH = 75
  const MAX_DESCRIPTION_LENGTH = 191

  return (
    <>
      <StyledTextField
        fieldName="title"
        label="Title"
        defaultValue={title}
        onChange={(e) => {
          const { value } = e.target
          setTitle(value)
        }}
        validation={{ required: true, maxLength: MAX_TITLE_LENGTH }}
        fieldErrors={errors.title}
        maxLength={MAX_TITLE_LENGTH}
        currentLength={title.length}
      />
      <StyledTextAreaField
        fieldName="description"
        label="Description"
        defaultValue={description}
        onChange={(e) => {
          const { value } = e.target
          setDescription(value)
        }}
        validation={{ maxLength: MAX_TITLE_LENGTH }}
        fieldErrors={errors.description}
        maxLength={MAX_DESCRIPTION_LENGTH}
        currentLength={description?.length || 0}
      />
      <StyledNumberField
        fieldName="servings"
        label="Servings"
        defaultValue={servings}
        onChange={(e) => {
          const { value } = e.target
          setServings(Number(value))
        }}
        fieldErrors={errors.servings}
        validation={{ valueAsNumber: true }}
      />
    </>
  )
}

export default observer(RecipeBasicInfoFormFrag)
