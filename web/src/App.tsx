import { AuthProvider } from '@redwoodjs/auth'
import WebAuthnClient from '@redwoodjs/auth/webAuthn'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'
import { RootStore, StoreProvider } from 'src/stores/RootStore'

const App = () => {
  return (
    <FatalErrorBoundary page={FatalErrorPage}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <AuthProvider type="dbAuth" client={WebAuthnClient}>
          <RedwoodApolloProvider>
            <StoreProvider value={RootStore}>
              <Routes />
            </StoreProvider>
          </RedwoodApolloProvider>
        </AuthProvider>
      </RedwoodProvider>
    </FatalErrorBoundary>
  )
}

export default App
