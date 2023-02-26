// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof RecipeImportLoading> = (args) => {
//   return <RecipeImportLoading {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import RecipeImportLoading, {
  IRecipeImportLoadingProps,
} from './RecipeImportLoading'

export const generated = (args: IRecipeImportLoadingProps) => {
  return <RecipeImportLoading {...args} />
}

export default {
  title: 'Components/RecipeImportLoading',
  component: RecipeImportLoading,
} as ComponentMeta<typeof RecipeImportLoading>

generated.args = {
  loading: false,
  hasError: false,
}
