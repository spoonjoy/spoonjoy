import { MetaTags } from '@redwoodjs/web'

import RecipesCell from 'src/components/Recipe/RecipesCell'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const MyRecipesPage = () => {
  return (
    <>
      <MetaTags title="Recipes" description="Recipes page" />
      <HeaderSlot.Plug id="recipes">
        <DefaultHeader title="My Recipes" />
      </HeaderSlot.Plug>
      <RecipesCell />
    </>
  )
}

export default MyRecipesPage
