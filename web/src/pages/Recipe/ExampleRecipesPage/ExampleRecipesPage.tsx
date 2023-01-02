import { MetaTags } from '@redwoodjs/web'

import RecipesCell from 'src/components/Recipe/RecipesCell'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ExampleRecipesPage = () => {
  return (
    <>
      <MetaTags title="Example Recipes" description="Example recipes page" />
      <HeaderSlot.Plug id="recipes">Example Recipes</HeaderSlot.Plug>
      <RecipesCell exampleRecipes />
    </>
  )
}

export default ExampleRecipesPage
