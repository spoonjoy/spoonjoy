import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

interface AddRemBtnsProps {
  id: string
  itemName: string
  onAdd: () => void
  onRem: () => void
  canRem: boolean
  containerClassName: string
}
const AddRemBtns = ({
  id,
  itemName,
  onAdd,
  onRem,
  canRem,
  containerClassName,
}: AddRemBtnsProps) => {
  return (
    <div id={id} className={containerClassName}>
      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          onClick={onAdd}
          type="button"
          className="relative inline-flex items-center rounded-l-md border border-green-800 border-r-gray-500 border-opacity-25 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-gray-50 hover:shadow-md focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <span className="sr-only">Add {itemName}</span>
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          {itemName}
        </button>
        <button
          onClick={onRem}
          type="button"
          className="relative -ml-px inline-flex items-center rounded-r-md border bg-white px-4 py-2 text-sm font-medium focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 enabled:border-red-800 enabled:border-l-gray-500 enabled:border-opacity-25 enabled:text-red-700 enabled:hover:bg-gray-50 enabled:hover:shadow-md disabled:border-gray-300 disabled:text-gray-500"
          disabled={!canRem}
        >
          <span className="sr-only">Remove {itemName}</span>
          <MinusIcon className="h-5 w-5" aria-hidden="true" />
          {itemName}
        </button>
      </span>
    </div>
  )
}

export default AddRemBtns
