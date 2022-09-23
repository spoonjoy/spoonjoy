import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <HeaderSlot.Plug id="home">HomePage</HeaderSlot.Plug>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
      </p>
      <p>
        My default route is named <code>home</code>, link to me with `
        <Link to={routes.home()}>Home</Link>`
      </p>
    </>
  )
}

export default HomePage
