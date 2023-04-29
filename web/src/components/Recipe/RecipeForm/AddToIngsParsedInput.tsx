import { CreateIngredientInput } from 'types/graphql'

import { UseFieldArrayAppend } from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import {
  IListItemInfo,
  ListItem,
  getIngredientItemInfo,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'

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
  const fieldName = `steps.${stepNum - 1}.newIngRawInput`

  const [newIngFields, setNewIngFields] = React.useState<
    CreateIngredientInput | undefined
  >()

  const persistValues = usePersistValuesOnChange()

  const onAddToIngredients = () => {
    if (newIngFields) {
      addToIngredients(newIngFields)
      persistValues()
    }
  }

  const placeholderIngItemInfo = getIngredientItemInfo(
    undefined,
    'start typing to add an ingredient'
  )

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
      <IngredientFormFragParsedInput
        fieldName={fieldName}
        setNewIngFields={setNewIngFields}
        setNewIngItemInfo={setNewIngItemInfo}
        placeholderIngItemInfo={placeholderIngItemInfo}
      />
    </div>
  )
}
