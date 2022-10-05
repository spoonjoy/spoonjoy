import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const WelcomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <HeaderSlot.Plug id="home">WelcomePage</HeaderSlot.Plug>
      <p>
        Find me in <code>./web/src/pages/WelcomePage/WelcomePage.tsx</code>
      </p>
      <p>
        My default route is named <code>welcome</code>, link to me with `
        <Link to={routes.welcome()}>Home</Link>`
      </p>
    </>
  )
}

export default WelcomePage
