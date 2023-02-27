import type { ComponentMeta } from '@storybook/react'

import ImportRecipeFromPlatformPage from './ImportRecipeFromPlatformPage'

export const generated = () => {
  return <ImportRecipeFromPlatformPage />
}

export default {
  title: 'Pages/ImportRecipeFromPlatformPage',
  component: ImportRecipeFromPlatformPage,
} as ComponentMeta<typeof ImportRecipeFromPlatformPage>
