import { useDraggable } from '@dnd-kit/core'
import { Bars3Icon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { CreateIngredientInput } from 'types/graphql'

import {
  FieldError,
  FieldArrayWithId,
  UseFieldArrayRemove,
  useWatch,
} from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
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

const IngredientFormFrag = ({
  stepNum,
  ingIdx,
  ingredient,
  removeFromIngredients,
}: IngredientFormFragProps) => {
  const persistValues = usePersistValuesOnChange()
  const ingFields = useWatch<RecipeFormType>({
    name: `steps.${stepNum - 1}.ingredients.${ingIdx}`,
  }) as CreateIngredientInput

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

  return (
    <div ref={setNodeRef} style={draggableStyle}>
      <div className="flex gap-1">
        <button
          className="w-[10%] sm:w-[5%]"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            removeFromIngredients(ingIdx)
            persistValues()
          }}
        >
          <span className="sr-only">remove ingredient {ingIdx}</span>
          <MinusCircleIcon className="m-auto h-5 w-5 text-red-800 hover:text-red-500" />
        </button>

        <div
          className={classNames(
            'relative mt-2  w-[80%] transition-all sm:w-[90%]',
            usingManualInput ? 'h-[6rem]' : 'h-[4.3rem]'
          )}
        >
          <div className="absolute w-full">
            <div className="relative z-20">
              <IngredientFormFragParsedInput
                stepNum={stepNum}
                ingIdx={ingIdx}
              />
            </div>
            <div className="-mt-2 flex items-center gap-1.5 pl-2 text-sm text-gray-500">
              {ingFields.quantity || ''} {ingFields.unitName}{' '}
              {ingFields.ingredientName}
              <LoadingSpinner className="h-3.5 w-3.5" />
            </div>
          </div>

          <div
            className={classNames(
              'absolute w-full transition-all',
              usingManualInput ? 'top-12' : 'top-0'
            )}
          >
            <IngredientFormFragManualInput
              stepNum={stepNum}
              ingIdx={ingIdx}
              ingredient={ingredient}
            />
          </div>
        </div>

        <button
          type="button"
          className="w-[10%] sm:w-[5%]"
          {...listeners}
          {...attributes}
        >
          <span className="sr-only">move ingredient {ingIdx}</span>
          <Bars3Icon className="m-auto h-5 w-5 touch-none text-gray-400 hover:text-gray-500" />
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
