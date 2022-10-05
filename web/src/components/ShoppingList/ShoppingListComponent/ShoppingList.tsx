import type { FindShoppingListById } from 'types/graphql'

import IngredientsItemsList from 'src/components/IngredientsItemsList/IngredientsItemsList'

interface ShoppingListProps {
  shoppingList: NonNullable<FindShoppingListById['shoppingList']>
}

const ShoppingList = ({ shoppingList }: ShoppingListProps) => {
  const { items } = shoppingList
  return <>{items && <IngredientsItemsList items={items} />}</>
}

export default ShoppingList
