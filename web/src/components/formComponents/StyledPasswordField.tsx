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
  const pwFieldRef = React.useRef<HTMLInputElement>(null)

  return (
    <StyledFieldWrapper
      label={label}
      fieldName={fieldName}
      markOptional={markOptional}
      endComponent={
        <button
          type="button"
          onClick={() => {
            setShowPassword(!showPassword)
            pwFieldRef.current?.focus()
          }}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 text-gray-500" />
          ) : (
            <EyeIcon className="h-5 text-gray-500" />
          )}
        </button>
      }
    >
      <PasswordField
        ref={pwFieldRef}
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
