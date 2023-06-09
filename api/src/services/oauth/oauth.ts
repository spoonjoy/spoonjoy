import { fetch } from '@whatwg-node/fetch'
import { MutationResolvers, QueryResolvers, User } from 'types/graphql'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { db } from 'src/lib/db'

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
}

const linkGoogleAccount = async (code: string): Promise<Partial<User>> => {
  const googleUserInfo = await getGoogleUserInfo(code)
  const { currentUser } = context

  // check if there is already a user with this email.
  const maybeExistingUser = await db.user.findUnique({
    where: { email: googleUserInfo.email },
  })

  // if NOT logged in:
  if (!currentUser) {
    // if there's already a user with this email, link to that user.
    if (maybeExistingUser) {
      await db.oAuth
        .create({
          data: {
            provider: 'GOOGLE',
            providerUserId: googleUserInfo.id,
            userId: maybeExistingUser.id,
          },
        })
        .user()
    }
    // if there isn't, create a new user and link to that user.
    else {
      const generatedPass = new Crypto()
        .getRandomValues(new Uint8Array(32))
        .toString()
      const [hashedPassword, salt] = hashPassword(generatedPass)
      const newUser = await db.user.create({
        data: {
          email: googleUserInfo.email,
          username: googleUserInfo.name,
          hashedPassword,
          salt,
        },
      })

      return await db.oAuth
        .create({
          data: {
            provider: 'GOOGLE',
            providerUserId: googleUserInfo.id,
            userId: newUser.id,
          },
        })
        .user()
    }
  }

  // if logged in:
  else {
    // if there's already a user with this email, check if it's the same as the user that's logged in - if it's not, throw an error that there's already an account using this email.
    if (maybeExistingUser && maybeExistingUser.email !== currentUser.email) {
      throw new Error('There is already an account using this email.')
    }
    // otherwise, link it to the current account.
    else {
      return await db.oAuth
        .create({
          data: {
            provider: 'GOOGLE',
            providerUserId: googleUserInfo.id,
            userId: currentUser.id,
          },
        })
        .user()
    }
  }
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
      return await linkGoogleAccount(code)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
