import { MetaTags } from '@redwoodjs/web'

import NewRecipe from 'src/components/Recipe/NewRecipe'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const NewRecipePage = () => {
  return (
    <>
      <MetaTags title="New Recipe" description="New Recipe Page" />
      <HeaderSlot.Plug id="new-recipe">
        <DefaultHeader title="New Recipe" />
      </HeaderSlot.Plug>
      <NewRecipe />
    </>
  )
}

export default NewRecipePage
