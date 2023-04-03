import { useDraggable, useDndMonitor } from '@dnd-kit/core'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { observer } from 'mobx-react-lite'

import {
  NumberField,
  TextField,
  FieldError,
  FieldArrayWithId,
  UseFieldArrayRemove,
  useFormContext,
} from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

import { IDroppableStepData } from './StepFormFrag'

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

  const onChange = usePersistValuesOnChange()

  const draggableData: IDraggableIngredientData = {
    stepNum,
    ingIdx,
  }

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `ingredient-${ingredient.id}`,
    data: draggableData,
  })

  const { getValues, setValue } = useFormContext<RecipeFormType>()

  useDndMonitor({
    onDragEnd: (event) => {
      const draggableIngredientData = event.active.data
        .current as IDraggableIngredientData
      const droppableStepData = event.over?.data.current as
        | IDroppableStepData
        | undefined

      const { stepNum: fromStep, ingIdx } = draggableIngredientData
      const toStep = droppableStepData?.stepNum

      const draggedIngName: `steps.${number}.ingredients.${number}` = `steps.${
        fromStep - 1
      }.ingredients.${ingIdx}`

      if (!toStep) {
        console.log(`dropped ${draggedIngName} on nothing`)
        return
      }
      if (toStep === fromStep) {
        console.log(`dropped ${draggedIngName} on itself`)
        return
      }

      const destinationIngsName: `steps.${number}.ingredients` = `steps.${
        toStep - 1
      }.ingredients`

      console.log(`dropped ${draggedIngName} on ${destinationIngsName}`)

      const draggedIngValue = getValues(draggedIngName)
      const destinationIngsValue = getValues(destinationIngsName) || []

      console.log(`draggedIngValue`, draggedIngValue)
      console.log(`destinationIngsValue`, destinationIngsValue)

      removeFromIngredients(ingIdx)
      setValue(destinationIngsName, [...destinationIngsValue, draggedIngValue])
    },
  })

  const draggableStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={draggableStyle} {...listeners} {...attributes}>
      <div className="mt-1 max-w-sm -space-y-px rounded-md shadow-sm">
        <div className="-ml-7 flex -space-x-px">
          <button
            className="mr-2"
            onClick={(e) => {
              e.preventDefault()
              removeFromIngredients(ingIdx)
            }}
          >
            <span className="sr-only">remove ingredient {ingIdx}</span>
            <MinusCircleIcon className="h-5 w-5 text-red-800 hover:text-red-500" />
          </button>
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
              className="relative block w-full rounded-none rounded-l-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              errorClassName="relative block w-full rounded-none rounded-l-md border-red-300 bg-transparent focus:z-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="5"
              step="any"
              min={0}
              validation={{
                required: { value: true, message: 'quantity is required.' },
                valueAsNumber: true,
              }}
              onChange={onChange}
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
              className="relative block w-full rounded-none border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              errorClassName="relative block w-full rounded-none border-red-300 bg-transparent focus:z-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="cups"
              validation={{
                required: { value: true, message: 'unit is required.' },
              }}
              onChange={onChange}
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
              name={`steps.${stepNum - 1}.ingredients.${ingIdx}.ingredientName`}
              defaultValue={ingredientName}
              className="relative block w-full rounded-none rounded-r-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              errorClassName="relative block w-full rounded-none rounded-r-md border-red-300 bg-transparent focus:z-10 focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="flour"
              validation={{
                required: {
                  value: true,
                  message: 'ingredient name is required.',
                },
              }}
              onChange={onChange}
            />
          </div>
        </div>
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

export default observer(IngredientFormFrag)
