import { TextAreaField } from '@redwoodjs/forms'

import StyledFieldWrapper, { StyledFieldProps } from './StyledFieldWrapper'

const StyledTextAreaField = ({
  fieldName,
  label,
  defaultValue,
  placeholder,
  onChange,
  validation,
  maxLength,
  currentLength,
  markOptional,
}: StyledFieldProps<HTMLTextAreaElement>) => {
  return (
    <StyledFieldWrapper
      label={label}
      fieldName={fieldName}
      maxLength={maxLength}
      currentLength={currentLength}
      markOptional={markOptional}
    >
      <TextAreaField
        name={fieldName}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="form-field"
        errorClassName="form-field-error"
        validation={validation}
        onChange={onChange}
        rows={3}
      />
    </StyledFieldWrapper>
  )
}

export default StyledTextAreaField
