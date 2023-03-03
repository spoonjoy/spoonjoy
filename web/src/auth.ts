import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbauth-web'
import WebAuthnClient from '@redwoodjs/auth-dbauth-web/webAuthn'

const dbAuthClient = createDbAuthClient({
  webAuthn: new WebAuthnClient(),
  fetchConfig: { credentials: 'include' },
})

export const { AuthProvider, useAuth } = createAuth(dbAuthClient)
