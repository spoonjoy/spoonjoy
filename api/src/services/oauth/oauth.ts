import { fetch } from '@whatwg-node/fetch'
import { MutationResolvers, QueryResolvers } from 'types/graphql'

const getGoogleAuthUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: `${process.env.FE_URL}/auth?provider=google`,
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  }

  const queryString = new URLSearchParams(options).toString()

  return `${rootUrl}?${queryString}`
}

interface TokenResponse {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token: string
  scope: string
  token_type: string
}

const getGoogleTokens = async (code: string): Promise<TokenResponse> => {
  const url = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirect_uri: `${process.env.FE_URL}/auth?provider=google`,
    grant_type: 'authorization_code',
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },

    body: new URLSearchParams(values).toString(),
  }).then((res) => res.json())

  if (response.access_token) {
    return response as TokenResponse
  } else {
    throw new Error(
      `Unable to get Google tokens, got: ${JSON.stringify(response)}`
    )
  }
}

interface GoogleUserInfo {
  email: string
  family_name: string
  given_name: string
  id: string
  locale: string
  name: string
  picture: string
  verified_email: boolean
}

const getGoogleUserInfo = async (code: string): Promise<GoogleUserInfo> => {
  const { id_token, access_token } = await getGoogleTokens(code)

  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    }
  ).then((res) => res.json())

  if (response.id) {
    return response as GoogleUserInfo
  } else {
    throw new Error(
      `Unable to get Google user info, got: ${JSON.stringify(response)}`
    )
  }

  return response
}

export const getAuthUrl: QueryResolvers['getAuthUrl'] = ({ provider }) => {
  switch (provider) {
    case 'GOOGLE':
      return getGoogleAuthUrl()
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

export const linkAccount: MutationResolvers['linkAccount'] = async ({
  provider,
  code,
}) => {
  console.log('linkAccount', provider, code)
  switch (provider) {
    case 'GOOGLE':
      await getGoogleUserInfo(code)
      return 'replace me'
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
