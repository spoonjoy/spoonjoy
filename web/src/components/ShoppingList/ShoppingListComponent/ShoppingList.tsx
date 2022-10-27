import type { FindMyShoppingList } from 'types/graphql'

import IngredientsItemsList from 'src/components/IngredientsItemsList/IngredientsItemsList'
import ReloadIngredientsItemsList from 'src/components/IngredientsItemsList/ReloadIngredientsItemsList'
import { ListItemType } from 'src/stores/ListItemsStore'

interface ShoppingListProps {
  shoppingList: NonNullable<FindMyShoppingList['shoppingList']>
}

const ShoppingList = ({ shoppingList }: ShoppingListProps) => {
  const { items } = shoppingList

  const listItemIds = items.map((item) => item!.id)

  return (
    <>
      <div className="mb-5 flex justify-center">
        <ReloadIngredientsItemsList
          label={'Clear Shopping List Selection'}
          itemIds={listItemIds}
        />
      </div>
      {items && (
        <IngredientsItemsList
          items={items}
          itemsType={ListItemType.ShoppingListItem}
        />
      )}
    </>
  )
}

export default ShoppingList
