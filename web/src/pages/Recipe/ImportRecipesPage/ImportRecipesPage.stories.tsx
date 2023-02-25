import type { ComponentMeta } from '@storybook/react'

import ImportRecipesPage from './ImportRecipesPage'

export const generated = () => {
  return <ImportRecipesPage />
}

export default {
  title: 'Pages/ImportRecipesPage',
  component: ImportRecipesPage,
} as ComponentMeta<typeof ImportRecipesPage>
