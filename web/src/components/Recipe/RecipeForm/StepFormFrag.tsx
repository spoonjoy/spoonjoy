import { observer } from 'mobx-react-lite'

import { FieldErrors, HiddenField } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import { IRecipeStepInputStore } from 'src/stores/RecipeInputStore'

import IngredientFormFrag from './IngredientFormFrag'
import { RecipeFormControl } from './RecipeForm'
import StepOutputUsesFormFrag from './StepOutputUsesFormFrag'

interface StepFormFragProps {
  recipeId?: string // this is necessary when editing a recipe because eventually I'd like to be able to update steps directly etc
  step: IRecipeStepInputStore
  removeIngredientFields: (stepNum: number, ingIdx: number) => void
  removeStepOutputFields: (stepNum: number, outputUseIdx: number) => void
  errors: FieldErrors
  control: RecipeFormControl
}

const StepFormFrag = ({
  recipeId,
  step,
  removeIngredientFields,
  errors,
  control,
}: StepFormFragProps) => {
  const {
    stepNum,
    stepTitle,
    setStepTitle,
    description,
    ingredients,
    stepOutputUses,
    setStepOutputUses,
    addIngredient,
    removeIngredient,
  } = step
  return (
    <div className="mb-3">
      <h2 className="block text-lg font-medium text-gray-700">
        Step {stepNum}
      </h2>
      <div className="ml-3 mb-3">
        <StyledTextField
          fieldName={`steps.${stepNum - 1}.stepTitle`}
          label={`Step ${stepNum} Title`}
          defaultValue={stepTitle}
          onChange={(e) => {
            const { value } = e.target
            setStepTitle(value)
          }}
          fieldErrors={errors.stepTitle}
        />
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
          canRem={
            (ingredients.length > 1 || stepOutputUses.length >= 1) &&
            ingredients.length > 0
          } // need to have at least one ingredient or stepOutputUse
          containerClassName="pt-2"
        />
        {stepNum > 1 && (
          <>
            <legend className="mt-2 block text-sm font-medium text-gray-700">
              In step {stepNum}, use the output of the following steps:
            </legend>
            <StepOutputUsesFormFrag
              stepOutputUses={stepOutputUses}
              setStepOutputUses={setStepOutputUses}
              stepNum={stepNum}
              name={`steps.${stepNum - 1}.stepOutputUses`}
              control={control}
            />
          </>
        )}
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
