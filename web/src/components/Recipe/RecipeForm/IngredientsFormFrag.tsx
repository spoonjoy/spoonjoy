import { useFieldArray, useFormContext, useWatch } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'

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
    control,
    name: `steps.${stepNum - 1}.ingredients`,
  })

  const stepOutputUses = useWatch<RecipeFormType>({
    name: `steps.${stepNum - 1}.stepOutputUses`,
  })
  const stepOutputUsesLength = Array.isArray(stepOutputUses)
    ? stepOutputUses.length
    : 0

  return (
    <>
      <legend className="block text-sm font-medium text-gray-700">
        step {stepNum} ingredients
      </legend>
      {ingredients.map((ingredient, ingIdx) => {
        return (
          <IngredientFormFrag
            key={`step-${stepNum}-ingredient-${ingIdx}`}
            stepNum={stepNum}
            ingIdx={ingIdx}
            ingredient={ingredient}
          />
        )
      })}
      <AddRemBtns
        id="add-rem-ings-btns"
        itemName="ingredient"
        onAdd={() => {
          addToIngredients({
            quantity: NaN,
            ingredientName: '',
            unitName: '',
          })
        }}
        onRem={removeFromIngredients}
        canRem={
          (stepOutputUsesLength >= 1 || ingredients.length > 1) &&
          ingredients.length > 0
        } // need to have at least one ingredient or stepOutputUse
        containerClassName="pt-2"
      />
    </>
  )
}
