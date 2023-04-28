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
}

export const AddToIngsParsedInput = ({
  addToIngredients,
}: IAddToIngsParsedInputProps) => {
  const uniqueId = `ing-new`

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
    <>
      <ul className="min-w-[200px]">
        <ListItem
          listType="recipeIngredients"
          uniqueId={uniqueId}
          itemInfo={newIngItemInfo}
        />
      </ul>
      <IngredientFormFragParsedInput
        uniqueId={uniqueId}
        setNewIngFields={setNewIngFields}
        setNewIngItemInfo={setNewIngItemInfo}
        placeholderIngItemInfo={placeholderIngItemInfo}
      />
    </>
  )
}
