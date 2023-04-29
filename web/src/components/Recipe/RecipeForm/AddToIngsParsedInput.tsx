import { PlusIcon } from '@heroicons/react/20/solid'
import { CreateIngredientInput } from 'types/graphql'

import { UseFieldArrayAppend, useFormContext } from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import {
  IListItemInfo,
  ListItem,
  getIngredientItemInfo,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import { classNames } from 'src/helpers/css'

import { IngredientFormFragParsedInput } from './IngredientFormFragParsedInput'

import { RecipeFormType } from '.'

interface IAddToIngsParsedInputProps {
  addToIngredients: UseFieldArrayAppend<
    RecipeFormType,
    `steps.${number}.ingredients`
  >
  stepNum: number
}

export const AddToIngsParsedInput = ({
  addToIngredients,
  stepNum,
}: IAddToIngsParsedInputProps) => {
  const fieldName = `steps.${stepNum - 1}.newIngRawInput` as const

  const [newIngFields, setNewIngFields] = React.useState<
    CreateIngredientInput | undefined
  >()

  const { resetField } = useFormContext<RecipeFormType>()

  const persistValues = usePersistValuesOnChange()

  const placeholderIngItemInfo = getIngredientItemInfo(
    undefined,
    'start typing to add an ingredient'
  )

  const onAddToIngredients = () => {
    if (newIngFields) {
      addToIngredients(newIngFields)
      persistValues()
      setNewIngFields(undefined)
      setNewIngItemInfo(placeholderIngItemInfo)
      resetField(fieldName)
    }
  }

  const [newIngItemInfo, setNewIngItemInfo] = React.useState<IListItemInfo>(
    placeholderIngItemInfo
  )

  return (
    <div className="mt-3 max-w-sm">
      <ul className="mr-5">
        <ListItem
          listType="recipeIngredients"
          uniqueId={fieldName}
          itemInfo={newIngItemInfo}
          isPlaceholder
        />
      </ul>
      <div>
        <IngredientFormFragParsedInput
          fieldName={fieldName}
          setNewIngFields={setNewIngFields}
          setNewIngItemInfo={setNewIngItemInfo}
          placeholderIngItemInfo={placeholderIngItemInfo}
          submitBtn={
            <button
              type="button"
              className="inline-block"
              onClick={onAddToIngredients}
            >
              <PlusIcon
                className={classNames(
                  'h-5',
                  newIngFields ? 'text-green-700' : 'text-gray-500'
                )}
              />
            </button>
          }
        />
      </div>
    </div>
  )
}
