import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import {
  FieldArrayWithId,
  useController,
  UseFieldArrayReplace,
} from '@redwoodjs/forms'

import { classNames } from 'src/helpers/css'

import { RecipeFormControl, RecipeFormType } from './RecipeForm'

interface StepOutputUsesFormFragProps {
  stepNum: number
  stepOutputUses: FieldArrayWithId<
    RecipeFormType,
    `steps.${number}.stepOutputUses`,
    'id'
  >[]
  control: RecipeFormControl
  name: `steps.${number}.stepOutputUses`
  setStepOutputUses: UseFieldArrayReplace<
    RecipeFormType,
    `steps.${number}.stepOutputUses`
  >
  getStepTitle: (stepNum: number) => string | null
}
const StepOutputUsesFormFrag = ({
  stepNum,
  stepOutputUses,
  setStepOutputUses,
  control,
  name,
  getStepTitle,
}: StepOutputUsesFormFragProps) => {
  const {
    field: { value },
  } = useController({
    name: name,
    control: control,
    defaultValue: stepOutputUses,
  })

  // generate the valid stepnums
  const stepOutputUseOptions = [...Array(stepNum - 1).keys()].map(
    (stepNumToUse) => ({
      outputOfStepNum: stepNumToUse + 1,
    })
  )

  return (
    <>
      <legend className="mt-2 block text-sm font-medium text-gray-700">
        in step {stepNum}, use the output of the following steps:
      </legend>

      <div className="mt-1 max-w-sm">
        <Listbox
          value={value}
          defaultValue={stepOutputUses}
          name={name}
          by="outputOfStepNum"
          onChange={(e) => {
            setStepOutputUses(e || [])
          }}
          multiple
        >
          {({ open }) => (
            <>
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                <span className="block truncate">
                  {stepOutputUses.length
                    ? stepOutputUses
                        .map((outputUse) => {
                          const { outputOfStepNum } = outputUse
                          const stepTitle = getStepTitle(outputOfStepNum)
                          return `Step ${outputOfStepNum}${
                            stepTitle ? `: ${stepTitle}` : ''
                          }`
                        })
                        .join(', ')
                    : 'select steps'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 max-w-sm overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {stepOutputUseOptions.map((stepOutputUse) => (
                    <Listbox.Option
                      key={stepOutputUse.outputOfStepNum}
                      value={stepOutputUse}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                    >
                      {({ selected, active }) => {
                        const { outputOfStepNum } = stepOutputUse
                        const stepTitle = getStepTitle(outputOfStepNum)
                        return (
                          <>
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate'
                              )}
                            >
                              Step {stepOutputUse.outputOfStepNum}
                              {stepTitle && `: ${stepTitle}`}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )
                      }}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </>
          )}
        </Listbox>
      </div>
    </>
  )
}

export default StepOutputUsesFormFrag
