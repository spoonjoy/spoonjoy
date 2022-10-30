import { Listbox } from '@headlessui/react'

import { IRecipeStepInputStore } from 'src/stores/RecipeInputStore'

interface StepOutputUsesFormFragProps {
  stepNum: number
  stepOutputUses: IRecipeStepInputStore['stepOutputUses']
}
const StepOutputUsesFormFrag = ({
  stepNum,
  stepOutputUses,
}: StepOutputUsesFormFragProps) => {
  const [selectedStepOutputUses, setSelectedStepOutputUses] =
    React.useState(stepOutputUses)
  return (
    <Listbox
      value={selectedStepOutputUses}
      onChange={setSelectedStepOutputUses}
      multiple
    >
      <Listbox.Button>
        {selectedStepOutputUses
          .map((outputUse) => `step ${outputUse.outputOfStepNum}`)
          .join(', ')}
      </Listbox.Button>
      <Listbox.Options>
        {/* if stepnum is, say, 3, we want this to be array of values 0 and 1 so that we can turn it into the options of steps 1 and 2. note that this form field should not be present on step 1 */}
        {[...Array(stepNum - 2).keys()].map((stepNumToUse) => (
          <Listbox.Option
            key={stepNumToUse}
            value={{ outputOfStepNum: stepNumToUse }}
          >
            Step {stepNumToUse}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
    // <SelectField
    //   name={`steps.${stepNum - 1}.stepOutputUses.[number].outputOfStepNum`}
    //   multiple={true}
    // >
    //   {/* if stepnum is, say, 3, we want this to be array of values 0 and 1 so that we can turn it into the options of steps 1 and 2. note that this form field should not be present on step 1 */}
    //   {[...Array(stepNum - 2).keys()].map((stepNumToUse) => {
    //     stepNumToUse++ // array will be 0 indexed but stepnum is 1 indexed
    //     return (
    //       <option key={stepNumToUse} value={{ outputOfStepNum: stepNumToUse }}>
    //         Step {stepNumToUse}
    //       </option>
    //     )
    //   })}
    // </SelectField>
  )
}

export default StepOutputUsesFormFrag
