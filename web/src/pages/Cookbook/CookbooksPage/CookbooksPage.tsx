import { MetaTags } from '@redwoodjs/web'

import CookbooksCell from 'src/components/Cookbook/CookbooksCell'
import { HeaderSlot, SimpleHeader } from 'src/layouts/SiteLayout/SiteLayout'

interface ICookbooksPageProps {
  username: string
}

const CookbooksPage = ({ username }: ICookbooksPageProps) => {
  return (
    <>
      <MetaTags
        title={`${username}'s cookbooks`}
        description={`${username}'s cookbooks page`}
      />
      <HeaderSlot.Plug id="cookbooks">
        <SimpleHeader title={`${username}'s cookbooks`} />
      </HeaderSlot.Plug>
      <CookbooksCell username={username} />
    </>
  )
}

export default CookbooksPage
