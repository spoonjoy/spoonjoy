// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof IngredientsItemsList> = (args) => {
//   return <IngredientsItemsList {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import IngredientsItemsList from './IngredientsItemsList'

export const generated = () => {
  return <IngredientsItemsList />
}

export default {
  title: 'Components/IngredientsItemsList',
  component: IngredientsItemsList,
} as ComponentMeta<typeof IngredientsItemsList>
