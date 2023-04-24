import { useDraggable } from '@dnd-kit/core'
import { Bars3Icon, MinusCircleIcon } from '@heroicons/react/24/outline'

import {
  FieldError,
  FieldArrayWithId,
  UseFieldArrayRemove,
} from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

import { IngredientFormFragManualInput } from './IngredientFormFragManualInput'

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

const IngredientFormFrag = ({
  stepNum,
  ingIdx,
  ingredient,
  removeFromIngredients,
}: IngredientFormFragProps) => {
  const persistValues = usePersistValuesOnChange()

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

  return (
    <div ref={setNodeRef} style={draggableStyle}>
      <div className="-ml-12 -mr-9 flex gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            removeFromIngredients(ingIdx)
            persistValues()
          }}
        >
          <span className="sr-only">remove ingredient {ingIdx}</span>
          <MinusCircleIcon className="h-9 w-9 p-2 text-red-800 hover:text-red-500" />
        </button>

        <IngredientFormFragManualInput
          stepNum={stepNum}
          ingIdx={ingIdx}
          ingredient={ingredient}
        />

        <button type="button" {...listeners} {...attributes}>
          <span className="sr-only">move ingredient {ingIdx}</span>
          <Bars3Icon className="h-9 w-9 touch-none p-2 text-gray-400 hover:text-gray-500" />
        </button>
      </div>

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
    </div>
  )
}

export default IngredientFormFrag
