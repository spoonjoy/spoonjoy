import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const UserSettingsPage = () => {
  return (
    <>
      <MetaTags title="settings" description="Settings page" />
      <HeaderSlot.Plug id="settings">
        <DefaultHeader title="settings" />
      </HeaderSlot.Plug>
    </>
  )
}

export default UserSettingsPage
