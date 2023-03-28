import { observer } from 'mobx-react-lite'

import {
  NumberField,
  TextField,
  FieldError,
  FieldArrayWithId,
} from '@redwoodjs/forms'

import { RecipeFormType } from '.'

interface IngredientFormFragProps {
  stepNum: number
  ingIdx: number
  ingredient: FieldArrayWithId<RecipeFormType, `steps.${number}.ingredients`>
}
const IngredientFormFrag = ({
  stepNum,
  ingIdx,
  ingredient,
}: IngredientFormFragProps) => {
  const { quantity, unitName, ingredientName } = ingredient
  return (
    <>
      <div className="mt-1 max-w-sm -space-y-px rounded-md shadow-sm">
        <div className="flex -space-x-px">
          <div className="min-w-0">
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
            />
          </div>
          <div className="min-w-0">
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
            />
          </div>
          <div className="min-w-0">
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
    </>
  )
}

export default observer(IngredientFormFrag)
