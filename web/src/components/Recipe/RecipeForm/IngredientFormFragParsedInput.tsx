import { debounce } from 'lodash'
import { CreateIngredientInput } from 'types/graphql'

import { useFormContext, useWatch } from '@redwoodjs/forms'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import { useIngredientParseQuery } from 'src/components/Ingredient/useIngredientParseLazyQuery'
import {
  getIngredientItemInfo,
  ListItem,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'

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

  const ingFields = useWatch<RecipeFormType>({
    name: ingFieldNamePrefix,
  }) as CreateIngredientInput

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

  const uniqueId = `step-${stepNum}-ing-${ingIdx}`

  const shouldRenderListItemPreview =
    !!ingFields.quantity && !!ingFields.unitName && !!ingFields.ingredientName

  const itemInfo = shouldRenderListItemPreview
    ? getIngredientItemInfo({
        id: uniqueId,
        quantity: ingFields.quantity,
        unit: {
          name: ingFields.unitName,
        },
        ingredientRef: {
          name: ingFields.ingredientName,
        },
      })
    : null

  return (
    <>
      <div className="relative z-20">
        <StyledTextField
          fieldName={`${ingFieldNamePrefix}.rawIngredientInput`}
          onChange={debouncedOnInputChange}
          placeholder="half cup flour"
        />
      </div>
      <div className="-mt-5 flex items-center gap-1.5 pl-2 text-sm text-gray-500">
        {itemInfo && (
          <ul className="min-w-[200px]">
            <ListItem
              listType="recipeIngredients"
              uniqueId={uniqueId}
              itemInfo={itemInfo}
            />
          </ul>
        )}
        {/* {ingFields.quantity || ''}
        &nbsp;&nbsp;
        {ingFields.unitName}
        &nbsp;&nbsp;
        {ingFields.ingredientName} */}
        {loading && <LoadingSpinner className="h-3.5 w-3.5" />}
      </div>
    </>
  )
}
