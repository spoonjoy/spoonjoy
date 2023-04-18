import { NumberField } from '@redwoodjs/forms'

import StyledFieldWrapper, { StyledFieldProps } from './StyledFieldWrapper'

const StyledNumberField = ({
  fieldName,
  label,
  defaultValue,
  onChange,
  validation,
  placeholder,
  markOptional,
}: StyledFieldProps<HTMLInputElement>) => {
  return (
    <StyledFieldWrapper
      label={label}
      fieldName={fieldName}
      markOptional={markOptional}
    >
      <NumberField
        name={fieldName}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="form-field"
        errorClassName="form-field-error"
        validation={validation}
        onChange={onChange}
      />
    </StyledFieldWrapper>
  )
}

export default StyledNumberField
