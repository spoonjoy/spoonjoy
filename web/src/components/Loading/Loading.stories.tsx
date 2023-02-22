import type { ComponentMeta } from '@storybook/react'

import Loading from './Loading'

export const generated = () => {
  return <Loading />
}

export default {
  title: 'Components/Loading',
  component: Loading,
} as ComponentMeta<typeof Loading>
