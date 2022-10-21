import type { FindShoppingListById } from 'types/graphql'

import IngredientsItemsList from 'src/components/IngredientsItemsList/IngredientsItemsList'
import { ListItemType } from 'src/stores/ListItemsStore'

interface ShoppingListProps {
  shoppingList: NonNullable<FindShoppingListById['shoppingList']>
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
