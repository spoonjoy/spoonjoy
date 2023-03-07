import { observer } from 'mobx-react-lite'

import { FieldError, Label, RegisterOptions } from '@redwoodjs/forms'

import { classNames } from 'src/helpers/css'

/** Use this to type any props that are children of `StyledFieldWrapper` */
export interface StyledFieldProps<T = Element>
  extends Omit<StyledFieldWrapperProps, 'children'> {
  defaultValue?: string | number | readonly string[]
  onChange?: (e: React.ChangeEvent<T>) => void
  validation?: RegisterOptions
  placeholder?: string
  disabled?: boolean
}

export interface StyledFieldWrapperProps {
  children: JSX.Element
  /** Identifier name for this field */
  fieldName: string
  /** Visual name for this field */
  label?: string
  /** Maximum length of the text in the field */
  maxLength?: number
  /** Current length of the text in the field. Must include if using maxLength */
  currentLength?: number
  /** Use this to make the field grow larger on larger screens */
  grow?: boolean
  /** Use this to make the field inline */
  inline?: boolean
}
const StyledFieldWrapper = ({
  children,
  fieldName,
  label,
  maxLength,
  currentLength,
  inline = false,
}: StyledFieldWrapperProps) => {
  return (
    <div className={classNames(inline ? 'mr-10 flex-1' : 'mb-3')}>
      {label && (
        <Label
          name={fieldName}
          className="block text-sm font-medium text-gray-700"
          errorClassName="block text-sm font-medium text-red-600"
        >
          {label}
        </Label>
      )}
      <div
        className={classNames(
          !!label && 'mt-1',
          'relative rounded-md shadow-sm'
        )}
      >
        {children}
        {maxLength !== undefined && currentLength !== undefined && (
          <div className="pointer-events-none absolute -inset-y-0 -right-4 flex w-2 items-center text-left text-sm text-gray-400">
            {maxLength - currentLength}
          </div>
        )}
      </div>
      {!inline && (
        <FieldError name={fieldName} className="mt-2 text-sm text-red-600" />
      )}
    </div>
  )
}

export default observer(StyledFieldWrapper)
