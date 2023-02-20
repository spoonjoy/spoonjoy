import { ArrowPathIcon } from '@heroicons/react/20/solid'

import { classNames } from 'src/helpers/css'
import { useStore } from 'src/stores/RootStore'

interface IReloadIngredientsItemsList {
  itemIds: string[] | undefined
  label: string
}

const ReloadIngredientsItemsList = ({
  itemIds,
  label,
}: IReloadIngredientsItemsList) => {
  const { listItemsStore } = useStore()

  const onReload = () => {
    itemIds && listItemsStore.resetItemStates(itemIds)
  }

  return (
    <button
      aria-label="Reload list"
      type="button"
      className={classNames(
        itemIds
          ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          : 'animate-pulse cursor-wait bg-slate-200',
        'inline-flex h-11 w-[181px] items-center rounded-full border border-transparent p-2 px-5'
      )}
      onClick={onReload}
    >
      {itemIds && (
        <>
          {label}
          <ArrowPathIcon className="ml-3 h-5 w-5" aria-hidden="true" />
        </>
      )}
    </button>
  )
}

export default ReloadIngredientsItemsList
