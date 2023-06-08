import { Link, routes, useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useLinkGoogleAccountMutation } from 'src/components/Auth/useOAuthQueries'

const AuthPage = () => {
  const [initialLoad, setInitialLoad] = React.useState(true)
  const { code } = useParams()
  const { linkAccount } = useLinkGoogleAccountMutation()
  if (code && initialLoad) {
    linkAccount({ variables: { code } })
    setInitialLoad(false)
  }
  return (
    <>
      <MetaTags title="Auth" description="Auth page" />

      <h1>AuthPage</h1>
      <p>
        Find me in <code>./web/src/pages/AuthPage/AuthPage.tsx</code>
      </p>
      <p>
        My default route is named <code>auth</code>, link to me with `
        <Link to={routes.auth()}>Auth</Link>`
      </p>
    </>
  )
}

export default AuthPage
