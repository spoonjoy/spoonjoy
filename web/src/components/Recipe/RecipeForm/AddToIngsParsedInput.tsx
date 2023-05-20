import { PlusIcon } from '@heroicons/react/20/solid'
import { CreateIngredientInput } from 'types/graphql'

import { UseFieldArrayAppend, useFormContext } from '@redwoodjs/forms'

import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'
import {
  IListItemInfo,
  ListItem,
  getIngredientItemInfo,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import { classNames } from 'src/helpers/css'
import useStateRef from 'src/helpers/useStateRef'

import { IngredientFormFragParsedInput } from './IngredientFormFragParsedInput'

import { RecipeFormType } from '.'

interface IAddToIngsParsedInputProps {
  addToIngredients: UseFieldArrayAppend<
    RecipeFormType,
    `steps.${number}.ingredients`
  >
  stepNum: number
}

export const AddToIngsParsedInput = ({
  addToIngredients,
  stepNum,
}: IAddToIngsParsedInputProps) => {
  const fieldName = `steps.${stepNum - 1}.newIngRawInput` as const
  const placeholderIngItemInfo = getIngredientItemInfo({
    placeholder: 'start typing to add an ingredient',
  })

  const [newIngFields, setNewIngFields, newIngFieldsRef] = useStateRef<
    CreateIngredientInput | undefined
  >()
  const [newIngItemInfo, setNewIngItemInfo] = React.useState<IListItemInfo>(
    placeholderIngItemInfo
  )
  const [showHint, setShowHint] = React.useState(false)

  const { resetField } = useFormContext<RecipeFormType>()

  const persistValues = usePersistValuesOnChange()

  const fieldRef = React.useRef<HTMLInputElement>(null)

  const onAddToIngredients = () => {
    if (newIngFields) {
      addToIngredients(newIngFields)
      persistValues()
      setNewIngFields(undefined)
      setNewIngItemInfo(placeholderIngItemInfo)
      resetField(fieldName)
      setShowHint(false)
    }
    fieldRef.current?.focus()
  }

  /** If the new ingredient is parsed but hasn't been added after a bit, show the hint */
  const nudgeToAdd = () => {
    setTimeout(() => {
      newIngFieldsRef.current !== undefined && setShowHint(true)
    }, 2000)
  }

  return (
    <div className="mt-3 max-w-sm">
      <ul className="mr-5">
        <ListItem
          listType="recipeIngredients"
          uniqueId={fieldName}
          itemInfo={newIngItemInfo}
          isPlaceholder
        />
      </ul>
      <div>
        <IngredientFormFragParsedInput
          fieldName={fieldName}
          ref={fieldRef}
          setNewIngFields={setNewIngFields}
          setNewIngItemInfo={setNewIngItemInfo}
          onParseComplete={nudgeToAdd}
          placeholderIngItemInfo={placeholderIngItemInfo}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAddToIngredients()
            }
          }}
          submitBtn={
            <button
              type="button"
              className="inline-block"
              onClick={onAddToIngredients}
              disabled={!newIngFields}
            >
              <PlusIcon
                className={classNames(
                  'h-5',
                  newIngFields ? 'text-green-700' : 'text-gray-500'
                )}
              />
            </button>
          }
        />
      </div>

      {showHint && (
        <div className="-mt-2 ml-2 text-xs italic text-gray-500">
          press <strong>enter/return</strong> or the{' '}
          <PlusIcon className="mb-[0.15rem] inline-block h-5 text-green-700" />{' '}
          to add
        </div>
      )}
    </div>
  )
}
