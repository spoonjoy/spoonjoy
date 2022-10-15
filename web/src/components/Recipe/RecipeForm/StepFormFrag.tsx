import { observer } from 'mobx-react-lite'

import { FieldErrors, HiddenField } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import { IRecipeStepInputStore } from 'src/stores/RecipeInputStore'

import IngredientFormFrag from './IngredientFormFrag'

interface StepFormFragProps {
  step: IRecipeStepInputStore
  removeIngredientFields: (stepNum: number, ingIdx: number) => void
  errors: FieldErrors
}

const StepFormFrag = ({
  step,
  removeIngredientFields,
  errors,
}: StepFormFragProps) => {
  const { stepNum, description, ingredients, addIngredient, removeIngredient } =
    step
  return (
    <div className="mb-3">
      <h2 className="block text-lg font-medium text-gray-700">
        Step {stepNum}
      </h2>
      <div className="ml-3 mb-3">
        <legend className="block text-sm font-medium text-gray-700">
          Step {stepNum} Ingredients
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
          itemName="Ingredient"
          onAdd={() => {
            addIngredient()
          }}
          onRem={() => {
            removeIngredientFields(stepNum, ingredients.length - 1)
            removeIngredient()
          }}
          canRem={ingredients.length > 1} // need to have at least one ingredient
          containerClassName="pt-2"
        />
      </div>
      <HiddenField
        name={`steps[${stepNum - 1}].stepNum`}
        defaultValue={stepNum}
      />
      <StyledTextAreaField
        fieldName={`steps[${stepNum - 1}].description`}
        label={`Step ${step.stepNum} Description`}
        defaultValue={description}
        onChange={(e) => {
          const { value } = e.target
          step.setDescription(value)
        }}
        fieldErrors={errors.description}
      />
    </div>
  )
}

export default observer(StepFormFrag)
