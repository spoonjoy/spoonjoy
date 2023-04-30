import { debounce } from 'lodash'
import { CreateIngredientInput } from 'types/graphql'

import { useFormContext } from '@redwoodjs/forms'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { useIngredientParseQuery } from 'src/components/Ingredient/useIngredientParseLazyQuery'
import {
  getIngredientItemInfo,
  IListItemInfo,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'

import { RecipeFormType } from '.'

interface IngredientFormFragParsedInputProps {
  fieldName: `steps.${number}.newIngRawInput`
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
    const { setError } = useFormContext<RecipeFormType>()
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
        setError(fieldName, {
          type: 'custom',
          message: 'there was an error parsing the input',
        })
      }
    )

    if (error) {
      setError(fieldName, {
        type: 'custom',
        message: 'there was an error parsing the input',
      })
    }

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
      <div>
        <StyledTextField
          ref={ref}
          fieldName={fieldName}
          onChange={debouncedOnInputChange}
          onKeyDown={onKeyDown}
          placeholder="half cup flour"
          endComponent={
            loading ? (
              <LoadingSpinner className="h-3.5 w-3.5" />
            ) : (
              submitBtn && submitBtn
            )
          }
        />
      </div>
    )
  }
)
