import type { ComponentMeta } from '@storybook/react'

import FellowChefsPage from './FellowChefsPage'

export const generated = () => {
  return <FellowChefsPage />
}

export default {
  title: 'Pages/FellowChefsPage',
  component: FellowChefsPage,
} as ComponentMeta<typeof FellowChefsPage>
