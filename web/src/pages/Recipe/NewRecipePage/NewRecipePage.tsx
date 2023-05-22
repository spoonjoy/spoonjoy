import { MetaTags } from '@redwoodjs/web'

import NewRecipe from 'src/components/Recipe/NewRecipe'
import { SimpleHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const NewRecipePage = () => {
  return (
    <>
      <MetaTags title="new recipe" description="Add a new recipe" />
      <HeaderSlot.Plug id="new-recipe">
        <SimpleHeader title="new recipe" />
      </HeaderSlot.Plug>
      <NewRecipe />
    </>
  )
}

export default NewRecipePage
