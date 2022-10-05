// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ShoppingList> = (args) => {
//   return <ShoppingList {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ShoppingList from './ShoppingList'

export const generated = () => {
  return <ShoppingList />
}

export default {
  title: 'Components/ShoppingList',
  component: ShoppingList,
} as ComponentMeta<typeof ShoppingList>
