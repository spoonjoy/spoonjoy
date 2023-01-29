import { MetaTags } from '@redwoodjs/web'

import RecipesCell from 'src/components/Recipe/RecipesCell'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

const MyCookbooksPage = () => {
  return (
    <>
      <MetaTags title="My Cookbooks" description="My cookbooks page" />
      <HeaderSlot.Plug id="cookbooks">
        <DefaultHeader title="My Cookbooks" />
      </HeaderSlot.Plug>
      <RecipesCell />
    </>
  )
}

export default MyCookbooksPage
