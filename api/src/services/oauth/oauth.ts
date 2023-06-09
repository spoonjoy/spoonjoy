import { fetch } from '@whatwg-node/fetch'
import jwt from 'jsonwebtoken'
import {
  MutationResolvers,
  OAuthRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { requireChangeUserInfoAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { user } from '../users/users'

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

// based on https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens
const GetAppleAuthClientSecret = () => {
  const timeInSeconds = new Date().getTime() / 1000
  const token = jwt.sign(
    {
      iss: process.env.APPLE_TEAM_ID || '',
      iat: timeInSeconds,
      exp: timeInSeconds + 86400, // 1 day
      aud: 'https://appleid.apple.com',
      sub: process.env.APPLE_CLIENT_ID || '',
    },
    process.env.APPLE_PRIVATE_KEY || '',
    {
      algorithm: 'ES256',
      keyid: process.env.APPLE_KEY_ID || '',
    }
  )
  return token
}

// based on https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/incorporating_sign_in_with_apple_into_other_platforms#3332113
const AppleAuthUrl = () => {
  const rootUrl = 'https://appleid.apple.com/auth/authorize'
  const options = {
    redirect_uri: `${process.env.FE_URL}/auth?provider=apple`,
    client_id: process.env.APPLE_CLIENT_ID || '',
    response_type: 'code',
    response_mode: 'query',
    // response_mode: 'form_post',
    // scope: 'name email',
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

const linkGoogleAccount = async (code: string) => {
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
      return await db.oAuth.create({
        data: {
          provider: 'GOOGLE',
          providerUserId: googleUserInfo.id,
          userId: maybeExistingUser.id,
        },
      })
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

      return await db.oAuth.create({
        data: {
          provider: 'GOOGLE',
          providerUserId: googleUserInfo.id,
          userId: newUser.id,
        },
      })
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
      return await db.oAuth.create({
        data: {
          provider: 'GOOGLE',
          providerUserId: googleUserInfo.id,
          userId: currentUser.id,
        },
      })
    }
  }
}

export const getAuthUrl: QueryResolvers['getAuthUrl'] = ({ provider }) => {
  switch (provider) {
    case 'GOOGLE':
      return getGoogleAuthUrl()
    case 'APPLE':
      return AppleAuthUrl()
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

export const unlinkAccount: MutationResolvers['unlinkAccount'] = ({
  provider,
}) => {
  requireChangeUserInfoAuth(context.currentUser?.id || '')

  return db.oAuth.delete({
    where: {
      userId_provider: {
        userId: context.currentUser!.id,
        provider,
      },
    },
  })
}

export const OAuth: OAuthRelationResolvers = {
  user: async (_obj, { root }) => {
    const maybeUser = await user({ id: root.userId })

    if (!maybeUser) {
      throw new Error('Could not resolve user')
    }

    return maybeUser
  },
}
