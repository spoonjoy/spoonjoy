import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

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
      onChange={(e) => {
        console.log('listbox onchange', e)
        setSelectedStepOutputUses(e)
      }}
      multiple
    >
      <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
        <span className="block truncate">
          {selectedStepOutputUses.length
            ? selectedStepOutputUses
                .map((outputUse) => `step ${outputUse.outputOfStepNum}`)
                .join(', ')
            : 'Select Steps'}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options>
        {/* generate the valid stepnums */}
        {[...Array(stepNum - 1).keys()]
          .map((stepNumToUse) => (stepNumToUse += 1))
          .map((stepNumToUse) => (
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
