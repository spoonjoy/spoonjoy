import { observer } from 'mobx-react-lite'

import { TextField } from '@redwoodjs/forms'

import StyledFieldWrapper, { StyledFieldProps } from './StyledFieldWrapper'

const StyledTextField = ({
  fieldName,
  label,
  defaultValue,
  onChange,
  validation,
  ref,
  maxLength,
  currentLength,
  placeholder,
}: StyledFieldProps<HTMLInputElement>) => {
  return (
    <StyledFieldWrapper
      label={label}
      fieldName={fieldName}
      maxLength={maxLength}
      currentLength={currentLength}
    >
      <TextField
        name={fieldName}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        errorClassName="block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
        validation={validation}
        onChange={onChange}
        ref={ref}
      />
    </StyledFieldWrapper>
  )
}

export default observer(StyledTextField)
