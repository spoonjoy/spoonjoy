import { useDraggable } from '@dnd-kit/core'
import { Bars3Icon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'
import { CreateIngredientInput, UpdateIngredientInput } from 'types/graphql'

import {
  FieldError,
  FieldArrayWithId,
  UseFieldArrayRemove,
  useWatch,
} from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import {
  getIngredientItemInfo,
  ListItem,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'
import { classNames } from 'src/helpers/css'

import { IngredientFormFragManualInput } from './IngredientFormFragManualInput'
import { IngredientFormFragParsedInput } from './IngredientFormFragParsedInput'

import { RecipeFormType } from '.'

interface IngredientFormFragProps {
  stepNum: number
  ingIdx: number
  ingredient: FieldArrayWithId<RecipeFormType, `steps.${number}.ingredients`>
  removeFromIngredients: UseFieldArrayRemove
}

export interface IDraggableIngredientData {
  stepNum: number
  ingIdx: number
}

const btnClassName = 'mt-4 h-5 w-[10%] sm:w-[5%]'

const IngredientFormFrag = ({
  stepNum,
  ingIdx,
  ingredient,
  removeFromIngredients,
}: IngredientFormFragProps) => {
  const persistValues = usePersistValuesOnChange()

  const [usingManualInput, setUsingManualInput] = React.useState(false)

  const draggableData: IDraggableIngredientData = {
    stepNum,
    ingIdx,
  }

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `ingredient-${ingredient.id}`,
    data: draggableData,
  })

  const draggableStyle: React.CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: 'relative',
        zIndex: 99999,
      }
    : undefined

  const uniqueId = `ing-${ingredient.id}`

  const { quantity, unitName, ingredientName } = ingredient as
    | CreateIngredientInput
    | UpdateIngredientInput

  return (
    <>
      <ListItem
        ref={setNodeRef}
        listType="recipeIngredients"
        uniqueId={uniqueId}
        itemInfo={getIngredientItemInfo({
          id: uniqueId,
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
          isDeletable: true,
          onClickDelete: (e) => {
            e.preventDefault()
            removeFromIngredients(ingIdx)
            persistValues()
          },
        }}
        editableConfig={{
          isEditable: true,
          editInterface: (
            <IngredientFormFragManualInput
              stepNum={stepNum}
              ingIdx={ingIdx}
              ingredient={ingredient}
            />
          ),
        }}
      />

      <div className="flex flex-col">
        <FieldError
          name={`steps.${stepNum - 1}.ingredients.${ingIdx}.quantity`}
          className="mt-1 text-sm text-red-600"
        />
        <FieldError
          name={`steps.${stepNum - 1}.ingredients.${ingIdx}.unitName`}
          className="mt-1 text-sm text-red-600"
        />
        <FieldError
          name={`steps.${stepNum - 1}.ingredients.${ingIdx}.ingredientName`}
          className="mt-1 text-sm text-red-600"
        />
      </div>
    </>
  )
}

export default IngredientFormFrag
