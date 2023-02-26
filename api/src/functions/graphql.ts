import { authDecoder } from '@redwoodjs/auth-dbauth-api'
import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const handler = createGraphQLHandler({
  getCurrentUser,
  authDecoder,
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  armorConfig: {
    maxDepth: { n: 10 },
    costLimit: {
      propagateOnRejection: false,
    },
    maxAliases: {
      propagateOnRejection: false,
    },
    maxDirectives: {
      propagateOnRejection: false,
    },
    maxTokens: {
      propagateOnRejection: false,
    },
  },
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
