import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useLinkGoogleAccountMutation } from 'src/components/Auth/OAuthHelpers'

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
      <MetaTags title="link account" description="page for linking account" />
      <div>linking your account...</div>
    </>
  )
}

export default AuthPage
