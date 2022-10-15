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
        validation={{ required: true }}
        fieldErrors={errors.title}
      />
      <StyledTextAreaField
        fieldName="description"
        label="Description"
        defaultValue={description}
        onChange={(e) => {
          const { value } = e.target
          setDescription(value)
        }}
        fieldErrors={errors.description}
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
