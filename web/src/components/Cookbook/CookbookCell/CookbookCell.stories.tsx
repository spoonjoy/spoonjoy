import type { ComponentStory } from '@storybook/react'

import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

import { Loading, Empty, Failure, Success } from './CookbookCell'
import { standard } from './CookbookCell.mock'

export const loading = () => {
  return Loading ? (
    <>
      {/* Need to include this here as cookbookCell uses the default header, which relies on the styling of the parent H1 */}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        <HeaderSlot />
      </h1>
      <Loading />
    </>
  ) : (
    <></>
  )
}

export const empty = () => {
  return Empty ? <Empty /> : <></>
}

export const failure: ComponentStory<typeof Failure> = (args) => {
  return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>
}

export const success: ComponentStory<typeof Success> = (args) => {
  return Success ? (
    <>
      {/* Need to include this here as cookbookCell uses the default header, which relies on the styling of the parent H1 */}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        <HeaderSlot />
      </h1>
      <Success {...standard()} {...args} />
    </>
  ) : (
    <></>
  )
}

export default { title: 'Cells/CookbookCell' }
