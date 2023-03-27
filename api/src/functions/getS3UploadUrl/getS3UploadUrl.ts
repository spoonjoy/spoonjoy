import type { APIGatewayEvent, Context } from 'aws-lambda'

import { authDecoder } from '@redwoodjs/auth-dbauth-api'
import { useRequireAuth } from '@redwoodjs/graphql-server'

import { getCurrentUser, isAuthenticated } from 'src/lib/auth'
import { logger } from 'src/lib/logger'
import { getSignedUploadUrl } from 'src/lib/s3'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
const getS3UploadUrlHandler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  logger.info(`${event.httpMethod} ${event.path}: getS3UploadUrl function`)

  if (isAuthenticated()) {
    const filename = event.queryStringParameters?.filename

    if (!filename) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing filename',
        }),
      }
    }

    const fileKey = `uploads/${filename}`

    const signedUrl = await getSignedUploadUrl(fileKey)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          signedUrl,
          fileKey,
        },
      }),
    }
  } else {
    logger.error('Access to getS3UploadUrlHandler denied')
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'You must be logged in',
      }),
    }
  }
}

// tell vercel to use this as an edge function - https://vercel.com/docs/concepts/functions/edge-functions/quickstart
export default {
  runtime: 'edge',
}

export const handler = useRequireAuth({
  handlerFn: getS3UploadUrlHandler,
  getCurrentUser,
  authDecoder,
})
