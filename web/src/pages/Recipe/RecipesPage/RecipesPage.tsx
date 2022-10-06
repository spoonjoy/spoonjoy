import { MetaTags } from '@redwoodjs/web'

import RecipesCell from 'src/components/Recipe/RecipesCell'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const RecipesPage = () => {
  return (
    <>
      <MetaTags title="Recipes" description="Recipes page" />
      <HeaderSlot.Plug id="recipes">My Recipes</HeaderSlot.Plug>
      <RecipesCell />
    </>
  )
}

export default RecipesPage
