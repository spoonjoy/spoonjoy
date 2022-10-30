import { observer } from 'mobx-react-lite'

import { FieldErrors, HiddenField } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import { IRecipeStepInputStore } from 'src/stores/RecipeInputStore'

import IngredientFormFrag from './IngredientFormFrag'

interface StepFormFragProps {
  recipeId?: string // this is necessary when editing a recipe because eventually I'd like to be able to update steps directly etc
  step: IRecipeStepInputStore
  removeIngredientFields: (stepNum: number, ingIdx: number) => void
  removeStepOutputFields: (stepNum: number, outputUseIdx: number) => void
  errors: FieldErrors
}

const StepFormFrag = ({
  recipeId,
  step,
  removeIngredientFields,
  removeStepOutputFields,
  errors,
}: StepFormFragProps) => {
  const {
    stepNum,
    description,
    ingredients,
    stepOutputUses,
    addIngredient,
    removeIngredient,
    addStepOutputUse,
    removeStepOutputUse,
  } = step
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
        <legend className="mt-2 block text-sm font-medium text-gray-700">
          Step {stepNum} Previous Step Uses
        </legend>
        {stepOutputUses.map((stepOutputUse, stepUseIdx) => {
          return (
            <div key={`step-${stepNum}-stepusage-${stepUseIdx}`}>
              step output use goes here
            </div>
          )
        })}
        <AddRemBtns
          id="add-rem-stepoutputuses-btns"
          itemName="Use Step Output"
          onAdd={() => {
            addStepOutputUse()
          }}
          onRem={() => {
            removeStepOutputFields(stepNum, ingredients.length - 1)
            removeStepOutputUse()
          }}
          canRem={stepOutputUses.length > 0}
          containerClassName="pt-2"
        />
      </div>
      {recipeId && (
        <HiddenField
          name={`steps.${stepNum - 1}.recipeId`}
          defaultValue={recipeId}
        />
      )}
      <HiddenField
        name={`steps.${stepNum - 1}.stepNum`}
        defaultValue={stepNum}
        validation={{ valueAsNumber: true }}
      />
      <StyledTextAreaField
        fieldName={`steps.${stepNum - 1}.description`}
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
