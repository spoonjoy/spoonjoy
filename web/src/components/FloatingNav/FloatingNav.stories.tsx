// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof FloatingNav> = (args) => {
//   return <FloatingNav {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import FloatingNav from './FloatingNav'

export const generated = () => {
  return <FloatingNav />
}

export default {
  title: 'Components/FloatingNav',
  component: FloatingNav,
} as ComponentMeta<typeof FloatingNav>
