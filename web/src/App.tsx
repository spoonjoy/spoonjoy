import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import { Toaster } from '@redwoodjs/web/toast'

import '@spoonjoy/redwoodjs-dbauth-oauth-web/dist/style.css'
import { AuthProvider, useAuth, OAuthProvider } from 'src/auth'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'

import { store, StoreProvider } from 'src/stores/RootStore'

import FatalErrorPage from './pages/FatalErrorPage/FatalErrorPage'

const App = () => {
  return (
    <>
      <FatalErrorBoundary page={FatalErrorPage}>
        <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
          <AuthProvider>
            <OAuthProvider>
              <RedwoodApolloProvider
                useAuth={useAuth}
                graphQLClientConfig={{
                  httpLinkConfig: { credentials: 'include' },
                }}
              >
                <StoreProvider value={store}>
                  <div>
                    <Toaster
                      containerStyle={{
                        top: 'max(1rem, env(safe-area-inset-top))',
                        position: 'fixed',
                        zIndex: 9999,
                      }}
                      toastOptions={{
                        className: 'rw-toast',
                        duration: 6000,
                      }}
                    />
                    <div className="top-safe-cover bg-white" />
                  </div>
                  <Routes />
                </StoreProvider>
              </RedwoodApolloProvider>
            </OAuthProvider>
          </AuthProvider>
        </RedwoodProvider>
      </FatalErrorBoundary>
    </>
  )
}

export default App
