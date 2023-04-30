import { useFieldArray, useFormContext, useWatch } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import { classNames } from 'src/helpers/css'

import { AddToIngsParsedInput } from './AddToIngsParsedInput'
import IngredientFormFrag from './IngredientFormFrag'

import { RecipeFormType } from '.'

interface IIngredientsFormFragProps {
  stepNum: number
}

export const IngredientsFormFrag = ({ stepNum }: IIngredientsFormFragProps) => {
  const { control } = useFormContext<RecipeFormType>()
  const {
    fields: ingredients,
    append: addToIngredients,
    remove: removeFromIngredients,
  } = useFieldArray({
    control, // TODO investigate - this isn't required but without passing it in, ingredients doesn't have the right type for some reason
    name: `steps.${stepNum - 1}.ingredients`,
  })

  const stepOutputUses = useWatch<RecipeFormType>({
    name: `steps.${stepNum - 1}.stepOutputUses`,
  })
  const stepOutputUsesLength = Array.isArray(stepOutputUses)
    ? stepOutputUses.length
    : 0

  return (
    <div className="m-auto">
      <legend className="mb-2 block text-sm font-medium text-gray-700">
        step {stepNum} ingredients
      </legend>
      <fieldset
        className={classNames(
          'm-auto max-w-sm border-t border-b',
          ingredients.length ? 'border-gray-200' : 'border-white'
        )}
      >
        <ul
          className={classNames(
            'divide-y',
            ingredients.length ? 'divide-gray-200' : 'divide-gray-100'
          )}
        >
          {ingredients.map((ingredient, ingIdx) => {
            return (
              <IngredientFormFrag
                key={ingredient.id}
                stepNum={stepNum}
                ingIdx={ingIdx}
                ingredient={ingredient}
                removeFromIngredients={removeFromIngredients}
                isRemovable={
                  (stepOutputUsesLength >= 1 || ingredients.length > 1) &&
                  ingredients.length > 0
                } // need to have at least one ingredient or stepOutputUse
              />
            )
          })}
        </ul>
      </fieldset>
      <AddToIngsParsedInput
        addToIngredients={addToIngredients}
        stepNum={stepNum}
      />
      {/* <AddRemBtns
        id="add-rem-ings-btns"
        itemName="ingredient"
        onAdd={() => {
          addToIngredients({
            quantity: 0,
            ingredientName: '',
            unitName: '',
          })
        }}
        onRem={() => removeFromIngredients(ingredients.length - 1)}
        canRem={
          (stepOutputUsesLength >= 1 || ingredients.length > 1) &&
          ingredients.length > 0
        } // need to have at least one ingredient or stepOutputUse
        containerClassName="pt-2 flex items-center justify-center"
      /> */}
    </div>
  )
}
