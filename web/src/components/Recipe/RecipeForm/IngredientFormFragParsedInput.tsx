import { debounce } from 'lodash'
import { CreateIngredientInput } from 'types/graphql'

import { useFormContext, useWatch } from '@redwoodjs/forms'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import { useIngredientParseQuery } from 'src/components/Ingredient/useIngredientParseLazyQuery'
import {
  getIngredientItemInfo,
  IListItemInfo,
  ListItem,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'

import { RecipeFormType } from '.'

interface IngredientFormFragParsedInputProps {
  fieldName: string
  setNewIngFields: React.Dispatch<
    React.SetStateAction<CreateIngredientInput | undefined>
  >
  setNewIngItemInfo: React.Dispatch<React.SetStateAction<IListItemInfo>>
  placeholderIngItemInfo: IListItemInfo
}

export const IngredientFormFragParsedInput = ({
  fieldName,
  setNewIngFields,
  setNewIngItemInfo,
  placeholderIngItemInfo,
}: IngredientFormFragParsedInputProps) => {
  const { parseIngredient, loading, error } = useIngredientParseQuery(
    (data) => {
      console.log('parseIngredient:', data.parseIngredient)
      const { quantity, unitName, ingredientName } = data.parseIngredient

      setNewIngFields({
        quantity,
        unitName,
        ingredientName,
      })

      setNewIngItemInfo(
        getIngredientItemInfo({
          id: fieldName,
          quantity,
          unit: {
            name: unitName,
          },
          ingredientRef: {
            name: ingredientName,
          },
        })
      )
    },
    () => {
      setNewIngFields(undefined)
      setNewIngItemInfo(placeholderIngItemInfo)
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
    <>
      <div className="flex items-center gap-1.5 pl-2 text-sm text-gray-500">
        {loading && <LoadingSpinner className="h-3.5 w-3.5" />}
      </div>
      <div className="relative z-20">
        <StyledTextField
          fieldName={fieldName}
          onChange={debouncedOnInputChange}
          placeholder="half cup flour"
        />
      </div>
    </>
  )
}
