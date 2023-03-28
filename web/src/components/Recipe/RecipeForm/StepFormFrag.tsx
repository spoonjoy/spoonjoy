import { observer } from 'mobx-react-lite'

import {
  FieldArrayWithId,
  FieldErrors,
  HiddenField,
  useFieldArray,
} from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import usePersistFormValues from 'src/components/formComponents/usePersistFormValues'

import IngredientFormFrag from './IngredientFormFrag'
import { RecipeFormControl, RecipeFormType } from './RecipeForm'
import StepOutputUsesFormFrag from './StepOutputUsesFormFrag'

interface StepFormFragProps {
  recipeId?: string // this is necessary when editing a recipe because eventually I'd like to be able to update steps directly etc
  step: FieldArrayWithId<RecipeFormType, 'steps', 'id'>
  errors: FieldErrors
  control: RecipeFormControl
  getStepTitle: (stepNum: number) => string | null
}

const StepFormFrag = ({
  recipeId,
  step,
  control,
  getStepTitle,
}: StepFormFragProps) => {
  usePersistFormValues()

  const { stepNum, description } = step

  const {
    fields: ingredients,
    append: addToIngredients,
    remove: removeFromIngredients,
  } = useFieldArray({
    control,
    name: `steps.${stepNum - 1}.ingredients`,
  })

  const { fields: stepOutputUses, replace: setStepOutputUses } = useFieldArray({
    control,
    name: `steps.${stepNum - 1}.stepOutputUses`,
  })

  return (
    <div className="mb-3">
      <h2 className="block text-lg font-medium text-gray-700">
        step {stepNum}
      </h2>
      <div className="ml-3 mb-3">
        <StyledTextField
          fieldName={`steps.${stepNum - 1}.stepTitle`}
          label={`step ${stepNum} title`}
        />
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
            (ingredients.length > 1 || stepOutputUses.length >= 1) &&
            ingredients.length > 0
          } // need to have at least one ingredient or stepOutputUse
          containerClassName="pt-2"
        />
        {stepNum > 1 && (
          <>
            <legend className="mt-2 block text-sm font-medium text-gray-700">
              in step {stepNum}, use the output of the following steps:
            </legend>
            <StepOutputUsesFormFrag
              stepOutputUses={stepOutputUses}
              setStepOutputUses={setStepOutputUses}
              stepNum={stepNum}
              name={`steps.${stepNum - 1}.stepOutputUses`}
              control={control}
              getStepTitle={getStepTitle}
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
        label={`step ${step.stepNum} description`}
        defaultValue={description}
        validation={{
          required: { value: true, message: 'description is required.' },
        }}
      />
    </div>
  )
}

export default observer(StepFormFrag)
