import { Submit, useFormContext } from '@redwoodjs/forms'

import { RecipeFormType } from '.'

interface IResetSubmitRecipeBtnsProps {
  onReset: React.MouseEventHandler<HTMLButtonElement>
  loading: boolean
  mode: 'update' | 'create'
}
const ResetSubmitRecipeBtns = ({
  onReset,
  loading,
  mode,
}: IResetSubmitRecipeBtnsProps) => {
  const { getValues } = useFormContext<RecipeFormType>()
  return (
    <>
      <div className="flex justify-center sm:justify-end">
        <div className="flex flex-col">
          {getValues('steps')?.length < 1 && (
            <span className="mb-2 text-sm text-red-600">
              you need to add at least 1 step.
            </span>
          )}
          <Submit
            disabled={loading || getValues('steps')?.length < 1}
            className="btn-submit-primary"
          >
            {mode === 'update' ? 'update recipe' : 'create new recipe'}
          </Submit>
          <button className="btn-error mt-2" onClick={onReset}>
            {mode === 'update' ? 'discard changes' : 'reset'}
          </button>
        </div>
      </div>
    </>
  )
}

export default ResetSubmitRecipeBtns
