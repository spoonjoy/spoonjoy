import { useDraggable } from '@dnd-kit/core'

import { UseFieldArrayRemove, useFormContext } from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import {
  getIngredientItemInfo,
  ListItem,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'

import { IngredientFormFragManualInput } from './IngredientFormFragManualInput'

import { RecipeFormType } from '.'

interface IngredientFormFragProps {
  stepNum: number
  ingIdx: number
  removeFromIngredients: UseFieldArrayRemove
  isRemovable?: boolean
}

export interface IDraggableIngredientData {
  stepNum: number
  ingIdx: number
}

const IngredientFormFrag = ({
  stepNum,
  ingIdx,
  removeFromIngredients,
  isRemovable = true,
}: IngredientFormFragProps) => {
  const { getValues } = useFormContext<RecipeFormType>()
  const ingredientFieldName = `steps.${
    stepNum - 1
  }.ingredients.${ingIdx}` as const
  const [ingredient, setIngredient] = React.useState(
    getValues(ingredientFieldName)
  )

  const persistValues = usePersistValuesOnChange()

  const draggableData: IDraggableIngredientData = {
    stepNum,
    ingIdx,
  }

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ingredientFieldName,
    data: draggableData,
  })

  const draggableStyle: React.CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: 'relative',
        zIndex: 99999,
      }
    : undefined

  const { quantity, unitName, ingredientName } = ingredient

  return (
    <ListItem
      ref={setNodeRef}
      listType="recipeIngredients"
      uniqueId={ingredientFieldName}
      itemInfo={getIngredientItemInfo({
        id: ingredientFieldName,
        quantity,
        unit: {
          name: unitName,
        },
        ingredientRef: {
          name: ingredientName,
        },
      })}
      draggableConfig={{
        isDraggable: true,
        style: draggableStyle,
        attributes,
        listeners,
      }}
      deletableConfig={{
        isDeletable: isRemovable,
        onClickDelete: (e) => {
          e.preventDefault()
          removeFromIngredients(ingIdx)
          persistValues()
        },
      }}
      editableConfig={{
        isEditable: true,
        onToggleEditCallback: () => {
          setIngredient({ ...getValues(ingredientFieldName) })
        },
        editInterface: (
          <IngredientFormFragManualInput stepNum={stepNum} ingIdx={ingIdx} />
        ),
      }}
    />
  )
}

export default IngredientFormFrag
