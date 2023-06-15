import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbauth-web'
import OAuthClient from '@redwoodjs/auth-dbauth-web/dist/oAuth'
import WebAuthnClient from '@redwoodjs/auth-dbauth-web/webAuthn'

const dbAuthClient = createDbAuthClient({
  webAuthn: new WebAuthnClient(),
  oAuth: new OAuthClient(),
  fetchConfig: { credentials: 'include' },
})

export const { AuthProvider, useAuth } = createAuth(dbAuthClient)
