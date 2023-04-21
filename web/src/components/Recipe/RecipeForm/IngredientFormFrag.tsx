import { useDraggable } from '@dnd-kit/core'
import { Bars3Icon, MinusCircleIcon } from '@heroicons/react/24/outline'

import {
  NumberField,
  TextField,
  FieldError,
  FieldArrayWithId,
  UseFieldArrayRemove,
} from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

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
  const { quantity, unitName, ingredientName } = ingredient

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

        <div className="mt-1 max-w-sm rounded-md shadow-sm">
          <div className="flex -space-x-px">
            <div>
              <label
                htmlFor={`steps.${stepNum - 1}.ingredients.${ingIdx}.quantity`}
                className="sr-only"
              >
                Quantity
              </label>
              <NumberField
                name={`steps.${stepNum - 1}.ingredients.${ingIdx}.quantity`}
                defaultValue={quantity}
                className="relative block w-full rounded-none rounded-l-md border-gray-300 bg-white focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                errorClassName="relative block w-full rounded-none rounded-l-md border-red-300 bg-white focus:z-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="5"
                step="any"
                min={0}
                validation={{
                  required: { value: true, message: 'quantity is required.' },
                  valueAsNumber: true,
                }}
                onChange={persistValues}
              />
            </div>
            <div>
              <label
                htmlFor={`steps.${stepNum - 1}.ingredients.${ingIdx}.unitName`}
                className="sr-only"
              >
                Unit name
              </label>
              <TextField
                name={`steps.${stepNum - 1}.ingredients.${ingIdx}.unitName`}
                defaultValue={unitName}
                className="relative block w-full rounded-none border-gray-300 bg-white focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                errorClassName="relative block w-full rounded-none border-red-300 bg-white focus:z-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="cups"
                validation={{
                  required: { value: true, message: 'unit is required.' },
                }}
                onChange={persistValues}
              />
            </div>
            <div>
              <label
                htmlFor={`steps.${
                  stepNum - 1
                }.ingredients.${ingIdx}.ingredientName`}
                className="sr-only"
              >
                Ingredient name
              </label>
              <TextField
                name={`steps.${
                  stepNum - 1
                }.ingredients.${ingIdx}.ingredientName`}
                defaultValue={ingredientName}
                className="relative block w-full rounded-none rounded-r-md border-gray-300 bg-white focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                errorClassName="relative block w-full rounded-none rounded-r-md border-red-300 bg-white focus:z-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="flour"
                validation={{
                  required: {
                    value: true,
                    message: 'ingredient name is required.',
                  },
                }}
                onChange={persistValues}
              />
            </div>
          </div>
        </div>

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
