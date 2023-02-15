// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof RecipeSaveLoading> = (args) => {
//   return <RecipeSaveLoading {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import RecipeSaveLoading from './RecipeSaveLoading'

export const generated = () => {
  return <RecipeSaveLoading />
}

export default {
  title: 'Components/RecipeSaveLoading',
  component: RecipeSaveLoading,
} as ComponentMeta<typeof RecipeSaveLoading>
