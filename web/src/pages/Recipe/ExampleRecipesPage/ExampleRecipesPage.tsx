import { MetaTags } from '@redwoodjs/web'

import RecipesCell from 'src/components/Recipe/RecipesCell'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ExampleRecipesPage = () => {
  return (
    <>
      <MetaTags title="example recipes" description="Example recipes page" />
      <HeaderSlot.Plug id="recipes">
        <DefaultHeader title="example recipes" />
      </HeaderSlot.Plug>
      <RecipesCell username="ari" />
    </>
  )
}

export default ExampleRecipesPage
