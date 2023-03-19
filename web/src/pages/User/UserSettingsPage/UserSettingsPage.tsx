import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const UserSettingsPage = () => {
  return (
    <>
      <MetaTags title="UserSettings" description="UserSettings page" />

      <h1>UserSettingsPage</h1>
      <p>
        Find me in <code>./web/src/pages/UserSettingsPage/UserSettingsPage.tsx</code>
      </p>
      <p>
        My default route is named <code>userSettings</code>, link to me with `
        <Link to={routes.userSettings()}>UserSettings</Link>`
      </p>
    </>
  )
}

export default UserSettingsPage
