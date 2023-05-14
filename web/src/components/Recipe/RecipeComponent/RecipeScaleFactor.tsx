import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

interface IRecipeScaleFactorProps {
  scaleFactor: number
  setScaleFactor: React.Dispatch<React.SetStateAction<number>>
}

const SCALE_STEP = 0.25

const RecipeScaleFactor = ({
  scaleFactor,
  setScaleFactor,
}: IRecipeScaleFactorProps) => {
  return (
    <div className="inline-flex h-11 items-center rounded-full border border-transparent bg-indigo-600 p-2 px-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      <button onClick={() => setScaleFactor(scaleFactor - SCALE_STEP)}>
        <MinusIcon className="h-4 w-4 text-white hover:text-gray-300" />
      </button>
      <span className="w-10 flex-grow-0 text-center">{scaleFactor}</span>
      <button onClick={() => setScaleFactor(scaleFactor + SCALE_STEP)}>
        <PlusIcon className="h-4 w-4 text-white hover:text-gray-300" />
      </button>
    </div>
  )
}

export default RecipeScaleFactor
