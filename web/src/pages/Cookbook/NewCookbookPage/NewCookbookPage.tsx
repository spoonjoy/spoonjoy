import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const NewCookbookPage = () => {
  return (
    <>
      <MetaTags title="NewCookbook" description="NewCookbook page" />

      <h1>NewCookbookPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/NewCookbookPage/NewCookbookPage.tsx</code>
      </p>
      <p>
        My default route is named <code>newCookbook</code>, link to me with `
        <Link to={routes.newCookbook()}>NewCookbook</Link>`
      </p>
    </>
  )
}

export default NewCookbookPage
