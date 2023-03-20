import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import { DefaultHeader, HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const UserSettingsPage = () => {
  const { logOut } = useAuth()
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
        <button
          className="btn-error"
          onClick={() => {
            logOut()
              .then(() => {
                navigate(routes.welcome())
                toast.success('you have been signed out')
              })
              .catch(() => {
                toast.error('there was a problem with signing you out')
              })
          }}
        >
          sign out from spoonjoy
        </button>
      </div>
    </>
  )
}

export default UserSettingsPage
