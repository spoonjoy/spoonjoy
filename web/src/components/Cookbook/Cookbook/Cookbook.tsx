import type { FindCookbookById } from 'types/graphql'

import { MetaTags } from '@redwoodjs/web'

import Recipes from 'src/components/Recipe/Recipes'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

interface Props {
  cookbook: NonNullable<FindCookbookById['cookbook']>
}

const Cookbook = ({ cookbook }: Props) => {
  const recipes = cookbook.recipes.map((recipeInCookbook) => {
    return recipeInCookbook?.recipe
  })
  const description = `${cookbook.author.username}'s ${cookbook.title} Cookbook`
  return (
    <>
      <MetaTags title={`${description} | Spoonjoy`} description={description} />
      <HeaderSlot.Plug id="cookbooks">
        <DefaultHeader title={cookbook.title} />
      </HeaderSlot.Plug>
      <Recipes recipes={recipes} />
    </>
  )
}

export default Cookbook
