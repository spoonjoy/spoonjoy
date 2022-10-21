import { ArrowPathIcon } from '@heroicons/react/20/solid'

import { useStore } from 'src/stores/RootStore'

interface IReloadIngredientsItemsList {
  itemIds: string[]
}

const ReloadIngredientsItemsList = ({
  itemIds,
}: IReloadIngredientsItemsList) => {
  const { listItemsStore } = useStore()

  const onReload = () => {
    listItemsStore.resetItemStates(itemIds)
  }

  return (
    <button
      aria-label="Reload list"
      type="button"
      className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={onReload}
    >
      <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}

export default ReloadIngredientsItemsList
