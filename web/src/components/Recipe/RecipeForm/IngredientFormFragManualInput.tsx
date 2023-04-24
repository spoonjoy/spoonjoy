import { FieldArrayWithId, NumberField, TextField } from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

import { RecipeFormType } from '.'

interface IIngredientsFormFragManualInputProps {
  stepNum: number
  ingIdx: number
  ingredient: FieldArrayWithId<RecipeFormType, `steps.${number}.ingredients`>
}

export const IngredientFormFragManualInput = ({
  stepNum,
  ingIdx,
  ingredient,
}: IIngredientsFormFragManualInputProps) => {
  const { quantity, unitName, ingredientName } = ingredient

  const persistValues = usePersistValuesOnChange()
  return (
    <div>
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
            name={`steps.${stepNum - 1}.ingredients.${ingIdx}.ingredientName`}
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
  )
}
