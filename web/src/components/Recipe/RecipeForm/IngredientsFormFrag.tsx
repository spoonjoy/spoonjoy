import { useAutoAnimate } from '@formkit/auto-animate/react'

import { useFieldArray, useFormContext, useWatch } from '@redwoodjs/forms'

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

  const animationParentRef = useAutoAnimate({})

  return (
    <div className="m-auto">
      <legend className="mb-2 block text-sm font-medium text-gray-700">
        step {stepNum} ingredients
      </legend>
      <fieldset className={classNames('m-auto max-w-sm ')}>
        <ul
          ref={animationParentRef as React.RefObject<HTMLUListElement>}
          className={classNames('-space-y-py')}
        >
          {ingredients.map((ingredient, ingIdx) => {
            return (
              <IngredientFormFrag
                key={ingredient.id}
                stepNum={stepNum}
                ingIdx={ingIdx}
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
    </div>
  )
}
