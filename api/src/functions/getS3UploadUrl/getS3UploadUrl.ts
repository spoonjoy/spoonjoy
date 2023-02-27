import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'

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
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: getS3UploadUrl function`)

  const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
  })

  const filename = event.queryStringParameters?.filename

  if (!filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing filename',
      }),
    }
  }

  const bucketParams = {
    Bucket: 'sj-misc',
    Key: `uploads/${encodeURI(filename)}`,
  }

  // Create a command to put the object in the S3 bucket.
  const command = new PutObjectCommand(bucketParams)

  // Create a presigned URL for the command.
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  })

  const fileUrl = `https://sj-misc.s3.amazonaws.com/uploads/${encodeURI(
    filename
  )}`

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        signedUrl,
        fileUrl,
      },
    }),
  }
}
