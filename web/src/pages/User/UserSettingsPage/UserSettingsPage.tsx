import { MetaTags } from '@redwoodjs/web'

import ChangePasswordForm from 'src/components/User/UserSettings/ChangePasswordForm'
import LogOutBtn from 'src/components/User/UserSettings/LogOutBtn'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const UserSettingsPage = () => {
  return (
    <>
      <MetaTags title="settings" description="Settings page" />
      <HeaderSlot.Plug id="settings">
        <DefaultHeader title="settings" />
      </HeaderSlot.Plug>
      <div className="mx-auto text-center">
        <ChangePasswordForm />
        <LogOutBtn />
      </div>
    </>
  )
}

export default UserSettingsPage
