import type { ComponentStory } from '@storybook/react'

import { Loading, Failure, Success } from './EditCookbookCell'
import { standard } from './EditCookbookCell.mock'

export const loading = () => {
  return Loading ? <Loading /> : <></>
}

export const failure: ComponentStory<typeof Failure> = (args) => {
  return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>
}

export const success: ComponentStory<typeof Success> = (args) => {
  return Success ? <Success {...standard()} {...args} /> : <></>
}

export default { title: 'Cells/EditCookbookCell' }
