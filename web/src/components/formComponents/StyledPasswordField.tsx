import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

import { PasswordField } from '@redwoodjs/forms'

import StyledFieldWrapper, { StyledFieldProps } from './StyledFieldWrapper'

const StyledTextField = ({
  fieldName,
  label,
  defaultValue,
  onChange,
  validation,
  markOptional,
  placeholder,
}: StyledFieldProps<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <StyledFieldWrapper
      label={label}
      fieldName={fieldName}
      markOptional={markOptional}
      endComponent={
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeSlashIcon className="h-5" />
          ) : (
            <EyeIcon className="h-5" />
          )}
        </button>
      }
    >
      <PasswordField
        name={fieldName}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="form-field"
        errorClassName="block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
        validation={validation}
        onChange={onChange}
        {...(showPassword ? { type: 'text' } : {})}
      />
    </StyledFieldWrapper>
  )
}

export default StyledTextField
