import { MetaTags } from '@redwoodjs/web'

import CookbooksCell from 'src/components/Cookbook/CookbooksCell'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

interface ICookbooksPageProps {
  username: string
}

const CookbooksPage = ({ username }: ICookbooksPageProps) => {
  return (
    <>
      <MetaTags
        title={`${username}'s Cookbooks`}
        description={`${username}'s Cookbooks page`}
      />
      <HeaderSlot.Plug id="cookbooks">
        <DefaultHeader title={`${username}'s Cookbooks`} />
      </HeaderSlot.Plug>
      <CookbooksCell username={username} />
    </>
  )
}

export default CookbooksPage
