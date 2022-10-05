import type { ComponentMeta } from '@storybook/react'

import WelcomePage from './WelcomePage'

export const generated = () => {
  return <WelcomePage />
}

export default {
  title: 'Pages/WelcomePage',
  component: WelcomePage,
} as ComponentMeta<typeof WelcomePage>
