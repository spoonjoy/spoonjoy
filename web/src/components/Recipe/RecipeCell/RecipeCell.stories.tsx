import type { ComponentStory } from '@storybook/react'

import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

import { Loading, Empty, Failure, Success } from './RecipeCell'
import { standard } from './RecipeCell.mock'

export const loading = () => {
  return Loading ? (
    <>
      <HeaderSlot />
      <Loading />
    </>
  ) : (
    <></>
  )
}

export const loadingShort = () => {
  return Loading ? (
    <>
      <HeaderSlot />
      <Loading shortRecipe />
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
      <HeaderSlot />
      <Success {...standard()} {...args} />
    </>
  ) : (
    <></>
  )
}

export const successShort: ComponentStory<typeof Success> = (args) => {
  return Success ? (
    <>
      <HeaderSlot />
      <Success {...standard()} {...args} shortRecipe />
    </>
  ) : (
    <></>
  )
}

export default { title: 'Cells/RecipeCell' }
