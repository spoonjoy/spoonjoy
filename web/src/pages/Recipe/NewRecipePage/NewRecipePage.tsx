import { MetaTags } from '@redwoodjs/web'

import NewRecipe from 'src/components/Recipe/NewRecipe'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const NewRecipePage = () => {
  return (
    <>
      <MetaTags title="new recipe" description="New recipe page" />
      <HeaderSlot.Plug id="new-recipe">
        <DefaultHeader title="new recipe" />
      </HeaderSlot.Plug>
      <NewRecipe />
    </>
  )
}

export default NewRecipePage
