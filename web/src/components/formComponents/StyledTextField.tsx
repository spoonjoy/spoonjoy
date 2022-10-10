import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { FieldError, Label, TextField, RegisterOptions } from '@redwoodjs/forms'
import { observer } from 'mobx-react-lite'

import {
  FieldError as FieldErrorType,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form'

interface StyledTextFieldProps {
  fieldName: string
  label: string
  defaultValue: string | number | readonly string[] | undefined
  customOnChange: (input: string | undefined) => void
  validation: RegisterOptions | undefined
  fieldErrors:
    | FieldErrorType
    | Merge<FieldErrorType, FieldErrorsImpl<any>>
    | undefined
}
const StyledTextField = ({
  fieldName,
  label,
  defaultValue,
  customOnChange,
  validation,
  fieldErrors,
}: StyledTextFieldProps) => {
  return (
    <div>
      <Label
        name={fieldName}
        className="block text-sm font-medium text-gray-700"
        errorClassName="block text-sm font-medium text-red-600"
      >
        {label}
      </Label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <TextField
          name={fieldName}
          defaultValue={defaultValue}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          errorClassName="block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
          validation={validation}
          onInput={(e) => {console.log(e.target.value)}}
        />
        {fieldErrors && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <FieldError name={fieldName} className="mt-2 text-sm text-red-600" />
    </div>
  )
}

export default observer(StyledTextField)
