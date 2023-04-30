import { debounce } from 'lodash'
import { CreateIngredientInput } from 'types/graphql'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { useIngredientParseQuery } from 'src/components/Ingredient/useIngredientParseLazyQuery'
import {
  getIngredientItemInfo,
  IListItemInfo,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'

interface IngredientFormFragParsedInputProps {
  fieldName: string
  setNewIngFields: React.Dispatch<
    React.SetStateAction<CreateIngredientInput | undefined>
  >
  setNewIngItemInfo: React.Dispatch<React.SetStateAction<IListItemInfo>>
  placeholderIngItemInfo: IListItemInfo
  submitBtn?: JSX.Element
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const IngredientFormFragParsedInput = React.forwardRef<
  HTMLInputElement,
  IngredientFormFragParsedInputProps
>(
  (
    {
      fieldName,
      setNewIngFields,
      setNewIngItemInfo,
      placeholderIngItemInfo,
      submitBtn,
      onKeyDown,
    },
    ref
  ) => {
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
      <div className="relative z-20">
        <StyledTextField
          ref={ref}
          fieldName={fieldName}
          onChange={debouncedOnInputChange}
          onKeyDown={onKeyDown}
          placeholder="half cup flour"
        />
        <div className="absolute right-2 top-[50%] bottom-0 -translate-y-1/2">
          {loading ? (
            <LoadingSpinner className="h-3.5 w-3.5" />
          ) : (
            submitBtn && submitBtn
          )}
        </div>
      </div>
    )
  }
)
