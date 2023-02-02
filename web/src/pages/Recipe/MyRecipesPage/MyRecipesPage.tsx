import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'

import RecipesCell from 'src/components/Recipe/RecipesCell'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const MyRecipesPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags title="Recipes" description="Recipes page" />
      <HeaderSlot.Plug id="recipes">
        <DefaultHeader title="My Recipes" />
      </HeaderSlot.Plug>
      {/* This page is in a protected route so currentUser should never be null */}
      <RecipesCell username={currentUser!.username} />
    </>
  )
}

export default MyRecipesPage
