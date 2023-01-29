import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'

import CookbooksCell from 'src/components/Cookbook/CookbooksCell'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

const MyCookbooksPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags title="My Cookbooks" description="My cookbooks page" />
      <HeaderSlot.Plug id="cookbooks">
        <DefaultHeader title="My Cookbooks" />
      </HeaderSlot.Plug>
      {/* Because this route is wrapped in Private (in Routes.tsx), currentUser shouldn't ever be null */}
      <CookbooksCell username={currentUser!.username} />
    </>
  )
}

export default MyCookbooksPage
