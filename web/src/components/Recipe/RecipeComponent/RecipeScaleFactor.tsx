import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

import { classNames } from 'src/helpers/css'

interface IRecipeScaleFactorProps {
  scaleFactor: number
  setScaleFactor: React.Dispatch<React.SetStateAction<number>>
  loading?: boolean
}

const SCALE_STEP = 0.25
const MAX_SCALE_FACTOR = 50
const MIN_SCALE_FACTOR = 0.25

const RecipeScaleFactor = ({
  scaleFactor,
  setScaleFactor,
  loading = false,
}: IRecipeScaleFactorProps) => {
  const changeScaleFactor = (operation: 'add' | 'subtract') => {
    if (operation === 'add') {
      const newScaleFactor = scaleFactor + SCALE_STEP
      if (newScaleFactor <= MAX_SCALE_FACTOR) {
        setScaleFactor(newScaleFactor)
      }
    } else {
      const newScaleFactor = scaleFactor - SCALE_STEP
      if (newScaleFactor >= MIN_SCALE_FACTOR) {
        setScaleFactor(newScaleFactor)
      }
    }
  }

  const canIncrease = scaleFactor < MAX_SCALE_FACTOR
  const canDecrease = scaleFactor > MIN_SCALE_FACTOR
  return (
    <div
      className={classNames(
        'inline-flex h-11 w-28 rounded-full p-2 px-1',
        loading
          ? 'loading'
          : 'items-center  border border-transparent bg-indigo-600  text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      )}
    >
      {!loading && (
        <>
          <button
            disabled={!canDecrease}
            onClick={() => changeScaleFactor('subtract')}
            className={classNames(
              'text-white',
              canDecrease ? 'hover:text-gray-300' : 'cursor-not-allowed'
            )}
          >
            <MinusIcon className="h-8 p-2" />
          </button>
          <span className="w-10 flex-grow-0 text-center">{scaleFactor}</span>
          <button
            disabled={!canIncrease}
            onClick={() => changeScaleFactor('add')}
            className={classNames(
              'text-white',
              canIncrease ? 'hover:text-gray-300' : 'cursor-not-allowed'
            )}
          >
            <PlusIcon className="h-8 p-2" />
          </button>
        </>
      )}
    </div>
  )
}

export default RecipeScaleFactor
