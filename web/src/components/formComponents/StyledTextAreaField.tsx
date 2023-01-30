import { observer } from 'mobx-react-lite'

import { TextAreaField } from '@redwoodjs/forms'

import StyledFieldWrapper, { StyledFieldProps } from './StyledFieldWrapper'

const StyledTextAreaField = ({
  fieldName,
  label,
  defaultValue,
  onChange,
  validation,
  fieldErrors,
  maxLength,
  currentLength,
}: StyledFieldProps<HTMLTextAreaElement>) => {
  return (
    <StyledFieldWrapper
      label={label}
      fieldName={fieldName}
      fieldErrors={fieldErrors}
      maxLength={maxLength}
      currentLength={currentLength}
    >
      <TextAreaField
        name={fieldName}
        defaultValue={defaultValue}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        errorClassName="block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
        validation={validation}
        onChange={onChange}
      />
    </StyledFieldWrapper>
  )
}

export default observer(StyledTextAreaField)
