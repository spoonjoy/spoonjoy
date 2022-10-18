import { MetaTags } from '@redwoodjs/web'

import ShoppingListCell from 'src/components/ShoppingList/ShoppingListCell'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ShoppingListPage = () => {
  return (
    <>
      <MetaTags title="My shopping list" description="My shopping list page" />
      <HeaderSlot.Plug id="my-shopping-list">Shopping List</HeaderSlot.Plug>
      <div className="m-auto w-full">
        <ShoppingListCell />
      </div>
    </>
  )
}

export default ShoppingListPage
