import { debounce } from 'lodash'

import { useFormContext } from '@redwoodjs/forms'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
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
  const ingFieldNamePrefix = `steps.${
    stepNum - 1
  }.ingredients.${ingIdx}` as const

  const { setValue } = useFormContext<RecipeFormType>()
  const persistValues = usePersistValuesOnChange()

  const { parseIngredient, loading, error } = useIngredientParseQuery(
    (data) => {
      console.log('parseIngredient:', data.parseIngredient)
      const { quantity, unitName, ingredientName } = data.parseIngredient

      setValue(`${ingFieldNamePrefix}.quantity`, quantity)
      setValue(`${ingFieldNamePrefix}.unitName`, unitName)
      setValue(`${ingFieldNamePrefix}.ingredientName`, ingredientName)

      persistValues()
    }
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const MIN_INPUT_LENGTH = 4 // this is arbitrary but i figured the smallest you could have is, eg, '1g a' (where 'a' is some ingredient name - are there any 1 letter ingredient names? feh)
    if (value.length >= MIN_INPUT_LENGTH) {
      parseIngredient({
        variables: {
          input: e.target.value,
        },
      })
    }
  }

  const debouncedOnInputChange = debounce(onInputChange, 1000)

  return (
    <StyledTextField
      fieldName={`${ingFieldNamePrefix}.rawIngredientInput`}
      onChange={debouncedOnInputChange}
      placeholder="half cup flour"
    />
  )
}
