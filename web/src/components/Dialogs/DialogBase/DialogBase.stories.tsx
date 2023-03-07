import type { ComponentMeta, ComponentStory } from '@storybook/react'

import DialogBase, { IDialogBaseProps } from './DialogBase'

export const Default: ComponentStory<typeof DialogBase> = (args) => {
  return <DialogBase {...args} />
}

const dialogContentMock = <div>Dialog children go here!</div>

const defaultArgs: IDialogBaseProps = {
  openState: true,
  initialFocusRef: undefined,
  children: dialogContentMock,
  onClose: () => confirm('Dismissed'),
}

const withCloseButtonArgs: IDialogBaseProps = {
  ...defaultArgs,
  withCloseButton: true,
}

export default {
  title: 'Shared/DialogBase',
  component: DialogBase,
  args: defaultArgs,
} as ComponentMeta<typeof DialogBase>

export const withCloseButton = {
  component: DialogBase,
  args: withCloseButtonArgs,
} as ComponentMeta<typeof DialogBase>
