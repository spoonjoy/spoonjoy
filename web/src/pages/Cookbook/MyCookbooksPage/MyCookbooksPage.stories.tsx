import type { ComponentMeta } from '@storybook/react'

import MyCookbooksPage from './MyCookbooksPage'

export const generated = () => {
  return <MyCookbooksPage />
}

export default {
  title: 'Pages/MyCookbooksPage',
  component: MyCookbooksPage,
} as ComponentMeta<typeof MyCookbooksPage>
