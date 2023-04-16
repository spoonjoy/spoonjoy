import { useDroppable } from '@dnd-kit/core'

import { FieldArrayWithId, HiddenField } from '@redwoodjs/forms'

import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import { classNames } from 'src/helpers/css'

import { IngredientsFormFrag } from './IngredientsFormFrag'
import { RecipeFormType } from './RecipeForm'
import StepOutputUsesFormFrag from './StepOutputUsesFormFrag'

interface StepFormFragProps {
  recipeId?: string // this is necessary when editing a recipe because eventually I'd like to be able to update steps directly etc
  step: FieldArrayWithId<RecipeFormType, 'steps', 'id'>
}

export interface IDroppableStepData {
  stepNum: number
}

const StepFormFrag = ({ recipeId, step }: StepFormFragProps) => {
  const onChange = usePersistValuesOnChange()

  const droppableData: IDroppableStepData = {
    stepNum: step.stepNum,
  }

  const { isOver, setNodeRef } = useDroppable({
    id: `step-${step.id}`,
    data: droppableData,
  })

  const { stepNum, description } = step

  return (
    <div className={classNames('relative mb-3')} ref={setNodeRef}>
      <div
        // -left-7 is because of the negative margin for the delete btn
        className={classNames(
          'flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm',
          isOver ? 'absolute top-0 -left-7 right-0 bottom-0 z-10' : 'hidden'
        )}
      >
        move to step {step.stepNum}
      </div>
      {/* <h2 className="block text-lg font-medium text-gray-700">
        step {stepNum}
      </h2> */}
      <div className="ml-3 mb-3">
        <StyledTextField
          fieldName={`steps.${stepNum - 1}.stepTitle`}
          label={`step ${stepNum} title`}
          onChange={onChange}
        />

        <IngredientsFormFrag stepNum={stepNum} />

        {stepNum > 1 && (
          <>
            <StepOutputUsesFormFrag stepNum={stepNum} />
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
        onChange={onChange}
      />
    </div>
  )
}

export default StepFormFrag
