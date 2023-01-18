import { MetaTags } from '@redwoodjs/web'

import RecipesCell from 'src/components/Recipe/RecipesCell'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ExampleRecipesPage = () => {
  return (
    <>
      <MetaTags title="Example Recipes" description="Example recipes page" />
      <HeaderSlot.Plug id="recipes">
        <DefaultHeader title="Example Recipes" />
      </HeaderSlot.Plug>
      <RecipesCell exampleRecipes />
    </>
  )
}

export default ExampleRecipesPage
