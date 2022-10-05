import type { FindShoppingListById } from 'types/graphql'

interface ShoppingListProps {
  shoppingList: NonNullable<FindShoppingListById['shoppingList']>
}

const ShoppingList = ({ shoppingList }: ShoppingListProps) => {
  return (
    <div>
      <h2>{'ShoppingList'}</h2>
      <p>{JSON.stringify(shoppingList)}</p>
    </div>
  )
}

export default ShoppingList
