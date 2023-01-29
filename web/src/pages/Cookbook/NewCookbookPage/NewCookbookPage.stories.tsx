import type { ComponentMeta } from '@storybook/react'

import NewCookbookPage from './NewCookbookPage'

export const generated = () => {
  return <NewCookbookPage />
}

export default {
  title: 'Pages/NewCookbookPage',
  component: NewCookbookPage,
} as ComponentMeta<typeof NewCookbookPage>
