import type { FindShoppingListById } from 'types/graphql'

import IngredientsItemsList from 'src/components/IngredientsItemsList/IngredientsItemsList'
import { ListItemType } from 'src/stores/ListItemsStore'

interface ShoppingListProps {
  shoppingList: NonNullable<FindShoppingListById['shoppingList']>
}

const ShoppingList = ({ shoppingList }: ShoppingListProps) => {
  const { items } = shoppingList
  return (
    <>
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
