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

const GetConnectedOAuthAccounts = async () => {
  const currentUser = context.currentUser
  await db.oAuth.findMany({
    where: { userId: currentUser!.id },
  })
}
