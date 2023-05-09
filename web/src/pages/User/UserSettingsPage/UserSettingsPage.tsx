import { MetaTags } from '@redwoodjs/web'

import LogOutBtn from 'src/components/User/UserSettings/LogOutBtn'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const UserSettingsPage = () => {
  return (
    <>
      <MetaTags title="settings" description="Settings page" />
      <HeaderSlot.Plug id="settings">
        <DefaultHeader title="settings" />
      </HeaderSlot.Plug>
      <div className="mt-20 mb-72 w-full text-center sm:mb-10">
        more coming soon...
      </div>
      <div className="mx-auto text-center">
        <LogOutBtn />
      </div>
    </>
  )
}

export default UserSettingsPage
