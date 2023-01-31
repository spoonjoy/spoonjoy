import type { ComponentMeta, ComponentStory } from '@storybook/react'

import DialogBase, { IDialogBaseProps } from './DialogBase'

export const Dialog: ComponentStory<typeof DialogBase> = (args) => {
  return <DialogBase {...args} />
}

const dialogContentMock = <div>Dialog children go here!</div>

const defaultArgs: IDialogBaseProps = {
  openState: true,
  initialFocusRef: undefined,
  children: dialogContentMock,
  onClose: () => confirm('Dismissed'),
}

export default {
  title: 'Shared/DialogBase',
  component: DialogBase,
  args: defaultArgs,
} as ComponentMeta<typeof DialogBase>
