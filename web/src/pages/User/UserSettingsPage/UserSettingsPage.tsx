import { MetaTags } from '@redwoodjs/web'

import { ColumnLayoutFormSection } from 'src/components/formComponents/ColumnLayoutForm/ColumnLayoutFormSection'
import { ColumnLayoutFormWrapper } from 'src/components/formComponents/ColumnLayoutForm/ColumnLayoutFormWrapper'
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
      <div className="mx-auto">
        <ColumnLayoutFormWrapper>
          <ColumnLayoutFormSection
            sectionTitle="change password"
            sectionDescription="change the password you use to log into Spoonjoy"
            withPadding
          >
            <ChangePasswordForm />
          </ColumnLayoutFormSection>
        </ColumnLayoutFormWrapper>
        <div className="mx-auto mt-20 mb-10 text-center">
          <LogOutBtn />
        </div>
      </div>
    </>
  )
}

export default UserSettingsPage
