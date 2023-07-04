import {
  createOAuthClient,
  createOAuth,
} from '@spoonjoy/redwoodjs-dbauth-oauth-web'

import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbauth-web'
import WebAuthnClient from '@redwoodjs/auth-dbauth-web/webAuthn'
import { toast } from '@redwoodjs/web/toast'

const dbAuthClient = createDbAuthClient({
  webAuthn: new WebAuthnClient(),
  fetchConfig: { credentials: 'include' },
})

const oAuthClient = createOAuthClient({
  enabledProviders: ['apple', 'google'],
})

export const { AuthProvider, useAuth } = createAuth(dbAuthClient)
export const { OAuthProvider, useOAuth } = createOAuth(oAuthClient, (error) => {
  toast.error(error)
})
