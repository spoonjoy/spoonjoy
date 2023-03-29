import { useFieldArray, useFormContext } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'

import StepFormFrag from './StepFormFrag'

import { RecipeFormType } from '.'

const StepsFormFrag = () => {
  const { control, getValues } = useFormContext<RecipeFormType>()
  const {
    fields: steps,
    append: addToSteps,
    remove: removeFromSteps,
  } = useFieldArray({
    control,
    name: 'steps',
  })

  return (
    <>
      {steps.map((step) => {
        return (
          <StepFormFrag
            key={step.id}
            // key={`step-${step.stepNum}`}
            recipeId={getValues('recipeId')}
            step={step}
          />
        )
      })}

      <AddRemBtns
        id="add-rem-steps-btns"
        itemName="step"
        onAdd={() => addToSteps({ stepNum: steps.length + 1, description: '' })}
        onRem={() => removeFromSteps(steps.length - 1)}
        canRem={steps.length > 0}
        containerClassName="flex items-center justify-center p-8"
      />
    </>
  )
}

export default StepsFormFrag
