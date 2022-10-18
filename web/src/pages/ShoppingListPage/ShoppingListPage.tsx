import { MetaTags } from '@redwoodjs/web'

import ShoppingListCell from 'src/components/ShoppingList/ShoppingListCell'

const ShoppingListPage = () => {
  return (
    <>
      <MetaTags title="My shopping list" description="My shopping list page" />

      <ShoppingListCell />
    </>
  )
}

export default ShoppingListPage
