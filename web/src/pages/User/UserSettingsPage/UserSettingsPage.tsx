import { MetaTags } from '@redwoodjs/web'

import { ColumnLayoutFormSection } from 'src/components/formComponents/ColumnLayoutForm/ColumnLayoutFormSection'
import { ColumnLayoutFormWrapper } from 'src/components/formComponents/ColumnLayoutForm/ColumnLayoutFormWrapper'
import OAuthBtns from 'src/components/OAuth/OAuthBtns'
import ChangePasswordForm from 'src/components/User/UserSettings/ChangePasswordForm'
import LogOutBtn from 'src/components/User/UserSettings/LogOutBtn'
import { SimpleHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const UserSettingsPage = () => {
  return (
    <>
      <MetaTags title="settings" description="Settings page" />
      <HeaderSlot.Plug id="settings">
        <SimpleHeader title="settings" />
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
        <ColumnLayoutFormWrapper>
          <ColumnLayoutFormSection
            sectionTitle="connect other auth providers"
            sectionDescription="connect other ways to log into Spoonjoy"
            withPadding
          >
            <OAuthBtns action="link" />
          </ColumnLayoutFormSection>
        </ColumnLayoutFormWrapper>
        <div className="mx-5 mt-20 text-center">
          more coming soon, if you need anything email us at{' '}
          <a
            href={`mailto:${encodeURI(
              'spoonjoy team<hi@spoonjoy.app>?subject=I want more settings!&body=(what do you need help with?)'
            )}`}
          >
            <span className="link group-hover:text-indigo-500">
              hi@spoonjoy.app
            </span>
          </a>
        </div>
        <div className="mx-auto mt-20 mb-10 text-center">
          <LogOutBtn />
        </div>
      </div>
    </>
  )
}

export default UserSettingsPage
