import { TextField } from '@redwoodjs/forms'

import { classNames } from 'src/helpers/css'

import StyledFieldWrapper, { StyledFieldProps } from './StyledFieldWrapper'

const StyledTextField = React.forwardRef<
  HTMLInputElement,
  StyledFieldProps<HTMLInputElement>
>(
  (
    {
      fieldName,
      label,
      defaultValue,
      onChange,
      onKeyDown,
      validation,
      maxLength,
      currentLength,
      placeholder,
      disabled,
      grow,
      inline = false,
      markOptional,
    },
    ref
  ) => {
    return (
      <StyledFieldWrapper
        label={label}
        fieldName={fieldName}
        maxLength={maxLength}
        currentLength={currentLength}
        inline={inline}
        markOptional={markOptional}
      >
        <TextField
          name={fieldName}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={classNames('form-field', grow ? 'md:text-lg' : '')}
          errorClassName={classNames(
            'block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm',
            grow ? 'md:text-lg' : ''
          )}
          validation={validation}
          onChange={onChange}
          onKeyDown={onKeyDown}
          ref={ref}
          disabled={disabled}
        />
      </StyledFieldWrapper>
    )
  }
)

export default StyledTextField
