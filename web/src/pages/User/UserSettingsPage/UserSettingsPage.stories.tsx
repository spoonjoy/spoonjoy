import type { ComponentMeta } from '@storybook/react'

import UserSettingsPage from './UserSettingsPage'

export const generated = () => {
  return <UserSettingsPage />
}

export default {
  title: 'Pages/UserSettingsPage',
  component: UserSettingsPage,
} as ComponentMeta<typeof UserSettingsPage>
