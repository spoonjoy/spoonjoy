import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { observer } from 'mobx-react-lite'
import {
  FieldError as FieldErrorType,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form'

import { FieldError, Label, RegisterOptions } from '@redwoodjs/forms'

export interface StyledFieldProps<T = Element>
  extends Omit<StyledFieldWrapperProps, 'children'> {
  defaultValue?: string | number | readonly string[]
  onChange: (e: React.ChangeEvent<T>) => void
  validation?: RegisterOptions
}

export interface StyledFieldWrapperProps {
  children: JSX.Element
  fieldName: string
  label: string
  fieldErrors:
    | FieldErrorType
    | Merge<FieldErrorType, FieldErrorsImpl<any>>
    | undefined
}
const StyledFieldWrapper = ({
  children,
  fieldName,
  label,
  fieldErrors,
}: StyledFieldWrapperProps) => {
  return (
    <div className="mb-3">
      <Label
        name={fieldName}
        className="block text-sm font-medium text-gray-700"
        errorClassName="block text-sm font-medium text-red-600"
      >
        {label}
      </Label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {children}
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

export default observer(StyledFieldWrapper)
