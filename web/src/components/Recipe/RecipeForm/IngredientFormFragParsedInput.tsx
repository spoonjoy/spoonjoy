import { debounce } from 'lodash'

import { useFormContext } from '@redwoodjs/forms'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { useIngredientParseQuery } from 'src/components/Ingredient/useIngredientParseLazyQuery'

import { RecipeFormType } from '.'

interface IngredientFormFragParsedInputProps {
  stepNum: number
  ingIdx: number
}

export const IngredientFormFragParsedInput = ({
  stepNum,
  ingIdx,
}: IngredientFormFragParsedInputProps) => {
  const { setValue } = useFormContext<RecipeFormType>()
  const { parseIngredient, loading, error } = useIngredientParseQuery(
    (data) => {
      console.log('parseIngredient:', data.parseIngredient)
      const { quantity, unitName, ingredientName } = data.parseIngredient
      const ingFieldNamePrefix = `steps.${
        stepNum - 1
      }.ingredients.${ingIdx}` as const
      setValue(`${ingFieldNamePrefix}.quantity`, quantity)
      setValue(`${ingFieldNamePrefix}.unitName`, unitName)
      setValue(`${ingFieldNamePrefix}.ingredientName`, ingredientName)
    }
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    parseIngredient({
      variables: {
        input: e.target.value,
      },
    })
  }

  const debouncedOnInputChange = debounce(onInputChange, 1000)

  return (
    <StyledTextField
      fieldName="rawIngredientInput"
      onChange={debouncedOnInputChange}
    />
  )
}
