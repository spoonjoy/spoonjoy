import { observer } from 'mobx-react-lite'

import { FieldArrayWithId, HiddenField } from '@redwoodjs/forms'

import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

import { IngredientsFormFrag } from './IngredientsFormFrag'
import { RecipeFormType } from './RecipeForm'
import StepOutputUsesFormFrag from './StepOutputUsesFormFrag'

interface StepFormFragProps {
  recipeId?: string // this is necessary when editing a recipe because eventually I'd like to be able to update steps directly etc
  step: FieldArrayWithId<RecipeFormType, 'steps', 'id'>
}

const StepFormFrag = ({ recipeId, step }: StepFormFragProps) => {
  const onChange = usePersistValuesOnChange()

  const { stepNum, description } = step

  return (
    <div className="mb-3">
      <h2 className="block text-lg font-medium text-gray-700">
        step {stepNum}
      </h2>
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

export default observer(StepFormFrag)
