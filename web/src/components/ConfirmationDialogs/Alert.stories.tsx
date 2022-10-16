import type { ComponentMeta, ComponentStory } from '@storybook/react'

import Alert from './Alert'

export const Dialog: ComponentStory<typeof Alert> = (args) => {
  return <Alert {...args} />
}

export default {
  title: 'Shared/Alert',
  component: Alert,
  args: {
    header: 'Delete Recipe',
    body: 'If you delete your recipe, you\'ll never see it again! Until we get around to creating the "recently deleted" section, but who knows how long that will take.',
    confirmTxt: 'Delete',
  },
} as ComponentMeta<typeof Alert>
