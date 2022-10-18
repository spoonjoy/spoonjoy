import type { ComponentMeta } from '@storybook/react'

import ShoppingListPage from './ShoppingListPage'

export const generated = () => {
  return <ShoppingListPage />
}

export default {
  title: 'Pages/ShoppingListPage',
  component: ShoppingListPage,
} as ComponentMeta<typeof ShoppingListPage>
