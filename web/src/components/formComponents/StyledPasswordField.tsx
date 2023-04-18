import { PasswordField } from '@redwoodjs/forms'

import StyledFieldWrapper, { StyledFieldProps } from './StyledFieldWrapper'

const StyledTextField = ({
  fieldName,
  label,
  defaultValue,
  onChange,
  validation,
  markOptional,
}: StyledFieldProps<HTMLInputElement>) => {
  return (
    <StyledFieldWrapper
      label={label}
      fieldName={fieldName}
      markOptional={markOptional}
    >
      <PasswordField
        name={fieldName}
        defaultValue={defaultValue}
        className="form-field"
        errorClassName="block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
        validation={validation}
        onChange={onChange}
      />
    </StyledFieldWrapper>
  )
}

export default StyledTextField
